<!-- Escrito no planejamento com o que a tarefa vai fazer e enriquecido na conclusão com o que foi feito. -->

## Abordagem

TDD ([project/development-methodology-01]): primeiro os quatro arquivos de teste, vistos falhando, depois as peças de baixo para cima: tipos e constantes, hooks e `NavLink`, `Topbar`, `Sidebar`, `BottomNav` e por fim o `AppShell`. A base é o `apps/web/src/app/layout/` do Atria. Dele vêm a gaveta, o foco preso, o Escape, o `inert`, o foco devolvido ao botão de menu e o link de pular. Na extração saem o `Link` do TanStack (vira `renderLink`), o `useT` (vira `labels`), a sessão, o menu de conta, o tema e o `paletteFor` (viram o slot `footer`). A `BottomNav` é nova.

Arquivos em `src/app-shell/`, um contexto por arquivo ([project/code-style-09]):

| Peça | Arquivos |
|---|---|
| tipos compartilhados | `nav.types.ts` |
| link interno | `nav-link.tsx` |
| constantes | `app-shell.constants.ts` |
| hooks | `use-media-query.ts`, `use-focus-trap.ts` |
| `Topbar` | `topbar.tsx`, `topbar.types.ts`, `topbar.module.css`, `topbar.test.tsx` |
| `Sidebar` | `sidebar.tsx`, `sidebar.types.ts`, `sidebar.module.css`, `sidebar.test.tsx` |
| `BottomNav` | `bottom-nav.tsx`, `bottom-nav.types.ts`, `bottom-nav.module.css`, `bottom-nav.test.tsx` |
| `AppShell` | `app-shell.tsx`, `app-shell.types.ts`, `app-shell.module.css`, `app-shell.test.tsx` |

## Decisões

| # | Decisão | Alternativas descartadas | Critério de escolha |
|---|---|---|---|
| D-01 | O `AppShell` controla a gaveta (estado `open` e foco devolvido ao botão), e a `Sidebar` é controlada por `drawer`, `open` e `onClose`. | (a) Estado da gaveta dentro da `Sidebar`. (b) O produto sempre controla. | O contrato da spec já separa `SidebarProps` (controlada) de `AppShellProps` (sem `drawer`/`open`/`onClose`). Quem usa só as peças controla; quem usa o `AppShell` não precisa. |
| D-02 | A largura é detectada por `useMediaQuery('(max-width: 719.98px)')` (abaixo de 720 px, como o RF-33; a partir de 720 px vale o desktop, o mesmo corte do `min-width: 720px` do BottomSheet), a partir de `breakpoints.md`, e o CSS repete o corte em `@media (max-width: 719.98px)`. | Só CSS (esconder e mostrar). | O modo gaveta precisa de JS (`inert`, foco preso, botão com `aria-expanded`), e renderizar só uma navegação evita duas `<nav>` "Principal" na página. A partir de 720 px vale o desktop, como no `BottomSheet` (`min-width: 720px`), e os dois trocam no mesmo pixel. Ver Pontos de atenção sobre o `PageHeader`. |
| D-03 | Foco preso da gaveta por um hook próprio (`useFocusTrap`), com o algoritmo do Atria. | Tornar a gaveta um `<dialog>` modal. | A `Sidebar` é a mesma `<aside>` no computador, onde é uma região fixa e não um diálogo. Trocar o elemento conforme a largura quebraria o `ref` e o estilo. |
| D-04 | Fundo da gaveta como `<div aria-hidden="true">` com `onClick` e um `eslint-disable` justificado. | Botão com `aria-label` "Fechar menu", como no Atria. | O contrato fixa `labels` em `skipToContent` e `openMenu`. Um botão exigiria um rótulo novo fora da spec, e o teclado já fecha pelo Escape. |
| D-05 | Na gaveta aberta, escolher um link fecha a gaveta (clique delegado na `<nav>`). | Deixar o produto fechar ao navegar, como o roteador do Atria. | Sem roteador no componente, o clique é o único sinal genérico de navegação. Funciona com `renderLink` e com `<a>`. |
| D-06 | No `bottom` compacto, a `Sidebar` não é renderizada e a `BottomNav` recebe os `items` e o `renderLink` da `sidebar`. A `BottomNav` sozinha também se esconde por CSS a partir de 721 px. | Renderizar as duas e esconder por CSS. | Uma navegação por vez no DOM e na árvore de acessibilidade (RF-33). O CSS cobre quem usa a `BottomNav` sem o `AppShell` (RF-30). |
| D-07 | `hideNavigation` some com a `Sidebar`, a `BottomNav`, o botão de menu e o link de pular. A `Topbar` continua se o produto a passar. | Esconder também a `Topbar`. | Sem navegação não há o que pular. A barra superior é conteúdo do produto (no modo foco, o Synestia usa o `FocusHeader` da TASK-11 no lugar dela). |
| D-08 | O aviso de 3 a 5 destinos da `BottomNav` vem de `console.warn` num efeito, fora de produção (`typeof process === 'undefined' \|\| process.env.NODE_ENV !== 'production'`). | (a) `import.meta.env.DEV`. (b) Tipo de tupla de 3 a 5 itens. | No modo biblioteca do Vite, o `import.meta.env.DEV` vira `false` no build e o aviso sumiria para os produtos. O `process.env` fica para o bundler de quem usa. Uma tupla complica o uso com listas montadas em tempo de execução (CB-10). |
| D-09 | Medidas sem token em `calc(var(--space) * N)`: 56 px é `* 14` e 44 px é `* 11`. A área segura usa `env(safe-area-inset-bottom)`, e a camada usa `--z-dropdown` (barra inferior e fundo da gaveta) e `--z-popover` (gaveta). | Tokens novos de altura. | Inferência D da spec: nenhum token novo no tema. |

## Riscos

- **O jsdom não implementa `matchMedia` nem mede layout.** Os testes do `AppShell` falsificam o `matchMedia` no próprio arquivo. A troca em 720 px e o espaço reservado são conferidos pelo CSS e pelo print.
- **O `inert` do React 19:** o atributo booleano é aceito como prop, e o jsdom o mantém no DOM. O teste confere o atributo, não o comportamento do navegador.
- **Duas peças fixas (`BottomNav` e gaveta) com `z-index`:** um produto com camadas próprias pode precisar ajustar. A ordem `--z-dropdown` < `--z-popover` < `--z-toast` mantém o `Toast` por cima.

## Referências da spec

RF-28 a RF-35; CT-25 a CT-32; CB-10, CB-11; RNF-01, RNF-02, RNF-04, RNF-08; RN-01, RN-02, RN-03; inferências D e F do registro de decisões; [project/architecture-04], [project/code-style-03], [project/language-06], [project/theme-06], [project/theme-07].

## Arquivos em comum com a onda

Nenhum. A onda 3 (TASK-06, TASK-08, TASK-09, TASK-11, TASK-12 e TASK-14) cria pastas diferentes, e esta tarefa só lê `src/icons/interface-icons.tsx` (da TASK-02) e `src/icon-button/`.

## O que foi feito

Arquivos criados em `src/app-shell/`:

- `nav.types.ts`: `NavItem` (`id`, `label`, `icon`, `href`, `current`, `badge`) e `RenderNavLink`, usados pelas três peças.
- `nav-link.tsx`: `NavLink` interno. Com `renderLink`, chama `renderLink(item, { className, 'aria-current', children })`; sem ele, devolve um `<a href>`. Os `children` são o ícone num `<span aria-hidden>`, o rótulo e o selo. Há um espaço antes do selo, para o nome acessível sair como "Revisar 3".
- `app-shell.constants.ts`: `DEFAULT_NAV_LABELS`, `DEFAULT_APP_SHELL_LABELS` e `FOCUSABLE`, mais `COMPACT_QUERY = (max-width: 719.98px)`, calculado como `breakpoints.md - 0.02`.
- `use-media-query.ts`: `useMediaQuery(query)` sobre `window.matchMedia`, com estado inicial e ouvinte de `change` num efeito.
- `use-focus-trap.ts`: `useFocusTrap(ref, active, onEscape)`. Com `active`, foca o primeiro item; Esc chama `onEscape`; Tab e Shift+Tab dão a volta nos extremos.
- `sidebar.tsx`, `sidebar.types.ts`, `sidebar.module.css`, `sidebar.test.tsx` (9 testes): `<aside>` com `inert={drawer && !open}` e foco preso na gaveta; `<nav>` com `aria-label`; clique em um `<a>` dentro da `<nav>` fecha a gaveta, quando ela está aberta. No computador, é a mesma `<aside>`, sem comportamento de diálogo.
- `bottom-nav.tsx`, `bottom-nav.types.ts`, `bottom-nav.module.css`, `bottom-nav.test.tsx` (7 testes): `<nav>` fixa com os destinos em grade. O aviso de 3 a 5 destinos vem de `console.warn` num `useEffect`, só fora de produção. O CSS esconde a barra a partir de 721 px.
- `topbar.tsx`, `topbar.types.ts`, `topbar.module.css`, `topbar.test.tsx` (4 testes): `<header>` com os slots `start`, `center` e `end`, fixa no topo (`sticky`), com `z-index: calc(var(--z-dropdown) - 1)` para ficar abaixo do fundo da gaveta.
- `app-shell.tsx`, `app-shell.types.ts`, `app-shell.module.css`, `app-shell.test.tsx` (10 testes): guarda o estado `open` da gaveta, liga `useMediaQuery` ao corte e decide o que renderizar: link de pular, `Sidebar` ou gaveta com o fundo, `Topbar` com o botão de menu, `<main>` e `BottomNav`. `hideNavigation` esconde a navegação, o botão de menu e o link de pular. A raiz recebe `data-mobile-nav`, e o CSS reserva o espaço da barra inferior no `<main>` quando ela está ativa.

Diferenças em relação ao planejamento:

- `COMPACT_QUERY` ficou em 719.98 px, e não em `${breakpoints.md}px` como no passo 2 do `execucao.md`, para bater com os `@media` do CSS.
- Ao sair do modo compacto, `open` volta a `false` no próprio render do `AppShell`, e não num efeito.
- O fundo da gaveta (`.scrim`) não tem `eslint-disable`: o ESLint passa sem ele.
- `NavLink` também recebe `iconClassName` e `badgeClassName`, para a `Sidebar` e a `BottomNav` estilizarem o próprio ícone e selo.
- No modo barra inferior, o `AppShell` repassa também os `labels` da `sidebar` à `BottomNav`.

## Como foi verificado

- Os quatro arquivos de teste foram escritos antes dos componentes (TDD): 30 testes no total.
- Os 30 testes passam. Na revisão desta documentação, os 53 testes de `src/app-shell`, `src/bottom-sheet` e `src/focus-header` passaram, e o ESLint dessas pastas terminou sem erros.
- O `matchMedia` é falsificado em `app-shell.test.tsx`, porque o jsdom não o implementa. `src/test/setup.ts` não mudou.
- Regressão: os 3 comandos do baseline terminaram com código 0.
- Evidências: `testes-navegacao.txt`, `navegacao-estrutura.txt` e `navegacao-telas.png`, conferidas pelo usuário.

## Pontos de atenção

- Em exatamente 720 px, o `AppShell` já usa o desktop e não renderiza a `BottomNav`. Mas a `BottomNav` sozinha continua visível nesse pixel, porque o CSS dela só esconde a partir de 721 px. Quem usa a `BottomNav` sem o `AppShell` deve tratar esse pixel.
- O corte aparece como texto em quatro lugares: `COMPACT_QUERY`, os `@media (max-width: 719.98px)` de `app-shell.module.css` e `topbar.module.css`, e o `@media (min-width: 721px)` de `bottom-nav.module.css`. Mudar o breakpoint exige ajustar todos.
- O `PageHeader` usa `@media (max-width: 720px)`, que inclui 720 px; o `AppShell` não. Os dois não trocam no mesmo pixel.
- Fechar a gaveta ao escolher um link depende de o `renderLink` renderizar um `<a>`: o clique é detectado com `closest('a')`. Um `renderLink` que devolva outro elemento não fecha a gaveta sozinho.
- O fundo da gaveta é `var(--bg)` com opacidade 0.7. No tema claro, ele clareia a página (aceito pelo usuário).
- Camadas: a `Topbar` fica em `--z-dropdown` - 1 (39); o fundo da gaveta e a `BottomNav` em `--z-dropdown` (40); a gaveta em `--z-popover` (45); o `Toast` em `--z-toast` (200). Um produto com elementos fixos próprios pode precisar ajustar.
- `inert` e foco preso: os testes conferem o atributo e o comportamento do hook, não o comportamento real do navegador. O print confirma o visual.
- Sem `process` no navegador (bundler que não o define), `isDevelopment()` vira verdadeiro e o aviso de contagem aparece também em produção.
