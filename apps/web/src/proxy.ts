import { NextResponse, type NextRequest } from "next/server";
import { LESSONS } from "@/content/curriculum";

const PUBLISHED = new Set(LESSONS.filter((l) => l.status === "publicada").map((l) => l.id));

/**
 * Comprobación en tiempo de petición: las lecciones no publicadas responden 404 real,
 * no un 200 con contenido de error (soft 404), que los buscadores pueden indexar.
 */
export function proxy(request: NextRequest) {
  const lessonId = request.nextUrl.pathname.split("/")[2] ?? "";
  if (!PUBLISHED.has(lessonId)) {
    return NextResponse.rewrite(new URL("/no-encontrado", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/cursos/:lessonId",
};
