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
| D-05 | O texto inteiro de `labels.remaining` recebe a tipografia de título no `display`. | Separar o número das palavras. | O contrato devolve uma frase pronta (decisão 4 da spec), com o número já formatado; separar exigiria outro formato de `labels`. |
| D-06 | `letter-spacing: calc(var(--space) * -0.25)` no `display`. | Valor em `em` ou `px` literal. | [project/code-style-02] e o precedente de `src/prose/prose.module.css`; o KT pede `letter-spacing` negativo. |
| D-07 | `data-size` no `p`, além da classe. | Só a classe do CSS Module. | Permite testar o tamanho por atributo estável, sem depender do nome gerado da classe. |
| D-08 | Sem `role` nem `aria-live`. | `role="status"`. | O KT e o CT-08: o texto não é região viva e não atualiza sozinho. |

## Riscos

- Para não depender da regra `no-nested-ternary`, a função `describe` usa `if`s, como previsto no passo 6 do planejamento.
- O `isDevelopment` fica copiado do `BottomNav`; extrair um utilitário comum mexeria em `src/app-shell/`, fora do escopo desta tarefa.
- A legenda é `ReactNode` dentro de um `<p>`: o produto deve passar conteúdo de frase (sem `div` nem `p`).

## Referências da spec

RF-10, RF-11, RF-12, RF-18; CT-08, CT-09, CT-13; CB-05; RN-03, RN-05; RNF-01, RNF-03, RNF-06, RNF-07; FA-03; decisões 3, 4, 5 e 11 do "Registro de decisões"; [project/language-06], [project/testing-06].

## Arquivos em comum com a onda

Nenhum. Na onda 1, a TASK-01 (`src/timer/`) e a TASK-03 (`src/connection-status/`) não mudam `src/countdown/`; o índice `src/index.ts` fica para a TASK-04.

## O que foi feito

- `src/countdown/countdown.types.ts`: `CountdownLabels` e `CountdownProps`. `CountdownProps` estende `Omit<ComponentPropsWithRef<'p'>, 'children'>` e tem `caption?: ReactNode`.
- `src/countdown/countdown.constants.ts`: `DEFAULT_COUNTDOWN_LOCALE = 'pt-BR'` e `DEFAULT_COUNTDOWN_LABELS` (Faltam/Falta, É hoje, Já passou).
- `src/countdown/countdown.utils.ts`: `daysBetween`, reexportado por `countdown.tsx`, e `parseIsoDate`, exportado do arquivo só para os testes e fora da API pública.
- `src/countdown/countdown.tsx`: `Countdown`, um `<p>` com `data-size` e a classe do tamanho. Dentro, um `span` com a frase e, quando houver, um `span` com a `caption`. Não tem estado, `role` nem `aria-live`.
- `src/countdown/countdown.module.css`: `.display` em coluna, com o texto da frase em `--font-display`, `--font-size-xxxl`, `--font-weight-extrabold`, `letter-spacing` negativo em `calc(var(--space) * -0.25)` e `tabular-nums`. `.inline` herda o tamanho do texto. Só tokens.
- Testes: `countdown.utils.test.ts` (8) e `countdown.test.tsx` (15), 23 no total.

## Como foi feito

- TDD: os testes foram escritos antes do código e falharam por falta de `./countdown` e `./countdown.utils`.
- `daysBetween` converte as duas datas com `Date.UTC` e arredonda a diferença em dias. Como a conta é em UTC, o horário de verão não muda o resultado. Data inválida vira `NaN`.
- `parseIsoDate` valida o formato por expressão regular e confere ano, mês e dia de volta, porque o `Date` aceita `2026-02-30` e o converte para 2 de março.
- Data inválida: o componente devolve `null`. O `console.warn` sai num `useEffect` e só fora de produção, com a mesma função `isDevelopment` do `BottomNav`.
- A função `describe` interna usa `if`s em vez de ternário aninhado.
- No `display`, a frase inteira usa a tipografia de título, porque o contrato entrega a frase pronta, com o número já formatado.
- Verificação: testes, regressão (3 comandos do baseline, código 0) e evidências (`testes-countdown.txt` e `countdown-360.png`) conferidas pelo usuário.

## Pontos de atenção

- `isDevelopment()` vale `true` quando `process` não existe (`typeof process === 'undefined'`). Num bundle para navegador sem `process` definido, o aviso sai também em produção. Quem publica precisa garantir `process.env.NODE_ENV` no build.
- `caption` é `ReactNode` dentro de um `<p>`. O produto deve passar conteúdo de frase, sem `div` nem `p`.
- `today` vem do produto, no fuso da pessoa. O componente não lê o relógio, então quem não atualiza `today` mostra a contagem de um dia antigo.
- Data inválida não mostra nada na tela e não há texto de erro para o usuário final; o aviso fica só no console.
- A formatação do número usa `Intl.NumberFormat` com o `locale`. O singular e o plural ficam em `labels.remaining`, que o produto pode sobrescrever.
