import { useEffect, useImperativeHandle, useRef } from 'react';
import type { KeyboardEvent, MouseEvent, Ref, SyntheticEvent } from 'react';
import { FOCUSABLE } from './bottom-sheet.constants';

interface UseBottomSheetArgs {
  open: boolean;
  onClose: () => void;
  ref?: Ref<HTMLDialogElement>;
}

function focusables(root: ParentNode): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (element) => !element.hasAttribute('disabled'),
  );
}

/** Abre o `<dialog>` como modal, prende o Tab e devolve o foco a quem abriu. */
export function useBottomSheet({ open, onClose, ref }: UseBottomSheetArgs) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useImperativeHandle(ref, () => dialogRef.current as HTMLDialogElement);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !open) return;
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialog.showModal();
    const body = dialog.querySelector('[data-sheet-body]');
    const target = (body ? focusables(body)[0] : undefined) ?? focusables(dialog)[0];
    target?.focus();
    return () => {
      dialog.close();
      trigger?.focus();
    };
  }, [open]);

  function onKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
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

  function onCancel(event: SyntheticEvent<HTMLDialogElement>) {
    event.preventDefault();
    onClose();
  }

  // O clique no próprio <dialog> é o clique no fundo.
  function onClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) onClose();
  }

  return { dialogRef, onKeyDown, onCancel, onClick };
}
