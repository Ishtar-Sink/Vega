import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { axe } from 'vitest-axe';
import { DateField, type DateFieldProps } from './date-field';

function Harness({ initial = '', ...props }: Partial<DateFieldProps> & { initial?: string }) {
  const [value, setValue] = useState(initial);
  return (
    <DateField label="Vencimento" value={value} onChange={setValue} today="2026-10-30" {...props} />
  );
}

describe('DateField', () => {
  it('shows the placeholder when empty and the formatted date when set', () => {
    const { unmount } = render(<Harness />);
    expect(screen.getByRole('button', { name: /Vencimento/ })).toHaveTextContent('Escolher data');
    unmount();
    render(<Harness initial="2026-10-12" />);
    expect(screen.getByRole('button', { name: /Vencimento/ })).toHaveTextContent('12/10/2026');
  });

  it('opens the calendar popover and picks a day', async () => {
    render(<Harness />);
    const trigger = screen.getByRole('button', { name: /Vencimento/ });
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    await userEvent.click(trigger);
    expect(screen.getByRole('dialog', { name: 'Vencimento' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: '12 de outubro de 2026' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveTextContent('12/10/2026');
    expect(trigger).toHaveFocus();
  });

  it('sets today and clears', async () => {
    render(<Harness initial="2026-10-12" />);
    const trigger = screen.getByRole('button', { name: /Vencimento/ });
    await userEvent.click(trigger);
    await userEvent.click(screen.getByRole('button', { name: 'Hoje' }));
    expect(trigger).toHaveTextContent('30/10/2026');
    await userEvent.click(trigger);
    await userEvent.click(screen.getByRole('button', { name: 'Limpar' }));
    expect(trigger).toHaveTextContent('Escolher data');
  });

  it('closes on Escape and returns focus to the trigger', async () => {
    render(<Harness />);
    const trigger = screen.getByRole('button', { name: /Vencimento/ });
    await userEvent.click(trigger);
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('has no axe violations', async () => {
    const { container } = render(<Harness />);
    expect(await axe(container)).toHaveNoViolations();
    await userEvent.click(screen.getByRole('button', { name: /Vencimento/ }));
    expect(await axe(container)).toHaveNoViolations();
  });

  it('uses the pt-BR labels by default', async () => {
    render(<Harness />);
    const trigger = screen.getByRole('button', { name: /Vencimento/ });
    expect(trigger).toHaveTextContent('Escolher data');
    await userEvent.click(trigger);
    expect(screen.getByRole('button', { name: 'Hoje' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Limpar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Mês anterior' })).toBeInTheDocument();
  });

  it('formats the value in the received locale', async () => {
    render(<Harness locale="en-US" initial="2026-10-12" />);
    const trigger = screen.getByRole('button', { name: /Vencimento/ });
    expect(trigger).toHaveTextContent('10/12/2026');
    await userEvent.click(trigger);
    expect(screen.getByRole('button', { name: 'October 12, 2026' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Hoje' })).toBeInTheDocument();
  });

  it('accepts overridden labels', async () => {
    render(<Harness labels={{ placeholder: 'Pick a date', today: 'Today', clear: 'Clear' }} />);
    const trigger = screen.getByRole('button', { name: /Vencimento/ });
    expect(trigger).toHaveTextContent('Pick a date');
    await userEvent.click(trigger);
    expect(screen.getByRole('button', { name: 'Today' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();
  });

  describe('with the system clock changed', () => {
    beforeEach(() => {
      vi.useFakeTimers({ toFake: ['Date'] });
      vi.setSystemTime(new Date(2031, 4, 2));
    });
    afterEach(() => {
      vi.useRealTimers();
    });

    it('uses the injected today, not the system clock', async () => {
      render(<Harness />);
      const trigger = screen.getByRole('button', { name: /Vencimento/ });
      await userEvent.click(trigger);
      await userEvent.click(screen.getByRole('button', { name: 'Hoje' }));
      expect(trigger).toHaveTextContent('30/10/2026');
    });
  });

  it('opens with the keyboard and focuses the selected day', async () => {
    const user = userEvent.setup();
    render(<Harness initial="2026-10-12" />);
    await user.tab();
    const trigger = screen.getByRole('button', { name: /Vencimento/ });
    expect(trigger).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('dialog', { name: 'Vencimento' })).toBeInTheDocument();
    const selected = screen.getByRole('button', { name: '12 de outubro de 2026' });
    expect(selected).toHaveAttribute('tabindex', '0');
    expect(selected).toHaveFocus();
    await user.keyboard('{ArrowRight}{Enter}');
    expect(trigger).toHaveTextContent('13/10/2026');
    expect(trigger).toHaveFocus();
  });

  it('passes className, style and data attributes to the control', () => {
    render(<Harness className="extra" style={{ marginTop: '4px' }} data-testid="raiz" />);
    const control = screen.getByTestId('raiz');
    expect(control).toBe(screen.getByRole('button', { name: /Vencimento/ }));
    expect(control).toHaveClass('extra');
    expect(control).toHaveStyle({ marginTop: '4px' });
  });

  it('forwards the ref to the trigger', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Harness ref={ref} />);
    expect(ref.current).toBe(screen.getByRole('button', { name: /Vencimento/ }));
  });

  // Regressão: sem reset global no app, o controle de largura total com padding passava da borda.
  it('keeps the full-width control inside its container with box-sizing border-box', () => {
    const css = readFileSync(join(import.meta.dirname, 'date-field.module.css'), 'utf8');
    const block = /\.control\s*\{([^}]*)\}/.exec(css)?.[1] ?? '';
    expect(block).toMatch(/box-sizing:\s*border-box/);
  });
});
