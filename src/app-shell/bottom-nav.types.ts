import type { ComponentPropsWithRef } from 'react';
import type { NavItem, RenderNavLink } from './nav.types';

export interface BottomNavProps extends ComponentPropsWithRef<'nav'> {
  /** De 3 a 5 destinos; fora disso, um aviso no console em desenvolvimento. */
  items: readonly NavItem[];
  /** Desenha cada link com o roteador do produto; sem ele, um `<a href>` simples. */
  renderLink?: RenderNavLink;
  /** Textos visíveis e nomes acessíveis. Padrão: `{ navigation: 'Principal' }`. */
  labels?: Partial<{ navigation: string }>;
}
