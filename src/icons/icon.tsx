import type { LucideIcon } from 'lucide-react';
import type { IconProps } from './icon.types';

/**
 * Embrulha um ícone do `lucide-react` com os padrões da Vega: traço `currentColor`
 * de espessura 2 e tamanho 20.
 */
export function createIcon(Lucide: LucideIcon, displayName: string) {
  /**
   * Ícone decorativo: `aria-hidden` e `focusable` vêm depois do `...rest` para não
   * serem sobrescritos, e o nome acessível fica no botão que o contém.
   */
  function Icon({ size = 20, ...rest }: IconProps) {
    return (
      <Lucide
        size={size}
        strokeWidth={2}
        color="currentColor"
        {...rest}
        aria-hidden="true"
        focusable="false"
      />
    );
  }
  Icon.displayName = displayName;
  return Icon;
}
