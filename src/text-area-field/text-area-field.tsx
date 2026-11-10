import { useId, useState } from 'react';
import type { ChangeEvent } from 'react';
import styles from './text-area-field.module.css';
import type { TextAreaFieldProps } from './text-area-field.types';
import { useAutoResize } from './use-auto-resize';

export function TextAreaField({
  label,
  help,
  error,
  autoResize = false,
  minRows = 3,
  maxRows = 12,
  counter,
  id,
  className,
  style,
  rows,
  value,
  defaultValue,
  onChange,
  'aria-describedby': describedByProp,
  'aria-invalid': ariaInvalid,
  ...rest
}: TextAreaFieldProps) {
  const generated = useId();
  const controlId = id ?? generated;
  const helpId = `${controlId}-help`;
  const counterId = `${controlId}-counter`;
  const errorId = `${controlId}-error`;
  const [typed, setTyped] = useState(String(value ?? defaultValue ?? ''));
  const current = value === undefined ? typed : String(value);
  const autoRows = useAutoResize(current, { enabled: autoResize, minRows, maxRows });
  const describedBy = [
    describedByProp,
    help ? helpId : null,
    counter ? counterId : null,
    error ? errorId : null,
  ]
    .filter(Boolean)
    .join(' ');

  function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setTyped(event.target.value);
    onChange?.(event);
  }

  return (
    <div className={styles.root}>
      <label htmlFor={controlId} className={styles.label}>
        {label}
      </label>
      <textarea
        {...rest}
        id={controlId}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        rows={autoRows ?? rows}
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
      {counter ? (
        <p id={counterId} className={styles.counter}>
          {counter}
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
