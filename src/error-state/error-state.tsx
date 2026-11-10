import type { ComponentPropsWithRef } from 'react';
import { Button } from '../button/button';
import styles from './error-state.module.css';

export interface ErrorStateProps extends Omit<ComponentPropsWithRef<'div'>, 'title'> {
  /** Título do erro. */
  title?: string;
  /** Explicação opcional do que aconteceu. */
  description?: string;
  /** Texto do botão de nova tentativa. */
  retryLabel?: string;
  /** Ação de nova tentativa; o botão só aparece quando ela existe. */
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Não foi possível carregar.',
  description,
  retryLabel = 'Tentar de novo',
  onRetry,
  className,
  style,
  ...rest
}: ErrorStateProps) {
  return (
    <div
      {...rest}
      className={[styles.root, className].filter(Boolean).join(' ')}
      style={style}
      role="alert"
    >
      <p className={styles.title}>{title}</p>
      {description ? <p className={styles.description}>{description}</p> : null}
      {onRetry ? (
        <div className={styles.action}>
          <Button onClick={onRetry}>{retryLabel}</Button>
        </div>
      ) : null}
    </div>
  );
}
