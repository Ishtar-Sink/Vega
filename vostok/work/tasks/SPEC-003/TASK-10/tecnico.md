<!-- Escrito no planejamento com o que a tarefa vai fazer e enriquecido na conclusão com o que foi feito. -->

## Abordagem

Dois componentes novos com TDD em `src/card-link/` (decisão 4 da spec): `CardLink` (`<a>`) e `CardButton` (`<button>`), com os tipos em `card-link.types.ts` e um CSS próprio só para os estados interativos. O visual base (`root` e tons) vem do `card.module.css`, importado sem mudar o `Card`.

## Decisões

| # | Decisão | Alternativa descartada | Motivo |
|---|---|---|---|
| D-01 | Os componentes aplicam `cardStyles.root` e a classe de tom de `../card/card.module.css`, mais `styles.interactive` do CSS próprio. | Replicar o CSS do `Card`; `composes` do CSS Modules. | Uma fonte só para o visual do cartão, sem duplicar tokens; aplicar as classes é mais simples que `composes` e funciona igual no Vite e no Vitest. |
| D-02 | Dois componentes, cada um com as props nativas do próprio elemento. | `Card` com `as` polimórfico. | Decisão do usuário (resposta 4A da SPEC-003). |
| D-03 | `CardButton` com `type="button"` por padrão, `width: 100%`, `text-align: start` e `font: inherit`. | Herdar o estilo de botão do navegador. | O botão fica com a largura e o texto de um cartão, igual ao `CardLink`. |
| D-04 | Hover com `border-color: var(--primary)` e `--shadow-lg`; pressionado com `--shadow-sm`; foco com o anel da Vega (`outline` de `calc(var(--space) / 2)` em `--primary`). | Mudar o fundo no hover. | O fundo é o sinal do tom; borda e sombra marcam a interação sem perder o tom. |

## Riscos

- O `CardLink` depende das classes do `card.module.css`: renomear `root` ou os tons no `Card` quebra os cartões interativos; o teste `applies the card tone` detecta.
- Elementos interativos dentro do cartão (como um botão dentro do `CardLink`) criariam alvos aninhados; o JSDoc orienta a passar só conteúdo.

## Referências da spec

RF-39, CT-36; RNF-01, RNF-02, RNF-03, RNF-08; decisão 4 do "Registro de decisões" da spec.

## Arquivos em comum com a onda

Nenhum. Na onda 1, as TASK-01, TASK-03, TASK-04, TASK-05 e TASK-07 não mudam `src/card-link/` nem `src/card/`.
