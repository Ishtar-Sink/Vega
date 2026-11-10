### Concluída quando

- [ ] O índice exporta `Timer`, `Countdown`, `ConnectionStatus`, `formatDuration`, `daysBetween` e os 11 tipos públicos, e nada além da lista (RF-19, CT-14).

  > Como comprovar: abrir `exportacoes.txt` e ver um teste aprovado para cada um dos 5 nomes novos e "exporta só a superfície pública" aprovado; em `build-0-3.txt`, ver "novos no dist/index.js" com os 5 nomes.

- [ ] Os dois utilitários funcionam pelo pacote gerado (RF-19, CT-14).

  > Como comprovar: abrir `build-0-3.txt` e ver "formatDuration(65000): 01:05" e "daysBetween: 7".

- [ ] Com os componentes da 0.3.0 juntos, a suíte inteira e o lint passam (RF-19).

  > Como comprovar: abrir `suite-completa.txt` e ver as contagens sem `failed` e a linha "OK: suíte inteira e lint verdes ...".

- [ ] O código gerado não faz requisição de rede nem tem URL externa (RNF-08).

  > Como comprovar: abrir `sem-rede.txt` e ver a linha "OK: nenhuma requisição de rede nem URL externa no dist (JS e CSS)".
