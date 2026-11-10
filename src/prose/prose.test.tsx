import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Prose } from './prose';
import type { ProsePlugin } from './prose.types';

const css = readFileSync(join(import.meta.dirname, 'prose.module.css'), 'utf8');

const MARKDOWN = [
  '# Título',
  '',
  '- Um',
  '- Dois',
  '',
  '| Fração | Decimal |',
  '|---|---|',
  '| 1/2 | 0,5 |',
  '',
  '[Material externo](https://exemplo.com)',
  '',
  '![Gráfico de frações](https://exemplo.com/grafico.png)',
].join('\n');

const DANGEROUS = [
  '<script>alert(1)</script>',
  '',
  '<img src=x onerror="alert(1)">',
  '',
  '[clique](javascript:alert(1))',
].join('\n');

interface TextNode {
  type: string;
  value?: string;
  children?: TextNode[];
}

function upperCase(node: TextNode): void {
  if (node.type === 'text' && node.value !== undefined) node.value = node.value.toUpperCase();
  node.children?.forEach(upperCase);
}

// Plugin de teste: troca todo texto da árvore mdast por maiúsculas.
const remarkUpperCase: ProsePlugin = () => (tree: TextNode) => {
  upperCase(tree);
};

describe('Prose', () => {
  it('renders markdown as React elements', () => {
    render(<Prose markdown={MARKDOWN} />);
    expect(screen.getByRole('heading', { name: 'Título' })).toBeInTheDocument();
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Material externo' })).toHaveAttribute(
      'rel',
      'noopener noreferrer',
    );
    expect(screen.getByRole('img', { name: 'Gráfico de frações' })).toHaveAttribute(
      'loading',
      'lazy',
    );
  });

  it('styles children when there is no markdown', () => {
    render(
      <Prose data-testid="raiz">
        <p>Texto</p>
      </Prose>,
    );
    expect(screen.getByTestId('raiz')).toContainElement(screen.getByText('Texto'));
  });

  it('drops raw HTML and dangerous URLs', () => {
    const { container } = render(<Prose markdown={DANGEROUS} />);
    expect(container.querySelector('script')).toBeNull();
    for (const node of Array.from(container.querySelectorAll('*'))) {
      expect(node.getAttributeNames().some((name) => name.startsWith('on'))).toBe(false);
    }
    for (const link of Array.from(container.querySelectorAll('[href]'))) {
      expect(link.getAttribute('href')?.trim().toLowerCase()).not.toMatch(/^javascript:/);
    }
    expect(container).not.toHaveTextContent('alert(1)</script>');
  });

  it('replaces an element through components', () => {
    render(
      <Prose
        markdown="## Seção"
        components={{ h2: ({ children }) => <h2 data-testid="titulo">{children}</h2> }}
      />,
    );
    expect(screen.getByTestId('titulo')).toHaveTextContent('Seção');
  });

  it('applies remark plugins', () => {
    render(<Prose markdown="texto do produto" remarkPlugins={[remarkUpperCase]} />);
    expect(screen.getByText('TEXTO DO PRODUTO')).toBeInTheDocument();
  });

  it('uses the reading size', () => {
    const { rerender } = render(<Prose data-testid="raiz" markdown="Texto" size="reading" />);
    expect(screen.getByTestId('raiz').className).toMatch(/reading/);
    rerender(<Prose data-testid="raiz" markdown="Texto" />);
    expect(screen.getByTestId('raiz').className).toMatch(/base/);
  });

  it('keeps the reading measure and scrolls wide tables', () => {
    expect(css).toMatch(/\.root\s*\{[^}]*max-width:\s*68ch/);
    expect(css).toMatch(/\.root\s*\{[^}]*line-height:\s*var\(--line-height-relaxed\)/);
    expect(css).toMatch(/\.tableWrap\s*\{[^}]*overflow-x:\s*auto/);
    expect(css).toMatch(/img\s*\{[^}]*max-width:\s*100%/);
    expect(css).toMatch(/\.reading\s*\{[^}]*font-size:\s*var\(--font-size-lg\)/);
    expect(css).toMatch(/\.base\s*\{[^}]*font-size:\s*var\(--font-size-base\)/);
  });

  it('has no axe violations', async () => {
    const { container } = render(<Prose markdown={MARKDOWN} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('passes className, style and data attributes to the root', () => {
    render(<Prose className="extra" style={{ marginTop: '4px' }} data-testid="raiz" />);
    const root = screen.getByTestId('raiz');
    expect(root.tagName.toLowerCase()).toBe('div');
    expect(root).toHaveClass('extra');
    expect(root).toHaveStyle({ marginTop: '4px' });
  });

  it('forwards the ref to the root', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Prose ref={ref} data-testid="raiz" markdown="Texto" />);
    expect(ref.current).toBe(screen.getByTestId('raiz'));
  });
});
