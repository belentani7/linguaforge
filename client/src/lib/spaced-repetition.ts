/** Browser-local SRS for completed LinguaForge lessons.
 * Never stores answer text or personal profile data. Scope is an authenticated learner ID.
 */
export type ReviewRating = "again" | "hard" | "good" | "easy";

export type ReviewState = {
  repetitions: number;
  intervalDays: number;
  easeFactor: number;
  dueAt: string;
  reviewedAt: string;
};

export type ReviewBook = Record<string, ReviewState>;
export type ReviewStorage = Pick<Storage, "getItem" | "setItem">;
const DAY_MS = 86_400_000;
const MAX_INTERVAL_DAYS = 3650;
const MIN_EASE = 1.3;
const MAX_EASE = 3.0;

export function scheduleReview(
  previous: ReviewState | undefined,
  rating: ReviewRating,
  now = new Date()
): ReviewState {
  if (!Number.isFinite(now.getTime())) throw new Error("Invalid review date");
  const previousEase = previous?.easeFactor ?? 2.5;
  const easeFactor = Math.min(
    MAX_EASE,
    Math.max(
      MIN_EASE,
      previousEase + ({ again: -0.2, hard: -0.15, good: 0, easy: 0.15 }[rating])
    )
  );
  const priorInterval = previous?.intervalDays ?? 0;
  const repetitions = rating === "again" ? 0 : (previous?.repetitions ?? 0) + 1;

  // A forgotten card can be retried in ten minutes; the next successful
  // review restarts the interval rather than pretending it was retained.
  if (rating === "again") {
    return {
      repetitions,
      intervalDays: 0,
      easeFactor,
      reviewedAt: now.toISOString(),
      dueAt: new Date(now.getTime() + 10 * 60_000).toISOString(),
    };
  }

  let intervalDays: number;
  if (rating === "hard") {
    intervalDays = Math.max(1, Math.ceil(priorInterval * 1.2));
  } else if (rating === "easy") {
    intervalDays = repetitions === 1 ? 4 : Math.ceil(Math.max(1, priorInterval) * (easeFactor + 0.15));
  } else {
    intervalDays = repetitions === 1 ? 1 : repetitions === 2
      ? 3 : Math.ceil(Math.max(1, priorInterval) * easeFactor);
  }
  intervalDays = Math.min(MAX_INTERVAL_DAYS, intervalDays);

  return {
    repetitions,
    intervalDays,
    easeFactor,
    reviewedAt: now.toISOString(),
    dueAt: new Date(now.getTime() + intervalDays * DAY_MS).toISOString(),
  };
}

export function isReviewDue(review: ReviewState | undefined, now = new Date()): boolean {
  return !review || new Date(review.dueAt).getTime() <= now.getTime();
}

export function reviewStorageKey(userId: string): string {
  if (!userId || userId.length > 128) throw new Error("Invalid learner identifier");
  return "linguaforge:srs:v1:" + encodeURIComponent(userId);
}

function validLessonId(id: string): boolean {
  return /^[a-zA-Z0-9_-]{1,80}$/.test(id) &&
    id !== "__proto__" && id !== "prototype" && id !== "constructor";
}

function validReview(value: unknown): value is ReviewState {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<ReviewState>;
  return (
    typeof record.repetitions === "number" &&
    Number.isInteger(record.repetitions) && record.repetitions >= 0 && record.repetitions <= 100000 &&
    typeof record.intervalDays === "number" &&
    Number.isInteger(record.intervalDays) && record.intervalDays >= 0 && record.intervalDays <= MAX_INTERVAL_DAYS &&
    typeof record.easeFactor === "number" &&
    Number.isFinite(record.easeFactor) && record.easeFactor >= MIN_EASE && record.easeFactor <= MAX_EASE &&
    typeof record.dueAt === "string" &&
    Number.isFinite(Date.parse(record.dueAt)) &&
    typeof record.reviewedAt === "string" &&
    Number.isFinite(Date.parse(record.reviewedAt))
  );
}

/** Treat browser storage as untrusted: ignore malformed entries and oversized payloads. */
export function loadReviews(userId: string, storage: ReviewStorage): ReviewBook {
  try {
    const raw = storage.getItem(reviewStorageKey(userId));
    if (!raw || raw.length > 256_000) return {};
    const data: unknown = JSON.parse(raw);
    if (!data || typeof data !== "object" || Array.isArray(data)) return {};
    const clean: ReviewBook = Object.create(null) as ReviewBook;
    for (const [lessonId, state] of Object.entries(data)) {
      if (validLessonId(lessonId) && validReview(state)) {
        clean[lessonId] = state;
      }
    }
    return clean;
  } catch {
    return {};
  }
}

export function saveReviews(userId: string, reviews: ReviewBook, storage: ReviewStorage): void {
  const key = reviewStorageKey(userId);
  if (!reviews || typeof reviews !== "object" || Array.isArray(reviews)) {
    throw new Error("Invalid review collection");
  }
  // Serialize only the records that loadReviews can safely restore. Reject
  // unsupported keys and invalid dates rather than silently losing progress.
  const clean: ReviewBook = Object.create(null) as ReviewBook;
  for (const [lessonId, review] of Object.entries(reviews)) {
    if (!validLessonId(lessonId) || !validReview(review)) {
      throw new Error("Invalid review record");
    }
    clean[lessonId] = review;
  }
  const json = JSON.stringify(clean);
  if (json.length > 256_000) throw new Error("Review storage limit exceeded");
  storage.setItem(key, json);
}
