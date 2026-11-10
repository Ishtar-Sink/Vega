### Concluída quando

- [ ] `TextField`, `SelectField`, `Checkbox`, `SegmentedField`, `Autocomplete` e `TagField` existem nas próprias pastas, cada um com `.tsx`, `.module.css` e `.test.tsx`, e os testes passam (RF-10).

  > Como comprovar: em `campos-testes.txt`, ver `Test Files  6 passed (6)` e nenhum `×`.

- [ ] Os seis campos estendem as props nativas e repassam `className`, `style`, `data-*` e `ref` ao controle nativo (RF-20, CT-13).

  > Como comprovar: em `campos-testes.txt`, ver `✓` nas seis linhas `ct13 forwards className, style, data attributes and ref ...`.

- [ ] Os seis campos passam no axe, funcionam pelo teclado e mostram o erro com `role="alert"` ligado ao campo por `aria-describedby` (CT-09).

  > Como comprovar: em `campos-testes.txt`, ver `✓` em `has no axe violations` nos seis, nos casos de teclado e em `shows the error with role alert ...` do `TextField`, do `SelectField`, do `SegmentedField` e do `Autocomplete`.

- [ ] Os textos visíveis do `Autocomplete` e do `TagField` são props com padrão em pt-br, e as props ficam em `camelCase` (RF-19, CT-12).

  > Como comprovar: em `campos-textos-padrao.txt`, ver `4 passed` com `uses the pt-br default texts` e `ct12 shows the overridden texts`; e a Verificação sem `empty_text`, `list_label` ou `remove_label`.

- [ ] Os estilos dos seis campos usam só tokens do tema e nenhuma dependência de runtime foi acrescentada (RF-20, RNF-02, RNF-06).

  > Como comprovar: rodar a Verificação e ver o `grep` de literais e o `node -e` de `dependencies` terminarem sem erro.
