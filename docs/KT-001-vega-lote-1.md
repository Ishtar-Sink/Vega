---
id: KT-001
title: "Lote 1 de componentes para a Vega"
status: ready
author: "Victor Batalha"
created_at: 2026-11-10
origin: Ishtar-Sink/Synestia
destination: Ishtar-Sink/Vega
sources: [ESTUDO-002, ESTUDO-003]
---

# Lote 1 de componentes para a Vega

## Como usar este documento

Este é um documento de transferência de conhecimento (KT) do Synestia para a Vega. Ele foi
gerado no repositório do Synestia e **não alterou nada fora dele**. Para virar trabalho na
Vega:

1. Copie este arquivo para o repositório da Vega ou cole o conteúdo numa sessão aberta lá.
2. Peça a criação de uma spec a partir dele (`create-spec`). A sugestão é que vire a
   SPEC-002 da Vega, refinada e planejada pelo fluxo normal dela.
3. As decisões marcadas como **"a Vega decide"** ficam para o refinamento lá. Este documento
   propõe uma solução, mas não fecha a decisão.

A fonte completa está no [ESTUDO-002](../estudos/ESTUDO-002-interface-e-experiencia.md), que
define a interface do Synestia, e no
[ESTUDO-003](../estudos/ESTUDO-003-componentes-para-a-vega.md), que levanta o que falta na
Vega.

## Contexto

O Synestia é a plataforma de estudos do ecossistema: estudo em passos, revisão espaçada,
simulados, celular primeiro e offline. A fase 1 é de uso pessoal e precisa estar usável por
volta de **22/11/2026**, antes de uma prova em 06/12.

A regra do Synestia é montar a interface só com a Vega e pedir à Vega todo componente que
sirva a mais de um produto (`[project/stack-07]` do Synestia). A regra da Vega é a mesma, vista
do outro lado: nenhum produto recria um componente que já existe nela, e o que faltar entra
nela (`[project/architecture-05]` da Vega).

**Prazo desejado:** o lote inteiro publicado até **15/11**, para que o Synestia tenha uma
semana de montagem das telas. Se não der, a ordem da seção [Ordem e
dependências](#ordem-e-dependências) entrega primeiro o que mais destrava.

## Escopo

**Componentes novos:**

1. Conjunto de ícones (subconjunto do Lucide)
2. `Switch`
3. `RadioGroup`
4. `TextAreaField`
5. `Disclosure` e `Accordion`
6. `Callout`
7. `BottomSheet`
8. `Prose`
9. `AppShell`, com `Sidebar`, `BottomNav` e `Topbar`

**Extensões de componentes que já existem:** `Button`, `ProgressBar`, `Card` e
`PageHeader`.

**Fora do escopo:**

- **O lote 2**, que fica para antes da fase 2 do Synestia: `FileField`, `Breadcrumbs`,
  `Avatar`, `Tooltip`, `DataTable`, `StatTile`, `Timer`, `ConnectionStatus` e as extensões
  de `Toast`, `Tabs`, `EmptyState` e da escala de leitura.
- **Os componentes próprios do Synestia**, como a conta armada, a escada de dicas, o cartão
  de revisão e a grade do simulado. Eles ficam no Synestia, montados sobre estes.
- **Trocar o Atria** para usar os componentes novos. Isso vira uma spec no Atria.

## Regras da Vega que este pedido respeita

Todo componente deste lote segue as regras do projeto da Vega. As que mais pesam aqui:

| Regra da Vega | Efeito neste lote |
|---|---|
| `architecture-02`, `architecture-03` | Cada componente em `src/<componente>/`, com `.tsx`, `.module.css` e `.test.tsx`, exportado pelo `src/index.ts` com os tipos |
| `architecture-04`, `code-style-07` | Nada de regra do Synestia dentro do componente: o comportamento de estudo entra por props e slots |
| `code-style-03` | Cada componente estende as props nativas do elemento e repassa `className`, `style`, os atributos e a `ref` |
| `language-06` | Todo texto visível é uma prop sobrescrevível (`label` ou `labels`), com padrão em pt-br |
| `accessibility-03` | Ícones em SVG inline com `aria-hidden="true"`; botão só com ícone exige `aria-label` no tipo das props |
| `accessibility-06` | O `BottomSheet` usa o `<dialog>` nativo, aberto com `showModal()` |
| `security-03` | O `Prose` não usa `dangerouslySetInnerHTML`: o Markdown vira elementos React |
| `stack-07` | Toda dependência de runtime nova tem justificativa registrada; neste lote, só o `Prose` deve precisar de uma |
| `theme-06`, `theme-07` | Estados com fundo `*Soft` e mais de um sinal além da cor; animações com `--motion-*`, até 320 ms, com `prefers-reduced-motion` |
| `testing-01` a `testing-03` | Testes por papel e nome acessível, axe sem violações e teclado testado com `user-event` |

Além dessas, todo componente funciona a partir de 360 px de largura, e todo alvo de toque
tem pelo menos 44 px no celular. É o mínimo que o Synestia usa nas telas de estudo, acima
dos 24 px da WCAG 2.2.

## Ordem e dependências

| Ordem | Item | Por quê |
|---|---|---|
| 1 | Ícones | O `Callout`, o `Disclosure`, a `BottomNav`, a `Sidebar` e o `BottomSheet` usam ícones |
| 2 | Extensões de `Button` e `ProgressBar` | São pequenas e o Synestia usa nas primeiras telas (a ação principal e o progresso da sessão) |
| 3 | `Switch`, `RadioGroup` e `TextAreaField` | São independentes, já têm o padrão pronto no Atria e podem ser feitos em paralelo |
| 4 | `Callout` e `Disclosure` | Dependem dos ícones |
| 5 | Extensões de `Card` e `PageHeader` | O `PageHeader` em modo foco usa o `ProgressBar` estendido |
| 6 | `BottomSheet` | Reaproveita o que o `Dialog` já faz |
| 7 | `Prose` | É o único com dependência nova e decisão de pacote |
| 8 | `AppShell` | Usa ícones e é o que mais precisa ser separado do código do Atria |

Os itens 3, 4 e 5 podem rodar em paralelo depois do item 1.

## Componentes novos

As interfaces abaixo são propostas, para dar forma ao pedido. Os nomes finais e os detalhes
ficam para o refinamento na Vega.

### 1. Conjunto de ícones

**Para que serve:** ícones de interface comuns. Hoje a Vega só tem os ícones de visualização
(`ListIcon`, `GridIcon` e outros), e cada produto desenha os seus. O Atria tem SVG inline
espalhado em 28 arquivos.

**Proposta:**

- Um componente-base interno (`Icon`) e um componente por ícone, com os caminhos SVG do
  Lucide copiados para dentro da Vega. Assim não entra nenhuma dependência de runtime, e o
  traço fica igual ao do Atria (24 × 24, `stroke="currentColor"`, `strokeWidth` 2, pontas
  arredondadas).
- A licença ISC do Lucide vai junto, em `src/icons/LICENSE-lucide.txt`, e é citada no README.
- `aria-hidden="true"` vem por padrão, e o tamanho padrão é 20.

```ts
export interface IconProps extends ComponentPropsWithRef<'svg'> {
  /** Lado em px. Padrão: 20. */
  size?: 16 | 20 | 24;
}
```

**Primeira leva**, pelo que o Synestia e o Atria usam:

| Grupo | Ícones |
|---|---|
| Navegação | `HomeIcon`, `BookOpenIcon`, `LayersIcon`, `TimerIcon`, `UsersIcon`, `MenuIcon` |
| Setas | `ChevronLeftIcon`, `ChevronRightIcon`, `ChevronDownIcon`, `ArrowLeftIcon` |
| Ações | `CloseIcon`, `PlusIcon`, `MinusIcon`, `DownloadIcon`, `UploadIcon`, `FlagIcon`, `RefreshIcon`, `EyeIcon` |
| Estados | `CheckIcon`, `CircleCheckIcon`, `InfoIcon`, `AlertTriangleIcon`, `CircleAlertIcon`, `WifiOffIcon`, `CloudCheckIcon` |
| Conta | `UserIcon`, `SettingsIcon`, `LogOutIcon`, `SunIcon`, `MoonIcon` |
| Estudo (nomes genéricos) | `LightbulbIcon`, `ClockIcon`, `CalendarIcon`, `PencilIcon` |

**Critérios de aceite:**

- Todo ícone é exportado pelo índice.
- Um teste confere que todos têm `aria-hidden` e repassam a `ref`.
- Nenhum `fill` nem `stroke` fixo além de `currentColor`.

### 2. `Switch`

**Para que serve no Synestia:** "Disponível offline" por tema e as preferências. No Atria:
as notificações.

**Já existe:** no Atria, inline em
`apps/web/src/features/reminders/components/notification-settings-card.tsx`, como
`<button role="switch" aria-checked>`.

```ts
export interface SwitchProps
  extends Omit<ComponentPropsWithRef<'button'>, 'onChange' | 'children'> {
  /** Rótulo visível, também o nome acessível. */
  label: string;
  /** Texto de ajuda abaixo do rótulo (ex.: "12 MB"). */
  help?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}
```

**Comportamento e acessibilidade:**

- Segue o padrão `switch` do WAI-ARIA: Espaço e Enter alternam, e o rótulo também alterna ao
  toque.
- A área de toque tem 44 px de altura, mesmo com a trilha visual menor.
- Ligado usa a cor `primary`; desligado usa `borderStrong`.
- O estado também é visível pela posição do botão, não só pela cor.

**Critérios de aceite:**

- O papel `switch` tem nome acessível vindo do `label`.
- Alterna pelo teclado e pelo rótulo.
- Desabilitado não alterna.

### 3. `RadioGroup`

**Para que serve no Synestia:** as alternativas A–E das questões (variante `card`), a
pergunta intermediária da lição e as escolhas de configuração. No Atria: os formulários com
rádio.

**Já existe:** no Atria, inline em `features/journal/emotion-icons.tsx`,
`features/journal/emotion-picker.tsx` e em telas de finanças. Não existe como componente.

```ts
export interface RadioOption {
  value: string;
  label: ReactNode;
  /** Texto secundário da opção. */
  description?: ReactNode;
  /** Marcador antes do rótulo (ex.: a letra "A"). */
  marker?: ReactNode;
  disabled?: boolean;
  /** Tom da opção depois de uma ação (ex.: correção). Padrão: nenhum. */
  tone?: 'success' | 'danger' | 'neutral';
  /** Conteúdo ao fim da opção (ex.: um Badge "sua resposta"). */
  adornment?: ReactNode;
}

export interface RadioGroupProps
  extends Omit<ComponentPropsWithRef<'fieldset'>, 'onChange'> {
  label: string;
  hideLabel?: boolean;
  options: RadioOption[];
  value: string | null;
  onChange: (value: string) => void;
  name?: string;
  /** `default`: rádio com rótulo. `card`: cada opção é um cartão inteiro tocável. */
  variant?: 'default' | 'card';
  /** Mostra as opções sem permitir troca (ex.: depois de responder). */
  readOnly?: boolean;
  help?: string;
  error?: string;
}
```

**Comportamento e acessibilidade:**

- `<fieldset>` com `<legend>` e `<input type="radio">` nativos, com as setas do teclado
  nativas.
- Na variante `card`, o cartão inteiro é o rótulo. A seleção aparece com borda `primary`,
  fundo `primarySoft` e um ícone de confere: não depende só da cor.
- `tone` usa o fundo `*Soft` correspondente, com ícone. É genérico: o Synestia usa para
  mostrar a certa e a escolhida depois da resposta, e outro produto pode usar para
  validação.
- Com `readOnly`, as opções continuam legíveis por leitor de tela, mas não mudam.

**Critérios de aceite:**

- As duas variantes passam no axe.
- As setas mudam a seleção.
- O `tone` tem sinal além da cor.
- Na variante `card`, toda a área do cartão seleciona.

### 4. `TextAreaField`

**Para que serve no Synestia:** o editor de redação, a resposta aberta e, na fase 2, a
dúvida no fórum. No Atria: o diário, as metas e as sessões de leitura.

**Já existe:** no Atria, inline em `features/journal/journal-entry-form-page.tsx`,
`features/goals/screens/goal-form-screen.tsx` e
`features/library/reading-session-form-page.tsx`, sempre com o mesmo padrão de `label`,
`aria-invalid` e `aria-describedby`.

```ts
export interface TextAreaFieldProps extends ComponentPropsWithRef<'textarea'> {
  label: string;
  help?: string;
  error?: string;
  /** Cresce com o conteúdo entre `minRows` e `maxRows`. Padrão: false. */
  autoResize?: boolean;
  minRows?: number;
  maxRows?: number;
  /** Conteúdo do contador, calculado pelo produto (ex.: "22 de 30 linhas"). */
  counter?: ReactNode;
}
```

**Comportamento e acessibilidade:**

- Mesmo visual e mesmas regras do `TextField`: o erro aparece com `role="alert"` e fica
  ligado por `aria-describedby`.
- O contador também fica ligado por `aria-describedby`. Ele não é anunciado a cada tecla.
- A regra de contagem fica com o produto: o Synestia conta linhas estimadas, e o Atria pode
  contar caracteres (`code-style-07` da Vega).
- Usa a fonte de corpo, e o texto longo fica legível com `line-height` 1,6.

**Critérios de aceite:**

- O `autoResize` respeita o `maxRows`.
- O contador é lido por leitor de tela junto do campo.
- O erro aparece com `role="alert"`.

### 5. `Disclosure` e `Accordion`

**Para que serve no Synestia:** cada uma das três dicas, o "por quê?" de cada linha da
resolução e as seções de ajuda. No Atria: os detalhes recolhíveis.

```ts
export interface DisclosureProps
  extends Omit<ComponentPropsWithRef<'details'>, 'title' | 'onToggle'> {
  /** Conteúdo do resumo clicável. */
  title: ReactNode;
  /** Ícone antes do título. */
  icon?: ReactNode;
  /** Estado controlado. Sem ele, o componente controla o próprio estado. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  tone?: 'default' | 'accent' | 'warning' | 'info';
}

export interface AccordionProps extends ComponentPropsWithRef<'div'> {
  /** `single`: abrir um fecha os outros. `multiple`: independentes. */
  type?: 'single' | 'multiple';
  children: ReactNode; // Disclosures
}
```

**Comportamento e acessibilidade:**

- Usa `<details>` e `<summary>` nativos, que dão teclado e anúncio de estado sem script.
- `Accordion` com `type="single"` usa o atributo `name` do `<details>`, que já tem suporte
  nos navegadores principais. Para os antigos, cabe uma alternativa em script.
- O ícone de seta gira com `--motion-fast`. A abertura anima a altura com `--motion-base`,
  e nada anima com movimento reduzido.
- A abertura em sequência (a dica 2 só aparece depois da 1) é regra do Synestia e fica
  fora do componente.

**Critérios de aceite:**

- Funciona controlado e não controlado.
- Abre por Enter e Espaço.
- O `single` fecha os outros.
- Sem animação com `prefers-reduced-motion`.

### 6. `Callout`

**Para que serve no Synestia:** o exemplo do cotidiano (`accent`), a armadilha (`warning`),
o aviso antes de enviar conteúdo à IA (`info`) e o aviso de backup velho na administração.
No Atria e no Translunar: avisos dentro da página. Hoje isso é feito com `Card` e `tone`,
sem ícone nem estrutura.

```ts
export interface CalloutProps extends Omit<ComponentPropsWithRef<'aside'>, 'title'> {
  tone?: 'neutral' | 'accent' | 'info' | 'success' | 'warning' | 'danger';
  title?: ReactNode;
  /** Ícone próprio; `false` remove. Padrão: o ícone do tom. */
  icon?: ReactNode | false;
  /** Ação no fim (ex.: um Button "Fazer backup"). */
  action?: ReactNode;
  /** `polite` anuncia quando aparece (role="status"). Padrão: `off`. */
  live?: 'off' | 'polite';
}
```

**Comportamento e acessibilidade:**

- Fundo `*Soft` do tom, com ícone e título na cor cheia do tom (`theme-06`).
- Por padrão é um `<aside>` sem papel de região viva. Com `live="polite"`, vira `role="status"`.
- Diferente do `Toast`: o `Callout` fica na página e não some sozinho.

**Critérios de aceite:**

- Todos os tons passam em contraste AA nos dois temas.
- O ícone padrão muda conforme o tom.
- `live` liga e desliga o `role="status"`.

### 7. `BottomSheet`

**Para que serve no Synestia:** a grade de questões do simulado e as opções da sessão de
estudo no celular. No Atria: filtros no celular. No Nebula: a fila de reprodução.

```ts
export interface BottomSheetProps
  extends Omit<ComponentPropsWithRef<'dialog'>, 'title'> {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  /** `auto`: embaixo abaixo de 720 px e lateral acima. Padrão: `auto`. */
  placement?: 'auto' | 'bottom' | 'side';
  labels?: { close?: string };
}
```

**Comportamento e acessibilidade:**

- Usa `<dialog>` nativo com `showModal()` (`accessibility-06`), como o `Dialog`. O foco fica
  preso dentro, e Escape e o toque no fundo fecham. Ao fechar, o foco volta a quem abriu.
- Embaixo, a altura vai até 85% da tela, com rolagem interna e respeito a
  `env(safe-area-inset-bottom)`. Na lateral, fica à direita, com largura fixa.
- A alça de arrastar é só visual. Fechar arrastando é opcional e pode ficar para depois:
  o botão de fechar e o Escape já resolvem.
- Entrada com `--motion-base` e `motion.ease.enter`; com movimento reduzido, aparece direto.

**Critérios de aceite:**

- Passa nos mesmos testes de foco do `Dialog`.
- Troca de posição em 720 px.
- O rodapé fica fixo e o conteúdo rola.

### 8. `Prose`

**Para que serve no Synestia:** o texto das lições, dos enunciados e das resoluções, que
vem do pacote de conteúdo em Markdown. No Atria: notas e diário. No Translunar: textos
longos do painel.

**Decisão do Synestia (ESTUDO-003):** o `Prose` estiliza e também **renderiza e sanitiza**
Markdown, para ser igual em todos os produtos.

```ts
export interface ProseProps extends Omit<ComponentPropsWithRef<'div'>, 'children'> {
  /** Markdown a renderizar. Sem ele, estiliza os `children`. */
  markdown?: string;
  children?: ReactNode;
  /** `base`: 16 px. `reading`: 18 px, para leitura longa. Padrão: `base`. */
  size?: 'base' | 'reading';
  /** Troca a renderização de um elemento (ex.: fórmula, bloco próprio do produto). */
  components?: ProseComponents;
  /** Plugins de sintaxe extra do produto (ex.: matemática, diretivas). */
  remarkPlugins?: ProsePlugin[];
}
```

**Comportamento e segurança:**

- **O Markdown vira árvore e depois elementos React**, nunca HTML injetado (`security-03`).
  HTML cru dentro do Markdown é descartado. Links externos recebem `rel="noopener
  noreferrer"`. Imagens recebem `loading="lazy"` e largura máxima de 100%.
- **A sanitização é por lista do que é permitido:** títulos, parágrafos, listas, ênfase,
  código, citações, tabelas, links e imagens. Só os produtos ampliam a lista, por
  `components`.
- **Tipografia:** corpo em Inter, `line-height` 1,6 e no máximo 68 caracteres por linha.
  Títulos em Outfit com o espaçamento negativo das diretrizes. Tabelas rolam na horizontal
  sem quebrar a página.
- **Extensão:** o Synestia passa um plugin de matemática e mapeia os nós de fórmula para o
  próprio componente de KaTeX. Assim o KaTeX não entra na Vega.

**Dependência nova (justificar pela `stack-07`), proposta para o refinamento:**
`react-markdown`, `remark-gfm` e `rehype-sanitize`. As três são MIT e convertem para
elementos React sem `innerHTML`.

**A Vega decide:**

- O pacote de Markdown a usar.
- Se o `Prose` sai numa entrada separada (`@ishtar-sink/vega/prose`), para que um produto
  sem Markdown não carregue o parser. A recomendação do Synestia é a entrada separada,
  porque o orçamento de JavaScript da primeira tela dele é de 170 KB.

**Critérios de aceite:**

- Um teste com HTML e `javascript:` no Markdown confere que nada é executado nem
  renderizado.
- As tabelas rolam a 360 px.
- `components` substitui um elemento.
- Nenhum `dangerouslySetInnerHTML` no código.

### 9. `AppShell`, `Sidebar`, `BottomNav` e `Topbar`

**Para que serve:** a estrutura de todo app do ecossistema.

- **No Synestia:** barra inferior no celular, com quatro destinos (cinco na fase 2), e
  barra lateral no computador. A navegação some no modo foco.
- **No Atria:** barra lateral, que vira gaveta abaixo de 720 px.

**Decisão do Synestia (ESTUDO-003):** a Vega entrega **as peças separadas e um `AppShell`
padrão** que as compõe. O produto pode usar só as peças.

**Já existe:** no Atria, em `apps/web/src/app/layout/`:

| Arquivo | O que tem |
|---|---|
| `app-layout.tsx` | A gaveta abaixo de `breakpoints.md` e o link "Pular para o conteúdo" |
| `sidebar.tsx` | Foco preso na gaveta, Escape para fechar, `inert` quando fechada e `aria-current="page"` |
| `topbar.tsx` | O botão de menu com `aria-expanded` e `aria-controls` |
| `breadcrumbs.tsx` | Os breadcrumbs (lote 2) |

**O que separar do código do Atria na extração:**

- **Roteador:** o `Link` do TanStack vira um `renderLink` do produto.
- **Sessão e saída:** `useCurrentUser` e `signOut` saem do componente e entram por slots.
- **Tradução:** o `useT` dá lugar a `labels`.
- **Tema:** o `useToggleThemePreference` entra pelo slot de rodapé.
- **Avatar:** o `paletteFor` do avatar sai do componente.

A `BottomNav` é nova: o Atria não tem.

```ts
export interface NavItem {
  id: string;
  label: string;
  icon: ReactNode;
  href: string;
  current?: boolean;
  /** Contagem ou selo (ex.: revisões pendentes). */
  badge?: ReactNode;
}

/** O produto renderiza o link do próprio roteador. */
export type RenderNavLink = (
  item: NavItem,
  props: { className: string; 'aria-current'?: 'page'; children: ReactNode },
) => ReactNode;

export interface SidebarProps extends ComponentPropsWithRef<'aside'> {
  brand: ReactNode;
  items: NavItem[];
  renderLink?: RenderNavLink;
  footer?: ReactNode;
  /** Modo gaveta (controlado pelo AppShell ou pelo produto). */
  drawer?: boolean;
  open?: boolean;
  onClose?: () => void;
  labels?: { navigation?: string };
}

export interface BottomNavProps extends ComponentPropsWithRef<'nav'> {
  /** De 3 a 5 destinos. */
  items: NavItem[];
  renderLink?: RenderNavLink;
  labels?: { navigation?: string };
}

export interface TopbarProps extends ComponentPropsWithRef<'header'> {
  start?: ReactNode;
  center?: ReactNode;
  end?: ReactNode;
}

export interface AppShellProps extends ComponentPropsWithRef<'div'> {
  sidebar: Omit<SidebarProps, 'drawer' | 'open' | 'onClose'>;
  topbar?: TopbarProps;
  /** Navegação abaixo de 720 px: gaveta (Atria) ou barra inferior (Synestia). */
  mobileNav?: 'drawer' | 'bottom';
  /** Esconde toda a navegação (ex.: modo foco do Synestia). */
  hideNavigation?: boolean;
  children: ReactNode;
  labels?: { skipToContent?: string; openMenu?: string };
}
```

**Comportamento e acessibilidade:**

- **Link para pular a navegação:** o primeiro foco da página vai para "Pular para o
  conteúdo", que leva ao `<main>`.
- **`Sidebar`:** a marca no topo e `<nav>` com nome acessível ("Principal" por padrão).
  O item ativo tem `aria-current="page"`. No modo gaveta valem as regras que o Atria já
  segue: foco preso, Escape para fechar, `inert` quando fechada e o foco devolvido ao botão
  de menu.
- **`BottomNav`:** fixa embaixo, com 56 px de altura mais `env(safe-area-inset-bottom)`. O
  ícone e o rótulo ficam sempre visíveis: um destino nunca é só ícone. Aparece só abaixo de
  `breakpoints.md`; acima dele, os mesmos itens vão para a `Sidebar`.
- **Rolagem:** o `AppShell` reserva o espaço da `BottomNav`, e o conteúdo nunca fica atrás
  dela.

**Critérios de aceite:**

- Funciona com o `renderLink` de um roteador e sem ele, com `<a>` simples.
- A troca entre `drawer` e `bottom` acontece em 720 px.
- A gaveta passa nos testes de foco que o Atria já tem em `app-layout.test.tsx`.
- `hideNavigation` remove a navegação sem perder o `<main>`.

## Extensões de componentes existentes

| Componente | Proposta | Critério de aceite |
|---|---|---|
| `Button` | `size?: 'md' \| 'lg'`, em que `lg` tem altura mínima de 48 px, e `block?: boolean`, que ocupa a largura toda | `lg` com 48 px; `block` com 100%; sem mudar o padrão atual |
| `ProgressBar` | `valueText?: string`, que vira texto visível opcional ("4 de 9") e `aria-valuetext`; `indeterminate?: boolean`, sem `aria-valuenow` e com animação que respeita movimento reduzido | `aria-valuetext` presente quando informado; o modo indeterminado não anuncia valor |
| `Card` | Variante interativa (link ou botão), com estados de hover, foco e pressionado, para cartões que levam a outra tela (tema, tópico, simulado). A seleção entre opções fica no `RadioGroup` com `variant="card"` | Foco visível; todo o cartão é um alvo só; o elemento é `<a>` ou `<button>` de verdade |
| `PageHeader` | Variante `focus`: botão de sair, título curto, posição ("3/8") e um `ProgressBar` embaixo, para fluxos guiados | O sair tem nome acessível vindo de `labels`; a variante cabe em 360 px numa linha |

**A Vega decide** se a variante `focus` do `PageHeader` é uma prop ou um componente
próprio (`FocusHeader`), e como tipar o `Card` interativo (`as` polimórfico ou dois
componentes).

## Como o Synestia vai usar

| Tela do Synestia (ESTUDO-002) | Componentes deste lote |
|---|---|
| Estrutura e navegação | `AppShell` com `mobileNav="bottom"`, `BottomNav`, `Sidebar` e ícones |
| Modo foco | `PageHeader` `focus`, `Button` `lg` `block`, `ProgressBar` com `valueText` |
| Lição em passos | `Prose` `reading`, `Callout` `accent` e `warning`, `RadioGroup` |
| Questão com as três dicas | `RadioGroup` `card` com `marker`, `tone` e `readOnly`; `Disclosure` |
| Resolução linha por linha | `Disclosure`, `Prose` |
| Simulado | `BottomSheet` com a grade de questões |
| Redação | `TextAreaField` com `autoResize` e `counter` |
| Perfil e uso offline | `Switch`, ícones |
| Importação e download | `ProgressBar` com `valueText` e `indeterminate`, `Callout` |
| Estudar e Simulados (listas) | `Card` interativo |

## Questões para o refinamento na Vega

1. **Ícones:** copiar os caminhos do Lucide para dentro da Vega, como proposto, ou usar o
   `lucide-react` como dependência, com justificativa? Copiar evita dependência nova e
   mantém o `aria-hidden` sob controle da Vega.
2. **`Prose`:** que pacote de Markdown usar, e se sai numa entrada separada.
3. **`PageHeader` `focus`** como prop ou componente próprio; **`Card` interativo** com `as`
   polimórfico ou dois componentes.
4. **Versão:** o lote sai como 0.2.0 de uma vez ou em versões menores, conforme a ordem?
   Para o prazo do Synestia, versões menores na ordem desta tabela ajudam mais.
