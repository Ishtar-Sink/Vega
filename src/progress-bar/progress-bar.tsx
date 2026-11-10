import type { ComponentPropsWithRef } from 'react';
import styles from './progress-bar.module.css';

export interface ProgressBarProps extends ComponentPropsWithRef<'div'> {
  /** Nome acessível da barra (não é exibido). */
  label: string;
  /** Valor atual, limitado entre 0 e `max`. */
  value: number;
  /** Valor que representa 100%. */
  max?: number;
  /** Texto visível do valor (ex.: "4 de 9"), também usado em `aria-valuetext`. */
  valueText?: string;
  /** Progresso sem valor conhecido: não anuncia valor e anima a barra. */
  indeterminate?: boolean;
}

export function ProgressBar({
  label,
  value,
  max = 100,
  valueText,
  indeterminate = false,
  className,
  style,
  ...rest
}: ProgressBarProps) {
  const clamped = Math.min(Math.max(value, 0), max);
  const percent = max > 0 ? (clamped / max) * 100 : 0;
  const classes = [styles.root, indeterminate && styles.indeterminate, className]
    .filter(Boolean)
    .join(' ');
  const bar = (
    <div
      {...rest}
      className={classes}
      style={style}
      role="progressbar"
      aria-label={label}
      aria-valuenow={indeterminate ? undefined : clamped}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuetext={valueText}
      aria-busy={indeterminate ? true : undefined}
    >
      <span
        className={styles.fill}
        style={indeterminate ? undefined : { width: `${String(percent)}%` }}
      />
    </div>
  );
  if (valueText === undefined) return bar;
  return (
    <div className={styles.labeled}>
      {bar}
      <span className={styles.valueText} aria-hidden="true">
        {valueText}
      </span>
    </div>
  );
}
