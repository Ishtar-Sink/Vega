import type { ComponentPropsWithRef, ReactNode } from 'react';
import type { SidebarProps } from './sidebar.types';
import type { TopbarProps } from './topbar.types';

export interface AppShellProps extends ComponentPropsWithRef<'div'> {
  /** Props da `Sidebar`; a gaveta é controlada pelo próprio `AppShell`. */
  sidebar: Omit<SidebarProps, 'drawer' | 'open' | 'onClose'>;
  /** Props da `Topbar`; sem ela, a barra só aparece no modo gaveta, com o botão de menu. */
  topbar?: TopbarProps;
  /** Navegação abaixo de 720 px: gaveta com botão de menu ou barra inferior. Padrão: `drawer`. */
  mobileNav?: 'drawer' | 'bottom';
  /** Esconde toda a navegação (barra lateral, gaveta, barra inferior e link de pular). */
  hideNavigation?: boolean;
  /** Conteúdo da página, dentro do `<main>`. */
  children: ReactNode;
  /** Textos visíveis e nomes acessíveis. Padrão: `Pular para o conteúdo` e `Abrir menu`. */
  labels?: Partial<{ skipToContent: string; openMenu: string }>;
}
