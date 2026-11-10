import { DEFAULT_LABELS, STATE_CONFIG } from './connection-status.constants';
import styles from './connection-status.module.css';
import type { ConnectionStatusProps } from './connection-status.types';
import { formatRelativeTime, resolveStateText } from './connection-status.utils';

function joinClasses(...names: (string | undefined)[]) {
  return names.filter(Boolean).join(' ');
}

/** Selo do estado da conexão e da sincronização, com região viva só para a troca de estado. */
export function ConnectionStatus({
  state,
  progress,
  pending,
  lastSyncedAt,
  now = Date.now,
  variant = 'chip',
  action,
  locale = 'pt-BR',
  labels: labelsProp,
  className,
  ...rest
}: ConnectionStatusProps) {
  if (state === 'online' && variant === 'chip') return null;

  const labels = { ...DEFAULT_LABELS, ...labelsProp };
  const relative =
    state === 'synced' && lastSyncedAt !== undefined
      ? formatRelativeTime(lastSyncedAt, now(), locale)
      : undefined;
  const { stable, full } = resolveStateText(state, labels, { progress, relative });
  const Icon = state === 'online' ? null : STATE_CONFIG[state].icon;
  const classes = joinClasses(
    styles.root,
    styles[variant],
    styles[state],
    action ? styles.hasAction : undefined,
    className,
  );
  const queue =
    pending !== undefined && pending > 0 ? (
      <span className={styles.meta}>{labels.pending(pending)}</span>
    ) : null;

  if (action) {
    // A região viva fica fora do botão: anuncia só a troca de estado, e o botão é lido pelo conteúdo.
    return (
      <div {...rest} className={classes}>
        <span role="status" className={styles.srOnly}>
          {stable}
        </span>
        <button type="button" className={styles.button} onClick={action.onAction}>
          {Icon ? <Icon size={16} className={styles.icon} /> : null}
          <span className={styles.text}>{full}</span>
          {queue}
          <span className={styles.actionGroup}>
            <span aria-hidden="true">·</span>
            <span className={styles.actionText}>{action.label}</span>
          </span>
        </button>
      </div>
    );
  }

  return (
    <div {...rest} className={classes}>
      <span role="status" className={styles.status}>
        {Icon ? <Icon size={16} className={styles.icon} /> : null}
        <span className={full === stable ? styles.text : styles.srOnly}>{stable}</span>
      </span>
      {full !== stable ? <span className={styles.text}>{full}</span> : null}
      {queue}
    </div>
  );
}
