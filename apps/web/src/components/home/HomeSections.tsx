"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Brain, Gauge, Languages, Map as MapIcon, Mic, Code2, Trophy } from "lucide-react";
import { BentoGrid, type BentoItem } from "@/components/bento/BentoGrid";
import { LEVELS, LESSONS } from "@/content/curriculum";
import { useT, useUiLocale } from "@/hooks/useLocale";
import { useProgressStore } from "@/store/progressStore";
import { cn } from "@/lib/utils";

function Chips({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((i) => (
        <span key={i} className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-zinc-300">
          {i}
        </span>
      ))}
    </div>
  );
}

export function BentoSection() {
  const { t } = useT();
  const items: BentoItem[] = [
    {
      id: "editor",
      title: t("bentoEditorTitle"),
      body: t("bentoEditorBody"),
      icon: <Code2 aria-hidden />,
      span: "md:col-span-4",
      visual: <Chips items={["Monaco", "pruebas en Worker", "revisión línea a línea"]} />,
    },
    {
      id: "voice",
      title: t("bentoVoiceTitle"),
      body: t("bentoVoiceBody"),
      icon: <Mic aria-hidden />,
      span: "md:col-span-2 md:row-span-2",
      visual: <Chips items={["Español", "Português (BR)", "Català"]} />,
    },
    {
      id: "roadmap",
      title: t("bentoRoadmapTitle"),
      body: t("bentoRoadmapBody"),
      icon: <MapIcon aria-hidden />,
      span: "md:col-span-2",
    },
    {
      id: "languages",
      title: t("langCode") + " · " + t("langTheory") + " · " + t("langChat"),
      body: t("bentoVoiceBody"),
      icon: <Languages aria-hidden />,
      span: "md:col-span-2",
    },
    {
      id: "progress",
      title: t("bentoProgressTitle"),
      body: t("bentoProgressBody"),
      icon: <Trophy aria-hidden />,
      span: "md:col-span-2",
    },
    {
      id: "ai",
      title: t("bentoAiTitle"),
      body: t("bentoAiBody"),
      icon: <Brain aria-hidden />,
      span: "md:col-span-2",
    },
    {
      id: "perf",
      title: t("bentoPerfTitle"),
      body: t("bentoPerfBody"),
      icon: <Gauge aria-hidden />,
      span: "md:col-span-2",
    },
  ];

  return (
    <section aria-labelledby="bento-title" className="mx-auto max-w-7xl px-5 py-16">
      <h2 id="bento-title" className="mb-8 text-2xl font-bold tracking-tight sm:text-3xl">
        {t("bentoTitle")}
      </h2>
      <BentoGrid items={items} />
    </section>
  );
}

export function LevelPath() {
  const { t } = useT();
  const locale = useUiLocale();
  const completed = useProgressStore((s) => s.completed);

  return (
    <section aria-labelledby="levels-title" className="mx-auto max-w-7xl px-5 pb-20">
      <h2 id="levels-title" className="mb-8 text-2xl font-bold tracking-tight sm:text-3xl">
        {t("levelsTitle")}
      </h2>
      <ol className="grid gap-4 md:grid-cols-4">
        {LEVELS.map((level, idx) => {
          const lessons = LESSONS.filter((l) => l.level === level.id);
          const done = lessons.filter((l) => completed.includes(l.id)).length;
          const pct = lessons.length ? Math.round((done / lessons.length) * 100) : 0;
          return (
            <motion.li
              key={level.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: idx * 0.08, type: "spring", stiffness: 140, damping: 20 }}
              className="glass rounded-3xl p-5"
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-violet-300">
                {t("levelLabel")} {level.id}
              </p>
              <h3 className="mt-2 text-base font-semibold leading-snug">{level.title[locale]}</h3>
              <p className="mt-2 text-sm text-zinc-400">{level.description[locale]}</p>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/5" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={level.title[locale]}>
                <motion.div className={cn("h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500")} initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} viewport={{ once: true }} transition={{ type: "spring", stiffness: 90, damping: 20 }} />
              </div>
              <Link href="/cursos" className="mt-4 inline-block text-sm font-medium text-violet-300 hover:text-violet-200">
                {done}/{lessons.length} {t("lessonsDone")} →
              </Link>
            </motion.li>
          );
        })}
      </ol>
    </section>
  );
}
