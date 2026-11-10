import type { ComponentPropsWithRef } from 'react';
import styles from './loading-state.module.css';

export interface SkeletonProps extends ComponentPropsWithRef<'div'> {
  /** Quantidade de linhas do esqueleto. */
  rows?: number;
}

export function Skeleton({ rows = 3, className, style, ...rest }: SkeletonProps) {
  return (
    <div
      {...rest}
      className={[styles.skeleton, className].filter(Boolean).join(' ')}
      style={style}
      aria-hidden="true"
    >
      {Array.from({ length: rows }, (_, index) => (
        <i key={index} className={styles.row} />
      ))}
    </div>
  );
}

export interface LoadingStateProps extends ComponentPropsWithRef<'div'> {
  /** Texto lido por leitores de tela enquanto carrega. */
  label?: string;
  /** Quantidade de linhas do esqueleto. */
  rows?: number;
}

export function LoadingState({
  label = 'Carregando',
  rows,
  className,
  style,
  ...rest
}: LoadingStateProps) {
  return (
    <div
      {...rest}
      className={[styles.root, className].filter(Boolean).join(' ')}
      style={style}
      role="status"
      aria-busy="true"
    >
      <span className={styles.visuallyHidden}>{label}</span>
      <Skeleton rows={rows} />
    </div>
  );
}
