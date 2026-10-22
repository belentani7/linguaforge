/**
 * Minimal private guest progress for the static learning experience.
 * No account or network requests; never present this as server-side certification.
 */
export const GUEST_COMPLETIONS_KEY = 'linguaforge:guest-lessons:v1';
type GuestStorage = { getItem(key: string): string | null; setItem(key: string, value: string): void };

function resolveStorage(storage?: GuestStorage): GuestStorage | undefined {
  if (storage) return storage;
  if (typeof window === 'undefined') return undefined;
  try { return window.localStorage; } catch { return undefined; }
}

export function guestCompletions(storage?: GuestStorage): string[] {
  const target = resolveStorage(storage);
  if (!target) return [];
  try {
    const raw = target.getItem(GUEST_COMPLETIONS_KEY);
    // Browser storage can be modified externally. A corrupt multi-megabyte
    // payload must not freeze the classroom before the learner can study.
    if (raw && raw.length > 128_000) return [];
    const value: unknown = JSON.parse(raw || '[]');
    if (!Array.isArray(value)) return [];
    return [...new Set(value.filter(
      (id): id is string => typeof id === 'string' && /^[a-z0-9-]{1,80}$/i.test(id),
    ))].slice(-200);
  } catch {
    return [];
  }
}

export function markGuestCompletion(lessonId: string, storage?: GuestStorage): boolean {
  if (!/^[a-z0-9-]{1,80}$/i.test(lessonId)) return false;
  const target = resolveStorage(storage);
  if (!target) return false;
  try {
    const next = [...new Set([...guestCompletions(target), lessonId])].slice(-200);
    target.setItem(GUEST_COMPLETIONS_KEY, JSON.stringify(next));
    return true;
  } catch {
    // localStorage can be disabled or full; learning should remain usable.
    return false;
  }
}
