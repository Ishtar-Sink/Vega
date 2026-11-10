### Concluída quando

- [ ] O `BottomSheet` usa o `<dialog>` nativo com `showModal()`, com título, descrição, conteúdo rolável e rodapé fixo (RF-19, CT-18).

  > Como comprovar: em `testes-bottom-sheet.txt`, ver aprovados `opens with the native showModal and names the dialog by the title` e `keeps the footer outside the scrolling body`.

- [ ] Fecha por Esc, pelo fundo e pelo botão `Fechar` (texto trocável), prende o Tab e devolve o foco a quem abriu, inclusive quando o pai fecha (RF-20, CB-07, RN-02).

  > Como comprovar: em `testes-bottom-sheet.txt`, ver aprovados `closes on Escape, on the backdrop and on the close button`, `returns focus to the trigger`, `traps Tab inside the sheet`, `closes when open turns false from outside` e `uses Fechar by default and accepts another close label`.

- [ ] Fica embaixo abaixo de 720 px e na lateral a partir de 720 px no `auto`, e `bottom` e `side` fixam a posição (RF-21, CT-19).

  > Como comprovar: em `testes-bottom-sheet.txt`, ver aprovados `applies the placement class` e `moves to the side from 720 px in auto`; no print `bottom-sheet-temas.png`, as duas posições.

- [ ] Respeita a área segura, o botão de fechar tem pelo menos 44 px e a entrada some com movimento reduzido (RNF-02, RNF-04).

  > Como comprovar: em `testes-bottom-sheet.txt`, ver aprovados `respects the safe area at the bottom`, `keeps the close button at least 44 px` e `enters with motion tokens and appears at once with reduced motion`.

- [ ] Passa no axe e repassa as props nativas ao `<dialog>` (RNF-03).

  > Como comprovar: em `testes-bottom-sheet.txt`, ver aprovados `has no axe violations` e `passes className, style, data attributes and ref to the dialog`.

- [ ] O código passa no lint, no Prettier e na checagem de tipos, os estilos não têm literal e cada arquivo de produção tem até 200 linhas (RNF-08).

  > Como comprovar: a Verificação inteira termina com código 0, e `linhas-bottom-sheet.txt` termina com "OK: arquivos de produção com até 200 linhas".

- [ ] O `BottomSheet` aparece correto nos temas claro e escuro, embaixo a 390 px e na lateral a 820 px (RNF-01).

  > Como comprovar: abrir `bottom-sheet-temas.png` e conferir os quatro quadros, com o fundo escurecido e o rodapé fixo.
