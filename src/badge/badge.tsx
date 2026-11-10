import type { ComponentPropsWithRef } from 'react';
import styles from './badge.module.css';

export type BadgeTone =
  'neutral' | 'primary' | 'accent' | 'success' | 'warning' | 'danger' | 'info';

export interface BadgeProps extends ComponentPropsWithRef<'span'> {
  /** Tom do selo; o fundo é sempre o *Soft do tom e o texto diz o estado, sem depender só da cor. Padrão: primary. */
  tone?: BadgeTone;
}

/** Selo curto de estado ou categoria. */
export function Badge({ tone = 'primary', className, ...rest }: BadgeProps) {
  const classes = [styles.root, styles[tone], className].filter(Boolean).join(' ');
  return <span {...rest} className={classes} />;
}
