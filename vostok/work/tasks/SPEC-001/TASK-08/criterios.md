### Concluída quando

- [x] `Card`, `PageHeader`, `Toolbar`, `Tabs`, `ViewSwitcher`, `FormGrid` e `FormActions` existem nas próprias pastas e passam nos testes (RF-13).

  > Como comprovar: rodar a primeira linha da Verificação e ver todos os testes das sete pastas aprovados, sem `failed` (`testes-estrutura.txt`).

- [x] Os ícones `ListIcon`, `GridIcon`, `ShelfIcon`, `TableIcon`, `DayIcon` e `TimelineIcon` existem em `src/icons`, são SVG decorativos com `aria-hidden` e aceitam outro tamanho (RF-18).

  > Como comprovar: em `testes-estrutura.txt`, ver aprovados os seis casos `renders ... as a decorative 18 px svg`, `accepts another size` e `keeps aria-hidden even when another value is passed`.

- [x] Cada componente passa no axe, e os interativos funcionam por teclado: setas, Home e End nas abas, Tab, Enter e espaço na troca de visualização, na busca e nas ações do formulário (CT-09).

  > Como comprovar: em `testes-estrutura.txt`, ver aprovados todos os `has no axe violations` e os testes `moves focus with arrow keys`, `chooses a view with the keyboard`, `reaches the search and the views with the keyboard` e `cancels with the keyboard`.

- [x] Os textos visíveis próprios dos componentes têm padrão em pt-br e podem ser trocados: `Buscar` na busca, `Cancelar` e `Salvar` nas ações (RF-19).

  > Como comprovar: em `testes-estrutura.txt`, ver aprovados `uses Buscar as the default search label`, `accepts another search label` e `uses Cancelar and Salvar by default`.

- [x] Todo componente estende as props nativas do elemento raiz e repassa `className`, `style` e atributos `data-*` (RF-20, CT-13).

  > Como comprovar: em `testes-estrutura.txt`, ver aprovado `passes className, style and data attributes to the root` nas sete pastas (e `... to the svg` nos ícones), e a checagem de tipos da Verificação não apontar nenhum erro nas pastas da tarefa.

- [x] O código passa no lint, no Prettier e na checagem de tipos, e os estilos não têm cor, medida, duração, peso de fonte, entrelinha nem camada (`z-index`) literal fora das condições de `@media` (RF-13, RF-20).

  > Como comprovar: a Verificação inteira termina com código 0, inclusive a busca de literais nos `*.module.css`, que não devolve nenhuma linha.

- [x] Os componentes aparecem corretos nos temas claro e escuro e em tela estreita, com foco visível e estados ativos distinguíveis (RF-13, CT-09).

  > Como comprovar: abrir `estrutura-temas.png` e conferir os dois temas e a captura a 480 px, com aba e visualização ativas, foco e o formulário em uma coluna.
