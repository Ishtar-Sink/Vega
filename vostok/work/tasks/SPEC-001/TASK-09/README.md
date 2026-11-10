# TASK-09: Diálogos e avisos

Arquivo gerado pelo vostok a cada mudança de estado; não edite.

- **Spec:** SPEC-001
- **Status:** approved
- **Onda:** 4
- **Dependências:** TASK-03

## Arquivos

- [Execução](execucao.md): o que ler, mudar e os passos.
- [Verificação](verificacao.md): baseline, comandos e evidências.
- [Critérios](criterios.md): quando a tarefa está concluída.
- [Resumo executivo](executivo.md)
- [Detalhes técnicos](tecnico.md)
- [Registro](registro.md): etapas da execução e histórico de ajustes.

## Card

- **Título:** Diálogos e avisos
- **Tipo:** historia
- **Descrição:** Migra `Dialog`, `ConfirmDialog`, `Toast` e `ToastRegion` com o `<dialog>` nativo.
- **Critérios de aceite:**
  - [ ] `Dialog`, `ConfirmDialog`, `Toast` e `ToastRegion` existem em `src/dialog`, `src/confirm-dialog` e `src/toast` e passam nos testes (RF-14).
  - [ ] O diálogo usa o elemento `<dialog>` nativo, aberto com `showModal()`, e fecha o elemento nativo ao sair (RF-14).
  - [ ] Os diálogos passam no axe e funcionam por teclado: foco inicial, Tab preso dentro do diálogo, Esc fecha, Enter confirma e o foco volta ao botão que abriu (CT-09).
  - [ ] Os textos próprios têm padrão em pt-br e podem ser trocados: `Confirmar` e `Cancelar` na confirmação e o nome do tom do aviso (RF-19, CT-12).
  - [ ] O tom do aviso não depende só da cor: cada tom tem um ícone e um nome lido pelo leitor de tela (RF-14).
  - [ ] Todo componente estende as props nativas do elemento raiz e repassa `className`, `style` e atributos `data-*` (RF-20, CT-13).
  - [ ] O código passa no lint, no Prettier e na checagem de tipos, e os estilos não têm cor, medida, duração, peso de fonte, entrelinha nem camada (`z-index`) literal (RF-14, RF-20).
  - [ ] Os diálogos e avisos aparecem corretos nos temas claro e escuro (RF-14, CT-09).
- **Rótulos:** SPEC-001, padrao
- **Estimativa:** padrao
- **Bloqueada por:** TASK-03
