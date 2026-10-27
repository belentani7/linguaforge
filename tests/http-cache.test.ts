import type { Server } from "node:http";
import type { AddressInfo } from "node:net";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createApp } from "../server/index";
import { createSessionSigner } from "../server/session";
import { MemoryLearningStore } from "../server/store";

describe("learner HTTP cache and transport policy", () => {
  const servers: Server[] = [];
  const urls: string[] = [];

  beforeAll(async () => {
    for (const isProduction of [false, true]) {
      const app = createApp({
        store: new MemoryLearningStore(),
        sessionSigner: createSessionSigner("test-only-http-policy-secret-32-characters"),
        isProduction,
        mutationsPerMinute: 1,
      });
      const server = await new Promise<Server>(resolve => {
        const listening = app.listen(0, "127.0.0.1", () => resolve(listening));
      });
      servers.push(server);
      urls.push("http://127.0.0.1:" + (server.address() as AddressInfo).port);
    }
  });

  afterAll(async () => {
    await Promise.all(servers.map(server => new Promise<void>((resolve, reject) => {
      server.close(error => error ? reject(error) : resolve());
      server.closeAllConnections();
    })));
  });

  it.each([0, 1])("prevents caching successful and missing API responses in environment %s", async index => {
    for (const route of ["/api/trpc/auth.me", "/api/missing", "/api"]) {
      const response = await fetch(urls[index] + route);
      expect(response.status).toBe(route.endsWith("auth.me") ? 200 : 404);
      expect(response.headers.get("cache-control")).toBe("private, no-store, max-age=0");
      expect(response.headers.get("pragma")).toBe("no-cache");
      await response.text();
    }
  });

  it.each([0, 1])("does not cache case-insensitive API aliases in environment %s", async index => {
    // Express defaults to case-insensitive routing. The policy must protect
    // these aliases even when their path casing differs from /api/trpc.
    for (const route of ["/API/trpc/auth.me", "/Api/trpc/auth.me", "/API"]) {
      const response = await fetch(urls[index] + route);
      expect(response.status).toBe(route === "/API" ? 404 : 200);
      expect(response.headers.get("cache-control")).toBe("private, no-store, max-age=0");
      expect(response.headers.get("pragma")).toBe("no-cache");
      await response.text();
    }
  });

  it("keeps session creation and rate-limit responses private", async () => {
    for (const expected of [200, 429]) {
      const response = await fetch(urls[1] + "/api/trpc/auth.guest", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ json: null }),
      });
      expect(response.status).toBe(expected);
      expect(response.headers.get("cache-control")).toContain("no-store");
      if (expected === 200) expect(response.headers.get("set-cookie")).toContain("HttpOnly");
      await response.text();
    }
  });

  it("enforces HSTS in production without changing sibling subdomains", async () => {
    const response = await fetch(urls[1] + "/api/trpc/auth.me");
    expect(response.headers.get("strict-transport-security")).toBe("max-age=31536000");
    await response.text();
  });

  it("does not enable HSTS for local development", async () => {
    const response = await fetch(urls[0] + "/api/trpc/auth.me");
    expect(response.headers.get("strict-transport-security")).toBeNull();
    await response.text();
  });
});
