### Baseline

- `pnpm vitest run src/button --reporter=verbose 2>&1 | grep -E '^\s+(✓|×)' | sed -E 's/ [0-9]+ms$//' | sort`
- `pnpm exec tsc --noEmit --pretty false 2>&1 | grep -E '^(src/button/)' | sort`
- `pnpm exec eslint src/button --max-warnings 0`

### Verificação

```bash
# evidência: testes-button.txt
pnpm vitest run src/button --reporter=verbose
test -z "$(pnpm exec tsc --noEmit --pretty false 2>&1 | grep -E '^(src/button/)')"
pnpm exec eslint src/button --max-warnings 0
pnpm exec prettier --check src/button
test -z "$(grep -nE '#[0-9a-fA-F]{3,8}\b|rgba?\(|[0-9.]+(px|ms)\b|font-weight: *[0-9]|line-height: *[0-9]|z-index: *[0-9]' src/button/button.module.css | grep -v '@media')"
( for f in $(ls src/button/* | grep -v '\.test\.'); do test "$(wc -l < "$f")" -le 200 || { echo "$f passa de 200 linhas"; exit 1; }; done; echo 'OK: arquivos de produção com até 200 linhas' )
```

Resultado esperado: todos com código 0; os testes antigos do `Button` continuam aprovados e os cinco novos também.

### Evidências

- `testes-button.txt` (automática, da verificação)
  - Título: Testes do Button com size e block passam
  - Prova: o `Button` ganha `size="lg"` com 48 px de altura mínima e `block` com largura total, sem mudar o padrão (RF-36, CT-33).
  - Trecho: as linhas `✓` de `keeps the md size by default without lg or block classes`, `applies the lg size`, `fills the width with block`, `uses a 48px minimum height in the lg size` e `keeps the block button inside its container with box-sizing border-box`, e o resumo `Tests  N passed` sem `failed`.
  - Falha: linhas com `×`, `FAIL` ou `Tests  N failed`.
- `button-tamanhos.png` (print): `( set -e; R="$PWD"; D=$(mktemp -d node_modules/.vega-print-XXXX); trap 'rm -rf "$R/$D"' EXIT; printf '%s\n' "import react from '@vitejs/plugin-react';" "export default { root: '$R/$D', base: './', logLevel: 'error', plugins: [react()], build: { outDir: 'out', emptyOutDir: true } };" > "$D/vite.config.mjs"; printf '%s\n' '<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0"><div id="root"></div><script type="module" src="./main.tsx"></script></body></html>' > "$D/index.html"; printf '%s\n' "import '$R/src/theme/fonts.css';" "import '$R/src/theme/tokens.css';" "import { createRoot } from 'react-dom/client';" "import { Button } from '$R/src/button/button';" "function Panel({ theme, width, children }: { theme: string; width?: number; children: React.ReactNode }) { return (<section data-theme={theme} style={{ flex: width ? 'none' : 1, width, boxSizing: 'border-box', padding: 24, background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--font-body)', display: 'flex', flexDirection: 'column', gap: 16, minHeight: 420 }}><strong>{theme}{width ? ' · ' + String(width) + ' px' : ''}</strong>{children}</section>); }" "function Scene({ theme }: { theme: string }) { return (<Panel theme={theme} width={360}><div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}><Button>Padrão</Button><Button variant=\"primary\">Primário</Button></div><Button size=\"lg\">Grande</Button><Button size=\"lg\" variant=\"primary\" block>Continuar</Button><Button block>Largura toda</Button></Panel>); }" "createRoot(document.getElementById('root')!).render(<div style={{ display: 'flex' }}><Scene theme=\"light\" /><Scene theme=\"dark\" /></div>);" > "$D/main.tsx"; pnpm exec vite build --config "$D/vite.config.mjs"; CHROME=$(ls -d "$HOME"/.cache/ms-playwright/chromium-*/chrome-linux64/chrome | sort -V | tail -1); "$CHROME" --headless --disable-gpu --no-sandbox --hide-scrollbars --allow-file-access-from-files --virtual-time-budget=3000 --window-size=720,480 --screenshot="$VOSTOK_EVIDENCE/button-tamanhos.png" "file://$R/$D/out/index.html" )`
  - Título: Button md, lg e block nos dois temas
  - Prova: o botão grande é mais alto que o padrão, o `block` ocupa a largura do painel de 360 px sem passar da borda, e os dois temas seguem os tokens (RF-36, CT-33).
  - Trecho: os botões `Padrão` e `Primário` com a altura de sempre, `Grande` mais alto, `Continuar` e `Largura toda` de borda a borda do painel, nos painéis claro e escuro.
  - Falha: `Continuar` ou `Largura toda` passando da borda do painel, `Grande` com a mesma altura dos outros ou cores que não mudam entre os temas.
