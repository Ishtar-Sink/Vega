### Ler

- `vostok/work/specs/refined/SPEC-001-extrair-os-componentes-do-atria-para-a-vega.md`
- `vostok/work/tasks/SPEC-001/TASK-08/tecnico.md`
- `../atria/packages/ui/src/icons/index.ts`
- `../atria/packages/ui/src/icons/view-icons.tsx`
- `../atria/packages/ui/src/icons/view-icons.test.tsx`
- `../atria/packages/ui/src/card/card.tsx`
- `../atria/packages/ui/src/card/card.module.css`
- `../atria/packages/ui/src/card/card.test.tsx`
- `../atria/packages/ui/src/page-header/page-header.tsx`
- `../atria/packages/ui/src/page-header/page-header.module.css`
- `../atria/packages/ui/src/page-header/page-header.test.tsx`
- `../atria/packages/ui/src/view-switcher/view-switcher.tsx`
- `../atria/packages/ui/src/view-switcher/view-switcher.module.css`
- `../atria/packages/ui/src/view-switcher/view-switcher.test.tsx`
- `../atria/packages/ui/src/toolbar/toolbar.tsx`
- `../atria/packages/ui/src/toolbar/toolbar.module.css`
- `../atria/packages/ui/src/toolbar/toolbar.test.tsx`
- `../atria/packages/ui/src/tabs/tabs.tsx`
- `../atria/packages/ui/src/tabs/tabs.module.css`
- `../atria/packages/ui/src/tabs/tabs.test.tsx`
- `../atria/packages/ui/src/form-layout/form-layout.tsx`
- `../atria/packages/ui/src/form-layout/form-layout.module.css`
- `../atria/packages/ui/src/form-layout/form-layout.test.tsx`
- `src/button/button.tsx`
- `src/text-field/text-field.tsx`
- `src/theme/tokens.css`
- `src/test/setup.ts`

### Mudar

- `src/icons/view-icons.tsx` (criar): `ListIcon`, `GridIcon`, `ShelfIcon`, `TableIcon`, `DayIcon` e `TimelineIcon`, com props nativas do `svg` e `aria-hidden` fixo (RF-18, RF-20).
- `src/icons/index.ts` (criar): reexporta os ícones e `ViewIconProps`, como no Atria (RF-18).
- `src/icons/view-icons.test.tsx` (criar): testes dos ícones (CT-09, CT-13).
- `src/card/card.tsx` (criar): `Card` com `ComponentPropsWithRef<'div'>` e `as` (RF-13, RF-20).
- `src/card/card.module.css` (criar): estilos do `Card` só com tokens (RNF-02).
- `src/card/card.test.tsx` (criar): testes do `Card` (CT-09, CT-13).
- `src/page-header/page-header.tsx` (criar): `PageHeader` com props nativas do `header` (RF-13, RF-20).
- `src/page-header/page-header.module.css` (criar): estilos do `PageHeader` só com tokens (RNF-02).
- `src/page-header/page-header.test.tsx` (criar): testes do `PageHeader` (CT-09, CT-13).
- `src/view-switcher/view-switcher.tsx` (criar): `ViewSwitcher` com props nativas do `div` raiz (RF-13, RF-20).
- `src/view-switcher/view-switcher.module.css` (criar): estilos do `ViewSwitcher` só com tokens (RNF-02).
- `src/view-switcher/view-switcher.test.tsx` (criar): testes do `ViewSwitcher`, inclusive teclado (CT-09, CT-13).
- `src/toolbar/toolbar.tsx` (criar): `Toolbar` sobre `TextField`, com props nativas e rótulo da busca padrão em pt-br (RF-13, RF-19, RF-20).
- `src/toolbar/toolbar.module.css` (criar): estilos do `Toolbar` só com tokens (RNF-02).
- `src/toolbar/toolbar.test.tsx` (criar): testes do `Toolbar` (CT-09, CT-13).
- `src/tabs/tabs.tsx` (criar): `Tabs` com props nativas do `div` raiz (RF-13, RF-20).
- `src/tabs/tabs.module.css` (criar): estilos do `Tabs` só com tokens (RNF-02).
- `src/tabs/tabs.test.tsx` (criar): testes do `Tabs` (CT-09, CT-13).
- `src/form-layout/form-layout.tsx` (criar): `FormGrid` e `FormActions`, com props nativas e rótulos camelCase com padrão pt-br (RF-13, RF-19, RF-20).
- `src/form-layout/form-layout.module.css` (criar): estilos do formulário só com tokens (RNF-02).
- `src/form-layout/form-layout.test.tsx` (criar): testes de `FormGrid` e `FormActions` (CT-09, CT-13).

### Passos

Regras comuns a todos os passos (decididas em `tecnico.md`, seção "Decisões"):

- Copie o arquivo do Atria e aplique só as mudanças listadas no passo e na tabela "O que muda para conformidade em relação ao Atria" do `tecnico.md`.
- CSS: troque cada literal em `px` pelo token de `src/theme/tokens.css` com o mesmo valor (`30px` de fonte vira `var(--font-size-xxl)`); tamanho de fonte sem token de mesmo valor vira o token `--font-size-*` mais próximo (`24px` vira `var(--font-size-xl)`, de 21 px); demais medidas sem token de mesmo valor usam `calc(var(--space) * N)` com N = valor ÷ 4 (`1px` vira `calc(var(--space) / 4)`, `2px` vira `calc(var(--space) / 2)`, `-1px` vira `calc(var(--space) / -4)`, `-2px` vira `calc(var(--space) / -2)`, `-0.6px` vira `calc(var(--space) * -0.15)`, `1.4px` vira `calc(var(--space) * 0.35)`, `-1.2px` vira `calc(var(--space) * -0.3)`). Só as condições de `@media` (`720px`, `480px`, `640px`) ficam em `px`, porque `var()` não vale em media query. Comentários que citam o protótipo ou o Atria passam a explicar o porquê sem citar o produto.
- Pesos, entrelinhas e camadas (tokens criados pela TASK-02, mapeados pelo valor): `font-weight: 600` vira `var(--font-weight-semibold)`, `700` vira `var(--font-weight-bold)`, `800` vira `var(--font-weight-extrabold)`; `line-height: 1.1` vira `var(--line-height-tight)`, `1.6` vira `var(--line-height-relaxed)`; `z-index: 40` vira `var(--z-dropdown)`, `45` vira `var(--z-popover)`, `200` vira `var(--z-toast)`. Nenhum `font-weight`, `line-height` ou `z-index` numérico fica nos `*.module.css`.
- Props que estendem as nativas: estes são componentes de estrutura, não campos; desestruture `className`, `style` e `...rest` (com o `ref`, que no React 19 é prop) e aplique-os no elemento raiz. O campo de busca do `Toolbar` é o `TextField` da TASK-04, que já segue a convenção dos campos (props nativas no `input`) (`className` concatenado com a classe do módulo). JSDoc em pt-br em cada prop pública.
- Teste de props nativas, em toda pasta: `it('passes className, style and data attributes to the root')`, com `className="extra"`, `style={{ marginTop: '4px' }}` e `data-testid="raiz"`, conferindo em `screen.getByTestId('raiz')` a classe `extra`, o estilo e que é o elemento raiz esperado.

1. `src/icons/view-icons.test.tsx` (criar): copie o teste do Atria e acrescente `it('passes className, style and data attributes to the svg')` e `it('keeps aria-hidden even when another value is passed')` (`<ListIcon aria-hidden={false} />` continua com `aria-hidden="true"`). Confira: `pnpm vitest run src/icons` falha porque `./index` não existe.
2. `src/icons/view-icons.tsx` (criar): `export interface ViewIconProps extends Omit<ComponentPropsWithRef<'svg'>, 'children'>` com `size?: number` (padrão 18); `ViewIcon` espalha `...rest` antes dos atributos fixos e põe `aria-hidden="true"` e `focusable="false"` depois do `...rest`, para não serem sobrescritos. `src/icons/index.ts` (criar): igual ao Atria. Confira: `pnpm vitest run src/icons`.
3. `src/card/card.test.tsx` (criar): copie o teste do Atria e acrescente: `it('renders as section or article')` (`as="section"` com `aria-label="Resumo"` dá `getByRole('region', { name: 'Resumo' })`; `as="article"` dá `getByRole('article')`); `it('passes className, style and data attributes to the root')`. Confira: `pnpm vitest run src/card` falha porque `./card` não existe.
4. `src/card/card.module.css` (criar) e `src/card/card.tsx` (criar): CSS pela regra comum; `export interface CardProps extends ComponentPropsWithRef<'div'>` com `as?: 'div' | 'section' | 'article'` e `tone?: CardTone`. Confira: `pnpm vitest run src/card`.
5. `src/page-header/page-header.test.tsx` (criar): copie o teste do Atria e acrescente `it('passes className, style and data attributes to the root')` (raiz `header`, `getByRole('banner')` quando fora de `main`/`article`) e `it('forwards headingRef to the h1')` (um `createRef<HTMLHeadingElement>()` aponta para o `h1`). Confira: `pnpm vitest run src/page-header` falha porque `./page-header` não existe.
6. `src/page-header/page-header.module.css` (criar) e `src/page-header/page-header.tsx` (criar): CSS pela regra comum; `export interface PageHeaderProps extends Omit<ComponentPropsWithRef<'header'>, 'title'>` mantendo `title: string`, `eyebrow`, `subtitle`, `actions`, `back`, `stuck`, `compact` e `headingRef`. Confira: `pnpm vitest run src/page-header`.
7. `src/view-switcher/view-switcher.test.tsx` (criar): copie o teste do Atria e acrescente: `it('chooses a view with the keyboard')` (`user.tab()` foca `Lista`, `user.tab()` foca `Grade`, `{Enter}` chama `onChange('grid')` e `{ }` (espaço) em `Lista` chama `onChange('list')`); `it('passes className, style and data attributes to the root')` (raiz `getByRole('group', { name: 'Visualização' })`). Confira: `pnpm vitest run src/view-switcher` falha porque `./view-switcher` não existe.
8. `src/view-switcher/view-switcher.module.css` (criar) e `src/view-switcher/view-switcher.tsx` (criar): CSS pela regra comum (o teste do Atria que lê `flex: none`, `width: fit-content` e `.option svg { display: block }` continua valendo); `export interface ViewSwitcherProps extends Omit<ComponentPropsWithRef<'div'>, 'onChange' | 'defaultValue'>` com `label`, `options`, `value` e `onChange`. Confira: `pnpm vitest run src/view-switcher`.
9. `src/toolbar/toolbar.test.tsx` (criar): copie o teste do Atria e acrescente: `it('uses Buscar as the default search label')` (sem `searchLabel`, existe `getByRole('searchbox', { name: 'Buscar' })`); `it('accepts another search label')` (`searchLabel="Search"`); `it('reaches the search and the views with the keyboard')` (`user.tab()` foca o `searchbox`, digitar `ab` chama `onSearchChange` com `'a'` e depois `'b'` com o valor controlado vazio, e `user.tab()` foca o botão `Lista`); `it('passes className, style and data attributes to the root')`. Confira: `pnpm vitest run src/toolbar` falha porque `./toolbar` não existe.
10. `src/toolbar/toolbar.module.css` (criar) e `src/toolbar/toolbar.tsx` (criar): CSS pela regra comum; `export interface ToolbarProps extends ComponentPropsWithRef<'div'>` com `searchLabel?: string` (padrão `'Buscar'`), `searchValue`, `onSearchChange`, `searchPlaceholder?`, `filters?` e `children`. Import do `TextField` por `../text-field/text-field`. Confira: `pnpm vitest run src/toolbar`.
11. `src/tabs/tabs.test.tsx` (criar): copie o teste do Atria e acrescente: `it('moves back with ArrowLeft and Home')` (de `Resumo`, `{ArrowLeft}` foca `Histórico` e `{Home}` volta a `Resumo`); `it('calls onChange and respects the controlled value')` (`value="b"` mostra `Painel B`; clicar `Histórico` chama `onChange('c')` e o painel continua `Painel B` enquanto `value` não muda); `it('passes className, style and data attributes to the root')` (raiz é o `div` que contém o `tablist`). Confira: `pnpm vitest run src/tabs` falha porque `./tabs` não existe.
12. `src/tabs/tabs.module.css` (criar) e `src/tabs/tabs.tsx` (criar): CSS pela regra comum; `export interface TabsProps extends Omit<ComponentPropsWithRef<'div'>, 'onChange' | 'defaultValue'>` com `label`, `tabs`, `value?`, `defaultValue?` e `onChange?`; `className`, `style` e `...rest` no `div` raiz, que no Atria não tinha classe. Confira: `pnpm vitest run src/tabs`.
13. `src/form-layout/form-layout.test.tsx` (criar): copie o teste do Atria, troque `cancel_label` e `submit_label` por `cancelLabel` e `submitLabel` e acrescente: `it('uses Cancelar and Salvar by default')` (sem rótulos, botões `Cancelar` e `Salvar`); `it('disables submit and shows loading')` (`submitDisabled` deixa `Salvar` desabilitado; `loading` deixa `aria-busy="true"`); `it('cancels with the keyboard')` (`user.tab()` foca `Cancelar`, `{Enter}` chama `onCancel` uma vez); `it('has no axe violations')` (`FormGrid` com um `TextField` e `FormActions` dentro de um `form` com `aria-label="Cadastro"`); `it('passes className, style and data attributes to the root')` para `FormGrid` e para `FormActions` (ambos `div`; o `FormActions` mantém `data-span="full"`). Confira: `pnpm vitest run src/form-layout` falha porque `./form-layout` não existe.
14. `src/form-layout/form-layout.module.css` (criar) e `src/form-layout/form-layout.tsx` (criar): CSS pela regra comum (o teste lê `calc(var(--space) * 220)` e `max-width: 640px` da condição de `@media`, que ficam); `export interface FormGridProps extends ComponentPropsWithRef<'div'>`; `export interface FormActionsProps extends ComponentPropsWithRef<'div'>` com `cancelLabel?` (padrão `'Cancelar'`), `submitLabel?` (padrão `'Salvar'`), `onCancel`, `loading?` e `submitDisabled?`; `data-span="full"` aplicado depois do `...rest`. Import do `Button` por `../button/button`. Confira: `pnpm vitest run src/form-layout`.
15. Pastas da tarefa (sem arquivo novo): rode `pnpm exec prettier --write src/icons src/card src/page-header src/view-switcher src/toolbar src/tabs src/form-layout` e depois a Verificação inteira. Confira: todos os comandos da Verificação terminam com código 0.
