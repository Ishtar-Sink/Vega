import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createRef, useState } from 'react';
import type { ComponentProps } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { contrastRatio } from '../theme/contrast';
import { dark, light } from '../theme/tokens';
import { RadioGroup } from './radio-group';

const options = [
  { value: 'a', label: 'Alfa', marker: 'A', description: 'Primeira letra' },
  { value: 'b', label: 'Beta', marker: 'B' },
  { value: 'c', label: 'Gama', marker: 'C' },
];

type Props = Partial<ComponentProps<typeof RadioGroup>>;

function Harness({ initial = 'a', onChange, ...props }: Props & { initial?: string | null }) {
  const [value, setValue] = useState<string | null>(initial);
  return (
    <RadioGroup
      label="Questão"
      options={options}
      {...props}
      value={value}
      onChange={(next) => {
        setValue(next);
        onChange?.(next);
      }}
    />
  );
}

const css = readFileSync(join(import.meta.dirname, 'radio-group.module.css'), 'utf8');

describe('RadioGroup', () => {
  it('renders a fieldset with the legend and native radios', () => {
    render(<Harness />);
    expect(screen.getByRole('group', { name: 'Questão' })).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(3);
  });

  it('hides the legend visually but keeps the name with hideLabel', () => {
    render(<Harness hideLabel />);
    const legend = screen.getByText('Questão');
    expect(legend.className).toMatch(/srOnly/);
    expect(screen.getByRole('group', { name: 'Questão' })).toBeInTheDocument();
  });

  it('moves the choice with the arrow keys', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Harness onChange={onChange} />);
    screen.getByRole('radio', { name: /Alfa/ }).focus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('radio', { name: /Beta/ })).toBeChecked();
    expect(onChange).toHaveBeenCalledWith('b');
  });

  it('reaches the first enabled option with Tab when value is null', async () => {
    const user = userEvent.setup();
    render(
      <Harness
        initial={null}
        options={[{ value: 'a', label: 'Alfa', disabled: true }, ...options.slice(1)]}
      />,
    );
    await user.tab();
    expect(screen.getByRole('radio', { name: /Beta/ })).toHaveFocus();
  });

  it('renders description, marker, tone and adornment', () => {
    const { container } = render(
      <Harness
        options={[
          {
            value: 'a',
            label: 'Alfa',
            description: 'Primeira letra',
            marker: 'A',
            tone: 'success',
            adornment: <span>selo</span>,
          },
          { value: 'b', label: 'Beta', tone: 'danger' },
          { value: 'c', label: 'Gama', tone: 'neutral' },
        ]}
      />,
    );
    expect(screen.getByText('Primeira letra')).toBeInTheDocument();
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('selo')).toBeInTheDocument();
    const labels = Array.from(container.querySelectorAll('label'));
    const [ok, bad, neutral] = labels;
    expect(ok?.querySelector('svg[aria-hidden="true"]')).not.toBeNull();
    expect(ok?.className).toMatch(/success/);
    expect(bad?.querySelector('svg[aria-hidden="true"]')).not.toBeNull();
    expect(bad?.className).toMatch(/danger/);
    expect(neutral?.querySelector('svg')).toBeNull();
  });

  it('selects by clicking anywhere on the card', async () => {
    const user = userEvent.setup();
    const { container } = render(<Harness variant="card" />);
    expect(container.querySelectorAll('svg')).toHaveLength(1);
    const card = screen.getByRole('radio', { name: /Beta/ }).closest('label');
    expect(card).not.toBeNull();
    if (card) await user.click(card);
    expect(screen.getByRole('radio', { name: /Beta/ })).toBeChecked();
    expect(card?.querySelector('svg')).not.toBeNull();
    expect(container.querySelectorAll('svg')).toHaveLength(1);
  });

  it('keeps the choice with readOnly', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Harness readOnly onChange={onChange} />);
    expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-readonly', 'true');
    screen.getByRole('radio', { name: /Alfa/ }).focus();
    await user.keyboard('{ArrowDown}');
    await user.click(screen.getByRole('radio', { name: /Gama/ }));
    expect(screen.getByRole('radio', { name: /Alfa/ })).toBeChecked();
    expect(screen.getByRole('radio', { name: /Gama/ })).not.toBeChecked();
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getAllByRole('radio')).toHaveLength(3);
  });

  it('links help and error to the group', () => {
    render(<Harness help="Ajuda" error="Escolha uma" />);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('Escolha uma');
    const described = screen
      .getByRole('group', { name: 'Questão' })
      .getAttribute('aria-describedby');
    expect(described).toContain(alert.id);
    expect(described).toContain(screen.getByText('Ajuda').id);
  });

  it('has no axe violations in both variants', async () => {
    const a = render(<Harness />);
    expect(await axe(a.container)).toHaveNoViolations();
    a.unmount();
    const b = render(<Harness variant="card" error="Escolha uma" />);
    expect(await axe(b.container)).toHaveNoViolations();
  });

  it('passes className, style, data attributes and ref to the fieldset', () => {
    const ref = createRef<HTMLFieldSetElement>();
    render(
      <Harness ref={ref} className="extra" style={{ marginTop: 'var(--s2)' }} data-kind="q" />,
    );
    const group = screen.getByRole('group', { name: 'Questão' });
    expect(group).toHaveClass('extra');
    expect(group.className).toMatch(/root/);
    expect(group.style.marginTop).toBe('var(--s2)');
    expect(group).toHaveAttribute('data-kind', 'q');
    expect(ref.current).toBe(group);
  });

  it('keeps the touch target at least 44 px', () => {
    const block = /\.option\s*\{([^}]*)\}/.exec(css)?.[1] ?? '';
    expect(block).toContain('min-height: calc(var(--space) * 11)');
  });

  it('animates only with motion tokens and stops with reduced motion', () => {
    const transitions = (css.match(/transition:[^;]*;/g) ?? []).filter((t) => !t.includes('none'));
    expect(transitions.length).toBeGreaterThan(0);
    for (const t of transitions) expect(t).toContain('var(--motion-');
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)[\s\S]*transition: none/);
  });

  it('meets AA on the tone backgrounds in both themes', () => {
    for (const t of [light, dark]) {
      expect(contrastRatio(t.success, t.successSoft)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(t.danger, t.dangerSoft)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(t.text, t.surfaceMuted)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(t.primary, t.primarySoft)).toBeGreaterThanOrEqual(4.5);
    }
  });
});
