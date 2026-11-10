import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { axe } from 'vitest-axe';
import { ColorPicker } from './color-picker';

beforeAll(() => {
  if (typeof HTMLDialogElement.prototype.showModal !== 'function') {
    HTMLDialogElement.prototype.showModal = function showModal() {
      this.setAttribute('open', '');
    };
  }
  if (typeof HTMLDialogElement.prototype.close !== 'function') {
    HTMLDialogElement.prototype.close = function close() {
      this.removeAttribute('open');
    };
  }
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(
    () =>
      ({
        createImageData: (width: number, height: number) => ({
          data: new Uint8ClampedArray(width * height * 4),
          width,
          height,
        }),
        putImageData: () => undefined,
      }) as unknown as CanvasRenderingContext2D,
  );
});

afterAll(() => {
  vi.restoreAllMocks();
});

describe('ColorPicker', () => {
  it('has no axe violations', async () => {
    const { container } = render(<ColorPicker value="#7C3AED" onChange={vi.fn()} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('uses the pt-br default labels', () => {
    render(<ColorPicker value="#7C3AED" onChange={vi.fn()} />);
    const wheel = screen.getByRole('slider', { name: 'Roda de cores' });
    expect(wheel).toHaveAttribute('aria-valuetext', 'Matiz 262 graus, saturação 83%');
    expect(screen.getByLabelText('HEX')).toHaveValue('#7C3AED');
    expect(screen.getByRole('group', { name: 'RGB' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'HSL' })).toBeInTheDocument();
    expect(
      screen.getByLabelText('Luminosidade', { selector: 'input[type="range"]' }),
    ).toBeInTheDocument();
  });

  it('changes the hue with the arrow keys and reports the HEX', async () => {
    const spy = vi.fn();
    render(<ColorPicker value="#7C3AED" onChange={spy} />);
    screen.getByRole('slider', { name: 'Roda de cores' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('slider', { name: 'Roda de cores' })).toHaveAttribute(
      'aria-valuenow',
      '263',
    );
    expect(spy).toHaveBeenCalledWith(expect.stringMatching(/^#[0-9A-F]{6}$/));
  });

  it('ct12 shows the overridden labels', () => {
    render(
      <ColorPicker
        value="#7C3AED"
        onChange={vi.fn()}
        labels={{
          wheel: 'Color wheel',
          hex: 'Hex code',
          wheelValue: (hue, saturation) => `Hue ${String(hue)}°, saturation ${String(saturation)}%`,
        }}
      />,
    );
    expect(screen.getByRole('slider', { name: 'Color wheel' })).toHaveAttribute(
      'aria-valuetext',
      'Hue 262°, saturation 83%',
    );
    expect(screen.getByLabelText('Hex code')).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'RGB' })).toBeInTheDocument();
    expect(
      screen.getByLabelText('Luminosidade', { selector: 'input[type="range"]' }),
    ).toBeInTheDocument();
  });

  it('ct13 forwards className, style, data attributes and ref to the root', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <ColorPicker
        ref={ref}
        value="#7C3AED"
        onChange={vi.fn()}
        className="extra"
        style={{ marginTop: 'var(--s2)' }}
        data-kind="picker"
      />,
    );
    const root = ref.current;
    expect(root).toContainElement(screen.getByRole('slider', { name: 'Roda de cores' }));
    expect(root).toHaveClass('extra');
    expect(root?.className.split(' ').length).toBeGreaterThan(1);
    expect(root).toHaveStyle({ marginTop: 'var(--s2)' });
    expect(root).toHaveAttribute('data-kind', 'picker');
  });

  // Regressão: sem reset global no app, controles de largura total com padding passavam da borda.
  it('keeps the full-width controls inside their container with box-sizing border-box', () => {
    const css = readFileSync(join(import.meta.dirname, 'color-field.module.css'), 'utf8');
    for (const selector of ['trigger', 'input']) {
      const block = new RegExp(`\\.${selector}\\s*\\{([^}]*)\\}`).exec(css)?.[1] ?? '';
      expect(block).toMatch(/box-sizing:\s*border-box/);
    }
  });
});
