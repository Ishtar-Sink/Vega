### Ler

- `vostok/work/specs/refined/SPEC-003-lote-1-de-componentes-para-o-synestia.md` (RF-10, RF-11, RF-12, CT-10, CT-11, CT-12, CB-04, RN-05, "Contratos e interfaces": `TextAreaFieldProps`)
- `vostok/work/tasks/SPEC-003/TASK-07/tecnico.md`
- `docs/KT-001-vega-lote-1.md` (seção "4. `TextAreaField`")
- `src/text-field/text-field.tsx` (rótulo, `help`, erro com `role="alert"`, `aria-invalid` e `aria-describedby`)
- `src/text-field/text-field.module.css` (visual a repetir no `textarea`)
- `src/text-field/text-field.test.tsx` (testes de rótulo, erro, props nativas e a regressão de `box-sizing`)
- `src/theme/tokens.css` (`--line-height-relaxed`)

### Mudar

- `src/text-area-field/text-area-field.types.ts` (criar): `TextAreaFieldProps` com JSDoc em pt-br (RF-10, RF-11, RF-12).
- `src/text-area-field/use-auto-resize.ts` (criar): hook que ajusta `rows` ao conteúdo entre `minRows` e `maxRows` (RF-11).
- `src/text-area-field/text-area-field.tsx` (criar): `TextAreaField` com rótulo, ajuda, erro e contador (RF-10, RF-12).
- `src/text-area-field/text-area-field.module.css` (criar): estilos do `TextField` no `textarea`, com `line-height` relaxado e `box-sizing`, só com tokens (RF-10).
- `src/text-area-field/text-area-field.test.tsx` (criar): testes de rótulo, erro, contador, `autoResize`, props nativas, axe e CSS (CT-10, CT-11, CT-12, CB-04).

### Passos

1. `src/text-area-field/text-area-field.test.tsx` (criar): importe `TextAreaField` de `./text-area-field`. Testes:
   - `it('has no axe violations')` com `help`, `error` e `counter`.
   - `it('is named by the label')`: `getByRole('textbox', { name: 'Redação' })` é um `TEXTAREA`.
   - `it('marks the error with role alert and aria-invalid')`: com `error`, o `alert` tem o texto e o `textarea` tem `aria-invalid="true"` e o erro no `aria-describedby`.
   - `it('links help, counter and error by aria-describedby')`: com os três, `aria-describedby` tem os três `id`s, nessa ordem, mais um `aria-describedby` recebido no início.
   - `it('does not announce the counter on every key')`: o elemento do contador não tem `aria-live` nem `role`.
   - `it('grows with the content up to maxRows')` (CB-04): `autoResize minRows={2} maxRows={4}`; com `userEvent.type` de 6 linhas (`{Enter}`), `rows` vale `4`; com 3 linhas, `3`.
   - `it('keeps minRows when empty')`: `autoResize minRows={2}` sem texto tem `rows="2"`.
   - `it('keeps the rows prop without autoResize')`: `rows={5}` sem `autoResize` fica `5` ao digitar 8 linhas.
   - `it('passes className, style, data attributes and ref to the textarea')`.
   - `it('uses the relaxed line height')`: lê `text-area-field.module.css` e espera `line-height:\s*var\(--line-height-relaxed\)` no bloco `.control`.
   - `it('keeps the full-width control inside its container with box-sizing border-box')`: bloco `.control` com `width: 100%` e `box-sizing: border-box`.
   Confira: `pnpm vitest run src/text-area-field` falha porque `./text-area-field` não existe.
2. `src/text-area-field/text-area-field.types.ts` (criar): o `TextAreaFieldProps` exato do contrato (`extends ComponentPropsWithRef<'textarea'>` com `label`, `help?`, `error?`, `autoResize?`, `minRows?`, `maxRows?`, `counter?: ReactNode`), com JSDoc em pt-br; documente os padrões `minRows` 3 e `maxRows` 12.
3. `src/text-area-field/use-auto-resize.ts` (criar): `export function useAutoResize(value: string, { enabled, minRows, maxRows }): number | undefined`. Sem `enabled`, devolve `undefined` (o `rows` recebido vale). Com `enabled`, devolve `Math.min(Math.max(lineCount(value), minRows), maxRows)`, em que `lineCount` conta as quebras de linha (`value.split('\n').length`). Função pura e curta; comentário em pt-br dizendo por que conta linhas (determinístico no teste e sem medir layout) e que linhas longas que quebram sozinhas não contam.
4. `src/text-area-field/text-area-field.tsx` (criar): mesmo desenho do `TextField` (`label` com `htmlFor`, `help`, `error` com `role="alert"`, `aria-invalid` e `aria-describedby` somado ao recebido), mais o `counter` num `<p id={counterId} className={styles.counter}>` sem `aria-live`. A ordem do `aria-describedby` é: recebido, ajuda, contador, erro. Para o `autoResize`, guarde o texto atual num `useState` iniciado com `value ?? defaultValue ?? ''` e atualizado no `onChange` (chame também o `onChange` recebido); com `value` controlado, use o `value`. `rows={useAutoResize(...) ?? rows}`. `className`, `style`, `ref` e `...rest` vão para o `<textarea>`.
5. `src/text-area-field/text-area-field.module.css` (criar): copie `.root`, `.label`, `.help` e `.error` do `text-field.module.css`; `.control` igual ao do `TextField` mais `line-height: var(--line-height-relaxed)`, `resize: vertical` e `overflow-y: auto`, sem `min-height` fixo (a altura vem de `rows`); `.counter` em `var(--font-size-sm)`, `var(--text-muted)`, `text-align: end` e `font-variant-numeric: tabular-nums`. Confira: `pnpm vitest run src/text-area-field` passa.
6. Rode `pnpm exec prettier --write src/text-area-field` e depois a Verificação inteira. Confira: todos os comandos terminam com código 0.
