import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { axe } from 'vitest-axe';
import { ItemSwatch } from './item-swatch';
import { pairFor } from './palette';

const css = readFileSync(join(import.meta.dirname, 'item-swatch.module.css'), 'utf8');

function expectedBackground(from: string, to: string): string {
  const probe = document.createElement('div');
  probe.style.background = `linear-gradient(135deg, ${from}, ${to})`;
  return probe.style.background;
}

describe('ItemSwatch', () => {
  it('has no axe violations', async () => {
    const { container } = render(
      <div>
        <ItemSwatch id="abc">A</ItemSwatch>
        <ItemSwatch id="abc" palette={[['#111111', '#222222']]}>
          B
        </ItemSwatch>
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('uses the default theme palette without a palette', () => {
    render(<ItemSwatch id="abc" data-testid="swatch" />);
    const background = screen.getByTestId('swatch').style.background;
    expect(background).toBe(expectedBackground(...pairFor('abc')));
    expect(background).toContain('var(--item-palette-');
    expect(background).not.toContain('#');
    expect(background).not.toContain('rgb(');
  });

  it('uses the palette it receives', () => {
    render(<ItemSwatch id="abc" palette={[['#111111', '#222222']]} data-testid="swatch" />);
    expect(screen.getByTestId('swatch').style.background).toBe(
      expectedBackground('#111111', '#222222'),
    );
  });

  it('renders children and stays decorative', () => {
    render(<ItemSwatch id="abc">A</ItemSwatch>);
    expect(screen.getByText('A')).toHaveAttribute('aria-hidden', 'true');
  });

  it('forwards className, style, data attributes and ref to the root span', () => {
    const ref = createRef<HTMLSpanElement>();
    render(
      <ItemSwatch
        id="abc"
        className="extra"
        style={{ marginTop: '4px' }}
        data-testid="swatch"
        ref={ref}
      />,
    );
    const swatch = screen.getByTestId('swatch');
    expect(swatch).toHaveClass('extra');
    expect(swatch.style.marginTop).toBe('4px');
    expect(swatch.tagName).toBe('SPAN');
    expect(ref.current).toBe(swatch);
    expect(swatch.style.background).toBe(expectedBackground(...pairFor('abc')));
  });

  it('keeps the stylesheet free of literal colors, pixels and durations', () => {
    expect(css).not.toMatch(/#[0-9a-f]{3,8}\b|\d+(\.\d+)?px|\d+ms/i);
  });
});
