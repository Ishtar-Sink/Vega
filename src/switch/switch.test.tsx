import { createRef, useState } from 'react';
import { readFileSync } from 'node:fs';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Switch } from './switch';

const css = readFileSync('src/switch/switch.module.css', 'utf8');

interface HarnessProps {
  initial?: boolean;
  help?: string;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

function Harness({ initial = false, help, disabled, onCheckedChange }: HarnessProps) {
  const [checked, setChecked] = useState(initial);
  return (
    <Switch
      label="Disponível offline"
      help={help}
      disabled={disabled}
      checked={checked}
      onCheckedChange={(value) => {
        setChecked(value);
        onCheckedChange?.(value);
      }}
    />
  );
}

describe('Switch', () => {
  it('has no axe violations', async () => {
    const off = render(<Harness help="12 MB" />);
    expect(await axe(off.container)).toHaveNoViolations();
    off.unmount();
    const on = render(<Harness initial help="12 MB" />);
    expect(await axe(on.container)).toHaveNoViolations();
  });

  it('has the switch role named by the label', () => {
    render(<Harness />);
    const control = screen.getByRole('switch', { name: 'Disponível offline' });
    expect(control).toHaveAttribute('aria-checked', 'false');
  });

  it('links the help text by aria-describedby', () => {
    render(<Harness help="12 MB" />);
    const control = screen.getByRole('switch');
    expect(control).toHaveAccessibleDescription('12 MB');
  });

  it('toggles on click', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Harness onCheckedChange={onCheckedChange} />);
    const control = screen.getByRole('switch');
    await user.click(control);
    expect(control).toHaveAttribute('aria-checked', 'true');
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('toggles with Space and Enter', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Harness onCheckedChange={onCheckedChange} />);
    const control = screen.getByRole('switch');
    control.focus();
    await user.keyboard(' ');
    expect(control).toHaveAttribute('aria-checked', 'true');
    await user.keyboard('{Enter}');
    expect(control).toHaveAttribute('aria-checked', 'false');
    expect(onCheckedChange).toHaveBeenCalledTimes(2);
  });

  it('toggles when the label is clicked', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByText('Disponível offline'));
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });

  it('does not toggle when disabled', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Harness disabled onCheckedChange={onCheckedChange} />);
    const control = screen.getByRole('switch');
    await user.click(control);
    control.focus();
    await user.keyboard(' ');
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it('passes className, style, data attributes and ref to the button', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Switch
        ref={ref}
        label="Disponível offline"
        checked={false}
        onCheckedChange={() => undefined}
        className="extra"
        style={{ marginTop: '4px' }}
        data-testid="raiz"
      />,
    );
    const control = screen.getByRole('switch');
    expect(control).toHaveClass('extra');
    expect(control).toHaveStyle({ marginTop: '4px' });
    expect(control).toHaveAttribute('data-testid', 'raiz');
    expect(ref.current).toBe(control);
  });

  it('keeps a 44px touch target', () => {
    const block = /\.root\s*\{[^}]*\}/.exec(css)?.[0] ?? '';
    expect(block).toMatch(/min-height:\s*calc\(var\(--space\) \* 11\)/);
  });

  it('shows the state by the thumb position, not only the color', () => {
    expect(css).toMatch(/\[aria-checked='true'\]\s+\.thumb\s*\{[^}]*transform:/);
  });
});
