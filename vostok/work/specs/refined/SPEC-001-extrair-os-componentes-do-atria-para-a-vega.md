---
id: SPEC-001
title: "Extrair os componentes do Atria para a Vega"
status: implemented
author: "Victor Batalha"
created_at: 2026-11-10T12:35:06Z
updated_at: 2026-11-10T17:59:29Z
tags: []
type: feature
source: "draft/SPEC-001-extrair-os-componentes-do-atria-para-a-vega.md"
refined_at: 2026-11-10T12:59:21Z
adjustments: 0
adjusted_at: null
content_hash: b579244c90f3c509363011ee811361f61fc74083deff47e336c7ed5bf5895ac2
approved_at: 2026-11-10T13:22:49Z
approved_hash: b579244c90f3c509363011ee811361f61fc74083deff47e336c7ed5bf5895ac2
status_history: 2026-11-10T13:22:49Z approved; 2026-11-10T13:59:40Z planned; 2026-11-10T17:59:29Z implemented
---

# Extrair os componentes do Atria para a Vega - Especificação Refinada

A Vega recebe o tema e os 31 componentes do `@atria/ui` e do `@atria/theme`, adequados às regras do repositório, e publica a versão 0.1.0 de `@ishtar-sink/vega` no npm pela CI.

## Objetivo

Os componentes e o tema do ecossistema hoje vivem dentro do Atria (`packages/ui` e `packages/theme`) e não podem ser usados por outros produtos. Ao fim desta spec, a Vega exporta esses componentes e o tema Ishtar Sink em `@ishtar-sink/vega` 0.1.0, publicado no npm, em conformidade com `vostok/rules/project/`.

## Escopo

### Dentro do escopo

- Estrutura do pacote: pnpm workspace, TypeScript, ESLint, Prettier, Vitest e build Vite em modo biblioteca.
- Tema: tokens dos temas claro e escuro, `tokens.css` espelhado, API de tema com tipo completo, camada de marca sobrescrevível, verificações de contraste exportadas e fontes Outfit e Inter com a licença OFL.
- Os 31 componentes da tabela "O que vem do Atria" do `README.md`, com as funções auxiliares exportadas hoje pelo `@atria/ui` (máscara de dinheiro, hora, período e cor).
- `BrandLogo` e `ItemSwatch` generalizados: a marca e a paleta vêm por prop, sem nada do Atria.
- Adequação de cada componente às regras de código, acessibilidade, idioma, tema e testes.
- CI com lint, typecheck, testes e `pnpm audit`, e fluxo de publicação com provenance.
- Publicação da 0.1.0, com a entrada no `CHANGELOG.md` e o `README.md` atualizado.

### Fora do escopo

- Trocar o Atria para consumir `@ishtar-sink/vega` e remover `@atria/ui` e `@atria/theme`: vira uma spec no repositório do Atria.
- `@atria/contracts`, o OpenAPI do Atria.
- Componentes novos que não existem no Atria.
- Mudança de identidade visual (paleta, tipografia, valores de token).

## Requisitos funcionais

| ID | Requisito |
|---|---|
| RF-01 | O pacote `@ishtar-sink/vega` deve ser construído com Vite em modo biblioteca, gerando ESM, os tipos `.d.ts` e o CSS dos módulos. |
| RF-02 | O `src/index.ts` deve exportar todos os componentes, as funções auxiliares, o tema e os tipos das props. |
| RF-03 | O tema deve exportar os tokens `light` e `dark` do Ishtar Sink, com o tema claro como padrão. |
| RF-04 | A API de tema deve recusar, no tipo, um tema sem o conjunto completo de tokens nos dois temas. |
| RF-05 | O `tokens.css` deve espelhar os valores de `tokens.ts`, com um comentário no topo apontando `tokens.ts` como origem. |
| RF-06 | A camada de marca (`primary`, `primaryHover`, `primaryBright`, `primarySoft`, `primaryOn` e o gradiente `brand`) deve poder ser sobrescrita por variáveis CSS, sem rebuild. |
| RF-07 | O pacote deve exportar as verificações de contraste usadas pelo tema padrão, aplicáveis a um tema próprio. |
| RF-08 | O pacote deve incluir as fontes Outfit e Inter variáveis e as licenças `fonts/OFL-*.txt`. |
| RF-09 | O grupo Ações deve exportar `Button`, `IconButton` e `MenuButton`. |
| RF-10 | O grupo Campos deve exportar `TextField`, `SelectField`, `Checkbox`, `SegmentedField`, `Autocomplete`, `TagField` e `ColorField`, com `ColorPicker` e as funções de cor. |
| RF-11 | O grupo Data e hora deve exportar `Calendar`, `DateField`, `TimeField`, `DateTimeField` e `PeriodField`, com `parseTime`, `maskTime` e `resolvePeriod`. |
| RF-12 | O grupo Dinheiro deve exportar `MoneyField`, com `maskMoneyInput`, `parseMoneyInput` e `formatCents` em centavos. |
| RF-13 | O grupo Estrutura deve exportar `Card`, `PageHeader`, `Toolbar`, `Tabs`, `ViewSwitcher`, `FormGrid` e `FormActions`. |
| RF-14 | O grupo Diálogos e avisos deve exportar `Dialog`, `ConfirmDialog`, `Toast` e `ToastRegion`. |
| RF-15 | O grupo Estados deve exportar `EmptyState`, `LoadingState`, `Skeleton`, `ErrorState` e `ProgressBar`. |
| RF-16 | O `BrandLogo` deve receber a marca por prop, sem o desenho do "A" do Atria fixo no componente. |
| RF-17 | O `ItemSwatch` deve receber a paleta por prop, sem depender da `paletteFor` do Atria. |
| RF-18 | O pacote deve exportar os ícones de visualização (`ListIcon`, `GridIcon`, `ShelfIcon`, `TableIcon`, `DayIcon`, `TimelineIcon`). |
| RF-19 | Todo texto visível de um componente deve ser uma prop sobrescrevível com padrão em `pt-br`, e datas e números devem ser formatados com `Intl` no locale recebido. |
| RF-20 | Todo componente deve estender as props nativas do elemento e repassar `className`, `style` e `...rest`. |
| RF-21 | A CI deve rodar lint, typecheck, testes e `pnpm audit` a cada push e pull request. |
| RF-22 | A CI deve publicar o pacote no npm com provenance a partir de uma tag de versão. |
| RF-23 | A versão 0.1.0 deve estar publicada no npm, com a entrada no `CHANGELOG.md`. |

## Requisitos não funcionais

| ID | Requisito | Como verificar |
|---|---|---|
| RNF-01 | Todo componente atende ao WCAG AA. | Teste com `vitest-axe` sem violações em cada componente. |
| RNF-02 | Estilos usam só tokens do tema: nenhuma cor, raio, espaço, fonte ou duração literal. | Busca por literais (`#hex`, `px`, `ms`) nos `*.module.css` sem ocorrências fora de `tokens.css`. |
| RNF-03 | TypeScript `strict` com `noUncheckedIndexedAccess`, sem `any` e sem `@ts-ignore`. | `pnpm typecheck` e `pnpm lint` com `--max-warnings 0`. |
| RNF-04 | O pacote não faz requisição de rede nem envia telemetria. | Busca por `fetch`, `XMLHttpRequest` e URLs externas no `dist/` sem ocorrências. |
| RNF-05 | `react` e `react-dom` (`^19.3.1`) são peer dependencies. | `package.json` sem `react` em `dependencies`. |
| RNF-06 | Nenhuma dependência de runtime nova sem justificativa registrada na tarefa. | `dependencies` do `package.json` vazio ou com a justificativa na tarefa. |
| RNF-07 | Animações só com tokens `--motion-*`, até 320 ms, respeitando `prefers-reduced-motion`. | Teste de tokens e revisão dos `*.module.css`. |
| RNF-08 | `pnpm audit` sem vulnerabilidade alta ou crítica. | Passo `pnpm audit` da CI. |

## Regras de negócio

| ID | Regra |
|---|---|
| RN-01 | Nenhum componente tem regra de negócio do Atria nem de outro produto. |
| RN-02 | Os nomes públicos dos componentes do Atria são mantidos, salvo quando a conformidade com as regras exigir outro. |
| RN-03 | Os valores dos tokens do Ishtar Sink não mudam na extração. |
| RN-04 | O fundo de um estado é sempre o token `*Soft` correspondente, e um estado não depende só do matiz. |
| RN-05 | Diálogos usam o `<dialog>` nativo, aberto com `showModal()`. |
| RN-06 | A publicação no npm é feita só pela CI, nunca de uma máquina local. |

## Fluxos

### Fluxo principal

1. Criar a estrutura do pacote (workspace, TypeScript, lint, testes, build).
2. Migrar o tema: tokens, `tokens.css`, contraste, fontes e a API de tema.
3. Migrar cada grupo de componentes com os testes, adequando-o às regras.
4. Registrar as exportações no `src/index.ts`.
5. Configurar a CI e o fluxo de publicação.
6. Escrever o `CHANGELOG.md` da 0.1.0 e atualizar o `README.md`.
7. Criar a tag `v0.1.0` e publicar pela CI.

### Fluxos alternativos

- FA-01 (passo 3): o componente tem regra de negócio do Atria que não pode ser passada para props; ele fica fora da 0.1.0 e o caso é registrado no `CHANGELOG.md`.
- FA-02 (passo 7): a publicação falha na CI; a tag é corrigida e a publicação é refeita pela CI, nunca da máquina local.

## Casos de borda

| ID | Situação | Comportamento esperado | Requisitos |
|---|---|---|---|
| CB-01 | Tema próprio sem algum token num dos temas. | Erro de tipo na compilação da aplicação. | RF-04 |
| CB-02 | Variável CSS de marca sobrescrita com contraste abaixo de AA. | A verificação de contraste exportada aponta a falha no teste da aplicação. | RF-06, RF-07 |
| CB-03 | Locale diferente de `pt-br` passado a um componente de data ou dinheiro. | Datas e números formatados com `Intl` nesse locale; os textos continuam os padrões em `pt-br` até serem sobrescritos. | RF-19 |
| CB-04 | Usuário com `prefers-reduced-motion: reduce`. | Componentes sem animação de movimento. | RNF-07 |
| CB-05 | `ItemSwatch` sem paleta informada. | Usa uma paleta padrão derivada dos tokens do tema, sem cor literal. | RF-17 |

## Contratos e interfaces

```ts
// Tema: o tipo exige todos os tokens nos dois temas.
export type ThemeTokens = { [K in keyof typeof light]: string };
export interface Theme { light: ThemeTokens; dark: ThemeTokens }
export function defineTheme(theme: Theme): Theme;

// Contraste: aplicável ao tema padrão e a um tema próprio.
export function contrastRatio(foreground: string, background: string): number;
export function checkThemeContrast(theme: Theme): ContrastViolation[];

// Marca e item.
export interface BrandLogoProps extends ComponentPropsWithRef<'div'> { name: string; mark: ReactNode }
export interface ItemSwatchProps extends ComponentPropsWithRef<'span'> {
  id: string;
  palette?: ReadonlyArray<readonly [string, string]>;
}
```

```json
{
  "name": "@ishtar-sink/vega",
  "version": "0.1.0",
  "type": "module",
  "license": "AGPL-3.0-only",
  "exports": { ".": "./dist/index.js", "./styles.css": "./dist/style.css", "./tokens.css": "./dist/tokens.css" },
  "peerDependencies": { "react": "^19.3.1", "react-dom": "^19.3.1" }
}
```

Comandos: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm audit`.

## Componentes afetados

| Caminho | Ação | Motivo |
|---|---|---|
| `package.json` | criar | Manifesto de `@ishtar-sink/vega`, scripts e peer dependencies. |
| `pnpm-workspace.yaml` | criar | Workspace pnpm ([project/architecture-01]). |
| `tsconfig.json` | criar | TypeScript `strict` com `noUncheckedIndexedAccess`. |
| `eslint.config.js` | criar | ESLint `strictTypeChecked`, `react-hooks` e `jsx-a11y`. |
| `vite.config.ts` | criar | Build em modo biblioteca e configuração do Vitest. |
| `src/index.ts` | criar | Índice das exportações públicas. |
| `src/test/setup.ts` | criar | Setup do Testing Library e do `vitest-axe`. |
| `src/theme/` | criar | Tokens, `tokens.css`, API de tema, contraste e testes. |
| `fonts/` | criar | Fontes Outfit e Inter e as licenças OFL. |
| `src/button/` | criar | `Button`. |
| `src/icon-button/` | criar | `IconButton`. |
| `src/menu-button/` | criar | `MenuButton`. |
| `src/text-field/` | criar | `TextField`. |
| `src/select-field/` | criar | `SelectField`. |
| `src/checkbox/` | criar | `Checkbox`. |
| `src/segmented-field/` | criar | `SegmentedField`. |
| `src/autocomplete/` | criar | `Autocomplete`. |
| `src/tag-field/` | criar | `TagField`. |
| `src/color-field/` | criar | `ColorField`, `ColorPicker` e funções de cor. |
| `src/calendar/` | criar | `Calendar`. |
| `src/date-field/` | criar | `DateField`. |
| `src/time-field/` | criar | `TimeField`, `parseTime` e `maskTime`. |
| `src/date-time-field/` | criar | `DateTimeField`. |
| `src/period-field/` | criar | `PeriodField` e `resolvePeriod`. |
| `src/money-field/` | criar | `MoneyField` e máscara em centavos. |
| `src/card/` | criar | `Card`. |
| `src/page-header/` | criar | `PageHeader`. |
| `src/toolbar/` | criar | `Toolbar`. |
| `src/tabs/` | criar | `Tabs`. |
| `src/view-switcher/` | criar | `ViewSwitcher`. |
| `src/form-layout/` | criar | `FormGrid` e `FormActions`. |
| `src/dialog/` | criar | `Dialog`. |
| `src/confirm-dialog/` | criar | `ConfirmDialog`. |
| `src/toast/` | criar | `Toast` e `ToastRegion`. |
| `src/empty-state/` | criar | `EmptyState`. |
| `src/loading-state/` | criar | `LoadingState` e `Skeleton`. |
| `src/error-state/` | criar | `ErrorState`. |
| `src/progress-bar/` | criar | `ProgressBar`. |
| `src/brand-logo/` | criar | `BrandLogo` generalizado. |
| `src/badge/` | criar | `Badge`. |
| `src/item-swatch/` | criar | `ItemSwatch` generalizado. |
| `src/icons/` | criar | Ícones de visualização. |
| `.github/workflows/ci.yml` | criar | Lint, typecheck, testes e `pnpm audit`. |
| `.github/workflows/release.yml` | criar | Publicação no npm com provenance a partir da tag. |
| `CHANGELOG.md` | criar | Entrada da 0.1.0. |
| `README.md` | alterar | Tira o aviso "Em desenvolvimento" e descreve a instalação e os estilos reais. |

## Premissas e dependências

- O código de origem é `../atria/packages/ui` e `../atria/packages/theme`, no estado do commit `139d036` do Atria.
- O escopo `@ishtar-sink` existe no npm e o repositório tem o token de publicação configurado como segredo da CI.
- O repositório da Vega está no GitHub da organização Ishtar-Sink, com GitHub Actions habilitado.
- Os testes do Atria passam no estado de origem.

## Riscos

| Risco | Impacto | Mitigação |
|---|---|---|
| A adequação às props nativas (só 5 dos componentes estendem hoje) muda a API de vários componentes. | médio | Registrar cada mudança de prop no `CHANGELOG.md`, para a spec de troca no Atria. |
| 25 arquivos CSS do Atria têm valores literais que não têm token equivalente. | médio | Criar o token que falta no tema, sem mudar valores existentes (RN-03). |
| Publicação bloqueada por falta do escopo ou do token no npm. | alto | Conferir o escopo e o segredo antes da tarefa de publicação. |
| Volume: 31 componentes e cerca de 5,6 mil linhas. | médio | Tarefas por pasta de componente, em paralelo. |

## Casos de teste

| ID | Cenário | Passos | Resultado esperado | Requisitos |
|---|---|---|---|---|
| CT-01 | Build do pacote. | Rodar `pnpm build`. | `dist/` com `index.js` ESM, `.d.ts` e o CSS dos módulos. | RF-01 |
| CT-02 | Exportações públicas. | Importar cada componente, função e tipo de `src/index.ts` num teste. | Todos definidos. | RF-02, RF-09, RF-10, RF-11, RF-12, RF-13, RF-14, RF-15, RF-18 |
| CT-03 | Tokens padrão. | Testar `light` e `dark` e o tema padrão. | Tokens iguais aos do Atria; claro como padrão. | RF-03 |
| CT-04 | Tema incompleto. | Teste de tipo com `defineTheme` sem um token. | Erro de tipo esperado (`@ts-expect-error`). | RF-04 |
| CT-05 | Espelho do CSS. | Comparar `tokens.css` com `tokens.ts`. | Mesmos valores e comentário de origem no topo. | RF-05 |
| CT-06 | Marca em tempo de execução. | Sobrescrever `--primary` num contêiner e renderizar `Button`. | O botão usa a cor sobrescrita. | RF-06 |
| CT-07 | Contraste. | Rodar `checkThemeContrast` nos dois temas padrão e num tema com contraste baixo. | Sem violações no padrão; violação apontada no tema baixo. | RF-07 |
| CT-08 | Fontes. | Conferir o pacote gerado por `pnpm pack`. | Fontes e `OFL-*.txt` presentes. | RF-08 |
| CT-09 | Acessibilidade por componente. | Rodar axe e a navegação por teclado com `user-event` em cada componente interativo. | Sem violações; teclado funcionando. | RF-09, RF-10, RF-11, RF-12, RF-13, RF-14, RF-15 |
| CT-10 | Marca do BrandLogo. | Renderizar `BrandLogo` com `mark` próprio. | A marca recebida aparece; nenhum "A" do Atria. | RF-16 |
| CT-11 | Paleta do ItemSwatch. | Renderizar `ItemSwatch` com e sem `palette`. | Usa a paleta recebida; sem ela, a paleta padrão do tema. | RF-17 |
| CT-12 | Textos e locale. | Renderizar componentes com textos sobrescritos e locale `en-US`. | Textos sobrescritos; datas e números em `en-US`. | RF-19 |
| CT-13 | Props nativas. | Passar `className`, `style` e um atributo `data-*` a cada componente. | Os três chegam ao elemento raiz. | RF-20 |
| CT-14 | CI. | Abrir um pull request com uma falha de lint. | A CI falha; sem a falha, passa. | RF-21 |
| CT-15 | Publicação. | Criar a tag `v0.1.0`. | A CI publica com provenance; `npm view @ishtar-sink/vega@0.1.0` responde. | RF-22, RF-23 |
| CT-16 | Datas determinísticas. | Rodar os testes de data com o relógio injetado. | Mesmo resultado em qualquer data. | RF-11 |

## Critérios de aceite

- [ ] CA-01: `pnpm build` gera ESM, `.d.ts` e CSS em `dist/` (RF-01).
- [ ] CA-02: todos os componentes, funções e tipos listados estão exportados pelo `src/index.ts` (RF-02, RF-09, RF-10, RF-11, RF-12, RF-13, RF-14, RF-15, RF-18).
- [ ] CA-03: tokens do Ishtar Sink com os mesmos valores do Atria, claro como padrão (RF-03).
- [ ] CA-04: um tema incompleto não compila (RF-04).
- [ ] CA-05: o teste de espelho entre `tokens.css` e `tokens.ts` passa (RF-05).
- [ ] CA-06: a camada de marca é sobrescrita por variável CSS sem rebuild (RF-06).
- [ ] CA-07: `checkThemeContrast` está exportada e aponta violações num tema próprio (RF-07).
- [ ] CA-08: o pacote publicado contém as fontes e as licenças OFL (RF-08).
- [ ] CA-09: `BrandLogo` e `ItemSwatch` não têm nada fixo do Atria (RF-16, RF-17).
- [ ] CA-10: todo texto visível é prop com padrão em `pt-br` e datas e números seguem o locale (RF-19).
- [ ] CA-11: todo componente repassa `className`, `style` e `...rest` (RF-20).
- [ ] CA-12: a CI roda lint, typecheck, testes e `pnpm audit`, e falha com qualquer um deles (RF-21).
- [ ] CA-13: `@ishtar-sink/vega@0.1.0` está no npm com provenance, publicado pela CI, com a entrada no `CHANGELOG.md` (RF-22, RF-23).

## Referências

| Tipo | Referência | Uso |
|---|---|---|
| Arquivo | `README.md` | Lista de componentes por grupo e princípios da Vega. |
| Arquivo | `../atria/packages/ui/src/index.ts` | Exportações atuais do `@atria/ui`. |
| Arquivo | `../atria/packages/ui/package.json` | Dependências e scripts de origem. |
| Arquivo | `../atria/packages/theme/src/tokens.ts` | Valores dos tokens. |
| Arquivo | `../atria/packages/theme/src/tokens.css` | Variáveis CSS e gradiente de marca. |
| Arquivo | `../atria/packages/theme/src/palette.ts` | `paletteFor`, usada pelo `ItemSwatch`. |
| Arquivo | `../atria/packages/ui/src/brand-logo/brand-logo.tsx` | Marca do Atria fixa no componente. |
| Arquivo | `../atria/packages/ui/src/item-swatch/item-swatch.tsx` | Dependência da paleta do Atria. |
| Memória | DEC-001 | A Vega é a fonte de verdade da identidade visual. |
| Regras | `vostok/rules/project/` | Critérios de conformidade. |

## O que mudou

| # | Assunto | Estado no Original | Estado Refinado |
|---|---|---|---|
| 1 | Componentes | "os componentes do Atria" | Os 31 componentes por grupo, com as funções auxiliares. |
| 2 | Conformidade | "regras do repositório" | Requisitos e critérios ligados a cada regra de `vostok/rules/project/`. |
| 3 | Específicos do Atria | Não citado | `BrandLogo` e `ItemSwatch` generalizados. |
| 4 | Atria | Não citado | A troca no Atria fica fora, numa spec própria. |
| 5 | Publicação | Não citado | 0.1.0 publicada no npm pela CI. |

## Registro de decisões

| # | Decisão | Alternativa descartada | Motivo |
|---|---|---|---|
| 1 | Generalizar `BrandLogo` e `ItemSwatch`, com marca e paleta por prop. | Deixar os dois no Atria. | resposta 1A |
| 2 | A spec entrega só a Vega; a troca no Atria vira outra spec. | Incluir a troca e a remoção dos pacotes do Atria. | resposta 2A |
| 3 | Publicar a 0.1.0 no npm pela CI. | Só preparar a CI sem publicar; nenhuma CI. | resposta 3B |
| 4 | Todos os 31 componentes na 0.1.0. | Só o núcleo primeiro. | resposta 4A |
| 5 | Tipo `feature`. | `improvement`. | inferência A |
| 6 | Manter os nomes públicos do Atria. | Renomear na extração. | inferência B |
| 7 | Os testes do Atria vêm junto e são completados até as regras de testes. | Reescrever todos os testes. | inferência C |
| 8 | `@atria/contracts` fica fora. | Migrar junto. | inferência D |
| 9 | Pacote na raiz do repositório, com `src/` e `fonts/` na raiz. | Pacote em `packages/vega/`. | inferência: [project/architecture-02] cita `src/<componente>/`. |
| 10 | Tema em `src/theme/`, com `defineTheme` e `checkThemeContrast`. | Pacote de tema separado. | inferência: um pacote publicado ([project/architecture-01]). |

## Pendências

| # | Pendência | Opções em aberto |
|---|---|---|
| - | Nenhuma | - |

## Histórico de ajustes

| # | Data | Origem | Resumo |
|---|---|---|---|
