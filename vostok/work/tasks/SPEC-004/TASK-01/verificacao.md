### Baseline

- `pnpm vitest run src/icon-button src/icons src/theme 2>&1 | grep -E '^\s*(Test Files|Tests)\s'`
- `pnpm exec tsc --noEmit --pretty false 2>&1 | grep -E '^(src/icon-button/|src/icons/|src/theme/)' | sort`
- `pnpm exec eslint src/icon-button src/icons src/theme --max-warnings 0`

### Verificação

```bash
# evidência: testes-timer.txt
pnpm vitest run src/timer --reporter=verbose
test -z "$(pnpm exec tsc --noEmit --pretty false 2>&1 | grep -E '^(src/timer/)')"
pnpm exec eslint src/timer --max-warnings 0
pnpm exec prettier --check src/timer
test -z "$(grep -nE '#[0-9a-fA-F]{3,8}\b|rgba?\(|[0-9.]+(px|ms)\b|font-weight: *[0-9]|line-height: *[0-9]|z-index: *[0-9]' src/timer/*.module.css | grep -v '@media')"
( for f in $(ls src/timer/* | grep -v '\.test\.'); do test "$(wc -l < "$f")" -le 200 || { echo "$f passa de 200 linhas"; exit 1; }; done; echo 'OK: arquivos de produção com até 200 linhas' )
```

Resultado esperado: todos com código 0.

### Evidências

- `testes-timer.txt` (automática, da verificação)
  - Título: Testes do Timer e do formatDuration passam
  - Prova: o tempo é `endsAt - now()` (ou `now() - startedAt`) nos formatos `mm:ss` e `h:mm:ss`, muda na virada do segundo, tem o tempo no nome acessível e fora de região viva, anuncia cada `warnAt` uma vez (também oculto, só o menor quando vários passam juntos, re-armado quando o `endsAt` sobe), passa a `warning` no menor limite ou a 5 min, termina em `00:00` com `onExpire` uma vez, oculta pelo teclado, tem botão de 44 px, passa no axe e em AA, e o `formatDuration` cobre os casos do CT-13 (RF-01 a RF-09, RF-18, CT-01 a CT-07, CT-13, CB-01 a CB-04, CB-08, RNF-02 a RNF-06).
  - Trecho: as linhas `✓` de `shows endsAt minus now and updates on the next second`, `ticks once per second aligned to the turn of the second`, `shows hours as h:mm:ss`, `counts up from startedAt without warnings or end`, `keeps the visible time out of any live region`, `announces each warnAt limit once`, `announces only the smallest limit when several are crossed at once`, `shows 00:00, announces the end and calls onExpire once`, `hides and shows the time with the keyboard`, `turns a negative value into 00:00` e o resumo `Tests  N passed` sem `failed`.
  - Falha: linhas com `×`, `FAIL` ou `Tests  N failed`, ou `No test files found`.
  - Requer: `src/timer/timer.test.tsx`, `src/timer/timer.utils.test.ts`
- `timer-360.png` (print): `( set -e; R="$PWD"; D=$(mktemp -d node_modules/.vega-print-XXXX); trap 'rm -rf "$R/$D"' EXIT; printf '%s\n' "import react from '@vitejs/plugin-react';" "export default { root: '$R/$D', base: './', logLevel: 'error', plugins: [react()], build: { outDir: 'out', emptyOutDir: true } };" > "$D/vite.config.mjs"; printf '%s\n' '<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0"><div id="root"></div><script type="module" src="./main.tsx"></script></body></html>' > "$D/index.html"; printf '%s\n' "import '$R/src/theme/fonts.css';" "import '$R/src/theme/tokens.css';" "import { createRoot } from 'react-dom/client';" "import { Timer } from '$R/src/timer/timer';" "import { FocusHeader } from '$R/src/focus-header/focus-header';" "const T = Date.UTC(2026, 10, 17, 12, 0, 0); const now = () => T; const MIN = 60000; const noop = () => undefined;" "function Panel({ theme, width, children }: { theme: string; width?: number; children: React.ReactNode }) { return (<section data-theme={theme} style={{ flex: width ? 'none' : 1, width, boxSizing: 'border-box', padding: 24, background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--font-body)', display: 'flex', flexDirection: 'column', gap: 12, minHeight: 600 }}><strong>{theme}{width ? ' · ' + String(width) + ' px' : ''}</strong>{children}</section>); }" "function Row({ label, children }: { label: string; children: React.ReactNode }) { return (<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}><span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{label}</span>{children}</div>); }" "function Scene({ theme }: { theme: string }) { return (<Panel theme={theme} width={360}><div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ flex: 1, minWidth: 0 }}><FocusHeader title=\"Simulado ENEM, dia 1\" position=\"12/90\" onExit={noop} /></div><Timer endsAt={T + 270 * MIN} now={now} warnAt={[30, 10, 5]} /></div><Row label=\"regressivo\"><Timer endsAt={T + 12 * MIN + 40000} now={now} warnAt={[30, 10, 5]} /></Row><Row label=\"aviso (5 min)\"><Timer endsAt={T + 4 * MIN + 10000} now={now} warnAt={[30, 10, 5]} /></Row><Row label=\"oculto\"><Timer endsAt={T + 12 * MIN} now={now} hidden onHiddenChange={noop} /></Row><Row label=\"terminado\"><Timer endsAt={T - 1000} now={now} onExpire={noop} /></Row><Row label=\"h:mm:ss\"><Timer endsAt={T + 270 * MIN} now={now} /></Row><Row label=\"progressivo\"><Timer direction=\"up\" startedAt={T - 65000} now={now} /></Row><Row label=\"sem ocultar\"><Timer endsAt={T + 12 * MIN + 40000} now={now} hideable={false} /></Row></Panel>); }" "createRoot(document.getElementById('root')!).render(<div style={{ display: 'flex' }}><Scene theme=\"light\" /><Scene theme=\"dark\" /></div>);" "setTimeout(() => { document.querySelectorAll('section')[1]?.querySelectorAll<HTMLButtonElement>('button')[2]?.focus(); }, 300);" > "$D/main.tsx"; pnpm exec vite build --config "$D/vite.config.mjs"; CHROME=$(ls -d "$HOME"/.cache/ms-playwright/chromium-*/chrome-linux64/chrome | sort -V | tail -1); "$CHROME" --headless --disable-gpu --no-sandbox --hide-scrollbars --allow-file-access-from-files --virtual-time-budget=3000 --window-size=720,600 --screenshot="$VOSTOK_EVIDENCE/timer-360.png" "file://$R/$D/out/index.html" )`
  - Título: Timer nos estados e ao lado do FocusHeader a 360 px
  - Prova: o `Timer` cabe ao lado do `FocusHeader` a 360 px e mostra os estados regressivo, aviso, oculto, terminado, `h:mm:ss` e progressivo, com foco visível, nos dois temas (RF-02, RF-03, RF-07, RF-08, RF-09, RNF-01, RNF-05).
  - Trecho: a linha do `FocusHeader` com `4:30:00` à direita sem quebrar; `12:40` em pílula neutra; `04:10` em pílula âmbar com o ícone de relógio; `tempo` no lugar do número; `00:00`; `4:30:00`; `01:05` no progressivo; a última pílula sem o botão de olho; e o anel de foco no botão de olho do `regressivo` do painel escuro.
  - Falha: pílula quebrando linha ou empurrada para fora dos 360 px, números com larguras diferentes, `04:10` sem ícone ou no mesmo tom das outras, `tempo` ausente no oculto, ou cores iguais nos dois temas.
