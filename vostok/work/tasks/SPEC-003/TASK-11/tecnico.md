<!-- Escrito no planejamento com o que a tarefa vai fazer e enriquecido na conclusão com o que foi feito. -->

## Abordagem

Componente novo com TDD em `src/focus-header/` (decisão 4 da spec: componente próprio, não variante do `PageHeader`), com a divisão de [project/code-style-09]: tipos, constantes (textos padrão), componente, CSS e teste. Reaproveita o `IconButton` com o `CloseIcon` da TASK-02 e o `ProgressBar`.

## Decisões

| # | Decisão | Alternativa descartada | Motivo |
|---|---|---|---|
| D-01 | `FocusHeader` separado do `PageHeader`. | `PageHeader` com `variant="focus"`. | Decisão do usuário (resposta 4A da SPEC-003). |
| D-02 | Sair com o `IconButton` (`aria-label` dos `labels`) e o `CloseIcon`, ampliado para 44 px pela classe `.exit`. | Botão com texto "Sair". | Cabe numa linha a 360 px, e o nome acessível continua vindo de `labels` (RN-02). |
| D-03 | O título é o `h1` da tela, numa linha, com `text-overflow: ellipsis` (CB-13). | Quebrar o título. | Critério do KT-001: a variante cabe em 360 px numa linha. |
| D-04 | `progress` como objeto `{ value, max, label }`, repassado ao `ProgressBar`. | Receber um `ProgressBar` pronto por slot. | É o contrato da spec, e o `label` garante o nome acessível da barra. |

## Riscos

- Depende do nome `CloseIcon` e do caminho `src/icons/interface-icons.tsx` da TASK-02; se a TASK-02 mudar o nome, este passo precisa acompanhar.
- O `h1` do `FocusHeader` substitui o do `PageHeader` na tela de foco: a tela não deve ter os dois.

## Referências da spec

RF-40, CT-37, CB-13; RN-02; RNF-01, RNF-02, RNF-03, RNF-08; decisão 4 do "Registro de decisões" da spec.

## Arquivos em comum com a onda

Nenhum. Na onda 3, as TASK-06, TASK-08, TASK-09, TASK-12 e TASK-14 não mudam `src/focus-header/`; todas usam os ícones da TASK-02 só para leitura.

## O que foi feito

Arquivos criados em `src/focus-header/`:

- `focus-header.types.ts`: `FocusHeaderLabels` (com `exit`) e `FocusHeaderProps`, que estende as props nativas de `header` sem `title` e acrescenta `title`, `onExit`, `position`, `progress` (`value`, `max`, `label`) e `labels`. JSDoc em pt-br.
- `focus-header.constants.ts`: `DEFAULT_FOCUS_HEADER_LABELS = { exit: 'Sair' }`.
- `focus-header.tsx`: `FocusHeader` renderiza um `<header>` com uma linha (`.row`), que tem o `IconButton` com `CloseIcon` (nome vindo de `labels.exit`), o `<h1>` com o título e, se houver, o `<span>` da posição. Se houver `progress`, a `ProgressBar` fica abaixo da linha, com o `label`. `className`, `style`, `ref` e as demais props nativas vão para o `<header>` pelo `...rest`. Reexporta os tipos.
- `focus-header.module.css`: `.exit` com 44 px (`calc(var(--space) * 11)`), sobre o botão de 40 px padrão; `.title` com `white-space: nowrap`, `overflow: hidden`, `text-overflow: ellipsis` e `min-width: 0`; `.position` com números tabulares. Só tokens.
- `focus-header.test.tsx`: 9 testes (axe, nome padrão e sobrescrito, clique e teclado, título, posição e progresso, sem posição e progresso, props e `ref`, truncamento e alvo de 44 px). Os dois testes de CSS leem o arquivo com `readFileSync(join(import.meta.dirname, ...))`, porque `new URL(import.meta.url)` falhou no jsdom.

`src/index.ts` não mudou; a exportação do `FocusHeader` fica para a TASK-15.

## Como foi verificado

- Os testes foram escritos antes do componente (TDD), como pede o passo 1 do `execucao.md`.
- Os 9 testes passam. Na revisão desta documentação, o ESLint das pastas `src/focus-header`, `src/bottom-sheet` e `src/app-shell` terminou sem erros.
- Regressão: os 3 comandos do baseline terminaram com código 0.
- Evidências: `testes-focus-header.txt` e `focus-header-360.png`, conferidas pelo usuário.

## Pontos de atenção

- Os testes de `.exit` e `.title` leem o CSS como texto. Renomear essas classes ou mudar essas regras quebra o teste, mas o efeito visual só é conferido no print.
- O `CloseIcon` vem de `src/icons/interface-icons.tsx` (TASK-02). Renomear o ícone quebra a compilação deste componente.
- A tela não deve ter também o `PageHeader`, porque os dois trazem um `h1`.
- O título cortado na tela mantém o texto inteiro no `<h1>`, então leitores de tela leem o título completo.
