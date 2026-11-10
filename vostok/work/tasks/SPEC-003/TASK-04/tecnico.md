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

## O que foi feito

- `src/progress-bar/progress-bar.tsx`: `ProgressBarProps` ganhou `valueText` e `indeterminate`, com JSDoc em pt-br. A raiz continua sendo o `div` com papel `progressbar`, recebendo `className`, `style` e as demais props. Com `indeterminate`, a raiz recebe a classe `indeterminate` e `aria-busy="true"`, não tem `aria-valuenow`, o preenchimento não tem `width` inline e o `value` é ignorado. Com `valueText`, a raiz recebe `aria-valuetext` e é envolvida por um `div` `.labeled` com um `span` `aria-hidden` que mostra o texto. Sem `valueText`, a árvore é a mesma de antes.
- `src/progress-bar/progress-bar.module.css`: acrescentadas as classes `.labeled` e `.valueText`, `.indeterminate .fill` com a animação `progress-indeterminate` (usa `--motion-slow` e `--motion-ease-linear`, em `infinite alternate`) e o bloco `@media (prefers-reduced-motion: reduce)` com `animation: none`. O `.root` não mudou.
- `src/progress-bar/progress-bar.test.tsx`: seis testes novos no `describe('ProgressBar valueText and indeterminate')`, cobrindo o texto e `aria-valuetext`, a preservação das props na raiz com `valueText`, `aria-valuenow` omitido e `value` ignorado no modo indeterminado, e os dois testes que leem o CSS (animação com tokens de movimento e parada com movimento reduzido). Os testes antigos foram mantidos, inclusive `ProgressBar track visibility`.

## Verificação

- `pnpm vitest run src/progress-bar`: 15 testes passam (9 antigos e 6 novos).
- `pnpm exec prettier --write src/progress-bar` aplicado; a Verificação da tarefa terminou sem falhas.
- Regressão: a tarefa só acrescentou testes; nenhum teste existente foi alterado ou removido.
- A animação não roda no jsdom, por isso é verificada lendo o CSS. O visual foi conferido pelo print de evidência `progresso-temas.png`, e a saída dos testes pela evidência `testes-progresso.txt`, ambas conferidas pelo usuário.

## Pontos de atenção

- Os testes foram escritos junto com o código e não foram vistos falhando antes da implementação; o ciclo de teste que falha primeiro não foi comprovado nesta tarefa.
- O invólucro `.labeled` só aparece com `valueText`. Quem estiliza o pai do `ProgressBar` e passa `valueText` passa a ver um `div` a mais na árvore.
- O ciclo da animação é de 320 ms, o limite da regra [project/theme-07]. Um valor maior exigiria ajustar a regra.
- No modo indeterminado o `value` é ignorado por design (CB-12); quem precisa mostrar um valor conhecido deve usar o modo determinado.
