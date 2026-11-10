### Concluída quando

- [ ] O `BrandLogo` recebe `name` e `mark` por prop e mostra a marca recebida, sem nenhum desenho do "A" do Atria no componente (RF-16, CT-10).

  > Como comprovar: na saída dos testes (`marca-itens-testes.txt`), ver passando `renders the mark it receives and the name` e `has no Atria mark fixed in the component`; no print `marca-e-itens.png`, o logo mostra o desenho próprio.

- [ ] O `ItemSwatch` usa a paleta recebida por `palette` e, sem ela, uma paleta padrão feita só de variáveis do tema (`--item-palette-*`), sem cor literal e sem `paletteFor` do Atria (RF-17, CT-11, CB-05).

  > Como comprovar: ver passando `uses the palette it receives`, `uses the default theme palette without a palette`, `derives the default palette from the theme tokens, without literal colors` e `points only to variables declared in tokens.css`; no print, o item com paleta própria aparece em verde-azulado e âmbar e os outros em roxo e ciano.

- [ ] O mesmo id gera o mesmo par de cores que gerava no Atria (RF-17).

  > Como comprovar: ver passando `returns the same pair for the same id` e `keeps the Atria pair for the same id`.

- [ ] O `Badge` mapeia cada tom de estado ao fundo `*Soft` correspondente e à cor cheia do tom no texto, com `primary` como padrão (RF-20, CT-13).

  > Como comprovar: ver passando `maps each tone to the soft background` e `uses the primary tone by default`; no print, os 7 selos aparecem com fundo suave e texto legível nos dois temas.

- [ ] `Badge`, `BrandLogo` e `ItemSwatch` estendem as props nativas do elemento e repassam `className`, `style`, atributos `data-*` e `ref` ao elemento raiz (RF-20, CT-13).

  > Como comprovar: ver passando os três testes `forwards className, style, data attributes and ref to the root ...`.

- [ ] Os três componentes passam no axe e os estilos usam só tokens, sem cor, `px` ou `ms` literal (RF-20, CT-13).

  > Como comprovar: ver passando os testes `has no axe violations` dos três arquivos e os testes `keeps the stylesheet free of literal colors, pixels and durations`; a Verificação termina com código 0, com o `grep` dos `*.module.css` sem nenhuma linha.

- [ ] O código passa no typecheck, no ESLint e no Prettier, e o tema da TASK-02 continua igual (RF-20).

  > Como comprovar: a Verificação termina com código 0; no baseline, a contagem dos testes de `src/theme` e o `sha256sum` dos arquivos do tema saem iguais antes e depois.
