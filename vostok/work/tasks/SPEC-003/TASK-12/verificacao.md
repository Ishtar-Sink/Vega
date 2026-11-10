### Baseline

- `pnpm vitest run src/icons src/dialog src/icon-button --reporter=verbose 2>&1 | grep -E '^\s+(✓|×)' | sed -E 's/ [0-9]+ms$//' | sort`
- `pnpm exec tsc --noEmit 2>&1 | grep -E '^(src/icons/|src/dialog/|src/icon-button/)' | sort`
- `pnpm exec eslint src/icons src/dialog src/icon-button --max-warnings 0`

### Verificação

```bash
# evidência: testes-bottom-sheet.txt
pnpm vitest run src/bottom-sheet --reporter=verbose
test -z "$(pnpm exec tsc --noEmit 2>&1 | grep -E '^(src/bottom-sheet/)')"
pnpm exec eslint src/bottom-sheet --max-warnings 0
pnpm exec prettier --check src/bottom-sheet
test -z "$(grep -nE '#[0-9a-fA-F]{3,8}\b|rgba?\(|[0-9.]+(px|ms)\b|font-weight: *[0-9]|line-height: *[0-9]|z-index: *[0-9]' src/bottom-sheet/*.module.css | grep -v '@media')"
# evidência: linhas-bottom-sheet.txt
( set -e; for f in $(ls src/bottom-sheet/*.ts src/bottom-sheet/*.tsx src/bottom-sheet/*.css 2>/dev/null | grep -v '\.test\.'); do n=$(wc -l < "$f"); echo "$n $f"; test "$n" -le 200; done; echo 'OK: arquivos de produção com até 200 linhas' )
```

Resultado esperado: todos com código 0; `testes-bottom-sheet.txt` com os testes da pasta aprovados e `linhas-bottom-sheet.txt` terminando em `OK: arquivos de produção com até 200 linhas`.

### Evidências

- `testes-bottom-sheet.txt` (automática, da verificação)
  - Título: Testes do BottomSheet passam
  - Prova: o `BottomSheet` abre com o `<dialog>` nativo e `showModal()`, prende o Tab, fecha por Esc, fundo e botão, devolve o foco, fecha quando o pai muda `open`, troca de posição em 720 px, mantém o rodapé fora da rolagem e entra com os tokens de movimento (RF-19 a RF-21, CT-18, CT-19, CB-07, RNF-02 a RNF-04).
  - Trecho: as linhas `✓` de `opens with the native showModal and names the dialog by the title`, `closes on Escape, on the backdrop and on the close button`, `returns focus to the trigger`, `traps Tab inside the sheet`, `closes when open turns false from outside`, `moves to the side from 720 px in auto` e o resumo `Tests  N passed` sem `failed`.
  - Falha: linhas com `×`, `FAIL` ou `Tests  N failed`, ou erro `showModal is not a function`.
- `linhas-bottom-sheet.txt` (automática, da verificação)
  - Título: Arquivos do BottomSheet com até 200 linhas
  - Prova: cada arquivo de produção da pasta tem no máximo 200 linhas ([project/code-style-08], RNF-08).
  - Trecho: uma linha por arquivo de `src/bottom-sheet/` e `OK: arquivos de produção com até 200 linhas`.
  - Falha: o comando para num arquivo com mais de 200 linhas, sem a linha `OK`.
- `bottom-sheet-temas.png` (print): `( set -e; R="$PWD"; D=$(mktemp -d node_modules/.vega-print-XXXX); trap 'rm -rf "$R/$D"' EXIT; printf '%s\n' "import react from '@vitejs/plugin-react';" "export default { root: '$R/$D', base: './', logLevel: 'error', plugins: [react()], build: { outDir: 'out', emptyOutDir: true } };" > "$D/vite.config.mjs"; printf '%s\n' '<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0"><div id="root"></div><script type="module" src="./main.tsx"></script></body></html>' > "$D/index.html"; printf '%s\n' "import '$R/src/theme/fonts.css';" "import '$R/src/theme/tokens.css';" "import { createRoot } from 'react-dom/client';" "import { BottomSheet } from '$R/src/bottom-sheet/bottom-sheet';" "import { Button } from '$R/src/button/button';" "const q = new URLSearchParams(location.search); const theme = q.get('theme');" "function Scene({ theme }: { theme: string }) { return (<main data-theme={theme} style={{ padding: 24, minHeight: '100vh', boxSizing: 'border-box', background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--font-body)' }}><h1>{theme}</h1><p>Página por trás da folha, para mostrar o fundo escurecido.</p><BottomSheet open title='Questões do simulado' description='Toque numa questão para ir até ela.' onClose={() => undefined} footer={<Button variant='primary'>Entregar simulado</Button>}>{Array.from({ length: 24 }, (_, i) => <p key={i}>Questão {i + 1}: respondida</p>)}</BottomSheet></main>); }" "function Frames() { const frames = ['light', 'dark'].flatMap((t) => [{ t, w: 390 }, { t, w: 820 }]); return (<div style={{ display: 'grid', gridTemplateColumns: '390px 820px', gap: 8, background: '#888' }}>{frames.map(({ t, w }) => <iframe key={t + w} title={t + ' ' + w} src={'?theme=' + t} style={{ width: w, height: 680, border: 0 }} />)}</div>); }" "if (theme) { document.documentElement.dataset.theme = theme; document.body.style.background = 'var(--bg)'; createRoot(document.getElementById('root')!).render(<Scene theme={theme} />); } else { createRoot(document.getElementById('root')!).render(<Frames />); }" > "$D/main.tsx"; pnpm exec vite build --config "$D/vite.config.mjs"; CHROME=$(ls -d "$HOME"/.cache/ms-playwright/chromium-*/chrome-linux64/chrome | sort -V | tail -1); "$CHROME" --headless --disable-gpu --no-sandbox --hide-scrollbars --allow-file-access-from-files --virtual-time-budget=5000 --window-size=1230,1380 --screenshot="$VOSTOK_EVIDENCE/bottom-sheet-temas.png" "file://$R/$D/out/index.html" )`
  - Título: BottomSheet embaixo e na lateral, nos dois temas
  - Prova: abaixo de 720 px a folha fica embaixo, com a alça, até 85% da tela e o conteúdo rolando; a partir de 720 px fica na lateral direita; o rodapé fica fixo e o fundo escurecido, nos temas claro e escuro (RF-19, RF-21, RNF-01).
  - Trecho: os quadros de 390 px com a folha embaixo e a alça, os de 820 px com a folha à direita, o botão "Entregar simulado" visível no rodapé dos quatro e a lista de questões cortada pela rolagem.
  - Falha: a folha na mesma posição nas duas larguras, rodapé rolando junto com o conteúdo, folha ocupando a tela inteira embaixo ou texto ilegível no tema escuro.
