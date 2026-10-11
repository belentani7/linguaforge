import type { Locale, Localized } from "@/content/types";

export type Severity = "error" | "warning" | "info";

export interface Finding {
  line: number;
  column: number;
  severity: Severity;
  rule: string;
  message: Localized;
}

/** Hallazgo ya resuelto al idioma pedido por el alumno. */
export interface ResolvedFinding extends Omit<Finding, "message"> {
  message: string;
}

interface Rule {
  id: string;
  severity: Severity;
  /** Devuelve la columna (1-based) de la primera coincidencia o null. */
  test: (line: string, source: string) => number | null;
  message: Localized;
}

function firstMatch(line: string, pattern: RegExp): number | null {
  const m = pattern.exec(line);
  return m ? m.index + 1 : null;
}

/**
 * Reglas deterministas y explicables. Cada una describe un problema frecuente
 * en código de agentes de IA. Son el "tutor sin modelo": funcionan sin claves
 * de API, y el tutor con LLM las usa como contexto adicional.
 */
export const RULES: Rule[] = [
  {
    id: "no-var",
    severity: "warning",
    test: (line) => firstMatch(line, /\bvar\s+[A-Za-z_$]/),
    message: {
      es: "Usa const o let en lugar de var: var tiene alcance de función y evita muchos errores sutiles.",
      "pt-BR": "Use const ou let em vez de var: var tem escopo de função e causa erros sutis.",
      ca: "Fes servir const o let en lloc de var: var té àmbit de funció i provoca errors subtils.",
    },
  },
  {
    id: "strict-equality",
    severity: "warning",
    test: (line) => firstMatch(line, /[^=!<>]==[^=]|!=[^=]/),
    message: {
      es: "Compara con === y !== para evitar conversiones implícitas de tipo.",
      "pt-BR": "Compare com === e !== para evitar conversões implícitas de tipo.",
      ca: "Compara amb === i !== per evitar conversions implícites de tipus.",
    },
  },
  {
    id: "fetch-sin-await",
    severity: "error",
    test: (line) => (/\bfetch\s*\(/.test(line) && !/\bawait\b|\breturn\b|\.then\s*\(/.test(line) ? firstMatch(line, /\bfetch\s*\(/) : null),
    message: {
      es: "fetch devuelve una promesa. Espérala con await o encadena .then(); de lo contrario trabajarás con una promesa pendiente.",
      "pt-BR": "fetch retorna uma promise. Aguarde com await ou encadeie .then(); caso contrário, você trabalhará com uma promise pendente.",
      ca: "fetch retorna una promesa. Espera-la amb await o encadena .then(); si no, treballaràs amb una promesa pendent.",
    },
  },
  {
    id: "json-parse-sin-proteccion",
    severity: "warning",
    test: (line, source) => (/JSON\.parse\s*\(/.test(line) && !/\btry\s*\{/.test(source) ? firstMatch(line, /JSON\.parse\s*\(/) : null),
    message: {
      es: "JSON.parse lanza una excepción si la entrada no es JSON válido. Envuélvelo en try/catch, sobre todo con datos del modelo.",
      "pt-BR": "JSON.parse lança exceção se a entrada não for JSON válido. Envolva com try/catch, principalmente com dados do modelo.",
      ca: "JSON.parse llança una excepció si l'entrada no és JSON vàlid. Envolta'l amb try/catch, sobretot amb dades del model.",
    },
  },
  {
    id: "catch-vacio",
    severity: "warning",
    test: (line) => firstMatch(line, /catch\s*(\([^)]*\))?\s*\{\s*\}/),
    message: {
      es: "Un catch vacío oculta los errores. Como mínimo registra el error o devuélvelo con contexto.",
      "pt-BR": "Um catch vazio oculta erros. No mínimo registre o erro ou retorne-o com contexto.",
      ca: "Un catch buit amaga els errors. Com a mínim registra l'error o retorna'l amb context.",
    },
  },
  {
    id: "eval-o-function",
    severity: "error",
    test: (line) => firstMatch(line, /\beval\s*\(|new\s+Function\s*\(/),
    message: {
      es: "eval y new Function ejecutan texto como código. Con salidas de un modelo supone un riesgo de inyección. Evítalos.",
      "pt-BR": "eval e new Function executam texto como código. Com saídas de um modelo isso é um risco de injeção. Evite-os.",
      ca: "eval i new Function executen text com a codi. Amb sortides d'un model és un risc d'injecció. Evita'ls.",
    },
  },
  {
    id: "console-log",
    severity: "info",
    test: (line) => firstMatch(line, /console\.log\s*\(/),
    message: {
      es: "Hay un console.log. Recuerda retirarlo antes de entregar o usa un registro estructurado.",
      "pt-BR": "Há um console.log. Lembre de removê-lo antes de entregar ou use um registro estruturado.",
      ca: "Hi ha un console.log. Recorda retirar-lo abans d'entregar o fes servir un registre estructurat.",
    },
  },
  {
    id: "clave-api-literal",
    severity: "error",
    test: (line) => firstMatch(line, /(sk-[A-Za-z0-9]{16,}|api[_-]?key\s*[:=]\s*["'][^"']{12,}["'])/i),
    message: {
      es: "Parece una clave de API escrita en el código. Muévela a variables de entorno del servidor y rótala si ya se publicó.",
      "pt-BR": "Parece uma chave de API escrita no código. Mova-a para variáveis de ambiente do servidor e troque-a se já foi publicada.",
      ca: "Sembla una clau d'API escrita al codi. Mou-la a variables d'entorn del servidor i rota-la si ja s'ha publicat.",
    },
  },
  {
    id: "bucle-sin-limite",
    severity: "warning",
    test: (line) => firstMatch(line, /while\s*\(\s*(true|1)\s*\)/),
    message: {
      es: "Un bucle while(true) necesita una condición de salida explícita y un límite de iteraciones.",
      "pt-BR": "Um laço while(true) precisa de uma condição de saída explícita e de um limite de iterações.",
      ca: "Un bucle while(true) necessita una condició de sortida explícita i un límit d'iteracions.",
    },
  },
];

/**
 * Revisa el código línea por línea. Devuelve hallazgos ordenados por línea.
 * Las líneas de comentario se ignoran para no penalizar explicaciones.
 */
export function reviewCode(source: string, locale: Locale = "es"): ResolvedFinding[] {
  const lines = source.split(/\r?\n/);
  const findings: Finding[] = [];
  lines.forEach((raw, idx) => {
    const trimmed = raw.trim();
    if (trimmed.length === 0 || trimmed.startsWith("//")) return;
    for (const rule of RULES) {
      const column = rule.test(raw, source);
      if (column !== null) {
        findings.push({ line: idx + 1, column, severity: rule.severity, rule: rule.id, message: rule.message });
      }
    }
  });
  return findings
    .sort((a, b) => a.line - b.line || a.column - b.column)
    .map((f) => ({ ...f, message: f.message[locale] }));
}

export function summarizeFindings(findings: Pick<Finding, "severity">[], locale: Locale = "es"): string {
  const errors = findings.filter((f) => f.severity === "error").length;
  const warnings = findings.filter((f) => f.severity === "warning").length;
  const map: Record<Locale, string> = {
    es: `${errors} error(es) y ${warnings} aviso(s).`,
    "pt-BR": `${errors} erro(s) e ${warnings} aviso(s).`,
    ca: `${errors} error(s) i ${warnings} avís(os).`,
  };
  return map[locale];
}
