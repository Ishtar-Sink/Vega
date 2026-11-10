import { useId } from 'react';
import type { ComponentPropsWithRef } from 'react';
import styles from './checkbox.module.css';

export interface CheckboxProps extends Omit<ComponentPropsWithRef<'input'>, 'type'> {
  /** Rótulo visível ao lado da caixa. */
  label: string;
}

export function Checkbox({ label, id, className, style, ...rest }: CheckboxProps) {
  const generated = useId();
  const controlId = id ?? generated;
  return (
    <div className={styles.root}>
      <input
        {...rest}
        id={controlId}
        type="checkbox"
        className={[styles.control, className].filter(Boolean).join(' ')}
        style={style}
      />
      <label htmlFor={controlId} className={styles.label}>
        {label}
      </label>
    </div>
  );
}
