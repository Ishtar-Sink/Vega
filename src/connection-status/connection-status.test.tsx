import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import {
  CircleAlertIcon,
  CloudCheckIcon,
  RefreshIcon,
  WifiOffIcon,
} from '../icons/interface-icons';
import { contrastRatio } from '../theme/contrast';
import { dark, light } from '../theme/tokens';
import { ConnectionStatus } from './connection-status';
import { STATE_CONFIG } from './connection-status.constants';

const css = readFileSync(join(import.meta.dirname, 'connection-status.module.css'), 'utf8');
const tokensCss = readFileSync(join(import.meta.dirname, '../theme/tokens.css'), 'utf8');
const NOW = 1_700_000_000_000;
const now = () => NOW;
const STATES = ['offline', 'syncing', 'synced', 'error'] as const;
const WORDS = {
  offline: 'Offline',
  syncing: 'Sincronizando',
  synced: 'Tudo sincronizado',
  error: 'Falha ao sincronizar',
};

describe('ConnectionStatus', () => {
  it.each(STATES)('renders the %s state with its icon, word and soft background', (state) => {
    const { container } = render(<ConnectionStatus state={state} />);
    const region = screen.getByRole('status');
    const svg = region.querySelector('svg');
    const Expected = STATE_CONFIG[state].icon;
    const reference = render(<Expected />).container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg?.innerHTML).toBe(reference?.innerHTML);
    expect(region).toHaveTextContent(WORDS[state]);
    expect((container.firstChild as HTMLElement).className).toMatch(new RegExp(state));
  });

  it('maps each state to its tone and icon', () => {
    expect(STATE_CONFIG.offline).toEqual({ icon: WifiOffIcon, tone: 'warning' });
    expect(STATE_CONFIG.syncing).toEqual({ icon: RefreshIcon, tone: 'info' });
    expect(STATE_CONFIG.synced).toEqual({ icon: CloudCheckIcon, tone: 'success' });
    expect(STATE_CONFIG.error).toEqual({ icon: CircleAlertIcon, tone: 'danger' });
  });

  it('renders nothing for online in the chip variant', () => {
    const { container, rerender } = render(<ConnectionStatus state="online" />);
    expect(container).toBeEmptyDOMElement();
    rerender(<ConnectionStatus state="online" variant="chip" />);
    expect(container).toBeEmptyDOMElement();
  });

  it('shows the online word in the detail variant', () => {
    const { rerender } = render(<ConnectionStatus state="online" variant="detail" />);
    const region = screen.getByRole('status');
    expect(region).toHaveTextContent('Online');
    expect(region.querySelector('svg')).toBeNull();
    rerender(<ConnectionStatus state="online" variant="detail" labels={{ online: 'Conectado' }} />);
    expect(screen.getByRole('status')).toHaveTextContent('Conectado');
  });

  it('uses custom labels', () => {
    const labels = {
      online: 'A',
      offline: 'B',
      syncing: () => 'C',
      synced: () => 'D',
      error: 'E',
      pending: (n: number) => `F${String(n)}`,
    };
    const { rerender } = render(<ConnectionStatus state="offline" labels={labels} pending={2} />);
    expect(screen.getByRole('status')).toHaveTextContent('B');
    expect(screen.getByText('F2')).toBeInTheDocument();
    rerender(<ConnectionStatus state="syncing" labels={labels} />);
    expect(screen.getByRole('status')).toHaveTextContent('C');
    rerender(<ConnectionStatus state="synced" labels={labels} />);
    expect(screen.getByRole('status')).toHaveTextContent('D');
    rerender(<ConnectionStatus state="error" labels={labels} />);
    expect(screen.getByRole('status')).toHaveTextContent('E');
    rerender(<ConnectionStatus state="online" variant="detail" labels={labels} />);
    expect(screen.getByRole('status')).toHaveTextContent('A');
  });

  it('announces the state change and keeps the progress out of the status region', () => {
    const { rerender } = render(<ConnectionStatus state="offline" />);
    rerender(<ConnectionStatus state="syncing" progress={{ done: 1, total: 5 }} />);
    expect(screen.getByRole('status')).toHaveTextContent('Sincronizando');
    const visible = screen.getByText('Sincronizando 1 de 5');
    expect(visible.closest('[role="status"]')).toBeNull();
    expect(visible.closest('[aria-hidden="true"]')).toBeNull();
  });

  it('keeps the full text accessible outside the live region', () => {
    const { rerender } = render(
      <ConnectionStatus state="syncing" progress={{ done: 2, total: 5 }} />,
    );
    const sync = screen.getByText('Sincronizando 2 de 5');
    expect(sync.closest('[aria-hidden="true"]')).toBeNull();
    expect(sync.closest('[role="status"]')).toBeNull();
    rerender(
      <ConnectionStatus state="synced" now={now} lastSyncedAt={NOW - 120_000} pending={3} />,
    );
    for (const text of ['Tudo sincronizado · há 2 minutos', '3 na fila']) {
      const el = screen.getByText(text);
      expect(el.closest('[aria-hidden="true"]')).toBeNull();
      expect(el.closest('[role="status"]')).toBeNull();
    }
  });

  it('does not touch the status region when only the progress changes', () => {
    const { rerender } = render(
      <ConnectionStatus state="syncing" progress={{ done: 1, total: 5 }} />,
    );
    const observer = new MutationObserver(() => undefined);
    observer.observe(screen.getByRole('status'), {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
    });
    rerender(<ConnectionStatus state="syncing" progress={{ done: 2, total: 5 }} />);
    expect(observer.takeRecords()).toHaveLength(0);
    observer.disconnect();
    expect(screen.getByText('Sincronizando 2 de 5')).toBeInTheDocument();
  });

  it('uses the text without progress when total is zero', () => {
    const { rerender } = render(
      <ConnectionStatus state="syncing" progress={{ done: 0, total: 0 }} />,
    );
    expect(screen.getByText('Sincronizando')).toBeInTheDocument();
    expect(screen.queryByText(/ de /)).toBeNull();
    const syncing = vi.fn(() => 'X');
    rerender(
      <ConnectionStatus state="syncing" progress={{ done: 0, total: 0 }} labels={{ syncing }} />,
    );
    expect(syncing).toHaveBeenCalledWith(undefined);
  });

  it('shows the pending count outside the status region', () => {
    const { rerender } = render(<ConnectionStatus state="offline" pending={3} />);
    const el = screen.getByText('3 na fila');
    expect(el.closest('[role="status"]')).toBeNull();
    rerender(<ConnectionStatus state="offline" pending={0} />);
    expect(screen.queryByText(/na fila/)).toBeNull();
    rerender(<ConnectionStatus state="offline" />);
    expect(screen.queryByText(/na fila/)).toBeNull();
  });

  it('shows the relative time of lastSyncedAt from the injected now', () => {
    render(
      <ConnectionStatus state="synced" variant="detail" now={now} lastSyncedAt={NOW - 120_000} />,
    );
    expect(screen.getByText('Tudo sincronizado · há 2 minutos')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent(/^Tudo sincronizado$/);
  });

  it.each([
    [30_000, 'há 30 segundos'],
    [3 * 3_600_000, 'há 3 horas'],
    [3 * 86_400_000, 'há 3 dias'],
  ])('changes the unit with the magnitude (%i ms)', (diff, text) => {
    render(<ConnectionStatus state="synced" now={now} lastSyncedAt={NOW - diff} />);
    expect(screen.getByText(`Tudo sincronizado · ${text}`)).toBeInTheDocument();
  });

  it('uses the locale for the relative time', () => {
    render(<ConnectionStatus state="synced" now={now} lastSyncedAt={NOW - 120_000} locale="en" />);
    expect(screen.getByText('Tudo sincronizado · 2 minutes ago')).toBeInTheDocument();
  });

  it('treats a future lastSyncedAt as now', () => {
    render(<ConnectionStatus state="synced" now={now} lastSyncedAt={NOW + 60_000} />);
    expect(screen.getByText('Tudo sincronizado · agora')).toBeInTheDocument();
  });

  it('ignores lastSyncedAt outside the synced state', () => {
    render(<ConnectionStatus state="offline" now={now} lastSyncedAt={NOW - 120_000} />);
    expect(screen.getByRole('status')).toHaveTextContent(/^Offline$/);
    expect(screen.queryByText(/há 2 minutos/)).toBeNull();
  });

  it.each(['chip', 'detail'] as const)(
    'turns the whole box into a button with the action text in %s',
    async (variant) => {
      const onAction = vi.fn();
      const user = userEvent.setup();
      render(
        <ConnectionStatus
          state="error"
          variant={variant}
          pending={2}
          action={{ label: 'Tentar de novo', onAction }}
        />,
      );
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(1);
      const button = screen.getByRole('button', { name: /Tentar de novo/ });
      expect(button).toHaveAttribute('type', 'button');
      expect(button).toHaveTextContent(/Falha ao sincronizar.*2 na fila.*·.*Tentar de novo/);
      await user.click(button);
      button.focus();
      await user.keyboard('{Enter}');
      expect(onAction).toHaveBeenCalledTimes(2);
      expect(css).toMatch(/\.actionText\s*{[^}]*text-decoration:\s*underline/);
      expect(css).toMatch(/\.actionText\s*{[^}]*color:\s*currentColor/);
      expect(css).not.toMatch(/\.button\s*{[^}]*background:\s*var\(--primary\)/);
    },
  );

  it('keeps the status region outside the action button', () => {
    const { rerender } = render(
      <ConnectionStatus state="error" action={{ label: 'Tentar de novo', onAction: vi.fn() }} />,
    );
    const status = screen.getByRole('status');
    expect(status.closest('button')).toBeNull();
    expect(status).toHaveTextContent(/^Falha ao sincronizar$/);
    rerender(
      <ConnectionStatus state="offline" action={{ label: 'Tentar de novo', onAction: vi.fn() }} />,
    );
    expect(screen.getByRole('status')).toHaveTextContent(/^Offline$/);
  });

  it('keeps a plain box without an action', () => {
    render(<ConnectionStatus state="error" pending={2} />);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('passes className, style, data attributes and ref to the root', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <ConnectionStatus
        state="offline"
        ref={ref}
        className="extra"
        style={{ opacity: 0.5 }}
        data-x="1"
      />,
    );
    const root = container.firstChild as HTMLElement;
    expect(ref.current).toBe(root);
    expect(root).toHaveClass('extra');
    expect(root).toHaveStyle({ opacity: '0.5' });
    expect(root).toHaveAttribute('data-x', '1');
  });

  it.each([
    ['chip', 'offline'],
    ['chip', 'syncing'],
    ['chip', 'synced'],
    ['chip', 'error'],
    ['detail', 'online'],
    ['detail', 'offline'],
    ['detail', 'syncing'],
    ['detail', 'synced'],
    ['detail', 'error'],
  ] as const)('has no axe violations in %s / %s', async (variant, state) => {
    const { container } = render(
      <ConnectionStatus
        state={state}
        variant={variant}
        progress={{ done: 1, total: 5 }}
        pending={3}
        now={now}
        lastSyncedAt={NOW - 120_000}
        action={{ label: 'Tentar de novo', onAction: () => undefined }}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it.each([
    ['light', light],
    ['dark', dark],
  ] as const)('meets AA on every state in the %s theme', (_name, t) => {
    const pairs = [
      [t.warning, t.warningSoft],
      [t.info, t.infoSoft],
      [t.success, t.successSoft],
      [t.danger, t.dangerSoft],
      [t.text, t.warningSoft],
      [t.text, t.infoSoft],
      [t.text, t.successSoft],
      [t.text, t.dangerSoft],
      [t.text, t.surfaceMuted],
    ] as const;
    for (const [fg, bg] of pairs) {
      expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('changes state with --motion-fast only and no animation', () => {
    expect(css).toContain('var(--motion-fast)');
    expect(css).not.toMatch(/animation|@keyframes|infinite/);
    expect(tokensCss).toMatch(
      /@media \(prefers-reduced-motion: reduce\)\s*{\s*:root\s*{[^}]*--motion-fast:\s*0ms/,
    );
  });
});
