import { describe, expect, it } from "vitest";
import {
  isReviewDue,
  loadReviews,
  reviewStorageKey,
  saveReviews,
  scheduleReview,
  type ReviewBook,
  type ReviewStorage,
} from "../client/src/lib/spaced-repetition";

const NOW = new Date("2026-10-22T10:00:00.000Z");

function storage(): ReviewStorage {
  const values = new Map<string, string>();
  return {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => {
      values.set(key, value);
    },
  };
}

describe("SRS local de LinguaForge", () => {
  it("la primera respuesta correcta vuelve mañana y no está vencida ahora", () => {
    const record = scheduleReview(undefined, "good", NOW);
    expect(record.repetitions).toBe(1);
    expect(record.intervalDays).toBe(1);
    expect(record.dueAt).toBe("2026-10-23T10:00:00.000Z");
    expect(isReviewDue(record, NOW)).toBe(false);
    expect(isReviewDue(record, new Date(record.dueAt))).toBe(true);
  });

  it("olvidar reinicia la práctica en diez minutos y disminuye la facilidad sin caer por debajo del límite", () => {
    let state = scheduleReview(undefined, "good", NOW);
    for (let i = 0; i < 20; i++) state = scheduleReview(state, "again", NOW);
    expect(state.intervalDays).toBe(0);
    expect(state.repetitions).toBe(0);
    expect(state.easeFactor).toBe(1.3);
    expect(state.dueAt).toBe("2026-10-22T10:10:00.000Z");
  });

  it("fácil amplía el intervalo más que bien; el intervalo siempre queda acotado", () => {
    const good = scheduleReview(undefined, "good", NOW);
    const easy = scheduleReview(undefined, "easy", NOW);
    expect(easy.intervalDays).toBeGreaterThan(good.intervalDays);
    let state = easy;
    for (let i = 0; i < 40; i++) state = scheduleReview(state, "easy", NOW);
    expect(state.intervalDays).toBeLessThanOrEqual(3650);
    expect(state.easeFactor).toBeLessThanOrEqual(3);
  });

  it("aísla los registros por cuenta y descarta el almacenamiento corrupto", () => {
    const store = storage();
    const result: ReviewBook = {
      "everyday-a1-introductions": scheduleReview(undefined, "good", NOW),
    };
    saveReviews("learner-a", result, store);
    expect(loadReviews("learner-a", store)).toEqual(result);
    expect(loadReviews("learner-b", store)).toEqual({});
    store.setItem(
      reviewStorageKey("learner-a"),
      '{"__proto__":{"polluted":true},"bad":{"dueAt":"oops"}}'
    );
    expect(Object.keys(loadReviews("learner-a", store))).toEqual([]);
  });

  it("si el navegador bloquea almacenamiento, devuelve cola inicial sin bloquear el render", () => {
    const denied: ReviewStorage = {
      getItem: () => {
        throw new Error("storage denied");
      },
      setItem: () => {
        throw new Error("storage denied");
      },
    };
    expect(loadReviews("learner-a", denied)).toEqual({});
    expect(() => saveReviews("learner-a", {}, denied)).toThrow(
      "storage denied"
    );
  });
});
