### Concluída quando

- [x] `Dialog`, `ConfirmDialog`, `Toast` e `ToastRegion` existem em `src/dialog`, `src/confirm-dialog` e `src/toast` e passam nos testes (RF-14).

  > Como comprovar: rodar a primeira linha da Verificação e ver todos os testes das três pastas aprovados, sem `failed` (`testes-dialogos.txt`).

- [x] O diálogo usa o elemento `<dialog>` nativo, aberto com `showModal()`, e fecha o elemento nativo ao sair (RF-14).

  > Como comprovar: em `testes-dialogos.txt`, ver aprovados `opens with the native showModal` e `closes the native dialog on unmount`.

- [x] Os diálogos passam no axe e funcionam por teclado: foco inicial, Tab preso dentro do diálogo, Esc fecha, Enter confirma e o foco volta ao botão que abriu (CT-09).

  > Como comprovar: em `testes-dialogos.txt`, ver aprovados `has no axe violations`, `traps Tab inside the dialog`, `routes Escape to onClose without closing by itself`, `confirms with the keyboard` e `returns focus to the trigger`.

- [x] Os textos próprios têm padrão em pt-br e podem ser trocados: `Confirmar` e `Cancelar` na confirmação e o nome do tom do aviso (RF-19, CT-12).

  > Como comprovar: em `testes-dialogos.txt`, ver aprovados `uses Confirmar and Cancelar by default`, `accepts overridden labels` e `accepts another tone name`.

- [x] O tom do aviso não depende só da cor: cada tom tem um ícone e um nome lido pelo leitor de tela (RF-14).

  > Como comprovar: em `testes-dialogos.txt`, ver aprovado `marks the tone with an icon and a hidden name, not only the color`; no print `dialogos-temas.png`, os quatro avisos têm ícones diferentes.

- [x] Todo componente estende as props nativas do elemento raiz e repassa `className`, `style` e atributos `data-*` (RF-20, CT-13).

  > Como comprovar: em `testes-dialogos.txt`, ver aprovados `passes className, style and data attributes to the dialog` e `... to the root`, e a checagem de tipos da Verificação não apontar nenhum erro nas pastas da tarefa.

- [x] O código passa no lint, no Prettier e na checagem de tipos, e os estilos não têm cor, medida, duração, peso de fonte, entrelinha nem camada (`z-index`) literal (RF-14, RF-20).

  > Como comprovar: a Verificação inteira termina com código 0, inclusive a busca de literais nos `*.module.css`, que não devolve nenhuma linha.

- [x] Os diálogos e avisos aparecem corretos nos temas claro e escuro (RF-14, CT-09).

  > Como comprovar: abrir `dialogos-temas.png` e conferir os dois temas, com o fundo escurecido do diálogo, o foco visível e os quatro tons de aviso.
