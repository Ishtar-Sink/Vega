### Ler

- `vostok/work/specs/refined/SPEC-001-extrair-os-componentes-do-atria-para-a-vega.md` (RF-21, RNF-08, CT-14)
- `vostok/rules/project/development-methodology.md`
- `vostok/rules/project/security.md`
- `../atria/.github/workflows/ci.yml` (job `web`)
- `package.json` (scripts e `packageManager`)
- `.prettierignore`

### Mudar

- `.github/workflows/ci.yml` (criar): CI com lint, typecheck, testes e `pnpm audit --audit-level high` a cada push e pull request (RF-21, RNF-08).

### Passos

1. Teste antes: rode o bloco da "Verificação" e confirme que ele falha no primeiro comando, porque `.github/` ainda não existe. Confira: `prettier --check .github` termina com erro.
2. `.github/workflows/ci.yml` (criar): grave exatamente este conteúdo (o job `web` do Atria, sem o `if: hashFiles(...)` no nível do job, que o actionlint recusa, e sem os jobs de Rust, e2e e Lighthouse). O `pnpm/action-setup@v4` lê a versão do pnpm do `packageManager` do `package.json`. Confira: `pnpm exec prettier --check .github` passa.

   ```yaml
   name: CI

   on:
     push:
     pull_request:

   permissions:
     contents: read

   concurrency:
     group: ci-${{ github.ref }}
     cancel-in-progress: true

   jobs:
     check:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: pnpm/action-setup@v4
         - uses: actions/setup-node@v4
           with:
             node-version: 22
             cache: pnpm
         - run: pnpm install --frozen-lockfile
         - run: pnpm lint
         - run: pnpm typecheck
         - run: pnpm test
         - run: pnpm audit --audit-level high
   ```
3. Validação do workflow: rode `docker run --rm -v "$PWD:/repo" --workdir /repo rhysd/actionlint:1.7.7 -color=false .github/workflows/ci.yml`. Confira: nenhuma saída e código 0.
4. Rode o bloco da "Verificação" inteiro. Ele executa, numa cópia temporária com só a configuração da TASK-01, a CI e um teste de sonda, os passos `run:` do `ci.yml` na ordem: primeiro como estão (tem de passar) e depois com um arquivo `src/ci-lint-failure.ts` com `any` (tem de falhar no `pnpm lint`). A cópia isola o resultado das tarefas da mesma onda (TASK-02), que podem estar no meio da execução. Confira: código 0.
5. Não abra pull request nem faça push: a parte de CT-14 no GitHub é a evidência manual `ci-github.png`, feita pelo usuário quando o código chegar ao GitHub.
