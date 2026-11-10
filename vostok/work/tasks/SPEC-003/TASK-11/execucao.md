### Ler

- `vostok/work/specs/refined/SPEC-003-lote-1-de-componentes-para-o-synestia.md` (RF-40, CT-37, CB-13, RNF-01, RNF-02, "Contratos e interfaces": `FocusHeaderProps`, decisão 4)
- `vostok/work/tasks/SPEC-003/TASK-11/tecnico.md`
- `docs/KT-001-vega-lote-1.md` (linha do `PageHeader` em "Extensões de componentes existentes")
- `src/progress-bar/progress-bar.tsx` (com `valueText` e `indeterminate` da TASK-04)
- `src/icon-button/icon-button.tsx` e `src/icon-button/icon-button.module.css` (botão só com ícone, 40 px)
- `src/icons/interface-icons.tsx` (`CloseIcon`, criado pela TASK-02)
- `src/page-header/page-header.tsx` e `src/page-header/page-header.module.css` (título `h1` e tipografia de cabeçalho)

### Mudar

- `src/focus-header/focus-header.types.ts` (criar): `FocusHeaderProps` e `FocusHeaderLabels`, com JSDoc em pt-br (RF-40).
- `src/focus-header/focus-header.constants.ts` (criar): `DEFAULT_FOCUS_HEADER_LABELS` com `exit: 'Sair'` (RF-40, RN-02).
- `src/focus-header/focus-header.tsx` (criar): `FocusHeader` com sair, título, posição e `ProgressBar` (RF-40).
- `src/focus-header/focus-header.module.css` (criar): uma linha a partir de 360 px, título com reticências e sair com 44 px, só com tokens (RF-40, CB-13, RNF-02).
- `src/focus-header/focus-header.test.tsx` (criar): testes de nome do sair, rótulo sobrescrito, teclado, título, posição, progresso, props nativas, axe e CSS (CT-37, CB-13).

### Passos

1. `src/focus-header/focus-header.test.tsx` (criar): importe `FocusHeader` de `./focus-header`. Testes:
   - `it('has no axe violations')` com título, posição e progresso.
   - `it('names the exit button Sair by default')`: `getByRole('button', { name: 'Sair' })`.
   - `it('accepts another exit label')`: `labels={{ exit: 'Encerrar revisão' }}` dá o nome `Encerrar revisão`.
   - `it('calls onExit on click and with the keyboard')`: clique, `{Enter}` e `{ }` no botão chamam `onExit` três vezes.
   - `it('shows the title, the position and the progress bar')`: `getByRole('heading', { level: 1, name: 'Função afim' })`, o texto `3/8` e `getByRole('progressbar', { name: 'Progresso da lição' })` com `aria-valuenow="3"` e `aria-valuemax="8"`.
   - `it('renders without position and progress')`: só `title` e `onExit`; nenhum `progressbar`.
   - `it('passes className, style, data attributes and ref to the header')`: o elemento `raiz` é um `HEADER` com a classe `extra`, e o `ref` aponta para ele.
   - `it('truncates a long title on one line')` (CB-13): lê `focus-header.module.css` e espera, no bloco `.title`, `white-space: nowrap`, `overflow: hidden`, `text-overflow: ellipsis` e `min-width: 0`.
   - `it('keeps a 44px exit target')`: bloco `.exit` com `width` e `height` `calc(var(--space) * 11)`.
   Confira: `pnpm vitest run src/focus-header` falha porque `./focus-header` não existe.
2. `src/focus-header/focus-header.types.ts` (criar): `FocusHeaderLabels { exit: string }` e o `FocusHeaderProps` exato do contrato da spec (`Omit<ComponentPropsWithRef<'header'>, 'title'>` com `title: string`, `onExit: () => void`, `position?: string`, `progress?: { value: number; max: number; label: string }` e `labels?: Partial<FocusHeaderLabels>`), com JSDoc em pt-br.
3. `src/focus-header/focus-header.constants.ts` (criar): `export const DEFAULT_FOCUS_HEADER_LABELS: FocusHeaderLabels = { exit: 'Sair' };`.
4. `src/focus-header/focus-header.tsx` (criar): `<header {...rest} className={[styles.root, className]...}>` com uma linha `.row` contendo `<IconButton className={styles.exit} aria-label={texts.exit} icon={<CloseIcon />} onClick={onExit} />` (import de `../icon-button/icon-button` e `../icons/interface-icons`), `<h1 className={styles.title}>{title}</h1>` e, se houver, `<span className={styles.position}>{position}</span>`; abaixo da linha, se houver `progress`, `<ProgressBar label={progress.label} value={progress.value} max={progress.max} />` (import de `../progress-bar/progress-bar`). `texts = { ...DEFAULT_FOCUS_HEADER_LABELS, ...labels }`. Reexporte `export type { FocusHeaderProps, FocusHeaderLabels } from './focus-header.types';`.
5. `src/focus-header/focus-header.module.css` (criar), só com tokens: `.root { display: flex; flex-direction: column; gap: calc(var(--space) * 2); padding: calc(var(--space) * 2) 0; }`; `.row { display: flex; align-items: center; gap: calc(var(--space) * 2); min-width: 0; }`; `.exit { flex: none; width: calc(var(--space) * 11); height: calc(var(--space) * 11); }`; `.title { flex: 1; min-width: 0; margin: 0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; font-family: var(--font-display); font-size: var(--font-size-lg); font-weight: var(--font-weight-semibold); }`; `.position { flex: none; font-size: var(--font-size-sm); color: var(--text-muted); font-variant-numeric: tabular-nums; }`. Confira: `pnpm vitest run src/focus-header` passa.
6. Rode `pnpm exec prettier --write src/focus-header` e depois a Verificação inteira. Confira: todos os comandos terminam com código 0.
