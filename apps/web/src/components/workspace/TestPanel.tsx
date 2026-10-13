"use client";

import { motion } from "framer-motion";
import { CheckCircle2, CircleDashed, XCircle, Loader2 } from "lucide-react";
import type { TestCase, Locale } from "@/content/types";
import type { RunReport } from "@/lib/sandbox/run-tests";
import { useT } from "@/hooks/useLocale";
import { cn } from "@/lib/utils";

export interface TestPanelProps {
  tests: TestCase[];
  report: RunReport | null;
  running: boolean;
  locale: Locale;
}

export function TestPanel({ tests, report, running, locale }: TestPanelProps) {
  const { t } = useT();
  const allPassed = report !== null && report.total > 0 && report.passed === report.total;

  return (
    <section aria-labelledby="tests-title" className="glass rounded-3xl p-5">
      <header className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 id="tests-title" className="text-sm font-semibold">
          {t("testsTitle")}
        </h2>
        {report && (
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-semibold",
              allPassed ? "bg-emerald-500/15 text-emerald-300" : "bg-amber-500/15 text-amber-300",
            )}
            aria-live="polite"
          >
            {report.passed}/{report.total} · {allPassed ? t("testsPassed") : t("testsFailed")}
          </span>
        )}
      </header>

      {running && (
        <p className="flex items-center gap-2 text-sm text-zinc-400" role="status">
          <Loader2 className="size-4 animate-spin" aria-hidden /> {t("running")}
        </p>
      )}

      {!report && !running && <p className="text-sm text-zinc-500">{t("testsPending")}</p>}

      {report?.timedOut && (
        <p role="alert" className="mb-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
          {t("timeout")}
        </p>
      )}

      <ul className="space-y-2">
        {tests.map((test, index) => {
          const outcome = report?.outcomes.find((o) => o.id === test.id);
          const state = running ? "pending" : !outcome ? "idle" : outcome.passed ? "pass" : "fail";
          return (
            <motion.li
              key={test.id}
              layout
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, type: "spring", stiffness: 300, damping: 26 }}
              className={cn(
                "flex items-start gap-3 rounded-2xl border px-3 py-2.5 text-sm transition-colors",
                state === "pass" && "border-emerald-500/30 bg-emerald-500/5",
                state === "fail" && "border-red-500/30 bg-red-500/5",
                (state === "idle" || state === "pending") && "border-white/10 bg-white/[0.02]",
              )}
            >
              <span className="mt-0.5" aria-hidden>
                {state === "pass" && <CheckCircle2 className="size-4 text-emerald-400" />}
                {state === "fail" && <XCircle className="size-4 text-red-400" />}
                {(state === "idle" || state === "pending") && <CircleDashed className="size-4 text-zinc-500" />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-zinc-200">{test.label[locale]}</p>
                <code className="mt-1 block truncate font-mono text-[11px] text-zinc-500">{test.expr}</code>
                {outcome && !outcome.passed && (
                  <p className="mt-1 font-mono text-[11px] text-red-300">
                    {outcome.error ? `Error: ${outcome.error}` : `Esperado ${JSON.stringify(test.equals)} · Obtenido ${outcome.actual}`}
                  </p>
                )}
              </div>
              <span className="sr-only">{state === "pass" ? "OK" : state === "fail" ? "Fallo" : ""}</span>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}
