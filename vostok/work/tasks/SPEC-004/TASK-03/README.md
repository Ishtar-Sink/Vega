# TASK-03: ConnectionStatus

Arquivo gerado pelo vostok a cada mudança de estado; não edite.

- **Spec:** SPEC-004
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

- **Título:** ConnectionStatus
- **Tipo:** tarefa
- **Descrição:** Cria o `ConnectionStatus` com os cinco estados, as variantes `chip` e `detail`, o progresso, a fila e o tempo relativo.
- **Critérios de aceite:**
  - [x] Os estados `offline`, `syncing`, `synced` e `error` aparecem com o ícone do estado, a palavra e o fundo suave do tom (`warning`, `info`, `success`, `danger`), nunca só pela cor (RF-13, CT-10).
  - [x] O estado `online` não renderiza nada na variante `chip` e mostra a palavra `Online` (ou a de `labels`) na variante `detail` (RF-14, CT-10).
  - [x] A região `role="status"` anuncia a troca de estado, e o texto completo (progresso, tempo relativo e fila) fica fora dela, lido na navegação normal e sem ser anunciado a cada item (RF-15, RF-16, CT-11).
  - [x] O progresso aparece no estado `syncing`, e com total zero o texto fica sem progresso (RF-16, CB-06).
  - [x] A fila aparece com o texto de `labels.pending`, e a última sincronização aparece como tempo relativo calculado sobre o `now` injetado, com o futuro tratado como agora (RF-16, CT-12, CB-07).
  - [x] Com `action`, a caixa inteira é um botão discreto, com o texto da ação no tom do estado e sublinhado, sem botão preenchido, nas duas variantes, e a região `role="status"` fica fora do botão (RF-17, CT-16).
  - [x] Os cinco estados passam no axe nas duas variantes, e os tons passam em AA nos dois temas (RNF-03, RNF-05, CT-10).
  - [x] A troca de estado usa só `--motion-fast` e não há animação contínua (RNF-04).
  - [x] O código passa no lint, no Prettier e na checagem de tipos, os estilos não têm literal e cada arquivo de produção tem até 200 linhas (RNF-07).
  - [x] O `ConnectionStatus` aparece correto nos temas claro e escuro e a 360 px, com os cinco estados nas variantes `chip` e `detail` (RF-13, RF-14, RNF-01).
- **Rótulos:** SPEC-004, padrao
- **Estimativa:** padrao
- **Bloqueada por:** -
