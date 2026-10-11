import { beforeEach, describe, expect, it } from "vitest";
import { getLesson } from "@/content/curriculum";
import { LOCALES } from "@/content/types";
import { detectIntent, respondLocally, chunkText } from "@/lib/tutor/local-tutor";
import { reviewCode, summarizeFindings, RULES } from "@/lib/tutor/review";
import { buildSystemPrompt, activeProvider } from "@/lib/tutor/providers";
import { consume, resetLimits, dailyLimit } from "@/lib/tutor/rate-limit";
import { tutorChatRequestSchema, reviewRequestSchema, voiceTokenRequestSchema } from "@/lib/schemas";
import { buildVoiceInstructions } from "@/lib/voice/instructions";
import { UI, t, isLocale } from "@/lib/i18n";
import { previousDay, dayKey } from "@/store/progressStore";

const lesson = getLesson("js-asincrono")!;

describe("revisión de código línea por línea", () => {
  it("detecta var, igualdad débil y console.log con número de línea", () => {
    const code = ["var x = 1;", "if (x == 1) {", "  console.log(x);", "}"].join("\n");
    const findings = reviewCode(code, "es");
    expect(findings.map((f) => [f.line, f.rule])).toEqual([
      [1, "no-var"],
      [2, "strict-equality"],
      [3, "console-log"],
    ]);
  });

  it("marca fetch sin await como error", () => {
    const f = reviewCode("const r = fetch('/api');", "es");
    expect(f[0]).toMatchObject({ rule: "fetch-sin-await", severity: "error" });
  });

  it("no penaliza fetch con await o return", () => {
    expect(reviewCode("const r = await fetch('/api');", "es")).toEqual([]);
    expect(reviewCode("function f(){ return fetch('/api'); }", "es").filter((x) => x.rule === "fetch-sin-await")).toEqual([]);
  });

  it("avisa de JSON.parse sin try y de catch vacío", () => {
    expect(reviewCode("const o = JSON.parse(txt);", "es").map((f) => f.rule)).toContain("json-parse-sin-proteccion");
    expect(reviewCode("try { x(); } catch (e) {}", "es").map((f) => f.rule)).toContain("catch-vacio");
  });

  it("señala claves de API escritas en el código como error", () => {
    const f = reviewCode('const key = "sk-abcdefghijklmnop1234";', "es");
    expect(f.some((x) => x.rule === "clave-api-literal" && x.severity === "error")).toBe(true);
  });

  it("ignora líneas de comentario", () => {
    expect(reviewCode("// var x == y console.log(1)", "es")).toEqual([]);
  });

  it("devuelve el mensaje en el idioma pedido", () => {
    const es = reviewCode("var a = 1;", "es")[0].message;
    const pt = reviewCode("var a = 1;", "pt-BR")[0].message;
    const ca = reviewCode("var a = 1;", "ca")[0].message;
    expect(new Set([es, pt, ca]).size).toBe(3);
  });

  it("cada regla tiene mensajes en los tres idiomas", () => {
    for (const rule of RULES) {
      for (const locale of LOCALES) expect(rule.message[locale].length).toBeGreaterThan(20);
    }
  });

  it("resume hallazgos por severidad", () => {
    const f = reviewCode("var a = 1; console.log(a);", "es");
    expect(summarizeFindings(f, "es")).toBe("0 error(es) y 1 aviso(s).");
  });
});

describe("tutor local (sin proveedor externo)", () => {
  it("clasifica la intención del alumno", () => {
    expect(detectIntent("¿Me das una pista?")).toBe("hint");
    expect(detectIntent("Revisa mi código, hay un error")).toBe("review");
    expect(detectIntent("Explica qué es una promesa")).toBe("theory");
    expect(detectIntent("Las pruebas no pasan")).toBe("tests");
    expect(detectIntent("hola")).toBe("greeting");
    expect(detectIntent("xyz")).toBe("generic");
  });

  it("escala las pistas sin revelar más de las que existen", () => {
    const first = respondLocally({ message: "pista", lesson, locale: "es", hintsShown: 0 });
    const beyond = respondLocally({ message: "pista", lesson, locale: "es", hintsShown: 99 });
    expect(first).toContain(lesson.hints.es[0]);
    expect(beyond).toContain(lesson.hints.es[lesson.hints.es.length - 1]);
  });

  it("responde en el idioma del chat y explica teoría en el idioma de teoría", () => {
    const pt = respondLocally({ message: "pista", lesson, locale: "pt-BR" });
    expect(pt).toContain(lesson.hints["pt-BR"][0]);
    const theory = respondLocally({ message: "explica el concepto", lesson, locale: "es", theoryLocale: "ca" });
    expect(theory).toContain(lesson.theory.ca[0]);
  });

  it("revisa el código aportado por el alumno", () => {
    const answer = respondLocally({ message: "revisa mi código", lesson, locale: "es", code: "var a = 1;" });
    expect(answer).toContain("Línea 1");
  });

  it("chunkText reconstruye exactamente el texto", () => {
    const text = "El tutor responde por fragmentos, sin perder ni un carácter.";
    expect(chunkText(text, 7).join("")).toBe(text);
  });
});

describe("prompt del sistema y voz", () => {
  it("incluye idiomas, reglas pedagógicas y el código del alumno", () => {
    const system = buildSystemPrompt({ lesson, chatLocale: "ca", theoryLocale: "pt-BR", codeLocale: "es", code: "const x = 1;" });
    expect(system).toContain("català");
    expect(system).toContain("português do Brasil");
    expect(system).toContain("No entregues la solución completa");
    expect(system).toContain("const x = 1;");
  });

  it("las instrucciones de voz piden naturalidad y no leer código", () => {
    for (const locale of LOCALES) {
      const text = buildVoiceInstructions(lesson, locale);
      expect(text).toContain("frases cortas");
      expect(text).toContain("No leas listas ni código en voz alta");
    }
  });

  it("sin claves de API el proveedor es local", () => {
    expect(activeProvider({} as NodeJS.ProcessEnv)).toBe("local");
    expect(activeProvider({ OPENAI_API_KEY: "x" } as unknown as NodeJS.ProcessEnv)).toBe("openai");
    expect(activeProvider({ ANTHROPIC_API_KEY: "x" } as unknown as NodeJS.ProcessEnv)).toBe("anthropic");
    expect(activeProvider({ TUTOR_PROVIDER: "local", OPENAI_API_KEY: "x" } as unknown as NodeJS.ProcessEnv)).toBe("local");
  });
});

describe("contratos de entrada (Zod)", () => {
  it("acepta una petición de chat válida y rellena valores por defecto", () => {
    const parsed = tutorChatRequestSchema.parse({ lessonId: "js-asincrono", messages: [{ role: "user", content: "hola" }] });
    expect(parsed.chatLocale).toBe("es");
    expect(parsed.hintsShown).toBe(0);
  });

  it("rechaza idiomas fuera del catálogo, mensajes vacíos y exceso de historial", () => {
    expect(tutorChatRequestSchema.safeParse({ lessonId: "x", messages: [{ role: "user", content: "a" }], chatLocale: "fr" }).success).toBe(false);
    expect(tutorChatRequestSchema.safeParse({ lessonId: "x", messages: [{ role: "user", content: "" }] }).success).toBe(false);
    const many = Array.from({ length: 21 }, () => ({ role: "user" as const, content: "a" }));
    expect(tutorChatRequestSchema.safeParse({ lessonId: "x", messages: many }).success).toBe(false);
  });

  it("limita el tamaño del código y valida la revisión y el token de voz", () => {
    expect(reviewRequestSchema.safeParse({ code: "x".repeat(20001) }).success).toBe(false);
    expect(reviewRequestSchema.parse({ code: "a" }).locale).toBe("es");
    expect(voiceTokenRequestSchema.safeParse({ lessonId: "", locale: "es" }).success).toBe(false);
  });
});

describe("límite de uso diario", () => {
  beforeEach(() => {
    resetLimits();
    process.env.TUTOR_DAILY_LIMIT = "3";
  });

  it("permite hasta el límite y luego bloquea", () => {
    expect(dailyLimit()).toBe(3);
    const now = new Date("2026-10-11T10:00:00Z");
    expect(consume("ip-1", now).allowed).toBe(true);
    expect(consume("ip-1", now).allowed).toBe(true);
    expect(consume("ip-1", now).allowed).toBe(true);
    const blocked = consume("ip-1", now);
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
  });

  it("reinicia al cambiar de día y es independiente por cliente", () => {
    const d1 = new Date("2026-10-11T10:00:00Z");
    const d2 = new Date("2026-10-12T00:10:00Z");
    for (let i = 0; i < 3; i++) consume("ip-2", d1);
    expect(consume("ip-2", d1).allowed).toBe(false);
    expect(consume("ip-2", d2).allowed).toBe(true);
    expect(consume("ip-3", d1).allowed).toBe(true);
    delete process.env.TUTOR_DAILY_LIMIT;
  });
});

describe("internacionalización de la interfaz", () => {
  it("todas las claves existen en los tres idiomas con contenido", () => {
    const keys = Object.keys(UI.es) as Array<keyof typeof UI.es>;
    for (const locale of LOCALES) {
      for (const key of keys) {
        const value = UI[locale][key];
        expect(value, `${locale}.${key}`).toBeDefined();
        expect(String(value).length, `${locale}.${key} vacía`).toBeGreaterThan(0);
      }
      expect(Object.keys(UI[locale]).sort()).toEqual(keys.slice().sort());
    }
  });

  it("t() devuelve la traducción pedida y isLocale valida", () => {
    expect(t("pt-BR", "navCourses")).toBe("Cursos");
    expect(isLocale("ca")).toBe(true);
    expect(isLocale("fr")).toBe(false);
  });
});

describe("fechas de racha", () => {
  it("calcula el día anterior correctamente, también al cruzar meses", () => {
    expect(previousDay("2026-10-11")).toBe("2026-10-10");
    expect(previousDay("2026-03-01")).toBe("2026-02-28");
    expect(dayKey(new Date("2026-10-11T23:59:00Z"))).toBe("2026-10-11");
  });
});
