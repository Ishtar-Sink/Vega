### Ler

- `vostok/work/specs/refined/SPEC-003-lote-1-de-componentes-para-o-synestia.md` (RF-16 a RF-18, CT-16, CT-17, CB-06, RN-03, RNF-01, RNF-03, RNF-05, RNF-08, "Contratos e interfaces": `CalloutProps`)
- `vostok/work/tasks/SPEC-003/TASK-09/tecnico.md`
- `vostok/rules/project/code-style.md` ([project/code-style-08] e [project/code-style-09])
- `src/toast/toast.tsx` e `src/toast/toast.module.css` (ícone por tom e fundos `*-soft`, o padrão que o `Callout` segue sem sumir sozinho)
- `src/card/card.module.css` (raio, borda e espaçamento de superfície)
- `src/icons/interface-icons.tsx` (criado pela TASK-02: `InfoIcon`, `LightbulbIcon`, `CircleCheckIcon`, `AlertTriangleIcon` e `CircleAlertIcon`)
- `src/theme/tokens.ts` e `src/theme/contrast.ts` (teste de AA dos tons)

### Mudar

- `src/callout/callout.types.ts` (criar): `CalloutTone` e `CalloutProps`, com JSDoc em pt-br (RF-16 a RF-18).
- `src/callout/callout.constants.ts` (criar): `TONE_ICONS`, o ícone padrão de cada tom (RF-17).
- `src/callout/callout.tsx` (criar): `Callout` sobre `<aside>`, com título, ícone, ação e região viva opcional (RF-16 a RF-18).
- `src/callout/callout.module.css` (criar): tons com fundo `*-soft`, ícone e título na cor do tom, só com tokens (RF-16, RNF-01).
- `src/callout/callout.test.tsx` (criar): testes do `Callout` (CT-16, CT-17, CB-06, RNF-03, RNF-05).

### Passos

Regras comuns a todos os passos (decididas em `tecnico.md`, seção "Decisões"):

- Um contexto por arquivo ([project/code-style-09]) e até 200 linhas por arquivo de produção ([project/code-style-08]).
- Props nativas no `<aside>`: desestruture `className`, `style`, `ref`, `role` e `...rest` e aplique-os no `<aside>` raiz.
- CSS só com tokens, como nas outras tarefas de componente.
- Ícones de `../icons/interface-icons` (TASK-02), decorativos.

1. `src/callout/callout.test.tsx` (criar): testes por papel e nome:
   - `it.each(TONES)('renders the %s tone with its soft background and icon')` (CT-16), com `TONES = ['neutral', 'accent', 'info', 'success', 'warning', 'danger'] as const`: o `aside` tem a classe do tom e um `svg` com `aria-hidden="true"`, e o `svg` é o mesmo do ícone esperado (compare o `innerHTML` do `svg` renderizado com o de `render(<Icone />)` do ícone de `TONE_ICONS[tone]`, sem depender dos caminhos do Lucide).
   - `it('maps each tone to its default icon')` (RF-17): `TONE_ICONS` liga `neutral` e `info` a `InfoIcon`, `accent` a `LightbulbIcon`, `success` a `CircleCheckIcon`, `warning` a `AlertTriangleIcon` e `danger` a `CircleAlertIcon`.
   - `it('accepts a custom icon and removes it with false')` (CB-06): `icon={<span data-testid="meu" />}` aparece no lugar do padrão; com `icon={false}` não há `svg`, mas o título e a classe do tom ficam.
   - `it('renders the action at the end')`: `action={<button>Fazer backup</button>}` aparece depois do texto.
   - `it('names the aside by the title')`: com `title`, `getByRole('complementary', { name: 'Armadilha' })`.
   - `it('turns into a polite status only with live="polite"')` (CT-17): com `live="polite"`, `getByRole('status')` existe; sem `live`, `queryByRole('status')` é nulo e o papel é `complementary`.
   - `it('has no axe violations in every tone')` (RNF-03).
   - `it('passes className, style, data attributes and ref to the aside')`.
   - `it('meets AA on every tone in both themes')` (RNF-05): para `light` e `dark`, `contrastRatio` do tom sobre o `*Soft` (`accent`, `info`, `success`, `warning`, `danger`), de `text` sobre cada `*Soft` e de `text` sobre `surfaceMuted` (neutro) maior ou igual a 4.5.
   Confira: `pnpm vitest run src/callout` falha porque `./callout` não existe.
2. `src/callout/callout.types.ts` (criar): `export type CalloutTone = 'neutral' | 'accent' | 'info' | 'success' | 'warning' | 'danger';` e `CalloutProps` como na spec, com `tone?: CalloutTone`. Confira: tsc sem erro no arquivo.
3. `src/callout/callout.constants.ts` (criar): `export const TONE_ICONS: Record<CalloutTone, typeof InfoIcon>` com o mapa do passo 1. Confira: tsc sem erro no arquivo.
4. `src/callout/callout.tsx` (criar): `Callout` com `tone = 'neutral'` e `live = 'off'`. Gera `titleId` com `useId`. Renderiza `<aside {...rest} ref role={live === 'polite' ? 'status' : role} aria-labelledby={title ? titleId : undefined} className={[styles.root, styles[tone], className]} style>`; dentro, o ícone (`icon === false` nada; `icon` recebido num `<span aria-hidden="true" className={styles.icon}>`; senão `TONE_ICONS[tone]` com `className={styles.icon}`), um `<div className={styles.body}>` com o título (`<p id={titleId} className={styles.title}>`, se houver) e os `children`, e a `action` num `<div className={styles.action}>`. Confira: `pnpm vitest run src/callout` passa.
5. `src/callout/callout.module.css` (criar):
   - `.root`: `display: flex`, `flex-wrap: wrap`, `align-items: flex-start`, `gap: var(--s3)`, `padding: var(--s4)`, `border-radius: var(--radius-md)`, borda `calc(var(--space) / 4) solid transparent`, `color: var(--text)`, `font-family: var(--font-body)`, `line-height: var(--line-height-relaxed)`.
   - `.icon`: `flex: none`, `margin-top: calc(var(--space) / 2)`; `.body`: `flex: 1`, `min-width: 0`; `.title`: `margin: 0 0 var(--space)`, `font-family: var(--font-display)`, `font-weight: var(--font-weight-semibold)`; `.action`: `flex-basis: 100%` abaixo de 480 px e `margin-left: auto` acima (`@media (min-width: 480px)`).
   - Um bloco por tom: `.neutral` com `background: var(--surface-muted)` e borda `var(--border)`; `.accent`, `.info`, `.success`, `.warning` e `.danger` com `background: var(--<tom>-soft)`, e `.<tom> .icon, .<tom> .title { color: var(--<tom>); }`.
   Confira: `pnpm vitest run src/callout` passa.
6. Pasta da tarefa: rode `pnpm exec prettier --write src/callout` e depois a Verificação inteira. Confira: todos os comandos terminam com código 0.
