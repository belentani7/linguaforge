import { NextResponse } from "next/server";
import { LEVELS, LESSONS } from "@/content/curriculum";

/**
 * GET /api/courses → plan de estudios público (sin pruebas ni soluciones).
 * Contrato estable para el frontend y para integraciones externas.
 */
export async function GET() {
  const lessons = LESSONS.map((l) => ({
    id: l.id,
    level: l.level,
    order: l.order,
    status: l.status,
    minutes: l.minutes,
    title: l.title,
    summary: l.summary,
  }));
  return NextResponse.json({ levels: LEVELS, lessons }, { headers: { "Cache-Control": "public, max-age=300" } });
}
