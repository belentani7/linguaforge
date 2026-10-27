import { afterEach, describe, expect, it, vi } from "vitest";
import { LOCALES } from "@/content/types";
import { SPEECH_LANG } from "@/lib/i18n";
import { chooseVoiceForLocale, isCurrentVoiceSession, speak } from "@/lib/voice/speech";

function voice(name: string, lang: string): SpeechSynthesisVoice {
  return { name, lang, localService: true, default: false, voiceURI: name } as SpeechSynthesisVoice;
}

afterEach(() => vi.unstubAllGlobals());

describe("tutor voice locale fidelity", () => {
  it("selects a matching region before quality hints from other accents", () => {
    const installed = [
      voice("Natural México", "es-MX"),
      voice("English Natural", "en-US"),
      voice("Español España", "es-ES"),
    ];
    expect(chooseVoiceForLocale(installed, "es-ES")?.name).toBe("Español España");
    expect(chooseVoiceForLocale(installed, "ca-ES")).toBeUndefined();
  });

  it("prefers natural voices only among exact-locale candidates", () => {
    const installed = [
      voice("Español estándar", "es-ES"),
      voice("Español Neural", "es_ES"),
      voice("Português Neural", "pt-BR"),
    ];
    expect(chooseVoiceForLocale(installed, "es-ES")?.name).toBe("Español Neural");
    expect(chooseVoiceForLocale(installed, "pt-BR")?.name).toBe("Português Neural");
  });

  it("has a stable BCP-47 locale for every curriculum language", () => {
    expect(LOCALES.map(locale => SPEECH_LANG[locale])).toEqual(["es-ES", "pt-BR", "ca-ES"]);
  });

  it("does not play when only a voice for another language or accent exists", () => {
    const cancel = vi.fn(), synthesize = vi.fn();
    vi.stubGlobal("window", {
      speechSynthesis: { getVoices: () => [voice("Natural México", "es-MX")], cancel, speak: synthesize },
    });
    expect(speak("Hola", "es")).toBe(false);
    expect(synthesize).not.toHaveBeenCalled();
    expect(cancel).not.toHaveBeenCalled();
  });

  it("invalidates callbacks from a previous language session", () => {
    expect(isCurrentVoiceSession(true, 7, 7)).toBe(true);
    expect(isCurrentVoiceSession(false, 7, 7)).toBe(false);
    expect(isCurrentVoiceSession(true, 7, 8)).toBe(false);
  });
});
