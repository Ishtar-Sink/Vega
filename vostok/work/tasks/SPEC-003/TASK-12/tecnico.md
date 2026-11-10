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
