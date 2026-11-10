### Concluída quando

- [x] `EmptyState`, `LoadingState`, `Skeleton`, `ErrorState` e `ProgressBar` existem em `src/empty-state`, `src/loading-state`, `src/error-state` e `src/progress-bar` e passam nos testes (RF-15).

  > Como comprovar: rodar a primeira linha da Verificação e ver todos os testes das quatro pastas aprovados, sem `failed` (`testes-estados.txt`).

- [x] O carregamento é anunciado com `aria-busy` e um texto para leitor de tela, e o esqueleto fica oculto da tecnologia assistiva (RF-15).

  > Como comprovar: em `testes-estados.txt`, ver aprovados `marks the region as busy`, `keeps aria-busy even when another value is passed` e `hides the skeleton from assistive technology`.

- [x] Cada componente passa no axe, e a nova tentativa do erro funciona por teclado (CT-09).

  > Como comprovar: em `testes-estados.txt`, ver aprovados todos os `has no axe violations` e `retries with the keyboard`.

- [x] Os textos próprios têm padrão em pt-br e podem ser trocados: `Carregando` no carregamento e o título e o botão `Tentar de novo` do erro (RF-19).

  > Como comprovar: em `testes-estados.txt`, ver aprovados `announces Carregando by default`, `accepts another label`, `uses the pt-BR texts by default` e `accepts overridden texts`.

- [x] Todo componente estende as props nativas do elemento raiz e repassa `className`, `style` e atributos `data-*` (RF-20, CT-13).

  > Como comprovar: em `testes-estados.txt`, ver aprovado `passes className, style and data attributes to the root` nas quatro pastas (e no `Skeleton`), e a checagem de tipos da Verificação não apontar nenhum erro nas pastas da tarefa.

- [x] O código passa no lint, no Prettier e na checagem de tipos, e os estilos não têm cor, medida, duração, peso de fonte, entrelinha nem camada (`z-index`) literal (RF-15, RF-20).

  > Como comprovar: a Verificação inteira termina com código 0, inclusive a busca de literais nos `*.module.css`, que não devolve nenhuma linha.

- [x] Os estados aparecem corretos nos temas claro e escuro (RF-15, CT-09).

  > Como comprovar: abrir `estados-temas.png` e conferir os dois temas, com o vazio, o carregando, o erro com foco no botão e as duas barras de progresso.
