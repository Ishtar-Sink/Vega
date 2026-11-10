import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { axe } from 'vitest-axe';
import { BookOpenIcon, HomeIcon, LayersIcon, TimerIcon } from '../icons/interface-icons';
import type { NavItem, RenderNavLink } from './nav.types';
import { Sidebar } from './sidebar';

const items: readonly NavItem[] = [
  { id: 'inicio', label: 'Início', icon: <HomeIcon />, href: '#inicio', current: true },
  { id: 'estudar', label: 'Estudar', icon: <BookOpenIcon />, href: '#estudar' },
  { id: 'revisar', label: 'Revisar', icon: <LayersIcon />, href: '#revisar', badge: '3' },
  { id: 'simulados', label: 'Simulados', icon: <TimerIcon />, href: '#simulados' },
];

describe('Sidebar', () => {
  it('shows the brand, the Principal navigation and the footer', () => {
    render(<Sidebar brand={<span>Synestia</span>} items={items} footer={<span>Rodapé</span>} />);
    const nav = screen.getByRole('navigation', { name: 'Principal' });
    expect(nav).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Início' })).toHaveAttribute('aria-current', 'page');
    for (const label of ['Estudar', 'Revisar 3', 'Simulados']) {
      expect(screen.getByRole('link', { name: label })).not.toHaveAttribute('aria-current');
    }
    expect(screen.getByText('Synestia')).toBeInTheDocument();
    expect(screen.getByText('Rodapé')).toBeInTheDocument();
  });

  it('accepts another navigation label', () => {
    render(<Sidebar brand="Synestia" items={items} labels={{ navigation: 'Main' }} />);
    expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument();
  });

  it('traps the focus in the open drawer and closes with Escape', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Sidebar brand="Synestia" items={items} drawer open onClose={onClose} />);
    const first = screen.getByRole('link', { name: 'Início' });
    expect(first).toHaveFocus();
    screen.getByRole('link', { name: 'Simulados' }).focus();
    await user.tab();
    expect(first).toHaveFocus();
    await user.tab({ shift: true });
    expect(screen.getByRole('link', { name: 'Simulados' })).toHaveFocus();
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('is inert while the drawer is closed', () => {
    const { container } = render(
      <Sidebar brand="Synestia" items={items} drawer open={false} onClose={vi.fn()} />,
    );
    expect(container.querySelector('aside')).toHaveAttribute('inert');
  });

  it('closes the drawer when a link is chosen', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Sidebar brand="Synestia" items={items} drawer open onClose={onClose} />);
    await user.click(screen.getByRole('link', { name: 'Estudar' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders links with renderLink and falls back to anchors', () => {
    const renderLink = vi.fn<RenderNavLink>((item, props) => (
      <a
        href={item.href}
        data-router=""
        className={props.className}
        aria-current={props['aria-current']}
      >
        {props.children}
      </a>
    ));
    const { unmount } = render(<Sidebar brand="Synestia" items={items} renderLink={renderLink} />);
    expect(renderLink).toHaveBeenCalledTimes(items.length);
    const current = screen.getByRole('link', { name: 'Início' });
    expect(current).toHaveAttribute('data-router');
    expect(current).toHaveAttribute('aria-current', 'page');
    expect(current.className).not.toBe('');
    expect(renderLink.mock.calls[1]?.[1]['aria-current']).toBeUndefined();
    unmount();
    render(<Sidebar brand="Synestia" items={items} />);
    const links = screen.getAllByRole('link');
    expect(links.map((link) => link.getAttribute('href'))).toEqual(items.map((item) => item.href));
    for (const link of links) expect(link.tagName.toLowerCase()).toBe('a');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <Sidebar brand="Synestia" items={items} footer={<button type="button">Ajustes</button>} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('passes className, style and data attributes to the root', () => {
    render(
      <Sidebar
        brand="Synestia"
        items={items}
        className="extra"
        style={{ marginTop: '4px' }}
        data-testid="raiz"
      />,
    );
    const root = screen.getByTestId('raiz');
    expect(root.tagName.toLowerCase()).toBe('aside');
    expect(root).toHaveClass('extra');
    expect(root).toHaveStyle({ marginTop: '4px' });
  });

  it('forwards the ref to the root', () => {
    const ref = createRef<HTMLElement>();
    render(<Sidebar ref={ref} brand="Synestia" items={items} />);
    expect(ref.current?.tagName.toLowerCase()).toBe('aside');
  });
});
