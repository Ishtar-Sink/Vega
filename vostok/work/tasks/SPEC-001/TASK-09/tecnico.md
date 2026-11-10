<!-- Escrito no planejamento com o que a tarefa vai fazer e enriquecido na conclusão com o que foi feito. -->

## Abordagem

Migração com TDD ([project/development-methodology-01]) na ordem dos imports: `dialog` (sem dependência de componente no código; o teste usa `Button`), `confirm-dialog` (usa `Button` e `Dialog`) e `toast`. Em cada pasta, o teste do Atria é copiado e completado até as regras de testing (papel e nome acessível, axe, teclado com `user-event`, props nativas e textos sobrescritos), roda falhando, e só então o código é trazido e adaptado. O `Dialog` do Atria já usa o `<dialog>` nativo com `showModal()` ([project/accessibility-06], RN-05); a tarefa preserva esse comportamento e acrescenta testes que o provam.

## Polyfill do `showModal` no jsdom

O jsdom 30.1.3 (a versão do Atria) não implementa `showModal()` nem `close()` no `HTMLDialogElement`: conferido no planejamento em `node_modules/jsdom/lib/jsdom/living/nodes/HTMLDialogElement-impl.js`, que é uma classe vazia. O Atria resolve de dois jeitos: `packages/ui/src/test/setup.ts` define os dois métodos quando faltam (setando e tirando o atributo `open`), e `dialog.test.tsx` ainda os troca por `vi.fn` num `beforeAll`; o `confirm-dialog.test.tsx` depende só do setup global.

Decisão: o polyfill fica local, num `beforeAll` no topo de `dialog.test.tsx` e de `confirm-dialog.test.tsx`, com `vi.fn` (o que também permite conferir que `showModal` foi chamado). O `src/test/setup.ts` é da TASK-01 e não muda aqui.

- Alternativa descartada: pôr o polyfill em `src/test/setup.ts`. Motivo: o arquivo é de outra tarefa; o polyfill local deixa esta tarefa independente do que a TASK-01 decidir. Se a TASK-01 já tiver o polyfill no setup, o `beforeAll` local apenas o substitui por `vi.fn`, sem conflito.
- Dependência para o Coordenador: só os testes desta tarefa usam o `<dialog>`; nenhuma outra tarefa precisa do polyfill no setup. Se o polyfill for levado ao `src/test/setup.ts` no futuro, os `beforeAll` locais podem continuar (para os `vi.fn`).

## Decisões

| # | Decisão | Alternativa descartada | Motivo |
|---|---|---|---|
| D-01 | `DialogProps extends Omit<ComponentPropsWithRef<'dialog'>, 'title' \| 'open' \| 'onClose' \| 'role' \| 'children'>`: `title`, `open`, `onClose` e `role` mantêm o significado do Atria; `open` controla o `showModal()` e não é repassado ao elemento. | Usar o `open` nativo do `<dialog>`. | O atributo `open` abre o diálogo como não modal; a modalidade exige `showModal()` (RN-05). |
| D-02 | `described_by` sai; o chamador usa o `aria-describedby` nativo, que o `Dialog` lê e aplica, com o corpo como padrão em `alertdialog`. `close_on_backdrop` vira `closeOnBackdrop`. | Renomear para `describedBy`. | Com as props nativas, `aria-describedby` já existe; uma prop paralela seria duplicada ([project/code-style-03], [project/naming-convention-09]). |
| D-03 | O `ref` recebido é ligado ao `ref` interno do `<dialog>` com `useImperativeHandle(ref, () => dialogRef.current as HTMLDialogElement)`, sem array de dependências (ver "O que foi feito"), convenção comum das tarefas de componente. | Função local de mesclar refs num `ref` de callback; mover o `ref` interno para o `div` interno. | O efeito chama `showModal()` no próprio `<dialog>`; sem utilitário compartilhado nem dependência nova. |
| D-04 | `ConfirmDialog` estende as props do `Dialog` (sem `children`, `actions`, `role` e `onClose`) e repassa o resto a ele; `confirmLabel` e `cancelLabel` ganham padrão `'Confirmar'` e `'Cancelar'`. | Props próprias, como no Atria. | [project/code-style-03] e [project/language-06]. |
| D-05 | O `Toast` ganha um ícone por tom (SVG decorativo) e o nome do tom num texto visualmente oculto antes do conteúdo (`toneLabel`, padrão `Informação`, `Sucesso`, `Atenção`, `Erro`). | Manter só a cor; usar `role="alert"` no tom `danger`. | RN-04 e [project/theme-06]: um estado não depende só do matiz; mudar o papel do aviso mudaria o anúncio do `ToastRegion`, que já é `aria-live="polite"`. |
| D-06 | O `aria-live="polite"` do `ToastRegion` é aplicado depois do `...rest`, como no Atria. | Deixar o chamador sobrescrever. | O anúncio é o propósito do componente. |

## O que muda para conformidade em relação ao Atria

| Componente | Atria | Vega | Regra |
|---|---|---|---|
| `Dialog` | Props próprias (`className` só); `close_on_backdrop`, `described_by`. | Props nativas do `<dialog>` com `ref`; `closeOnBackdrop`; `aria-describedby` nativo. | [project/code-style-03], [project/naming-convention-09] |
| `ConfirmDialog` | `confirmLabel` e `cancelLabel` obrigatórios; sem props nativas. | Padrão `'Confirmar'` e `'Cancelar'`; repassa props ao `Dialog`. | [project/language-06], [project/code-style-03] |
| `Toast` | `HTMLAttributes<HTMLDivElement>`; tom só pela cor. | `ComponentPropsWithRef<'div'>`; ícone por tom e `toneLabel` com padrão pt-br. | [project/code-style-03], RN-04, [project/language-06] |
| `ToastRegion` | `HTMLAttributes<HTMLDivElement>`. | `ComponentPropsWithRef<'div'>`. | [project/code-style-03] |
| CSS | `1px` na borda do diálogo; comentário sobre o protótipo. | `calc(var(--space) / 4)`; comentário sem o produto. | [project/code-style-02], RNF-02 |
| CSS | `font-weight` 700, `line-height` 1.6 e `z-index` 200 numéricos. | `--font-weight-bold`, `--line-height-relaxed` e `--z-toast`. | [project/code-style-02] |
| Testes | Polyfill de `showModal` no setup global. | Polyfill local nos dois testes de diálogo. | independência da TASK-01 |

`ToastTone` e os nomes públicos `Dialog`, `ConfirmDialog`, `Toast` e `ToastRegion` não mudam (RN-02). O `<dialog>` com `showModal()`, o foco preso, o Esc pelo `onClose` e o foco de volta ao gatilho ficam como no Atria.

## Riscos

- Mudança de props do `Dialog` (`close_on_backdrop` e `described_by`): o Atria terá de trocar na spec de troca; registrar no `CHANGELOG.md` (TASK-14).
- O ícone novo no `Toast` muda levemente o visual do aviso; não muda paleta, tipografia nem valor de token, mas o print `dialogos-temas.png` deve ser conferido pelo usuário.
- `letter-spacing: -0.02em` fica relativo: não é literal de `px` e não entra na busca da RNF-02.
- Dependência da TASK-02: os tokens `--font-weight-bold`, `--line-height-relaxed` e `--z-toast` precisam existir em `src/theme/tokens.css`.
- O `tsc` precisa da declaração de tipos de `*.module.css` e dos tipos globais do Vitest, que vêm da TASK-01.

## Referências da spec

RF-14, RF-19, RF-20; CT-09, CT-12, CT-13; RN-02, RN-04, RN-05; RNF-01, RNF-02; [project/accessibility-06], [project/code-style-03], [project/language-06], [project/theme-06].

## Arquivos em comum com a onda

Nenhum. A onda 4 (TASK-05, TASK-06, TASK-07, TASK-08, TASK-10) cria só as próprias pastas, e esta tarefa não altera `src/test/setup.ts`. Como várias tarefas da onda rodam em paralelo, o baseline e a Verificação filtram a saída do `pnpm exec tsc --noEmit` pelas pastas medidas (`grep -E '^src/(...)/'`): um erro de tipo de outra tarefa da onda não bloqueia esta.

## O que foi feito

- Criados nove arquivos: `src/dialog/` (componente, CSS, teste), `src/confirm-dialog/` (componente, CSS, teste) e `src/toast/` (componente, CSS, teste). Os nomes públicos `Dialog`, `ConfirmDialog`, `Toast` e `ToastRegion` e o tipo `ToastTone` são os do Atria.
- `Dialog` usa o `<dialog>` nativo e abre com `showModal()` no efeito. As props nativas do elemento são repassadas, com `className`, `style` e `ref` aplicados ao `<dialog>` raiz. `closeOnBackdrop` substitui `close_on_backdrop`, e `described_by` saiu em favor do `aria-describedby` nativo (o corpo é o padrão em `alertdialog`).
- O `ref` recebido é ligado ao `<dialog>` com `useImperativeHandle` sem array de dependências. Com `[]` (planejado), o ref ficava `null` com o diálogo fechado; com `[open]`, o lint acusava aviso. Por isso a decisão D-03 foi corrigida acima.
- `ConfirmDialog` repassa o resto das props ao `Dialog` e tem os rótulos padrão `Confirmar` e `Cancelar`. No teste de rótulos trocados, os botões são buscados dentro do diálogo, pois o gatilho também se chama `Excluir`.
- `Toast` mostra um ícone SVG decorativo por tom e o nome do tom (`toneLabel`) num texto oculto para leitor de tela. `ToastRegion` aplica `aria-live="polite"` depois do `...rest`, como no Atria.
- Os testes de `Dialog` e `ConfirmDialog` têm o polyfill local de `showModal` e `close` com `vi.fn`. No teste de `Dialog`, as duas funções ficam em constantes de módulo, para a regra de método sem vínculo do lint.
- Sem `box-sizing`: nenhum controle da tarefa tem `width: 100%` com `padding`, então a regra não foi adicionada.
- Verificação: os três arquivos de teste falharam antes do código, porque os módulos não existiam. Depois do código, 30 testes passaram. Testes, regressão e evidências terminaram sem falhas.
- Print `dialogos-temas.png`: começou manual e virou automático (build temporário em `node_modules` e Chromium headless, sem arquivo novo no projeto). O usuário aceitou a imagem com uma limitação de cena: o anel de foco do botão `Cancelar` não aparece no print, porque o foco dentro do iframe não é aplicado no Chromium headless. O foco real é coberto pelos testes.

## Pontos de atenção

- Mudança de API para o `CHANGELOG.md` (TASK-14): `close_on_backdrop` vira `closeOnBackdrop`, e `described_by` sai em favor de `aria-describedby`. A spec de troca do Atria precisa conhecer as duas mudanças.
- O print não prova o foco visual do `Cancelar`; quem revisar o visual do foco deve olhar os testes ou o componente em tela.
