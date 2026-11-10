<!-- Escrito no planejamento com o que a tarefa vai fazer e enriquecido na conclusão com o que foi feito. -->

## Abordagem

Componente novo com TDD em `src/timer/`, com a divisão de [project/code-style-09]: tipos, constantes (textos padrão e aviso de 5 min), funções puras em `timer.utils.ts` (incluindo o `formatDuration` público, decisões 3 e 11 da spec), o hook `useTimer` em `use-timer.ts`, o componente, o CSS e dois arquivos de teste. Toda a lógica de tempo e de avisos fica em funções puras (`startTimerState`, `stepTimerState`, `evaluateLimits`), testadas sem React; o hook só agenda a próxima virada do segundo e guarda o estado. Reaproveita o `IconButton` com o `EyeIcon` e o `ClockIcon` da 0.2.0.

## Decisões

O perfil é `julgamento`: abaixo, cada decisão traz a alternativa e o critério que decidiu.

| # | Decisão | Alternativa descartada | Critério de escolha |
|---|---|---|---|
| D-01 | `setTimeout` reagendado a cada tique, com atraso `1000 - (now() % 1000)` (`msToNextSecond`). | `setInterval(…, 1000)`. | RF-04 pede alinhamento à virada do segundo do `now`; o `setInterval` começa no instante da montagem, acumula atraso e continua após o fim. O `setTimeout` relê o `now` a cada vez, para no fim e é controlado por `vi.advanceTimersByTime` no teste. |
| D-02 | O tempo mostrado é derivado de `endsAt - state.at` no render; o estado guarda só a última leitura do relógio. | Contador decrementado no estado. | RN-01 e RF-01: o tempo não escorrega com a aba em segundo plano, e um `endsAt` novo recalcula na hora (CB-03). |
| D-03 | No regressivo, o número arredonda para cima (`Math.ceil` em segundos). | Arredondar para baixo. | Com `floor`, `00:00` apareceria um segundo antes do fim e o `onExpire`; com `ceil`, `00:00` coincide com o fim (RF-08). |
| D-04 | `TimerProps` como union discriminado por `direction` (`'down'` opcional, `'up'` obrigatório), separado no componente por `props.direction === 'up'`, e as props só do Timer removidas por `withoutTimerProps` antes do spread. | Um tipo só com `endsAt?` e `startedAt?` opcionais. | Decisão 2 da spec: `endsAt` obrigatório no regressivo e `warnAt`/`onExpire` inexistentes no progressivo, checados pelo TypeScript. O `Object.entries` evita o `delete` dinâmico, recusado pelo ESLint estrito. |
| D-05 | Limites anunciados guardados como lista de valores (`announced`), recalculada a cada tique por `evaluateLimits`: os cruzados e não anunciados são novos; anuncia o menor novo; os que voltaram a ficar acima saem da lista. | Índice do próximo limite ou um `Set` só crescente. | CB-02 (vários de uma vez: só o menor), CB-03 (re-armar quando o tempo sobe) e FA-01 (na montagem, os já cruzados entram na lista sem anúncio). Um índice não re-arma e um `Set` crescente não desfaz. |
| D-06 | Região viva própria, `<span aria-live="polite">` oculta visualmente (`.srOnly`), fora do número; a raiz tem `role="timer"` com o nome `labels.remaining`/`elapsed`. | Pôr o número em `aria-live` ou usar `role="group"` para o nome. | RF-05 e RF-06: o número não é anunciado a cada segundo e os avisos saem também com o tempo oculto (RN-04). `timer` é o papel ARIA do cronômetro, com `aria-live` implícito `off`, e aceita nome; `group` não diz o que é. |
| D-07 | Mensagem esvaziada quando um limite é re-armado. | Manter a última mensagem. | Sem esvaziar, o mesmo texto ("Faltam 10 minutos.") não muda o DOM e o leitor de tela não anuncia de novo (CB-03). |
| D-08 | Estado mudado só no callback do `setTimeout` e `onExpire` chamado num efeito que observa `state.expired`. | `setState` e `onExpire` no corpo de um `useEffect`. | Regras `react-hooks/set-state-in-effect` e `react-hooks/refs` do ESLint do projeto; o efeito sobre `expired` chama `onExpire` uma vez por passagem ao fim. |
| D-09 | O `ClockIcon` aparece só no tom de aviso. | Ícone sempre visível. | [project/theme-06]: o estado de aviso não depende só do matiz; o ícone é a segunda pista, e a pílula neutra fica mais curta a 360 px. |
| D-10 | Botão de ocultar com `IconButton` e `EyeIcon`, ampliado a 44 px por `.toggle`, sem `aria-pressed`. | Botão com texto ou um ícone novo de olho cortado. | RNF-02 e o espaço a 360 px; o nome alterna entre `hide` e `show` (RF-09), e `aria-pressed` junto com nome alternado confunde o leitor de tela. Ícone novo está fora do escopo (só `src/timer/`). |
| D-11 | `locale` aplicado como `lang` da raiz. | Formatar os dígitos com `Intl.NumberFormat`. | O `mm:ss` tem formato fixo pelo contrato de `formatDuration(ms)`, sem `locale`; o `lang` diz ao leitor de tela o idioma dos `labels` sobrescritos. |
| D-12 | Com o tempo oculto, o nome acessível continua com o tempo e o relógio continua a cada segundo. | Nome igual a `labels.hidden` e tique mais lento. | Ocultar tira o número da tela (RN-04); quem usa leitor de tela consulta o tempo só quando quer, sem anúncio. Manter o tique simplifica e garante os avisos na hora. |
| D-13 | Aviso padrão "Falta 1 minuto." no singular. | Sempre "Faltam N minutos.". | RN-03: o padrão em pt-br precisa estar certo para `warnAt` com 1. |

## Riscos

- Fake timers com `user-event` e axe: o axe usa timers reais e o `user-event` precisa de `advanceTimers`; os passos indicam `vi.useRealTimers()` antes do axe e `userEvent.setup({ advanceTimers: vi.advanceTimersByTime })`.
- `tick(ms)` nos testes adianta o relógio e os timers de uma vez; cada chamada gera um único tique (o próximo `setTimeout` só é agendado depois do commit). Os testes usam esse comportamento para simular a aba em segundo plano (CB-02).
- O `timer.tsx` tende a crescer com o union; o passo 7 prevê mover o cálculo da vista para `deriveTimerView` se passar de 200 linhas.
- Em `StrictMode` de desenvolvimento, o efeito do fim pode rodar duas vezes na montagem já expirada; em produção, uma vez.

## Referências da spec

RF-01 a RF-09, RF-18; CT-01 a CT-07, CT-13; CB-01 a CB-04, CB-08; RN-01, RN-03, RN-04; RNF-01 a RNF-07; FA-01 e FA-02; decisões 2, 3, 4, 5, 6, 7, 9 e 11 do "Registro de decisões"; [project/theme-06], [project/theme-07], [project/testing-06].

## Arquivos em comum com a onda

Nenhum. Na onda 1, a TASK-02 (`src/countdown/`) e a TASK-03 (`src/connection-status/`) não mudam `src/timer/`; as três só leem `src/icons/` e `src/theme/`. O índice `src/index.ts` fica para a TASK-04.

## O que foi feito

- `src/timer/timer.types.ts`: `TimerLabels`, `DurationParts`, `TimerCountdownProps` (`endsAt` obrigatório, `warnAt` e `onExpire`), `TimerElapsedProps` (`direction: 'up'` e `startedAt`) e o union `TimerProps`. `TimerBaseProps` não é exportado e omite o `hidden` nativo. `TimerState` é o tipo interno do estado.
- `src/timer/timer.constants.ts`: `DEFAULT_TIMER_LABELS` em pt-br e `DEFAULT_WARNING_MINUTES = 5`.
- `src/timer/timer.utils.ts`: funções puras `toDurationParts`, `formatDuration` (público, reexportado por `timer.tsx`), `describeDuration`, `normalizeWarnAt`, `msToNextSecond`, `evaluateLimits`, `startTimerState`, `stepTimerState` e `withoutTimerProps`. `expiredState` e `nextMessage` são internas.
- `src/timer/use-timer.ts`: `useTimer`, que guarda o `TimerState`, agenda o tique e chama `onExpire`.
- `src/timer/timer.tsx`: `Timer`, com 92 linhas. A raiz é um `div` com `role="timer"`, `aria-label` com o nome (`remaining` ou `elapsed`) e `lang` vindo de `locale`. Dentro há a pílula com o tempo, o `ClockIcon` só quando está no tom de aviso (`data-tone="warning"`), o `IconButton` com `EyeIcon` quando `hideable` e a região `aria-live="polite"` com `srOnly` contendo a mensagem.
- `src/timer/timer.module.css`: só tokens. `font-variant-numeric: tabular-nums` no tempo, `--motion-fast` na troca de cor, botão de 44 px (`calc(var(--space) * 11)`), sem `animation` nem `@keyframes`.
- Testes: `timer.utils.test.ts` (16) e `timer.test.tsx` (27), 43 no total.

## Como foi feito

- TDD: os testes foram escritos antes do código e falharam por falta de `./timer.constants` e `./timer`.
- Relógio: `useTimer` agenda um `setTimeout` a cada virada do segundo (`msToNextSecond`), e não um `setInterval`. Cada tique relê `now()`, para no fim e não acumula atraso.
- O número é derivado de `endsAt - state.at` no render. O estado guarda só a última leitura do relógio, então um `endsAt` novo recalcula na hora.
- Avisos: `announced` guarda os limites já anunciados como lista. Um limite que volta a ficar acima sai da lista e pode ser anunciado de novo. Vários limites cruzados de uma vez anunciam só o menor. Na montagem, os já cruzados entram sem anúncio.
- A mensagem é esvaziada quando um limite é re-armado, para que o mesmo texto seja anunciado de novo.
- Regras do ESLint do projeto: o estado só muda dentro do callback do `setTimeout` (`react-hooks/set-state-in-effect`), e `onExpire` roda num efeito que observa `state.expired`.
- Arredondamento: no regressivo, o número arredonda para cima em segundos, então `00:00` só aparece no fim.
- `withoutTimerProps` remove as props próprias do Timer com `Object.entries` e `Object.fromEntries`, sem `delete`, que o ESLint estrito recusa.
- Desvio no teste: `userEvent.setup({ advanceTimers: vi.advanceTimersByTime })` travava 5 s, porque o `asyncWrapper` do Testing Library só avança timers falsos do Jest. O auxiliar `setupUser()` usa `vi.useFakeTimers({ shouldAdvanceTime: true })`, com o `now` ainda injetado.
- Verificação: testes, regressão (3 comandos do baseline, código 0) e evidências (`testes-timer.txt` e `timer-360.png`) conferidas pelo usuário.

## Pontos de atenção

- O botão de ocultar usa sempre o `EyeIcon`, porque a 0.2.0 não tem ícone de olho riscado. Só o nome acessível muda entre `Esconder o tempo` e `Mostrar o tempo`. O usuário aceitou isso no print.
- O `FocusHeader` não tem slot de filhos (`focus-header.tsx` não recebe `children`). No print, o `Timer` fica ao lado dele, não dentro.
- Em aba em segundo plano, o navegador pode atrasar o `setTimeout`. O número vem da última leitura (`state.at`), então pode ficar parado até o próximo tique. O tempo não se perde, porque cada tique relê `now()`.
- Com o tempo oculto, o nome acessível continua com o tempo e o relógio continua a cada segundo (D-12). Os avisos seguem normais.
- Sem `warnAt`, a pílula muda para o tom de aviso aos 5 minutos. Com `warnAt`, muda no menor limite.
- Os testes de CSS leem o texto do `.module.css` e conferem as regras; não renderizam a transição. O efeito visual foi conferido no print.
