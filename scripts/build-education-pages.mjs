import { cpSync, existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, statSync } from 'node:fs';
import { resolve, join, dirname, sep } from 'node:path';
import { tmpdir } from 'node:os';

const root = resolve(process.cwd());
const requiredPages = [
  'index.html', 'ecosistema.html', 'itinerarios.html', 'metodo.html',
  'recursos.html', 'leccion-01.html', 'leccion-02.html', 'leccion-03.html',
];
const optionalPages = ['campus.html'];
const directories = [
  'education-system',
  'campus', 'open-data', 'public', 'docs', 'magic', 'assets', 'styles', 'images',
];

const check = process.argv.includes('--check');
const index = process.argv.indexOf('--destination');
if (check && index !== -1) throw new Error('Choose --check or --destination');
if (!check && (index < 0 || !process.argv[index + 1])) {
  throw new Error('Usage: node scripts/build-education-pages.mjs --check | --destination _site');
}
const stage = check
  ? mkdtempSync(join(tmpdir(), 'linguaforge-pages-'))
  : resolve(root, process.argv[index + 1]);
if (!check && (!stage.startsWith(root + sep) || existsSync(stage))) {
  throw new Error('Publication destination must be a new directory inside the repository');
}
function copyItem(name, required) {
  const source = join(root, name);
  if (!existsSync(source)) {
    if (required) throw new Error('Missing required publication source: ' + name);
    return;
  }
  cpSync(source, join(stage, name), { recursive: true, force: false });
}
function verifyReferences(page) {
  const html = readFileSync(join(stage, page), 'utf8');
  for (const [, raw] of html.matchAll(/\b(?:href|src)=["']([^"']+)["']/g)) {
    if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(raw)) continue;
    const location = decodeURIComponent(raw.split(/[?#]/)[0]);
    if (!location) continue;
    const target = resolve(dirname(join(stage, page)), location);
    if (target !== stage && !target.startsWith(stage + sep)) {
      throw new Error(page + ': link escapes published site: ' + raw);
    }
    const file = (location.endsWith('/') || (existsSync(target) && statSync(target).isDirectory()))
      ? join(target, 'index.html') : target;
    if (!existsSync(file) || !statSync(file).isFile()) {
      throw new Error(page + ': broken local link after packaging: ' + raw);
    }
  }
}
try {
  if (!check) mkdirSync(stage, { recursive: true });
  for (const item of requiredPages) copyItem(item, true);
  for (const item of optionalPages) copyItem(item, false);
  for (const item of directories) copyItem(item, item === 'education-system' || item === 'campus');
  for (const page of requiredPages) verifyReferences(page);
  for (const asset of ['education-system/theme.css', 'education-system/app.js', 'education-system/icon.svg']) {
    const file = join(stage, asset);
    if (!existsSync(file) || !statSync(file).isFile()) {
      throw new Error('Required design system asset missing from publication: ' + asset);
    }
  }
  console.log('Verified ' + requiredPages.length + ' institutional pages and local links in the publication bundle');
} finally {
  if (check) rmSync(stage, { recursive: true, force: true });
}
