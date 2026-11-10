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
