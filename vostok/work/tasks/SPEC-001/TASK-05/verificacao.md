### Baseline

- `pnpm vitest run src/button src/icon-button src/menu-button 2>&1 | grep -E '^\s*(Test Files|Tests)\s'`
- `pnpm exec tsc --noEmit --pretty false 2>&1 | grep -E '^(src/theme/|src/button/|src/icon-button/|src/menu-button/)' | sort`
- `pnpm exec eslint src/button --max-warnings 0`

### Verificação

```bash
# evidência: cor-testes.txt
pnpm vitest run src/color-field --reporter=verbose
pnpm vitest run src/button
! (pnpm exec tsc --noEmit --pretty false 2>&1 | grep -E '^(src/color-field/|src/button/)')
pnpm exec eslint src/color-field --max-warnings 0
pnpm exec prettier --check src/color-field
! grep -nE '#[0-9a-fA-F]{3,8}\b|[0-9]px\b|[0-9]ms\b|rgba?\(|hsla?\(|font-weight: *[0-9]|line-height: *[0-9]|z-index: *[0-9]' src/color-field/color-field.module.css
! grep -rnE '\bhex_invalid\b|graus' src/color-field/color-field.tsx src/color-field/color.ts
node -e "const p = require('./package.json'); process.exit(Object.keys(p.dependencies ?? {}).length)"
```

Resultado esperado: os três arquivos de teste de `src/color-field` com `✓` em todos os casos e `Test Files  3 passed (3)`; os testes do `Button` continuam passando; nenhum erro de tipo nas duas pastas; ESLint sem aviso; Prettier sem diferença; nenhum literal (inclusive `font-weight`, `line-height` e `z-index` numéricos) no `.module.css` (RNF-02); nenhum `hex_invalid` nem "graus" fixo fora do padrão de textos; `dependencies` vazio (RNF-06).

### Evidências

- `cor-testes.txt` (automática, da verificação)
  - Título: Testes do campo e do seletor de cor passam
  - Prova: as funções de cor convertem HEX, RGB e HSL; o `ColorField` e o `ColorPicker` passam no axe, funcionam pelo teclado, usam os textos padrão em pt-br ou os recebidos, mostram o erro ligado ao gatilho e repassam `className`, `style`, `data-*` e `ref` (RF-10, RF-19, RF-20, CT-09, CT-12, CT-13, RNF-01).
  - Trecho: `✓` em `converts between HEX, RGB and HSL`, nos dois `has no axe violations`, em `changes hue with left and right arrows and saturation with up and down`, `opens with the keyboard and applies with Enter on Aplicar`, nos dois `uses the pt-br default labels...`, nos dois `ct12 shows the overridden labels`, nos dois `ct13 forwards className, style, data attributes and ref ...` e `Test Files  3 passed (3)`.
  - Falha: `×`, `FAIL`, `failed` na linha `Tests`, `No test files found` ou uma violação do axe listada.
  - Espera: `3 passed (3)`
  - Requer: `src/color-field/color.test.ts`, `src/color-field/color-picker.test.tsx`, `src/color-field/color-field.test.tsx`
- `cor-temas.png` (print): `( set -e; R="$PWD"; D=$(mktemp -d node_modules/.vega-print-XXXX); trap 'rm -rf "$R/$D"' EXIT; printf '%s\n' "import react from '@vitejs/plugin-react';" "export default { root: '$R/$D', base: './', logLevel: 'error', plugins: [react()], build: { outDir: 'out', emptyOutDir: true } };" > "$D/vite.config.mjs"; printf '%s\n' '<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0"><div id="root"></div><script type="module" src="./main.tsx"></script></body></html>' > "$D/index.html"; printf '%s\n' "import '$R/src/theme/fonts.css';" "import '$R/src/theme/tokens.css';" "import { createRoot } from 'react-dom/client';" "import { useState } from 'react';" "import { ColorField } from '$R/src/color-field/color-field';" "const theme = new URLSearchParams(location.search).get('theme');" "function Scene({ theme }: { theme: string }) { const [cor, setCor] = useState('#7C3AED'); return (<section data-theme={theme} style={{ flex: 1, padding: 24, background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--font-body)', display: 'flex', flexDirection: 'column', gap: 12, minHeight: 360 }}><strong>{theme}</strong><ColorField label=\"Cor da marca\" value={cor} onChange={setCor} help=\"Usada nos botões\" data-open=\"\" /><ColorField label=\"Cor do destaque\" value=\"#0F766E\" onChange={() => undefined} error=\"Escolha outra cor\" /></section>); }" "function Frames() { return (<div style={{ display: 'flex' }}><iframe title=\"light\" src=\"?theme=light\" style={{ flex: 1, height: 780, border: 0 }} /><iframe id=\"foco\" title=\"dark\" src=\"?theme=dark\" style={{ flex: 1, height: 780, border: 0 }} /></div>); }" "if (theme) { document.documentElement.dataset.theme = theme; document.body.style.background = 'var(--bg)'; createRoot(document.getElementById('root')!).render(<Scene theme={theme} />); setTimeout(() => { document.querySelector<HTMLButtonElement>('[data-open]')?.click(); }, 300); } else { createRoot(document.getElementById('root')!).render(<Frames />); setTimeout(() => { document.querySelector<HTMLIFrameElement>('#foco')?.contentWindow?.focus(); }, 1500); }" > "$D/main.tsx"; pnpm exec vite build --config "$D/vite.config.mjs"; CHROME=$(ls -d "$HOME"/.cache/ms-playwright/chromium-*/chrome-linux64/chrome | sort -V | tail -1); "$CHROME" --headless --disable-gpu --no-sandbox --hide-scrollbars --allow-file-access-from-files --virtual-time-budget=5000 --window-size=1400,780 --screenshot="$VOSTOK_EVIDENCE/cor-temas.png" "file://$R/$D/out/index.html" )`
  - Título: Campo de cor nos temas claro e escuro
  - Prova: o diálogo nativo abre sobre a página com os tokens do tema, a roda e os campos ficam legíveis nos dois temas e o foco é visível (RF-10, CT-09).
  - Trecho: a roda circular com o marcador na cor atual; o anel de foco ao redor da roda do painel escuro (o foco só fica num elemento por vez); os botões com as cores do `Button`; a mensagem de erro sob o campo.
  - Falha: diálogo sem fundo ou fora do centro, roda vazia, campos ilegíveis no tema escuro ou foco invisível.
