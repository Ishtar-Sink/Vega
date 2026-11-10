### Concluída quando

- [x] O build da biblioteca está configurado para gerar ESM, os tipos `.d.ts` e o CSS dos módulos (RF-01).

  > Como comprovar: abrir `build-sonda.txt` e ver, na lista de arquivos gerados, `dist/index.js`, `dist/index.d.ts` e `dist/style.css`, e o React marcado como externo; o build real do pacote é conferido na TASK-12.

- [x] O tema é publicado como `dist/tokens.css`, com as URLs das fontes válidas a partir de `dist/` (RF-01).

  > Como comprovar: em `build-sonda.txt`, ver `dist/tokens.css` na lista e a linha com `url('../fonts/InterVariable.woff2')`.

- [x] O Vitest roda com jsdom, jest-dom e `vitest-axe` pelo setup do pacote (RF-01).

  > Como comprovar: em `build-sonda.txt`, ver o teste de sonda passar (`Tests  1 passed (1)`), o que só acontece com `toBeInTheDocument` e `toHaveNoViolations` registrados.

- [x] Lint, Prettier e TypeScript estrito passam sem avisos (RF-01).

  > Como comprovar: abrir `lint-e-tipos.txt` e ver o Prettier sem arquivos com aviso e o `tsc --noEmit` sem erros.

- [x] O pacote não tem dependências de runtime e `react`/`react-dom` são peer dependencies (RF-01).

  > Como comprovar: abrir `manifesto.txt` e ver `"dependencies": []`, o `peerDependencies` com `^19.3.1` e a linha `OK`.
