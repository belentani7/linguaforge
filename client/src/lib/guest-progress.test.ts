import { describe, expect, it } from 'vitest';
import { GUEST_COMPLETIONS_KEY, guestCompletions, markGuestCompletion } from './guest-progress';

function memoryStorage() {
  const map = new Map<string, string>();
  return {
    getItem: (key: string) => map.get(key) ?? null,
    setItem: (key: string, value: string) => { map.set(key, value); },
  };
}

describe('guest learning progress', () => {
  it('starts empty and stores one lesson without duplication', () => {
    const store = memoryStorage();
    expect(guestCompletions(store)).toEqual([]);
    expect(markGuestCompletion('everyday-a1-introductions', store)).toBe(true);
    expect(markGuestCompletion('everyday-a1-introductions', store)).toBe(true);
    expect(guestCompletions(store)).toEqual(['everyday-a1-introductions']);
  });

  it('ignores malformed or unexpected data', () => {
    const store = memoryStorage();
    store.setItem(GUEST_COMPLETIONS_KEY, '{not-json');
    expect(guestCompletions(store)).toEqual([]);
    store.setItem(GUEST_COMPLETIONS_KEY, JSON.stringify(['lesson-a', null, 'lesson-a', '../secrets']));
    expect(guestCompletions(store)).toEqual(['lesson-a']);
    expect(markGuestCompletion('../secrets', store)).toBe(false);
  });

  it('bounds hostile or corrupted localStorage before JSON parsing', () => {
    const store = memoryStorage();
    store.setItem(GUEST_COMPLETIONS_KEY, '[' + ' '.repeat(128_001) + ']');
    expect(guestCompletions(store)).toEqual([]);
    expect(markGuestCompletion('real-lesson', store)).toBe(true);
    expect(guestCompletions(store)).toEqual(['real-lesson']);
  });

  it('does not claim durable storage if the browser rejects writes', () => {
    const store = { getItem: () => null, setItem: () => { throw new Error('blocked'); } };
    expect(markGuestCompletion('lesson-a', store)).toBe(false);
  });

  it('caps the number of locally stored IDs', () => {
    const store = memoryStorage();
    for (let index = 0; index < 230; index++) markGuestCompletion('lesson-' + index, store);
    expect(guestCompletions(store)).toHaveLength(200);
    expect(guestCompletions(store)).toContain('lesson-229');
  });
});
