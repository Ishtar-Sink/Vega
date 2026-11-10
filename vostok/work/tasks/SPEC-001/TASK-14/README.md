# TASK-14: Publicação da 0.1.0

Arquivo gerado pelo vostok a cada mudança de estado; não edite.

- **Spec:** SPEC-001
- **Status:** done
- **Onda:** 6
- **Dependências:** TASK-12, TASK-13

## Arquivos

- [Execução](execucao.md): o que ler, mudar e os passos.
- [Verificação](verificacao.md): baseline, comandos e evidências.
- [Critérios](criterios.md): quando a tarefa está concluída.
- [Resumo executivo](executivo.md)
- [Detalhes técnicos](tecnico.md)
- [Registro](registro.md): etapas da execução e histórico de ajustes.

## Card

- **Título:** Publicação da 0.1.0
- **Tipo:** tarefa
- **Descrição:** Cria o fluxo de publicação com provenance, o `CHANGELOG.md`, atualiza o `README.md` e publica a 0.1.0 pela CI.
- **Critérios de aceite:**
  - [x] O fluxo de publicação dispara numa tag de versão e publica no npm com provenance, só pela CI (RF-22).
  - [x] A versão 0.1.0 está publicada no npm, com provenance, pelo workflow da tag (RF-22, RF-23, CT-15).
  - [x] O `CHANGELOG.md` tem a entrada da 0.1.0 com os quatro grupos, os motivos, os componentes e tokens afetados e a migração do `@atria/ui` (RF-23).
  - [x] O `README.md` não tem o aviso "Em desenvolvimento" e descreve instalação e estilos que existem no pacote (RF-23).
  - [x] A identidade nova (comentário de origem, `itemPalette`, `fontWeights`, `lineHeights`, `zIndices`, `--deep-gradient`) foi levada ao documento da organização (RF-23).
- **Rótulos:** SPEC-001, julgamento
- **Estimativa:** julgamento
- **Bloqueada por:** TASK-12, TASK-13
