import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { TextField } from './text-field';

describe('TextField', () => {
  it('has no axe violations', async () => {
    const { container } = render(<TextField label="Nome" help="Como aparece na lista" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('associates the label with the control', () => {
    render(<TextField label="Nome" help="Ajuda" />);
    const input = screen.getByLabelText('Nome');
    expect(input).toHaveAccessibleDescription('Ajuda');
  });

  it('shows the error with role alert and aria-invalid', () => {
    render(<TextField label="Nome" error="Informe o nome" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Informe o nome');
    expect(screen.getByLabelText('Nome')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByLabelText('Nome')).toHaveAccessibleDescription('Informe o nome');
  });

  it('types with the keyboard after tabbing in', async () => {
    const user = userEvent.setup();
    render(<TextField label="Nome" />);
    await user.tab();
    const input = screen.getByLabelText('Nome');
    expect(input).toHaveFocus();
    await user.keyboard('Ana');
    expect(input).toHaveValue('Ana');
  });

  it('ct13 forwards className, style, data attributes and ref to the input', () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <TextField
        label="Nome"
        ref={ref}
        className="extra"
        style={{ marginTop: 'var(--s2)' }}
        data-kind="nome"
      />,
    );
    const input = screen.getByLabelText('Nome');
    expect(input).toHaveClass('extra');
    expect(input.className).toMatch(/control/);
    expect(input.style.marginTop).toBe('var(--s2)');
    expect(input).toHaveAttribute('data-kind', 'nome');
    expect(ref.current).toBe(input);
  });

  it('keeps an external aria-describedby with the help', () => {
    render(
      <>
        <p id="externo">Dica</p>
        <TextField label="Nome" help="Ajuda" aria-describedby="externo" />
      </>,
    );
    expect(screen.getByLabelText('Nome')).toHaveAccessibleDescription('Dica Ajuda');
  });

  // Regressão: sem reset global no app, o controle de largura total com padding passava da borda.
  it('keeps the full-width control inside its container with box-sizing border-box', () => {
    const css = readFileSync(join(import.meta.dirname, 'text-field.module.css'), 'utf8');
    const block = /\.control\s*\{([^}]*)\}/.exec(css)?.[1] ?? '';
    expect(block).toMatch(/box-sizing:\s*border-box/);
  });
});
