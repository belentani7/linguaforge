import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { getLanguageCatalog, getLanguagePaths, upsertUser } from "./db";
import { LANGUAGE_CATALOG, CEFR_LEVELS, buildBidirectionalPaths } from "../shared/languages";

const languageCode = z.string().min(2).max(8);
const skillScores = z.object({ vocabulary: z.number().min(0).max(100), grammar: z.number().min(0).max(100), comprehension: z.number().min(0).max(100), communication: z.number().min(0).max(100) });

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  languages: router({
    list: publicProcedure.query(async () => {
      const rows = await getLanguageCatalog();
      return rows.length ? rows : LANGUAGE_CATALOG;
    }),
    paths: publicProcedure.input(z.object({ sourceCode: languageCode.optional(), targetCode: languageCode.optional() }).optional()).query(async ({ input }) => {
      const rows = await getLanguagePaths(input?.sourceCode, input?.targetCode);
      return rows.length ? rows : buildBidirectionalPaths().filter((path) => (!input?.sourceCode || path.sourceLanguage === input.sourceCode) && (!input?.targetCode || path.targetLanguage === input.targetCode));
    }),
    levels: publicProcedure.query(() => CEFR_LEVELS),
  }),
  profile: router({
    get: protectedProcedure.query(({ ctx }) => ctx.user),
    update: protectedProcedure.input(z.object({ name: z.string().trim().min(1).max(120).optional(), nativeLanguageCode: languageCode.optional() })).mutation(async ({ ctx, input }) => {
      await upsertUser({ openId: ctx.user.openId, name: input.name, nativeLanguageCode: input.nativeLanguageCode });
      return { success: true } as const;
    }),
  }),
  diagnostic: router({
    start: protectedProcedure.input(z.object({ targetLanguageCode: languageCode })).mutation(({ input }) => ({ targetLanguageCode: input.targetLanguageCode, totalQuestions: 8, estimatedMinutes: 4 })),
    complete: protectedProcedure.input(z.object({ targetLanguageCode: languageCode, scores: skillScores })).mutation(({ input }) => {
      const average = Object.values(input.scores).reduce((sum, score) => sum + score, 0) / 4;
      const recommendedLevel = average >= 85 ? "C1" : average >= 70 ? "B2" : average >= 55 ? "B1" : average >= 40 ? "A2" : "A1";
      return { targetLanguageCode: input.targetLanguageCode, recommendedLevel, scores: input.scores };
    }),
  }),
  progress: router({
    summary: protectedProcedure.input(z.object({ targetLanguageCode: languageCode })).query(({ input }) => ({ targetLanguageCode: input.targetLanguageCode, streakDays: 7, xp: 1240, lessonsCompleted: 18, currentLevel: "B1" as const })),
    recordLesson: protectedProcedure.input(z.object({ lessonId: z.number().int().positive(), score: z.number().min(0).max(100), xp: z.number().int().min(0) })).mutation(({ input }) => ({ success: true, ...input })),
  }),
  srs: router({
    queue: protectedProcedure.input(z.object({ targetLanguageCode: languageCode, limit: z.number().int().min(1).max(50).default(24) })).query(({ input }) => ({ targetLanguageCode: input.targetLanguageCode, dueCount: input.limit, cards: [] as Array<{ id: number; prompt: string; answer: string }> })),
    review: protectedProcedure.input(z.object({ cardId: z.number().int().positive(), rating: z.enum(["again", "hard", "good", "easy"]) })).mutation(({ input }) => ({ success: true, nextRating: input.rating })),
  }),
});

export type AppRouter = typeof appRouter;
