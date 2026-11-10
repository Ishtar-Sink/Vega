import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { axe } from 'vitest-axe';
import { maskTime, parseTime } from './parse-time';
import { TimeField } from './time-field';

describe('parseTime', () => {
  it('normalizes 930, 9:30, 09:30 and 9 to 24 h', () => {
    expect(parseTime('930')).toBe('09:30');
    expect(parseTime('9:30')).toBe('09:30');
    expect(parseTime('09:30')).toBe('09:30');
    expect(parseTime('9')).toBe('09:00');
  });

  it('clamps hours to 23 and minutes to 59', () => {
    expect(parseTime('2575')).toBe('23:59');
    expect(parseTime('99')).toBe('23:00');
  });

  it('returns null for empty or non-numeric input', () => {
    expect(parseTime('')).toBeNull();
    expect(parseTime('ab')).toBeNull();
  });
});

describe('maskTime', () => {
  it('masks the colon with maskTime', () => {
    expect(maskTime('0930')).toBe('09:30');
    expect(maskTime('93')).toBe('93');
    expect(maskTime('ab12345')).toBe('12:34');
  });
});

function Controlled() {
  const [value, setValue] = useState('');
  return <TimeField label="Hora (24 horas)" value={value} onChange={setValue} />;
}

describe('TimeField', () => {
  it('inserts the colon while typing and normalizes on blur', async () => {
    render(<Controlled />);
    const input = screen.getByLabelText('Hora (24 horas)');
    await userEvent.type(input, '930');
    expect(input).toHaveValue('93:0');
    await userEvent.clear(input);
    await userEvent.type(input, '0930');
    expect(input).toHaveValue('09:30');
    await userEvent.clear(input);
    await userEvent.type(input, '9');
    await userEvent.tab();
    expect(input).toHaveValue('09:00');
  });

  it('uses inputmode numeric and the 24 h label', () => {
    render(<Controlled />);
    const input = screen.getByLabelText('Hora (24 horas)');
    expect(input).toHaveAttribute('inputmode', 'numeric');
    expect(input).toHaveAttribute('maxlength', '5');
    expect(input).toHaveAttribute('placeholder', 'hh:mm');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Controlled />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('uses hh:mm as the default placeholder', () => {
    render(<Controlled />);
    expect(screen.getByRole('textbox', { name: 'Hora (24 horas)' })).toHaveAttribute(
      'placeholder',
      'hh:mm',
    );
  });

  it('accepts another placeholder', () => {
    render(<TimeField label="Hora" value="" onChange={() => undefined} placeholder="HH:MM" />);
    expect(screen.getByRole('textbox', { name: 'Hora' })).toHaveAttribute('placeholder', 'HH:MM');
  });

  it('passes className, style and data attributes to the control', () => {
    render(
      <TimeField
        label="Hora (24 horas)"
        value=""
        onChange={() => undefined}
        className="extra"
        style={{ marginTop: '4px' }}
        data-testid="raiz"
      />,
    );
    const control = screen.getByTestId('raiz');
    expect(control).toBe(screen.getByRole('textbox', { name: 'Hora (24 horas)' }));
    expect(control).toHaveClass('extra');
    expect(control).toHaveStyle({ marginTop: '4px' });
  });

  it('forwards the ref to the input', () => {
    const ref = createRef<HTMLInputElement>();
    render(<TimeField label="Hora" value="" onChange={() => undefined} ref={ref} />);
    expect(ref.current).toBe(screen.getByRole('textbox', { name: 'Hora' }));
  });

  // Regressão: sem reset global no app, o controle de largura total com padding passava da borda.
  it('keeps the full-width control inside its container with box-sizing border-box', () => {
    const css = readFileSync(join(import.meta.dirname, 'time-field.module.css'), 'utf8');
    const block = /\.control\s*\{([^}]*)\}/.exec(css)?.[1] ?? '';
    expect(block).toMatch(/box-sizing:\s*border-box/);
  });
});
