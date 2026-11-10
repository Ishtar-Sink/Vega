import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Checkbox } from './checkbox';

describe('Checkbox', () => {
  it('has no axe violations', async () => {
    const { container } = render(<Checkbox label="Concluída" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('toggles with the keyboard', async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Concluída" />);
    const box = screen.getByRole('checkbox', { name: 'Concluída' });
    await user.tab();
    expect(box).toHaveFocus();
    await user.keyboard(' ');
    expect(box).toBeChecked();
  });

  it('is labelled by the label prop and toggles on click', async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Concluída" />);
    const box = screen.getByRole('checkbox', { name: 'Concluída' });
    await user.click(box);
    expect(box).toBeChecked();
  });

  it('ct13 forwards className, style, data attributes and ref to the input', () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <Checkbox
        label="Concluída"
        ref={ref}
        className="extra"
        style={{ marginTop: 'var(--s2)' }}
        data-kind="flag"
      />,
    );
    const box = screen.getByRole('checkbox', { name: 'Concluída' });
    expect(box).toHaveClass('extra');
    expect(box.className).toMatch(/control/);
    expect(box.style.marginTop).toBe('var(--s2)');
    expect(box).toHaveAttribute('data-kind', 'flag');
    expect(ref.current).toBe(box);
  });
});
