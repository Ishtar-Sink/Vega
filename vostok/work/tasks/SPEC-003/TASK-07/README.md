# TASK-07: TextAreaField

Arquivo gerado pelo vostok a cada mudança de estado; não edite.

- **Spec:** SPEC-003
- **Status:** done
- **Onda:** 1
- **Dependências:** -

## Arquivos

- [Execução](execucao.md): o que ler, mudar e os passos.
- [Verificação](verificacao.md): baseline, comandos e evidências.
- [Critérios](criterios.md): quando a tarefa está concluída.
- [Resumo executivo](executivo.md)
- [Detalhes técnicos](tecnico.md)
- [Registro](registro.md): etapas da execução e histórico de ajustes.

## Card

- **Título:** TextAreaField
- **Tipo:** historia
- **Descrição:** Cria o `TextAreaField` com `autoResize` e contador.
- **Critérios de aceite:**
  - [x] O `TextAreaField` tem rótulo, ajuda e erro com as regras do `TextField`, com o erro em `role="alert"` (RF-10, CT-10).
  - [x] O `autoResize` cresce com o conteúdo e para no `maxRows` (RF-11, CT-11, CB-04).
  - [x] O contador é lido junto do campo e não é anunciado a cada tecla (RF-12, CT-12).
  - [x] O campo cabe no contêiner, passa no axe e tem a entrelinha de leitura (RNF-01, RNF-03).
- **Rótulos:** SPEC-003, padrao
- **Estimativa:** padrao
- **Bloqueada por:** -
