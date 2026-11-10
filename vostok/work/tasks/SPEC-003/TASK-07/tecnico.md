<!-- Escrito no planejamento com o que a tarefa vai fazer e enriquecido na conclusão com o que foi feito. -->

## Abordagem

Componente novo com TDD em `src/text-area-field/`, com o mesmo desenho do `TextField` (rótulo, ajuda e erro) e a divisão de [project/code-style-09]: `text-area-field.types.ts`, `use-auto-resize.ts`, `text-area-field.tsx`, `text-area-field.module.css` e o teste. O contador é conteúdo do produto (`counter: ReactNode`): a regra de contagem fica fora do componente (RN-05, [project/code-style-07]).

## Decisões

| # | Decisão | Alternativa descartada | Motivo |
|---|---|---|---|
| D-01 | `autoResize` ajusta o atributo `rows` pelo número de linhas do texto, limitado entre `minRows` (padrão 3) e `maxRows` (padrão 12); acima do limite, o `textarea` rola. | Medir `scrollHeight` e ajustar `height`. | É determinístico e testável no jsdom, que não calcula layout. Linhas longas que quebram sozinhas não aumentam o campo, limitação registrada nos riscos. |
| D-02 | O contador entra no `aria-describedby`, sem `aria-live`. | `aria-live="polite"` no contador. | Critério do KT-001: o contador é lido junto do campo, sem anúncio a cada tecla. |
| D-03 | Props nativas, `ref` e `className` no `<textarea>`. | No invólucro. | Regra dos campos da SPEC-001 (decisão do usuário). |
| D-04 | CSS copiado do `TextField`, sem importar o módulo dele. | `composes` do `text-field.module.css`. | Cada componente fica com o próprio CSS, e uma mudança no `TextField` não muda o `TextAreaField` sem querer. |

## Riscos

- Texto com linhas longas sem quebra manual não faz o campo crescer (D-01); o `resize: vertical` deixa a pessoa aumentar o campo à mão.
- O estado interno do texto existe só para o `autoResize` não controlado; com `value`, o componente segue o valor recebido.

## Referências da spec

RF-10, RF-11, RF-12, CT-10, CT-11, CT-12, CB-04; RN-05; RNF-01, RNF-03, RNF-08; KT-001 seção "4. `TextAreaField`".

## Arquivos em comum com a onda

Nenhum. Na onda 1, as TASK-01, TASK-03, TASK-04, TASK-05 e TASK-10 não mudam `src/text-area-field/`.

## O que foi feito

Arquivos criados em `src/text-area-field/`:

- `text-area-field.types.ts`: `TextAreaFieldProps`, que estende as props nativas de `textarea` com `label`, `help`, `error`, `autoResize`, `minRows` (padrão 3), `maxRows` (padrão 12) e `counter`. JSDoc em pt-br.
- `use-auto-resize.ts`: função pura `useAutoResize(value, { enabled, minRows, maxRows })`. Sem `enabled`, devolve `undefined`; com `enabled`, conta as quebras de linha do texto e limita o resultado ao intervalo entre `minRows` e `maxRows`.
- `text-area-field.tsx`: `TextAreaField` com rótulo ligado por `htmlFor`, ajuda, erro com `role="alert"` e `aria-invalid`, e contador sem `aria-live`. O `aria-describedby` sai na ordem: o recebido, ajuda, contador e erro. O texto interno só existe sem `value` controlado (iniciado com `value` ou `defaultValue`) e alimenta o `autoResize`. `rows` recebe `autoRows ?? rows`. `className`, `style`, `ref` e demais props vão para o `textarea`.
- `text-area-field.module.css`: `.root`, `.label`, `.help` e `.error` copiados do `TextField`; `.control` com `line-height: var(--line-height-relaxed)`, `box-sizing: border-box`, `width: 100%`, `resize: vertical` e `overflow-y: auto`, sem altura fixa (a altura vem de `rows`), usando só tokens; `.counter` com `text-align: end` e números tabulares.
- `text-area-field.test.tsx`: 11 testes, cobrindo axe, rótulo, erro com `role="alert"`, ordem do `aria-describedby`, contador sem `aria-live`, `autoResize` entre `minRows` e `maxRows`, `minRows` com campo vazio, `rows` sem `autoResize`, repasse de props e `ref`, e as regras de `line-height` e `box-sizing` lidas do CSS.

## Como foi verificado

- Os testes foram escritos antes do componente. Rodados sem o módulo, falharam com "Test Files 1 failed, no tests", porque `./text-area-field` não existia.
- Depois da implementação, os 11 testes passam.
- Regressão: os 3 comandos do baseline foram rodados de novo, com código de saída 0.
- Evidências: `testes-textarea.txt` (saída dos testes) e `textarea-temas.png` (print nos temas), gravadas e conferidas pelo usuário.

## Pontos de atenção

- O `autoResize` conta quebras de linha (`\n`), não a largura visual. Um texto longo sem quebra manual não faz o campo crescer; a pessoa pode aumentar a altura à mão, pelo `resize: vertical` (decisão D-01).
- Com `autoResize` ligado, a prop `rows` é ignorada, porque o valor calculado tem prioridade. `rows` só vale sem `autoResize`.
- Com `value` controlado, o `autoResize` usa o `value` recebido. Sem ele, usa o estado interno, que só existe nesse caso.
- O contador não é anunciado a cada tecla: quem usa leitor de tela o ouve junto do campo, pelo `aria-describedby`.
- O CSS é uma cópia do `TextField` (decisão D-04). Mudanças visuais no `TextField` não chegam aqui automaticamente; é preciso replicá-las se forem desejadas.
- A regra de contagem fica fora do componente (RN-05): cada produto monta o seu `counter`.
