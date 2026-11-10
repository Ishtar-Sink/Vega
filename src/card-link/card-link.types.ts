import type { ComponentPropsWithRef } from 'react';
import type { CardTone } from '../card/card';

export interface CardLinkProps extends ComponentPropsWithRef<'a'> {
  /** Tom do fundo e da borda, o mesmo do `Card`. Padrão: `default`. */
  tone?: CardTone;
}

export interface CardButtonProps extends ComponentPropsWithRef<'button'> {
  /** Tom do fundo e da borda, o mesmo do `Card`. Padrão: `default`. */
  tone?: CardTone;
}
