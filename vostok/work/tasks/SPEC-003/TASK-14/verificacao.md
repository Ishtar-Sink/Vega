### Baseline

- `pnpm vitest run src/icons src/icon-button --reporter=verbose 2>&1 | grep -E '^\s+(✓|×)' | sed -E 's/ [0-9]+ms$//' | sort`
- `pnpm exec tsc --noEmit 2>&1 | grep -E '^(src/icons/|src/icon-button/)' | sort`
- `pnpm exec eslint src/icons src/icon-button --max-warnings 0`

### Verificação

```bash
# evidência: testes-navegacao.txt
pnpm vitest run src/app-shell --reporter=verbose
test -z "$(pnpm exec tsc --noEmit 2>&1 | grep -E '^src/app-shell/')"
pnpm exec eslint src/app-shell --max-warnings 0
pnpm exec prettier --check src/app-shell
test -z "$(grep -nE '#[0-9a-fA-F]{3,8}\b|rgba?\(|[0-9.]+(px|ms)\b|font-weight: *[0-9]|line-height: *[0-9]|z-index: *[0-9]' src/app-shell/*.module.css | grep -v '@media')"
# evidência: navegacao-estrutura.txt
( for f in $(ls src/app-shell/*.ts src/app-shell/*.tsx src/app-shell/*.css | grep -v '\.test\.'); do n=$(wc -l < "$f"); echo "$f: $n linhas"; [ "$n" -le 200 ] || { echo "ERRO: $f passa de 200 linhas"; exit 1; }; done; if grep -rnE "@tanstack|useT\(|paletteFor|useCurrentUser|signOut" src/app-shell; then echo 'ERRO: código do Atria no app-shell'; exit 1; fi; echo 'OK: arquivos do app-shell com até 200 linhas e sem roteador, tradução, sessão nem paleta do Atria' )
```

Resultado esperado: todos com código 0. `testes-navegacao.txt` com os testes das quatro peças aprovados; `navegacao-estrutura.txt` com cada arquivo de produção com até 200 linhas e a linha `OK: ...`.

### Evidências

- `testes-navegacao.txt` (automática, da verificação)
  - Título: Testes do AppShell e da navegação passam
  - Prova: `Sidebar`, `BottomNav`, `Topbar` e `AppShell` passam nos testes de papel e nome acessível, axe, foco preso na gaveta, Escape com foco devolvido, troca em 720 px, `hideNavigation`, `renderLink` e `<a>` simples, e props nativas (RF-28 a RF-35, CT-25 a CT-32, CB-10, CB-11).
  - Trecho: as linhas `✓` de `traps the focus in the open drawer and closes with Escape`, `opens the drawer with the menu button and returns the focus on Escape`, `uses the bottom navigation on narrow screens`, `hides the navigation and keeps the main`, `renders links with renderLink and falls back to anchors`, `focuses the skip link first and leads to the main` e o resumo `Tests  N passed` sem `failed`.
  - Falha: linhas com `×`, `FAIL` ou `Tests  N failed`.
- `navegacao-estrutura.txt` (automática, da verificação)
  - Título: Navegação em arquivos curtos e sem código do Atria
  - Prova: os arquivos de produção do `src/app-shell` têm até 200 linhas, e o componente não traz roteador, tradução, sessão nem a paleta do Atria (RNF-08, RN-01).
  - Trecho: uma linha `src/app-shell/<arquivo>: N linhas` por arquivo, com N até 200, e `OK: arquivos do app-shell com até 200 linhas e sem roteador, tradução, sessão nem paleta do Atria`.
  - Falha: `ERRO: ... passa de 200 linhas` ou `ERRO: código do Atria no app-shell`, com a linha encontrada.
- `navegacao-telas.png` (print): `( set -e; R="$PWD"; D=$(mktemp -d node_modules/.vega-print-XXXX); trap 'rm -rf "$R/$D"' EXIT; printf '%s\n' "import react from '@vitejs/plugin-react';" "export default { root: '$R/$D', base: './', logLevel: 'error', plugins: [react()], build: { outDir: 'out', emptyOutDir: true } };" > "$D/vite.config.mjs"; printf '%s\n' '<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0"><div id="root"></div><script type="module" src="./main.tsx"></script></body></html>' > "$D/index.html"; printf '%s\n' "import '$R/src/theme/fonts.css';" "import '$R/src/theme/tokens.css';" "import { createRoot } from 'react-dom/client';" "import { AppShell } from '$R/src/app-shell/app-shell';" "import { BrandLogo } from '$R/src/brand-logo/brand-logo';" "import { Button } from '$R/src/button/button';" "import { HomeIcon, BookOpenIcon, LayersIcon, TimerIcon, SettingsIcon } from '$R/src/icons/interface-icons';" "const mode = new URLSearchParams(location.search).get('m');" "const items = [{ id: 'inicio', label: 'Início', icon: <HomeIcon />, href: '#inicio', current: true }, { id: 'estudar', label: 'Estudar', icon: <BookOpenIcon />, href: '#estudar' }, { id: 'revisar', label: 'Revisar', icon: <LayersIcon />, href: '#revisar', badge: '3' }, { id: 'simulados', label: 'Simulados', icon: <TimerIcon />, href: '#simulados' }];" "const mark = <svg viewBox='0 0 24 24' width='20' height='20' fill='none' stroke='currentColor' strokeWidth='2'><circle cx='12' cy='12' r='8' /></svg>;" "function Shell({ mobileNav }: { mobileNav: 'drawer' | 'bottom' }) { return (<AppShell mobileNav={mobileNav} sidebar={{ brand: <BrandLogo name='Synestia' mark={mark} />, items, footer: <Button><SettingsIcon /> Ajustes</Button> }} topbar={{ center: <strong>Início</strong>, end: <Button variant='primary'>Estudar agora</Button> }}><div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}><h1 style={{ margin: 0, fontFamily: 'var(--font-display)' }}>Bom dia</h1>{Array.from({ length: 8 }, (_, i) => <p key={i} style={{ margin: 0 }}>Conteúdo da página, linha {i + 1}.</p>)}</div></AppShell>); }" "if (mode) { document.documentElement.dataset.theme = mode === 'bottom' ? 'dark' : 'light'; document.body.style.background = 'var(--bg)'; document.body.style.color = 'var(--text)'; document.body.style.fontFamily = 'var(--font-body)'; createRoot(document.getElementById('root')!).render(<Shell mobileNav={mode === 'bottom' ? 'bottom' : 'drawer'} />); if (mode === 'drawer') setTimeout(() => { document.querySelector<HTMLButtonElement>('[aria-controls]')?.click(); }, 300); } else { document.documentElement.dataset.theme = 'light'; document.body.style.fontFamily = 'var(--font-body)'; createRoot(document.getElementById('root')!).render(<div style={{ display: 'flex', alignItems: 'flex-start' }}><div style={{ width: 1240, height: 900, overflow: 'hidden', background: 'var(--bg)', color: 'var(--text)', transform: 'translateZ(0)' }}><Shell mobileNav='drawer' /></div><iframe title='360 px · barra inferior' src='?m=bottom' style={{ width: 360, height: 900, border: 0, flex: 'none' }} /><iframe title='360 px · gaveta' src='?m=drawer' style={{ width: 360, height: 900, border: 0, flex: 'none' }} /></div>); }" > "$D/main.tsx"; pnpm exec vite build --config "$D/vite.config.mjs"; CHROME=$(ls -d "$HOME"/.cache/ms-playwright/chromium-*/chrome-linux64/chrome | sort -V | tail -1); "$CHROME" --headless --disable-gpu --no-sandbox --hide-scrollbars --allow-file-access-from-files --virtual-time-budget=5000 --window-size=1960,900 --screenshot="$VOSTOK_EVIDENCE/navegacao-telas.png" "file://$R/$D/out/index.html" )`
  - Título: AppShell no computador e no celular
  - Prova: no computador, a `Sidebar` com a marca, o item atual destacado e o selo. A 360 px, a `BottomNav` no tema escuro, com ícone e rótulo em todos os destinos e o conteúdo sem ficar atrás dela, e a gaveta aberta no tema claro, sobre o fundo escurecido (RF-28, RF-30, RF-33, RNF-01).
  - Trecho: o painel largo à esquerda com a barra lateral e a `Topbar`; o painel de 360 px do meio com a barra inferior de quatro destinos e o selo `3` em `Revisar`; o painel de 360 px da direita com a gaveta aberta e o foco no primeiro item.
  - Falha: barra lateral e barra inferior juntas na mesma largura, destino só com ícone, conteúdo coberto pela barra inferior, gaveta fechada ou cores iguais nos dois temas.
