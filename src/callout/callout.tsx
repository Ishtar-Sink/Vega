import { useId } from 'react';
import { TONE_ICONS } from './callout.constants';
import styles from './callout.module.css';
import type { CalloutProps } from './callout.types';

/** Aviso fixo na página, com tom, ícone, ação e região viva opcional. */
export function Callout({
  tone = 'neutral',
  title,
  icon,
  action,
  live = 'off',
  className,
  role,
  children,
  ...rest
}: CalloutProps) {
  const titleId = useId();
  const ToneIcon = TONE_ICONS[tone];
  const classes = [styles.root, styles[tone], className].filter(Boolean).join(' ');

  return (
    <aside
      {...rest}
      role={live === 'polite' ? 'status' : role}
      aria-labelledby={title ? titleId : undefined}
      className={classes}
    >
      {icon === false ? null : icon !== undefined ? (
        <span aria-hidden="true" className={styles.icon}>
          {icon}
        </span>
      ) : (
        <ToneIcon className={styles.icon} />
      )}
      <div className={styles.body}>
        {title ? (
          <p id={titleId} className={styles.title}>
            {title}
          </p>
        ) : null}
        {children}
      </div>
      {action ? <div className={styles.action}>{action}</div> : null}
    </aside>
  );
}
