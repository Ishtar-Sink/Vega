import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createRef } from 'react';
import type { CSSProperties } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Button } from './button';

describe('Button', () => {
  it('has no axe violations', async () => {
    const { container } = render(<Button>Salvar</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders the variant class', () => {
    render(<Button variant="primary">Salvar</Button>);
    expect(screen.getByRole('button', { name: 'Salvar' }).className).toMatch(/primary/);
  });

  it('is disabled with aria-disabled when loading', () => {
    render(<Button loading>Salvar</Button>);
    const button = screen.getByRole('button', { name: 'Salvar' });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'true');
    expect(button).toHaveAttribute('aria-busy', 'true');
  });

  it('applies the muted variant', () => {
    render(<Button variant="muted">Ver</Button>);
    expect(screen.getByRole('button', { name: 'Ver' }).className).toMatch(/muted/);
  });

  it('uses the tint color in the muted variant', () => {
    render(
      <Button variant="muted" tint="#ff8800">
        Destaque
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Destaque' });
    expect(button.style.getPropertyValue('--button-tint')).toBe('#ff8800');
    expect(button.className).toMatch(/tinted/);
  });

  it('applies the success variant and the pressed state', () => {
    render(
      <Button variant="success" aria-pressed="true">
        Concluir
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Concluir' });
    expect(button.className).toMatch(/success/);
    expect(button).toHaveAttribute('aria-pressed', 'true');
  });

  it('activates with Enter and Space from the keyboard', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Salvar</Button>);
    await user.tab();
    expect(screen.getByRole('button', { name: 'Salvar' })).toHaveFocus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('defaults to type button', () => {
    const { rerender } = render(<Button>Salvar</Button>);
    expect(screen.getByRole('button', { name: 'Salvar' })).toHaveAttribute('type', 'button');
    rerender(<Button type="submit">Salvar</Button>);
    expect(screen.getByRole('button', { name: 'Salvar' })).toHaveAttribute('type', 'submit');
  });

  it('ct13 forwards className, style, data attributes and ref to the button', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Button className="extra" style={{ marginTop: 'var(--s2)' }} data-kind="save" ref={ref}>
        Salvar
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Salvar' });
    expect(button).toHaveClass('extra');
    expect(button.className).toMatch(/root/);
    expect(button.style.marginTop).toBe('var(--s2)');
    expect(button).toHaveAttribute('data-kind', 'save');
    expect(ref.current).toBe(button);
  });

  it('ct13 keeps the custom style together with the tint', () => {
    render(
      <Button variant="muted" tint="#ff8800" style={{ marginTop: 'var(--s2)' }}>
        Ver
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Ver' });
    expect(button.style.getPropertyValue('--button-tint')).toBe('#ff8800');
    expect(button.style.marginTop).toBe('var(--s2)');
  });

  it('ct06 uses the --primary overridden by an ancestor container', () => {
    render(
      <div data-testid="brand" style={{ '--primary': '#ff5500' } as CSSProperties}>
        <Button variant="primary">Salvar</Button>
      </div>,
    );
    const button = screen.getByRole('button', { name: 'Salvar' });
    expect(screen.getByTestId('brand').style.getPropertyValue('--primary')).toBe('#ff5500');
    expect(button.className).toMatch(/primary/);
    expect(button.style.getPropertyValue('--primary')).toBe('');
    const css = readFileSync(join(import.meta.dirname, 'button.module.css'), 'utf8');
    const block = /\.primary\s*\{([^}]*)\}/.exec(css)?.[1] ?? '';
    expect(block).toContain('background: var(--primary)');
    expect(block).toContain('border-color: var(--primary)');
    expect(block).toContain('color: var(--primary-on)');
    expect(css).not.toMatch(/--primary\s*:/);
    expect(css).not.toMatch(/var\(--primary(-[a-z]+)?\s*,/);
  });

  it('keeps the md size by default without lg or block classes', () => {
    render(<Button>Salvar</Button>);
    const button = screen.getByRole('button', { name: 'Salvar' });
    expect(button.className).not.toMatch(/\blg\b|block/);
  });

  it('applies the lg size', () => {
    render(<Button size="lg">Salvar</Button>);
    expect(screen.getByRole('button', { name: 'Salvar' }).className).toMatch(/lg/);
  });

  it('fills the width with block', () => {
    render(<Button block>Salvar</Button>);
    expect(screen.getByRole('button', { name: 'Salvar' }).className).toMatch(/block/);
  });

  it('uses a 48px minimum height in the lg size', () => {
    const css = readFileSync(join(import.meta.dirname, 'button.module.css'), 'utf8');
    const rule = /\.lg\s*\{([^}]*)\}/.exec(css)?.[1] ?? '';
    expect(rule).toMatch(/min-height:\s*calc\(var\(--space\) \* 12\)/);
  });

  it('keeps the block button inside its container with box-sizing border-box', () => {
    const css = readFileSync(join(import.meta.dirname, 'button.module.css'), 'utf8');
    const rule = /\.block\s*\{([^}]*)\}/.exec(css)?.[1] ?? '';
    expect(rule).toMatch(/width:\s*100%/);
    expect(rule).toMatch(/box-sizing:\s*border-box/);
  });
});

describe('Button styles', () => {
  const css = readFileSync(join(import.meta.dirname, 'button.module.css'), 'utf8');

  it('mixes success 22% with success-soft on hover', () => {
    expect(css).toMatch(
      /\.success:hover:not\(:disabled\) \{\s*background: color-mix\(in srgb, var\(--success\) 22%, var\(--success-soft\)\);/,
    );
  });

  it('mixes success 85% with text when pressed and hovered', () => {
    expect(css).toMatch(
      /\.success\[aria-pressed='true'\]:hover:not\(:disabled\) \{\s*background: color-mix\(in srgb, var\(--success\) 85%, var\(--text\)\);/,
    );
  });

  it('shows a visible spinner while loading', () => {
    const { rerender } = render(<Button loading>Salvar</Button>);
    const button = screen.getByRole('button', { name: 'Salvar' });
    expect(button).toHaveAttribute('aria-busy', 'true');
    const spinner = button.querySelector('[data-button-spinner]');
    expect(spinner).toHaveAttribute('aria-hidden', 'true');
    rerender(<Button>Salvar</Button>);
    const idle = screen.getByRole('button', { name: 'Salvar' });
    expect(idle).not.toHaveAttribute('aria-busy');
    expect(idle.querySelector('[data-button-spinner]')).toBeNull();
  });

  it('ignores clicks while loading', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Salvar
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Salvar' });
    await user.click(button);
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('keeps the accessible name while loading', () => {
    render(<Button loading>Salvar</Button>);
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument();
  });

  it('keeps the primary color while loading', () => {
    const css = readFileSync(join(import.meta.dirname, 'button.module.css'), 'utf8');
    const busy = /\.primary\[aria-busy='true'\]\s*\{([^}]*)\}/.exec(css)?.[1] ?? '';
    expect(busy).toContain('background: var(--primary)');
    const spinner = /\.spinner\s*\{([^}]*)\}/.exec(css)?.[1] ?? '';
    expect(spinner).toContain('var(--motion-slow)');
  });
});
