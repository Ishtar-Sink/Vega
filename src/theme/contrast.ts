import type { Theme, ThemeName, ThemeTokens } from './theme';

const HEX_COLOR = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

export interface ContrastRequirement {
  foreground: keyof ThemeTokens;
  background: keyof ThemeTokens;
  minimum: number;
}

export interface ContrastViolation extends ContrastRequirement {
  theme: ThemeName;
  ratio: number;
}

function channel(value: number): number {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function toFullHex(value: string): string {
  if (!HEX_COLOR.test(value)) {
    throw new TypeError(`Cor fora do formato #RGB ou #RRGGBB: ${value}`);
  }
  const digits = value.slice(1);
  if (digits.length === 6) return digits;
  return digits.replace(/./g, (d) => d + d);
}

function relativeLuminance(hex: string): number {
  const n = parseInt(toFullHex(hex), 16);
  const r = channel((n >> 16) & 255);
  const g = channel((n >> 8) & 255);
  const b = channel(n & 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Razão de contraste do WCAG 2, de 1 a 21, para cores `#RGB` ou `#RRGGBB`. */
export function contrastRatio(foreground: string, background: string): number {
  const a = relativeLuminance(foreground);
  const b = relativeLuminance(background);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

const TEXT_MINIMUM = 4.5;
const FAINT_MINIMUM = 3;

function req(
  foreground: keyof ThemeTokens,
  background: keyof ThemeTokens,
  minimum = TEXT_MINIMUM,
): ContrastRequirement {
  return { foreground, background, minimum };
}

/** Pares de token que precisam de contraste: 4,5:1 para texto e 3:1 só para `textFaint`. */
export const CONTRAST_REQUIREMENTS: readonly ContrastRequirement[] = [
  req('text', 'bg'),
  req('text', 'surface'),
  req('text', 'surfaceMuted'),
  req('textMuted', 'bg'),
  req('textMuted', 'surface'),
  req('textMuted', 'surfaceMuted'),
  req('primary', 'bg'),
  req('primary', 'surface'),
  req('primary', 'primarySoft'),
  req('primaryOn', 'primary'),
  req('primaryOn', 'primaryHover'),
  req('accent', 'bg'),
  req('accent', 'surface'),
  req('accent', 'accentSoft'),
  req('success', 'successSoft'),
  req('warning', 'warningSoft'),
  req('danger', 'dangerSoft'),
  req('info', 'infoSoft'),
  req('textFaint', 'bg', FAINT_MINIMUM),
  req('textFaint', 'surface', FAINT_MINIMUM),
];

/** Aplica CONTRAST_REQUIREMENTS aos dois modos de um tema e devolve cada par abaixo do mínimo. */
export function checkThemeContrast(theme: Theme): ContrastViolation[] {
  const violations: ContrastViolation[] = [];
  for (const name of ['light', 'dark'] as const) {
    const tokens = theme[name];
    for (const { foreground, background, minimum } of CONTRAST_REQUIREMENTS) {
      const ratio = contrastRatio(tokens[foreground], tokens[background]);
      if (ratio < minimum) violations.push({ theme: name, foreground, background, minimum, ratio });
    }
  }
  return violations;
}
