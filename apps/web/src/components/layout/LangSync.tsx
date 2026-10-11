"use client";

import { useEffect } from "react";
import { useUiLocale } from "@/hooks/useLocale";

/** Mantiene <html lang> y dir alineados con el idioma de interfaz elegido. */
export function LangSync() {
  const locale = useUiLocale();
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = "ltr";
  }, [locale]);
  return null;
}
