import { useState } from 'react';
import type { ComponentPropsWithRef } from 'react';
import { DateField, type DateFieldLabels } from '../date-field/date-field';
import { TimeField } from '../time-field/time-field';
import styles from './date-time-field.module.css';

export interface DateTimeFieldLabels extends DateFieldLabels {
  /** Nome do campo de data. Padrão: `"<label>: data"`. */
  date: string;
  /** Nome do campo de hora. Padrão: `"<label>: hora (24 horas)"`. */
  time: string;
  /** Texto de exemplo do campo de hora. Padrão: `hh:mm`. */
  timePlaceholder: string;
}

export interface DateTimeFieldProps extends Omit<
  ComponentPropsWithRef<'fieldset'>,
  'onChange' | 'onBlur' | 'defaultValue' | 'disabled'
> {
  /** Título do grupo; também deriva os nomes das duas partes. */
  label: string;
  /** Data e hora no formato `YYYY-MM-DDTHH:mm`, ou `''` quando vazia. */
  value: string;
  /** Chamado com `YYYY-MM-DDTHH:mm`, ou `''` enquanto falta uma das partes. */
  onChange: (value: string) => void;
  /** Chamado quando uma das partes perde o foco. */
  onBlur?: () => void;
  /** Locale das datas. Padrão: `pt-BR`. */
  locale?: string;
  /** Textos do campo; o que faltar usa o padrão em pt-br, qualquer que seja o `locale`. */
  labels?: Partial<DateTimeFieldLabels>;
  /** Dia atual (`YYYY-MM-DD`); padrão: a data do navegador. */
  today?: string;
  /** Desabilita as duas partes. */
  disabled?: boolean;
  /** Texto de ajuda abaixo do campo. */
  help?: string;
  /** Mensagem de erro; aparece com `role="alert"` no campo de data. */
  error?: string;
}

export function DateTimeField({
  label,
  value,
  onChange,
  onBlur,
  locale = 'pt-BR',
  labels,
  today,
  disabled,
  help,
  error,
  className,
  ...rest
}: DateTimeFieldProps) {
  const dateLabel = labels?.date ?? `${label}: data`;
  const timeLabel = labels?.time ?? `${label}: hora (24 horas)`;
  const [initialDate = '', initialTime = ''] = value.split('T');
  // As partes ficam guardadas enquanto a outra falta: o valor sai vazio até as duas existirem.
  const [date, setDate] = useState(initialDate);
  const [time, setTime] = useState(initialTime);
  const combined = date && time ? `${date}T${time}` : '';

  const [previous, setPrevious] = useState(value);
  if (previous !== value) {
    setPrevious(value);
    if (value !== combined) {
      const [nextDate = '', nextTime = ''] = value.split('T');
      setDate(nextDate);
      setTime(nextTime);
    }
  }

  const emit = (nextDate: string, nextTime: string) => {
    setDate(nextDate);
    setTime(nextTime);
    onChange(nextDate && nextTime ? `${nextDate}T${nextTime}` : '');
  };
  return (
    <fieldset {...rest} className={[styles.root, className].filter(Boolean).join(' ')}>
      <legend className={styles.legend}>{label}</legend>
      <div className={styles.row}>
        <DateField
          label={dateLabel}
          hideLabel
          value={date}
          onChange={(next) => {
            emit(next, time);
          }}
          {...(onBlur ? { onBlur } : {})}
          locale={locale}
          labels={labels ?? {}}
          {...(today ? { today } : {})}
          {...(disabled !== undefined ? { disabled } : {})}
          {...(error ? { error } : {})}
        />
        <TimeField
          label={timeLabel}
          hideLabel
          value={time}
          onChange={(next) => {
            emit(date, next);
          }}
          {...(onBlur ? { onBlur } : {})}
          placeholder={labels?.timePlaceholder ?? 'hh:mm'}
          {...(disabled !== undefined ? { disabled } : {})}
        />
      </div>
      {help ? <p className={styles.help}>{help}</p> : null}
    </fieldset>
  );
}
