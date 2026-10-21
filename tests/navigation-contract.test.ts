import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// Prevent shipping navigation links that open the 404 screen.
describe("LinguaForge navigation contract", () => {
  const root = process.cwd();
  const app = readFileSync(resolve(root, "client/src/App.tsx"), "utf8");
  const navigation = readFileSync(resolve(root, "client/src/components/InstitutionShell.tsx"), "utf8");
  const catalog = readFileSync(resolve(root, "client/src/pages/Catalog.tsx"), "utf8");

  const routes = new Set([...app.matchAll(/<Route path="([^"]+)"/g)].map((match) => match[1]));
  const menuLinks = [...navigation.matchAll(/\{ href: "(\/[^"]*)", label:/g)].map((match) => match[1]);

  it("has a concrete application route for each menu destination", () => {
    expect(menuLinks.length).toBeGreaterThanOrEqual(6);
    for (const href of menuLinks) {
      expect(routes.has(href), "Not registered in App.tsx: " + href).toBe(true);
    }
  });

  it("uses the registered catalog URL for language selection", () => {
    expect(routes.has("/catalogo")).toBe(true);
    expect(catalog).toContain("href={\`/catalogo?estudio=\${item.code}\`}");
    expect(catalog).not.toContain("/idiomas?estudio=");
  });
});
