### Baseline

- `pnpm vitest run src/card --reporter=verbose 2>&1 | grep -E '^\s+(✓|×)' | sed -E 's/ [0-9]+ms$//' | sort`
- `pnpm exec tsc --noEmit --pretty false 2>&1 | grep -E '^(src/card/)' | sort`
- `pnpm exec eslint src/card --max-warnings 0`

### Verificação

```bash
# evidência: testes-cartoes.txt
pnpm vitest run src/card-link --reporter=verbose
test -z "$(pnpm exec tsc --noEmit --pretty false 2>&1 | grep -E '^(src/card-link/)')"
pnpm exec eslint src/card-link --max-warnings 0
pnpm exec prettier --check src/card-link
test -z "$(grep -nE '#[0-9a-fA-F]{3,8}\b|rgba?\(|[0-9.]+(px|ms)\b|font-weight: *[0-9]|line-height: *[0-9]|z-index: *[0-9]' src/card-link/*.module.css | grep -v '@media')"
( for f in $(ls src/card-link/* | grep -v '\.test\.'); do test "$(wc -l < "$f")" -le 200 || { echo "$f passa de 200 linhas"; exit 1; }; done; echo 'OK: arquivos de produção com até 200 linhas' )
pnpm vitest run src/card
```

Resultado esperado: todos com código 0; o último comando confirma que o `Card` não mudou.

### Evidências

- `testes-cartoes.txt` (automática, da verificação)
  - Título: Testes do CardLink e do CardButton passam
  - Prova: os cartões interativos são `<a>` e `<button>` de verdade, com o cartão inteiro como um alvo, tom do `Card`, teclado, props nativas, estados de hover, foco e pressionado, alvo de 44 px e axe sem violações (RF-39, CT-36, RNF-02, RNF-03).
  - Trecho: as linhas `✓` de `renders CardLink as a real link`, `renders CardButton as a real button of type button`, `makes the whole card a single target`, `shows hover, visible focus and pressed states` e o resumo `Tests  N passed` sem `failed`.
  - Falha: linhas com `×`, `FAIL` ou `Tests  N failed`.
  - Requer: `src/card-link/card-link.test.tsx`
- `cartoes-interativos.png` (print): `( set -e; R="$PWD"; D=$(mktemp -d node_modules/.vega-print-XXXX); trap 'rm -rf "$R/$D"' EXIT; printf '%s\n' "import react from '@vitejs/plugin-react';" "export default { root: '$R/$D', base: './', logLevel: 'error', plugins: [react()], build: { outDir: 'out', emptyOutDir: true } };" > "$D/vite.config.mjs"; printf '%s\n' '<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0"><div id="root"></div><script type="module" src="./main.tsx"></script></body></html>' > "$D/index.html"; printf '%s\n' "import '$R/src/theme/fonts.css';" "import '$R/src/theme/tokens.css';" "import { createRoot } from 'react-dom/client';" "import { CardLink } from '$R/src/card-link/card-link';" "import { CardButton } from '$R/src/card-link/card-button';" "function Panel({ theme, width, children }: { theme: string; width?: number; children: React.ReactNode }) { return (<section data-theme={theme} style={{ flex: width ? 'none' : 1, width, boxSizing: 'border-box', padding: 24, background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--font-body)', display: 'flex', flexDirection: 'column', gap: 16, minHeight: 420 }}><strong>{theme}{width ? ' · ' + String(width) + ' px' : ''}</strong>{children}</section>); }" "function Scene({ theme }: { theme: string }) { return (<Panel theme={theme} width={360}><CardLink href=\"#tema\"><strong>Funções</strong><p style={{ margin: 0 }}>12 lições · 40 questões</p></CardLink><CardLink href=\"#simulado\" tone=\"primary\"><strong>Simulado ENEM</strong><p style={{ margin: 0 }}>90 questões</p></CardLink><CardButton onClick={() => undefined}><strong>Continuar a sessão</strong><p style={{ margin: 0 }}>Faltam 4 passos</p></CardButton></Panel>); }" "createRoot(document.getElementById('root')!).render(<div style={{ display: 'flex' }}><Scene theme=\"light\" /><Scene theme=\"dark\" /></div>);" "setTimeout(() => { document.querySelectorAll('section')[1]?.querySelector<HTMLAnchorElement>('a')?.focus(); }, 300);" > "$D/main.tsx"; pnpm exec vite build --config "$D/vite.config.mjs"; CHROME=$(ls -d "$HOME"/.cache/ms-playwright/chromium-*/chrome-linux64/chrome | sort -V | tail -1); "$CHROME" --headless --disable-gpu --no-sandbox --hide-scrollbars --allow-file-access-from-files --virtual-time-budget=3000 --window-size=720,520 --screenshot="$VOSTOK_EVIDENCE/cartoes-interativos.png" "file://$R/$D/out/index.html" )`
  - Título: Cartões interativos nos dois temas
  - Prova: o `CardLink` e o `CardButton` têm o visual do `Card`, com o tom primário, ocupam a largura do painel de 360 px e mostram o foco visível (RF-39, RNF-01).
  - Trecho: os três cartões com borda e sombra do `Card`, o `Simulado ENEM` com fundo primário suave, o `Continuar a sessão` com a mesma largura dos outros e o anel de foco no primeiro cartão do painel escuro.
  - Falha: cartão com sublinhado de link, botão mais estreito que os links, foco invisível ou cores iguais nos dois temas.
