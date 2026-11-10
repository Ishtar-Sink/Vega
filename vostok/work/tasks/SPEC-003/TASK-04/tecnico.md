<!-- Escrito no planejamento com o que a tarefa vai fazer e enriquecido na conclusão com o que foi feito. -->

## Abordagem

Extensão com TDD do `ProgressBar` existente. Os testes novos entram em `src/progress-bar/progress-bar.test.tsx` antes do código; a animação e o movimento reduzido são conferidos lendo o `.module.css`, porque o jsdom não roda animação. A raiz continua o `div` com `role="progressbar"`, que recebe as props nativas.

## Decisões

| # | Decisão | Alternativa descartada | Motivo |
|---|---|---|---|
| D-01 | Com `valueText`, a raiz `progressbar` é envolvida por um `div` `.labeled` com o texto ao lado, em `aria-hidden`; sem `valueText`, a árvore não muda. | Trocar a raiz por um invólucro sempre. | O `.root` é o trilho (o teste `ProgressBar track visibility` lê o fundo dele), e as props nativas continuam no elemento com o papel. O texto fica oculto do leitor de tela porque o `aria-valuetext` já o anuncia. |
| D-02 | `indeterminate` omite `aria-valuenow`, aplica `aria-busy="true"` e ignora o `value` (CB-12). | Manter o `aria-valuenow` com o último valor. | Pelo padrão ARIA, a barra indeterminada não tem valor atual. |
| D-03 | A animação é `progress-indeterminate` com `var(--motion-slow)` (320 ms), `alternate` e `infinite`, mais `@media (prefers-reduced-motion: reduce) { animation: none }`. | Duração maior que 320 ms. | [project/theme-07] limita a 320 ms; o tema já zera `--motion-*` com movimento reduzido, e o bloco próprio garante a parada mesmo com tema sobrescrito. |

## Riscos

- O invólucro `.labeled` muda a árvore só quando há `valueText`; quem estiliza o pai do `ProgressBar` com `valueText` passa a ver um `div` a mais.
- Ciclo de 320 ms pode parecer rápido; o limite é da regra de tema, e mudar exigiria um ajuste da regra.

## Referências da spec

RF-37, RF-38, CT-34, CT-35, CB-12; RNF-04, RNF-08; regras [project/theme-07], [project/code-style-03], [project/code-style-08].

## Arquivos em comum com a onda

Nenhum. Na onda 1, as TASK-01, TASK-03, TASK-05, TASK-07 e TASK-10 não mudam `src/progress-bar/`. A TASK-11, da onda 3, usa o `ProgressBar` estendido.
