import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const routes = readFileSync(new URL("../client/src/App.tsx", import.meta.url), "utf8");
const catalog = readFileSync(new URL("../client/src/pages/Catalog.tsx", import.meta.url), "utf8");
const onboarding = readFileSync(new URL("../client/src/pages/Onboarding.tsx", import.meta.url), "utf8");
const shell = readFileSync(new URL("../client/src/components/InstitutionShell.tsx", import.meta.url), "utf8");

describe("catalog navigation contract", () => {
  it("navigates to declared study-language routes rather than the old missing /idiomas page", () => {
    expect(routes).toContain('<Route path="/catalogo" component={Catalog} />');
    expect(catalog).toContain('href={`/catalogo?estudio=${encodeURIComponent(item.code)}`}');
    expect(catalog).not.toContain("/idiomas?estudio=");
    expect(catalog).toContain("LANGUAGE_CATALOG.length");
    expect(catalog).toContain("no significa que exista un curso completo");
  });
  it("can start the actual diagnostic from the selected language", () => {
    expect(routes).toContain('<Route path="/diagnostico" component={Onboarding} />');
    expect(catalog).toContain("href={`/diagnostico?estudio=${language.code}`}");
  });
  it("validates URL-selected languages instead of passing arbitrary query values", () => {
    expect(onboarding).toContain('LANGUAGE_CATALOG.find((entry) => entry.code === query.get("estudio"))?.code ?? "en"');
    expect(onboarding).not.toContain('useState(query.get("estudio") ?? "en")');
  });
  it("all global header links target actual routes, not removed pages", () => {
    for (const route of ["/catalogo", "/laboratorios", "/programas", "/empleo", "/tutor"]) {
      expect(shell).toContain(`{ href: "${route}"`);
      expect(routes).toContain(`<Route path="${route}"`);
    }
    expect(shell).toContain('{ href: "/", label: "Abierto" }');
    expect(shell).not.toContain('href: "/idiomas"');
    expect(shell).not.toContain('href: "/labs"');
    expect(shell).not.toContain('href: "/abierto"');
  });

  it("lets centralized route SEO own the canonical URL", () => {
    expect(routes).toContain("applySeo(location)");
    expect(shell).not.toContain("canonical.href = canonicalUrl");
    expect(shell).not.toContain('new URL(location.split("?")[0], window.location.origin)');
    expect(shell).toContain('name: "LinguaForge"');
  });

});
