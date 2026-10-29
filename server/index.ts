import path from "node:path";
import fs from "node:fs";
import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter, type TrpcContext } from "./routers";
import {
  SESSION_COOKIE,
  SESSION_TTL_MS,
  createSessionSigner,
  newUserId,
  resolveSessionSecret,
  type SessionSigner,
} from "./session";
import { MemoryLearningStore, type LearningStore } from "./store";
import { createDb } from "./db/client";
import { MysqlLearningStore } from "./db/mysql-store";

export type AppOptions = {
  store: LearningStore;
  sessionSigner: SessionSigner;
  isProduction: boolean;
  /** Carpeta con el build de Vite; solo se sirve en producción. */
  staticDir?: string;
  now?: () => Date;
  /** Peticiones de mutación permitidas por IP y minuto. */
  mutationsPerMinute?: number;
  /** Máximo de claves IP simultáneas: evita crecimiento ilimitado bajo ataques. */
  maxRateLimitBuckets?: number;
  /** Configure only for verified reverse proxy chains; never trust client-supplied XFF by default. */
  trustedProxyHops?: number;
};

const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "media-src 'self' blob:",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

export function parseCookies(
  header: string | undefined
): Record<string, string> {
  // Malformed percent escapes must not turn a request into a 500. A null
  // prototype also prevents cookie names from mutating inherited properties.
  const jar: Record<string, string> = Object.create(null);
  for (const part of (header ?? "").split(";")) {
    const index = part.indexOf("=");
    if (index <= 0) continue;
    const name = part.slice(0, index).trim();
    if (!name || name.length > 128) continue;
    try {
      jar[name] = decodeURIComponent(part.slice(index + 1).trim());
    } catch {
      // Skip only the malformed cookie; valid session cookies still work.
    }
  }
  return jar;
}

export function createApp(options: AppOptions) {
  const now = options.now ?? (() => new Date());
  const app = express();
  app.disable("x-powered-by");
  const proxyHops = options.trustedProxyHops ?? 0;
  if (!Number.isInteger(proxyHops) || proxyHops < 0 || proxyHops > 2) {
    throw new Error("trustedProxyHops debe estar entre 0 y 2.");
  }
  app.set("trust proxy", proxyHops);

  app.use((_req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("X-Frame-Options", "DENY");
    // Keep microphone, camera, geolocation and payment APIs disabled by default.
    res.setHeader(
      "Permissions-Policy",
      "camera=(), microphone=(), geolocation=(), payment=()"
    );
    if (options.isProduction) res.setHeader("Content-Security-Policy", CSP);
    next();
  });

  // Protect every tRPC mutation against browser cross-origin requests.
  // Requests without browser metadata remain subject to auth and rate limits.
  app.use("/api/trpc", (req, res, next) => {
    if (!["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) return next();

    const fetchSite = req.get("sec-fetch-site")?.toLowerCase();
    const origin = req.get("origin");
    let trusted = !fetchSite || ["same-origin", "none"].includes(fetchSite);

    if (trusted && origin !== undefined) {
      try {
        const parsed = new URL(origin);
        const host = req.get("host");
        trusted =
          (parsed.protocol === "https:" || parsed.protocol === "http:") &&
          Boolean(host) &&
          parsed.host.toLowerCase() === host!.toLowerCase() &&
          !parsed.username &&
          !parsed.password &&
          parsed.pathname === "/" &&
          !parsed.search &&
          !parsed.hash;
      } catch {
        trusted = false;
      }
    }

    if (!trusted) {
      res.status(403).set("Cache-Control", "no-store").json({ error: "origin_forbidden" });
      return;
    }
    next();
  });

  const limit = options.mutationsPerMinute ?? 120;
  const hits = new Map<string, { count: number; windowStart: number }>();
  const maxBuckets = Math.max(
    1,
    Math.floor(options.maxRateLimitBuckets ?? 10_000)
  );
  const pruneExpired = (current: number) => {
    for (const [key, entry] of hits) {
      if (current - entry.windowStart >= 60_000) hits.delete(key);
    }
  };
  const rateLimitMutations = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (req.method !== "POST") return next();
    const key = req.ip ?? "unknown";
    const current = now().getTime();
    const entry = hits.get(key);
    if (!entry || current - entry.windowStart >= 60_000) {
      if (!entry && hits.size >= maxBuckets) {
        pruneExpired(current);
        if (hits.size >= maxBuckets) {
          res.status(429).json({
            error: "rate_limit_capacity",
            message: "Servidor temporalmente ocupado. Inténtalo más tarde.",
          });
          return;
        }
      }
      hits.set(key, { count: 1, windowStart: current });
      return next();
    }
    entry.count += 1;
    if (entry.count > limit) {
      res.status(429).json({
        error: "rate_limited",
        message: "Demasiadas peticiones. Inténtalo de nuevo en un minuto.",
      });
      return;
    }
    next();
  };

  app.use(
    "/api/trpc",
    rateLimitMutations,
    express.json({ limit: "24mb" }),
    createExpressMiddleware({
      router: appRouter,
      createContext: ({ req, res }): TrpcContext => {
        const userId = options.sessionSigner.verify(
          parseCookies(req.headers.cookie)[SESSION_COOKIE],
          now().getTime()
        );
        return {
          store: options.store,
          userId,
          now,
          newUserId,
          issueSession: id => {
            res.cookie(
              SESSION_COOKIE,
              options.sessionSigner.issue(id, now().getTime()),
              {
                httpOnly: true,
                sameSite: "lax",
                secure: options.isProduction,
                path: "/",
                maxAge: SESSION_TTL_MS,
              }
            );
          },
          clearSession: () => {
            res.clearCookie(SESSION_COOKIE, {
              httpOnly: true,
              sameSite: "lax",
              secure: options.isProduction,
              path: "/",
            });
          },
        };
      },
      onError: ({ error, path, type }) => {
        if (error.code === "INTERNAL_SERVER_ERROR")
          console.error(`[trpc] ${type} ${path}: ${error.message}`);
      },
    })
  );

  app.use("/api", (_req, res) => {
    res.status(404).json({ error: "not_found" });
  });

  if (
    options.isProduction &&
    options.staticDir &&
    fs.existsSync(options.staticDir)
  ) {
    app.use(
      express.static(options.staticDir, { index: "index.html", maxAge: "1h" })
    );
    app.get(/^(?!\/api\/).*/, (_req, res) => {
      res.sendFile(path.join(options.staticDir!, "index.html"));
    });
  }

  app.use(
    (error: unknown, _req: Request, res: Response, _next: NextFunction) => {
      console.error(
        "[server] unhandled error",
        error instanceof Error ? error.message : "unknown"
      );
      if (!res.headersSent) res.status(500).json({ error: "internal_error" });
    }
  );

  return app;
}

/** Rechaza almacenamiento implícito en producción: debe montarse un volumen persistente. */
export function resolveLearningDataFile(
  env: NodeJS.ProcessEnv,
  isProduction: boolean
): string {
  const configured = env.LF_DATA_FILE?.trim();
  if (isProduction && (!configured || !path.isAbsolute(configured))) {
    throw new Error(
      "En producción LF_DATA_FILE debe ser una ruta absoluta en un volumen persistente."
    );
  }
  return configured ?? path.resolve("data", "learning-store.json");
}

/** Arranque real: `pnpm api` (desarrollo) o `pnpm start` (producción, sirve dist/public). */
export function startServer() {
  const isProduction = process.env.NODE_ENV === "production";
  const sessionSigner = createSessionSigner(
    resolveSessionSecret(process.env, isProduction)
  );
  const dataFile = resolveLearningDataFile(process.env, isProduction);
  // LF_STORE=mysql activa MySQL de DESARROLLO (guarda en server/db/safety.ts). Por defecto: JSON en memoria.
  const storeKind = process.env.LF_STORE ?? "memory";
  if (storeKind !== "memory" && storeKind !== "mysql")
    throw new Error(`LF_STORE desconocido: ${storeKind}`);
  if (storeKind === "mysql" && isProduction)
    throw new Error("LF_STORE=mysql no está autorizado en producción.");
  const store: LearningStore =
    storeKind === "mysql"
      ? new MysqlLearningStore(createDb().db)
      : new MemoryLearningStore(dataFile);
  const app = createApp({
    store,
    sessionSigner,
    isProduction,
    staticDir: path.resolve("dist", "public"),
    trustedProxyHops: Number(process.env.LF_TRUSTED_PROXY_HOPS ?? "0"),
  });
  const port = Number(process.env.PORT ?? 3001);
  app.listen(port, "0.0.0.0", () => {
    console.log(
      `[linguaforge] API en http://0.0.0.0:${port} · almacén: ${storeKind === "mysql" ? "MySQL de desarrollo" : dataFile}`
    );
  });
}

if (import.meta.url === `file://${process.argv[1]}`) startServer();
