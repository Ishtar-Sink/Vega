# TASK-13: Integração contínua

Arquivo gerado pelo vostok a cada mudança de estado; não edite.

- **Spec:** SPEC-001
- **Status:** done
- **Onda:** 2
- **Dependências:** TASK-01

## Arquivos

- [Execução](execucao.md): o que ler, mudar e os passos.
- [Verificação](verificacao.md): baseline, comandos e evidências.
- [Critérios](criterios.md): quando a tarefa está concluída.
- [Resumo executivo](executivo.md)
- [Detalhes técnicos](tecnico.md)
- [Registro](registro.md): etapas da execução e histórico de ajustes.

## Card

- **Título:** Integração contínua
- **Tipo:** tarefa
- **Descrição:** Cria a CI com lint, typecheck, testes e `pnpm audit`.
- **Critérios de aceite:**
  - [x] A CI roda lint, typecheck, testes e `pnpm audit --audit-level high` a cada push e pull request (RF-21).
  - [x] Uma falha de lint faz a CI falhar; sem ela, a CI passa (CT-14).
  - [x] O `pnpm audit` da CI não aceita vulnerabilidade alta ou crítica (RF-21).
- **Rótulos:** SPEC-001, padrao
- **Estimativa:** padrao
- **Bloqueada por:** TASK-01
