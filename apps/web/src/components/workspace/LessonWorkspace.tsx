"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { OnMount } from "@monaco-editor/react";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Clock, Lightbulb, RotateCcw, Play, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CodeEditor } from "./CodeEditor";
import { TestPanel } from "./TestPanel";
import { ReviewPanel } from "./ReviewPanel";
import { LanguageTriad } from "./LanguageTriad";
import { TutorChat } from "@/components/tutor/TutorChat";
import { VoiceTutorPanel } from "@/components/ia/VoiceTutorPanel";
import { getNextLesson } from "@/content/curriculum";
import { LOCALES, type Lesson, type Locale } from "@/content/types";
import { useContentLocales, useT } from "@/hooks/useLocale";
import { runTests, type RunReport } from "@/lib/sandbox/run-tests";
import { reviewCode } from "@/lib/tutor/review";
import { useIaStore } from "@/store/iaStore";
import { useProgressStore, XP_PER_LESSON } from "@/store/progressStore";
import { cn } from "@/lib/utils";

export function LessonWorkspace({ lesson }: { lesson: Lesson }) {
  const { t } = useT();
  const { codeLocale, theoryLocale, chatLocale, setCodeLocale, setTheoryLocale, setChatLocale } = useContentLocales();

  // El código parte del inicial en el idioma elegido. Solo se guarda como "editado" cuando el alumno escribe.
  const [edited, setEdited] = useState<string | null>(null);
  const code = edited ?? lesson.starterCode[codeLocale];

  const [report, setReport] = useState<RunReport | null>(null);
  const [running, setRunning] = useState(false);
  const [hintIndex, setHintIndex] = useState(-1);
  const [banner, setBanner] = useState<string | null>(null);

  const completed = useProgressStore((s) => s.completed.includes(lesson.id));
  const completeLesson = useProgressStore((s) => s.completeLesson);
  const touchDay = useProgressStore((s) => s.touchDay);
  const incrementHints = useIaStore((s) => s.incrementHints);

  const findings = useMemo(() => reviewCode(code, codeLocale), [code, codeLocale]);
  const hints = lesson.hints[theoryLocale];
  const next = getNextLesson(lesson.id);

  // Registra actividad diaria al abrir la lección.
  useEffect(() => {
    touchDay();
  }, [touchDay]);

  async function run() {
    if (running) return;
    setRunning(true);
    setBanner(null);
    const outcome = await runTests(code, lesson.tests);
    setReport(outcome);
    setRunning(false);
    if (outcome.total > 0 && outcome.passed === outcome.total) {
      const first = completeLesson(lesson.id);
      setBanner(first ? t("lessonCompleted") : t("completed"));
    }
  }

  // Ctrl/Cmd+Enter desde Monaco llama siempre a la versión más reciente de run().
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);
  const runRef = useRef(run);
  useEffect(() => {
    runRef.current = run;
  });

  /** Lleva el cursor a la línea señalada por el tutor y devuelve el foco al editor. */
  function revealLine(line: number, column: number) {
    const editor = editorRef.current;
    if (!editor) return;
    editor.setPosition({ lineNumber: line, column });
    editor.revealLineInCenter(line);
    editor.focus();
  }

  function revealHint() {
    const nextIndex = Math.min(hintIndex + 1, hints.length - 1);
    setHintIndex(nextIndex);
    incrementHints();
  }

  function resetCode() {
    setEdited(null);
    setReport(null);
    setBanner(null);
  }

  // Introducción en voz: audio pregrabado por idioma (si existe) y texto para la síntesis del navegador.
  const introSrcs = Object.fromEntries(LOCALES.map((l) => [l, `/audio/voice/${l}/${lesson.id}.mp3`])) as Record<Locale, string>;
  const introText = lesson.voiceIntro;

  return (
    <div className="mx-auto max-w-7xl px-5 pb-16 pt-8">
      <nav aria-label="Ruta de navegación" className="mb-4 text-xs text-zinc-500">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/cursos" className="hover:text-zinc-300">
              {t("navCourses")}
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-zinc-300">
            {t("levelLabel")} {lesson.level}
          </li>
        </ol>
      </nav>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
        {/* ─────────── Columna principal ─────────── */}
        <div className="min-w-0 space-y-6">
          <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 160, damping: 22 }}>
            <div className="flex flex-wrap items-center gap-2">
              <Badge>
                <Clock className="size-3" aria-hidden /> {lesson.minutes} {t("minutes")}
              </Badge>
              {completed && (
                <Badge variant="success">
                  <Trophy className="size-3" aria-hidden /> {t("completed")}
                </Badge>
              )}
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">{lesson.title[theoryLocale]}</h1>
            <p className="mt-2 text-zinc-400">{lesson.summary[theoryLocale]}</p>
          </motion.header>

          <LanguageTriad
            codeLocale={codeLocale}
            theoryLocale={theoryLocale}
            chatLocale={chatLocale}
            onCodeLocale={setCodeLocale}
            onTheoryLocale={setTheoryLocale}
            onChatLocale={setChatLocale}
          />

          {/* Teoría */}
          <section aria-labelledby="theory-title" className="glass rounded-3xl p-6">
            <h2 id="theory-title" className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <BookOpen className="size-4 text-violet-300" aria-hidden /> {t("theory")}
            </h2>
            <div className="space-y-4 text-[15px] leading-relaxed text-zinc-300">
              {lesson.theory[theoryLocale].map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="mt-5 border-t border-white/10 pt-4">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">{t("objectives")}</h3>
              <ul className="mt-2 grid gap-2 sm:grid-cols-3">
                {lesson.objectives[theoryLocale].map((o) => (
                  <li key={o} className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2 text-sm text-zinc-300">
                    {o}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Editor */}
          <section aria-labelledby="workspace-title" className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 id="workspace-title" className="text-sm font-semibold">
                {t("workspace")}
              </h2>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="ghost" onClick={revealHint} disabled={hints.length === 0}>
                  <Lightbulb aria-hidden /> {t("hint")}
                </Button>
                <Button size="sm" variant="outline" onClick={resetCode}>
                  <RotateCcw aria-hidden />
                </Button>
                <Button size="sm" onClick={() => void run()} disabled={running} aria-keyshortcuts="Control+Enter Meta+Enter">
                  <Play aria-hidden /> {running ? t("running") : t("runTests")}
                </Button>
              </div>
            </div>

            {hintIndex >= 0 && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-amber-400/25 bg-amber-400/5 px-4 py-3 text-sm text-amber-100"
                role="note"
              >
                <strong className="mr-1">{t("hint")} {hintIndex + 1}:</strong>
                {hints[hintIndex]}
              </motion.p>
            )}

            <CodeEditor
              value={code}
              onChange={setEdited}
              onRun={() => runRef.current()}
              onEditorReady={(editor) => {
                editorRef.current = editor;
              }}
              ariaLabel={`${t("workspace")}: ${lesson.title[codeLocale]}`}
            />
            <p className="text-[11px] text-zinc-500">Ctrl/⌘ + Enter</p>
          </section>

          {banner && (
            <motion.div
              role="status"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-4"
            >
              <p className="font-semibold text-emerald-200">
                {banner} <span className="text-emerald-400/70">({XP_PER_LESSON} XP)</span>
              </p>
              {next && (
                <Button asChild size="sm" variant="success">
                  <Link href={`/cursos/${next.id}`}>
                    {t("nextLesson")} <ArrowRight aria-hidden />
                  </Link>
                </Button>
              )}
            </motion.div>
          )}

          <div className="grid gap-6 xl:grid-cols-2">
            <TestPanel tests={lesson.tests} report={report} running={running} locale={codeLocale} />
            <ReviewPanel findings={findings} onSelect={revealLine} />
          </div>
        </div>

        {/* ─────────── Columna del tutor ─────────── */}
        <aside aria-label={t("chatTitle")} className={cn("space-y-6 lg:sticky lg:top-24 lg:self-start")}>
          <div className="h-[520px]">
            <TutorChat
              lesson={lesson}
              code={code}
              codeLocale={codeLocale}
              theoryLocale={theoryLocale}
              chatLocale={chatLocale}
            />
          </div>
          <VoiceTutorPanel currentLessonId={lesson.id} defaultLang={chatLocale} introSrcs={introSrcs} introText={introText} />
          <p className="text-[11px] leading-relaxed text-zinc-500">
            {t("aiDisclaimer")} · {t("footerLicense")}
          </p>
        </aside>
      </div>
    </div>
  );
}
