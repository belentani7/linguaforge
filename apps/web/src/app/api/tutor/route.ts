import { NextResponse } from "next/server";
import { getLesson } from "@/content/curriculum";
import { tutorChatRequestSchema } from "@/lib/schemas";
import { activeProvider, buildSystemPrompt, streamAnthropic, streamOpenAI, type ChatMessage } from "@/lib/tutor/providers";
import { chunkText, respondLocally } from "@/lib/tutor/local-tutor";
import { clientKey, consume } from "@/lib/tutor/rate-limit";


const encoder = new TextEncoder();

function sse(event: unknown): Uint8Array {
  return encoder.encode(`data: ${JSON.stringify(event)}\n\n`);
}

function errorResponse(status: number, error: string, message: string) {
  return NextResponse.json({ error, message }, { status });
}

/**
 * POST /api/tutor
 * Entrada: tutorChatRequestSchema. Salida: text/event-stream con eventos
 * {"delta": "..."} y un marcador final "data: [DONE]".
 */
export async function POST(req: Request) {
  const limit = consume(clientKey(req.headers));
  if (!limit.allowed) {
    return errorResponse(429, "daily_limit", "Has alcanzado el límite diario del tutor. Vuelve mañana.");
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return errorResponse(400, "invalid_json", "El cuerpo debe ser JSON.");
  }

  const parsed = tutorChatRequestSchema.safeParse(json);
  if (!parsed.success) {
    return errorResponse(400, "invalid_request", parsed.error.issues.map((i) => i.message).join("; "));
  }
  const body = parsed.data;
  const lesson = getLesson(body.lessonId);
  if (!lesson || lesson.status !== "publicada") {
    return errorResponse(404, "lesson_not_found", "La lección no existe o aún no está publicada.");
  }

  const lastUser = [...body.messages].reverse().find((m) => m.role === "user");
  const question = lastUser?.content ?? "";
  const provider = activeProvider();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        if (provider === "local") {
          const text = respondLocally({
            message: question,
            lesson,
            locale: body.chatLocale,
            theoryLocale: body.theoryLocale,
            code: body.code,
            hintsShown: body.hintsShown,
          });
          for (const piece of chunkText(text)) {
            controller.enqueue(sse({ delta: piece }));
            await new Promise((r) => setTimeout(r, 18));
          }
        } else {
          const system = buildSystemPrompt({
            lesson,
            chatLocale: body.chatLocale,
            theoryLocale: body.theoryLocale,
            codeLocale: body.codeLocale,
            code: body.code,
          });
          const messages: ChatMessage[] = body.messages;
          const source = provider === "openai" ? streamOpenAI(system, messages, req.signal) : streamAnthropic(system, messages, req.signal);
          for await (const delta of source) {
            controller.enqueue(sse({ delta }));
          }
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      } catch (err) {
        const code = err instanceof Error ? err.message : "unknown";
        controller.enqueue(sse({ error: "provider_error", detail: code }));
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
      "X-Tutor-Provider": provider,
      "X-RateLimit-Remaining": String(limit.remaining),
    },
  });
}
