import assert from 'node:assert/strict';
import test from 'node:test';

import { validateLedger } from './verify-education-contract.mjs';

const completeRules = () =>
  Object.fromEntries(
    Array.from({ length: 200 }, (_, index) => [
      `E${String(index + 1).padStart(3, '0')}`,
      { status: 'NO MEDIDO', evidence: [] },
    ]),
  );

const ledger = (rules = completeRules()) => ({
  contractVersion: '1.0',
  contractSource:
    'https://github.com/belentani7/open-school/blob/main/docs/CONTRATO_EDUCATIVO_200_REGLAS.md',
  project: 'open-school',
  measuredAt: null,
  rules,
});

test('accepts a complete baseline with all 200 rule IDs', () => {
  assert.deepEqual(validateLedger(ledger()), { verified: 0, total: 200 });
});

test('rejects a ledger with a missing rule ID', () => {
  const rules = completeRules();
  delete rules.E200;
  assert.throws(() => validateLedger(ledger(rules)), /missing rule IDs: E200/);
});

test('rejects verified status without linked evidence', () => {
  const rules = completeRules();
  rules.E001 = { status: 'VERIFICADO', evidence: [] };
  assert.throws(() => validateLedger(ledger(rules)), /E001.*requires evidence/);
});

test('rejects an unknown status', () => {
  const rules = completeRules();
  rules.E001 = { status: 'VERDE', evidence: [] };
  assert.throws(() => validateLedger(ledger(rules)), /E001.*invalid status/);
});

test('requires a justification when a rule is marked not applicable', () => {
  const rules = completeRules();
  rules.E001 = { status: 'N/A JUSTIFICADO', evidence: [] };
  assert.throws(() => validateLedger(ledger(rules)), /E001.*requires justification/);
});
