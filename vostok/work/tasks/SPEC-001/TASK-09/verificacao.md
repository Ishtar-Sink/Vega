### Baseline

- `pnpm vitest run src/button --reporter=verbose 2>&1 | grep -E '^\s+(✓|×)' | sed -E 's/ [0-9]+ms$//' | sort`
- `pnpm exec tsc --noEmit 2>&1 | grep -E '^(src/button/)' | sort`
- `pnpm exec eslint src/button --max-warnings 0`

### Verificação

```bash
# evidência: testes-dialogos.txt
pnpm vitest run src/dialog src/confirm-dialog src/toast --reporter=verbose
test -z "$(pnpm exec tsc --noEmit 2>&1 | grep -E '^(src/dialog/|src/confirm-dialog/|src/toast/)')"
pnpm exec eslint src/dialog src/confirm-dialog src/toast --max-warnings 0
pnpm exec prettier --check src/dialog src/confirm-dialog src/toast
test -z "$(grep -nE '#[0-9a-fA-F]{3,8}\b|rgba?\(|[0-9.]+(px|ms)\b|font-weight: *[0-9]|line-height: *[0-9]|z-index: *[0-9]' src/dialog/*.module.css src/confirm-dialog/*.module.css src/toast/*.module.css | grep -v '@media')"
```

### Evidências

- `testes-dialogos.txt` (automática, da verificação)
  - Título: Testes de diálogos e avisos passam
  - Prova: `Dialog`, `ConfirmDialog`, `Toast` e `ToastRegion` passam nos testes de papel e nome acessível, axe, teclado (Tab preso, Esc, Enter), `<dialog>` nativo com `showModal()`, props nativas, textos padrão e sobrescritos e tom marcado além da cor (RF-14, RF-19, RF-20, CT-09, CT-12, CT-13).
  - Trecho: as linhas `✓` de `opens with the native showModal`, `traps Tab inside the dialog`, `uses Confirmar and Cancelar by default`, `accepts overridden labels`, `marks the tone with an icon and a hidden name, not only the color`, `passes className, style and data attributes to the dialog` e o resumo `Tests  N passed` sem `failed`.
  - Falha: linhas com `×`, `FAIL` ou `Tests  N failed`, ou erro `showModal is not a function`.
  - Requer: `src/dialog/dialog.test.tsx`, `src/confirm-dialog/confirm-dialog.test.tsx`, `src/toast/toast.test.tsx`
- `dialogos-temas.png` (print): `( set -e; R="$PWD"; D=$(mktemp -d node_modules/.vega-print-XXXX); trap 'rm -rf "$R/$D"' EXIT; printf '%s\n' "import react from '@vitejs/plugin-react';" "export default { root: '$R/$D', base: './', logLevel: 'error', plugins: [react()], build: { outDir: 'out', emptyOutDir: true } };" > "$D/vite.config.mjs"; printf '%s\n' '<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0"><div id="root"></div><script type="module" src="./main.tsx"></script></body></html>' > "$D/index.html"; printf '%s\n' "import '$R/src/theme/fonts.css';" "import '$R/src/theme/tokens.css';" "import { createRoot } from 'react-dom/client';" "import { useState } from 'react';" "import { Dialog } from '$R/src/dialog/dialog';" "import { ConfirmDialog } from '$R/src/confirm-dialog/confirm-dialog';" "import { Toast, ToastRegion } from '$R/src/toast/toast';" "import { Button } from '$R/src/button/button';" "const q = new URLSearchParams(location.search); const theme = q.get('theme'); const view = q.get('view') ?? '';" "const toasts = [{ tone: 'info', text: 'Sincronização agendada' }, { tone: 'success', text: 'Item salvo' }, { tone: 'warning', text: 'Espaço quase cheio' }, { tone: 'danger', text: 'Falha ao salvar' }] as const;" "function Scene({ theme, view }: { theme: string; view: string }) { return (<main data-theme={theme} style={{ padding: 24, minHeight: '100vh', boxSizing: 'border-box', background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--font-body)' }}><h1>{theme} · {view}</h1><p>Conteúdo da página por trás, para mostrar o fundo escurecido.</p>{view === 'confirm' ? <ConfirmDialog open title=\"Excluir item?\" description=\"Esta ação não pode ser desfeita.\" onConfirm={() => undefined} onCancel={() => undefined} /> : null}{view === 'wide' ? <Dialog open size=\"wide\" title=\"Detalhes do item\" onClose={() => undefined} actions={<Button variant=\"primary\">Fechar</Button>}><p>Conteúdo do diálogo largo, com espaço para uma tabela ou um formulário de duas colunas.</p></Dialog> : null}{view === 'toasts' ? <ToastRegion>{toasts.map((t) => <Toast key={t.tone} tone={t.tone}>{t.text}</Toast>)}</ToastRegion> : null}</main>); }" "const frames = ['confirm', 'wide', 'toasts'].flatMap((v) => ['light', 'dark'].map((t) => ({ v, t })));" "function Frames() { return (<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>{frames.map(({ v, t }) => <iframe key={v + t} id={v === 'confirm' && t === 'dark' ? 'foco' : undefined} title={t + ' ' + v} src={'?theme=' + t + '&view=' + v} style={{ width: '100%', height: 520, border: 0 }} />)}</div>); }" "if (theme) { document.documentElement.dataset.theme = theme; document.body.style.background = 'var(--bg)'; createRoot(document.getElementById('root')!).render(<Scene theme={theme} view={view} />); } else { createRoot(document.getElementById('root')!).render(<Frames />); setTimeout(() => { document.querySelector<HTMLIFrameElement>('#foco')?.contentWindow?.focus(); }, 1500); }" > "$D/main.tsx"; pnpm exec vite build --config "$D/vite.config.mjs"; CHROME=$(ls -d "$HOME"/.cache/ms-playwright/chromium-*/chrome-linux64/chrome | sort -V | tail -1); "$CHROME" --headless --disable-gpu --no-sandbox --hide-scrollbars --allow-file-access-from-files --virtual-time-budget=5000 --window-size=1400,1560 --screenshot="$VOSTOK_EVIDENCE/dialogos-temas.png" "file://$R/$D/out/index.html" )`
  - Título: Diálogos e avisos nos temas claro e escuro
  - Prova: o diálogo modal cobre a página com o fundo do tema, o foco fica visível e os quatro tons do aviso se distinguem pelo ícone, não só pela cor (RF-14, CT-09, RN-04, RN-05).
  - Trecho: o fundo escurecido atrás do diálogo, o anel de foco em `Cancelar` no painel escuro (o foco só fica num elemento por vez), os ícones de informação, sucesso, atenção e erro e os fundos `*-soft` dos avisos.
  - Falha: diálogo sem fundo escurecido, foco invisível, avisos iguais exceto pela cor ou texto ilegível no tema escuro.
