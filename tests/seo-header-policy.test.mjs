import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const config = JSON.parse(readFileSync(new URL("../vercel.json", import.meta.url), "utf8"));
const noindex = config.headers.filter(rule =>
  rule.headers.some(header =>
    header.key.toLowerCase() === "x-robots-tag" &&
    /(?:^|[,\s])noindex(?:$|[,\s])/i.test(header.value)
  )
);
function isNoindexRoute(pathname) {
  return noindex.some(({ source }) => new RegExp("^" + source + "$").test(pathname));
}

test("private and personalized routes have a pre-render noindex header", () => {
  for (const pathname of [
    "/mi-espacio", "/mi-espacio/perfil", "/repasos", "/repasos/2026",
    "/mi-constancia", "/mi-constancia/semana",
    "/lecciones/ejemplo", "/practica-oral/ejemplo",
  ]) {
    assert.equal(isNoindexRoute(pathname), true, pathname);
  }
});

test("public pages do not inherit private noindex headers", () => {
  for (const pathname of ["/", "/catalogo", "/programas", "/biblioteca", "/voz", "/transparencia"]) {
    assert.equal(isNoindexRoute(pathname), false, pathname);
  }
});

test("SPA build output and fallback remain configured", () => {
  assert.equal(config.framework, "vite");
  assert.equal(config.outputDirectory, "dist/public");
  assert.ok(config.rewrites.some(rule => rule.source === "/(.*)" && rule.destination === "/index.html"));
});
