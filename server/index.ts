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

export function parseCookies(header: string | undefined): Record<string, string> {
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
  app.set("trust proxy", 1);

  app.use((_req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("X-Frame-Options", "DENY");
    if (options.isProduction) res.setHeader("Content-Security-Policy", CSP);
    next();
  });

  const limit = options.mutationsPerMinute ?? 120;
  const hits = new Map<string, { count: number; windowStart: number }>();
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

/** Arranque real: `pnpm api` (desarrollo) o `pnpm start` (producción, sirve dist/public). */
export function startServer() {
  const isProduction = process.env.NODE_ENV === "production";
  const sessionSigner = createSessionSigner(
    resolveSessionSecret(process.env, isProduction)
  );
  const dataFile =
    process.env.LF_DATA_FILE ?? path.resolve("data", "learning-store.json");
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
  });
  const port = Number(process.env.PORT ?? 3001);
  app.listen(port, "0.0.0.0", () => {
    console.log(
      `[linguaforge] API en http://0.0.0.0:${port} · almacén: ${storeKind === "mysql" ? "MySQL de desarrollo" : dataFile}`
    );
  });
}

if (import.meta.url === `file://${process.argv[1]}`) startServer();
