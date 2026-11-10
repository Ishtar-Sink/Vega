### Baseline

- `pnpm vitest run src/icons/view-icons.test.tsx --reporter=verbose 2>&1 | grep -E '^\s+(✓|×)' | sed -E 's/ [0-9]+ms$//' | sort`
- `pnpm exec tsc --noEmit 2>&1 | grep -E '^src/icons/' | sort`
- `pnpm exec eslint src/icons/index.ts src/icons/view-icons.tsx --max-warnings 0`

### Verificação

```bash
# evidência: icones-testes.txt
pnpm vitest run src/icons --reporter=verbose
test -z "$(pnpm exec tsc --noEmit 2>&1 | grep -E '^src/icons/')"
pnpm exec eslint src/icons --max-warnings 0
pnpm exec prettier --check src/icons
# evidência: icones-arquivos.txt
( set -e; wc -l src/icons/icon.types.ts src/icons/icon.tsx src/icons/interface-icons.tsx; for f in src/icons/icon.types.ts src/icons/icon.tsx src/icons/interface-icons.tsx; do test "$(wc -l < "$f")" -le 200 || { echo "ERRO: $f passa de 200 linhas"; exit 1; }; done; if grep -nE "(fill|stroke)=\"#|(fill|stroke): *#" src/icons/icon.tsx src/icons/interface-icons.tsx; then echo 'ERRO: cor fixa nos ícones'; exit 1; fi; echo 'OK: arquivos dos ícones em até 200 linhas e sem cor fixa' )
```

Resultado esperado: código 0. `icones-testes.txt` com as linhas `✓` de cada um dos 36 ícones, dos tamanhos, do `aria-hidden` fixo, das props nativas e do axe, mais os testes do `view-icons.test.tsx`, sem `failed`; `icones-arquivos.txt` com `OK: ...`.

### Evidências

- `icones-testes.txt` (automática, da verificação)
  - Título: Ícones de interface decorativos e com ref
  - Prova: os 36 ícones são exportados, decorativos (`aria-hidden`, `focusable="false"`), com traço `currentColor` de espessura 2, tamanho 20 por padrão e 16/24 por prop, e repassam a `ref`, a classe e o estilo (RF-01, RF-02, CT-01, CT-02).
  - Trecho: `✓ exporta os 36 ícones da primeira leva`, as 36 linhas `✓ <Nome> é decorativo, com traço currentColor e ref`, `✓ aceita os tamanhos 16 e 24` e o resumo `Tests  N passed` sem `failed`.
  - Falha: linhas com `×`, `FAIL` ou `Tests  N failed`.
- `icones-arquivos.txt` (automática, da verificação)
  - Título: Arquivos dos ícones pequenos e sem cor fixa
  - Prova: os arquivos novos seguem o limite de 200 linhas e nenhum ícone tem cor fixa ([project/code-style-08], RNF-08, RN-03).
  - Trecho: as contagens do `wc -l` e `OK: arquivos dos ícones em até 200 linhas e sem cor fixa`.
  - Falha: `ERRO: ... passa de 200 linhas` ou `ERRO: cor fixa nos ícones`.
- `icones-temas.png` (print): `( set -e; R="$PWD"; D=$(mktemp -d node_modules/.vega-print-XXXX); trap 'rm -rf "$R/$D"' EXIT; printf '%s\n' "import react from '@vitejs/plugin-react';" "export default { root: '$R/$D', base: './', logLevel: 'error', plugins: [react()], build: { outDir: 'out', emptyOutDir: true } };" > "$D/vite.config.mjs"; printf '%s\n' '<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0"><div id="root"></div><script type="module" src="./main.tsx"></script></body></html>' > "$D/index.html"; printf '%s\n' "import '$R/src/theme/fonts.css';" "import '$R/src/theme/tokens.css';" "import { createRoot } from 'react-dom/client';" "import * as icons from '$R/src/icons/interface-icons';" "const list = Object.entries(icons);" "function Panel({ theme }: { theme: string }) { return (<section data-theme={theme} style={{ flex: 1, padding: 24, background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--font-body)' }}><strong>{theme}</strong><div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12, marginTop: 12 }}>{list.map(([name, Icon]) => (<div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, fontSize: 11 }}><span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Icon size={16} /><Icon /><span style={{ color: 'var(--primary)' }}><Icon size={24} /></span></span>{name}</div>))}</div></section>); }" "createRoot(document.getElementById('root')!).render(<div style={{ display: 'flex' }}><Panel theme='light' /><Panel theme='dark' /></div>);" > "$D/main.tsx"; pnpm exec vite build --config "$D/vite.config.mjs"; CHROME=$(ls -d "$HOME"/.cache/ms-playwright/chromium-*/chrome-linux64/chrome | sort -V | tail -1); "$CHROME" --headless --disable-gpu --no-sandbox --hide-scrollbars --allow-file-access-from-files --virtual-time-budget=5000 --window-size=2000,900 --screenshot="$VOSTOK_EVIDENCE/icones-temas.png" "file://$R/$D/out/index.html" )`
  - Título: Ícones de interface nos temas claro e escuro
  - Prova: os 36 ícones aparecem com traço legível nos dois temas, nos tamanhos 16, 20 e 24, herdando a cor do texto e a cor `primary` quando o pai muda a cor (RF-01, RF-02, RN-03).
  - Trecho: a grade de 36 ícones com o nome embaixo em cada painel, três tamanhos por ícone, o terceiro em roxo (`primary`), e o traço claro no painel escuro.
  - Falha: ícone ausente, quadrado vazio, traço preto no tema escuro ou tamanhos iguais.
