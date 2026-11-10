### Concluída quando

- [x] O `RadioGroup` usa `<fieldset>`, `<legend>` e rádios nativos, e as setas mudam a seleção (RF-05, CT-05, CB-02).

  > Como comprovar: em `testes-radio.txt`, ver aprovados `renders a fieldset with the legend and native radios`, `moves the choice with the arrow keys` e `reaches the first enabled option with Tab when value is null`.

- [x] Cada opção aceita descrição, marcador, desabilitado, tom e conteúdo no fim, e o tom tem sinal além da cor (RF-06, RN-03).

  > Como comprovar: em `testes-radio.txt`, ver aprovado `renders description, marker, tone and adornment`; no print `radio-temas.png`, os cartões da correção têm ícone e selo.

- [x] Na variante `card`, todo o cartão seleciona e a seleção aparece com borda, fundo e ícone de confere (RF-07, CT-07).

  > Como comprovar: em `testes-radio.txt`, ver aprovado `selects by clicking anywhere on the card`; no print, o cartão marcado tem borda, fundo e confere.

- [x] Com `readOnly`, as opções continuam anunciadas e a seleção não muda (RF-08, CT-08, CB-03).

  > Como comprovar: em `testes-radio.txt`, ver aprovado `keeps the choice with readOnly`.

- [x] A ajuda e o erro ficam ligados ao grupo, e o erro aparece com `role="alert"` (RF-09, CT-09).

  > Como comprovar: em `testes-radio.txt`, ver aprovado `links help and error to the group`.

- [x] As duas variantes passam no axe, os tons passam em AA nos dois temas e o alvo de toque tem pelo menos 44 px (RNF-02, RNF-03, RNF-05).

  > Como comprovar: em `testes-radio.txt`, ver aprovados `has no axe violations in both variants`, `meets AA on the tone backgrounds in both themes` e `keeps the touch target at least 44 px`.

- [x] O código passa no lint, no Prettier e na checagem de tipos, os estilos não têm literal e cada arquivo de produção tem até 200 linhas (RNF-04, RNF-08).

  > Como comprovar: a Verificação inteira termina com código 0, e `linhas-radio.txt` termina com a linha "OK: arquivos de produção com até 200 linhas".

- [x] O `RadioGroup` aparece correto nos temas claro e escuro e a 360 px (RNF-01).

  > Como comprovar: abrir `radio-temas.png` e conferir os três painéis, com as duas variantes, a correção e o foco visível.
