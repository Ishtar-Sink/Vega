import type { ComponentPropsWithRef } from 'react';
import type { DurationParts, TimerLabels, TimerState } from './timer.types';

const SECOND_MS = 1000;
const MINUTE_MS = 60_000;
const TIMER_ONLY_KEYS: readonly string[] = [
  'direction',
  'endsAt',
  'startedAt',
  'warnAt',
  'onExpire',
];

/** Separa uma duração em ms em horas, minutos e segundos; negativo vira zero. */
export function toDurationParts(ms: number): DurationParts {
  const total = Math.max(0, Math.floor(ms / SECOND_MS));
  return {
    hours: Math.floor(total / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

/**
 * Formata uma duração em ms como `mm:ss` abaixo de uma hora e `h:mm:ss` a partir dela.
 * Valores negativos viram `00:00` e os milissegundos são descartados.
 */
export function formatDuration(ms: number): string {
  const { hours, minutes, seconds } = toDurationParts(ms);
  const pad = (n: number) => String(n).padStart(2, '0');
  if (hours > 0) return `${String(hours)}:${pad(minutes)}:${pad(seconds)}`;
  return `${pad(minutes)}:${pad(seconds)}`;
}

function unit(value: number, singular: string, plural: string): string {
  return `${String(value)} ${value === 1 ? singular : plural}`;
}

/** Descreve uma duração por extenso em pt-br, como "1 hora, 2 minutos e 3 segundos". */
export function describeDuration(parts: DurationParts): string {
  const items = [
    parts.hours ? unit(parts.hours, 'hora', 'horas') : '',
    parts.minutes ? unit(parts.minutes, 'minuto', 'minutos') : '',
    parts.seconds ? unit(parts.seconds, 'segundo', 'segundos') : '',
  ].filter(Boolean);
  const last = items.pop();
  if (last === undefined) return '0 segundos';
  if (items.length === 0) return last;
  return `${items.join(', ')} e ${last}`;
}

/** Mantém os limites positivos, sem repetidos, do maior para o menor. */
export function normalizeWarnAt(warnAt: readonly number[] | undefined): number[] {
  const valid = (warnAt ?? []).filter((value) => Number.isFinite(value) && value > 0);
  return [...new Set(valid)].sort((a, b) => b - a);
}

/** Atraso até a próxima virada do segundo do relógio. */
export function msToNextSecond(nowMs: number): number {
  return SECOND_MS - (nowMs % SECOND_MS);
}

/** Recalcula os limites anunciados e devolve o menor limite novo a anunciar. */
export function evaluateLimits(
  limits: readonly number[],
  remainingMs: number,
  announced: readonly number[],
): { announced: number[]; announce: number | undefined } {
  const crossed = limits.filter((limit) => remainingMs <= limit * MINUTE_MS);
  // Os limites que voltaram a ficar acima do restante saem da lista e podem ser anunciados de novo.
  const kept = announced.filter((limit) => crossed.includes(limit));
  const fresh = crossed.filter((limit) => !kept.includes(limit));
  return {
    announced: [...kept, ...fresh].sort((a, b) => b - a),
    // Vários limites cruzados de uma vez (aba em segundo plano) anunciam só o menor.
    announce: fresh.length > 0 ? Math.min(...fresh) : undefined,
  };
}

function expiredState(at: number, endsAt: number, limits: readonly number[], labels: TimerLabels) {
  return { at, endsAt, announced: [...limits], message: labels.expired, expired: true };
}

/** Estado inicial: os limites já cruzados na montagem entram sem anúncio. */
export function startTimerState(
  at: number,
  endsAt: number | undefined,
  limits: readonly number[],
  labels: TimerLabels,
): TimerState {
  if (endsAt === undefined) return { at, endsAt, announced: [], message: '', expired: false };
  if (endsAt - at <= 0) return expiredState(at, endsAt, limits, labels);
  const { announced } = evaluateLimits(limits, endsAt - at, []);
  return { at, endsAt, announced, message: '', expired: false };
}

/** Próximo estado a cada virada do segundo. */
export function stepTimerState(
  state: TimerState,
  at: number,
  endsAt: number | undefined,
  limits: readonly number[],
  labels: TimerLabels,
): TimerState {
  if (endsAt === undefined) return { ...state, at, endsAt };
  // O fim vence os limites cruzados no mesmo tique.
  if (endsAt - at <= 0) {
    return state.expired ? { ...state, at, endsAt } : expiredState(at, endsAt, limits, labels);
  }
  const result = evaluateLimits(limits, endsAt - at, state.announced);
  return {
    at,
    endsAt,
    announced: result.announced,
    message: nextMessage(state, result, labels),
    expired: false,
  };
}

// Esvaziar ao re-armar faz o mesmo aviso mudar o DOM e ser anunciado de novo.
function nextMessage(
  state: TimerState,
  result: { announced: number[]; announce: number | undefined },
  labels: TimerLabels,
): string {
  if (result.announce !== undefined) return labels.warning(result.announce);
  if (result.announced.length < state.announced.length) return '';
  return state.message;
}

/** Remove as props só do `Timer` antes do spread na raiz. */
export function withoutTimerProps(
  props: object,
): Omit<ComponentPropsWithRef<'div'>, 'children' | 'hidden'> {
  return Object.fromEntries(
    Object.entries(props).filter(([key]) => !TIMER_ONLY_KEYS.includes(key)),
  );
}
