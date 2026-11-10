### Ler

- `vostok/work/specs/refined/SPEC-004-timer-countdown-e-connectionstatus.md` (RF-13 a RF-17, CT-10 a CT-12, CB-06, CB-07, RN-02, RN-03, RNF-01, RNF-03 a RNF-05, RNF-07, decisões 8 e 10, "Contratos e interfaces": `ConnectionStatusProps`)
- `vostok/work/tasks/SPEC-004/TASK-03/tecnico.md` (decisões locais D-01 a D-08)
- `docs/KT-002-vega-timer-e-conexao.md` (seção 3, `ConnectionStatus`: comportamento e acessibilidade)
- `vostok/rules/project/code-style.md` ([project/code-style-02], [project/code-style-03], [project/code-style-08] e [project/code-style-09])
- `vostok/rules/project/theme.md` ([project/theme-06] e [project/theme-07])
- `src/callout/callout.tsx`, `src/callout/callout.module.css` e `src/callout/callout.test.tsx` (padrão de tom com fundo `*-soft`, ícone decorativo por tom, teste de ícone por `innerHTML` e teste de AA com `contrastRatio`)
- `src/toast/toast.tsx` e `src/toast/toast.module.css` (região `role="status"` e o `srOnly` local)
- `src/icons/interface-icons.tsx` e `src/icons/icon.tsx` (`WifiOffIcon`, `RefreshIcon`, `CloudCheckIcon` e `CircleAlertIcon`; `size` aceita 16, 20 ou 24)
- `src/theme/tokens.ts` e `src/theme/contrast.ts` (`contrastRatio`, `warning`, `info`, `success`, `danger`, `*Soft`, `text`, `surfaceMuted`)
- `src/theme/tokens.css` (`--motion-fast` zerado em `prefers-reduced-motion`)
- `src/badge/badge.test.tsx` (como um teste lê o `.module.css` com `readFileSync`)

### Mudar

- `src/connection-status/connection-status.types.ts` (criar): `ConnectionState`, `ConnectionStatusLabels` e `ConnectionStatusProps`, com JSDoc em pt-br (RF-13 a RF-17).
- `src/connection-status/connection-status.constants.ts` (criar): `DEFAULT_LABELS` em pt-br e `STATE_CONFIG`, o ícone e o tom de cada estado (RF-13, RN-03).
- `src/connection-status/connection-status.utils.ts` (criar): `formatRelativeTime` e `resolveStateText`, funções puras (RF-16, CB-06, CB-07).
- `src/connection-status/connection-status.tsx` (criar): `ConnectionStatus` sobre `<div>`, com a região `role="status"`, o texto completo (progresso e tempo relativo) fora dela, em elemento comum, a fila e a ação (RF-13 a RF-17).
- `src/connection-status/connection-status.module.css` (criar): variantes `chip` e `detail`, um tom por estado com fundo `*-soft` e a troca de cor com `--motion-fast`, só com tokens (RF-13, RNF-01, RNF-04).
- `src/connection-status/connection-status.test.tsx` (criar): testes do `ConnectionStatus` (CT-10 a CT-12, CB-06, CB-07, RNF-03 a RNF-05).

### Passos

Regras comuns a todos os passos (decididas em `tecnico.md`, seção "Decisões"):

- Um contexto por arquivo ([project/code-style-09]) e até 200 linhas por arquivo de produção ([project/code-style-08]).
- Props nativas no `<div>` raiz: desestruture `className` e as props próprias, e aplique `...rest` e o `className` no `<div>` raiz; `ref` vem dentro de `rest` (React 19, `ComponentPropsWithRef`), como no `Callout`.
- CSS só com tokens, como nas outras tarefas de componente: espaços `var(--s1)` a `var(--s4)`, bordas e tamanhos pequenos com `calc(var(--space) * N)`.
- Ícones de `../icons/interface-icons`, decorativos, com `size={16}`.
- Testes determinísticos: `now` injetado com `const NOW = 1_700_000_000_000` e `const now = () => NOW`; nenhum teste lê a hora atual (RNF-06).

1. `src/connection-status/connection-status.test.tsx` (criar): testes por papel e nome, com `describe('ConnectionStatus')`:
   - `it.each(['offline', 'syncing', 'synced', 'error'] as const)('renders the %s state with its icon, word and soft background')` (CT-10, RF-13): o `role="status"` tem o `svg` com `aria-hidden="true"` igual (compare o `innerHTML`, sem depender dos caminhos do Lucide) ao de `render(<STATE_CONFIG[state].icon />)`; a palavra esperada aparece (`Offline`, `Sincronizando`, `Tudo sincronizado`, `Falha ao sincronizar`); a raiz tem a classe do estado.
   - `it('maps each state to its tone and icon')` (RF-13): `STATE_CONFIG.offline` é `{ icon: WifiOffIcon, tone: 'warning' }`, `syncing` é `RefreshIcon` com `info`, `synced` é `CloudCheckIcon` com `success` e `error` é `CircleAlertIcon` com `danger`.
   - `it('renders nothing for online in the chip variant')` (CT-10, RF-14): `container` vazio sem `variant` e com `variant="chip"`.
   - `it('shows the online word in the detail variant')` (RF-14, decisão 8): `variant="detail"` mostra `Online` dentro do `role="status"`, sem `svg`; com `labels={{ online: 'Conectado' }}` mostra `Conectado`.
   - `it('uses custom labels')` (RN-03): `labels` com os seis campos trocados aparecem no lugar dos padrões.
   - `it('announces the state change and keeps the progress out of the status region')` (CT-11, RF-15): renderize `state="offline"`; troque por `state="syncing"` com `progress={{ done: 1, total: 5 }}`; o `role="status"` passa a ter o texto `Sincronizando` e o texto visível `Sincronizando 1 de 5` está fora do `role="status"`, achado por `getByText('Sincronizando 1 de 5')`, e nenhum ancestral dele tem `aria-hidden`.
   - `it('keeps the full text accessible outside the live region')` (RF-16, [project/accessibility-01]): com `state="syncing"` e `progress` 2/5, `getByText('Sincronizando 2 de 5')` existe, `closest('[aria-hidden="true"]')` é nulo e `closest('[role="status"]')` é nulo; com `state="synced"`, `lastSyncedAt` e `pending={3}`, o mesmo vale para `Tudo sincronizado · há 2 minutos` e `3 na fila`.
   - `it('does not touch the status region when only the progress changes')` (CT-11): com `state="syncing"` e `progress` 1/5, crie um `MutationObserver` no `role="status"` (`subtree`, `childList`, `characterData`, `attributes`), rerenderize com `progress` 2/5 e confira que `observer.takeRecords()` é vazio e que o texto visível passou para `Sincronizando 2 de 5`.
   - `it('uses the text without progress when total is zero')` (CB-06): `progress={{ done: 0, total: 0 }}` mostra `Sincronizando` e nenhum `de`; com `labels.syncing` espionado por `vi.fn`, a chamada recebeu `undefined`.
   - `it('shows the pending count outside the status region')` (RF-16): `pending={3}` mostra `3 na fila` fora do `role="status"`; com `pending={0}` e sem `pending` nada aparece.
   - `it('shows the relative time of lastSyncedAt from the injected now')` (CT-12, RF-16): `state="synced"`, `now`, `lastSyncedAt={NOW - 120_000}` e `variant="detail"` mostram `Tudo sincronizado · há 2 minutos`, com `role="status"` contendo `Tudo sincronizado` apenas.
   - `it.each` de `[30_000, 'há 30 segundos'], [3 * 3_600_000, 'há 3 horas'], [3 * 86_400_000, 'há 3 dias']` (RF-16): a unidade muda com a magnitude.
   - `it('uses the locale for the relative time')` (RF-16): `locale="en"` mostra `Tudo sincronizado · 2 minutes ago`.
   - `it('treats a future lastSyncedAt as now')` (CB-07): `lastSyncedAt={NOW + 60_000}` mostra `Tudo sincronizado · agora`.
   - `it('ignores lastSyncedAt outside the synced state')`: `state="offline"` com `lastSyncedAt` mostra só `Offline`.
   - `it('turns the whole box into a button with the action text in both variants')` (CT-16, RF-17): com `state="error"` e `action={{ label: 'Tentar de novo', onAction }}`, no `chip` e no `detail`, existe um único `button` (`type="button"`) cujo nome inclui `Tentar de novo`; ele contém o ícone, a palavra, a fila e o texto da ação, separado por `·`; clique e `Enter` chamam `onAction` uma vez cada; o CSS tem `.actionText` com `text-decoration: underline` e `color: currentColor`, e nenhuma regra de fundo preenchido (`--primary`) no botão.
   - `it('keeps the status region outside the action button')` (RF-15, RF-17): com `action`, o `role="status"` não tem o `button` como ancestral, e trocar o estado ainda anuncia só a palavra estável.
   - `it('keeps a plain box without an action')` (RF-17): sem `action`, não há `button` no componente.
   - `it('passes className, style, data attributes and ref to the root')`.
   - `it('has no axe violations in every state and variant')` (RNF-03): `it.each` dos cinco estados nas duas variantes, com `online` só no `detail`, com `progress`, `pending`, `lastSyncedAt` e `action`.
   - `it('meets AA on every state in both themes')` (RNF-05): para `light` e `dark`, `contrastRatio` de `warning`, `info`, `success` e `danger` sobre o `*Soft` respectivo, de `text` sobre cada `*Soft` e de `text` sobre `surfaceMuted` maior ou igual a 4.5.
   - `it('changes state with --motion-fast only and no animation')` (RNF-04): o CSS do componente contém `var(--motion-fast)` e não contém `animation`, `@keyframes` nem `infinite`; o `tokens.css` zera `--motion-fast` dentro de `prefers-reduced-motion: reduce`.
   Confira: `pnpm vitest run src/connection-status` falha porque `./connection-status` não existe.
2. `src/connection-status/connection-status.types.ts` (criar): `ConnectionState`, `ConnectionStatusLabels` e `ConnectionStatusProps` exatamente como na spec ("Contratos e interfaces"), com `import type { ComponentPropsWithRef, ReactNode } from 'react'` e JSDoc em pt-br em cada campo. Confira: `pnpm exec tsc --noEmit --pretty false 2>&1 | grep connection-status.types` não imprime nada.
3. `src/connection-status/connection-status.constants.ts` (criar): `DEFAULT_LABELS: ConnectionStatusLabels` com `online` igual a `'Online'`, `offline` a `'Offline'`, `error` a `'Falha ao sincronizar'`, `syncing(progress)` devolvendo `Sincronizando {done} de {total}` com `progress` e `Sincronizando` sem ele, `synced(relative)` devolvendo `Tudo sincronizado · {relative}` com `relative` e `Tudo sincronizado` sem ele, e `pending(count)` devolvendo `{count} na fila` (os textos de template string com as chaves trocadas pelos valores); e `STATE_CONFIG: Record<Exclude<ConnectionState, 'online'>, { icon: typeof WifiOffIcon; tone: 'warning' | 'info' | 'success' | 'danger' }>` com o mapa do passo 1. Confira: tsc sem erro no arquivo.
4. `src/connection-status/connection-status.utils.ts` (criar):
   - `formatRelativeTime(from: number, now: number, locale: string): string`: `diff = Math.max(0, now - from)` (CB-07); em segundos inteiros (`Math.floor(diff / 1000)`), escolha a unidade pela magnitude: abaixo de 60 `second`, abaixo de 3600 `minute`, abaixo de 86400 `hour`, senão `day`, com o valor em `Math.floor` da unidade; devolva `new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(-valor, unidade)`.
   - `resolveStateText(state, labels, { progress, relative })` devolve `{ stable: string; full: string }`: `online` usa `labels.online`; `offline` e `error` usam o próprio texto nos dois; `syncing` usa `stable = labels.syncing()` e `full = labels.syncing(progress)` com `progress` só quando `progress.total > 0` (CB-06); `synced` usa `stable = labels.synced()` e `full = labels.synced(relative)`.
   Confira: tsc sem erro no arquivo.
5. `src/connection-status/connection-status.tsx` (criar): `ConnectionStatus` com `variant = 'chip'`, `locale = 'pt-BR'`, `now = Date.now` e `labels` mesclado sobre `DEFAULT_LABELS`. Retorna `null` quando `state === 'online' && variant === 'chip'`. Calcula `relative` só no estado `synced` com `lastSyncedAt !== undefined` (`formatRelativeTime(lastSyncedAt, now(), locale)`) e `{ stable, full }` com `resolveStateText`. Renderiza `<div {...rest} className={[styles.root, styles[variant], styles[state], className]}>` com, em ordem: `<span role="status" className={styles.status}>` contendo o ícone de `STATE_CONFIG[state]` (nenhum para `online`) com `size={16}` e `className={styles.icon}`, e `<span className={full === stable ? styles.text : styles.srOnly}>{stable}</span>`; depois, só quando `full !== stable`, `<span className={styles.text}>{full}</span>`; depois, só com `pending` maior que zero, `<span className={styles.meta}>{labels.pending(pending)}</span>`; por fim, com `action`, `<div className={styles.action}>{action}</div>`. Confira: `pnpm vitest run src/connection-status` passa nos testes de estado, `online`, região viva, progresso, fila, tempo relativo e ação.
6. `src/connection-status/connection-status.module.css` (criar):
   - `.root`: `display: inline-flex`, `flex-wrap: wrap`, `align-items: center`, `gap: var(--s2)`, `box-sizing: border-box`, `max-width: 100%`, `padding: var(--s1) var(--s3)`, `border-radius: var(--radius-pill)`, `background: var(--surface-muted)`, `color: var(--text)`, `font-family: var(--font-body)`, `font-size: var(--font-size-sm)`, `font-weight: var(--font-weight-semibold)`, `line-height: var(--line-height-tight)`, `transition: background var(--motion-fast) var(--motion-ease-standard), color var(--motion-fast) var(--motion-ease-standard)`.
   - `.detail`: `display: flex`, `padding: var(--s3) var(--s4)`, `border-radius: var(--radius-md)`, `font-size: var(--font-size-md)`, `line-height: var(--line-height-relaxed)`.
   - `.status`: `display: inline-flex`, `align-items: center`, `gap: var(--s2)`; `.icon`: `flex: none`; `.text`: `min-width: 0`, `overflow-wrap: anywhere`; `.meta`: `color: var(--text)`; `.button` (caixa clicável, só com `action`): herda o fundo, a cor, o raio e o padding da caixa (`.root`, `.chip`/`.detail` e o tom), com `border: 0`, `font: inherit`, `cursor: pointer`, `text-align: start`, `width: 100%` no `detail`, foco visível com `outline` em `--primary` e hover com `filter`/`color-mix` do próprio tom, sem fundo `--primary`; `.actionText`: `color: currentColor`, `text-decoration: underline`, `text-underline-offset`, `font-weight: var(--font-weight-semibold)`. No `chip`, a área de toque chega a 44 px por um `::after` absoluto (`inset` negativo), sem aumentar a pílula.
   - `.srOnly`: o mesmo bloco de `.srOnly` de `src/toast/toast.module.css`.
   - Um bloco por estado: `.offline`, `.syncing`, `.synced` e `.error` com `background: var(--<tom>-soft)` e `color: var(--<tom>)` (`warning`, `info`, `success`, `danger`), mais `.<estado> .meta { color: var(--text); }`; `.online` não precisa de bloco (usa o fundo neutro do `.root`).
   Confira: `pnpm vitest run src/connection-status` passa inteiro, inclusive o teste do CSS.
7. Pasta da tarefa: rode `pnpm exec prettier --write src/connection-status` e depois a Verificação inteira. Confira: todos os comandos terminam com código 0.
