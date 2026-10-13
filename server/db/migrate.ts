import path from "node:path";
import { fileURLToPath } from "node:url";
import { migrate } from "drizzle-orm/mysql2/migrator";
import { createDb } from "./client";

export const MIGRATIONS_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../drizzle/migrations"
);

/** Aplica las migraciones versionadas pendientes (tabla __drizzle_migrations). Idempotente. */
export async function runMigrations(url?: string) {
  const { db, pool, target } = createDb(url);
  try {
    await migrate(db, { migrationsFolder: MIGRATIONS_DIR });
    return target.database;
  } finally {
    await pool.end();
  }
}

if (
  process.argv[1] &&
  fileURLToPath(import.meta.url) === path.resolve(process.argv[1])
) {
  runMigrations()
    .then(name =>
      console.log(
        `[db:migrate] migraciones aplicadas en "${name}" (desarrollo).`
      )
    )
    .catch(error => {
      console.error(
        `[db:migrate] ${error instanceof Error ? error.message : error}`
      );
      process.exit(1);
    });
}
