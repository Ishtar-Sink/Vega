# Metodologia de desenvolvimento

Define como o trabalho é conduzido, versionado, integrado e publicado na Vega.

[project/development-methodology-01]: TDD: o teste que falha é escrito antes do código que o faz passar, em todo componente e em toda correção de bug.
[project/development-methodology-02]: Commits no padrão Conventional Commits (`feat:`, `fix:`, ...), com a descrição em `pt-br`.
[project/development-methodology-03]: A CI roda lint, typecheck, testes e `pnpm audit`; uma falha em qualquer um impede a integração.
[project/development-methodology-04]: Uma decisão que vale para o ecossistema inteiro é levada para `Ishtar-Sink/.github`, salvo a identidade visual, cuja fonte de verdade é a Vega ([project/theme-08]).
[project/development-methodology-05]: Versionamento semântico: mudança incompatível na API pública (props, exports ou nomes de tokens) só em versão major, com nota de migração.
[project/development-methodology-06]: Toda tag de versão tem uma entrada rica no `CHANGELOG.md`: mudanças agrupadas (Adicionado, Alterado, Corrigido, Removido), o motivo de cada uma, os componentes e tokens afetados e, quando houver quebra, o passo a passo de migração com exemplo de código.
