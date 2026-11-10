import cardStyles from '../card/card.module.css';
import styles from './card-link.module.css';
import type { CardLinkProps } from './card-link.types';

export type { CardLinkProps } from './card-link.types';

export function CardLink({ tone = 'default', className, children, ...rest }: CardLinkProps) {
  const classes = [
    cardStyles.root,
    tone === 'default' ? null : cardStyles[tone],
    styles.interactive,
    className,
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <a {...rest} className={classes}>
      {children}
    </a>
  );
}
