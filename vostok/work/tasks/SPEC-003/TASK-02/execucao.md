### Ler

- `vostok/work/specs/refined/SPEC-003-lote-1-de-componentes-para-o-synestia.md` (RF-01, RF-02, CT-01, CT-02, RN-03, "Contratos e interfaces": bloco dos ícones, decisão 1)
- `docs/KT-001-vega-lote-1.md` (seção "1. Conjunto de ícones")
- `src/icons/view-icons.tsx` (base `ViewIcon`: `aria-hidden` e `focusable` aplicados depois do `...rest`)
- `src/icons/view-icons.test.tsx` (formato dos testes de ícone)
- `src/icons/index.ts`
- `vostok/rules/project/accessibility.md` ([project/accessibility-03]) e `vostok/rules/project/code-style.md` ([project/code-style-08], [project/code-style-09])
- `node_modules/lucide-react/dist/lucide-react.d.ts` (por busca: `grep -nE "declare const (House|X|TriangleAlert|RefreshCw)\b"`; não leia inteiro)

### Mudar

- `src/icons/icon.types.ts` (criar): `IconProps` ([project/code-style-09]: tipos em arquivo próprio).
- `src/icons/icon.tsx` (criar): `createIcon`, a base interna que embrulha um ícone do `lucide-react` com os padrões da Vega (RF-02).
- `src/icons/interface-icons.tsx` (criar): os 36 ícones de interface com os nomes da Vega (RF-01).
- `src/icons/interface-icons.test.tsx` (criar): testes dos ícones novos, de responsabilidade de `interface-icons.tsx` (CT-01, CT-02).
- `src/icons/index.ts` (alterar): passa a exportar também os ícones novos e o `IconProps`, ao lado dos de visualização.

### Passos

1. Confira os nomes no `lucide-react` instalado pela TASK-01: rode `for n in House BookOpen Layers Timer Users Menu ChevronLeft ChevronRight ChevronDown ArrowLeft X Plus Minus Download Upload Flag RefreshCw Eye Check CircleCheck Info TriangleAlert CircleAlert WifiOff CloudCheck User Settings LogOut Sun Moon Lightbulb Clock Calendar Pencil Search Trash2; do grep -qE "declare const $n\b" node_modules/lucide-react/dist/lucide-react.d.ts || echo "falta: $n"; done`. Confira: nenhuma linha `falta:`. Se faltar algum, **PARE** e devolva a pergunta com o nome que falta (o mapa de nomes é contrato da spec).
2. `src/icons/interface-icons.test.tsx` (criar), antes do código: com `import * as icons from './interface-icons';` e `import { createRef } from 'react';`, escreva, num `describe('ícones de interface', ...)`:
   - a constante `ICON_NAMES` com os 36 nomes, na ordem do contrato: `HomeIcon`, `BookOpenIcon`, `LayersIcon`, `TimerIcon`, `UsersIcon`, `MenuIcon`, `ChevronLeftIcon`, `ChevronRightIcon`, `ChevronDownIcon`, `ArrowLeftIcon`, `CloseIcon`, `PlusIcon`, `MinusIcon`, `DownloadIcon`, `UploadIcon`, `FlagIcon`, `RefreshIcon`, `EyeIcon`, `CheckIcon`, `CircleCheckIcon`, `InfoIcon`, `AlertTriangleIcon`, `CircleAlertIcon`, `WifiOffIcon`, `CloudCheckIcon`, `UserIcon`, `SettingsIcon`, `LogOutIcon`, `SunIcon`, `MoonIcon`, `LightbulbIcon`, `ClockIcon`, `CalendarIcon`, `PencilIcon`, `SearchIcon`, `TrashIcon`;
   - `it('exporta os 36 ícones da primeira leva', ...)`: `expect(Object.keys(icons).sort()).toEqual([...ICON_NAMES].sort())`;
   - `it.each(ICON_NAMES)('%s é decorativo, com traço currentColor e ref', (name) => { ... })`: renderiza `<Icon ref={ref} data-testid="i" />`, confere `aria-hidden="true"`, `focusable="false"`, `width` e `height` `20`, `stroke="currentColor"`, `stroke-width="2"`, `fill="none"`, `ref.current` como o `<svg>`, e que nenhum filho do `<svg>` tem `fill` ou `stroke` diferente de `currentColor`/`none` (`svg.querySelectorAll('[fill],[stroke]')`);
   - `it('aceita os tamanhos 16 e 24', ...)`: `size={16}` dá `width="16"` e `size={24}` dá `width="24"`;
   - `it('mantém aria-hidden mesmo com outro valor', ...)`: `<HomeIcon aria-hidden={false} />` continua com `aria-hidden="true"`;
   - `it('repassa className e style', ...)`: `className="extra"` e `style={{ color: 'red' }}` chegam ao `<svg>`;
   - `it('não tem violações de axe', ...)`: um `<button aria-label="Fechar"><CloseIcon /></button>` passa no `axe`.
   Rode `pnpm vitest run src/icons/interface-icons.test.tsx`. Confira: falha com `Failed to resolve import "./interface-icons"`.
3. `src/icons/icon.types.ts` (criar):
   ```ts
   import type { ComponentPropsWithRef } from 'react';

   export interface IconProps extends Omit<ComponentPropsWithRef<'svg'>, 'children'> {
     /** Lado em px. Padrão: 20. */
     size?: 16 | 20 | 24;
   }
   ```
4. `src/icons/icon.tsx` (criar): `export function createIcon(Lucide: LucideIcon, displayName: string)` (`import type { LucideIcon } from 'lucide-react'`) devolve um componente `function Icon({ size = 20, ...rest }: IconProps)` que renderiza `<Lucide size={size} strokeWidth={2} color="currentColor" {...rest} aria-hidden="true" focusable="false" />` (os dois atributos depois do `...rest`, como no `ViewIcon`), e atribui `Icon.displayName = displayName`. JSDoc em `createIcon` e no componente, com o porquê: ícone sempre decorativo ([project/accessibility-03]); o nome acessível fica no botão. Confira: `pnpm exec tsc --noEmit 2>&1 | grep -E '^src/icons/'` sem saída.
5. `src/icons/interface-icons.tsx` (criar): importe do `lucide-react` só os 36 ícones pelo nome e exporte um `export const <NomeVega> = createIcon(<NomeLucide>, '<NomeVega>');` por linha, agrupados por comentário (navegação, setas, ações, estados, conta, estudo), com este mapa:

   | Vega | lucide-react |
   |---|---|
   | `HomeIcon` | `House` |
   | `BookOpenIcon` | `BookOpen` |
   | `LayersIcon` | `Layers` |
   | `TimerIcon` | `Timer` |
   | `UsersIcon` | `Users` |
   | `MenuIcon` | `Menu` |
   | `ChevronLeftIcon` | `ChevronLeft` |
   | `ChevronRightIcon` | `ChevronRight` |
   | `ChevronDownIcon` | `ChevronDown` |
   | `ArrowLeftIcon` | `ArrowLeft` |
   | `CloseIcon` | `X` |
   | `PlusIcon` | `Plus` |
   | `MinusIcon` | `Minus` |
   | `DownloadIcon` | `Download` |
   | `UploadIcon` | `Upload` |
   | `FlagIcon` | `Flag` |
   | `RefreshIcon` | `RefreshCw` |
   | `EyeIcon` | `Eye` |
   | `CheckIcon` | `Check` |
   | `CircleCheckIcon` | `CircleCheck` |
   | `InfoIcon` | `Info` |
   | `AlertTriangleIcon` | `TriangleAlert` |
   | `CircleAlertIcon` | `CircleAlert` |
   | `WifiOffIcon` | `WifiOff` |
   | `CloudCheckIcon` | `CloudCheck` |
   | `UserIcon` | `User` |
   | `SettingsIcon` | `Settings` |
   | `LogOutIcon` | `LogOut` |
   | `SunIcon` | `Sun` |
   | `MoonIcon` | `Moon` |
   | `LightbulbIcon` | `Lightbulb` |
   | `ClockIcon` | `Clock` |
   | `CalendarIcon` | `Calendar` |
   | `PencilIcon` | `Pencil` |
   | `SearchIcon` | `Search` |
   | `TrashIcon` | `Trash2` |

   Confira: `wc -l src/icons/interface-icons.tsx src/icons/icon.tsx src/icons/icon.types.ts` com cada arquivo em até 200 linhas, e `pnpm vitest run src/icons/interface-icons.test.tsx` passa.
6. `src/icons/index.ts` (alterar): mantenha as duas linhas atuais e acrescente `export { <os 36 nomes> } from './interface-icons';` e `export type { IconProps } from './icon.types';`. `createIcon` não é exportado (é interno). Confira: `pnpm vitest run src/icons` passa, inclusive o `view-icons.test.tsx`.
7. Rode `pnpm exec prettier --write src/icons`, `pnpm exec eslint src/icons --max-warnings 0` e `test -z "$(pnpm exec tsc --noEmit 2>&1 | grep -E '^src/icons/')"`. Confira: os três com código 0.
8. Rode o bloco da "Verificação" inteiro, inclusive o print. Confira: código 0 e o arquivo `icones-temas.png` gerado.
