import type { ComponentPropsWithRef, ReactNode } from 'react';

/** Textos do `Countdown`, todos sobrescrevíveis. */
export interface CountdownLabels {
  /** Padrão: "Faltam {days} dias" / "Falta 1 dia", com o número já formatado. */
  remaining: (days: number, formatted: string) => string;
  /** Padrão: "É hoje". */
  today: string;
  /** Padrão: "Já passou". */
  past: string;
}

export interface CountdownProps extends Omit<ComponentPropsWithRef<'p'>, 'children'> {
  /** Data-alvo, `AAAA-MM-DD`. */
  target: string;
  /** Hoje, `AAAA-MM-DD`, no fuso do usuário (o componente não lê o relógio). */
  today: string;
  /** Texto de apoio abaixo (ou ao lado, no `inline`) dos dias. */
  caption?: ReactNode;
  /** Padrão: `display`. */
  size?: 'display' | 'inline';
  /** Locale do número. Padrão: `pt-BR`. */
  locale?: string;
  /** Textos sobrescritos; o que faltar usa o padrão em pt-br. */
  labels?: Partial<CountdownLabels>;
}
