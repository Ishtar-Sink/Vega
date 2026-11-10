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
| D-06 | Literais `px` do CSS sem token de mesmo valor viram `calc(var(--space) / 4)` (1 px) ou `calc(var(--space) / -4)` (-1 px): no padrão visualmente oculto do `LoadingState` e na borda do `EmptyState`. | Criar token de 1 px nesta tarefa. | O tema é da TASK-02 ([project/code-style-02], RNF-02, RN-03). |

## O que muda para conformidade em relação ao Atria

| Componente | Atria | Vega | Regra |
|---|---|---|---|
| `EmptyState` | Props próprias, sem `className`, `style` nem atributos. | `Omit<ComponentPropsWithRef<'div'>, 'title'>`. | [project/code-style-03] |
| `EmptyState` CSS | Borda `1px dashed`. | `calc(var(--space) / 4)` na borda. | [project/code-style-02], RNF-02 |
| `LoadingState` | `label` obrigatório; sem props nativas. | `label` padrão `'Carregando'`; props do `div`; `aria-busy` fixo. | [project/language-06], [project/code-style-03], [project/accessibility-05] |
| `Skeleton` | Só `rows`. | Props do `div` com `rows`; `aria-hidden` fixo. | [project/code-style-03] |
| `ErrorState` | `title` obrigatório; botão só com `retryLabel` e `onRetry`; sem props nativas. | `title` e `retryLabel` com padrão pt-br; botão com `onRetry`; props do `div`. | [project/language-06], [project/code-style-03] |
| `ProgressBar` | Props próprias. | Props do `div` com `role="progressbar"` fixo. | [project/code-style-03] |
| CSS | `1px` e `-1px` no padrão visualmente oculto. | `calc(var(--space) / 4)` e `calc(var(--space) / -4)`. | [project/code-style-02], RNF-02 |
| CSS | `font-weight` 700 e `line-height` 1.6 numéricos. | `--font-weight-bold` e `--line-height-relaxed`. | [project/code-style-02] |

Os nomes públicos (`EmptyState`, `LoadingState`, `Skeleton`, `ErrorState`, `ProgressBar` e os tipos de props) não mudam (RN-02). A transição do `ProgressBar` já usa `--motion-slow`, que o tema zera com `prefers-reduced-motion` (CB-04, TASK-02).

## O que foi feito

Foram criados doze arquivos, três por pasta (`.tsx`, `.module.css` e `.test.tsx`), em `src/empty-state`, `src/loading-state` (com `LoadingState` e `Skeleton`), `src/error-state` e `src/progress-bar`. Cada componente foi copiado do Atria e ajustado às regras: props do `div` raiz repassadas com `className`, `style` e `...rest`, atributos de acessibilidade aplicados depois do `...rest`, textos padrão em pt-br e CSS só com tokens.

Os testes foram copiados do Atria e completados com os casos de props nativas, textos padrão, rótulo sobrescrito, botão ausente sem `onRetry`, teclado no `ErrorState` (Tab e Enter com `user-event`) e `aria-value*` no `ProgressBar`. Os testes falharam antes do código, porque o módulo não existia, e passaram depois.

Decisões aplicadas: D-01 a D-06 acima. O `ErrorState` mostra o botão só com `onRetry`, mesmo sem `retryLabel`.

Ajuste de contraste: o primeiro print dos estados foi rejeitado porque as linhas do `Skeleton` quase sumiam no tema escuro, já que `surface-muted` ficava sobre o fundo `bg`. O usuário pediu também o trilho vazio da `ProgressBar`, com o mesmo problema. O `.row` do `Skeleton` e o `.root` da `ProgressBar` passaram a usar `var(--surface-hover)`. Um teste de regressão, visto falhando antes da correção, confere que `surface-hover` tem mais contraste com `bg` que `surface-muted` nos dois temas. Com a correção, 31 testes passam.

Evidências: o print dos estados nos dois temas deixou de ser manual e passou a ser automático, com build temporário em `node_modules` e Chromium headless, sem arquivo novo no projeto. O arquivo de testes e o print novo foram conferidos e mantidos. A regressão repete os três comandos do baseline, com o mesmo resultado.

## Pontos de atenção

- Mudança de contrato do `ErrorState`: o botão de nova tentativa aparece só com `onRetry`. Telas do Atria que passavam `onRetry` sem `retryLabel` passam a mostrar o botão; registrar no `CHANGELOG.md` (TASK-14).
- O `ProgressBar` exige `label` (nome acessível), sem texto de porcentagem visível (D-04).
- A cor do `Skeleton` e do trilho usa `surface-hover`, escolhida pelo contraste medido nos dois temas; mudar o tema pode exigir revisar esse teste de contraste.


## Riscos

- Mudança de contrato do `ErrorState` (o botão passa a aparecer só com `onRetry`, mesmo sem `retryLabel`): uma tela do Atria que passava `onRetry` sem rótulo passa a mostrar o botão; registrar no `CHANGELOG.md` (TASK-14).
- Dependência da TASK-02: os tokens `--font-weight-bold` e `--line-height-relaxed` precisam existir em `src/theme/tokens.css`.
- O `tsc` precisa da declaração de tipos de `*.module.css` e dos tipos globais do Vitest, que vêm da TASK-01.

## Referências da spec

RF-15, RF-19, RF-20; CT-09, CT-13; RN-02; RNF-01, RNF-02, RNF-07; [project/accessibility-05], [project/language-06], [project/code-style-03].

## Arquivos em comum com a onda

Nenhum. A onda 4 (TASK-05, TASK-06, TASK-07, TASK-08, TASK-09) cria só as próprias pastas. Como várias tarefas da onda rodam em paralelo, o baseline e a Verificação filtram a saída do `pnpm exec tsc --noEmit` pelas pastas medidas (`grep -E '^src/(...)/'`): um erro de tipo de outra tarefa da onda não bloqueia esta.
