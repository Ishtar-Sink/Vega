<!-- Escrito no planejamento com o que a tarefa vai fazer e enriquecido na conclusão com o que foi feito. -->

## Abordagem

TDD: o `radio-group.test.tsx` vem antes do código. O grupo segue o padrão do `SegmentedField`: `<fieldset>` com `<legend>`, um `div role="radiogroup"` ligado à legenda e `<input type="radio">` nativos, que já dão as setas do teclado e o anúncio do estado. A variante `card` esconde o rádio visualmente e faz do `<label>` inteiro a área de toque. O componente fica dividido por contexto ([project/code-style-09]): tipos, mapa de ícones, a opção como subcomponente e o grupo.

## Decisões

| # | Decisão | Alternativa descartada | Motivo |
|---|---|---|---|
| D-01 | Props nativas no `<fieldset>` raiz, com `className`, `style`, `ref` e `...rest`. | Repassar ao `div` do `radiogroup`. | [project/code-style-03]: o grupo é o elemento do componente, como no `SegmentedField`. |
| D-02 | `readOnly` com `aria-readonly` no `radiogroup` e o `onChange` ignorado; o React restaura o rádio controlado. | Marcar os rádios como `disabled`. | `disabled` tira as opções do teclado e do leitor de tela, e o RF-08 pede que continuem legíveis. |
| D-03 | Tom `success` com `CircleCheckIcon`, `danger` com `CircleAlertIcon` e borda mais grossa; `neutral` só com o fundo `surfaceMuted`, sem ícone. | Tom só pela cor de fundo. | [project/theme-06] e RN-03: estado com mais de um sinal além do matiz. |
| D-04 | A opção vira o subcomponente `radio-option.tsx`. | Tudo no `radio-group.tsx`. | Mantém cada arquivo abaixo de 200 linhas ([project/code-style-08]). |
| D-05 | Alvo de toque com `min-height: calc(var(--space) * 11)` (44 px). | Token novo de tamanho. | Decisão D da spec: medidas novas sem tokens. |
| D-06 | A legenda oculta com `hideLabel` usa a classe `srOnly`, igual à do `Toast`. | `aria-label` no grupo sem legenda. | O `<fieldset>` mantém o nome pela `<legend>`. |

## Riscos

- O seletor `:has()` (foco visível no cartão) não existe em navegadores antigos; o rádio continua focável, e o anel cai no próprio `input` visualmente oculto. Aceitável no alvo do ecossistema.
- O jsdom não aplica CSS: o foco no cartão e a borda mais grossa do tom só aparecem no print.

## Referências da spec

RF-05 a RF-09; CT-05 a CT-09; CB-02, CB-03; RN-02, RN-03; RNF-01 a RNF-05, RNF-08; decisões 7 e 9 (inferências B e D).

## Arquivos em comum com a onda

Nenhum. A onda 3 (TASK-06, TASK-08, TASK-09, TASK-11, TASK-12, TASK-14) cria só as próprias pastas; esta tarefa só lê `src/icons/interface-icons.tsx`, da TASK-02.

## O que foi feito

Arquivos criados em `src/radio-group/`:

- `radio-group.types.ts`: `RadioTone` (`success`, `danger`, `neutral`), `RadioOption` e `RadioGroupProps`. Este último estende `ComponentPropsWithRef<'fieldset'>` sem `onChange` e `children`. JSDoc em pt-br.
- `radio-group.constants.ts`: `TONE_ICONS`, com `success` para `CircleCheckIcon` e `danger` para `CircleAlertIcon`.
- `radio-option.tsx`: `RadioOptionItem`, uma `<label>` com o `<input type="radio">` nativo dentro, o `marker`, o texto com a `description`, o ícone do tom (só para `success` e `danger`), o `CheckIcon` (só no cartão marcado) e o `adornment` no fim.
- `radio-group.tsx`: `RadioGroup` com `<fieldset>` raiz, `<legend>` (classe `srOnly` quando `hideLabel`), `div role="radiogroup"` ligado à legenda por `aria-labelledby`, com `aria-readonly` e `aria-invalid`. Ajuda (`<p>`) e erro (`<p role="alert">`) têm ids gerados com `useId`. O `aria-describedby` do `<fieldset>` junta o valor recebido, o id da ajuda e o do erro.
- `radio-group.module.css`: `.root`, `.legend`, `.srOnly`, `.help`, `.error`, `.options`, `.option`, as variantes `.card` e `.checked`, os tons `.success`, `.danger` e `.neutral`, o foco, `.marker`, `.description` e `.check`. Só tokens, com `@media (prefers-reduced-motion: reduce)` zerando a transição de `.option`.
- `radio-group.test.tsx`: 13 testes.

Como funciona:

- Sem `name`, o grupo gera um nome com `useId`, para que os rádios de um mesmo grupo se agrupem entre si.
- Na variante `card`, o `input` vai para `position: absolute` com `opacity: 0`, e o `<label>` inteiro recebe o clique.
- Com `readOnly`, o `onChange` do rádio não chama `onSelect`. Como o `checked` vem da prop, o React mantém a escolha atual.

## Como foi verificado

- TDD: o teste foi escrito antes. Sem o componente, falhou porque `./radio-group` não resolvia.
- Um teste falhou depois por defeito do próprio teste: ele contava a regra `transition: none` do `prefers-reduced-motion` como se fosse uma transição comum. O teste foi corrigido para ignorar essa regra. Os 13 testes passam.
- Regressão: os 3 comandos do baseline foram rodados de novo, com código de saída 0.
- Evidências: `testes-radio.txt` (saída dos testes, 13 passed), `linhas-radio.txt` e `radio-temas.png` (print nos temas), conferidas pelo usuário.

## Pontos de atenção

- No tema escuro, o rádio nativo desmarcado aparece como círculo branco cheio. O CSS do componente só define `accent-color: var(--primary)` no `input`, e não há `color-scheme` em `src/`, então a aparência do rádio segue o navegador. O usuário aceitou esse ponto no print.
- `RadioOptionItem` aceita a prop `describedBy`, mas `RadioGroup` não a repassa. Hoje é uma prop sem uso; quem mexer no componente pode removê-la ou passá-la.
- O foco visível do cartão usa `:has()`. Em navegadores sem suporte, o anel não aparece no cartão; o rádio continua focável pelo teclado.
- O jsdom não aplica CSS. Os testes conferem as regras do `.module.css` lendo o texto do arquivo; o efeito visual do foco, da borda e do tom só foi conferido no print.
