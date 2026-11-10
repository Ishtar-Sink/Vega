### Ler

- `vostok/work/specs/refined/SPEC-003-lote-1-de-componentes-para-o-synestia.md` (RF-03, RF-04, CT-03, CT-04, CB-01, RNF-01, RNF-02, RN-03, "Contratos e interfaces": `SwitchProps`)
- `vostok/work/tasks/SPEC-003/TASK-05/tecnico.md`
- `docs/KT-001-vega-lote-1.md` (seção "2. `Switch`")
- `../atria/apps/web/src/features/reminders/components/notification-settings-card.tsx` (o switch inline do Atria: `<button role="switch" aria-checked>`)
- `src/checkbox/checkbox.tsx` e `src/checkbox/checkbox.module.css` (rótulo, foco e cores de um controle de alternar já existente)
- `src/text-field/text-field.tsx` (padrão de `help` ligado por `aria-describedby`)
- `src/theme/tokens.css`

### Mudar

- `src/switch/switch.types.ts` (criar): `SwitchProps` com JSDoc em pt-br (RF-03).
- `src/switch/switch.tsx` (criar): `Switch` como `<button role="switch">` com rótulo, ajuda e alternância (RF-03, RF-04).
- `src/switch/switch.module.css` (criar): trilho, botão deslizante, foco, desabilitado e área de toque de 44 px, só com tokens (RNF-02, RN-03).
- `src/switch/switch.test.tsx` (criar): testes de papel, nome, teclado, rótulo, desabilitado, props nativas, axe e CSS (CT-03, CT-04, CB-01).

### Passos

1. `src/switch/switch.test.tsx` (criar): importe `Switch` de `./switch` e use um `Harness` com `useState` para `checked`. Testes:
   - `it('has no axe violations')` ligado e desligado.
   - `it('has the switch role named by the label')`: `getByRole('switch', { name: 'Disponível offline' })` com `aria-checked="false"`.
   - `it('links the help text by aria-describedby')`: com `help="12 MB"`, o switch tem `aria-describedby` com o `id` do texto de ajuda (`toHaveAccessibleDescription('12 MB')`).
   - `it('toggles on click')`: clique muda `aria-checked` para `true` e chama `onCheckedChange(true)`.
   - `it('toggles with Space and Enter')`: com `userEvent`, `switch.focus()`, `{ }` (Espaço) e `{Enter}` alternam duas vezes.
   - `it('toggles when the label is clicked')`: `userEvent.click(screen.getByText('Disponível offline'))` muda `aria-checked`.
   - `it('does not toggle when disabled')` (CB-01): com `disabled`, clique e Espaço não chamam `onCheckedChange`.
   - `it('passes className, style, data attributes and ref to the button')`: `className="extra"`, `style={{ marginTop: '4px' }}`, `data-testid="raiz"` e `ref` (`createRef<HTMLButtonElement>`) chegam ao `button` com papel `switch`.
   - `it('keeps a 44px touch target')`: lê `switch.module.css` e espera `min-height:\s*calc\(var\(--space\) \* 11\)` no bloco `.root`.
   - `it('shows the state by the thumb position, not only the color')`: o CSS tem um bloco `[aria-checked='true'] .thumb` (ou `.root[aria-checked='true'] .thumb`) com `transform:`.
   Confira: `pnpm vitest run src/switch` falha porque `./switch` não existe.
2. `src/switch/switch.types.ts` (criar): o `SwitchProps` exato do contrato da spec (`Omit<ComponentPropsWithRef<'button'>, 'onChange' | 'children'>` com `label`, `help?`, `checked` e `onCheckedChange`), com JSDoc em pt-br em cada prop.
3. `src/switch/switch.tsx` (criar): `export function Switch({ label, help, checked, onCheckedChange, id, className, style, disabled, onClick, 'aria-describedby': describedByProp, ...rest }: SwitchProps)`. Estrutura: um `div` de layout (`styles.field`) com `<button {...rest} id={controlId} type="button" role="switch" aria-checked={checked} disabled={disabled} className={[styles.root, className]...} style={style} aria-describedby={...}>`, que contém `<span className={styles.track} aria-hidden="true"><span className={styles.thumb} /></span>`, e, ao lado, `<label htmlFor={controlId} className={styles.label}>{label}</label>` e o `help` num `<p id={helpId}>`. O `id` vem de `useId()` quando não é recebido. O clique chama `onClick?.(event)` e, se não for `event.defaultPrevented`, `onCheckedChange(!checked)`. Espaço e Enter vêm do `<button>` nativo. `role`, `type` e `aria-checked` ficam depois do `...rest`. Importe os tipos de `./switch.types` e reexporte `export type { SwitchProps } from './switch.types';`.
4. `src/switch/switch.module.css` (criar), só com tokens: `.field { display: flex; align-items: flex-start; gap: calc(var(--space) * 3); }`; `.root` com `min-height: calc(var(--space) * 11)`, `min-width: calc(var(--space) * 11)`, fundo transparente, sem borda, `cursor: pointer`; `.track` de `calc(var(--space) * 10)` × `calc(var(--space) * 6)` com `background: var(--border-strong)` e `border-radius: var(--radius-pill)`; `.thumb` circular `calc(var(--space) * 5)` em `var(--surface)` com `transition: transform var(--motion-fast) var(--motion-ease-standard)`; `.root[aria-checked='true'] .track { background: var(--primary); }` e `.root[aria-checked='true'] .thumb { transform: translateX(calc(var(--space) * 4)); }`; `.root:focus-visible .track { outline: calc(var(--space) / 2) solid var(--primary); outline-offset: calc(var(--space) / 2); }`; `.root:disabled { cursor: not-allowed; }` e `.root:disabled .track { opacity: 0.5; }`; `.label` em `var(--font-size-md)` com `cursor: pointer`; `.help` em `var(--font-size-sm)` e `var(--text-muted)`. Confira: `pnpm vitest run src/switch` passa.
5. Rode `pnpm exec prettier --write src/switch` e depois a Verificação inteira. Confira: todos os comandos terminam com código 0.
