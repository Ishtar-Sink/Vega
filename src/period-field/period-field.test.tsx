import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { axe } from 'vitest-axe';
import { PeriodField, type PeriodFieldProps } from './period-field';
import type { PeriodPreset, PeriodValue } from './period';

const pad = (n: number) => String(n).padStart(2, '0');
const iso = (date: Date) =>
  `${String(date.getFullYear())}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
const parts = (today: string) => today.split('-').map(Number) as [number, number, number];

const PRESETS: PeriodPreset[] = [
  {
    id: 'this_month',
    label: 'Este mês',
    range: (today) => {
      const [y, m] = parts(today);
      return { from: iso(new Date(y, m - 1, 1)), to: iso(new Date(y, m, 0)) };
    },
  },
  {
    id: 'last_month',
    label: 'Mês passado',
    range: (today) => {
      const [y, m] = parts(today);
      return { from: iso(new Date(y, m - 2, 1)), to: iso(new Date(y, m - 1, 0)) };
    },
  },
  { id: 'next_30_days', label: 'Próximos 30 dias', range: 30 },
  { id: 'last_30_days', label: 'Últimos 30 dias', range: -30 },
  {
    id: 'this_year',
    label: 'Este ano',
    range: (today) => {
      const [y] = parts(today);
      return { from: `${String(y)}-01-01`, to: `${String(y)}-12-31` };
    },
  },
  { id: 'all', label: 'Qualquer período', range: () => null },
];

function Harness({
  initial,
  spy,
  ...rest
}: { initial?: PeriodValue; spy?: (v: PeriodValue) => void } & Partial<PeriodFieldProps>) {
  const [value, setValue] = useState<PeriodValue>(initial ?? { preset: 'this_month' });
  return (
    <div>
      <PeriodField
        label="Período"
        value={value}
        onChange={(next) => {
          setValue(next);
          spy?.(next);
        }}
        placement="toolbar"
        today="2026-10-30"
        presets={PRESETS}
        {...rest}
      />
      <button type="button">fora</button>
    </div>
  );
}

const trigger = () => screen.getByRole('button', { name: /Período/ });

describe('PeriodField', () => {
  it('shows the label of the current period on the trigger', () => {
    const { unmount } = render(<Harness />);
    expect(trigger()).toHaveTextContent('Este mês');
    unmount();
    render(<Harness initial={{ preset: 'custom', from: '2026-10-01', to: '2026-10-30' }} />);
    expect(trigger()).toHaveTextContent('01/10/2026 – 30/10/2026');
  });

  it('lists only the presets passed by the screen', async () => {
    render(
      <Harness
        presets={PRESETS.filter((p) => ['this_month', 'all'].includes(p.id))}
        allowCustom={false}
      />,
    );
    await userEvent.click(trigger());
    const dialog = screen.getByRole('dialog', { name: 'Escolher período' });
    expect(
      within(dialog)
        .getAllByRole('button')
        .map((b) => b.textContent),
    ).toEqual(['Este mês', 'Qualquer período']);
  });

  it('marks the current preset with aria-pressed and focuses it on open', async () => {
    render(<Harness initial={{ preset: 'last_month' }} />);
    await userEvent.click(trigger());
    const current = screen.getByRole('button', { name: 'Mês passado' });
    expect(current).toHaveAttribute('aria-pressed', 'true');
    expect(current).toHaveFocus();
    expect(screen.getByRole('button', { name: 'Este mês' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('picks a preset and closes returning focus', async () => {
    const spy = vi.fn();
    render(<Harness spy={spy} />);
    await userEvent.click(trigger());
    await userEvent.click(screen.getByRole('button', { name: 'Este ano' }));
    expect(spy).toHaveBeenCalledWith({ preset: 'this_year' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger()).toHaveFocus();
    expect(trigger()).toHaveTextContent('Este ano');
  });

  it('applies a custom range from the calendar', async () => {
    const spy = vi.fn();
    render(<Harness spy={spy} />);
    await userEvent.click(trigger());
    await userEvent.click(screen.getByRole('button', { name: '10 de outubro de 2026' }));
    expect(screen.getByText(/10\/10\/2026 · escolha o último dia/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: '14 de outubro de 2026' }));
    await userEvent.click(screen.getByRole('button', { name: 'Aplicar' }));
    expect(spy).toHaveBeenCalledWith({ preset: 'custom', from: '2026-10-10', to: '2026-10-14' });
    expect(trigger()).toHaveTextContent('10/10/2026 – 14/10/2026');
  });

  it('shows an error when applying without the first day', async () => {
    const spy = vi.fn();
    render(<Harness spy={spy} />);
    await userEvent.click(trigger());
    await userEvent.click(screen.getByRole('button', { name: 'Aplicar' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Escolha o primeiro dia no calendário.');
    expect(spy).not.toHaveBeenCalled();
  });

  it('applies a single day as from and to', async () => {
    const spy = vi.fn();
    render(<Harness spy={spy} />);
    await userEvent.click(trigger());
    await userEvent.click(screen.getByRole('button', { name: '10 de outubro de 2026' }));
    await userEvent.click(screen.getByRole('button', { name: 'Aplicar' }));
    expect(spy).toHaveBeenCalledWith({ preset: 'custom', from: '2026-10-10', to: '2026-10-10' });
  });

  it('emits all without dates', async () => {
    const spy = vi.fn();
    render(<Harness spy={spy} />);
    await userEvent.click(trigger());
    await userEvent.click(screen.getByRole('button', { name: 'Qualquer período' }));
    expect(spy).toHaveBeenCalledWith({ preset: 'all' });
  });

  it('centers the popover under the field in form placement', async () => {
    render(<Harness placement="form" name="range" />);
    await userEvent.click(trigger());
    expect(document.querySelector('input[type="hidden"][name="range"]')).toHaveValue('this_month');
    expect(document.querySelector('input[type="hidden"][name="rangeFrom"]')).toHaveValue(
      '2026-10-01',
    );
    expect(document.querySelector('input[type="hidden"][name="rangeTo"]')).toHaveValue(
      '2026-10-31',
    );
  });

  it('keeps the popover inside a small window, scrolling inside when taller', async () => {
    const proto = HTMLElement.prototype;
    const rect = vi.spyOn(proto, 'getBoundingClientRect').mockReturnValue({
      left: 20,
      right: 340,
      top: 500,
      bottom: 540,
      width: 320,
      height: 40,
      x: 20,
      y: 500,
      toJSON: () => ({}),
    });
    const width = vi.spyOn(proto, 'offsetWidth', 'get').mockReturnValue(500);
    const height = vi.spyOn(proto, 'offsetHeight', 'get').mockReturnValue(900);
    vi.stubGlobal('innerWidth', 360);
    vi.stubGlobal('innerHeight', 640);
    try {
      render(<Harness placement="form" />);
      await userEvent.click(trigger());
      const dialog = screen.getByRole('dialog');
      expect(dialog.style.left).toBe('8px');
      expect(Number.parseFloat(dialog.style.top)).toBeGreaterThanOrEqual(8);
      expect(dialog.style.maxHeight).toBe('624px');
      fireEvent(window, new Event('resize'));
      expect(Number.parseFloat(dialog.style.left)).toBeGreaterThanOrEqual(8);
    } finally {
      rect.mockRestore();
      width.mockRestore();
      height.mockRestore();
      vi.unstubAllGlobals();
    }
  });

  it('closes on Escape and on outside click', async () => {
    render(<Harness />);
    await userEvent.click(trigger());
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger()).toHaveFocus();
    await userEvent.click(trigger());
    await userEvent.click(screen.getByRole('button', { name: 'fora' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(<Harness />);
    expect(await axe(container)).toHaveNoViolations();
    await userEvent.click(trigger());
    expect(await axe(container)).toHaveNoViolations();
  });

  it('hides the label visually but keeps it as the accessible name', () => {
    render(<Harness labelVisible={false} />);
    expect(trigger()).toHaveTextContent('Este mês');
    expect(screen.getByText('Período').className).toMatch(/srOnly/);
  });

  it('shows the label by default', () => {
    render(<Harness />);
    expect(screen.getByText('Período').className).not.toMatch(/srOnly/);
  });

  it('has no axe violations with the hidden label', async () => {
    const { container } = render(<Harness labelVisible={false} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('hides the label with the visually-hidden pattern and keeps the trigger 40 px tall', () => {
    const css = readFileSync(join(import.meta.dirname, 'period-field.module.css'), 'utf8');
    const block = (name: string) => new RegExp(`\\.${name}\\s*\\{([^}]*)\\}`).exec(css)?.[1] ?? '';
    const sr = block('srOnly');
    for (const rule of [
      'position: absolute',
      'width: calc(var(--space) / 4)',
      'height: calc(var(--space) / 4)',
      'overflow: hidden',
      'clip-path: inset(50%)',
    ])
      expect(sr).toContain(rule);
    const control = block('control');
    expect(control).toContain('min-height: calc(var(--space) * 10)');
    expect(control).toContain('box-sizing: border-box');
  });

  it('uses the pt-BR labels by default', async () => {
    render(<Harness />);
    await userEvent.click(trigger());
    expect(screen.getByRole('dialog', { name: 'Escolher período' })).toBeInTheDocument();
    expect(screen.getByText('Personalizado')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Aplicar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Mês anterior' })).toBeInTheDocument();
  });

  it('formats the custom range in the received locale', () => {
    render(
      <Harness
        locale="en-US"
        initial={{ preset: 'custom', from: '2026-10-01', to: '2026-10-30' }}
      />,
    );
    expect(trigger()).toHaveTextContent('10/1/2026 – 10/30/2026');
  });

  it('accepts overridden labels', async () => {
    render(<Harness labels={{ title: 'Pick a period', apply: 'Apply' }} />);
    await userEvent.click(trigger());
    expect(screen.getByRole('dialog', { name: 'Pick a period' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Apply' })).toBeInTheDocument();
  });

  describe('with the system clock changed', () => {
    beforeEach(() => {
      vi.useFakeTimers({ toFake: ['Date'] });
      vi.setSystemTime(new Date(2031, 4, 2));
    });
    afterEach(() => {
      vi.useRealTimers();
    });

    it('resolves the hidden fields from the injected today, not the system clock', () => {
      render(<Harness name="range" />);
      expect(document.querySelector('input[type="hidden"][name="rangeFrom"]')).toHaveValue(
        '2026-10-01',
      );
    });
  });

  it('picks a preset with the keyboard', async () => {
    const user = userEvent.setup();
    const spy = vi.fn();
    render(<Harness spy={spy} />);
    await user.tab();
    expect(trigger()).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('button', { name: 'Este mês' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Mês passado' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(spy).toHaveBeenCalledWith({ preset: 'last_month' });
    expect(trigger()).toHaveFocus();
  });

  it('passes className, style and data attributes to the control', () => {
    render(<Harness className="extra" style={{ marginTop: '4px' }} data-testid="raiz" />);
    const control = screen.getByTestId('raiz');
    expect(control).toBe(trigger());
    expect(control).toHaveClass('extra');
    expect(control).toHaveStyle({ marginTop: '4px' });
  });

  it('forwards the ref to the trigger', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Harness ref={ref} />);
    expect(ref.current).toBe(trigger());
  });
});
