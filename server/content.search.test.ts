import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {} as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("content.search", () => {
  it("rejects queries shorter than two characters", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.content.search({ query: "a" })).rejects.toMatchObject({
      code: "BAD_REQUEST",
    });
  });

  it("returns an honest empty result when no database is configured", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.content.search({ query: "subjuntivo" });
    expect(result).toEqual({ vocabulary: [], lessons: [] });
  });
});
