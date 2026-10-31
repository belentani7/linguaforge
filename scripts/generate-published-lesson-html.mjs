#!/usr/bin/env node
/**
 * Export the existing published LinguaForge lessons as accessible, static HTML.
 * The TypeScript curriculum remains the single source of truth.
 */
import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { LESSONS } from '../apps/web/src/content/curriculum.ts';

const PROJECT_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUTPUT_ROOT = join(PROJECT_ROOT, 'apps/web/public/lesson-library');
const LOCALES = ['es', 'pt-BR', 'ca'];
const SECTION_IDS = ['overview', 'study', 'practice', 'verify'];
const LABELS = {
  es: {
    skip: 'Saltar al contenido', catalog: 'Biblioteca de lecciones', app: 'Abrir espacio interactivo',
    overview: 'Objetivos', study: 'Estudiar', practice: 'Practicar', verify: 'Verificar',
    objectives: 'Al terminar podrás', voice: 'Introducción', theory: 'Desarrollo',
    starter: 'Código inicial', hints: 'Pistas graduadas', checks: 'Pruebas de verificación',
    noChecks: 'Esta lección todavía no declara pruebas automáticas.',
    note: 'Continúa en el espacio interactivo para ejecutar código y comprobar los resultados.',
    language: 'Edición de idioma',
  },
  'pt-BR': {
    skip: 'Pular para o conteúdo', catalog: 'Biblioteca de lições', app: 'Abrir espaço interativo',
    overview: 'Objetivos', study: 'Estudar', practice: 'Praticar', verify: 'Verificar',
    objectives: 'Ao concluir, você poderá', voice: 'Introdução', theory: 'Desenvolvimento',
    starter: 'Código inicial', hints: 'Dicas graduais', checks: 'Testes de verificação',
    noChecks: 'Esta lição ainda não declara testes automáticos.',
    note: 'Continue no espaço interativo para executar o código e conferir os resultados.',
    language: 'Edição de idioma',
  },
  ca: {
    skip: 'Ves al contingut', catalog: 'Biblioteca de lliçons', app: 'Obre l’espai interactiu',
    overview: 'Objectius', study: 'Estudiar', practice: 'Practicar', verify: 'Verificar',
    objectives: 'En acabar podràs', voice: 'Introducció', theory: 'Desenvolupament',
    starter: 'Codi inicial', hints: 'Pistes graduades', checks: 'Proves de verificació',
    noChecks: 'Aquesta lliçó encara no declara proves automàtiques.',
    note: 'Continua a l’espai interactiu per executar el codi i comprovar els resultats.',
    language: 'Edició d’idioma',
  },
};
const SECTION_LABELS = {
  overview: { es: 'Objetivos', 'pt-BR': 'Objetivos', ca: 'Objectius' },
  study: { es: 'Estudiar', 'pt-BR': 'Estudar', ca: 'Estudiar' },
  practice: { es: 'Practicar', 'pt-BR': 'Praticar', ca: 'Practicar' },
  verify: { es: 'Verificar', 'pt-BR': 'Verificar', ca: 'Verificar' },
};

export function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function list(items) {
  return '<ul>' + items.map((item) => '<li>' + escapeHtml(item) + '</li>').join('') + '</ul>';
}

function sectionContent(lesson, locale, section) {
  const copy = LABELS[locale];
  if (section === 'overview') {
    return '<section><h2>' + escapeHtml(copy.objectives) + '</h2>' +
      list(lesson.objectives[locale]) +
      '<h2>' + escapeHtml(copy.voice) + '</h2><p>' + escapeHtml(lesson.voiceIntro[locale]) + '</p></section>';
  }
  if (section === 'study') {
    return '<section><h2>' + escapeHtml(copy.theory) + '</h2>' +
      lesson.theory[locale].map((paragraph) => '<p>' + escapeHtml(paragraph) + '</p>').join('') +
      '<h2>' + escapeHtml(copy.objectives) + '</h2>' + list(lesson.objectives[locale]) + '</section>';
  }
  if (section === 'practice') {
    return '<section><h2>' + escapeHtml(copy.starter) + '</h2><pre><code>' +
      escapeHtml(lesson.starterCode[locale]) + '</code></pre><h2>' + escapeHtml(copy.hints) +
      '</h2>' + list(lesson.hints[locale]) + '<p>' + escapeHtml(copy.note) + '</p></section>';
  }
  const checks = lesson.tests.length
    ? '<ol>' + lesson.tests.map((item) => '<li><code>' + escapeHtml(item.expr) + '</code></li>').join('') + '</ol>'
    : '<p>' + escapeHtml(copy.noChecks) + '</p>';
  return '<section><h2>' + escapeHtml(copy.checks) + '</h2>' + checks +
    '<p>' + escapeHtml(copy.note) + '</p></section>';
}

function stylesheet() {
  return [
    ':root{color-scheme:dark;--bg:#050505;--surface:#101010;--surface-2:#171717;--ink:#fff;--muted:#b3b3b3;--line:#343434;--red:#ff7777;--gold:#fde047;--violet:#d8b4fe;font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif}',
    '*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--bg);color:var(--ink);font-size:1rem;line-height:1.7}',
    'a{color:var(--gold);text-underline-offset:.2em}a:hover{color:#fff}:focus-visible{outline:3px solid var(--gold);outline-offset:4px}',
    '.skip{position:absolute;left:1rem;top:-8rem;z-index:10;padding:.7rem 1rem;background:#fff;color:#050505}.skip:focus{top:1rem}',
    '.topbar{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:1rem clamp(1rem,4vw,3rem);border-bottom:1px solid var(--line);background:#0b0b0b}',
    '.brand{color:#fff;font-weight:800;letter-spacing:.08em;text-decoration:none}.brand small{display:block;color:var(--muted);font-size:.72rem;font-weight:500;letter-spacing:0}',
    '.layout{width:min(100% - 2rem,58rem);margin:2.5rem auto 5rem}.eyebrow{color:var(--violet);font-size:.75rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase}',
    'h1{max-width:22ch;font-size:clamp(2rem,5vw,3.8rem);line-height:1.08;letter-spacing:-.04em}h2{margin-top:2.3rem;font-size:1.3rem}',
    '.summary,.panel{padding:clamp(1.1rem,4vw,2rem);border:1px solid var(--line);border-radius:1.2rem;background:var(--surface)}.summary{color:#dedede;font-size:1.08rem}',
    '.panel{margin-top:1.2rem}.panel p{max-width:75ch}.panel li{margin:.5rem 0}.panel code{overflow-wrap:anywhere}.panel pre{overflow-x:auto;padding:1rem;border-radius:.8rem;background:#080808;color:#e9d5ff}',
    '.section-nav,.language-nav{display:flex;flex-wrap:wrap;gap:.55rem;margin:1rem 0}.section-nav a,.language-nav a,.button{display:inline-flex;align-items:center;gap:.4rem;padding:.55rem .8rem;border:1px solid var(--line);border-radius:999px;background:var(--surface);text-decoration:none}',
    '[aria-current=page]{border-color:var(--violet)!important;color:#fff!important}.actions{display:flex;flex-wrap:wrap;gap:.7rem;margin:1.3rem 0}.actions .primary{border-color:#fde047;color:#050505;background:#fde047;font-weight:800}',
    '.site-footer{padding:1.3rem clamp(1rem,4vw,3rem);border-top:1px solid var(--line);color:var(--muted);font-size:.82rem}',
    '@media(max-width:38rem){.topbar{align-items:flex-start;flex-direction:column}.layout{margin-top:1.2rem}}',
    '@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}@media print{body{background:#fff;color:#111}.topbar,.section-nav,.language-nav,.site-footer,.actions,.skip{display:none}.layout{width:100%;margin:0}.panel,.summary{border:0;padding:0;background:#fff}a{color:inherit}}',
  ].join('\n');
}

function renderPage(lesson, locale, section) {
  const copy = LABELS[locale];
  const sectionTitle = SECTION_LABELS[section][locale];
  const path = section + '.html';
  const sectionLinks = SECTION_IDS.map((id) =>
    '<a href="' + id + '.html"' + (id === section ? ' aria-current="page"' : '') + '>' +
      escapeHtml(SECTION_LABELS[id][locale]) + '</a>',
  ).join('');
  const languageLinks = LOCALES.map((option) =>
    '<a href="../' + escapeHtml(option) + '/overview.html"' +
      (option === locale ? ' aria-current="page"' : '') + ' lang="' + escapeHtml(option) + '">' +
      escapeHtml(option) + '</a>',
  ).join('');
  const body = [
    '<a class="skip" href="#main">' + escapeHtml(copy.skip) + '</a>',
    '<header class="topbar"><a class="brand" href="/cursos/' + escapeHtml(lesson.id) + '">LinguaForge<small>Aprendizaje verificable</small></a><a href="/cursos/' + escapeHtml(lesson.id) + '">' + escapeHtml(copy.app) + '</a></header>',
    '<main id="main" class="layout">',
    '<p class="eyebrow">LinguaForge · nivel ' + escapeHtml(lesson.level) + ' · ' + escapeHtml(locale) + '</p>',
    '<h1>' + escapeHtml(lesson.title[locale]) + '</h1>',
    '<p class="summary">' + escapeHtml(lesson.summary[locale]) + '</p>',
    '<nav class="section-nav" aria-label="' + escapeHtml(copy.catalog) + '">' + sectionLinks + '</nav>',
    '<nav class="language-nav" aria-label="' + escapeHtml(copy.language) + '">' + languageLinks + '</nav>',
    '<article class="panel"><h2>' + escapeHtml(sectionTitle) + '</h2>' + sectionContent(lesson, locale, section) + '</article>',
    '<div class="actions"><a class="button primary" href="/cursos/' + escapeHtml(lesson.id) + '">' + escapeHtml(copy.app) + '</a></div>',
    '</main>',
    '<footer class="site-footer">LinguaForge · contenido multilingüe revisable · ' + escapeHtml(lesson.minutes) + ' min</footer>',
  ].join('\n');
  return [
    '<!doctype html>',
    '<html lang="' + escapeHtml(locale) + '">',
    '<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">',
    '<meta name="color-scheme" content="dark"><meta name="description" content="' + escapeHtml(lesson.summary[locale]) + '">',
    '<title>' + escapeHtml(lesson.title[locale]) + ' · ' + escapeHtml(sectionTitle) + ' · LinguaForge</title>',
    '<link rel="stylesheet" href="/lesson-library/lesson-pages.css"></head>',
    '<body>' + body + '</body></html>',
  ].join('\n');
}

function renderCatalogue(lessons) {
  const rows = lessons.map((lesson) =>
    '<li><strong>' + escapeHtml(lesson.title.es) + '</strong><span> Nivel ' + lesson.level +
      ' · ' + lesson.minutes + ' min · ' + escapeHtml(lesson.summary.es) + '</span><nav>' +
      LOCALES.map((locale) => '<a href="' + encodeURIComponent(lesson.id) + '/' + escapeHtml(locale) + '/overview.html" lang="' + escapeHtml(locale) + '">' +
        escapeHtml(locale) + '</a>').join('') + '</nav></li>',
  ).join('');
  const body = '<a class="skip" href="#main">Saltar al contenido</a><header class="topbar"><a class="brand" href="/cursos">LinguaForge<small>Biblioteca de lecciones</small></a></header>' +
    '<main id="main" class="layout"><p class="eyebrow">Material publicado</p><h1>Biblioteca de estudio</h1>' +
    '<p class="summary">Edición estática de las lecciones publicadas en el currículo. Cada lección separa objetivos, estudio, práctica y verificación en tres idiomas.</p>' +
    '<ol class="panel">' + rows + '</ol></main><footer class="site-footer">LinguaForge · una fuente de contenido</footer>';
  return '<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="dark"><title>Biblioteca de estudio · LinguaForge</title><link rel="stylesheet" href="/lesson-library/lesson-pages.css"></head><body>' + body + '</body></html>';
}

export function generatePublishedLessonPages() {
  const published = LESSONS.filter((lesson) => lesson.status === 'publicada');
  const ids = new Set();
  for (const lesson of published) {
    assert.match(lesson.id, /^[a-z0-9-]+$/, 'Lesson IDs must be safe path segments');
    assert.ok(!ids.has(lesson.id), 'Published lesson IDs must be unique: ' + lesson.id);
    ids.add(lesson.id);
    for (const locale of LOCALES) {
      assert.ok(lesson.title[locale] && lesson.summary[locale], lesson.id + ' needs localized title and summary for ' + locale);
      assert.ok(lesson.objectives[locale].length && lesson.theory[locale].length, lesson.id + ' needs localized learning content for ' + locale);
      assert.ok(lesson.starterCode[locale] && lesson.hints[locale].length, lesson.id + ' needs localized practice content for ' + locale);
    }
  }
  const pageCount = published.length * LOCALES.length * SECTION_IDS.length;
  assert.ok(pageCount >= 200, 'Published lesson export below platform minimum: ' + pageCount + '/200');

  mkdirSync(OUTPUT_ROOT, { recursive: true });
  writeFileSync(join(OUTPUT_ROOT, 'lesson-pages.css'), stylesheet());
  writeFileSync(join(OUTPUT_ROOT, 'index.html'), renderCatalogue(published));
  for (const lesson of published) {
    for (const locale of LOCALES) {
      for (const section of SECTION_IDS) {
        const output = join(OUTPUT_ROOT, lesson.id, locale, section + '.html');
        mkdirSync(dirname(output), { recursive: true });
        const html = renderPage(lesson, locale, section);
        assert.match(html, /<h1>/);
        assert.doesNotMatch(html, /<script\b|javascript:/i);
        writeFileSync(output, html);
      }
    }
  }

  for (const lesson of published) {
    for (const locale of LOCALES) {
      for (const section of SECTION_IDS) {
        const output = join(OUTPUT_ROOT, lesson.id, locale, section + '.html');
        assert.ok(statSync(output).size > 500, 'Generated page is incomplete: ' + output);
      }
    }
  }
  if (pageCount < 200) throw new Error('LinguaForge HTML minimum not met');
  return { publishedLessons: published.length, locales: LOCALES.length, sections: SECTION_IDS.length, pages: pageCount };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const summary = generatePublishedLessonPages();
  console.log('LinguaForge lesson HTML: ' + summary.pages + ' pages from ' + summary.publishedLessons + ' published lessons');
}
