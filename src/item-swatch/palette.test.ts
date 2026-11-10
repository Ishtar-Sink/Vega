import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { itemPalette } from '../theme/tokens';
import { DEFAULT_ITEM_PALETTE, pairFor } from './palette';

describe('item palette', () => {
  it('derives the default palette from the theme tokens, without literal colors', () => {
    expect(DEFAULT_ITEM_PALETTE).toHaveLength(itemPalette.length);
    DEFAULT_ITEM_PALETTE.forEach((pair, index) => {
      expect(pair).toEqual([
        `var(--item-palette-${String(index + 1)}-from)`,
        `var(--item-palette-${String(index + 1)}-to)`,
      ]);
    });
  });

  it('points only to variables declared in tokens.css', () => {
    const tokensCss = readFileSync(join(import.meta.dirname, '../theme/tokens.css'), 'utf8');
    for (const pair of DEFAULT_ITEM_PALETTE) {
      for (const value of pair) {
        const name = /var\((--[^)]+)\)/.exec(value)?.[1];
        expect(name).toBeDefined();
        expect(tokensCss).toContain(`${name ?? ''}:`);
      }
    }
  });

  it('returns the same pair for the same id', () => {
    expect(pairFor('item-1')).toEqual(pairFor('item-1'));
    expect(DEFAULT_ITEM_PALETTE).toContainEqual(pairFor('item-1'));
  });

  it('keeps the Atria pair for the same id', () => {
    expect(pairFor('abc', itemPalette)).toEqual(['#4C1D95', '#0E7490']);
    expect(pairFor('item-1', itemPalette)).toEqual(['#9333EA', '#67E8F9']);
    expect(pairFor('projeto-42', itemPalette)).toEqual(['#7C3AED', '#06B6D4']);
  });

  it('uses the palette it receives', () => {
    const custom = [
      ['#111111', '#222222'],
      ['#333333', '#444444'],
    ] as const;
    for (const id of ['a', 'b', 'c']) {
      expect(custom).toContainEqual(pairFor(id, custom));
    }
  });

  it('falls back to the default palette when the palette is empty', () => {
    expect(pairFor('abc', [])).toEqual(pairFor('abc'));
  });
});
