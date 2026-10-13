import type { Lesson, Locale } from "@/content/types";
import { reviewCode } from "./review";

/**
 * Tutor local: responde sin proveedor externo. Sirve como modo por defecto,
 * como degradación cuando no hay clave de API y como prueba determinista.
 * Nunca entrega la solución completa: guía con pistas escalonadas.
 */

type Intent = "hint" | "review" | "theory" | "tests" | "greeting" | "generic";

const KEYWORDS: Record<Intent, RegExp[]> = {
  hint: [/\b(pista|ayuda|dica|dicas|ajuda|pista)\b|no s[eé] por d[oó]nde|n[ãa]o sei por onde|no sé per on/i],
  review: [/\b(revis\w*|verifica\w*|erro|errores|error|falla|bug|revisa)\b/i],
  tests: [/\b(prueba|pruebas|teste|testes|prova|proves|test|tests|pasa|passa|passou)\b/i],
  theory: [/\b(teor\w*|explica\w*|concepto|conceito|concepte|qu[ée] es|o que [ée]|què és)\b/i],
  greeting: [/^\s*(hola|hey|buenas|ol[áa]|oi|bom dia|bon dia)\b/i],
  generic: [],
};

export function detectIntent(message: string): Intent {
  const order: Intent[] = ["hint", "review", "tests", "theory", "greeting"];
  for (const intent of order) {
    if (KEYWORDS[intent].some((re) => re.test(message))) return intent;
  }
  return "generic";
}

const COPY = {
  es: {
    greeting: "Hola. Trabajemos juntos en esta lección.",
    noHints: "Esta lección no tiene pistas registradas.",
    hintPrefix: "Pista",
    hintOutro: "Pide otra pista si la necesitas. Yo no te daré la solución completa.",
    reviewNone: "Tu código no presenta problemas de estilo ni seguridad detectables. Ahora ejecuta las pruebas.",
    reviewIntro: "He revisado tu código línea por línea:",
    line: "Línea",
    theory: "Idea clave de esta lección:",
    testsHint: "Ejecuta las pruebas con el botón. Si una falla, compara el resultado esperado con el tuyo y revisa el caso indicado.",
    generic: "Dime qué has intentado y qué resultado obtienes. Puedo revisar tu código, darte una pista o explicarte la teoría.",
    objectives: "Objetivos de esta lección:",
  },
  "pt-BR": {
    greeting: "Olá. Vamos trabalhar juntos nesta lição.",
    noHints: "Esta lição não tem dicas registradas.",
    hintPrefix: "Dica",
    hintOutro: "Peça outra dica se precisar. Não vou entregar a solução completa.",
    reviewNone: "Seu código não apresenta problemas de estilo ou segurança detectáveis. Agora execute os testes.",
    reviewIntro: "Revisei seu código linha por linha:",
    line: "Linha",
    theory: "Ideia-chave desta lição:",
    testsHint: "Execute os testes com o botão. Se algum falhar, compare o resultado esperado com o seu e revise o caso indicado.",
    generic: "Conte o que você tentou e qual resultado obteve. Posso revisar seu código, dar uma dica ou explicar a teoria.",
    objectives: "Objetivos desta lição:",
  },
  ca: {
    greeting: "Hola. Treballem junts en aquesta lliçó.",
    noHints: "Aquesta lliçó no té pistes registrades.",
    hintPrefix: "Pista",
    hintOutro: "Demana una altra pista si la necessites. No et donaré la solució completa.",
    reviewNone: "El teu codi no presenta problemes d'estil ni de seguretat detectables. Ara executa les proves.",
    reviewIntro: "He revisat el teu codi línia per línia:",
    line: "Línia",
    theory: "Idea clau d'aquesta lliçó:",
    testsHint: "Executa les proves amb el botó. Si alguna falla, compara el resultat esperat amb el teu i revisa el cas indicat.",
    generic: "Explica'm què has provat i quin resultat obtens. Puc revisar el teu codi, donar-te una pista o explicar la teoria.",
    objectives: "Objectius d'aquesta lliçó:",
  },
} as const satisfies Record<Locale, Record<string, string>>;

export interface LocalTutorInput {
  message: string;
  lesson: Lesson;
  locale: Locale;
  /** Idioma de la teoría que el alumno está leyendo. */
  theoryLocale?: Locale;
  code?: string;
  /** Pistas ya mostradas, para escalar el nivel de ayuda. */
  hintsShown?: number;
}

export function respondLocally(input: LocalTutorInput): string {
  const { lesson, locale, code = "", hintsShown = 0 } = input;
  const copy = COPY[locale];
  const intent = detectIntent(input.message);

  switch (intent) {
    case "greeting":
      return `${copy.greeting}\n\n${copy.objectives}\n- ${lesson.objectives[locale].join("\n- ")}`;

    case "hint": {
      const hints = lesson.hints[locale];
      if (hints.length === 0) return copy.noHints;
      const index = Math.min(hintsShown, hints.length - 1);
      return `${copy.hintPrefix} ${index + 1}/${hints.length}: ${hints[index]}\n\n${copy.hintOutro}`;
    }

    case "review": {
      const findings = reviewCode(code, locale);
      if (findings.length === 0) return copy.reviewNone;
      const lines = findings.slice(0, 6).map((f) => `- ${copy.line} ${f.line}: ${f.message}`);
      return `${copy.reviewIntro}\n${lines.join("\n")}`;
    }

    case "tests":
      return copy.testsHint;

    case "theory": {
      const paragraphs = lesson.theory[input.theoryLocale ?? locale];
      return `${copy.theory}\n${paragraphs[0]}`;
    }

    default:
      return copy.generic;
  }
}

/** Fragmenta una respuesta en trozos para simular streaming fiable en el modo local. */
export function chunkText(text: string, size = 12): string[] {
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += size) chunks.push(text.slice(i, i + size));
  return chunks;
}
