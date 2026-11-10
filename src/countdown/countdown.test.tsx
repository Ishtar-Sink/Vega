import { createRef } from 'react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Countdown } from './countdown';

const css = readFileSync(join(import.meta.dirname, 'countdown.module.css'), 'utf8');

function block(selector: string): string {
  const match = new RegExp(`\\${selector}\\s*\\{([^}]*)\\}`).exec(css);
  return match?.[1] ?? '';
}

describe('Countdown', () => {
  it('has no axe violations', async () => {
    const { container } = render(
      <Countdown target="2026-12-06" today="2026-11-10" caption="Prova em 06/12, domingo" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('shows the days until the target', () => {
    render(<Countdown target="2026-12-06" today="2026-11-10" />);
    expect(screen.getByText('Faltam 26 dias')).toBeInTheDocument();
  });

  it('has no live region', () => {
    const { container } = render(<Countdown target="2026-12-06" today="2026-11-10" />);
    const live = '[aria-live], [role="status"], [role="alert"], [role="log"], [role="timer"]';
    expect(container.querySelector(live)).toBeNull();
  });

  it('uses the singular for one day', () => {
    render(<Countdown target="2026-11-11" today="2026-11-10" />);
    expect(screen.getByText('Falta 1 dia')).toBeInTheDocument();
  });

  it('shows today and past', () => {
    const { rerender } = render(<Countdown target="2026-11-10" today="2026-11-10" />);
    expect(screen.getByText('É hoje')).toBeInTheDocument();
    rerender(<Countdown target="2026-11-09" today="2026-11-10" />);
    expect(screen.getByText('Já passou')).toBeInTheDocument();
  });

  it('formats the number with the locale', () => {
    const { rerender } = render(<Countdown target="2030-01-01" today="2026-01-01" />);
    expect(screen.getByText('Faltam 1.461 dias')).toBeInTheDocument();
    rerender(
      <Countdown
        target="2030-01-01"
        today="2026-01-01"
        locale="en-US"
        labels={{
          remaining: (days, formatted) => formatted + (days === 1 ? ' day left' : ' days left'),
        }}
      />,
    );
    expect(screen.getByText('1,461 days left')).toBeInTheDocument();
  });

  it('accepts other labels', () => {
    const labels = { today: 'Today', past: 'Over' };
    const { rerender } = render(
      <Countdown target="2026-11-10" today="2026-11-10" labels={labels} />,
    );
    expect(screen.getByText('Today')).toBeInTheDocument();
    rerender(<Countdown target="2026-11-09" today="2026-11-10" labels={labels} />);
    expect(screen.getByText('Over')).toBeInTheDocument();
  });

  it('shows the caption', () => {
    render(<Countdown target="2026-12-06" today="2026-11-10" caption="Prova em 06/12, domingo" />);
    const caption = screen.getByText('Prova em 06/12, domingo');
    expect(caption.closest('p')).toBe(screen.getByText('Faltam 26 dias').closest('p'));
  });

  it('uses the display size by default and inline on request', () => {
    const { rerender } = render(<Countdown target="2026-12-06" today="2026-11-10" />);
    expect(screen.getByText('Faltam 26 dias').closest('p')).toHaveAttribute('data-size', 'display');
    rerender(<Countdown target="2026-12-06" today="2026-11-10" size="inline" />);
    expect(screen.getByText('Faltam 26 dias').closest('p')).toHaveAttribute('data-size', 'inline');
  });

  it('does not depend on the system clock', () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2030-05-05T12:00:00Z'));
    render(<Countdown target="2026-12-06" today="2026-11-10" />);
    expect(screen.getByText('Faltam 26 dias')).toBeInTheDocument();
    vi.useRealTimers();
  });

  it('renders nothing and warns for an invalid date', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const first = render(<Countdown target="2026-02-30" today="2026-11-10" />);
    expect(first.container).toBeEmptyDOMElement();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('Countdown'));
    warn.mockClear();
    const second = render(<Countdown target="2026-12-06" today="ontem" />);
    expect(second.container).toBeEmptyDOMElement();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('Countdown'));
    warn.mockRestore();
  });

  it('does not warn in production', () => {
    vi.stubEnv('NODE_ENV', 'production');
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    render(<Countdown target="2026-02-30" today="2026-11-10" />);
    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
    vi.unstubAllEnvs();
  });

  it('passes className, style, data attributes and ref to the paragraph', () => {
    const ref = createRef<HTMLParagraphElement>();
    render(
      <Countdown
        ref={ref}
        target="2026-12-06"
        today="2026-11-10"
        className="extra"
        data-testid="countdown"
        style={{ marginTop: 4 }}
      />,
    );
    const element = screen.getByTestId('countdown');
    expect(element.tagName).toBe('P');
    expect(element).toHaveClass('extra');
    expect(element).toHaveStyle({ marginTop: '4px' });
    expect(ref.current).toBe(element);
  });

  it('uses the display typography', () => {
    const rules = block('.display .value');
    expect(rules).toMatch(/font-family:\s*var\(--font-display\)/);
    expect(rules).toMatch(/font-size:\s*var\(--font-size-xxxl\)/);
    expect(rules).toMatch(/font-weight:\s*var\(--font-weight-extrabold\)/);
    expect(rules).toMatch(/letter-spacing:\s*calc\(var\(--space\) \* -/);
  });

  it('uses the text size inline', () => {
    expect(block('.inline .value')).toMatch(/font-size:\s*inherit/);
  });
});
