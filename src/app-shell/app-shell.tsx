import { useCallback, useId, useRef, useState } from 'react';
import { IconButton } from '../icon-button/icon-button';
import { MenuIcon } from '../icons/interface-icons';
import { COMPACT_QUERY, DEFAULT_APP_SHELL_LABELS } from './app-shell.constants';
import styles from './app-shell.module.css';
import type { AppShellProps } from './app-shell.types';
import { BottomNav } from './bottom-nav';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';
import { useMediaQuery } from './use-media-query';

/**
 * Estrutura da aplicação: link de pular, `Sidebar`, `Topbar` e `<main>`. Abaixo de 720 px, a
 * navegação vira gaveta com botão de menu ou `BottomNav`, conforme `mobileNav`.
 */
export function AppShell({
  sidebar,
  topbar,
  mobileNav = 'drawer',
  hideNavigation = false,
  children,
  labels,
  className,
  ...rest
}: AppShellProps) {
  const text = { ...DEFAULT_APP_SHELL_LABELS, ...labels };
  const sidebarId = useId();
  const mainId = useId();
  const menuButton = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const compact = useMediaQuery(COMPACT_QUERY);
  const showNavigation = !hideNavigation;
  const drawerMode = showNavigation && compact && mobileNav === 'drawer';
  const bottomMode = showNavigation && compact && mobileNav === 'bottom';
  const drawerOpen = drawerMode && open;

  const close = useCallback(() => {
    setOpen(false);
    menuButton.current?.focus();
  }, []);

  // Ao sair do modo compacto, a gaveta fecha; o ajuste no render evita um efeito em cascata.
  const [wasCompact, setWasCompact] = useState(compact);
  if (compact !== wasCompact) {
    setWasCompact(compact);
    if (!compact) setOpen(false);
  }

  const menu = drawerMode ? (
    <IconButton
      ref={menuButton}
      icon={<MenuIcon />}
      aria-label={text.openMenu}
      aria-expanded={drawerOpen}
      aria-controls={sidebarId}
      onClick={() => {
        setOpen(true);
      }}
    />
  ) : null;

  const classes = [styles.root, className].filter(Boolean).join(' ');
  return (
    <div {...rest} className={classes} data-mobile-nav={mobileNav}>
      {showNavigation ? (
        <a href={`#${mainId}`} className={styles.skipLink}>
          {text.skipToContent}
        </a>
      ) : null}
      {showNavigation && !bottomMode ? (
        <Sidebar
          {...sidebar}
          id={sidebarId}
          drawer={drawerMode}
          open={drawerOpen}
          onClose={close}
        />
      ) : null}
      {drawerOpen ? (
        // O fundo fecha a gaveta pelo mouse; pelo teclado, o Escape já fecha.
        <div className={styles.scrim} aria-hidden="true" onClick={close} />
      ) : null}
      <div className={styles.column}>
        {topbar || drawerMode ? (
          <Topbar
            {...topbar}
            start={
              <>
                {menu}
                {topbar?.start}
              </>
            }
          />
        ) : null}
        <main id={mainId} tabIndex={-1} className={styles.main}>
          {children}
        </main>
      </div>
      {bottomMode ? (
        <BottomNav items={sidebar.items} renderLink={sidebar.renderLink} labels={sidebar.labels} />
      ) : null}
    </div>
  );
}
