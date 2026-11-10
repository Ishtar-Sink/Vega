<!-- Escrito no planejamento com o que a tarefa vai fazer e enriquecido na conclusão com o que foi feito. -->

## Abordagem

TDD, como na TASK-15 da SPEC-003: o `src/index.test.ts` ganha os nomes novos e falha; depois o `src/index.ts`. O formato segue o índice atual: um `export` e um `export type` por módulo, sem `export *`, e o teste confere a lista exata das chaves. A verificação roda também a suíte inteira, o build e a busca de rede, porque é a tarefa de integração da spec.

## Superfície nova

- Valores (5): `Timer` (`src/timer/timer.tsx`), `formatDuration` (`src/timer/timer.utils.ts`), `Countdown` (`src/countdown/countdown.tsx`), `daysBetween` (`src/countdown/countdown.utils.ts`), `ConnectionStatus` (`src/connection-status/connection-status.tsx`).
- Tipos (10): `TimerProps`, `TimerCountdownProps`, `TimerElapsedProps`, `TimerLabels`, `DurationParts` (`src/timer/timer.types.ts`); `CountdownProps`, `CountdownLabels` (`src/countdown/countdown.types.ts`); `ConnectionStatusProps`, `ConnectionStatusLabels`, `ConnectionState` (`src/connection-status/connection-status.types.ts`).
- Contagem esperada: 122 + 5 = 127 valores, e 132 testes no arquivo (127 nomes, mais superfície exata, paleta do Atria, `Prose` fora e tipos). O passo 1 acrescenta o que as tarefas de componente registrarem a mais.
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
- `index.ts` tem 176 linhas e ganha cerca de 8: continua abaixo do limite de 200 (RNF-07).

## Referências da spec

RF-19, CT-14, RNF-07, RNF-08; "Contratos e interfaces" (lista do índice); [project/architecture-03], [project/security-01].

## Arquivos em comum na onda

Onda 2 só tem esta tarefa: nenhum arquivo em comum. Ela só lê os arquivos que a onda 1 cria (`src/timer/`, `src/countdown/`, `src/connection-status/`).
