### Concluída quando

- [ ] O `Callout` é um `<aside>` com os seis tons, fundo `*Soft`, ícone e título na cor do tom (RF-16, CT-16).

  > Como comprovar: em `testes-callout.txt`, ver aprovado `renders the <tom> tone with its soft background and icon` para os seis tons.

- [ ] O ícone padrão muda com o tom, pode ser trocado ou removido, e a ação fica no fim (RF-17, CB-06).

  > Como comprovar: em `testes-callout.txt`, ver aprovados `maps each tone to its default icon`, `accepts a custom icon and removes it with false` e `renders the action at the end`.

- [ ] `live="polite"` liga o `role="status"`, e o padrão fica sem região viva (RF-18, CT-17).

  > Como comprovar: em `testes-callout.txt`, ver aprovado `turns into a polite status only with live="polite"`.

- [ ] Passa no axe em todos os tons, e todos os tons passam em AA nos dois temas (RNF-03, RNF-05).

  > Como comprovar: em `testes-callout.txt`, ver aprovados `has no axe violations in every tone` e `meets AA on every tone in both themes`.

- [ ] O código passa no lint, no Prettier e na checagem de tipos, os estilos não têm literal e cada arquivo de produção tem até 200 linhas (RNF-08).

  > Como comprovar: a Verificação inteira termina com código 0, e `linhas-callout.txt` termina com "OK: arquivos de produção com até 200 linhas".

- [ ] O `Callout` aparece correto nos temas claro e escuro e a 360 px (RNF-01).

  > Como comprovar: abrir `callout-temas.png` e conferir os três painéis, com os seis tons, o aviso sem ícone e a ação.
