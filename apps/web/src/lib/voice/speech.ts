import { SPEECH_LANG } from "@/lib/i18n";
import type { Locale } from "@/content/types";

/**
 * Utilidades de voz del navegador (modo de respaldo cuando no hay Realtime).
 * Usa SpeechRecognition y speechSynthesis, con la voz del sistema que mejor coincida con el idioma.
 */

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

export interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((e: { resultIndex: number; results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }> }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

export function getRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: SpeechRecognitionCtor; webkitSpeechRecognition?: SpeechRecognitionCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function canUseBrowserVoice(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window && getRecognitionCtor() !== null;
}

/** Elige la voz instalada cuyo idioma coincida; prefiere voces marcadas como "natural" o "premium" por el sistema. */
export function pickVoice(locale: Locale): SpeechSynthesisVoice | undefined {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return undefined;
  const target = SPEECH_LANG[locale].toLowerCase();
  const base = target.split("-")[0];
  const voices = window.speechSynthesis.getVoices();
  const scored = voices
    .map((v) => {
      const lang = v.lang.toLowerCase();
      let score = 0;
      if (lang === target) score += 4;
      else if (lang.startsWith(base)) score += 2;
      if (/natural|premium|enhanced|neural|online/i.test(v.name)) score += 3;
      if (v.localService === false) score += 1;
      return { v, score };
    })
    .filter((x) => x.score >= 2)
    .sort((a, b) => b.score - a.score);
  return scored[0]?.v;
}

export function speak(text: string, locale: Locale, onEnd?: () => void): void {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = SPEECH_LANG[locale];
  utter.rate = 0.98;
  utter.pitch = 1;
  const voice = pickVoice(locale);
  if (voice) utter.voice = voice;
  if (onEnd) utter.onend = onEnd;
  window.speechSynthesis.speak(utter);
}

export function stopSpeaking(): void {
  if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
}
