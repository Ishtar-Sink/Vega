# TASK-12: BottomSheet

Arquivo gerado pelo vostok a cada mudança de estado; não edite.

- **Spec:** SPEC-003
- **Status:** done
- **Onda:** 3
- **Dependências:** TASK-02

## Arquivos

- [Execução](execucao.md): o que ler, mudar e os passos.
- [Verificação](verificacao.md): baseline, comandos e evidências.
- [Critérios](criterios.md): quando a tarefa está concluída.
- [Resumo executivo](executivo.md)
- [Detalhes técnicos](tecnico.md)
- [Registro](registro.md): etapas da execução e histórico de ajustes.

## Card

- **Título:** BottomSheet
- **Tipo:** historia
- **Descrição:** Cria o `BottomSheet` sobre o `<dialog>` nativo, com posição automática em 720 px.
- **Critérios de aceite:**
  - [x] O `BottomSheet` usa o `<dialog>` nativo com `showModal()`, com título, descrição, conteúdo rolável e rodapé fixo (RF-19, CT-18).
  - [x] Fecha por Esc, pelo fundo e pelo botão `Fechar` (texto trocável), prende o Tab e devolve o foco a quem abriu, inclusive quando o pai fecha (RF-20, CB-07, RN-02).
  - [x] Fica embaixo abaixo de 720 px e na lateral a partir de 720 px no `auto`, e `bottom` e `side` fixam a posição (RF-21, CT-19).
  - [x] Respeita a área segura, o botão de fechar tem pelo menos 44 px e a entrada some com movimento reduzido (RNF-02, RNF-04).
  - [x] Passa no axe e repassa as props nativas ao `<dialog>` (RNF-03).
  - [x] O código passa no lint, no Prettier e na checagem de tipos, os estilos não têm literal e cada arquivo de produção tem até 200 linhas (RNF-08).
  - [x] O `BottomSheet` aparece correto nos temas claro e escuro, embaixo a 390 px e na lateral a 820 px (RNF-01).
- **Rótulos:** SPEC-003, padrao
- **Estimativa:** padrao
- **Bloqueada por:** TASK-02
