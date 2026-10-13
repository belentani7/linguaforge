import { NextResponse } from "next/server";
import { reviewRequestSchema } from "@/lib/schemas";
import { reviewCode, summarizeFindings } from "@/lib/tutor/review";


/** POST /api/tutor/review → { findings, summary }. Revisión determinista línea por línea. */
export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json", message: "El cuerpo debe ser JSON." }, { status: 400 });
  }
  const parsed = reviewRequestSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_request", message: "Código o idioma no válidos." }, { status: 400 });
  }
  const findings = reviewCode(parsed.data.code, parsed.data.locale);
  return NextResponse.json({
    findings,
    summary: summarizeFindings(findings, parsed.data.locale),
  });
}
