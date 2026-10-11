import type { TestCase } from "@/content/types";

export interface TestOutcome {
  id: string;
  passed: boolean;
  actual?: string;
  error?: string;
}

export interface RunReport {
  total: number;
  passed: number;
  outcomes: TestOutcome[];
  timedOut: boolean;
}

/**
 * Código del Worker. Se construye como Blob para no depender de bundling:
 * recibe el código del alumno y las expresiones de prueba, y devuelve resultados.
 * El Worker aísla el hilo principal: un bucle infinito solo bloquea el Worker, que se termina por tiempo.
 */
const WORKER_SOURCE = `
self.onmessage = async (event) => {
  const { code, tests } = event.data;
  const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
  const outcomes = [];
  let runners;
  try {
    const body = code + "\\n;return [" + tests.map((t) => "async () => (" + t.expr + ")").join(",") + "];";
    // AsyncFunction devuelve una promesa: hay que esperarla antes de indexar las pruebas.
    runners = await new AsyncFunction(body)();
  } catch (err) {
    for (const t of tests) outcomes.push({ id: t.id, passed: false, error: String(err && err.message || err) });
    self.postMessage({ outcomes });
    return;
  }
  for (let i = 0; i < tests.length; i++) {
    const t = tests[i];
    try {
      const actual = await runners[i]();
      const ok = JSON.stringify(actual) === JSON.stringify(t.equals);
      outcomes.push({ id: t.id, passed: ok, actual: JSON.stringify(actual) });
    } catch (err) {
      outcomes.push({ id: t.id, passed: false, error: String(err && err.message || err) });
    }
  }
  self.postMessage({ outcomes });
};
`;

export function runTests(code: string, tests: TestCase[], timeoutMs = 3000): Promise<RunReport> {
  return new Promise((resolve) => {
    if (typeof Worker === "undefined") {
      resolve({ total: tests.length, passed: 0, outcomes: tests.map((t) => ({ id: t.id, passed: false, error: "no_worker" })), timedOut: false });
      return;
    }
    const url = URL.createObjectURL(new Blob([WORKER_SOURCE], { type: "text/javascript" }));
    const worker = new Worker(url);
    let settled = false;

    const finish = (report: RunReport) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      worker.terminate();
      URL.revokeObjectURL(url);
      resolve(report);
    };

    const timer = setTimeout(() => {
      finish({
        total: tests.length,
        passed: 0,
        outcomes: tests.map((t) => ({ id: t.id, passed: false, error: "timeout" })),
        timedOut: true,
      });
    }, timeoutMs);

    worker.onmessage = (e: MessageEvent<{ outcomes: TestOutcome[] }>) => {
      const outcomes = e.data.outcomes;
      finish({
        total: tests.length,
        passed: outcomes.filter((o) => o.passed).length,
        outcomes,
        timedOut: false,
      });
    };
    worker.onerror = (e) => {
      finish({
        total: tests.length,
        passed: 0,
        outcomes: tests.map((t) => ({ id: t.id, passed: false, error: e.message || "worker_error" })),
        timedOut: false,
      });
    };

    worker.postMessage({ code, tests: tests.map((t) => ({ id: t.id, expr: t.expr, equals: t.equals })) });
  });
}
