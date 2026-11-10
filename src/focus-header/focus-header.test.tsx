import { createRef } from 'react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { FocusHeader } from './focus-header';

const progress = { value: 3, max: 8, label: 'Progresso da lição' };
const css = readFileSync(join(import.meta.dirname, 'focus-header.module.css'), 'utf8');

function block(selector: string): string {
  const match = new RegExp(`\\${selector}\\s*\\{([^}]*)\\}`).exec(css);
  return match?.[1] ?? '';
}

describe('FocusHeader', () => {
  it('has no axe violations', async () => {
    const { container } = render(
      <FocusHeader
        title="Função afim"
        position="3/8"
        progress={progress}
        onExit={() => undefined}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('names the exit button Sair by default', () => {
    render(<FocusHeader title="Função afim" onExit={() => undefined} />);
    expect(screen.getByRole('button', { name: 'Sair' })).toBeInTheDocument();
  });

  it('accepts another exit label', () => {
    render(
      <FocusHeader
        title="Revisão"
        onExit={() => undefined}
        labels={{ exit: 'Encerrar revisão' }}
      />,
    );
    expect(screen.getByRole('button', { name: 'Encerrar revisão' })).toBeInTheDocument();
  });

  it('calls onExit on click and with the keyboard', async () => {
    const user = userEvent.setup();
    const onExit = vi.fn();
    render(<FocusHeader title="Função afim" onExit={onExit} />);
    const button = screen.getByRole('button', { name: 'Sair' });
    await user.click(button);
    button.focus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(onExit).toHaveBeenCalledTimes(3);
  });

  it('shows the title, the position and the progress bar', () => {
    render(
      <FocusHeader
        title="Função afim"
        position="3/8"
        progress={progress}
        onExit={() => undefined}
      />,
    );
    expect(screen.getByRole('heading', { level: 1, name: 'Função afim' })).toBeInTheDocument();
    expect(screen.getByText('3/8')).toBeInTheDocument();
    const bar = screen.getByRole('progressbar', { name: 'Progresso da lição' });
    expect(bar).toHaveAttribute('aria-valuenow', '3');
    expect(bar).toHaveAttribute('aria-valuemax', '8');
  });

  it('renders without position and progress', () => {
    render(<FocusHeader title="Função afim" onExit={() => undefined} />);
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  it('passes className, style, data attributes and ref to the header', () => {
    const ref = createRef<HTMLElement>();
    render(
      <FocusHeader
        ref={ref}
        title="Função afim"
        onExit={() => undefined}
        className="extra"
        style={{ opacity: 0.5 }}
        data-testid="raiz"
      />,
    );
    const root = screen.getByTestId('raiz');
    expect(root.tagName).toBe('HEADER');
    expect(root).toHaveClass('extra');
    expect(root).toHaveStyle({ opacity: '0.5' });
    expect(ref.current).toBe(root);
  });

  it('truncates a long title on one line', () => {
    const title = block('.title');
    expect(title).toMatch(/white-space:\s*nowrap/);
    expect(title).toMatch(/overflow:\s*hidden/);
    expect(title).toMatch(/text-overflow:\s*ellipsis/);
    expect(title).toMatch(/min-width:\s*0/);
  });

  it('keeps a 44px exit target', () => {
    const exit = block('.exit');
    expect(exit).toMatch(/width:\s*calc\(var\(--space\) \* 11\)/);
    expect(exit).toMatch(/height:\s*calc\(var\(--space\) \* 11\)/);
  });
});
