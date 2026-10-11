/**
 * Cliente de streaming para POST /api/tutor. Lee eventos SSE ("data: {...}\n\n")
 * y entrega cada delta de texto a medida que llega.
 */

export interface TutorRequestBody {
  lessonId: string;
  messages: Array<{ role: "user" | "assistant"; content: string }>;
  chatLocale: "es" | "pt-BR" | "ca";
  theoryLocale: "es" | "pt-BR" | "ca";
  codeLocale: "es" | "pt-BR" | "ca";
  code?: string;
  hintsShown?: number;
}

export class TutorStreamError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "TutorStreamError";
  }
}

export async function streamTutor(body: TutorRequestBody, onDelta: (text: string) => void, signal?: AbortSignal): Promise<string> {
  const res = await fetch("/api/tutor", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal,
  });

  if (!res.ok || !res.body) {
    let message = "tutor_unavailable";
    try {
      const data = (await res.json()) as { message?: string };
      if (data.message) message = data.message;
    } catch {
      /* cuerpo no JSON */
    }
    throw new TutorStreamError(message, res.status);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let full = "";

  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let boundary: number;
    while ((boundary = buffer.indexOf("\n\n")) >= 0) {
      const block = buffer.slice(0, boundary);
      buffer = buffer.slice(boundary + 2);
      for (const line of block.split("\n")) {
        if (!line.startsWith("data:")) continue;
        const payload = line.slice(5).trim();
        if (payload === "[DONE]") return full;
        try {
          const event = JSON.parse(payload) as { delta?: string; error?: string };
          if (event.error) throw new TutorStreamError(event.error);
          if (event.delta) {
            full += event.delta;
            onDelta(event.delta);
          }
        } catch (err) {
          if (err instanceof TutorStreamError) throw err;
          /* línea no JSON: se ignora */
        }
      }
    }
  }
  return full;
}
