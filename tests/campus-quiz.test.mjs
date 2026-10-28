import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { answerClass, parseQuiz } from "../campus/quiz-logic.mjs";

const fixture = [
  { pregunta: "¿Qué es TMX?", opciones: ["Un formato", "Un navegador", "Otro"], correcta: 0, explicacion: "Memoria de traducción." },
  { pregunta: "¿Qué significa MT?", opciones: ["Traducción automática", "Maratón"], correcta: 0, explicacion: "Traducción automática." },
];

describe("LinguaForge offline campus quiz", () => {
  it("accepts the course's actual questions with safe text fields", () => {
    const questions = parseQuiz(JSON.parse(readFileSync(new URL("../campus/cursos/forja-linguistica/quiz.json", import.meta.url), "utf8")));
    expect(questions.length).toBeGreaterThanOrEqual(3);
    expect(questions.every(q => q.opciones.length >= 2)).toBe(true);
  });
  it("rejects malformed or injected quiz data instead of creating DOM content", () => {
    expect(() => parseQuiz(null)).toThrow();
    expect(() => parseQuiz([])).toThrow();
    expect(() => parseQuiz([{ ...fixture[0], correcta: 9 }])).toThrow();
    expect(() => parseQuiz([{ ...fixture[0], opciones: ["OK", null] }])).toThrow();
    expect(() => parseQuiz([{ ...fixture[0], explicacion: "" }])).toThrow();
    expect(() => parseQuiz(fixture)).not.toThrow();
  });
  it("highlights only the right answer and the selected wrong answer", () => {
    expect([0, 1, 2].map(i => answerClass(i, 1, 0))).toEqual(["correcta", "fallo", ""]);
    expect([0, 1, 2].map(i => answerClass(i, 0, 0))).toEqual(["correcta", "", ""]);
  });
  it("keeps a keyboard-accessible, reusable quiz without unsafe HTML insertion", () => {
    const html = readFileSync(new URL("../campus/index.html", import.meta.url), "utf8");
    const browser = readFileSync(new URL("../campus/app.js", import.meta.url), "utf8");
    expect(html).toContain('<script type="module" src="app.js"></script>');
    expect(html).toContain('class="quiz-titulo" tabindex="-1"');
    expect(html).toContain('class="feedback" role="status" aria-live="polite"');
    expect(browser).toContain('next.textContent = "Repetir quiz"');
    expect(browser).toContain("title.focus({ preventScroll: true })");
    expect(browser).toContain("options.replaceChildren()");
    expect(browser).not.toContain("innerHTML");
  });
});
