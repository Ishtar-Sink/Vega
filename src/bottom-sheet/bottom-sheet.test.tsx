import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { axe } from 'vitest-axe';
import { BottomSheet } from './bottom-sheet';
import type { BottomSheetProps } from './bottom-sheet.types';

const showModal = vi.fn(function (this: HTMLDialogElement) {
  this.setAttribute('open', '');
});
const close = vi.fn(function (this: HTMLDialogElement) {
  this.removeAttribute('open');
});

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = showModal;
  HTMLDialogElement.prototype.close = close;
});

const css = readFileSync(join(__dirname, 'bottom-sheet.module.css'), 'utf8');

function Harness(props: Partial<Omit<BottomSheetProps, 'open'>> & { initialOpen?: boolean }) {
  const [open, setOpen] = useState(props.initialOpen ?? false);
  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
        }}
      >
        Abrir
      </button>
      <button
        type="button"
        onClick={() => {
          setOpen(false);
        }}
      >
        Fechar por fora
      </button>
      <BottomSheet
        title="Questões"
        description="Escolha uma questão"
        footer={<button type="button">Entregar</button>}
        {...props}
        open={open}
        onClose={() => {
          props.onClose?.();
          setOpen(false);
        }}
      >
        <button type="button">Um</button>
        <button type="button">Dois</button>
      </BottomSheet>
    </>
  );
}

async function openIt() {
  const user = userEvent.setup();
  await user.click(screen.getByRole('button', { name: 'Abrir' }));
  return user;
}

describe('BottomSheet', () => {
  beforeEach(() => {
    showModal.mockClear();
    close.mockClear();
  });

  it('opens with the native showModal and names the dialog by the title', async () => {
    render(<Harness />);
    await openIt();
    const dialog = screen.getByRole('dialog', { name: 'Questões' });
    expect(dialog.tagName).toBe('DIALOG');
    expect(showModal).toHaveBeenCalled();
    const descId = dialog.getAttribute('aria-describedby');
    expect(descId && document.getElementById(descId)?.textContent).toBe('Escolha uma questão');
  });

  it('closes on Escape, on the backdrop and on the close button', async () => {
    const onClose = vi.fn();
    render(<Harness onClose={onClose} />);
    await openIt();
    fireEvent(screen.getByRole('dialog'), new Event('cancel', { cancelable: true }));
    expect(onClose).toHaveBeenCalledTimes(1);
    const user = await openIt();
    await user.click(screen.getByRole('dialog'));
    expect(onClose).toHaveBeenCalledTimes(2);
    await user.click(screen.getByRole('button', { name: 'Abrir' }));
    await user.click(screen.getByRole('button', { name: 'Fechar' }));
    expect(onClose).toHaveBeenCalledTimes(3);
  });

  it('returns focus to the trigger', async () => {
    render(<Harness />);
    const user = await openIt();
    await user.click(screen.getByRole('button', { name: 'Fechar' }));
    expect(screen.getByRole('button', { name: 'Abrir' })).toHaveFocus();
  });

  it('traps Tab inside the sheet', async () => {
    render(<Harness />);
    const user = await openIt();
    expect(screen.getByRole('button', { name: 'Um' })).toHaveFocus();
    screen.getByRole('button', { name: 'Entregar' }).focus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Fechar' })).toHaveFocus();
    await user.tab({ shift: true });
    expect(screen.getByRole('button', { name: 'Entregar' })).toHaveFocus();
  });

  it('closes when open turns false from outside', async () => {
    render(<Harness />);
    const user = await openIt();
    await user.click(screen.getByRole('button', { name: 'Fechar por fora' }));
    expect(close).toHaveBeenCalled();
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.getByRole('button', { name: 'Abrir' })).toHaveFocus();
  });

  it('uses Fechar by default and accepts another close label', async () => {
    render(<Harness labels={{ close: 'Close' }} />);
    await openIt();
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Fechar' })).toBeNull();
  });

  it('keeps the footer outside the scrolling body', async () => {
    render(<Harness />);
    await openIt();
    const footer = screen.getByRole('button', { name: 'Entregar' });
    expect(footer.closest('[class*="body"]')).toBeNull();
    expect(screen.getByRole('button', { name: 'Um' }).closest('[class*="body"]')).not.toBeNull();
  });

  it('applies the placement class', () => {
    for (const [placement, expected] of [
      ['bottom', 'bottom'],
      ['side', 'side'],
      [undefined, 'auto'],
    ] as const) {
      const { unmount } = render(<Harness placement={placement} initialOpen />);
      expect(screen.getByRole('dialog').className).toContain(expected);
      unmount();
    }
  });

  it('moves to the side from 720 px in auto', () => {
    const media = css.slice(css.indexOf('@media (min-width: 720px)'));
    expect(css).toContain('@media (min-width: 720px)');
    expect(media).toMatch(/\.auto\s*\{[^}]*inset-inline-end:\s*0/);
    const outside = css.slice(0, css.indexOf('@media (min-width: 720px)'));
    expect(outside).toMatch(/\.bottom,\s*\.auto\s*\{[^}]*max-height:\s*85dvh/);
  });

  it('respects the safe area at the bottom', () => {
    expect(css).toContain('env(safe-area-inset-bottom)');
  });

  it('keeps the close button at least 44 px', () => {
    const block = /\.close\s*\{([^}]*)\}/.exec(css)?.[1] ?? '';
    expect(block).toContain('min-width: calc(var(--space) * 11)');
    expect(block).toContain('min-height: calc(var(--space) * 11)');
  });

  it('enters with motion tokens and appears at once with reduced motion', () => {
    expect(css).toContain('var(--motion-base)');
    expect(css).toContain('var(--motion-ease-enter)');
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)\s*\{[^}]*animation:\s*none/);
  });

  it('has no axe violations', async () => {
    const { container } = render(<Harness initialOpen />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('passes className, style, data attributes and ref to the dialog', () => {
    const ref = createRef<HTMLDialogElement>();
    render(<Harness initialOpen className="extra" style={{ color: 'red' }} data-x="1" ref={ref} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('extra');
    expect(dialog).toHaveStyle({ color: 'rgb(255, 0, 0)' });
    expect(dialog).toHaveAttribute('data-x', '1');
    expect(ref.current).toBe(dialog);
  });
});
