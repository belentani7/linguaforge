import { defineConfig } from "vitest/config";

// Vitest no reutiliza vite.config.ts (su `root` es client/): las pruebas viven en tests/ y corren en Node.
export default defineConfig({
  root: import.meta.dirname,
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    testTimeout: 15_000,
  },
});
