<!-- Escrito no planejamento com o que a tarefa vai fazer e enriquecido na conclusão com o que foi feito. -->

## Abordagem

Componente novo com TDD em `src/countdown/`, com a divisão de [project/code-style-09]: tipos, constantes (textos padrão e `locale`), funções puras em `countdown.utils.ts` (`daysBetween` público e `parseIsoDate` interno, decisões 3 e 11 da spec), o componente, o CSS e dois arquivos de teste. O componente não tem estado nem relógio: recebe `today` e `target` e devolve um `<p>` com o texto e a legenda.

## Decisões

| # | Decisão | Alternativa descartada | Motivo |
|---|---|---|---|
| D-01 | `daysBetween` converte as datas com `Date.UTC` e arredonda `(to - from) / 86 400 000`. | `new Date('AAAA-MM-DD')` no fuso local ou somar dias num laço. | Em UTC, o horário de verão não tira nem põe uma hora, e o fuso fica com o produto (RN-05). A conta direta é O(1). |
| D-02 | `parseIsoDate` valida o formato por expressão regular e confere ano, mês e dia de volta. | Aceitar o que o `Date` aceitar. | O `Date` aceita `2026-02-30` (vira 02/03) e formatos com hora; o CB-05 pede tratar como inválido. |
| D-03 | `daysBetween` devolve `NaN` para data inválida. | Lançar exceção ou devolver `null`. | Mantém o tipo `number` do contrato e o componente decide com `Number.isNaN` (CB-05) sem `try`. |
| D-04 | Com data inválida, o `Countdown` devolve `null` e avisa por `console.warn` fora de produção, com o mesmo `isDevelopment` do `BottomNav`. | Mostrar só a `caption` ou um texto de erro. | CB-05: "não renderiza o número"; um texto de erro seria regra de produto, e a legenda sozinha não faz sentido. O teste de `process.env.NODE_ENV` deixa a decisão para o bundler de quem usa. |
| D-05 | O texto inteiro de `labels.remaining` recebe a tipografia de título no `display`. | Separar o número das palavras. | O contrato devolve uma frase pronta (decisão 4 da spec), com o número já formatado; separar exigiria outro formato de `labels`. A 360 px, "Faltam 26 dias" em 36 px cabe numa linha. |
| D-06 | `letter-spacing: calc(var(--space) * -0.25)` no `display`. | Valor em `em` ou `px` literal. | [project/code-style-02] e o precedente de `src/prose/prose.module.css`; o KT pede `letter-spacing` negativo. |
| D-07 | `data-size` no `p`, além da classe. | Só a classe do CSS Module. | Permite testar o tamanho por atributo estável, sem depender do nome gerado da classe. |
| D-08 | Sem `role` nem `aria-live`. | `role="status"`. | O KT e o CT-08: o texto não é região viva e não atualiza sozinho. |

## Riscos

- A regra `no-nested-ternary` pode não estar ativa; o passo 6 prevê trocar o ternário por `if`s se o ESLint recusar.
- O `isDevelopment` fica copiado do `BottomNav`; extrair um utilitário comum mexeria em `src/app-shell/`, fora do escopo desta tarefa.
- A legenda é `ReactNode` dentro de um `<p>`: o produto deve passar conteúdo de frase (sem `div` nem `p`).

## Referências da spec

RF-10, RF-11, RF-12, RF-18; CT-08, CT-09, CT-13; CB-05; RN-03, RN-05; RNF-01, RNF-03, RNF-06, RNF-07; FA-03; decisões 3, 4, 5 e 11 do "Registro de decisões"; [project/language-06], [project/testing-06].

## Arquivos em comum com a onda

Nenhum. Na onda 1, a TASK-01 (`src/timer/`) e a TASK-03 (`src/connection-status/`) não mudam `src/countdown/`; o índice `src/index.ts` fica para a TASK-04.
