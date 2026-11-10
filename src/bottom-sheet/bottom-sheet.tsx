import { useId } from 'react';
import { CloseIcon } from '../icons/interface-icons';
import { IconButton } from '../icon-button/icon-button';
import { DEFAULT_LABELS } from './bottom-sheet.constants';
import styles from './bottom-sheet.module.css';
import type { BottomSheetProps } from './bottom-sheet.types';
import { useBottomSheet } from './use-bottom-sheet';

/** Folha modal sobre o `<dialog>` nativo: embaixo em telas estreitas e na lateral a partir de 720 px. */
export function BottomSheet({
  open,
  onClose,
  title,
  description,
  footer,
  placement = 'auto',
  labels,
  children,
  className,
  ref,
  ...rest
}: BottomSheetProps) {
  const base = useId();
  const { dialogRef, onKeyDown, onCancel, onClick } = useBottomSheet({ open, onClose, ref });
  if (!open) return null;

  const text = { ...DEFAULT_LABELS, ...labels };
  const classes = [styles.root, styles[placement], className].filter(Boolean).join(' ');

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <dialog
      {...rest}
      ref={dialogRef}
      aria-labelledby={`${base}-title`}
      aria-describedby={description ? `${base}-description` : undefined}
      className={classes}
      onKeyDown={(event) => {
        rest.onKeyDown?.(event);
        onKeyDown(event);
      }}
      onCancel={(event) => {
        rest.onCancel?.(event);
        onCancel(event);
      }}
      onClick={(event) => {
        rest.onClick?.(event);
        onClick(event);
      }}
    >
      <span aria-hidden="true" className={styles.handle} />
      <header className={styles.header}>
        <div>
          <h2 id={`${base}-title`} className={styles.title}>
            {title}
          </h2>
          {description ? (
            <p id={`${base}-description`} className={styles.description}>
              {description}
            </p>
          ) : null}
        </div>
        <IconButton
          aria-label={text.close}
          icon={<CloseIcon />}
          className={styles.close}
          onClick={onClose}
        />
      </header>
      <div className={styles.body} data-sheet-body="">
        {children}
      </div>
      {footer ? <footer className={styles.footer}>{footer}</footer> : null}
    </dialog>
  );
}
