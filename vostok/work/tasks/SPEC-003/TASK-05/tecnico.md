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
