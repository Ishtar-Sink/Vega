### Ler

- `vostok/work/specs/refined/SPEC-004-timer-countdown-e-connectionstatus.md` (RF-10, RF-11, RF-12, RF-18, CT-08, CT-09, CT-13, CB-05, RN-03, RN-05, RNF-01, RNF-03, RNF-06, RNF-07, "Contratos e interfaces": `CountdownLabels`, `CountdownProps` e `daysBetween`, decisões 3, 4, 5 e 11)
- `vostok/work/tasks/SPEC-004/TASK-02/tecnico.md`
- `docs/KT-002-vega-timer-e-conexao.md` (seção "2. `Countdown`")
- `src/calendar/calendar.tsx` (data ISO `AAAA-MM-DD` e `today` injetável) e `src/calendar/calendar.test.tsx` (teste `marks today from the injected date, not the system clock`)
- `src/app-shell/bottom-nav.tsx` (função `isDevelopment` e o `console.warn` fora de produção num `useEffect`)
- `src/focus-header/focus-header.test.tsx` (padrão de teste: `readFileSync(join(import.meta.dirname, ...))`, axe, `ref`)
- `src/prose/prose.module.css` (`letter-spacing` negativo com `calc(var(--space) * ...)`)
- `src/theme/tokens.css` (`--font-display`, `--font-size-xxxl`, `--font-weight-extrabold`, `--line-height-tight`, `--text-muted`, `--font-size-sm`)

### Mudar

- `src/countdown/countdown.types.ts` (criar): `CountdownLabels` e `CountdownProps` exatos do contrato da spec, com JSDoc em pt-br (RF-10, RF-11, RF-12).
- `src/countdown/countdown.constants.ts` (criar): `DEFAULT_COUNTDOWN_LABELS` com "Faltam N dias", "Falta 1 dia", "É hoje" e "Já passou" (RF-10, RF-11, RN-03).
- `src/countdown/countdown.utils.ts` (criar): `daysBetween` e `parseIsoDate`, funções puras em UTC (RF-10, RF-18, CB-05).
- `src/countdown/countdown.tsx` (criar): `Countdown` com o texto dos dias, a `caption` e os tamanhos `display` e `inline` (RF-10, RF-11, RF-12, CB-05).
- `src/countdown/countdown.module.css` (criar): `display` em Outfit, `xxxl`, `extrabold` e `letter-spacing` negativo; `inline` no tamanho do texto, só com tokens (RF-12).
- `src/countdown/countdown.test.tsx` (criar): testes do componente com `today` injetado (CT-08, CT-09, CB-05, RNF-03, RNF-06).
- `src/countdown/countdown.utils.test.ts` (criar): testes de `daysBetween` e `parseIsoDate` (CT-13, CB-05).

### Passos

1. `src/countdown/countdown.utils.test.ts` (criar): importe `daysBetween` e `parseIsoDate` de `./countdown.utils`. Testes:
   - `it('counts calendar days until the exam')` (CT-13): `daysBetween('2026-11-10', '2026-12-06')` é `26`.
   - `it('is negative when the target is before')`: `daysBetween('2026-12-06', '2026-11-10')` é `-26`.
   - `it('is zero on the same day')`: `daysBetween('2026-11-10', '2026-11-10')` é `0`.
   - `it('crosses months and leap years')`: `daysBetween('2026-02-28', '2026-03-01')` é `1`; `daysBetween('2028-02-28', '2028-03-01')` é `2`; `daysBetween('2026-12-31', '2027-01-01')` é `1`.
   - `it('ignores daylight saving changes')`: `daysBetween('2026-10-31', '2026-11-02')` é `2` e `daysBetween('2026-02-21', '2026-02-23')` é `2` (as contas são em UTC).
   - `it('parses a valid ISO date')`: `parseIsoDate('2026-11-10')` é `Date.UTC(2026, 10, 10)`.
   - `it('rejects invalid dates')` (CB-05): `parseIsoDate` devolve `null` para `'2026-13-01'`, `'2026-02-30'`, `'10/11/2026'`, `'2026-11-10T00:00'` e `''`; `daysBetween('2026-02-30', '2026-03-01')` é `NaN`.
   Confira: `pnpm vitest run src/countdown` falha porque `./countdown.utils` não existe.
2. `src/countdown/countdown.test.tsx` (criar): importe `Countdown` de `./countdown`; `const css = readFileSync(join(import.meta.dirname, 'countdown.module.css'), 'utf8')`. Testes:
   - `it('has no axe violations')`: `target="2026-12-06"`, `today="2026-11-10"`, `caption="Prova em 06/12, domingo"`.
   - `it('shows the days until the target')` (CT-08): `getByText('Faltam 26 dias')`.
   - `it('has no live region')` (CT-08): o `container` não tem `[aria-live]`, `[role="status"]`, `[role="alert"]`, `[role="log"]` nem `[role="timer"]`.
   - `it('uses the singular for one day')`: `target="2026-11-11"` mostra `Falta 1 dia`.
   - `it('shows today and past')` (CT-09, RF-11): `target` igual a `today` mostra `É hoje`; `target="2026-11-09"` mostra `Já passou`.
   - `it('formats the number with the locale')` (RF-12): `today="2026-01-01"`, `target="2030-01-01"` mostra `Faltam 1.461 dias`; com `locale="en-US"` e `labels={{ remaining: (days, formatted) => formatted + (days === 1 ? ' day left' : ' days left') }}` mostra `1,461 days left`.
   - `it('accepts other labels')`: `labels={{ today: 'Today', past: 'Over' }}` mostra `Today` e `Over` nos casos do CT-09.
   - `it('shows the caption')` (RF-12): o texto `Prova em 06/12, domingo` está no mesmo `p`.
   - `it('uses the display size by default and inline on request')` (RF-12): sem `size`, o `p` tem `data-size="display"`; com `size="inline"`, `data-size="inline"`.
   - `it('does not depend on the system clock')` (RN-05, RNF-06): `vi.useFakeTimers({ toFake: ['Date'] })` e `vi.setSystemTime(new Date('2030-05-05T12:00:00Z'))`; ainda mostra `Faltam 26 dias`; `vi.useRealTimers()` no fim.
   - `it('renders nothing and warns for an invalid date')` (CB-05): `const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)`; `target="2026-02-30"` deixa o `container` vazio e `warn` é chamado com um texto que contém `Countdown`; com `today="ontem"`, o mesmo; `warn.mockRestore()`.
   - `it('does not warn in production')` (CB-05): `vi.stubEnv('NODE_ENV', 'production')`, data inválida, `warn` não é chamado; `vi.unstubAllEnvs()`.
   - `it('passes className, style, data attributes and ref to the paragraph')`: o elemento é um `P` com a classe `extra`, `data-testid`, `style` e o `ref`.
   - `it('uses the display typography')` (RF-12): no bloco `.display .value`, `font-family: var(--font-display)`, `font-size: var(--font-size-xxxl)`, `font-weight: var(--font-weight-extrabold)` e `letter-spacing` com `calc(var(--space) * -`.
   - `it('uses the text size inline')` (RF-12): no bloco `.inline .value`, `font-size: inherit`.
   Confira: `pnpm vitest run src/countdown` falha porque `./countdown` e `./countdown.utils` não existem.
3. `src/countdown/countdown.types.ts` (criar): o contrato exato da spec (`CountdownLabels` com `remaining: (days: number, formatted: string) => string`, `today` e `past`; `CountdownProps extends Omit<ComponentPropsWithRef<'p'>, 'children'>` com `target`, `today`, `caption?: ReactNode`, `size?: 'display' | 'inline'`, `locale?` e `labels?: Partial<CountdownLabels>`), com JSDoc em pt-br e os padrões (`size`: `display`; `locale`: `pt-BR`; `today` no fuso do usuário, RN-05).
4. `src/countdown/countdown.constants.ts` (criar): `export const DEFAULT_COUNTDOWN_LOCALE = 'pt-BR';` e `export const DEFAULT_COUNTDOWN_LABELS: CountdownLabels = { remaining: (days, formatted) => (days === 1 ? 'Falta ' + formatted + ' dia' : 'Faltam ' + formatted + ' dias'), today: 'É hoje', past: 'Já passou' };` (o Prettier pode trocar as concatenações por template strings; aceite o que ele gravar).
5. `src/countdown/countdown.utils.ts` (criar), funções puras:
   - `const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;` e `const DAY_MS = 86_400_000;`.
   - `export function parseIsoDate(iso: string): number | null`: sem casar com `ISO_DATE`, `null`; com `Date.UTC(year, month - 1, day)`, confira que `new Date(ms)` devolve o mesmo ano, mês e dia em UTC (`getUTCFullYear`, `getUTCMonth`, `getUTCDate`), senão `null` (rejeita `2026-02-30` e mês 13).
   - `export function daysBetween(fromIso: string, toIso: string): number`: com uma das datas `null`, `Number.NaN`; senão `Math.round((to - from) / DAY_MS)`. JSDoc igual ao do contrato, mais: "`NaN` se alguma data for inválida". Comentário: as contas em UTC tornam a diferença imune ao horário de verão; o fuso fica com o produto (RN-05).
6. `src/countdown/countdown.tsx` (criar): `export function Countdown({ target, today, caption, size = 'display', locale = DEFAULT_COUNTDOWN_LOCALE, labels, className, ...rest }: CountdownProps)`:
   - `const days = daysBetween(today, target);` e `const invalid = Number.isNaN(days);`.
   - `useEffect(() => { if (!invalid || !isDevelopment()) return; console.warn('Countdown: target e today precisam ser datas AAAA-MM-DD válidas; recebeu target=' + target + ' e today=' + today + '.'); }, [invalid, target, today]);` com `function isDevelopment(): boolean { return typeof process === 'undefined' || process.env.NODE_ENV !== 'production'; }` no próprio arquivo, com o mesmo comentário de `src/app-shell/bottom-nav.tsx`.
   - `if (invalid) return null;` depois do `useEffect` (CB-05).
   - `const texts = { ...DEFAULT_COUNTDOWN_LABELS, ...labels };` e `const text = days < 0 ? texts.past : days === 0 ? texts.today : texts.remaining(days, new Intl.NumberFormat(locale).format(days));` — escreva como `if`s numa função local `describe()` se o ESLint recusar o ternário aninhado.
   - JSX: `<p {...rest} data-size={size} className={[styles.root, styles[size], className].filter(Boolean).join(' ')}><span className={styles.value}>{text}</span>{caption ? <span className={styles.caption}>{caption}</span> : null}</p>`. Sem `aria-live` nem `role`.
   - Reexporte `export type { CountdownProps, CountdownLabels } from './countdown.types';` e `export { daysBetween } from './countdown.utils';`.
7. `src/countdown/countdown.module.css` (criar), só com tokens: `.root { margin: 0; color: var(--text); font-family: var(--font-body); }`; `.display { display: flex; flex-direction: column; gap: var(--space); }`; `.display .value { font-family: var(--font-display); font-size: var(--font-size-xxxl); font-weight: var(--font-weight-extrabold); line-height: var(--line-height-tight); letter-spacing: calc(var(--space) * -0.25); font-variant-numeric: tabular-nums; }`; `.inline { display: inline-flex; flex-wrap: wrap; align-items: baseline; gap: calc(var(--space) * 2); font-size: inherit; }`; `.inline .value { font-size: inherit; font-weight: var(--font-weight-semibold); }`; `.caption { color: var(--text-muted); font-size: var(--font-size-sm); }`. Confira: `pnpm vitest run src/countdown` passa.
8. Rode `pnpm exec prettier --write src/countdown` e depois a Verificação inteira. Confira: todos os comandos terminam com código 0.
