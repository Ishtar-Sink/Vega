### Concluída quando

- [ ] O `Prose` renderiza o `markdown` recebido em elementos React e, sem ele, estiliza os `children` (RF-22, CT-20).

  > Como comprovar: em `testes-prose.txt`, ver aprovados `renders markdown as React elements` e `styles children when there is no markdown`.

- [ ] HTML cru, `<script>`, atributos `on*` e URLs `javascript:` do Markdown não são executados nem renderizados (RF-23, CT-21, CB-08).

  > Como comprovar: em `testes-prose.txt`, ver aprovado `drops raw HTML and dangerous URLs`, e em `prose-seguranca.txt` a linha "OK" sem nenhuma ocorrência de `dangerouslySetInnerHTML`.

- [ ] Links externos saem com `rel="noopener noreferrer"` e imagens com `loading="lazy"` (RF-24, CT-20).

  > Como comprovar: em `testes-prose.txt`, ver aprovados `renders markdown as React elements` e os testes de `rehypeProseLinks`.

- [ ] `components` substitui um elemento e `remarkPlugins` aplica sintaxe extra (RF-25, CT-22).

  > Como comprovar: em `testes-prose.txt`, ver aprovados `replaces an element through components` e `applies remark plugins`.

- [ ] O `Prose` tem os tamanhos `base` e `reading`, a medida de 68 caracteres e a tabela com rolagem horizontal a 360 px (RF-26, CT-23, CB-09).

  > Como comprovar: em `testes-prose.txt`, ver aprovados `uses the reading size` e `keeps the reading measure and scrolls wide tables`; em `prose-temas.png`, ver a tabela rolando no painel de 360 px.

- [ ] O `Prose` sai só pela entrada `@ishtar-sink/vega/prose`, e o índice principal não carrega o parser (RF-27, CT-24, RNF-06).

  > Como comprovar: abrir `prose-entrada.txt` e ver `Prose em @ishtar-sink/vega/prose: function`, `Prose em @ishtar-sink/vega: false` e a linha "OK".

- [ ] O código passa no lint, no Prettier e na checagem de tipos, os estilos não têm literal fora das condições de `@media` e os arquivos de produção têm até 200 linhas (RNF-08).

  > Como comprovar: a Verificação inteira termina com código 0, e `prose-seguranca.txt` lista cada arquivo com até 200 linhas.

- [ ] O texto aparece correto nos temas claro e escuro e a 360 px (RNF-01).

  > Como comprovar: abrir `prose-temas.png` e conferir os dois temas e o painel de 360 px.
