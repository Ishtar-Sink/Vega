import type { ComponentPropsWithRef, CSSProperties } from 'react';
import styles from './button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'muted' | 'success';

export interface ButtonProps extends ComponentPropsWithRef<'button'> {
  /** Variação visual. Padrão: `secondary`. */
  variant?: ButtonVariant;
  /** Mostra o indicador, anuncia `aria-busy` e bloqueia o clique. */
  loading?: boolean;
  /** Cor CSS usada pela variação `muted` (ex.: a cor de uma categoria). */
  tint?: string;
  /** `lg`: altura mínima de 48 px. Padrão: `md`. */
  size?: 'md' | 'lg';
  /** Ocupa a largura toda do contêiner. */
  block?: boolean;
}

export function Button({
  variant = 'secondary',
  loading = false,
  tint,
  size = 'md',
  block = false,
  type = 'button',
  disabled,
  className,
  style,
  children,
  ...rest
}: ButtonProps) {
  const unavailable = disabled === true || loading;
  const tinted = variant === 'muted' && tint !== undefined;
  const classes = [
    styles.root,
    styles[variant],
    tinted ? styles.tinted : '',
    size === 'lg' ? styles.lg : '',
    block ? styles.block : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <button
      {...rest}
      type={type}
      className={classes}
      style={tinted ? ({ ...style, '--button-tint': tint } as CSSProperties) : style}
      disabled={unavailable}
      aria-disabled={unavailable || undefined}
      aria-busy={loading || undefined}
    >
      {loading ? (
        <span className={styles.spinner} aria-hidden="true" data-button-spinner="" />
      ) : null}
      {children}
    </button>
  );
}
