### Baseline

- `pnpm vitest run src/button --reporter=verbose 2>&1 | grep -E '^\s+(✓|×)' | sed -E 's/ [0-9]+ms$//' | sort`
- `pnpm exec tsc --noEmit 2>&1 | grep -E '^(src/button/)' | sort`
- `pnpm exec eslint src/button --max-warnings 0`

### Verificação

```bash
# evidência: testes-estados.txt
pnpm vitest run src/empty-state src/loading-state src/error-state src/progress-bar --reporter=verbose
test -z "$(pnpm exec tsc --noEmit 2>&1 | grep -E '^(src/empty-state/|src/loading-state/|src/error-state/|src/progress-bar/)')"
pnpm exec eslint src/empty-state src/loading-state src/error-state src/progress-bar --max-warnings 0
pnpm exec prettier --check src/empty-state src/loading-state src/error-state src/progress-bar
test -z "$(grep -nE '#[0-9a-fA-F]{3,8}\b|rgba?\(|[0-9.]+(px|ms)\b|font-weight: *[0-9]|line-height: *[0-9]|z-index: *[0-9]' src/empty-state/*.module.css src/loading-state/*.module.css src/error-state/*.module.css src/progress-bar/*.module.css | grep -v '@media')"
```

### Evidências

- `testes-estados.txt` (automática, da verificação)
  - Título: Testes dos componentes de estado passam
  - Prova: `EmptyState`, `LoadingState`, `Skeleton`, `ErrorState` e `ProgressBar` passam nos testes de papel e nome acessível, axe, teclado na nova tentativa, `aria-busy` no carregamento, props nativas e textos padrão sobrescrevíveis (RF-15, RF-19, RF-20, CT-09, CT-13).
  - Trecho: as linhas `✓` de `marks the region as busy`, `announces Carregando by default`, `uses the pt-BR texts by default`, `accepts overridden texts`, `retries with the keyboard`, `passes className, style and data attributes to the root` e o resumo `Tests  N passed` sem `failed`.
  - Falha: linhas com `×`, `FAIL` ou `Tests  N failed`.
  - Requer: `src/empty-state/empty-state.test.tsx`, `src/loading-state/loading-state.test.tsx`, `src/error-state/error-state.test.tsx`, `src/progress-bar/progress-bar.test.tsx`
- `estados-temas.png` (print): `( set -e; R="$PWD"; D=$(mktemp -d node_modules/.vega-print-XXXX); trap 'rm -rf "$R/$D"' EXIT; printf '%s\n' "import react from '@vitejs/plugin-react';" "export default { root: '$R/$D', base: './', logLevel: 'error', plugins: [react()], build: { outDir: 'out', emptyOutDir: true } };" > "$D/vite.config.mjs"; printf '%s\n' '<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0"><div id="root"></div><script type="module" src="./main.tsx"></script></body></html>' > "$D/index.html"; printf '%s\n' "import '$R/src/theme/fonts.css';" "import '$R/src/theme/tokens.css';" "import { createRoot } from 'react-dom/client';" "import { useState } from 'react';" "import { EmptyState } from '$R/src/empty-state/empty-state';" "import { LoadingState } from '$R/src/loading-state/loading-state';" "import { ErrorState } from '$R/src/error-state/error-state';" "import { ProgressBar } from '$R/src/progress-bar/progress-bar';" "import { Button } from '$R/src/button/button';" "function Panel({ theme }: { theme: string }) { return (<section data-theme={theme} style={{ flex: 1, padding: 24, background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--font-body)', display: 'flex', flexDirection: 'column', gap: 12, minHeight: 360 }}><strong>{theme}</strong><EmptyState title=\"Nada por aqui\" description=\"Crie o primeiro item da coleção.\" action={<Button variant=\"primary\">Novo item</Button>} /><LoadingState rows={3} /><ErrorState description=\"Verifique a conexão e tente de novo.\" onRetry={() => undefined} /><ProgressBar label=\"Envio\" value={40} /><ProgressBar label=\"Concluído\" value={100} /></section>); }" "createRoot(document.getElementById('root')!).render(<div style={{ display: 'flex' }}><Panel theme=\"light\" /><Panel theme=\"dark\" /></div>);" "setTimeout(() => { document.querySelectorAll('section')[1]?.querySelector<HTMLButtonElement>('[role=\"alert\"] button')?.focus(); }, 300);" > "$D/main.tsx"; pnpm exec vite build --config "$D/vite.config.mjs"; CHROME=$(ls -d "$HOME"/.cache/ms-playwright/chromium-*/chrome-linux64/chrome | sort -V | tail -1); "$CHROME" --headless --disable-gpu --no-sandbox --hide-scrollbars --allow-file-access-from-files --virtual-time-budget=3000 --window-size=1400,860 --screenshot="$VOSTOK_EVIDENCE/estados-temas.png" "file://$R/$D/out/index.html" )`
  - Título: Componentes de estado nos temas claro e escuro
  - Prova: os estados de vazio, carregando, erro e progresso seguem o tema nos dois modos, com o erro no fundo `danger-soft` e texto, foco visível e a barra preenchida com a cor primária (RF-15, CT-09).
  - Trecho: a borda tracejada do vazio, as linhas do esqueleto, o fundo do erro com o título legível, o anel de foco no botão `Tentar de novo` do painel escuro e o preenchimento das barras.
  - Falha: cores que não mudam entre os temas, texto do erro ilegível, foco invisível ou barra sem preenchimento.
