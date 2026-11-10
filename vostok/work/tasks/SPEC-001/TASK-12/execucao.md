### Ler

- `vostok/work/specs/refined/SPEC-001-extrair-os-componentes-do-atria-para-a-vega.md` (RF-01, RF-02, RF-09 a RF-18, RNF-04, CT-01, CT-02, "Contratos e interfaces")
- `vostok/rules/project/architecture.md`
- `vostok/rules/project/security.md`
- `../atria/packages/ui/src/index.ts`
- `src/theme/index.ts`
- `vite.config.ts`
- `package.json` (campos `exports` e `files`)
- `vostok/work/tasks/SPEC-001/TASK-02/tecnico.md` a `vostok/work/tasks/SPEC-001/TASK-11/tecnico.md` (nomes exportados por cada tarefa e mudanças de nome registradas)

### Mudar

- `src/index.ts` (criar): índice público com todos os componentes, funções auxiliares, o tema e os tipos das props (RF-02, [project/architecture-03]).
- `src/index.test.ts` (criar): teste das exportações públicas, de responsabilidade do `src/index.ts` (CT-02).

### Passos

1. Localize os módulos: para cada nome das listas dos passos 2 e 3, rode `grep -rn "export .*\bNOME\b" src --include='*.ts' --include='*.tsx' | grep -v '\.test\.'` e anote o arquivo que o declara (no tema, use sempre `./theme`, que reexporta tokens, tema e contraste). Se um nome não existir porque a tarefa do componente o mudou e registrou a mudança no `tecnico.md` dela (RN-02), use o nome registrado nos passos 2 a 4 e cite a troca no `tecnico.md` desta tarefa. Confira: todos os nomes têm arquivo de origem.
2. `src/index.test.ts` (criar), antes do índice: escreva o teste com a constante `RUNTIME_EXPORTS` (array `as const`), nesta ordem, com exatamente estes 72 nomes:
   - Ações: `Button`, `IconButton`, `MenuButton`.
   - Campos: `TextField`, `SelectField`, `Checkbox`, `SegmentedField`, `Autocomplete`, `TagField`, `ColorField`, `ColorPicker`, `DEFAULT_COLOR_FIELD_LABELS`, `hexToRgb`, `rgbToHex`, `hslToRgb`, `rgbToHsl`.
   - Data e hora: `Calendar`, `DateField`, `TimeField`, `DateTimeField`, `PeriodField`, `parseTime`, `maskTime`, `resolvePeriod`.
   - Dinheiro: `MoneyField`, `maskMoneyInput`, `parseMoneyInput`, `formatCents`.
   - Estrutura: `Card`, `PageHeader`, `Toolbar`, `Tabs`, `ViewSwitcher`, `FormGrid`, `FormActions`.
   - Diálogos e avisos: `Dialog`, `ConfirmDialog`, `Toast`, `ToastRegion`.
   - Estados: `EmptyState`, `LoadingState`, `Skeleton`, `ErrorState`, `ProgressBar`.
   - Marca e itens: `BrandLogo`, `Badge`, `ItemSwatch`, `ListIcon`, `GridIcon`, `ShelfIcon`, `TableIcon`, `DayIcon`, `TimelineIcon`.
   - Tema: `light`, `dark`, `radii`, `space`, `spacing`, `fontSizes`, `fontWeights`, `lineHeights`, `zIndices`, `motion`, `gradients`, `fonts`, `breakpoints`, `itemPalette`, `defineTheme`, `ishtarSinkTheme`, `contrastRatio`, `checkThemeContrast`, `CONTRAST_REQUIREMENTS`.

   O arquivo importa `import * as vega from './index';` e tem, num `describe('índice público', ...)`, os testes:
   - `it.each(RUNTIME_EXPORTS)('exporta %s', (name) => { expect(vega[name]).toBeDefined(); })`;
   - `it('exporta só a superfície pública', ...)`: `expect(Object.keys(vega).sort()).toEqual([...RUNTIME_EXPORTS].sort())`;
   - `it('não reexporta a paleta do Atria', ...)`: `expect(vega).not.toHaveProperty('paletteFor')` e `expect(vega).not.toHaveProperty('artPalettes')` (RF-17);
   - `it('exporta os tipos públicos', ...)`: um `import type { ... } from './index'` no topo com os nomes do passo 3 e, no corpo, `expectTypeOf<PublicTypes>().not.toBeNever()`, com `type PublicTypes = [ButtonProps, ButtonVariant, ...]` listando todos eles (o `tsc` falha se um tipo não for exportado).

   Rode `pnpm vitest run src/index.test.ts`. Confira: falha porque `./index` não existe.
3. Tipos a exportar (lista do `import type` do passo 2 e do passo 4): `ButtonProps`, `ButtonVariant`, `IconButtonProps`, `MenuButtonProps`, `MenuItem`, `TextFieldProps`, `SelectFieldProps`, `CheckboxProps`, `SegmentedFieldProps`, `SegmentedOption`, `AutocompleteProps`, `AutocompleteOption`, `AutocompleteSingleProps`, `AutocompleteMultipleProps`, `TagFieldProps`, `ColorFieldProps`, `ColorFieldLabels`, `ColorPickerProps`, `CalendarProps`, `CalendarValue`, `CalendarLabels`, `DateFieldProps`, `DateFieldLabels`, `TimeFieldProps`, `DateTimeFieldProps`, `DateTimeFieldLabels`, `PeriodFieldProps`, `PeriodFieldLabels`, `PeriodPreset`, `PeriodValue`, `PeriodRange`, `MoneyFieldProps`, `CardProps`, `CardTone`, `PageHeaderProps`, `ToolbarProps`, `TabItem`, `TabsProps`, `ViewOption`, `ViewSwitcherProps`, `FormGridProps`, `FormActionsProps`, `DialogProps`, `ConfirmDialogProps`, `ToastProps`, `ToastTone`, `EmptyStateProps`, `LoadingStateProps`, `SkeletonProps`, `ErrorStateProps`, `ProgressBarProps`, `BrandLogoProps`, `BadgeProps`, `BadgeTone`, `ItemSwatchProps`, `ViewIconProps`, `Theme`, `ThemeName`, `ThemeTokens`, `ContrastRequirement`, `ContrastViolation`. Se um componente exportar outro tipo usado nas próprias props públicas (registrado no `tecnico.md` dele), acrescente-o aqui, no teste e no índice.
4. `src/index.ts` (criar): na ordem dos grupos do passo 2, uma linha `export { ... } from './<pasta>/<arquivo>';` e uma `export type { ... } from './<pasta>/<arquivo>';` por módulo, com os arquivos do passo 1, no formato de `../atria/packages/ui/src/index.ts`, e por fim `export { ... } from './theme';` e `export type { Theme, ThemeName, ThemeTokens, ContrastRequirement, ContrastViolation } from './theme';`. Nada de `export *`, para o índice ser a lista explícita da superfície ([project/architecture-03]); `palette.ts` do `item-swatch` não entra. Confira: `pnpm vitest run src/index.test.ts` passa.
5. Rode `pnpm exec prettier --write src/index.ts src/index.test.ts`, `pnpm exec eslint src/index.ts src/index.test.ts --max-warnings 0` e `pnpm typecheck`. Confira: os três com código 0.
6. Build: rode o bloco da "Verificação". Se `node` falhar ao importar `dist/index.js` por um acesso ao DOM no carregamento de um módulo, o defeito é do componente: pare e registre o bloqueio com o nome do módulo, sem contornar no índice. Confira: o bloco termina com código 0.
