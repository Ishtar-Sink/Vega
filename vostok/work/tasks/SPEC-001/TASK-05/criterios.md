### Concluída quando

- [ ] `ColorField`, `ColorPicker` e as funções `hexToRgb`, `rgbToHex`, `hslToRgb` e `rgbToHsl` existem em `src/color-field/`, e os testes passam (RF-10).

  > Como comprovar: em `cor-testes.txt`, ver `Test Files  3 passed (3)` e nenhum `×`.

- [ ] O `ColorField` e o `ColorPicker` estendem as props nativas e repassam `className`, `style`, `data-*` e `ref` (RF-20, CT-13).

  > Como comprovar: em `cor-testes.txt`, ver `✓` nas duas linhas `ct13 forwards className, style, data attributes and ref ...`.

- [ ] Todos os textos do campo e do seletor são props com padrão em pt-br, inclusive o valor da roda lido pelo leitor de tela (RF-19, CT-12).

  > Como comprovar: em `cor-testes.txt`, ver `✓` em `uses the pt-br default labels...` e em `ct12 shows the overridden labels` nos dois arquivos de componente; e a Verificação sem "graus" fixo no código.

- [ ] O campo de cor passa no axe, abre e aplica pelo teclado e mostra o erro com `role="alert"` ligado ao gatilho (CT-09).

  > Como comprovar: em `cor-testes.txt`, ver `✓` nos dois `has no axe violations`, em `opens with the keyboard and applies with Enter on Aplicar` e em `shows the error with role alert linked to the trigger`.

- [ ] O estilo usa só tokens do tema, o `Button` da TASK-03 continua passando e nenhuma dependência de runtime foi acrescentada (RF-20, RNF-02, RNF-06).

  > Como comprovar: rodar a Verificação e ver os testes do `Button`, o `grep` de literais e o `node -e` de `dependencies` terminarem sem erro.
