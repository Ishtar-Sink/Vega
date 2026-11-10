import type { ComponentPropsWithRef } from 'react';
import styles from './progress-bar.module.css';

export interface ProgressBarProps extends ComponentPropsWithRef<'div'> {
  /** Nome acessível da barra (não é exibido). */
  label: string;
  /** Valor atual, limitado entre 0 e `max`. */
  value: number;
  /** Valor que representa 100%. */
  max?: number;
}

export function ProgressBar({
  label,
  value,
  max = 100,
  className,
  style,
  ...rest
}: ProgressBarProps) {
  const clamped = Math.min(Math.max(value, 0), max);
  const percent = max > 0 ? (clamped / max) * 100 : 0;
  return (
    <div
      {...rest}
      className={[styles.root, className].filter(Boolean).join(' ')}
      style={style}
      role="progressbar"
      aria-label={label}
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <span className={styles.fill} style={{ width: `${String(percent)}%` }} />
    </div>
  );
}
