import { describe, expect, it } from "vitest";
import { LESSONS, LEVELS } from "@/content/curriculum";
import { LOCALES, type TestCase } from "@/content/types";
import { SOLUTIONS } from "./solutions";

/**
 * Réplica en proceso del runner del Worker (src/lib/sandbox/run-tests.ts).
 * Mantener ambos alineados: si cambia la semántica, cambia aquí también.
 */
const AsyncFunction = Object.getPrototypeOf(async function () {})
  .constructor as new (body: string) => () => Promise<unknown[]>;

async function evaluate(code: string, tests: TestCase[]): Promise<boolean[]> {
  const body =
    code +
    "\n;return [" +
    tests.map(t => "async () => (" + t.expr + ")").join(",") +
    "];";
  const runners = await new AsyncFunction(body)();
  const results: boolean[] = [];
  for (let i = 0; i < tests.length; i++) {
    try {
      const actual = await (runners[i] as () => Promise<unknown>)();
      results.push(JSON.stringify(actual) === JSON.stringify(tests[i].equals));
    } catch {
      results.push(false);
    }
  }
  return results;
}

const published = LESSONS.filter(l => l.status === "publicada");

describe("integridad del currículo", () => {
  it("los identificadores de lección son únicos", () => {
    const ids = LESSONS.map(l => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("cada nivel tiene al menos una lección publicada", () => {
    for (const level of [1, 2, 3, 4] as const) {
      expect(published.some(l => l.level === level)).toBe(true);
    }
  });

  it.each(published.map(l => [l.id, l] as const))(
    "%s tiene contenido completo en los tres idiomas",
    (_id, lesson) => {
      for (const locale of LOCALES) {
        expect(lesson.title[locale].length).toBeGreaterThan(5);
        expect(lesson.summary[locale].length).toBeGreaterThan(20);
        expect(lesson.voiceIntro[locale].length).toBeGreaterThan(10);
        expect(lesson.objectives[locale].length).toBeGreaterThanOrEqual(2);
        expect(lesson.theory[locale].length).toBeGreaterThanOrEqual(3);
        expect(lesson.hints[locale].length).toBeGreaterThanOrEqual(2);
        expect(lesson.starterCode[locale]).toContain("function ");
      }
    }
  );

  it.each(published.map(l => [l.id, l] as const))(
    "%s usa los mismos identificadores en los tres idiomas de código",
    (_id, lesson) => {
      const fnName = /function\s+(\w+)/.exec(lesson.starterCode.es)?.[1];
      expect(fnName).toBeTruthy();
      for (const locale of LOCALES) {
        expect(lesson.starterCode[locale]).toContain(`function ${fnName}(`);
      }
    }
  );

  it.each(published.map(l => [l.id, l] as const))(
    "%s tiene al menos dos pruebas con etiquetas en tres idiomas",
    (_id, lesson) => {
      expect(lesson.tests.length).toBeGreaterThanOrEqual(2);
      const ids = lesson.tests.map(t => t.id);
      expect(new Set(ids).size).toBe(ids.length);
      for (const t of lesson.tests) {
        for (const locale of LOCALES)
          expect(t.label[locale].length).toBeGreaterThan(3);
      }
    }
  );

  it("cada nivel tiene un curso de al menos 4 lecciones publicadas", () => {
    for (const level of LEVELS) {
      const count = published.filter(l => l.level === level.id).length;
      expect(count, `nivel ${level.id}`).toBeGreaterThanOrEqual(4);
    }
  });

  it("el orden global es único y coherente con el nivel", () => {
    const orders = LESSONS.map(l => l.order);
    expect(new Set(orders).size).toBe(orders.length);
    const levelOf = LESSONS.slice()
      .sort((a, b) => a.order - b.order)
      .map(l => l.level);
    expect(levelOf).toEqual(levelOf.slice().sort((a, b) => a - b));
  });

  it("cubre todos los temas de la hoja de ruta original", () => {
    const ids = new Set(LESSONS.map(l => l.id));
    for (const id of [
      "css-moderno",
      "git-flujo",
      "cot-autoevaluacion",
      "sdk-hf",
      "langchain",
      "rag-qdrant",
      "crewai",
      "generative-ui",
      "observabilidad",
    ]) {
      expect(ids.has(id), id).toBe(true);
    }
  });

  it("los minutos estimados son razonables", () => {
    for (const l of LESSONS) {
      expect(l.minutes).toBeGreaterThanOrEqual(10);
      expect(l.minutes).toBeLessThanOrEqual(90);
    }
  });
});

describe("soluciones de referencia", () => {
  it("existe una solución para cada lección publicada", () => {
    for (const lesson of published) {
      expect(
        SOLUTIONS[lesson.id],
        `falta la solución de ${lesson.id}`
      ).toBeTypeOf("string");
    }
  });

  it.each(published.map(l => [l.id, l] as const))(
    "%s: la solución de referencia pasa todas sus pruebas",
    async (_id, lesson) => {
      const results = await evaluate(SOLUTIONS[lesson.id], lesson.tests);
      expect(results).toEqual(lesson.tests.map(() => true));
    }
  );

  it.each(published.map(l => [l.id, l] as const))(
    "%s: el código inicial no pasa las pruebas (no son triviales)",
    async (_id, lesson) => {
      const results = await evaluate(lesson.starterCode.es, lesson.tests);
      expect(results.every(Boolean)).toBe(false);
    }
  );

  it.each(published.map(l => [l.id, l] as const))(
    "%s: el código inicial en portugués y catalán tiene el mismo comportamiento",
    async (_id, lesson) => {
      const es = await evaluate(lesson.starterCode.es, lesson.tests);
      for (const locale of LOCALES) {
        expect(
          await evaluate(lesson.starterCode[locale], lesson.tests)
        ).toEqual(es);
      }
    }
  );
});
