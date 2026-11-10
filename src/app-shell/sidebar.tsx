import { useImperativeHandle, useRef } from 'react';
import type { KeyboardEvent, MouseEvent } from 'react';
import { DEFAULT_NAV_LABELS } from './app-shell.constants';
import { NavLink } from './nav-link';
import styles from './sidebar.module.css';
import type { SidebarProps } from './sidebar.types';
import { useFocusTrap } from './use-focus-trap';

/** Barra lateral com a marca, a navegação principal e o rodapé; vira gaveta com `drawer`. */
export function Sidebar({
  brand,
  items,
  renderLink,
  footer,
  drawer = false,
  open = false,
  onClose,
  labels,
  className,
  onKeyDown,
  ref,
  ...rest
}: SidebarProps) {
  const text = { ...DEFAULT_NAV_LABELS, ...labels };
  const asideRef = useRef<HTMLElement>(null);
  useImperativeHandle(ref, () => asideRef.current as HTMLElement);
  const drawerOpen = drawer && open;
  const trapKeyDown = useFocusTrap(asideRef, drawerOpen, onClose);

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    onKeyDown?.(event);
    trapKeyDown(event);
  }

  function handleNavClick(event: MouseEvent<HTMLElement>) {
    if (!drawerOpen) return;
    if (event.target instanceof Element && event.target.closest('a')) onClose?.();
  }

  const classes = [
    styles.root,
    drawer ? styles.drawer : '',
    drawerOpen ? styles.drawerOpen : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    // O onKeyDown só prende o foco e fecha a gaveta; o aside não vira controle.
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <aside
      {...rest}
      ref={asideRef}
      className={classes}
      inert={drawer && !open}
      onKeyDown={handleKeyDown}
    >
      <div className={styles.brand}>{brand}</div>
      {/* Escolher um link fecha a gaveta; pelo teclado, o Escape já fecha. */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */}
      <nav aria-label={text.navigation} className={styles.nav} onClick={handleNavClick}>
        <ul className={styles.list}>
          {items.map((item) => (
            <li key={item.id}>
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
      {footer === undefined ? null : <div className={styles.footer}>{footer}</div>}
    </aside>
  );
}
