### Concluída quando

- [ ] O botão de sair do `FocusHeader` tem o nome `Sair` por padrão, aceita outro nome por `labels` e chama `onExit` pelo clique e pelo teclado (RF-40, CT-37).

  > Como comprovar: em `testes-focus-header.txt`, ver aprovados `names the exit button Sair by default`, `accepts another exit label` e `calls onExit on click and with the keyboard`.

- [ ] O cabeçalho mostra o título, a posição e o `ProgressBar`, que são opcionais menos o título (RF-40, CT-37).

  > Como comprovar: em `testes-focus-header.txt`, ver aprovados `shows the title, the position and the progress bar` e `renders without position and progress`.

- [ ] O cabeçalho cabe numa linha a 360 px, com o título longo em reticências e o sair com 44 px (RF-40, CB-13, RNF-01, RNF-02).

  > Como comprovar: no print `focus-header-360.png`, ver os três cabeçalhos numa linha; em `testes-focus-header.txt`, ver aprovados `truncates a long title on one line` e `keeps a 44px exit target`.

- [ ] O `FocusHeader` passa no axe e repassa as props nativas ao `header` (RNF-03, [project/code-style-03]).

  > Como comprovar: em `testes-focus-header.txt`, ver aprovados `has no axe violations` e `passes className, style, data attributes and ref to the header`.
