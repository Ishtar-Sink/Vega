### Baseline

- `pnpm vitest run src/theme src/checkbox 2>&1 | grep -E '^\s*(Test Files|Tests)\s'`
- `pnpm exec tsc --noEmit --pretty false 2>&1 | grep -E '^(src/theme/|src/checkbox/)' | sort`
- `pnpm exec eslint src/theme src/checkbox --max-warnings 0`

### Verificação

```bash
# evidência: testes-switch.txt
pnpm vitest run src/switch --reporter=verbose
test -z "$(pnpm exec tsc --noEmit --pretty false 2>&1 | grep -E '^(src/switch/)')"
pnpm exec eslint src/switch --max-warnings 0
pnpm exec prettier --check src/switch
test -z "$(grep -nE '#[0-9a-fA-F]{3,8}\b|rgba?\(|[0-9.]+(px|ms)\b|font-weight: *[0-9]|line-height: *[0-9]|z-index: *[0-9]' src/switch/*.module.css | grep -v '@media')"
( for f in $(ls src/switch/* | grep -v '\.test\.'); do test "$(wc -l < "$f")" -le 200 || { echo "$f passa de 200 linhas"; exit 1; }; done; echo 'OK: arquivos de produção com até 200 linhas' )
```

Resultado esperado: todos com código 0. O `opacity: 0.5` do desabilitado é proporção e fica fora da busca de literais.

### Evidências

- `testes-switch.txt` (automática, da verificação)
  - Título: Testes do Switch passam
  - Prova: o `Switch` tem papel `switch` com nome do rótulo, alterna por clique, Espaço, Enter e toque no rótulo, não alterna desabilitado, repassa as props nativas, passa no axe e tem área de toque de 44 px (RF-03, RF-04, CT-03, CT-04, CB-01, RNF-02, RNF-03).
  - Trecho: as linhas `✓` de `has the switch role named by the label`, `toggles with Space and Enter`, `toggles when the label is clicked`, `does not toggle when disabled`, `keeps a 44px touch target` e o resumo `Tests  N passed` sem `failed`.
  - Falha: linhas com `×`, `FAIL` ou `Tests  N failed`.
  - Requer: `src/switch/switch.test.tsx`
- `switch-temas.png` (print): `( set -e; R="$PWD"; D=$(mktemp -d node_modules/.vega-print-XXXX); trap 'rm -rf "$R/$D"' EXIT; printf '%s\n' "import react from '@vitejs/plugin-react';" "export default { root: '$R/$D', base: './', logLevel: 'error', plugins: [react()], build: { outDir: 'out', emptyOutDir: true } };" > "$D/vite.config.mjs"; printf '%s\n' '<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0"><div id="root"></div><script type="module" src="./main.tsx"></script></body></html>' > "$D/index.html"; printf '%s\n' "import '$R/src/theme/fonts.css';" "import '$R/src/theme/tokens.css';" "import { createRoot } from 'react-dom/client';" "import { useState } from 'react';" "import { Switch } from '$R/src/switch/switch';" "function Panel({ theme, width, children }: { theme: string; width?: number; children: React.ReactNode }) { return (<section data-theme={theme} style={{ flex: width ? 'none' : 1, width, boxSizing: 'border-box', padding: 24, background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--font-body)', display: 'flex', flexDirection: 'column', gap: 16, minHeight: 420 }}><strong>{theme}{width ? ' · ' + String(width) + ' px' : ''}</strong>{children}</section>); }" "function Scene({ theme }: { theme: string }) { const [a, setA] = useState(true); const [b, setB] = useState(false); return (<Panel theme={theme} width={360}><Switch label=\"Disponível offline\" help=\"12 MB\" checked={a} onCheckedChange={setA} /><Switch label=\"Lembretes de revisão\" checked={b} onCheckedChange={setB} /><Switch label=\"Sincronizar no celular\" help=\"Indisponível nesta conta\" checked={false} onCheckedChange={() => undefined} disabled /></Panel>); }" "createRoot(document.getElementById('root')!).render(<div style={{ display: 'flex' }}><Scene theme=\"light\" /><Scene theme=\"dark\" /></div>);" "setTimeout(() => { document.querySelectorAll('section')[1]?.querySelector<HTMLButtonElement>('[role=\"switch\"]')?.focus(); }, 300);" > "$D/main.tsx"; pnpm exec vite build --config "$D/vite.config.mjs"; CHROME=$(ls -d "$HOME"/.cache/ms-playwright/chromium-*/chrome-linux64/chrome | sort -V | tail -1); "$CHROME" --headless --disable-gpu --no-sandbox --hide-scrollbars --allow-file-access-from-files --virtual-time-budget=3000 --window-size=720,420 --screenshot="$VOSTOK_EVIDENCE/switch-temas.png" "file://$R/$D/out/index.html" )`
  - Título: Switch ligado, desligado e desabilitado
  - Prova: ligado e desligado se distinguem pela posição do botão, não só pela cor; o desabilitado fica esmaecido; o foco é visível; o rótulo e a ajuda cabem em 360 px nos dois temas (RF-03, RN-03, RNF-01).
  - Trecho: o primeiro switch com o botão à direita e o trilho na cor primária, o segundo com o botão à esquerda e o trilho na borda forte, o terceiro esmaecido, e o anel de foco no primeiro switch do painel escuro.
  - Falha: os dois estados com o botão na mesma posição, foco invisível, texto cortado ou cores iguais nos dois temas.
