import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  dark,
  fontSizes,
  fontWeights,
  fonts,
  gradients,
  itemPalette,
  light,
  lineHeights,
  motion,
  radii,
  spacing,
  zIndices,
} from './tokens';

const css = readFileSync(join(import.meta.dirname, 'tokens.css'), 'utf8');

function toKebab(name: string): string {
  return name
    .replace(/([A-Z])/g, '-$1')
    .replace(/(\d+)/g, '-$1')
    .toLowerCase();
}

// O Prettier minuscula hex e remove zeros finais de decimais; compara-se o valor normalizado.
function normalize(value: string): string {
  return value
    .toLowerCase()
    .replaceAll('"', "'")
    .replace(/(\.\d*?)0+\b/g, '$1')
    .replace(/\.(?=\D|$)/g, '')
    .replace(/\s+/g, ' ');
}

// O navegador serializa o gradiente sem espaço depois da vírgula.
function compact(value: string): string {
  return normalize(value).replaceAll(' ', '');
}

function readDeclarations(body: string): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const match of body.matchAll(/(--[\w-]+):\s*([^;]+);/g)) {
    vars[match[1] ?? ''] = normalize((match[2] ?? '').trim());
  }
  return vars;
}

function blockFrom(source: string, selector: string, from = 0): Record<string, string> {
  const start = source.indexOf(`${selector} {`, from);
  const end = source.indexOf('}', start);
  return readDeclarations(source.slice(start, end));
}

function block(selector: string): Record<string, string> {
  return blockFrom(css, selector);
}

function expected(theme: Record<string, string>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(theme).map(([k, v]) => [`--${toKebab(k)}`, normalize(v)]),
  );
}

function sharedScales(): Record<string, string> {
  const map: Record<string, string> = {};
  for (const [k, v] of Object.entries(radii)) map[`--radius-${k}`] = `${String(v)}px`;
  map['--space'] = `${String(spacing.unit)}px`;
  for (const n of spacing.steps) map[`--s${String(n)}`] = `calc(var(--space) * ${String(n)})`;
  for (const [k, v] of Object.entries(fontSizes))
    map[`--font-size-${toKebab(k)}`] = `${String(v)}px`;
  for (const k of ['brand', 'deep', 'calm'] as const) {
    const [a, b] = gradients[k];
    map[`--${k}-gradient`] = `linear-gradient(135deg, ${a}, ${b})`;
  }
  for (const [k, v] of Object.entries(fonts)) map[`--font-${k}`] = v;
  for (const [k, v] of Object.entries(fontWeights)) map[`--font-weight-${k}`] = String(v);
  for (const [k, v] of Object.entries(lineHeights)) map[`--line-height-${k}`] = String(v);
  for (const [k, v] of Object.entries(zIndices)) map[`--z-${k}`] = String(v);
  for (const k of ['fast', 'base', 'slow'] as const)
    map[`--motion-${k}`] = `${String(motion[k])}ms`;
  for (const [k, v] of Object.entries(motion.ease)) map[`--motion-ease-${k}`] = v;
  itemPalette.forEach(([from, to], i) => {
    map[`--item-palette-${String(i + 1)}-from`] = from;
    map[`--item-palette-${String(i + 1)}-to`] = to;
  });
  return Object.fromEntries(Object.entries(map).map(([k, v]) => [k, normalize(v)]));
}

describe('tokens', () => {
  it('light and dark have the same keys', () => {
    expect(Object.keys(dark).sort()).toEqual(Object.keys(light).sort());
  });

  it('tokens.css starts with a comment pointing to tokens.ts as the source', () => {
    expect(css.startsWith('/*')).toBe(true);
    expect(css.slice(0, css.indexOf('*/'))).toContain('tokens.ts');
  });

  it("tokens.css mirrors tokens.ts in the light theme on :root and [data-theme='light']", () => {
    expect(block(":root,\n[data-theme='light']")).toEqual(expected(light));
  });

  it('tokens.css mirrors tokens.ts in the dark theme', () => {
    expect(block("[data-theme='dark']")).toEqual(expected(dark));
  });

  // breakpoints fica fora porque media query não lê variável CSS.
  it('tokens.css mirrors the shared scales of tokens.ts', () => {
    expect(block(':root')).toEqual(sharedScales());
  });

  it('motion durations never exceed 320 ms', () => {
    expect(Math.max(motion.fast, motion.base, motion.slow)).toBeLessThanOrEqual(320);
    const durations = Object.entries(block(':root')).filter(([k]) =>
      /^--motion-(fast|base|slow)$/.test(k),
    );
    expect(durations).toHaveLength(3);
    for (const [, value] of durations) {
      expect(value.endsWith('ms')).toBe(true);
      expect(parseFloat(value)).toBeLessThanOrEqual(320);
    }
  });

  it('prefers-reduced-motion zeroes every motion duration', () => {
    const media = css.indexOf('@media (prefers-reduced-motion: reduce)');
    expect(media).toBeGreaterThan(-1);
    expect(blockFrom(css, ':root', media)).toEqual({
      '--motion-fast': '0ms',
      '--motion-base': '0ms',
      '--motion-slow': '0ms',
    });
  });

  describe('brand layer', () => {
    const brandVars = {
      '--primary': '#010101',
      '--primary-hover': '#020202',
      '--primary-bright': '#030303',
      '--primary-soft': '#040404',
      '--primary-on': '#050505',
      '--brand-gradient': 'linear-gradient(135deg, #010101, #020202)',
    };
    let style: HTMLStyleElement | undefined;
    const created: HTMLElement[] = [];

    afterEach(() => {
      style?.remove();
      delete document.documentElement.dataset.theme;
      created.splice(0).forEach((el) => {
        el.remove();
      });
    });

    it.each(['light', 'dark'] as const)(
      'brand layer is overridable by CSS variables at runtime in %s',
      (theme) => {
        style = document.createElement('style');
        style.textContent = css;
        document.head.append(style);
        document.documentElement.dataset.theme = theme;

        const box = document.createElement('div');
        for (const [name, value] of Object.entries(brandVars)) box.style.setProperty(name, value);
        const child = document.createElement('span');
        box.append(child);
        const sibling = document.createElement('span');
        document.body.append(box, sibling);
        created.push(box, sibling);

        const read = (el: HTMLElement, name: string): string =>
          getComputedStyle(el).getPropertyValue(name).trim();
        const tokens = theme === 'light' ? light : dark;
        const themed: Record<string, string> = {
          '--primary': tokens.primary,
          '--primary-hover': tokens.primaryHover,
          '--primary-bright': tokens.primaryBright,
          '--primary-soft': tokens.primarySoft,
          '--primary-on': tokens.primaryOn,
          '--brand-gradient': 'linear-gradient(135deg, #7c3aed, #06b6d4)',
        };
        for (const [name, value] of Object.entries(brandVars)) {
          expect(read(child, name)).toBe(value);
          expect(compact(read(sibling, name))).toBe(compact(themed[name] ?? ''));
        }
      },
    );
  });
});
