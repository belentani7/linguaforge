"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { streamTutor, TutorStreamError } from "@/lib/tutor/client-stream";
import { useT } from "@/hooks/useLocale";
import { useIaStore, type ChatTurn } from "@/store/iaStore";
import type { Lesson, Locale } from "@/content/types";

export interface TutorChatProps {
  lesson: Lesson;
  code: string;
  codeLocale: Locale;
  theoryLocale: Locale;
  chatLocale: Locale;
  /** Se llama con cada respuesta completa para que la voz del navegador la lea si está activa. */
  onAssistantReply?: (text: string) => void;
}

let idCounter = 0;
const nextId = () => `t-${Date.now().toString(36)}-${(idCounter++).toString(36)}`;

export function TutorChat({ lesson, code, codeLocale, theoryLocale, chatLocale, onAssistantReply }: TutorChatProps) {
  const { t } = useT();
  const turns = useIaStore((s) => s.turns);
  const streaming = useIaStore((s) => s.streaming);
  const addTurn = useIaStore((s) => s.addTurn);
  const appendToLast = useIaStore((s) => s.appendToLast);
  const setStreaming = useIaStore((s) => s.setStreaming);
  const hintsShown = useIaStore((s) => s.hintsShown);
  const incrementHints = useIaStore((s) => s.incrementHints);
  const clearChat = useIaStore((s) => s.clearChat);

  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Al cambiar de lección o de idioma de chat, se reinicia la conversación con el saludo.
  useEffect(() => {
    clearChat({ id: "welcome", role: "assistant", content: t("chatWelcome") });
    return () => abortRef.current?.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.id, chatLocale]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [turns]);

  async function send(message: string) {
    const trimmed = message.trim();
    if (!trimmed || streaming) return;
    setError(null);

    const userTurn: ChatTurn = { id: nextId(), role: "user", content: trimmed };
    const assistantTurn: ChatTurn = { id: nextId(), role: "assistant", content: "" };
    const history = [...useIaStore.getState().turns, userTurn]
      .filter((turn) => turn.id !== "welcome")
      .map((turn) => ({ role: turn.role, content: turn.content }));

    addTurn(userTurn);
    addTurn(assistantTurn);
    if (/pista|hint|dica|ajuda/i.test(trimmed)) incrementHints();
    setStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const full = await streamTutor(
        {
          lessonId: lesson.id,
          messages: history.slice(-12),
          chatLocale,
          theoryLocale,
          codeLocale,
          code,
          hintsShown,
        },
        (delta) => appendToLast(delta),
        controller.signal,
      );
      onAssistantReply?.(full);
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setError(err instanceof TutorStreamError && err.status === 429 ? err.message : t("chatError"));
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = input;
    setInput("");
    void send(value);
  }

  return (
    <section aria-labelledby="chat-title" className="glass flex h-full min-h-[420px] flex-col rounded-3xl">
      <header className="flex items-center justify-between border-b border-white/10 px-5 py-3">
        <h2 id="chat-title" className="flex items-center gap-2 text-sm font-semibold">
          <Bot className="size-4 text-violet-300" aria-hidden /> {t("chatTitle")}
        </h2>
        <span className="text-xs text-zinc-500">{streaming ? "…" : null}</span>
      </header>

      <div ref={listRef} role="log" aria-live="polite" aria-relevant="additions" className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        <AnimatePresence initial={false}>
          {turns.map((turn) => (
            <motion.div
              key={turn.id}
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className={turn.role === "user" ? "flex justify-end" : "flex justify-start"}
            >
              <div
                className={
                  turn.role === "user"
                    ? "max-w-[85%] rounded-2xl rounded-br-md bg-violet-600/90 px-4 py-2.5 text-sm text-white shadow-lg"
                    : "max-w-[85%] rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-zinc-100"
                }
              >
                <p className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest opacity-60">
                  {turn.role === "user" ? <User className="size-3" aria-hidden /> : <Bot className="size-3" aria-hidden />}
                  {turn.role === "user" ? "Tú" : "Tutor"}
                </p>
                <p className="whitespace-pre-wrap leading-relaxed">
                  {turn.content || (streaming ? <span className="inline-block h-4 w-2 animate-pulse bg-violet-300 align-middle" aria-label={t("loading")} /> : "")}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {error && (
          <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
            {error}
          </p>
        )}
      </div>

      <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-white/10 p-3">
        <label htmlFor="tutor-input" className="sr-only">
          {t("chatPlaceholder")}
        </label>
        <input
          id="tutor-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("chatPlaceholder")}
          autoComplete="off"
          maxLength={2000}
          className="h-11 flex-1 rounded-xl border border-white/10 bg-black/30 px-4 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-violet-400/60 focus:ring-2 focus:ring-violet-500/30"
        />
        <Button type="submit" size="icon" disabled={streaming || input.trim().length === 0} aria-label={t("chatSend")}>
          <Send aria-hidden />
        </Button>
      </form>
    </section>
  );
}
