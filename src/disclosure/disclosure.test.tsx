import { createRef } from 'react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { contrastRatio } from '../theme/contrast';
import { dark, light } from '../theme/tokens';
import { Disclosure } from './disclosure';

const css = readFileSync(join(import.meta.dirname, 'disclosure.module.css'), 'utf8');

function getDetails(container: HTMLElement): HTMLDetailsElement {
  const details = container.querySelector('details');
  if (!details) throw new Error('details não encontrado');
  return details;
}

describe('Disclosure', () => {
  it('renders a native details with the summary as the title', () => {
    const { container } = render(
      <Disclosure title="Dica" icon={<svg data-testid="ico" />} tone="accent">
        Corpo
      </Disclosure>,
    );
    const details = getDetails(container);
    expect(details.querySelector('summary')).toHaveTextContent('Dica');
    expect(screen.getByTestId('ico').closest('[aria-hidden="true"]')).not.toBeNull();
    expect(details.className).toMatch(/accent/);
  });

  it('opens and closes uncontrolled by click and keyboard', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const { container } = render(
      <Disclosure title="Dica" onOpenChange={onOpenChange}>
        Corpo
      </Disclosure>,
    );
    const details = getDetails(container);
    const summary = screen.getByText('Dica');
    await user.click(summary);
    expect(details.open).toBe(true);
    await vi.waitFor(() => {
      expect(onOpenChange).toHaveBeenLastCalledWith(true);
    });
    summary.closest('summary')?.focus();
    await user.keyboard('{Enter}');
    expect(details.open).toBe(false);
    await user.keyboard(' ');
    expect(details.open).toBe(true);
    await vi.waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledTimes(3);
    });
    expect(onOpenChange.mock.calls.map((c: unknown[]) => c[0])).toEqual([true, false, true]);
  });

  it('respects defaultOpen', () => {
    const { container } = render(
      <Disclosure title="Dica" defaultOpen>
        Corpo
      </Disclosure>,
    );
    expect(getDetails(container).open).toBe(true);
  });

  it('stays as received when controlled', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const { container, rerender } = render(
      <Disclosure title="Dica" open onOpenChange={onOpenChange}>
        Corpo
      </Disclosure>,
    );
    await user.click(screen.getByText('Dica'));
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(getDetails(container).open).toBe(true);
    rerender(
      <Disclosure title="Dica" open={false} onOpenChange={onOpenChange}>
        Corpo
      </Disclosure>,
    );
    expect(getDetails(container).open).toBe(false);
  });

  it('keeps the received open without onOpenChange', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Disclosure title="Dica" open>
        Corpo
      </Disclosure>,
    );
    await user.click(screen.getByText('Dica'));
    expect(getDetails(container).open).toBe(true);
    container.querySelector('summary')?.focus();
    await user.keyboard('{Enter}');
    expect(getDetails(container).open).toBe(true);
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <>
        <Disclosure title="Aberto" defaultOpen>
          Corpo
        </Disclosure>
        <Disclosure title="Fechado">Corpo</Disclosure>
      </>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('passes className, style, data attributes and ref to the details', () => {
    const ref = createRef<HTMLDetailsElement>();
    const { container } = render(
      <Disclosure title="Dica" ref={ref} className="extra" style={{ color: 'red' }} data-x="1">
        Corpo
      </Disclosure>,
    );
    const details = getDetails(container);
    expect(ref.current).toBe(details);
    expect(details).toHaveClass('extra');
    expect(details.style.color).toBe('red');
    expect(details).toHaveAttribute('data-x', '1');
  });

  it('keeps the summary at least 44 px tall', () => {
    expect(css).toMatch(/\.summary\s*\{[^}]*min-height:\s*calc\(var\(--space\) \* 11\)/);
  });

  it('animates only with motion tokens and stops with reduced motion', () => {
    const transitions = css.match(/transition:[^;]+;/g) ?? [];
    expect(transitions.length).toBeGreaterThan(0);
    for (const t of transitions.filter((x) => !x.includes('none'))) {
      expect(t).toContain('var(--motion-');
    }
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)[\s\S]*transition:\s*none/);
  });

  it('meets AA on the tone backgrounds in both themes', () => {
    for (const tokens of [light, dark]) {
      expect(contrastRatio(tokens.accent, tokens.accentSoft)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(tokens.warning, tokens.warningSoft)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(tokens.info, tokens.infoSoft)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(tokens.text, tokens.surface)).toBeGreaterThanOrEqual(4.5);
    }
  });
});
