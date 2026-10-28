import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const release = path.resolve(root, "dist/public");
const campus = path.join(release, "campus");
const pages = ["index.html", "ruta.html"];
const essential = [
  "tokens.css", "app.js", "quiz-logic.mjs", "sw.js", "manifest.webmanifest",
  "cursos/forja-linguistica/syllabus.md",
  "cursos/forja-linguistica/quiz.json",
  ...[1, 2, 3, 4].map(n => "cursos/forja-linguistica/semana-0" + n + ".md"),
];
const failures = [];
for (const file of [...pages, ...essential]) {
  const candidate = path.join(campus, file);
  if (!fs.existsSync(candidate) || !fs.statSync(candidate).isFile() || !fs.statSync(candidate).size) {
    failures.push("Required campus build file missing or empty: " + file);
  }
}
const routeSource = fs.readFileSync(path.join(root, "client/src/App.tsx"), "utf8");
let linkCount = 0;
for (const page of pages) {
  const full = path.join(campus, page);
  if (!fs.existsSync(full)) continue;
  const html = fs.readFileSync(full, "utf8");
  if (!html.includes("<main")) failures.push("No main landmark: " + page);
  for (const match of html.matchAll(/\b(?:href|src|data-src)=["']([^"']+)["']/g)) {
    const ref = match[1];
    if (/^(?:https?:|mailto:|tel:|data:|\/\/|#)/i.test(ref)) continue;
    const target = ref.split(/[?#]/)[0];
    if (!target) continue;
    if (target.startsWith("/")) {
      if (!routeSource.includes('path="' + target + '"') && !routeSource.includes("path='" + target + "'")) {
        failures.push(page + ": SPA destination not registered: " + target);
      }
    } else {
      const resolved = path.resolve(path.dirname(full), target);
      if (!resolved.startsWith(campus + path.sep) || !fs.existsSync(resolved)) {
        failures.push(page + ": local resource missing in build: " + ref);
      }
    }
    linkCount++;
  }
}
if (failures.length) {
  for (const failure of failures) console.error("::error::" + failure);
  process.exitCode = 1;
} else {
  console.log("ok   LinguaForge production campus: " + pages.length +
    " HTML pages, " + essential.length + " core assets, " + linkCount + " validated links");
}
