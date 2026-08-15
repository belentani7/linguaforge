import fs from "node:fs";

const input = process.argv[2];
if (!input) {
  console.error("Usage: node scripts/validate-content.mjs <content.json>");
  process.exit(1);
}

const entries = JSON.parse(fs.readFileSync(input, "utf8"));
if (!Array.isArray(entries)) throw new Error("Content file must contain an array");

const levels = new Set(["A1", "A2", "B1", "B2", "C1", "C2"]);
const counts = new Map();
for (const [index, entry] of entries.entries()) {
  for (const field of ["sourceCode", "targetCode", "level", "topic", "sourceText", "targetText", "license", "sourceUrl"]) {
    if (typeof entry?.[field] !== "string" || !entry[field].trim()) throw new Error(`Entry ${index + 1} is missing ${field}`);
  }
  if (!levels.has(entry.level)) throw new Error(`Entry ${index + 1} has an invalid CEFR level`);
  if (entry.sourceCode === entry.targetCode) throw new Error(`Entry ${index + 1} must use distinct source/target languages`);
  const key = `${entry.sourceCode}->${entry.targetCode}`;
  counts.set(key, (counts.get(key) ?? 0) + 1);
}

const belowThreshold = [...counts.entries()].filter(([, count]) => count < 1000);
console.log(JSON.stringify({ entries: entries.length, pairs: counts.size, belowThreshold }, null, 2));
if (belowThreshold.length) process.exitCode = 2;
