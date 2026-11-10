import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { SegmentedField } from './segmented-field';

const options = [
  { value: 'out', label: 'Saída' },
  { value: 'in', label: 'Entrada' },
];

function Controlled() {
  const [value, setValue] = useState('out');
  return <SegmentedField label="Tipo" options={options} value={value} onChange={setValue} />;
}

describe('SegmentedField', () => {
  it('renders a radiogroup named by the legend', () => {
    render(<Controlled />);
    expect(screen.getByRole('radiogroup', { name: 'Tipo' })).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(2);
    expect(screen.getByRole('radio', { name: 'Saída' })).toBeChecked();
  });

  it('moves the choice with the arrow keys', async () => {
    render(<Controlled />);
    screen.getByRole('radio', { name: 'Saída' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('radio', { name: 'Entrada' })).toBeChecked();
  });

  it('moves back with ArrowLeft and reaches the group with Tab', async () => {
    const user = userEvent.setup();
    render(<Controlled />);
    await user.tab();
    expect(screen.getByRole('radio', { name: 'Saída' })).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('radio', { name: 'Entrada' })).toBeChecked();
    await user.keyboard('{ArrowLeft}');
    expect(screen.getByRole('radio', { name: 'Saída' })).toBeChecked();
  });

  it('has no axe violations', async () => {
    const { container } = render(<Controlled />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('shows the error with role alert linked to the group', () => {
    render(
      <SegmentedField
        label="Tipo"
        options={options}
        value="out"
        onChange={() => undefined}
        error="Escolha um tipo"
      />,
    );
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('Escolha um tipo');
    expect(screen.getByRole('group', { name: 'Tipo' })).toHaveAttribute(
      'aria-describedby',
      alert.id,
    );
  });

  it('ct13 forwards className, style, data attributes and ref to the fieldset', () => {
    const ref = createRef<HTMLFieldSetElement>();
    render(
      <SegmentedField
        label="Tipo"
        options={options}
        value="out"
        onChange={() => undefined}
        ref={ref}
        className="extra"
        style={{ marginTop: 'var(--s2)' }}
        data-kind="tipo"
      />,
    );
    const group = screen.getByRole('group', { name: 'Tipo' });
    expect(group).toHaveClass('extra');
    expect(group.className).toMatch(/root/);
    expect(group.style.marginTop).toBe('var(--s2)');
    expect(group).toHaveAttribute('data-kind', 'tipo');
    expect(ref.current).toBe(group);
  });

  // Regressão: sem reset global no app, o controle de largura total com padding passava da borda.
  it('keeps the full-width group inside its container with box-sizing border-box', () => {
    const css = readFileSync(join(import.meta.dirname, 'segmented-field.module.css'), 'utf8');
    const block = /\.group\s*\{([^}]*)\}/.exec(css)?.[1] ?? '';
    expect(block).toMatch(/box-sizing:\s*border-box/);
  });
});
