"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_LOCALE, type Locale } from "@/content/types";

/**
 * Preferencias de idioma. El alumno puede estudiar con código en catalán,
 * escuchar la teoría en portugués y chatear en castellano a la vez.
 */
interface PrefsState {
  uiLocale: Locale;
  codeLocale: Locale;
  theoryLocale: Locale;
  chatLocale: Locale;
  setUiLocale: (l: Locale) => void;
  setCodeLocale: (l: Locale) => void;
  setTheoryLocale: (l: Locale) => void;
  setChatLocale: (l: Locale) => void;
}

export const usePrefsStore = create<PrefsState>()(
  persist(
    (set) => ({
      uiLocale: DEFAULT_LOCALE,
      codeLocale: DEFAULT_LOCALE,
      theoryLocale: DEFAULT_LOCALE,
      chatLocale: DEFAULT_LOCALE,
      setUiLocale: (uiLocale) => set({ uiLocale }),
      setCodeLocale: (codeLocale) => set({ codeLocale }),
      setTheoryLocale: (theoryLocale) => set({ theoryLocale }),
      setChatLocale: (chatLocale) => set({ chatLocale }),
    }),
    { name: "linguaforge:prefs", version: 1 },
  ),
);
