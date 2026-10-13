"use client";

import { useSyncExternalStore } from "react";
import { DEFAULT_LOCALE, type Locale } from "@/content/types";
import { t as translate, type UiKey } from "@/lib/i18n";
import { usePrefsStore } from "@/store/prefsStore";

const noop = () => () => {};

/** true solo en el cliente tras la hidratación; evita discrepancias con el HTML del servidor. */
export function useHydrated(): boolean {
  return useSyncExternalStore(noop, () => true, () => false);
}

/** Idioma de interfaz. Durante SSR y la primera hidratación devuelve el idioma por defecto. */
export function useUiLocale(): Locale {
  const hydrated = useHydrated();
  const stored = usePrefsStore((s) => s.uiLocale);
  return hydrated ? stored : DEFAULT_LOCALE;
}

export function useT() {
  const locale = useUiLocale();
  return {
    locale,
    t: (key: UiKey) => translate(locale, key),
  };
}

/** Idiomas de contenido (código, teoría, chat), con el mismo mecanismo de hidratación segura. */
export function useContentLocales() {
  const hydrated = useHydrated();
  const prefs = usePrefsStore();
  if (!hydrated) {
    return {
      codeLocale: DEFAULT_LOCALE,
      theoryLocale: DEFAULT_LOCALE,
      chatLocale: DEFAULT_LOCALE,
      setCodeLocale: prefs.setCodeLocale,
      setTheoryLocale: prefs.setTheoryLocale,
      setChatLocale: prefs.setChatLocale,
    };
  }
  return {
    codeLocale: prefs.codeLocale,
    theoryLocale: prefs.theoryLocale,
    chatLocale: prefs.chatLocale,
    setCodeLocale: prefs.setCodeLocale,
    setTheoryLocale: prefs.setTheoryLocale,
    setChatLocale: prefs.setChatLocale,
  };
}
