### Ler

- `vostok/work/specs/refined/SPEC-003-lote-1-de-componentes-para-o-synestia.md` (RF-28 a RF-35, CT-25 a CT-32, CB-10, CB-11, RNF-01, RNF-02, RNF-04, "Contratos e interfaces": navegação)
- `vostok/work/tasks/SPEC-003/TASK-14/tecnico.md` (decisões D-01 a D-09)
- `docs/KT-001-vega-lote-1.md` (seção "9. `AppShell`, `Sidebar`, `BottomNav` e `Topbar`")
- `../atria/apps/web/src/app/layout/app-layout.tsx` (gaveta, `useDrawerMode`, foco de volta ao botão, link de pular)
- `../atria/apps/web/src/app/layout/sidebar.tsx` (fn `Sidebar`: `onKeyDown`, `inert`, foco no primeiro item ao abrir)
- `../atria/apps/web/src/app/layout/topbar.tsx` (botão de menu com `aria-expanded` e `aria-controls`)
- `../atria/apps/web/src/app/layout/app-layout.module.css` (blocos `.skipLink`, `.sidebar`, `.navLink`, `.scrim` e `@media (max-width: 719.98px)`)
- `../atria/apps/web/src/app/layout/app-layout.test.tsx` (teste `toggles the drawer below 720 px with an accessible button`)
- `src/icon-button/icon-button.tsx` (botão de menu)
- `src/icons/interface-icons.tsx` (`MenuIcon`, criado pela TASK-02)
- `src/dialog/dialog.tsx` (padrão de foco preso e de foco devolvido)
- `src/theme/tokens.ts` (`breakpoints.md`) e `src/theme/tokens.css` (cores, `--s*`, `--z-*`, `--motion-*` e o bloco de movimento reduzido)
- `src/card/card.tsx` e `src/card/card.test.tsx` (padrão de props nativas e de teste de `className`, `style` e `data-*`)

### Mudar

- `src/app-shell/nav.types.ts` (criar): `NavItem` e `RenderNavLink`, compartilhados pelas peças (RF-35).
- `src/app-shell/nav-link.tsx` (criar): `NavLink` interno: usa o `renderLink` do produto ou um `<a href>` simples, com ícone, rótulo e `badge` (RF-35, CB-11).
- `src/app-shell/app-shell.constants.ts` (criar): rótulos padrão em pt-br (`Principal`, `Pular para o conteúdo`, `Abrir menu`), `COMPACT_QUERY` a partir de `breakpoints.md` e o seletor de elementos focáveis.
- `src/app-shell/use-media-query.ts` (criar): hook `useMediaQuery(query)` sobre `window.matchMedia`, com assinatura de mudança (RF-33).
- `src/app-shell/use-focus-trap.ts` (criar): hook `useFocusTrap(ref, active, onEscape)`: foco no primeiro item ao ativar, Tab preso e Escape (RF-29).
- `src/app-shell/sidebar.types.ts` (criar): `SidebarProps` (contrato da spec).
- `src/app-shell/sidebar.tsx` (criar): `Sidebar`: marca, `<nav>` nomeada, itens com `aria-current` e rodapé; no modo gaveta, foco preso, Escape e `inert` (RF-28, RF-29).
- `src/app-shell/sidebar.module.css` (criar): estilos da `Sidebar` e da gaveta, com transição em `--motion-base`.
- `src/app-shell/sidebar.test.tsx` (criar): testes da `Sidebar` (CT-25, CT-26, CT-32).
- `src/app-shell/bottom-nav.types.ts` (criar): `BottomNavProps` (contrato da spec).
- `src/app-shell/bottom-nav.tsx` (criar): `BottomNav`: barra inferior com 3 a 5 destinos de ícone e rótulo, `badge` e aviso fora do intervalo (RF-30, CB-10).
- `src/app-shell/bottom-nav.module.css` (criar): barra fixa de 56 px mais a área segura, alvos de 44 px, escondida a partir de 721 px.
- `src/app-shell/bottom-nav.test.tsx` (criar): testes da `BottomNav` (CT-27, CB-10).
- `src/app-shell/topbar.types.ts` (criar): `TopbarProps` (contrato da spec).
- `src/app-shell/topbar.tsx` (criar): `Topbar`: `<header>` com os slots `start`, `center` e `end` (RF-31).
- `src/app-shell/topbar.module.css` (criar): estilos da `Topbar`.
- `src/app-shell/topbar.test.tsx` (criar): testes da `Topbar` (CT-28).
- `src/app-shell/app-shell.types.ts` (criar): `AppShellProps` (contrato da spec).
- `src/app-shell/app-shell.tsx` (criar): `AppShell`: link de pular, `Sidebar` ou gaveta ou `BottomNav` conforme `mobileNav` e a largura, `Topbar`, `<main>` e `hideNavigation` (RF-32, RF-33, RF-34).
- `src/app-shell/app-shell.module.css` (criar): grade do `AppShell`, link de pular, fundo da gaveta e o espaço reservado da `BottomNav`.
- `src/app-shell/app-shell.test.tsx` (criar): testes do `AppShell` (CT-29, CT-30, CT-31, CB-11).

### Passos

Regras comuns a todos os passos (decididas em `tecnico.md`):

- Nenhum arquivo de produção passa de 200 linhas, e cada um tem um único contexto ([project/code-style-08], [project/code-style-09]). Imports relativos: `../icons/interface-icons`, `../icon-button/icon-button`, `../theme/tokens`.
- Props nativas: cada peça estende as props do próprio elemento raiz (`aside`, `nav`, `header` e `div`). `className` (somado à classe do módulo), `style`, `ref` e `...rest` vão à raiz. JSDoc em pt-br em cada prop pública. Textos visíveis por `labels?: Partial<...>`, mesclados com os padrões de `app-shell.constants.ts` ([project/language-06]).
- CSS só com tokens. 56 px vira `calc(var(--space) * 14)`, 44 px vira `calc(var(--space) * 11)`, e a área segura usa `env(safe-area-inset-bottom)`. A troca de layout é `@media (max-width: 719.98px)`, o mesmo corte de `breakpoints.md` e do restante da Vega. Transições só com `--motion-*`: o `tokens.css` já as zera com `prefers-reduced-motion`. Camadas com `--z-*`.
- Nada do Atria fica no código: nem roteador, nem `useT`, nem sessão, nem `paletteFor` ([project/architecture-04]).
- Nos testes do `AppShell`, o `window.matchMedia` é falsificado no próprio arquivo, com `vi.stubGlobal`, por uma função `setCompact(boolean)` que avisa os ouvintes dentro de `act`. O jsdom não implementa o `matchMedia`, e o `src/test/setup.ts` não muda.

1. `src/app-shell/sidebar.test.tsx`, `src/app-shell/bottom-nav.test.tsx`, `src/app-shell/topbar.test.tsx` e `src/app-shell/app-shell.test.tsx` (criar), antes do código. Os itens de teste são quatro `NavItem` (`inicio` atual, `estudar`, `revisar` com `badge="3"`, `simulados`), com ícones de `../icons/interface-icons`.
   - `sidebar.test.tsx`:
     - `it('shows the brand, the Principal navigation and the footer')` (CT-25): `<nav>` com nome `Principal`, `aria-current="page"` só no item atual, a marca e o rodapé.
     - `it('accepts another navigation label')`.
     - `it('traps the focus in the open drawer and closes with Escape')` (CT-26): `drawer open onClose={spy}`. Com `user.tab()` a partir do último item, o foco volta ao primeiro; Escape chama `spy`.
     - `it('is inert while the drawer is closed')`: `drawer open={false}` tem o atributo `inert`.
     - `it('closes the drawer when a link is chosen')`.
     - `it('renders links with renderLink and falls back to anchors')` (CT-32): com `renderLink` de teste, o link recebe `className` e `aria-current`; sem ele, cada item é um `<a href>`.
     - `it('has no axe violations')`, `it('passes className, style and data attributes to the root')` e `it('forwards the ref to the root')`.
   - `bottom-nav.test.tsx`:
     - `it('shows icon and label for every destination')` (CT-27): cada link tem o rótulo visível e um `svg` com `aria-hidden`; `aria-current` no atual; o selo `3`.
     - `it('warns when there are fewer than 3 or more than 5 items')` (CB-10): `vi.spyOn(console, 'warn')` chamado com 2 e com 6 itens, e não chamado com 4.
     - `it('is fixed at the bottom with the safe area and hides from 721 px')`: lê `bottom-nav.module.css` e confere `position: fixed`, `calc(var(--space) * 14)`, `env(safe-area-inset-bottom)`, `min-height: calc(var(--space) * 11)` nos links e o `@media (min-width: 721px)` com `display: none` (RNF-02).
     - `it('has no axe violations')`, props nativas e `ref`.
   - `topbar.test.tsx`:
     - `it('renders the start, center and end slots in the header')` (CT-28): papel `banner` com os três slots.
     - props nativas e `ref`.
   - `app-shell.test.tsx`:
     - `it('focuses the skip link first and leads to the main')` (CT-29): o primeiro `user.tab()` foca `Pular para o conteúdo`, cujo `href` aponta para o `id` do `<main>`.
     - `it('shows the sidebar on wide screens')`: `setCompact(false)`, `<nav>` `Principal` sem o atributo `inert` e sem botão `Abrir menu`.
     - `it('opens the drawer with the menu button and returns the focus on Escape')` (CT-30): com `setCompact(true)` e `mobileNav="drawer"`, o botão `Abrir menu` tem `aria-expanded="false"` e `aria-controls` com o `id` da `Sidebar`. O clique muda para `true` e o foco vai ao primeiro item. Escape volta a `false`, e o foco volta ao botão.
     - `it('uses the bottom navigation on narrow screens')` (CT-30): com `setCompact(true)` e `mobileNav="bottom"`, a `BottomNav` aparece, sem `Sidebar` e sem botão de menu. Com `setCompact(false)`, volta a `Sidebar`.
     - `it('reserves the space of the bottom navigation')`: lê `app-shell.module.css` e confere o `padding-bottom` com `calc(var(--space) * 14)` e `env(safe-area-inset-bottom)` dentro de `@media (max-width: 719.98px)`.
     - `it('hides the navigation and keeps the main')` (CT-31): com `hideNavigation`, nenhum `navigation`, nenhum botão de menu e o `main` com o conteúdo.
     - `it('renders anchors without renderLink')` (CB-11).
     - `it('has no axe violations')` e props nativas na raiz.

   Rode `pnpm vitest run src/app-shell`. Confira: os quatro arquivos falham porque os módulos não existem.
2. `src/app-shell/nav.types.ts`, `src/app-shell/sidebar.types.ts`, `src/app-shell/bottom-nav.types.ts`, `src/app-shell/topbar.types.ts` e `src/app-shell/app-shell.types.ts` (criar): os tipos exatamente como os contratos da spec, com JSDoc.

   `src/app-shell/app-shell.constants.ts` (criar):
   - `DEFAULT_NAV_LABELS = { navigation: 'Principal' }` e `DEFAULT_APP_SHELL_LABELS = { skipToContent: 'Pular para o conteúdo', openMenu: 'Abrir menu' }`.
   - `COMPACT_QUERY = \`(max-width: ${String(breakpoints.md)}px)\``.
   - `FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'`.

   Confira: `pnpm exec tsc --noEmit 2>&1 | grep -E '^src/app-shell/(nav|sidebar|bottom-nav|topbar|app-shell)\.types'` não imprime nada.
3. `src/app-shell/use-media-query.ts` (criar): `useMediaQuery(query: string): boolean`, com estado inicial `window.matchMedia(query).matches` e assinatura de `change` num efeito, como o `useDrawerMode` do Atria.

   `src/app-shell/use-focus-trap.ts` (criar): `useFocusTrap(ref, active, onEscape)` devolve um `onKeyDown`.
   - Com `active`, um efeito foca o primeiro elemento de `FOCUSABLE` dentro de `ref`.
   - O `onKeyDown`, só com `active`: Escape chama `onEscape`; Tab no último elemento volta ao primeiro; Shift+Tab no primeiro vai ao último. O mesmo algoritmo do `onKeyDown` da `Sidebar` do Atria.

   `src/app-shell/nav-link.tsx` (criar): `NavLink({ item, className, renderLink })` monta os `children`: ícone num `<span aria-hidden="true">`, rótulo num `<span>` e o `badge` opcional. Depois chama `renderLink(item, { className, 'aria-current': item.current ? 'page' : undefined, children })` ou, sem `renderLink`, devolve `<a href={item.href} className={className} aria-current={...}>{children}</a>`.

   Confira: `pnpm exec tsc --noEmit` sem erros nesses três arquivos.
4. `src/app-shell/topbar.tsx` e `src/app-shell/topbar.module.css` (criar): `<header>` com três `<div>` (`start`, `center`, `end`), alinhados em `display: flex` com `gap: var(--s3)`, `position: sticky`, `top: 0`, fundo `var(--bg-elevated)` e borda inferior em `var(--border)`. Confira: `pnpm vitest run src/app-shell/topbar.test.tsx` passa.
5. `src/app-shell/sidebar.tsx` e `src/app-shell/sidebar.module.css` (criar):
   - Raiz `<aside>` com `inert={drawer && !open}` e o `onKeyDown` do `useFocusTrap(ref, Boolean(drawer && open), onClose)`, composto com o `onKeyDown` recebido.
   - Dentro: a `brand`; `<nav aria-label={labels.navigation}>` com `<ul>` de `NavLink`; o `footer`.
   - Um `onClick` na `<nav>` chama `onClose` quando o clique vem de dentro de um `a` e a gaveta está aberta. A linha leva um `// eslint-disable-next-line` com o porquê, como no Atria: o teclado já fecha pelo Escape.
   - O ref recebido é ligado ao ref interno por `useImperativeHandle`, como no `Dialog`.
   - CSS: `position: sticky` com `height: 100dvh` no modo normal. A classe `.drawer` é `position: fixed`, com `transform: translateX(-100%)`, `transition: transform var(--motion-base) var(--motion-ease-standard)` e `z-index: var(--z-popover)`; `.drawerOpen` volta o `transform` a `none`. Os links têm `min-height: calc(var(--space) * 11)`, e o item atual tem fundo `var(--primary-soft)`, cor `var(--primary)` e peso `var(--font-weight-semibold)`, para não depender só da cor ([project/theme-06]).

   Confira: `pnpm vitest run src/app-shell/sidebar.test.tsx` passa.
6. `src/app-shell/bottom-nav.tsx` e `src/app-shell/bottom-nav.module.css` (criar):
   - Raiz `<nav aria-label={labels.navigation}>` com `<ul>` de `NavLink`.
   - Um `useEffect` chama `console.warn('BottomNav: use de 3 a 5 destinos; recebeu N.')` quando `items.length < 3 || items.length > 5`, só se `typeof process === 'undefined' || process.env.NODE_ENV !== 'production'`.
   - CSS:
     - `position: fixed`, `inset: auto 0 0 0` e `z-index: var(--z-dropdown)`.
     - `min-height: calc(var(--space) * 14)` e `padding-bottom: env(safe-area-inset-bottom)`.
     - Os itens em grade de colunas iguais; cada link com ícone e rótulo empilhados, `min-height: calc(var(--space) * 11)` e o atual com cor `var(--primary)` e um traço superior.
     - `@media (min-width: 721px) { .root { display: none; } }`.

   Confira: `pnpm vitest run src/app-shell/bottom-nav.test.tsx` passa.
7. `src/app-shell/app-shell.tsx` e `src/app-shell/app-shell.module.css` (criar):
   - `compact = useMediaQuery(COMPACT_QUERY)`; `drawerMode = compact && mobileNav === 'drawer'`; `bottomMode = compact && mobileNav === 'bottom'`; `open` em estado local.
   - O botão de menu (`IconButton` com `MenuIcon`, `aria-label={labels.openMenu}`, `aria-expanded={open}` e `aria-controls={sidebarId}`, de `useId`) guarda o próprio ref.
   - Ao fechar, `setOpen(false)` e foco de volta ao botão.
   - Ao sair do modo compacto, `open` volta a `false` num efeito.
   - Renderização, em ordem:
     1. O link de pular (`<a href={'#' + mainId}>`), só sem `hideNavigation`.
     2. Sem `hideNavigation` e fora do `bottomMode`, a `Sidebar` com `{...sidebar}`, `id={sidebarId}`, `drawer={drawerMode}`, `open={drawerMode && open}` e `onClose`.
     3. O fundo da gaveta aberta: `<div className={styles.scrim} aria-hidden="true" onClick={close} />`, com `// eslint-disable-next-line` e o porquê (o teclado fecha pelo Escape).
     4. A coluna com a `Topbar` (`{...topbar}` e o botão de menu antes do `start`, só no `drawerMode`), renderizada quando há `topbar` ou `drawerMode`.
     5. O `<main id={mainId} tabIndex={-1}>` com os `children`.
     6. A `BottomNav`, no `bottomMode` sem `hideNavigation`, com os `items` e o `renderLink` da `sidebar`.
   - Raiz `<div>` com `data-mobile-nav={mobileNav}`.
   - CSS:
     - `.root` em grade de duas colunas (barra lateral e conteúdo).
     - `.skipLink` fora da tela até o `:focus-visible`.
     - `.scrim` em `position: fixed`, `inset: 0`, fundo `var(--bg)` com `opacity` e `z-index: var(--z-dropdown)`.
     - Dentro de `@media (max-width: 719.98px)`: uma coluna, e `.root[data-mobile-nav='bottom'] .main` com `padding-bottom: calc(calc(var(--space) * 14) + env(safe-area-inset-bottom))`.

   Confira: `pnpm vitest run src/app-shell` passa.
8. Pasta da tarefa: rode `pnpm exec prettier --write src/app-shell` e depois a Verificação inteira. Confira: todos os comandos terminam com código 0, e o print `navegacao-telas.png` mostra a `Sidebar` no computador, a `BottomNav` e a gaveta a 360 px.
