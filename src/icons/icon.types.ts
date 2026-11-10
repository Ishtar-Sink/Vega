import type { ComponentPropsWithRef } from 'react';

export interface IconProps extends Omit<ComponentPropsWithRef<'svg'>, 'children'> {
  /** Lado em px. Padrão: 20. */
  size?: 16 | 20 | 24;
}
