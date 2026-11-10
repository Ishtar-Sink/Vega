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

## O que foi feito

- **Criado em `src/color-field/`:**
  - `color.ts`: as funções de conversão de cor (`hexToRgb`, `rgbToHex`, `hslToRgb`, `rgbToHsl`) e `clamp`, agora uma função declarada e documentada.
  - `color-picker.tsx`: o seletor, com `DEFAULT_COLOR_FIELD_LABELS` em português, `labels` parcial, `wheelValue` como função, `FALLBACK_RGB` com comentário e as props nativas no `<div>` raiz.
  - `color-field.tsx`: o campo, com o gatilho em `<button>` (props nativas, `aria-describedby` somado e `aria-invalid` pelo erro), o `<dialog>` aberto com `showModal()` e o `Button` de `../button/button`. A `ref` vem de `useImperativeHandle`, porque o gatilho já usa uma `ref` interna para devolver o foco.
  - `color-field.module.css`: estilos só com tokens. Os literais viraram múltiplos de `--space` e o peso 600 virou `--font-weight-semibold`. A regressão de `box-sizing` lê este arquivo e confere `box-sizing: border-box` em `.trigger` e `.input`.
  - Três arquivos de teste (`color.test.ts`, `color-picker.test.tsx` e `color-field.test.tsx`), com os mocks do jsdom (`showModal`/`close` e `getContext` do canvas) dentro de cada teste que precisa deles.
- **Ordem:** os três arquivos de teste falharam antes do código, porque os módulos ainda não existiam. Depois do código, 23 testes passaram.
- **Verificação:** testes, regressão e evidências passaram (registro da execução).
- **Evidências:** `cor-testes.txt` e `cor-temas.png`. A captura do tema saiu de manual para automática: um build temporário em `node_modules` roda no Chromium headless, sem arquivo novo no projeto. O usuário aceitou o `cor-temas.png` com a limitação de cena: o `<dialog>` modal cobre a mensagem de erro do segundo campo. O erro está comprovado pelos testes.

## Pontos de atenção

- O print do tema não mostra o erro do segundo campo (limitação de cena acima). Quem revisar a evidência visual deve considerar os testes para esse comportamento.
- `FALLBACK_RGB` é um literal de cor no código, usado só quando o valor recebido não é HEX válido. Não acompanha uma marca sobrescrita.
- O teste de teclado do diálogo espera o diálogo com `findByRole` antes de `{ArrowRight}`, porque o foco inicial vai para a roda num efeito.
