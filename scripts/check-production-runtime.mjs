import assert from "node:assert/strict";
import { spawn, execFileSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";

const container = process.env.RUNTIME_CONTAINER;
const base = process.env.RUNTIME_BASE_URL || "http://127.0.0.1:4300";
const dir = container ? null : mkdtempSync(path.join(tmpdir(), "lf-runtime-"));
const env = {
  ...process.env, NODE_ENV: "production", PORT: "4300",
  SESSION_SECRET: randomBytes(32).toString("base64url"),
  LF_DATA_FILE: dir ? path.join(dir, "learning.json") : "",
};
let child;
let output = "";
function start() {
  assert.equal(existsSync("dist/server.mjs"), true, "Production backend must be compiled to dist/server.mjs");
  child = spawn(process.execPath, ["dist/server.mjs"], { env, stdio: ["ignore", "pipe", "pipe"] });
  child.stdout.on("data", value => { output += value; });
  child.stderr.on("data", value => { output += value; });
}
async function stop() {
  if (!child || child.exitCode !== null) return;
  const processToStop = child;
  const exited = new Promise(resolve => processToStop.once("exit", resolve));
  processToStop.kill("SIGTERM");
  await exited;
  child = undefined;
}
async function ready() {
  for (let attempt = 0; attempt < 100; attempt++) {
    try {
      const response = await fetch(base + "/api/trpc/auth.me");
      if (response.ok) return;
    } catch {}
    if (child && child.exitCode !== null) throw new Error("Production server exited: " + output);
    await delay(100);
  }
  throw new Error("Production server did not become ready: " + output);
}
async function call(name, input, cookie) {
  const response = await fetch(base + "/api/trpc/" + name, {
    method: input === undefined ? "GET" : "POST",
    headers: { "content-type": "application/json", ...(cookie ? { cookie } : {}) },
    ...(input === undefined ? {} : { body: JSON.stringify({ json: input }) }),
  });
  assert.equal(response.status, 200, name + " must succeed");
  assert.equal(response.headers.get("cache-control"), "private, no-store, max-age=0", name + " must not be cached");
  assert.equal(response.headers.get("strict-transport-security"), "max-age=31536000");
  const body = await response.json();
  return { data: body.result.data.json, cookie: response.headers.get("set-cookie")?.split(";")[0] };
}
try {
  if (!container) start();
  await ready();
  const html = await fetch(base + "/catalogo");
  assert.equal(html.status, 200);
  assert.match(await html.text(), /id="root"/);
  const session = await call("auth.guest", null);
  assert.ok(session.cookie, "Production session cookie is required");
  await call("learning.complete", { lessonId: "everyday-a1-introductions", score: 90 }, session.cookie);
  assert.equal((await call("profile.get", undefined, session.cookie)).data.lessonsCompleted, 1);
  if (container) execFileSync("docker", ["restart", container], { stdio: "pipe" });
  else { await stop(); start(); }
  await ready();
  const restored = (await call("profile.get", undefined, session.cookie)).data;
  assert.equal(restored.lessonsCompleted, 1);
  assert.ok(restored.completedLessonIds.includes("everyday-a1-introductions"));
  assert.equal(restored.xp, 50);
  console.log("PASS: production frontend, anonymous session, lesson completion and durable restart");
} finally {
  await stop();
  if (dir) rmSync(dir, { recursive: true, force: true });
}
