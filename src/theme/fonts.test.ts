import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = join(import.meta.dirname, '..', '..');
const fontsCss = readFileSync(join(import.meta.dirname, 'fonts.css'), 'utf8');

describe('fonts', () => {
  it('ships Inter and Outfit variable fonts with their OFL licenses', () => {
    for (const file of [
      'fonts/inter-variable.woff2',
      'fonts/outfit-variable.ttf',
      'fonts/OFL-Inter.txt',
      'fonts/OFL-Outfit.txt',
    ]) {
      expect(existsSync(join(root, file))).toBe(true);
    }
    for (const license of ['fonts/OFL-Inter.txt', 'fonts/OFL-Outfit.txt']) {
      expect(readFileSync(join(root, license), 'utf8')).toContain('SIL Open Font License');
    }
  });

  it('fonts.css points every @font-face to a file shipped in fonts/', () => {
    const paths = [...fontsCss.matchAll(/url\('([^']+)'\)/g)].map((m) => m[1] ?? '');
    expect(paths.length).toBeGreaterThanOrEqual(2);
    for (const path of paths) {
      expect(existsSync(join(import.meta.dirname, path))).toBe(true);
    }
    expect(fontsCss).toMatch(/font-family:\s*'Inter'/);
    expect(fontsCss).toMatch(/font-family:\s*'Outfit'/);
  });

  it('fonts.css never loads a font from the network', () => {
    expect(fontsCss).not.toMatch(/https?:/);
    expect(fontsCss).not.toMatch(/url\(\s*['"]?\/\//);
  });
});
