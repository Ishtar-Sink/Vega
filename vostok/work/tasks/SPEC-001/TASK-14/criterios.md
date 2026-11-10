### Concluída quando

- [ ] O fluxo de publicação dispara numa tag de versão e publica no npm com provenance, só pela CI (RF-22).

  > Como comprovar: ver `actionlint.txt` com "OK", `release-ensaio.txt` terminando em "OK: todos os passos ... passam com a tag v0.1.0" e, no diff `release-workflow.diff`, o gatilho `v*`, `id-token: write` e `npm publish --provenance --access public`.

- [ ] A versão 0.1.0 está publicada no npm, com provenance, pelo workflow da tag (RF-22, RF-23, CT-15).

  > Como comprovar: abrir `npm-view.txt` e ver `"version": "0.1.0"` e o tipo de provenance `https://slsa.dev/provenance/v1`; abrir `release-ci.txt` e ver a execução da tag `v0.1.0` com `success`.

- [ ] O `CHANGELOG.md` tem a entrada da 0.1.0 com os quatro grupos, os motivos, os componentes e tokens afetados e a migração do `@atria/ui` (RF-23).

  > Como comprovar: abrir `changelog.diff` e ver `## [0.1.0]`, Adicionado, Alterado, Corrigido, Removido e "Migração do @atria/ui" com exemplos de código.

- [ ] O `README.md` não tem o aviso "Em desenvolvimento" e descreve instalação e estilos que existem no pacote (RF-23).

  > Como comprovar: abrir `readme-pacote.txt` e ver os dois CSS marcados `ok` e "OK: imports e estilos do README existem no pacote"; no `readme.diff`, ver o aviso removido.

- [ ] A identidade nova (comentário de origem, `itemPalette`, `fontWeights`, `lineHeights`, `zIndices`, `--deep-gradient`) foi levada ao documento da organização (RF-23).

  > Como comprovar: abrir `identidade-ecossistema.png` e ver o pull request em `Ishtar-Sink/.github` com esses itens no `docs/identidade-ecossistema.md`.
