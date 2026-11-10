### Concluída quando

- [ ] O índice exporta todos os componentes novos, os ícones e os tipos das props, e nada além da lista (RF-41, CT-38).

  > Como comprovar: abrir `exportacoes.txt` e ver um teste aprovado por nome e "exporta só a superfície pública" aprovado.

- [ ] O `Prose` fica fora do índice e sai só em `@ishtar-sink/vega/prose` (RF-41, RNF-06).

  > Como comprovar: em `exportacoes.txt`, ver "não exporta o Prose, que tem entrada própria" aprovado; em `build-0-2.txt`, ver "Prose na entrada própria: function" e a linha "OK: índice com os componentes da 0.2.0 ...".

- [ ] Com todos os componentes da 0.2.0 juntos, a suíte inteira e o lint passam (RNF-03).

  > Como comprovar: abrir `suite-completa.txt` e ver as contagens sem `failed` e a linha "OK: suíte inteira e lint verdes ...".

- [ ] O código gerado não faz requisição de rede nem tem URL externa (RNF-09).

  > Como comprovar: abrir `sem-rede.txt` e ver a linha "OK: nenhuma requisição de rede nem URL externa no dist (JS e CSS)".
