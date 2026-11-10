# TASK-05: Switch

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

- **Título:** Switch
- **Tipo:** historia
- **Descrição:** Cria o `Switch` com papel `switch`, rótulo, ajuda e teclado.
- **Critérios de aceite:**
  - [x] O `Switch` tem papel `switch`, com o nome acessível vindo do `label` e a ajuda ligada por `aria-describedby` (RF-03, CT-03).
  - [x] Alterna por clique, Espaço, Enter e toque no rótulo, e não alterna quando desabilitado (RF-04, CT-03, CT-04, CB-01).
  - [x] O estado aparece pela posição do botão, além da cor, e a área de toque tem 44 px (RN-03, RNF-02).
  - [x] O `Switch` passa no axe e repassa as props nativas ao `button` (RNF-03, [project/code-style-03]).
- **Rótulos:** SPEC-003, padrao
- **Estimativa:** padrao
- **Bloqueada por:** -
