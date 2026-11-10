import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { EmptyState } from './empty-state';

describe('EmptyState', () => {
  it('has no axe violations', async () => {
    const { container } = render(<EmptyState title="Nada aqui" description="Crie o primeiro." />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders title and explanation', () => {
    render(
      <EmptyState
        title="Nada aqui"
        description="Crie o primeiro."
        action={<a href="/">Criar</a>}
      />,
    );
    expect(screen.getByText('Nada aqui')).toBeInTheDocument();
    expect(screen.getByText('Crie o primeiro.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Criar' })).toBeInTheDocument();
  });

  it('renders without an action', () => {
    render(<EmptyState title="Nada aqui" description="Crie o primeiro." />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('passes className, style and data attributes to the root', () => {
    render(
      <EmptyState
        title="Nada aqui"
        description="Crie o primeiro."
        className="extra"
        style={{ marginTop: '4px' }}
        data-testid="raiz"
      />,
    );
    const root = screen.getByTestId('raiz');
    expect(root).toHaveClass('extra');
    expect(root).toHaveStyle({ marginTop: '4px' });
    expect(root.tagName).toBe('DIV');
  });
});
