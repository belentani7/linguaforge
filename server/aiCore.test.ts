import { describe, expect, it } from "vitest";
import { buildTutorContext, demonstrationTutorResponse, getEducationalAiProvider } from "./aiCore";

const request = {
  supportLanguage: "es",
  targetLanguage: "en",
  cefrLevel: "A2",
  learningGoal: "technology",
  task: "practice" as const,
  message: "Quiero practicar una explicación breve.",
};

describe("AI Core educational fallback", () => {
  it("keeps the learner context explicit and bounded", () => {
    const context = buildTutorContext(request);
    expect(context).toContain("Idioma de apoyo: es");
    expect(context).toContain("Nivel CEFR: A2");
    expect(context).toContain("Mensaje de estudiante: Quiero practicar");
  });

  it("labels the fallback as a demonstration instead of simulating an AI response", () => {
    const response = demonstrationTutorResponse(request);
    expect(response).toContain("Modo demostración del tutor");
    expect(response).toContain("servicio de IA no está disponible");
  });

  it("exposes a selectable local demonstration provider", async () => {
    const provider = getEducationalAiProvider("demonstration");
    const response = await provider.complete(request);
    expect(provider.id).toBe("demonstration");
    expect(response.mode).toBe("demonstration-fallback");
  });
});
