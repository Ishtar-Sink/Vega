import type { ComponentPropsWithRef, ReactNode } from 'react';
import type { NavItem, RenderNavLink } from './nav.types';

export interface SidebarProps extends ComponentPropsWithRef<'aside'> {
  /** Marca do produto, no topo da barra. */
  brand: ReactNode;
  /** Destinos da navegação principal. */
  items: readonly NavItem[];
  /** Desenha cada link com o roteador do produto; sem ele, um `<a href>` simples. */
  renderLink?: RenderNavLink;
  /** Conteúdo do rodapé (ex.: conta, tema, ajustes). */
  footer?: ReactNode;
  /** Modo gaveta: barra fixa sobre o conteúdo, com foco preso enquanto aberta. Padrão: `false`. */
  drawer?: boolean;
  /** Gaveta aberta; fechada, ela fica `inert`. Só vale com `drawer`. */
  open?: boolean;
  /** Chamado no Escape e ao escolher um link com a gaveta aberta. */
  onClose?: () => void;
  /** Textos visíveis e nomes acessíveis. Padrão: `{ navigation: 'Principal' }`. */
  labels?: Partial<{ navigation: string }>;
}
