### Concluída quando

- [x] O `Disclosure` usa `<details>` e `<summary>` nativos, com título, ícone e tom (RF-13).

  > Como comprovar: em `testes-disclosure.txt`, ver aprovado `renders a native details with the summary as the title`.

- [x] Abre e fecha por clique, Enter e Espaço, controlado e não controlado (RF-14, CT-13, CT-14, CB-05).

  > Como comprovar: em `testes-disclosure.txt`, ver aprovados `opens and closes uncontrolled by click and keyboard`, `stays as received when controlled` e `keeps the received open without onOpenChange`.

- [x] O `Accordion` `single` fecha os outros ao abrir um, e o `multiple` deixa abrir vários (RF-15, CT-15).

  > Como comprovar: em `testes-disclosure.txt`, ver aprovados `closes the others in single mode` e `keeps them independent in multiple mode`.

- [x] A seta e a abertura animam só com os tokens de movimento e param com movimento reduzido (RNF-04).

  > Como comprovar: em `testes-disclosure.txt`, ver aprovado `animates only with motion tokens and stops with reduced motion`.

- [x] Passa no axe, os tons passam em AA nos dois temas e o resumo tem pelo menos 44 px (RNF-02, RNF-03, RNF-05).

  > Como comprovar: em `testes-disclosure.txt`, ver aprovados `has no axe violations`, `meets AA on the tone backgrounds in both themes` e `keeps the summary at least 44 px tall`.

- [x] O código passa no lint, no Prettier e na checagem de tipos, os estilos não têm literal e cada arquivo de produção tem até 200 linhas (RNF-08).

  > Como comprovar: a Verificação inteira termina com código 0, e `linhas-disclosure.txt` termina com "OK: arquivos de produção com até 200 linhas".

- [x] O `Disclosure` e o `Accordion` aparecem corretos nos temas claro e escuro e a 360 px (RNF-01).

  > Como comprovar: abrir `disclosure-temas.png` e conferir os três painéis, com os tons, a seta e uma única seção aberta no `Accordion`.
