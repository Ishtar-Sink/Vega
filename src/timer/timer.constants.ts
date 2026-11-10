import type { TimerLabels } from './timer.types';
import { describeDuration } from './timer.utils';

/** Minutos restantes em que a pílula passa ao tom de aviso sem `warnAt`. */
export const DEFAULT_WARNING_MINUTES = 5;

export const DEFAULT_TIMER_LABELS: TimerLabels = {
  hide: 'Esconder o tempo',
  show: 'Mostrar o tempo',
  hidden: 'tempo',
  remaining: (parts) => 'Tempo restante: ' + describeDuration(parts),
  elapsed: (parts) => 'Tempo decorrido: ' + describeDuration(parts),
  warning: (minutes) =>
    minutes === 1 ? 'Falta 1 minuto.' : 'Faltam ' + String(minutes) + ' minutos.',
  expired: 'O tempo acabou.',
};
