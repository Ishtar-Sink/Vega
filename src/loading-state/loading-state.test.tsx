import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { contrastRatio } from '../theme/contrast';
import { dark, light } from '../theme/tokens';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { LoadingState, Skeleton } from './loading-state';

describe('LoadingState', () => {
  it('has no axe violations', async () => {
    const { container } = render(<LoadingState label="Carregando" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('marks the region as busy', () => {
    render(<LoadingState label="Carregando" />);
    const region = screen.getByRole('status');
    expect(region).toHaveAttribute('aria-busy', 'true');
    expect(region).toHaveTextContent('Carregando');
  });

  it('announces Carregando by default', () => {
    render(<LoadingState />);
    const region = screen.getByRole('status');
    expect(region).toHaveAttribute('aria-busy', 'true');
    expect(region).toHaveTextContent('Carregando');
  });

  it('accepts another label', () => {
    render(<LoadingState label="Loading" />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading');
  });

  it('keeps aria-busy even when another value is passed', () => {
    render(<LoadingState aria-busy={false} />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true');
  });

  it('renders the requested skeleton rows', () => {
    const { container } = render(<Skeleton rows={4} />);
    expect(container.querySelectorAll('i')).toHaveLength(4);
  });

  it('hides the skeleton from assistive technology', () => {
    render(<Skeleton data-testid="esqueleto" />);
    expect(screen.getByTestId('esqueleto')).toHaveAttribute('aria-hidden', 'true');
  });

  it('passes className, style and data attributes to the root of LoadingState', () => {
    render(<LoadingState className="extra" style={{ marginTop: '4px' }} data-testid="raiz" />);
    const root = screen.getByTestId('raiz');
    expect(root).toHaveClass('extra');
    expect(root).toHaveStyle({ marginTop: '4px' });
    expect(root).toHaveAttribute('role', 'status');
  });

  it('passes className, style and data attributes to the root of Skeleton', () => {
    render(<Skeleton className="extra" style={{ marginTop: '4px' }} data-testid="raiz" />);
    const root = screen.getByTestId('raiz');
    expect(root).toHaveClass('extra');
    expect(root).toHaveStyle({ marginTop: '4px' });
  });
});

// Regressão: com `surfaceMuted`, as linhas do esqueleto quase sumiam no tema escuro.
describe('Skeleton visibility', () => {
  it('paints the rows with surface-hover, more visible than surface-muted on bg in both themes', () => {
    const css = readFileSync(join(import.meta.dirname, 'loading-state.module.css'), 'utf8');
    const row = /\.row\s*\{([^}]*)\}/.exec(css)?.[1] ?? '';
    expect(row).toMatch(/background:\s*var\(--surface-hover\)/);
    for (const theme of [light, dark]) {
      expect(contrastRatio(theme.surfaceHover, theme.bg)).toBeGreaterThan(
        contrastRatio(theme.surfaceMuted, theme.bg),
      );
    }
  });
});
