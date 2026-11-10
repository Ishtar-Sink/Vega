import type { ComponentPropsWithRef, ReactNode } from 'react';

export type CalloutTone = 'neutral' | 'accent' | 'info' | 'success' | 'warning' | 'danger';

export interface CalloutProps extends Omit<ComponentPropsWithRef<'aside'>, 'title'> {
  /** Tom do aviso, que define o fundo, a cor e o ícone. Padrão: `neutral`. */
  tone?: CalloutTone;
  /** Título do aviso; também dá o nome acessível ao `<aside>`. */
  title?: ReactNode;
  /** Ícone no lugar do padrão do tom; `false` remove o ícone. */
  icon?: ReactNode | false;
  /** Ação no fim do aviso, como um botão ou um link. */
  action?: ReactNode;
  /** `polite` anuncia o aviso como região viva (`role="status"`). Padrão: `off`. */
  live?: 'off' | 'polite';
}
