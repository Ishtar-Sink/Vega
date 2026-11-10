# TASK-05: Publicação da 0.3.0

Arquivo gerado pelo vostok a cada mudança de estado; não edite.

- **Spec:** SPEC-004
- **Status:** done
- **Onda:** 3
- **Dependências:** TASK-04

## Arquivos

- [Execução](execucao.md): o que ler, mudar e os passos.
- [Verificação](verificacao.md): baseline, comandos e evidências.
- [Critérios](criterios.md): quando a tarefa está concluída.
- [Resumo executivo](executivo.md)
- [Detalhes técnicos](tecnico.md)
- [Registro](registro.md): etapas da execução e histórico de ajustes.

## Card

- **Título:** Publicação da 0.3.0
- **Tipo:** tarefa
- **Descrição:** Sobe a versão, escreve o CHANGELOG e o README e publica a 0.3.0 pela tag `v0.3.0`.
- **Critérios de aceite:**
  - [x] O `package.json` está na 0.3.0 e o `CHANGELOG.md` tem a entrada `[0.3.0]` com os quatro grupos, os motivos e todos os componentes, utilitários e props novos (RF-20, CT-15).
  - [x] O `README.md` descreve os componentes e utilitários novos e traz a seção "Tempo e conexão" com um exemplo de imports que existem no pacote (RF-20, CT-15).
  - [x] Os passos do workflow de publicação passam localmente com a tag `v0.3.0` (RF-20).
  - [x] A versão 0.3.0 está publicada no npm como `latest`, com provenance, pelo workflow da tag (RF-20, CT-15).
- **Rótulos:** SPEC-004, julgamento
- **Estimativa:** julgamento
- **Bloqueada por:** TASK-04
