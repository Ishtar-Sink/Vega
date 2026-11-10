### Concluída quando

- [x] O `Switch` tem papel `switch`, com o nome acessível vindo do `label` e a ajuda ligada por `aria-describedby` (RF-03, CT-03).

  > Como comprovar: em `testes-switch.txt`, ver aprovados `has the switch role named by the label` e `links the help text by aria-describedby`.

- [x] Alterna por clique, Espaço, Enter e toque no rótulo, e não alterna quando desabilitado (RF-04, CT-03, CT-04, CB-01).

  > Como comprovar: em `testes-switch.txt`, ver aprovados `toggles on click`, `toggles with Space and Enter`, `toggles when the label is clicked` e `does not toggle when disabled`.

- [x] O estado aparece pela posição do botão, além da cor, e a área de toque tem 44 px (RN-03, RNF-02).

  > Como comprovar: em `testes-switch.txt`, ver aprovados `shows the state by the thumb position, not only the color` e `keeps a 44px touch target`; no print `switch-temas.png`, ver o botão em posições diferentes nos dois estados.

- [x] O `Switch` passa no axe e repassa as props nativas ao `button` (RNF-03, [project/code-style-03]).

  > Como comprovar: em `testes-switch.txt`, ver aprovados `has no axe violations` e `passes className, style, data attributes and ref to the button`.
