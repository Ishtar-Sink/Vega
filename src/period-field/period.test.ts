import { resolvePeriod, type PeriodPreset } from './period';

const pad = (n: number) => String(n).padStart(2, '0');
const iso = (date: Date) =>
  `${String(date.getFullYear())}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
const parts = (today: string) => today.split('-').map(Number) as [number, number, number];

const presets: PeriodPreset[] = [
  {
    id: 'this_month',
    label: 'Este mês',
    range: (today) => {
      const [y, m] = parts(today);
      return { from: iso(new Date(y, m - 1, 1)), to: iso(new Date(y, m, 0)) };
    },
  },
  {
    id: 'last_month',
    label: 'Mês passado',
    range: (today) => {
      const [y, m] = parts(today);
      return { from: iso(new Date(y, m - 2, 1)), to: iso(new Date(y, m - 1, 0)) };
    },
  },
  {
    id: 'next_month',
    label: 'Mês que vem',
    range: (today) => {
      const [y, m] = parts(today);
      return { from: iso(new Date(y, m, 1)), to: iso(new Date(y, m + 1, 0)) };
    },
  },
  { id: 'last_30_days', label: 'Últimos 30 dias', range: -30 },
  { id: 'next_30_days', label: 'Próximos 30 dias', range: 30 },
  { id: 'only_today', label: 'Hoje', range: 0 },
  { id: 'all', label: 'Qualquer período', range: () => null },
];

const today = '2026-10-30';

describe('resolvePeriod', () => {
  it('resolves a positive integer as the next n days', () => {
    expect(resolvePeriod({ preset: 'next_30_days' }, today, presets)).toEqual({
      from: '2026-10-30',
      to: '2026-11-29',
    });
  });

  it('resolves a negative integer as the last n days', () => {
    expect(resolvePeriod({ preset: 'last_30_days' }, today, presets)).toEqual({
      from: '2026-09-30',
      to: '2026-10-30',
    });
  });

  it('resolves zero as today only', () => {
    expect(resolvePeriod({ preset: 'only_today' }, today, presets)).toEqual({
      from: '2026-10-30',
      to: '2026-10-30',
    });
  });

  it('calls the function with today', () => {
    expect(resolvePeriod({ preset: 'last_month' }, today, presets)).toEqual({
      from: '2026-09-01',
      to: '2026-09-30',
    });
    expect(resolvePeriod({ preset: 'next_month' }, today, presets)).toEqual({
      from: '2026-11-01',
      to: '2026-11-30',
    });
  });

  it('returns null when the function returns null', () => {
    expect(resolvePeriod({ preset: 'all' }, today, presets)).toBeNull();
  });

  it('keeps from and to for custom', () => {
    expect(
      resolvePeriod({ preset: 'custom', from: '2026-10-05', to: '2026-10-20' }, today, presets),
    ).toEqual({ from: '2026-10-05', to: '2026-10-20' });
  });

  it('returns null for an unknown preset', () => {
    expect(resolvePeriod({ preset: 'nope' }, today, presets)).toBeNull();
    expect(resolvePeriod({ preset: 'this_month' }, today)).toBeNull();
  });

  it('crosses the year boundary', () => {
    expect(resolvePeriod({ preset: 'next_30_days' }, '2026-12-20', presets)).toEqual({
      from: '2026-12-20',
      to: '2027-01-19',
    });
  });
});
