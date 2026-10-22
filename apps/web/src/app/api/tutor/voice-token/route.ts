import { NextResponse } from "next/server";
import { getLesson } from "@/content/curriculum";
import { voiceTokenRequestSchema } from "@/lib/schemas";
import { buildVoiceInstructions } from "@/lib/voice/instructions";
import { clientKey, consume } from "@/lib/tutor/rate-limit";

const noStore = { "Cache-Control": "no-store" };
const browserFallback = (reason: string) =>
  NextResponse.json({ mode: "browser", reason }, { headers: noStore });

/**
 * POST /api/tutor/voice-token
 * Creates a short-lived Realtime client secret; the provider API key stays server-side.
 * On upstream errors or missing credentials the browser's own speech engine is used.
 */
export async function POST(req: Request) {
  const parsed = voiceTokenRequestSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_request", message: "Solicitud no válida." }, { status: 400, headers: noStore });
  }

  const lesson = getLesson(parsed.data.lessonId);
  if (!lesson || lesson.status !== "publicada") {
    return NextResponse.json({ error: "lesson_not_found", message: "Lección no encontrada." }, { status: 404, headers: noStore });
  }

  const limit = consume(clientKey(req.headers));
  if (!limit.allowed) {
    return NextResponse.json({ error: "daily_limit", message: "Límite diario de voz alcanzado." }, { status: 429, headers: noStore });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return browserFallback("no_realtime_key");

  const model = process.env.OPENAI_REALTIME_MODEL ?? "gpt-realtime";
  const voice = process.env.OPENAI_REALTIME_VOICE ?? "marin";
  let res: Response;
  try {
    res = await fetch("https://api.openai.com/v1/realtime/client_secrets", {
      method: "POST",
      headers: { Authorization: "Bearer " + apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        session: {
          type: "realtime",
          model,
          instructions: buildVoiceInstructions(lesson, parsed.data.locale),
          audio: { output: { voice } },
        },
      }),
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    return browserFallback("realtime_unavailable");
  }

  if (!res.ok) return browserFallback("realtime_" + res.status);

  let data: unknown;
  try {
    data = await res.json();
  } catch {
    return browserFallback("invalid_realtime_token");
  }
  if (!data || typeof data !== "object" ||
      typeof (data as { value?: unknown }).value !== "string" ||
      !(data as { value: string }).value.trim()) {
    return browserFallback("invalid_realtime_token");
  }
  const secret = data as { value: string; expires_at?: unknown };
  return NextResponse.json({
    mode: "realtime",
    model,
    token: secret.value,
    expiresAt: typeof secret.expires_at === "number" ? secret.expires_at : null,
  }, { headers: noStore });
}
