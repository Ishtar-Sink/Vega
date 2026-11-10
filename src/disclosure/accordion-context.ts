import { createContext } from 'react';

export interface AccordionContextValue {
  name: string;
  onOpen: (details: HTMLDetailsElement) => void;
}

// Só o Accordion `single` fornece o contexto; fora dele (ou no `multiple`) o valor é null.
export const AccordionContext = createContext<AccordionContextValue | null>(null);
