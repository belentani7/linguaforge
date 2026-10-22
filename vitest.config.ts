import { defineConfig } from "vitest/config";

// Vitest no reutiliza vite.config.ts (su `root` es client/): las pruebas viven en tests/ y corren en Node.
export default defineConfig({
  root: import.meta.dirname,
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts", "client/src/**/*.test.ts"],
    testTimeout: 15_000,
    coverage: {
      provider: "v8",
      include: ["server/**/*.ts", "shared/**/*.ts"],
      exclude: ["**/*.d.ts", "server/db/migrations/**"],
      reporter: ["text", "json-summary"],
      reportsDirectory: "coverage",
      // Puerta de regresión: umbrales = línea base medida (sin base de datos) menos margen.
      // Medido: lines 57.3, functions 52.8, branches 50.3, statements 58.2. Objetivo de la directiva: 90 (pendiente).
      thresholds: { lines: 55, functions: 50, branches: 47, statements: 55 },
    },
  },
});
