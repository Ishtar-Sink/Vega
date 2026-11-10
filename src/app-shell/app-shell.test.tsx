import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { BookOpenIcon, HomeIcon, LayersIcon, TimerIcon } from '../icons/interface-icons';
import { AppShell } from './app-shell';
import type { AppShellProps } from './app-shell.types';
import type { NavItem } from './nav.types';

const css = readFileSync(join(import.meta.dirname, 'app-shell.module.css'), 'utf8');

const items: readonly NavItem[] = [
  { id: 'inicio', label: 'Início', icon: <HomeIcon />, href: '#inicio', current: true },
  { id: 'estudar', label: 'Estudar', icon: <BookOpenIcon />, href: '#estudar' },
  { id: 'revisar', label: 'Revisar', icon: <LayersIcon />, href: '#revisar', badge: '3' },
  { id: 'simulados', label: 'Simulados', icon: <TimerIcon />, href: '#simulados' },
];

// O jsdom não implementa o matchMedia: a largura vem de um falso controlado pelo teste.
let compact = false;
const listeners = new Set<() => void>();

function setCompact(value: boolean) {
  act(() => {
    compact = value;
    for (const listener of listeners) listener();
  });
}

beforeEach(() => {
  compact = false;
  listeners.clear();
  vi.stubGlobal('matchMedia', (query: string) => ({
    media: query,
    get matches() {
      return compact;
    },
    addEventListener: (_: string, listener: () => void) => listeners.add(listener),
    removeEventListener: (_: string, listener: () => void) => listeners.delete(listener),
  }));
});

afterEach(() => {
  vi.unstubAllGlobals();
});

function Shell(props: Partial<AppShellProps>) {
  return (
    <AppShell
      sidebar={{ brand: <span>Synestia</span>, items }}
      topbar={{ center: <strong>Painel</strong> }}
      {...props}
    >
      <p>Conteúdo</p>
    </AppShell>
  );
}

describe('AppShell', () => {
  it('focuses the skip link first and leads to the main', async () => {
    const user = userEvent.setup();
    render(<Shell />);
    await user.tab();
    const skip = screen.getByRole('link', { name: 'Pular para o conteúdo' });
    expect(skip).toHaveFocus();
    const main = screen.getByRole('main');
    expect(main.id).not.toBe('');
    expect(skip).toHaveAttribute('href', `#${main.id}`);
  });

  it('shows the sidebar on wide screens', () => {
    render(<Shell />);
    setCompact(false);
    const nav = screen.getByRole('navigation', { name: 'Principal' });
    expect(nav.closest('aside')).not.toHaveAttribute('inert');
    expect(screen.queryByRole('button', { name: 'Abrir menu' })).not.toBeInTheDocument();
  });

  it('opens the drawer with the menu button and returns the focus on Escape', async () => {
    const user = userEvent.setup();
    const { container } = render(<Shell mobileNav="drawer" />);
    setCompact(true);
    const button = screen.getByRole('button', { name: 'Abrir menu' });
    const aside = container.querySelector('aside');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(aside?.id).toBeTruthy();
    expect(button).toHaveAttribute('aria-controls', aside?.id);
    expect(aside).toHaveAttribute('inert');
    await user.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(aside).not.toHaveAttribute('inert');
    expect(screen.getByRole('link', { name: 'Início' })).toHaveFocus();
    await user.keyboard('{Escape}');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveFocus();
  });

  it('uses the bottom navigation on narrow screens', () => {
    const { container } = render(<Shell mobileNav="bottom" />);
    setCompact(true);
    expect(screen.getByRole('navigation', { name: 'Principal' })).toBeInTheDocument();
    expect(screen.getAllByRole('navigation')).toHaveLength(1);
    expect(container.querySelector('aside')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Abrir menu' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Revisar 3' })).toBeInTheDocument();
    setCompact(false);
    expect(container.querySelector('aside')).not.toBeNull();
    expect(screen.getAllByRole('navigation')).toHaveLength(1);
  });

  it('reserves the space of the bottom navigation', () => {
    const block = /@media \(max-width: 719\.98px\)\s*\{([\s\S]*)\}/.exec(css)?.[1] ?? '';
    expect(block).toMatch(
      /\.root\[data-mobile-nav='bottom'\] \.main\s*\{[^}]*padding-bottom:\s*calc\(calc\(var\(--space\) \* 14\) \+ env\(safe-area-inset-bottom\)\)/,
    );
  });

  it('hides the navigation and keeps the main', () => {
    render(<Shell hideNavigation />);
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Abrir menu' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Pular para o conteúdo' })).not.toBeInTheDocument();
    expect(screen.getByRole('main')).toHaveTextContent('Conteúdo');
  });

  it('renders anchors without renderLink', () => {
    render(<Shell />);
    const link = screen.getByRole('link', { name: 'Estudar' });
    expect(link.tagName.toLowerCase()).toBe('a');
    expect(link).toHaveAttribute('href', '#estudar');
  });

  it('accepts other labels', () => {
    render(<Shell mobileNav="drawer" labels={{ skipToContent: 'Skip', openMenu: 'Menu' }} />);
    setCompact(true);
    expect(screen.getByRole('link', { name: 'Skip' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Menu' })).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(<Shell />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('passes className, style and data attributes to the root', () => {
    render(<Shell className="extra" style={{ marginTop: '4px' }} data-testid="raiz" />);
    const root = screen.getByTestId('raiz');
    expect(root.tagName.toLowerCase()).toBe('div');
    expect(root).toHaveClass('extra');
    expect(root).toHaveStyle({ marginTop: '4px' });
    expect(root).toHaveAttribute('data-mobile-nav', 'drawer');
  });
});
