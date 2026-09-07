import { describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn().mockResolvedValue({
    model: "gpt-5-mini",
    choices: [
      {
        message: {
          content: "El pretérito expresa una acción terminada en el pasado.",
        },
      },
    ],
  }),
}));

vi.mock("./db", async importOriginal => {
  const actual = await importOriginal<typeof import("./db")>();
  return {
    ...actual,
    getCoachRequestsToday: vi.fn().mockResolvedValue(0),
    recordCoachRequest: vi.fn().mockResolvedValue(undefined),
  };
});

import { invokeLLM } from "./_core/llm";
import { getCoachRequestsToday } from "./db";
import { appRouter } from "./routers";

function createContext(): TrpcContext {
  return {
    user: {
      id: 19,
      openId: "coach-learner",
      email: "coach@example.com",
      name: "Coach Learner",
      loginMethod: "test",
      nativeLanguageCode: "es",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("coach.respond", () => {
  it("rejects prompts that are too short before calling a model", async () => {
    const caller = appRouter.createCaller(createContext());
    await expect(
      caller.coach.respond({
        targetLanguageCode: "en",
        level: "A1",
        task: "explain",
        prompt: "corto",
      })
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("rejects requests over the daily quota before calling a model", async () => {
    vi.mocked(getCoachRequestsToday).mockResolvedValueOnce(12);
    const caller = appRouter.createCaller(createContext());

    await expect(
      caller.coach.respond({
        targetLanguageCode: "en",
        level: "A2",
        task: "practice",
        prompt:
          "Propón un ejercicio breve para practicar conectores en inglés.",
      })
    ).rejects.toMatchObject({ code: "TOO_MANY_REQUESTS" });

    expect(invokeLLM).not.toHaveBeenCalled();
  });

  it("returns a bounded educational response with an explicit disclaimer", async () => {
    const caller = appRouter.createCaller(createContext());
    const result = await caller.coach.respond({
      targetLanguageCode: "en",
      level: "A2",
      task: "explain",
      prompt: "Explica la diferencia entre past simple y present perfect.",
    });
    expect(result).toMatchObject({
      model: "gpt-5-mini",
      task: "explain",
      remainingToday: 11,
    });
    expect(result.answer).toContain("pretérito");
    expect(result.disclaimer).toContain("IA");
  });
});
