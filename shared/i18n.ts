import { LANGUAGE_CATALOG } from "./institution";

export type TranslationKey =
  | "nav.learn" | "nav.languages" | "nav.library" | "nav.labs" | "nav.tutor" | "nav.space"
  | "action.start" | "action.explore" | "action.back" | "status.demo" | "status.available"
  | "a11y.focus" | "a11y.comfort" | "a11y.reduceMotion";

type TranslationMap = Record<TranslationKey, string>;

const base: TranslationMap = {
  "nav.learn": "Aprender", "nav.languages": "Idiomas", "nav.library": "Biblioteca", "nav.labs": "Laboratorios", "nav.tutor": "Tutor", "nav.space": "Mi espacio",
  "action.start": "Empezar", "action.explore": "Explorar", "action.back": "Volver", "status.demo": "Modo demostración", "status.available": "Disponible",
  "a11y.focus": "Modo de enfoque", "a11y.comfort": "Preferencias de lectura", "a11y.reduceMotion": "Reducir movimiento",
};

const english: TranslationMap = {
  "nav.learn": "Learn", "nav.languages": "Languages", "nav.library": "Library", "nav.labs": "Labs", "nav.tutor": "Tutor", "nav.space": "My space",
  "action.start": "Start", "action.explore": "Explore", "action.back": "Back", "status.demo": "Demo mode", "status.available": "Available",
  "a11y.focus": "Focus mode", "a11y.comfort": "Reading preferences", "a11y.reduceMotion": "Reduce motion",
};

const portuguese: TranslationMap = {
  "nav.learn": "Aprender", "nav.languages": "Idiomas", "nav.library": "Biblioteca", "nav.labs": "Laboratórios", "nav.tutor": "Tutor", "nav.space": "Meu espaço",
  "action.start": "Começar", "action.explore": "Explorar", "action.back": "Voltar", "status.demo": "Modo demonstração", "status.available": "Disponível",
  "a11y.focus": "Modo de foco", "a11y.comfort": "Preferências de leitura", "a11y.reduceMotion": "Reduzir movimento",
};

export const UI_TRANSLATIONS: Record<string, TranslationMap> = { es: base, en: english, pt: portuguese };
export const SUPPORTED_INTERFACE_LOCALES = LANGUAGE_CATALOG.map((language) => ({ ...language, translationAvailable: language.code in UI_TRANSLATIONS }));

export function resolveLocale(input?: string | null) {
  const shortLocale = input?.toLocaleLowerCase().split("-")[0] ?? "es";
  return LANGUAGE_CATALOG.some((language) => language.code === shortLocale) ? shortLocale : "es";
}

export function translate(locale: string | null | undefined, key: TranslationKey) {
  const resolved = resolveLocale(locale);
  return (UI_TRANSLATIONS[resolved] ?? base)[key] ?? base[key];
}

export function getLocaleMetadata(locale: string | null | undefined) {
  return LANGUAGE_CATALOG.find((language) => language.code === resolveLocale(locale)) ?? LANGUAGE_CATALOG.find((language) => language.code === "es")!;
}

export function formatRegionalNumber(value: number, locale?: string | null) {
  return new Intl.NumberFormat(getLocaleMetadata(locale).locale).format(value);
}

export function formatRegionalDate(value: Date | number, locale?: string | null) {
  return new Intl.DateTimeFormat(getLocaleMetadata(locale).locale, { day: "numeric", month: "short", year: "numeric" }).format(value);
}
