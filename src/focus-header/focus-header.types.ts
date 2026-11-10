import type { ComponentPropsWithRef } from 'react';

export interface FocusHeaderLabels {
  /** Nome acessível do botão de sair. Padrão: `Sair`. */
  exit: string;
}

export interface FocusHeaderProps extends Omit<ComponentPropsWithRef<'header'>, 'title'> {
  /** Título do fluxo, exibido como `h1` em uma linha. */
  title: string;
  /** Chamado quando a pessoa aciona o botão de sair. */
  onExit: () => void;
  /** Posição no fluxo, em texto livre (ex.: `3/8`). */
  position?: string;
  /** Progresso do fluxo; sem ele a barra não aparece. */
  progress?: {
    /** Valor atual. */
    value: number;
    /** Valor que representa 100%. */
    max: number;
    /** Nome acessível da barra. */
    label: string;
  };
  /** Textos sobrescrevíveis, com padrão em pt-br. */
  labels?: Partial<FocusHeaderLabels>;
}
