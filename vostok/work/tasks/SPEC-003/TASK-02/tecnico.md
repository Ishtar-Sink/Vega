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

## O que foi feito

Arquivos em `src/icons/`:

- `icon.types.ts` (novo): `IconProps`, que estende as props nativas de `svg` sem `children`, com `size?: 16 | 20 | 24` (padrão 20).
- `icon.tsx` (novo): `createIcon(Lucide, displayName)`, fábrica interna que devolve um componente. Define `size`, `strokeWidth={2}` e `color="currentColor"`, e aplica `aria-hidden="true"` e `focusable="false"` depois do `...rest`. Não é exportada.
- `interface-icons.tsx` (novo): 36 linhas `export const <NomeVega> = createIcon(<NomeLucide>, '<NomeVega>')`, agrupadas por comentário (navegação, setas, ações, estados, conta e estudo). Importa só os 36 nomes do `lucide-react`.
- `interface-icons.test.tsx` (novo): confere os 36 exports, o aspecto decorativo, o traço `currentColor`, o `ref`, os tamanhos 16 e 24, o repasse de `className` e `style`, e axe num botão com `CloseIcon`.
- `index.ts` (alterado): reexporta os 36 ícones e `IconProps`, e mantém as duas linhas dos ícones de visualização.

## Como foi verificado

- TDD: o teste dos ícones foi escrito antes do código e falhou com `Failed to resolve import "./interface-icons"`.
- Depois da implementação, a pasta `src/icons` passa com 51 testes, incluindo os de `view-icons.test.tsx`, que já existiam.
- Regressão: os 3 comandos do baseline rodaram de novo com código de saída 0.
- Evidências: `icones-testes.txt`, `icones-arquivos.txt` e `icones-temas.png`, conferidas pelo usuário.

## Pontos de atenção

- Três nomes do mapa (`TriangleAlert`, `CircleAlert` e `Trash2`) pareceram faltar no passo 1. O `grep` procurava `declare const`, mas no `lucide-react` 1.71.0 esses nomes são aliases exportados (`TriangleExclamationPoint as TriangleAlert`, `CircleExclamationPoint as CircleAlert`, `Trash as Trash2`). Eles importam normalmente, e o mapa da spec foi mantido. Para conferir de novo, importe o nome ou procure `as TriangleAlert` no `.d.ts`.
- O `aria-hidden` é fixo e não muda por prop. O nome acessível fica no elemento que contém o ícone (`aria-label` ou texto visível).
- `size` aceita só 16, 20 e 24: o tipo impede tamanhos fora da grade de 4 px.
- A cor vem de `currentColor`. Para mudar a cor, altere o `color` do pai; o `className` recebido se soma às classes `lucide lucide-<nome>`.
- Os 36 nomes são contrato da spec. Renomear um ícone quebra os produtos que já o importam.
- Um ícone novo entra editando `interface-icons.tsx` e a lista `ICON_NAMES` do teste, porque `createIcon` não é exportada.
