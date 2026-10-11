import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createDb } from "./client";

export const ROLLBACK_SQL = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../drizzle/rollback/0000_down.sql"
);

/** Revierte el esquema de desarrollo. Exige confirmación explícita para evitar ejecuciones accidentales. */
export async function runRollback(
  url?: string,
  options: { confirm?: boolean } = {}
) {
  if (!options.confirm)
    throw new Error(
      "Rollback no ejecutado: pasa --confirm (destruye datos de desarrollo)."
    );
  const sql = fs.readFileSync(ROLLBACK_SQL, "utf8");
  const statements = sql
    .split("--> statement-breakpoint")
    .map(part => part.replace(/^--.*$/gm, "").trim())
    .filter(Boolean);
  const { pool, target } = createDb(url, { multipleStatements: false });
  try {
    for (const statement of statements) await pool.query(statement);
    return { database: target.database, statements: statements.length };
  } finally {
    await pool.end();
  }
}

if (
  process.argv[1] &&
  fileURLToPath(import.meta.url) === path.resolve(process.argv[1])
) {
  runRollback(undefined, { confirm: process.argv.includes("--confirm") })
    .then(result =>
      console.log(
        `[db:rollback] "${result.database}": ${result.statements} sentencias aplicadas.`
      )
    )
    .catch(error => {
      console.error(
        `[db:rollback] ${error instanceof Error ? error.message : error}`
      );
      process.exit(1);
    });
}
