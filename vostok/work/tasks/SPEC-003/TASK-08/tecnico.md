<!-- Escrito no planejamento com o que a tarefa vai fazer e enriquecido na conclusão com o que foi feito. -->

## Abordagem

TDD: as duas suítes vêm antes do código. O `Disclosure` é um `<details>` nativo, que já dá o anúncio de aberto e fechado. O estado fica num hook (`use-disclosure.ts`), que trata o modo controlado, o não controlado e o teclado; o `Accordion` fornece um contexto com o `name` do grupo e fecha os irmãos quando um abre.

## Decisões

| # | Decisão | Alternativa descartada | Motivo |
|---|---|---|---|
| D-01 | Props nativas no `<details>` raiz; `defaultOpen` é uma prop própria que define o estado inicial do não controlado. | Prop `initiallyOpen`. | [project/code-style-03]; `defaultOpen` segue o nome que o React usa para estado inicial (`defaultValue`, `defaultChecked`). |
| D-02 | Enter e Espaço no `<summary>` são tratados pelo componente (`preventDefault` e alternância), nos dois modos. | Confiar só na ativação nativa. | O jsdom e o `user-event` não ativam o `<summary>` pelo teclado (conferido no planejamento), e o `preventDefault` evita a alternância dupla no navegador. |
| D-03 | `single` com o atributo `name` do `<details>` e, como fallback, o `Accordion` fecha os irmãos no evento `toggle` (FA-03). | Só o atributo `name`. | Decisão 8 da spec (inferência C): o jsdom e navegadores antigos não implementam o `name`. |
| D-04 | No modo controlado, o clique no resumo faz `preventDefault` e chama `onOpenChange(!open)`; o `<details>` segue a prop. | Deixar o navegador alternar e corrigir no `toggle`. | Evita o piscar do estado e cobre o CB-05 (controlado sem `onOpenChange`). |
| D-05 | Altura animada por `::details-content` com `interpolate-size: allow-keywords`; sem suporte, abre direto. | Medir a altura em script. | Sem script nem medida literal; [project/theme-07] continua respeitado. |
| D-06 | Bloco `@media (prefers-reduced-motion: reduce)` no próprio CSS, além do zero global dos `--motion-*` no `tokens.css`. | Depender só do zero global. | RNF-04 é verificado lendo o `.module.css` do componente. |

## Riscos

- `::details-content` e `interpolate-size` são recentes; onde faltam, a seção abre sem animar, sem prejuízo de uso.
- O `preventDefault` no Espaço precisa impedir a ativação nativa no `keyup`; se um navegador alternar duas vezes, o teste em navegador real fica para a conferência do print e do uso no Synestia.
- O `Accordion` com `Disclosure` controlados não fecha os irmãos por conta própria: no `single`, a spec usa `Disclosure` não controlados. Fica documentado no JSDoc.

## Referências da spec

RF-13 a RF-15; CT-13 a CT-15; CB-05; FA-03; RNF-01 a RNF-05, RNF-08; decisões 8 e 9 (inferências C e D).

## Arquivos em comum com a onda

Nenhum. A onda 3 cria só as próprias pastas; esta tarefa só lê `src/icons/interface-icons.tsx`, da TASK-02.
