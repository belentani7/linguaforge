import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE_URL || "playwright");
const base = process.env.UI_BASE_URL || "http://127.0.0.1:4173";
await mkdir("test-results", { recursive: true });
const browser = await chromium.launch();
const failures = [];
try {
  for (const mode of ["normal", "corrupt-preferences", "blocked-storage"]) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: "es-ES" });
    if (mode === "corrupt-preferences") {
      await context.addInitScript(() => localStorage.setItem("maos-accessibility-preferences", "null"));
    }
    if (mode === "blocked-storage") {
      await context.addInitScript(() => {
        for (const method of ["getItem", "setItem"]) {
          Object.defineProperty(Storage.prototype, method, { value() { throw new DOMException("Storage denied", "SecurityError"); } });
        }
      });
    }
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    try {
      const response = await page.goto(base, { waitUntil: "networkidle" });
      assert.equal(response.status(), 200);
      await page.getByRole("main").waitFor({ state: "visible" });
      await page.keyboard.press("Tab");
      assert.equal(await page.locator("a.skip-link").evaluate(node => node === document.activeElement), true);
      await page.keyboard.press("Enter");
      assert.equal(await page.getByRole("main").evaluate(node => node === document.activeElement), true);
      const menu = page.getByRole("button", { name: "Abrir menú", exact: true });
      await menu.click();
      const nav = page.getByRole("navigation", { name: "Navegación móvil" });
      await nav.waitFor({ state: "visible" });
      await page.keyboard.press("Escape");
      await nav.waitFor({ state: "detached" });
      assert.equal(await menu.evaluate(node => node === document.activeElement), true);
      await menu.click();
      await nav.locator('a[href="/catalogo"]').click();
      await page.waitForURL("**/catalogo");
      await page.getByRole("main").waitFor({ state: "visible" });
      await page.getByRole("navigation", { name: "Navegación móvil" }).waitFor({ state: "detached" });
      const preferences = page.getByRole("button", { name: "Abrir preferencias de lectura" });
      await preferences.click();
      const comfort = page.getByRole("button", { name: /Lectura cómoda/ });
      await comfort.click();
      assert.equal(await comfort.getAttribute("aria-pressed"), "true");
      assert.equal(await page.locator("html").evaluate(node => node.classList.contains("reading-comfort")), true);
      await page.keyboard.press("Escape");
      await page.getByRole("region", { name: "Preferencias de lectura" }).waitFor({ state: "detached" });
      assert.equal(await preferences.evaluate(node => node === document.activeElement), true);
      assert.deepEqual(errors, [], "Unhandled browser errors");
      await page.screenshot({ path: `test-results/mobile-${mode}.png`, fullPage: true });
      if (mode === "normal") {
        await page.setViewportSize({ width: 1440, height: 1000 });
        await page.getByRole("navigation", { name: "Navegación principal" }).waitFor({ state: "visible" });
        await page.screenshot({ path: "test-results/desktop-catalog.png", fullPage: true });
      }
      console.log(`PASS: mobile navigation, keyboard, reading controls and storage — ${mode}`);
    } catch (error) {
      await page.screenshot({ path: `test-results/failure-${mode}.png`, fullPage: true }).catch(() => {});
      failures.push(`${mode}: ${error.stack || error}`);
    } finally {
      await context.close();
    }
  }
} finally {
  await browser.close();
}
assert.deepEqual(failures, [], failures.join("\n\n"));
