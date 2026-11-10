<!-- Escrito no planejamento com o que a tarefa vai fazer e enriquecido na conclusão com o que foi feito. -->

## Abordagem

TDD, como na TASK-15 da SPEC-003: o `src/index.test.ts` ganha os nomes novos e falha; depois o `src/index.ts`. O formato segue o índice atual: um `export` e um `export type` por módulo, sem `export *`, e o teste confere a lista exata das chaves. A verificação roda também a suíte inteira, o build e a busca de rede, porque é a tarefa de integração da spec.

## Superfície nova

- Valores (5): `Timer` (`src/timer/timer.tsx`), `formatDuration` (`src/timer/timer.utils.ts`), `Countdown` (`src/countdown/countdown.tsx`), `daysBetween` (`src/countdown/countdown.utils.ts`), `ConnectionStatus` (`src/connection-status/connection-status.tsx`).
- Tipos (11): `TimerProps`, `TimerCountdownProps`, `TimerElapsedProps`, `TimerLabels`, `DurationParts` (`src/timer/timer.types.ts`); `CountdownProps`, `CountdownLabels` (`src/countdown/countdown.types.ts`); `ConnectionStatusProps`, `ConnectionStatusLabels`, `ConnectionStatusAction`, `ConnectionState` (`src/connection-status/connection-status.types.ts`).
- Contagem: 122 + 5 = 127 valores. O arquivo de teste tem 131 testes: um `exporta <Nome>` por nome, mais superfície exata, paleta do Atria e `Prose` fora; os tipos são conferidos pelo `tsc`. O passo 1 acrescenta o que as tarefas de componente registrarem a mais.
- Ficam fora do índice, por não constarem do contrato: constantes e hooks internos de cada pasta (por exemplo, relógio e rótulos padrão) e tipos que a spec não lista.

## Decisões

| Decisão | Alternativa descartada | Motivo |
|---|---|---|
| Lista exata de nomes da seção "Contratos e interfaces" da spec. | Exportar também os rótulos padrão (`DEFAULT_*_LABELS`). | A spec fixa a lista; o `DEFAULT_COLOR_FIELD_LABELS` da 0.1.0 foi uma exceção pedida na época. Se uma tarefa registrar um valor a mais, o passo 1 o acrescenta. |
| Utilitário exportado do arquivo `*.utils.ts`, em linha própria. | Reexportar pelo componente. | Um único ponto de origem por nome, sem arquivo intermediário. |
| Build confere os 5 nomes e chama os dois utilitários pelo pacote. | Só contar as chaves. | Prova que o `dist/` funciona, não só que o nome existe (CT-14). |
| Suíte inteira e `sem-rede.txt` nesta tarefa. | Só os testes do índice. | Integração das três tarefas da onda 1; o `ConnectionStatus` é o componente com mais risco de tocar rede, e o RNF-08 pede a busca no `dist/`. |

## Riscos

- Nome trocado por uma tarefa de componente: o passo 1 manda usar o nome registrado no `tecnico.md` dela.
- Um componente que acesse `document`/`window` ao carregar quebra o `import` do `dist/index.js` no Node: o passo 5 registra o bloqueio em vez de contornar.
- `index.ts` foi de 176 para 195 linhas, porque o Prettier quebra os `export type` longos. Está abaixo do limite de 200 (RNF-07), mas a próxima leva de componentes passa dele. Nesse caso, separar o índice por grupo exige uma decisão de arquitetura.

## Referências da spec

RF-19, CT-14, RNF-07, RNF-08; "Contratos e interfaces" (lista do índice); [project/architecture-03], [project/security-01].

## Arquivos em comum na onda

Onda 2 só tem esta tarefa: nenhum arquivo em comum. Ela só lê os arquivos que a onda 1 cria (`src/timer/`, `src/countdown/`, `src/connection-status/`).

## O que foi feito

- `src/index.test.ts`: os 5 valores novos entraram em `RUNTIME_EXPORTS`, depois de `AppShell` e antes do tema. Os 11 tipos entraram no `import type` e em `PublicTypes`, depois de `AppShellProps`. Antes da mudança no índice, falharam os 5 `exporta <Nome>` e `exporta só a superfície pública`, e o `tsc` acusou os tipos ausentes.
- `src/index.ts`: há uma linha `export` por arquivo de origem (componente e utilitário separados) e um `export type` por pasta, sem `export *`. Os nomes e as origens são os esperados: nenhuma tarefa da onda 1 trocou nome nem acrescentou valor público.
- `.prettierignore` (ajuste 2): a linha `docs/specs/` foi acrescentada. O `prettier --check .` do `pnpm lint` reprovava o `executivo.html` e o `tecnico.html` gerados pelo `vostok finalize` da SPEC-003. A CI da `main` estava vermelha desde o `d19d4c8`, e o `release.yml` também roda o `pnpm lint`.

## Como foi verificado

- `exportacoes.txt`: 131 testes passam.
- `suite-completa.txt`: 852 testes passam, em 64 arquivos, e o `pnpm lint` passa.
- `build-0-3.txt`: o `dist/index.js` tem 127 exportações, inclusive os 5 nomes novos. `formatDuration(65000)` dá `01:05` e `daysBetween('2026-11-10', '2026-11-17')` dá `7`. O `Prose` aparece só em `@ishtar-sink/vega/prose`.
- `sem-rede.txt`: o `dist/` não tem API de rede nem URL externa.
- Regressão: sem regressão. Dois comandos do baseline deram a mesma saída, e o da lista de testes ganhou linhas, só com acréscimos.

## Pontos de atenção

- Os HTML de `docs/specs/` não passam mais pelo Prettier. Se alguém editar esses arquivos à mão, nada vai checar a formatação.
- A CI da `main` só volta a passar quando este commit for enviado.
