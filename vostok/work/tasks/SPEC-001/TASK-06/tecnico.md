<!-- Escrito no planejamento com o que a tarefa vai fazer e enriquecido na conclusão com o que foi feito. -->

## Abordagem

Migração com TDD ([project/development-methodology-01]), pasta por pasta e na ordem dos imports: `time-field` (sem dependência), `calendar` (usa `IconButton`), `date-field` (usa `Button` e `Calendar`), `date-time-field` (usa `DateField` e `TimeField`) e `period-field` (usa `Button` e `Calendar`). Em cada pasta, o teste do Atria é copiado, adaptado ao contrato novo e completado até as regras de testing (papel e nome acessível, axe, teclado com `user-event`, props nativas, textos sobrescritos, locale e relógio), roda falhando e só então o código é trazido e adaptado. Imports entre componentes por caminho relativo (`../button/button`, `../icon-button/icon-button`, `../calendar/calendar`); nada em `src/index.ts` nem em `package.json`.

## Decisões

| # | Decisão | Alternativa descartada | Motivo |
|---|---|---|---|
| D-01 | O relógio injetável é a prop `today` (`YYYY-MM-DD`), mantida do Atria: obrigatória no `Calendar`, opcional no `DateField`, `DateTimeField` e `PeriodField`, com a data do navegador só quando falta. Todos os testes passam `today` e um teste por componente falsifica a data do sistema (`vi.setSystemTime`) para provar que ela é ignorada. | Uma prop `now: () => Date` ou um provedor de relógio por contexto. | Mantém o nome público (RN-02) e já isola a data atual ([project/testing-06], CT-16); um contexto seria um componente novo, fora do escopo. |
| D-02 | Presets do `PeriodField` por prop: `PeriodPreset { id, label, range }`, com `range: PeriodRule = number \| ((today) => PeriodRange \| null)`. Inteiro positivo: de hoje a hoje + n dias; negativo: de hoje + n dias a hoje; zero: só hoje. Função: recebe `today` e devolve o intervalo, ou `null` para "sem limite". `presets` é obrigatório e o componente não tem lista padrão. `resolvePeriod(value, today, presets)` ganha o terceiro parâmetro. | Manter a união fixa `'this_month' \| 'last_month' \| ...` do Atria, ou dar uma lista padrão no componente. | [project/code-style-07] exige presets definidos no uso, por inteiro ou função; a lista do Atria é regra do produto ([project/architecture-04]). |
| D-03 | Textos com padrão pt-br: `locale` opcional (padrão `'pt-BR'`) e `labels?: Partial<...>` mesclado com uma constante `DEFAULT_LABELS` em cada componente; no `DateTimeField`, os rótulos das partes derivam do `label` (`"<label>: data"`, `"<label>: hora (24 horas)"`). Com outro locale, só datas mudam; os textos continuam em pt-br até serem sobrescritos (CB-03). | Rótulos obrigatórios como no Atria; textos traduzidos automaticamente pelo locale. | [project/language-06]; traduzir por locale seria embutir um dicionário, fora do escopo. |
| D-04 | Os popovers do `DateField` e do `PeriodField` continuam `div role="dialog"` não modais, com clique fora e Esc. | Trocar por `<dialog>` com `showModal()`. | [project/accessibility-06] e RN-05 tratam do diálogo modal (`Dialog`, TASK-09); um seletor de data modal bloquearia a página e mudaria o comportamento do Atria. Registrado como risco para revisão. |
| D-05 | Decisão do usuário: nos campos, `className`, `style`, `...rest` e `ref` vão para o controle, não para o `div` de fora. `TimeField` → o `input`. `DateField` → o botão gatilho: o `DateField` do Atria não tem `<input>`; o controle focável, com o nome acessível (`aria-labelledby`), `aria-invalid` e `aria-describedby`, é o `<button>` que abre o calendário. `DateTimeField` → o `fieldset`. `PeriodField` → o botão gatilho: os `input type="hidden"` só existem com `name` e não são focáveis nem nomeados; o botão é o controle que recebe foco, nome e teclado. `Calendar` não é campo → `div` raiz. `id`, `disabled` e `placeholder` passam a ser os nativos do controle; `onChange` e `onBlur` mantêm a assinatura do Atria (saem das nativas com `Omit`). Onde já há `ref` interno no elemento, o recebido é ligado com `useImperativeHandle(ref, () => x.current as HTMLX, [])`. | Repassar ao `div` de fora; no `PeriodField`, a um campo oculto; mesclar refs com um utilitário compartilhado. | Coerência com o `TextField` e os demais campos (CT-13); sem utilitário nem dependência nova. Mudança de API para o `CHANGELOG.md` (TASK-14): nos cinco componentes, `className` e atributos extras passam do `div` de fora para o controle. |
| D-06 | Literais `px` do CSS viram o token de mesmo valor ou `calc(var(--space) * N)` com o valor exato (1px = `calc(var(--space) / 4)`); a condição de `@media (max-width: 560px)` fica em `px`, porque `var()` não vale em media query. | Criar tokens de borda e de anel de foco nesta tarefa. | O tema é da TASK-02; a forma com `--space` mantém os valores do Atria (RN-03) sem literal ([project/code-style-02], RNF-02). |
| D-07 | Os campos ocultos do `PeriodField` passam a usar o `name` recebido: `name`, `<name>From` e `<name>To`. | Manter os nomes fixos `period`, `from` e `to` do Atria. | O Atria só usava `name` como liga-desliga e fixava os nomes do formulário dele ([project/architecture-04]). |

## O que muda para conformidade em relação ao Atria

| Componente | Atria | Vega | Regra |
|---|---|---|---|
| Todos | Props próprias, sem props nativas (só `className`, aplicado ao `div` de fora). | Estendem `ComponentPropsWithRef` do controle (`input`, botão gatilho, `fieldset`) ou, no `Calendar`, do `div` raiz, e repassam `className`, `style`, `ref` e `...rest` a ele. Nos campos, `className` passa a ir para o controle, não para o `div` de fora. | [project/code-style-03], RF-20 |
| Todos | `locale` e `labels` obrigatórios. | `locale` padrão `'pt-BR'`; `labels` parcial com padrão pt-br. | [project/language-06], RF-19 |
| Todos | Variáveis em snake_case (`pending_focus`, `day_today`). | camelCase. | [project/naming-convention-07] |
| `DateFieldLabels`, `PeriodFieldLabels`, `DateTimeFieldLabels` | `today_marker`, `first_day`, `last_day`, `first_day_error`, `time_placeholder`. | `todayMarker`, `firstDay`, `lastDay`, `firstDayError`, `timePlaceholder`. | [project/naming-convention-09] |
| `PeriodField` | `label_visible`, `allow_custom`. | `labelVisible`, `allowCustom`. | [project/naming-convention-09] |
| `PeriodField` e `period.ts` | `PeriodPreset` é uma união fixa de seis períodos; `labels.presets`; lista padrão no componente; `value` opcional com padrão `this_month`. | `PeriodPreset` é `{ id, label, range }` com `PeriodRule` (inteiro ou função); `presets` e `value` obrigatórios; `resolvePeriod` recebe os presets. Novo tipo exportado `PeriodRule`. | [project/code-style-07], [project/architecture-04] |
| `PeriodField` | Campos ocultos `period`, `from` e `to`, fixos. | `name`, `<name>From` e `<name>To`. | [project/architecture-04] |
| `PeriodField` | `today` obrigatório. | `today` opcional, com a data do navegador quando falta (como o `DateField`). | consistência do relógio injetável, [project/testing-06] |
| `DateTimeField` | Rótulos das partes obrigatórios em `labels`. | Derivados do `label` por padrão. | [project/language-06] |
| `TimeField` | Sem placeholder padrão. | `'hh:mm'` por padrão. | [project/language-06] |
| `Calendar` | SVG das setas sem `aria-hidden`. | `aria-hidden="true"` e `focusable="false"`. | [project/accessibility-03] |
| CSS | `1px`, `2px`, `-1px` literais (bordas, foco, padrão visualmente oculto, `letter-spacing`). | Token de mesmo valor ou `calc(var(--space) * N)`. | [project/code-style-02], RNF-02 |
| CSS | `font-weight` 600/700 e `z-index` 40/45 numéricos. | `--font-weight-*`, `--z-dropdown` e `--z-popover`. | [project/code-style-02] |

`parseTime` e `maskTime` não mudam.

## Riscos

- Mudança de contrato do `PeriodField` e do `resolvePeriod` (D-02): o Atria terá de declarar os próprios presets na spec de troca. Registrar no `CHANGELOG.md` (TASK-14).
- D-04 (popovers não modais) pode ser lida como desvio de [project/accessibility-06]; se o revisor entender que vale para popovers, a mudança vira um ajuste desta tarefa.
- Falta de tokens de espessura de borda, anel de foco e `letter-spacing` no tema (D-06): a forma `calc(var(--space) / 4)` resolve sem literal, mas fica menos legível; se a TASK-02 criar tokens com esses valores, eles têm prioridade pela regra do passo.
- Dependência da TASK-02: os tokens `--font-weight-semibold`, `--font-weight-bold`, `--z-dropdown` e `--z-popover` precisam existir em `src/theme/tokens.css`.
- O posicionamento do popover do `PeriodField` calcula margens em JavaScript (`MARGIN = 8`), como no Atria; não é CSS e não entra na busca de literais.
- O `tsc` precisa da declaração de tipos de `*.module.css` e dos tipos globais do Vitest (`vi`, `describe`), que vêm da TASK-01; sem eles a checagem de tipos falha.
- Os testes usam `user-event` com a data falsa só em `Date` (`toFake: ['Date']`); falsificar todos os timers travaria o `user-event`.

## Referências da spec

RF-11, RF-19, RF-20; CT-09, CT-12, CT-13, CT-16; CB-03; RN-01, RN-02, RN-05; RNF-01, RNF-02; [project/testing-06], [project/code-style-07], [project/language-06], [project/accessibility-06].

## Arquivos em comum com a onda

Nenhum. A onda 4 (TASK-05, TASK-07, TASK-08, TASK-09, TASK-10) cria só as próprias pastas. Como várias tarefas da onda rodam em paralelo, o baseline e a Verificação filtram a saída do `pnpm exec tsc --noEmit` pelas pastas medidas (`grep -E '^src/(...)/'`): um erro de tipo de outra tarefa da onda não bloqueia esta.

## O que foi feito

Criadas as cinco pastas de componentes, com 18 arquivos novos: `time-field` (`parse-time.ts`, `time-field.tsx`, estilos e testes), `calendar` (componente, estilos e testes), `date-field`, `date-time-field` e `period-field` (`period.ts`, componente, estilos e testes). `parseTime` e `maskTime` vieram do Atria sem mudança de comportamento.

A migração seguiu a ordem de dependência: `time-field`, `calendar`, `date-field`, `date-time-field` e `period-field`. Em cada pasta, o teste do Atria foi copiado, adaptado ao contrato novo e completado. Os 6 arquivos de teste falharam antes do código, com "Failed to resolve import", e depois passaram. Ao todo, 80 testes passaram; com a regressão do título do calendário, acrescentada no ajuste 3, são 81. Em outro fuso (`TZ=Pacific/Kiritimati`), a evidência de datas roda 68 testes de datas.

Além dos testes do Atria, foram acrescentados testes de papel e nome acessível, axe, teclado com `user-event`, props nativas (`className`, `style`, `data-*` e `ref` no controle), textos sobrescritos, locale `en-US` e data do sistema falsa. Há também teste de box-sizing no `.control` do `TimeField` e do `DateField`.

Decisões aplicadas (tabela "Decisões"):
- O relógio continua sendo a prop `today`; a data do sistema só entra quando ela falta. Um teste por componente falsifica `Date` e prova que a data do sistema é ignorada.
- `PeriodField` recebe presets por prop (`id`, `label` e `range`, com inteiro ou função). `resolvePeriod` ganhou o terceiro parâmetro `presets`.
- Textos em pt-br por padrão, com `labels` parcial; `locale` padrão `'pt-BR'`. Com outro locale, só as datas mudam.
- `className`, `style`, `ref` e `...rest` vão para o controle: `input` no `TimeField`, botão gatilho no `DateField` e no `PeriodField`, `fieldset` no `DateTimeField` e `div` raiz no `Calendar`. Foi decisão do usuário.
- Campos ocultos do `PeriodField` usam `name`, `<name>From` e `<name>To`.
- CSS: `px` virou token de mesmo valor ou `calc(var(--space) * N)`; pesos, entrelinhas e `z-index` usam os tokens da TASK-02. A condição de `@media (max-width: 560px)` continua em `px`.

Ajustes feitos durante a execução (Histórico de ajustes):
1. O print manual virou automático: é gerado por um build temporário em `node_modules` e Chromium headless, sem arquivo novo no projeto.
2. A cena do print passou a abrir só o `PeriodField` no painel claro e só o `DateField` no escuro, porque um popover cobria o outro.
3. O primeiro print foi rejeitado: o título do calendário saía "Novembro De 2026", porque `text-transform: capitalize`, herdado do Atria, capitaliza todas as palavras. A correção usa `.title::first-letter { text-transform: uppercase }` no lugar do `capitalize`, com teste de regressão visto falhando antes da correção. O nome acessível continua "novembro de 2026". O novo print foi aceito.

Pontos de atenção para quem mantém:
- Os popovers do `DateField` e do `PeriodField` são `div role="dialog"` não modais (D-04). Se o revisor entender que a regra de acessibilidade vale para popovers, a mudança vira ajuste desta tarefa.
- A mudança de contrato do `PeriodField`, do `resolvePeriod` e das props dos campos precisa ir ao `CHANGELOG.md` (TASK-14), e o Atria terá de declarar os próprios presets na troca.
- Os testes falsificam só `Date` (`toFake: ['Date']`); falsificar todos os timers trava o `user-event`.
- Onde não há token de mesmo valor, a forma `calc(var(--space) / N)` fica menos legível que o literal; a TASK-02 não criou tokens de espessura de borda nem de anel de foco, então um tema futuro com esses tokens deve substituir essa forma.
- A verificação da tarefa passou sem falhas, e as três evidências (`testes-data-hora.txt`, `datas-outro-fuso.txt` e `data-hora-temas.png`) foram conferidas pelo usuário.
