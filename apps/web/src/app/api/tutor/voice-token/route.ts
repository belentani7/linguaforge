import { NextResponse } from "next/server";
import { getLesson } from "@/content/curriculum";
import { voiceTokenRequestSchema } from "@/lib/schemas";
import { buildVoiceInstructions } from "@/lib/voice/instructions";
import { clientKey, consume } from "@/lib/tutor/rate-limit";


/**
 * POST /api/tutor/voice-token
 * Crea un secreto efímero para la API Realtime de OpenAI. La clave real nunca sale del servidor.
 * Sin OPENAI_API_KEY responde mode "browser": el cliente usa la voz nativa del navegador.
 */
export async function POST(req: Request) {
  const limit = consume(clientKey(req.headers));
  if (!limit.allowed) {
    return NextResponse.json({ error: "daily_limit", message: "Límite diario de voz alcanzado." }, { status: 429 });
  }

  const parsed = voiceTokenRequestSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_request", message: "Solicitud no válida." }, { status: 400 });
  }
  const lesson = getLesson(parsed.data.lessonId);
  if (!lesson) {
    return NextResponse.json({ error: "lesson_not_found", message: "Lección no encontrada." }, { status: 404 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ mode: "browser", reason: "no_realtime_key" });
  }

  const model = process.env.OPENAI_REALTIME_MODEL ?? "gpt-realtime";
  const voice = process.env.OPENAI_REALTIME_VOICE ?? "marin";
  const res = await fetch("https://api.openai.com/v1/realtime/client_secrets", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      session: {
        type: "realtime",
        model,
        instructions: buildVoiceInstructions(lesson, parsed.data.locale),
        audio: { output: { voice } },
      },
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ mode: "browser", reason: `realtime_${res.status}` });
  }
  const data = (await res.json()) as { value?: string; expires_at?: number };
  return NextResponse.json({
    mode: "realtime",
    model,
    token: data.value,
    expiresAt: data.expires_at ?? null,
  });
}
