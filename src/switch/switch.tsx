import { useId } from 'react';
import type { MouseEvent } from 'react';
import styles from './switch.module.css';
import type { SwitchProps } from './switch.types';

export type { SwitchProps } from './switch.types';

export function Switch({
  label,
  help,
  checked,
  onCheckedChange,
  id,
  className,
  style,
  disabled,
  onClick,
  'aria-describedby': describedByProp,
  ...rest
}: SwitchProps) {
  const generated = useId();
  const controlId = id ?? generated;
  const helpId = `${controlId}-help`;
  const describedBy = [describedByProp, help ? helpId : null].filter(Boolean).join(' ');

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    onClick?.(event);
    if (event.defaultPrevented) return;
    onCheckedChange(!checked);
  }

  return (
    <div className={styles.field}>
      <button
        {...rest}
        id={controlId}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-describedby={describedBy || undefined}
        disabled={disabled}
        className={[styles.root, className].filter(Boolean).join(' ')}
        style={style}
        onClick={handleClick}
      >
        <span className={styles.track} aria-hidden="true">
          <span className={styles.thumb} />
        </span>
      </button>
      <div className={styles.text}>
        <label htmlFor={controlId} className={styles.label}>
          {label}
        </label>
        {help ? (
          <p id={helpId} className={styles.help}>
            {help}
          </p>
        ) : null}
      </div>
    </div>
  );
}
