import { useState } from 'react';
import { TextField } from '../text-field/text-field';
import type { TextFieldProps } from '../text-field/text-field';
import { formatCents, maskMoneyInput, parseMoneyInput } from './money-mask';
import styles from './money-field.module.css';

export interface MoneyFieldProps extends Omit<
  TextFieldProps,
  'value' | 'defaultValue' | 'onChange' | 'type' | 'inputMode'
> {
  /** Valor em centavos inteiros; `null` quando vazio. */
  valueCents: number | null;
  /** Recebe os centavos inteiros a cada digitação, ou `null` quando vazio. */
  onChange: (cents: number | null) => void;
  /** Locale dos separadores e do símbolo, no formato BCP 47. Padrão: `pt-BR`. */
  locale?: string;
  /** Moeda ISO 4217. Padrão: `BRL`. */
  currency?: string;
}

/** Campo de moeda: mostra o valor formatado ao digitar e entrega sempre centavos inteiros. */
export function MoneyField({
  valueCents,
  onChange,
  locale = 'pt-BR',
  currency = 'BRL',
  onBlur,
  className,
  ...rest
}: MoneyFieldProps) {
  const [text, setText] = useState(() =>
    valueCents === null ? '' : formatCents(valueCents, locale, currency),
  );

  // Mudança de fora (como o `reset` do formulário): ajusta o texto durante a renderização.
  const [seen, setSeen] = useState({ valueCents, locale, currency });
  if (seen.valueCents !== valueCents || seen.locale !== locale || seen.currency !== currency) {
    setSeen({ valueCents, locale, currency });
    if (parseMoneyInput(text, locale, currency) !== valueCents) {
      setText(valueCents === null ? '' : formatCents(valueCents, locale, currency));
    }
  }

  return (
    <TextField
      {...rest}
      className={[styles.root, className].filter(Boolean).join(' ')}
      inputMode="decimal"
      autoComplete="off"
      value={text}
      onChange={(event) => {
        const next = maskMoneyInput(event.target.value, locale, currency);
        setText(next);
        onChange(parseMoneyInput(next, locale, currency));
      }}
      onBlur={(event) => {
        const cents = parseMoneyInput(text, locale, currency);
        if (cents !== null) setText(formatCents(cents, locale, currency));
        onBlur?.(event);
      }}
    />
  );
}
