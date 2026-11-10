### Ler

- `vostok/work/specs/refined/SPEC-003-lote-1-de-componentes-para-o-synestia.md` (RF-37, RF-38, CT-34, CT-35, CB-12, RNF-04, "Contratos e interfaces": `ProgressBarProps`)
- `vostok/work/tasks/SPEC-003/TASK-04/tecnico.md`
- `src/progress-bar/progress-bar.tsx`
- `src/progress-bar/progress-bar.module.css`
- `src/progress-bar/progress-bar.test.tsx` (inclusive o `describe('ProgressBar track visibility')`)
- `src/theme/tokens.css` (bloco `@media (prefers-reduced-motion: reduce)`)

### Mudar

- `src/progress-bar/progress-bar.test.tsx` (alterar): testes de `valueText`, `indeterminate` e da animação com movimento reduzido (RF-37, RF-38, CT-34, CT-35, CB-12).
- `src/progress-bar/progress-bar.tsx` (alterar): props `valueText` e `indeterminate`, com JSDoc em pt-br (RF-37, RF-38).
- `src/progress-bar/progress-bar.module.css` (alterar): texto do valor, barra indeterminada animada com `--motion-*` e sem animação com `prefers-reduced-motion` (RF-38, RNF-04).

### Passos

1. `src/progress-bar/progress-bar.test.tsx` (alterar): acrescente os testes:
   - `it('shows valueText as visible text and aria-valuetext')`: `<ProgressBar label="Lição" value={4} max={9} valueText="4 de 9" />`; `getByRole('progressbar', { name: 'Lição' })` tem `aria-valuetext="4 de 9"`, e `screen.getByText('4 de 9')` está visível e com `aria-hidden="true"` (o leitor de tela lê o valor pelo `aria-valuetext`, uma vez só).
   - `it('keeps className, style and data attributes on the progressbar with valueText')`: com `valueText`, `className="extra"` e `data-testid="raiz"`, o elemento `raiz` tem o papel `progressbar` e a classe `extra`.
   - `it('omits aria-valuenow when indeterminate')`: `<ProgressBar label="Importação" value={0} indeterminate />` sem `aria-valuenow` e com `aria-busy="true"`.
   - `it('ignores the value when indeterminate')` (CB-12): `value={70}` com `indeterminate`; sem `aria-valuenow` e o preenchimento sem `width: 70%`.
   - `it('animates the indeterminate fill with motion tokens')`: lê `progress-bar.module.css` e espera, no bloco `/\.indeterminate \.fill\s*\{([^}]*)\}/`, `animation:` com `var(--motion-slow)`.
   - `it('stops the indeterminate animation with reduced motion')`: o CSS tem `@media (prefers-reduced-motion: reduce)` com `.indeterminate .fill` e `animation: none`.
   Confira: `pnpm vitest run src/progress-bar` falha nos testes novos e passa nos antigos (inclusive `ProgressBar track visibility`).
2. `src/progress-bar/progress-bar.tsx` (alterar): em `ProgressBarProps`, acrescente `/** Texto visível do valor (ex.: "4 de 9"), também usado em \`aria-valuetext\`. */ valueText?: string;` e `/** Progresso sem valor conhecido: não anuncia valor e anima a barra. */ indeterminate?: boolean;`. A raiz continua sendo o `div` `progressbar` com `className`, `style` e `...rest`. Regras:
   - `indeterminate`: acrescenta `styles.indeterminate` à raiz, `aria-busy="true"`, omite `aria-valuenow` e o preenchimento fica sem `width` inline (a largura vem do CSS).
   - `valueText`: aplica `aria-valuetext={valueText}` na raiz; para mostrar o texto, envolve a raiz num `<div className={styles.labeled}>` com a raiz e um `<span className={styles.valueText} aria-hidden="true">{valueText}</span>`. Sem `valueText`, nada muda na árvore.
   Confira: o arquivo fica com menos de 200 linhas.
3. `src/progress-bar/progress-bar.module.css` (alterar): acrescente `.labeled { display: flex; flex-direction: column; gap: var(--space); }`, `.valueText { font-size: var(--font-size-sm); color: var(--text-muted); font-variant-numeric: tabular-nums; }`, `.indeterminate .fill { width: 40%; animation: progress-indeterminate var(--motion-slow) var(--motion-ease-linear) infinite alternate; }`, `@keyframes progress-indeterminate { from { transform: translateX(0); } to { transform: translateX(150%); } }` e `@media (prefers-reduced-motion: reduce) { .indeterminate .fill { animation: none; } }`. O `.root` não muda (o teste `ProgressBar track visibility` lê o fundo dele). Confira: `pnpm vitest run src/progress-bar` passa inteiro.
4. Rode `pnpm exec prettier --write src/progress-bar` e depois a Verificação inteira. Confira: todos os comandos terminam com código 0.
