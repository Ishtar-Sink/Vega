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
- O `Accordion` com `Disclosure` controlados não fecha os irmãos por conta própria: no `single`, a spec usa `Disclosure` não controlados. Fica documentado no JSDoc de `type` em `disclosure.types.ts`.

## Referências da spec

RF-13 a RF-15; CT-13 a CT-15; CB-05; FA-03; RNF-01 a RNF-05, RNF-08; decisões 8 e 9 (inferências C e D).

## Arquivos em comum com a onda

Nenhum. A onda 3 cria só as próprias pastas; esta tarefa só lê `src/icons/interface-icons.tsx`, da TASK-02.

## O que foi feito

Arquivos criados em `src/disclosure/`:

- `disclosure.types.ts`: `DisclosureTone` (`default`, `accent`, `warning`, `info`), `DisclosureProps` (estende `ComponentPropsWithRef<'details'>` sem `title`, `open` e `onToggle`) e `AccordionProps` (`type` `single` ou `multiple`, `children` obrigatório). JSDoc em pt-br.
- `accordion-context.ts`: contexto com `name` e `onOpen`. Vale `null` fora do `Accordion` `single`.
- `use-disclosure.ts`: hook `useDisclosure`, que devolve as props do `<details>` e do `<summary>`.
  - Controlado (`open` definido): o `<details>` segue `open`. O clique no resumo faz `preventDefault` e chama `onOpenChange(!open)`.
  - Não controlado: `open` vem de `defaultOpen`, lido uma única vez com `useState`. O evento `toggle` chama `onOpenChange(details.open)` e, se aberto, `accordion.onOpen(details)`.
  - `onKeyDown` do resumo trata Enter e Espaço com `preventDefault` e a mesma alternância do clique.
- `disclosure.tsx`: `Disclosure`, um `<details>` com `name` vindo do `Accordion` (quando há) e um `<summary>` com o ícone (`aria-hidden`), o título e o `ChevronDownIcon`. O conteúdo fica em `<div>` dentro do `<details>`. A classe do tom é aplicada só quando o tom não é `default`.
- `accordion.tsx`: `Accordion`, um `<div>` com `ref` repassado. No `single`, gera o `name` com `useId` e fornece o contexto. `onOpen` fecha os outros `details[open]` da raiz que têm o mesmo `name`. No `multiple`, não há contexto nem `name`.
- `disclosure.module.css`: `.root`, `.summary` (altura mínima de 44 px), `.chevron` (gira com `[open]`), `.content`, a animação em `::details-content` com `interpolate-size`, os tons `.accent`, `.warning` e `.info`, e `@media (prefers-reduced-motion: reduce)` zerando as transições de `.chevron` e `::details-content`. Só tokens.
- `disclosure.test.tsx`: 10 testes.
- `accordion.test.tsx`: 3 testes.

Total: 13 testes.

## Como foi verificado

- TDD: as duas suítes foram escritas antes. Sem os componentes, falharam porque `./disclosure` e `./accordion` não resolviam.
- Os 13 testes passam (`testes-disclosure.txt`, 2 arquivos).
- Regressão: os 3 comandos do baseline foram rodados de novo, com código de saída 0.
- Evidências: `testes-disclosure.txt`, `linhas-disclosure.txt` e `disclosure-temas.png` (print nos temas), conferidas pelo usuário.

## Pontos de atenção

- O jsdom não cobre `::details-content`, então a animação de altura não é testada. Os testes de teclado validam o `onKeyDown` do componente. A ativação nativa do `<summary>` pelo teclado não é coberta pelo jsdom. Animação e teclado foram conferidos só no print.
- No `single`, a exclusividade depende do atributo `name` nos navegadores que o implementam, e do fallback no `toggle` quando não implementam. O fallback só é ligado nos `Disclosure` não controlados; com `open` controlado, o componente não fecha os irmãos por conta própria. Por isso o `single` deve receber `Disclosure` não controlados.
- `::details-content` e `interpolate-size` são recentes. Onde não existem, a seção abre e fecha sem animação, sem prejuízo de uso.
