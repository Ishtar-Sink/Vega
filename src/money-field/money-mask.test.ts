import { formatCents, maskMoneyInput, parseMoneyInput } from './money-mask';

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const prefix = brl.format(0).replace(/0,00$/, '');
const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const usdPrefix = usd.format(0).replace(/0\.00$/, '');
const eur = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' });
const eurSuffix = eur.format(0).replace(/^0,00/, '');

describe('money mask', () => {
  it('formats the whole part with thousands while typing', () => {
    expect(maskMoneyInput('14500', 'pt-BR', 'BRL')).toBe(`${prefix}14.500`);
  });

  it('keeps a typed comma and up to two decimals', () => {
    expect(maskMoneyInput('14500,', 'pt-BR', 'BRL')).toBe(`${prefix}14.500,`);
    expect(maskMoneyInput('14500,509', 'pt-BR', 'BRL')).toBe(`${prefix}14.500,50`);
  });

  it('accepts a pasted value with separators', () => {
    expect(maskMoneyInput('14500,5', 'pt-BR', 'BRL')).toBe(`${prefix}14.500,5`);
    expect(maskMoneyInput('R$ 14.500,5', 'pt-BR', 'BRL')).toBe(`${prefix}14.500,5`);
  });

  it('starts with zero when only the comma is typed', () => {
    expect(maskMoneyInput(',', 'pt-BR', 'BRL')).toBe(`${prefix}0,`);
  });

  it('clears when nothing is left', () => {
    expect(maskMoneyInput('', 'pt-BR', 'BRL')).toBe('');
    expect(maskMoneyInput('R$ ', 'pt-BR', 'BRL')).toBe('');
  });

  it('converts to integer cents', () => {
    expect(parseMoneyInput('R$ 14.500', 'pt-BR', 'BRL')).toBe(1450000);
    expect(parseMoneyInput('R$ 14.500,5', 'pt-BR', 'BRL')).toBe(1450050);
    expect(parseMoneyInput('', 'pt-BR', 'BRL')).toBeNull();
  });

  it('formats cents with two decimals', () => {
    expect(formatCents(1450050, 'pt-BR', 'BRL')).toBe(brl.format(14500.5));
  });

  it('cb03 masks and parses in en-US with USD', () => {
    expect(maskMoneyInput('14500.5', 'en-US', 'USD')).toBe(`${usdPrefix}14,500.5`);
    expect(parseMoneyInput(`${usdPrefix}14,500.50`, 'en-US', 'USD')).toBe(1450050);
    expect(formatCents(1450050, 'en-US', 'USD')).toBe(usd.format(14500.5));
  });

  it('cb03 masks and parses a currency with suffix in de-DE', () => {
    expect(maskMoneyInput('14500,5', 'de-DE', 'EUR')).toBe(`14.500,5${eurSuffix}`);
    expect(parseMoneyInput(`14.500,50${eurSuffix}`, 'de-DE', 'EUR')).toBe(1450050);
    expect(formatCents(1450050, 'de-DE', 'EUR')).toBe(eur.format(14500.5));
  });

  it('refuses a value beyond the safe integer of cents', () => {
    expect(parseMoneyInput('9'.repeat(20), 'pt-BR', 'BRL')).toBeNull();
  });
});
