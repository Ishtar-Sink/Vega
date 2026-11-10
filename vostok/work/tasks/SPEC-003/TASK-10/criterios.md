### Concluída quando

- [x] O `CardLink` é um `<a>` e o `CardButton` é um `<button>` de verdade, com o cartão inteiro como um único alvo (RF-39, CT-36).

  > Como comprovar: em `testes-cartoes.txt`, ver aprovados `renders CardLink as a real link`, `renders CardButton as a real button of type button` e `makes the whole card a single target`.

- [x] Os dois têm hover, foco visível e pressionado, e funcionam pelo teclado (RF-39, CT-36).

  > Como comprovar: em `testes-cartoes.txt`, ver aprovados `shows hover, visible focus and pressed states` e `activates CardButton with Enter and Space`; no print `cartoes-interativos.png`, ver o anel de foco.

- [x] Os cartões seguem o visual e o tom do `Card` sem mudá-lo, com alvo de 44 px, e passam no axe (RNF-02, RNF-03).

  > Como comprovar: em `testes-cartoes.txt`, ver aprovados `applies the card tone`, `keeps a 44px touch target and stays inside its container` e `has no axe violations`; o último comando da Verificação (`pnpm vitest run src/card`) passa.
