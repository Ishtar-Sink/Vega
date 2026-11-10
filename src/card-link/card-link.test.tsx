import { readFileSync } from 'node:fs';
import { createRef } from 'react';
import { join } from 'node:path';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { CardLink } from './card-link';
import { CardButton } from './card-button';

const css = readFileSync(join(import.meta.dirname, 'card-link.module.css'), 'utf8');

describe('CardLink and CardButton', () => {
  it('has no axe violations', async () => {
    const { container } = render(
      <>
        <CardLink href="/temas/funcoes">Funções</CardLink>
        <CardButton>Continuar</CardButton>
      </>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders CardLink as a real link', () => {
    render(<CardLink href="/temas/funcoes">Funções</CardLink>);
    expect(screen.getByRole('link', { name: 'Funções' })).toHaveAttribute('href', '/temas/funcoes');
  });

  it('renders CardButton as a real button of type button', () => {
    render(<CardButton>Continuar</CardButton>);
    expect(screen.getByRole('button', { name: 'Continuar' })).toHaveAttribute('type', 'button');
  });

  it('activates CardButton with Enter and Space', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<CardButton onClick={onClick}>Continuar</CardButton>);
    screen.getByRole('button', { name: 'Continuar' }).focus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('makes the whole card a single target', () => {
    render(
      <>
        <CardLink href="/a">
          <strong>Título</strong>
          <p>Descrição</p>
        </CardLink>
        <CardButton>
          <strong>Outro</strong>
          <p>Texto</p>
        </CardButton>
      </>,
    );
    expect(screen.getAllByRole('link')).toHaveLength(1);
    expect(screen.getAllByRole('button')).toHaveLength(1);
    const link = screen.getByRole('link');
    expect(link).toHaveTextContent('Título');
    expect(link).toHaveTextContent('Descrição');
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Outro');
    expect(button).toHaveTextContent('Texto');
  });

  it('applies the card tone', () => {
    render(
      <>
        <CardLink href="/a" tone="primary">
          Link
        </CardLink>
        <CardButton tone="primary">Botão</CardButton>
      </>,
    );
    expect(screen.getByRole('link').className).toMatch(/primary/);
    expect(screen.getByRole('button').className).toMatch(/primary/);
  });

  it('passes className, style, data attributes and ref to the link', () => {
    const ref = createRef<HTMLAnchorElement>();
    render(
      <CardLink ref={ref} href="/a" className="extra" style={{ color: 'red' }} data-x="1">
        Link
      </CardLink>,
    );
    const link = screen.getByRole('link');
    expect(link).toHaveClass('extra');
    expect(link).toHaveStyle({ color: 'rgb(255, 0, 0)' });
    expect(link).toHaveAttribute('data-x', '1');
    expect(ref.current).toBe(link);
  });

  it('passes className, style, data attributes and ref to the button', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <CardButton ref={ref} className="extra" style={{ color: 'red' }} data-x="1">
        Botão
      </CardButton>,
    );
    const button = screen.getByRole('button');
    expect(button).toHaveClass('extra');
    expect(button).toHaveStyle({ color: 'rgb(255, 0, 0)' });
    expect(button).toHaveAttribute('data-x', '1');
    expect(ref.current).toBe(button);
  });

  it('shows hover, visible focus and pressed states', () => {
    expect(css).toMatch(/\.interactive:hover\s*\{/);
    expect(css).toMatch(/\.interactive:focus-visible\s*\{[^}]*outline:/);
    expect(css).toMatch(/\.interactive:active\s*\{/);
  });

  it('keeps a 44px touch target and stays inside its container', () => {
    expect(css).toMatch(/\.interactive\s*\{[^}]*min-height:\s*calc\(var\(--space\)\s*\*\s*11\)/);
    expect(css).toMatch(/\.interactive\s*\{[^}]*box-sizing:\s*border-box/);
    expect(css).toMatch(/\.button\s*\{[^}]*width:\s*100%/);
  });
});
