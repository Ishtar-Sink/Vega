import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { TextField } from '../text-field/text-field';
import { FormActions, FormGrid } from './form-layout';

describe('FormGrid', () => {
  it('spans full-width fields across both columns', () => {
    render(
      <FormGrid>
        <div data-span="full">Título</div>
        <div>Tipo</div>
      </FormGrid>,
    );
    expect(screen.getByText('Título')).toHaveAttribute('data-span', 'full');
    const css = readFileSync(join(import.meta.dirname, 'form-layout.module.css'), 'utf8');
    expect(css).toMatch(/\[data-span='full'\][^}]*grid-column:\s*1\s*\/\s*-1/);
    expect(css).toContain('calc(var(--space) * 220)');
    expect(css).toMatch(/max-width:\s*640px/);
  });

  it('passes className, style and data attributes to the root', () => {
    render(
      <FormGrid className="extra" style={{ marginTop: '4px' }} data-testid="raiz">
        <div>Tipo</div>
      </FormGrid>,
    );
    const root = screen.getByTestId('raiz');
    expect(root.tagName.toLowerCase()).toBe('div');
    expect(root).toHaveClass('extra');
    expect(root).toHaveStyle({ marginTop: '4px' });
  });

  // Regressão: sem reset global no app, a grade de largura total com padding passava da borda.
  it('keeps the full-width grid inside its container with box-sizing border-box', () => {
    const css = readFileSync(join(import.meta.dirname, 'form-layout.module.css'), 'utf8');
    const block = /\.grid\s*\{([^}]*)\}/.exec(css)?.[1] ?? '';
    expect(block).toMatch(/box-sizing:\s*border-box/);
  });
});

describe('FormActions', () => {
  it('renders Cancelar before Salvar at the end of the row', () => {
    render(<FormActions cancelLabel="Cancelar" submitLabel="Salvar" onCancel={vi.fn()} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.map((button) => button.textContent)).toEqual(['Cancelar', 'Salvar']);
    expect(buttons[0]?.className).toMatch(/muted/);
    expect(buttons[1]?.className).toMatch(/primary/);
    expect(buttons[1]).toHaveAttribute('type', 'submit');
  });

  it('uses Cancelar and Salvar by default', () => {
    render(<FormActions onCancel={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument();
  });

  it('accepts other labels', () => {
    render(<FormActions cancelLabel="Cancel" submitLabel="Save" onCancel={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('disables submit and shows loading', () => {
    const { rerender } = render(<FormActions onCancel={vi.fn()} submitDisabled />);
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeDisabled();
    rerender(<FormActions onCancel={vi.fn()} loading />);
    expect(screen.getByRole('button', { name: 'Salvar' })).toHaveAttribute('aria-busy', 'true');
  });

  it('cancels with the keyboard', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(<FormActions onCancel={onCancel} />);
    await user.tab();
    expect(screen.getByRole('button', { name: 'Cancelar' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <form aria-label="Cadastro">
        <FormGrid>
          <TextField label="Nome" />
          <FormActions onCancel={vi.fn()} />
        </FormGrid>
      </form>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('passes className, style and data attributes to the root', () => {
    render(
      <FormActions
        onCancel={vi.fn()}
        className="extra"
        style={{ marginTop: '4px' }}
        data-testid="raiz"
      />,
    );
    const root = screen.getByTestId('raiz');
    expect(root.tagName.toLowerCase()).toBe('div');
    expect(root).toHaveClass('extra');
    expect(root).toHaveStyle({ marginTop: '4px' });
    expect(root).toHaveAttribute('data-span', 'full');
  });
});
