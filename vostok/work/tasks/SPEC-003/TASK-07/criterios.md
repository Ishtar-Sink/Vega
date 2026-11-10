### Concluída quando

- [ ] O `TextAreaField` tem rótulo, ajuda e erro com as regras do `TextField`, com o erro em `role="alert"` (RF-10, CT-10).

  > Como comprovar: em `testes-textarea.txt`, ver aprovados `is named by the label` e `marks the error with role alert and aria-invalid`.

- [ ] O `autoResize` cresce com o conteúdo e para no `maxRows` (RF-11, CT-11, CB-04).

  > Como comprovar: em `testes-textarea.txt`, ver aprovados `grows with the content up to maxRows`, `keeps minRows when empty` e `keeps the rows prop without autoResize`.

- [ ] O contador é lido junto do campo e não é anunciado a cada tecla (RF-12, CT-12).

  > Como comprovar: em `testes-textarea.txt`, ver aprovados `links help, counter and error by aria-describedby` e `does not announce the counter on every key`.

- [ ] O campo cabe no contêiner, passa no axe e tem a entrelinha de leitura (RNF-01, RNF-03).

  > Como comprovar: em `testes-textarea.txt`, ver aprovados `has no axe violations`, `uses the relaxed line height` e a regressão de `box-sizing`; no print `textarea-temas.png`, ver os campos dentro do painel de 360 px.
