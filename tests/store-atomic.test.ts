import { describe, expect, it } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { MemoryLearningStore } from "../server/store";

const T = new Date("2026-10-20T00:00:00.000Z");
const learner = { id: "test-learner", displayName: "Test", timeZone: "Europe/Madrid", createdAt: T.toISOString() };
const profile = { userId: learner.id, nativeLanguageCode: "es", targetLanguageCode: "en", learningGoal: null, companionGoal: null };
const diagnosis = { userId: learner.id, targetLanguageCode: "en", learningGoal: "everyday", recommendedLevel: "A2", averageScore: 60, skillCount: 3, scores: { a: 60, b: 60, c: 60 }, createdAt: T.toISOString() };

describe("MemoryLearningStore — identical integrity contract with persistent store", () => {
  it("rejects invalid completion scores and dates without recording data", async () => {
    const store = new MemoryLearningStore();
    await store.createUser(learner);
    for (const score of [-1, 101, NaN, Infinity]) {
      await expect(store.recordCompletion(learner.id, "lesson", score, T)).rejects.toThrow();
    }
    await expect(store.recordCompletion(learner.id, "lesson", 50, new Date(NaN))).rejects.toThrow();
    expect(await store.listCompletions(learner.id)).toEqual([]);
  });

  it("rejects a diagnostic for a different learner without creating a profile", async () => {
    const store = new MemoryLearningStore();
    await store.createUser(learner);
    await expect(store.saveDiagnostic(profile, { ...diagnosis, userId: "other-learner" }))
      .rejects.toThrow(/diagnostic_user_mismatch/);
    expect(await store.getProfile(learner.id)).toBeNull();
    expect(await store.latestDiagnostic(learner.id)).toBeNull();
  });

  it("preserves memory and disk together after a write failure; commits them together on retry", async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "linguaforge-atomic-"));
    try {
      const file = path.join(dir, "snapshot.json");
      const store = new MemoryLearningStore(file);
      await store.createUser(learner);
      await store.upsertProfile(profile);
      const before = fs.readFileSync(file, "utf8");
      const blocker = `${file}.${process.pid}.tmp`;
      fs.mkdirSync(blocker);
      await expect(store.saveDiagnostic({ ...profile, targetLanguageCode: "pt-BR" }, diagnosis))
        .rejects.toThrow();
      expect(await store.getProfile(learner.id)).toEqual(profile);
      expect(await store.latestDiagnostic(learner.id)).toBeNull();
      expect(fs.readFileSync(file, "utf8")).toBe(before);
      fs.rmSync(blocker, { recursive: true, force: true });

      const saved = await store.saveDiagnostic({ ...profile, targetLanguageCode: "pt-BR" }, diagnosis);
      expect(saved.id).toBe(1);
      const restarted = new MemoryLearningStore(file);
      expect((await restarted.getProfile(learner.id))?.targetLanguageCode).toBe("pt-BR");
      expect((await restarted.latestDiagnostic(learner.id))?.id).toBe(1);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
});

describe("MemoryLearningStore — every write is atomic", () => {
  it.each([
    "create user", "update profile", "new completion", "improve completion",
    "add diagnostic", "new submission", "update submission",
  ])("keeps memory and disk unchanged if persistence fails: %s", async operation => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "linguaforge-write-"));
    try {
      const file = path.join(dir, "snapshot.json");
      const store = new MemoryLearningStore(file);
      await store.createUser(learner);
      await store.upsertProfile(profile);
      await store.recordCompletion(learner.id, "existing", 50, T);
      const submission = {
        userId: learner.id, projectId: "existing", artifact: "original",
        reflection: "", status: "draft" as const, updatedAt: T.toISOString(),
      };
      await store.upsertSubmission(submission);
      const state = async () => structuredClone({
        user: await store.getUser("second"),
        profile: await store.getProfile(learner.id),
        completions: await store.listCompletions(learner.id),
        diagnostic: await store.latestDiagnostic(learner.id),
        submissions: await store.listSubmissions(learner.id),
      });
      const before = await state();
      const diskBefore = fs.readFileSync(file, "utf8");
      const write = () => {
        switch (operation) {
          case "create user": return store.createUser({ ...learner, id: "second" });
          case "update profile": return store.upsertProfile({ ...profile, targetLanguageCode: "fr" });
          case "new completion": return store.recordCompletion(learner.id, "new", 70, T);
          case "improve completion": return store.recordCompletion(learner.id, "existing", 90, T);
          case "add diagnostic": return store.addDiagnostic(diagnosis);
          case "new submission": return store.upsertSubmission({ ...submission, projectId: "new" });
          default: return store.upsertSubmission({ ...submission, artifact: "changed" });
        }
      };
      fs.mkdirSync(`${file}.${process.pid}.tmp`);
      await expect(write()).rejects.toThrow();
      expect(await state()).toEqual(before);
      expect(fs.readFileSync(file, "utf8")).toBe(diskBefore);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
});
