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

## O que foi feito

Arquivos criados em `src/card-link/`:

- `card-link.types.ts`: `CardLinkProps` (estende `ComponentPropsWithRef<'a'>`) e `CardButtonProps` (estende `ComponentPropsWithRef<'button'>`), ambos com `tone?: CardTone`, importado de `../card/card`. JSDoc em pt-br.
- `card-link.tsx`: `CardLink` renderiza um `<a>` com a classe `root` do `Card`, a classe do tom (quando não é `default`), a classe `interactive` e o `className` recebido. `children` é desestruturado e passado explicitamente. Reexporta `CardLinkProps`.
- `card-button.tsx`: `CardButton` renderiza um `<button>` com as mesmas classes, mais `button`, e `type="button"` por padrão. Reexporta `CardButtonProps`.
- `card-link.module.css`: `.interactive` (`display: block`, `box-sizing: border-box`, `min-height: calc(var(--space) * 11)`, cursor e transição), `:hover` (borda em `--primary` e `--shadow-lg`), `:focus-visible` (outline em `--primary`), `:active` (`--shadow-sm`) e `.button` (`width: 100%`, `font: inherit`, `text-align: start`). Só tokens.
- `card-link.test.tsx`: 10 testes, cobrindo axe nos dois componentes, `link` e `button` com o papel certo, `type="button"`, ativação com Enter e Espaço, cartão como alvo único com todo o conteúdo dentro, tom, repasse de props e `ref` nos dois, e as regras de hover, foco, pressionado, alvo de toque e largura lidas do CSS.
- `card/card.tsx` e `card/card.module.css` não mudaram: o visual base vem deles, importado.

## Como foi verificado

- Os testes foram escritos antes dos componentes. Rodados sem eles, falharam porque `./card-link` não resolvia.
- Depois da implementação, os 10 testes passam, incluindo axe nos dois componentes.
- O ESLint (regra `jsx-a11y/anchor-has-content`) exigiu `children` explícito no `<a>`, por isso o `CardLink` desestrutura e repassa o conteúdo.
- Regressão: os 3 comandos do baseline foram rodados de novo, com código de saída 0.
- Evidências: `testes-cartoes.txt` (saída dos testes) e `cartoes-interativos.png` (print), gravadas e conferidas pelo usuário.

## Pontos de atenção

- Os cartões dependem dos nomes de classe de `card.module.css`. Renomear `root` ou as classes de tom no `Card` quebra os cartões interativos sem aviso no build; o teste de tom ajuda a detectar isso.
- Os testes de estado (hover, foco, pressionado) leem o texto do CSS e conferem que as regras existem; não renderizam o efeito visual. Esse efeito foi conferido na evidência de imagem.
- Elementos interativos dentro do cartão (um botão dentro de um `CardLink`, por exemplo) criam alvos aninhados. O JSDoc orienta a passar só conteúdo.
