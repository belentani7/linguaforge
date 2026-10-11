import { defineConfig } from "drizzle-kit";

// Generación de migraciones: `pnpm db:generate`. Aplicar migraciones contra una base real
// requiere autorización explícita (ver docs/ y el informe de la auditoría).
export default defineConfig({
  schema: "./drizzle/schema.ts",
  out: "./drizzle/migrations",
  dialect: "mysql",
});
