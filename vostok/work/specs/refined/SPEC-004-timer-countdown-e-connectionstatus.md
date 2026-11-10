---
id: SPEC-004
title: "Timer, Countdown e ConnectionStatus"
status: implemented
author: "Victor Batalha"
created_at: 2026-11-10T21:08:49Z
updated_at: 2026-11-10T22:56:12Z
tags: []
type: feature
source: "draft/SPEC-004-timer-countdown-e-connectionstatus.md"
refined_at: 2026-11-10T21:11:35Z
adjustments: 1
adjusted_at: 2026-11-10T21:49:59Z
content_hash: 0bae8e7e268c675262104d5f560a055d3f27d91ae0052dd3465a78944e8ba818
approved_at: 2026-11-10T21:51:18Z
approved_hash: 0bae8e7e268c675262104d5f560a055d3f27d91ae0052dd3465a78944e8ba818
status_history: 2026-11-10T21:13:35Z approved; 2026-11-10T21:28:50Z planned; 2026-11-10T21:49:59Z refined; 2026-11-10T21:51:18Z planned; 2026-11-10T22:56:12Z implemented
changed_ids: []
---

# Timer, Countdown e ConnectionStatus - Especificação Refinada

Acrescenta à Vega o `Timer` (contagem regressiva ou progressiva de uma atividade), o `Countdown` (dias até uma data) e o `ConnectionStatus` (estado da conexão e da sincronização), pedidos pelo Synestia no KT-002, com os utilitários `formatDuration` e `daysBetween` públicos, e publica tudo na 0.3.0.

## Objetivo

O Synestia precisa do cronômetro do simulado e da contagem até a prova até 17/11/2026, e do indicador de conexão antes do PWA offline. O resultado esperado é a `@ishtar-sink/vega` 0.3.0 com os três componentes genéricos, com relógio injetável, textos sobrescrevíveis e acessíveis, para qualquer produto do ecossistema.

## Escopo

### Dentro do escopo

- `Timer` regressivo (`direction="down"`, padrão) e progressivo (`direction="up"`), com ocultar, avisos e fim.
- `Countdown` em dias de calendário, nos tamanhos `display` e `inline`.
- `ConnectionStatus` com os estados `online`, `offline`, `syncing`, `synced` e `error`, nas variantes `chip` e `detail`.
- Utilitários públicos `formatDuration` e `daysBetween`.
- Exportação dos componentes, dos utilitários e dos tipos (props e `*Labels`) pelo `src/index.ts`.
- Publicação da 0.3.0 pela tag `v0.3.0`, com o `CHANGELOG.md` e o `README.md` atualizados.

### Fora do escopo

- A regra de tempo de cada produto: entregar o simulado ao acabar e conferir o tempo no servidor ficam com o produto.
- A sincronização em si: o `ConnectionStatus` só mostra o estado recebido.
- Pendências da 0.2.0 (`BottomSheetLabels`, `FocusHeaderLabels`, véu no tema claro e rádio no tema escuro), que ficam para outra entrega.
- Refatoração dos componentes existentes (SPEC-002).

## Requisitos funcionais

| ID | Requisito |
|---|---|
| RF-01 | O `Timer` com `direction="down"` (padrão) deve mostrar o tempo restante calculado como `endsAt - now()`, nunca por um contador decrementado. |
| RF-02 | O `Timer` com `direction="up"` deve mostrar o tempo decorrido calculado como `now() - startedAt`, sem avisos nem fim. |
| RF-03 | O `Timer` deve formatar o tempo em `mm:ss` abaixo de uma hora e em `h:mm:ss` a partir de uma hora, com `tabular-nums`. |
| RF-04 | O `Timer` deve atualizar uma vez por segundo, alinhado à virada do segundo do relógio `now`. |
| RF-05 | O `Timer` deve ter o tempo atual no nome acessível (`labels.remaining` no regressivo, `labels.elapsed` no progressivo), sem região viva no tempo visível. |
| RF-06 | O `Timer` regressivo deve anunciar cada limite de `warnAt` uma única vez, numa região `aria-live="polite"` própria, também com o tempo oculto. |
| RF-07 | O `Timer` regressivo deve passar ao tom `warning`, com o `ClockIcon`, sem piscar, quando faltar o menor valor de `warnAt` ou, sem `warnAt`, 5 minutos. |
| RF-08 | O `Timer` regressivo deve mostrar `00:00`, anunciar `labels.expired` e chamar `onExpire` uma única vez quando o tempo chegar a zero. |
| RF-09 | O `Timer` com `hideable` (padrão `true`) deve ter um botão que troca o tempo por `labels.hidden`, com nome `labels.hide` ou `labels.show`, controlado por `hidden` e `onHiddenChange` ou não controlado. |
| RF-10 | O `Countdown` deve calcular a diferença em dias de calendário entre `today` e `target` (ISO `AAAA-MM-DD`, sem hora) e mostrar `labels.remaining(days)`. |
| RF-11 | O `Countdown` deve mostrar `labels.today` quando `target` é igual a `today` e `labels.past` quando `target` já passou. |
| RF-12 | O `Countdown` deve aceitar `caption` e os tamanhos `display` (número grande em Outfit, peso `extrabold`) e `inline` (tamanho do texto), formatando o número com `Intl.NumberFormat` no `locale`. |
| RF-13 | O `ConnectionStatus` deve mostrar cada estado com ícone, palavra e fundo `*Soft`: `offline` em `warning` com `WifiOffIcon`, `syncing` em `info` com `RefreshIcon`, `synced` em `success` com `CloudCheckIcon` e `error` em `danger` com `CircleAlertIcon`. |
| RF-14 | O `ConnectionStatus` `online` deve não renderizar nada na variante `chip` e mostrar `labels.online` na variante `detail`. |
| RF-15 | O `ConnectionStatus` deve ter `role="status"` e anunciar a troca de estado, sem anunciar cada mudança de `progress`. |
| RF-16 | O `ConnectionStatus` deve mostrar `progress` no estado `syncing`, `pending` com `labels.pending(count)` e `lastSyncedAt` como tempo relativo com `Intl.RelativeTimeFormat` sobre o `now` injetado. |
| RF-17 | O `ConnectionStatus` com `action` (`label` e `onAction`) deve tornar a caixa inteira um `<button>` e mostrar `action.label` como texto no tom do estado, sublinhado, depois de um `·`, nas duas variantes, sem botão preenchido. |
| RF-18 | O sistema deve exportar `formatDuration(ms)`, que devolve `mm:ss` ou `h:mm:ss`, e `daysBetween(fromIso, toIso)`, que devolve a diferença em dias de calendário. |
| RF-19 | O sistema deve exportar pelo `src/index.ts` `Timer`, `Countdown`, `ConnectionStatus`, `formatDuration`, `daysBetween` e os tipos das props, dos `*Labels` e `ConnectionState`. |
| RF-20 | O sistema deve publicar a versão 0.3.0 pela tag `v0.3.0`, com a entrada no `CHANGELOG.md` e o `README.md` atualizado. |

## Requisitos não funcionais

| ID | Requisito | Como verificar |
|---|---|---|
| RNF-01 | Os três componentes funcionam a partir de 360 px, e o `Timer` cabe no `FocusHeader` a 360 px | Print automático a 360 px nos dois temas |
| RNF-02 | O botão de ocultar do `Timer` tem alvo de toque de pelo menos 44 px | Teste que lê o `.module.css` |
| RNF-03 | Os três componentes passam no axe nos dois temas | `vitest-axe` em cada arquivo de teste |
| RNF-04 | Nenhuma animação contínua; a troca de estado usa `--motion-fast` e some com `prefers-reduced-motion` | Teste que lê o `.module.css` |
| RNF-05 | Os tons usados pelo `Timer` e pelo `ConnectionStatus` passam em AA nos dois temas | Teste com `contrastRatio` sobre os pares de tokens |
| RNF-06 | Testes determinísticos: nada depende da hora atual nem de timers reais | `now` e `today` injetados e `vi.useFakeTimers` nos testes |
| RNF-07 | Arquivos de produção com no máximo 200 linhas e um contexto por arquivo | `wc -l` na verificação e ESLint `max-lines` |
| RNF-08 | Nenhuma requisição de rede nem URL externa no `dist/` | Busca no `dist/`, como na 0.2.0 (`sem-rede.txt`) |

## Regras de negócio

| ID | Regra |
|---|---|
| RN-01 | O tempo do `Timer` é sempre derivado do relógio (`endsAt - now()` ou `now() - startedAt`), para não escorregar com a aba em segundo plano e para o produto retomar passando o mesmo `endsAt`. |
| RN-02 | Os componentes não contêm regra de produto: limites de aviso, datas, estado da conexão e formatos entram por props. |
| RN-03 | Todo texto visível ou anunciado vem de `labels`, com padrão em pt-br; textos com número são funções. |
| RN-04 | Ocultar o tempo tira o número da tela, não os avisos. |
| RN-05 | O `Countdown` não conhece fuso: o produto passa `today` já no fuso do usuário e o atualiza na virada do dia. |

## Fluxos

### Fluxo principal

1. O Synestia abre o simulado e renderiza `<Timer endsAt={fim} warnAt={[30, 10, 5]} onExpire={entregar} />` no `FocusHeader`.
2. A cada virada de segundo do `now`, o `Timer` recalcula `endsAt - now()` e mostra o tempo em `h:mm:ss` ou `mm:ss`.
3. Ao cruzar 30, 10 e 5 minutos, a região viva anuncia `labels.warning(30)`, `labels.warning(10)` e `labels.warning(5)`, uma vez cada; a partir de 5 minutos, a pílula fica em `warning`.
4. A pessoa oculta o tempo pelo botão; a pílula mostra `labels.hidden`, e os avisos seguem sendo anunciados.
5. Ao chegar a zero, o `Timer` mostra `00:00`, anuncia `labels.expired` e chama `onExpire` uma vez; o Synestia entrega o simulado.

### Fluxos alternativos

- **FA-01 (passo 1):** o produto retoma um simulado já em andamento passando o mesmo `endsAt`; o `Timer` mostra o tempo restante certo e anuncia só os limites ainda não cruzados.
- **FA-02 (passo 1):** com `direction="up"` e `startedAt`, o `Timer` mostra o tempo decorrido a partir do passo 2 e não tem os passos 3 e 5.
- **FA-03 (tela Hoje):** o Synestia renderiza `<Countdown target="2026-12-06" today={hoje} caption="Prova em 06/12, domingo" />`, que mostra "Faltam 26 dias" em 10/11/2026.
- **FA-04 (topo do app):** o Synestia renderiza `<ConnectionStatus state={estado} />`; em `online` nada aparece, e em `offline`, `syncing`, `synced` ou `error` aparece o selo, com a troca anunciada.

## Casos de borda

| ID | Situação | Comportamento esperado | Requisitos |
|---|---|---|---|
| CB-01 | O `endsAt` já passou ao montar o `Timer` | Mostra `00:00`, chama `onExpire` uma vez e não anuncia os limites de `warnAt` | RF-08, RF-06 |
| CB-02 | `now` avança vários limites de uma vez (aba em segundo plano) | Anuncia só o menor limite cruzado e não repete os outros | RF-06, RF-01 |
| CB-03 | `endsAt` muda depois de montar | Recalcula o tempo; os limites voltam a valer se o tempo restante subir de novo acima deles | RF-01, RF-06 |
| CB-04 | `warnAt` com valores repetidos ou fora de ordem | Ordena e remove repetidos antes de usar | RF-06, RF-07 |
| CB-05 | `target` ou `today` inválido no `Countdown` | Não renderiza o número e avisa no console fora de produção | RF-10 |
| CB-06 | `progress.total` igual a zero no `ConnectionStatus` | Usa o texto sem progresso de `labels.syncing()` | RF-16 |
| CB-07 | `lastSyncedAt` no futuro em relação a `now` | Trata como agora (`labels` com tempo relativo de 0 segundo) | RF-16 |
| CB-08 | `formatDuration` com valor negativo | Devolve `00:00` | RF-18 |

## Contratos e interfaces

```ts
// src/timer/timer.types.ts
export interface TimerLabels {
  /** Nome do botão com o tempo visível. Padrão: "Esconder o tempo". */
  hide: string;
  /** Nome do botão com o tempo oculto. Padrão: "Mostrar o tempo". */
  show: string;
  /** Texto no lugar do tempo oculto. Padrão: "tempo". */
  hidden: string;
  /** Nome acessível no regressivo. Padrão: "Tempo restante: {duração por extenso}". */
  remaining: (parts: DurationParts) => string;
  /** Nome acessível no progressivo. Padrão: "Tempo decorrido: {duração por extenso}". */
  elapsed: (parts: DurationParts) => string;
  /** Aviso de limite. Padrão: "Faltam {minutes} minutos." */
  warning: (minutes: number) => string;
  /** Aviso do fim. Padrão: "O tempo acabou." */
  expired: string;
}

export interface DurationParts {
  hours: number;
  minutes: number;
  seconds: number;
}

interface TimerBaseProps extends Omit<ComponentPropsWithRef<'div'>, 'children'> {
  /** Relógio injetável, em ms desde a época. Padrão: `Date.now`. */
  now?: () => number;
  hidden?: boolean;
  onHiddenChange?: (hidden: boolean) => void;
  /** Padrão: true. */
  hideable?: boolean;
  locale?: string;
  labels?: Partial<TimerLabels>;
}

export interface TimerCountdownProps extends TimerBaseProps {
  direction?: 'down';
  /** Fim, em ms desde a época (UTC). */
  endsAt: number;
  /** Minutos restantes que geram aviso. Padrão: nenhum. */
  warnAt?: number[];
  onExpire?: () => void;
}

export interface TimerElapsedProps extends TimerBaseProps {
  direction: 'up';
  /** Início, em ms desde a época (UTC). */
  startedAt: number;
}

export type TimerProps = TimerCountdownProps | TimerElapsedProps;
```

```ts
// src/countdown/countdown.types.ts
export interface CountdownLabels {
  /** Padrão: "Faltam {days} dias" / "Falta 1 dia", com o número já formatado. */
  remaining: (days: number, formatted: string) => string;
  /** Padrão: "É hoje". */
  today: string;
  /** Padrão: "Já passou". */
  past: string;
}

export interface CountdownProps extends Omit<ComponentPropsWithRef<'p'>, 'children'> {
  /** Data-alvo, `AAAA-MM-DD`. */
  target: string;
  /** Hoje, `AAAA-MM-DD`, no fuso do usuário. */
  today: string;
  caption?: ReactNode;
  /** Padrão: `display`. */
  size?: 'display' | 'inline';
  locale?: string;
  labels?: Partial<CountdownLabels>;
}
```

```ts
// src/connection-status/connection-status.types.ts
export type ConnectionState = 'online' | 'offline' | 'syncing' | 'synced' | 'error';

export interface ConnectionStatusLabels {
  /** Padrão: "Online" (só na variante `detail`). */
  online: string;
  /** Padrão: "Offline". */
  offline: string;
  /** Padrão: "Sincronizando {done} de {total}" / "Sincronizando". */
  syncing: (progress?: { done: number; total: number }) => string;
  /** Padrão: "Tudo sincronizado · {relative}" / "Tudo sincronizado". */
  synced: (relative?: string) => string;
  /** Padrão: "Falha ao sincronizar". */
  error: string;
  /** Padrão: "{count} na fila". */
  pending: (count: number) => string;
}

export interface ConnectionStatusAction {
  label: string;
  onAction: () => void;
}

export interface ConnectionStatusProps extends Omit<ComponentPropsWithRef<'div'>, 'children'> {
  state: ConnectionState;
  progress?: { done: number; total: number };
  pending?: number;
  /** Última sincronização, em ms desde a época. */
  lastSyncedAt?: number;
  /** Padrão: `Date.now`. */
  now?: () => number;
  /** Padrão: `chip`. */
  variant?: 'chip' | 'detail';
  /** Ação configurada por fora: a caixa inteira vira um botão, com o `label` no fim do texto. */
  action?: ConnectionStatusAction;
  locale?: string;
  labels?: Partial<ConnectionStatusLabels>;
}
```

```ts
// utilitários públicos
/** `mm:ss` abaixo de 1 h, `h:mm:ss` a partir de 1 h; negativo vira `00:00`. */
export function formatDuration(ms: number): string;
/** Dias de calendário de `fromIso` até `toIso` (`AAAA-MM-DD`); negativo se `toIso` é antes. */
export function daysBetween(fromIso: string, toIso: string): number;
```

Índice (`src/index.ts`), acrescentado: `Timer`, `Countdown`, `ConnectionStatus`, `formatDuration`, `daysBetween` e os tipos `TimerProps`, `TimerCountdownProps`, `TimerElapsedProps`, `TimerLabels`, `DurationParts`, `CountdownProps`, `CountdownLabels`, `ConnectionStatusProps`, `ConnectionStatusLabels`, `ConnectionStatusAction` e `ConnectionState`.

## Componentes afetados

| Caminho | Ação | Motivo |
|---|---|---|
| `src/timer/timer.constants.ts` | alterar | `Timer`, tipos, constantes, hook do relógio e `formatDuration` (RF-01 a RF-09, RF-18) |
| `src/timer/timer.module.css` | alterar | `Timer`, tipos, constantes, hook do relógio e `formatDuration` (RF-01 a RF-09, RF-18) |
| `src/timer/timer.test.tsx` | alterar | `Timer`, tipos, constantes, hook do relógio e `formatDuration` (RF-01 a RF-09, RF-18) |
| `src/timer/timer.tsx` | alterar | `Timer`, tipos, constantes, hook do relógio e `formatDuration` (RF-01 a RF-09, RF-18) |
| `src/timer/timer.types.ts` | alterar | `Timer`, tipos, constantes, hook do relógio e `formatDuration` (RF-01 a RF-09, RF-18) |
| `src/timer/timer.utils.test.ts` | alterar | `Timer`, tipos, constantes, hook do relógio e `formatDuration` (RF-01 a RF-09, RF-18) |
| `src/timer/timer.utils.ts` | alterar | `Timer`, tipos, constantes, hook do relógio e `formatDuration` (RF-01 a RF-09, RF-18) |
| `src/timer/use-timer.ts` | alterar | `Timer`, tipos, constantes, hook do relógio e `formatDuration` (RF-01 a RF-09, RF-18) |
| `src/countdown/countdown.constants.ts` | alterar | `Countdown`, tipos, constantes e `daysBetween` (RF-10 a RF-12, RF-18) |
| `src/countdown/countdown.module.css` | alterar | `Countdown`, tipos, constantes e `daysBetween` (RF-10 a RF-12, RF-18) |
| `src/countdown/countdown.test.tsx` | alterar | `Countdown`, tipos, constantes e `daysBetween` (RF-10 a RF-12, RF-18) |
| `src/countdown/countdown.tsx` | alterar | `Countdown`, tipos, constantes e `daysBetween` (RF-10 a RF-12, RF-18) |
| `src/countdown/countdown.types.ts` | alterar | `Countdown`, tipos, constantes e `daysBetween` (RF-10 a RF-12, RF-18) |
| `src/countdown/countdown.utils.test.ts` | alterar | `Countdown`, tipos, constantes e `daysBetween` (RF-10 a RF-12, RF-18) |
| `src/countdown/countdown.utils.ts` | alterar | `Countdown`, tipos, constantes e `daysBetween` (RF-10 a RF-12, RF-18) |
| `src/connection-status/connection-status.constants.ts` | alterar | `ConnectionStatus`, tipos e constantes (RF-13 a RF-17) |
| `src/connection-status/connection-status.module.css` | alterar | `ConnectionStatus`, tipos e constantes (RF-13 a RF-17) |
| `src/connection-status/connection-status.test.tsx` | alterar | `ConnectionStatus`, tipos e constantes (RF-13 a RF-17) |
| `src/connection-status/connection-status.tsx` | alterar | `ConnectionStatus`, tipos e constantes (RF-13 a RF-17) |
| `src/connection-status/connection-status.types.ts` | alterar | `ConnectionStatus`, tipos e constantes (RF-13 a RF-17) |
| `src/connection-status/connection-status.utils.ts` | alterar | `ConnectionStatus`, tipos e constantes (RF-13 a RF-17) |
| `src/index.ts` | alterar | Exporta os componentes, os utilitários e os tipos (RF-19) |
| `src/index.test.ts` | alterar | Superfície pública com os nomes novos (RF-19) |
| `package.json` | alterar | Versão 0.3.0 (RF-20) |
| `CHANGELOG.md` | alterar | Entrada `[0.3.0]` (RF-20) |
| `README.md` | alterar | Componentes novos e utilitários (RF-20) |

## Premissas e dependências

- A 0.2.0 está publicada, com `ClockIcon`, `WifiOffIcon`, `RefreshIcon`, `CloudCheckIcon` e `CircleAlertIcon` em `src/icons/` e o `FocusHeader` em `src/focus-header/`.
- O workflow `Release` e o segredo `NPM_TOKEN` da 0.1.0 continuam válidos; a tag `v0.3.0` é criada pelo usuário.
- O Synestia passa `endsAt` vindo do servidor e `today` no fuso do usuário.
- Nenhuma dependência de runtime nova: `Intl` e React bastam.

## Riscos

| Risco | Impacto | Mitigação |
|---|---|---|
| Prazo de 17/11 para o `Timer` e o `Countdown` | alto | Os três componentes em paralelo na mesma onda; o `Timer` primeiro na ordem das tarefas |
| Timers reais deixam os testes instáveis | médio | `now` injetado e `vi.useFakeTimers`, sem depender da hora atual (RNF-06) |
| Avisos repetidos ou perdidos quando a aba volta do segundo plano | médio | Limites guardados por valor já anunciado, recalculados a partir de `now` (CB-02) |
| Leitor de tela anunciando cada segundo ou cada item sincronizado | médio | Tempo fora da região viva e progresso fora do `role="status"` (RF-05, RF-15) |
| O union `TimerProps` complica o uso com spread de props | baixo | `direction` como discriminante, com `down` como padrão, e testes de tipo |

## Casos de teste

| ID | Cenário | Passos | Resultado esperado | Requisitos |
|---|---|---|---|---|
| CT-01 | Tempo regressivo calculado | `now` fixo e `endsAt` 12 min 40 s depois; depois `now` + 1 s | Mostra `12:40` e depois `12:39` | RF-01, RF-03, RF-04 |
| CT-02 | Formato com horas | `endsAt` 4 h 30 min depois de `now` | Mostra `4:30:00` | RF-03, RF-18 |
| CT-03 | Progressivo | `direction="up"`, `startedAt` 65 s antes de `now` | Mostra `01:05`, sem região de aviso e sem chamar `onExpire` | RF-02 |
| CT-04 | Nome acessível sem região viva | Renderizar com 12 min 40 s | O nome é "Tempo restante: 12 minutos e 40 segundos" e o tempo visível não está em `aria-live` | RF-05 |
| CT-05 | Avisos uma vez cada | `warnAt=[30,10,5]`, avançar o `now` por 30, 10 e 5 minutos | A região viva recebe cada aviso uma vez, também com o tempo oculto | RF-06, RF-07 |
| CT-06 | Fim | Avançar o `now` além de `endsAt` | Mostra `00:00`, anuncia `labels.expired` e chama `onExpire` uma vez | RF-08 |
| CT-07 | Ocultar por teclado | Tab até o botão, Enter e depois Espaço | Troca o tempo por `labels.hidden` e volta; o nome do botão alterna entre `hide` e `show` | RF-09 |
| CT-08 | Dias até a prova | `today="2026-11-10"`, `target="2026-12-06"` | Mostra "Faltam 26 dias", sem região viva | RF-10, RF-12 |
| CT-09 | Hoje e passado | `target` igual a `today` e um dia antes | Mostra "É hoje" e "Já passou" | RF-11 |
| CT-10 | Estados da conexão | Renderizar os cinco estados nas duas variantes e nos dois temas | Ícone e palavra em cada estado, axe sem violação e AA; `online` em `chip` sem nada | RF-13, RF-14 |
| CT-11 | Anúncio da troca | Trocar `offline` para `syncing` e mudar `progress` de 1/5 para 2/5 | A troca é anunciada uma vez e o progresso não é anunciado | RF-15, RF-16 |
| CT-12 | Tempo relativo e fila | `synced` com `lastSyncedAt` 2 min antes do `now` e `pending=3` no `detail` | Mostra "Tudo sincronizado · há 2 minutos" e "3 na fila" | RF-16 |
| CT-16 | Ação na pílula | `error` com `action={{ label: 'Tentar de novo', onAction }}` no `chip` e no `detail`; clique e Enter | A caixa inteira é um `button` com o nome que inclui "Tentar de novo", o texto da ação fica no tom do estado e `onAction` é chamado; a região `role="status"` fica fora do botão | RF-17 |
| CT-13 | Utilitários | `formatDuration(-1)`, `formatDuration(3599000)`, `daysBetween("2026-11-10","2026-12-06")` | `00:00`, `59:59` e `26` | RF-18 |
| CT-14 | Índice | Importar o índice | Os nomes novos existem e a superfície é exatamente a lista | RF-19 |
| CT-15 | Publicação | Tag `v0.3.0` e `npm view` | 0.3.0 como `latest`, com provenance, CHANGELOG e README atualizados | RF-20 |

## Critérios de aceite

- [ ] CA-01: Com `now` injetado, o `Timer` mostra `endsAt - now()` em `mm:ss` e `h:mm:ss`, e o progressivo mostra `now() - startedAt` (RF-01, RF-02, RF-03, RF-04).
- [ ] CA-02: Cada limite de `warnAt` é anunciado uma única vez na região viva, também com o tempo oculto, e o tempo visível não está em região viva (RF-05, RF-06, RF-07).
- [ ] CA-03: O `onExpire` é chamado uma única vez, com `00:00` na tela (RF-08).
- [ ] CA-04: O botão de ocultar tem nome acessível, funciona por teclado e tem 44 px (RF-09).
- [ ] CA-05: O `Countdown` de 06/12/2026 a partir de 10/11/2026 mostra "Faltam 26 dias", mostra `labels.today` no dia e `labels.past` depois, sem região viva (RF-10, RF-11, RF-12).
- [ ] CA-06: Os cinco estados do `ConnectionStatus` passam no axe e em AA nos dois temas, e `online` em `chip` não renderiza nada (RF-13, RF-14).
- [ ] CA-07: A troca de estado é anunciada uma vez, o progresso não é anunciado a cada item e o tempo relativo usa o `now` injetado (RF-15, RF-16).
- [ ] CA-11: Com `action`, a pílula inteira do `ConnectionStatus` é um botão discreto, com o texto da ação no tom do estado, sem botão preenchido (RF-17).
- [ ] CA-08: `formatDuration` e `daysBetween` são exportados e passam nos casos do CT-13 (RF-18).
- [ ] CA-09: O índice exporta os três componentes, os dois utilitários e os tipos (RF-19).
- [ ] CA-10: A `@ishtar-sink/vega` 0.3.0 está publicada com provenance pelo workflow da tag `v0.3.0`, com o `CHANGELOG.md` e o `README.md` atualizados (RF-20).

## Referências

| Tipo | Referência | Uso |
|---|---|---|
| documentação | `docs/KT-002-vega-timer-e-conexao.md` | Pedido, interfaces propostas, prazos e critérios do Synestia |
| arquivo | `src/color-field/color-picker.tsx` | Precedente de `labels` como função (`wheelValue`) |
| arquivo | `src/calendar/calendar.tsx` | Precedente de data ISO e `today` injetável |
| arquivo | `src/index.ts` | Precedente de utilitários públicos (`parseTime`, `formatCents`) e tipos `*Labels` exportados |
| arquivo | `src/theme/tokens.ts` | Tokens `warning`, `info`, `success`, `danger` e `*Soft`, `fontWeights.extrabold`, `fontSizes.xxxl` e `motion.fast` |
| arquivo | `src/icons/interface-icons.tsx` | Ícones da 0.2.0 usados pelos componentes |
| arquivo | `vostok/rules/project/theme.md` | [project/theme-06] e [project/theme-07] |
| arquivo | `vostok/rules/project/architecture.md` | [project/architecture-02] a [project/architecture-05] |
| memória | busca por timer, countdown, relógio, conexão e labels | Nenhuma entrada encontrada |

## O que mudou

| # | Assunto | Estado no Original | Estado Refinado |
|---|---|---|---|
| 1 | Versão | Os três numa 0.3.0, ou 0.3.0 e 0.3.1 (a Vega decide) | Uma 0.3.0 com os três |
| 2 | Timer progressivo | Fora do escopo, com espaço na proposta | `direction="up"` com `startedAt` já nesta spec |
| 3 | Formatação de duração e de dias | Utilitário exportado ou interno (a Vega decide) | `formatDuration` e `daysBetween` exportados |
| 4 | `labels` com número | Função ou formato de mensagem (a Vega decide) | Funções, como `wheelValue` da 0.1.0 |
| 5 | Nome acessível do `Timer` | Exemplo "Tempo restante: 12 minutos e 40 segundos", sem label | `labels.remaining` e `labels.elapsed` com `DurationParts` |
| 6 | `online` na variante `detail` | Não definido | Mostra `labels.online` ("Online") |

## Registro de decisões

| # | Decisão | Alternativa descartada | Motivo |
|---|---|---|---|
| 1 | Uma 0.3.0 com os três componentes (usuário) | 0.3.0 e 0.3.1 | Os três são pequenos e independentes e rodam na mesma onda; uma publicação só |
| 2 | `Timer` progressivo agora, com `direction` (usuário) | Deixar para quando um produto pedir | Decisão do usuário; o union discriminado mantém `endsAt` obrigatório no regressivo |
| 3 | `formatDuration` e `daysBetween` públicos (usuário) | Só internos | Decisão do usuário, como `parseTime` e `formatCents` da 0.1.0 |
| 4 | `labels` com número como funções (inferência A) | Formato de mensagem tipo ICU | Precedente do `wheelValue` do `ColorPicker` e sem dependência nova |
| 5 | Tipos `*Labels` e `DurationParts` exportados (inferência B) | Só as props | Convenção da 0.1.0 (`CalendarLabels`, `DateFieldLabels`) e a lacuna vista na 0.2.0 |
| 6 | Progressivo sem avisos nem fim (inferência C) | Avisos por tempo decorrido | O KT só descreve avisos e fim para o regressivo |
| 7 | `labels.remaining`/`elapsed` recebem `DurationParts` (inferência D) | Texto fixo montado no componente | Permite plural e tradução por produto ([project/language-06]) |
| 8 | `labels.online` só no `detail` (inferência E) | Não renderizar nada também no `detail` | A tela de ajustes precisa mostrar o estado mesmo sem problema |
| 9 | Tom `warning` no menor `warnAt` ou 5 min (inferência F) | Sempre 5 min | Texto do KT: "nos últimos 5 minutos (ou no menor valor de `warnAt`)" |
| 10 | Progresso de `syncing` fora da região `role="status"` (inferência G) | Região viva com o texto todo | O KT pede anúncio só ao começar e ao terminar |
| 11 | Utilitários nas pastas dos componentes: `formatDuration` em `src/timer/`, `daysBetween` em `src/countdown/` (inferência H) | Pasta comum `src/time-format/` | As tarefas ficam independentes e rodam em paralelo |
| 12 | `action` do `ConnectionStatus` como `{ label, onAction }`, com a caixa inteira clicável e o texto da ação no tom do estado (usuário, ajuste 1) | `action: ReactNode` com um `Button` preenchido | No print, o botão preenchido destoava das pílulas e vazava delas; o Material orienta ação de aviso curto como texto colorido, nunca preenchido |

## Pendências

| # | Pendência | Opções em aberto |
|---|---|---|
| - | - | - |

## Histórico de ajustes

| # | Data | Origem | Resumo |
|---|---|---|---|
| 1 | 2026-11-10 | agente | RF-17: action vira { label, onAction }, com a pílula inteira clicável e o texto da ação no tom do estado; CT-12 sem a ação; CT-16 e CA-11 novos; CA-07 sem RF-17; ConnectionStatusAction no contrato e no índice; componentes afetados listados por arquivo |
