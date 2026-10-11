"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Info, ShieldAlert } from "lucide-react";
import type { ResolvedFinding, Severity } from "@/lib/tutor/review";
import { useT } from "@/hooks/useLocale";
import { cn } from "@/lib/utils";

const ICON: Record<Severity, typeof Info> = {
  error: ShieldAlert,
  warning: AlertTriangle,
  info: Info,
};

const STYLE: Record<Severity, string> = {
  error: "border-red-500/30 bg-red-500/5 text-red-300",
  warning: "border-amber-500/30 bg-amber-500/5 text-amber-200",
  info: "border-sky-500/30 bg-sky-500/5 text-sky-200",
};

export interface ReviewPanelProps {
  findings: ResolvedFinding[];
  /** Llamado al pulsar un hallazgo: sitúa el cursor en la línea correspondiente. */
  onSelect?: (line: number, column: number) => void;
}

/** Revisión del tutor línea por línea. Se actualiza en vivo mientras el alumno escribe. */
export function ReviewPanel({ findings, onSelect }: ReviewPanelProps) {
  const { t } = useT();
  return (
    <section aria-labelledby="review-title" className="glass rounded-3xl p-5">
      <h2 id="review-title" className="mb-3 text-sm font-semibold">
        {t("reviewTitle")}
      </h2>
      {findings.length === 0 ? (
        <p className="text-sm text-emerald-300">{t("reviewEmpty")}</p>
      ) : (
        <ul className="max-h-72 space-y-2 overflow-y-auto pr-1" aria-live="polite">
          <AnimatePresence initial={false}>
            {findings.map((f) => {
              const Icon = ICON[f.severity];
              return (
                <motion.li
                  key={`${f.rule}-${f.line}-${f.column}`}
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 320, damping: 28 }}
                >
                  <button
                    type="button"
                    onClick={() => onSelect?.(f.line, f.column)}
                    className={cn("flex w-full items-start gap-3 rounded-2xl border px-3 py-2.5 text-left text-xs transition-colors hover:brightness-125", STYLE[f.severity])}
                  >
                    <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
                    <span className="min-w-0">
                      <span className="font-mono font-semibold">L{f.line}</span> · <span className="sr-only">{f.severity}: </span>
                      {f.message}
                    </span>
                  </button>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      )}
    </section>
  );
}
