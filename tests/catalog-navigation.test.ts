import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const routes = readFileSync(new URL("../client/src/App.tsx", import.meta.url), "utf8");
const catalog = readFileSync(new URL("../client/src/pages/Catalog.tsx", import.meta.url), "utf8");

describe("catalog navigation contract", () => {
  it("navigates to declared study-language routes rather than the old missing /idiomas page", () => {
    expect(routes).toContain('<Route path="/catalogo" component={Catalog} />');
    expect(catalog).toContain('href={`/catalogo?estudio=${encodeURIComponent(item.code)}`}');
    expect(catalog).not.toContain("/idiomas?estudio=");
  });
  it("can start the actual diagnostic from the selected language", () => {
    expect(routes).toContain('<Route path="/diagnostico" component={Onboarding} />');
    expect(catalog).toContain("href={`/diagnostico?estudio=${language.code}`}");
  });
});
