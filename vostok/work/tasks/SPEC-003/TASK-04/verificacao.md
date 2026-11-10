### Baseline

- `pnpm vitest run src/progress-bar --reporter=verbose 2>&1 | grep -E '^\s+(✓|×)' | sed -E 's/ [0-9]+ms$//' | sort`
- `pnpm exec tsc --noEmit --pretty false 2>&1 | grep -E '^(src/progress-bar/)' | sort`
- `pnpm exec eslint src/progress-bar --max-warnings 0`

### Verificação

```bash
# evidência: testes-progresso.txt
pnpm vitest run src/progress-bar --reporter=verbose
test -z "$(pnpm exec tsc --noEmit --pretty false 2>&1 | grep -E '^(src/progress-bar/)')"
pnpm exec eslint src/progress-bar --max-warnings 0
pnpm exec prettier --check src/progress-bar
test -z "$(grep -nE '#[0-9a-fA-F]{3,8}\b|rgba?\(|[0-9.]+(px|ms)\b|font-weight: *[0-9]|line-height: *[0-9]|z-index: *[0-9]' src/progress-bar/progress-bar.module.css | grep -v '@media')"
( for f in $(ls src/progress-bar/* | grep -v '\.test\.'); do test "$(wc -l < "$f")" -le 200 || { echo "$f passa de 200 linhas"; exit 1; }; done; echo 'OK: arquivos de produção com até 200 linhas' )
```

Resultado esperado: todos com código 0; os testes antigos do `ProgressBar` continuam aprovados e os seis novos também. Os 40% e 150% do CSS são proporções, não medidas, e ficam fora da busca de literais.

### Evidências

- `testes-progresso.txt` (automática, da verificação)
  - Título: Testes do ProgressBar com valor em texto e indeterminado
  - Prova: o `valueText` aparece e vira `aria-valuetext`; o modo indeterminado não anuncia valor, ignora o `value` e para de animar com movimento reduzido (RF-37, RF-38, CT-34, CT-35, CB-12, RNF-04).
  - Trecho: as linhas `✓` de `shows valueText as visible text and aria-valuetext`, `omits aria-valuenow when indeterminate`, `ignores the value when indeterminate`, `stops the indeterminate animation with reduced motion` e o resumo `Tests  N passed` sem `failed`.
  - Falha: linhas com `×`, `FAIL` ou `Tests  N failed`.
- `progresso-temas.png` (print): `( set -e; R="$PWD"; D=$(mktemp -d node_modules/.vega-print-XXXX); trap 'rm -rf "$R/$D"' EXIT; printf '%s\n' "import react from '@vitejs/plugin-react';" "export default { root: '$R/$D', base: './', logLevel: 'error', plugins: [react()], build: { outDir: 'out', emptyOutDir: true } };" > "$D/vite.config.mjs"; printf '%s\n' '<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0"><div id="root"></div><script type="module" src="./main.tsx"></script></body></html>' > "$D/index.html"; printf '%s\n' "import '$R/src/theme/fonts.css';" "import '$R/src/theme/tokens.css';" "import { createRoot } from 'react-dom/client';" "import { ProgressBar } from '$R/src/progress-bar/progress-bar';" "function Panel({ theme, width, children }: { theme: string; width?: number; children: React.ReactNode }) { return (<section data-theme={theme} style={{ flex: width ? 'none' : 1, width, boxSizing: 'border-box', padding: 24, background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--font-body)', display: 'flex', flexDirection: 'column', gap: 16, minHeight: 420 }}><strong>{theme}{width ? ' · ' + String(width) + ' px' : ''}</strong>{children}</section>); }" "function Scene({ theme }: { theme: string }) { return (<Panel theme={theme} width={360}><ProgressBar label=\"Sessão\" value={40} /><ProgressBar label=\"Lição\" value={4} max={9} valueText=\"4 de 9\" /><ProgressBar label=\"Importação\" value={0} indeterminate /><ProgressBar label=\"Download\" value={0} indeterminate valueText=\"Baixando...\" /></Panel>); }" "createRoot(document.getElementById('root')!).render(<div style={{ display: 'flex' }}><Scene theme=\"light\" /><Scene theme=\"dark\" /></div>);" > "$D/main.tsx"; pnpm exec vite build --config "$D/vite.config.mjs"; CHROME=$(ls -d "$HOME"/.cache/ms-playwright/chromium-*/chrome-linux64/chrome | sort -V | tail -1); "$CHROME" --headless --disable-gpu --no-sandbox --hide-scrollbars --allow-file-access-from-files --virtual-time-budget=3000 --window-size=720,420 --screenshot="$VOSTOK_EVIDENCE/progresso-temas.png" "file://$R/$D/out/index.html" )`
  - Título: ProgressBar com texto e indeterminado nos dois temas
  - Prova: o texto do valor aparece abaixo da barra e a barra indeterminada mostra um trecho preenchido, legíveis nos dois temas a 360 px (RF-37, RF-38, CT-34, CT-35).
  - Trecho: `4 de 9` abaixo da segunda barra, `Baixando...` abaixo da última, e as barras indeterminadas com um trecho de cor primária sobre o trilho, nos painéis claro e escuro.
  - Falha: texto do valor ausente ou ilegível, barra indeterminada vazia ou ocupando o trilho todo.
