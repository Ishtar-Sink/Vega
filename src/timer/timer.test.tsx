import { createRef } from 'react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Timer } from './timer';
import { dark, light } from '../theme/tokens';
import { contrastRatio } from '../theme/contrast';

const css = readFileSync(join(import.meta.dirname, 'timer.module.css'), 'utf8');
const T0 = Date.UTC(2026, 10, 17, 12, 0, 0);
const MIN = 60_000;
let current = T0;
const now = () => current;

function block(selector: string): string {
  const match = new RegExp(`\\${selector}\\s*\\{([^}]*)\\}`).exec(css);
  return match?.[1] ?? '';
}

function tick(ms: number) {
  act(() => {
    current += ms;
    vi.advanceTimersByTime(ms);
  });
}

function liveRegion(container: HTMLElement): HTMLElement {
  const region = container.querySelector<HTMLElement>('[aria-live="polite"]');
  if (!region) throw new Error('sem região viva');
  return region;
}

// Grava cada texto novo da região viva, lendo as mutações pendentes depois de cada tique.
function recordAnnouncements(region: HTMLElement) {
  const texts: string[] = [];
  const observer = new MutationObserver(() => undefined);
  observer.observe(region, { childList: true, characterData: true, subtree: true });
  const step = (ms: number) => {
    tick(ms);
    const changed = observer.takeRecords().length > 0;
    const text = region.textContent;
    if (changed && text) texts.push(text);
  };
  const stop = () => {
    observer.disconnect();
  };
  return { texts, step, stop };
}

// O asyncWrapper do Testing Library espera um setTimeout(0) e só avança os timers falsos do Jest;
// com os do Vitest, o tempo real precisa avançar o relógio falso. O `now` continua injetado.
function setupUser() {
  vi.useRealTimers();
  vi.useFakeTimers({ shouldAdvanceTime: true });
  return userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
}

beforeEach(() => {
  current = T0;
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('Timer', () => {
  it('has no axe violations', async () => {
    const { container } = render(<Timer endsAt={T0 + 760_000} now={now} warnAt={[30, 10, 5]} />);
    vi.useRealTimers();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('shows endsAt minus now and updates on the next second', () => {
    render(<Timer endsAt={T0 + 760_000} now={now} />);
    expect(screen.getByText('12:40')).toBeInTheDocument();
    tick(1000);
    expect(screen.getByText('12:39')).toBeInTheDocument();
  });

  it('ticks once per second aligned to the turn of the second', () => {
    current = T0 + 250;
    render(<Timer endsAt={T0 + 760_000} now={now} />);
    expect(screen.getByText('12:40')).toBeInTheDocument();
    act(() => {
      current = T0 + 999;
      vi.advanceTimersByTime(749);
    });
    expect(screen.getByText('12:40')).toBeInTheDocument();
    act(() => {
      current = T0 + 1000;
      vi.advanceTimersByTime(1);
    });
    expect(screen.getByText('12:39')).toBeInTheDocument();
  });

  it('derives the time from the clock, not from a counter', () => {
    render(<Timer endsAt={T0 + 760_000} now={now} />);
    expect(screen.getByText('12:40')).toBeInTheDocument();
    act(() => {
      current += 90_000;
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByText('11:10')).toBeInTheDocument();
  });

  it('shows hours as h:mm:ss', () => {
    render(<Timer endsAt={T0 + 16_200_000} now={now} />);
    expect(screen.getByText('4:30:00')).toBeInTheDocument();
  });

  it('counts up from startedAt without warnings or end', () => {
    const { container } = render(<Timer direction="up" startedAt={T0 - 65_000} now={now} />);
    expect(screen.getByText('01:05')).toBeInTheDocument();
    tick(1000);
    expect(screen.getByText('01:06')).toBeInTheDocument();
    expect(
      screen.getByRole('timer', { name: 'Tempo decorrido: 1 minuto e 6 segundos' }),
    ).toBeInTheDocument();
    expect(liveRegion(container)).toBeEmptyDOMElement();
  });

  it('names the timer with the remaining time', () => {
    render(<Timer endsAt={T0 + 760_000} now={now} />);
    expect(
      screen.getByRole('timer', { name: 'Tempo restante: 12 minutos e 40 segundos' }),
    ).toBeInTheDocument();
  });

  it('keeps the visible time out of any live region', () => {
    const { container } = render(<Timer endsAt={T0 + 760_000} now={now} />);
    const time = screen.getByText('12:40');
    const live =
      '[aria-live="polite"], [aria-live="assertive"], [role="status"], [role="alert"], [role="log"]';
    expect(time.closest(live)).toBeNull();
    expect(liveRegion(container).textContent).not.toContain('12:40');
  });

  it('announces each warnAt limit once', () => {
    const { container } = render(<Timer endsAt={T0 + 31 * MIN} now={now} warnAt={[30, 10, 5]} />);
    const region = liveRegion(container);
    expect(region).toBeEmptyDOMElement();
    const rec = recordAnnouncements(region);
    rec.step(MIN);
    expect(region).toHaveTextContent('Faltam 30 minutos.');
    rec.step(1000);
    expect(region).toHaveTextContent('Faltam 30 minutos.');
    rec.step(20 * MIN);
    expect(region).toHaveTextContent('Faltam 10 minutos.');
    rec.step(5 * MIN);
    expect(region).toHaveTextContent('Faltam 5 minutos.');
    rec.stop();
    expect(rec.texts).toEqual(['Faltam 30 minutos.', 'Faltam 10 minutos.', 'Faltam 5 minutos.']);
  });

  it('still announces while the time is hidden', () => {
    const { container } = render(
      <Timer endsAt={T0 + 11 * MIN} now={now} warnAt={[10]} hidden onHiddenChange={vi.fn()} />,
    );
    expect(screen.queryByText('11:00')).not.toBeInTheDocument();
    expect(screen.getByText('tempo')).toBeInTheDocument();
    tick(MIN);
    expect(liveRegion(container)).toHaveTextContent('Faltam 10 minutos.');
  });

  it('announces only the smallest limit when several are crossed at once', () => {
    const { container } = render(<Timer endsAt={T0 + 31 * MIN} now={now} warnAt={[30, 10, 5]} />);
    const region = liveRegion(container);
    const rec = recordAnnouncements(region);
    rec.step(27 * MIN);
    rec.stop();
    expect(region).toHaveTextContent('Faltam 5 minutos.');
    expect(rec.texts).toEqual(['Faltam 5 minutos.']);
  });

  it('does not announce limits already crossed on mount', () => {
    const { container } = render(<Timer endsAt={T0 + 8 * MIN} now={now} warnAt={[30, 10, 5]} />);
    const region = liveRegion(container);
    expect(region).toBeEmptyDOMElement();
    const rec = recordAnnouncements(region);
    rec.step(3 * MIN);
    rec.stop();
    expect(rec.texts).toEqual(['Faltam 5 minutos.']);
  });

  it('re-arms the limits when endsAt moves forward', () => {
    const { container, rerender } = render(
      <Timer endsAt={T0 + 11 * MIN} now={now} warnAt={[10]} />,
    );
    const region = liveRegion(container);
    tick(MIN);
    expect(region).toHaveTextContent('Faltam 10 minutos.');
    rerender(<Timer endsAt={T0 + 26 * MIN} now={now} warnAt={[10]} />);
    expect(screen.getByText('25:00')).toBeInTheDocument();
    tick(1000);
    expect(region).toBeEmptyDOMElement();
    tick(15 * MIN);
    expect(region).toHaveTextContent('Faltam 10 minutos.');
  });

  it('sorts and dedupes warnAt', () => {
    const { container } = render(
      <Timer endsAt={T0 + 31 * MIN} now={now} warnAt={[5, 10, 10, 30]} />,
    );
    const rec = recordAnnouncements(liveRegion(container));
    rec.step(MIN);
    rec.step(1000);
    rec.step(20 * MIN);
    rec.step(5 * MIN);
    rec.stop();
    expect(rec.texts).toEqual(['Faltam 30 minutos.', 'Faltam 10 minutos.', 'Faltam 5 minutos.']);
  });

  it('turns to warning at the smallest warnAt', () => {
    const { container } = render(<Timer endsAt={T0 + 4 * MIN} now={now} warnAt={[30, 10, 3]} />);
    const pill = () => container.querySelector('[data-tone]');
    expect(pill()).toHaveAttribute('data-tone', 'normal');
    expect(pill()?.querySelector('svg')).toBeNull();
    tick(MIN);
    expect(pill()).toHaveAttribute('data-tone', 'warning');
    expect(pill()?.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('turns to warning at 5 minutes without warnAt', () => {
    const { container } = render(<Timer endsAt={T0 + 5 * MIN + 1000} now={now} />);
    const pill = () => container.querySelector('[data-tone]');
    expect(pill()).toHaveAttribute('data-tone', 'normal');
    tick(1000);
    expect(pill()).toHaveAttribute('data-tone', 'warning');
  });

  it('shows 00:00, announces the end and calls onExpire once', () => {
    const onExpire = vi.fn();
    const { container } = render(<Timer endsAt={T0 + 2000} now={now} onExpire={onExpire} />);
    tick(2000);
    expect(screen.getByText('00:00')).toBeInTheDocument();
    expect(liveRegion(container)).toHaveTextContent('O tempo acabou.');
    expect(onExpire).toHaveBeenCalledTimes(1);
    tick(5000);
    expect(onExpire).toHaveBeenCalledTimes(1);
  });

  it('expires on mount without announcing the limits', () => {
    const onExpire = vi.fn();
    const { container } = render(
      <Timer endsAt={T0 - MIN} now={now} warnAt={[30, 10, 5]} onExpire={onExpire} />,
    );
    expect(screen.getByText('00:00')).toBeInTheDocument();
    expect(onExpire).toHaveBeenCalledTimes(1);
    expect(liveRegion(container).textContent).toBe('O tempo acabou.');
  });

  it('hides and shows the time with the keyboard', async () => {
    const user = setupUser();
    render(<Timer endsAt={T0 + 760_000} now={now} />);
    await user.tab();
    expect(screen.getByRole('button', { name: 'Esconder o tempo' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(screen.queryByText('12:40')).not.toBeInTheDocument();
    expect(screen.getByText('tempo')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Mostrar o tempo' })).toHaveFocus();
    await user.keyboard('{ }');
    expect(screen.getByText('12:40')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Esconder o tempo' })).toBeInTheDocument();
  });

  it('works as a controlled component', async () => {
    const user = setupUser();
    const onHiddenChange = vi.fn();
    const { rerender } = render(
      <Timer endsAt={T0 + 760_000} now={now} hidden={false} onHiddenChange={onHiddenChange} />,
    );
    await user.click(screen.getByRole('button', { name: 'Esconder o tempo' }));
    expect(onHiddenChange).toHaveBeenCalledWith(true);
    expect(screen.getByText('12:40')).toBeInTheDocument();
    rerender(<Timer endsAt={T0 + 760_000} now={now} hidden onHiddenChange={onHiddenChange} />);
    expect(screen.queryByText('12:40')).not.toBeInTheDocument();
    expect(screen.getByText('tempo')).toBeInTheDocument();
  });

  it('has no toggle when hideable is false', () => {
    render(<Timer endsAt={T0 + 760_000} now={now} hideable={false} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('accepts other labels', () => {
    const { container } = render(
      <Timer
        endsAt={T0 + 760_000}
        now={now}
        warnAt={[12]}
        labels={{
          hide: 'Hide',
          remaining: (p) => String(p.minutes) + ' min left',
          warning: (m) => String(m) + ' minutes left',
        }}
      />,
    );
    expect(screen.getByRole('button', { name: 'Hide' })).toBeInTheDocument();
    expect(screen.getByRole('timer', { name: '12 min left' })).toBeInTheDocument();
    tick(40_000);
    expect(liveRegion(container)).toHaveTextContent('12 minutes left');
  });

  it('passes className, style, data attributes and ref to the root', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Timer
        ref={ref}
        endsAt={T0 + 760_000}
        now={now}
        className="extra"
        data-testid="timer"
        style={{ marginTop: 4 }}
      />,
    );
    const root = screen.getByRole('timer');
    expect(root.tagName).toBe('DIV');
    expect(root).toHaveClass('extra');
    expect(root).toHaveAttribute('data-testid', 'timer');
    expect(root).toHaveStyle({ marginTop: '4px' });
    expect(ref.current).toBe(root);
  });

  it('uses tabular numbers in the time', () => {
    expect(block('.time')).toMatch(/font-variant-numeric:\s*tabular-nums/);
  });

  it('keeps a 44px toggle target', () => {
    const toggle = block('.toggle');
    expect(toggle).toMatch(/width:\s*calc\(var\(--space\) \* 11\)/);
    expect(toggle).toMatch(/height:\s*calc\(var\(--space\) \* 11\)/);
  });

  it('changes tone with --motion-fast and no animation', () => {
    expect(block('.pill')).toMatch(/transition:[^;]*var\(--motion-fast\)/);
    expect(css).not.toMatch(/animation/);
    expect(css).not.toMatch(/@keyframes/);
  });

  it('passes AA for the warning and normal tones in both themes', () => {
    for (const t of [light, dark]) {
      expect(contrastRatio(t.warning, t.warningSoft)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(t.text, t.surfaceMuted)).toBeGreaterThanOrEqual(4.5);
    }
  });
});
