import type { CountdownLabels } from './countdown.types';

export const DEFAULT_COUNTDOWN_LOCALE = 'pt-BR';

export const DEFAULT_COUNTDOWN_LABELS: CountdownLabels = {
  remaining: (days, formatted) =>
    days === 1 ? `Falta ${formatted} dia` : `Faltam ${formatted} dias`,
  today: 'É hoje',
  past: 'Já passou',
};
