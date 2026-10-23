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

/** Choose an installed voice with the *exact* BCP-47 locale.
 * Never prefer a differently accented "neural" voice over an exact match.
 * Users must add a compatible voice before text is spoken.
 */
export function chooseVoiceForLocale(
  voices: ReadonlyArray<SpeechSynthesisVoice>,
  locale: string,
): SpeechSynthesisVoice | undefined {
  const requested = locale.replace(/_/g, "-").toLowerCase();
  const matching = voices.filter(
    (voice) => voice.lang.replace(/_/g, "-").toLowerCase() === requested,
  );
  return matching.sort((a, b) => {
    const isNatural = (voice: SpeechSynthesisVoice) =>
      /natural|premium|enhanced|neural/i.test(voice.name) ? 1 : 0;
    return isNatural(b) - isNatural(a);
  })[0];
}

export function pickVoice(locale: Locale): SpeechSynthesisVoice | undefined {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return undefined;
  return chooseVoiceForLocale(window.speechSynthesis.getVoices(), SPEECH_LANG[locale]);
}

/** False = no matching regional voice; caller must present a visible text fallback. */
export function speak(text: string, locale: Locale, onEnd?: () => void): boolean {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return false;
  const voice = pickVoice(locale);
  if (!voice || !text.trim()) return false;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = SPEECH_LANG[locale];
  utter.voice = voice;
  utter.rate = 0.98;
  utter.pitch = 1;
  if (onEnd) utter.onend = onEnd;
  window.speechSynthesis.speak(utter);
  return true;
}

export function stopSpeaking(): void {
  if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
}
