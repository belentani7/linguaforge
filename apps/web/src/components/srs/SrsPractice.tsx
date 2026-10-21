"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import { BrainCircuit, Clock3, RotateCcw, Download, ChevronRight, CheckCircle2 } from "lucide-react";
import { LESSONS } from "@/content/curriculum";
import { useUiLocale } from "@/hooks/useLocale";
import type { Locale } from "@/content/types";
import {
  SRS_CHANGED,
  SRS_STORAGE_KEY,
  type ReviewGrade,
  dueCardIds,
  nextReviewAt,
  parseReviews,
  scheduleReview,
} from "@/lib/srs";

const published = LESSONS.filter(lesson => lesson.status === "publicada");
const ids = published.map(lesson => lesson.id);
const allowedIds = new Set(ids);
const translations: Record<Locale, {
  eyebrow: string; title: string; description: string; available: string; reviewed: string;
  next: string; question: string; answer: string; reveal: string; again: string; hard: string;
  good: string; easy: string; empty: string; reviewLater: string; goCourse: string;
  export: string; reset: string; confirm: string; privacy: string; storageError: string;
  level: string; nextCard: string; progress: string;
}> = {
  es: {
    eyebrow: "LINGUAFORGE / REPASO INTELIGENTE", title: "La práctica que permanece.",
    description: "Repasa los conceptos de las lecciones publicadas con tarjetas y repetición espaciada. Estudia, revela la respuesta y califica cuánto recuerdas.",
    available: "Tarjetas pendientes", reviewed: "Repasadas", next: "Siguiente revisión",
    question: "Recuerda el concepto", answer: "Resumen para comprobar", reveal: "Revelar respuesta",
    again: "Otra vez", hard: "Difícil", good: "Bien", easy: "Fácil",
    empty: "No tienes repasos pendientes ahora.", reviewLater: "Vuelve cuando venza la siguiente tarjeta.",
    goCourse: "Ver curso completo", export: "Exportar progreso JSON",
    reset: "Reiniciar repaso", confirm: "¿Eliminar solo las revisiones SRS guardadas en este navegador?",
    privacy: "Las revisiones se guardan exclusivamente en este navegador. No se envían a un servidor, no otorgan títulos y se pueden borrar.",
    storageError: "No podemos guardar los repasos en este navegador. Revisa sus permisos o usa una ventana sin restricciones.",
    level: "Nivel", nextCard: "Ver siguiente tarjeta", progress: "Continuar estudiando",
  },
  "pt-BR": {
    eyebrow: "LINGUAFORGE / REVISÃO INTELIGENTE", title: "O aprendizado que permanece.",
    description: "Revise os conceitos das aulas publicadas com cartões e repetição espaçada. Estude, revele a resposta e avalie o que lembrou.",
    available: "Cartões pendentes", reviewed: "Revisados", next: "Próxima revisão",
    question: "Lembre-se do conceito", answer: "Resumo para conferência", reveal: "Revelar resposta",
    again: "De novo", hard: "Difícil", good: "Bom", easy: "Fácil",
    empty: "Nenhuma revisão pendente agora.", reviewLater: "Volte quando o próximo cartão vencer.",
    goCourse: "Ver curso completo", export: "Exportar progresso JSON",
    reset: "Reiniciar revisões", confirm: "Excluir apenas as revisões SRS deste navegador?",
    privacy: "As revisões ficam somente neste navegador. Não são enviadas a servidores, não conferem títulos e podem ser apagadas.",
    storageError: "Não foi possível salvar neste navegador. Verifique as permissões.",
    level: "Nível", nextCard: "Próximo cartão", progress: "Continuar estudando",
  },
  ca: {
    eyebrow: "LINGUAFORGE / REPÀS INTEL·LIGENT", title: "L'aprenentatge que perdura.",
    description: "Repassa conceptes de les lliçons publicades amb targetes i repetició espaiada. Estudia, revela la resposta i puntua el record.",
    available: "Targetes pendents", reviewed: "Repassades", next: "Pròxim repàs",
    question: "Recorda el concepte", answer: "Resum per comprovar", reveal: "Revelar resposta",
    again: "Una altra vegada", hard: "Difícil", good: "Bé", easy: "Fàcil",
    empty: "Ara no tens repassos pendents.", reviewLater: "Torna quan toqui la següent targeta.",
    goCourse: "Veure el curs complet", export: "Exportar progrés JSON",
    reset: "Reiniciar repàs", confirm: "Vols esborrar només els repassos SRS d'aquest navegador?",
    privacy: "Els repassos es desen només en aquest navegador. No s'envien a cap servidor, no atorguen títols i es poden esborrar.",
    storageError: "No podem desar els repassos en aquest navegador. Comprova'n els permisos.",
    level: "Nivell", nextCard: "Targeta següent", progress: "Continuar estudiant",
  },
};

function subscribe(notify: () => void) {
  window.addEventListener("storage", notify);
  window.addEventListener(SRS_CHANGED, notify);
  return () => {
    window.removeEventListener("storage", notify);
    window.removeEventListener(SRS_CHANGED, notify);
  };
}

function storageSnapshot(): string {
  try { return window.localStorage.getItem(SRS_STORAGE_KEY) ?? "{}"; }
  catch { return "{}"; }
}

function storeReviews(raw: string) {
  try {
    window.localStorage.setItem(SRS_STORAGE_KEY, raw);
    window.dispatchEvent(new Event(SRS_CHANGED));
    return true;
  } catch { return false; }
}

export function SrsPractice() {
  const locale = useUiLocale();
  const t = translations[locale];
  const raw = useSyncExternalStore(subscribe, storageSnapshot, () => "{}");
  const reviews = useMemo(() => parseReviews(raw, allowedIds), [raw]);
  const [revealed, setRevealed] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // Stable per-render 'now'; actions use a new Date so actual review times are fresh.
  const now = new Date();
  const availableIds = dueCardIds(ids, reviews, now);
  const focusedId = selectedId && availableIds.includes(selectedId) ? selectedId : availableIds[0];
  const lesson = published.find(item => item.id === focusedId);
  const count = ids.filter(id => reviews[id]).length;
  const nextDate = nextReviewAt(ids, reviews);

  const grade = (score: ReviewGrade) => {
    if (!lesson) return;
    const next = scheduleReview(reviews[lesson.id], score);
    const updated = { ...reviews, [lesson.id]: next };
    if (!storeReviews(JSON.stringify(updated))) {
      setStorageError(true);
      return;
    }
    setStorageError(false);
    setSelectedId(null);
    setRevealed(false);
  };

  const exportJson = () => {
    const data = JSON.stringify({
      version: 1, exportedAt: new Date().toISOString(),
      description: "LinguaForge SRS: local-only conceptual review history",
      reviews,
    }, null, 2);
    const url = URL.createObjectURL(new Blob([data], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "linguaforge-srs.json";
    a.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const reset = () => {
    if (!window.confirm(t.confirm)) return;
    if (!storeReviews("{}")) setStorageError(true);
    else { setStorageError(false); setSelectedId(null); setRevealed(false); }
  };

  return (
    <div className="mx-auto max-w-6xl px-5 pb-20 pt-12">
      <section className="relative overflow-hidden rounded-3xl border border-violet-300/20 bg-gradient-to-br from-violet-950/40 via-[#0e1120] to-cyan-950/20 p-7 sm:p-11">
        <span className="text-xs font-semibold tracking-[.18em] text-violet-300">{t.eyebrow}</span>
        <div className="mt-8 grid items-end gap-6 md:grid-cols-[1.6fr_1fr]">
          <div>
            <h1 className="max-w-2xl text-4xl font-extrabold tracking-tight text-white sm:text-6xl">{t.title}</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-300">{t.description}</p>
          </div>
          <div className="flex h-28 w-28 items-center justify-center rounded-[32px] border border-cyan-300/30 bg-cyan-300/10 text-cyan-300 shadow-[0_0_65px_rgba(34,211,238,.11)] md:ml-auto">
            <BrainCircuit aria-hidden="true" className="h-14 w-14" strokeWidth={1.25}/>
          </div>
        </div>
        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5"><p className="text-xs text-zinc-400">{t.available}</p><p className="mt-3 text-3xl font-bold tabular-nums text-white">{availableIds.length}</p></div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5"><p className="text-xs text-zinc-400">{t.reviewed}</p><p className="mt-3 text-3xl font-bold tabular-nums text-white">{count}/{ids.length}</p></div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5"><p className="text-xs text-zinc-400">{t.next}</p><p className="mt-3 flex items-center gap-2 text-sm font-semibold text-cyan-200"><Clock3 size={16} aria-hidden="true"/>{nextDate ? new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(nextDate)) : "—"}</p></div>
        </div>
      </section>
      <section className="mx-auto mt-8 max-w-4xl" aria-label={t.question}>
        {lesson ? (
          <article className="glass rounded-3xl p-7 sm:p-11" key={lesson.id}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="font-mono text-xs uppercase tracking-widest text-cyan-300">{t.level} {lesson.level}</span>
              <span className="text-xs text-zinc-500">{availableIds.indexOf(lesson.id) + 1} / {availableIds.length}</span>
            </div>
            <h2 className="mt-8 text-2xl font-bold leading-snug tracking-tight sm:text-4xl">{lesson.title[locale]}</h2>
            <p className="mt-5 text-sm leading-7 text-zinc-400">{t.question} — {lesson.objectives[locale][0]}</p>
            {revealed ? (
              <div className="mt-9 border-t border-white/10 pt-8" aria-live="polite">
                <p className="mb-3 text-xs font-bold tracking-[.16em] text-violet-300 uppercase">{t.answer}</p>
                <p className="text-base leading-8 text-zinc-200">{lesson.summary[locale]}</p>
                <ul className="mt-6 list-inside list-disc space-y-2 text-sm leading-7 text-zinc-300">
                  {lesson.objectives[locale].map(item => <li key={item}>{item}</li>)}
                </ul>
                <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {([
                    [0, t.again, "border-rose-400/50 text-rose-200 hover:bg-rose-400/10"],
                    [3, t.hard, "border-amber-400/50 text-amber-200 hover:bg-amber-400/10"],
                    [4, t.good, "border-cyan-400/50 text-cyan-100 hover:bg-cyan-400/10"],
                    [5, t.easy, "border-emerald-400/50 text-emerald-200 hover:bg-emerald-400/10"],
                  ] as const).map(([score, label, style]) => (
                    <button key={score} type="button" onClick={() => grade(score)} className={`rounded-xl border px-3 py-3 text-sm font-bold transition-colors ${style}`}>{label}</button>
                  ))}
                </div>
              </div>
            ) : (
              <button type="button" onClick={() => setRevealed(true)} className="mt-10 rounded-xl bg-violet-600 px-6 py-3.5 text-sm font-bold text-white hover:bg-violet-500">{t.reveal} <ChevronRight size={15} aria-hidden="true" className="ml-1 inline"/></button>
            )}
            <Link href={`/cursos/${lesson.id}`} className="mt-7 inline-flex items-center gap-2 text-sm text-zinc-300 underline decoration-white/40 underline-offset-4 hover:text-white">{t.goCourse} <ChevronRight className="h-4 w-4" aria-hidden="true"/></Link>
          </article>
        ) : (
          <div className="glass rounded-3xl p-10 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-300" aria-hidden="true"/>
            <h2 className="mt-5 text-2xl font-bold">{t.empty}</h2>
            <p className="mt-3 text-sm leading-7 text-zinc-400">{t.reviewLater}</p>
            <Link href="/cursos" className="mt-7 inline-flex rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-500">{t.progress}</Link>
          </div>
        )}
      </section>
      <section className="mx-auto mt-10 max-w-4xl border-t border-white/10 pt-8">
        <p className="max-w-2xl text-sm leading-7 text-zinc-400">{t.privacy}</p>
        {storageError && <p role="alert" className="mt-4 rounded-xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-200">{t.storageError}</p>}
        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" onClick={exportJson} className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-4 py-3 text-sm font-semibold text-zinc-200 hover:bg-white/10"><Download size={16} aria-hidden="true"/>{t.export}</button>
          <button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-xl border border-rose-400/20 px-4 py-3 text-sm text-rose-200 hover:bg-rose-400/10"><RotateCcw size={16} aria-hidden="true"/>{t.reset}</button>
        </div>
      </section>
    </div>
  );
}
