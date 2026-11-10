### Baseline

- `pnpm vitest run src/theme src/calendar 2>&1 | grep -E '^\s*(Test Files|Tests)\s'`
- `pnpm exec tsc --noEmit --pretty false 2>&1 | grep -E '^(src/theme/|src/calendar/)' | sort`
- `pnpm exec eslint src/theme src/calendar --max-warnings 0`

### Verificação

```bash
# evidência: testes-countdown.txt
pnpm vitest run src/countdown --reporter=verbose
test -z "$(pnpm exec tsc --noEmit --pretty false 2>&1 | grep -E '^(src/countdown/)')"
pnpm exec eslint src/countdown --max-warnings 0
pnpm exec prettier --check src/countdown
test -z "$(grep -nE '#[0-9a-fA-F]{3,8}\b|rgba?\(|[0-9.]+(px|ms)\b|font-weight: *[0-9]|line-height: *[0-9]|z-index: *[0-9]' src/countdown/*.module.css | grep -v '@media')"
( for f in $(ls src/countdown/* | grep -v '\.test\.'); do test "$(wc -l < "$f")" -le 200 || { echo "$f passa de 200 linhas"; exit 1; }; done; echo 'OK: arquivos de produção com até 200 linhas' )
```

Resultado esperado: todos com código 0.

### Evidências

- `testes-countdown.txt` (automática, da verificação)
  - Título: Testes do Countdown e do daysBetween passam
  - Prova: de 10/11/2026 a 06/12/2026 mostra "Faltam 26 dias" sem região viva, usa o singular em 1 dia, mostra "É hoje" e "Já passou", formata o número no `locale`, mostra a `caption`, tem os tamanhos `display` e `inline`, não depende do relógio do sistema, não renderiza nada e avisa no console com data inválida, passa no axe, e `daysBetween` dá `26` no caso do CT-13 (RF-10, RF-11, RF-12, RF-18, CT-08, CT-09, CT-13, CB-05, RNF-03, RNF-06).
  - Trecho: as linhas `✓` de `shows the days until the target`, `has no live region`, `uses the singular for one day`, `shows today and past`, `formats the number with the locale`, `renders nothing and warns for an invalid date`, `counts calendar days until the exam`, `rejects invalid dates` e o resumo `Tests  N passed` sem `failed`.
  - Falha: linhas com `×`, `FAIL` ou `Tests  N failed`, ou `No test files found`.
  - Requer: `src/countdown/countdown.test.tsx`, `src/countdown/countdown.utils.test.ts`
- `countdown-360.png` (print): `( set -e; R="$PWD"; D=$(mktemp -d node_modules/.vega-print-XXXX); trap 'rm -rf "$R/$D"' EXIT; printf '%s\n' "import react from '@vitejs/plugin-react';" "export default { root: '$R/$D', base: './', logLevel: 'error', plugins: [react()], build: { outDir: 'out', emptyOutDir: true } };" > "$D/vite.config.mjs"; printf '%s\n' '<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0"><div id="root"></div><script type="module" src="./main.tsx"></script></body></html>' > "$D/index.html"; printf '%s\n' "import '$R/src/theme/fonts.css';" "import '$R/src/theme/tokens.css';" "import { createRoot } from 'react-dom/client';" "import { Countdown } from '$R/src/countdown/countdown';" "function Panel({ theme, width, children }: { theme: string; width?: number; children: React.ReactNode }) { return (<section data-theme={theme} style={{ flex: width ? 'none' : 1, width, boxSizing: 'border-box', padding: 24, background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--font-body)', display: 'flex', flexDirection: 'column', gap: 16, minHeight: 560 }}><strong>{theme}{width ? ' · ' + String(width) + ' px' : ''}</strong>{children}</section>); }" "function Scene({ theme }: { theme: string }) { return (<Panel theme={theme} width={360}><Countdown target=\"2026-12-06\" today=\"2026-11-10\" caption=\"Prova em 06/12, domingo · IFRS 2027/1\" /><Countdown target=\"2026-11-11\" today=\"2026-11-10\" caption=\"Simulado amanhã\" /><Countdown target=\"2026-11-10\" today=\"2026-11-10\" /><Countdown target=\"2026-11-01\" today=\"2026-11-10\" /><div style={{ fontSize: 16 }}>Revisão final: <Countdown size=\"inline\" target=\"2026-12-06\" today=\"2026-11-10\" caption=\"até a prova\" /></div></Panel>); }" "createRoot(document.getElementById('root')!).render(<div style={{ display: 'flex' }}><Scene theme=\"light\" /><Scene theme=\"dark\" /></div>);" > "$D/main.tsx"; pnpm exec vite build --config "$D/vite.config.mjs"; CHROME=$(ls -d "$HOME"/.cache/ms-playwright/chromium-*/chrome-linux64/chrome | sort -V | tail -1); "$CHROME" --headless --disable-gpu --no-sandbox --hide-scrollbars --allow-file-access-from-files --virtual-time-budget=3000 --window-size=720,560 --screenshot="$VOSTOK_EVIDENCE/countdown-360.png" "file://$R/$D/out/index.html" )`
  - Título: Countdown nos estados e tamanhos a 360 px
  - Prova: o `Countdown` mostra, a 360 px e nos dois temas, o tamanho `display` com `caption`, o singular, o dia da prova, a data passada e o tamanho `inline` dentro de uma frase (RF-10, RF-11, RF-12, RNF-01).
  - Trecho: `Faltam 26 dias` em letra grande de título com a legenda `Prova em 06/12, domingo · IFRS 2027/1` embaixo, em cor mais suave; `Falta 1 dia`; `É hoje`; `Já passou`; e a frase `Revisão final: Faltam 26 dias até a prova` no tamanho do texto.
  - Falha: o número grande quebrando para fora do painel, todos os textos no mesmo tamanho, `Faltam 1 dias` no singular, legenda ausente ou cores iguais nos dois temas.
