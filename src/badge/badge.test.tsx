import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { axe } from 'vitest-axe';
import { Badge, type BadgeTone } from './badge';

const css = readFileSync(join(import.meta.dirname, 'badge.module.css'), 'utf8');
const TONES: BadgeTone[] = ['neutral', 'primary', 'accent', 'success', 'warning', 'danger', 'info'];

describe('Badge', () => {
  it('has no axe violations', async () => {
    const { container } = render(<Badge tone="warning">Pendente</Badge>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders children', () => {
    render(<Badge>Novo</Badge>);
    expect(screen.getByText('Novo')).toBeInTheDocument();
  });

  it('maps each tone to the soft background', () => {
    for (const tone of ['primary', 'accent', 'success', 'warning', 'danger', 'info']) {
      expect(css).toMatch(
        new RegExp(
          `\\.${tone}\\s*\\{[^}]*background:\\s*var\\(--${tone}-soft\\);[^}]*color:\\s*var\\(--${tone}\\)`,
        ),
      );
    }
    expect(css).toMatch(
      /\.neutral\s*\{[^}]*background:\s*var\(--surface-muted\);[^}]*color:\s*var\(--text-muted\)/,
    );
    render(<Badge tone="success">Ok</Badge>);
    expect(screen.getByText('Ok').className).toMatch(/success/);
  });

  it('uses the primary tone by default', () => {
    render(<Badge>Novo</Badge>);
    expect(screen.getByText('Novo').className).toMatch(/primary/);
  });

  it('forwards className, style, data attributes and ref to the root span', () => {
    const ref = createRef<HTMLSpanElement>();
    render(
      <Badge className="extra" style={{ marginTop: '4px' }} data-testid="badge" ref={ref}>
        Ok
      </Badge>,
    );
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveClass('extra');
    expect(badge.className).toMatch(/primary/);
    expect(badge.style.marginTop).toBe('4px');
    expect(badge.tagName).toBe('SPAN');
    expect(ref.current).toBe(badge);
  });

  it('has no axe violations in every tone', async () => {
    const { container } = render(
      <div>
        {TONES.map((tone) => (
          <Badge key={tone} tone={tone}>
            {tone}
          </Badge>
        ))}
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('keeps the stylesheet free of literal colors, pixels and durations', () => {
    expect(css).not.toMatch(/#[0-9a-f]{3,8}\b|\d+(\.\d+)?px|\d+ms/i);
  });
});
