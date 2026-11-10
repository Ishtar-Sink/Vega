import { useId, useImperativeHandle, useMemo, useRef } from 'react';
import { AccordionContext } from './accordion-context';
import type { AccordionProps } from './disclosure.types';

/** Agrupa `Disclosure`: no `single`, abrir um fecha os outros do grupo. */
export function Accordion({ type = 'multiple', ref, ...rest }: AccordionProps) {
  const name = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => rootRef.current as HTMLDivElement);

  const value = useMemo(
    () => ({
      name,
      // Fallback do atributo `name`, que o jsdom e navegadores antigos não implementam.
      onOpen(details: HTMLDetailsElement) {
        const group = rootRef.current?.querySelectorAll<HTMLDetailsElement>('details[open]');
        group?.forEach((other) => {
          if (other !== details && other.getAttribute('name') === name) other.open = false;
        });
      },
    }),
    [name],
  );

  const root = <div {...rest} ref={rootRef} />;
  if (type === 'multiple') return root;
  return <AccordionContext.Provider value={value}>{root}</AccordionContext.Provider>;
}
