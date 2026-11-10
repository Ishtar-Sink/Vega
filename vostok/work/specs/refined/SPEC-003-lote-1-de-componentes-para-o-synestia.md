---
id: SPEC-003
title: "Lote 1 de componentes para o Synestia"
status: implemented
author: "Victor Batalha"
created_at: 2026-11-10T17:44:48Z
updated_at: 2026-11-10T20:37:37Z
tags: []
type: feature
source: "draft/SPEC-003-lote-1-de-componentes-para-o-synestia.md"
refined_at: 2026-11-10T17:50:46Z
adjustments: 1
adjusted_at: 2026-11-10T18:14:25Z
content_hash: 8cf3864f6c914b59e1ce2ca89584f93d5f7add7e257fc2cf67185db166706842
approved_at: 2026-11-10T18:27:56Z
approved_hash: 8cf3864f6c914b59e1ce2ca89584f93d5f7add7e257fc2cf67185db166706842
status_history: 2026-11-10T18:01:34Z approved; 2026-11-10T18:14:13Z planned; 2026-11-10T18:14:25Z refined; 2026-11-10T18:27:56Z planned; 2026-11-10T20:37:37Z implemented
changed_ids: []
---

# Lote 1 de componentes para o Synestia - Especificação Refinada

A Vega ganha o lote 1 de componentes pedido pelo Synestia no KT-001: ícones, `Switch`, `RadioGroup`, `TextAreaField`, `Disclosure`/`Accordion`, `Callout`, `BottomSheet`, `Prose` (numa entrada própria), `AppShell` com `Sidebar`, `BottomNav` e `Topbar`, `FocusHeader`, `CardLink`/`CardButton` e as extensões de `Button` e `ProgressBar`, publicados juntos na versão 0.2.0.

## Objetivo

O Synestia precisa montar a interface da fase 1 só com a Vega ([project/architecture-05]), e hoje faltam componentes de navegação, formulário, leitura e aviso. O resultado esperado é a `@ishtar-sink/vega` 0.2.0 publicada com esses componentes, genéricos para qualquer produto, a tempo de o Synestia montar as telas antes de 22/11/2026.

## Escopo

### Dentro do escopo

- Ícones de interface sobre o `lucide-react`, com nomes e padrões da Vega.
- `Switch`, `RadioGroup` e `TextAreaField`.
- `Disclosure` e `Accordion`.
- `Callout`.
- `BottomSheet`.
- `Prose`, com Markdown sanitizado, na entrada `@ishtar-sink/vega/prose`.
- `AppShell`, `Sidebar`, `BottomNav` e `Topbar`.
- `FocusHeader`, componente próprio para fluxos guiados.
- `CardLink` e `CardButton`, os cartões interativos.
- Extensões de `Button` (`size`, `block`) e de `ProgressBar` (`valueText`, `indeterminate`).
- Exportações no `src/index.ts`, `CHANGELOG.md` e `README.md` da 0.2.0 e publicação pela tag `v0.2.0`.

### Fora do escopo

- O lote 2 do KT-001: `FileField`, `Breadcrumbs`, `Avatar`, `Tooltip`, `DataTable`, `StatTile`, `Timer`, `ConnectionStatus` e as extensões de `Toast`, `Tabs`, `EmptyState` e da escala de leitura.
- Os componentes próprios do Synestia (conta armada, escada de dicas, cartão de revisão, grade do simulado), que ficam no Synestia.
- A troca do Atria para os componentes novos, que vira uma spec no Atria.
- A refatoração dos componentes existentes para [project/code-style-08] e [project/code-style-09] (SPEC-002), que fica para depois.
- Fechar o `BottomSheet` arrastando: a alça é só visual.
- Tokens novos no tema: as medidas novas usam `calc(var(--space) * N)`.

## Requisitos funcionais

| ID | Requisito |
|---|---|
| RF-01 | O sistema deve exportar os 36 ícones da primeira leva (os 34 do KT-001 mais `SearchIcon` e `TrashIcon`) como componentes da Vega (`HomeIcon`, `CloseIcon`...), feitos sobre o `lucide-react`. |
| RF-02 | Os ícones devem ter `aria-hidden="true"` e `focusable="false"` por padrão, tamanho padrão 20 (`size` 16, 20 ou 24), traço `currentColor` com espessura 2, e repassar a `ref` e as props nativas do `<svg>`. |
| RF-03 | O `Switch` deve ser um `<button role="switch">` com `aria-checked`, nome acessível vindo do `label` e `help` opcional ligado por `aria-describedby`. |
| RF-04 | O `Switch` deve alternar por clique, Espaço, Enter e toque no rótulo, chamando `onCheckedChange`, e não alternar quando `disabled`. |
| RF-05 | O `RadioGroup` deve usar `<fieldset>`, `<legend>` (visível ou oculto com `hideLabel`) e `<input type="radio">` nativos, com seleção pelas setas do teclado. |
| RF-06 | O `RadioGroup` deve aceitar em cada opção `description`, `marker`, `disabled`, `tone` (`success`, `danger`, `neutral`) e `adornment`. |
| RF-07 | O `RadioGroup` com `variant="card"` deve tornar o cartão inteiro o rótulo da opção e mostrar a seleção com borda `primary`, fundo `primarySoft` e ícone de confere. |
| RF-08 | O `RadioGroup` com `readOnly` deve manter as opções legíveis e anunciadas, sem permitir a troca da seleção. |
| RF-09 | O `RadioGroup` deve mostrar `help` e `error` como o `TextField`, com o erro em `role="alert"` ligado por `aria-describedby`. |
| RF-10 | O `TextAreaField` deve ter rótulo, `help` e erro com as mesmas regras e visual do `TextField`. |
| RF-11 | O `TextAreaField` com `autoResize` deve crescer com o conteúdo entre `minRows` e `maxRows`, rolando depois do `maxRows`. |
| RF-12 | O `TextAreaField` deve mostrar o `counter` recebido, ligado ao campo por `aria-describedby`, sem anúncio a cada tecla. |
| RF-13 | O `Disclosure` deve usar `<details>` e `<summary>` nativos, com `title`, `icon` e `tone` (`default`, `accent`, `warning`, `info`). |
| RF-14 | O `Disclosure` deve funcionar controlado (`open` e `onOpenChange`) e não controlado. |
| RF-15 | O `Accordion` com `type="single"` deve fechar os outros `Disclosure` ao abrir um; com `multiple`, eles abrem de forma independente. |
| RF-16 | O `Callout` deve ser um `<aside>` com `tone` (`neutral`, `accent`, `info`, `success`, `warning`, `danger`), fundo `*Soft` do tom, ícone e título na cor cheia do tom. |
| RF-17 | O `Callout` deve trocar o ícone padrão conforme o tom, aceitar um `icon` próprio ou `false`, e uma `action` no fim. |
| RF-18 | O `Callout` com `live="polite"` deve ter `role="status"`; com `off` (padrão), nenhum papel de região viva. |
| RF-19 | O `BottomSheet` deve usar o `<dialog>` nativo com `showModal()`, `title`, `description` e `footer` fixo, com o conteúdo rolando. |
| RF-20 | O `BottomSheet` deve fechar por Escape, pelo toque no fundo e pelo botão de fechar (`labels.close`, padrão `Fechar`), chamando `onClose` e devolvendo o foco a quem abriu. |
| RF-21 | O `BottomSheet` com `placement="auto"` deve ficar embaixo abaixo de 720 px e na lateral direita a partir de 720 px; `bottom` e `side` fixam a posição. |
| RF-22 | O `Prose` deve renderizar o `markdown` recebido em elementos React, ou estilizar os `children` quando não houver `markdown`. |
| RF-23 | O `Prose` deve permitir só títulos, parágrafos, listas, ênfase, código, citações, tabelas, links e imagens, descartando HTML cru e URLs `javascript:`. |
| RF-24 | O `Prose` deve dar `rel="noopener noreferrer"` aos links externos e `loading="lazy"` às imagens. |
| RF-25 | O `Prose` deve aceitar `components` (troca a renderização de um elemento) e `remarkPlugins` (sintaxe extra do produto). |
| RF-26 | O `Prose` deve ter `size` `base` (16 px) e `reading` (18 px), corpo em Inter com `line-height` 1,6 e no máximo 68 caracteres por linha, e tabelas com rolagem horizontal. |
| RF-27 | O `Prose` deve ser exportado pela entrada `@ishtar-sink/vega/prose`, fora do `src/index.ts`. |
| RF-28 | A `Sidebar` deve mostrar a `brand`, uma `<nav>` com nome acessível (`labels.navigation`, padrão `Principal`), os itens com `aria-current="page"` no atual e o `footer`. |
| RF-29 | A `Sidebar` em modo gaveta deve prender o foco, fechar por Escape, ficar `inert` quando fechada e devolver o foco ao botão de menu. |
| RF-30 | A `BottomNav` deve ficar fixa embaixo, com 3 a 5 destinos de ícone e rótulo sempre visíveis, `badge` opcional e `aria-current="page"` no atual. |
| RF-31 | A `Topbar` deve ser um `<header>` com os slots `start`, `center` e `end`. |
| RF-32 | O `AppShell` deve compor `Sidebar`, `Topbar` e `<main>`, com o link "Pular para o conteúdo" (`labels.skipToContent`) como primeiro foco da página. |
| RF-33 | O `AppShell` deve trocar a navegação abaixo de 720 px conforme `mobileNav`: gaveta (`drawer`, com botão `labels.openMenu`) ou `BottomNav` (`bottom`), reservando o espaço da `BottomNav` no conteúdo. |
| RF-34 | O `AppShell` com `hideNavigation` deve esconder toda a navegação e manter o `<main>`. |
| RF-35 | `Sidebar`, `BottomNav` e `AppShell` devem renderizar os links pelo `renderLink` do produto, ou com `<a>` simples quando ele faltar. |
| RF-36 | O `Button` deve aceitar `size` (`md` padrão, `lg` com altura mínima de 48 px) e `block` (largura total), sem mudar o visual padrão. |
| RF-37 | O `ProgressBar` deve aceitar `valueText`, mostrado como texto visível e aplicado em `aria-valuetext`. |
| RF-38 | O `ProgressBar` com `indeterminate` deve omitir `aria-valuenow` e animar a barra, sem animação com movimento reduzido. |
| RF-39 | O `CardLink` (`<a>`) e o `CardButton` (`<button>`) devem ter o visual do `Card`, hover, foco visível e pressionado, com o cartão inteiro como um único alvo. |
| RF-40 | O `FocusHeader` deve mostrar o botão de sair (`labels.exit`, padrão `Sair`), o título curto, a posição (ex.: "3/8") e um `ProgressBar`, numa linha a partir de 360 px. |
| RF-41 | O sistema deve exportar pelo `src/index.ts` todos os componentes novos e os tipos das props, menos o `Prose`. |
| RF-42 | O sistema deve publicar a versão 0.2.0 pela tag `v0.2.0`, com a entrada no `CHANGELOG.md` e o `README.md` atualizado. |

## Requisitos não funcionais

| ID | Requisito | Como verificar |
|---|---|---|
| RNF-01 | Todo componente novo funciona a partir de 360 px de largura | Teste de cada componente em 360 px na evidência visual (print automático) |
| RNF-02 | Todo alvo de toque novo tem pelo menos 44 px no celular | Teste que lê o `.module.css` e confere a altura mínima |
| RNF-03 | Todo componente novo passa no axe nos dois temas | `vitest-axe` em cada arquivo de teste |
| RNF-04 | Animações só com `--motion-*`, até 320 ms, e nenhuma com `prefers-reduced-motion` | Teste que lê o `.module.css` e confere o bloco `@media (prefers-reduced-motion: reduce)` |
| RNF-05 | Os tons novos (`Callout`, `RadioGroup`) passam em AA nos dois temas | Teste com `contrastRatio` sobre os pares de tokens usados |
| RNF-06 | Quem importa só `@ishtar-sink/vega` não carrega o parser de Markdown | `dist/index.js` sem import de `react-markdown`, conferido no build |
| RNF-07 | Nenhum `dangerouslySetInnerHTML` no código | `grep` no `src/` sem ocorrências |
| RNF-08 | Arquivos novos com no máximo 200 linhas e um contexto por arquivo ([project/code-style-08], [project/code-style-09]) | `wc -l` dos arquivos novos e revisão da divisão |
| RNF-09 | Nenhuma requisição de rede nem URL externa no `dist/` | A mesma busca da TASK-12 da SPEC-001 (`sem-rede.txt`) |

## Regras de negócio

| ID | Regra |
|---|---|
| RN-01 | Nenhum componente tem regra de um produto: o comportamento de estudo do Synestia entra por props e slots ([project/architecture-04], [project/code-style-07]) |
| RN-02 | Todo texto visível novo é uma prop sobrescrevível (`label` ou `labels`), com padrão em pt-br ([project/language-06]) |
| RN-03 | Um estado nunca depende só da cor: seleção, tom e ligado/desligado têm também ícone, borda ou posição ([project/theme-06]) |
| RN-04 | Cada dependência de runtime nova (`lucide-react`, `react-markdown`, `remark-gfm`, `rehype-sanitize`) tem a justificativa registrada na tarefa que a adiciona ([project/stack-07]) |
| RN-05 | A regra de contagem do `TextAreaField`, a ordem de abertura das dicas e o roteamento ficam com o produto |
| RN-06 | A publicação da 0.2.0 é feita só pela CI, a partir da tag ([project/security-04]) |

## Fluxos

### Fluxo principal

1. Adicionar as dependências `lucide-react`, `react-markdown`, `remark-gfm` e `rehype-sanitize`, com a justificativa, e externalizá-las no build.
2. Criar os ícones.
3. Estender `Button` e `ProgressBar`.
4. Criar `Switch`, `RadioGroup` e `TextAreaField` (em paralelo).
5. Criar `Callout`, `Disclosure` e `Accordion` (em paralelo).
6. Criar `CardLink`, `CardButton` e `FocusHeader`.
7. Criar o `BottomSheet`.
8. Criar o `Prose` e a entrada `@ishtar-sink/vega/prose`.
9. Criar `Topbar`, `Sidebar`, `BottomNav` e `AppShell`.
10. Registrar as exportações no `src/index.ts`.
11. Escrever o `CHANGELOG.md` da 0.2.0, atualizar o `README.md` e a versão do `package.json`.
12. Publicar pela tag `v0.2.0`.

### Fluxos alternativos

- FA-01 (passo 12): o prazo de 15/11 aperta. O usuário decide se publica a 0.2.0 sem os itens do fim da ordem (`Prose` e `AppShell`), registrando a mudança pela `adjust-spec`.
- FA-02 (passo 12): o workflow Release falha. A correção é feita pela CI e a tag é recriada; nunca `npm publish` local.
- FA-03 (passo 5): o navegador não suporta o atributo `name` do `<details>`. O `Accordion` fecha os irmãos pelo evento `toggle`.

## Casos de borda

| ID | Situação | Comportamento esperado | Requisitos |
|---|---|---|---|
| CB-01 | `Switch` desabilitado recebe clique ou Espaço | Não alterna nem chama `onCheckedChange` | RF-04 |
| CB-02 | `RadioGroup` com `value` `null` | Nenhuma opção marcada; a primeira opção habilitada recebe o foco do Tab | RF-05 |
| CB-03 | `RadioGroup` com `readOnly` recebe as setas | A seleção não muda | RF-08 |
| CB-04 | `TextAreaField` com texto maior que `maxRows` | Para de crescer e rola | RF-11 |
| CB-05 | `Disclosure` controlado sem `onOpenChange` | Mantém o `open` recebido | RF-14 |
| CB-06 | `Callout` com `icon={false}` | Sem ícone, com o título e o fundo do tom | RF-17 |
| CB-07 | `BottomSheet` aberto com `open` passando a `false` por fora | Fecha o `<dialog>` e devolve o foco | RF-20 |
| CB-08 | Markdown com `<script>`, `<img onerror>` e `[x](javascript:alert(1))` | Nada é executado nem renderizado como HTML; o link fica sem `href` perigoso | RF-23 |
| CB-09 | Tabela larga no `Prose` a 360 px | A tabela rola na horizontal, sem rolar a página | RF-26 |
| CB-10 | `BottomNav` com menos de 3 ou mais de 5 itens | Erro de tipo não é possível; em desenvolvimento, um aviso no console | RF-30 |
| CB-11 | `AppShell` sem `renderLink` | Links com `<a href>` simples | RF-35 |
| CB-12 | `ProgressBar` com `indeterminate` e `value` | Ignora o `value` e não anuncia valor | RF-38 |
| CB-13 | `FocusHeader` com título longo a 360 px | O título corta com reticências, sem quebrar a linha | RF-40 |

## Contratos e interfaces

Ícones (`src/icons/`), sobre o `lucide-react`:

```ts
export interface IconProps extends Omit<ComponentPropsWithRef<'svg'>, 'children'> {
  /** Lado em px. Padrão: 20. */
  size?: 16 | 20 | 24;
}
// Um componente por ícone, com o nome da Vega e o ícone do Lucide correspondente:
// HomeIcon (House), BookOpenIcon (BookOpen), LayersIcon (Layers), TimerIcon (Timer),
// UsersIcon (Users), MenuIcon (Menu), ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon,
// ArrowLeftIcon, CloseIcon (X), PlusIcon, MinusIcon, DownloadIcon, UploadIcon, FlagIcon,
// RefreshIcon (RefreshCw), EyeIcon, CheckIcon, CircleCheckIcon, InfoIcon,
// AlertTriangleIcon (TriangleAlert), CircleAlertIcon, WifiOffIcon, CloudCheckIcon,
// UserIcon, SettingsIcon, LogOutIcon, SunIcon, MoonIcon, LightbulbIcon, ClockIcon,
// CalendarIcon, PencilIcon, SearchIcon (Search), TrashIcon (Trash2)
```

Campos e conteúdo:

```ts
export interface SwitchProps extends Omit<ComponentPropsWithRef<'button'>, 'onChange' | 'children'> {
  label: string;
  help?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export interface RadioOption {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  marker?: ReactNode;
  disabled?: boolean;
  tone?: 'success' | 'danger' | 'neutral';
  adornment?: ReactNode;
}
export interface RadioGroupProps extends Omit<ComponentPropsWithRef<'fieldset'>, 'onChange'> {
  label: string;
  hideLabel?: boolean;
  options: readonly RadioOption[];
  value: string | null;
  onChange: (value: string) => void;
  name?: string;
  variant?: 'default' | 'card';
  readOnly?: boolean;
  help?: string;
  error?: string;
}

export interface TextAreaFieldProps extends ComponentPropsWithRef<'textarea'> {
  label: string;
  help?: string;
  error?: string;
  autoResize?: boolean;
  minRows?: number;
  maxRows?: number;
  counter?: ReactNode;
}

export interface DisclosureProps extends Omit<ComponentPropsWithRef<'details'>, 'title' | 'onToggle'> {
  title: ReactNode;
  icon?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  tone?: 'default' | 'accent' | 'warning' | 'info';
}
export interface AccordionProps extends ComponentPropsWithRef<'div'> {
  type?: 'single' | 'multiple';
  children: ReactNode;
}

export interface CalloutProps extends Omit<ComponentPropsWithRef<'aside'>, 'title'> {
  tone?: 'neutral' | 'accent' | 'info' | 'success' | 'warning' | 'danger';
  title?: ReactNode;
  icon?: ReactNode | false;
  action?: ReactNode;
  live?: 'off' | 'polite';
}

export interface BottomSheetProps extends Omit<ComponentPropsWithRef<'dialog'>, 'title'> {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  placement?: 'auto' | 'bottom' | 'side';
  labels?: Partial<{ close: string }>;
}
```

`Prose`, na entrada `@ishtar-sink/vega/prose` (`src/prose/index.ts`):

```ts
export type ProseComponents = Components; // de react-markdown
export type ProsePlugin = PluggableList[number]; // de unified
export interface ProseProps extends Omit<ComponentPropsWithRef<'div'>, 'children'> {
  markdown?: string;
  children?: ReactNode;
  size?: 'base' | 'reading';
  components?: ProseComponents;
  remarkPlugins?: ProsePlugin[];
}
```

```json
"exports": {
  ".": "./dist/index.js",
  "./prose": "./dist/prose.js",
  "./styles.css": "./dist/style.css",
  "./tokens.css": "./dist/tokens.css"
}
```

Navegação:

```ts
export interface NavItem {
  id: string;
  label: string;
  icon: ReactNode;
  href: string;
  current?: boolean;
  badge?: ReactNode;
}
export type RenderNavLink = (
  item: NavItem,
  props: { className: string; 'aria-current'?: 'page'; children: ReactNode },
) => ReactNode;
export interface SidebarProps extends ComponentPropsWithRef<'aside'> {
  brand: ReactNode;
  items: readonly NavItem[];
  renderLink?: RenderNavLink;
  footer?: ReactNode;
  drawer?: boolean;
  open?: boolean;
  onClose?: () => void;
  labels?: Partial<{ navigation: string }>;
}
export interface BottomNavProps extends ComponentPropsWithRef<'nav'> {
  items: readonly NavItem[];
  renderLink?: RenderNavLink;
  labels?: Partial<{ navigation: string }>;
}
export interface TopbarProps extends ComponentPropsWithRef<'header'> {
  start?: ReactNode;
  center?: ReactNode;
  end?: ReactNode;
}
export interface AppShellProps extends ComponentPropsWithRef<'div'> {
  sidebar: Omit<SidebarProps, 'drawer' | 'open' | 'onClose'>;
  topbar?: TopbarProps;
  mobileNav?: 'drawer' | 'bottom';
  hideNavigation?: boolean;
  children: ReactNode;
  labels?: Partial<{ skipToContent: string; openMenu: string }>;
}
```

Extensões e cartões:

```ts
export interface ButtonProps extends ComponentPropsWithRef<'button'> {
  variant?: ButtonVariant;
  loading?: boolean;
  tint?: string;
  /** `lg`: altura mínima de 48 px. Padrão: `md`. */
  size?: 'md' | 'lg';
  /** Ocupa a largura toda. */
  block?: boolean;
}
export interface ProgressBarProps extends ComponentPropsWithRef<'div'> {
  label: string;
  value: number;
  max?: number;
  valueText?: string;
  indeterminate?: boolean;
}
export interface CardLinkProps extends ComponentPropsWithRef<'a'> { tone?: CardTone }
export interface CardButtonProps extends ComponentPropsWithRef<'button'> { tone?: CardTone }
export interface FocusHeaderProps extends Omit<ComponentPropsWithRef<'header'>, 'title'> {
  title: string;
  onExit: () => void;
  /** Posição atual, ex.: "3/8". */
  position?: string;
  progress?: { value: number; max: number; label: string };
  labels?: Partial<{ exit: string }>;
}
```

## Componentes afetados

| Caminho | Ação | Motivo |
|---|---|---|
| `src/icons/icon.tsx` | criar | Componente-base interno sobre o lucide-react, com aria-hidden e size |
| `src/icons/interface-icons.tsx` | criar | Os 36 ícones de interface com os nomes da Vega |
| `src/icons/index.ts` | alterar | Exporta os ícones novos ao lado dos de visualização |
| `src/switch/` | criar | Componente Switch |
| `src/radio-group/` | criar | Componente RadioGroup |
| `src/text-area-field/` | criar | Componente TextAreaField |
| `src/disclosure/` | criar | Componentes Disclosure e Accordion |
| `src/callout/` | criar | Componente Callout |
| `src/bottom-sheet/` | criar | Componente BottomSheet |
| `src/prose/prose.tsx` | criar | Componente Prose |
| `src/prose/index.ts` | criar | Entrada própria `@ishtar-sink/vega/prose`, com o componente e os tipos |
| `src/app-shell/` | criar | AppShell, Sidebar, BottomNav e Topbar |
| `src/focus-header/` | criar | Componente FocusHeader |
| `src/card-link/` | criar | Componentes CardLink e CardButton |
| `src/button/button.tsx` | alterar | Props size e block |
| `src/button/button.module.css` | alterar | Estilos de size lg e block |
| `src/progress-bar/progress-bar.tsx` | alterar | Props valueText e indeterminate |
| `src/progress-bar/progress-bar.module.css` | alterar | Texto do valor e animação indeterminada |
| `src/index.ts` | alterar | Exportações dos componentes novos |
| `src/index.test.ts` | alterar | Superfície pública com os nomes novos |
| `vite.config.ts` | alterar | Segunda entrada (prose) e as dependências novas como externas |
| `package.json` | alterar | Dependências novas, entrada ./prose no exports e versão 0.2.0 |
| `pnpm-lock.yaml` | alterar | Dependências novas |
| `CHANGELOG.md` | alterar | Entrada da 0.2.0 |
| `README.md` | alterar | Componentes novos, ícones e a entrada do Prose |
| `docs/KT-001-vega-lote-1.md` | alterar | Passa a ser versionado, sem mudar o conteúdo, como origem da spec |

## Premissas e dependências

- A SPEC-001 está concluída até a TASK-14, com a 0.1.0 publicada pelo workflow `Release` e o segredo `NPM_TOKEN` no ambiente `npm`.
- O `lucide-react` (1.71.0 na consulta) aceita React 19 como peer, e `react-markdown` 10, `remark-gfm` 4 e `rehype-sanitize` 6 convertem Markdown em elementos React sem `innerHTML`.
- O Atria tem as referências citadas pelo KT-001 em `../atria/apps/web/src/app/layout/` e nos formulários do diário, das metas e dos lembretes.
- O Synestia consome a 0.2.0 assim que ela for publicada; não há versão intermediária.
- O `Dialog` da Vega (`src/dialog/`) é a base de comportamento de foco do `BottomSheet`.

## Riscos

| Risco | Impacto | Mitigação |
|---|---|---|
| O prazo de 15/11 não cabe no lote inteiro numa versão só | alto | Ordem do KT-001 com paralelismo (passos 4 e 5); FA-01 permite cortar `Prose` e `AppShell` com decisão do usuário |
| `lucide-react` aumenta o pacote ou não faz tree-shaking | médio | Importar cada ícone pelo nome e externalizar a dependência no build; conferir o tamanho do `dist/index.js` |
| Sanitização do Markdown deixa passar HTML ou URL perigosa | alto | `rehype-sanitize` com lista do que é permitido e teste com os vetores do CB-08 |
| Extrair a navegação do Atria traz dependência de roteador, sessão ou tradução | médio | `renderLink`, slots e `labels`; teste sem roteador (CB-11) |
| O atributo `name` do `<details>` não existe no jsdom nem em navegadores antigos | baixo | Fallback pelo evento `toggle` (FA-03), que também cobre os testes |
| Estender `Button` e `ProgressBar` passa o limite de 200 linhas | baixo | Separar tipos e estilos novos em arquivos próprios, só no que a extensão tocar; a refatoração completa fica na SPEC-002 |

## Casos de teste

| ID | Cenário | Passos | Resultado esperado | Requisitos |
|---|---|---|---|---|
| CT-01 | Ícones exportados | Percorrer os 36 ícones do índice e renderizar cada um | Todos renderizam um `<svg>` com `aria-hidden`, `focusable="false"`, `ref` repassada e só `currentColor` | RF-01, RF-02 |
| CT-02 | Tamanho dos ícones | Renderizar um ícone sem `size` e com `size={24}` | Lado de 20 px por padrão e 24 px com a prop | RF-02 |
| CT-03 | Switch pelo teclado e pelo rótulo | Focar o switch, apertar Espaço e Enter, clicar no rótulo | Alterna nas três ações, com `aria-checked` atualizado e nome vindo do `label` | RF-03, RF-04 |
| CT-04 | Switch desabilitado | Clicar e apertar Espaço num switch `disabled` | Não chama `onCheckedChange` | RF-04 |
| CT-05 | RadioGroup pelas setas | Focar a primeira opção e apertar seta para baixo | A seleção passa para a segunda opção e `onChange` é chamado | RF-05 |
| CT-06 | RadioGroup com campos da opção | Renderizar opções com `description`, `marker`, `tone` e `adornment` | Todos aparecem; o `tone` mostra ícone além da cor | RF-06 |
| CT-07 | RadioGroup card | Clicar na borda do cartão de uma opção na variante `card` | A opção fica selecionada, com o ícone de confere | RF-07 |
| CT-08 | RadioGroup readOnly | Apertar as setas num grupo `readOnly` | A seleção não muda e as opções continuam anunciadas | RF-08 |
| CT-09 | RadioGroup com erro | Renderizar com `error` | O erro tem `role="alert"` e está no `aria-describedby` do grupo | RF-09 |
| CT-10 | TextAreaField com rótulo e erro | Renderizar com `label`, `help` e `error` | O campo tem nome pelo rótulo, `aria-invalid` e o erro em `role="alert"` | RF-10 |
| CT-11 | TextAreaField autoResize | Digitar mais linhas que o `maxRows` | A altura para no `maxRows` e o campo rola | RF-11 |
| CT-12 | TextAreaField counter | Renderizar com `counter` e digitar | O contador está no `aria-describedby` e não tem `aria-live` | RF-12 |
| CT-13 | Disclosure não controlado | Clicar no resumo e apertar Enter | Abre e fecha; o `tone` e o `icon` aparecem | RF-13 |
| CT-14 | Disclosure controlado | Renderizar com `open` e clicar no resumo | Chama `onOpenChange(false)` e mantém o estado recebido | RF-14 |
| CT-15 | Accordion single | Abrir o primeiro e depois o segundo `Disclosure` | Só o segundo fica aberto; com `multiple`, os dois | RF-15 |
| CT-16 | Callout por tom | Renderizar os seis tons | Cada um com o fundo `*Soft`, o ícone do tom e contraste AA nos dois temas | RF-16, RF-17 |
| CT-17 | Callout live | Renderizar com `live="polite"` e com o padrão | `role="status"` só no primeiro | RF-18 |
| CT-18 | BottomSheet abre e fecha | Abrir, apertar Escape, abrir e clicar no fundo e no botão Fechar | `showModal` é chamado, `onClose` é chamado nas três formas e o foco volta ao gatilho | RF-19, RF-20 |
| CT-19 | BottomSheet placement | Ler o `.module.css` e renderizar com `bottom`, `side` e `auto` | A classe muda conforme o `placement`, e o `auto` troca em 720 px | RF-21 |
| CT-20 | Prose renderiza Markdown | Renderizar `markdown` com título, lista, tabela, link externo e imagem | Elementos React correspondentes; link com `rel="noopener noreferrer"`; imagem com `loading="lazy"` | RF-22, RF-24 |
| CT-21 | Prose sanitiza | Renderizar o Markdown do CB-08 | Nenhum `<script>`, nenhum atributo `on*` e nenhum `href` com `javascript:` | RF-23 |
| CT-22 | Prose extensível | Passar `components` para `h2` e um `remarkPlugins` de teste | O `h2` usa o componente passado e o plugin é aplicado | RF-25 |
| CT-23 | Prose tamanhos e tabela | Renderizar com `size="reading"` e ler o `.module.css` | Classe de 18 px, `max-width` de 68ch e tabela com `overflow-x: auto` | RF-26 |
| CT-24 | Entrada do Prose | Rodar o build e importar `@ishtar-sink/vega/prose` e `@ishtar-sink/vega` | O `Prose` existe só na entrada própria, e o `dist/index.js` não importa `react-markdown` | RF-27 |
| CT-25 | Sidebar | Renderizar com itens, um atual e `footer` | `<nav>` "Principal", `aria-current="page"` no atual, marca e rodapé | RF-28 |
| CT-26 | Sidebar gaveta | Abrir a gaveta, apertar Tab até o fim e Escape | O foco fica preso, Escape chama `onClose`, a gaveta fechada fica `inert` e o foco volta ao botão de menu | RF-29 |
| CT-27 | BottomNav | Renderizar com 4 itens, um atual e um `badge` | Ícone e rótulo visíveis em todos, `aria-current` no atual e o selo | RF-30 |
| CT-28 | Topbar | Renderizar com `start`, `center` e `end` | Os três slots dentro do `<header>` | RF-31 |
| CT-29 | AppShell pular conteúdo | Apertar Tab na página | O primeiro foco é "Pular para o conteúdo", que leva ao `<main>` | RF-32 |
| CT-30 | AppShell navegação móvel | Renderizar com `mobileNav` `drawer` e `bottom` e ler o `.module.css` | Botão de menu no `drawer`, `BottomNav` no `bottom`, troca em 720 px e espaço reservado | RF-33 |
| CT-31 | AppShell hideNavigation | Renderizar com `hideNavigation` | Sem `<nav>`, com o `<main>` | RF-34 |
| CT-32 | renderLink | Renderizar a `Sidebar` com e sem `renderLink` | Com ele, o link do produto recebe `className` e `aria-current`; sem ele, `<a href>` | RF-35 |
| CT-33 | Button size e block | Renderizar com `size="lg"`, `block` e sem as props | Classe de 48 px, largura 100% e o padrão sem mudança | RF-36 |
| CT-34 | ProgressBar valueText | Renderizar com `valueText="4 de 9"` | Texto visível e `aria-valuetext` | RF-37 |
| CT-35 | ProgressBar indeterminate | Renderizar com `indeterminate` e ler o `.module.css` | Sem `aria-valuenow` e sem animação com movimento reduzido | RF-38 |
| CT-36 | CardLink e CardButton | Renderizar os dois, focar e clicar | `<a>` e `<button>` de verdade, foco visível e o cartão inteiro como alvo | RF-39 |
| CT-37 | FocusHeader | Renderizar com título, posição e progresso, clicar em Sair | Botão com nome `Sair` (ou o de `labels`), posição, `ProgressBar` e `onExit` chamado | RF-40 |
| CT-38 | Índice público | Rodar o teste da superfície pública | Todos os nomes novos exportados e o `Prose` fora do índice | RF-41 |
| CT-39 | Publicação da 0.2.0 | Conferir `npm view @ishtar-sink/vega@0.2.0` e o run da tag `v0.2.0` | Versão 0.2.0 com provenance, publicada pelo workflow Release | RF-42 |

## Critérios de aceite

- [ ] CA-01: Os 36 ícones são exportados pelo índice, com `aria-hidden`, `ref` repassada e só `currentColor` (RF-01, RF-02).
- [ ] CA-02: O `Switch` tem papel `switch` com nome do `label`, alterna pelo teclado e pelo rótulo e não alterna desabilitado (RF-03, RF-04).
- [ ] CA-03: As duas variantes do `RadioGroup` passam no axe, as setas mudam a seleção, o `tone` tem sinal além da cor e, na variante `card`, toda a área do cartão seleciona (RF-05, RF-06, RF-07, RF-08, RF-09).
- [ ] CA-04: O `autoResize` do `TextAreaField` respeita o `maxRows`, o contador é lido junto do campo e o erro aparece com `role="alert"` (RF-10, RF-11, RF-12).
- [ ] CA-05: `Disclosure` e `Accordion` funcionam controlados e não controlados, abrem por Enter e Espaço e o `single` fecha os outros (RF-13, RF-14, RF-15).
- [ ] CA-06: Todos os tons do `Callout` passam em AA nos dois temas, o ícone padrão muda com o tom e `live` liga e desliga o `role="status"` (RF-16, RF-17, RF-18).
- [ ] CA-07: O `BottomSheet` passa nos testes de foco do `Dialog`, troca de posição em 720 px e tem o rodapé fixo com o conteúdo rolando (RF-19, RF-20, RF-21).
- [ ] CA-08: O `Prose` não executa nem renderiza HTML nem `javascript:`, as tabelas rolam a 360 px, `components` substitui um elemento e ele sai só em `@ishtar-sink/vega/prose` (RF-22, RF-23, RF-24, RF-25, RF-26, RF-27).
- [ ] CA-09: O `AppShell` funciona com `renderLink` e com `<a>`, troca entre `drawer` e `bottom` em 720 px, a gaveta passa nos testes de foco e `hideNavigation` mantém o `<main>` (RF-28, RF-29, RF-30, RF-31, RF-32, RF-33, RF-34, RF-35).
- [ ] CA-10: O `Button` `lg` tem 48 px, o `block` tem 100% e o padrão não muda (RF-36).
- [ ] CA-11: O `ProgressBar` tem `aria-valuetext` quando informado, e o indeterminado não anuncia valor (RF-37, RF-38).
- [ ] CA-12: `CardLink` e `CardButton` são `<a>` e `<button>` de verdade, com foco visível e o cartão inteiro como um alvo (RF-39).
- [ ] CA-13: O sair do `FocusHeader` tem nome vindo de `labels`, e o cabeçalho cabe em 360 px numa linha (RF-40).
- [ ] CA-14: O índice exporta todos os componentes novos e os tipos, sem o `Prose` (RF-41).
- [ ] CA-15: A `@ishtar-sink/vega` 0.2.0 está publicada com provenance pelo workflow da tag `v0.2.0`, com o `CHANGELOG.md` e o `README.md` atualizados (RF-42).

## Referências

| Tipo | Referência | Uso |
|---|---|---|
| arquivo | `docs/KT-001-vega-lote-1.md` | Pedido do Synestia: componentes, interfaces propostas, ordem e critérios |
| arquivo | `vostok/rules/project/architecture.md`, `stack.md`, `theme.md` | Regras de arquitetura, dependências e tema que restringem o lote |
| arquivo | `vostok/rules/project/code-style.md` | Limite de 200 linhas e um contexto por arquivo para os arquivos novos |
| arquivo | `src/button/button.tsx`, `src/progress-bar/progress-bar.tsx`, `src/card/card.tsx`, `src/page-header/page-header.tsx` | Props atuais dos componentes estendidos ou usados como base |
| arquivo | `vite.config.ts`, `package.json` | Entrada única do build, dependências externas e `exports` |
| arquivo | `../atria/apps/web/src/app/layout/` | Gaveta, sidebar, topbar e os testes de foco a reaproveitar no `AppShell` |
| memória | DEC-001 | A Vega como fonte da identidade; conferido que o lote não muda tokens |
| documentação | `npm view` de `lucide-react`, `react-markdown`, `remark-gfm` e `rehype-sanitize` | Versões atuais e peers compatíveis com React 19 |

## O que mudou

| # | Assunto | Estado no Original | Estado Refinado |
|---|---|---|---|
| 1 | Ícones | Caminhos do Lucide copiados para a Vega (proposta) | `lucide-react` como dependência, embrulhado nos ícones da Vega |
| 2 | Prose | Pacote e entrada em aberto | `react-markdown`, `remark-gfm` e `rehype-sanitize`, na entrada `@ishtar-sink/vega/prose` |
| 3 | Modo foco | Variante `focus` do `PageHeader` ou componente próprio | Componente próprio `FocusHeader` |
| 4 | Card interativo | `as` polimórfico ou dois componentes | `CardLink` e `CardButton` |
| 5 | Versão | 0.2.0 de uma vez ou versões menores | 0.2.0 de uma vez |
| 6 | SPEC-002 | Sem relação definida | A refatoração fica para depois; só a SPEC-003 agora |
| 7 | Ícones da primeira leva | 34 nomes listados no KT-001 | 36 nomes, com `SearchIcon` e `TrashIcon` |

## Registro de decisões

| # | Decisão | Alternativa descartada | Motivo |
|---|---|---|---|
| 1 | Ícones sobre o `lucide-react`, com nomes e padrões da Vega | Copiar os caminhos SVG para a Vega | resposta 1B |
| 2 | `Prose` com `react-markdown`, `remark-gfm` e `rehype-sanitize`, na entrada `@ishtar-sink/vega/prose` | Exportar no índice principal; `Prose` só estilizar | resposta 2A |
| 3 | Só a SPEC-003 agora; a SPEC-002 fica para depois, porque os componentes atuais já são utilizáveis | Fazer a SPEC-002 antes ou em paralelo | resposta 3 (texto do usuário) |
| 4 | `FocusHeader` próprio e o Card interativo como `CardLink` e `CardButton` | `PageHeader` com `variant="focus"` e `Card` com `as` polimórfico | resposta 4A |
| 5 | O lote inteiro sai como 0.2.0 | Versões menores na ordem do KT-001 | resposta da 2ª rodada (texto do usuário) |
| 6 | As dependências novas são `dependencies` e ficam externas no build | Embutir no `dist/` | inferência A |
| 7 | Os arquivos novos seguem [project/code-style-08] e [project/code-style-09]; nos existentes, só o que a extensão tocar | Refatorar `Button` e `ProgressBar` inteiros agora | inferência B |
| 8 | O `Accordion` `single` usa o atributo `name` do `<details>` com fallback pelo evento `toggle` | Só o atributo `name` | inferência C |
| 9 | Medidas novas (44, 48 e 56 px, 85%) com `calc(var(--space) * N)` ou unidades relativas, sem tokens novos | Criar tokens de tamanho | inferência D |
| 10 | O `docs/KT-001-vega-lote-1.md` é versionado, sem o `Zone.Identifier` | Deixar o KT fora do git | inferência E |
| 11 | Os rótulos padrão novos são `Fechar`, `Sair`, `Principal`, `Pular para o conteúdo` e `Abrir menu` | Rótulos obrigatórios | inferência F |
| 12 | A primeira leva tem 36 ícones: os 34 listados no KT-001 mais `SearchIcon` e `TrashIcon` | Corrigir a contagem para 34 | ajuste 1, pedido do usuário |

## Pendências

| # | Pendência | Opções em aberto |
|---|---|---|
| - | Nenhuma | - |

## Histórico de ajustes

| # | Data | Origem | Resumo |
|---|---|---|---|
| 1 | 2026-11-10 | agente | SearchIcon e TrashIcon acrescentados à primeira leva de ícones, que passa a ter 36 nomes (34 do KT-001 mais os dois); CA-01 inalterado (já dizia 36) |
