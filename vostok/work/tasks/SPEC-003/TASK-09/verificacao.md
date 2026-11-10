### Baseline

- `pnpm vitest run src/icons src/toast --reporter=verbose 2>&1 | grep -E '^\s+(✓|×)' | sed -E 's/ [0-9]+ms$//' | sort`
- `pnpm exec tsc --noEmit 2>&1 | grep -E '^(src/icons/|src/toast/)' | sort`
- `pnpm exec eslint src/icons src/toast --max-warnings 0`

### Verificação

```bash
# evidência: testes-callout.txt
pnpm vitest run src/callout --reporter=verbose
test -z "$(pnpm exec tsc --noEmit 2>&1 | grep -E '^(src/callout/)')"
pnpm exec eslint src/callout --max-warnings 0
pnpm exec prettier --check src/callout
test -z "$(grep -nE '#[0-9a-fA-F]{3,8}\b|rgba?\(|[0-9.]+(px|ms)\b|font-weight: *[0-9]|line-height: *[0-9]|z-index: *[0-9]' src/callout/*.module.css | grep -v '@media')"
# evidência: linhas-callout.txt
( set -e; for f in $(ls src/callout/*.ts src/callout/*.tsx src/callout/*.css 2>/dev/null | grep -v '\.test\.'); do n=$(wc -l < "$f"); echo "$n $f"; test "$n" -le 200; done; echo 'OK: arquivos de produção com até 200 linhas' )
```

Resultado esperado: todos com código 0; `testes-callout.txt` com os testes da pasta aprovados e `linhas-callout.txt` terminando em `OK: arquivos de produção com até 200 linhas`.

### Evidências

- `testes-callout.txt` (automática, da verificação)
  - Título: Testes do Callout passam
  - Prova: os seis tons têm fundo suave e o ícone do tom, o ícone pode ser trocado ou removido, a ação fica no fim, `live` liga e desliga o `role="status"`, e tudo passa no axe e em AA nos dois temas (RF-16 a RF-18, CT-16, CT-17, CB-06, RNF-03, RNF-05).
  - Trecho: as linhas `✓` de `renders the accent tone with its soft background and icon` (uma por tom), `accepts a custom icon and removes it with false`, `turns into a polite status only with live="polite"`, `meets AA on every tone in both themes` e o resumo `Tests  N passed` sem `failed`.
  - Falha: linhas com `×`, `FAIL` ou `Tests  N failed`.
- `linhas-callout.txt` (automática, da verificação)
  - Título: Arquivos do Callout com até 200 linhas
  - Prova: cada arquivo de produção da pasta tem no máximo 200 linhas ([project/code-style-08], RNF-08).
  - Trecho: uma linha por arquivo de `src/callout/` e `OK: arquivos de produção com até 200 linhas`.
  - Falha: o comando para num arquivo com mais de 200 linhas, sem a linha `OK`.
- `callout-temas.png` (print): `( set -e; R="$PWD"; D=$(mktemp -d node_modules/.vega-print-XXXX); trap 'rm -rf "$R/$D"' EXIT; printf '%s\n' "import react from '@vitejs/plugin-react';" "export default { root: '$R/$D', base: './', logLevel: 'error', plugins: [react()], build: { outDir: 'out', emptyOutDir: true } };" > "$D/vite.config.mjs"; printf '%s\n' '<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0"><div id="root"></div><script type="module" src="./main.tsx"></script></body></html>' > "$D/index.html"; printf '%s\n' "import '$R/src/theme/fonts.css';" "import '$R/src/theme/tokens.css';" "import { createRoot } from 'react-dom/client';" "import { Callout } from '$R/src/callout/callout';" "import { Button } from '$R/src/button/button';" "const tones = [['neutral', 'Observação', 'Texto neutro dentro da página.'], ['accent', 'No dia a dia', 'Dividir a conta do jantar é uma fração.'], ['info', 'Antes de enviar', 'O texto vai para a IA só com o seu aviso.'], ['success', 'Backup feito', 'Tudo salvo às 14h.'], ['warning', 'Armadilha', 'O enunciado pede a parte, não o todo.'], ['danger', 'Backup antigo', 'O último backup tem 30 dias.']] as const;" "function Panel({ theme, width }: { theme: string; width?: number }) { return (<section data-theme={theme} style={{ flex: width ? 'none' : 1, width, boxSizing: 'border-box', padding: 24, background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--font-body)', display: 'flex', flexDirection: 'column', gap: 12 }}><strong>{theme}{width ? ' · ' + width + ' px' : ''}</strong>{tones.map(([tone, title, text]) => <Callout key={tone} tone={tone} title={title} action={tone === 'danger' ? <Button variant='primary'>Fazer backup</Button> : undefined}>{text}</Callout>)}<Callout tone='info' icon={false}>Sem ícone, só com o texto.</Callout></section>); }" "createRoot(document.getElementById('root')!).render(<div style={{ display: 'flex', alignItems: 'flex-start' }}><Panel theme='light' /><Panel theme='dark' /><Panel theme='light' width={360} /></div>);" "setTimeout(() => { document.querySelectorAll('section')[1]?.querySelector<HTMLButtonElement>('button')?.focus(); }, 300);" > "$D/main.tsx"; pnpm exec vite build --config "$D/vite.config.mjs"; CHROME=$(ls -d "$HOME"/.cache/ms-playwright/chromium-*/chrome-linux64/chrome | sort -V | tail -1); "$CHROME" --headless --disable-gpu --no-sandbox --hide-scrollbars --allow-file-access-from-files --virtual-time-budget=4000 --window-size=1600,1000 --screenshot="$VOSTOK_EVIDENCE/callout-temas.png" "file://$R/$D/out/index.html" )`
  - Título: Callout nos temas claro e escuro
  - Prova: os seis tons se distinguem pelo ícone e pelo título, não só pela cor, nos dois temas e a 360 px; a ação "Fazer backup" fica no fim; o aviso sem ícone mantém o tom (RF-16, RF-17, RNF-01, RN-03).
  - Trecho: os ícones de informação, lâmpada, confere, atenção e alerta, os fundos suaves de cada tom, o botão no aviso de perigo com o anel de foco no painel escuro e o painel de 360 px com a ação abaixo do texto.
  - Falha: tons iguais exceto pela cor, título sem a cor do tom, texto ilegível no tema escuro ou ação cortada a 360 px.
