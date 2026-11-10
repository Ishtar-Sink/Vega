### Ler

- `vostok/work/specs/refined/SPEC-003-lote-1-de-componentes-para-o-synestia.md` (RF-39, CT-36, RNF-02, "Contratos e interfaces": `CardLinkProps` e `CardButtonProps`, decisão 4)
- `vostok/work/tasks/SPEC-003/TASK-10/tecnico.md`
- `docs/KT-001-vega-lote-1.md` (seção "Extensões de componentes existentes", linha do `Card`)
- `src/card/card.tsx` (tipo `CardTone` e as classes de tom)
- `src/card/card.module.css`
- `src/card/card.test.tsx`
- `src/button/button.module.css` (anel de foco `:focus-visible` usado na Vega)

### Mudar

- `src/card-link/card-link.types.ts` (criar): `CardLinkProps` e `CardButtonProps`, com JSDoc em pt-br (RF-39).
- `src/card-link/card-link.tsx` (criar): `CardLink`, cartão interativo como `<a>` (RF-39).
- `src/card-link/card-button.tsx` (criar): `CardButton`, cartão interativo como `<button>` (RF-39).
- `src/card-link/card-link.module.css` (criar): hover, foco visível, pressionado, largura e alvo de toque, só com tokens (RF-39, RNF-02).
- `src/card-link/card-link.test.tsx` (criar): testes dos dois componentes (CT-36).

### Passos

1. `src/card-link/card-link.test.tsx` (criar): importe `CardLink` de `./card-link` e `CardButton` de `./card-button`. Testes:
   - `it('has no axe violations')` para os dois.
   - `it('renders CardLink as a real link')`: `<CardLink href="/temas/funcoes">Funções</CardLink>`; `getByRole('link', { name: 'Funções' })` com `href="/temas/funcoes"`.
   - `it('renders CardButton as a real button of type button')`: `getByRole('button', { name: 'Continuar' })` com `type="button"`.
   - `it('activates CardButton with Enter and Space')`: com `userEvent`, `{Enter}` e `{ }` chamam `onClick` duas vezes.
   - `it('makes the whole card a single target')`: com um título e um parágrafo dentro, há um único `link` (ou `button`) e ele contém os dois textos.
   - `it('applies the card tone')`: `tone="primary"` aplica a classe de tom do `Card` (`className` casa com `/primary/`).
   - `it('passes className, style, data attributes and ref to the link')` e `it('passes className, style, data attributes and ref to the button')`.
   - `it('shows hover, visible focus and pressed states')`: lê `card-link.module.css` e espera os seletores `.interactive:hover`, `.interactive:focus-visible` (com `outline:`) e `.interactive:active`.
   - `it('keeps a 44px touch target and stays inside its container')`: bloco `.interactive` com `min-height: calc(var(--space) * 11)` e `box-sizing: border-box`, e bloco `.button` com `width: 100%`.
   Confira: `pnpm vitest run src/card-link` falha porque `./card-link` não existe.
2. `src/card-link/card-link.types.ts` (criar): `import type { CardTone } from '../card/card';` e as interfaces do contrato: `CardLinkProps extends ComponentPropsWithRef<'a'> { tone?: CardTone }` e `CardButtonProps extends ComponentPropsWithRef<'button'> { tone?: CardTone }`, com JSDoc em pt-br.
3. `src/card-link/card-link.module.css` (criar): `.interactive { display: block; box-sizing: border-box; min-height: calc(var(--space) * 11); text-decoration: none; color: inherit; cursor: pointer; transition: border-color var(--motion-fast) var(--motion-ease-standard), box-shadow var(--motion-fast) var(--motion-ease-standard); }`, `.interactive:hover { border-color: var(--primary); box-shadow: var(--shadow-lg); }`, `.interactive:focus-visible { outline: calc(var(--space) / 2) solid var(--primary); outline-offset: calc(var(--space) / 2); }`, `.interactive:active { box-shadow: var(--shadow-sm); }` e `.button { width: 100%; font: inherit; text-align: start; }`.
4. `src/card-link/card-link.tsx` (criar): `export function CardLink({ tone = 'default', className, ...rest }: CardLinkProps)`, que renderiza `<a {...rest} className={...} />` com as classes `cardStyles.root`, a classe de tom de `cardStyles` (`tone === 'default' ? null : cardStyles[tone]`), `styles.interactive` e `className`. `cardStyles` é `import cardStyles from '../card/card.module.css'`, para seguir o visual do `Card` sem mudá-lo. Reexporte `export type { CardLinkProps } from './card-link.types';`.
5. `src/card-link/card-button.tsx` (criar): `CardButton` igual, com `<button {...rest} type={type}>` (`type = 'button'` por padrão) e a classe `styles.button` a mais. Reexporte `CardButtonProps`. Confira: `pnpm vitest run src/card-link` passa.
6. Rode `pnpm exec prettier --write src/card-link` e depois a Verificação inteira. Confira: todos os comandos terminam com código 0.
