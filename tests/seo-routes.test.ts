import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { metaFor } from "../client/src/lib/seo";

describe("SEO and privacy", () => {
  it("indexes only public educational landings", () => {
    for (const path of ["/", "/catalogo", "/programas", "/biblioteca", "/voz", "/transparencia"]) {
      expect(metaFor(path).indexable).toBe(true);
    }
  });

  it("excludes personalized lessons, drafts and unknown routes", () => {
    for (const path of ["/mi-espacio", "/repasos", "/mi-constancia", "/lecciones/ejemplo", "/practica-oral/ejemplo", "/ruta-inexistente"]) {
      expect(metaFor(path).indexable).toBe(false);
    }
  });

  it("keeps public metadata for query-string navigations", () => {
    const result = metaFor("/catalogo?estudio=en");
    expect(result.known).toBe(true);
    expect(result.indexable).toBe(true);
    expect(result.meta.title).toBe("Catálogo de lenguas");
  });

  it("sets noindex headers on private Vercel entrypoints before JavaScript runs", () => {
    const vercel = JSON.parse(readFileSync(new URL("../vercel.json", import.meta.url), "utf8"));
    const sources = vercel.headers.filter((rule: { headers: { key: string; value: string }[] }) => rule.headers.some((header) => header.key === "X-Robots-Tag" && header.value.includes("noindex"))).map((rule: { source: string }) => rule.source);
    for (const route of ["/mi-espacio", "/repasos", "/mi-constancia", "/lecciones/(.*)", "/practica-oral/(.*)"]) expect(sources).toContain(route);
  });
});
