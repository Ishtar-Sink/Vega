import { useEffect } from 'react';
import type { KeyboardEvent, RefObject } from 'react';
import { FOCUSABLE } from './app-shell.constants';

function focusables(root: HTMLElement | null): HTMLElement[] {
  return root ? Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)) : [];
}

/**
 * Prende o foco dentro de `ref` enquanto `active`: foca o primeiro item ao ativar, faz o Tab dar a
 * volta e entrega o Escape a `onEscape`. Devolve o `onKeyDown` a ligar no elemento.
 */
export function useFocusTrap(
  ref: RefObject<HTMLElement | null>,
  active: boolean,
  onEscape?: () => void,
) {
  useEffect(() => {
    if (active) focusables(ref.current)[0]?.focus();
  }, [active, ref]);

  return function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!active) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      onEscape?.();
      return;
    }
    if (event.key !== 'Tab') return;
    const list = focusables(ref.current);
    const first = list[0];
    const last = list[list.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  };
}
