---
id: KT-002
title: "Timer, Countdown e ConnectionStatus para a Vega"
status: ready
author: "Victor Batalha"
created_at: 2026-11-10
origin: Ishtar-Sink/Synestia
destination: Ishtar-Sink/Vega
sources: [ESTUDO-002, ESTUDO-003, SPEC-001]
---

# Timer, Countdown e ConnectionStatus para a Vega

## Como usar este documento

Este é um documento de transferência de conhecimento (KT) do Synestia para a Vega. Ele foi
gerado no repositório do Synestia e **não alterou nada fora dele**. Para virar trabalho na
Vega:

1. Copie este arquivo para o repositório da Vega ou cole o conteúdo numa sessão aberta lá.
2. Peça a criação de uma spec a partir dele (`create-spec`).
3. As decisões marcadas como **"a Vega decide"** ficam para o refinamento lá. Este documento
   propõe uma solução, mas não fecha a decisão.

A fonte está no [ESTUDO-003](../estudos/ESTUDO-003-componentes-para-a-vega.md), que pôs os
três componentes no lote 2, e na SPEC-001 do Synestia (MVP pessoal), que decidiu pedi-los
agora em vez de criá-los no Synestia (`[project/stack-07]` do Synestia).

## Contexto

A Vega 0.2.0 publicou o lote 1 do [KT-001](KT-001-vega-lote-1.md). Dois pontos da interface
do Synestia ficaram sem componente:

- **O cronômetro do simulado e a contagem até a prova.** São a última parte do núcleo do MVP
  do Synestia, que precisa estar usável por volta de **22/11/2026**.
- **O indicador de conexão** (offline, sincronizando, sincronizado, falha). Ele só entra na
  SPEC-002 do Synestia (PWA offline), depois da fase 1.

A regra é a mesma do KT-001: o que serve a mais de um produto vai para a Vega. O ESTUDO-003
lista quem mais usaria cada um:
- **`Timer` e `Countdown`:** o Flare (duração) e o Atria (lembretes).
- **`ConnectionStatus`:** qualquer PWA do ecossistema.

**Prazo desejado:**

| Item | Prazo | Por quê |
|---|---|---|
| `Timer` | até **17/11** | O simulado é a última tarefa do núcleo da SPEC-001 do Synestia |
| `Countdown` | até **17/11** | A tela Hoje do Synestia usa na contagem até a prova |
| `ConnectionStatus` | sem pressa, antes da SPEC-002 do Synestia | Só é usado com o PWA offline |

Se não der para tudo, a ordem da seção [Ordem](#ordem) entrega primeiro o que destrava o
Synestia.

## Escopo

**Componentes novos:**

1. `Timer`, a contagem regressiva de uma atividade com tempo (ex.: um simulado de 4h30).
2. `Countdown`, a contagem em dias até uma data (ex.: "Faltam 26 dias").
3. `ConnectionStatus`, o indicador do estado da conexão e da sincronização.

**Fora do escopo:**

- **A regra de tempo de cada produto.** Quando o tempo acaba, quem entrega o simulado, que
  ainda confere o tempo no servidor, é o Synestia.
- **A sincronização em si.** O `ConnectionStatus` só mostra o estado que o produto informa.
- **Cronômetro progressivo (tempo decorrido).** Fica para quando um produto pedir; a
  proposta abaixo deixa espaço para ele (ver "A Vega decide").

## Regras da Vega que este pedido respeita

| Regra da Vega | Efeito neste lote |
|---|---|
| `architecture-02`, `architecture-03` | Cada componente em `src/<componente>/`, com `.tsx`, `.module.css` e `.test.tsx`, exportado pelo `src/index.ts` com os tipos |
| `architecture-04`, `code-style-07` | Nenhuma regra de produto no componente: os limites de aviso, o formato e o estado entram por props |
| `code-style-03` | Cada componente estende as props nativas do elemento e repassa `className`, `style`, os atributos e a `ref` |
| `language-06` | Todo texto visível é uma prop sobrescrevível (`labels`), com padrão em pt-br; números e datas com `Intl` no `locale` recebido |
| `accessibility-01`, `accessibility-02` | WCAG AA; o botão de ocultar do `Timer` é alcançável por teclado e tem nome acessível |
| `theme-06` | Os estados do `ConnectionStatus` usam o fundo `*Soft`, ícone e palavra, nunca só a cor |
| `theme-07` | Nenhuma animação contínua; a troca de estado usa `--motion-fast` e respeita `prefers-reduced-motion` |
| `testing-01` a `testing-03` | Testes por papel e nome acessível, axe sem violações e teclado testado com `user-event` |

Também vale o que o KT-001 pediu para o lote 1: funcionar a partir de 360 px e ter alvo de
toque de 44 px no celular.

**Relógio injetável.** Os três componentes recebem o relógio por prop, como o `Calendar` já
recebe `today`. É o que deixa os testes determinísticos, nos dois repositórios.

## Ordem

| Ordem | Item | Por quê |
|---|---|---|
| 1 | `Timer` | Destrava o simulado do Synestia, última tarefa do núcleo |
| 2 | `Countdown` | É pequeno e usa a mesma base de formatação do `Timer` |
| 3 | `ConnectionStatus` | Só é usado na SPEC-002 do Synestia |

## Componentes novos

As interfaces abaixo são propostas. Os nomes finais e os detalhes ficam para o refinamento
na Vega.

### 1. `Timer`

**Para que serve no Synestia:** o cronômetro do simulado em modo prova, pequeno no
`FocusHeader`, com a opção de ocultar. No Flare: a duração de uma atividade. No Atria: o
tempo de uma sessão de leitura.

```ts
export interface TimerLabels {
  /** Nome acessível do botão quando o tempo está visível. Padrão: "Esconder o tempo". */
  hide: string;
  /** Nome acessível do botão quando o tempo está oculto. Padrão: "Mostrar o tempo". */
  show: string;
  /** Texto visível no lugar do tempo quando oculto. Padrão: "tempo". */
  hidden: string;
  /** Aviso anunciado ao passar de um limite. Padrão: "Faltam {minutes} minutos." */
  warning: (minutes: number) => string;
  /** Aviso anunciado quando o tempo acaba. Padrão: "O tempo acabou." */
  expired: string;
}

export interface TimerProps extends Omit<ComponentPropsWithRef<'div'>, 'children'> {
  /** Momento em que o tempo acaba, em milissegundos desde a época (UTC). */
  endsAt: number;
  /** Relógio injetável. Padrão: `Date.now`. */
  now?: () => number;
  /** Limites de aviso, em minutos restantes. Padrão: nenhum. O Synestia usa [30, 10, 5]. */
  warnAt?: number[];
  /** Estado controlado de oculto. Sem ele, o componente controla o próprio estado. */
  hidden?: boolean;
  onHiddenChange?: (hidden: boolean) => void;
  /** Chamado uma vez, quando o tempo chega a zero. */
  onExpire?: () => void;
  /** Mostrar o botão de ocultar. Padrão: true. */
  hideable?: boolean;
  locale?: string;
  labels?: Partial<TimerLabels>;
}
```

**Comportamento e acessibilidade:**

- **Formato:** `mm:ss` abaixo de uma hora e `h:mm:ss` acima, com algarismos de largura fixa
  (`tabular-nums`), para o número não "pular".
- **Tempo como cálculo, não contagem.** O tempo restante é sempre `endsAt - now()`, nunca um
  contador decrementado. Assim o tempo não escorrega com a aba em segundo plano, e o
  produto que retoma um simulado só passa o mesmo `endsAt`.
- **Leitor de tela:** o tempo visível **não** fica numa região viva, para não ser anunciado a
  cada segundo. Os avisos de `warnAt` e o fim vão numa região `aria-live="polite"` própria,
  uma vez cada. O tempo atual fica disponível pelo nome acessível do componente (ex.: "Tempo
  restante: 12 minutos e 40 segundos"), lido quando o foco chega a ele.
- **Ocultar:** o botão alterna entre o tempo e o texto `labels.hidden`. Oculto, os avisos de
  `warnAt` continuam sendo anunciados: ocultar tira o número da tela, não o aviso.
- **Atualização:** uma vez por segundo, alinhada à virada do segundo. Com o tempo oculto, o
  componente pode atualizar menos, desde que os avisos saiam na hora.
- **Estados:** nos últimos 5 minutos (ou no menor valor de `warnAt`), o texto passa para
  `warning`, com o ícone de relógio, sem piscar. Ao acabar, mostra `00:00` e chama
  `onExpire` uma vez.
- **Forma:** pílula pequena, com o `ClockIcon` da 0.2.0, cabendo no `FocusHeader` a 360 px.

**Critérios de aceite:**

- Com `now` injetado, o tempo mostrado é `endsAt - now()`, nos dois formatos.
- Cada limite de `warnAt` é anunciado uma única vez na região viva, também com o tempo
  oculto.
- `onExpire` é chamado uma única vez.
- O botão de ocultar tem nome acessível e funciona por teclado.
- O tempo visível não está numa região viva.

### 2. `Countdown`

**Para que serve no Synestia:** "Faltam 26 dias", na tela Hoje, até a data da prova. No
Atria: dias até uma meta ou um lembrete.

```ts
export interface CountdownLabels {
  /** Padrão: "Faltam {days} dias" / "Falta 1 dia". */
  remaining: (days: number) => string;
  /** Padrão: "É hoje". */
  today: string;
  /** Padrão: "Já passou". */
  past: string;
}

export interface CountdownProps extends Omit<ComponentPropsWithRef<'p'>, 'children'> {
  /** Data-alvo em ISO (`AAAA-MM-DD`), no calendário do usuário. */
  target: string;
  /** Hoje em ISO, injetável como no `Calendar`. */
  today: string;
  /** Linha secundária, formatada pelo produto (ex.: "Prova em 06/12, domingo"). */
  caption?: ReactNode;
  /** `display`: número grande em Outfit. `inline`: no tamanho do texto. Padrão: `display`. */
  size?: 'display' | 'inline';
  locale?: string;
  labels?: Partial<CountdownLabels>;
}
```

**Comportamento e acessibilidade:**

- A diferença é em **dias de calendário** entre `today` e `target`, sem hora. O fuso fica
  com o produto, que passa `today` já no fuso do usuário.
- O número usa `Intl.NumberFormat` no `locale`. O plural vem de `labels.remaining`, para
  cada produto traduzir certo.
- Não é região viva e não atualiza sozinho: o produto muda `today` na virada do dia.
- No `size="display"`, o número segue a tipografia de título grande das diretrizes (Outfit,
  peso 800, `letter-spacing` negativo).

**Critérios de aceite:**

- 06/12/2026 a partir de 10/11/2026 mostra "Faltam 26 dias".
- Mostra `labels.today` no dia e `labels.past` depois.
- Não tem região viva.

### 3. `ConnectionStatus`

**Para que serve no Synestia:** o indicador discreto no topo quando algo muda (offline,
sincronizando, falha) e o detalhe nas Configurações, com a hora da última sincronização e
a fila pendente. Em outros produtos: qualquer PWA do ecossistema.

```ts
export type ConnectionState = 'online' | 'offline' | 'syncing' | 'synced' | 'error';

export interface ConnectionStatusLabels {
  /** Padrão: "Offline". */
  offline: string;
  /** Padrão: "Sincronizando {done} de {total}" / "Sincronizando". */
  syncing: (progress?: { done: number; total: number }) => string;
  /** Padrão: "Tudo sincronizado · {relative}". */
  synced: (relative: string) => string;
  /** Padrão: "Falha ao sincronizar". */
  error: string;
  /** Padrão: "{count} na fila". */
  pending: (count: number) => string;
}

export interface ConnectionStatusProps extends Omit<ComponentPropsWithRef<'div'>, 'children'> {
  state: ConnectionState;
  /** Progresso da sincronização, quando o produto sabe o total. */
  progress?: { done: number; total: number };
  /** Itens aguardando envio. */
  pending?: number;
  /** Última sincronização, em milissegundos desde a época. */
  lastSyncedAt?: number;
  /** Relógio injetável, para o tempo relativo. Padrão: `Date.now`. */
  now?: () => number;
  /** `chip`: selo curto para o topo. `detail`: linha completa para uma tela de ajustes. Padrão: `chip`. */
  variant?: 'chip' | 'detail';
  /** Ação opcional (ex.: um Button "Tentar de novo" no estado `error`). */
  action?: ReactNode;
  locale?: string;
  labels?: Partial<ConnectionStatusLabels>;
}
```

**Comportamento e acessibilidade:**

- **Estados:** cada um com ícone e palavra, nunca só cor:
  - `offline` em `warning` com `WifiOffIcon`;
  - `syncing` em `info` com `RefreshIcon`;
  - `synced` em `success` com `CloudCheckIcon`;
  - `error` em `danger` com `CircleAlertIcon`.
- **`online` sem nada a dizer:** na variante `chip`, não renderiza nada. O indicador aparece
  só quando muda algo.
- **Leitor de tela:** `role="status"`. A troca de estado é anunciada, mas o progresso de
  `syncing` não é anunciado a cada item, só ao começar e ao terminar.
- **Tempo relativo** com `Intl.RelativeTimeFormat` no `locale` ("há 2 min").
- **Movimento:** o ícone de `syncing` **não gira** em laço. A troca de estado usa
  `--motion-fast`.

**Critérios de aceite:**

- Os cinco estados passam no axe e em contraste AA nos dois temas.
- `online` na variante `chip` não renderiza nada.
- A troca de estado é anunciada uma vez, e o progresso não é anunciado a cada item.
- O tempo relativo usa o `now` injetado.

## Como o Synestia vai usar

| Tela do Synestia | Componente |
|---|---|
| Simulado em modo prova, no `FocusHeader` (SPEC-001) | `Timer` com `endsAt` vindo do servidor, `warnAt={[30, 10, 5]}` e `onExpire` entregando o simulado |
| Hoje, contagem até a prova (SPEC-001) | `Countdown` `display`, com `caption` "Prova em 06/12, domingo · IFRS 2027/1" |
| Topo do app, quando muda a conexão (SPEC-002) | `ConnectionStatus` `chip` |
| Configurações, uso offline (SPEC-002) | `ConnectionStatus` `detail` com `pending` e `lastSyncedAt` |

## A Vega decide

1. **`Timer` progressivo:** o mesmo componente com uma prop `direction` ou um componente
   separado quando um produto pedir.
2. **Base comum de formatação** de duração entre `Timer` e `Countdown`: utilitário exportado
   ou só interno.
3. **`labels` como função:** o KT-001 usou textos fixos. Plural e interpolação pedem função;
   a Vega decide se adota funções ou um formato de mensagem.
4. **Versão:** os três numa 0.3.0, ou o `Timer` e o `Countdown` numa 0.3.0 e o
   `ConnectionStatus` numa 0.3.1. Para o prazo do Synestia, a primeira entrega com o `Timer`
   ajuda mais.
