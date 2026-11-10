### Baseline

- `pnpm vitest run src/text-field 2>&1 | grep -E '^\s*(Test Files|Tests)\s'`
- `pnpm exec tsc --noEmit --pretty false 2>&1 | grep -E '^(src/theme/|src/text-field/)' | sort`
- `pnpm exec eslint src/text-field --max-warnings 0`

### Verificação

```bash
# evidência: testes-textarea.txt
pnpm vitest run src/text-area-field --reporter=verbose
test -z "$(pnpm exec tsc --noEmit --pretty false 2>&1 | grep -E '^(src/text-area-field/)')"
pnpm exec eslint src/text-area-field --max-warnings 0
pnpm exec prettier --check src/text-area-field
test -z "$(grep -nE '#[0-9a-fA-F]{3,8}\b|rgba?\(|[0-9.]+(px|ms)\b|font-weight: *[0-9]|line-height: *[0-9]|z-index: *[0-9]' src/text-area-field/*.module.css | grep -v '@media')"
( for f in $(ls src/text-area-field/* | grep -v '\.test\.'); do test "$(wc -l < "$f")" -le 200 || { echo "$f passa de 200 linhas"; exit 1; }; done; echo 'OK: arquivos de produção com até 200 linhas' )
```

Resultado esperado: todos com código 0.

### Evidências

- `testes-textarea.txt` (automática, da verificação)
  - Título: Testes do TextAreaField passam
  - Prova: o campo tem nome pelo rótulo, erro em `role="alert"`, ajuda, contador e erro ligados por `aria-describedby`, contador sem anúncio a cada tecla, `autoResize` entre `minRows` e `maxRows`, props nativas no `textarea` e axe sem violações (RF-10, RF-11, RF-12, CT-10, CT-11, CT-12, CB-04).
  - Trecho: as linhas `✓` de `marks the error with role alert and aria-invalid`, `links help, counter and error by aria-describedby`, `does not announce the counter on every key`, `grows with the content up to maxRows` e o resumo `Tests  N passed` sem `failed`.
  - Falha: linhas com `×`, `FAIL` ou `Tests  N failed`.
  - Requer: `src/text-area-field/text-area-field.test.tsx`
- `textarea-temas.png` (print): `( set -e; R="$PWD"; D=$(mktemp -d node_modules/.vega-print-XXXX); trap 'rm -rf "$R/$D"' EXIT; printf '%s\n' "import react from '@vitejs/plugin-react';" "export default { root: '$R/$D', base: './', logLevel: 'error', plugins: [react()], build: { outDir: 'out', emptyOutDir: true } };" > "$D/vite.config.mjs"; printf '%s\n' '<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0"><div id="root"></div><script type="module" src="./main.tsx"></script></body></html>' > "$D/index.html"; printf '%s\n' "import '$R/src/theme/fonts.css';" "import '$R/src/theme/tokens.css';" "import { createRoot } from 'react-dom/client';" "import { TextAreaField } from '$R/src/text-area-field/text-area-field';" "function Panel({ theme, width, children }: { theme: string; width?: number; children: React.ReactNode }) { return (<section data-theme={theme} style={{ flex: width ? 'none' : 1, width, boxSizing: 'border-box', padding: 24, background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--font-body)', display: 'flex', flexDirection: 'column', gap: 16, minHeight: 420 }}><strong>{theme}{width ? ' · ' + String(width) + ' px' : ''}</strong>{children}</section>); }" "function Scene({ theme }: { theme: string }) { return (<Panel theme={theme} width={360}><TextAreaField label=\"Redação\" help=\"Escreva entre 20 e 30 linhas.\" autoResize minRows={3} maxRows={6} defaultValue={'A tecnologia mudou a forma de estudar.\\nHoje é possível revisar no ônibus.\\nMas o foco continua sendo o desafio.'} counter=\"3 de 30 linhas\" /><TextAreaField label=\"Dúvida\" error=\"Escreva a dúvida antes de enviar.\" rows={2} /></Panel>); }" "createRoot(document.getElementById('root')!).render(<div style={{ display: 'flex' }}><Scene theme=\"light\" /><Scene theme=\"dark\" /></div>);" "setTimeout(() => { document.querySelectorAll('section')[1]?.querySelector('textarea')?.focus(); }, 300);" > "$D/main.tsx"; pnpm exec vite build --config "$D/vite.config.mjs"; CHROME=$(ls -d "$HOME"/.cache/ms-playwright/chromium-*/chrome-linux64/chrome | sort -V | tail -1); "$CHROME" --headless --disable-gpu --no-sandbox --hide-scrollbars --allow-file-access-from-files --virtual-time-budget=3000 --window-size=720,560 --screenshot="$VOSTOK_EVIDENCE/textarea-temas.png" "file://$R/$D/out/index.html" )`
  - Título: TextAreaField com contador e erro nos dois temas
  - Prova: o campo segue o visual do `TextField`, cresce com o texto, mostra a ajuda, o contador e o erro, e cabe em 360 px nos dois temas (RF-10, RF-11, RF-12, RNF-01).
  - Trecho: o campo `Redação` com três linhas de texto, a ajuda acima do contador `3 de 30 linhas`, o campo `Dúvida` com borda e mensagem de erro em vermelho, e o foco visível no painel escuro.
  - Falha: campo passando da borda do painel, texto apertado sem entrelinha, contador ou erro ausentes, ou cores iguais nos dois temas.
