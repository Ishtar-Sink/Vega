import { useEffect, useId, useImperativeHandle, useRef } from 'react';
import type { ComponentPropsWithRef, KeyboardEvent, ReactNode } from 'react';
import styles from './dialog.module.css';

export interface DialogProps extends Omit<
  ComponentPropsWithRef<'dialog'>,
  'title' | 'open' | 'onClose' | 'role' | 'children'
> {
  /** Abre o diálogo como modal (`showModal()`); ao ficar `false`, fecha e devolve o foco. */
  open: boolean;
  /** Título do diálogo, lido como nome acessível. */
  title: string;
  /** Chamado no Esc, no `cancel` nativo e no clique no fundo (se `closeOnBackdrop`). */
  onClose: () => void;
  /** Conteúdo do corpo. */
  children: ReactNode;
  /** Ações do rodapé. */
  actions: ReactNode;
  /** Papel ARIA. Padrão: `dialog`. */
  role?: 'dialog' | 'alertdialog';
  /** Largura máxima. Padrão: `default`. */
  size?: 'default' | 'wide';
  /** Chama `onClose` ao clicar no fundo. Padrão: `false`. */
  closeOnBackdrop?: boolean;
}

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

function focusables(root: ParentNode): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (element) => !element.hasAttribute('disabled'),
  );
}

/** Diálogo modal genérico: corpo, ações no rodapé, foco preso e Esc entregue ao `onClose`. */
export function Dialog({
  open,
  title,
  onClose,
  children,
  actions,
  role = 'dialog',
  size = 'default',
  closeOnBackdrop = false,
  'aria-describedby': describedBy,
  className,
  ref,
  ...rest
}: DialogProps) {
  const base = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  useImperativeHandle(ref, () => dialogRef.current as HTMLDialogElement);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !open) return;
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialog.showModal();
    const body = dialog.querySelector('[data-dialog-body]');
    const actionsBox = dialog.querySelector('[data-dialog-actions]');
    const target =
      dialog.querySelector<HTMLElement>('[data-autofocus]') ??
      (body ? focusables(body)[0] : undefined) ??
      (actionsBox ? focusables(actionsBox)[0] : undefined);
    target?.focus();
    return () => {
      dialog.close();
      trigger?.focus();
    };
  }, [open]);

  function onKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    rest.onKeyDown?.(event);
    if (event.key === 'Escape') {
      event.preventDefault();
      onClose();
      return;
    }
    if (event.key !== 'Tab') return;
    const list = focusables(event.currentTarget);
    const first = list[0];
    const last = list[list.length - 1];
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  if (!open) return null;

  const classes = [styles.root, size === 'wide' ? styles.wide : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    // O clique no próprio <dialog> é o clique no fundo; o teclado já fecha pelo Esc.
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <dialog
      {...rest}
      ref={dialogRef}
      role={role}
      aria-labelledby={`${base}-title`}
      aria-describedby={describedBy ?? (role === 'alertdialog' ? `${base}-body` : undefined)}
      className={classes}
      onKeyDown={onKeyDown}
      onCancel={(event) => {
        rest.onCancel?.(event);
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        rest.onClick?.(event);
        if (closeOnBackdrop && event.target === event.currentTarget) onClose();
      }}
    >
      <div className={styles.inner}>
        <h2 id={`${base}-title`} className={styles.title}>
          {title}
        </h2>
        <div id={`${base}-body`} className={styles.body} data-dialog-body="">
          {children}
        </div>
        <div className={styles.actions} data-dialog-actions="">
          {actions}
        </div>
      </div>
    </dialog>
  );
}
