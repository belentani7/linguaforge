import mysql from "mysql2/promise";
import { drizzle, type MySql2Database } from "drizzle-orm/mysql2";
import * as schema from "../../drizzle/schema";
import { requireDevelopmentDatabaseUrl } from "./safety";

export type Db = MySql2Database<typeof schema>;

/**
 * Crea un pool de conexiones tras validar el destino con la guarda de desarrollo.
 * `multipleStatements` sólo se activa para el script de rollback, que lo solicita explícitamente.
 */
export function createDb(
  url: string | undefined = process.env.DATABASE_URL,
  options: { multipleStatements?: boolean } = {}
) {
  const target = requireDevelopmentDatabaseUrl(url);
  const pool = mysql.createPool({
    host: target.host,
    port: target.port,
    user: target.user,
    password: target.password,
    database: target.database,
    connectionLimit: 5,
    timezone: "Z",
    dateStrings: false,
    multipleStatements: options.multipleStatements ?? false,
  });
  const db = drizzle(pool, { schema, mode: "default" }) as unknown as Db;
  return { db, pool, target };
}
