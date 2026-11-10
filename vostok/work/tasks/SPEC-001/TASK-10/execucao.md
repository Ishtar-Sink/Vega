### Ler

- `vostok/work/specs/refined/SPEC-001-extrair-os-componentes-do-atria-para-a-vega.md`
- `vostok/work/tasks/SPEC-001/TASK-10/tecnico.md`
- `../atria/packages/ui/src/empty-state/empty-state.tsx`
- `../atria/packages/ui/src/empty-state/empty-state.module.css`
- `../atria/packages/ui/src/empty-state/empty-state.test.tsx`
- `../atria/packages/ui/src/loading-state/loading-state.tsx`
- `../atria/packages/ui/src/loading-state/loading-state.module.css`
- `../atria/packages/ui/src/loading-state/loading-state.test.tsx`
- `../atria/packages/ui/src/error-state/error-state.tsx`
- `../atria/packages/ui/src/error-state/error-state.module.css`
- `../atria/packages/ui/src/error-state/error-state.test.tsx`
- `../atria/packages/ui/src/progress-bar/progress-bar.tsx`
- `../atria/packages/ui/src/progress-bar/progress-bar.module.css`
- `../atria/packages/ui/src/progress-bar/progress-bar.test.tsx`
- `src/button/button.tsx`
- `src/theme/tokens.css`
- `src/test/setup.ts`

### Mudar

- `src/empty-state/empty-state.tsx` (criar): `EmptyState` com props nativas do `div` raiz (RF-15, RF-20).
- `src/empty-state/empty-state.module.css` (criar): estilos do `EmptyState` só com tokens (RNF-02).
- `src/empty-state/empty-state.test.tsx` (criar): testes do `EmptyState` (CT-09, CT-13).
- `src/loading-state/loading-state.tsx` (criar): `LoadingState` com `aria-busy` e rótulo padrão em pt-br, e `Skeleton`, ambos com props nativas (RF-15, RF-19, RF-20).
- `src/loading-state/loading-state.module.css` (criar): estilos de `LoadingState` e `Skeleton` só com tokens (RNF-02).
- `src/loading-state/loading-state.test.tsx` (criar): testes de `LoadingState` e `Skeleton` (CT-09, CT-13).
- `src/error-state/error-state.tsx` (criar): `ErrorState` sobre `Button`, com título e rótulo de nova tentativa padrão em pt-br e sobrescrevíveis (RF-15, RF-19, RF-20).
- `src/error-state/error-state.module.css` (criar): estilos do `ErrorState` só com tokens (RNF-02).
- `src/error-state/error-state.test.tsx` (criar): testes do `ErrorState`, inclusive teclado (CT-09, CT-13).
- `src/progress-bar/progress-bar.tsx` (criar): `ProgressBar` com props nativas do `div` raiz (RF-15, RF-20).
- `src/progress-bar/progress-bar.module.css` (criar): estilos do `ProgressBar` só com tokens (RNF-02).
- `src/progress-bar/progress-bar.test.tsx` (criar): testes do `ProgressBar` (CT-09, CT-13).

### Passos

Regras comuns a todos os passos (decididas em `tecnico.md`, seção "Decisões"):

- Copie o arquivo do Atria e aplique só as mudanças listadas no passo e na tabela "O que muda para conformidade em relação ao Atria" do `tecnico.md`.
- CSS: troque cada literal em `px` pelo token de `src/theme/tokens.css` com o mesmo valor; sem token de mesmo valor, use `calc(var(--space) * N)` com N = valor ÷ 4 (`1px` vira `calc(var(--space) / 4)`, `-1px` vira `calc(var(--space) / -4)`). Valores em `ch` e `%` ficam.
- Pesos, entrelinhas e camadas (tokens criados pela TASK-02, mapeados pelo valor): `font-weight: 600` vira `var(--font-weight-semibold)`, `700` vira `var(--font-weight-bold)`, `800` vira `var(--font-weight-extrabold)`; `line-height: 1.1` vira `var(--line-height-tight)`, `1.6` vira `var(--line-height-relaxed)`; `z-index: 40` vira `var(--z-dropdown)`, `45` vira `var(--z-popover)`, `200` vira `var(--z-toast)`. Nenhum `font-weight`, `line-height` ou `z-index` numérico fica nos `*.module.css`.
- Props que estendem as nativas: estes não são campos; desestruture `className`, `style` e `...rest` (com o `ref`, que no React 19 é prop) e aplique-os no elemento raiz (`className` concatenado com a classe do módulo). Atributos de acessibilidade próprios do componente (`role`, `aria-busy`, `aria-hidden`, `aria-value*`) são aplicados depois do `...rest`. JSDoc em pt-br em cada prop pública.
- Teste de props nativas, em toda pasta: `it('passes className, style and data attributes to the root')`, com `className="extra"`, `style={{ marginTop: '4px' }}` e `data-testid="raiz"`, conferindo em `screen.getByTestId('raiz')` a classe `extra`, o estilo e que é o elemento raiz esperado.

1. `src/empty-state/empty-state.test.tsx` (criar): copie o teste do Atria e acrescente `it('passes className, style and data attributes to the root')` e `it('renders without an action')` (sem `action`, nenhum `link` nem `button`). Confira: `pnpm vitest run src/empty-state` falha porque `./empty-state` não existe.
2. `src/empty-state/empty-state.module.css` (criar) e `src/empty-state/empty-state.tsx` (criar): CSS pela regra comum; `export interface EmptyStateProps extends Omit<ComponentPropsWithRef<'div'>, 'title'>` com `title: string`, `description: string` e `action?: ReactNode`. Confira: `pnpm vitest run src/empty-state`.
3. `src/loading-state/loading-state.test.tsx` (criar): copie o teste do Atria e acrescente: `it('announces Carregando by default')` (sem `label`, `getByRole('status')` tem `aria-busy="true"` e o texto `Carregando`); `it('accepts another label')` (`label="Loading"`); `it('keeps aria-busy even when another value is passed')` (`aria-busy={false}` continua `true`); `it('hides the skeleton from assistive technology')` (o `Skeleton` tem `aria-hidden="true"`); `it('passes className, style and data attributes to the root')` para `LoadingState` (raiz `status`) e para `Skeleton`. Confira: `pnpm vitest run src/loading-state` falha porque `./loading-state` não existe.
4. `src/loading-state/loading-state.module.css` (criar): copie e troque os literais pela regra comum (o `.visuallyHidden` fica com `width` e `height` `calc(var(--space) / 4)` e `margin: calc(var(--space) / -4)`). `src/loading-state/loading-state.tsx` (criar): `export interface SkeletonProps extends ComponentPropsWithRef<'div'>` com `rows?: number` (padrão 3) e `aria-hidden="true"` depois do `...rest`; `export interface LoadingStateProps extends ComponentPropsWithRef<'div'>` com `label?: string` (padrão `'Carregando'`) e `rows?: number`; `role="status"` e `aria-busy="true"` depois do `...rest`. Confira: `pnpm vitest run src/loading-state`.
5. `src/error-state/error-state.test.tsx` (criar): copie o teste do Atria e acrescente: `it('uses the pt-BR texts by default')` (`<ErrorState onRetry={fn} />` mostra o título `Não foi possível carregar.` no `alert` e o botão `Tentar de novo`); `it('accepts overridden texts')` (`title="Failed"`, `description="Try again later."`, `retryLabel="Retry"`); `it('hides the retry button without onRetry')` (nenhum `button`); `it('retries with the keyboard')` (`user.tab()` foca `Tentar de novo`, `{Enter}` chama `onRetry` uma vez); `it('passes className, style and data attributes to the root')` (raiz `alert`). Confira: `pnpm vitest run src/error-state` falha porque `./error-state` não existe.
6. `src/error-state/error-state.module.css` (criar): copie (não tem literal em `px`). `src/error-state/error-state.tsx` (criar): `export interface ErrorStateProps extends Omit<ComponentPropsWithRef<'div'>, 'title'>` com `title?: string` (padrão `'Não foi possível carregar.'`), `description?: string` (sem padrão), `retryLabel?: string` (padrão `'Tentar de novo'`) e `onRetry?: () => void`; o botão aparece quando há `onRetry`; `role="alert"` depois do `...rest`. Import do `Button` por `../button/button`. Confira: `pnpm vitest run src/error-state`.
7. `src/progress-bar/progress-bar.test.tsx` (criar): copie o teste do Atria e acrescente: `it('clamps negative values to 0')`; `it('uses another max')` (`value={3}` e `max={4}`: `aria-valuemax="4"` e o preenchimento com `width: 75%`); `it('treats a zero max as empty')` (`max={0}`: preenchimento com `width: 0%`); `it('keeps the progressbar role even when another one is passed')`; `it('passes className, style and data attributes to the root')` (raiz `progressbar`). Confira: `pnpm vitest run src/progress-bar` falha porque `./progress-bar` não existe.
8. `src/progress-bar/progress-bar.module.css` (criar): copie (não tem literal em `px`; a transição já usa `--motion-slow`). `src/progress-bar/progress-bar.tsx` (criar): `export interface ProgressBarProps extends ComponentPropsWithRef<'div'>` com `label: string` (nome acessível, obrigatório), `value: number` e `max?: number` (padrão 100); `role`, `aria-label` e `aria-value*` depois do `...rest`. Confira: `pnpm vitest run src/progress-bar`.
9. Pastas da tarefa (sem arquivo novo): rode `pnpm exec prettier --write src/empty-state src/loading-state src/error-state src/progress-bar` e depois a Verificação inteira. Confira: todos os comandos da Verificação terminam com código 0.
