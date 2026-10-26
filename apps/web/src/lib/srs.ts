/**
 * LinguaForge — deterministic, local-first spaced repetition engine.
 *
 * This schedule is a small, explicit SM-2-inspired heuristic, not a medical,
 * pedagogical or official certification algorithm. No personal data is sent.
 */
export type ReviewGrade = 0 | 3 | 4 | 5;

export type ReviewRecord = {
  repetitions: number;
  ease: number;
  intervalDays: number;
  dueAt: string;
  reviewedAt: string;
};

export type ReviewMap = Record<string, ReviewRecord>;

const DAY_MS = 86_400_000;
export const SRS_STORAGE_KEY = "linguaforge:srs:v1";
export const SRS_CHANGED = "linguaforge:srs-changed";

function validDate(value: unknown): value is string {
  return typeof value === "string" &&
    Number.isFinite(Date.parse(value)) &&
    new Date(value).toISOString() === value;
}

export function parseReviews(raw: string | null, allowedIds: ReadonlySet<string>): ReviewMap {
  if (!raw || raw.length > 250_000) return {};
  let parsed: unknown;
  try { parsed = JSON.parse(raw); } catch { return {}; }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
  const result: ReviewMap = Object.create(null) as ReviewMap;
  for (const [id, value] of Object.entries(parsed)) {
    if (!allowedIds.has(id) || !value || typeof value !== "object" || Array.isArray(value)) continue;
    const r = value as Partial<ReviewRecord>;
    if (!Number.isInteger(r.repetitions) || (r.repetitions ?? -1) < 0 ||
        (r.repetitions ?? 0) > 10000 || typeof r.ease !== "number" ||
        !Number.isFinite(r.ease) || r.ease < 1.3 || r.ease > 3.0 ||
        typeof r.intervalDays !== "number" || !Number.isFinite(r.intervalDays) ||
        r.intervalDays < 0 || r.intervalDays > 36500 ||
        !validDate(r.dueAt) || !validDate(r.reviewedAt)) continue;
    result[id] = {
      repetitions: r.repetitions!,
      ease: r.ease,
      intervalDays: r.intervalDays,
      dueAt: r.dueAt,
      reviewedAt: r.reviewedAt,
    };
  }
  return result;
}

/**
 * SM-2 inspired 4-button scheduler.
 * Again: retry in 10 min. Hard: tomorrow. Good: first day, then six
 * days, then growing interval. Easy: accelerated first/second interval.
 * Review history and due dates are independent of timezone DST offsets.
 */
export function scheduleReview(
  previous: ReviewRecord | undefined,
  grade: ReviewGrade,
  now: Date = new Date(),
): ReviewRecord {
  if (![0, 3, 4, 5].includes(grade)) {
    throw new RangeError("Grade must be 0, 3, 4 or 5");
  }
  if (!Number.isFinite(now.getTime())) throw new RangeError("Invalid review time");

  const oldEase = previous?.ease ?? 2.5;
  const adjustment = 0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02);
  const ease = Math.min(3, Math.max(1.3, Math.round((oldEase + adjustment) * 100) / 100));

  let repetitions = (previous?.repetitions ?? 0) + 1;
  let intervalDays: number;
  if (grade === 0) {
    repetitions = 0;
    intervalDays = 10 / (24 * 60);
  } else if (grade === 3) {
    intervalDays = Math.max(1, Math.round((previous?.intervalDays ?? 1) * 1.2));
  } else if (!previous || previous.repetitions === 0) {
    intervalDays = grade === 5 ? 4 : 1;
  } else if (previous.repetitions === 1) {
    intervalDays = grade === 5 ? 9 : 6;
  } else {
    intervalDays = Math.max(1, Math.round(previous.intervalDays * ease * (grade === 5 ? 1.3 : 1)));
  }
  intervalDays = Math.min(intervalDays, 36500);

  return {
    repetitions,
    ease,
    intervalDays,
    reviewedAt: now.toISOString(),
    dueAt: new Date(now.getTime() + intervalDays * DAY_MS).toISOString(),
  };
}

export function isDue(record: ReviewRecord | undefined, now: Date = new Date()): boolean {
  return !record || Date.parse(record.dueAt) <= now.getTime();
}

export function dueCardIds(
  ids: ReadonlyArray<string>,
  reviews: ReviewMap,
  now: Date = new Date(),
): string[] {
  // Previously seen, due cards first; new material follows in course order.
  const due = ids.filter(id => reviews[id] && isDue(reviews[id], now))
    .sort((a, b) => Date.parse(reviews[a].dueAt) - Date.parse(reviews[b].dueAt));
  return [...due, ...ids.filter(id => !reviews[id])];
}

/** Earliest *upcoming* review. Overdue cards are already shown as pending. */
export function nextReviewAt(
  ids: ReadonlyArray<string>,
  reviews: ReviewMap,
  now: Date = new Date(),
): string | null {
  const cutoff = now.getTime();
  if (!Number.isFinite(cutoff)) throw new RangeError("Invalid current time");
  const future = ids
    .filter(id => reviews[id] && Date.parse(reviews[id].dueAt) > cutoff)
    .map(id => reviews[id].dueAt)
    .sort();
  return future[0] ?? null;
}
