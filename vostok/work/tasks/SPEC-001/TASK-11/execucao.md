### Ler

- `vostok/work/specs/refined/SPEC-001-extrair-os-componentes-do-atria-para-a-vega.md` (seções "Contratos e interfaces", "Casos de borda" e "Casos de teste": RF-16, RF-17, RF-20, CT-10, CT-11, CT-13, CB-05)
- `vostok/work/tasks/SPEC-001/TASK-02/tecnico.md` (decisão da paleta de itens: `itemPalette` e `--item-palette-N-from/to`)
- `vostok/rules/project/code-style.md`
- `vostok/rules/project/accessibility.md`
- `vostok/rules/project/theme.md`
- `vostok/rules/project/testing.md`
- `../atria/packages/ui/src/badge/badge.tsx`
- `../atria/packages/ui/src/badge/badge.module.css`
- `../atria/packages/ui/src/badge/badge.test.tsx`
- `../atria/packages/ui/src/brand-logo/brand-logo.tsx`
- `../atria/packages/ui/src/brand-logo/brand-logo.module.css`
- `../atria/packages/ui/src/brand-logo/brand-logo.test.tsx`
- `../atria/packages/ui/src/item-swatch/item-swatch.tsx`
- `../atria/packages/ui/src/item-swatch/item-swatch.module.css`
- `../atria/packages/ui/src/item-swatch/item-swatch.test.tsx`
- `../atria/packages/theme/src/palette.ts`
- `src/theme/tokens.ts`
- `src/theme/tokens.css`
- `src/test/setup.ts`
- `vite.config.ts`

### Mudar

- `src/badge/badge.test.tsx` (criar): testes do `Badge`: axe, tons com fundo `*Soft`, props nativas e `ref` (RF-20, CT-13).
- `src/badge/badge.tsx` (criar): `Badge` e `BadgeTone`, com props de `ComponentPropsWithRef<'span'>` (RF-20).
- `src/badge/badge.module.css` (criar): estilos do `Badge` só com tokens ([project/code-style-02], [project/theme-06]).
- `src/brand-logo/brand-logo.test.tsx` (criar): testes do `BrandLogo` com `mark` e `name` por prop, sem o "A" do Atria (RF-16, CT-10, CT-13).
- `src/brand-logo/brand-logo.tsx` (criar): `BrandLogo` generalizado, com `mark: ReactNode` (RF-16, RF-20).
- `src/brand-logo/brand-logo.module.css` (criar): estilos do `BrandLogo` só com tokens.
- `src/item-swatch/palette.test.ts` (criar): testes da paleta padrão derivada dos tokens e do par por id (RF-17, CB-05).
- `src/item-swatch/palette.ts` (criar): `DEFAULT_ITEM_PALETTE` e `pairFor`, sem cor literal (RF-17, CB-05).
- `src/item-swatch/item-swatch.test.tsx` (criar): testes do `ItemSwatch` com e sem `palette`, axe e props nativas (RF-17, CT-11, CT-13).
- `src/item-swatch/item-swatch.tsx` (criar): `ItemSwatch` com `palette?` e a paleta padrão do tema (RF-17, RF-20).
- `src/item-swatch/item-swatch.module.css` (criar): estilos do `ItemSwatch` só com tokens.

### Passos

Regras gerais: testes em inglês com Vitest, Testing Library e `vitest-axe` (`import { axe } from 'vitest-axe'`), no mesmo estilo dos testes do Atria (globais `describe`/`it`/`expect` do setup da TASK-01); leitura de CSS nos testes com `readFileSync(join(import.meta.dirname, '<arquivo>'), 'utf8')`. Props estendem `ComponentPropsWithRef<'elemento'>` e repassam `className`, `style` e `...rest` (React 19: `ref` chega como prop e vai no `...rest`). Classes juntadas com `[styles.root, ..., className].filter(Boolean).join(' ')`. Comentários e JSDoc em `pt-br`, sem citar regras do Atria (`[project/frontend-*]`). Nos `*.module.css`, nenhum `#hex`, `px` ou `ms` e nenhum `font-weight` literal (use `--font-weight-*` da TASK-02); medidas fora da escala usam `calc(var(--space) * n)`. Não crie token nem altere `src/theme/`, `src/index.ts` ou `package.json`.

1. `src/badge/badge.test.tsx` (criar): traga os três testes de `../atria/packages/ui/src/badge/badge.test.tsx` (`has no axe violations`, `renders children`, `maps each tone to the soft background`) e acrescente:
   - em `maps each tone to the soft background`, a classe `neutral` com `background: var(--surface-muted)` e `color: var(--text-muted)`;
   - `uses the primary tone by default`: `render(<Badge>Novo</Badge>)` e a classe do elemento casa com `/primary/`;
   - `forwards className, style, data attributes and ref to the root span`: `render(<Badge className="extra" style={{ marginTop: '4px' }} data-testid="badge" ref={ref}>Ok</Badge>)` com `const ref = createRef<HTMLSpanElement>()`; o `getByTestId('badge')` tem as classes `extra` e a do tom, `style.marginTop === '4px'`, `tagName === 'SPAN'` e `ref.current` é ele (CT-13);
   - `has no axe violations in every tone`: renderiza os 7 tons juntos e `axe` sem violações;
   - `keeps the stylesheet free of literal colors, pixels and durations`: o CSS não casa com `/#[0-9a-f]{3,8}\b|\d+(\.\d+)?px|\d+ms/i`.
   Os elementos são consultados pelo texto (`getByText`) ou por `data-testid`: o selo não tem papel ARIA. Confira: `pnpm vitest run src/badge` falha por `./badge` inexistente.
2. `src/badge/badge.tsx` (criar): copie `../atria/packages/ui/src/badge/badge.tsx` com as mudanças: `import type { ComponentPropsWithRef } from 'react';`; `export interface BadgeProps extends ComponentPropsWithRef<'span'>`; JSDoc de `tone` = `/** Tom do selo; o fundo é sempre o *Soft do tom e o texto diz o estado, sem depender só da cor. Padrão: primary. */`; JSDoc no componente `/** Selo curto de estado ou categoria. */`. Mantém `BadgeTone` com os 7 tons e o padrão `primary` (RN-02).
3. `src/badge/badge.module.css` (criar): copie `../atria/packages/ui/src/badge/badge.module.css` e troque `padding: 1px calc(var(--space) * 2);` por `padding: calc(var(--space) * 0.25) var(--s2);` e `font-weight: 600;` por `font-weight: var(--font-weight-semibold);`. Confira: `pnpm vitest run src/badge` passa.
4. `src/brand-logo/brand-logo.test.tsx` (criar): adapte `../atria/packages/ui/src/brand-logo/brand-logo.test.tsx`, trocando o teste do desenho do "A" por estes:
   - `has no axe violations`: `render(<BrandLogo name="Vega" mark={<svg viewBox="0 0 24 24" data-testid="mark"><circle cx="12" cy="12" r="8" /></svg>} />)` e `axe` sem violações;
   - `renders the mark it receives and the name`: `screen.getByText('Vega')` está no documento e `screen.getByTestId('mark')` está dentro do elemento com a classe `mark`, que tem `aria-hidden="true"` (CT-10);
   - `has no Atria mark fixed in the component`: com `mark={<span>V</span>}`, `container.querySelector('svg, path')` é `null`; com o `mark` em SVG do teste de axe, `container.querySelectorAll('svg')` tem 1 elemento (o recebido) e `container.querySelector('path')` é `null` (CT-10, RF-16);
   - `keeps the gradient mark and the gradient name in the stylesheet`: o CSS casa com `/\.mark\s*\{[^}]*background:\s*var\(--brand-gradient\)/`, `/\.mark\s*\{[^}]*box-shadow:\s*var\(--shadow-md\)/`, `/\.name\s*\{[^}]*background:\s*var\(--brand-gradient\)[^}]*color:\s*transparent/` e `/background-clip:\s*text/`, e não casa com `/#[0-9a-f]{3,8}\b|\d+(\.\d+)?px|\d+ms/i`;
   - `forwards className, style, data attributes and ref to the root div`: `className="extra"`, `style={{ marginTop: '4px' }}`, `data-testid="logo"` e `ref` (`createRef<HTMLDivElement>()`) chegam ao `div` raiz (CT-13).
   Confira: `pnpm vitest run src/brand-logo` falha por `./brand-logo` inexistente.
5. `src/brand-logo/brand-logo.tsx` (criar): `import type { ComponentPropsWithRef, ReactNode } from 'react';` e
   - `export interface BrandLogoProps extends ComponentPropsWithRef<'div'> { /** Nome do produto ao lado da marca, já traduzido por quem usa. */ name: string; /** Desenho da marca (SVG ou imagem), mostrado no quadrado em gradiente; é decorativo, o nome é o texto acessível. */ mark: ReactNode }`;
   - `/** Marca de um produto: quadrado em gradiente com o desenho recebido e o nome em texto com gradiente. */ export function BrandLogo({ name, mark, className, ...rest }: BrandLogoProps)` que devolve `<div {...rest} className={...}><span aria-hidden="true" className={styles.mark}>{mark}</span><span className={styles.name}>{name}</span></div>`. Nenhum SVG fixo no componente.
6. `src/brand-logo/brand-logo.module.css` (criar): copie `../atria/packages/ui/src/brand-logo/brand-logo.module.css` com as mudanças: em `.mark`, `width` e `height` = `calc(var(--space) * 8.5)`; remova o bloco `.mark svg { ... }` inteiro; em `.name`, `font-size: var(--font-size-xl);` e `letter-spacing: calc(var(--space) * -0.2);` e `font-weight: var(--font-weight-extrabold);`. Confira: `pnpm vitest run src/brand-logo` passa.
7. `src/item-swatch/palette.test.ts` (criar): importe `DEFAULT_ITEM_PALETTE` e `pairFor` de `./palette` e `itemPalette` de `../theme/tokens`. Testes:
   - `derives the default palette from the theme tokens, without literal colors`: `DEFAULT_ITEM_PALETTE` tem o mesmo tamanho de `itemPalette`, e o par de índice `i` é exatamente o par de strings `var(--item-palette-<i + 1>-from)` e `var(--item-palette-<i + 1>-to)`, montado no teste com template string (CB-05);
   - `points only to variables declared in tokens.css`: cada nome `--item-palette-N-from/to` do `DEFAULT_ITEM_PALETTE` aparece declarado (`--nome:`) em `readFileSync(join(import.meta.dirname, '../theme/tokens.css'), 'utf8')`;
   - `returns the same pair for the same id`: `pairFor('item-1')` igual a `pairFor('item-1')` e contido em `DEFAULT_ITEM_PALETTE`;
   - `keeps the Atria pair for the same id`: `pairFor('abc', itemPalette)` igual a `['#4C1D95', '#0E7490']`, `pairFor('item-1', itemPalette)` igual a `['#9333EA', '#67E8F9']` e `pairFor('projeto-42', itemPalette)` igual a `['#7C3AED', '#06B6D4']` (valores do `paletteFor` do Atria para esses ids);
   - `uses the palette it receives`: com `const custom = [['#111111', '#222222'], ['#333333', '#444444']] as const`, `pairFor(id, custom)` está contido em `custom` para `'a'`, `'b'` e `'c'`;
   - `falls back to the default palette when the palette is empty`: `pairFor('abc', [])` igual a `pairFor('abc')`.
   Confira: `pnpm vitest run src/item-swatch/palette` falha por `./palette` inexistente.
8. `src/item-swatch/palette.ts` (criar): `import { itemPalette } from '../theme/tokens';` e
   - `/** Pares de cor do gradiente de um item, do início ao fim. */ export type ItemPalette = ReadonlyArray<readonly [string, string]>;`
   - `/** Paleta padrão: as variáveis --item-palette-N-from/to do tema, sem cor literal; segue o tema e pode ser sobrescrita por CSS. */ export const DEFAULT_ITEM_PALETTE: ItemPalette = itemPalette.map((_, index) => ...)`, em que cada item é a tupla `as const` com as template strings `var(--item-palette-${String(index + 1)}-from)` e `var(--item-palette-${String(index + 1)}-to)` (`String()` por causa do `restrict-template-expressions`);
   - `const FALLBACK_PAIR = ['var(--item-palette-1-from)', 'var(--item-palette-1-to)'] as const;`
   - `/** Mesmo id, mesmo par, sem estado guardado; paleta vazia usa a padrão. */ export function pairFor(id: string, palette: ItemPalette = DEFAULT_ITEM_PALETTE): readonly [string, string]`, com o hash de `paletteFor` do Atria (`hash = (hash * 31 + id.charCodeAt(i)) >>> 0`), `const source = palette.length > 0 ? palette : DEFAULT_ITEM_PALETTE;` e `return source[hash % source.length] ?? FALLBACK_PAIR;`.
   Confira: `pnpm vitest run src/item-swatch/palette` passa.
9. `src/item-swatch/item-swatch.test.tsx` (criar): adapte `../atria/packages/ui/src/item-swatch/item-swatch.test.tsx` trocando `paletteFor` de `@atria/theme` por `pairFor` de `./palette`, com `expectedBackground(from, to)` que normaliza pelo `probe.style.background` como no Atria. O elemento é consultado por `data-testid` (é decorativo, `aria-hidden`, sem papel ARIA). Testes:
   - `has no axe violations` (com e sem `palette`);
   - `uses the default theme palette without a palette`: `render(<ItemSwatch id="abc" data-testid="swatch" />)`; o `style.background` é `expectedBackground(...pairFor('abc'))`, contém `var(--item-palette-` e não contém `#` nem `rgb(` (CT-11, CB-05);
   - `uses the palette it receives`: com `palette={[['#111111', '#222222']]}`, o `style.background` é `expectedBackground('#111111', '#222222')` (CT-11, RF-17);
   - `renders children and stays decorative`: `render(<ItemSwatch id="abc">A</ItemSwatch>)`, o texto `A` aparece e o elemento tem `aria-hidden="true"`;
   - `forwards className, style, data attributes and ref to the root span`: `className="extra"`, `style={{ marginTop: '4px' }}`, `data-testid="swatch"` e `ref` (`createRef<HTMLSpanElement>()`) chegam ao `span` raiz, e o `style.background` continua o gradiente (CT-13);
   - `keeps the stylesheet free of literal colors, pixels and durations`: o CSS não casa com `/#[0-9a-f]{3,8}\b|\d+(\.\d+)?px|\d+ms/i`.
   Confira: `pnpm vitest run src/item-swatch` falha por `./item-swatch` inexistente.
10. `src/item-swatch/item-swatch.tsx` (criar): copie `../atria/packages/ui/src/item-swatch/item-swatch.tsx` com as mudanças: `import type { ComponentPropsWithRef } from 'react';`, `import { pairFor, type ItemPalette } from './palette';`; `export interface ItemSwatchProps extends ComponentPropsWithRef<'span'> { /** Id do item (não vai para o DOM): o mesmo id sempre gera o mesmo par de cores. */ id: string; /** Pares de cor [início, fim] do gradiente; sem ela, usa a paleta padrão do tema. */ palette?: ItemPalette }` (o tipo `ItemPalette` é `ReadonlyArray<readonly [string, string]>`, igual ao contrato da spec); a função recebe `{ id, palette, className, style, children, ...rest }` e usa `const [from, to] = pairFor(id, palette);`. Mantém `aria-hidden="true"` depois do `{...rest}` e `background: linear-gradient(135deg, ${from}, ${to})` depois do `...style`. JSDoc no componente: `/** Quadrado em gradiente que identifica um item sem imagem própria; decorativo. */`.
11. `src/item-swatch/item-swatch.module.css` (criar): copie `../atria/packages/ui/src/item-swatch/item-swatch.module.css` e troque só `font-weight: 700;` por `font-weight: var(--font-weight-bold);`. Confira: `pnpm vitest run src/item-swatch` passa.
12. Rode `pnpm exec prettier --write src/badge src/brand-logo src/item-swatch` e os comandos da Verificação. Confira: todos terminam com código 0.
