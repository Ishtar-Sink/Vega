### Baseline

- `pnpm vitest run src/theme --reporter=verbose 2>&1 | grep -E '^\s+(✓|×)' | sed -E 's/ [0-9]+ms$//' | sort`
- `pnpm exec tsc --noEmit 2>&1 | grep -E '^src/theme/' | sort`
- `pnpm exec eslint src/theme --max-warnings 0`

### Verificação

```bash
# evidência: testes-prose.txt
pnpm vitest run src/prose --reporter=verbose
test -z "$(pnpm exec tsc --noEmit 2>&1 | grep -E '^src/prose/')"
pnpm exec eslint src/prose --max-warnings 0
pnpm exec prettier --check src/prose
test -z "$(grep -nE '#[0-9a-fA-F]{3,8}\b|rgba?\(|[0-9.]+(px|ms)\b|font-weight: *[0-9]|line-height: *[0-9]|z-index: *[0-9]' src/prose/*.module.css | grep -v '@media')"
# evidência: prose-seguranca.txt
( for f in $(ls src/prose/*.ts src/prose/*.tsx src/prose/*.css | grep -v '\.test\.'); do n=$(wc -l < "$f"); echo "$f: $n linhas"; [ "$n" -le 200 ] || { echo "ERRO: $f passa de 200 linhas"; exit 1; }; done; if grep -rn 'dangerouslySetInnerHTML\|rehype-raw' src --include='*.ts' --include='*.tsx'; then echo 'ERRO: HTML injetado em src'; exit 1; fi; echo 'OK: arquivos do Prose com até 200 linhas e nenhum dangerouslySetInnerHTML nem rehype-raw em src' )
# evidência: prose-entrada.txt
( set -e; rm -rf dist; pnpm build >/dev/null 2>&1; test -s dist/prose.js; echo "dist/prose.js: $(wc -c < dist/prose.js) bytes"; if grep -n 'react-markdown' dist/index.js; then echo 'ERRO: dist/index.js importa react-markdown'; exit 1; fi; echo "imports de react-markdown no dist/prose.js: $(grep -c 'react-markdown' dist/prose.js)"; node --input-type=module -e "const p = await import('@ishtar-sink/vega/prose'); const v = await import('@ishtar-sink/vega'); console.log('Prose em @ishtar-sink/vega/prose:', typeof p.Prose); console.log('Prose em @ishtar-sink/vega:', 'Prose' in v); if (typeof p.Prose !== 'function' || 'Prose' in v) process.exit(1);"; echo 'OK: Prose só na entrada @ishtar-sink/vega/prose, sem o parser no índice' )
```

Resultado esperado: todos com código 0. `testes-prose.txt` com os testes de `src/prose` aprovados; `prose-seguranca.txt` com cada arquivo de produção do Prose com até 200 linhas e a linha `OK: ...`; `prose-entrada.txt` com `Prose em @ishtar-sink/vega/prose: function`, `Prose em @ishtar-sink/vega: false` e a linha `OK: ...`.

### Evidências

- `testes-prose.txt` (automática, da verificação)
  - Título: Testes do Prose passam
  - Prova: o `Prose` renderiza Markdown em elementos React, descarta HTML cru e URLs perigosas, aceita `components` e `remarkPlugins`, tem os tamanhos `base` e `reading`, a medida de leitura, a tabela com rolagem e as props nativas (RF-22 a RF-26, CT-20 a CT-23, CB-08, CB-09).
  - Trecho: as linhas `✓` de `renders markdown as React elements`, `drops raw HTML and dangerous URLs`, `replaces an element through components`, `applies remark plugins`, `keeps the reading measure and scrolls wide tables`, `has no axe violations` e o resumo `Tests  N passed` sem `failed`.
  - Falha: linhas com `×`, `FAIL` ou `Tests  N failed`.
- `prose-seguranca.txt` (automática, da verificação)
  - Título: Prose sem HTML injetado e com arquivos curtos
  - Prova: nenhum `dangerouslySetInnerHTML` nem `rehype-raw` no código, e os arquivos de produção do Prose têm até 200 linhas (RF-23, RNF-07, RNF-08).
  - Trecho: uma linha `src/prose/<arquivo>: N linhas` por arquivo, com N até 200, e `OK: arquivos do Prose com até 200 linhas e nenhum dangerouslySetInnerHTML nem rehype-raw em src`.
  - Falha: `ERRO: ... passa de 200 linhas` ou `ERRO: HTML injetado em src`, com a linha encontrada.
- `prose-entrada.txt` (automática, da verificação)
  - Título: Prose sai só na entrada própria
  - Prova: o build gera `dist/prose.js`, o `@ishtar-sink/vega/prose` exporta o `Prose`, o índice principal não o exporta e o `dist/index.js` não importa o `react-markdown` (RF-27, CT-24, RNF-06).
  - Trecho: `Prose em @ishtar-sink/vega/prose: function`, `Prose em @ishtar-sink/vega: false` e `OK: Prose só na entrada @ishtar-sink/vega/prose, sem o parser no índice`.
  - Falha: `ERRO: dist/index.js importa react-markdown`, `ERR_PACKAGE_PATH_NOT_EXPORTED` ou código diferente de 0 no `node`.
- `prose-temas.png` (print): `( set -e; R="$PWD"; D=$(mktemp -d node_modules/.vega-print-XXXX); trap 'rm -rf "$R/$D"' EXIT; printf '%s\n' "import react from '@vitejs/plugin-react';" "export default { root: '$R/$D', base: './', logLevel: 'error', plugins: [react()], build: { outDir: 'out', emptyOutDir: true } };" > "$D/vite.config.mjs"; printf '%s\n' '<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0"><div id="root"></div><script type="module" src="./main.tsx"></script></body></html>' > "$D/index.html"; printf '%s\n' "import '$R/src/theme/fonts.css';" "import '$R/src/theme/tokens.css';" "import { createRoot } from 'react-dom/client';" "import { Prose } from '$R/src/prose';" "const md = '# Lição 3: frações\\n\\nUma **fração** representa partes de um todo. Leia com calma: o texto longo usa a medida de leitura e a entrelinha relaxada.\\n\\n## Exemplo\\n\\n- Metade: 1/2\\n- Um terço: 1/3\\n- Um quarto: 1/4\\n\\n> Dica: compare sempre com o inteiro.\\n\\n| Fração | Decimal | Porcentagem | Leitura | Exemplo do cotidiano |\\n|---|---|---|---|---|\\n| 1/2 | 0,5 | 50% | um meio | meia pizza |\\n| 1/4 | 0,25 | 25% | um quarto | um quarto de hora |\\n\\nVeja também o [material externo](https://exemplo.com) e o código \x60a / b\x60.';" "const narrow = new URLSearchParams(location.search).has('narrow');" "function Panel({ theme, label, size }: { theme: string; label: string; size: 'base' | 'reading' }) { return (<section data-theme={theme} style={{ flex: 1, minWidth: 0, padding: 24, background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--font-body)', minHeight: 900 }}><strong>{label}</strong><Prose markdown={md} size={size} /></section>); }" "if (narrow) { document.documentElement.dataset.theme = 'light'; createRoot(document.getElementById('root')!).render(<Panel theme=\"light\" label=\"light · 360 px · base\" size=\"base\" />); } else { createRoot(document.getElementById('root')!).render(<div style={{ display: 'flex' }}><Panel theme=\"light\" label=\"light · reading\" size=\"reading\" /><Panel theme=\"dark\" label=\"dark · reading\" size=\"reading\" /><iframe title=\"360 px\" src=\"?narrow=1\" style={{ width: 360, height: 900, border: 0, flex: 'none' }} /></div>); }" > "$D/main.tsx"; pnpm exec vite build --config "$D/vite.config.mjs"; CHROME=$(ls -d "$HOME"/.cache/ms-playwright/chromium-*/chrome-linux64/chrome | sort -V | tail -1); "$CHROME" --headless --disable-gpu --no-sandbox --hide-scrollbars --allow-file-access-from-files --virtual-time-budget=5000 --window-size=1960,900 --screenshot="$VOSTOK_EVIDENCE/prose-temas.png" "file://$R/$D/out/index.html" )`
  - Título: Texto do Prose nos temas claro e escuro
  - Prova: o `Prose` segue o tema nos dois modos, com títulos em Outfit, corpo em Inter, medida de leitura, link sublinhado e a tabela larga rolando na horizontal a 360 px, sem rolar a página (RF-26, CB-09, RNF-01).
  - Trecho: os painéis claro e escuro com o tamanho `reading`, a citação e o código com fundo de token e, no painel de 360 px à direita, a tabela cortada com rolagem e o texto sem passar da largura.
  - Falha: cores iguais nos dois temas, texto ocupando a largura toda da tela larga, tabela empurrando a página a 360 px ou HTML cru aparecendo como texto.
