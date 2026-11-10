import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { TextAreaField } from './text-area-field';

const lines = (n: number) => Array.from({ length: n }, () => 'a').join('{Enter}');

function controlBlock(): string {
  const css = readFileSync(join(__dirname, 'text-area-field.module.css'), 'utf8');
  const match = /\.control\s*\{([^}]*)\}/.exec(css);
  return match?.[1] ?? '';
}

describe('TextAreaField', () => {
  it('has no axe violations', async () => {
    const { container } = render(
      <TextAreaField label="Redação" help="Ajuda" error="Erro" counter="0 de 30" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('is named by the label', () => {
    render(<TextAreaField label="Redação" />);
    expect(screen.getByRole('textbox', { name: 'Redação' }).tagName).toBe('TEXTAREA');
  });

  it('marks the error with role alert and aria-invalid', () => {
    render(<TextAreaField label="Redação" error="Escreva algo" />);
    const field = screen.getByRole('textbox', { name: 'Redação' });
    expect(screen.getByRole('alert')).toHaveTextContent('Escreva algo');
    expect(field).toHaveAttribute('aria-invalid', 'true');
    expect(field.getAttribute('aria-describedby')).toContain(screen.getByRole('alert').id);
  });

  it('links help, counter and error by aria-describedby', () => {
    render(
      <>
        <p id="externo">Dica</p>
        <TextAreaField
          label="Redação"
          help="Ajuda"
          counter="3 de 30"
          error="Erro"
          aria-describedby="externo"
        />
      </>,
    );
    const field = screen.getByRole('textbox', { name: 'Redação' });
    const ids = (field.getAttribute('aria-describedby') ?? '').split(' ');
    const texts = ids.map((id) => document.getElementById(id)?.textContent);
    expect(texts).toEqual(['Dica', 'Ajuda', '3 de 30', 'Erro']);
  });

  it('does not announce the counter on every key', () => {
    render(<TextAreaField label="Redação" counter="3 de 30" />);
    const counter = screen.getByText('3 de 30');
    expect(counter).not.toHaveAttribute('aria-live');
    expect(counter).not.toHaveAttribute('role');
  });

  it('grows with the content up to maxRows', async () => {
    const user = userEvent.setup();
    render(<TextAreaField label="Redação" autoResize minRows={2} maxRows={4} />);
    const field = screen.getByRole('textbox', { name: 'Redação' });
    await user.type(field, lines(6));
    expect(field).toHaveAttribute('rows', '4');
    await user.clear(field);
    await user.type(field, lines(3));
    expect(field).toHaveAttribute('rows', '3');
  });

  it('keeps minRows when empty', () => {
    render(<TextAreaField label="Redação" autoResize minRows={2} />);
    expect(screen.getByRole('textbox', { name: 'Redação' })).toHaveAttribute('rows', '2');
  });

  it('keeps the rows prop without autoResize', async () => {
    const user = userEvent.setup();
    render(<TextAreaField label="Redação" rows={5} />);
    const field = screen.getByRole('textbox', { name: 'Redação' });
    await user.type(field, lines(8));
    expect(field).toHaveAttribute('rows', '5');
  });

  it('passes className, style, data attributes and ref to the textarea', () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(
      <TextAreaField
        label="Redação"
        ref={ref}
        className="extra"
        style={{ marginTop: 'var(--s2)' }}
        data-kind="texto"
      />,
    );
    const field = screen.getByRole('textbox', { name: 'Redação' });
    expect(field).toHaveClass('extra');
    expect(field.className).toMatch(/control/);
    expect(field.style.marginTop).toBe('var(--s2)');
    expect(field).toHaveAttribute('data-kind', 'texto');
    expect(ref.current).toBe(field);
  });

  it('uses the relaxed line height', () => {
    expect(controlBlock()).toMatch(/line-height:\s*var\(--line-height-relaxed\)/);
  });

  it('keeps the full-width control inside its container with box-sizing border-box', () => {
    expect(controlBlock()).toMatch(/width:\s*100%/);
    expect(controlBlock()).toMatch(/box-sizing:\s*border-box/);
  });
});
