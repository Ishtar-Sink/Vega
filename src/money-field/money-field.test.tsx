import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { vi } from 'vitest';
import { axe } from 'vitest-axe';
import { MoneyField } from './money-field';

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const prefix = brl.format(0).replace(/0,00$/, '');
const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const usdPrefix = usd.format(0).replace(/0\.00$/, '');

function Harness({
  initial = null,
  error,
  calls,
  locale,
  currency,
  label = 'Valor',
}: {
  initial?: number | null;
  error?: string;
  locale?: string;
  currency?: string;
  label?: string;
  calls: (number | null)[];
}) {
  const [value, setValue] = useState<number | null>(initial);
  return (
    <MoneyField
      label={label}
      locale={locale}
      currency={currency}
      valueCents={value}
      error={error}
      onChange={(cents) => {
        calls.push(cents);
        setValue(cents);
      }}
    />
  );
}

describe('MoneyField', () => {
  it('formats while typing and stores the same value in cents', async () => {
    const user = userEvent.setup();
    const calls: (number | null)[] = [];
    render(<Harness calls={calls} />);
    const input = screen.getByLabelText('Valor');
    await user.type(input, '14500');
    expect(input).toHaveValue(`${prefix}14.500`);
    expect(calls[calls.length - 1]).toBe(1450000);
    await user.tab();
    expect(input).toHaveValue(brl.format(14500));
  });

  it('completes the decimals of a pasted value on blur', async () => {
    const user = userEvent.setup();
    const calls: (number | null)[] = [];
    render(<Harness calls={calls} />);
    const input = screen.getByLabelText('Valor');
    await user.click(input);
    await user.paste('14500,5');
    await user.tab();
    expect(input).toHaveValue(brl.format(14500.5));
    expect(calls[calls.length - 1]).toBe(1450050);
  });

  it('sends null when everything is erased and shows the message', async () => {
    const user = userEvent.setup();
    const calls: (number | null)[] = [];
    render(<Harness initial={1000} error="Informe o valor." calls={calls} />);
    const input = screen.getByLabelText('Valor');
    await user.clear(input);
    expect(calls[calls.length - 1]).toBeNull();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('Informe o valor.');
  });

  it('shows the initial cents formatted', () => {
    render(<Harness initial={1450000} calls={[]} />);
    expect(screen.getByLabelText('Valor')).toHaveValue(brl.format(14500));
  });

  it('has no axe violations', async () => {
    const { container } = render(<Harness initial={1450000} calls={[]} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('cb03 formats and stores cents in en-US with USD', async () => {
    const user = userEvent.setup();
    const calls: (number | null)[] = [];
    render(<Harness calls={calls} locale="en-US" currency="USD" />);
    const input = screen.getByLabelText('Valor');
    await user.type(input, '14500.5');
    expect(input).toHaveValue(`${usdPrefix}14,500.5`);
    expect(calls[calls.length - 1]).toBe(1450050);
    await user.tab();
    expect(input).toHaveValue(usd.format(14500.5));
  });

  it('ct12 keeps the label and error texts it receives in another locale', () => {
    render(
      <Harness calls={[]} locale="en-US" currency="USD" label="Amount" error="Enter the amount." />,
    );
    expect(screen.getByLabelText('Amount')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Enter the amount.');
  });

  it('reaches the field with Tab and types with the keyboard', async () => {
    const user = userEvent.setup();
    const calls: (number | null)[] = [];
    render(<Harness calls={calls} />);
    await user.tab();
    expect(screen.getByLabelText('Valor')).toHaveFocus();
    await user.keyboard('25');
    expect(screen.getByLabelText('Valor')).toHaveValue(`${prefix}25`);
    expect(calls[calls.length - 1]).toBe(2500);
  });

  it('updates the text when the value changes from outside', () => {
    const { rerender } = render(<MoneyField label="Valor" valueCents={1000} onChange={vi.fn()} />);
    rerender(<MoneyField label="Valor" valueCents={250000} onChange={vi.fn()} />);
    expect(screen.getByLabelText('Valor')).toHaveValue(brl.format(2500));
  });

  it('ct13 forwards className, style, data attributes and ref to the input', () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <MoneyField
        label="Valor"
        valueCents={null}
        onChange={vi.fn()}
        className="extra"
        style={{ marginTop: 'var(--s2)' }}
        data-kind="money"
        ref={ref}
      />,
    );
    const input = screen.getByLabelText('Valor');
    expect(input).toHaveClass('extra');
    expect(input.className).toMatch(/root/);
    expect(input).toHaveStyle({ marginTop: 'var(--s2)' });
    expect(input).toHaveAttribute('data-kind', 'money');
    expect(input).toHaveAttribute('inputmode', 'decimal');
    expect(input).toHaveAttribute('autocomplete', 'off');
    expect(ref.current).toBe(input);
  });
});
