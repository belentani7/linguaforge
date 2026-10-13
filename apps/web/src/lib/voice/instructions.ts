import type { Lesson, Locale } from "@/content/types";

const VOICE_STYLE: Record<Locale, string> = {
  es: "Habla en castellano neutro de España, con naturalidad y ritmo conversacional.",
  "pt-BR": "Fale em português do Brasil, com naturalidade e ritmo de conversa, sem sotaque lusitano.",
  ca: "Parla en català central, amb naturalitat i ritme de conversa.",
};

/**
 * Instrucciones para la sesión de voz. Piden voz humana: frases cortas, pausas naturales,
 * sin listas leídas en voz alta y sin decir que eres una IA salvo que el alumno lo pregunte.
 */
export function buildVoiceInstructions(lesson: Lesson, locale: Locale): string {
  return [
    `Eres un tutor humano y cercano de LinguaForge. ${VOICE_STYLE[locale]}`,
    `Lección: "${lesson.title[locale]}". Objetivos: ${lesson.objectives[locale].join("; ")}.`,
    `Reglas: frases cortas, pausas naturales, máximo 3 frases por turno. No leas listas ni código en voz alta.`,
    `Guía con preguntas. No des la solución completa. Si el alumno se equivoca, corrígelo con amabilidad.`,
    `Responde en el idioma en el que te hablen; si no está claro, usa ${locale === "es" ? "castellano" : locale === "ca" ? "català" : "português do Brasil"}.`,
    `No pidas datos personales ni contraseñas.`,
  ].join("\n");
}
