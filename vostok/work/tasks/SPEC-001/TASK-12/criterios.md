### Concluída quando

- [ ] O índice exporta todos os componentes, funções auxiliares, o tema e os tipos das props, e nada além disso (RF-02, CT-02).

  > Como comprovar: abrir `exportacoes.txt` e ver um teste aprovado por nome, o teste "exporta só a superfície pública" aprovado e "Tests  75 passed (75)".

- [ ] `paletteFor` e `artPalettes` do Atria não fazem parte do pacote (RF-02).

  > Como comprovar: em `exportacoes.txt`, ver aprovado o teste "não reexporta a paleta do Atria".

- [ ] `pnpm build` gera o ESM, os tipos `.d.ts` e o CSS dos módulos em `dist/`, importáveis pelos caminhos do `exports` (RF-01, CT-01).

  > Como comprovar: abrir `build.txt` e ver os quatro arquivos do `dist/`, a contagem de exportações do `dist/index.js` e os dois CSS marcados `ok`.

- [ ] O pacote gerado leva as fontes e as licenças OFL (RF-01).

  > Como comprovar: em `build.txt`, ver `fonts/OFL-Inter.txt`, `fonts/OFL-Outfit.txt` e a linha "OK: pacote com build, tipos, CSS, fontes e licenças".

- [ ] O código gerado não faz requisição de rede nem tem URL externa (RF-01).

  > Como comprovar: abrir `sem-rede.txt` e ver a linha "OK: nenhuma requisição de rede nem URL externa no dist (JS e CSS)".
