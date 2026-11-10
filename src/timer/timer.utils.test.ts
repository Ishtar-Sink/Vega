import { DEFAULT_TIMER_LABELS } from './timer.constants';
import {
  describeDuration,
  evaluateLimits,
  formatDuration,
  msToNextSecond,
  normalizeWarnAt,
  startTimerState,
  stepTimerState,
  toDurationParts,
  withoutTimerProps,
} from './timer.utils';

const MIN = 60_000;

describe('formatDuration', () => {
  it('formats under one hour as mm:ss', () => {
    expect(formatDuration(0)).toBe('00:00');
    expect(formatDuration(65_000)).toBe('01:05');
    expect(formatDuration(3_599_000)).toBe('59:59');
  });

  it('formats from one hour as h:mm:ss', () => {
    expect(formatDuration(3_600_000)).toBe('1:00:00');
    expect(formatDuration(16_200_000)).toBe('4:30:00');
  });

  it('turns a negative value into 00:00', () => {
    expect(formatDuration(-1)).toBe('00:00');
    expect(formatDuration(-60_000)).toBe('00:00');
  });

  it('drops the milliseconds', () => {
    expect(formatDuration(65_999)).toBe('01:05');
  });
});

describe('timer utils', () => {
  it('splits a duration into parts', () => {
    expect(toDurationParts(3_723_000)).toEqual({ hours: 1, minutes: 2, seconds: 3 });
    expect(toDurationParts(-5)).toEqual({ hours: 0, minutes: 0, seconds: 0 });
  });

  it('describes a duration in words', () => {
    expect(describeDuration({ hours: 0, minutes: 12, seconds: 40 })).toBe(
      '12 minutos e 40 segundos',
    );
    expect(describeDuration({ hours: 1, minutes: 1, seconds: 1 })).toBe(
      '1 hora, 1 minuto e 1 segundo',
    );
    expect(describeDuration({ hours: 4, minutes: 30, seconds: 0 })).toBe('4 horas e 30 minutos');
    expect(describeDuration({ hours: 0, minutes: 0, seconds: 0 })).toBe('0 segundos');
  });

  it('sorts and dedupes warnAt', () => {
    expect(normalizeWarnAt([5, 30, 10, 30, 0, -1])).toEqual([30, 10, 5]);
    expect(normalizeWarnAt(undefined)).toEqual([]);
  });

  it('waits until the next turn of the second', () => {
    expect(msToNextSecond(10_000)).toBe(1000);
    expect(msToNextSecond(10_250)).toBe(750);
    expect(msToNextSecond(10_999)).toBe(1);
  });

  it('announces only the smallest new limit crossed', () => {
    expect(evaluateLimits([30, 10, 5], 4 * MIN, [])).toEqual({
      announced: [30, 10, 5],
      announce: 5,
    });
  });

  it('does not repeat a limit already announced', () => {
    expect(evaluateLimits([30, 10, 5], 9 * MIN, [30, 10])).toEqual({
      announced: [30, 10],
      announce: undefined,
    });
  });

  it('re-arms limits when the remaining time goes up', () => {
    expect(evaluateLimits([30, 10, 5], 20 * MIN, [30, 10])).toEqual({
      announced: [30],
      announce: undefined,
    });
  });

  it('starts silent with the limits already crossed', () => {
    const state = startTimerState(0, 8 * MIN, [30, 10, 5], DEFAULT_TIMER_LABELS);
    expect(state.announced).toEqual([30, 10]);
    expect(state.message).toBe('');
    expect(state.expired).toBe(false);
  });

  it('starts expired when endsAt already passed', () => {
    const state = startTimerState(1000, 0, [30, 10, 5], DEFAULT_TIMER_LABELS);
    expect(state.expired).toBe(true);
    expect(state.message).toBe('O tempo acabou.');
    expect(state.announced).toEqual([30, 10, 5]);
  });

  it('steps to the end only once', () => {
    const expired = startTimerState(1000, 0, [30, 10, 5], DEFAULT_TIMER_LABELS);
    const next = stepTimerState(expired, 5000, 0, [30, 10, 5], DEFAULT_TIMER_LABELS);
    expect(next.message).toBe(expired.message);
    expect(next.expired).toBe(true);
  });

  it('clears the message when a limit is re-armed', () => {
    const state = {
      at: 0,
      endsAt: 9 * MIN,
      announced: [30, 10],
      message: 'Faltam 10 minutos.',
      expired: false,
    };
    const next = stepTimerState(state, 0, 20 * MIN, [30, 10, 5], DEFAULT_TIMER_LABELS);
    expect(next.announced).toEqual([30]);
    expect(next.message).toBe('');
  });

  it('keeps only the native props', () => {
    expect(
      withoutTimerProps({
        endsAt: 1,
        warnAt: [5],
        onExpire: () => undefined,
        id: 'a',
        'data-x': 'b',
      }),
    ).toEqual({ id: 'a', 'data-x': 'b' });
  });
});
