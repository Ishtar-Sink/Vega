import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import {
  AlertTriangleIcon,
  CircleAlertIcon,
  CircleCheckIcon,
  InfoIcon,
  LightbulbIcon,
} from '../icons/interface-icons';
import { contrastRatio } from '../theme/contrast';
import { dark, light } from '../theme/tokens';
import { Callout } from './callout';
import { TONE_ICONS } from './callout.constants';

const TONES = ['neutral', 'accent', 'info', 'success', 'warning', 'danger'] as const;

describe('Callout', () => {
  it.each(TONES)('renders the %s tone with its soft background and icon', (tone) => {
    const { container } = render(<Callout tone={tone}>Texto</Callout>);
    const aside = container.querySelector('aside');
    const svg = aside?.querySelector('svg');
    const Expected = TONE_ICONS[tone];
    expect(aside?.className).toMatch(new RegExp(tone));
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    const reference = render(<Expected />).container.querySelector('svg');
    expect(svg?.innerHTML).toBe(reference?.innerHTML);
  });

  it('maps each tone to its default icon', () => {
    expect(TONE_ICONS.neutral).toBe(InfoIcon);
    expect(TONE_ICONS.info).toBe(InfoIcon);
    expect(TONE_ICONS.accent).toBe(LightbulbIcon);
    expect(TONE_ICONS.success).toBe(CircleCheckIcon);
    expect(TONE_ICONS.warning).toBe(AlertTriangleIcon);
    expect(TONE_ICONS.danger).toBe(CircleAlertIcon);
  });

  it('accepts a custom icon and removes it with false', () => {
    const { container, rerender } = render(
      <Callout icon={<span data-testid="meu" />}>Texto</Callout>,
    );
    expect(screen.getByTestId('meu')).toBeInTheDocument();
    expect(container.querySelector('svg')).toBeNull();
    rerender(
      <Callout tone="warning" icon={false} title="Armadilha">
        Texto
      </Callout>,
    );
    expect(container.querySelector('svg')).toBeNull();
    expect(screen.getByText('Armadilha')).toBeInTheDocument();
    expect(container.querySelector('aside')?.className).toMatch(/warning/);
  });

  it('renders the action at the end', () => {
    render(<Callout action={<button>Fazer backup</button>}>Texto</Callout>);
    const text = screen.getByText('Texto');
    const button = screen.getByRole('button', { name: 'Fazer backup' });
    expect(text.compareDocumentPosition(button) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('names the aside by the title', () => {
    render(<Callout title="Armadilha">Texto</Callout>);
    expect(screen.getByRole('complementary', { name: 'Armadilha' })).toBeInTheDocument();
  });

  it('turns into a polite status only with live="polite"', () => {
    const { rerender } = render(<Callout>Texto</Callout>);
    expect(screen.queryByRole('status')).toBeNull();
    expect(screen.getByRole('complementary')).toBeInTheDocument();
    rerender(<Callout live="polite">Texto</Callout>);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('has no axe violations in every tone', async () => {
    const { container } = render(
      <div>
        {TONES.map((tone) => (
          <Callout key={tone} tone={tone} title={`Título ${tone}`} action={<button>Ok</button>}>
            Texto
          </Callout>
        ))}
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('passes className, style, data attributes and ref to the aside', () => {
    const ref = createRef<HTMLElement>();
    render(
      <Callout ref={ref} className="extra" style={{ margin: 3 }} data-x="1">
        Texto
      </Callout>,
    );
    const aside = screen.getByRole('complementary');
    expect(ref.current).toBe(aside);
    expect(aside).toHaveClass('extra');
    expect(aside).toHaveStyle({ margin: '3px' });
    expect(aside).toHaveAttribute('data-x', '1');
  });

  it('meets AA on every tone in both themes', () => {
    for (const theme of [light, dark]) {
      for (const tone of ['accent', 'info', 'success', 'warning', 'danger'] as const) {
        const soft = theme[`${tone}Soft`];
        expect(contrastRatio(theme[tone], soft)).toBeGreaterThanOrEqual(4.5);
        expect(contrastRatio(theme.text, soft)).toBeGreaterThanOrEqual(4.5);
      }
      expect(contrastRatio(theme.text, theme.surfaceMuted)).toBeGreaterThanOrEqual(4.5);
    }
  });
});
