# TASK-06: Campos de data e hora

Arquivo gerado pelo vostok a cada mudança de estado; não edite.

- **Spec:** SPEC-001
- **Status:** done
- **Onda:** 4
- **Dependências:** TASK-03

## Arquivos

- [Execução](execucao.md): o que ler, mudar e os passos.
- [Verificação](verificacao.md): baseline, comandos e evidências.
- [Critérios](criterios.md): quando a tarefa está concluída.
- [Resumo executivo](executivo.md)
- [Detalhes técnicos](tecnico.md)
- [Registro](registro.md): etapas da execução e histórico de ajustes.

## Card

- **Título:** Campos de data e hora
- **Tipo:** historia
- **Descrição:** Migra `Calendar`, `DateField`, `TimeField`, `DateTimeField` e `PeriodField`, com relógio injetável e `Intl`.
- **Critérios de aceite:**
  - [x] `Calendar`, `DateField`, `TimeField`, `DateTimeField` e `PeriodField`, com `parseTime`, `maskTime` e `resolvePeriod`, existem nas pastas `src/calendar`, `src/date-field`, `src/time-field`, `src/date-time-field` e `src/period-field` e passam nos testes (RF-11).
  - [x] Cada componente passa no axe e é operável por teclado: setas no calendário, Enter para abrir e escolher, Esc para fechar com o foco de volta ao gatilho (CT-09).
  - [x] Todo texto visível é prop com padrão em pt-br, e datas saem no locale recebido, com os textos padrão mantidos em pt-br quando só o locale muda (RF-19, CT-12, CB-03).
  - [x] Todo componente estende as props nativas e repassa `className`, `style`, `ref` e atributos `data-*`: nos campos, ao controle (campo de texto, botão gatilho ou grupo); no calendário, ao elemento raiz (RF-20, CT-13).
  - [x] Os testes de data não dependem da data nem do fuso da máquina: o dia atual é injetado e os períodos são calculados a partir dele (CT-16).
  - [x] Os presets do `PeriodField` são definidos no uso, por um inteiro de dias ou por uma função que devolve o intervalo, sem lista fixa no componente (RF-11).
  - [x] O código passa no lint, no Prettier e na checagem de tipos, e os estilos não têm cor, medida, duração, peso de fonte, entrelinha nem camada (`z-index`) literal fora das condições de `@media` (RF-20).
  - [x] Os componentes aparecem corretos nos temas claro e escuro, com foco visível e estados distinguíveis (RF-11, CT-09).
- **Rótulos:** SPEC-001, padrao
- **Estimativa:** padrao
- **Bloqueada por:** TASK-03
