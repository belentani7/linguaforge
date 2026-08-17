import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("production Vite configuration", () => {
  it("guards the Manus runtime from production builds", () => {
    const config = readFileSync(resolve(process.cwd(), "vite.config.ts"), "utf8");

    expect(config).toContain('const isProductionBuild = process.env.NODE_ENV === "production" || process.argv.includes("build");');
    expect(config).toContain("...(isProductionBuild ? [] : [vitePluginManusRuntime()])");
  });
});
