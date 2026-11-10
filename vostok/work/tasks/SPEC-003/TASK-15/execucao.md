### Ler

- `vostok/work/specs/refined/SPEC-003-lote-1-de-componentes-para-o-synestia.md` (RF-41, CT-38, RNF-06, RNF-09, "Contratos e interfaces")
- `vostok/rules/project/architecture.md` ([project/architecture-03])
- `src/index.ts` (formato: um `export` e um `export type` por módulo, sem `export *`)
- `src/index.test.ts` (`RUNTIME_EXPORTS`, `PublicTypes` e os quatro testes do `describe('índice público')`)
- `src/icons/index.ts` (ícones novos da TASK-02)
- `vostok/work/tasks/SPEC-003/TASK-02/tecnico.md` a `vostok/work/tasks/SPEC-003/TASK-14/tecnico.md` (nomes exportados, nomes trocados e tipos públicos acrescentados por cada tarefa)
- `vostok/work/tasks/SPEC-001/TASK-12/tecnico.md` (como o índice e o teste foram montados na 0.1.0)

### Mudar

- `src/index.ts` (alterar): exporta os componentes novos, os ícones de interface e os tipos públicos das props, sem o `Prose` (RF-41, [project/architecture-03]).
- `src/index.test.ts` (alterar): superfície pública com os nomes novos e o teste de que o `Prose` fica fora do índice (CT-38).

### Passos

1. Localize os módulos: para cada nome dos passos 2 e 3, rode `grep -rn "export .*\bNOME\b" src --include='*.ts' --include='*.tsx' | grep -v '\.test\.' | grep -v '^src/index.ts'` e anote o arquivo que o declara (valores no `<nome>.tsx`, tipos no `<nome>.types.ts`, ícones sempre por `./icons`). Se um nome não existir porque a tarefa do componente o trocou e registrou no `tecnico.md` dela, use o nome registrado e cite a troca no `tecnico.md` desta tarefa. Se uma tarefa registrou um valor ou tipo público a mais (por exemplo, um `DEFAULT_*_LABELS` ou um tipo usado nas props), acrescente-o aos passos 2 a 4. Confira: todo nome tem arquivo de origem.
2. `src/index.test.ts` (alterar), antes do índice: em `RUNTIME_EXPORTS`, mantenha os 72 nomes atuais e acrescente, depois de `TimelineIcon` e antes do bloco do tema:
   - Ícones de interface (36): `HomeIcon`, `BookOpenIcon`, `LayersIcon`, `TimerIcon`, `UsersIcon`, `MenuIcon`, `ChevronLeftIcon`, `ChevronRightIcon`, `ChevronDownIcon`, `ArrowLeftIcon`, `CloseIcon`, `PlusIcon`, `MinusIcon`, `DownloadIcon`, `UploadIcon`, `FlagIcon`, `RefreshIcon`, `EyeIcon`, `CheckIcon`, `CircleCheckIcon`, `InfoIcon`, `AlertTriangleIcon`, `CircleAlertIcon`, `WifiOffIcon`, `CloudCheckIcon`, `UserIcon`, `SettingsIcon`, `LogOutIcon`, `SunIcon`, `MoonIcon`, `LightbulbIcon`, `ClockIcon`, `CalendarIcon`, `PencilIcon`, `SearchIcon`, `TrashIcon`;
   - Componentes novos (14): `Switch`, `RadioGroup`, `TextAreaField`, `Disclosure`, `Accordion`, `Callout`, `BottomSheet`, `CardLink`, `CardButton`, `FocusHeader`, `Topbar`, `Sidebar`, `BottomNav`, `AppShell`.
   No `import type` do topo e em `PublicTypes`, acrescente os 18 tipos: `IconProps`, `SwitchProps`, `RadioOption`, `RadioGroupProps`, `TextAreaFieldProps`, `DisclosureProps`, `AccordionProps`, `CalloutProps`, `BottomSheetProps`, `CardLinkProps`, `CardButtonProps`, `FocusHeaderProps`, `NavItem`, `RenderNavLink`, `TopbarProps`, `SidebarProps`, `BottomNavProps`, `AppShellProps`. No `describe('índice público', ...)`, acrescente `it('não exporta o Prose, que tem entrada própria', ...)` com `expect(vega).not.toHaveProperty('Prose')`. Rode `pnpm vitest run src/index.test.ts`. Confira: falha nos `exporta <Nome>` novos e no `exporta só a superfície pública`, e o `tsc` acusa os tipos ausentes.
3. `src/index.ts` (alterar): depois da linha dos ícones de visualização e antes do bloco do tema, acrescente, na ordem do passo 2, uma linha `export { ... } from './<pasta>/<arquivo>';` e uma `export type { ... } from './<pasta>/<arquivo>.types';` por módulo, com os arquivos do passo 1. Os ícones novos entram na linha existente de `./icons` (valores) e na de tipos (`IconProps` ao lado de `ViewIconProps`). Nada de `export *`; nada do `src/prose/`. Confira: `pnpm vitest run src/index.test.ts` passa e `wc -l src/index.ts` fica em até 200 linhas.
4. Rode `pnpm exec prettier --write src/index.ts src/index.test.ts`, `pnpm exec eslint src/index.ts src/index.test.ts --max-warnings 0` e `pnpm typecheck`. Confira: os três com código 0.
5. Rode o bloco da "Verificação" inteiro. Se o `node` falhar ao importar `dist/index.js` por acesso ao DOM no carregamento de um módulo, o defeito é do componente: pare e registre o bloqueio com o nome do módulo, sem contornar no índice. Confira: código 0.
