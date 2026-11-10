import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { ErrorState } from './error-state';

describe('ErrorState', () => {
  it('has no axe violations', async () => {
    const { container } = render(
      <ErrorState
        title="Falhou"
        description="Tente de novo."
        retryLabel="Tentar de novo"
        onRetry={() => undefined}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders title and explanation', () => {
    render(<ErrorState title="Falhou" description="Tente de novo." />);
    expect(screen.getByRole('alert')).toHaveTextContent('Falhou');
    expect(screen.getByText('Tente de novo.')).toBeInTheDocument();
  });

  it('calls onRetry', async () => {
    const onRetry = vi.fn();
    render(<ErrorState title="Falhou" retryLabel="Tentar de novo" onRetry={onRetry} />);
    await userEvent.click(screen.getByRole('button', { name: 'Tentar de novo' }));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('uses the pt-BR texts by default', () => {
    render(<ErrorState onRetry={() => undefined} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Não foi possível carregar.');
    expect(screen.getByRole('button', { name: 'Tentar de novo' })).toBeInTheDocument();
  });

  it('accepts overridden texts', () => {
    render(
      <ErrorState
        title="Failed"
        description="Try again later."
        retryLabel="Retry"
        onRetry={() => undefined}
      />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Failed');
    expect(screen.getByText('Try again later.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
  });

  it('hides the retry button without onRetry', () => {
    render(<ErrorState />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('retries with the keyboard', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(<ErrorState onRetry={onRetry} />);
    await user.tab();
    expect(screen.getByRole('button', { name: 'Tentar de novo' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('passes className, style and data attributes to the root', () => {
    render(<ErrorState className="extra" style={{ marginTop: '4px' }} data-testid="raiz" />);
    const root = screen.getByTestId('raiz');
    expect(root).toHaveClass('extra');
    expect(root).toHaveStyle({ marginTop: '4px' });
    expect(root).toHaveAttribute('role', 'alert');
  });
});
