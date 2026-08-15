import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { describe, expect, it } from "vitest";
import { automationJobs, automationRuns } from "../drizzle/schema";
import { createAutomationJobDraft, getDb, getGrowthSummary } from "./db";
import { handleAutomationHeartbeat } from "./scheduled";

const enabled = process.env.LINGUAFORGE_RUN_DB_INTEGRATION === "1" && Boolean(process.env.DATABASE_URL);

describe.skipIf(!enabled)("automation persistence integration", () => {
  it("keeps one draft for a repeated idempotency key", async () => {
    const db = await getDb();
    if (!db) throw new Error("DATABASE_URL was provided but the database client is unavailable");
    const idempotencyKey = `integration-draft-${randomUUID()}`;
    const ownerUserId = 1;

    try {
      await createAutomationJobDraft(ownerUserId, "Integration draft", "Safe cleanup test", idempotencyKey);
      await createAutomationJobDraft(ownerUserId, "Integration draft updated", "Same key", idempotencyKey);
      const rows = await db.select().from(automationJobs).where(eq(automationJobs.idempotencyKey, idempotencyKey));
      expect(rows).toHaveLength(1);
      expect(rows[0]?.name).toBe("Integration draft updated");
    } finally {
      await db.delete(automationJobs).where(eq(automationJobs.idempotencyKey, idempotencyKey));
    }
  });

  it("persists heartbeat status, result and run completion", async () => {
    const db = await getDb();
    if (!db) throw new Error("DATABASE_URL was provided but the database client is unavailable");
    const taskUid = `integration-task-${randomUUID()}`;
    const executionKey = `integration-run-${randomUUID()}`;
    const ownerUserId = 1;
    let jobId: number | undefined;

    try {
      const draft = await db.insert(automationJobs).values({ ownerUserId, name: "Integration heartbeat", scheduleCronTaskUid: taskUid, status: "active", idempotencyKey: `integration-job-${randomUUID()}` });
      jobId = Number(draft[0].insertId);
      const req = { header: (name: string) => name === "x-manus-run-uid" ? executionKey : undefined } as never;
      const response = {
        statusCode: 200,
        status(code: number) { this.statusCode = code; return this; },
        json(payload: unknown) { this.payload = payload; return this; },
        payload: undefined as unknown,
      } as { statusCode: number; payload?: unknown; status(code: number): unknown; json(payload: unknown): unknown };

      await handleAutomationHeartbeat(req, response as never, {
        authenticate: async () => ({ isCron: true, taskUid }),
        getJob: async (uid) => {
          const rows = await db.select().from(automationJobs).where(eq(automationJobs.scheduleCronTaskUid, uid));
          const row = rows[0];
          return row ? { id: row.id, ownerUserId: row.ownerUserId, status: row.status } : undefined;
        },
        startRun: async (id, key) => {
          try { await db.insert(automationRuns).values({ jobId: id, executionKey: key, status: "started" }); return true; } catch (error) { if ((error as { code?: string }).code === "ER_DUP_ENTRY") return false; throw error; }
        },
        updateRun: async (uid, status, error = null, result = null) => { await db.update(automationJobs).set({ lastRunAt: new Date(), lastStatus: status, lastError: error, lastResult: result }).where(eq(automationJobs.scheduleCronTaskUid, uid)); },
        finishRun: async (key, status, error = null) => { await db.update(automationRuns).set({ status, error, completedAt: new Date() }).where(eq(automationRuns.executionKey, key)); },
        growthSummary: getGrowthSummary,
      });

      const [job] = await db.select().from(automationJobs).where(eq(automationJobs.scheduleCronTaskUid, taskUid));
      const [run] = await db.select().from(automationRuns).where(eq(automationRuns.executionKey, executionKey));
      expect(response.statusCode).toBe(200);
      expect(job?.lastStatus).toBe("completed");
      expect(job?.lastError).toBeNull();
      expect(job?.lastResult).toContain("diagnosticsCompleted");
      expect(job?.lastRunAt).toBeInstanceOf(Date);
      expect(run?.status).toBe("completed");
      expect(run?.completedAt).toBeInstanceOf(Date);
    } finally {
      if (jobId) await db.delete(automationRuns).where(eq(automationRuns.jobId, jobId));
      await db.delete(automationJobs).where(and(eq(automationJobs.scheduleCronTaskUid, taskUid), eq(automationJobs.ownerUserId, ownerUserId)));
    }
  });
});
