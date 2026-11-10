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
