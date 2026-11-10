import { useEffect, useId, useImperativeHandle, useRef, useState } from 'react';
import type { ComponentPropsWithRef } from 'react';
import { Button } from '../button/button';
import { Calendar, type CalendarLabels } from '../calendar/calendar';
import styles from './date-field.module.css';

export interface DateFieldLabels {
  /** Texto do gatilho sem data. */
  placeholder: string;
  /** Botão que escolhe o dia atual. */
  today: string;
  /** Botão que limpa a data. */
  clear: string;
  /** Nome do botão do mês anterior. */
  previous: string;
  /** Nome do botão do próximo mês. */
  next: string;
  /** Sufixo do dia atual no nome acessível. */
  todayMarker: string;
}

const DEFAULT_LABELS: DateFieldLabels = {
  placeholder: 'Escolher data',
  today: 'Hoje',
  clear: 'Limpar',
  previous: 'Mês anterior',
  next: 'Próximo mês',
  todayMarker: 'hoje',
};

export interface DateFieldProps extends Omit<
  ComponentPropsWithRef<'button'>,
  'onChange' | 'onBlur' | 'value' | 'defaultValue' | 'children' | 'type'
> {
  /** Rótulo visível do campo. */
  label: string;
  /** Data no formato `YYYY-MM-DD`, ou `''` quando vazia. */
  value: string;
  /** Chamado com a data escolhida (`YYYY-MM-DD`) ou `''` ao limpar. */
  onChange: (value: string) => void;
  /** Chamado quando o calendário fecha por clique fora, sem escolher. */
  onBlur?: () => void;
  /** Locale das datas. Padrão: `pt-BR`. */
  locale?: string;
  /** Textos do campo; o que faltar usa o padrão em pt-br, qualquer que seja o `locale`. */
  labels?: Partial<DateFieldLabels>;
  /** Dia atual (`YYYY-MM-DD`); padrão: a data do navegador, lida só quando a prop falta. */
  today?: string;
  /** Esconde o rótulo visualmente, mantendo-o para leitores de tela. */
  hideLabel?: boolean;
  /** Texto de ajuda abaixo do campo. */
  help?: string;
  /** Mensagem de erro; aparece com `role="alert"` e marca o campo como inválido. */
  error?: string;
}

function CalendarIcon() {
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
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function localToday(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${String(now.getFullYear())}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

function formatIso(iso: string, locale: string): string {
  const [y = 1970, m = 1, d = 1] = iso.split('-').map(Number);
  return new Intl.DateTimeFormat(locale).format(new Date(y, m - 1, d));
}

export function DateField({
  label,
  value,
  onChange,
  onBlur,
  locale = 'pt-BR',
  labels,
  today,
  hideLabel = false,
  help,
  error,
  id,
  className,
  style,
  ref,
  ...rest
}: DateFieldProps) {
  const generated = useId();
  const controlId = id ?? generated;
  const labelId = `${controlId}-label`;
  const valueId = `${controlId}-value`;
  const helpId = `${controlId}-help`;
  const errorId = `${controlId}-error`;
  const describedBy = [help ? helpId : null, error ? errorId : null].filter(Boolean).join(' ');
  const dayToday = today ?? localToday();

  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useImperativeHandle(ref, () => trigger.current as HTMLButtonElement, []);
  const fieldLabels = { ...DEFAULT_LABELS, ...labels };
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState((value || dayToday).slice(0, 7));

  function close(focus: boolean) {
    setOpen(false);
    if (focus) trigger.current?.focus();
    else onBlur?.();
  }

  function commit(next: string) {
    onChange(next);
    close(true);
  }

  useEffect(() => {
    if (!open) return;
    root.current?.querySelector<HTMLElement>('[data-day][tabindex="0"]')?.focus();
    const onPointer = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) close(false);
    };
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        close(true);
      }
    };
    document.addEventListener('pointerdown', onPointer, true);
    document.addEventListener('keydown', onKey, true);
    return () => {
      document.removeEventListener('pointerdown', onPointer, true);
      document.removeEventListener('keydown', onKey, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- só ao abrir
  }, [open]);

  const calendarLabels: CalendarLabels = {
    previous: fieldLabels.previous,
    next: fieldLabels.next,
    today: fieldLabels.todayMarker,
  };

  return (
    <div className={styles.root} ref={root}>
      <span
        id={labelId}
        className={[styles.label, hideLabel ? styles.hidden : ''].filter(Boolean).join(' ')}
      >
        {label}
      </span>
      <div className={styles.wrap}>
        {/* eslint-disable-next-line jsx-a11y/role-supports-aria-props -- mesmo contrato do SelectField */}
        <button
          {...rest}
          ref={trigger}
          type="button"
          id={controlId}
          className={[styles.control, className].filter(Boolean).join(' ')}
          style={style}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-labelledby={`${labelId} ${valueId}`}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy || undefined}
          onClick={() => {
            if (open) {
              close(false);
              return;
            }
            setMonth((value || dayToday).slice(0, 7));
            setOpen(true);
          }}
        >
          <CalendarIcon />
          <span id={valueId} className={value ? styles.value : styles.placeholder}>
            {value ? formatIso(value, locale) : fieldLabels.placeholder}
          </span>
        </button>
        {open ? (
          <div role="dialog" aria-label={label} className={styles.popover}>
            <Calendar
              mode="single"
              month={month}
              onMonthChange={setMonth}
              value={{ from: value }}
              onChange={(next) => {
                commit(next.from);
              }}
              today={dayToday}
              locale={locale}
              labels={calendarLabels}
            />
            <div className={styles.actions}>
              <Button
                variant="ghost"
                onClick={() => {
                  commit(dayToday);
                }}
              >
                {fieldLabels.today}
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  commit('');
                }}
              >
                {fieldLabels.clear}
              </Button>
            </div>
          </div>
        ) : null}
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
