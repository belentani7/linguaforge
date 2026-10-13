import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

/**
 * Sesión local anónima: cookie HttpOnly con `<userId>.<expMs>.<firma HMAC-SHA256>`.
 * No almacena datos personales. No depende de ningún proveedor de identidad externo.
 */

export const SESSION_COOKIE = "lf_session";
export const SESSION_TTL_MS = 365 * 24 * 60 * 60 * 1000;

export type SessionSigner = {
  issue(userId: string, now: number): string;
  verify(token: string | undefined, now: number): string | null;
};

export function createSessionSigner(secret: string): SessionSigner {
  if (secret.length < 32)
    throw new Error("SESSION_SECRET debe tener al menos 32 caracteres.");
  const sign = (payload: string) =>
    createHmac("sha256", secret).update(payload).digest("base64url");
  return {
    issue(userId, now) {
      const payload = `${userId}.${now + SESSION_TTL_MS}`;
      return `${payload}.${sign(payload)}`;
    },
    verify(token, now) {
      if (!token) return null;
      const parts = token.split(".");
      if (parts.length !== 3) return null;
      const [userId, expRaw, signature] = parts;
      const expected = Buffer.from(sign(`${userId}.${expRaw}`));
      const received = Buffer.from(signature);
      if (
        expected.length !== received.length ||
        !timingSafeEqual(expected, received)
      )
        return null;
      const exp = Number(expRaw);
      if (!Number.isFinite(exp) || exp <= now) return null;
      return userId;
    },
  };
}

/** En desarrollo se genera un secreto efímero (las sesiones caducan al reiniciar). En producción es obligatorio. */
export function resolveSessionSecret(
  env: NodeJS.ProcessEnv,
  isProduction: boolean
): string {
  if (env.SESSION_SECRET) return env.SESSION_SECRET;
  if (isProduction)
    throw new Error("SESSION_SECRET es obligatorio en producción.");
  return randomBytes(32).toString("base64url");
}

export function newUserId(): string {
  return crypto.randomUUID();
}
