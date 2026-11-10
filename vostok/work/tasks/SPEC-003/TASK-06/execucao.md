### Ler

- `vostok/work/specs/refined/SPEC-003-lote-1-de-componentes-para-o-synestia.md` (RF-05 a RF-09, CT-05 a CT-09, CB-02, CB-03, RN-02, RN-03, RNF-01 a RNF-05, RNF-08, "Contratos e interfaces": `RadioOption` e `RadioGroupProps`)
- `vostok/work/tasks/SPEC-003/TASK-06/tecnico.md`
- `vostok/rules/project/code-style.md` ([project/code-style-08] e [project/code-style-09])
- `src/segmented-field/segmented-field.tsx`, `src/segmented-field/segmented-field.module.css` e `src/segmented-field/segmented-field.test.tsx` (padrão de `<fieldset>`, rádios nativos, setas, ajuda e erro)
- `src/text-field/text-field.module.css` (classes `.label`, `.help` e `.error`, que o grupo repete)
- `src/icons/interface-icons.tsx` (criado pela TASK-02: `CheckIcon`, `CircleCheckIcon` e `CircleAlertIcon`)
- `src/theme/tokens.ts` e `src/theme/contrast.ts` (`contrastRatio`, para o teste de AA dos tons)
- `src/badge/badge.tsx` (usado só no print, como `adornment`)
- `../atria/apps/web/src/features/journal/emotion-picker.tsx` (rádio em cartão no Atria, só como referência visual)

### Mudar

- `src/radio-group/radio-group.types.ts` (criar): `RadioOption`, `RadioTone` e `RadioGroupProps`, com JSDoc em pt-br (RF-05, RF-06).
- `src/radio-group/radio-group.constants.ts` (criar): `TONE_ICONS`, o ícone de cada tom (RF-06, RN-03).
- `src/radio-group/radio-option.tsx` (criar): subcomponente de uma opção (rádio nativo, marcador, rótulo, descrição, ícone de confere ou do tom e `adornment`) (RF-06, RF-07).
- `src/radio-group/radio-group.tsx` (criar): `RadioGroup` com `<fieldset>`, `<legend>`, grupo `radiogroup`, ajuda, erro e `readOnly` (RF-05, RF-08, RF-09).
- `src/radio-group/radio-group.module.css` (criar): variantes `default` e `card`, tons e foco, só com tokens (RF-07, RNF-02, RNF-04).
- `src/radio-group/radio-group.test.tsx` (criar): testes do `RadioGroup` (CT-05 a CT-09, CB-02, CB-03, RNF-02 a RNF-05).

### Passos

Regras comuns a todos os passos (decididas em `tecnico.md`, seção "Decisões"):

- Um contexto por arquivo ([project/code-style-09]): o componente só no `.tsx`, tipos no `.types.ts`, o mapa de ícones no `.constants.ts`; cada arquivo de produção com até 200 linhas ([project/code-style-08]).
- Props nativas no `<fieldset>`: desestruture `className`, `style`, `ref`, `aria-describedby` e `...rest` e aplique-os no `<fieldset>` raiz (`className` concatenado com `styles.root`). JSDoc em pt-br em cada prop pública.
- CSS só com tokens: medidas em `calc(var(--space) * N)` ou `var(--sN)`, bordas `calc(var(--space) / 4)`, foco `outline: calc(var(--space) / 2) solid var(--primary)` com `outline-offset: calc(var(--space) / 4)`, transições com `var(--motion-fast) var(--motion-ease-standard)`. Nenhum `px`, `ms`, cor, peso, entrelinha ou `z-index` literal.
- Ícones importados de `../icons/interface-icons` (TASK-02), sempre decorativos.

1. `src/radio-group/radio-group.test.tsx` (criar): escreva, com um `Harness` controlado (`useState<string | null>`), os testes por papel e nome acessível:
   - `it('renders a fieldset with the legend and native radios')`: `getByRole('group', { name: 'Questão' })` e `getAllByRole('radio')` com o número de opções.
   - `it('hides the legend visually but keeps the name with hideLabel')`: a legenda tem a classe `srOnly` e o grupo continua com o nome.
   - `it('moves the choice with the arrow keys')` (CT-05): foca a primeira opção, `{ArrowDown}`, a segunda fica marcada e `onChange` é chamado com o valor dela.
   - `it('reaches the first enabled option with Tab when value is null')` (CB-02): `value={null}`, a primeira opção `disabled`; `user.tab()` foca a segunda.
   - `it('renders description, marker, tone and adornment')` (CT-06): os textos de `description` e `marker` e o `adornment` aparecem; a opção com `tone="success"` e a com `tone="danger"` têm um `svg` com `aria-hidden="true"` e a classe do tom; a `neutral` não tem ícone de tom.
   - `it('selects by clicking anywhere on the card')` (CT-07): `variant="card"`, `user.click` no elemento `label` da opção (fora do texto, pelo `closest('label')`); a opção fica marcada e o ícone de confere aparece só nela.
   - `it('keeps the choice with readOnly')` (CT-08, CB-03): `readOnly`, `{ArrowDown}` e clique em outra opção não mudam o rádio marcado nem chamam `onChange`; o `radiogroup` tem `aria-readonly="true"` e as opções continuam no papel `radio`.
   - `it('links help and error to the group')` (CT-09): `help` e `error`; o erro tem `role="alert"` e os dois ids estão no `aria-describedby` do `<fieldset>`.
   - `it('has no axe violations in both variants')`: axe sem violações em `default` e em `card` com erro.
   - `it('passes className, style, data attributes and ref to the fieldset')`.
   - `it('keeps the touch target at least 44 px')` (RNF-02): lê `radio-group.module.css` e confere `min-height: calc(var(--space) * 11)` em `.option`.
   - `it('animates only with motion tokens and stops with reduced motion')` (RNF-04): no CSS, toda `transition` usa `var(--motion-` e existe `@media (prefers-reduced-motion: reduce)` com `transition: none`.
   - `it('meets AA on the tone backgrounds in both themes')` (RNF-05): para `light` e `dark`, `contrastRatio(t.success, t.successSoft)`, `contrastRatio(t.danger, t.dangerSoft)`, `contrastRatio(t.text, t.surfaceMuted)` e `contrastRatio(t.primary, t.primarySoft)` maiores ou iguais a 4.5.
   Confira: `pnpm vitest run src/radio-group` falha porque `./radio-group` não existe.
2. `src/radio-group/radio-group.types.ts` (criar): `export type RadioTone = 'success' | 'danger' | 'neutral';`, `RadioOption` e `RadioGroupProps` exatamente como em "Contratos e interfaces" da spec, com `RadioGroupProps extends Omit<ComponentPropsWithRef<'fieldset'>, 'onChange' | 'children'>`. Confira: `pnpm exec tsc --noEmit` sem erro em `src/radio-group/radio-group.types.ts`.
3. `src/radio-group/radio-group.constants.ts` (criar): `export const TONE_ICONS: Record<Exclude<RadioTone, 'neutral'>, typeof CheckIcon> = { success: CircleCheckIcon, danger: CircleAlertIcon };`, com os três ícones importados de `../icons/interface-icons` (o tipo vem do próprio ícone, sem depender de onde a TASK-02 declara `IconProps`). Confira: tsc sem erro no arquivo.
4. `src/radio-group/radio-option.tsx` (criar): `RadioOptionItem` recebe a opção, `name`, `checked`, `variant`, `readOnly`, `describedBy` e `onSelect`. Renderiza `<label className={[styles.option, styles[variant], tone ? styles[tone] : '', checked ? styles.checked : ''].join(' ')}>` com o `<input type="radio" className={styles.input}>` nativo (`checked`, `disabled`, `value`, `onChange={() => readOnly ? undefined : onSelect(value)}`), o `marker` num `<span className={styles.marker}>`, o rótulo e a `description` num `<span className={styles.text}>`, o ícone do tom (`TONE_ICONS[tone]` com `className={styles.toneIcon}`) quando o tom é `success` ou `danger`, o `CheckIcon` (`className={styles.check}`) quando `checked` e `variant === 'card'`, e o `adornment` no fim. Confira: tsc sem erro no arquivo.
5. `src/radio-group/radio-group.tsx` (criar): `RadioGroup` com `variant = 'default'`; gera ids com `useId` (`name ?? generated`, `-legend`, `-help`, `-error`); monta `aria-describedby` como o `SegmentedField`. Estrutura: `<fieldset {...rest} ref className style aria-describedby>` → `<legend id className={hideLabel ? styles.srOnly : styles.legend}>` → `<div role="radiogroup" aria-labelledby={legendId} aria-readonly={readOnly || undefined} aria-invalid={error ? true : undefined} className={styles.options}>` com um `RadioOptionItem` por opção → ajuda (`<p id className={styles.help}>`) → erro (`<p id role="alert" className={styles.error}>`). Com `readOnly`, o `onSelect` não chama `onChange` (o React restaura o rádio controlado). Confira: tsc sem erro no arquivo.
6. `src/radio-group/radio-group.module.css` (criar):
   - `.root`: o `fieldset` sem borda, `display: flex`, `flex-direction: column`, `gap: var(--space)`.
   - `.legend`, `.help` e `.error`: os mesmos estilos de `text-field.module.css`; `.srOnly`: o padrão visualmente oculto do `toast.module.css`.
   - `.options`: coluna com `gap: var(--s2)`.
   - `.option`: `display: flex`, `align-items: center`, `gap: var(--s3)`, `min-height: calc(var(--space) * 11)`, `cursor: pointer`.
   - `.card`: `box-sizing: border-box`, `width: 100%`, `padding: var(--s3) var(--s4)`, borda `calc(var(--space) / 4) solid var(--border)`, `border-radius: var(--radius-md)`, `background: var(--surface)`, transição de borda e fundo.
   - `.card.checked`: `border-color: var(--primary)`, `background: var(--primary-soft)`.
   - `.card:has(.input:focus-visible)` e `.input:focus-visible`: o anel de foco.
   - `.input`: visualmente oculto só na variante `card` (`.card .input`).
   - `.success`, `.danger` e `.neutral`: fundo `var(--success-soft)`, `var(--danger-soft)` e `var(--surface-muted)`, e borda `var(--success)` e `var(--danger)` com `border-width: calc(var(--space) / 2)` nos dois primeiros; `.toneIcon` na cor do tom.
   - `.marker`: quadrado de `calc(var(--space) * 7)`, `border-radius: var(--radius-sm)`, `background: var(--surface-muted)`, `font-weight: var(--font-weight-bold)`.
   - `.description`: `font-size: var(--font-size-sm)`, `color: var(--text-muted)`.
   - `.check`: `margin-left: auto`, `color: var(--primary)`.
   - `@media (prefers-reduced-motion: reduce)` com `.option { transition: none; }`.
   Confira: `pnpm vitest run src/radio-group` passa.
7. Pasta da tarefa: rode `pnpm exec prettier --write src/radio-group` e depois a Verificação inteira. Confira: todos os comandos terminam com código 0.
