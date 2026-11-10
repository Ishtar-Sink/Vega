import { useContext, useState } from 'react';
import type { KeyboardEvent, MouseEvent, SyntheticEvent } from 'react';
import { AccordionContext } from './accordion-context';

interface Options {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/** Estado controlado ou não do `<details>`, teclado do resumo e aviso ao `Accordion`. */
export function useDisclosure({ open, defaultOpen = false, onOpenChange }: Options) {
  const accordion = useContext(AccordionContext);
  // Só a primeira renderização define `open`; depois o navegador é dono do atributo.
  const [initialOpen] = useState(defaultOpen);

  function toggle(details: HTMLDetailsElement) {
    if (open !== undefined) onOpenChange?.(!open);
    else details.open = !details.open;
  }

  function onClick(event: MouseEvent<HTMLElement>) {
    if (open === undefined) return;
    event.preventDefault();
    onOpenChange?.(!open);
  }

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    const details = event.currentTarget.parentElement;
    if (details instanceof HTMLDetailsElement) toggle(details);
  }

  function onToggle(event: SyntheticEvent<HTMLDetailsElement>) {
    const details = event.currentTarget;
    onOpenChange?.(details.open);
    if (details.open) accordion?.onOpen(details);
  }

  const detailsProps = open === undefined ? { open: initialOpen || undefined, onToggle } : { open };
  return { detailsProps, summaryProps: { onClick, onKeyDown }, accordion };
}
