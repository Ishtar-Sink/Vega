import { describe, expect, it } from 'vitest';
import { defineTheme, ishtarSinkTheme, type ThemeTokens } from './theme';
import { dark, light } from './tokens';

describe('theme', () => {
  it('defineTheme returns the theme it receives', () => {
    const theme = { light: { ...light, primary: '#0F766E' }, dark };
    expect(defineTheme(theme)).toBe(theme);
  });

  it('ishtarSinkTheme uses the Ishtar Sink tokens, with light as the default', () => {
    expect(ishtarSinkTheme.light).toBe(light);
    expect(ishtarSinkTheme.dark).toBe(dark);
  });

  it('rejects, at type level, a light theme missing a token', () => {
    const incomplete: Omit<ThemeTokens, 'textFaint'> = light;
    // @ts-expect-error o tema claro não tem textFaint
    defineTheme({ light: incomplete, dark });
  });

  it('rejects, at type level, a dark theme missing a token', () => {
    const incomplete: Omit<ThemeTokens, 'primarySoft'> = dark;
    // @ts-expect-error o tema escuro não tem primarySoft
    defineTheme({ light, dark: incomplete });
  });

  it('rejects, at type level, a theme without the dark theme', () => {
    // @ts-expect-error falta o tema escuro
    defineTheme({ light });
  });
});
