### Baseline

- `pnpm vitest run src/icons src/theme --reporter=verbose 2>&1 | grep -E '^\s+(✓|×)' | sed -E 's/ [0-9]+ms$//' | sort`
- `pnpm exec tsc --noEmit --pretty false 2>&1 | grep -E '^(src/icons/|src/theme/)' | sort`
- `pnpm exec eslint src/icons src/theme --max-warnings 0`
- `pnpm exec prettier --check src/icons src/theme`

### Verificação

```bash
# evidência: testes-connection-status.txt
pnpm vitest run src/connection-status --reporter=verbose
test -z "$(pnpm exec tsc --noEmit --pretty false 2>&1 | grep -E '^(src/connection-status/)')"
pnpm exec eslint src/connection-status --max-warnings 0
pnpm exec prettier --check src/connection-status
test -z "$(grep -nE '#[0-9a-fA-F]{3,8}\b|rgba?\(|[0-9.]+(px|ms)\b|font-weight: *[0-9]|line-height: *[0-9]|z-index: *[0-9]' src/connection-status/*.module.css | grep -v '@media')"
# evidência: linhas-connection-status.txt
( set -e; for f in $(ls src/connection-status/*.ts src/connection-status/*.tsx src/connection-status/*.css 2>/dev/null | grep -v '\.test\.'); do n=$(wc -l < "$f"); echo "$n $f"; test "$n" -le 200; done; echo 'OK: arquivos de produção com até 200 linhas' )
```

Resultado esperado: todos com código 0; `testes-connection-status.txt` com os testes da pasta aprovados e `linhas-connection-status.txt` terminando em `OK: arquivos de produção com até 200 linhas`.

### Evidências

- `testes-connection-status.txt` (automática, da verificação)
  - Título: Testes do ConnectionStatus passam
  - Prova: os quatro estados com sinal têm ícone, palavra e fundo suave do tom; `online` não renderiza nada no `chip` e mostra a palavra no `detail`; o `role="status"` anuncia a troca de estado e não o progresso, que fica em texto comum lido na navegação; o progresso, a fila e o tempo relativo sobre o `now` injetado aparecem; a ação fica no fim; tudo passa no axe e em AA nos dois temas e a troca de cor usa só `--motion-fast` (RF-13 a RF-17, CT-10 a CT-12, CB-06, CB-07, RNF-03, RNF-04, RNF-05).
  - Trecho: as linhas `✓` de `renders the offline state with its icon, word and soft background` (uma por estado), `renders nothing for online in the chip variant`, `shows the online word in the detail variant`, `announces the state change and keeps the progress out of the status region`, `keeps the full text accessible outside the live region`, `shows the relative time of lastSyncedAt from the injected now`, `treats a future lastSyncedAt as now`, `uses the text without progress when total is zero`, `turns the whole box into a button with the action text in both variants`, `keeps the status region outside the action button`, `has no axe violations in every state and variant` e `meets AA on every state in both themes`, e o resumo `Tests  N passed` sem `failed`.
  - Falha: linhas com `×`, `FAIL` ou `Tests  N failed`.
  - Requer: `src/connection-status/connection-status.test.tsx`
- `linhas-connection-status.txt` (automática, da verificação)
  - Título: Arquivos do ConnectionStatus com até 200 linhas
  - Prova: cada arquivo de produção da pasta tem no máximo 200 linhas ([project/code-style-08]).
  - Trecho: uma linha por arquivo de `src/connection-status/` e `OK: arquivos de produção com até 200 linhas`.
  - Falha: o comando para num arquivo com mais de 200 linhas, sem a linha `OK`.
  - Requer: `src/connection-status/connection-status.tsx`
- `connection-status-360.png` (print): `( set -e; R="$PWD"; D=$(mktemp -d node_modules/.vega-print-XXXX); trap 'rm -rf "$R/$D"' EXIT; printf '%s\n' "import react from '@vitejs/plugin-react';" "export default { root: '$R/$D', base: './', logLevel: 'error', plugins: [react()], build: { outDir: 'out', emptyOutDir: true } };" > "$D/vite.config.mjs"; printf '%s\n' '<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0"><div id="root"></div><script type="module" src="./main.tsx"></script></body></html>' > "$D/index.html"; printf '%s\n' "import '$R/src/theme/fonts.css';" "import '$R/src/theme/tokens.css';" "import { createRoot } from 'react-dom/client';" "import { ConnectionStatus } from '$R/src/connection-status/connection-status';" "const NOW = 1700000000000;" "const now = () => NOW;" "const states = ['online', 'offline', 'syncing', 'synced', 'error'] as const;" "function Panel({ theme }: { theme: string }) { return (<section data-theme={theme} style={{ width: 360, flex: 'none', boxSizing: 'border-box', padding: 16, background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--font-body)', display: 'flex', flexDirection: 'column', gap: 10 }}><strong>{theme} · 360 px</strong>{(['chip', 'detail'] as const).map((variant) => (<div key={variant} style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 10 }}><small>{variant}</small>{states.map((state) => (<div key={state} style={{ display: 'flex' }}><ConnectionStatus state={state} variant={variant} now={now} progress={state === 'syncing' ? { done: 2, total: 5 } : undefined} pending={state === 'offline' || state === 'syncing' || state === 'error' ? 3 : undefined} lastSyncedAt={state === 'synced' ? NOW - 120000 : undefined} action={state === 'error' ? { label: 'Tentar de novo', onAction: () => undefined } : undefined} style={variant === 'detail' ? { flex: 1 } : undefined} /></div>))}</div>))}</section>); }" "createRoot(document.getElementById('root')!).render(<div style={{ display: 'flex' }}><Panel theme='light' /><Panel theme='dark' /></div>);" "setTimeout(() => { document.querySelectorAll('section')[1]?.querySelector<HTMLButtonElement>('button')?.focus(); }, 300);" > "$D/main.tsx"; pnpm exec vite build --config "$D/vite.config.mjs"; CHROME=$(ls -d "$HOME"/.cache/ms-playwright/chromium-*/chrome-linux64/chrome | sort -V | tail -1); "$CHROME" --headless --disable-gpu --no-sandbox --hide-scrollbars --allow-file-access-from-files --virtual-time-budget=3000 --window-size=720,1000 --screenshot="$VOSTOK_EVIDENCE/connection-status-360.png" "file://$R/$D/out/index.html" )`
  - Título: ConnectionStatus nos temas claro e escuro
  - Prova: os cinco estados se distinguem pelo ícone e pela palavra, não só pela cor, nas variantes `chip` e `detail`, nos dois temas e a 360 px; a fila, o tempo relativo "há 2 minutos", o progresso "2 de 5" e a ação "Tentar de novo", em texto no tom do estado e sublinhado dentro da pílula, sem botão preenchido, cabem sem corte (RF-13, RF-14, RF-16, RF-17, CB-06, RNF-01).
  - Trecho: em cada painel, o `chip` com quatro selos (nenhum para `online`) e o `detail` com cinco linhas; `Offline` com o ícone de wifi cortado e `3 na fila`, `Sincronizando 2 de 5` com o ícone de atualizar, `Tudo sincronizado · há 2 minutos` com a nuvem confere, `Falha ao sincronizar` com o ícone de alerta e a ação no fim, `Online` só no `detail` e o anel de foco no botão do painel escuro.
  - Falha: dois estados iguais exceto pela cor, palavra ilegível sobre o fundo suave no tema escuro, texto ou ação cortados a 360 px, `online` aparecendo no `chip` ou o `detail` sem a fila.
  - Requer: `src/connection-status/connection-status.tsx`
