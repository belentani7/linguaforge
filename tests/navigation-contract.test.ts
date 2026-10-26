import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// Prevent shipping navigation links that open the 404 screen.
describe("LinguaForge navigation contract", () => {
  const root = process.cwd();
  const app = readFileSync(resolve(root, "client/src/App.tsx"), "utf8");
  const navigation = readFileSync(
    resolve(root, "client/src/components/InstitutionShell.tsx"),
    "utf8"
  );
  const catalog = readFileSync(
    resolve(root, "client/src/pages/Catalog.tsx"),
    "utf8"
  );

  const routes = new Set(
    [...app.matchAll(/<Route path="([^"]+)"/g)].map(match => match[1])
  );
  const menuLinks = [
    ...navigation.matchAll(/\{ href: "(\/[^"]*)", label:/g),
  ].map(match => match[1]);

  it("has a concrete application route for each menu destination", () => {
    expect(menuLinks.length).toBeGreaterThanOrEqual(6);
    for (const href of menuLinks) {
      expect(routes.has(href), "Not registered in App.tsx: " + href).toBe(true);
    }
  });

  it("uses the registered catalog URL for language selection", () => {
    expect(routes.has("/catalogo")).toBe(true);
    expect(catalog).toContain(
      "href={`/catalogo?estudio=${encodeURIComponent(item.code)}`}"
    );
    expect(catalog).not.toContain("/idiomas?estudio=");
  });
});

describe("LinguaForge mobile navigation and reading accessibility", () => {
  const root = process.cwd();
  const shell = readFileSync(resolve(root, "client/src/components/InstitutionShell.tsx"), "utf8");
  const css = readFileSync(resolve(root, "client/src/styles/components.css"), "utf8");

  it("reveals the responsive menu with the CSS-required open class", () => {
    expect(shell).toContain('className="mobile-nav is-open"');
    expect(shell).toContain('aria-controls="mobile-navigation"');
    expect(css).toContain(".mobile-nav.is-open { display: flex");
  });

  it("offers a keyboard skip link and stateful reading controls", () => {
    expect(shell).toContain('href="#main-content"');
    expect(shell).toContain('id="main-content"');
    expect(css).toContain(".skip-link:focus-visible");
    for (const preference of ["comfort", "focus", "reducedMotion"]) {
      expect(shell).toContain("aria-pressed={preferences." + preference + "}");
    }
    expect(shell).toContain('event.key !== "Escape"');
  });

  it("does not trust malformed storage values or assume storage is writable", () => {
    expect(shell).toContain('typeof stored === "object"');
    expect(shell).toContain('catch { return resolveLocale(navigator.language); }');
    expect(shell).toContain('try { localStorage.setItem("maos-accessibility-preferences"');
  });
});
