### Concluída quando

- [x] O `package.json` está na 0.2.0 e o `CHANGELOG.md` tem a entrada `[0.2.0]` com os quatro grupos, os motivos e todos os componentes, ícones e props novos (RF-42).

  > Como comprovar: abrir `changelog.txt` e ver a versão 0.2.0, os quatro grupos, "itens conferidos: N de N" e a linha "OK: CHANGELOG da 0.2.0 ...".

- [x] O `README.md` descreve os componentes novos, os ícones com a licença do Lucide e a entrada `@ishtar-sink/vega/prose`, com imports que existem no pacote (RF-42).

  > Como comprovar: abrir `readme-pacote.txt` e ver os imports das duas entradas, os dois CSS com `ok`, "licença do Lucide citada: sim" e a linha "OK: imports, estilos e a entrada do Prose ...".

- [x] Os passos do workflow de publicação passam localmente com a tag `v0.2.0` (RF-42, RN-06).

  > Como comprovar: abrir `release-ensaio.txt` e ver a linha "OK: todos os passos do release.yml antes da publicação passam com a tag v0.2.0".

- [x] A versão 0.2.0 está publicada no npm como `latest`, com provenance, pelo workflow da tag (RF-42, CT-39).

  > Como comprovar: abrir `npm-view.txt` e ver `"version": "0.2.0"`, o tipo de provenance `https://slsa.dev/provenance/v1` e `"latest": "0.2.0"`; abrir `release-ci.txt` e ver a execução da tag `v0.2.0` com `success`.
