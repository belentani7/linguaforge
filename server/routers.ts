import { TRPCError, initTRPC } from "@trpc/server";
import superjson from "superjson";
import { z } from "zod";
import {
  CURRICULUM_LESSONS,
  LANGUAGE_CATALOG,
  LEARNING_GOALS,
  type CurriculumLesson,
} from "../shared/institution";
import { LEARNING_PROJECTS } from "../shared/content";
import { computeStreakDays, computeXp, recommendLevel } from "./domain";
import type { LearningStore, UserRecord } from "./store";

/** Contexto de cada petición. `userId` se rellena solo con una sesión válida. */
export type TrpcContext = {
  store: LearningStore;
  userId: string | null;
  now: () => Date;
  newUserId: () => string;
  issueSession: (userId: string) => void;
  clearSession: () => void;
};

const t = initTRPC.context<TrpcContext>().create({ transformer: superjson });

export const publicProcedure = t.procedure;

const requireUser = t.middleware(async ({ ctx, next }) => {
  if (!ctx.userId)
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Necesitas una sesión para esta acción.",
    });
  const user = await ctx.store.getUser(ctx.userId);
  if (!user)
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "La sesión ya no es válida.",
    });
  return next({ ctx: { ...ctx, user } });
});

export const protectedProcedure = t.procedure.use(requireUser);

const languageCodes = new Set(LANGUAGE_CATALOG.map(language => language.code));
const goalIds = new Set(LEARNING_GOALS.map(goal => goal.id));
const lessonById = new Map<string, CurriculumLesson>(
  CURRICULUM_LESSONS.map(lesson => [lesson.id, lesson])
);
const projectIds = new Set(LEARNING_PROJECTS.map(project => project.id));

const languageCode = z
  .string()
  .min(2)
  .max(12)
  .refine(
    code => languageCodes.has(code),
    "Idioma no soportado en el catálogo."
  );
const skillScores = z
  .record(z.string().min(1).max(40), z.number().min(0).max(100))
  .refine(
    scores => Object.keys(scores).length <= 20,
    "Demasiadas competencias."
  );

const AUDIO_MIME_TYPES = [
  "audio/webm",
  "audio/ogg",
  "audio/mp4",
  "audio/wav",
  "audio/mpeg",
] as const;
/** Límite del audio decodificado (16 MiB) — el cliente ya lo limita a 16 MiB antes de codificar. */
const MAX_AUDIO_BASE64_CHARS = Math.ceil((16 * 1024 * 1024 * 4) / 3) + 8;

/** Resultado de transcripción. "ready" solo existirá cuando haya un proveedor de voz configurado y verificado. */
export type VoiceTranscription =
  | {
      status: "ready";
      transcript: string;
      comparison: string;
      language: string;
    }
  | { status: "unavailable"; reason: "no_speech_provider"; transcript: null };

const DEMONSTRATION_NOTE =
  "Respuesta de demostración: no hay un proveedor de IA configurado. Es orientación estructurada, no una evaluación lingüística.";

function tutorGuidance(
  task: "explain" | "practice" | "review",
  message: string
): string {
  const topic = message.trim().slice(0, 240);
  if (task === "practice") {
    return `Practiquemos con «${topic}». Escribe tu respuesta en una o dos frases, con un ejemplo real. Después revisaremos claridad, orden de ideas y una alternativa más precisa.`;
  }
  if (task === "review") {
    return `Para revisar «${topic}», comprueba: 1) el objetivo del texto está claro; 2) cada idea tiene un dato o ejemplo; 3) la petición o la conclusión aparece al final. Pega el texto y lo revisamos punto por punto.`;
  }
  return `Sobre «${topic}»: divídelo en tres partes: qué significa, cuándo se usa y un ejemplo breve. Si quieres, pide ahora una práctica con ese mismo tema.`;
}

export const appRouter = t.router({
  auth: t.router({
    me: publicProcedure.query(async ({ ctx }) => {
      if (!ctx.userId) return null;
      const user = await ctx.store.getUser(ctx.userId);
      return user
        ? { id: user.id, name: user.displayName, timeZone: user.timeZone }
        : null;
    }),
    /** Crea una sesión anónima local. No pide datos personales. */
    guest: publicProcedure.mutation(async ({ ctx }) => {
      const user: UserRecord = {
        id: ctx.newUserId(),
        displayName: "Estudiante",
        timeZone: "Europe/Madrid",
        createdAt: ctx.now().toISOString(),
      };
      await ctx.store.createUser(user);
      ctx.issueSession(user.id);
      return { id: user.id, name: user.displayName, timeZone: user.timeZone };
    }),
    logout: publicProcedure.mutation(({ ctx }) => {
      ctx.clearSession();
      return { success: true } as const;
    }),
  }),

  institution: t.router({
    lesson: publicProcedure
      .input(z.object({ id: z.string().min(1).max(80) }))
      .query(({ input }) => lessonById.get(input.id) ?? null),
    projects: publicProcedure.query(() => LEARNING_PROJECTS),
  }),

  profile: t.router({
    get: protectedProcedure.query(async ({ ctx }) => {
      const { store, user } = ctx;
      const profile = await store.getProfile(user.id);
      const completions = await store.listCompletions(user.id);
      const submissions = await store.listSubmissions(user.id);
      const diagnostic = await store.latestDiagnostic(user.id);

      const completedIds = new Set(completions.map(item => item.lessonId));
      const completedProjects = submissions.filter(
        item => item.status === "completed"
      ).length;
      const nextLesson =
        CURRICULUM_LESSONS.find(lesson => !completedIds.has(lesson.id)) ?? null;
      const streakDays = computeStreakDays(
        completions.map(item => new Date(item.completedAt)),
        user.timeZone,
        ctx.now()
      );

      return {
        name: user.displayName,
        timeZone: user.timeZone,
        nativeLanguageCode: profile?.nativeLanguageCode ?? "es",
        targetLanguageCode:
          profile?.targetLanguageCode ?? diagnostic?.targetLanguageCode ?? "en",
        learningGoal: profile?.learningGoal ?? diagnostic?.learningGoal ?? null,
        companionGoal: profile?.companionGoal ?? null,
        currentLevel: diagnostic?.recommendedLevel ?? "A1",
        lessonsCompleted: completions.length,
        completedLessonIds: [...Array.from(completedIds)],
        nextLesson,
        projectSubmissions: submissions,
        streakDays,
        xp: computeXp(completions.length, completedProjects),
      };
    }),
  }),

  diagnostic: t.router({
    complete: protectedProcedure
      .input(
        z.object({
          targetLanguageCode: languageCode,
          learningGoal: z
            .string()
            .refine(
              goal => goalIds.has(goal as never),
              "Objetivo no reconocido."
            ),
          scores: skillScores,
          competencies: skillScores.optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const outcome = recommendLevel(input.scores);
        if (!outcome.ok) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Se necesitan al menos ${outcome.required} competencias para orientar el nivel (recibidas: ${outcome.skillCount}).`,
          });
        }
        const { store, user } = ctx;
        const existing = await store.getProfile(user.id);
        await store.saveDiagnostic(
          {
            userId: user.id,
            nativeLanguageCode: existing?.nativeLanguageCode ?? "es",
            targetLanguageCode: input.targetLanguageCode,
            learningGoal: input.learningGoal,
            companionGoal: existing?.companionGoal ?? null,
          },
          {
            userId: user.id,
            targetLanguageCode: input.targetLanguageCode,
            learningGoal: input.learningGoal,
            recommendedLevel: outcome.level,
            averageScore: outcome.averageScore,
            skillCount: outcome.skillCount,
            scores: input.scores,
            createdAt: ctx.now().toISOString(),
          }
        );
        return {
          recommendedLevel: outcome.level,
          averageScore: outcome.averageScore,
          skillCount: outcome.skillCount,
          disclaimer:
            "Orientación interna, no una prueba oficial ni una certificación.",
        };
      }),
  }),

  learning: t.router({
    complete: protectedProcedure
      .input(
        z.object({
          lessonId: z.string().min(1).max(80),
          score: z.number().int().min(0).max(100),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (!lessonById.has(input.lessonId))
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Lección no encontrada.",
          });
        const { store, user } = ctx;
        const record = await store.recordCompletion(
          user.id,
          input.lessonId,
          input.score,
          ctx.now()
        );
        const total = (await store.listCompletions(user.id)).length;
        return {
          lessonId: record.lessonId,
          bestScore: record.bestScore,
          lessonsCompleted: total,
        };
      }),
  }),

  projects: t.router({
    mine: protectedProcedure.query(async ({ ctx }) => {
      const { store, user } = ctx;
      return store.listSubmissions(user.id);
    }),
    save: protectedProcedure
      .input(
        z.object({
          projectId: z
            .string()
            .refine(id => projectIds.has(id), "Proyecto no encontrado."),
          artifact: z.string().max(5000),
          reflection: z.string().max(3000),
          status: z.enum(["draft", "completed"]),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { store, user } = ctx;
        return store.upsertSubmission({
          userId: user.id,
          ...input,
          updatedAt: ctx.now().toISOString(),
        });
      }),
  }),

  tutor: t.router({
    respond: publicProcedure
      .input(
        z.object({
          message: z.string().min(1).max(2000),
          task: z.enum(["explain", "practice", "review"]),
        })
      )
      .mutation(({ input }) => ({
        answer: `${tutorGuidance(input.task, input.message)}\n\n${DEMONSTRATION_NOTE}`,
        mode: "demonstration-fallback" as const,
      })),
  }),

  voice: t.router({
    /**
     * Sin proveedor de voz configurado no hay transcripción real. Se responde de forma explícita:
     * nunca se devuelve un texto inventado.
     */
    transcribe: protectedProcedure
      .input(
        z.object({
          lessonId: z.string().min(1).max(80),
          mimeType: z.enum(AUDIO_MIME_TYPES),
          base64Audio: z.string().min(1).max(MAX_AUDIO_BASE64_CHARS),
        })
      )
      .mutation(({ input }): VoiceTranscription => {
        if (!lessonById.has(input.lessonId))
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Lección no encontrada.",
          });
        return {
          status: "unavailable",
          reason: "no_speech_provider",
          transcript: null,
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
