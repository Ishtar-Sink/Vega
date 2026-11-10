### Concluída quando

- [x] O `Button` aceita `size="lg"`, com altura mínima de 48 px, e `block`, com largura total, sem mudar o visual padrão (RF-36, CT-33).

  > Como comprovar: abrir `testes-button.txt` e ver aprovados os cinco testes novos e os antigos, sem `failed`.

- [x] O botão `block` não passa da borda do contêiner (RF-36).

  > Como comprovar: no print `button-tamanhos.png`, ver `Continuar` e `Largura toda` dentro do painel de 360 px, nos dois temas.

- [x] O CSS do `Button` continua só com tokens e o arquivo de produção fica com até 200 linhas (RNF-08).

  > Como comprovar: a Verificação termina com código 0, inclusive a busca de literais e a linha `OK: arquivos de produção com até 200 linhas`.
