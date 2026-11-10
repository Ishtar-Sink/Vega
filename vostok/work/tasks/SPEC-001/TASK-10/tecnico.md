<!-- Escrito no planejamento com o que a tarefa vai fazer e enriquecido na conclusão com o que foi feito. -->

## Abordagem

Migração com TDD ([project/development-methodology-01]), uma pasta por vez: `empty-state`, `loading-state` (`LoadingState` e `Skeleton`), `error-state` (usa `Button` da TASK-03) e `progress-bar`. Em cada pasta, o teste do Atria é copiado e completado até as regras de testing (papel e nome acessível, axe, teclado com `user-event` no componente interativo, props nativas e textos padrão), roda falhando, e só então o código é trazido e adaptado. Import do `Button` por caminho relativo (`../button/button`).

## Decisões

| # | Decisão | Alternativa descartada | Motivo |
|---|---|---|---|
| D-01 | `LoadingState` mantém `role="status"` e `aria-busy="true"`, aplicados depois do `...rest` para não serem sobrescritos; o `label` ganha padrão `'Carregando'`. | Deixar `aria-busy` sobrescrevível ou controlado por prop. | [project/accessibility-05]: o componente existe para anunciar o carregamento. |
| D-02 | `ErrorState`: `title` padrão `'Não foi possível carregar.'`, `retryLabel` padrão `'Tentar de novo'`, `description` opcional sem padrão; o botão aparece só com `onRetry` (no Atria exigia também `retryLabel`). | Manter `title` obrigatório; exigir `retryLabel` para mostrar o botão. | [project/language-06]: texto visível sobrescrevível com padrão pt-br; com padrão, `retryLabel` deixa de ser condição. |
| D-03 | `EmptyState` mantém `title` e `description` obrigatórios. | Dar padrão a eles. | São o conteúdo de cada tela vazia; um texto genérico padrão esconderia a falta dele. |
| D-04 | `ProgressBar` mantém `label` obrigatório (nome acessível, não texto visível) e não ganha texto de porcentagem. | Mostrar a porcentagem formatada com `Intl`. | Seria um elemento novo, fora do escopo; sem número visível, [project/language-06] não se aplica ao valor. |
| D-05 | Os componentes estendem as props do `div` raiz; `EmptyState` e `ErrorState` com `Omit<..., 'title'>`, porque `title` é o texto do título. `role`, `aria-busy`, `aria-hidden` e `aria-value*` vêm depois do `...rest`. | Renomear `title`. | Mantém os nomes públicos (RN-02) e [project/code-style-03]. |
| D-06 | Literais `px` do CSS viram `calc(var(--space) * N)` com o valor exato (só no padrão visualmente oculto do `LoadingState`). | Criar token de 1 px nesta tarefa. | O tema é da TASK-02 ([project/code-style-02], RNF-02, RN-03). |

## O que muda para conformidade em relação ao Atria

| Componente | Atria | Vega | Regra |
|---|---|---|---|
| `EmptyState` | Props próprias, sem `className`, `style` nem atributos. | `Omit<ComponentPropsWithRef<'div'>, 'title'>`. | [project/code-style-03] |
| `LoadingState` | `label` obrigatório; sem props nativas. | `label` padrão `'Carregando'`; props do `div`; `aria-busy` fixo. | [project/language-06], [project/code-style-03], [project/accessibility-05] |
| `Skeleton` | Só `rows`. | Props do `div` com `rows`; `aria-hidden` fixo. | [project/code-style-03] |
| `ErrorState` | `title` obrigatório; botão só com `retryLabel` e `onRetry`; sem props nativas. | `title` e `retryLabel` com padrão pt-br; botão com `onRetry`; props do `div`. | [project/language-06], [project/code-style-03] |
| `ProgressBar` | Props próprias. | Props do `div` com `role="progressbar"` fixo. | [project/code-style-03] |
| CSS | `1px` e `-1px` no padrão visualmente oculto. | `calc(var(--space) / 4)` e `calc(var(--space) / -4)`. | [project/code-style-02], RNF-02 |
| CSS | `font-weight` 700 e `line-height` 1.6 numéricos. | `--font-weight-bold` e `--line-height-relaxed`. | [project/code-style-02] |

Os nomes públicos (`EmptyState`, `LoadingState`, `Skeleton`, `ErrorState`, `ProgressBar` e os tipos de props) não mudam (RN-02). A transição do `ProgressBar` já usa `--motion-slow`, que o tema zera com `prefers-reduced-motion` (CB-04, TASK-02).

## Riscos

- Mudança de contrato do `ErrorState` (o botão passa a aparecer só com `onRetry`, mesmo sem `retryLabel`): uma tela do Atria que passava `onRetry` sem rótulo passa a mostrar o botão; registrar no `CHANGELOG.md` (TASK-14).
- Dependência da TASK-02: os tokens `--font-weight-bold` e `--line-height-relaxed` precisam existir em `src/theme/tokens.css`.
- O `tsc` precisa da declaração de tipos de `*.module.css` e dos tipos globais do Vitest, que vêm da TASK-01.

## Referências da spec

RF-15, RF-19, RF-20; CT-09, CT-13; RN-02; RNF-01, RNF-02, RNF-07; [project/accessibility-05], [project/language-06], [project/code-style-03].

## Arquivos em comum com a onda

Nenhum. A onda 4 (TASK-05, TASK-06, TASK-07, TASK-08, TASK-09) cria só as próprias pastas. Como várias tarefas da onda rodam em paralelo, o baseline e a Verificação filtram a saída do `pnpm exec tsc --noEmit` pelas pastas medidas (`grep -E '^src/(...)/'`): um erro de tipo de outra tarefa da onda não bloqueia esta.
