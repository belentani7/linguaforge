"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Flame, Star, Trophy, RotateCcw, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LEVELS, LESSONS } from "@/content/curriculum";
import { LOCALES } from "@/content/types";
import { LOCALE_NAMES } from "@/lib/i18n";
import { useHydrated, useT, useUiLocale } from "@/hooks/useLocale";
import { useProgressStore } from "@/store/progressStore";
import { usePrefsStore } from "@/store/prefsStore";
import { cn } from "@/lib/utils";

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 180, damping: 22 }}
      className="glass rounded-3xl p-5"
    >
      <div className="flex items-center gap-2 text-zinc-400">
        {icon}
        <span className="text-xs font-semibold uppercase tracking-widest">{label}</span>
      </div>
      <p className="mt-3 text-3xl font-extrabold tabular-nums">{value}</p>
    </motion.div>
  );
}

export function Dashboard() {
  const { t } = useT();
  const locale = useUiLocale();
  const hydrated = useHydrated();
  const { completed, xp, streakDays, reset } = useProgressStore();
  const prefs = usePrefsStore();

  const published = LESSONS.filter((l) => l.status === "publicada");
  const doneCount = published.filter((l) => completed.includes(l.id)).length;

  return (
    <div className="mx-auto max-w-7xl px-5 pb-20 pt-10">
      <h1 className="mb-8 text-3xl font-extrabold tracking-tight sm:text-4xl">{t("dashboardTitle")}</h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat icon={<Star className="size-4" aria-hidden />} label={t("xp")} value={hydrated ? xp : 0} />
        <Stat icon={<Flame className="size-4" aria-hidden />} label={t("streak")} value={`${hydrated ? streakDays : 0} ${t("days")}`} />
        <Stat icon={<Trophy className="size-4" aria-hidden />} label={t("completedLessons")} value={`${hydrated ? doneCount : 0}/${published.length}`} />
        <div className="glass rounded-3xl p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">{t("langUi")}</p>
          <div className="mt-3 flex flex-wrap gap-1.5" role="group" aria-label={t("langUi")}>
            {LOCALES.map((l) => (
              <button
                key={l}
                type="button"
                aria-pressed={locale === l}
                onClick={() => prefs.setUiLocale(l)}
                className={cn(
                  "rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors",
                  locale === l ? "bg-violet-600 text-white" : "bg-white/5 text-zinc-300 hover:bg-white/10",
                )}
              >
                {LOCALE_NAMES[l]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section aria-labelledby="per-level" className="mt-12 space-y-4">
        <h2 id="per-level" className="text-xl font-bold">
          {t("levelsTitle")}
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {LEVELS.map((level) => {
            const lessons = published.filter((l) => l.level === level.id);
            const done = lessons.filter((l) => completed.includes(l.id)).length;
            const pct = lessons.length ? Math.round((done / lessons.length) * 100) : 0;
            return (
              <div key={level.id} className="glass rounded-3xl p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-semibold">{level.title[locale]}</h3>
                  <span className="text-sm tabular-nums text-zinc-400">{pct}%</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/5" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={level.title[locale]}>
                  <motion.div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ type: "spring", stiffness: 90, damping: 20 }} />
                </div>
                <ul className="mt-4 space-y-1.5 text-sm">
                  {lessons.map((l) => (
                    <li key={l.id}>
                      <Link href={`/cursos/${l.id}`} className="flex items-center justify-between rounded-xl px-2 py-1.5 hover:bg-white/5">
                        <span className="text-zinc-300">{l.title[locale]}</span>
                        <span className={completed.includes(l.id) ? "text-emerald-300" : "text-zinc-500"}>
                          {completed.includes(l.id) ? "✓" : "○"}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-12 rounded-3xl border border-violet-400/20 bg-violet-400/[.055] p-7" aria-labelledby="review-title">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div>
            <h2 id="review-title" className="flex items-center gap-3 text-xl font-bold">
              <BrainCircuit className="h-6 w-6 text-violet-300" aria-hidden="true" />
              {({ es: "Repasa lo aprendido", "pt-BR": "Revise o que aprendeu", ca: "Repassa el que has après" } as const)[locale]}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
              {({ es: "Tarjetas de las lecciones publicadas, repetición espaciada y progreso guardado en este navegador.", "pt-BR": "Cartões das aulas publicadas, repetição espaçada e progresso salvo neste navegador.", ca: "Targetes de les lliçons publicades, repetició espaiada i progrés desat en aquest navegador." } as const)[locale]}
            </p>
          </div>
          <Link href="/repaso" className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white hover:bg-violet-500">
            {({ es: "Abrir repaso →", "pt-BR": "Abrir revisão →", ca: "Obrir repàs →" } as const)[locale]}
          </Link>
        </div>
      </section>

      <section aria-labelledby="reset-title" className="mt-12">
        <h2 id="reset-title" className="sr-only">
          {t("resetProgress")}
        </h2>
        <Button variant="danger" onClick={() => reset()}>
          <RotateCcw aria-hidden /> {t("resetProgress")}
        </Button>
      </section>
    </div>
  );
}
