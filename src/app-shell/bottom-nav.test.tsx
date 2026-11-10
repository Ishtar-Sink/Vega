import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { axe } from 'vitest-axe';
import { BookOpenIcon, HomeIcon, LayersIcon, TimerIcon } from '../icons/interface-icons';
import { BottomNav } from './bottom-nav';
import type { NavItem } from './nav.types';

const css = readFileSync(join(import.meta.dirname, 'bottom-nav.module.css'), 'utf8');

const items: readonly NavItem[] = [
  { id: 'inicio', label: 'Início', icon: <HomeIcon />, href: '#inicio', current: true },
  { id: 'estudar', label: 'Estudar', icon: <BookOpenIcon />, href: '#estudar' },
  { id: 'revisar', label: 'Revisar', icon: <LayersIcon />, href: '#revisar', badge: '3' },
  { id: 'simulados', label: 'Simulados', icon: <TimerIcon />, href: '#simulados' },
];

function many(count: number): NavItem[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `item-${String(index)}`,
    label: `Item ${String(index)}`,
    icon: <HomeIcon />,
    href: `#item-${String(index)}`,
  }));
}

describe('BottomNav', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows icon and label for every destination', () => {
    render(<BottomNav items={items} />);
    expect(screen.getByRole('navigation', { name: 'Principal' })).toBeInTheDocument();
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(4);
    for (const [index, link] of links.entries()) {
      expect(link).toHaveTextContent(items[index]?.label ?? '');
      expect(
        link.querySelector('[aria-hidden="true"] svg, svg[aria-hidden="true"]'),
      ).not.toBeNull();
    }
    expect(screen.getByRole('link', { name: 'Início' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Estudar' })).not.toHaveAttribute('aria-current');
    expect(screen.getByRole('link', { name: 'Revisar 3' })).toHaveTextContent('3');
  });

  it('warns when there are fewer than 3 or more than 5 items', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { rerender } = render(<BottomNav items={many(4)} />);
    expect(warn).not.toHaveBeenCalled();
    rerender(<BottomNav items={many(2)} />);
    expect(warn).toHaveBeenCalledTimes(1);
    rerender(<BottomNav items={many(6)} />);
    expect(warn).toHaveBeenCalledTimes(2);
  });

  it('is fixed at the bottom with the safe area and hides from 721 px', () => {
    expect(css).toMatch(/\.root\s*\{[^}]*position:\s*fixed/);
    expect(css).toMatch(/\.root\s*\{[^}]*min-height:\s*calc\(var\(--space\) \* 14\)/);
    expect(css).toMatch(/\.root\s*\{[^}]*padding-bottom:\s*env\(safe-area-inset-bottom\)/);
    expect(css).toMatch(/\.link\s*\{[^}]*min-height:\s*calc\(var\(--space\) \* 11\)/);
    expect(css).toMatch(/@media \(min-width: 721px\)\s*\{\s*\.root\s*\{\s*display:\s*none;/);
  });

  it('accepts another navigation label', () => {
    render(<BottomNav items={items} labels={{ navigation: 'Main' }} />);
    expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(<BottomNav items={items} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('passes className, style and data attributes to the root', () => {
    render(
      <BottomNav items={items} className="extra" style={{ marginTop: '4px' }} data-testid="raiz" />,
    );
    const root = screen.getByTestId('raiz');
    expect(root.tagName.toLowerCase()).toBe('nav');
    expect(root).toHaveClass('extra');
    expect(root).toHaveStyle({ marginTop: '4px' });
  });

  it('forwards the ref to the root', () => {
    const ref = createRef<HTMLElement>();
    render(<BottomNav ref={ref} items={items} />);
    expect(ref.current?.tagName.toLowerCase()).toBe('nav');
  });
});
