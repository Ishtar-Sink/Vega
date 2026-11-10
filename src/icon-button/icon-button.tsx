import type { ComponentPropsWithRef, ReactNode } from 'react';
import styles from './icon-button.module.css';

export interface IconButtonProps extends Omit<
  ComponentPropsWithRef<'button'>,
  'children' | 'aria-label'
> {
  /** Nome acessível: obrigatório, porque o botão não tem texto. */
  'aria-label': string;
  /** Ícone em SVG inline; fica dentro de um `<span aria-hidden="true">`. */
  icon: ReactNode;
  /** Padrão: `ghost`. */
  variant?: 'ghost' | 'secondary';
}

export function IconButton({
  icon,
  variant = 'ghost',
  type = 'button',
  className,
  ...rest
}: IconButtonProps) {
  const classes = [styles.root, styles[variant], className].filter(Boolean).join(' ');
  return (
    <button {...rest} type={type} className={classes}>
      <span className={styles.icon} aria-hidden="true">
        {icon}
      </span>
    </button>
  );
}
