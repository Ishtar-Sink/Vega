import type { ComponentPropsWithRef } from 'react';
import styles from './item-swatch.module.css';
import { pairFor, type ItemPalette } from './palette';

export interface ItemSwatchProps extends ComponentPropsWithRef<'span'> {
  /** Id do item (não vai para o DOM): o mesmo id sempre gera o mesmo par de cores. */
  id: string;
  /** Pares de cor [início, fim] do gradiente; sem ela, usa a paleta padrão do tema. */
  palette?: ItemPalette;
}

/** Quadrado em gradiente que identifica um item sem imagem própria; decorativo. */
export function ItemSwatch({ id, palette, className, style, children, ...rest }: ItemSwatchProps) {
  const [from, to] = pairFor(id, palette);
  return (
    <span
      {...rest}
      aria-hidden="true"
      className={[styles.root, className].filter(Boolean).join(' ')}
      style={{ ...style, background: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      {children}
    </span>
  );
}
