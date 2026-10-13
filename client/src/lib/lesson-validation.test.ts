import { describe, expect, it } from "vitest";
import { canCompleteLesson } from "./lesson-validation";

describe("lecciones: evitar progreso ficticio", () => {
  it("rechaza intentos vacíos y respuestas demasiado cortas", () => {
    expect(canCompleteLesson("", 0)).toBe(false);
    expect(canCompleteLesson("    ", 0)).toBe(false);
    expect(canCompleteLesson("123456789012", 0)).toBe(false);
  });

  it("no completa si se seleccionó un criterio incorrecto", () => {
    const answer = "Una respuesta real suficientemente explicada.";
    expect(canCompleteLesson(answer, 1)).toBe(false);
    expect(canCompleteLesson(answer, 2)).toBe(false);
    expect(canCompleteLesson(answer, null)).toBe(false);
  });

  it("solo habilita guardar tras actividad y autoevaluación suficiente", () => {
    expect(canCompleteLesson("He escrito una respuesta que explica mi objetivo.", 0)).toBe(true);
  });
});
