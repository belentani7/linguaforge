// Presupuesto de tamaño del JS inicial (gzip) generado por `vite build`.
// Umbral medido en la línea base + margen. Se baja a medida que se optimiza.
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const BUDGET_KB_GZIP = 300;
const assetsDir = path.resolve("dist/public/assets");

if (!fs.existsSync(assetsDir)) {
  console.error(
    "bundle-budget: no existe dist/public/assets. Ejecuta `pnpm build` antes."
  );
  process.exit(1);
}

const jsFiles = fs.readdirSync(assetsDir).filter(name => name.endsWith(".js"));
const sizes = jsFiles
  .map(name => ({
    name,
    gzipBytes: zlib.gzipSync(fs.readFileSync(path.join(assetsDir, name)))
      .length,
  }))
  .sort((a, b) => b.gzipBytes - a.gzipBytes);

const totalKb = sizes.reduce((sum, file) => sum + file.gzipBytes, 0) / 1024;
for (const file of sizes)
  console.log(
    `${(file.gzipBytes / 1024).toFixed(1).padStart(7)} KB gzip  ${file.name}`
  );
console.log(
  `JS total: ${totalKb.toFixed(1)} KB gzip (presupuesto ${BUDGET_KB_GZIP} KB)`
);

if (totalKb > BUDGET_KB_GZIP) {
  console.error("bundle-budget: FALLA. El JS supera el presupuesto.");
  process.exit(1);
}
console.log("bundle-budget: OK");
