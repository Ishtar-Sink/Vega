### Baseline

- `pnpm vitest run src/theme 2>&1 | grep -E 'Test Files|Tests '`
- `pnpm exec tsc --noEmit`
- `pnpm exec eslint src/theme --max-warnings 0`
- `sha256sum src/theme/tokens.ts src/theme/tokens.css src/theme/index.ts`

### Verificação

```bash
# evidência: marca-itens-testes.txt
pnpm vitest run src/badge src/brand-logo src/item-swatch
pnpm exec tsc --noEmit
pnpm exec eslint src/badge src/brand-logo src/item-swatch --max-warnings 0
pnpm exec prettier --check src/badge src/brand-logo src/item-swatch
! grep -nEi '#[0-9a-f]{3,8}\b|[0-9]+(\.[0-9]+)?px|[0-9]+ms|font-weight: *[0-9]|line-height: *[0-9]|z-index: *[0-9]' src/badge/badge.module.css src/brand-logo/brand-logo.module.css src/item-swatch/item-swatch.module.css
```

Resultado esperado: os quatro arquivos de teste (`badge`, `brand-logo`, `palette` e `item-swatch`) passam (`Test Files  4 passed`), `tsc` sem erros, ESLint sem avisos, Prettier com `All matched files use Prettier code style!` e o `grep` sem nenhuma linha (RNF-02).

### Evidências

- `marca-itens-testes.txt` (automática, da verificação)
  - Título: Testes de Badge, BrandLogo e ItemSwatch passam
  - Prova: `BrandLogo` mostra a marca recebida sem o "A" do Atria, `ItemSwatch` usa a paleta recebida e, sem ela, a paleta padrão das variáveis do tema, `Badge` mapeia cada tom ao fundo `*Soft`, os três repassam `className`, `style`, `data-*` e `ref` e passam no axe (RF-16, RF-17, RF-20, CT-10, CT-11, CT-13, CB-05).
  - Trecho: `Test Files  4 passed (4)` e os testes `renders the mark it receives and the name`, `has no Atria mark fixed in the component`, `uses the palette it receives`, `uses the default theme palette without a palette` e `forwards className, style, data attributes and ref to the root span`.
  - Falha: `FAIL`, `AssertionError`, violação do axe (`Expected the HTML found at`) ou `error TS`.
- `marca-e-itens.png` (print): `( set -e; R="$PWD"; D=$(mktemp -d node_modules/.vega-print-XXXX); trap 'rm -rf "$R/$D"' EXIT; printf '%s\n' "import react from '@vitejs/plugin-react';" "export default { root: '$R/$D', base: './', logLevel: 'error', plugins: [react()], build: { outDir: 'out', emptyOutDir: true } };" > "$D/vite.config.mjs"; printf '%s\n' '<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0"><div id="root"></div><script type="module" src="./main.tsx"></script></body></html>' > "$D/index.html"; printf '%s\n' "import '$R/src/theme/fonts.css';" "import '$R/src/theme/tokens.css';" "import { createRoot } from 'react-dom/client';" "import { useState } from 'react';" "import { Badge } from '$R/src/badge/badge';" "import { BrandLogo } from '$R/src/brand-logo/brand-logo';" "import { ItemSwatch } from '$R/src/item-swatch/item-swatch';" "const star = <svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\" aria-hidden=\"true\"><path d=\"M12 2l3 7 7 .6-5.4 4.7 1.7 7.2L12 17.8 5.7 21.5l1.7-7.2L2 9.6 9 9z\" fill=\"currentColor\" /></svg>;" "const tones = ['neutral', 'primary', 'accent', 'success', 'warning', 'danger', 'info'] as const;" "function Panel({ theme }: { theme: string }) { return (<section data-theme={theme} style={{ flex: 1, padding: 24, background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--font-body)', display: 'flex', flexDirection: 'column', gap: 12, minHeight: 360 }}><strong>{theme}</strong><BrandLogo name=\"Vega\" mark={star} /><div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{tones.map((t) => <Badge key={t} tone={t}>{t}</Badge>)}</div><div style={{ display: 'flex', gap: 8 }}><ItemSwatch id=\"album-1\">A</ItemSwatch><ItemSwatch id=\"livro-2\">L</ItemSwatch><ItemSwatch id=\"filme-3\">F</ItemSwatch><ItemSwatch id=\"custom\" palette={[['#0F766E', '#F59E0B']]}>P</ItemSwatch></div></section>); }" "createRoot(document.getElementById('root')!).render(<div style={{ display: 'flex' }}><Panel theme=\"light\" /><Panel theme=\"dark\" /></div>);" > "$D/main.tsx"; pnpm exec vite build --config "$D/vite.config.mjs"; CHROME=$(ls -d "$HOME"/.cache/ms-playwright/chromium-*/chrome-linux64/chrome | sort -V | tail -1); "$CHROME" --headless --disable-gpu --no-sandbox --hide-scrollbars --allow-file-access-from-files --virtual-time-budget=3000 --window-size=1400,200 --screenshot="$VOSTOK_EVIDENCE/marca-e-itens.png" "file://$R/$D/out/index.html" )`
  - Título: Selos, marca e quadrados de item nos temas claro e escuro
  - Prova: o visual entregue segue a identidade: selos com fundo suave e texto na cor do estado, marca recebida no quadrado em gradiente com o nome em gradiente, quadrados de item com os pares roxo e ciano do tema e o par da paleta recebida (RF-16, RF-17, CT-10, CT-11, [project/theme-06]).
  - Trecho: os 7 selos legíveis nos dois temas; o desenho recebido no quadrado do logo; três gradientes de item diferentes entre si e um em verde-azulado e âmbar.
  - Falha: selo com fundo cheio ou texto ilegível, o "A" do Atria no logo, quadrado de item sem gradiente (variáveis `--item-palette-*` não resolvidas) ou o item com `palette` igual aos outros.
