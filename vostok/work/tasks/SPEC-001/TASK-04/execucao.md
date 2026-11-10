### Ler

- `vostok/work/specs/refined/SPEC-001-extrair-os-componentes-do-atria-para-a-vega.md`: RF-10, RF-19, RF-20, RNF-01, RNF-02, RNF-06, RN-01, RN-02, CT-09, CT-12 e CT-13.
- `vostok/work/tasks/SPEC-001/TASK-04/tecnico.md`: decisões desta tarefa (elemento que recebe as props nativas, `ref`, textos padrão, troca dos literais).
- `vostok/rules/project/code-style.md`, `vostok/rules/project/accessibility.md`, `vostok/rules/project/testing.md`, `vostok/rules/project/language.md` e `vostok/rules/project/naming-convention.md`.
- `../atria/packages/ui/src/text-field/` (`text-field.tsx`, `text-field.module.css`, `text-field.test.tsx`): origem do `TextField` (somente leitura).
- `../atria/packages/ui/src/select-field/` (`select-field.tsx`, `select-field.module.css`, `select-field.test.tsx`): origem do `SelectField`.
- `../atria/packages/ui/src/checkbox/` (`checkbox.tsx`, `checkbox.module.css`, `checkbox.test.tsx`): origem do `Checkbox`.
- `../atria/packages/ui/src/segmented-field/` (`segmented-field.tsx`, `segmented-field.module.css`, `segmented-field.test.tsx`): origem do `SegmentedField`.
- `../atria/packages/ui/src/autocomplete/` (`autocomplete.tsx`, `autocomplete.module.css`, `autocomplete.test.tsx`): origem do `Autocomplete`.
- `../atria/packages/ui/src/tag-field/` (`tag-field.tsx`, `tag-field.module.css`, `tag-field.test.tsx`): origem do `TagField`.
- `../atria/packages/ui/src/test/setup.ts`: o mock de `scrollIntoView` que o `SelectField` e o `Autocomplete` precisam no jsdom.
- `src/theme/tokens.css` (criado pela TASK-02): nomes das variáveis disponíveis.
- `vite.config.ts` e `src/test/setup.ts` (criados pela TASK-01): ambiente do Vitest.

### Mudar

- `src/text-field/text-field.test.tsx` (criar): testes do `TextField` trazidos do Atria e completados (RF-10, RF-20, CT-09, CT-13).
- `src/text-field/text-field.module.css` (criar): estilos só com tokens (RNF-02).
- `src/text-field/text-field.tsx` (criar): `TextField` com `ComponentPropsWithRef<'input'>` (RF-10, RF-20).
- `src/select-field/select-field.test.tsx` (criar): testes do `SelectField` (RF-10, RF-20, CT-09, CT-13).
- `src/select-field/select-field.module.css` (criar): estilos só com tokens (RNF-02).
- `src/select-field/select-field.tsx` (criar): `SelectField` com as props nativas do `<button>` gatilho (RF-10, RF-20).
- `src/checkbox/checkbox.test.tsx` (criar): testes do `Checkbox` (RF-10, RF-20, CT-09, CT-13).
- `src/checkbox/checkbox.module.css` (criar): estilos só com tokens (RNF-02).
- `src/checkbox/checkbox.tsx` (criar): `Checkbox` com `ComponentPropsWithRef<'input'>` (RF-10, RF-20).
- `src/segmented-field/segmented-field.test.tsx` (criar): testes do `SegmentedField` (RF-10, RF-20, CT-09, CT-13).
- `src/segmented-field/segmented-field.module.css` (criar): estilos só com tokens (RNF-02).
- `src/segmented-field/segmented-field.tsx` (criar): `SegmentedField` com `ComponentPropsWithRef<'fieldset'>` (RF-10, RF-20).
- `src/autocomplete/autocomplete.test.tsx` (criar): testes do `Autocomplete`, inclusive textos padrão e sobrescritos (RF-10, RF-19, RF-20, CT-09, CT-12, CT-13).
- `src/autocomplete/autocomplete.module.css` (criar): estilos só com tokens (RNF-02).
- `src/autocomplete/autocomplete.tsx` (criar): `Autocomplete` com as props nativas do `<input>` e textos com padrão em pt-br (RF-10, RF-19, RF-20).
- `src/tag-field/tag-field.test.tsx` (criar): testes do `TagField`, inclusive textos padrão e sobrescritos (RF-10, RF-19, RF-20, CT-09, CT-12, CT-13).
- `src/tag-field/tag-field.module.css` (criar): estilos só com tokens (RNF-02).
- `src/tag-field/tag-field.tsx` (criar): `TagField` com as props nativas do `<input>` e textos com padrão em pt-br (RF-10, RF-19, RF-20).

### Passos

Regras usadas em todos os componentes desta tarefa (decisões do `tecnico.md`):

- **Troca de literais nos `.module.css`:** `1px` → `calc(var(--space) / 4)` (inclusive `letter-spacing: 1px`), `2px` → `calc(var(--space) / 2)`; `font-size: 15px` do `.option` do `SelectField` → `var(--font-size-base)`; `font-weight: 600` → `var(--font-weight-semibold)`; `z-index: 40` (lista do `SelectField` e do `Autocomplete`) → `var(--z-dropdown)` (tokens criados pela TASK-02, decisão do usuário); porcentagens, `transparent` e `currentColor` ficam como estão. Esta tarefa não cria token.
- **Elemento das props nativas:** `className`, `style` e `...rest` (com `ref`, `data-*` e `aria-*`) vão para o controle nativo cujas props o componente estende (`<input>`, `<button>` gatilho ou `<fieldset>`); o `<div>` de fora fica só com a classe do módulo. O `className` recebido é somado à classe do controle (`[styles.control, className].filter(Boolean).join(' ')`).
- **`aria-describedby` e `aria-invalid` recebidos:** desestruture `'aria-describedby': describedByProp` e `'aria-invalid': ariaInvalid`; o controle recebe `aria-describedby={[describedByProp, help ? helpId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined}` e `aria-invalid={error ? true : ariaInvalid}`. O erro continua num `<p id={errorId} role="alert">`.
- **`ref` com `ref` interno:** quando o componente já usa um `useRef` no controle, ligue o `ref` recebido com `useImperativeHandle(ref, () => control.current as HTMLX, [])` (sem utilitário compartilhado); sem `ref` interno, o `ref` chega pelo `...rest`.
- **Handlers internos prevalecem:** o `...rest` é espalhado antes dos atributos e handlers que o componente define (`id`, `type`, `value`, `onChange`, `onKeyDown`, `onClick`, `onBlur`, `role`, `aria-*` de combobox/listbox).
- **Testes:** cada `.test.tsx` traz o do Atria; os nomes perdem prefixos de IDs do Atria (`ct16 `, `cb10 `); `join(import.meta.dirname, ...)` no lugar de `__dirname`; o teste CT-13 de cada componente usa `const ref = createRef<HTMLX>()` e confere, no elemento das props nativas, a classe `extra` somada à do módulo, `style.marginTop` igual a `var(--s2)`, `data-kind` e `ref.current`. No `select-field.test.tsx` e no `autocomplete.test.tsx`, acrescente no topo `beforeAll(() => { Element.prototype.scrollIntoView = vi.fn(); });` (o jsdom não implementa a rolagem; o mock local evita depender do setup).

1. `src/text-field/text-field.test.tsx` (criar): copie o do Atria e acrescente `it('types with the keyboard after tabbing in')` (`user.tab()`, foco no campo `Nome`, `user.keyboard('Ana')`, valor `Ana`), `it('ct13 forwards className, style, data attributes and ref to the input')` e `it('keeps an external aria-describedby with the help')` (`aria-describedby="externo"` com um `<p id="externo">Dica</p>` irmão e `help="Ajuda"`: a descrição acessível é `Dica Ajuda`). Rode `pnpm vitest run src/text-field` e confira que falha.
2. `src/text-field/text-field.module.css` (criar): copie o do Atria com a troca de literais.
3. `src/text-field/text-field.tsx` (criar): `export interface TextFieldProps extends ComponentPropsWithRef<'input'>` com `/** Rótulo visível do campo. */ label: string;`, `/** Texto de ajuda abaixo do campo. */ help?: string;` e `/** Mensagem de erro; aparece com `role="alert"` e marca o campo como inválido. */ error?: string;` (`id` vem das props nativas). Aplique as regras acima; sem `useRef` interno, o `ref` vai pelo `...rest`. Rode `pnpm vitest run src/text-field` até passar.
4. `src/checkbox/checkbox.test.tsx` (criar): copie o do Atria e acrescente `it('ct13 forwards className, style, data attributes and ref to the input')` e `it('is labelled by the label prop and toggles on click')`. Rode `pnpm vitest run src/checkbox` e confira que falha.
5. `src/checkbox/checkbox.module.css` (criar): copie o do Atria com a troca de literais.
6. `src/checkbox/checkbox.tsx` (criar): `export interface CheckboxProps extends Omit<ComponentPropsWithRef<'input'>, 'type'>` com `/** Rótulo visível ao lado da caixa. */ label: string;`. `className`, `style` e `...rest` no `<input type="checkbox">`. Rode `pnpm vitest run src/checkbox` até passar.
7. `src/segmented-field/segmented-field.test.tsx` (criar): copie o do Atria e acrescente `it('moves back with ArrowLeft and reaches the group with Tab')`, `it('shows the error with role alert linked to the group')` (`error="Escolha um tipo"`: `getByRole('alert')` com o texto e o `<fieldset>` com `aria-describedby` apontando o id do alerta) e `it('ct13 forwards className, style, data attributes and ref to the fieldset')` (o elemento é `getByRole('group', { name: 'Tipo' })`). Rode `pnpm vitest run src/segmented-field` e confira que falha.
8. `src/segmented-field/segmented-field.module.css` (criar): copie o do Atria com a troca de literais.
9. `src/segmented-field/segmented-field.tsx` (criar): `export interface SegmentedFieldProps extends Omit<ComponentPropsWithRef<'fieldset'>, 'onChange' | 'onBlur' | 'children'>` com as props do Atria (`label`, `options`, `value`, `onChange: (value: string) => void`, `onBlur?: () => void`, `name`, `error`, `help`) e JSDoc em cada uma; `className` sai da interface. O `<fieldset>` recebe `{...rest}`, `className={[styles.root, className]...}`, `style` e o `aria-describedby` somado; `name` continua indo só para os rádios. Mantenha `SegmentedOption`. Rode `pnpm vitest run src/segmented-field` até passar.
10. `src/select-field/select-field.test.tsx` (criar): copie o do Atria (com o `beforeAll` do `scrollIntoView`) e acrescente `it('ct13 forwards className, style, data attributes and ref to the trigger')` (o elemento é `getByRole('button', { name: /Tipo/ })`) e `it('shows the placeholder when no option matches the value')` (`value=""` e `placeholder="Selecione"`: o botão é nomeado `Tipo Selecione`). Rode `pnpm vitest run src/select-field` e confira que falha.
11. `src/select-field/select-field.module.css` (criar): copie o do Atria com a troca de literais (inclusive o `font-size: 15px`).
12. `src/select-field/select-field.tsx` (criar): `export interface SelectFieldProps extends Omit<ComponentPropsWithRef<'button'>, 'value' | 'onChange' | 'onBlur' | 'children' | 'type'>` com `label`, `help`, `error`, `options: readonly SelectOption[]`, `value: string`, `onChange: (value: string) => void`, `onBlur?: () => void` e `placeholder?: string`, com JSDoc (`id`, `name` e `disabled` vêm das props nativas e são desestruturados: `name` vai só para o `<input type="hidden">`). O `<button>` gatilho recebe `{...rest}` antes dos atributos próprios, `className={[styles.control, className]...}` e `style`; ligue o `ref` com `useImperativeHandle(ref, () => trigger.current as HTMLButtonElement, [])`. Mantenha `SelectOption`, `TYPE_AHEAD_MS` e `SETTLE_MS`. Rode `pnpm vitest run src/select-field` até passar.
13. `src/autocomplete/autocomplete.test.tsx` (criar): copie o do Atria (com o `beforeAll` do `scrollIntoView`), troque `empty_text` por `emptyText`, `list_label` por `listLabel` e `remove_label` por `removeLabel`, tire os prefixos `ct16 ` e `cb10 ` e acrescente:
    - `it('uses the pt-br default texts')`: `Single` e `Multiple` sem `emptyText`, `listLabel` e `removeLabel` (crie as variantes `SingleDefaults`/`MultipleDefaults` no teste); digitar `zzz` mostra `getByRole('status')` com `Nenhuma opção encontrada`; no múltiplo com `['moradia']`, a lista é `getByRole('list', { name: 'Categoria escolhidas' })` e o botão `Remover Moradia` existe;
    - `it('ct12 shows the overridden texts')`: `emptyText="No option found"`, `listLabel="Chosen categories"` e `removeLabel={(label) => \`Remove ${label}\`}`: `No option found`, a lista `Chosen categories` e o botão `Remove Moradia`;
    - `it('ct13 forwards className, style, data attributes and ref to the input')` (o elemento é o `combobox`).
    Rode `pnpm vitest run src/autocomplete` e confira que falha.
14. `src/autocomplete/autocomplete.module.css` (criar): copie o do Atria com a troca de literais.
15. `src/autocomplete/autocomplete.tsx` (criar): copie o do Atria e mude:
    - `interface AutocompleteBaseProps<T> extends Omit<ComponentPropsWithRef<'input'>, 'value' | 'defaultValue' | 'onChange' | 'onBlur' | 'multiple' | 'type' | 'role' | 'children'>`, com `label`, `options`, `help`, `error`, `onBlur?: () => void` e, opcionais com JSDoc do padrão, `emptyText?: string` (padrão `Nenhuma opção encontrada`), `listLabel?: string` (padrão `` `${label} escolhidas` ``, só no modo múltiplo) e `removeLabel?: (label: string) => string` (padrão `` (label) => `Remover ${label}` ``, só no modo múltiplo); `listLabel` e `removeLabel` saem de `AutocompleteMultipleProps` e vão para a base, para o `...rest` ser tirado da base;
    - constantes `const DEFAULT_EMPTY_TEXT = 'Nenhuma opção encontrada';` e `const defaultRemoveLabel = (label: string) => \`Remover ${label}\`;` no módulo;
    - o `...rest` repassado ao `<input>` não contém `multiple`, `value`, `onChange`, `onBlur`, `label`, `options`, `help`, `error`, `name`, `emptyText`, `listLabel`, `removeLabel`, `className`, `style` nem `ref`; `className` somado ao `styles.control`, `style` no `<input>` e `useImperativeHandle(ref, () => input.current as HTMLInputElement, [])`;
    - mantenha as duas sobrecargas, `normalize` e o comentário do topo, trocando "porque as categorias têm nome livre" por "porque as opções podem ter nome livre".
    Rode `pnpm vitest run src/autocomplete` até passar.
16. `src/tag-field/tag-field.test.tsx` (criar): copie o do Atria, troque `list_label` por `listLabel` e `remove_label` por `removeLabel`, renomeie `uses the prototype spacing between field, pills and help` para `keeps the spacing between field, pills and help`, e acrescente `it('uses the pt-br default texts')` (sem `listLabel`/`removeLabel`, com `initial={['a']}`: a lista `Etiquetas adicionadas` e o botão `Remover a`), `it('ct12 shows the overridden texts')` (`listLabel="Added tags"`, `removeLabel={(tag) => \`Remove ${tag}\`}`) e `it('ct13 forwards className, style, data attributes and ref to the input')`. Rode `pnpm vitest run src/tag-field` e confira que falha.
17. `src/tag-field/tag-field.module.css` (criar): copie o do Atria com a troca de literais, sem mudar `gap: var(--s1)`, `margin: var(--s2) 0 0` e `margin: 0` (o teste de espaçamento lê esses blocos).
18. `src/tag-field/tag-field.tsx` (criar): `export interface TagFieldProps extends Omit<ComponentPropsWithRef<'input'>, 'value' | 'defaultValue' | 'onChange' | 'onBlur' | 'type'>` com `label`, `value: readonly string[]`, `onChange: (value: string[]) => void`, `onBlur?: () => void`, `help`, `error` e, com JSDoc do padrão, `listLabel?: string` (padrão `` `${label} adicionadas` ``) e `removeLabel?: (tag: string) => string` (padrão `` (tag) => `Remover ${tag}` ``). `className`, `style` e `...rest` no `<input>`; `useImperativeHandle(ref, () => input.current as HTMLInputElement, [])`. Rode `pnpm vitest run src/tag-field` até passar.
19. Rode `pnpm exec prettier --write src/text-field src/select-field src/checkbox src/segmented-field src/autocomplete src/tag-field` e a Verificação inteira; corrija até todos os comandos terminarem em 0.
