import { IconButton } from '../icon-button/icon-button';
import { CloseIcon } from '../icons/interface-icons';
import { ProgressBar } from '../progress-bar/progress-bar';
import { DEFAULT_FOCUS_HEADER_LABELS } from './focus-header.constants';
import type { FocusHeaderProps } from './focus-header.types';
import styles from './focus-header.module.css';

export type { FocusHeaderProps, FocusHeaderLabels } from './focus-header.types';

export function FocusHeader({
  title,
  onExit,
  position,
  progress,
  labels,
  className,
  ...rest
}: FocusHeaderProps) {
  const texts = { ...DEFAULT_FOCUS_HEADER_LABELS, ...labels };
  const classes = [styles.root, className].filter(Boolean).join(' ');
  return (
    <header {...rest} className={classes}>
      <div className={styles.row}>
        <IconButton
          className={styles.exit}
          aria-label={texts.exit}
          icon={<CloseIcon />}
          onClick={onExit}
        />
        <h1 className={styles.title}>{title}</h1>
        {position ? <span className={styles.position}>{position}</span> : null}
      </div>
      {progress ? (
        <ProgressBar label={progress.label} value={progress.value} max={progress.max} />
      ) : null}
    </header>
  );
}
