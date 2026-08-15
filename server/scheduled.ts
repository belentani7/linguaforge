import type { Request, Response } from "express";
import { sdk } from "./_core/sdk";
import { getAutomationJobByTaskUid, updateAutomationJobRun } from "./db";

export async function handleAutomationHeartbeat(req: Request, res: Response) {
  const timestamp = new Date().toISOString();
  try {
    const user = await sdk.authenticateRequest(req);
    if (!user.isCron || !user.taskUid) {
      return res.status(403).json({ error: "cron-only" });
    }

    const job = await getAutomationJobByTaskUid(user.taskUid);
    if (!job) return res.json({ ok: true, skipped: "orphan" });
    if (job.status !== "active") {
      await updateAutomationJobRun(user.taskUid, "skipped-paused");
      return res.json({ ok: true, skipped: job.status });
    }

    // El job queda deliberadamente sin efectos externos hasta que exista una
    // acción aprobada y registrada para esa automatización.
    await updateAutomationJobRun(user.taskUid, "acknowledged");
    return res.json({ ok: true, jobId: job.id, status: "acknowledged" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown scheduled job error";
    if (req.headers.cookie) {
      try {
        const user = await sdk.authenticateRequest(req);
        if (user.taskUid) await updateAutomationJobRun(user.taskUid, "failed", message);
      } catch {
        // Preserve the original 500 response without leaking auth details.
      }
    }
    return res.status(500).json({ error: message, timestamp });
  }
}
