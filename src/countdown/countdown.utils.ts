const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const DAY_MS = 86_400_000;

/** Converte `AAAA-MM-DD` em ms UTC; `null` se o formato ou a data forem inválidos. */
export function parseIsoDate(iso: string): number | null {
  const match = ISO_DATE.exec(iso);
  if (!match) return null;
  const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])];
  const ms = Date.UTC(year, month - 1, day);
  const date = new Date(ms);
  const same =
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
  return same ? ms : null;
}

/**
 * Diferença em dias de calendário entre duas datas `AAAA-MM-DD`: positiva se `toIso` é depois de
 * `fromIso`. `NaN` se alguma data for inválida.
 */
export function daysBetween(fromIso: string, toIso: string): number {
  const from = parseIsoDate(fromIso);
  const to = parseIsoDate(toIso);
  if (from === null || to === null) return Number.NaN;
  // As contas em UTC tornam a diferença imune ao horário de verão; o fuso fica com o produto.
  return Math.round((to - from) / DAY_MS);
}
