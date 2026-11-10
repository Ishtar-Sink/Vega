# TASK-16: Publicação da 0.2.0

Arquivo gerado pelo vostok a cada mudança de estado; não edite.

- **Spec:** SPEC-003
- **Status:** done
- **Onda:** 5
- **Dependências:** TASK-15

## Arquivos

- [Execução](execucao.md): o que ler, mudar e os passos.
- [Verificação](verificacao.md): baseline, comandos e evidências.
- [Critérios](criterios.md): quando a tarefa está concluída.
- [Resumo executivo](executivo.md)
- [Detalhes técnicos](tecnico.md)
- [Registro](registro.md): etapas da execução e histórico de ajustes.

## Card

- **Título:** Publicação da 0.2.0
- **Tipo:** tarefa
- **Descrição:** Escreve o CHANGELOG e o README da 0.2.0, sobe a versão e publica pela tag `v0.2.0`.
- **Critérios de aceite:**
  - [x] O `package.json` está na 0.2.0 e o `CHANGELOG.md` tem a entrada `[0.2.0]` com os quatro grupos, os motivos e todos os componentes, ícones e props novos (RF-42).
  - [x] O `README.md` descreve os componentes novos, os ícones com a licença do Lucide e a entrada `@ishtar-sink/vega/prose`, com imports que existem no pacote (RF-42).
  - [x] Os passos do workflow de publicação passam localmente com a tag `v0.2.0` (RF-42, RN-06).
  - [x] A versão 0.2.0 está publicada no npm como `latest`, com provenance, pelo workflow da tag (RF-42, CT-39).
- **Rótulos:** SPEC-003, julgamento
- **Estimativa:** julgamento
- **Bloqueada por:** TASK-15
