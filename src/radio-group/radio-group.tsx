import { useId } from 'react';
import styles from './radio-group.module.css';
import type { RadioGroupProps } from './radio-group.types';
import { RadioOptionItem } from './radio-option';

export function RadioGroup({
  label,
  hideLabel,
  options,
  value,
  onChange,
  name,
  variant = 'default',
  readOnly = false,
  help,
  error,
  className,
  style,
  ref,
  'aria-describedby': describedByProp,
  ...rest
}: RadioGroupProps) {
  const generated = useId();
  const group = name ?? generated;
  const legendId = `${generated}-legend`;
  const helpId = `${generated}-help`;
  const errorId = `${generated}-error`;
  const describedBy = [describedByProp, help ? helpId : null, error ? errorId : null]
    .filter(Boolean)
    .join(' ');
  return (
    <fieldset
      {...rest}
      ref={ref}
      className={[styles.root, className].filter(Boolean).join(' ')}
      style={style}
      aria-describedby={describedBy || undefined}
    >
      <legend id={legendId} className={hideLabel ? styles.srOnly : styles.legend}>
        {label}
      </legend>
      <div
        role="radiogroup"
        aria-labelledby={legendId}
        aria-readonly={readOnly || undefined}
        aria-invalid={error ? true : undefined}
        className={styles.options}
      >
        {options.map((option) => (
          <RadioOptionItem
            key={option.value}
            option={option}
            name={group}
            checked={option.value === value}
            variant={variant}
            readOnly={readOnly}
            onSelect={onChange}
          />
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
