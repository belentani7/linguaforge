"use client";

import { LOCALES, type Locale } from "@/content/types";
import { LOCALE_NAMES } from "@/lib/i18n";
import { useT } from "@/hooks/useLocale";

export interface LanguageTriadProps {
  codeLocale: Locale;
  theoryLocale: Locale;
  chatLocale: Locale;
  onCodeLocale: (l: Locale) => void;
  onTheoryLocale: (l: Locale) => void;
  onChatLocale: (l: Locale) => void;
}

/** Aprendizaje cruzado: código, teoría y chat pueden estar cada uno en un idioma distinto. */
export function LanguageTriad(props: LanguageTriadProps) {
  const { t } = useT();
  const fields: Array<{ id: string; label: string; value: Locale; onChange: (l: Locale) => void }> = [
    { id: "lang-code", label: t("langCode"), value: props.codeLocale, onChange: props.onCodeLocale },
    { id: "lang-theory", label: t("langTheory"), value: props.theoryLocale, onChange: props.onTheoryLocale },
    { id: "lang-chat", label: t("langChat"), value: props.chatLocale, onChange: props.onChatLocale },
  ];

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
      {fields.map((f) => (
        <label key={f.id} htmlFor={f.id} className="flex flex-col gap-1 text-[11px] font-medium uppercase tracking-wider text-zinc-400">
          {f.label}
          <select
            id={f.id}
            value={f.value}
            onChange={(e) => f.onChange(e.target.value as Locale)}
            className="h-10 rounded-xl border border-white/10 bg-black/40 px-3 text-sm normal-case tracking-normal text-zinc-100 outline-none focus:border-violet-400/60 focus:ring-2 focus:ring-violet-500/30"
          >
            {LOCALES.map((l) => (
              <option key={l} value={l}>
                {LOCALE_NAMES[l]}
              </option>
            ))}
          </select>
        </label>
      ))}
    </div>
  );
}
