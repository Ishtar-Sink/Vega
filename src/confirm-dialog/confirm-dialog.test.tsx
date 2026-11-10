import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState, type ComponentProps } from 'react';
import { axe } from 'vitest-axe';
import { ConfirmDialog } from './confirm-dialog';

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
    this.setAttribute('open', '');
  });
  HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
    this.removeAttribute('open');
  });
});

function Harness({
  onConfirm = () => undefined,
  ...props
}: { onConfirm?: () => void } & Partial<ComponentProps<typeof ConfirmDialog>>) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
        }}
      >
        Excluir
      </button>
      <ConfirmDialog
        open={open}
        title="Excluir item?"
        description="Isto não pode ser desfeito."
        onConfirm={onConfirm}
        onCancel={() => {
          setOpen(false);
        }}
        {...props}
      />
    </>
  );
}

describe('ConfirmDialog', () => {
  it('has no axe violations', async () => {
    const user = userEvent.setup();
    const { container } = render(<Harness />);
    await user.click(screen.getByRole('button', { name: 'Excluir' }));
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('traps focus and closes on Escape', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole('button', { name: 'Excluir' }));
    const cancel = screen.getByRole('button', { name: 'Cancelar' });
    const confirm = screen.getByRole('button', { name: 'Confirmar' });
    expect(cancel).toHaveFocus();
    await user.tab();
    expect(confirm).toHaveFocus();
    await user.tab();
    expect(cancel).toHaveFocus();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });

  it('returns focus to the trigger', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const trigger = screen.getByRole('button', { name: 'Excluir' });
    await user.click(trigger);
    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(trigger).toHaveFocus();
  });

  it('calls onConfirm', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(<Harness onConfirm={onConfirm} />);
    await user.click(screen.getByRole('button', { name: 'Excluir' }));
    await user.click(screen.getByRole('button', { name: 'Confirmar' }));
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it('is built on Dialog, with the actions after the description', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole('button', { name: 'Excluir' }));
    const dialog = screen.getByRole('alertdialog');
    expect(dialog.querySelector('[data-dialog-body]')).toHaveTextContent(
      'Isto não pode ser desfeito.',
    );
    const actions = dialog.querySelector('[data-dialog-actions]');
    expect(actions).toContainElement(screen.getByRole('button', { name: 'Cancelar' }));
    expect(actions).toContainElement(screen.getByRole('button', { name: 'Confirmar' }));
  });

  it('uses Confirmar and Cancelar by default', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole('button', { name: 'Excluir' }));
    expect(screen.getByRole('button', { name: 'Confirmar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument();
  });

  it('accepts overridden labels', async () => {
    const user = userEvent.setup();
    render(<Harness confirmLabel="Excluir" cancelLabel="Voltar" />);
    await user.click(screen.getByRole('button', { name: 'Excluir' }));
    const dialog = screen.getByRole('alertdialog');
    expect(within(dialog).getByRole('button', { name: 'Voltar' })).toBeInTheDocument();
    expect(within(dialog).getByRole('button', { name: 'Excluir' })).toBeInTheDocument();
  });

  it('confirms with the keyboard', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(<Harness onConfirm={onConfirm} />);
    await user.click(screen.getByRole('button', { name: 'Excluir' }));
    await user.tab();
    expect(screen.getByRole('button', { name: 'Confirmar' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it('passes className, style and data attributes to the dialog', async () => {
    const user = userEvent.setup();
    render(<Harness className="extra" style={{ marginTop: '4px' }} data-testid="raiz" />);
    await user.click(screen.getByRole('button', { name: 'Excluir' }));
    const root = screen.getByTestId('raiz');
    expect(root.tagName).toBe('DIALOG');
    expect(root).toHaveClass('extra');
    expect(root).toHaveStyle({ marginTop: '4px' });
  });
});
