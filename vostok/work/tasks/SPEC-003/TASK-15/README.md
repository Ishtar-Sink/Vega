# TASK-15: Índice público da 0.2.0

Arquivo gerado pelo vostok a cada mudança de estado; não edite.

- **Spec:** SPEC-003
- **Status:** approved
- **Onda:** 4
- **Dependências:** TASK-02, TASK-03, TASK-04, TASK-05, TASK-06, TASK-07, TASK-08, TASK-09, TASK-10, TASK-11, TASK-12, TASK-13, TASK-14

## Arquivos

- [Execução](execucao.md): o que ler, mudar e os passos.
- [Verificação](verificacao.md): baseline, comandos e evidências.
- [Critérios](criterios.md): quando a tarefa está concluída.
- [Resumo executivo](executivo.md)
- [Detalhes técnicos](tecnico.md)
- [Registro](registro.md): etapas da execução e histórico de ajustes.

## Card

- **Título:** Índice público da 0.2.0
- **Tipo:** tarefa
- **Descrição:** Registra os componentes novos e os tipos no `src/index.ts`, sem o `Prose`.
- **Critérios de aceite:**
  - [ ] O índice exporta todos os componentes novos, os ícones e os tipos das props, e nada além da lista (RF-41, CT-38).
  - [ ] O `Prose` fica fora do índice e sai só em `@ishtar-sink/vega/prose` (RF-41, RNF-06).
  - [ ] Com todos os componentes da 0.2.0 juntos, a suíte inteira e o lint passam (RNF-03).
  - [ ] O código gerado não faz requisição de rede nem tem URL externa (RNF-09).
- **Rótulos:** SPEC-003, padrao
- **Estimativa:** padrao
- **Bloqueada por:** TASK-02, TASK-03, TASK-04, TASK-05, TASK-06, TASK-07, TASK-08, TASK-09, TASK-10, TASK-11, TASK-12, TASK-13, TASK-14
