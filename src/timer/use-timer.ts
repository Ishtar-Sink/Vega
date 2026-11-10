import { useEffect, useRef, useState } from 'react';
import type { TimerLabels, TimerState } from './timer.types';
import { msToNextSecond, startTimerState, stepTimerState } from './timer.utils';

interface UseTimerOptions {
  now: () => number;
  /** Indefinido no progressivo. */
  endsAt: number | undefined;
  limits: readonly number[];
  labels: TimerLabels;
  onExpire?: () => void;
}

/** Relê o relógio a cada virada do segundo e calcula os avisos e o fim. */
export function useTimer({ now, endsAt, limits, labels, onExpire }: UseTimerOptions): TimerState {
  const [state, setState] = useState(() => startTimerState(now(), endsAt, limits, labels));
  const latest = useRef({ now, endsAt, limits, labels, onExpire });
  useEffect(() => {
    latest.current = { now, endsAt, limits, labels, onExpire };
  });

  // Um `endsAt` novo depois do fim volta a agendar.
  const running = endsAt === undefined || !state.expired || state.endsAt !== endsAt;

  // O `setTimeout` reagendado a cada virada alinha ao segundo do `now` sem acumular atraso,
  // e o objeto novo de estado a cada virada garante a próxima agenda mesmo quando o relógio não andou.
  useEffect(() => {
    if (!running) return;
    const id = setTimeout(() => {
      const l = latest.current;
      const at = l.now();
      setState((s) => stepTimerState(s, at, l.endsAt, l.limits, l.labels));
    }, msToNextSecond(now()));
    return () => {
      clearTimeout(id);
    };
  }, [state, running, now]);

  useEffect(() => {
    if (state.expired) latest.current.onExpire?.();
  }, [state.expired]);

  return state;
}
