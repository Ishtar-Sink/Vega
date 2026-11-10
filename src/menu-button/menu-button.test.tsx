import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { MenuButton } from './menu-button';

function Harness() {
  return (
    <MenuButton
      label="Mais ações"
      trigger="Mais"
      items={[
        { id: 'dup', label: 'Duplicar', onSelect: vi.fn() },
        { id: 'del', label: 'Excluir', tone: 'danger', onSelect: vi.fn() },
      ]}
    />
  );
}

describe('MenuButton', () => {
  it('aligns the menu to the trigger start when it would leave the window', async () => {
    const spy = vi
      .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockImplementation(function (this: HTMLElement) {
        const left =
          this.getAttribute('role') === 'menu' && !this.className.includes('alignStart') ? -60 : 8;
        return {
          left,
          right: left + 176,
          top: 0,
          bottom: 0,
          width: 176,
          height: 0,
          x: left,
          y: 0,
          toJSON: () => ({}),
        };
      });
    try {
      render(<Harness />);
      await userEvent.click(screen.getByRole('button', { name: 'Mais ações' }));
      expect(screen.getByRole('menu').className).toContain('alignStart');
    } finally {
      spy.mockRestore();
    }
  });

  it('keeps the end alignment when the menu fits', async () => {
    render(<Harness />);
    await userEvent.click(screen.getByRole('button', { name: 'Mais ações' }));
    expect(screen.getByRole('menu').className).not.toContain('alignStart');
  });

  it('opens the menu and focuses the first item', async () => {
    render(<Harness />);
    const trigger = screen.getByRole('button', { name: 'Mais ações' });
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('menuitem', { name: 'Duplicar' })).toHaveFocus();
  });

  it('moves with the arrow keys and closes on Escape returning focus', async () => {
    render(<Harness />);
    const trigger = screen.getByRole('button', { name: 'Mais ações' });
    await userEvent.click(trigger);
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'Excluir' })).toHaveFocus();
    await userEvent.keyboard('{Home}');
    expect(screen.getByRole('menuitem', { name: 'Duplicar' })).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('renders danger items with the danger tone', async () => {
    render(<Harness />);
    await userEvent.click(screen.getByRole('button', { name: 'Mais ações' }));
    const item = screen.getByRole('menuitem', { name: 'Excluir' });
    expect(item).toHaveAttribute('data-tone', 'danger');
    expect(item.className).toMatch(/danger/);
  });

  it('has no axe violations', async () => {
    const { container } = render(<Harness />);
    await userEvent.click(screen.getByRole('button', { name: 'Mais ações' }));
    expect(await axe(container)).toHaveNoViolations();
  });

  it('names the button by its content and the menu by menuLabel when label is omitted', async () => {
    render(
      <MenuButton
        menuLabel="Conta"
        trigger="Ana Souza"
        items={[{ id: 'a', label: 'Sair', onSelect: vi.fn() }]}
      />,
    );
    const trigger = screen.getByRole('button', { name: 'Ana Souza' });
    expect(trigger).not.toHaveAttribute('aria-label');
    await userEvent.click(trigger);
    expect(screen.getByRole('menu', { name: 'Conta' })).toBeInTheDocument();
  });

  it('adds menuClassName to the open menu only, leaving the default classes', async () => {
    render(
      <MenuButton
        label="Conta"
        trigger="Ana"
        menuClassName="extra-menu"
        items={[{ id: 'a', label: 'Sair', onSelect: vi.fn() }]}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Conta' }));
    const menu = screen.getByRole('menu');
    expect(menu).toHaveClass('extra-menu');
    expect(menu.className).toMatch(/menu/);
    expect(screen.getByRole('button', { name: 'Conta' })).not.toHaveClass('extra-menu');
  });

  it('wraps with ArrowUp and goes to the last item with End', async () => {
    render(<Harness />);
    await userEvent.click(screen.getByRole('button', { name: 'Mais ações' }));
    await userEvent.keyboard('{ArrowUp}');
    expect(screen.getByRole('menuitem', { name: 'Excluir' })).toHaveFocus();
    await userEvent.keyboard('{Home}');
    expect(screen.getByRole('menuitem', { name: 'Duplicar' })).toHaveFocus();
    await userEvent.keyboard('{End}');
    expect(screen.getByRole('menuitem', { name: 'Excluir' })).toHaveFocus();
  });

  it('selects an item with Enter, calls onSelect and returns focus to the trigger', async () => {
    const onSelect = vi.fn();
    render(
      <MenuButton
        label="Mais ações"
        trigger="Mais"
        items={[
          { id: 'dup', label: 'Duplicar', onSelect },
          { id: 'del', label: 'Excluir', tone: 'danger' },
        ]}
      />,
    );
    const trigger = screen.getByRole('button', { name: 'Mais ações' });
    await userEvent.click(trigger);
    await userEvent.keyboard('{Enter}');
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('closes on Tab and on a pointer down outside', async () => {
    render(<Harness />);
    const trigger = screen.getByRole('button', { name: 'Mais ações' });
    await userEvent.click(trigger);
    await userEvent.keyboard('{Tab}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    await userEvent.click(trigger);
    expect(screen.getByRole('menu')).toBeInTheDocument();
    await userEvent.click(document.body);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('renders href items as links', async () => {
    render(
      <MenuButton
        label="Mais ações"
        trigger="Mais"
        items={[{ id: 'doc', label: 'Abrir', href: '/doc' }]}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Mais ações' }));
    const link = screen.getByRole('menuitem', { name: 'Abrir' });
    expect(link).toHaveAttribute('href', '/doc');
    expect(link.tagName).toBe('A');
  });

  it('ct13 forwards className, style, data attributes and ref to the root', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <MenuButton
        label="Mais ações"
        trigger="Mais"
        items={[{ id: 'dup', label: 'Duplicar' }]}
        className="extra"
        style={{ marginTop: 'var(--s2)' }}
        data-kind="actions"
        ref={ref}
      />,
    );
    const root = screen.getByRole('button', { name: 'Mais ações' }).parentElement;
    expect(ref.current).toBe(root);
    expect(root).toHaveClass('extra');
    expect(root?.style.marginTop).toBe('var(--s2)');
    expect(root).toHaveAttribute('data-kind', 'actions');
  });
});
