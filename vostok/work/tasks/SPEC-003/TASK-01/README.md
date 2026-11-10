# TASK-01: Dependências e entrada do Prose

Arquivo gerado pelo vostok a cada mudança de estado; não edite.

- **Spec:** SPEC-003
- **Status:** approved
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

- **Título:** Dependências e entrada do Prose
- **Tipo:** tarefa
- **Descrição:** Adiciona `lucide-react`, `react-markdown`, `remark-gfm` e `rehype-sanitize`, a entrada `./prose` no build e versiona o KT-001.
- **Critérios de aceite:**
  - [ ] As quatro dependências de runtime estão em `dependencies`, com as faixas decididas, e o React continua só como peer (RN-04, RF-27).
  - [ ] O pacote declara a entrada `@ishtar-sink/vega/prose`, com o JS e os tipos (RF-27, CT-24).
  - [ ] O build continua verde e não embute nem importa o parser de Markdown no índice principal (RNF-06, CT-24).
  - [ ] As dependências novas não trazem vulnerabilidade alta ou crítica (RN-04).
- **Rótulos:** SPEC-003, padrao
- **Estimativa:** padrao
- **Bloqueada por:** -
