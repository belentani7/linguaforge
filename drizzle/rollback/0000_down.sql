-- Rollback de drizzle/migrations/0000_*.sql (desarrollo únicamente).
-- Revierte el esquema completo en orden inverso de dependencias (hijos antes que padres)
-- y elimina el registro de migraciones, para que un `db:migrate` posterior vuelva a aplicar 0000.
-- Ejecutar sólo con `pnpm db:rollback -- --confirm` contra una base de desarrollo o prueba.
DROP TABLE IF EXISTS `project_submissions`;
--> statement-breakpoint
DROP TABLE IF EXISTS `lesson_completions`;
--> statement-breakpoint
DROP TABLE IF EXISTS `diagnostics`;
--> statement-breakpoint
DROP TABLE IF EXISTS `learner_profiles`;
--> statement-breakpoint
DROP TABLE IF EXISTS `users`;
--> statement-breakpoint
DROP TABLE IF EXISTS `__drizzle_migrations`;
