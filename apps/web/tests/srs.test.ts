import { describe, expect, it } from "vitest";
import {
  dueCardIds,
  isDue,
  nextReviewAt,
  parseReviews,
  scheduleReview,
  type ReviewRecord,
} from "../src/lib/srs";

const NOW = new Date("2026-10-21T12:00:00.000Z");

describe("spaced repetition schedule", () => {
  it("new card schedules a day after Good, then 6 days, then grows", () => {
    const first = scheduleReview(undefined, 4, NOW);
    expect(first.repetitions).toBe(1);
    expect(first.intervalDays).toBe(1);
    expect(first.ease).toBe(2.5);
    expect(first.dueAt).toBe("2026-10-22T12:00:00.000Z");

    const second = scheduleReview(first, 4, new Date(first.dueAt));
    expect(second.repetitions).toBe(2);
    expect(second.intervalDays).toBe(6);

    const third = scheduleReview(second, 4, new Date(second.dueAt));
    expect(third.repetitions).toBe(3);
    expect(third.intervalDays).toBe(15);
  });

  it("failed reviews return in 10 minutes, reset repetition and never schedule in the past", () => {
    const mastered = scheduleReview(
      {
        repetitions: 6,
        ease: 2.5,
        intervalDays: 30,
        reviewedAt: NOW.toISOString(),
        dueAt: NOW.toISOString(),
      },
      0,
      NOW
    );
    expect(mastered.repetitions).toBe(0);
    expect(mastered.dueAt).toBe("2026-10-21T12:10:00.000Z");
    expect(isDue(mastered, NOW)).toBe(false);
    expect(isDue(mastered, new Date("2026-10-21T12:10:00.000Z"))).toBe(true);
  });

  it("Easy advances and Hard stays bounded", () => {
    const easy = scheduleReview(undefined, 5, NOW);
    expect(easy.intervalDays).toBe(4);
    const hard = scheduleReview(easy, 3, new Date(easy.dueAt));
    expect(hard.intervalDays).toBe(5);
    expect(hard.ease).toBeGreaterThanOrEqual(1.3);
    let record: ReviewRecord = hard;
    for (let i = 0; i < 25; i++) record = scheduleReview(record, 5, NOW);
    expect(record.intervalDays).toBeLessThanOrEqual(36500);
    expect(record.ease).toBeLessThanOrEqual(3.0);
  });

  it("rejects unsupported quality and invalid timestamp", () => {
    expect(() => scheduleReview(undefined, 2 as never, NOW)).toThrow(
      RangeError
    );
    expect(() => scheduleReview(undefined, 4, new Date("not-a-date"))).toThrow(
      RangeError
    );
  });

  it("reports no upcoming review when the queue contains only overdue material", () => {
    const overdue = scheduleReview(
      undefined,
      4,
      new Date("2026-10-17T12:00:00.000Z")
    );
    expect(nextReviewAt(["overdue"], { overdue }, NOW)).toBeNull();
    expect(() =>
      nextReviewAt(["overdue"], { overdue }, new Date("invalid"))
    ).toThrow(RangeError);
  });

  it("queues due cards before new cards without reintroducing future reviews", () => {
    const a = scheduleReview(undefined, 4, new Date("2026-10-18T12:00:00Z"));
    const b = scheduleReview(undefined, 5, NOW);
    const ids = ["new1", "future", "overdue", "new2"];
    const reviews = { overdue: a, future: b };
    expect(dueCardIds(ids, reviews, NOW)).toEqual(["overdue", "new1", "new2"]);
    expect(nextReviewAt(ids, reviews, NOW)).toBe(b.dueAt);
    expect(nextReviewAt(["overdue"], reviews, NOW)).toBeNull();
    expect(nextReviewAt(["future"], reviews, NOW)).toBe(b.dueAt);
  });
});

describe("local storage safety", () => {
  const ids = new Set(["valid-card"]);
  const r = scheduleReview(undefined, 4, NOW);

  it("loads only known cards with valid state", () => {
    const parsed = parseReviews(
      JSON.stringify({ "valid-card": r, injected: r }),
      ids
    );
    expect(parsed["valid-card"]).toEqual(r);
    expect(parsed.injected).toBeUndefined();
  });

  it("discards malformed data, invalid dates and absurd bounds", () => {
    expect(Object.keys(parseReviews("{broken", ids))).toHaveLength(0);
    expect(Object.keys(parseReviews("[]", ids))).toHaveLength(0);
    expect(Object.keys(parseReviews("x".repeat(250001), ids))).toHaveLength(0);
    const wrong = { ...r, dueAt: "tomorrow", ease: 0.2 };
    expect(
      parseReviews(JSON.stringify({ "valid-card": wrong }), ids)["valid-card"]
    ).toBeUndefined();
  });

  it("keeps ISO timestamps to avoid ambiguous locale parsing", () => {
    const localDate = { ...r, dueAt: "10/21/2026" };
    expect(
      parseReviews(JSON.stringify({ "valid-card": localDate }), ids)[
        "valid-card"
      ]
    ).toBeUndefined();
  });
});
