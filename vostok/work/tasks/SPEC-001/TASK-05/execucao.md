### Ler

- `vostok/work/specs/refined/SPEC-001-extrair-os-componentes-do-atria-para-a-vega.md`: RF-10, RF-19, RF-20, RNF-01, RNF-02, RNF-06, RN-02, RN-05, CT-09, CT-12 e CT-13.
- `vostok/work/tasks/SPEC-001/TASK-05/tecnico.md`: decisões desta tarefa (textos padrão, props nativas, mocks do jsdom).
- `vostok/work/tasks/SPEC-001/TASK-04/tecnico.md`: decisão "Props nativas no controle" e regra do `aria-describedby`, que valem aqui.
- `vostok/rules/project/code-style.md`, `vostok/rules/project/accessibility.md`, `vostok/rules/project/testing.md`, `vostok/rules/project/language.md` e `vostok/rules/project/naming-convention.md`.
- `../atria/packages/ui/src/color-field/color-field.tsx`, `color-picker.tsx`, `color.ts`, `color-field.module.css`, `color-field.test.tsx` e `color.test.ts`: origem (somente leitura).
- `../atria/packages/ui/src/test/setup.ts`: os mocks de `showModal`/`close` do `<dialog>` e de `getContext` do canvas que os testes do Atria usam.
- `src/button/button.tsx` (criado pela TASK-03): `Button` e `ButtonProps` usados nos botões Cancelar e Aplicar.
- `src/theme/tokens.css` (criado pela TASK-02) e `src/test/setup.ts` (criado pela TASK-01).

### Mudar

- `src/color-field/color.test.ts` (criar): testes das funções de cor trazidos do Atria (RF-10).
- `src/color-field/color.ts` (criar): `hexToRgb`, `rgbToHex`, `hslToRgb`, `rgbToHsl` e `clamp` (RF-10).
- `src/color-field/color-picker.test.tsx` (criar): testes do `ColorPicker` sozinho (RF-10, RF-19, RF-20, CT-09, CT-12, CT-13).
- `src/color-field/color-picker.tsx` (criar): `ColorPicker`, `ColorFieldLabels` com padrão em pt-br e props nativas do `<div>` (RF-10, RF-19, RF-20).
- `src/color-field/color-field.test.tsx` (criar): testes do `ColorField` trazidos do Atria e completados (RF-10, RF-19, RF-20, CT-09, CT-12, CT-13).
- `src/color-field/color-field.module.css` (criar): estilos do campo e do seletor só com tokens (RNF-02).
- `src/color-field/color-field.tsx` (criar): `ColorField` com as props nativas do `<button>` gatilho e o `<dialog>` nativo (RF-10, RF-19, RF-20).

### Passos

Regras desta tarefa (decisões do `tecnico.md` desta tarefa e da TASK-04):

- **Troca de literais no `.module.css`:** `1px` → `calc(var(--space) / 4)` (inclusive `letter-spacing`), `2px` → `calc(var(--space) / 2)`, `3px` → `calc(var(--space) * 0.75)`, `220px` → `calc(var(--space) * 55)`; `font-weight: 600` → `var(--font-weight-semibold)` (token criado pela TASK-02, decisão do usuário); porcentagens, `translate(-50%, -50%)` e `color-mix(... 40%, transparent)` ficam como estão. Esta tarefa não cria token.
- **Props nativas:** `className`, `style` e `...rest` (com `ref`, `data-*`, `aria-*`) vão para o `<button>` gatilho no `ColorField` e para o `<div>` raiz (`styles.picker`) no `ColorPicker`; o `...rest` é espalhado antes dos atributos e handlers próprios. `aria-describedby` recebido é somado à ajuda e ao erro, e `aria-invalid={error ? true : ariaInvalid}`.
- **Mocks do jsdom nos testes:** no topo de `color-field.test.tsx` e de `color-picker.test.tsx`, um `beforeAll` que (1) define `HTMLDialogElement.prototype.showModal` e `close` só se `typeof ... !== 'function'` (como no setup do Atria), e (2) faz `vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(() => ({ createImageData: (width: number, height: number) => ({ data: new Uint8ClampedArray(width * height * 4), width, height }), putImageData: () => undefined }) as unknown as CanvasRenderingContext2D)`; `afterAll(() => { vi.restoreAllMocks(); })`.

1. `src/color-field/color.test.ts` (criar): copie `../atria/packages/ui/src/color-field/color.test.ts` sem mudanças de lógica. Rode `pnpm vitest run src/color-field/color.test.ts` e confira que falha.
2. `src/color-field/color.ts` (criar): copie `../atria/packages/ui/src/color-field/color.ts`; troque `const clamp = ...; export { clamp };` por `export function clamp(value: number, min: number, max: number): number` com retorno antecipado igual, e acrescente JSDoc curto em cada função exportada. Rode `pnpm vitest run src/color-field/color.test.ts` até passar.
3. `src/color-field/color-picker.test.tsx` (criar), com os mocks do jsdom e `Harness` que renderiza `<ColorPicker value="#7C3AED" onChange={spy} />` sem `labels`:
   - `it('has no axe violations')`;
   - `it('uses the pt-br default labels')`: existem `getByRole('slider', { name: 'Roda de cores' })`, `getByLabelText('HEX')` com valor `#7C3AED`, `getByRole('group', { name: 'RGB' })`, `getByRole('group', { name: 'HSL' })` e `getByLabelText('Luminosidade')` (o `range`); o `aria-valuetext` do slider é `Matiz 262 graus, saturação 83%`;
   - `it('changes the hue with the arrow keys and reports the HEX')`: foco no slider, `{ArrowRight}`, `aria-valuenow` `263` e `spy` chamado com um HEX `#RRGGBB` (`/^#[0-9A-F]{6}$/`);
   - `it('ct12 shows the overridden labels')`: `labels={{ wheel: 'Color wheel', hex: 'Hex code', wheelValue: (hue, saturation) => \`Hue ${String(hue)}°, saturation ${String(saturation)}%\` }}`: slider `Color wheel` com `aria-valuetext` `Hue 262°, saturation 83%` e campo `Hex code`; os demais rótulos continuam os padrões (`RGB`, `Luminosidade`);
   - `it('ct13 forwards className, style, data attributes and ref to the root')`: `createRef<HTMLDivElement>()`; o `ref.current` contém o slider, tem a classe `extra` somada à do módulo, `style.marginTop` `var(--s2)` e `data-kind="picker"`.
   Rode `pnpm vitest run src/color-field/color-picker.test.tsx` e confira que falha.
4. `src/color-field/color-picker.tsx` (criar): copie `../atria/packages/ui/src/color-field/color-picker.tsx` e mude:
   - em `ColorFieldLabels`, acrescente `/** Texto do valor da roda para leitores de tela. */ wheelValue: (hue: number, saturation: number) => string;` e JSDoc curto nos demais campos;
   - `export const DEFAULT_COLOR_FIELD_LABELS: ColorFieldLabels = { title: 'Escolher cor', lightness: 'Luminosidade', hex: 'HEX', rgb: 'RGB', red: 'Vermelho', green: 'Verde', blue: 'Azul', hsl: 'HSL', hue: 'Matiz', saturation: 'Saturação', cancel: 'Cancelar', apply: 'Aplicar', wheel: 'Roda de cores', wheelValue: (hue, saturation) => \`Matiz ${String(hue)} graus, saturação ${String(saturation)}%\` };`;
   - `export interface ColorPickerProps extends Omit<ComponentPropsWithRef<'div'>, 'onChange' | 'children' | 'defaultValue'>` com `value: string`, `onChange: (hex: string) => void` e `/** Textos do seletor; os que faltarem usam o padrão em pt-br. */ labels?: Partial<ColorFieldLabels>;`; a função monta `const text = { ...DEFAULT_COLOR_FIELD_LABELS, ...labels };` e usa `text.*` em todos os rótulos;
   - o `aria-valuetext` passa a ser `text.wheelValue(state.h, state.s)` (sai o "graus" fixo);
   - a cor de partida `[124, 58, 237]` vira `const FALLBACK_RGB: Rgb = [124, 58, 237];` com o comentário `// Cor de partida quando o valor recebido não é um HEX válido.`;
   - `hex_invalid` vira `hexInvalid`;
   - o `<div className={styles.picker}>` recebe `{...rest}`, `className={[styles.picker, className].filter(Boolean).join(' ')}`, `style` e `ref` (sem `ref` interno nesse elemento);
   - importe `clamp`, `hexToRgb`, `hslToRgb`, `rgbToHex`, `rgbToHsl` e o tipo `Rgb` de `./color`.
   Rode `pnpm vitest run src/color-field/color-picker.test.tsx` até passar.
5. `src/color-field/color-field.test.tsx` (criar): copie `../atria/packages/ui/src/color-field/color-field.test.tsx`, acrescente os mocks do jsdom e acrescente:
   - `it('uses the pt-br default labels without the labels prop')`: `<ColorField label="Cor" value="#7C3AED" onChange={vi.fn()} />`; ao abrir, o diálogo é `getByRole('dialog', { name: 'Escolher cor' })`, com os botões `Cancelar` e `Aplicar`;
   - `it('ct12 shows the overridden labels')`: `labels={{ title: 'Pick a color', cancel: 'Cancel', apply: 'Apply' }}`: diálogo `Pick a color`, botões `Cancel` e `Apply`;
   - `it('shows the error with role alert linked to the trigger')`: `error="Escolha uma cor"`: `getByRole('alert')` com o texto, o gatilho com `aria-invalid="true"` e `toHaveAccessibleDescription('Escolha uma cor')`;
   - `it('opens with the keyboard and applies with Enter on Aplicar')`: `user.tab()` foca o gatilho, `{Enter}` abre o diálogo com o foco no slider, `{ArrowRight}`, foco no botão com `act(() => { within(dialog).getByRole('button', { name: 'Aplicar' }).focus(); })`, `{Enter}`, o `spy` recebe o HEX novo e o foco volta ao gatilho;
   - `it('ct13 forwards className, style, data attributes and ref to the trigger')`: `createRef<HTMLButtonElement>()`; o gatilho (`getByRole('button', { name: /Cor/ })`) tem a classe `extra`, `marginTop` `var(--s2)`, `data-kind="color"` e é o `ref.current`.
   Rode `pnpm vitest run src/color-field/color-field.test.tsx` e confira que falha.
6. `src/color-field/color-field.module.css` (criar): copie `../atria/packages/ui/src/color-field/color-field.module.css` com a troca de literais.
7. `src/color-field/color-field.tsx` (criar): copie `../atria/packages/ui/src/color-field/color-field.tsx` e mude:
   - `export interface ColorFieldProps extends Omit<ComponentPropsWithRef<'button'>, 'value' | 'defaultValue' | 'onChange' | 'onBlur' | 'children' | 'type'>` com `label: string`, `/** HEX atual. */ value: string`, `onChange: (hex: string) => void`, `onBlur?: () => void`, `/** Textos do campo e do seletor; os que faltarem usam o padrão em pt-br. */ labels?: Partial<ColorFieldLabels>`, `error?: string` e `help?: string` (`id` vem das props nativas);
   - `const text = { ...DEFAULT_COLOR_FIELD_LABELS, ...labels };` (importado de `./color-picker`) e `text.title`, `text.cancel`, `text.apply` no lugar de `labels.*`; o `<ColorPicker>` recebe `labels={text}`;
   - o `<button>` gatilho recebe `{...rest}` antes dos atributos próprios, `className={[styles.trigger, className].filter(Boolean).join(' ')}`, `style`, o `aria-describedby` somado e `aria-invalid={error ? true : ariaInvalid}`; ligue o `ref` com `useImperativeHandle(ref, () => trigger.current as HTMLButtonElement, [])`;
   - mantenha o `<dialog>` com `showModal()` (RN-05), o `Button` importado de `../button/button` e o `export type { ColorFieldLabels } from './color-picker';`.
   Rode `pnpm vitest run src/color-field` até passar.
8. Rode `pnpm exec prettier --write src/color-field` e a Verificação inteira; corrija até todos os comandos terminarem em 0.
