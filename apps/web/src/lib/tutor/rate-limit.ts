/**
 * Límite diario por IP para endpoints que consumen modelos de pago.
 * Es en memoria: suficiente para una instancia; en despliegue multi-instancia
 * debe sustituirse por un almacén compartido (Redis/Upstash). Ver ADR-004.
 */

interface Bucket {
  day: string;
  count: number;
}

const buckets = new Map<string, Bucket>();

export function dailyLimit(): number {
  const raw = Number(process.env.TUTOR_DAILY_LIMIT ?? 200);
  return Number.isFinite(raw) && raw > 0 ? raw : 200;
}

function today(now: Date): string {
  return now.toISOString().slice(0, 10);
}

export interface LimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
}

export function consume(key: string, now: Date = new Date()): LimitResult {
  const limit = dailyLimit();
  const day = today(now);
  const current = buckets.get(key);
  const bucket: Bucket = current && current.day === day ? current : { day, count: 0 };
  if (bucket.count >= limit) {
    buckets.set(key, bucket);
    return { allowed: false, remaining: 0, limit };
  }
  bucket.count += 1;
  buckets.set(key, bucket);
  return { allowed: true, remaining: limit - bucket.count, limit };
}

/** Solo para pruebas. */
export function resetLimits(): void {
  buckets.clear();
}

export function clientKey(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  return (forwarded?.split(",")[0] ?? headers.get("x-real-ip") ?? "anon").trim();
}
