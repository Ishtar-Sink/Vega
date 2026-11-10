# TASK-04: Índice público da 0.3.0

Arquivo gerado pelo vostok a cada mudança de estado; não edite.

- **Spec:** SPEC-004
- **Status:** approved
- **Onda:** 2
- **Dependências:** TASK-01, TASK-02, TASK-03

## Arquivos

- [Execução](execucao.md): o que ler, mudar e os passos.
- [Verificação](verificacao.md): baseline, comandos e evidências.
- [Critérios](criterios.md): quando a tarefa está concluída.
- [Resumo executivo](executivo.md)
- [Detalhes técnicos](tecnico.md)
- [Registro](registro.md): etapas da execução e histórico de ajustes.

## Card

- **Título:** Índice público da 0.3.0
- **Tipo:** tarefa
- **Descrição:** Exporta os três componentes, os dois utilitários e os tipos pelo `src/index.ts`, com a suíte inteira e o build verdes.
- **Critérios de aceite:**
  - [ ] O índice exporta `Timer`, `Countdown`, `ConnectionStatus`, `formatDuration`, `daysBetween` e os 10 tipos públicos, e nada além da lista (RF-19, CT-14).
  - [ ] Os dois utilitários funcionam pelo pacote gerado (RF-19, CT-14).
  - [ ] Com os componentes da 0.3.0 juntos, a suíte inteira e o lint passam (RF-19).
  - [ ] O código gerado não faz requisição de rede nem tem URL externa (RNF-08).
- **Rótulos:** SPEC-004, padrao
- **Estimativa:** padrao
- **Bloqueada por:** TASK-01, TASK-02, TASK-03
