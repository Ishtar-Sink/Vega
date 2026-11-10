import type { ComponentPropsWithRef } from 'react';

export interface SwitchProps extends Omit<
  ComponentPropsWithRef<'button'>,
  'onChange' | 'children'
> {
  /** Rótulo visível ao lado do switch; também é o nome acessível. */
  label: string;
  /** Texto de ajuda abaixo do rótulo, ligado ao switch por `aria-describedby`. */
  help?: string;
  /** Estado atual: `true` para ligado. */
  checked: boolean;
  /** Chamado com o novo estado quando o usuário alterna o switch. */
  onCheckedChange: (checked: boolean) => void;
}
