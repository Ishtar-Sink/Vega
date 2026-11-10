import type { ComponentPropsWithRef, ReactNode } from 'react';

export interface TopbarProps extends ComponentPropsWithRef<'header'> {
  /** Slot do início da barra (ex.: o botão de menu ou o voltar). */
  start?: ReactNode;
  /** Slot do meio da barra (ex.: o título da tela). */
  center?: ReactNode;
  /** Slot do fim da barra (ex.: ações e busca). */
  end?: ReactNode;
}
