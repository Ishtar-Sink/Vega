import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { DayIcon, GridIcon, ListIcon, ShelfIcon, TableIcon, TimelineIcon } from './index';

const icons = { ListIcon, GridIcon, ShelfIcon, TableIcon, DayIcon, TimelineIcon };

describe('view icons', () => {
  it.each(Object.entries(icons))('renders %s as a decorative 18 px svg', (_name, Icon) => {
    const { container } = render(<Icon />);
    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveAttribute('focusable', 'false');
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    expect(svg).toHaveAttribute('width', '18');
    expect(svg).toHaveAttribute('height', '18');
    expect(svg).toHaveAttribute('fill', 'none');
    expect(svg).toHaveAttribute('stroke', 'currentColor');
  });

  it('accepts another size', () => {
    const { container } = render(<ListIcon size={16} />);
    expect(container.querySelector('svg')).toHaveAttribute('width', '16');
  });

  it('passes className, style and data attributes to the svg', () => {
    const { getByTestId } = render(
      <ListIcon className="extra" style={{ marginTop: '4px' }} data-testid="raiz" />,
    );
    const svg = getByTestId('raiz');
    expect(svg.tagName.toLowerCase()).toBe('svg');
    expect(svg).toHaveClass('extra');
    expect(svg).toHaveStyle({ marginTop: '4px' });
  });

  it('keeps aria-hidden even when another value is passed', () => {
    const { container } = render(<ListIcon aria-hidden={false} focusable="true" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveAttribute('focusable', 'false');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <div>
        {Object.entries(icons).map(([name, Icon]) => (
          <button key={name} type="button" aria-label={name}>
            <Icon />
          </button>
        ))}
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
