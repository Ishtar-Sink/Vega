import { useId, useImperativeHandle, useRef, useState } from 'react';
import type { ComponentPropsWithRef, KeyboardEvent } from 'react';
import styles from './tag-field.module.css';

export interface TagFieldProps extends Omit<
  ComponentPropsWithRef<'input'>,
  'value' | 'defaultValue' | 'onChange' | 'onBlur' | 'type'
> {
  /** Rótulo visível do campo. */
  label: string;
  /** Etiquetas adicionadas. */
  value: readonly string[];
  /** Chamada com a lista nova ao adicionar ou remover uma etiqueta. */
  onChange: (value: string[]) => void;
  /** Chamada quando o campo perde o foco, depois de confirmar o texto pendente. */
  onBlur?: () => void;
  /** Nome da lista de etiquetas; padrão `{label} adicionadas`. */
  listLabel?: string;
  /** Nome do "×" de cada etiqueta; padrão `Remover {etiqueta}`. */
  removeLabel?: (tag: string) => string;
  /** Texto de ajuda abaixo do campo. */
  help?: string;
  /** Mensagem de erro; aparece com `role="alert"` e marca o campo como inválido. */
  error?: string;
}

const defaultRemoveLabel = (tag: string) => `Remover ${tag}`;

export function TagField({
  label,
  value,
  onChange,
  onBlur,
  listLabel,
  removeLabel = defaultRemoveLabel,
  help,
  error,
  id,
  className,
  style,
  ref,
  'aria-describedby': describedByProp,
  'aria-invalid': ariaInvalid,
  ...rest
}: TagFieldProps) {
  const generated = useId();
  const controlId = id ?? generated;
  const helpId = `${controlId}-help`;
  const errorId = `${controlId}-error`;
  const describedBy = [describedByProp, help ? helpId : null, error ? errorId : null]
    .filter(Boolean)
    .join(' ');
  const input = useRef<HTMLInputElement>(null);
  const [text, setText] = useState('');

  useImperativeHandle(ref, () => input.current as HTMLInputElement, []);

  function commit(raw: string) {
    const tag = raw.trim().replace(/^#+/, '').trim();
    setText('');
    if (!tag) return;
    if (value.some((existing) => existing.toLowerCase() === tag.toLowerCase())) return;
    onChange([...value, tag]);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      commit(text);
    } else if (event.key === 'Backspace' && text === '' && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  }

  return (
    <div className={styles.root}>
      <label htmlFor={controlId} className={styles.label}>
        {label}
      </label>
      <input
        autoComplete="off"
        {...rest}
        ref={input}
        id={controlId}
        type="text"
        className={[styles.control, className].filter(Boolean).join(' ')}
        style={style}
        value={text}
        aria-invalid={error ? true : ariaInvalid}
        aria-describedby={describedBy || undefined}
        onChange={(event) => {
          const next = event.target.value;
          if (next.includes(',')) {
            next
              .split(',')
              .slice(0, -1)
              .forEach((part) => {
                commit(part);
              });
            setText(next.slice(next.lastIndexOf(',') + 1));
          } else {
            setText(next);
          }
        }}
        onKeyDown={onKeyDown}
        onBlur={() => {
          commit(text);
          onBlur?.();
        }}
      />
      {value.length > 0 ? (
        <ul aria-label={listLabel ?? `${label} adicionadas`} className={styles.pills}>
          {value.map((tag) => (
            <li key={tag} className={styles.pill}>
              <span>{tag}</span>
              <button
                type="button"
                className={styles.remove}
                aria-label={removeLabel(tag)}
                onClick={() => {
                  onChange(value.filter((existing) => existing !== tag));
                  input.current?.focus();
                }}
              >
                <span aria-hidden="true">×</span>
              </button>
            </li>
          ))}
        </ul>
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
