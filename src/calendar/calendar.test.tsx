import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { axe } from 'vitest-axe';
import { Calendar, type CalendarProps, type CalendarValue } from './calendar';

function Harness({
  mode = 'single',
  initial = { from: '' },
  spy,
  ...props
}: Partial<CalendarProps> & {
  mode?: 'single' | 'range';
  initial?: CalendarValue;
  spy?: (value: CalendarValue) => void;
}) {
  const [month, setMonth] = useState('2026-10');
  const [value, setValue] = useState<CalendarValue>(initial);
  return (
    <Calendar
      mode={mode}
      month={month}
      onMonthChange={setMonth}
      value={value}
      onChange={(next) => {
        setValue(next);
        spy?.(next);
      }}
      today="2026-10-30"
      {...props}
    />
  );
}

describe('Calendar', () => {
  it('marks days outside the month with data-outside', () => {
    const { container } = render(<Harness />);
    expect(container.querySelector('[data-day="2026-10-15"]')).not.toHaveAttribute('data-outside');
    expect(container.querySelector('[data-day="2026-09-30"]')).toHaveAttribute('data-outside');
  });

  it('renders the month grid with weekday headers in the locale', () => {
    render(<Harness />);
    expect(screen.getByRole('grid', { name: 'outubro de 2026' })).toBeInTheDocument();
    expect(screen.getAllByRole('columnheader')).toHaveLength(7);
    expect(screen.getByRole('columnheader', { name: 'domingo' })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /de 2026|de 2025/ })).toHaveLength(42);
    expect(screen.getByRole('button', { name: '30 de outubro de 2026, hoje' })).toBeInTheDocument();
  });

  it('moves focus with the arrow keys across months', async () => {
    render(<Harness />);
    const today = screen.getByRole('button', { name: '30 de outubro de 2026, hoje' });
    today.focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('grid', { name: 'novembro de 2026' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '6 de novembro de 2026' })).toHaveFocus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(screen.getByRole('button', { name: '5 de novembro de 2026' })).toHaveFocus();
  });

  it('picks a single day', async () => {
    const spy = vi.fn();
    render(<Harness spy={spy} />);
    await userEvent.click(screen.getByRole('button', { name: '12 de outubro de 2026' }));
    expect(spy).toHaveBeenCalledWith({ from: '2026-10-12' });
    expect(screen.getByRole('button', { name: '12 de outubro de 2026' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('marks a range with two clicks and highlights the days between', async () => {
    const spy = vi.fn();
    render(<Harness mode="range" spy={spy} />);
    await userEvent.click(screen.getByRole('button', { name: '10 de outubro de 2026' }));
    await userEvent.click(screen.getByRole('button', { name: '14 de outubro de 2026' }));
    expect(spy).toHaveBeenLastCalledWith({ from: '2026-10-10', to: '2026-10-14' });
    const between = screen.getByRole('button', { name: '12 de outubro de 2026' });
    expect(between.className).toMatch(/inRange/);
    expect(between).toHaveAttribute('aria-pressed', 'false');
  });

  it('swaps the ends when the second click is before the first', async () => {
    const spy = vi.fn();
    render(<Harness mode="range" spy={spy} />);
    await userEvent.click(screen.getByRole('button', { name: '20 de outubro de 2026' }));
    await userEvent.click(screen.getByRole('button', { name: '15 de outubro de 2026' }));
    expect(spy).toHaveBeenLastCalledWith({ from: '2026-10-15', to: '2026-10-20' });
  });

  it('has no axe violations', async () => {
    const { container } = render(<Harness />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('uses the pt-BR labels by default', () => {
    render(<Harness />);
    expect(screen.getByRole('button', { name: 'Mês anterior' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Próximo mês' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '30 de outubro de 2026, hoje' })).toBeInTheDocument();
  });

  it('formats in the received locale and keeps the pt-BR texts', () => {
    render(<Harness locale="en-US" />);
    expect(screen.getByRole('grid', { name: 'October 2026' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'October 12, 2026' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Mês anterior' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Próximo mês' })).toBeInTheDocument();
  });

  it('accepts overridden labels', () => {
    render(
      <Harness
        locale="en-US"
        labels={{ previous: 'Previous month', next: 'Next month', today: 'today' }}
      />,
    );
    expect(screen.getByRole('button', { name: 'Previous month' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next month' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'October 30, 2026, today' })).toBeInTheDocument();
  });

  describe('with the system clock changed', () => {
    beforeEach(() => {
      vi.useFakeTimers({ toFake: ['Date'] });
      vi.setSystemTime(new Date(2031, 4, 2));
    });
    afterEach(() => {
      vi.useRealTimers();
    });

    it('marks today from the injected date, not the system clock', () => {
      render(<Harness />);
      expect(screen.getByRole('grid', { name: 'outubro de 2026' })).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: '30 de outubro de 2026, hoje' }),
      ).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /2031/ })).not.toBeInTheDocument();
    });
  });

  it('navigates months with the previous and next buttons', async () => {
    render(<Harness />);
    await userEvent.click(screen.getByRole('button', { name: 'Próximo mês' }));
    expect(screen.getByRole('grid', { name: 'novembro de 2026' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Mês anterior' }));
    await userEvent.click(screen.getByRole('button', { name: 'Mês anterior' }));
    expect(screen.getByRole('grid', { name: 'setembro de 2026' })).toBeInTheDocument();
  });

  it('hides the arrow icons from assistive technology', () => {
    render(<Harness />);
    const svg = screen.getByRole('button', { name: 'Próximo mês' }).querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveAttribute('focusable', 'false');
  });

  it('passes className, style and data attributes to the root', () => {
    render(<Harness className="extra" style={{ marginTop: '4px' }} data-testid="raiz" />);
    const root = screen.getByTestId('raiz');
    expect(root).toContainElement(screen.getByRole('grid'));
    expect(root).toHaveClass('extra');
    expect(root).toHaveStyle({ marginTop: '4px' });
  });

  it('forwards the ref to the root', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Harness ref={ref} />);
    expect(ref.current).toContainElement(screen.getByRole('grid'));
  });

  // Regressão: `text-transform: capitalize` exibia "Novembro De 2026"; só a primeira letra sobe.
  it('capitalizes only the first letter of the month title', () => {
    const css = readFileSync(join(import.meta.dirname, 'calendar.module.css'), 'utf8');
    const title = /\.title\s*\{([^}]*)\}/.exec(css)?.[1] ?? '';
    const firstLetter = /\.title::first-letter\s*\{([^}]*)\}/.exec(css)?.[1] ?? '';
    expect(title).not.toMatch(/text-transform:\s*capitalize/);
    expect(firstLetter).toMatch(/text-transform:\s*uppercase/);
  });
});
