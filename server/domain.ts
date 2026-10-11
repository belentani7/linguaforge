/**
 * Reglas de dominio puras (sin E/S). Son deterministas y se prueban en tests/backend.test.ts.
 *
 * La orientación de nivel es una regla explicable, NO una prueba oficial ni una certificación.
 */

export const CEFR_ORDER = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
export type CefrLevel = (typeof CEFR_ORDER)[number];

/** Mínimo de competencias evaluadas para emitir una orientación. */
export const MIN_DIAGNOSTIC_SKILLS = 3;

/** Bandas sobre la media (0–100). Umbrales inclusivos por la izquierda. */
const LEVEL_BANDS: Array<{ minAverage: number; level: CefrLevel }> = [
  { minAverage: 80, level: "C2" },
  { minAverage: 65, level: "C1" },
  { minAverage: 50, level: "B2" },
  { minAverage: 35, level: "B1" },
  { minAverage: 20, level: "A2" },
  { minAverage: 0, level: "A1" },
];

export type DiagnosticOutcome =
  | { ok: true; level: CefrLevel; averageScore: number; skillCount: number }
  | {
      ok: false;
      reason: "insufficient_skills";
      skillCount: number;
      required: number;
    };

export function recommendLevel(
  scores: Record<string, number>
): DiagnosticOutcome {
  const values = Object.values(scores).filter(value => Number.isFinite(value));
  if (values.length < MIN_DIAGNOSTIC_SKILLS) {
    return {
      ok: false,
      reason: "insufficient_skills",
      skillCount: values.length,
      required: MIN_DIAGNOSTIC_SKILLS,
    };
  }
  const averageScore = Math.round(
    values.reduce((sum, value) => sum + value, 0) / values.length
  );
  const band =
    LEVEL_BANDS.find(candidate => averageScore >= candidate.minAverage) ??
    LEVEL_BANDS[LEVEL_BANDS.length - 1];
  return {
    ok: true,
    level: band.level,
    averageScore,
    skillCount: values.length,
  };
}

/** Día civil (YYYY-MM-DD) de un instante en la zona indicada. */
export function localDayKey(instant: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(instant);
}

/**
 * Racha de días consecutivos con al menos una lección completada.
 * Cuenta desde hoy; si hoy aún no hay actividad, cuenta desde ayer (no se rompe la racha a medianoche).
 */
export function computeStreakDays(
  completedAt: Date[],
  timeZone: string,
  now: Date
): number {
  const days = new Set(completedAt.map(date => localDayKey(date, timeZone)));
  const cursor = new Date(now.getTime());
  if (!days.has(localDayKey(cursor, timeZone)))
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  let streak = 0;
  while (days.has(localDayKey(cursor, timeZone))) {
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return streak;
}

/** XP: 50 por lección completada, 100 por proyecto completado. Regla fija y documentada. */
export const XP_PER_LESSON = 50;
export const XP_PER_PROJECT = 100;

export function computeXp(
  lessonsCompleted: number,
  projectsCompleted: number
): number {
  return lessonsCompleted * XP_PER_LESSON + projectsCompleted * XP_PER_PROJECT;
}
