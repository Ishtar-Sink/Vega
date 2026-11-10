import { render, screen, within } from '@testing-library/react';
import { createRef } from 'react';
import { axe } from 'vitest-axe';
import { Topbar } from './topbar';

describe('Topbar', () => {
  it('renders the start, center and end slots in the header', () => {
    render(
      <Topbar start={<span>Início</span>} center={<strong>Meio</strong>} end={<span>Fim</span>} />,
    );
    const header = screen.getByRole('banner');
    expect(header.tagName.toLowerCase()).toBe('header');
    for (const text of ['Início', 'Meio', 'Fim']) {
      expect(within(header).getByText(text)).toBeInTheDocument();
    }
  });

  it('has no axe violations', async () => {
    const { container } = render(<Topbar center="Meio" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('passes className, style and data attributes to the root', () => {
    render(<Topbar className="extra" style={{ marginTop: '4px' }} data-testid="raiz" />);
    const root = screen.getByTestId('raiz');
    expect(root.tagName.toLowerCase()).toBe('header');
    expect(root).toHaveClass('extra');
    expect(root).toHaveStyle({ marginTop: '4px' });
  });

  it('forwards the ref to the root', () => {
    const ref = createRef<HTMLElement>();
    render(<Topbar ref={ref} />);
    expect(ref.current?.tagName.toLowerCase()).toBe('header');
  });
});
