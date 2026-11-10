import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Toast, ToastRegion } from './toast';

const css = readFileSync(join(import.meta.dirname, 'toast.module.css'), 'utf8');

describe('Toast', () => {
  it('has no axe violations', async () => {
    const { container } = render(
      <ToastRegion>
        <Toast tone="success">Salvo</Toast>
      </ToastRegion>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('announces with aria-live polite', () => {
    const { container } = render(
      <ToastRegion>
        <Toast>Salvo</Toast>
      </ToastRegion>,
    );
    expect(container.querySelector('[aria-live="polite"]')).toContainElement(
      screen.getByText('Salvo'),
    );
  });

  it('uses the soft background of the tone', () => {
    for (const tone of ['success', 'warning', 'danger', 'info']) {
      expect(css).toMatch(
        new RegExp(`\\.${tone}\\s*\\{[^}]*background:\\s*var\\(--${tone}-soft\\)`),
      );
    }
    render(<Toast tone="danger">Falhou</Toast>);
    expect(screen.getByText('Falhou').closest('div')?.className).toMatch(/danger/);
  });

  it('marks the tone with an icon and a hidden name, not only the color', () => {
    const names = { info: 'Informação', success: 'Sucesso', warning: 'Atenção', danger: 'Erro' };
    for (const [tone, name] of Object.entries(names) as [keyof typeof names, string][]) {
      const view = render(
        <Toast tone={tone} data-testid="aviso">
          Salvo
        </Toast>,
      );
      const root = screen.getByTestId('aviso');
      const icon = root.querySelector('svg');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
      expect(root).toHaveTextContent(`${name}: Salvo`);
      view.unmount();
    }
  });

  it('accepts another tone name', () => {
    render(
      <Toast tone="success" toneLabel="Done" data-testid="aviso">
        Salvo
      </Toast>,
    );
    expect(screen.getByTestId('aviso')).toHaveTextContent('Done: Salvo');
  });

  it('passes className, style and data attributes to the root', () => {
    render(
      <ToastRegion className="r" style={{ marginTop: '4px' }} data-testid="regiao" aria-live="off">
        <Toast className="t" style={{ marginTop: '8px' }} data-testid="aviso">
          Salvo
        </Toast>
      </ToastRegion>,
    );
    const region = screen.getByTestId('regiao');
    expect(region).toHaveClass('r');
    expect(region).toHaveStyle({ marginTop: '4px' });
    expect(region).toHaveAttribute('aria-live', 'polite');
    const toast = screen.getByTestId('aviso');
    expect(toast).toHaveClass('t');
    expect(toast).toHaveStyle({ marginTop: '8px' });
  });
});
