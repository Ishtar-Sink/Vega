import type { ConnectionState, ConnectionStatusLabels } from './connection-status.types';

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['day', 86400],
  ['hour', 3600],
  ['minute', 60],
  ['second', 1],
];

/** Tempo relativo de `from` até `now`; futuro vira zero ("agora"). */
export function formatRelativeTime(from: number, now: number, locale: string): string {
  const seconds = Math.floor(Math.max(0, now - from) / 1000);
  const [unit, size] = UNITS.find(([, s]) => seconds >= s) ?? ['second', 1];
  const value = Math.floor(seconds / size);
  return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(-value, unit);
}

interface TextInput {
  progress?: { done: number; total: number };
  relative?: string;
}

/** `stable` vai na região viva; `full` inclui progresso ou tempo relativo. */
export function resolveStateText(
  state: ConnectionState,
  labels: ConnectionStatusLabels,
  { progress, relative }: TextInput,
): { stable: string; full: string } {
  if (state === 'syncing') {
    const shown = progress && progress.total > 0 ? progress : undefined;
    return { stable: labels.syncing(), full: labels.syncing(shown) };
  }
  if (state === 'synced') return { stable: labels.synced(), full: labels.synced(relative) };
  const text = labels[state];
  return { stable: text, full: text };
}
