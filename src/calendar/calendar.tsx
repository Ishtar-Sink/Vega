import { useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import type { ComponentPropsWithRef, KeyboardEvent } from 'react';
import { IconButton } from '../icon-button/icon-button';
import styles from './calendar.module.css';

export interface CalendarValue {
  /** `YYYY-MM-DD` ou `''`. */
  from: string;
  to?: string;
}

export interface CalendarLabels {
  previous: string;
  next: string;
  /** Sufixo do dia atual no nome acessível ("hoje"). */
  today: string;
}

const DEFAULT_LABELS: CalendarLabels = {
  previous: 'Mês anterior',
  next: 'Próximo mês',
  today: 'hoje',
};

export interface CalendarProps extends Omit<
  ComponentPropsWithRef<'div'>,
  'onChange' | 'defaultValue'
> {
  /** `single` escolhe um dia; `range` escolhe um intervalo com dois cliques. */
  mode: 'single' | 'range';
  /** Mês exibido, `YYYY-MM`. */
  month: string;
  onMonthChange: (month: string) => void;
  value: CalendarValue;
  onChange: (value: CalendarValue) => void;
  /** Dia atual, `YYYY-MM-DD`. */
  today: string;
  /** Locale das datas e dos nomes de mês e dia. Padrão: `pt-BR`. */
  locale?: string;
  /** Textos do calendário; o que faltar usa o padrão em pt-br, qualquer que seja o `locale`. */
  labels?: Partial<CalendarLabels>;
}

const pad = (n: number) => String(n).padStart(2, '0');

function toIso(date: Date): string {
  return `${String(date.getFullYear())}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function fromIso(iso: string): Date {
  const [y = 1970, m = 1, d = 1] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function Arrow({ left }: { left: boolean }) {
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
      <path d={left ? 'M15 18l-6-6 6-6' : 'M9 18l6-6-6-6'} />
    </svg>
  );
}

export function Calendar({
  mode,
  month,
  onMonthChange,
  value,
  onChange,
  today,
  locale = 'pt-BR',
  labels,
  className,
  ref,
  ...rest
}: CalendarProps) {
  const root = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => root.current as HTMLDivElement, []);
  const calendarLabels = { ...DEFAULT_LABELS, ...labels };
  const pendingFocus = useRef<string | null>(null);
  const [year, mon] = month.split('-').map(Number) as [number, number];

  const title = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(
        new Date(year, mon - 1, 1),
      ),
    [locale, year, mon],
  );
  const weekdays = useMemo(() => {
    const narrow = new Intl.DateTimeFormat(locale, { weekday: 'narrow' });
    const long = new Intl.DateTimeFormat(locale, { weekday: 'long' });
    // 4 de janeiro de 2026 é um domingo.
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(2026, 0, 4 + i);
      return { short: narrow.format(date), long: long.format(date) };
    });
  }, [locale]);
  const full = useMemo(() => new Intl.DateTimeFormat(locale, { dateStyle: 'long' }), [locale]);

  const first = new Date(year, mon - 1, 1);
  const start = new Date(year, mon - 1, 1 - first.getDay());
  const days = Array.from({ length: 42 }, (_, i) => {
    const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
    return { iso: toIso(date), date };
  });

  const weeks = Array.from({ length: 6 }, (_, w) => days.slice(w * 7, w * 7 + 7));
  const from = value.from;
  const to = mode === 'range' ? (value.to ?? value.from) : value.from;
  const currentMonth = month;
  const roving =
    [from, today, `${month}-01`].find((iso) => iso && iso.slice(0, 7) === currentMonth) ??
    `${month}-01`;

  function focusDay(iso: string) {
    pendingFocus.current = iso;
    if (iso.slice(0, 7) !== month) {
      onMonthChange(iso.slice(0, 7));
    } else {
      root.current?.querySelector<HTMLElement>(`[data-day="${iso}"]`)?.focus();
    }
  }

  // Depois de trocar de mês, o foco vai para o dia pedido.
  useEffect(() => {
    const target = pendingFocus.current;
    if (!target || target.slice(0, 7) !== month) return;
    pendingFocus.current = null;
    root.current?.querySelector<HTMLElement>(`[data-day="${target}"]`)?.focus();
  }, [month]);

  function shiftMonth(delta: number) {
    const date = new Date(year, mon - 1 + delta, 1);
    onMonthChange(`${String(date.getFullYear())}-${pad(date.getMonth() + 1)}`);
  }

  function pick(iso: string) {
    if (mode === 'single') {
      onChange({ from: iso });
      return;
    }
    if (!value.from || value.to) {
      onChange({ from: iso });
    } else if (iso < value.from) {
      onChange({ from: iso, to: value.from });
    } else {
      onChange({ from: value.from, to: iso });
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, iso: string) {
    const step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[event.key];
    if (step === undefined) return;
    event.preventDefault();
    const date = fromIso(iso);
    date.setDate(date.getDate() + step);
    focusDay(toIso(date));
  }

  return (
    <div {...rest} ref={root} className={[styles.root, className].filter(Boolean).join(' ')}>
      <div className={styles.head}>
        <IconButton
          aria-label={calendarLabels.previous}
          icon={<Arrow left />}
          onClick={() => {
            shiftMonth(-1);
          }}
        />
        <span className={styles.title}>{title}</span>
        <IconButton
          aria-label={calendarLabels.next}
          icon={<Arrow left={false} />}
          onClick={() => {
            shiftMonth(1);
          }}
        />
      </div>
      <div role="grid" aria-label={title} className={styles.grid}>
        <div role="row" className={styles.row}>
          {weekdays.map((weekday) => (
            <span
              key={weekday.long}
              role="columnheader"
              aria-label={weekday.long}
              className={styles.dow}
            >
              {weekday.short}
            </span>
          ))}
        </div>
        {weeks.map((week) => (
          <div key={week[0]?.iso} role="row" className={styles.row}>
            {week.map(({ iso, date }) => {
              const outside = iso.slice(0, 7) !== month;
              const inRange = mode === 'range' && from !== '' && iso >= from && iso <= to;
              const edge = from !== '' && (iso === from || iso === to);
              const classes = [
                styles.day,
                outside ? styles.outside : '',
                inRange && !edge ? styles.inRange : '',
                edge ? styles.edge : '',
                iso === today ? styles.today : '',
              ]
                .filter(Boolean)
                .join(' ');
              return (
                <span key={iso} role="gridcell" className={styles.row}>
                  <button
                    type="button"
                    data-day={iso}
                    data-outside={outside ? '' : undefined}
                    className={classes}
                    tabIndex={iso === roving ? 0 : -1}
                    aria-pressed={edge}
                    aria-label={`${full.format(date)}${iso === today ? `, ${calendarLabels.today}` : ''}`}
                    onClick={() => {
                      pick(iso);
                    }}
                    onKeyDown={(event) => {
                      onKeyDown(event, iso);
                    }}
                  >
                    {date.getDate()}
                  </button>
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
