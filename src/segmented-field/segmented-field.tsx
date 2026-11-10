import { useId } from 'react';
import type { ComponentPropsWithRef } from 'react';
import styles from './segmented-field.module.css';

export interface SegmentedOption {
  value: string;
  label: string;
}

export interface SegmentedFieldProps extends Omit<
  ComponentPropsWithRef<'fieldset'>,
  'onChange' | 'onBlur' | 'children'
> {
  /** Rótulo visível do grupo (a legenda do `<fieldset>`). */
  label: string;
  /** Opções exibidas como segmentos. */
  options: readonly SegmentedOption[];
  /** Valor da opção escolhida. */
  value: string;
  /** Chamada com o valor da opção escolhida. */
  onChange: (value: string) => void;
  /** Chamada quando um segmento perde o foco. */
  onBlur?: () => void;
  /** Nome dos rádios; sem ele, um nome gerado agrupa as opções. */
  name?: string;
  /** Mensagem de erro; aparece com `role="alert"` ligada ao grupo. */
  error?: string;
  /** Texto de ajuda abaixo do grupo. */
  help?: string;
}

export function SegmentedField({
  label,
  options,
  value,
  onChange,
  onBlur,
  name,
  error,
  help,
  className,
  style,
  'aria-describedby': describedByProp,
  ...rest
}: SegmentedFieldProps) {
  const generated = useId();
  const group = name ?? generated;
  const helpId = `${generated}-help`;
  const errorId = `${generated}-error`;
  const describedBy = [describedByProp, help ? helpId : null, error ? errorId : null]
    .filter(Boolean)
    .join(' ');
  return (
    <fieldset
      {...rest}
      className={[styles.root, className].filter(Boolean).join(' ')}
      style={style}
      aria-describedby={describedBy || undefined}
    >
      <legend className={styles.legend}>{label}</legend>
      <div role="radiogroup" aria-label={label} className={styles.group}>
        {options.map((option) => (
          <label key={option.value} className={styles.segment}>
            <input
              type="radio"
              name={group}
              value={option.value}
              checked={option.value === value}
              className={styles.input}
              onChange={() => {
                onChange(option.value);
              }}
              onBlur={onBlur}
            />
            <span className={styles.text}>{option.label}</span>
          </label>
        ))}
      </div>
      {help ? (
        <p id={helpId} className={styles.help}>
          {help}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} role="alert" className={styles.error}>
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
