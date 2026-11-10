import { useId } from 'react';
import type { ComponentPropsWithRef } from 'react';
import styles from './text-field.module.css';

export interface TextFieldProps extends ComponentPropsWithRef<'input'> {
  /** Rótulo visível do campo. */
  label: string;
  /** Texto de ajuda abaixo do campo. */
  help?: string;
  /** Mensagem de erro; aparece com `role="alert"` e marca o campo como inválido. */
  error?: string;
}

export function TextField({
  label,
  help,
  error,
  id,
  className,
  style,
  'aria-describedby': describedByProp,
  'aria-invalid': ariaInvalid,
  ...rest
}: TextFieldProps) {
  const generated = useId();
  const controlId = id ?? generated;
  const helpId = `${controlId}-help`;
  const errorId = `${controlId}-error`;
  const describedBy = [describedByProp, help ? helpId : null, error ? errorId : null]
    .filter(Boolean)
    .join(' ');
  return (
    <div className={styles.root}>
      <label htmlFor={controlId} className={styles.label}>
        {label}
      </label>
      <input
        {...rest}
        id={controlId}
        className={[styles.control, className].filter(Boolean).join(' ')}
        style={style}
        aria-invalid={error ? true : ariaInvalid}
        aria-describedby={describedBy || undefined}
      />
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
