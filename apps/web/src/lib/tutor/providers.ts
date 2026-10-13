import type { Lesson, Locale } from "@/content/types";

/**
 * Adaptadores de modelos de lenguaje. Solo se ejecutan en el servidor (route handlers).
 * Las claves se leen de variables de entorno y nunca se envían al navegador.
 *
 *  - OPENAI_API_KEY     → Chat Completions con streaming (modelo OPENAI_MODEL, por defecto gpt-4o).
 *  - ANTHROPIC_API_KEY  → Messages API con streaming (modelo ANTHROPIC_MODEL).
 *  - ninguna            → tutor local determinista (ver local-tutor.ts).
 */

export type ProviderId = "openai" | "anthropic" | "local";

export function activeProvider(env: NodeJS.ProcessEnv = process.env): ProviderId {
  const forced = env.TUTOR_PROVIDER;
  if (forced === "local") return "local";
  if (forced === "openai" && env.OPENAI_API_KEY) return "openai";
  if (forced === "anthropic" && env.ANTHROPIC_API_KEY) return "anthropic";
  if (env.OPENAI_API_KEY) return "openai";
  if (env.ANTHROPIC_API_KEY) return "anthropic";
  return "local";
}

const LANGUAGE_NAME: Record<Locale, string> = {
  es: "castellano (español de España, neutro)",
  "pt-BR": "português do Brasil",
  ca: "català",
};

export interface TutorContext {
  lesson: Lesson;
  chatLocale: Locale;
  theoryLocale: Locale;
  codeLocale: Locale;
  code?: string;
}

/** Instrucciones de sistema: pedagogía, límites de seguridad y respuesta en el idioma del chat. */
export function buildSystemPrompt(ctx: TutorContext): string {
  const { lesson, chatLocale, theoryLocale, codeLocale, code } = ctx;
  const codeSnippet = code ? code.slice(0, 4000) : "(sin código todavía)";
  return [
    `Eres el tutor de LinguaForge, especializado en desarrollo web para agentes de IA.`,
    `Responde siempre en ${LANGUAGE_NAME[chatLocale]}. Si el alumno escribe en otro idioma, responde en ${LANGUAGE_NAME[chatLocale]} igualmente.`,
    `La teoría de la lección se explicó en ${LANGUAGE_NAME[theoryLocale]} y el código está comentado en ${LANGUAGE_NAME[codeLocale]}; puedes citar términos en cualquiera de esos idiomas.`,
    ``,
    `Lección actual: "${lesson.title[chatLocale]}" (nivel ${lesson.level}).`,
    `Objetivos: ${lesson.objectives[chatLocale].join("; ")}.`,
    ``,
    `Reglas pedagógicas:`,
    `1. Guía con preguntas y pistas graduales. No entregues la solución completa de la lección.`,
    `2. Señala errores con el número de línea y explica el porqué.`,
    `3. Sé breve: máximo 180 palabras salvo que el alumno pida más detalle.`,
    `4. Tu conversación es educativa. No solicites ni almacenes datos personales, contraseñas ni claves de API.`,
    `5. No declares certificaciones oficiales ni asesoramiento jurídico, sanitario o financiero.`,
    `6. Si no estás seguro de algo, dilo y propón cómo verificarlo.`,
    ``,
    `Código actual del alumno:`,
    "```javascript",
    codeSnippet,
    "```",
  ].join("\n");
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/** Lee un cuerpo SSE de OpenAI/Anthropic y emite solo el texto de cada delta. */
async function* readSse(body: ReadableStream<Uint8Array>): AsyncGenerator<string> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let nl: number;
    while ((nl = buffer.indexOf("\n")) >= 0) {
      const line = buffer.slice(0, nl).trim();
      buffer = buffer.slice(nl + 1);
      if (line) yield line;
    }
  }
  if (buffer.trim()) yield buffer.trim();
}

export async function* streamOpenAI(system: string, messages: ChatMessage[], signal?: AbortSignal): AsyncGenerator<string> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    signal,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? "gpt-4o",
      stream: true,
      temperature: 0.4,
      messages: [{ role: "system", content: system }, ...messages],
    }),
  });
  if (!res.ok || !res.body) throw new Error(`openai_${res.status}`);
  for await (const line of readSse(res.body)) {
    if (!line.startsWith("data:")) continue;
    const payload = line.slice(5).trim();
    if (payload === "[DONE]") return;
    try {
      const json = JSON.parse(payload) as { choices?: Array<{ delta?: { content?: string } }> };
      const text = json.choices?.[0]?.delta?.content;
      if (text) yield text;
    } catch {
      /* fragmento no JSON: se ignora */
    }
  }
}

export async function* streamAnthropic(system: string, messages: ChatMessage[], signal?: AbortSignal): AsyncGenerator<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    signal,
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY ?? "",
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL ?? "claude-3-5-sonnet-latest",
      max_tokens: 1024,
      stream: true,
      system,
      messages,
    }),
  });
  if (!res.ok || !res.body) throw new Error(`anthropic_${res.status}`);
  for await (const line of readSse(res.body)) {
    if (!line.startsWith("data:")) continue;
    try {
      const json = JSON.parse(line.slice(5).trim()) as { type?: string; delta?: { type?: string; text?: string } };
      if (json.type === "content_block_delta" && json.delta?.type === "text_delta" && json.delta.text) {
        yield json.delta.text;
      }
    } catch {
      /* ignorar */
    }
  }
}
