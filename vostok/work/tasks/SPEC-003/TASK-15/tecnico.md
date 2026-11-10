<!-- Escrito no planejamento com o que a tarefa vai fazer e enriquecido na conclusão com o que foi feito. -->

## Abordagem

TDD: primeiro o `src/index.test.ts` ganha os nomes novos e falha; depois o `src/index.ts`. O formato segue o índice da 0.1.0 (TASK-12 da SPEC-001): um `export` e um `export type` por módulo, sem `export *`, e o teste confere a lista exata das chaves do módulo. A verificação também roda a suíte inteira e o lint, porque esta é a tarefa de integração: é a primeira vez que os componentes das ondas 1 a 3 se juntam.

## Superfície nova

- Ícones de interface (36, da TASK-02): `HomeIcon`, `BookOpenIcon`, `LayersIcon`, `TimerIcon`, `UsersIcon`, `MenuIcon`, `ChevronLeftIcon`, `ChevronRightIcon`, `ChevronDownIcon`, `ArrowLeftIcon`, `CloseIcon`, `PlusIcon`, `MinusIcon`, `DownloadIcon`, `UploadIcon`, `FlagIcon`, `RefreshIcon`, `EyeIcon`, `CheckIcon`, `CircleCheckIcon`, `InfoIcon`, `AlertTriangleIcon`, `CircleAlertIcon`, `WifiOffIcon`, `CloudCheckIcon`, `UserIcon`, `SettingsIcon`, `LogOutIcon`, `SunIcon`, `MoonIcon`, `LightbulbIcon`, `ClockIcon`, `CalendarIcon`, `PencilIcon`, `SearchIcon`, `TrashIcon`.
- Componentes (14): `Switch`, `RadioGroup`, `TextAreaField`, `Disclosure`, `Accordion`, `Callout`, `BottomSheet`, `CardLink`, `CardButton`, `FocusHeader`, `Topbar`, `Sidebar`, `BottomNav`, `AppShell`.
- Tipos (18): `IconProps`, `SwitchProps`, `RadioOption`, `RadioGroupProps`, `TextAreaFieldProps`, `DisclosureProps`, `AccordionProps`, `CalloutProps`, `BottomSheetProps`, `CardLinkProps`, `CardButtonProps`, `FocusHeaderProps`, `NavItem`, `RenderNavLink`, `TopbarProps`, `SidebarProps`, `BottomNavProps`, `AppShellProps`.
- Contagem esperada: 72 + 50 = 122 valores, e 126 testes no arquivo (122 nomes, mais superfície exata, paleta do Atria, tipos e `Prose` fora). O passo 1 acrescenta o que as tarefas de componente registrarem a mais.
- Fora: `Prose`, `ProseProps`, `ProseComponents` e `ProsePlugin` (entrada `@ishtar-sink/vega/prose`, TASK-13); `createIcon` (interno, TASK-02).

## Decisões

| Decisão | Alternativa descartada | Motivo |
|---|---|---|
| Teste explícito de que `Prose` não está no índice. | Confiar só na superfície exata. | Torna a decisão 2 da spec (entrada própria) visível no relatório de testes. |
| Ícones novos exportados por `./icons`, como os de visualização. | Importar de `./icons/interface-icons`. | Um único ponto de origem para os ícones no índice. |
| Suíte inteira e lint nesta tarefa. | Só os testes do índice. | Integração das ondas 1 a 3: um conflito entre componentes só aparece com tudo junto. |
| `build-0-2.txt` importa `@ishtar-sink/vega/prose` pelo nome do pacote. | Conferir só o arquivo `dist/prose.js`. | Prova que o `exports` da TASK-01 bate com o build. |

## Riscos

- Nome trocado por uma tarefa de componente: o passo 1 manda usar o nome registrado no `tecnico.md` dela.
- Um componente que acesse `document`/`window` ao carregar quebra o `import` do `dist/index.js` no Node: o passo 5 registra o bloqueio em vez de contornar.

## Referências da spec

RF-41, CT-38, CT-24, RNF-03, RNF-06, RNF-09; decisão 2; [project/architecture-03], [project/security-01].

## Arquivos em comum na onda

Onda 4 só tem esta tarefa: nenhum arquivo em comum.
