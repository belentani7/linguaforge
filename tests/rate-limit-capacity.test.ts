import type { AddressInfo } from 'node:net';
import type { Server } from 'node:http';
import { describe, expect, it } from 'vitest';
import { createApp, resolveLearningDataFile } from '../server/index';
import { createSessionSigner } from '../server/session';
import { MemoryLearningStore } from '../server/store';

describe('LinguaForge production persistence contract', () => {
  it('requires an explicitly mounted absolute storage path in production', () => {
    expect(() => resolveLearningDataFile({}, true)).toThrow(/LF_DATA_FILE/);
    expect(() => resolveLearningDataFile({ LF_DATA_FILE: './data/local.json' }, true)).toThrow(/ruta absoluta/);
    expect(resolveLearningDataFile({ LF_DATA_FILE: '/var/lib/linguaforge/learning.json' }, true))
      .toBe('/var/lib/linguaforge/learning.json');
  });

  it('preserves convenient relative development defaults', () => {
    expect(resolveLearningDataFile({}, false)).toMatch(/data[/\\]learning-store\.json$/);
  });
});

describe('LinguaForge HTTP rate-limit bucket capacity', () => {
  it('does not trust arbitrary forwarded-for headers in directly exposed servers', async () => {
    const app = createApp({
      store: new MemoryLearningStore(),
      sessionSigner: createSessionSigner('x'.repeat(40)),
      isProduction: false,
      mutationsPerMinute: 2,
    });
    const server: Server = app.listen(0, '127.0.0.1');
    await new Promise<void>(resolve => server.once('listening', resolve));
    const origin = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    try {
      const statuses: number[] = [];
      for (const ip of ['198.51.100.21', '198.51.100.22', '198.51.100.23']) {
        const response = await fetch(origin + '/api/trpc/auth.guest', {
          method: 'POST',
          headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
          body: '{"json":null}',
        });
        statuses.push(response.status);
      }
      expect(statuses).toEqual([200, 200, 429]);
    } finally {
      await new Promise<void>((resolve, reject) =>
        server.close(error => error ? reject(error) : resolve())
      );
    }
  });

  it('caps distinct client keys, cleans expired buckets, and continues service', async () => {
    let clock = Date.parse('2026-10-19T18:00:00Z');
    const app = createApp({
      store: new MemoryLearningStore(),
      sessionSigner: createSessionSigner('x'.repeat(40)),
      isProduction: false,
      now: () => new Date(clock),
      mutationsPerMinute: 5,
      maxRateLimitBuckets: 2,
      trustedProxyHops: 1, // Only the test harness acts as a simulated trusted proxy.
    });
    const server: Server = app.listen(0, '127.0.0.1');
    await new Promise<void>(resolve => server.once('listening', resolve));
    const origin = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    const send = async (ip: string) => fetch(origin + '/api/trpc/auth.guest', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-forwarded-for': ip,
      },
      body: '{"json":null}',
    });
    try {
      expect((await send('198.51.100.1')).status).toBe(200);
      expect((await send('198.51.100.2')).status).toBe(200);
      const blocked = await send('198.51.100.3');
      expect(blocked.status).toBe(429);
      expect(await blocked.json()).toMatchObject({ error: 'rate_limit_capacity' });
      clock += 61_000;
      expect((await send('198.51.100.3')).status).toBe(200);
    } finally {
      await new Promise<void>((resolve, reject) =>
        server.close(error => error ? reject(error) : resolve())
      );
    }
  });
});
