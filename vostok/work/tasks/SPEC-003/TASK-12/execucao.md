### Ler

- `vostok/work/specs/refined/SPEC-003-lote-1-de-componentes-para-o-synestia.md` (RF-19 a RF-21, CT-18, CT-19, CB-07, RN-02, RNF-01 a RNF-04, RNF-08, "Contratos e interfaces": `BottomSheetProps`)
- `vostok/work/tasks/SPEC-003/TASK-12/tecnico.md`
- `vostok/rules/project/code-style.md` ([project/code-style-08] e [project/code-style-09]) e `vostok/rules/project/accessibility.md` ([project/accessibility-06])
- `src/dialog/dialog.tsx` (abertura com `showModal()`, foco inicial, Tab preso, Esc pelo `cancel`, clique no fundo e foco devolvido: o comportamento que o `BottomSheet` repete)
- `src/dialog/dialog.test.tsx` (polyfill local de `showModal`/`close` e os testes de foco a repetir)
- `src/dialog/dialog.module.css` (fundo `::backdrop`, superfície `--elevation-3` e sombra)
- `src/icon-button/icon-button.tsx` (botão de fechar só com ícone e `aria-label` obrigatório)
- `src/icons/interface-icons.tsx` (criado pela TASK-02: `CloseIcon`)
- `src/theme/tokens.ts` (`breakpoints.md` = 720)

### Mudar

- `src/bottom-sheet/bottom-sheet.types.ts` (criar): `BottomSheetPlacement`, `BottomSheetLabels` e `BottomSheetProps`, com JSDoc em pt-br (RF-19 a RF-21).
- `src/bottom-sheet/bottom-sheet.constants.ts` (criar): `DEFAULT_LABELS` (`close: 'Fechar'`) e o seletor de elementos focáveis (RF-20, RN-02).
- `src/bottom-sheet/use-bottom-sheet.ts` (criar): hook que abre com `showModal()`, prende o Tab, entrega Esc e fundo ao `onClose` e devolve o foco (RF-19, RF-20).
- `src/bottom-sheet/bottom-sheet.tsx` (criar): `BottomSheet` sobre `<dialog>`, com título, descrição, alça, botão de fechar, conteúdo rolável e rodapé fixo (RF-19 a RF-21).
- `src/bottom-sheet/bottom-sheet.module.css` (criar): posições `bottom`, `side` e `auto` (troca em 720 px), área segura e animação de entrada, só com tokens (RF-21, RNF-02, RNF-04).
- `src/bottom-sheet/bottom-sheet.test.tsx` (criar): testes do `BottomSheet`, com o polyfill local de `showModal`/`close` (CT-18, CT-19, CB-07, RNF-02 a RNF-04).

### Passos

Regras comuns a todos os passos (decididas em `tecnico.md`, seção "Decisões"):

- Um contexto por arquivo ([project/code-style-09]) e até 200 linhas por arquivo de produção ([project/code-style-08]).
- Props nativas no `<dialog>`: desestruture `className`, `style`, `ref` e `...rest` (sem `title` e `open`, que o componente redefine) e aplique-os no `<dialog>`; o `ref` recebido é ligado ao `ref` interno com `useImperativeHandle`, como no `Dialog`.
- CSS só com tokens; a condição `@media (min-width: 720px)` fica em `px`, como nas outras tarefas; alturas relativas à tela em `dvh`.
- Polyfill do jsdom no topo do teste, igual ao de `src/dialog/dialog.test.tsx` (constantes `showModal` e `close` com `vi.fn` e o `beforeAll`). Não altere `src/test/setup.ts`.
- O `Dialog` não é alterado: o `BottomSheet` repete o comportamento de foco no próprio hook (D-01).

1. `src/bottom-sheet/bottom-sheet.test.tsx` (criar): com um `Harness` que tem um botão `Abrir` e o `BottomSheet` controlado por `useState`:
   - `it('opens with the native showModal and names the dialog by the title')` (CT-18): depois de abrir, `getByRole('dialog', { name: 'Questões' })` é um `DIALOG`, a descrição está no `aria-describedby` e `showModal` foi chamado.
   - `it('closes on Escape, on the backdrop and on the close button')` (CT-18): Esc (`fireEvent` de `cancel` no `dialog`, como no teste do `Dialog`), clique no próprio `dialog` (o fundo) e clique no botão `Fechar` chamam `onClose`, uma vez cada.
   - `it('returns focus to the trigger')` (RF-20): depois de fechar, o botão `Abrir` tem o foco.
   - `it('traps Tab inside the sheet')`: com dois botões no conteúdo e um no rodapé, `user.tab()` no último volta ao botão `Fechar`, e `Shift+Tab` no primeiro vai ao último.
   - `it('closes when open turns false from outside')` (CB-07): o pai muda `open` para `false`; `close` foi chamado, o `dialog` some e o foco volta ao gatilho.
   - `it('uses Fechar by default and accepts another close label')` (RN-02): `labels={{ close: 'Close' }}` dá o botão `Close`.
   - `it('keeps the footer outside the scrolling body')` (RF-19): o rodapé não está dentro do elemento com a classe `body`.
   - `it('applies the placement class')` (CT-19): `placement` `bottom`, `side` e o padrão `auto` dão as classes `bottom`, `side` e `auto`.
   - `it('moves to the side from 720 px in auto')` (CT-19): o CSS tem `@media (min-width: 720px)` com uma regra `.auto` de lateral (`inset-inline-end: 0`), e `.bottom` e `.auto` fora dele têm `max-height: 85dvh`.
   - `it('respects the safe area at the bottom')`: o CSS usa `env(safe-area-inset-bottom)` no rodapé.
   - `it('keeps the close button at least 44 px')` (RNF-02): `.close` com `min-width` e `min-height` `calc(var(--space) * 11)`.
   - `it('enters with motion tokens and appears at once with reduced motion')` (RNF-04): a `animation` usa `var(--motion-base)` e `var(--motion-ease-enter)`, e há `@media (prefers-reduced-motion: reduce)` com `animation: none`.
   - `it('has no axe violations')` e `it('passes className, style, data attributes and ref to the dialog')`.
   Confira: `pnpm vitest run src/bottom-sheet` falha porque `./bottom-sheet` não existe.
2. `src/bottom-sheet/bottom-sheet.types.ts` (criar): `export type BottomSheetPlacement = 'auto' | 'bottom' | 'side';`, `export interface BottomSheetLabels { close: string }` e `BottomSheetProps` como na spec, com `placement?: BottomSheetPlacement`, `labels?: Partial<BottomSheetLabels>` e `children: ReactNode`. Confira: tsc sem erro no arquivo.
3. `src/bottom-sheet/bottom-sheet.constants.ts` (criar): `export const DEFAULT_LABELS: BottomSheetLabels = { close: 'Fechar' };` e `export const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';`. Confira: tsc sem erro no arquivo.
4. `src/bottom-sheet/use-bottom-sheet.ts` (criar): `useBottomSheet({ open, onClose, ref })` devolve `{ dialogRef, onKeyDown, onCancel, onClick }`, com a mesma lógica do `Dialog`: no efeito, com `open`, guarda o elemento com foco, chama `showModal()` e foca o primeiro focável do conteúdo (ou o botão de fechar); na limpeza, `close()` e devolve o foco. `onKeyDown` prende o Tab entre o primeiro e o último focável; `onCancel` faz `preventDefault` e chama `onClose`; `onClick` chama `onClose` quando `event.target === event.currentTarget` (o fundo). Confira: tsc sem erro no arquivo.
5. `src/bottom-sheet/bottom-sheet.tsx` (criar): `BottomSheet` com `placement = 'auto'`; com `open` falso devolve `null`. Gera `titleId` e `descriptionId` com `useId` e mescla `labels` com `DEFAULT_LABELS`. Renderiza `<dialog {...rest} ref={dialogRef} aria-labelledby={titleId} aria-describedby={description ? descriptionId : undefined} className={[styles.root, styles[placement], className]} style onKeyDown onCancel onClick>` com: `<span aria-hidden="true" className={styles.handle} />` (alça só visual); um `<header className={styles.header}>` com `<h2 id={titleId} className={styles.title}>`, a descrição (`<p id={descriptionId} className={styles.description}>`) e o `IconButton` de fechar (`aria-label={labels.close}`, `icon={<CloseIcon />}`, `className={styles.close}`, `onClick={onClose}`); `<div className={styles.body}>{children}</div>`; e, se houver, `<footer className={styles.footer}>{footer}</footer>`. Confira: tsc sem erro no arquivo.
6. `src/bottom-sheet/bottom-sheet.module.css` (criar):
   - `.root`: `display: flex`, `flex-direction: column`, `box-sizing: border-box`, `margin: 0`, `padding: 0`, `border: 0`, `background: var(--elevation-3)`, `color: var(--text)`, `box-shadow: var(--shadow-lg)`, `font-family: var(--font-body)`; `.root::backdrop` igual ao do `Dialog`.
   - `.bottom` e `.auto`: `inset: auto 0 0 0`, `width: 100%`, `max-width: 100%`, `max-height: 85dvh`, `border-radius: var(--radius-lg) var(--radius-lg) 0 0`, `animation: sheet-up var(--motion-base) var(--motion-ease-enter)`.
   - `.side` e, dentro de `@media (min-width: 720px)`, `.auto`: `inset: 0 0 0 auto`, `inset-inline-end: 0`, `width: min(calc(var(--space) * 105), 100vw)`, `height: 100dvh`, `max-height: 100dvh`, `border-radius: var(--radius-lg) 0 0 var(--radius-lg)`, `animation: sheet-in var(--motion-base) var(--motion-ease-enter)`.
   - `@keyframes sheet-up` (de `transform: translateY(100%)` a `none`) e `@keyframes sheet-in` (de `translateX(100%)` a `none`).
   - `.handle`: barra de `calc(var(--space) * 10)` por `var(--space)`, centralizada, `border-radius: var(--radius-pill)`, `background: var(--border-strong)`; escondida em `.side` e no `.auto` a partir de 720 px.
   - `.header`: `display: flex`, `align-items: flex-start`, `gap: var(--s3)`, `padding: var(--s4) var(--s4) var(--s2)`; `.title` como o do `Dialog`; `.description` em `var(--text-muted)`.
   - `.close`: `margin-left: auto`, `min-width` e `min-height` `calc(var(--space) * 11)`.
   - `.body`: `flex: 1`, `overflow-y: auto`, `overscroll-behavior: contain`, `padding: 0 var(--s4) var(--s4)`.
   - `.footer`: `flex: none`, `padding: var(--s3) var(--s4) max(var(--s4), env(safe-area-inset-bottom))`, borda superior `calc(var(--space) / 4) solid var(--border)`.
   - `@media (prefers-reduced-motion: reduce)` com `.root { animation: none; }`.
   Confira: `pnpm vitest run src/bottom-sheet` passa.
7. Pasta da tarefa: rode `pnpm exec prettier --write src/bottom-sheet` e depois a Verificação inteira. Confira: todos os comandos terminam com código 0.
