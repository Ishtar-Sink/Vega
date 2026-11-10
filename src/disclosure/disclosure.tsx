import { ChevronDownIcon } from '../icons/interface-icons';
import styles from './disclosure.module.css';
import type { DisclosureProps } from './disclosure.types';
import { useDisclosure } from './use-disclosure';

/** Seção recolhível sobre `<details>` e `<summary>` nativos. */
export function Disclosure({
  title,
  icon,
  open,
  defaultOpen,
  onOpenChange,
  tone = 'default',
  className,
  children,
  ...rest
}: DisclosureProps) {
  const { detailsProps, summaryProps, accordion } = useDisclosure({
    open,
    defaultOpen,
    onOpenChange,
  });
  const classes = [styles.root, tone === 'default' ? null : styles[tone], className]
    .filter(Boolean)
    .join(' ');
  return (
    <details {...rest} className={classes} name={accordion?.name} {...detailsProps}>
      <summary className={styles.summary} {...summaryProps}>
        {icon ? (
          <span aria-hidden="true" className={styles.icon}>
            {icon}
          </span>
        ) : null}
        <span className={styles.title}>{title}</span>
        <ChevronDownIcon className={styles.chevron} />
      </summary>
      <div className={styles.content}>{children}</div>
    </details>
  );
}
