import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const [inputPath, outputPath = "content/tatoeba-spa-eng-a1.jsonl"] = process.argv.slice(2);
if (!inputPath) throw new Error("Usage: node scripts/prepare-tatoeba-batch.mjs <api-json> [output-jsonl]");

const payload = JSON.parse(await readFile(inputPath, "utf8"));
const rows = [];
for (const sentence of payload.results ?? []) {
  const translation = sentence.translations?.flat()?.find((item) => item.lang === "eng" && item.isDirect);
  const license = sentence.license;
  if (!translation || license !== "CC BY 2.0 FR") continue;
  if (sentence.audios?.length || translation.audios?.length) continue;
  const sourceText = String(sentence.text ?? "").trim();
  const targetText = String(translation.text ?? "").trim();
  if (!sourceText || !targetText) continue;
  rows.push({
    sourceCode: "es",
    targetCode: "en",
    levelCode: "A1",
    topic: "vida cotidiana",
    sourceText,
    targetText,
    exampleSource: sourceText,
    exampleTarget: targetText,
    license,
    sourceUrl: `https://tatoeba.org/en/sentences/show/${sentence.id}`,
    author: sentence.user?.username ?? "unknown",
    attribution: `Tatoeba sentence ${sentence.id} by ${sentence.user?.username ?? "unknown"}`,
    importedAt: new Date().toISOString().slice(0, 10),
  });
}
if (rows.length === 0) throw new Error("No eligible CC BY 2.0 FR direct text translations found");
await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, rows.map((row) => JSON.stringify(row)).join("\n") + "\n", "utf8");
console.log(JSON.stringify({ outputPath, count: rows.length, license: "CC BY 2.0 FR", audioExcluded: true }, null, 2));
