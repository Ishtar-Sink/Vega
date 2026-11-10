import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { axe } from 'vitest-axe';
import { BrandLogo } from './brand-logo';

const css = readFileSync(join(import.meta.dirname, 'brand-logo.module.css'), 'utf8');
const svgMark = (
  <svg viewBox="0 0 24 24" data-testid="mark">
    <circle cx="12" cy="12" r="8" />
  </svg>
);

describe('BrandLogo', () => {
  it('has no axe violations', async () => {
    const { container } = render(<BrandLogo name="Vega" mark={svgMark} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders the mark it receives and the name', () => {
    const { container } = render(<BrandLogo name="Vega" mark={svgMark} />);
    expect(screen.getByText('Vega')).toBeInTheDocument();
    const wrapper = container.querySelector('[class*="mark"]');
    expect(wrapper).toContainElement(screen.getByTestId('mark'));
    expect(wrapper).toHaveAttribute('aria-hidden', 'true');
  });

  it('has no Atria mark fixed in the component', () => {
    const { container, unmount } = render(<BrandLogo name="Vega" mark={<span>V</span>} />);
    expect(container.querySelector('svg, path')).toBeNull();
    unmount();
    const { container: withSvg } = render(<BrandLogo name="Vega" mark={svgMark} />);
    expect(withSvg.querySelectorAll('svg')).toHaveLength(1);
    expect(withSvg.querySelector('path')).toBeNull();
  });

  it('keeps the gradient mark and the gradient name in the stylesheet', () => {
    expect(css).toMatch(/\.mark\s*\{[^}]*background:\s*var\(--brand-gradient\)/);
    expect(css).toMatch(/\.mark\s*\{[^}]*box-shadow:\s*var\(--shadow-md\)/);
    expect(css).toMatch(
      /\.name\s*\{[^}]*background:\s*var\(--brand-gradient\)[^}]*color:\s*transparent/,
    );
    expect(css).toMatch(/background-clip:\s*text/);
    expect(css).not.toMatch(/#[0-9a-f]{3,8}\b|\d+(\.\d+)?px|\d+ms/i);
  });

  it('forwards className, style, data attributes and ref to the root div', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <BrandLogo
        name="Vega"
        mark={svgMark}
        className="extra"
        style={{ marginTop: '4px' }}
        data-testid="logo"
        ref={ref}
      />,
    );
    const logo = screen.getByTestId('logo');
    expect(logo).toHaveClass('extra');
    expect(logo.style.marginTop).toBe('4px');
    expect(logo.tagName).toBe('DIV');
    expect(ref.current).toBe(logo);
  });
});
