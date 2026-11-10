import { dark, light } from './tokens';

/** Tokens de um tema: todas as chaves do tema claro do Ishtar Sink, com valor de cor ou sombra. */
export type ThemeTokens = { [K in keyof typeof light]: string };

/** Tema completo: os dois modos são obrigatórios e cada um tem todos os tokens. */
export interface Theme {
  light: ThemeTokens;
  dark: ThemeTokens;
}

export type ThemeName = keyof Theme;

/** Identidade em tempo de execução; o tipo recusa um tema incompleto na compilação ([project/theme-02]). */
export function defineTheme(theme: Theme): Theme {
  return theme;
}

/** Tema padrão do ecossistema; o claro é o padrão. */
export const ishtarSinkTheme: Theme = defineTheme({ light, dark });
