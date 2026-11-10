### Concluída quando

- [ ] `Calendar`, `DateField`, `TimeField`, `DateTimeField` e `PeriodField`, com `parseTime`, `maskTime` e `resolvePeriod`, existem nas pastas `src/calendar`, `src/date-field`, `src/time-field`, `src/date-time-field` e `src/period-field` e passam nos testes (RF-11).

  > Como comprovar: rodar a primeira linha da Verificação e ver todos os testes das cinco pastas aprovados, sem `failed` (`testes-data-hora.txt`).

- [ ] Cada componente passa no axe e é operável por teclado: setas no calendário, Enter para abrir e escolher, Esc para fechar com o foco de volta ao gatilho (CT-09).

  > Como comprovar: em `testes-data-hora.txt`, ver aprovados os testes `has no axe violations`, `moves focus with the arrow keys across months`, `opens with the keyboard and focuses the selected day`, `fills both parts with the keyboard`, `picks a preset with the keyboard` e `closes on Escape...`.

- [ ] Todo texto visível é prop com padrão em pt-br, e datas saem no locale recebido, com os textos padrão mantidos em pt-br quando só o locale muda (RF-19, CT-12, CB-03).

  > Como comprovar: em `testes-data-hora.txt`, ver aprovados `uses the pt-BR labels by default`, `accepts overridden labels` e `formats ... in the received locale` de cada componente; com `en-US` a data aparece como `October 12, 2026` e o botão continua `Mês anterior`.

- [ ] Todo componente estende as props nativas e repassa `className`, `style`, `ref` e atributos `data-*`: nos campos, ao controle (campo de texto, botão gatilho ou grupo); no calendário, ao elemento raiz (RF-20, CT-13).

  > Como comprovar: em `testes-data-hora.txt`, ver aprovados `passes className, style and data attributes to the control` nos quatro campos, `... to the root` no `Calendar` e `forwards the ref to ...`, e a checagem de tipos da Verificação não apontar nenhum erro nas cinco pastas.

- [ ] Os testes de data não dependem da data nem do fuso da máquina: o dia atual é injetado e os períodos são calculados a partir dele (CT-16).

  > Como comprovar: ver aprovados os testes `... not the system clock` em `testes-data-hora.txt` e todos os testes aprovados também em `datas-outro-fuso.txt`, rodado em UTC+14.

- [ ] Os presets do `PeriodField` são definidos no uso, por um inteiro de dias ou por uma função que devolve o intervalo, sem lista fixa no componente (RF-11).

  > Como comprovar: em `testes-data-hora.txt`, ver aprovados `resolves a positive integer as the next n days`, `resolves a negative integer as the last n days` e `calls the function with today`.

- [ ] O código passa no lint, no Prettier e na checagem de tipos, e os estilos não têm cor, medida, duração, peso de fonte, entrelinha nem camada (`z-index`) literal fora das condições de `@media` (RF-20).

  > Como comprovar: a Verificação inteira termina com código 0, inclusive a busca de literais nos `*.module.css`, que não devolve nenhuma linha.

- [ ] Os componentes aparecem corretos nos temas claro e escuro, com foco visível e estados distinguíveis (RF-11, CT-09).

  > Como comprovar: abrir `data-hora-temas.png` e conferir os dois temas lado a lado, com o foco, o dia atual, o intervalo e o erro visíveis.
