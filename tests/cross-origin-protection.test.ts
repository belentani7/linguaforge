import type { AddressInfo } from "node:net";
import type { Server } from "node:http";
import { describe, expect, it } from "vitest";
import { createApp } from "../server/index";
import { createSessionSigner } from "../server/session";
import { MemoryLearningStore } from "../server/store";

describe("Cross-origin protection across the entire tRPC API", () => {
  it("blocks forged browser mutations while retaining same-origin and non-browser use", async () => {
    const app = createApp({
      store: new MemoryLearningStore(),
      sessionSigner: createSessionSigner("x".repeat(40)),
      isProduction: false,
    });
    const server: Server = app.listen(0, "127.0.0.1");
    await new Promise<void>(resolve => server.once("listening", resolve));
    const base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    try {
      const post = (headers: Record<string,string>) => fetch(base + "/api/trpc/auth.guest", {
        method: "POST", headers: { "content-type": "application/json", ...headers }, body: '{"json":null}',
      });
      for (const headers of [
        { origin: "https://attacker.test" },
        { origin: "null" },
        { "sec-fetch-site": "cross-site" },
        { "sec-fetch-site": "same-site" },
      ]) {
        const response = await post(headers);
        expect(response.status).toBe(403);
        expect(response.headers.get("cache-control")).toBe("no-store");
        expect(await response.json()).toMatchObject({ error: "origin_forbidden" });
      }
      expect((await post({ origin: base, "sec-fetch-site": "same-origin" })).status).toBe(200);
      expect((await post({})).status).toBe(200);
    } finally {
      await new Promise<void>((resolve, reject) => server.close(err => err ? reject(err) : resolve()));
    }
  });
});
