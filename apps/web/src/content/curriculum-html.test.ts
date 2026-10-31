import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { LESSONS } from './curriculum';

const WEB_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const OUTPUT_ROOT = join(WEB_ROOT, 'public/lesson-library');
const LOCALES = ['es', 'pt-BR', 'ca'] as const;
const SECTIONS = ['overview', 'study', 'practice', 'verify'] as const;
const PUBLISHED = LESSONS.filter((lesson) => lesson.status === 'publicada');

describe('static LinguaForge lesson library', () => {
  it('exports at least 200 distinct complete HTML learning pages from published lessons', () => {
    expect(existsSync(join(OUTPUT_ROOT, 'lesson-pages.css'))).toBe(true);
    expect(existsSync(join(OUTPUT_ROOT, 'index.html'))).toBe(true);

    const pages: string[] = [];
    for (const lesson of PUBLISHED) {
      for (const locale of LOCALES) {
        for (const section of SECTIONS) {
          const path = join(OUTPUT_ROOT, lesson.id, locale, section + '.html');
          expect(existsSync(path), lesson.id + '/' + locale + '/' + section).toBe(true);
          pages.push(path);
        }
      }
    }

    expect(pages.length).toBeGreaterThanOrEqual(200);
    expect(pages.length).toBe(PUBLISHED.length * LOCALES.length * SECTIONS.length);

    const uniqueDocuments = new Set<string>();
    for (const path of pages) {
      const html = readFileSync(path, 'utf8');
      const locale = path.split('/').at(-2) ?? 'es';
      expect(html).toContain('<html lang="' + locale + '">');
      expect(html).toContain('<meta name="viewport"');
      expect(html).toContain('class="skip"');
      expect((html.match(/<h1>/g) ?? []).length).toBe(1);
      expect(html.length).toBeGreaterThan(500);
      expect(html).not.toMatch(/<script\b|javascript:/i);
      uniqueDocuments.add(html);

      for (const [, href] of html.matchAll(/\bhref="([^"]+)"/g)) {
        if (href.startsWith('/')) continue;
        expect(existsSync(resolve(dirname(path), href)), path + ' -> ' + href).toBe(true);
      }
    }
    expect(uniqueDocuments.size).toBe(pages.length);
  });

  it('keeps the catalogue aligned with the lessons actually published', () => {
    const index = readFileSync(join(OUTPUT_ROOT, 'index.html'), 'utf8');
    for (const lesson of PUBLISHED) {
      expect(index).toContain(lesson.id + '/es/overview.html');
      for (const locale of LOCALES) {
        expect(index).toContain(lesson.id + '/' + locale + '/overview.html');
      }
    }
    const generatedDirectories = readdirSync(OUTPUT_ROOT, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort();
    expect(generatedDirectories).toEqual(PUBLISHED.map((lesson) => lesson.id).sort());
  });
});
