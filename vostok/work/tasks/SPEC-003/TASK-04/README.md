# TASK-04: ProgressBar com valueText e indeterminado

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

- **Título:** ProgressBar com valueText e indeterminado
- **Tipo:** historia
- **Descrição:** Acrescenta `valueText` e `indeterminate` ao `ProgressBar`.
- **Critérios de aceite:**
  - [x] O `ProgressBar` mostra o `valueText` e o aplica em `aria-valuetext` (RF-37, CT-34).
  - [x] O modo indeterminado não anuncia valor e ignora o `value` recebido (RF-38, CT-35, CB-12).
  - [x] A animação indeterminada usa `--motion-*` e para com movimento reduzido (RF-38, RNF-04).
  - [x] O comportamento atual do `ProgressBar` não muda, e o arquivo de produção fica com até 200 linhas (RNF-08).
- **Rótulos:** SPEC-003, padrao
- **Estimativa:** padrao
- **Bloqueada por:** -
