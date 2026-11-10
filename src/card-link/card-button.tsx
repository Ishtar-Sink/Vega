import cardStyles from '../card/card.module.css';
import styles from './card-link.module.css';
import type { CardButtonProps } from './card-link.types';

export type { CardButtonProps } from './card-link.types';

export function CardButton({
  tone = 'default',
  type = 'button',
  className,
  ...rest
}: CardButtonProps) {
  const classes = [
    cardStyles.root,
    tone === 'default' ? null : cardStyles[tone],
    styles.interactive,
    styles.button,
    className,
  ]
    .filter(Boolean)
    .join(' ');
  return <button {...rest} type={type} className={classes} />;
}
