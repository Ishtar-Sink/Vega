<!-- Escrito no planejamento com o que a tarefa vai fazer e enriquecido na conclusão com o que foi feito. -->

## Abordagem

Migração com TDD ([project/development-methodology-01]) na ordem dos imports dos testes e do código: `icons` (usado pelos testes do `ViewSwitcher` e do `Toolbar`), `card`, `page-header`, `view-switcher`, `toolbar` (usa `TextField` da TASK-04 e, no teste, `ViewSwitcher` e os ícones), `tabs` e `form-layout` (usa `Button` da TASK-03). Em cada pasta, o teste do Atria é copiado e completado até as regras de testing (papel e nome acessível, axe, teclado com `user-event`, props nativas e textos padrão), roda falhando, e só então o código é trazido e adaptado. Imports entre componentes por caminho relativo; `src/icons/index.ts` é o índice da pasta de ícones, como no Atria, e não o índice público, que é da TASK-12.

## Decisões

| # | Decisão | Alternativa descartada | Motivo |
|---|---|---|---|
| D-01 | `CardProps extends ComponentPropsWithRef<'div'>`, mantendo `as?: 'div' \| 'section' \| 'article'`. | `ComponentPropsWithRef<'section'>` (props de `HTMLElement`). | Conferido com `tsc` no planejamento: o `ref` de `HTMLElement` não é aceito pelo `div` dinâmico, e o de `HTMLDivElement` é aceito pelos três. |
| D-02 | `PageHeaderProps extends Omit<ComponentPropsWithRef<'header'>, 'title'>`: `title` continua o texto do `h1`. | Renomear `title` para `heading`. | Mantém o nome público (RN-02); o `title` nativo (dica) não faz sentido no cabeçalho. |
| D-03 | `Tabs`, `ViewSwitcher` e `Toolbar` estendem as props do `div` raiz (decisão do usuário: o `Toolbar` em si → raiz; o campo de busca é o `TextField` da TASK-04, que segue a regra dos campos e põe as props nativas no `input`), com `Omit` de `onChange` e `defaultValue` onde o componente já define as próprias. | Repassar o `...rest` ao `tablist` ou ao campo de busca. | CT-13 pede os atributos no elemento raiz. |
| D-04 | Textos visíveis próprios ganham padrão pt-br: `searchLabel` (`'Buscar'`), `cancelLabel` (`'Cancelar'`) e `submitLabel` (`'Salvar'`). `label` de `Tabs` e `ViewSwitcher` e `ViewOption.label` continuam obrigatórios. | Padrão também para os nomes acessíveis. | [project/language-06] trata do texto visível; o nome do grupo e o de cada visualização dependem da tela, e [project/accessibility-03] exige o nome do botão só com ícone no tipo. |
| D-05 | Nos ícones, `aria-hidden="true"` e `focusable="false"` são aplicados depois do `...rest`. | Deixar o chamador sobrescrever. | [project/accessibility-03]: ícone é sempre decorativo; o nome fica no botão. |
| D-06 | Literais `px` do CSS viram o token de mesmo valor; tamanho de fonte sem token vira o `--font-size-*` mais próximo; as demais medidas, `calc(var(--space) * N)` com o valor exato (convenção comum das tarefas de componente); as condições de `@media` (720, 480 e 640 px) ficam em `px`. | Criar tokens de borda, de `letter-spacing` e de fonte de 24 px nesta tarefa; expressar a fonte de 24 px como `calc(var(--space) * 6)`. | O tema é da TASK-02; a forma com `--space` mantém os valores (RN-03) sem literal ([project/code-style-02], RNF-02); `var()` não vale em media query. |

## O que muda para conformidade em relação ao Atria

| Componente | Atria | Vega | Regra |
|---|---|---|---|
| `Card` | `HTMLAttributes<HTMLElement>`, sem `ref`. | `ComponentPropsWithRef<'div'>` com `as`. | [project/code-style-03], RF-20 |
| `PageHeader` | Props próprias; `className`, `style` e atributos não chegam ao `header`. | `Omit<ComponentPropsWithRef<'header'>, 'title'>`, repassados ao `header`. | [project/code-style-03] |
| `Toolbar` | Props próprias; `searchLabel` obrigatório. | Props do `div`; `searchLabel` padrão `'Buscar'`. | [project/code-style-03], [project/language-06] |
| `Tabs` | Props próprias; `div` raiz sem classe nem atributos. | Props do `div` repassadas à raiz. | [project/code-style-03] |
| `ViewSwitcher` | Props próprias. | Props do `div` (`role="group"`) repassadas. | [project/code-style-03] |
| `FormGrid` | Só `children` e `className`. | `ComponentPropsWithRef<'div'>`. | [project/code-style-03] |
| `FormActions` | `cancel_label`, `submit_label`, `submit_disabled`, obrigatórios os rótulos; sem props nativas. | `cancelLabel` (`'Cancelar'`), `submitLabel` (`'Salvar'`), `submitDisabled`; props do `div`. | [project/naming-convention-09], [project/language-06], [project/code-style-03] |
| Ícones | `ViewIconProps` só com `size`. | `Omit<ComponentPropsWithRef<'svg'>, 'children'>` com `size`; `aria-hidden` fixo. | [project/code-style-03], [project/accessibility-03] |
| CSS | `1px`, `2px`, `-1px`, `-2px`, `24px`, `30px`, `-0.6px`, `1.4px`, `-1.2px` literais. Token de mesmo valor (`30px` = `var(--font-size-xxl)`); fonte de `24px` vira o token mais próximo, `var(--font-size-xl)` (21 px); as demais medidas, `calc(var(--space) * N)`. | [project/code-style-02], RNF-02 |
| CSS | `font-weight` 600/800 e `line-height` 1.1 numéricos. | `--font-weight-*` e `--line-height-tight`. | [project/code-style-02] |
| Comentários | Citam o protótipo do Atria. | Explicam o porquê sem citar o produto. | [project/architecture-04], [project/code-style-06] |

Os nomes públicos (`Card`, `CardTone`, `PageHeader`, `Toolbar`, `Tabs`, `TabItem`, `ViewSwitcher`, `ViewOption`, `FormGrid`, `FormActions` e os seis ícones) não mudam (RN-02).

## Riscos

- Mudança de props do `FormActions` (snake_case para camelCase): o Atria terá de renomear na spec de troca; registrar no `CHANGELOG.md` (TASK-14).
- Fonte do título compacto do `PageHeader`: o tema não tem tamanho de 24 px, e pela convenção comum ela usa o token mais próximo, `--font-size-xl` (21 px), 3 px menor que no Atria. Conferir no print; se a TASK-02 criar um token de 24 px, ele tem prioridade.
- Falta de tokens de espessura de borda e de `letter-spacing` (D-06): a forma com `--space` resolve sem literal, com o mesmo valor do Atria.
- Dependência da TASK-02: os tokens `--font-weight-semibold`, `--font-weight-extrabold` e `--line-height-tight` precisam existir em `src/theme/tokens.css`.
- O `tsc` precisa da declaração de tipos de `*.module.css` e dos tipos globais do Vitest, que vêm da TASK-01.

## Referências da spec

RF-13, RF-18, RF-19, RF-20; CT-09, CT-13; RN-01, RN-02, RN-03; RNF-01, RNF-02; [project/code-style-03], [project/language-06], [project/accessibility-03].

## Arquivos em comum com a onda

Nenhum. A onda 4 (TASK-05, TASK-06, TASK-07, TASK-09, TASK-10) cria só as próprias pastas. Como várias tarefas da onda rodam em paralelo, o baseline e a Verificação filtram a saída do `pnpm exec tsc --noEmit` pelas pastas medidas (`grep -E '^src/(...)/'`): um erro de tipo de outra tarefa da onda não bloqueia esta.
