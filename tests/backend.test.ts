import { mkdtempSync, rmSync, existsSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import type { AddressInfo } from "node:net";
import type { Server } from "node:http";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { TRPCError } from "@trpc/server";
import { appRouter, type TrpcContext } from "../server/routers";
import {
  computeStreakDays,
  computeXp,
  localDayKey,
  recommendLevel,
} from "../server/domain";
import { MemoryLearningStore } from "../server/store";
import {
  SESSION_COOKIE,
  createSessionSigner,
  resolveSessionSecret,
} from "../server/session";
import { createApp } from "../server/index";

const SECRET = "x".repeat(40);
const signer = createSessionSigner(SECRET);
const NOW = new Date("2026-10-11T10:00:00Z");

function makeContext(
  store: MemoryLearningStore,
  userId: string | null,
  now = NOW
) {
  const issued: string[] = [];
  let cleared = false;
  let counter = 0;
  const ctx: TrpcContext = {
    store,
    userId,
    now: () => now,
    newUserId: () =>
      `user-${++counter}-${Math.random().toString(36).slice(2, 8)}`,
    issueSession: id => issued.push(id),
    clearSession: () => {
      cleared = true;
    },
  };
  return { ctx, issued, wasCleared: () => cleared };
}

async function newLearner(store: MemoryLearningStore, id: string) {
  await store.createUser({
    id,
    displayName: "Prueba",
    timeZone: "Europe/Madrid",
    createdAt: NOW.toISOString(),
  });
  return appRouter.createCaller(makeContext(store, id).ctx);
}

describe("dominio: orientación de nivel", () => {
  it("usa bandas inclusivas por la izquierda sobre la media", () => {
    const at = (value: number) =>
      recommendLevel({ a: value, b: value, c: value });
    expect(at(0)).toMatchObject({ ok: true, level: "A1" });
    expect(at(19)).toMatchObject({ ok: true, level: "A1" });
    expect(at(20)).toMatchObject({ ok: true, level: "A2" });
    expect(at(35)).toMatchObject({ ok: true, level: "B1" });
    expect(at(50)).toMatchObject({ ok: true, level: "B2" });
    expect(at(65)).toMatchObject({ ok: true, level: "C1" });
    expect(at(80)).toMatchObject({ ok: true, level: "C2" });
    expect(at(100)).toMatchObject({ ok: true, level: "C2" });
  });

  it("rechaza menos de 3 competencias en lugar de inventar un nivel", () => {
    expect(recommendLevel({ a: 90, b: 90 })).toEqual({
      ok: false,
      reason: "insufficient_skills",
      skillCount: 2,
      required: 3,
    });
  });

  it("calcula la media con redondeo", () => {
    expect(recommendLevel({ a: 10, b: 11, c: 12 })).toMatchObject({
      averageScore: 11,
      skillCount: 3,
    });
  });
});

describe("dominio: racha y XP", () => {
  const madrid = "Europe/Madrid";

  it("cuenta días consecutivos hasta hoy", () => {
    const days = [
      new Date("2026-10-11T08:00:00Z"),
      new Date("2026-10-10T08:00:00Z"),
      new Date("2026-10-09T08:00:00Z"),
    ];
    expect(computeStreakDays(days, madrid, NOW)).toBe(3);
  });

  it("no rompe la racha si hoy aún no hay actividad (cuenta desde ayer)", () => {
    const days = [
      new Date("2026-10-10T08:00:00Z"),
      new Date("2026-10-09T08:00:00Z"),
    ];
    expect(computeStreakDays(days, madrid, NOW)).toBe(2);
  });

  it("se corta con un hueco de un día", () => {
    const days = [
      new Date("2026-10-11T08:00:00Z"),
      new Date("2026-10-09T08:00:00Z"),
    ];
    expect(computeStreakDays(days, madrid, NOW)).toBe(1);
  });

  it("usa el día civil de la zona horaria del usuario, no el de UTC", () => {
    // 23:30 UTC del 10 es 01:30 del 11 en Madrid (UTC+2 en octubre): cuenta como día 11 para Madrid.
    const lateUtc = new Date("2026-10-10T23:30:00Z");
    expect(localDayKey(lateUtc, madrid)).toBe("2026-10-11");
    expect(localDayKey(lateUtc, "UTC")).toBe("2026-10-10");
  });

  it("XP: 50 por lección y 100 por proyecto completado", () => {
    expect(computeXp(3, 2)).toBe(350);
    expect(computeXp(0, 0)).toBe(0);
  });
});

describe("sesión firmada", () => {
  const now = Date.now();

  it("acepta un token válido y devuelve el usuario", () => {
    expect(signer.verify(signer.issue("u-1", now), now)).toBe("u-1");
  });

  it("rechaza un token manipulado, caducado o mal formado", () => {
    const token = signer.issue("u-1", now);
    const tampered = token.replace("u-1", "u-2");
    expect(signer.verify(tampered, now)).toBeNull();
    expect(
      signer.verify(signer.issue("u-1", now - 400 * 24 * 3600 * 1000), now)
    ).toBeNull();
    expect(signer.verify("basura", now)).toBeNull();
    expect(signer.verify(undefined, now)).toBeNull();
  });

  it("firmas con otro secreto no son válidas", () => {
    const other = createSessionSigner("y".repeat(40));
    expect(signer.verify(other.issue("u-1", now), now)).toBeNull();
  });

  it("exige un secreto de al menos 32 caracteres y en producción no admite ausencia", () => {
    expect(() => createSessionSigner("corto")).toThrow();
    expect(() => resolveSessionSecret({}, true)).toThrow(/obligatorio/);
    expect(resolveSessionSecret({}, false).length).toBeGreaterThanOrEqual(32);
  });
});

describe("repositorio en memoria", () => {
  it("registrar una lección dos veces es idempotente y conserva la mejor puntuación", async () => {
    const store = new MemoryLearningStore();
    await store.createUser({
      id: "a",
      displayName: "A",
      timeZone: "UTC",
      createdAt: NOW.toISOString(),
    });
    await store.recordCompletion("a", "everyday-a1-introductions", 65, NOW);
    const second = await store.recordCompletion(
      "a",
      "everyday-a1-introductions",
      40,
      NOW
    );
    expect(second.bestScore).toBe(65);
    expect(await store.listCompletions("a")).toHaveLength(1);
  });

  it("persiste en JSON de forma atómica y recupera el estado al reabrir", async () => {
    const dir = mkdtempSync(path.join(tmpdir(), "lf-store-"));
    const file = path.join(dir, "store.json");
    try {
      const first = new MemoryLearningStore(file);
      await first.createUser({
        id: "p",
        displayName: "P",
        timeZone: "UTC",
        createdAt: NOW.toISOString(),
      });
      await first.recordCompletion("p", "coding-a1-reading", 80, NOW);
      expect(existsSync(file)).toBe(true);
      expect(existsSync(`${file}.${process.pid}.tmp`)).toBe(false);

      const reopened = new MemoryLearningStore(file);
      expect(await reopened.getUser("p")).not.toBeNull();
      expect(await reopened.listCompletions("p")).toEqual([
        expect.objectContaining({
          lessonId: "coding-a1-reading",
          bestScore: 80,
        }),
      ]);
      expect(JSON.parse(readFileSync(file, "utf8")).completions).toHaveLength(
        1
      );
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

describe("procedimientos tRPC", () => {
  let store: MemoryLearningStore;
  beforeAll(() => {
    store = new MemoryLearningStore();
  });

  it("auth.me devuelve null sin sesión", async () => {
    const caller = appRouter.createCaller(makeContext(store, null).ctx);
    expect(await caller.auth.me()).toBeNull();
  });

  it("auth.guest crea un usuario y emite la sesión; logout limpia la cookie", async () => {
    const { ctx, issued, wasCleared } = makeContext(store, null);
    const caller = appRouter.createCaller(ctx);
    const created = await caller.auth.guest();
    expect(created.name).toBe("Estudiante");
    expect(issued).toEqual([created.id]);
    await caller.auth.logout();
    expect(wasCleared()).toBe(true);
  });

  it("los procedimientos protegidos rechazan a usuarios anónimos", async () => {
    const caller = appRouter.createCaller(makeContext(store, null).ctx);
    await expect(caller.profile.get()).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
    await expect(
      caller.learning.complete({
        lessonId: "everyday-a1-introductions",
        score: 70,
      })
    ).rejects.toBeInstanceOf(TRPCError);
  });

  it("una sesión con usuario inexistente se trata como no autorizada", async () => {
    const caller = appRouter.createCaller(makeContext(store, "no-existe").ctx);
    await expect(caller.profile.get()).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
  });

  it("diagnóstico: exige 3 competencias y guarda el nivel recomendado", async () => {
    const caller = await newLearner(store, "diag");
    await expect(
      caller.diagnostic.complete({
        targetLanguageCode: "en",
        learningGoal: "everyday",
        scores: { a: 10, b: 20 },
      })
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
    const result = await caller.diagnostic.complete({
      targetLanguageCode: "en",
      learningGoal: "everyday",
      scores: { comprehension: 60, expression: 50, interaction: 55 },
    });
    expect(result).toMatchObject({
      recommendedLevel: "B2",
      averageScore: 55,
      skillCount: 3,
    });
    const profile = await caller.profile.get();
    expect(profile.currentLevel).toBe("B2");
    expect(profile.targetLanguageCode).toBe("en");
  });

  it("diagnóstico: rechaza idiomas fuera del catálogo", async () => {
    const caller = await newLearner(store, "lang");
    await expect(
      caller.diagnostic.complete({
        targetLanguageCode: "xx-invalid",
        learningGoal: "everyday",
        scores: { a: 1, b: 2, c: 3 },
      })
    ).rejects.toThrow();
  });

  it("aprendizaje: lección inexistente → NOT_FOUND; completar dos veces no duplica", async () => {
    const caller = await newLearner(store, "learner-1");
    await expect(
      caller.learning.complete({ lessonId: "no-existe", score: 50 })
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
    await caller.learning.complete({
      lessonId: "everyday-a1-introductions",
      score: 65,
    });
    const again = await caller.learning.complete({
      lessonId: "everyday-a1-introductions",
      score: 90,
    });
    expect(again).toEqual({
      lessonId: "everyday-a1-introductions",
      bestScore: 90,
      lessonsCompleted: 1,
    });
    const profile = await caller.profile.get();
    expect(profile.nextLesson?.id).toBe("everyday-a2-routines");
    expect(profile.xp).toBe(50);
  });

  it("aprendizaje: rechaza puntuaciones fuera de 0–100", async () => {
    const caller = await newLearner(store, "learner-score");
    await expect(
      caller.learning.complete({
        lessonId: "everyday-a1-introductions",
        score: 101,
      })
    ).rejects.toThrow();
    await expect(
      caller.learning.complete({
        lessonId: "everyday-a1-introductions",
        score: 1.5,
      })
    ).rejects.toThrow();
  });

  it("aislamiento: el progreso de un usuario no aparece en otro", async () => {
    const alice = await newLearner(store, "alice");
    const bob = await newLearner(store, "bob");
    await alice.learning.complete({ lessonId: "coding-a1-reading", score: 80 });
    expect((await alice.profile.get()).lessonsCompleted).toBeGreaterThanOrEqual(
      1
    );
    expect((await bob.profile.get()).completedLessonIds).not.toContain(
      "coding-a1-reading"
    );
  });

  it("proyectos: guardar es idempotente por proyecto y valida el id", async () => {
    const caller = await newLearner(store, "projects");
    const projectId = (
      await appRouter
        .createCaller(makeContext(store, null).ctx)
        .institution.projects()
    )[0].id;
    await caller.projects.save({
      projectId,
      artifact: "borrador",
      reflection: "",
      status: "draft",
    });
    const saved = await caller.projects.save({
      projectId,
      artifact: "versión final",
      reflection: "Aprendí a verificar.",
      status: "completed",
    });
    expect(saved.status).toBe("completed");
    expect(await caller.projects.mine()).toHaveLength(1);
    await expect(
      caller.projects.save({
        projectId: "inventado",
        artifact: "",
        reflection: "",
        status: "draft",
      })
    ).rejects.toThrow();
    const profile = await caller.profile.get();
    expect(profile.xp).toBe(100);
  });

  it("voz: sin proveedor devuelve 'unavailable' y nunca un texto inventado", async () => {
    const caller = await newLearner(store, "voice");
    const result = await caller.voice.transcribe({
      lessonId: "everyday-a1-introductions",
      mimeType: "audio/webm",
      base64Audio: "AAAA",
    });
    expect(result).toEqual({
      status: "unavailable",
      reason: "no_speech_provider",
      transcript: null,
    });
  });

  it("voz: rechaza tipos MIME no permitidos", async () => {
    const caller = await newLearner(store, "voice-mime");
    await expect(
      caller.voice.transcribe({
        lessonId: "everyday-a1-introductions",
        mimeType: "text/html" as never,
        base64Audio: "AAAA",
      })
    ).rejects.toThrow();
  });

  it("tutor: responde en modo demostración, sin afirmar que es un proveedor de IA", async () => {
    const caller = appRouter.createCaller(makeContext(store, null).ctx);
    const result = await caller.tutor.respond({
      message: "¿Qué es una variable?",
      task: "explain",
    });
    expect(result.mode).toBe("demonstration-fallback");
    expect(result.answer).toContain("no hay un proveedor de IA configurado");
  });

  it("tutor: rechaza mensajes vacíos o demasiado largos", async () => {
    const caller = appRouter.createCaller(makeContext(store, null).ctx);
    await expect(
      caller.tutor.respond({ message: "", task: "explain" })
    ).rejects.toThrow();
    await expect(
      caller.tutor.respond({ message: "x".repeat(2001), task: "explain" })
    ).rejects.toThrow();
  });
});

describe("capa HTTP (Express + cookies)", () => {
  let server: Server;
  let base: string;
  let store: MemoryLearningStore;

  beforeAll(async () => {
    store = new MemoryLearningStore();
    const app = createApp({
      store,
      sessionSigner: signer,
      isProduction: true,
      mutationsPerMinute: 5,
    });
    server = app.listen(0, "127.0.0.1");
    await new Promise<void>(resolve =>
      server.once("listening", () => resolve())
    );
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  });

  afterAll(async () => {
    await new Promise<void>(resolve => server.close(() => resolve()));
  });

  it("auth.guest emite una cookie HttpOnly, SameSite=Lax y Secure en producción", async () => {
    const response = await fetch(`${base}/api/trpc/auth.guest`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ json: null }),
    });
    expect(response.status).toBe(200);
    const setCookie = response.headers.get("set-cookie") ?? "";
    expect(setCookie).toContain(`${SESSION_COOKIE}=`);
    expect(setCookie).toMatch(/HttpOnly/i);
    expect(setCookie).toMatch(/SameSite=Lax/i);
    expect(setCookie).toMatch(/Secure/i);
    expect(response.headers.get("content-security-policy")).toContain(
      "frame-ancestors 'none'"
    );
  });

  it("profile.get sin cookie → 401 y con cookie válida → 200", async () => {
    const anon = await fetch(`${base}/api/trpc/profile.get`);
    expect(anon.status).toBe(401);

    const login = await fetch(`${base}/api/trpc/auth.guest`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: '{"json":null}',
    });
    const cookie = (login.headers.get("set-cookie") ?? "").split(";")[0];
    const authed = await fetch(`${base}/api/trpc/profile.get`, {
      headers: { cookie },
    });
    expect(authed.status).toBe(200);
  });

  it("una cookie manipulada no autentica", async () => {
    const forged = `${SESSION_COOKIE}=${encodeURIComponent("otro.123.firma")}`;
    const response = await fetch(`${base}/api/trpc/profile.get`, {
      headers: { cookie: forged },
    });
    expect(response.status).toBe(401);
  });

  it("aplica límite de peticiones de mutación por IP", async () => {
    const statuses: number[] = [];
    for (let i = 0; i < 8; i += 1) {
      const response = await fetch(`${base}/api/trpc/tutor.respond`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ json: { message: "hola", task: "explain" } }),
      });
      statuses.push(response.status);
    }
    expect(statuses).toContain(429);
    expect(statuses.filter(s => s === 200).length).toBeLessThanOrEqual(5);
  });

  it("rutas /api desconocidas responden JSON 404 sin filtrar detalles", async () => {
    const response = await fetch(`${base}/api/no-existe`);
    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: "not_found" });
  });
});
