import type { ComponentPropsWithRef, ReactNode } from 'react';

/** Posição da folha: `auto` fica embaixo abaixo de 720 px e na lateral a partir daí. */
export type BottomSheetPlacement = 'auto' | 'bottom' | 'side';

/** Textos visíveis do `BottomSheet`. */
export interface BottomSheetLabels {
  /** Nome acessível do botão de fechar. Padrão: `Fechar`. */
  close: string;
}

export interface BottomSheetProps extends Omit<ComponentPropsWithRef<'dialog'>, 'title' | 'open'> {
  /** Abre a folha como modal (`showModal()`); ao ficar `false`, fecha e devolve o foco. */
  open: boolean;
  /** Chamado no Esc, no clique no fundo e no botão de fechar. */
  onClose: () => void;
  /** Título, lido como nome acessível. */
  title: ReactNode;
  /** Descrição curta, ligada ao diálogo por `aria-describedby`. */
  description?: ReactNode;
  /** Rodapé fixo, fora da rolagem do conteúdo. */
  footer?: ReactNode;
  /** Posição da folha. Padrão: `auto`. */
  placement?: BottomSheetPlacement;
  /** Sobrescreve os textos padrão. */
  labels?: Partial<BottomSheetLabels>;
  /** Conteúdo rolável. */
  children: ReactNode;
}
