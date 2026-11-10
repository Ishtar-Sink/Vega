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
