<!-- Escrito no planejamento com o que a tarefa vai fazer e enriquecido na conclusão com o que foi feito. -->

## Abordagem

TDD: o teste vem antes do código, com o mesmo polyfill de `showModal`/`close` do teste do `Dialog`. O `BottomSheet` é um `<dialog>` nativo aberto com `showModal()` ([project/accessibility-06]); a posição é só CSS (`bottom`, `side` e `auto`, que troca em 720 px), e o comportamento de foco fica num hook próprio, `use-bottom-sheet.ts`. Título, descrição, alça, botão de fechar, corpo rolável e rodapé fixo ficam no `bottom-sheet.tsx`.

## Decisões

| # | Decisão | Alternativa descartada | Motivo |
|---|---|---|---|
| D-01 | O hook `use-bottom-sheet.ts` repete a lógica de foco do `Dialog` (abrir, Tab preso, Esc, fundo, foco devolvido). | Montar o `BottomSheet` sobre o `Dialog` ou extrair um hook comum do `Dialog`. | O `Dialog` exige `actions` e título `string` e tem estrutura própria; extrair o hook mexeria no `Dialog`, fora do "Mudar". A unificação fica para a SPEC-002. |
| D-02 | A posição é uma classe por `placement`, e o `auto` muda para a lateral em `@media (min-width: 720px)` (`breakpoints.md`). | Medir a janela em script. | Sem script nem reflow; testável lendo o CSS (CT-19). |
| D-03 | Altura embaixo com `max-height: 85dvh` e lateral com `100dvh`. | `vh`. | `dvh` acompanha a barra de endereço do celular; o valor 85% vem da spec. |
| D-04 | Botão de fechar com o `IconButton` e o `CloseIcon`, texto `Fechar` sobrescrevível por `labels.close`. | Botão de texto. | [project/accessibility-03] e RN-02: botão só com ícone exige nome. |
| D-05 | Entrada com `@keyframes` usando `var(--motion-base)` e `var(--motion-ease-enter)`, e `animation: none` com movimento reduzido. | Transição de `transform` no `[open]`. | O `<dialog>` aparece de uma vez no `showModal()`; a animação de entrada cobre esse caso. |
| D-06 | Fechar arrastando fica fora: a alça é só visual (`aria-hidden`). | Gesto de arrastar. | Fora do escopo da spec. |

## Riscos

- A lógica de foco duplicada com o `Dialog` pode divergir com o tempo; a SPEC-002 pode unificar num hook comum.
- O jsdom não aplica as media queries: a troca em 720 px é provada lendo o CSS e no print, não no teste de renderização.
- O clique no fundo depende de o `<dialog>` não ter `padding`, para o clique fora da folha cair no próprio elemento; o CSS zera o `padding` e o conteúdo fica nos filhos.

## Referências da spec

RF-19 a RF-21; CT-18, CT-19; CB-07; RN-02; RNF-01 a RNF-04, RNF-08; [project/accessibility-06]; decisão 9 (inferência D) e decisão 11 (inferência F).

## Arquivos em comum com a onda

Nenhum. A onda 3 cria só as próprias pastas; esta tarefa só lê `src/icons/interface-icons.tsx` (TASK-02), `src/dialog/` e `src/icon-button/`.

## O que foi feito

Arquivos criados em `src/bottom-sheet/`:

- `bottom-sheet.types.ts`: `BottomSheetPlacement` (`auto`, `bottom`, `side`), `BottomSheetLabels` (com `close`) e `BottomSheetProps`, com JSDoc em pt-br.
- `bottom-sheet.constants.ts`: `DEFAULT_LABELS` (`close: 'Fechar'`) e `FOCUSABLE`, o seletor de elementos focáveis.
- `use-bottom-sheet.ts`: `useBottomSheet({ open, onClose, ref })`. Com `open`, guarda o elemento com foco, chama `showModal()` e foca o primeiro focável do corpo (sem corpo focável, o primeiro do diálogo, que é o botão de fechar). Na limpeza, chama `close()` e devolve o foco ao elemento guardado. `onKeyDown` prende o Tab entre o primeiro e o último focável; `onCancel` (Esc) faz `preventDefault` e chama `onClose`; `onClick` chama `onClose` quando o alvo é o próprio `<dialog>`, ou seja, o fundo.
- `bottom-sheet.tsx`: `BottomSheet` devolve `null` quando `open` é falso. Senão, renderiza o `<dialog>` com `aria-labelledby` (o `h2`) e `aria-describedby` (quando há descrição), com ids de `useId`. Dentro ficam a alça (`aria-hidden`), o cabeçalho com `h2`, a descrição e o `IconButton` com `CloseIcon`, o `<div>` do corpo com o atributo `data-sheet-body` e o `<footer>` opcional. `className`, `style`, `ref` e as demais props vão ao `<dialog>`; `onKeyDown`, `onCancel` e `onClick` recebidos rodam antes do comportamento interno.
- `bottom-sheet.module.css`: `.bottom` e `.auto` embaixo, com `max-height: 85dvh`; `.side` na lateral, com `100dvh` e largura `min(calc(var(--space) * 105), 100vw)`; `.auto` vira lateral dentro de `@media (min-width: 720px)`. Entrada com `sheet-up` e `sheet-in`, usando `--motion-base` e `--motion-ease-enter`. `.close` com 44 px e `.footer` com `env(safe-area-inset-bottom)`. Com movimento reduzido, a animação some. Só tokens.
- `bottom-sheet.test.tsx`: 14 testes, com o mesmo polyfill de `showModal` e `close` do teste do `Dialog`.

`src/index.ts` não mudou; a exportação fica para a TASK-15.

## Como foi verificado

- Os testes foram escritos antes do código (TDD).
- Os 14 testes passam. Na revisão desta documentação, o ESLint de `src/bottom-sheet` terminou sem erros.
- Regressão: os 3 comandos do baseline terminaram com código 0.
- Evidências: `testes-bottom-sheet.txt`, `linhas-bottom-sheet.txt` e `bottom-sheet-temas.png`, conferidas pelo usuário.

## Pontos de atenção

- O hook repete a lógica de foco do `Dialog` (D-01). Uma correção de foco feita num dos dois precisa ser repetida no outro, até a SPEC-002 unificar.
- O jsdom não aplica media queries: a troca em 720 px é conferida lendo o CSS e no print.
- O véu do fundo é `color-mix(in srgb, var(--bg) 70%, transparent)`, igual ao `::backdrop` do `Dialog`. No tema claro, ele clareia a página (aceito pelo usuário).
- A regra de movimento reduzido (`.root { animation: none; }`) fica no fim do arquivo. Ela tem a mesma especificidade das variantes, então precisa vir depois delas para valer.
- Ao fechar, a folha some sem animação de saída, porque o componente devolve `null` logo que `open` vira falso.
- O atributo `data-sheet-body` é o seletor que o hook usa para achar o primeiro focável do conteúdo. Não remova esse atributo.
