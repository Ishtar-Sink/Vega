# TASK-11: FocusHeader

Arquivo gerado pelo vostok a cada mudança de estado; não edite.

- **Spec:** SPEC-003
- **Status:** done
- **Onda:** 3
- **Dependências:** TASK-02, TASK-04

## Arquivos

- [Execução](execucao.md): o que ler, mudar e os passos.
- [Verificação](verificacao.md): baseline, comandos e evidências.
- [Critérios](criterios.md): quando a tarefa está concluída.
- [Resumo executivo](executivo.md)
- [Detalhes técnicos](tecnico.md)
- [Registro](registro.md): etapas da execução e histórico de ajustes.

## Card

- **Título:** FocusHeader
- **Tipo:** historia
- **Descrição:** Cria o cabeçalho de fluxo guiado com sair, título, posição e progresso.
- **Critérios de aceite:**
  - [x] O botão de sair do `FocusHeader` tem o nome `Sair` por padrão, aceita outro nome por `labels` e chama `onExit` pelo clique e pelo teclado (RF-40, CT-37).
  - [x] O cabeçalho mostra o título, a posição e o `ProgressBar`, que são opcionais menos o título (RF-40, CT-37).
  - [x] O cabeçalho cabe numa linha a 360 px, com o título longo em reticências e o sair com 44 px (RF-40, CB-13, RNF-01, RNF-02).
  - [x] O `FocusHeader` passa no axe e repassa as props nativas ao `header` (RNF-03, [project/code-style-03]).
- **Rótulos:** SPEC-003, padrao
- **Estimativa:** padrao
- **Bloqueada por:** TASK-02, TASK-04
