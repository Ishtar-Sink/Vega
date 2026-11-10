import { breakpoints } from '../theme/tokens';

/** Textos padrão da `Sidebar` e da `BottomNav`. */
export const DEFAULT_NAV_LABELS = { navigation: 'Principal' } as const;

/** Textos padrão do `AppShell`. */
export const DEFAULT_APP_SHELL_LABELS = {
  skipToContent: 'Pular para o conteúdo',
  openMenu: 'Abrir menu',
} as const;

/** Abaixo de 720 px a navegação vira gaveta ou barra inferior, como o `@media` dos estilos. */
export const COMPACT_QUERY = `(max-width: ${String(breakpoints.md - 0.02)}px)`;

/** Elementos que recebem foco dentro da gaveta. */
export const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
