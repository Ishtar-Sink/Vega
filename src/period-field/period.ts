/** Intervalo de datas `YYYY-MM-DD`, com as duas pontas incluídas. */
export interface PeriodRange {
  from: string;
  to: string;
}

/**
 * Regra de um período. Um inteiro `n` é uma janela de dias a partir de hoje: positivo vai de
 * hoje até hoje + n, negativo de hoje + n até hoje e zero é só hoje. Uma função recebe o dia
 * atual (`YYYY-MM-DD`) e devolve o intervalo, ou `null` para "sem limite".
 */
export type PeriodRule = number | ((today: string) => PeriodRange | null);

/** Período oferecido pelo `PeriodField`, definido por quem usa o componente. */
export interface PeriodPreset {
  /** Identificador estável; é o `preset` guardado no `PeriodValue`. */
  id: string;
  /** Texto do botão e do gatilho. */
  label: string;
  /** Como o período vira um intervalo a partir de hoje. */
  range: PeriodRule;
}

/** Valor do `PeriodField`: o `id` de um `PeriodPreset` ou `custom` com `from` e `to`. */
export interface PeriodValue {
  preset: string;
  from?: string;
  to?: string;
}

const pad = (n: number) => String(n).padStart(2, '0');

function iso(date: Date): string {
  return `${String(date.getFullYear())}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function parse(value: string): Date {
  const [y = 1970, m = 1, d = 1] = value.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function shiftDays(day: string, days: number): string {
  const date = parse(day);
  return iso(new Date(date.getFullYear(), date.getMonth(), date.getDate() + days));
}

/**
 * Intervalo de um período a partir de hoje (`YYYY-MM-DD`). Devolve `null` quando o preset não
 * está em `presets` ou quando a regra não limita o período.
 */
export function resolvePeriod(
  value: PeriodValue,
  today: string,
  presets: readonly PeriodPreset[] = [],
): PeriodRange | null {
  if (value.preset === 'custom') {
    return { from: value.from ?? today, to: value.to ?? value.from ?? today };
  }
  const rule = presets.find((preset) => preset.id === value.preset)?.range;
  if (rule === undefined) return null;
  if (typeof rule === 'function') return rule(today);
  return rule < 0
    ? { from: shiftDays(today, rule), to: today }
    : { from: today, to: shiftDays(today, rule) };
}
