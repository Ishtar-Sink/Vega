import type { ComponentPropsWithRef } from 'react';

/** Estado da conexão e da sincronização. */
export type ConnectionState = 'online' | 'offline' | 'syncing' | 'synced' | 'error';

/** Textos do `ConnectionStatus`, todos sobrescrevíveis. */
export interface ConnectionStatusLabels {
  /** Padrão: "Online" (só na variante `detail`). */
  online: string;
  /** Padrão: "Offline". */
  offline: string;
  /** Padrão: "Sincronizando {done} de {total}" / "Sincronizando". */
  syncing: (progress?: { done: number; total: number }) => string;
  /** Padrão: "Tudo sincronizado · {relative}" / "Tudo sincronizado". */
  synced: (relative?: string) => string;
  /** Padrão: "Falha ao sincronizar". */
  error: string;
  /** Padrão: "{count} na fila". */
  pending: (count: number) => string;
}

/** Ação configurada pelo produto; com ela, a caixa inteira vira um botão. */
export interface ConnectionStatusAction {
  /** Texto visível no fim da caixa, como "Tentar de novo". */
  label: string;
  onAction: () => void;
}

export interface ConnectionStatusProps extends Omit<ComponentPropsWithRef<'div'>, 'children'> {
  /** Estado a mostrar; `online` não renderiza nada na variante `chip`. */
  state: ConnectionState;
  /** Progresso da sincronização, usado no estado `syncing`. */
  progress?: { done: number; total: number };
  /** Itens na fila; aparece quando maior que zero. */
  pending?: number;
  /** Última sincronização, em ms desde a época; usada no estado `synced`. */
  lastSyncedAt?: number;
  /** Relógio injetável. Padrão: `Date.now`. */
  now?: () => number;
  /** Padrão: `chip`. */
  variant?: 'chip' | 'detail';
  /** Ação discreta: a caixa inteira vira um botão, com o `label` no fim do texto. */
  action?: ConnectionStatusAction;
  /** Locale do tempo relativo. Padrão: `pt-BR`. */
  locale?: string;
  /** Textos sobrescrevíveis. */
  labels?: Partial<ConnectionStatusLabels>;
}
