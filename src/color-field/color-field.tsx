import { useEffect, useId, useImperativeHandle, useRef, useState } from 'react';
import type { ComponentPropsWithRef } from 'react';
import { Button } from '../button/button';
import { hexToRgb, rgbToHex } from './color';
import { ColorPicker, DEFAULT_COLOR_FIELD_LABELS, type ColorFieldLabels } from './color-picker';
import styles from './color-field.module.css';

export type { ColorFieldLabels } from './color-picker';

export interface ColorFieldProps extends Omit<
  ComponentPropsWithRef<'button'>,
  'value' | 'defaultValue' | 'onChange' | 'onBlur' | 'children' | 'type'
> {
  /** Rótulo visível do campo. */
  label: string;
  /** HEX atual. */
  value: string;
  /** Chamado com o HEX `#RRGGBB` ao aplicar. */
  onChange: (hex: string) => void;
  /** Chamado quando o diálogo fecha. */
  onBlur?: () => void;
  /** Textos do campo e do seletor; os que faltarem usam o padrão em pt-br. */
  labels?: Partial<ColorFieldLabels>;
  /** Mensagem de erro, anunciada com `role="alert"`. */
  error?: string;
  /** Texto de ajuda sob o campo. */
  help?: string;
}

export function ColorField({
  label,
  value,
  onChange,
  onBlur,
  labels,
  error,
  help,
  id,
  className,
  style,
  ref,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  ...rest
}: ColorFieldProps) {
  const text = { ...DEFAULT_COLOR_FIELD_LABELS, ...labels };
  const generated = useId();
  const controlId = id ?? generated;
  const labelId = `${controlId}-label`;
  const valueId = `${controlId}-value`;
  const titleId = `${controlId}-title`;
  const helpId = `${controlId}-help`;
  const errorId = `${controlId}-error`;
  const describedBy = [ariaDescribedBy, help ? helpId : null, error ? errorId : null]
    .filter(Boolean)
    .join(' ');
  const trigger = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const draft = useRef(value);

  useImperativeHandle(ref, () => trigger.current as HTMLButtonElement, []);

  const rgb = hexToRgb(value);
  const shown = rgb ? rgbToHex(rgb) : value;

  useEffect(() => {
    if (!open) return;
    dialog.current?.showModal();
    dialog.current?.querySelector<HTMLElement>('[role="slider"]')?.focus();
  }, [open]);

  function close() {
    setOpen(false);
    trigger.current?.focus();
    onBlur?.();
  }

  return (
    <div className={styles.root}>
      <span id={labelId} className={styles.label}>
        {label}
      </span>
      {/* eslint-disable-next-line jsx-a11y/role-supports-aria-props -- mesmo contrato do SelectField */}
      <button
        {...rest}
        ref={trigger}
        type="button"
        id={controlId}
        className={[styles.trigger, className].filter(Boolean).join(' ')}
        style={style}
        aria-haspopup="dialog"
        aria-labelledby={`${labelId} ${valueId}`}
        aria-invalid={error ? true : ariaInvalid}
        aria-describedby={describedBy || undefined}
        onClick={() => {
          draft.current = value;
          setOpen(true);
        }}
      >
        <span className={styles.swatch} data-swatch="" style={{ backgroundColor: value }} />
        <span id={valueId} className={styles.hexText}>
          {shown}
        </span>
      </button>
      {open ? (
        <dialog
          ref={dialog}
          aria-labelledby={titleId}
          className={styles.dialog}
          onCancel={(event) => {
            event.preventDefault();
            close();
          }}
        >
          <h2 id={titleId} className={styles.title}>
            {text.title}
          </h2>
          <ColorPicker
            value={value}
            labels={text}
            onChange={(hex) => {
              draft.current = hex;
            }}
          />
          <div className={styles.buttons}>
            <Button variant="ghost" onClick={close}>
              {text.cancel}
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                onChange(draft.current);
                close();
              }}
            >
              {text.apply}
            </Button>
          </div>
        </dialog>
      ) : null}
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
