### Concluída quando

- [ ] As quatro dependências de runtime estão em `dependencies`, com as faixas decididas, e o React continua só como peer (RN-04, RF-27).

  > Como comprovar: abrir `dependencias.txt` e ver as quatro linhas com `ok` e a linha final "OK: quatro dependências de runtime e a entrada ./prose no exports".

- [ ] O pacote declara a entrada `@ishtar-sink/vega/prose`, com o JS e os tipos (RF-27, CT-24).

  > Como comprovar: em `dependencias.txt`, ver a linha `./prose ->` apontando para `./dist/prose.js` e `./dist/prose/index.d.ts`.

- [ ] O build continua verde e não embute nem importa o parser de Markdown no índice principal (RNF-06, CT-24).

  > Como comprovar: abrir `build-entradas.txt` e ver os quatro arquivos do `dist/`, a contagem de 72 exportações e a linha "OK: build verde com a entrada index e as dependências novas externas".

- [ ] As dependências novas não trazem vulnerabilidade alta ou crítica (RN-04).

  > Como comprovar: abrir `audit.txt` e ver o `pnpm audit` sem `high` nem `critical`.
