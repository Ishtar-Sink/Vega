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
