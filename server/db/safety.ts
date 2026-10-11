/**
 * Guarda de seguridad para MySQL/MariaDB.
 *
 * Autorización vigente: SOLO instancias de desarrollo aisladas. Esta función rechaza
 * cualquier objetivo que no cumpla TODAS estas condiciones:
 *  - NODE_ENV distinto de "production" (producción nunca usa este almacén);
 *  - host de bucle local (127.0.0.1, localhost, ::1);
 *  - nombre de base de datos con prefijo y sufijo de desarrollo o prueba.
 * Es una lógica pura y sin efectos, para poder probarla sin conectar a ninguna base.
 */

export const ALLOWED_DB_NAME = /^linguaforge_(dev|test)$/;
const LOCAL_HOSTS = new Set(["127.0.0.1", "localhost", "::1"]);

export type DbTarget = {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
};

export function parseDatabaseUrl(raw: string): DbTarget {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new Error("DATABASE_URL no es una URL válida.");
  }
  if (url.protocol !== "mysql:") {
    throw new Error("DATABASE_URL debe usar el esquema mysql://.");
  }
  return {
    host: url.hostname,
    port: Number(url.port || 3306),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.replace(/^\//, ""),
  };
}

export function assertDevelopmentTarget(
  target: DbTarget,
  env: Record<string, string | undefined> = process.env
): void {
  if (env.NODE_ENV === "production") {
    throw new Error(
      "Bloqueado: MySQL no está autorizado en NODE_ENV=production."
    );
  }
  if (!LOCAL_HOSTS.has(target.host)) {
    throw new Error(
      `Bloqueado: el host "${target.host}" no es local. Sólo se permite una instancia de desarrollo en este equipo.`
    );
  }
  if (!ALLOWED_DB_NAME.test(target.database)) {
    throw new Error(
      `Bloqueado: la base "${target.database}" no es de desarrollo o prueba (se esperaba linguaforge_dev o linguaforge_test).`
    );
  }
}

/** Atajo: valida una URL completa y devuelve el destino ya aprobado. */
export function requireDevelopmentDatabaseUrl(
  raw: string | undefined,
  env: Record<string, string | undefined> = process.env
): DbTarget {
  if (!raw)
    throw new Error(
      "Falta DATABASE_URL (mysql://usuario:clave@127.0.0.1:3306/linguaforge_dev)."
    );
  const target = parseDatabaseUrl(raw);
  assertDevelopmentTarget(target, env);
  return target;
}
