import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createRef, useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { SelectField } from './select-field';

const options = [
  { value: 'a', label: 'Alfa' },
  { value: 'b', label: 'Beta' },
  { value: 'c', label: 'Gama' },
  { value: 'd', label: 'Delta' },
];

function Controlled({ error }: { error?: string }) {
  const [value, setValue] = useState('a');
  return (
    <SelectField
      label="Tipo"
      options={options}
      value={value}
      onChange={setValue}
      {...(error ? { error } : {})}
    />
  );
}

beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
});

describe('SelectField', () => {
  it('has no axe violations', async () => {
    const { container } = render(<Controlled />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('keeps the scrollable listbox reachable by keyboard (tabindex 0) with no axe violations', async () => {
    const { container } = render(<Controlled />);
    await userEvent.click(screen.getByLabelText('Tipo'));
    const list = screen.getByRole('listbox');
    expect(list).toHaveAttribute('tabindex', '0');
    expect(list).toHaveFocus();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('ignores the scroll caused by opening, but still closes on a later page scroll', async () => {
    let now = 1000;
    const clock = vi.spyOn(performance, 'now').mockImplementation(() => now);
    try {
      render(<Controlled />);
      await userEvent.click(screen.getByLabelText('Tipo'));
      fireEvent.scroll(document);
      expect(screen.getByRole('listbox')).toBeInTheDocument();
      now += 1000;
      fireEvent.scroll(document);
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    } finally {
      clock.mockRestore();
    }
  });

  it('does not close on the scroll caused by moving the active option', async () => {
    let now = 1000;
    const clock = vi.spyOn(performance, 'now').mockImplementation(() => now);
    try {
      render(<Controlled />);
      await userEvent.click(screen.getByLabelText('Tipo'));
      now += 1000;
      await userEvent.keyboard('{ArrowDown}');
      fireEvent.scroll(document);
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    } finally {
      clock.mockRestore();
    }
  });

  it('associates the label with the control', () => {
    render(<Controlled />);
    const control = screen.getByLabelText('Tipo');
    expect(control.tagName).toBe('BUTTON');
    expect(control).toHaveAttribute('aria-haspopup', 'listbox');
  });

  it('shows the error with role alert and aria-invalid', () => {
    render(<Controlled error="Escolha um tipo" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Escolha um tipo');
    expect(screen.getByLabelText('Tipo')).toHaveAttribute('aria-invalid', 'true');
  });

  it('renders no native select', () => {
    const { container } = render(<Controlled />);
    expect(container.querySelector('select')).toBeNull();
  });

  it('opens the listbox with ArrowDown and picks with Enter', async () => {
    render(<Controlled />);
    const trigger = screen.getByLabelText('Tipo');
    trigger.focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    await userEvent.keyboard('{ArrowDown}{Enter}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(trigger).toHaveTextContent('Beta');
  });

  it('moves with Home and End and jumps by typed letters', async () => {
    render(<Controlled />);
    const trigger = screen.getByLabelText('Tipo');
    trigger.focus();
    await userEvent.keyboard('{ArrowDown}{End}');
    expect(screen.getByRole('option', { name: 'Delta' })).toHaveAttribute('id');
    expect(screen.getByRole('listbox').getAttribute('aria-activedescendant')).toBe(
      screen.getByRole('option', { name: 'Delta' }).id,
    );
    await userEvent.keyboard('{Home}');
    expect(screen.getByRole('listbox').getAttribute('aria-activedescendant')).toBe(
      screen.getByRole('option', { name: 'Alfa' }).id,
    );
    await userEvent.keyboard('g');
    expect(screen.getByRole('listbox').getAttribute('aria-activedescendant')).toBe(
      screen.getByRole('option', { name: 'Gama' }).id,
    );
  });

  it('closes on Escape and returns focus to the trigger', async () => {
    render(<Controlled />);
    const trigger = screen.getByLabelText('Tipo');
    trigger.focus();
    await userEvent.keyboard('{Enter}');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('ct13 forwards className, style, data attributes and ref to the trigger', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <SelectField
        label="Tipo"
        options={options}
        value="a"
        onChange={() => undefined}
        ref={ref}
        className="extra"
        style={{ marginTop: 'var(--s2)' }}
        data-kind="tipo"
      />,
    );
    const trigger = screen.getByRole('button', { name: /Tipo/ });
    expect(trigger).toHaveClass('extra');
    expect(trigger.className).toMatch(/control/);
    expect(trigger.style.marginTop).toBe('var(--s2)');
    expect(trigger).toHaveAttribute('data-kind', 'tipo');
    expect(ref.current).toBe(trigger);
  });

  it('shows the placeholder when no option matches the value', () => {
    render(
      <SelectField
        label="Tipo"
        options={options}
        value=""
        onChange={() => undefined}
        placeholder="Selecione"
      />,
    );
    expect(screen.getByRole('button', { name: 'Tipo Selecione' })).toBeInTheDocument();
  });

  // Regressão: sem reset global no app, o controle de largura total com padding passava da borda.
  it('keeps the full-width control inside its container with box-sizing border-box', () => {
    const css = readFileSync(join(import.meta.dirname, 'select-field.module.css'), 'utf8');
    const block = /\.control\s*\{([^}]*)\}/.exec(css)?.[1] ?? '';
    expect(block).toMatch(/box-sizing:\s*border-box/);
  });
});
