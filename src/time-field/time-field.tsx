import { useId, useState } from 'react';
import type { ComponentPropsWithRef } from 'react';
import { maskTime, parseTime } from './parse-time';
import styles from './time-field.module.css';

export interface TimeFieldProps extends Omit<
  ComponentPropsWithRef<'input'>,
  'onChange' | 'onBlur' | 'value' | 'defaultValue' | 'type'
> {
  /** Rótulo visível do campo. */
  label: string;
  /** Hora no formato `HH:mm`, ou `''` quando vazia. */
  value: string;
  /** Chamado com a hora normalizada (`HH:mm` ou `''`) quando o campo perde o foco com valor novo. */
  onChange: (value: string) => void;
  /** Chamado quando o campo perde o foco, depois da normalização. */
  onBlur?: () => void;
  /** Texto de exemplo do campo vazio. */
  placeholder?: string;
  /** Esconde o rótulo visualmente, mantendo-o para leitores de tela. */
  hideLabel?: boolean;
  /** Texto de ajuda abaixo do campo. */
  help?: string;
  /** Mensagem de erro; aparece com `role="alert"` e marca o campo como inválido. */
  error?: string;
}

function ClockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function TimeField({
  label,
  value,
  onChange,
  onBlur,
  placeholder = 'hh:mm',
  hideLabel = false,
  help,
  error,
  id,
  className,
  style,
  ...rest
}: TimeFieldProps) {
  const generated = useId();
  const controlId = id ?? generated;
  const helpId = `${controlId}-help`;
  const errorId = `${controlId}-error`;
  const describedBy = [help ? helpId : null, error ? errorId : null].filter(Boolean).join(' ');
  const [text, setText] = useState(value);

  const [previous, setPrevious] = useState(value);
  if (previous !== value) {
    setPrevious(value);
    setText(value);
  }

  return (
    <div className={styles.root}>
      <label
        htmlFor={controlId}
        className={[styles.label, hideLabel ? styles.hidden : ''].filter(Boolean).join(' ')}
      >
        {label}
      </label>
      <div className={styles.wrap}>
        <span className={styles.icon}>
          <ClockIcon />
        </span>
        <input
          {...rest}
          id={controlId}
          type="text"
          inputMode="numeric"
          maxLength={5}
          autoComplete="off"
          placeholder={placeholder}
          value={text}
          className={[styles.control, className].filter(Boolean).join(' ')}
          style={style}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy || undefined}
          onChange={(event) => {
            setText(maskTime(event.target.value));
          }}
          onBlur={() => {
            const normalized = parseTime(text) ?? '';
            setText(normalized);
            if (normalized !== value) onChange(normalized);
            onBlur?.();
          }}
        />
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
    </div>
  );
}
