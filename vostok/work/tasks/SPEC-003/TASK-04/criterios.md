### Concluída quando

- [ ] O `ProgressBar` mostra o `valueText` e o aplica em `aria-valuetext` (RF-37, CT-34).

  > Como comprovar: em `testes-progresso.txt`, ver aprovado `shows valueText as visible text and aria-valuetext`; no print `progresso-temas.png`, ver `4 de 9` abaixo da barra.

- [ ] O modo indeterminado não anuncia valor e ignora o `value` recebido (RF-38, CT-35, CB-12).

  > Como comprovar: em `testes-progresso.txt`, ver aprovados `omits aria-valuenow when indeterminate` e `ignores the value when indeterminate`.

- [ ] A animação indeterminada usa `--motion-*` e para com movimento reduzido (RF-38, RNF-04).

  > Como comprovar: em `testes-progresso.txt`, ver aprovados `animates the indeterminate fill with motion tokens` e `stops the indeterminate animation with reduced motion`.

- [ ] O comportamento atual do `ProgressBar` não muda, e o arquivo de produção fica com até 200 linhas (RNF-08).

  > Como comprovar: os testes antigos de `testes-progresso.txt` continuam aprovados, e a Verificação imprime `OK: arquivos de produção com até 200 linhas`.
