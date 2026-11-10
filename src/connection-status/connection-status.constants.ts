import {
  CircleAlertIcon,
  CloudCheckIcon,
  RefreshIcon,
  WifiOffIcon,
} from '../icons/interface-icons';
import type { ConnectionState, ConnectionStatusLabels } from './connection-status.types';

export const DEFAULT_LABELS: ConnectionStatusLabels = {
  online: 'Online',
  offline: 'Offline',
  error: 'Falha ao sincronizar',
  syncing: (progress) =>
    progress
      ? `Sincronizando ${String(progress.done)} de ${String(progress.total)}`
      : 'Sincronizando',
  synced: (relative) => (relative ? `Tudo sincronizado · ${relative}` : 'Tudo sincronizado'),
  pending: (count) => `${String(count)} na fila`,
};

/** Ícone e tom de cada estado com sinal; `online` não tem ícone. */
export const STATE_CONFIG: Record<
  Exclude<ConnectionState, 'online'>,
  { icon: typeof WifiOffIcon; tone: 'warning' | 'info' | 'success' | 'danger' }
> = {
  offline: { icon: WifiOffIcon, tone: 'warning' },
  syncing: { icon: RefreshIcon, tone: 'info' },
  synced: { icon: CloudCheckIcon, tone: 'success' },
  error: { icon: CircleAlertIcon, tone: 'danger' },
};
