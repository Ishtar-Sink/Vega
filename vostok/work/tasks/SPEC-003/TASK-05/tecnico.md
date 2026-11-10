<!-- Escrito no planejamento com o que a tarefa vai fazer e enriquecido na conclusão com o que foi feito. -->

## Abordagem

Componente novo com TDD em `src/switch/`, seguindo [project/code-style-09]: `switch.types.ts` com as props, `switch.tsx` com o componente, `switch.module.css` e `switch.test.tsx`. A base é o padrão do Atria (`<button role="switch" aria-checked>`), sem estado próprio: o valor é controlado por `checked` e `onCheckedChange`.

## Decisões

| # | Decisão | Alternativa descartada | Motivo |
|---|---|---|---|
| D-01 | `<button role="switch">` com `<label htmlFor>` ao lado: o rótulo dá o nome acessível e o toque nele aciona o botão. | `<input type="checkbox" role="switch">`. | É o padrão já usado no Atria, e Espaço e Enter vêm prontos do `<button>`. |
| D-02 | Props nativas, `ref` e `className` no `<button>`; o `div` `.field` é só layout. | Props no invólucro. | Regra dos campos da SPEC-001: as props vão para o controle. |
| D-03 | `onClick` recebido é chamado antes, e `event.preventDefault()` cancela a alternância. | Ignorar o `onClick`. | Mantém o comportamento das props nativas sem perder o controle. |
| D-04 | Área de toque de 44 px no `<button>` (`calc(var(--space) * 11)`), com o trilho visual menor. | Trilho de 44 px. | Critério do KT-001: o visual pode ser menor que o alvo. |
| D-05 | Ligado: trilho `primary` e botão à direita; desligado: trilho `borderStrong` e botão à esquerda; desabilitado: `opacity` 0,5. | Só a cor. | [project/theme-06] e RN-03: o estado não depende só do matiz. |

## Riscos

- `<label htmlFor>` num `<button>` aciona o clique em todos os navegadores atuais; o teste `toggles when the label is clicked` cobre o comportamento no jsdom.
- Com o `opacity`, o contraste do desabilitado cai; é o mesmo tratamento dos outros controles desabilitados.

## Referências da spec

RF-03, RF-04, CT-03, CT-04, CB-01; RN-02, RN-03; RNF-01, RNF-02, RNF-03, RNF-08; KT-001 seção "2. `Switch`".

## Arquivos em comum com a onda

Nenhum. Na onda 1, as TASK-01, TASK-03, TASK-04, TASK-07 e TASK-10 não mudam `src/switch/`.

## O que foi feito

- `src/switch/switch.types.ts`: `SwitchProps` estende as props nativas de `button` (sem `onChange` e `children`) e acrescenta `label`, `help`, `checked` e `onCheckedChange`, com JSDoc em pt-br.
- `src/switch/switch.tsx`: componente `Switch`, um `button` com `type="button"`, `role="switch"` e `aria-checked`. O rótulo é um `label` ligado ao botão por `htmlFor`. A ajuda é um `p` com `id`, referenciado por `aria-describedby` junto com o valor recebido. Sem `id`, o componente usa `useId`. O clique chama o `onClick` recebido e, se ele não cancelar o evento, chama `onCheckedChange` com o novo estado. Espaço e Enter vêm do próprio `button`. O tipo `SwitchProps` é reexportado.
- `src/switch/switch.module.css`: só tokens. Área de toque de 44 px no botão; trilho em `primary` quando ligado e em `border-strong` quando desligado; polegar que se desloca conforme `aria-checked`; desabilitado com `opacity` de 0,5. A classe `.text`, que agrupa rótulo e ajuda, não estava no plano e foi acrescentada pelo subagente. O foco visível fica no trilho, e o botão não tem contorno próprio.
- `src/switch/switch.test.tsx`: 10 testes, cobrindo axe, papel e nome, descrição por ajuda, clique, Espaço e Enter, clique no rótulo, desabilitado, props nativas e ref, alvo de 44 px e estado pela posição do polegar.

## Verificação

- Os testes foram escritos antes do componente e falharam com "Failed to resolve import ./switch", como esperado.
- Depois da implementação, `pnpm vitest run src/switch` passa com 10 testes.
- `pnpm exec prettier --write src/switch` aplicado; a Verificação da tarefa terminou sem falhas.
- A saída dos testes (`testes-switch.txt`) e o print do tema (`switch-temas.png`) foram conferidos pelo usuário.

## Pontos de atenção

- Contraste do estado desligado, abaixo do mínimo de 3:1 do WCAG para componentes de interface:
  - trilho `borderStrong` contra o fundo: 1,74:1 no tema claro e 1,89:1 no escuro;
  - botão `surface` contra o trilho: 1,96:1 no claro e 1,76:1 no escuro.
  A cor do trilho veio do KT-001. O usuário conferiu o print e aceitou assim; a correção fica para uma tarefa futura.
- `label` com `htmlFor` apontando para um `button` faz o clique no rótulo acionar o botão. O teste `toggles when the label is clicked` cobre isso no jsdom, mas não substitui a conferência em navegador real.
- O desabilitado usa `opacity` de 0,5, o que reduz o contraste do controle; é o mesmo tratamento dos outros controles desabilitados.
