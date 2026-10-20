import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { Pool } from "mysql2/promise";
import { randomUUID } from "node:crypto";
import { MemoryLearningStore, type LearningStore } from "../server/store";
import { MysqlLearningStore } from "../server/db/mysql-store";
import { createDb } from "../server/db/client";
import {
  assertDevelopmentTarget,
  parseDatabaseUrl,
  requireDevelopmentDatabaseUrl,
} from "../server/db/safety";
import { runMigrations } from "../server/db/migrate";
import { runRollback } from "../server/db/rollback";
import { runSeed, SEED_LEARNERS } from "../server/db/seed";

/**
 * TEST_DATABASE_URL (opcional) apunta a una base de PRUEBA local, p. ej.
 * mysql://lf_dev:***@127.0.0.1:3306/linguaforge_test. Sin esa variable, las pruebas
 * de MySQL se omiten (se reportan como "skipped"); nunca se conecta a otra base.
 */
const TEST_DB_URL = process.env.TEST_DATABASE_URL;
const describeMysql = TEST_DB_URL ? describe : describe.skip;

const T1 = new Date("2026-03-01T10:00:00.000Z");
const T2 = new Date("2026-03-02T10:00:00.000Z");

function newUser(overrides: Partial<{ id: string }> = {}) {
  return {
    id: overrides.id ?? randomUUID(),
    displayName: "Prueba",
    timeZone: "Europe/Madrid",
    createdAt: T1.toISOString(),
  };
}
const diagnosticFor = (userId: string, skillCount = 3) => ({
  userId,
  targetLanguageCode: "en",
  learningGoal: "everyday",
  recommendedLevel: "A2",
  averageScore: 60,
  skillCount,
  scores: Object.fromEntries(
    Array.from({ length: skillCount }, (_, i) => [`skill-${i + 1}`, 60])
  ),
  createdAt: T1.toISOString(),
});

// ---------------------------------------------------------------- 1. Guarda de seguridad (siempre)
describe("guarda de seguridad de base de datos", () => {
  it("acepta sólo host local y base de desarrollo o prueba", () => {
    const ok = parseDatabaseUrl(
      "mysql://lf_dev:secreto@127.0.0.1:3306/linguaforge_dev"
    );
    expect(() => assertDevelopmentTarget(ok, {})).not.toThrow();
    expect(() =>
      assertDevelopmentTarget(
        parseDatabaseUrl("mysql://u:p@localhost/linguaforge_test"),
        {}
      )
    ).not.toThrow();
  });

  it("rechaza producción, hosts remotos y nombres de base no autorizados", () => {
    const local = "mysql://u:p@127.0.0.1/linguaforge_dev";
    expect(() =>
      requireDevelopmentDatabaseUrl(local, { NODE_ENV: "production" })
    ).toThrow(/NODE_ENV=production/);
    expect(() =>
      requireDevelopmentDatabaseUrl(
        "mysql://u:p@db.example.com/linguaforge_dev",
        {}
      )
    ).toThrow(/no es local/);
    expect(() =>
      requireDevelopmentDatabaseUrl("mysql://u:p@127.0.0.1/linguaforge", {})
    ).toThrow(/no es de desarrollo/);
    expect(() =>
      requireDevelopmentDatabaseUrl(
        "mysql://u:p@127.0.0.1/linguaforge_dev_backup",
        {}
      )
    ).toThrow(/no es de desarrollo/);
    expect(() =>
      requireDevelopmentDatabaseUrl(
        "postgres://u:p@127.0.0.1/linguaforge_dev",
        {}
      )
    ).toThrow(/mysql:\/\//);
    expect(() => requireDevelopmentDatabaseUrl(undefined, {})).toThrow(
      /Falta DATABASE_URL/
    );
  });
});

// ---------------------------------------------------------------- 2. Contrato del repositorio
function runContract(
  name: string,
  makeStore: () => Promise<{
    store: LearningStore;
    cleanup: () => Promise<void>;
  }>
) {
  describe(`contrato del repositorio: ${name}`, () => {
    let store: LearningStore;
    let cleanup: () => Promise<void>;
    beforeAll(async () => {
      ({ store, cleanup } = await makeStore());
    });
    afterAll(async () => {
      await cleanup();
    });

    it("crea y recupera usuarios; devuelve null si no existe", async () => {
      const user = newUser();
      await store.createUser(user);
      expect(await store.getUser(user.id)).toEqual(user);
      expect(await store.getUser(randomUUID())).toBeNull();
    });

    it("upsertProfile actualiza en lugar de duplicar", async () => {
      const user = newUser();
      await store.createUser(user);
      const base = {
        userId: user.id,
        nativeLanguageCode: "es",
        targetLanguageCode: "en",
        learningGoal: "everyday",
        companionGoal: null,
      };
      await store.upsertProfile(base);
      await store.upsertProfile({
        ...base,
        targetLanguageCode: "pt-BR",
        companionGoal: "viajes",
      });
      expect(await store.getProfile(user.id)).toEqual({
        ...base,
        targetLanguageCode: "pt-BR",
        companionGoal: "viajes",
      });
    });

    it("recordCompletion es idempotente y conserva la mejor puntuación", async () => {
      const user = newUser();
      await store.createUser(user);
      await store.recordCompletion(user.id, "lesson-a", 60, T1);
      await store.recordCompletion(user.id, "lesson-a", 40, T2);
      const kept = await store.recordCompletion(user.id, "lesson-a", 90, T2);
      expect(kept.bestScore).toBe(90);
      const list = await store.listCompletions(user.id);
      expect(list).toHaveLength(1);
      expect(list[0].bestScore).toBe(90);
      expect(new Date(list[0].completedAt).getTime()).toBe(T1.getTime());
    });

    it("aísla los datos entre usuarios", async () => {
      const a = newUser();
      const b = newUser();
      await store.createUser(a);
      await store.createUser(b);
      await store.recordCompletion(a.id, "lesson-iso", 70, T1);
      expect(await store.listCompletions(b.id)).toEqual([]);
      await store.upsertSubmission({
        userId: a.id,
        projectId: "p-iso",
        artifact: "x",
        reflection: "y",
        status: "draft",
        updatedAt: T1.toISOString(),
      });
      expect(await store.listSubmissions(b.id)).toEqual([]);
    });

    it("saveDiagnostic guarda diagnóstico y perfil juntos", async () => {
      const user = newUser();
      await store.createUser(user);
      const saved = await store.saveDiagnostic(
        {
          userId: user.id,
          nativeLanguageCode: "es",
          targetLanguageCode: "ca",
          learningGoal: "technology",
          companionGoal: null,
        },
        diagnosticFor(user.id, 4)
      );
      expect(saved.skillCount).toBe(4);
      expect((await store.latestDiagnostic(user.id))?.scores).toEqual({
        "skill-1": 60,
        "skill-2": 60,
        "skill-3": 60,
        "skill-4": 60,
      });
      expect((await store.getProfile(user.id))?.targetLanguageCode).toBe("ca");
    });

    it("saveDiagnostic es atómico: si el diagnóstico falla, el perfil no cambia", async () => {
      const user = newUser();
      await store.createUser(user);
      const original = {
        userId: user.id,
        nativeLanguageCode: "es",
        targetLanguageCode: "en",
        learningGoal: "everyday",
        companionGoal: null,
      };
      await store.upsertProfile(original);
      await expect(
        store.saveDiagnostic(
          { ...original, targetLanguageCode: "fr" },
          diagnosticFor(user.id, 2)
        )
      ).rejects.toThrow();
      expect(await store.getProfile(user.id)).toEqual(original);
      expect(await store.latestDiagnostic(user.id)).toBeNull();
    });

    it("rechaza mezclar el perfil y diagnóstico de usuarios distintos sin modificar datos", async () => {
      const profileOwner = newUser();
      const diagnosticOwner = newUser();
      await store.createUser(profileOwner);
      await store.createUser(diagnosticOwner);
      const originalProfile = {
        userId: profileOwner.id,
        nativeLanguageCode: "es",
        targetLanguageCode: "en",
        learningGoal: "everyday",
        companionGoal: null,
      };
      await store.upsertProfile(originalProfile);

      await expect(
        store.saveDiagnostic(
          { ...originalProfile, targetLanguageCode: "ca" },
          diagnosticFor(diagnosticOwner.id)
        )
      ).rejects.toThrow(/diagnostic_user_mismatch/);

      expect(await store.getProfile(profileOwner.id)).toEqual(originalProfile);
      expect(await store.latestDiagnostic(profileOwner.id)).toBeNull();
      expect(await store.latestDiagnostic(diagnosticOwner.id)).toBeNull();
    });

    it("upsertSubmission es idempotente por (usuario, proyecto)", async () => {
      const user = newUser();
      await store.createUser(user);
      const base = {
        userId: user.id,
        projectId: "proj-1",
        reflection: "r",
        updatedAt: T1.toISOString(),
      };
      await store.upsertSubmission({
        ...base,
        artifact: "v1",
        status: "draft",
      });
      const second = await store.upsertSubmission({
        ...base,
        artifact: "v2",
        status: "completed",
      });
      expect(second.artifact).toBe("v2");
      const list = await store.listSubmissions(user.id);
      expect(list).toHaveLength(1);
      expect(list[0].status).toBe("completed");
    });
  });
}

runContract("memoria", async () => ({
  store: new MemoryLearningStore(),
  cleanup: async () => {},
}));

// ---------------------------------------------------------------- 3. MySQL: contrato, integridad, rollback, seed
describeMysql("MySQL de desarrollo (TEST_DATABASE_URL)", () => {
  let pool: Pool;
  let store: MysqlLearningStore;

  const tables = async () => {
    const [rows] = await pool.query("SHOW TABLES");
    return (rows as Record<string, string>[]).map(row => Object.values(row)[0]);
  };

  beforeAll(async () => {
    const created = createDb(TEST_DB_URL);
    pool = created.pool;
    store = new MysqlLearningStore(created.db);
    await runRollback(TEST_DB_URL, { confirm: true });
    await runMigrations(TEST_DB_URL);
  });

  afterAll(async () => {
    await pool.end();
  });

  beforeEach(async () => {
    // Borra usuarios: ON DELETE CASCADE limpia el resto de tablas.
    await pool.query("DELETE FROM users");
  });

  runContract("MySQL", async () => ({ store, cleanup: async () => {} }));

  it("migraciones: crean las 5 tablas y son idempotentes", async () => {
    await runMigrations(TEST_DB_URL);
    expect((await tables()).sort()).toEqual(
      expect.arrayContaining([
        "diagnostics",
        "learner_profiles",
        "lesson_completions",
        "project_submissions",
        "users",
      ])
    );
  });

  it("integridad: rechaza filas huérfanas (clave foránea)", async () => {
    await expect(
      pool.query(
        "INSERT INTO lesson_completions (user_id, lesson_id, best_score) VALUES (?, 'x', 10)",
        [randomUUID()]
      )
    ).rejects.toThrow(/foreign key/i);
  });

  it("integridad: rechaza puntuaciones fuera de rango (CHECK)", async () => {
    const user = newUser();
    await store.createUser(user);
    await expect(
      store.recordCompletion(user.id, "lesson-range", 101, T1)
    ).rejects.toThrow();
    await expect(
      pool.query(
        "INSERT INTO lesson_completions (user_id, lesson_id, best_score) VALUES (?, 'lesson-neg', -1)",
        [user.id]
      )
    ).rejects.toThrow(/CONSTRAINT.*failed|check/i);
  });

  it("integridad: la clave primaria impide duplicados a nivel de base", async () => {
    const user = newUser();
    await store.createUser(user);
    await pool.query(
      "INSERT INTO lesson_completions (user_id, lesson_id, best_score) VALUES (?, 'dup', 10)",
      [user.id]
    );
    await expect(
      pool.query(
        "INSERT INTO lesson_completions (user_id, lesson_id, best_score) VALUES (?, 'dup', 20)",
        [user.id]
      )
    ).rejects.toThrow(/duplicate/i);
  });

  it("integridad: borrar un usuario elimina en cascada sus datos", async () => {
    const user = newUser();
    await store.createUser(user);
    await store.saveDiagnostic(
      {
        userId: user.id,
        nativeLanguageCode: "es",
        targetLanguageCode: "en",
        learningGoal: "everyday",
        companionGoal: null,
      },
      diagnosticFor(user.id)
    );
    await store.recordCompletion(user.id, "lesson-cascade", 80, T1);
    await store.upsertSubmission({
      userId: user.id,
      projectId: "p-c",
      artifact: "a",
      reflection: "r",
      status: "draft",
      updatedAt: T1.toISOString(),
    });
    await pool.query("DELETE FROM users WHERE id = ?", [user.id]);
    const [[counts]] = (await pool.query(
      `SELECT (SELECT COUNT(*) FROM learner_profiles WHERE user_id = ?) AS p,
              (SELECT COUNT(*) FROM diagnostics WHERE user_id = ?) AS d,
              (SELECT COUNT(*) FROM lesson_completions WHERE user_id = ?) AS c,
              (SELECT COUNT(*) FROM project_submissions WHERE user_id = ?) AS s`,
      [user.id, user.id, user.id, user.id]
    )) as unknown as [Record<string, number>[]];
    expect(counts).toEqual({ p: 0, d: 0, c: 0, s: 0 });
  });

  it("rollback: el script revierte el esquema y una nueva migración lo reconstruye", async () => {
    await store.createUser(newUser());
    const result = await runRollback(TEST_DB_URL, { confirm: true });
    expect(result.statements).toBe(6);
    expect(await tables()).toEqual([]);
    await runMigrations(TEST_DB_URL);
    expect(await tables()).toContain("users");
    const [[row]] = (await pool.query(
      "SELECT COUNT(*) AS n FROM users"
    )) as unknown as [Record<string, number>[]];
    expect(row.n).toBe(0);
  });

  it("rollback exige confirmación explícita", async () => {
    await expect(runRollback(TEST_DB_URL)).rejects.toThrow(/--confirm/);
    expect(await tables()).toContain("users");
  });

  it("seed ficticio: idempotente y sólo con identificadores de prueba", async () => {
    const first = await runSeed(TEST_DB_URL);
    expect(first.inserted).toBe(SEED_LEARNERS.length);
    const second = await runSeed(TEST_DB_URL);
    expect(second.inserted).toBe(0);
    const [[row]] = (await pool.query(
      "SELECT COUNT(*) AS n FROM users WHERE id LIKE 'seed-learner-%'"
    )) as unknown as [Record<string, number>[]];
    expect(row.n).toBe(SEED_LEARNERS.length);
    const [[leak]] = (await pool.query(
      "SELECT COUNT(*) AS n FROM users WHERE id NOT LIKE 'seed-learner-%' AND display_name LIKE '%sintétic%'"
    )) as unknown as [Record<string, number>[]];
    expect(leak.n).toBe(0);
  });
});
