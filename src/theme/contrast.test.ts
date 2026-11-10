import { describe, expect, it } from 'vitest';
import { CONTRAST_REQUIREMENTS, checkThemeContrast, contrastRatio } from './contrast';
import { defineTheme, ishtarSinkTheme } from './theme';
import { dark, light } from './tokens';

const themes = { light, dark } as const;

describe('contrastRatio', () => {
  it('contrastRatio returns 21 for black on white and 1 for equal colors', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 5);
    expect(contrastRatio('#7c3aed', '#7c3aed')).toBeCloseTo(1, 5);
  });

  it('contrastRatio accepts #RGB and ignores case', () => {
    expect(contrastRatio('#FFF', '#000')).toBe(contrastRatio('#ffffff', '#000000'));
  });

  it('contrastRatio throws on a value that is not a hex color', () => {
    expect(() => contrastRatio('rgb(0, 0, 0)', '#fff')).toThrow(TypeError);
  });
});

describe('contrast requirements', () => {
  it('requires 4.5:1 for text and 3:1 only for textFaint', () => {
    for (const item of CONTRAST_REQUIREMENTS) {
      expect(item.minimum).toBe(item.foreground === 'textFaint' ? 3 : 4.5);
    }
    const faint = CONTRAST_REQUIREMENTS.filter((item) => item.foreground === 'textFaint');
    expect(faint.map((item) => item.background).sort()).toEqual(['bg', 'surface']);
  });

  const cases = (['light', 'dark'] as const).flatMap((theme) =>
    CONTRAST_REQUIREMENTS.map((r) => [theme, r.foreground, r.background, r.minimum] as const),
  );

  it.each(cases)('%s: %s on %s >= %d', (theme, foreground, background, minimum) => {
    const tokens = themes[theme];
    expect(contrastRatio(tokens[foreground], tokens[background])).toBeGreaterThanOrEqual(minimum);
  });

  it('the Ishtar Sink theme has no contrast violation', () => {
    expect(checkThemeContrast(ishtarSinkTheme)).toEqual([]);
  });

  it('textFaint stays below 4.5:1 in the default theme, so it is decorative only', () => {
    for (const tokens of [light, dark]) {
      expect(contrastRatio(tokens.textFaint, tokens.bg)).toBeLessThan(4.5);
      expect(contrastRatio(tokens.textFaint, tokens.surface)).toBeLessThan(4.5);
    }
  });

  it('points the violation of a low-contrast brand in a custom theme', () => {
    const violations = checkThemeContrast(
      defineTheme({ light: { ...light, primary: '#A855F7' }, dark }),
    );
    expect(violations).toContainEqual(
      expect.objectContaining({
        theme: 'light',
        foreground: 'primary',
        background: 'bg',
        minimum: 4.5,
      }),
    );
    const found = violations.find(
      (v) => v.theme === 'light' && v.foreground === 'primary' && v.background === 'bg',
    );
    expect(found?.ratio).toBeLessThan(4.5);
  });

  it('points the violation in the dark theme too', () => {
    const violations = checkThemeContrast(
      defineTheme({ light, dark: { ...dark, textFaint: '#2F2250' } }),
    );
    expect(violations).toContainEqual(
      expect.objectContaining({
        theme: 'dark',
        foreground: 'textFaint',
        background: 'bg',
        minimum: 3,
      }),
    );
  });
});
