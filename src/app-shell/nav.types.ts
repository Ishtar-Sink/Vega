import type { ReactNode } from 'react';

/** Destino da navegação, usado pela `Sidebar`, pela `BottomNav` e pelo `AppShell`. */
export interface NavItem {
  /** Identificador estável do destino, usado como chave. */
  id: string;
  /** Rótulo visível do destino. */
  label: string;
  /** Ícone em SVG inline; fica dentro de um `<span aria-hidden="true">`. */
  icon: ReactNode;
  /** Endereço do destino, usado pelo `<a>` simples ou pelo `renderLink`. */
  href: string;
  /** Marca o destino atual com `aria-current="page"`. */
  current?: boolean;
  /** Selo opcional ao lado do rótulo (ex.: a contagem de pendências). */
  badge?: ReactNode;
}

/** Desenha o link com o componente do roteador do produto, repassando as props recebidas. */
export type RenderNavLink = (
  item: NavItem,
  props: { className: string; 'aria-current'?: 'page'; children: ReactNode },
) => ReactNode;
