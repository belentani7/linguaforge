import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { getDueSrsCards, getLanguageCatalog, getLanguagePaths, getProgressSummary, getRandomExercises, recordDiagnosticAttempt, recordLessonProgress, reviewSrsCard, upsertUser } from "./db";
import { LANGUAGE_CATALOG, CEFR_LEVELS, buildBidirectionalPaths } from "../shared/languages";

const languageCode = z.string().min(2).max(8);
const skillScores = z.object({ vocabulary: z.number().min(0).max(100), grammar: z.number().min(0).max(100), comprehension: z.number().min(0).max(100), communication: z.number().min(0).max(100) });
const cefrCode = z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]);

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
      return rows.length ? rows : buildBidirectionalPaths().filter((path) => (!input?.sourceCode || path.sourceLanguage === input.sourceCode) && (!input?.targetCode || path.targetLanguage === input.targetCode)).map((path) => ({ id: 0, sourceCode: path.sourceLanguage, sourceName: path.sourceLanguage, targetCode: path.targetLanguage, targetName: path.targetLanguage, entryCount: 0 }));
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
    complete: protectedProcedure.input(z.object({ targetLanguageCode: languageCode, scores: skillScores })).mutation(async ({ ctx, input }) => {
      const average = Object.values(input.scores).reduce((sum, score) => sum + score, 0) / 4;
      const recommendedLevel = average >= 85 ? "C1" : average >= 70 ? "B2" : average >= 55 ? "B1" : average >= 40 ? "A2" : "A1";
      await recordDiagnosticAttempt(ctx.user.id, input.targetLanguageCode, recommendedLevel, input.scores);
      return { targetLanguageCode: input.targetLanguageCode, recommendedLevel, scores: input.scores };
    }),
  }),
  practice: router({
    random: protectedProcedure.input(z.object({ targetLanguageCode: languageCode, level: cefrCode, limit: z.number().int().min(1).max(20).default(10) })).query(({ ctx, input }) => getRandomExercises(ctx.user.id, input.targetLanguageCode, input.level, input.limit)),
  }),
  progress: router({
    summary: protectedProcedure.input(z.object({ targetLanguageCode: languageCode })).query(({ ctx, input }) => getProgressSummary(ctx.user.id, input.targetLanguageCode)),
    recordLesson: protectedProcedure.input(z.object({ lessonId: z.number().int().positive(), targetLanguageCode: languageCode, score: z.number().min(0).max(100), xp: z.number().int().min(0) })).mutation(async ({ ctx, input }) => { await recordLessonProgress(ctx.user.id, input.lessonId, input.score, input.xp, input.targetLanguageCode); return { success: true, ...input }; }),
  }),
  srs: router({
    queue: protectedProcedure.input(z.object({ targetLanguageCode: languageCode, limit: z.number().int().min(1).max(50).default(24) })).query(async ({ ctx, input }) => { const cards = await getDueSrsCards(ctx.user.id, input.targetLanguageCode, input.limit); return { targetLanguageCode: input.targetLanguageCode, dueCount: cards.length, cards }; }),
    review: protectedProcedure.input(z.object({ cardId: z.number().int().positive(), rating: z.enum(["again", "hard", "good", "easy"]) })).mutation(async ({ ctx, input }) => { await reviewSrsCard(ctx.user.id, input.cardId, input.rating); return { success: true, nextRating: input.rating }; }),
  }),
});

export type AppRouter = typeof appRouter;
