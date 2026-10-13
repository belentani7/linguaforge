"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, ArrowUpRight, Sparkles } from "lucide-react";
import { LEVELS, LESSONS, getLessonsByLevel } from "@/content/curriculum";
import { useT, useUiLocale } from "@/hooks/useLocale";
import { useProgressStore } from "@/store/progressStore";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function CourseCatalog() {
  const { t } = useT();
  const locale = useUiLocale();
  const completed = useProgressStore((s) => s.completed);
  const totalPublished = LESSONS.filter((l) => l.status === "publicada").length;
  const done = LESSONS.filter((l) => l.status === "publicada" && completed.includes(l.id)).length;

  return (
    <div className="mx-auto max-w-7xl px-5 pb-20 pt-10">
      <header className="mb-10 max-w-3xl">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{t("levelsTitle")}</h1>
        <p className="mt-3 text-zinc-400">
          {done}/{totalPublished} {t("lessonsDone")}
        </p>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5" role="progressbar" aria-valuenow={Math.round((done / totalPublished) * 100)} aria-valuemin={0} aria-valuemax={100} aria-label={t("levelsTitle")}>
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400"
            initial={{ width: 0 }}
            animate={{ width: `${Math.round((done / totalPublished) * 100)}%` }}
            transition={{ type: "spring", stiffness: 80, damping: 20 }}
          />
        </div>
      </header>

      <div className="space-y-12">
        {LEVELS.map((level, li) => {
          const lessons = getLessonsByLevel(level.id);
          return (
            <motion.section
              key={level.id}
              aria-labelledby={`level-${level.id}`}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: li * 0.05, type: "spring", stiffness: 140, damping: 22 }}
            >
              <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-violet-300">
                    {t("levelLabel")} {level.id}
                  </p>
                  <h2 id={`level-${level.id}`} className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
                    {level.title[locale]}
                  </h2>
                  <p className="mt-1 text-sm text-zinc-400">{level.description[locale]}</p>
                </div>
              </div>

              <ol className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {lessons.map((lesson) => {
                  const isDone = completed.includes(lesson.id);
                  return (
                    <li key={lesson.id}>
                      <Link
                        href={`/cursos/${lesson.id}`}
                        className={cn(
                          "glass group relative flex h-full flex-col rounded-3xl p-5 transition-all duration-500 hover:-translate-y-1 hover:border-violet-400/40 hover:shadow-[0_24px_60px_-24px_rgb(139_92_246/0.6)]",
                        )}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-xs text-zinc-500">
                            {String(lesson.order).padStart(2, "0")}
                          </span>
                          {isDone ? (
                            <Badge variant="success">
                              <CheckCircle2 className="size-3" aria-hidden /> {t("completed")}
                            </Badge>
                          ) : (
                            <Badge variant="accent">
                              <Sparkles className="size-3" aria-hidden /> {t("start")}
                            </Badge>
                          )}
                        </div>
                        <h3 className="mt-4 text-base font-semibold leading-snug text-white">{lesson.title[locale]}</h3>
                        <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-400">{lesson.summary[locale]}</p>
                        <div className="mt-5 flex items-center justify-between text-xs text-zinc-500">
                          <span className="inline-flex items-center gap-1">
                            <Clock className="size-3.5" aria-hidden /> {lesson.minutes} {t("minutes")}
                          </span>
                          <span className="inline-flex items-center gap-1 font-semibold text-violet-300 transition-transform duration-300 group-hover:translate-x-0.5">
                            {isDone ? t("review") : t("start")} <ArrowUpRight className="size-3.5" aria-hidden />
                          </span>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </motion.section>
          );
        })}
      </div>
    </div>
  );
}
