#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const VALID_STATUSES = new Set([
  'NO MEDIDO',
  'EN CONSTRUCCIÓN',
  'VERIFICADO',
  'N/A JUSTIFICADO',
  'BLOQUEADO',
]);

const EXPECTED_IDS = Array.from(
  { length: 200 },
  (_, index) => `E${String(index + 1).padStart(3, '0')}`,
);

export function validateLedger(ledger) {
  if (!ledger || typeof ledger !== 'object' || Array.isArray(ledger)) {
    throw new TypeError('ledger must be an object');
  }
  if (ledger.contractVersion !== '1.0') {
    throw new Error('contractVersion must be 1.0');
  }
  if (typeof ledger.contractSource !== 'string' || !ledger.contractSource.startsWith('https://')) {
    throw new Error('contractSource must be an HTTPS URL');
  }
  if (typeof ledger.project !== 'string' || ledger.project.trim() === '') {
    throw new Error('project must be a non-empty string');
  }
  if (!ledger.rules || typeof ledger.rules !== 'object' || Array.isArray(ledger.rules)) {
    throw new Error('rules must be an object');
  }

  const actualIds = Object.keys(ledger.rules);
  const missing = EXPECTED_IDS.filter((id) => !Object.hasOwn(ledger.rules, id));
  const unknown = actualIds.filter((id) => !EXPECTED_IDS.includes(id));
  if (missing.length) throw new Error(`missing rule IDs: ${missing.join(', ')}`);
  if (unknown.length) throw new Error(`unknown rule IDs: ${unknown.join(', ')}`);

  let verified = 0;
  for (const id of EXPECTED_IDS) {
    const entry = ledger.rules[id];
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
      throw new Error(`${id} must be an object`);
    }
    if (!VALID_STATUSES.has(entry.status)) {
      throw new Error(`${id} has invalid status: ${String(entry.status)}`);
    }
    if (!Array.isArray(entry.evidence)) {
      throw new Error(`${id} evidence must be an array`);
    }
    if (entry.status === 'VERIFICADO') {
      if (entry.evidence.length === 0) throw new Error(`${id} requires evidence`);
      if (!entry.evidence.every((item) => typeof item === 'string' && item.trim() !== '')) {
        throw new Error(`${id} evidence entries must be non-empty strings`);
      }
      verified += 1;
    }
    if (
      entry.status === 'N/A JUSTIFICADO' &&
      (typeof entry.justification !== 'string' || entry.justification.trim() === '')
    ) {
      throw new Error(`${id} requires justification`);
    }
  }

  return { verified, total: EXPECTED_IDS.length };
}

function run() {
  const scriptDir = dirname(fileURLToPath(import.meta.url));
  const defaultLedger = resolve(scriptDir, '../docs/quality/evidence.json');
  const ledgerPath = resolve(process.cwd(), process.argv[2] ?? defaultLedger);
  const ledger = JSON.parse(readFileSync(ledgerPath, 'utf8'));
  const result = validateLedger(ledger);
  console.log(`education-contract: ${result.verified}/${result.total} verified`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    run();
  } catch (error) {
    console.error(`education-contract: ${error.message}`);
    process.exitCode = 1;
  }
}

