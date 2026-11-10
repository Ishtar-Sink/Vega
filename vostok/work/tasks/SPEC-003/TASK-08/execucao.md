### Ler

- `vostok/work/specs/refined/SPEC-003-lote-1-de-componentes-para-o-synestia.md` (RF-13 a RF-15, CT-13 a CT-15, CB-05, FA-03, RNF-01 a RNF-05, RNF-08, decisão 8 (inferência C), "Contratos e interfaces": `DisclosureProps` e `AccordionProps`)
- `vostok/work/tasks/SPEC-003/TASK-08/tecnico.md`
- `vostok/rules/project/code-style.md` ([project/code-style-08] e [project/code-style-09])
- `src/card/card.module.css` e `src/card/card.tsx` (tons e superfície usados como base visual)
- `src/icons/interface-icons.tsx` (criado pela TASK-02: `ChevronDownIcon`)
- `src/theme/tokens.css` (bloco `@media (prefers-reduced-motion: reduce)`, que zera os `--motion-*`)
- `src/theme/tokens.ts` e `src/theme/contrast.ts` (teste de AA dos tons)

### Mudar

- `src/disclosure/disclosure.types.ts` (criar): `DisclosureTone`, `DisclosureProps` e `AccordionProps`, com JSDoc em pt-br (RF-13, RF-15).
- `src/disclosure/accordion-context.ts` (criar): contexto do `Accordion` (nome do grupo e aviso de abertura) lido pelo `Disclosure` (RF-15).
- `src/disclosure/use-disclosure.ts` (criar): hook do estado controlado e não controlado, do teclado no resumo e do aviso ao `Accordion` (RF-14, RF-15).
- `src/disclosure/disclosure.tsx` (criar): `Disclosure` sobre `<details>` e `<summary>` (RF-13, RF-14).
- `src/disclosure/accordion.tsx` (criar): `Accordion` `single` e `multiple`, com o fallback do `name` (RF-15, FA-03).
- `src/disclosure/disclosure.module.css` (criar): resumo, seta, tons e animação de abertura, só com tokens (RF-13, RNF-02, RNF-04).
- `src/disclosure/disclosure.test.tsx` (criar): testes do `Disclosure` (CT-13, CT-14, CB-05, RNF-02 a RNF-05).
- `src/disclosure/accordion.test.tsx` (criar): testes do `Accordion` (CT-15).

### Passos

Regras comuns a todos os passos (decididas em `tecnico.md`, seção "Decisões"):

- Um contexto por arquivo ([project/code-style-09]) e até 200 linhas por arquivo de produção ([project/code-style-08]).
- Props nativas no `<details>`: desestruture `className`, `style`, `ref` e `...rest` (sem `title`, `open` e `onToggle`, que o componente redefine) e aplique-os no `<details>` raiz.
- CSS só com tokens, como nas outras tarefas de componente; transições só com `var(--motion-fast)` e `var(--motion-base)`.
- Ícones de `../icons/interface-icons` (TASK-02), decorativos.
- O jsdom alterna o `<details>` no clique do `<summary>` e dispara `toggle`, mas não ativa o resumo por Enter ou Espaço nem implementa o atributo `name` (conferido no planejamento). Por isso o teclado e a exclusividade do `single` são feitos pelo componente (D-02 e D-03).

1. `src/disclosure/disclosure.test.tsx` (criar): testes por papel e nome:
   - `it('renders a native details with the summary as the title')`: o `summary` tem o texto do `title`, o `icon` aparece com `aria-hidden` e o `details` tem a classe do `tone`.
   - `it('opens and closes uncontrolled by click and keyboard')` (CT-13): clique no resumo abre (`details.open` verdadeiro, conteúdo visível); foco no resumo e `{Enter}` fecha; `' '` (Espaço) abre de novo; `onOpenChange` recebe `true`, `false` e `true`.
   - `it('respects defaultOpen')`: `defaultOpen` começa aberto.
   - `it('stays as received when controlled')` (CT-14): `open={true}` com `onOpenChange` espião; o clique no resumo chama `onOpenChange(false)` e o `details` continua aberto até o pai mudar a prop.
   - `it('keeps the received open without onOpenChange')` (CB-05): `open={true}` sem `onOpenChange`; clique e Enter não fecham.
   - `it('has no axe violations')` aberto e fechado.
   - `it('passes className, style, data attributes and ref to the details')`.
   - `it('keeps the summary at least 44 px tall')` (RNF-02): o CSS tem `min-height: calc(var(--space) * 11)` em `.summary`.
   - `it('animates only with motion tokens and stops with reduced motion')` (RNF-04): toda `transition` usa `var(--motion-`, e há `@media (prefers-reduced-motion: reduce)` com `transition: none`.
   - `it('meets AA on the tone backgrounds in both themes')` (RNF-05): `contrastRatio` de `accent`/`accentSoft`, `warning`/`warningSoft`, `info`/`infoSoft` e `text`/`surface` maior ou igual a 4.5 em `light` e `dark`.
   `src/disclosure/accordion.test.tsx` (criar):
   - `it('closes the others in single mode')` (CT-15): três `Disclosure` num `Accordion type="single"`; abrir o primeiro e depois o segundo deixa só o segundo aberto (`await waitFor`, porque o `toggle` é assíncrono); os três `details` têm o mesmo atributo `name`.
   - `it('keeps them independent in multiple mode')`: `type="multiple"`, os dois ficam abertos e o `name` não é aplicado.
   - `it('passes className, style, data attributes and ref to the root')`.
   Confira: `pnpm vitest run src/disclosure` falha porque `./disclosure` e `./accordion` não existem.
2. `src/disclosure/disclosure.types.ts` (criar): `export type DisclosureTone = 'default' | 'accent' | 'warning' | 'info';`, `DisclosureProps` como na spec mais `defaultOpen?: boolean` (estado inicial quando não controlado; prop própria, porque o `<details>` não tem `defaultOpen` nas props nativas do React) e `AccordionProps` como na spec. Confira: tsc sem erro no arquivo.
3. `src/disclosure/accordion-context.ts` (criar): `export const AccordionContext = createContext<{ name: string; onOpen: (details: HTMLDetailsElement) => void } | null>(null);` com um comentário em pt-br explicando que só o `single` fornece o contexto. Confira: tsc sem erro no arquivo.
4. `src/disclosure/use-disclosure.ts` (criar): `useDisclosure({ open, defaultOpen, onOpenChange })` devolve `{ detailsProps, summaryProps }`:
   - Controlado (`open !== undefined`): `detailsProps.open = open`; no `onClick` do resumo, `event.preventDefault()` e `onOpenChange?.(!open)`.
   - Não controlado: `detailsProps.open` só na primeira renderização (`defaultOpen`), e o `onToggle` do `<details>` chama `onOpenChange?.(event.currentTarget.open)` e, se aberto, `accordion?.onOpen(event.currentTarget)`.
   - `summaryProps.onKeyDown`: em `Enter` ou `' '`, `event.preventDefault()` e o mesmo efeito do clique (controlado: `onOpenChange?.(!open)`; não controlado: `details.open = !details.open`, que dispara o `toggle`).
   Confira: tsc sem erro no arquivo.
5. `src/disclosure/disclosure.tsx` (criar): `<details {...rest} ref className={[styles.root, styles[tone], className]} style name={accordion?.name} {...detailsProps}>` com `<summary className={styles.summary} {...summaryProps}>` contendo o `icon` (`<span aria-hidden="true" className={styles.icon}>`), o `title` (`<span className={styles.title}>`) e o `ChevronDownIcon` (`className={styles.chevron}`), seguido de `<div className={styles.content}>{children}</div>`. `tone = 'default'`. Confira: `pnpm vitest run src/disclosure/disclosure.test.tsx` passa.
6. `src/disclosure/accordion.tsx` (criar): `Accordion` com `type = 'multiple'`, `<div {...rest} ref className style>`; no `single`, gera `name` com `useId` e fornece `AccordionContext` com `onOpen(details)`, que fecha os outros `details[open]` do mesmo `name` dentro da raiz (`ref` interno com `useImperativeHandle`, como o `Dialog`). Confira: `pnpm vitest run src/disclosure` passa.
7. `src/disclosure/disclosure.module.css` (criar):
   - `.root`: borda `calc(var(--space) / 4) solid var(--border)`, `border-radius: var(--radius-md)`, `background: var(--surface)`, `interpolate-size: allow-keywords`.
   - `.summary`: `display: flex`, `align-items: center`, `gap: var(--s2)`, `min-height: calc(var(--space) * 11)`, `padding: 0 var(--s4)`, `cursor: pointer`, `list-style: none`, sem o marcador nativo (`.summary::-webkit-details-marker { display: none; }`), com o anel de foco em `:focus-visible`.
   - `.chevron`: `margin-left: auto` e `transition: transform var(--motion-fast) var(--motion-ease-standard)`; `.root[open] .chevron`: `transform: rotate(180deg)`.
   - `.content`: `padding: 0 var(--s4) var(--s4)`.
   - `.root::details-content`: `height: 0`, `overflow: clip`, `transition: height var(--motion-base) var(--motion-ease-standard), content-visibility var(--motion-base) allow-discrete`; `.root[open]::details-content`: `height: auto`.
   - `.accent`, `.warning` e `.info`: fundo `*-soft` do tom, título e ícone na cor do tom.
   - `@media (prefers-reduced-motion: reduce)` com `.chevron, .root::details-content { transition: none; }`.
   Confira: `pnpm vitest run src/disclosure` passa.
8. Pasta da tarefa: rode `pnpm exec prettier --write src/disclosure` e depois a Verificação inteira. Confira: todos os comandos terminam com código 0.
