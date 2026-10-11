/** Idiomas soportados por la plataforma (contenido, voz e interfaz). */
export const LOCALES = ["es", "pt-BR", "ca"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "es";

export type Localized<T = string> = Record<Locale, T>;

/** Caso de prueba: una expresión que se evalúa tras el código del alumno. */
export interface TestCase {
  id: string;
  /** Expresión JavaScript. Puede usar await. */
  expr: string;
  /** Valor esperado, comparado mediante JSON.stringify. */
  equals: unknown;
  label: Localized;
}

export interface Lesson {
  id: string;
  level: 1 | 2 | 3 | 4;
  order: number;
  status: "publicada" | "proximamente";
  minutes: number;
  title: Localized;
  summary: Localized;
  objectives: Localized<string[]>;
  /** Teoría en párrafos. Se muestra en el idioma de teoría elegido por el alumno. */
  theory: Localized<string[]>;
  /** Código inicial. Mismos identificadores en todos los idiomas; cambian los comentarios. */
  starterCode: Localized;
  tests: TestCase[];
  hints: Localized<string[]>;
  /** Frase que el tutor de voz puede usar como introducción. */
  voiceIntro: Localized;
}

export interface OutlineItem {
  id: string;
  level: 1 | 2 | 3 | 4;
  title: Localized;
}

export interface Level {
  id: 1 | 2 | 3 | 4;
  title: Localized;
  description: Localized;
  outline: OutlineItem[];
}
