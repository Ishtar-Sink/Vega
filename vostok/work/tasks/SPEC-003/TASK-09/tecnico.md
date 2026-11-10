<!-- Escrito no planejamento com o que a tarefa vai fazer e enriquecido na conclusão com o que foi feito. -->

## Abordagem

TDD: o teste vem antes do código. O `Callout` segue o padrão de tom do `Toast` (fundo `*-soft`, ícone e cor cheia do tom), sem a região viva fixa: ele é um `<aside>` nomeado pelo título e só vira `role="status"` com `live="polite"`. O mapa de ícones fica em `callout.constants.ts` e os tipos em `callout.types.ts` ([project/code-style-09]).

## Decisões

| # | Decisão | Alternativa descartada | Motivo |
|---|---|---|---|
| D-01 | Ícones padrão: `neutral` e `info` com `InfoIcon`, `accent` com `LightbulbIcon`, `success` com `CircleCheckIcon`, `warning` com `AlertTriangleIcon`, `danger` com `CircleAlertIcon`. | Um ícone diferente para o neutro. | A primeira leva de ícones (RF-01) não tem um neutro próprio; o neutro se distingue do `info` pelo fundo e pela borda. |
| D-02 | O `<aside>` é nomeado pelo título (`aria-labelledby`); sem título, fica sem nome. | `aria-label` obrigatório. | O título já é visível; [project/language-06] não pede texto oculto novo. |
| D-03 | `live="polite"` troca o papel para `status` em vez de acrescentar `aria-live`. | `aria-live` no `<aside>`. | RF-18 e CT-17 pedem `role="status"`, que já implica o anúncio educado. |
| D-04 | Teste do ícone comparando o `innerHTML` do `svg` com o do ícone esperado renderizado à parte. | Procurar um caminho SVG do Lucide. | Convenção da spec: os testes não dependem dos caminhos internos do `lucide-react`. |
| D-05 | Neutro com `surfaceMuted` e borda `border`. | Neutro sem fundo. | O aviso continua destacado do texto da página. |

## Riscos

- O axe tem a regra de boas práticas `landmark-complementary-is-top-level`: um `<aside>` dentro de `<main>` é marcado. Os testes renderizam fora de landmarks; se o Synestia rodar o axe com boas práticas, a spec de troca deve considerar `role="note"` ou ajuste por `role` (o `role` recebido é repassado).
- `info` e `neutral` com o mesmo ícone: a diferença fica no fundo, conferida no print.

## Referências da spec

RF-16 a RF-18; CT-16, CT-17; CB-06; RN-02, RN-03; RNF-01, RNF-03, RNF-05, RNF-08.

## Arquivos em comum com a onda

Nenhum. A onda 3 cria só as próprias pastas; esta tarefa só lê `src/icons/interface-icons.tsx`, da TASK-02.

## O que foi feito

Arquivos criados em `src/callout/`:

- `callout.types.ts`: `CalloutTone` (seis valores) e `CalloutProps`, que estende `ComponentPropsWithRef<'aside'>` sem `title`. Os campos são `tone`, `title`, `icon` (`ReactNode` ou `false`), `action` e `live` (`off` ou `polite`). JSDoc em pt-br.
- `callout.constants.ts`: `TONE_ICONS`, com o ícone padrão de cada tom (decisão D-01).
- `callout.tsx`: `Callout`, com `tone = 'neutral'` e `live = 'off'`.
  - `role` vira `status` quando `live="polite"`; caso contrário, usa o `role` recebido.
  - `aria-labelledby` aponta para o título, gerado com `useId`, quando há `title`.
  - `icon={false}` não renderiza ícone. Um `icon` recebido vai dentro de um `<span aria-hidden="true">`. Sem `icon`, renderiza o ícone padrão do tom.
  - O corpo tem o título (`<p>`) e os `children`. A `action`, quando passada, vai em `<div>` no fim.
- `callout.module.css`: `.root` (flex com quebra de linha), `.icon`, `.body`, `.title`, `.action` (linha própria abaixo de 480 px, à direita a partir de 480 px), e um bloco por tom com fundo `*-soft` e ícone e título na cor do tom. O neutro usa `surface-muted` e borda `border`. Só tokens.
- `callout.test.tsx`: 14 testes, sendo 6 do `it.each` por tom e 8 individuais.

## Como foi verificado

- TDD: o teste foi escrito antes. Sem o componente, falhou porque `./callout` não resolvia.
- Os 14 testes passam (`testes-callout.txt`).
- Regressão: os 3 comandos do baseline foram rodados de novo, com código de saída 0.
- Evidências: `testes-callout.txt`, `linhas-callout.txt` e `callout-temas.png` (print nos temas, em light, dark e a 360 px), conferidas pelo usuário.

## Pontos de atenção

- O `.action` muda de linha com `@media (min-width: 480px)`, que olha a largura da janela, não a da coluna onde o `Callout` está. No print de 360 px, o componente estava numa coluna desse tamanho dentro de uma página mais larga, e a ação ficou ao lado do texto, que quebrou em três linhas curtas. Esse ponto foi aceito pelo usuário. Numa janela de 360 px, a regra põe a ação em linha própria; esse comportamento não foi conferido num navegador nessa largura.
- Um ícone recebido por `icon` fica dentro de `<span aria-hidden="true">`. Quem passa um ícone com sentido próprio, sem texto, perde esse sentido para leitores de tela; o texto precisa dizer o que o ícone mostra.
- `info` e `neutral` usam o mesmo `InfoIcon`. A diferença fica no fundo e na borda.
- O planejamento aponta a regra `landmark-complementary-is-top-level` do axe: um `<aside>` dentro de `<main>` pode ser marcado se o axe rodar com as boas práticas. Os testes renderizam fora de landmarks, então esse caso não é coberto.
- `live="polite"` substitui o `role` recebido por `status`. Quem precisar de outro papel não deve usar `live`.
