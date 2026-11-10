### Baseline

- `pnpm vitest run src/icons src/segmented-field --reporter=verbose 2>&1 | grep -E '^\s+(✓|×)' | sed -E 's/ [0-9]+ms$//' | sort`
- `pnpm exec tsc --noEmit 2>&1 | grep -E '^(src/icons/|src/segmented-field/)' | sort`
- `pnpm exec eslint src/icons src/segmented-field --max-warnings 0`

### Verificação

```bash
# evidência: testes-radio.txt
pnpm vitest run src/radio-group --reporter=verbose
test -z "$(pnpm exec tsc --noEmit 2>&1 | grep -E '^(src/radio-group/)')"
pnpm exec eslint src/radio-group --max-warnings 0
pnpm exec prettier --check src/radio-group
test -z "$(grep -nE '#[0-9a-fA-F]{3,8}\b|rgba?\(|[0-9.]+(px|ms)\b|font-weight: *[0-9]|line-height: *[0-9]|z-index: *[0-9]' src/radio-group/*.module.css | grep -v '@media')"
# evidência: linhas-radio.txt
( set -e; for f in $(ls src/radio-group/*.ts src/radio-group/*.tsx src/radio-group/*.css 2>/dev/null | grep -v '\.test\.'); do n=$(wc -l < "$f"); echo "$n $f"; test "$n" -le 200; done; echo 'OK: arquivos de produção com até 200 linhas' )
```

Resultado esperado: todos com código 0; `testes-radio.txt` com os testes da pasta aprovados e `linhas-radio.txt` terminando em `OK: arquivos de produção com até 200 linhas`.

### Evidências

- `testes-radio.txt` (automática, da verificação)
  - Título: Testes do RadioGroup passam
  - Prova: o `RadioGroup` usa `<fieldset>` e rádios nativos, muda pelas setas, seleciona pelo cartão inteiro, respeita `readOnly`, liga ajuda e erro, marca o tom além da cor, passa no axe nas duas variantes e tem AA nos tons (RF-05 a RF-09, CT-05 a CT-09, CB-02, CB-03, RNF-02 a RNF-05).
  - Trecho: as linhas `✓` de `moves the choice with the arrow keys`, `selects by clicking anywhere on the card`, `keeps the choice with readOnly`, `links help and error to the group`, `has no axe violations in both variants`, `meets AA on the tone backgrounds in both themes` e o resumo `Tests  N passed` sem `failed`.
  - Falha: linhas com `×`, `FAIL` ou `Tests  N failed`.
- `linhas-radio.txt` (automática, da verificação)
  - Título: Arquivos do RadioGroup com até 200 linhas
  - Prova: cada arquivo de produção da pasta tem no máximo 200 linhas ([project/code-style-08], RNF-08).
  - Trecho: uma linha `<linhas> src/radio-group/<arquivo>` por arquivo e `OK: arquivos de produção com até 200 linhas`.
  - Falha: o comando para num arquivo com mais de 200 linhas, sem a linha `OK`.
- `radio-temas.png` (print): `( set -e; R="$PWD"; D=$(mktemp -d node_modules/.vega-print-XXXX); trap 'rm -rf "$R/$D"' EXIT; printf '%s\n' "import react from '@vitejs/plugin-react';" "export default { root: '$R/$D', base: './', logLevel: 'error', plugins: [react()], build: { outDir: 'out', emptyOutDir: true } };" > "$D/vite.config.mjs"; printf '%s\n' '<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0"><div id="root"></div><script type="module" src="./main.tsx"></script></body></html>' > "$D/index.html"; printf '%s\n' "import '$R/src/theme/fonts.css';" "import '$R/src/theme/tokens.css';" "import { createRoot } from 'react-dom/client';" "import { useState } from 'react';" "import { RadioGroup } from '$R/src/radio-group/radio-group';" "import { Badge } from '$R/src/badge/badge';" "const opts = [{ value: 'a', marker: 'A', label: 'Dois terços do total' }, { value: 'b', marker: 'B', label: 'Metade do total', description: 'Considere só a parte inteira.' }, { value: 'c', marker: 'C', label: 'Um quarto do total', disabled: true }];" "const answered = [{ value: 'a', marker: 'A', label: 'Dois terços do total', tone: 'success' as const, adornment: <Badge tone='success'>certa</Badge> }, { value: 'b', marker: 'B', label: 'Metade do total', tone: 'danger' as const, adornment: <Badge tone='danger'>sua resposta</Badge> }, { value: 'c', marker: 'C', label: 'Um quarto do total', tone: 'neutral' as const }];" "function Panel({ theme, width }: { theme: string; width?: number }) { const [v, setV] = useState<string | null>('b'); const [w, setW] = useState<string | null>('mensal'); return (<section data-theme={theme} style={{ flex: width ? 'none' : 1, width, boxSizing: 'border-box', padding: 24, background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--font-body)', display: 'flex', flexDirection: 'column', gap: 20 }}><strong>{theme}{width ? ' · ' + width + ' px' : ''}</strong><RadioGroup label='Frequência' options={[{ value: 'mensal', label: 'Mensal' }, { value: 'semanal', label: 'Semanal', description: 'Toda segunda-feira' }]} value={w} onChange={setW} help='Pode ser trocada depois.' /><RadioGroup label='Questão 3' variant='card' options={opts} value={v} onChange={setV} error='Escolha uma alternativa.' /><RadioGroup label='Correção' variant='card' readOnly options={answered} value='b' onChange={() => undefined} /></section>); }" "createRoot(document.getElementById('root')!).render(<div style={{ display: 'flex', alignItems: 'flex-start' }}><Panel theme='light' /><Panel theme='dark' /><Panel theme='light' width={360} /></div>);" "setTimeout(() => { document.querySelectorAll('section')[1]?.querySelector<HTMLInputElement>('input[value=\"a\"]')?.focus(); }, 300);" > "$D/main.tsx"; pnpm exec vite build --config "$D/vite.config.mjs"; CHROME=$(ls -d "$HOME"/.cache/ms-playwright/chromium-*/chrome-linux64/chrome | sort -V | tail -1); "$CHROME" --headless --disable-gpu --no-sandbox --hide-scrollbars --allow-file-access-from-files --virtual-time-budget=4000 --window-size=1600,1100 --screenshot="$VOSTOK_EVIDENCE/radio-temas.png" "file://$R/$D/out/index.html" )`
  - Título: RadioGroup nos temas claro e escuro
  - Prova: as variantes `default` e `card` se distinguem nos dois temas e a 360 px; a seleção aparece com borda, fundo e ícone de confere; a correção mostra o tom certo e o errado com ícone e selo, não só pela cor; o erro aparece abaixo do grupo (RF-06, RF-07, RF-09, RNF-01, RN-03).
  - Trecho: o cartão `B` marcado com borda `primary` e confere, o `C` desabilitado, os cartões da correção com fundo verde e vermelho suave e ícones, o anel de foco no painel escuro e o painel de 360 px sem rolagem horizontal.
  - Falha: seleção só pela cor, cartão cortado a 360 px, foco invisível ou texto ilegível no tema escuro.
