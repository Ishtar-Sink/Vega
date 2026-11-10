### Baseline

- `pnpm vitest run src/progress-bar src/icon-button src/icons 2>&1 | grep -E '^\s*(Test Files|Tests)\s'`
- `pnpm exec tsc --noEmit --pretty false 2>&1 | grep -E '^(src/progress-bar/|src/icon-button/|src/icons/)' | sort`
- `pnpm exec eslint src/progress-bar src/icon-button src/icons --max-warnings 0`

### Verificação

```bash
# evidência: testes-focus-header.txt
pnpm vitest run src/focus-header --reporter=verbose
test -z "$(pnpm exec tsc --noEmit --pretty false 2>&1 | grep -E '^(src/focus-header/)')"
pnpm exec eslint src/focus-header --max-warnings 0
pnpm exec prettier --check src/focus-header
test -z "$(grep -nE '#[0-9a-fA-F]{3,8}\b|rgba?\(|[0-9.]+(px|ms)\b|font-weight: *[0-9]|line-height: *[0-9]|z-index: *[0-9]' src/focus-header/*.module.css | grep -v '@media')"
( for f in $(ls src/focus-header/* | grep -v '\.test\.'); do test "$(wc -l < "$f")" -le 200 || { echo "$f passa de 200 linhas"; exit 1; }; done; echo 'OK: arquivos de produção com até 200 linhas' )
```

Resultado esperado: todos com código 0.

### Evidências

- `testes-focus-header.txt` (automática, da verificação)
  - Título: Testes do FocusHeader passam
  - Prova: o botão de sair tem o nome `Sair` (ou o de `labels`) e funciona pelo teclado, o título é o `h1`, a posição e o `ProgressBar` aparecem, o título longo corta numa linha, o sair tem 44 px e o cabeçalho passa no axe (RF-40, CT-37, CB-13, RNF-02, RNF-03).
  - Trecho: as linhas `✓` de `names the exit button Sair by default`, `accepts another exit label`, `calls onExit on click and with the keyboard`, `shows the title, the position and the progress bar`, `truncates a long title on one line` e o resumo `Tests  N passed` sem `failed`.
  - Falha: linhas com `×`, `FAIL` ou `Tests  N failed`.
  - Requer: `src/focus-header/focus-header.test.tsx`
- `focus-header-360.png` (print): `( set -e; R="$PWD"; D=$(mktemp -d node_modules/.vega-print-XXXX); trap 'rm -rf "$R/$D"' EXIT; printf '%s\n' "import react from '@vitejs/plugin-react';" "export default { root: '$R/$D', base: './', logLevel: 'error', plugins: [react()], build: { outDir: 'out', emptyOutDir: true } };" > "$D/vite.config.mjs"; printf '%s\n' '<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0"><div id="root"></div><script type="module" src="./main.tsx"></script></body></html>' > "$D/index.html"; printf '%s\n' "import '$R/src/theme/fonts.css';" "import '$R/src/theme/tokens.css';" "import { createRoot } from 'react-dom/client';" "import { FocusHeader } from '$R/src/focus-header/focus-header';" "function Panel({ theme, width, children }: { theme: string; width?: number; children: React.ReactNode }) { return (<section data-theme={theme} style={{ flex: width ? 'none' : 1, width, boxSizing: 'border-box', padding: 24, background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--font-body)', display: 'flex', flexDirection: 'column', gap: 16, minHeight: 420 }}><strong>{theme}{width ? ' · ' + String(width) + ' px' : ''}</strong>{children}</section>); }" "function Scene({ theme }: { theme: string }) { return (<Panel theme={theme} width={360}><FocusHeader title=\"Função afim\" position=\"3/8\" progress={{ value: 3, max: 8, label: 'Progresso da lição' }} onExit={() => undefined} /><FocusHeader title=\"Interpretação de gráficos de funções do segundo grau\" position=\"12/40\" progress={{ value: 12, max: 40, label: 'Progresso do simulado' }} onExit={() => undefined} /><FocusHeader title=\"Revisão\" onExit={() => undefined} labels={{ exit: 'Encerrar revisão' }} /></Panel>); }" "createRoot(document.getElementById('root')!).render(<div style={{ display: 'flex' }}><Scene theme=\"light\" /><Scene theme=\"dark\" /></div>);" "setTimeout(() => { document.querySelectorAll('section')[1]?.querySelector<HTMLButtonElement>('button')?.focus(); }, 300);" > "$D/main.tsx"; pnpm exec vite build --config "$D/vite.config.mjs"; CHROME=$(ls -d "$HOME"/.cache/ms-playwright/chromium-*/chrome-linux64/chrome | sort -V | tail -1); "$CHROME" --headless --disable-gpu --no-sandbox --hide-scrollbars --allow-file-access-from-files --virtual-time-budget=3000 --window-size=720,420 --screenshot="$VOSTOK_EVIDENCE/focus-header-360.png" "file://$R/$D/out/index.html" )`
  - Título: FocusHeader numa linha a 360 px
  - Prova: o sair, o título e a posição cabem numa linha a 360 px, o título longo termina em reticências, o progresso fica embaixo e o foco é visível, nos dois temas (RF-40, CB-13, RNF-01).
  - Trecho: `Função afim` com `3/8` e a barra embaixo, o título do segundo cabeçalho cortado com `...` antes de `12/40`, o terceiro só com o título, e o anel de foco no botão de sair do painel escuro.
  - Falha: título quebrando em duas linhas, posição empurrada para fora do painel, sair sem ícone ou foco invisível.
