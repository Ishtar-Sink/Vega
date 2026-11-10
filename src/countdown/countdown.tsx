import { useEffect } from 'react';
import { DEFAULT_COUNTDOWN_LABELS, DEFAULT_COUNTDOWN_LOCALE } from './countdown.constants';
import styles from './countdown.module.css';
import type { CountdownLabels, CountdownProps } from './countdown.types';
import { daysBetween } from './countdown.utils';

export type { CountdownProps, CountdownLabels } from './countdown.types';
export { daysBetween } from './countdown.utils';

// O aviso fica para o bundler de quem usa: `import.meta.env.DEV` sumiria no build da biblioteca.
function isDevelopment(): boolean {
  return typeof process === 'undefined' || process.env.NODE_ENV !== 'production';
}

function describe(days: number, texts: CountdownLabels, locale: string): string {
  if (days < 0) return texts.past;
  if (days === 0) return texts.today;
  return texts.remaining(days, new Intl.NumberFormat(locale).format(days));
}

/** Dias de calendário até uma data, sem região viva: o valor é lido quando a tela é lida. */
export function Countdown({
  target,
  today,
  caption,
  size = 'display',
  locale = DEFAULT_COUNTDOWN_LOCALE,
  labels,
  className,
  ...rest
}: CountdownProps) {
  const days = daysBetween(today, target);
  const invalid = Number.isNaN(days);

  useEffect(() => {
    if (!invalid || !isDevelopment()) return;
    console.warn(
      `Countdown: target e today precisam ser datas AAAA-MM-DD válidas; recebeu target=${target} e today=${today}.`,
    );
  }, [invalid, target, today]);

  if (invalid) return null;

  const texts = { ...DEFAULT_COUNTDOWN_LABELS, ...labels };
  const classes = [styles.root, styles[size], className].filter(Boolean).join(' ');
  return (
    <p {...rest} data-size={size} className={classes}>
      <span className={styles.value}>{describe(days, texts, locale)}</span>
      {caption ? <span className={styles.caption}>{caption}</span> : null}
    </p>
  );
}
