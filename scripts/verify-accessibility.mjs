import { readFile } from "node:fs/promises";

const checks = [
  {
    file: "client/src/index.css",
    description: "foco visible global",
    pattern: /:focus-visible/,
  },
  {
    file: "client/src/pages/Home.tsx",
    description: "diálogo de diagnóstico con nombre accesible",
    pattern: /role=["']dialog["'][\s\S]*aria-modal=["']true["'][\s\S]*aria-labelledby=/,
  },
  {
    file: "client/src/pages/Home.tsx",
    description: "controles de formulario etiquetados",
    pattern: /htmlFor=/,
  },
  {
    file: "client/src/components/DashboardLayout.tsx",
    description: "botón de navegación móvil con nombre accesible",
    pattern: /aria-label=/,
  },
  {
    file: "client/src/pages/NotFound.tsx",
    description: "ruta de salida semántica",
    pattern: /<Button[\s\S]*onClick=/,
  },
];

const failures = [];
for (const check of checks) {
  const source = await readFile(check.file, "utf8");
  if (!check.pattern.test(source)) failures.push(check);
}

const result = {
  checked: checks.map(({ file, description }) => ({ file, description })),
  passed: failures.length === 0,
  failures: failures.map(({ file, description }) => ({ file, description })),
};

console.log(JSON.stringify(result, null, 2));
if (!result.passed) process.exitCode = 1;
