### Concluída quando

- [x] `Button`, `IconButton` e `MenuButton` existem em `src/button/`, `src/icon-button/` e `src/menu-button/`, cada um com `.tsx`, `.module.css` e `.test.tsx`, e os testes passam (RF-09).

  > Como comprovar: em `acoes-testes.txt`, ver `Test Files  3 passed (3)` e nenhum `×`.

- [x] Os três componentes estendem as props nativas e repassam `className`, `style`, `data-*` e `ref` ao elemento raiz (RF-20, CT-13).

  > Como comprovar: em `acoes-testes.txt`, ver `✓` nas três linhas `ct13 forwards className, style, data attributes and ref ...` e em `ct13 keeps the custom style together with the tint`.

- [x] O `IconButton` exige `aria-label` no tipo das props e não aceita texto (CT-09).

  > Como comprovar: em `acoes-testes.txt`, ver `✓` em `requires aria-label and refuses children in the props type`, e a Verificação sem erro de tipo nas três pastas (um `@ts-expect-error` não consumido viraria erro).

- [x] Os três componentes passam no axe e funcionam pelo teclado (CT-09).

  > Como comprovar: em `acoes-testes.txt`, ver `✓` em `has no axe violations` nos três e nos casos de teclado (`activates with Enter and Space from the keyboard`, `activates with the keyboard`, `moves with the arrow keys and closes on Escape returning focus`, `selects an item with Enter, calls onSelect and returns focus to the trigger`).

- [x] O `Button` usa a cor de `--primary` sobrescrita num contêiner, sem rebuild (CT-06).

  > Como comprovar: em `acoes-marca-primary.txt`, ver `✓` no caso `ct06` e `1 passed`; no print `acoes-temas.png`, ver o botão do contêiner em laranja e os demais na cor do tema.

- [x] Os estilos dos três componentes usam só tokens do tema e nenhuma dependência de runtime foi acrescentada (RF-20, RNF-02, RNF-06).

  > Como comprovar: rodar a Verificação e ver o `grep` de literais e o `node -e` de `dependencies` terminarem sem erro.
