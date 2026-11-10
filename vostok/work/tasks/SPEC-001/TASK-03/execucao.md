### Ler

- `vostok/work/specs/refined/SPEC-001-extrair-os-componentes-do-atria-para-a-vega.md`: RF-06, RF-09, RF-20, RNF-01, RNF-02, RNF-06, RNF-07, RN-02, CT-06, CT-09 e CT-13.
- `vostok/work/tasks/SPEC-001/TASK-03/tecnico.md`: decisões desta tarefa (troca dos literais, `ref`, CT-06).
- `vostok/rules/project/code-style.md`, `vostok/rules/project/accessibility.md`, `vostok/rules/project/testing.md`, `vostok/rules/project/theme.md` e `vostok/rules/project/naming-convention.md`.
- `../atria/packages/ui/src/button/button.tsx`, `../atria/packages/ui/src/button/button.module.css` e `../atria/packages/ui/src/button/button.test.tsx`: origem do `Button` (somente leitura).
- `../atria/packages/ui/src/icon-button/icon-button.tsx`, `../atria/packages/ui/src/icon-button/icon-button.module.css` e `../atria/packages/ui/src/icon-button/icon-button.test.tsx`: origem do `IconButton` (somente leitura).
- `../atria/packages/ui/src/menu-button/menu-button.tsx`, `../atria/packages/ui/src/menu-button/menu-button.module.css` e `../atria/packages/ui/src/menu-button/menu-button.test.tsx`: origem do `MenuButton` (somente leitura).
- `src/theme/tokens.css` (criado pela TASK-02): nomes das variáveis disponíveis (`--space`, `--radius-*`, `--font-*`, `--motion-*`, `--primary*`).
- `vite.config.ts` e `src/test/setup.ts` (criados pela TASK-01): ambiente do Vitest (jsdom, globals, jest-dom e vitest-axe).

### Mudar

- `src/button/button.test.tsx` (criar): testes do `Button` trazidos do Atria e completados (teclado, CT-06, CT-13) (RF-09, RF-20, CT-06, CT-09, CT-13).
- `src/button/button.module.css` (criar): estilos do `Button` só com tokens, sem `px` literal (RNF-02).
- `src/button/button.tsx` (criar): `Button` com `ComponentPropsWithRef<'button'>` (RF-09, RF-20).
- `src/icon-button/icon-button.test.tsx` (criar): testes do `IconButton`, inclusive o `aria-label` obrigatório no tipo (RF-09, RF-20, CT-09, CT-13).
- `src/icon-button/icon-button.module.css` (criar): estilos do `IconButton` só com tokens (RNF-02).
- `src/icon-button/icon-button.tsx` (criar): `IconButton` com `ComponentPropsWithRef<'button'>` e `aria-label` obrigatório (RF-09, RF-20).
- `src/menu-button/menu-button.test.tsx` (criar): testes do `MenuButton` trazidos do Atria e completados (RF-09, RF-20, CT-09, CT-13).
- `src/menu-button/menu-button.module.css` (criar): estilos do `MenuButton` só com tokens (RNF-02).
- `src/menu-button/menu-button.tsx` (criar): `MenuButton` com `ComponentPropsWithRef<'div'>` no elemento raiz (RF-09, RF-20).

### Passos

Regra de troca de literais usada em todos os `.module.css` desta tarefa (decisão do `tecnico.md`): `1px` vira `calc(var(--space) / 4)`, `2px` vira `calc(var(--space) / 2)`; `font-weight: 600` → `var(--font-weight-semibold)`, `z-index: 45` → `var(--z-popover)` (tokens criados pela TASK-02, decisão do usuário); porcentagens de `color-mix`, `100%`, `transparent`, `currentColor` e `360deg` ficam como estão. Esta tarefa não cria token.

1. `src/button/button.test.tsx` (criar): copie `../atria/packages/ui/src/button/button.test.tsx` e adapte:
   - troque `join(__dirname, 'button.module.css')` por `join(import.meta.dirname, 'button.module.css')` nas duas leituras;
   - renomeie `describe('Button success hover (DEC-013)', ...)` para `describe('Button styles', ...)` e tire ", as in the prototype" dos nomes dos dois testes de `color-mix`;
   - no teste `uses the tint color in the muted variant`, troque o texto `Raia` por `Destaque`;
   - acrescente em `describe('Button', ...)`:
     - `it('activates with Enter and Space from the keyboard')`: `const user = userEvent.setup()`, `onClick = vi.fn()`, renderiza `<Button onClick={onClick}>Salvar</Button>`, `await user.tab()`, confere `toHaveFocus()`, `await user.keyboard('{Enter}')`, `await user.keyboard(' ')` e `expect(onClick).toHaveBeenCalledTimes(2)`;
     - `it('defaults to type button')`: o botão tem `type="button"`; com `type="submit"`, tem `type="submit"`;
     - `it('ct13 forwards className, style, data attributes and ref to the button')`: `const ref = createRef<HTMLButtonElement>()`; renderiza `<Button className="extra" style={{ marginTop: 'var(--s2)' }} data-kind="save" ref={ref}>Salvar</Button>`; o botão tem a classe `extra` e a classe que casa com `/root/`, `style.marginTop` igual a `var(--s2)`, `data-kind="save"` e `ref.current` igual ao botão;
     - `it('ct13 keeps the custom style together with the tint')`: `<Button variant="muted" tint="#ff8800" style={{ marginTop: 'var(--s2)' }}>Ver</Button>` tem `--button-tint` `#ff8800` e `marginTop` `var(--s2)`;
     - `it('ct06 uses the --primary overridden by an ancestor container')`: renderiza `<div data-testid="brand" style={{ '--primary': '#ff5500' } as CSSProperties}><Button variant="primary">Salvar</Button></div>`; confere que o contêiner tem `style.getPropertyValue('--primary')` igual a `#ff5500`, que o botão tem a classe que casa com `/primary/` e que `button.style.getPropertyValue('--primary')` é `''` (o botão não redefine a variável); lê `button.module.css` com `readFileSync(join(import.meta.dirname, 'button.module.css'), 'utf8')`, extrai o bloco `/\.primary\s*\{([^}]*)\}/` e confere que contém `background: var(--primary)` e `border-color: var(--primary)` e `color: var(--primary-on)`; confere que o CSS inteiro não casa com `/--primary\s*:/` (nenhuma redefinição) nem com `/var\(--primary(-[a-z]+)?\s*,/` (nenhum valor de reserva).
   - Importe `createRef` e o tipo `CSSProperties` de `react`.
   Rode `pnpm vitest run src/button` e confira que falha por `./button` não existir.
2. `src/button/button.module.css` (criar): copie `../atria/packages/ui/src/button/button.module.css` e aplique a regra de troca de literais (`border: 1px solid` em `.root`, `outline: 2px` e `outline-offset: 2px` em `.root:focus-visible`, `border: 2px solid currentColor` em `.spinner`, `font-weight: 600` em `.root`). Mantenha os comentários em pt-br e a ordem dos blocos (o `.primary[aria-busy='true']` fica no fim).
3. `src/button/button.tsx` (criar): copie `../atria/packages/ui/src/button/button.tsx`. Mantenha `ButtonProps extends ComponentPropsWithRef<'button'>`, `ButtonVariant` e a lógica; o `ref` chega ao `<button>` pelo `...rest` (React 19). Troque o JSDoc de `tint` por `/** Cor CSS usada pela variação `muted` (ex.: a cor de uma categoria). */` e acrescente JSDoc em `variant` (`/** Variação visual. Padrão: `secondary`. */`) e `loading` (`/** Mostra o indicador, anuncia `aria-busy` e bloqueia o clique. */`). Rode `pnpm vitest run src/button` até passar.
4. `src/icon-button/icon-button.test.tsx` (criar): copie `../atria/packages/ui/src/icon-button/icon-button.test.tsx` e acrescente:
   - `it('activates with the keyboard')`: com `onClick = vi.fn()`, `await user.tab()`, foco no botão `Fechar`, `await user.keyboard('{Enter}')` e `onClick` chamado uma vez;
   - `it('applies the variant class and defaults to type button')`: sem `variant`, a classe casa com `/ghost/`; com `variant="secondary"`, casa com `/secondary/`; `type="button"`;
   - `it('ct13 forwards className, style, data attributes and ref to the button')`: como no `Button`, com `aria-label="Fechar"` e `icon={<svg />}`;
   - `it('requires aria-label and refuses children in the props type')`: dentro do teste, `// @ts-expect-error aria-label é obrigatório num botão só com ícone` sobre `const unnamed = <IconButton icon={<svg />} />;` e `// @ts-expect-error o botão só com ícone não recebe texto` sobre `const withText = <IconButton aria-label="Fechar" icon={<svg />}>Fechar</IconButton>;`, terminando com `expect([unnamed, withText]).toHaveLength(2)`.
   Rode `pnpm vitest run src/icon-button` e confira que falha.
5. `src/icon-button/icon-button.module.css` (criar): copie `../atria/packages/ui/src/icon-button/icon-button.module.css` e aplique a regra de troca de literais.
6. `src/icon-button/icon-button.tsx` (criar): `export interface IconButtonProps extends Omit<ComponentPropsWithRef<'button'>, 'children' | 'aria-label'>` com `/** Nome acessível: obrigatório, porque o botão não tem texto. */ 'aria-label': string;`, `/** Ícone em SVG inline; fica dentro de um `<span aria-hidden="true">`. */ icon: ReactNode;` e `/** Padrão: `ghost`. */ variant?: 'ghost' | 'secondary';`. A função desestrutura `icon`, `variant = 'ghost'`, `type = 'button'`, `className` e `...rest` e renderiza `<button {...rest} type={type} className={classes}>` com o `<span className={styles.icon} aria-hidden="true">{icon}</span>` (o `style`, o `ref` e o `aria-label` chegam pelo `...rest`). Importe `ComponentPropsWithRef` e `ReactNode` como tipos de `react`. Rode `pnpm vitest run src/icon-button` e `pnpm exec tsc --noEmit` (o `@ts-expect-error` precisa ser consumido) até passar.
7. `src/menu-button/menu-button.test.tsx` (criar): copie `../atria/packages/ui/src/menu-button/menu-button.test.tsx` e acrescente:
   - `it('wraps with ArrowUp and goes to the last item with End')`: abre o menu, `{ArrowUp}` foca `Excluir`, `{Home}` foca `Duplicar`, `{End}` foca `Excluir`;
   - `it('selects an item with Enter, calls onSelect and returns focus to the trigger')`: `Harness` próprio com `onSelect = vi.fn()` no item `Duplicar`; abre, `{Enter}`, `onSelect` chamado uma vez, menu fechado e foco no gatilho;
   - `it('closes on Tab and on a pointer down outside')`: abre, `{Tab}` fecha; abre de novo, `await userEvent.click(document.body)` fecha;
   - `it('renders href items as links')`: item `{ id: 'doc', label: 'Abrir', href: '/doc' }` vira `getByRole('menuitem', { name: 'Abrir' })` com `href="/doc"` e `tagName` `A`;
   - `it('ct13 forwards className, style, data attributes and ref to the root')`: `const ref = createRef<HTMLDivElement>()`; `<MenuButton label="Mais ações" trigger="Mais" items={[...]} className="extra" style={{ marginTop: 'var(--s2)' }} data-kind="actions" ref={ref} />`; o elemento `ref.current` é o pai do botão `Mais ações`, tem a classe `extra`, `marginTop` `var(--s2)` e `data-kind="actions"`.
   Rode `pnpm vitest run src/menu-button` e confira que falha.
8. `src/menu-button/menu-button.module.css` (criar): copie `../atria/packages/ui/src/menu-button/menu-button.module.css` e aplique a regra de troca de literais, inclusive `box-shadow: inset 0 0 0 2px var(--primary)` → `inset 0 0 0 calc(var(--space) / 2) var(--primary)`; o `z-index: 45` do menu e o `font-weight: 600` do gatilho viram tokens; `calc(100% + var(--space))` fica como está.
9. `src/menu-button/menu-button.tsx` (criar): copie `../atria/packages/ui/src/menu-button/menu-button.tsx` e mude:
   - `export interface MenuButtonProps extends Omit<ComponentPropsWithRef<'div'>, 'children'>`, com as props próprias do Atria (`label`, `menuLabel`, `trigger`, `items`, `placement`, `menuClassName`, `triggerClassName`) e JSDoc em cada uma (`items`: `/** Itens do menu, na ordem. */`; `placement`: `/** Posição do menu em relação ao botão. Padrão: `bottom-end`. */`); `className` sai da interface (vem das props nativas);
   - a função desestrutura também `style`, `ref` e `...rest`; o `<div>` raiz recebe `{...rest}`, `className`, `style` e `ref={root}`;
   - exponha o elemento raiz ao `ref` recebido com `useImperativeHandle(ref, () => root.current as HTMLDivElement, [])`, importado de `react` (o `root` interno continua sendo usado no clique fora);
   - importe `ComponentPropsWithRef` como tipo.
   Rode `pnpm vitest run src/menu-button` até passar.
10. Rode `pnpm exec prettier --write src/button src/icon-button src/menu-button` e a Verificação inteira; corrija até todos os comandos terminarem em 0.
