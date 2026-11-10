import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { contrastRatio } from '../theme/contrast';
import { dark, light } from '../theme/tokens';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { ProgressBar } from './progress-bar';

describe('ProgressBar', () => {
  it('has no axe violations', async () => {
    const { container } = render(<ProgressBar label="Meta" value={40} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('exposes aria-valuenow, min and max', () => {
    render(<ProgressBar label="Meta" value={40} />);
    const bar = screen.getByRole('progressbar', { name: 'Meta' });
    expect(bar).toHaveAttribute('aria-valuenow', '40');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
  });

  it('clamps the value to 100', () => {
    render(<ProgressBar label="Meta" value={150} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
  });

  it('clamps negative values to 0', () => {
    render(<ProgressBar label="Meta" value={-5} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  });

  it('uses another max', () => {
    render(<ProgressBar label="Meta" value={3} max={4} />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuemax', '4');
    expect(bar.firstElementChild).toHaveStyle({ width: '75%' });
  });

  it('treats a zero max as empty', () => {
    render(<ProgressBar label="Meta" value={3} max={0} />);
    expect(screen.getByRole('progressbar').firstElementChild).toHaveStyle({ width: '0%' });
  });

  it('keeps the progressbar role even when another one is passed', () => {
    render(<ProgressBar label="Meta" value={40} role="status" />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('passes className, style and data attributes to the root', () => {
    render(
      <ProgressBar
        label="Meta"
        value={40}
        className="extra"
        style={{ marginTop: '4px' }}
        data-testid="raiz"
      />,
    );
    const root = screen.getByTestId('raiz');
    expect(root).toHaveClass('extra');
    expect(root).toHaveStyle({ marginTop: '4px' });
    expect(root).toHaveAttribute('role', 'progressbar');
  });
});

// Regressão: com `surfaceMuted`, o trilho vazio da barra sumia no tema escuro.
describe('ProgressBar track visibility', () => {
  it('paints the track with surface-hover, more visible than surface-muted on bg in both themes', () => {
    const css = readFileSync(join(import.meta.dirname, 'progress-bar.module.css'), 'utf8');
    const root = /\.root\s*\{([^}]*)\}/.exec(css)?.[1] ?? '';
    expect(root).toMatch(/background:\s*var\(--surface-hover\)/);
    for (const theme of [light, dark]) {
      expect(contrastRatio(theme.surfaceHover, theme.bg)).toBeGreaterThan(
        contrastRatio(theme.surfaceMuted, theme.bg),
      );
    }
  });
});
