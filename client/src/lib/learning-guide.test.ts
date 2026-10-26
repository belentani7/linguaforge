import { describe, it, expect } from "vitest";
import { guideReply } from "./learning-guide";

describe("offline learning guide", () => {
  it("returns an attributed, limited glossary translation", () => {
    const answer = guideReply("explain", "¿Qué significa contraseña?");
    expect(answer).toContain("password");
    expect(answer).toContain("Microglosario local");
    expect(answer).not.toContain("certificación");
  });
  it("does not invent a translation for unknown terms", () => {
    const answer = guideReply("explain", "Explícame esferocitosis");
    expect(answer).toContain("no inventa");
    expect(answer).not.toContain("password");
  });
  it("offers an actionable offline exercise", () => {
    expect(guideReply("practice", "Quiero practicar inglés")).toContain("Práctica guiada");
  });
  it("reports formal observations without claiming to grade CEFR", () => {
    const answer = guideReply("review", "Hoy he leído una noticia y quiero entender su origen.");
    expect(answer).toContain("Revisión formal local");
    expect(answer).toContain("No asigno nota CEFR");
  });
  it("handles empty input and respects the input limit", () => {
    expect(guideReply("review", " ")).toContain("Escribe");
    expect(guideReply("review", "x".repeat(7000))).toContain("2000 caracteres");
  });
});
