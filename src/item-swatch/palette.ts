import { itemPalette } from '../theme/tokens';

/** Pares de cor do gradiente de um item, do início ao fim. */
export type ItemPalette = ReadonlyArray<readonly [string, string]>;

/** Paleta padrão: as variáveis --item-palette-N-from/to do tema, sem cor literal; segue o tema e pode ser sobrescrita por CSS. */
export const DEFAULT_ITEM_PALETTE: ItemPalette = itemPalette.map(
  (_, index) =>
    [
      `var(--item-palette-${String(index + 1)}-from)`,
      `var(--item-palette-${String(index + 1)}-to)`,
    ] as const,
);

const FALLBACK_PAIR = ['var(--item-palette-1-from)', 'var(--item-palette-1-to)'] as const;

/** Mesmo id, mesmo par, sem estado guardado; paleta vazia usa a padrão. */
export function pairFor(
  id: string,
  palette: ItemPalette = DEFAULT_ITEM_PALETTE,
): readonly [string, string] {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  const source = palette.length > 0 ? palette : DEFAULT_ITEM_PALETTE;
  return source[hash % source.length] ?? FALLBACK_PAIR;
}
