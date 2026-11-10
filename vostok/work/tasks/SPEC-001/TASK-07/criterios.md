### Concluída quando

- [ ] `MoneyField`, `maskMoneyInput`, `parseMoneyInput` e `formatCents` existem em `src/money-field/` e trabalham sempre com centavos inteiros, e os testes passam (RF-12).

  > Como comprovar: em `dinheiro-testes.txt`, ver `Test Files  2 passed (2)`, com `✓` em `converts to integer cents` e `formats while typing and stores the same value in cents`.

- [ ] Com outro locale e outra moeda, os valores seguem o `Intl` desse locale e os textos recebidos continuam os passados (RF-19, CB-03, CT-12).

  > Como comprovar: em `dinheiro-locale.txt`, ver `3 passed` nos casos `cb03`; em `dinheiro-testes.txt`, ver `✓` em `ct12 keeps the label and error texts it receives in another locale`.

- [ ] O `MoneyField` estende as props do `TextField`, usa `valueCents` em `camelCase` e repassa `className`, `style`, `data-*` e `ref` ao `<input>` (RF-20, CT-13).

  > Como comprovar: em `dinheiro-testes.txt`, ver `✓` em `ct13 forwards className, style, data attributes and ref to the input`; e a Verificação sem `value_cents`.

- [ ] O campo passa no axe, funciona pelo teclado e mostra o erro com `role="alert"` (CT-09).

  > Como comprovar: em `dinheiro-testes.txt`, ver `✓` em `has no axe violations`, `reaches the field with Tab and types with the keyboard` e `sends null when everything is erased and shows the message`.

- [ ] O estilo usa só propriedades sem literal, o `TextField` da TASK-04 continua passando e nenhuma dependência de runtime foi acrescentada (RF-20, RNF-02, RNF-06).

  > Como comprovar: rodar a Verificação e ver os testes do `TextField`, o `grep` de literais e o `node -e` de `dependencies` terminarem sem erro.
