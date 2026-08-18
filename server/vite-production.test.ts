import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("production Vite configuration", () => {
  it("guards the Manus runtime from production builds", () => {
    const config = readFileSync(
      resolve(process.cwd(), "vite.config.ts"),
      "utf8"
    );

    expect(config).toMatch(
      /const isProductionBuild[\s\S]*process\.env\.NODE_ENV === "production"[\s\S]*process\.argv\.includes\("build"\)/
    );
    expect(config).toContain(
      "...(isProductionBuild ? [] : [vitePluginManusRuntime()])"
    );
  });

  it("keeps React, ReactDOM, and scheduler in one vendor group", () => {
    const config = readFileSync(
      resolve(process.cwd(), "vite.config.ts"),
      "utf8"
    );

    expect(config).toContain('id.includes("react-dom") ||');
    expect(config).toContain('id.includes("scheduler")');
    expect(config).not.toContain('return "react-dom-vendor"');
  });
});
