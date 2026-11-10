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
| D-02 | A largura é detectada por `useMediaQuery('(max-width: 719.98px)')` (abaixo de 720 px, como o RF-33; a partir de 720 px vale o desktop, o mesmo corte do `min-width: 720px` do BottomSheet), a partir de `breakpoints.md`, e o CSS repete o corte em `@media (max-width: 719.98px)`. | Só CSS (esconder e mostrar). | O modo gaveta precisa de JS (`inert`, foco preso, botão com `aria-expanded`), e renderizar só uma navegação evita duas `<nav>` "Principal" na página. O corte inclui 720 px, como no `PageHeader` e no Atria. O Coordenador deve conferir se o `BottomSheet` (TASK-12) usa o mesmo corte. |
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
