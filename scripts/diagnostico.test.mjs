import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { recommendRoute } from "../campus/diagnostico.mjs";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
test("every goal resolves to a real and locally published activity", () => {
  const goals = ["translate", "voice", "quiz", "plan"];
  const base = new URL("../campus/", import.meta.url);
  for (const goal of goals) {
    const result = recommendRoute({ goal, level: "inicio", pace: "10" });
    const destination = new URL(result.href, base);
    assert.equal(destination.protocol, "file:");
    assert.ok(readFileSync(destination).length > 0, goal);
    assert.match(result.summary, /Empieza por una lectura guiada/);
  }
});
test("different levels and paces adapt the guidance without claiming AI", () => {
  const first = recommendRoute({ goal: "plan", level: "practica", pace: "20" });
  const second = recommendRoute({ goal: "quiz", level: "autonomia", pace: "40" });
  assert.match(first.firstStep, /20 minutos/);
  assert.match(second.firstStep, /40 minutos/);
  assert.match(first.note, /No se envían ni guardan/);
  assert.notEqual(first.href, second.href);
});
test("unknown and unsafe values fail closed", () => {
  const bad = [{ goal: "javascript:alert(1)", level: "inicio", pace: "10" },
    { goal: "__proto__", level: "inicio", pace: "10" },
    { goal: "quiz", level: "expert", pace: "10" },
    { goal: "quiz", level: "inicio", pace: "1000" }];
  for (const values of bad) assert.throws(() => recommendRoute(values), RangeError);
});
test("published campus links to diagnostic with no SPA-root 404", () => {
  assert.match(read("../campus/index.html"), /href="diagnostico\.html"/);
  assert.match(read("../campus/diagnostico.html"), /src="diagnostico\.mjs"/);
  assert.match(read("../campus/diagnostico.html"), /id="diagnostic-form"/);
});
