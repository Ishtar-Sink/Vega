<!-- Escrito no planejamento com o que a tarefa vai fazer e enriquecido na conclusão com o que foi feito. -->

## Abordagem

TDD: o teste vem antes do código. O `ConnectionStatus` segue o padrão de tom do `Callout` e do `Toast` (fundo `*-soft`, ícone e palavra na cor cheia do tom), com a região `role="status"` só no ícone e na palavra estável do estado. O texto completo (progresso e tempo relativo), que muda com frequência, fica num `<span>` comum fora da região, sem `aria-hidden`, para o leitor de tela anunciar a troca de estado e não cada item. Os tipos ficam em `connection-status.types.ts`, os textos e o mapa de estados em `connection-status.constants.ts` e o tempo relativo em `connection-status.utils.ts` ([project/code-style-09]). O relógio entra por `now`, sem timer: o componente recalcula o tempo relativo quando renderiza.

## Decisões

| # | Decisão | Alternativa descartada | Motivo |
|---|---|---|---|
| D-01 | A região `role="status"` contém o ícone e a palavra estável do estado (`labels.syncing()` e `labels.synced()` sem argumento). | O `role="status"` na raiz com o texto todo. | Decisão 10 da spec: o KT pede anúncio só ao começar e ao terminar; com o texto todo na região, cada `2 de 5` seria anunciado. |
| D-02 | Quando o texto completo difere do estável (progresso ou tempo relativo), a região mostra o estável só para leitor de tela (`srOnly`) e o texto completo vai num `<span>` comum ao lado, fora da região viva e sem `aria-hidden`, lido na navegação normal ([project/accessibility-01]). Sem diferença, o texto estável é o visível. | Esconder o progresso do leitor de tela sem repetir a palavra. | Mantém um único texto visível, sem repetição, e a região nunca muda com o progresso (CT-11). |
| D-03 | `online` no `detail` usa o fundo neutro (`surfaceMuted`), a palavra `labels.online` e nenhum ícone; no `chip`, devolve `null`. | Um `WifiIcon` novo ou o `CloudCheckIcon` do `synced`. | A 0.2.0 não tem ícone de conexão ativa; o `CloudCheckIcon` confundiria `online` com `synced`; a palavra já cumpre [project/theme-06]. Decisão 8 da spec. |
| D-04 | A fila (`pending`) aparece nas duas variantes, quando maior que zero, fora da região viva. A `action` (`{ label, onAction }`, ajuste 1 da spec) torna a caixa inteira um `button` nas duas variantes (RF-17). | Fila só no `detail`. | A spec (RF-16) não restringe a variante; o produto escolhe passar ou não o `pending` ao `chip`. |
| D-05 | O tempo relativo só entra no estado `synced`, como argumento de `labels.synced(relative)`; em outros estados, `lastSyncedAt` é ignorado. | Mostrar "última sincronização" também em `offline` e `error`. | O contrato (`labels.synced`) só tem o gancho do `synced`; mostrar em outro estado exigiria um label novo, fora da spec. |
| D-06 | `formatRelativeTime` escolhe a unidade pela magnitude (segundo, minuto, hora, dia, com `Math.floor`) e usa `Intl.RelativeTimeFormat` com `numeric: 'auto'`; valor negativo vira zero, e zero sai como "agora". | Sempre em minutos; `numeric: 'always'` ("há 0 segundos"). | Segundos de "há 2 minutos" a "há 3 dias" ficam legíveis, e "agora" é mais natural que "há 0 segundos" (CB-07). Um dia de diferença sai "ontem". |
| D-07 | Total de `progress` igual a zero chama `labels.syncing(undefined)` (CB-06). | Mostrar `0 de 0`. | CB-06; o `labels` do produto recebe `undefined`, como no texto sem progresso. |
| D-08 | O padrão `chip` é uma pílula (`--radius-pill`) em `inline-flex`; o `detail` é uma linha `flex` com `--radius-md` e `padding` maior. A troca de cor usa `transition` com `--motion-fast`, que o `tokens.css` zera em `prefers-reduced-motion`. O ícone de `syncing` não gira. | Girar o ícone em laço. | KT-002 e RNF-04: nenhuma animação contínua. |

## Riscos

- A região `role="status"` nasce junto com o conteúdo quando o `chip` sai de `online` (que não renderiza nada): alguns leitores de tela não anunciam uma região inserida já preenchida. Seguimos a spec (RF-14), e a verificação é o teste de troca entre estados já visíveis; se o Synestia perceber o problema, a spec de troca deve pedir uma região vazia permanente no `chip`.
- Os padrões `syncing` e `pending` interpolam os números sem `Intl.NumberFormat`: com milhares, o produto sobrescreve `labels` ([project/language-06]).
- O `now` padrão (`Date.now`) é lido só ao renderizar: o tempo relativo não se atualiza sozinho. O produto rerenderiza com um `now` novo quando quiser.
- A palavra estável pode ser lida duas vezes na navegação (a região, só para leitor de tela, mais o texto visível). Custo menor aceito, em troca de anunciar só a troca de estado.

## Referências da spec

RF-13 a RF-17; CT-10, CT-11, CT-12; CB-06, CB-07; RN-02, RN-03; RNF-01, RNF-03, RNF-04, RNF-05, RNF-07; decisões 8 e 10.

## Arquivos em comum com a onda

Nenhum. A onda 1 tem a TASK-01 (`src/timer/`) e a TASK-02 (`src/countdown/`) em pastas próprias; esta tarefa só lê `src/icons/`, `src/theme/` e `src/button/`. O `src/index.ts` só é tocado pela TASK-04, na onda 2.

## O que foi feito

- `connection-status.types.ts`: `ConnectionState`, `ConnectionStatusLabels`, `ConnectionStatusAction` (`{ label, onAction }`, ajuste 1) e `ConnectionStatusProps`, que estende `Omit<ComponentPropsWithRef<'div'>, 'children'>`.
- `connection-status.constants.ts`: `DEFAULT_LABELS` em pt-br e `STATE_CONFIG`: `offline` com `WifiOffIcon` e tom `warning`, `syncing` com `RefreshIcon` e `info`, `synced` com `CloudCheckIcon` e `success`, `error` com `CircleAlertIcon` e `danger`.
- `connection-status.utils.ts`: `formatRelativeTime`, que escolhe a unidade pela magnitude e usa `Intl.RelativeTimeFormat` com `numeric: 'auto'`, e `resolveStateText`, que devolve `stable` (vai na região viva) e `full` (vai na tela).
- `connection-status.tsx`: `ConnectionStatus` sobre `<div>`. A região `span role="status"` contém o ícone e o `stable`. O texto completo e a fila ficam fora dela, e a ação, quando houver, também.
- `connection-status.module.css`: variantes `chip` (pílula) e `detail` (linha), tons `*-soft` por estado, troca de cor com `--motion-fast`, `.srOnly` igual ao do toast. O `.button` herda fundo, cor e raio da caixa, sem fundo `--primary`.
- Testes: `connection-status.test.tsx`, 37 casos no total, com `it.each`.

## Como foi feito

- TDD: os testes foram escritos antes do código.
- `stable` é `labels.syncing()` ou `labels.synced()` sem argumento; `full` leva o progresso ou o tempo relativo. Quando `full` difere de `stable`, a região mantém `stable` em `srOnly` e o `full` aparece num `span` comum ao lado. Sem diferença, o texto estável é o visível.
- Progresso com `total` zero chama `labels.syncing(undefined)`.
- `lastSyncedAt` só entra no estado `synced`. Futuro e zero viram "agora" pelo `Intl`.
- `online` no `chip` devolve `null`; no `detail`, mostra a palavra `Online` sem ícone e com o fundo neutro da raiz.
- Com `action`, a caixa inteira vira `<button type="button">`, com ícone, texto completo, fila e o grupo da ação. A região `role="status"` fica fora do botão, como irmã, então a troca de estado anuncia só `stable`. O grupo da ação tem o separador `·` e o `label`, em `currentColor`, sublinhado e negrito.
- No `chip` com ação, a área de toque chega a 44 px por um `::after` absoluto que estende a caixa na vertical, sem mudar a pílula.
- Sem `action`, não há nenhum `button` no componente.
- Verificação: testes, regressão (4 comandos do baseline, código 0) e as evidências `testes-connection-status.txt`, `linhas-connection-status.txt` e `connection-status-360.png` conferidas pelo usuário.

## Pontos de atenção

- A 360 px, com fila, "Tentar de novo" desce para a segunda linha, e o `·` fica no começo dela. O usuário aceitou esse comportamento.
- O `·` tem `aria-hidden="true"`, então o nome do botão não lê o separador. É o único `aria-hidden` do componente; o texto completo, a fila e a ação não são ocultados.
- Sem ação, na variante com progresso ou tempo relativo, o leitor de tela lê a palavra duas vezes: uma na região (só para leitor de tela) e outra no texto visível.
- No `chip`, a região `role="status"` aparece já com conteúdo quando o estado sai de `online`, porque antes o componente não renderiza nada. Alguns leitores de tela não anunciam uma região inserida preenchida. Os testes cobrem a troca entre estados já visíveis (ver Riscos).
- `now` é lido só ao renderizar: "há 2 minutos" não avança sozinho.
- `syncing` e `pending` interpolam os números sem `Intl.NumberFormat`. Com milhares, o produto sobrescreve os `labels`.
- O nome do botão inclui a ação, então o `label` deve fazer sentido sozinho para quem o ouve.

## Ajuste 1: ação discreta na pílula

- O primeiro desenho aceitava `action: ReactNode`, e o produto passava um `Button` preenchido. No print, o botão quebrava para baixo e vazava da pílula; com a ação fora da pílula, ele ainda destoava dos selos. O usuário pediu uma forma mais discreta, configurada por fora.
- Referência: o Material Design orienta a ação de um aviso curto (snackbar) como botão de texto colorido, nunca preenchido; o Pega e o xNet usam o selo inteiro como alvo de "tentar de novo".
- Decisão: `action?: { label: string; onAction: () => void }`. Com ação, a caixa inteira vira um `<button type="button">`, com o texto da ação no fim, depois de `·`, na cor do tom e sublinhado. A região `role="status"` (só a palavra estável) fica fora do botão, como irmã, para o anúncio da troca de estado não depender do botão.
- O nome do botão vem do conteúdo (estado, fila e ação), e contém o texto visível da ação ([WCAG 2.5.3]).

