<!-- Escrito no planejamento com o que a tarefa vai fazer e enriquecido na conclusão com o que foi feito. -->

## Abordagem

Migração com TDD ([project/development-methodology-01]) de `src/color-field/` a partir de `../atria/packages/ui/src/color-field/` (commit `139d036`): `color.ts` (funções puras, com teste próprio), `color-picker.tsx` (o seletor), `color-field.tsx` (o campo com o `<dialog>` nativo) e um `color-field.module.css` comum aos dois. O `ColorField` importa o `Button` por caminho relativo (`../button/button`, TASK-03); não usa nenhum componente da TASK-04, por isso o plano o faz depender só da TASK-03. O `ColorPicker` ganha um teste próprio (`color-picker.test.tsx`), porque é exportado sozinho ([project/testing-01]).

## O que muda em relação ao Atria (conformidade)

| Item | Atria hoje | Na Vega |
|---|---|---|
| `ColorFieldProps` | Props próprias, só `className`; `labels` obrigatório. | `Omit<ComponentPropsWithRef<'button'>, ...>` no gatilho (mesma regra dos campos da TASK-04); `labels?: Partial<ColorFieldLabels>` com padrão em pt-br. |
| `ColorPickerProps` | Sem props nativas; `labels` obrigatório. | `Omit<ComponentPropsWithRef<'div'>, 'onChange' \| 'children' \| 'defaultValue'>` no raiz; `labels` parcial. |
| Valor da roda | `aria-valuetext` com "graus" fixo e `labels.saturation.toLowerCase()`. | `labels.wheelValue(hue, saturation)`, com padrão `Matiz {h} graus, saturação {s}%` ([project/language-06]). |
| Nomes | `hex_invalid`; `clamp` exportado por `export { clamp }`. | `hexInvalid` ([project/naming-convention-07]); `export function clamp`. |
| Cor de partida | `[124, 58, 237]` inline. | `FALLBACK_RGB` com comentário do porquê. |
| CSS | `1px`, `2px`, `3px`, `220px`, `font-weight: 600`. | Múltiplos de `--space` (RNF-02); `font-weight` → `--font-weight-semibold`. |
| Testes | Mocks do `<dialog>` e do canvas no setup do pacote. | Mocks no próprio teste; CT-12, CT-13, erro e teclado de ponta a ponta acrescentados. |

O erro do campo já usa `role="alert"` com `aria-describedby` no gatilho ([project/accessibility-04]); o diálogo já é `<dialog>` com `showModal()` ([project/accessibility-06], RN-05).

## Decisões

- **Peso de fonte por token (decisão do usuário).** A TASK-02 cria `--font-weight-*`, `--line-height-*` e `--z-*`; aqui só `font-weight: 600` aparece e vira `var(--font-weight-semibold)` (o `<dialog>` modal fica na camada do topo e não usa `z-index`). A busca de literais pega `font-weight`, `line-height` e `z-index` numéricos.
- **`labels` parcial com `DEFAULT_COLOR_FIELD_LABELS`.** Mantém o nome e a forma do Atria (RN-02) e cumpre o padrão em pt-br: quem passava o objeto inteiro continua funcionando. A constante fica exportada de `color-picker.tsx` para o `ColorField` usar; se entra no índice público é decisão da TASK-12. Alternativa descartada: uma prop por texto (`title`, `cancelLabel`...), que mudaria a API à toa.
- **`wheelValue` como função.** O texto junta números e palavras em ordem que muda por idioma; uma função recebe os dois números e devolve a frase inteira. Os números são inteiros de 0 a 360 e 0 a 100, sem separador de milhar, e o campo não recebe `locale`: não há formatação `Intl` a aplicar. Alternativa descartada: só trocar "graus" por `labels.degrees`, que manteria a ordem das palavras fixa em pt-br.
- **Props nativas no gatilho.** Mesma regra da TASK-04 (decisão "Props nativas no controle"): `className`, `style`, `...rest` e `ref` no `<button>` gatilho, que é o controle focável e o elemento nomeado pelo rótulo; `ref` por `useImperativeHandle`, porque o gatilho já tem `ref` interno para devolver o foco.
- **Mocks do jsdom no próprio teste** (`showModal`/`close` só quando faltam, e `getContext` do canvas). Alternativa descartada: depender do `src/test/setup.ts` da TASK-01, que não está em "Mudar" e pode não ter os mocks.
- **Literais em `px` em múltiplos de `--space`.** `220px` (tamanho da roda) vira `calc(var(--space) * 55)` e `3px` vira `calc(var(--space) * 0.75)`, mesmo valor final (RN-03). Alternativa descartada: criar tokens de tamanho no tema (TASK-02).

## Riscos

- **`FALLBACK_RGB` é uma cor literal em código** (não em estilo): é o roxo da marca Ishtar Sink (`#7C3AED`, início do `--brand-gradient`), usado só quando o valor recebido não é HEX. Não fere [project/code-style-02], que trata de estilos, mas não acompanha uma marca sobrescrita.
- **Teste de teclado do diálogo:** o foco inicial vai para a roda (`[role="slider"]`) num efeito; o teste espera o diálogo com `findByRole` antes do `{ArrowRight}`.

## Referências da spec

RF-10, RF-19, RF-20, RNF-01, RNF-02, RNF-06, RN-02, RN-03, RN-05, CT-09, CT-12, CT-13.

## Arquivos em comum com a onda

Onda 4: TASK-06, TASK-07, TASK-08, TASK-09 e TASK-10. Nenhum arquivo em comum: a tarefa só cria `src/color-field/` e lê `src/button/` (TASK-03, sem alterar).
