import type { ComponentPropsWithRef, ReactNode } from 'react';
import { TextField } from '../text-field/text-field';
import styles from './toolbar.module.css';

export interface ToolbarProps extends ComponentPropsWithRef<'div'> {
  /** Rótulo visível da busca. Padrão: `Buscar`. */
  searchLabel?: string;
  /** Texto atual da busca (controlado). */
  searchValue: string;
  /** Chamado com o novo texto a cada alteração da busca. */
  onSearchChange: (value: string) => void;
  /** Texto de exemplo do campo de busca. */
  searchPlaceholder?: string;
  /** Campos de filtro da tela. */
  filters?: ReactNode;
  /** Normalmente o `ViewSwitcher`. */
  children?: ReactNode;
}

export function Toolbar({
  searchLabel = 'Buscar',
  searchValue,
  onSearchChange,
  searchPlaceholder,
  filters,
  children,
  className,
  ...rest
}: ToolbarProps) {
  return (
    <div {...rest} className={[styles.root, className].filter(Boolean).join(' ')}>
      <div role="search" className={styles.search}>
        <TextField
          type="search"
          label={searchLabel}
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(event) => {
            onSearchChange(event.target.value);
          }}
        />
      </div>
      {filters ? <div className={styles.filters}>{filters}</div> : null}
      {children ? <div className={styles.trailing}>{children}</div> : null}
    </div>
  );
}
