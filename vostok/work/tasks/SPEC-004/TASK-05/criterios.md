### Concluída quando

- [x] O `package.json` está na 0.3.0 e o `CHANGELOG.md` tem a entrada `[0.3.0]` com os quatro grupos, os motivos e todos os componentes, utilitários e props novos (RF-20, CT-15).

  > Como comprovar: abrir `changelog.txt` e ver a versão 0.3.0, os quatro grupos, "itens conferidos: 10 de 10" e a linha "OK: CHANGELOG da 0.3.0 ...".

- [x] O `README.md` descreve os componentes e utilitários novos e traz a seção "Tempo e conexão" com um exemplo de imports que existem no pacote (RF-20, CT-15).

  > Como comprovar: abrir `readme-pacote.txt` e ver os imports do pacote, os dois CSS com `ok`, "seção Tempo e conexão: sim" e a linha "OK: imports, estilos e a seção Tempo e conexão ...".

- [x] Os passos do workflow de publicação passam localmente com a tag `v0.3.0` (RF-20).

  > Como comprovar: abrir `release-ensaio.txt` e ver a linha "OK: todos os passos do release.yml antes da publicação passam com a tag v0.3.0".

- [x] A versão 0.3.0 está publicada no npm como `latest`, com provenance, pelo workflow da tag (RF-20, CT-15).

  > Como comprovar: abrir `npm-view.txt` e ver `"version": "0.3.0"`, o tipo de provenance `https://slsa.dev/provenance/v1` e `"latest": "0.3.0"`; abrir `release-ci.txt` e ver a execução da tag `v0.3.0` com `success`.
