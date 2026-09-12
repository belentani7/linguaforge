import { router } from './_core/trpc';
import { systemRouter } from './_core/systemRouter';

export const appRouter = router({
  system: systemRouter,
});

export type AppRouter = typeof appRouter;
