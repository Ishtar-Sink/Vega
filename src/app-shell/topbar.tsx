import styles from './topbar.module.css';
import type { TopbarProps } from './topbar.types';

/** Barra superior com os slots de início, meio e fim. */
export function Topbar({ start, center, end, className, ...rest }: TopbarProps) {
  const classes = [styles.root, className].filter(Boolean).join(' ');
  return (
    <header {...rest} className={classes}>
      <div className={styles.start}>{start}</div>
      <div className={styles.center}>{center}</div>
      <div className={styles.end}>{end}</div>
    </header>
  );
}
