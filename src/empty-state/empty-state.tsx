import type { ComponentPropsWithRef, ReactNode } from 'react';
import styles from './empty-state.module.css';

export interface EmptyStateProps extends Omit<ComponentPropsWithRef<'div'>, 'title'> {
  /** Título do estado vazio. */
  title: string;
  /** Explicação do que fazer ou do porquê de estar vazio. */
  description: string;
  /** Ação principal, como um botão ou link para criar o primeiro item. */
  action?: ReactNode;
}

export function EmptyState({
  title,
  description,
  action,
  className,
  style,
  ...rest
}: EmptyStateProps) {
  return (
    <div {...rest} className={[styles.root, className].filter(Boolean).join(' ')} style={style}>
      <p className={styles.title}>{title}</p>
      <p className={styles.description}>{description}</p>
      {action ? <div className={styles.action}>{action}</div> : null}
    </div>
  );
}
