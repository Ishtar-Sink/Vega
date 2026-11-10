import { useMemo, useState } from 'react';
import { IconButton } from '../icon-button/icon-button';
import { ClockIcon, EyeIcon } from '../icons/interface-icons';
import { DEFAULT_TIMER_LABELS, DEFAULT_WARNING_MINUTES } from './timer.constants';
import type { TimerProps } from './timer.types';
import { formatDuration, normalizeWarnAt, toDurationParts, withoutTimerProps } from './timer.utils';
import { useTimer } from './use-timer';
import styles from './timer.module.css';

export type {
  TimerProps,
  TimerCountdownProps,
  TimerElapsedProps,
  TimerLabels,
  DurationParts,
} from './timer.types';
export { formatDuration } from './timer.utils';

/**
 * Cronômetro regressivo (`endsAt`) ou progressivo (`direction="up"`), com o tempo no nome
 * acessível e os avisos numa região viva própria.
 */
export function Timer(props: TimerProps) {
  const isUp = props.direction === 'up';
  const {
    now = Date.now,
    hidden,
    onHiddenChange,
    hideable = true,
    locale,
    labels,
    className,
    ...base
  } = props;
  const endsAt = isUp ? undefined : props.endsAt;
  const startedAt = isUp ? props.startedAt : 0;
  const texts = useMemo(() => ({ ...DEFAULT_TIMER_LABELS, ...labels }), [labels]);
  // Chave por valor: um array literal novo a cada render não muda os limites.
  const warnKey = (isUp ? [] : (props.warnAt ?? [])).join(',');
  const limits = useMemo(
    () => normalizeWarnAt(warnKey ? warnKey.split(',').map(Number) : []),
    [warnKey],
  );
  const state = useTimer({
    now,
    endsAt,
    limits,
    labels: texts,
    onExpire: isUp ? undefined : props.onExpire,
  });

  // No regressivo arredonda para cima, para o `00:00` só aparecer no fim.
  const ms =
    endsAt === undefined ? state.at - startedAt : Math.ceil((endsAt - state.at) / 1000) * 1000;
  const parts = toDurationParts(ms);
  const name = isUp ? texts.elapsed(parts) : texts.remaining(parts);
  const warning = !isUp && ms <= (limits.at(-1) ?? DEFAULT_WARNING_MINUTES) * 60_000;

  const [hiddenState, setHiddenState] = useState(false);
  const isHidden = hidden ?? hiddenState;
  const toggle = () => {
    const next = !isHidden;
    if (hidden === undefined) setHiddenState(next);
    onHiddenChange?.(next);
  };

  return (
    <div
      {...withoutTimerProps(base)}
      role="timer"
      aria-label={name}
      lang={locale}
      className={[styles.root, className].filter(Boolean).join(' ')}
    >
      <span className={styles.pill} data-tone={warning ? 'warning' : 'normal'}>
        {warning ? <ClockIcon size={16} /> : null}
        <span className={styles.time}>{isHidden ? texts.hidden : formatDuration(ms)}</span>
      </span>
      {hideable ? (
        <IconButton
          className={styles.toggle}
          aria-label={isHidden ? texts.show : texts.hide}
          icon={<EyeIcon />}
          onClick={toggle}
        />
      ) : null}
      <span className={styles.srOnly} aria-live="polite">
        {state.message}
      </span>
    </div>
  );
}
