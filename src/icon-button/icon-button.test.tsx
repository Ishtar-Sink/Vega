import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { IconButton } from './icon-button';

describe('IconButton', () => {
  it('has no axe violations', async () => {
    const { container } = render(<IconButton aria-label="Fechar" icon={<svg />} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('exposes the aria-label', () => {
    render(<IconButton aria-label="Fechar" icon={<svg data-testid="icon" />} />);
    expect(screen.getByRole('button', { name: 'Fechar' })).toBeInTheDocument();
    expect(screen.getByTestId('icon').parentElement).toHaveAttribute('aria-hidden', 'true');
  });

  it('activates with the keyboard', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<IconButton aria-label="Fechar" icon={<svg />} onClick={onClick} />);
    await user.tab();
    expect(screen.getByRole('button', { name: 'Fechar' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('applies the variant class and defaults to type button', () => {
    const { rerender } = render(<IconButton aria-label="Fechar" icon={<svg />} />);
    const button = screen.getByRole('button', { name: 'Fechar' });
    expect(button.className).toMatch(/ghost/);
    expect(button).toHaveAttribute('type', 'button');
    rerender(<IconButton aria-label="Fechar" icon={<svg />} variant="secondary" />);
    expect(screen.getByRole('button', { name: 'Fechar' }).className).toMatch(/secondary/);
  });

  it('ct13 forwards className, style, data attributes and ref to the button', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <IconButton
        aria-label="Fechar"
        icon={<svg />}
        className="extra"
        style={{ marginTop: 'var(--s2)' }}
        data-kind="close"
        ref={ref}
      />,
    );
    const button = screen.getByRole('button', { name: 'Fechar' });
    expect(button).toHaveClass('extra');
    expect(button.className).toMatch(/root/);
    expect(button.style.marginTop).toBe('var(--s2)');
    expect(button).toHaveAttribute('data-kind', 'close');
    expect(ref.current).toBe(button);
  });

  it('requires aria-label and refuses children in the props type', () => {
    // @ts-expect-error aria-label é obrigatório num botão só com ícone
    const unnamed = <IconButton icon={<svg />} />;
    // @ts-expect-error o botão só com ícone não recebe texto
    // prettier-ignore
    const withText = <IconButton aria-label="Fechar" icon={<svg />}>Fechar</IconButton>;
    expect([unnamed, withText]).toHaveLength(2);
  });
});
