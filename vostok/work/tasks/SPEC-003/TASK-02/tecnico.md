<!-- Escrito no planejamento com o que a tarefa vai fazer e enriquecido na conclusão com o que foi feito. -->

## Abordagem

TDD: o teste dos 36 ícones vem antes do código. Uma fábrica interna, `createIcon`, embrulha cada ícone do `lucide-react` com os padrões da Vega (tamanho, traço, `aria-hidden` e `focusable` fixos), como o `ViewIcon` faz para os ícones de visualização. `interface-icons.tsx` só lista os 36 ícones, um por linha, e o `src/icons/index.ts` reexporta os novos ao lado dos antigos. O índice público (`src/index.ts`) fica com a TASK-15.

## Decisões

| Decisão | Alternativa descartada | Motivo |
|---|---|---|
| `createIcon(Lucide, displayName)` com `aria-hidden` e `focusable` depois do `...rest`. | Reexportar os ícones do `lucide-react` direto. | O tamanho padrão (20), a espessura e o `aria-hidden` ficam sob controle da Vega ([project/accessibility-03]); o produto não importa o `lucide-react` diretamente. |
| `IconProps` em `icon.types.ts` e o teste em `interface-icons.test.tsx`, além dos três caminhos do plano. | Tipos dentro do `icon.tsx`. | [project/code-style-09] pede os tipos em arquivo próprio; o teste é de responsabilidade do `interface-icons.tsx`. |
| `size` limitado a `16 \| 20 \| 24`. | `number` livre, como no `ViewIconProps`. | Contrato da spec; tamanhos fora da grade de 4 px ficam impossíveis. |
| 36 ícones: os 34 do KT-001 mais `SearchIcon` e `TrashIcon`. | Só os 34 do KT-001. | Pedido do usuário no planejamento (ajuste 1 da SPEC-003, RF-01). |
| Importação por nome (`import { House, X, ... } from 'lucide-react'`). | `import * as Lucide`. | Mantém o tree-shaking: só os 36 ícones entram no bundle do produto. |
| `createIcon` não é exportado. | Exportar a fábrica para o produto criar ícones. | Um ícone novo entra na Vega ([project/architecture-05]); a fábrica é detalhe interno. |

Mapa de nomes (contrato da spec): HomeIcon ← House, BookOpenIcon ← BookOpen, LayersIcon ← Layers, TimerIcon ← Timer, UsersIcon ← Users, MenuIcon ← Menu, ChevronLeftIcon ← ChevronLeft, ChevronRightIcon ← ChevronRight, ChevronDownIcon ← ChevronDown, ArrowLeftIcon ← ArrowLeft, CloseIcon ← X, PlusIcon ← Plus, MinusIcon ← Minus, DownloadIcon ← Download, UploadIcon ← Upload, FlagIcon ← Flag, RefreshIcon ← RefreshCw, EyeIcon ← Eye, CheckIcon ← Check, CircleCheckIcon ← CircleCheck, InfoIcon ← Info, AlertTriangleIcon ← TriangleAlert, CircleAlertIcon ← CircleAlert, WifiOffIcon ← WifiOff, CloudCheckIcon ← CloudCheck, UserIcon ← User, SettingsIcon ← Settings, LogOutIcon ← LogOut, SunIcon ← Sun, MoonIcon ← Moon, LightbulbIcon ← Lightbulb, ClockIcon ← Clock, CalendarIcon ← Calendar, PencilIcon ← Pencil, SearchIcon ← Search, TrashIcon ← Trash2.

## Riscos

- Um nome do mapa não existir na versão instalada do `lucide-react`: o passo 1 confere todos antes do código e para com a pergunta.
- O `lucide-react` acrescenta as classes `lucide lucide-<nome>` ao `<svg>`; o `className` recebido se soma a elas. Isso não muda o visual nem a acessibilidade.

## Referências da spec

RF-01, RF-02, CT-01, CT-02, RN-03, RNF-08; decisão 1; [project/accessibility-03], [project/code-style-08], [project/code-style-09].

## Arquivos em comum na onda

Onda 2 (com TASK-13): nenhum arquivo em comum.
