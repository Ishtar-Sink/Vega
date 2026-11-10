import { useEffect } from 'react';
import { DEFAULT_NAV_LABELS } from './app-shell.constants';
import styles from './bottom-nav.module.css';
import type { BottomNavProps } from './bottom-nav.types';
import { NavLink } from './nav-link';

const MIN_ITEMS = 3;
const MAX_ITEMS = 5;

// O aviso fica para o bundler de quem usa: `import.meta.env.DEV` sumiria no build da biblioteca.
function isDevelopment(): boolean {
  return typeof process === 'undefined' || process.env.NODE_ENV !== 'production';
}

/** Barra inferior fixa com 3 a 5 destinos, sempre com ícone e rótulo. */
export function BottomNav({ items, renderLink, labels, className, ...rest }: BottomNavProps) {
  const text = { ...DEFAULT_NAV_LABELS, ...labels };
  const count = items.length;

  useEffect(() => {
    if (!isDevelopment() || (count >= MIN_ITEMS && count <= MAX_ITEMS)) return;
    console.warn(`BottomNav: use de 3 a 5 destinos; recebeu ${String(count)}.`);
  }, [count]);

  const classes = [styles.root, className].filter(Boolean).join(' ');
  return (
    <nav {...rest} aria-label={text.navigation} className={classes}>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.id} className={styles.item}>
            <NavLink
              item={item}
              className={styles.link}
              iconClassName={styles.icon}
              badgeClassName={styles.badge}
              renderLink={renderLink}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}
