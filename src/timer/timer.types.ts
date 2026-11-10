import type { ComponentPropsWithRef } from 'react';

/** Textos do `Timer`; todos sobrescrevíveis, com padrão em pt-br. */
export interface TimerLabels {
  /** Nome do botão com o tempo visível. Padrão: "Esconder o tempo". */
  hide: string;
  /** Nome do botão com o tempo oculto. Padrão: "Mostrar o tempo". */
  show: string;
  /** Texto no lugar do tempo oculto. Padrão: "tempo". */
  hidden: string;
  /** Nome acessível no regressivo. Padrão: "Tempo restante: {duração por extenso}". */
  remaining: (parts: DurationParts) => string;
  /** Nome acessível no progressivo. Padrão: "Tempo decorrido: {duração por extenso}". */
  elapsed: (parts: DurationParts) => string;
  /** Aviso de limite. Padrão: "Faltam {minutes} minutos." */
  warning: (minutes: number) => string;
  /** Aviso do fim. Padrão: "O tempo acabou." */
  expired: string;
}

/** Duração separada em horas, minutos e segundos inteiros. */
export interface DurationParts {
  hours: number;
  minutes: number;
  seconds: number;
}

// O `hidden` nativo do HTML conflitaria com o controle de ocultar o tempo.
interface TimerBaseProps extends Omit<ComponentPropsWithRef<'div'>, 'children' | 'hidden'> {
  /** Relógio injetável, em ms desde a época. Padrão: `Date.now`. */
  now?: () => number;
  /** Tempo oculto, no modo controlado. Sem ele, o `Timer` guarda o estado. */
  hidden?: boolean;
  /** Chamado com o novo valor ao usar o botão de ocultar. */
  onHiddenChange?: (hidden: boolean) => void;
  /** Mostra o botão de ocultar. Padrão: `true`. */
  hideable?: boolean;
  /** Idioma dos `labels`, aplicado como `lang` da raiz. */
  locale?: string;
  /** Textos sobrescritos; os demais usam o padrão em pt-br. */
  labels?: Partial<TimerLabels>;
}

/** `Timer` regressivo: mostra `endsAt - now()`. */
export interface TimerCountdownProps extends TimerBaseProps {
  /** Padrão: `down`. */
  direction?: 'down';
  /** Fim, em ms desde a época (UTC). */
  endsAt: number;
  /** Minutos restantes que geram aviso. Padrão: nenhum, com o tom de aviso a 5 min. */
  warnAt?: number[];
  /** Chamado uma vez ao chegar a zero. */
  onExpire?: () => void;
}

/** `Timer` progressivo: mostra `now() - startedAt`, sem avisos nem fim. */
export interface TimerElapsedProps extends TimerBaseProps {
  direction: 'up';
  /** Início, em ms desde a época (UTC). */
  startedAt: number;
}

export type TimerProps = TimerCountdownProps | TimerElapsedProps;

/** Estado interno do relógio e dos avisos. */
export interface TimerState {
  at: number;
  endsAt: number | undefined;
  announced: number[];
  message: string;
  expired: boolean;
}
