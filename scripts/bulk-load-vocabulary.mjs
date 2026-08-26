#!/usr/bin/env node
/**
 * Bulk vocabulary loader for Linguaforge
 * Reads JSONL files (Tatoeba, Wiktionary) and inserts into MySQL via Drizzle ORM
 *
 * Usage:
 *   DATABASE_URL="mysql://..." pnpm run bulk:load content/tatoeba-*.jsonl
 */

import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mysql from "mysql2/promise";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.join(__dirname, "../content");

// Schema tables (must match drizzle schema)
const SCHEMA_TABLES = {
  languages: "languages",
  languagePaths: "languagePaths",
  cefrLevels: "cefrLevels",
  vocabularyEntries: "vocabularyEntries",
};

async function initDb() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error(
      "DATABASE_URL env var required. Set it to your MySQL connection string."
    );
  }

  try {
    // For local testing, create a simple connection pool
    const pool = await mysql.createPool(dbUrl);
    return { pool, db: drizzle(dbUrl) };
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    throw error;
  }
}

async function lookupLanguageIds(pool, sourceCode, targetCode) {
  const query = `
    SELECT id, code FROM ${SCHEMA_TABLES.languages}
    WHERE code IN (?, ?)
  `;
  const [rows] = await pool.execute(query, [sourceCode, targetCode]);

  if (rows.length < 2) {
    throw new Error(
      `Languages not found: ${sourceCode}, ${targetCode}. Ensure they exist in database.`
    );
  }

  const map = Object.fromEntries(rows.map((r) => [r.code, r.id]));
  return {
    sourceId: map[sourceCode],
    targetId: map[targetCode],
  };
}

async function lookupLanguagePath(pool, sourceId, targetId) {
  const query = `
    SELECT id FROM ${SCHEMA_TABLES.languagePaths}
    WHERE sourceLanguageId = ? AND targetLanguageId = ?
  `;
  const [rows] = await pool.execute(query, [sourceId, targetId]);

  if (rows.length === 0) {
    // Create path if it doesn't exist
    const insert = `
      INSERT INTO ${SCHEMA_TABLES.languagePaths}
      (sourceLanguageId, targetLanguageId, isActive)
      VALUES (?, ?, 1)
    `;
    const [result] = await pool.execute(insert, [sourceId, targetId]);
    return result.insertId;
  }

  return rows[0].id;
}

async function lookupCefrLevelId(pool, levelCode) {
  const query = `
    SELECT id FROM ${SCHEMA_TABLES.cefrLevels} WHERE code = ?
  `;
  const [rows] = await pool.execute(query, [levelCode]);

  if (rows.length === 0) {
    throw new Error(`CEFR level not found: ${levelCode}`);
  }

  return rows[0].id;
}

async function loadVocabularyBatch(pool, filePath) {
  console.log(`\n📖 Loading: ${path.basename(filePath)}`);

  const content = await readFile(filePath, "utf8");
  const lines = content
    .split("\n")
    .filter(Boolean)
    .map((l) => JSON.parse(l));

  if (lines.length === 0) {
    console.warn(`  ⚠️  No entries found in file`);
    return { file: path.basename(filePath), loaded: 0, skipped: 0 };
  }

  // Extract metadata from first entry
  const sample = lines[0];
  const { sourceCode, targetCode, levelCode } = sample;

  // Lookup IDs
  const { sourceId, targetId } = await lookupLanguageIds(
    pool,
    sourceCode,
    targetCode
  );
  const pathId = await lookupLanguagePath(pool, sourceId, targetId);
  const levelId = await lookupCefrLevelId(pool, levelCode);

  // Prepare bulk insert
  let loaded = 0;
  let skipped = 0;
  const insertQuery = `
    INSERT INTO ${SCHEMA_TABLES.vocabularyEntries}
    (pathId, levelId, topic, sourceText, targetText, exampleSource, exampleTarget, license, sourceUrl)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  for (const entry of lines) {
    try {
      await pool.execute(insertQuery, [
        pathId,
        levelId,
        entry.topic || "general",
        entry.sourceText,
        entry.targetText,
        entry.exampleSource || entry.sourceText,
        entry.exampleTarget || entry.targetText,
        entry.license || "CC BY 2.0 FR",
        entry.sourceUrl || null,
      ]);
      loaded++;
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        skipped++;
      } else {
        console.error(`  Error inserting entry:`, error.message);
      }
    }

    if ((loaded + skipped) % 50 === 0) {
      console.log(`  ${loaded} loaded, ${skipped} skipped...`);
    }
  }

  console.log(`  ✓ ${loaded} entries loaded, ${skipped} duplicates skipped`);
  return {
    file: path.basename(filePath),
    path: `${sourceCode}→${targetCode}`,
    level: levelCode,
    loaded,
    skipped,
  };
}

async function main() {
  console.log("🚀 Linguaforge Bulk Vocabulary Loader\n");

  const { pool } = await initDb();

  try {
    const args = process.argv.slice(2);
    const patterns =
      args.length > 0
        ? args
        : [
            "tatoeba-*.jsonl",
            "dictionary-*.jsonl",
            "audio-metadata-*.jsonl",
          ];

    const results = [];

    for (const pattern of patterns) {
      const files = await readdir(CONTENT_DIR);
      const matching = files.filter((f) => {
        const globParts = pattern.split("*");
        return (
          globParts[0] &&
          f.startsWith(globParts[0]) &&
          f.endsWith(globParts[1] || ".jsonl")
        );
      });

      for (const file of matching) {
        const filePath = path.join(CONTENT_DIR, file);
        const result = await loadVocabularyBatch(pool, filePath);
        results.push(result);
      }
    }

    console.log("\n✅ Bulk load complete.");
    console.log(
      `📊 Total: ${results.reduce((a, r) => a + r.loaded, 0)} entries loaded`
    );
    console.log(results);
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});
