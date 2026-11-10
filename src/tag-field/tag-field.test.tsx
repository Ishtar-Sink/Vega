import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { axe } from 'vitest-axe';
import { TagField } from './tag-field';

function Harness({ initial = [] }: { initial?: string[] }) {
  const [value, setValue] = useState<string[]>(initial);
  return (
    <TagField
      label="Etiquetas"
      value={value}
      onChange={setValue}
      listLabel="Etiquetas adicionadas"
      removeLabel={(tag) => `Remover ${tag}`}
    />
  );
}

const pills = () => screen.queryAllByRole('listitem').map((item) => item.textContent);

describe('TagField', () => {
  it('adds a pill on Enter and on comma', async () => {
    render(<Harness />);
    const input = screen.getByLabelText('Etiquetas');
    await userEvent.type(input, '#casa{Enter}');
    await userEvent.type(input, 'mercado,');
    expect(pills()).toEqual(['casa×', 'mercado×']);
    expect(input).toHaveValue('');
  });

  it('ignores repeated tags regardless of case', async () => {
    render(<Harness initial={['casa']} />);
    await userEvent.type(screen.getByLabelText('Etiquetas'), 'CASA{Enter}');
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
  });

  it('removes the last pill with Backspace on an empty input', async () => {
    render(<Harness initial={['a', 'b']} />);
    screen.getByLabelText('Etiquetas').focus();
    await userEvent.keyboard('{Backspace}');
    expect(pills()).toEqual(['a×']);
  });

  it('removes a pill with its × button', async () => {
    render(<Harness initial={['a', 'b']} />);
    await userEvent.click(screen.getByRole('button', { name: 'Remover a' }));
    expect(pills()).toEqual(['b×']);
    expect(screen.getByLabelText('Etiquetas')).toHaveFocus();
  });

  it('commits the pending text on blur', async () => {
    render(<Harness />);
    await userEvent.type(screen.getByLabelText('Etiquetas'), 'viagem');
    await userEvent.tab();
    expect(pills()).toEqual(['viagem×']);
  });

  it('has no axe violations', async () => {
    const { container } = render(<Harness initial={['a']} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('keeps the spacing between field, pills and help', () => {
    const css = readFileSync(join(import.meta.dirname, 'tag-field.module.css'), 'utf8');
    const block = (name: string) => new RegExp(`\\.${name}\\s*\\{([^}]*)\\}`).exec(css)?.[1] ?? '';
    expect(block('pills')).toContain('gap: var(--s1)');
    expect(block('pills')).toContain('margin: var(--s2) 0 0');
    expect(block('root')).toContain('gap: var(--s1)');
    expect(block('help')).toContain('margin: 0');
  });

  it('uses the pt-br default texts', () => {
    function Defaults() {
      const [value, setValue] = useState<string[]>(['a']);
      return <TagField label="Etiquetas" value={value} onChange={setValue} />;
    }
    render(<Defaults />);
    expect(screen.getByRole('list', { name: 'Etiquetas adicionadas' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Remover a' })).toBeInTheDocument();
  });

  it('ct12 shows the overridden texts', () => {
    render(
      <TagField
        label="Etiquetas"
        value={['a']}
        onChange={() => undefined}
        listLabel="Added tags"
        removeLabel={(tag) => `Remove ${tag}`}
      />,
    );
    expect(screen.getByRole('list', { name: 'Added tags' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Remove a' })).toBeInTheDocument();
  });

  it('ct13 forwards className, style, data attributes and ref to the input', () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <TagField
        label="Etiquetas"
        value={[]}
        onChange={() => undefined}
        ref={ref}
        className="extra"
        style={{ marginTop: 'var(--s2)' }}
        data-kind="tags"
      />,
    );
    const input = screen.getByLabelText('Etiquetas');
    expect(input).toHaveClass('extra');
    expect(input.className).toMatch(/control/);
    expect(input.style.marginTop).toBe('var(--s2)');
    expect(input).toHaveAttribute('data-kind', 'tags');
    expect(ref.current).toBe(input);
  });

  // Regressão: sem reset global no app, o controle de largura total com padding passava da borda.
  it('keeps the full-width control inside its container with box-sizing border-box', () => {
    const css = readFileSync(join(import.meta.dirname, 'tag-field.module.css'), 'utf8');
    const block = /\.control\s*\{([^}]*)\}/.exec(css)?.[1] ?? '';
    expect(block).toMatch(/box-sizing:\s*border-box/);
  });
});
