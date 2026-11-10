import type { ComponentPropsWithRef, ReactNode } from 'react';

export type DisclosureTone = 'default' | 'accent' | 'warning' | 'info';

export interface DisclosureProps extends Omit<
  ComponentPropsWithRef<'details'>,
  'title' | 'open' | 'onToggle'
> {
  /** Título, exibido no resumo e lido como nome acessível. */
  title: ReactNode;
  /** Ícone decorativo antes do título. */
  icon?: ReactNode;
  /** Estado aberto. Quando definido, o componente é controlado. */
  open?: boolean;
  /** Estado inicial quando não controlado. Padrão: `false`. */
  defaultOpen?: boolean;
  /** Chamado com o novo estado; no modo controlado, o pai decide se muda `open`. */
  onOpenChange?: (open: boolean) => void;
  /** Tom do fundo, do título e do ícone. Padrão: `default`. */
  tone?: DisclosureTone;
}

export interface AccordionProps extends ComponentPropsWithRef<'div'> {
  /**
   * `single` mantém só um `Disclosure` aberto (use-os não controlados); `multiple` os deixa
   * independentes. Padrão: `multiple`.
   */
  type?: 'single' | 'multiple';
  children: ReactNode;
}
