import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { axe } from 'vitest-axe';
import { DateTimeField, type DateTimeFieldProps } from './date-time-field';

function Harness({
  spy = () => undefined,
  ...props
}: Partial<DateTimeFieldProps> & { spy?: (value: string) => void }) {
  const [value, setValue] = useState('');
  return (
    <DateTimeField
      label="Início"
      value={value}
      onChange={(next) => {
        setValue(next);
        spy(next);
      }}
      today="2026-10-30"
      {...props}
    />
  );
}

describe('DateTimeField', () => {
  it('combines date and time into YYYY-MM-DDTHH:mm', async () => {
    const spy = vi.fn();
    render(<Harness spy={spy} />);
    await userEvent.click(screen.getByRole('button', { name: /Início: data/ }));
    await userEvent.click(screen.getByRole('button', { name: '12 de outubro de 2026' }));
    await userEvent.type(screen.getByLabelText('Início: hora (24 horas)'), '930');
    await userEvent.tab();
    expect(spy).toHaveBeenLastCalledWith('2026-10-12T09:30');
  });

  it('emits an empty value while one part is missing', async () => {
    const spy = vi.fn();
    render(<Harness spy={spy} />);
    await userEvent.click(screen.getByRole('button', { name: /Início: data/ }));
    await userEvent.click(screen.getByRole('button', { name: '12 de outubro de 2026' }));
    expect(spy).toHaveBeenLastCalledWith('');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Harness />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('derives the date and time labels from the label by default', () => {
    render(<Harness />);
    expect(screen.getByRole('button', { name: /Início: data/ })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Início: hora (24 horas)' })).toHaveAttribute(
      'placeholder',
      'hh:mm',
    );
  });

  it('accepts overridden labels and the received locale', async () => {
    render(
      <Harness
        locale="en-US"
        value="2026-10-12T09:30"
        labels={{ date: 'Start: date', time: 'Start: time' }}
      />,
    );
    const trigger = screen.getByRole('button', { name: /Start: date/ });
    expect(trigger).toHaveTextContent('10/12/2026');
    expect(screen.getByRole('textbox', { name: 'Start: time' })).toHaveValue('09:30');
    await userEvent.click(trigger);
    expect(screen.getByRole('button', { name: 'October 12, 2026' })).toBeInTheDocument();
  });

  it('fills both parts with the keyboard', async () => {
    const user = userEvent.setup();
    const spy = vi.fn();
    render(<Harness spy={spy} />);
    await user.tab();
    expect(screen.getByRole('button', { name: /Início: data/ })).toHaveFocus();
    await user.keyboard('{Enter}');
    await user.keyboard('{Enter}');
    await user.tab();
    expect(screen.getByRole('textbox', { name: 'Início: hora (24 horas)' })).toHaveFocus();
    await user.keyboard('1415');
    await user.tab();
    expect(spy).toHaveBeenLastCalledWith('2026-10-30T14:15');
  });

  describe('with the system clock changed', () => {
    beforeEach(() => {
      vi.useFakeTimers({ toFake: ['Date'] });
      vi.setSystemTime(new Date(2031, 4, 2));
    });
    afterEach(() => {
      vi.useRealTimers();
    });

    it('keeps the result when the system clock changes', async () => {
      const spy = vi.fn();
      render(<Harness spy={spy} />);
      await userEvent.click(screen.getByRole('button', { name: /Início: data/ }));
      await userEvent.click(screen.getByRole('button', { name: '12 de outubro de 2026' }));
      await userEvent.type(screen.getByLabelText('Início: hora (24 horas)'), '930');
      await userEvent.tab();
      expect(spy).toHaveBeenLastCalledWith('2026-10-12T09:30');
    });
  });

  it('passes className, style and data attributes to the control', () => {
    render(<Harness className="extra" style={{ marginTop: '4px' }} data-testid="raiz" />);
    const control = screen.getByTestId('raiz');
    expect(control).toBe(screen.getByRole('group', { name: 'Início' }));
    expect(control).toHaveClass('extra');
    expect(control).toHaveStyle({ marginTop: '4px' });
  });

  it('forwards the ref to the fieldset', () => {
    const ref = createRef<HTMLFieldSetElement>();
    render(<Harness ref={ref} />);
    expect(ref.current).toBe(screen.getByRole('group', { name: 'Início' }));
  });
});
