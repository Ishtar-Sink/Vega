### Baseline

- `pnpm vitest run src/icons src/card --reporter=verbose 2>&1 | grep -E '^\s+(✓|×)' | sed -E 's/ [0-9]+ms$//' | sort`
- `pnpm exec tsc --noEmit 2>&1 | grep -E '^(src/icons/|src/card/)' | sort`
- `pnpm exec eslint src/icons src/card --max-warnings 0`

### Verificação

```bash
# evidência: testes-disclosure.txt
pnpm vitest run src/disclosure --reporter=verbose
test -z "$(pnpm exec tsc --noEmit 2>&1 | grep -E '^(src/disclosure/)')"
pnpm exec eslint src/disclosure --max-warnings 0
pnpm exec prettier --check src/disclosure
test -z "$(grep -nE '#[0-9a-fA-F]{3,8}\b|rgba?\(|[0-9.]+(px|ms)\b|font-weight: *[0-9]|line-height: *[0-9]|z-index: *[0-9]' src/disclosure/*.module.css | grep -v '@media')"
# evidência: linhas-disclosure.txt
( set -e; for f in $(ls src/disclosure/*.ts src/disclosure/*.tsx src/disclosure/*.css 2>/dev/null | grep -v '\.test\.'); do n=$(wc -l < "$f"); echo "$n $f"; test "$n" -le 200; done; echo 'OK: arquivos de produção com até 200 linhas' )
```

Resultado esperado: todos com código 0; `testes-disclosure.txt` com os testes das duas suítes aprovados e `linhas-disclosure.txt` terminando em `OK: arquivos de produção com até 200 linhas`.

### Evidências

- `testes-disclosure.txt` (automática, da verificação)
  - Título: Testes do Disclosure e do Accordion passam
  - Prova: o `Disclosure` usa `<details>` e `<summary>` nativos, abre por clique, Enter e Espaço, funciona controlado e não controlado, e o `Accordion` `single` fecha os outros; tudo passa no axe, com animação só por tokens e AA nos tons (RF-13 a RF-15, CT-13 a CT-15, CB-05, RNF-02 a RNF-05).
  - Trecho: as linhas `✓` de `opens and closes uncontrolled by click and keyboard`, `stays as received when controlled`, `keeps the received open without onOpenChange`, `closes the others in single mode`, `animates only with motion tokens and stops with reduced motion` e o resumo `Tests  N passed` sem `failed`.
  - Falha: linhas com `×`, `FAIL` ou `Tests  N failed`.
- `linhas-disclosure.txt` (automática, da verificação)
  - Título: Arquivos do Disclosure com até 200 linhas
  - Prova: cada arquivo de produção da pasta tem no máximo 200 linhas ([project/code-style-08], RNF-08).
  - Trecho: uma linha por arquivo de `src/disclosure/` e `OK: arquivos de produção com até 200 linhas`.
  - Falha: o comando para num arquivo com mais de 200 linhas, sem a linha `OK`.
- `disclosure-temas.png` (print): `( set -e; R="$PWD"; D=$(mktemp -d node_modules/.vega-print-XXXX); trap 'rm -rf "$R/$D"' EXIT; printf '%s\n' "import react from '@vitejs/plugin-react';" "export default { root: '$R/$D', base: './', logLevel: 'error', plugins: [react()], build: { outDir: 'out', emptyOutDir: true } };" > "$D/vite.config.mjs"; printf '%s\n' '<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0"><div id="root"></div><script type="module" src="./main.tsx"></script></body></html>' > "$D/index.html"; printf '%s\n' "import '$R/src/theme/fonts.css';" "import '$R/src/theme/tokens.css';" "import { createRoot } from 'react-dom/client';" "import { Disclosure } from '$R/src/disclosure/disclosure';" "import { Accordion } from '$R/src/disclosure/accordion';" "import { LightbulbIcon } from '$R/src/icons/interface-icons';" "function Panel({ theme, width }: { theme: string; width?: number }) { return (<section data-theme={theme} style={{ flex: width ? 'none' : 1, width, boxSizing: 'border-box', padding: 24, background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--font-body)', display: 'flex', flexDirection: 'column', gap: 16 }}><strong>{theme}{width ? ' · ' + width + ' px' : ''}</strong><Disclosure title='Dica 1: comece pelo total' icon={<LightbulbIcon />} tone='accent' open={true} onOpenChange={() => undefined}><p>Some as partes antes de dividir.</p></Disclosure><Disclosure title='Armadilha comum' tone='warning'><p>Não esqueça a unidade.</p></Disclosure><Disclosure title='Por quê?' tone='info' defaultOpen><p>Porque a fração vale para o todo.</p></Disclosure><Accordion type='single'><Disclosure title='Seção 1' defaultOpen><p>Conteúdo da seção 1.</p></Disclosure><Disclosure title='Seção 2'><p>Conteúdo da seção 2.</p></Disclosure><Disclosure title='Seção 3'><p>Conteúdo da seção 3.</p></Disclosure></Accordion></section>); }" "createRoot(document.getElementById('root')!).render(<div style={{ display: 'flex', alignItems: 'flex-start' }}><Panel theme='light' /><Panel theme='dark' /><Panel theme='light' width={360} /></div>);" "setTimeout(() => { document.querySelectorAll('section')[1]?.querySelector<HTMLElement>('summary')?.focus(); }, 300);" > "$D/main.tsx"; pnpm exec vite build --config "$D/vite.config.mjs"; CHROME=$(ls -d "$HOME"/.cache/ms-playwright/chromium-*/chrome-linux64/chrome | sort -V | tail -1); "$CHROME" --headless --disable-gpu --no-sandbox --hide-scrollbars --allow-file-access-from-files --virtual-time-budget=4000 --window-size=1600,900 --screenshot="$VOSTOK_EVIDENCE/disclosure-temas.png" "file://$R/$D/out/index.html" )`
  - Título: Disclosure e Accordion nos temas claro e escuro
  - Prova: os tons `accent`, `warning` e `info` têm fundo suave, ícone e título na cor do tom; a seta indica aberto e fechado; o `Accordion` mostra só uma seção aberta; tudo cabe a 360 px (RF-13, RF-15, RNF-01, RN-03).
  - Trecho: a dica com o ícone de lâmpada aberta, a armadilha fechada com a seta para baixo, a seção 1 do `Accordion` aberta e as outras fechadas, e o anel de foco no primeiro resumo do painel escuro.
  - Falha: tons iguais exceto pela cor, seta sem girar, duas seções abertas no `Accordion` ou texto cortado a 360 px.
