### Baseline

- `pnpm exec prettier --check package.json pnpm-workspace.yaml tsconfig.json eslint.config.js vite.config.ts src/test`
- `vostok rules validate`

### Verificação

```bash
pnpm exec prettier --check .github
# evidência: actionlint.txt
docker run --rm -v "$PWD:/repo" --workdir /repo rhysd/actionlint:1.7.7 -color=false .github/workflows/ci.yml && echo 'OK: actionlint sem problemas em .github/workflows/ci.yml'
# evidência: ci-local-passa.txt
( set -e; CI_COPY=$(mktemp -d); trap 'rm -rf "$CI_COPY"' EXIT; tar -cf - package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json eslint.config.js vite.config.ts .gitignore .prettierignore src/test .github | tar -xf - -C "$CI_COPY"; printf "it('a CI roda os testes', () => {\n  expect(1 + 1).toBe(2);\n});\n" > "$CI_COPY/src/ci-probe.test.ts"; sed -n -E 's/^ +- run: (.*)$/\1/p' .github/workflows/ci.yml > "$CI_COPY/ci-steps.txt"; cd "$CI_COPY"; while IFS= read -r step; do echo "\$ $step"; bash -c "$step" || { echo "CI falhou em: $step"; exit 1; }; done < ci-steps.txt; echo 'CI passou: todos os passos run do ci.yml' )
# evidência: ci-local-falha-lint.txt
( set -e; CI_COPY=$(mktemp -d); trap 'rm -rf "$CI_COPY"' EXIT; tar -cf - package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json eslint.config.js vite.config.ts .gitignore .prettierignore src/test .github | tar -xf - -C "$CI_COPY"; printf "it('a CI roda os testes', () => {\n  expect(1 + 1).toBe(2);\n});\n" > "$CI_COPY/src/ci-probe.test.ts"; sed -n -E 's/^ +- run: (.*)$/\1/p' .github/workflows/ci.yml > "$CI_COPY/ci-steps.txt"; printf 'export const broken: any = 1;\n' > "$CI_COPY/src/ci-lint-failure.ts"; cd "$CI_COPY"; if ( while IFS= read -r step; do echo "\$ $step"; bash -c "$step" || { echo "CI falhou em: $step"; exit 1; }; done < ci-steps.txt ); then echo 'ERRO: a CI passou com a falha de lint'; exit 1; fi; echo 'OK: a CI falhou com a falha de lint' )
```

Resultado esperado: código 0. `actionlint.txt` só com a linha `OK: ...`; `ci-local-passa.txt` com `$ pnpm install --frozen-lockfile`, `$ pnpm lint`, `$ pnpm typecheck`, `$ pnpm test` (`Tests  1 passed (1)`), `$ pnpm audit --audit-level high` e `CI passou: ...`; `ci-local-falha-lint.txt` com o erro `@typescript-eslint/no-explicit-any`, `CI falhou em: pnpm lint` e `OK: a CI falhou com a falha de lint`. Precisa de rede (`pnpm audit`) e do Docker.

### Evidências

- `actionlint.txt` (automática, da verificação)
  - Título: Workflow da CI válido no actionlint
  - Prova: o `ci.yml` é um workflow válido do GitHub Actions, com sintaxe, expressões e scripts conferidos (RF-21).
  - Trecho: a linha `OK: actionlint sem problemas em .github/workflows/ci.yml`.
  - Falha: linhas `.github/workflows/ci.yml:<linha>:<coluna>: ...` do actionlint.
- `ci-local-passa.txt` (automática, da verificação)
  - Título: Passos da CI passam sem erro de lint
  - Prova: os passos `run:` do `ci.yml`, executados na ordem, rodam lint, typecheck, testes e `pnpm audit --audit-level high` e passam (RF-21, CT-14, RNF-08).
  - Trecho: as linhas `$ pnpm lint`, `$ pnpm typecheck`, `$ pnpm test`, `$ pnpm audit --audit-level high` e `CI passou: todos os passos run do ci.yml`.
  - Falha: `CI falhou em: <passo>`.
- `ci-local-falha-lint.txt` (automática, da verificação)
  - Título: Passos da CI falham com erro de lint
  - Prova: com um erro de lint, a sequência da CI para no `pnpm lint` (CT-14).
  - Trecho: `@typescript-eslint/no-explicit-any`, `CI falhou em: pnpm lint` e `OK: a CI falhou com a falha de lint`.
  - Falha: `ERRO: a CI passou com a falha de lint`.
- `ci-github.png` (manual): print (ou links) de duas execuções do workflow "CI" na aba Actions do repositório `Ishtar-Sink/Vega`, num mesmo pull request: uma vermelha, parada no passo `pnpm lint` por um erro de lint de propósito, e a seguinte verde, depois de remover o erro. Ajuda: `gh run list --workflow ci.yml --event pull_request --limit 5`.
  - Título: CI no GitHub falha com lint e passa sem ele
  - Prova: a CI roda no GitHub a cada pull request e uma falha de lint impede a integração (RF-21, CT-14, [project/development-methodology-03]).
  - Trecho: uma execução `failure` com o passo `Run pnpm lint` em vermelho e uma `success` com os cinco passos `run` verdes.
  - Falha: o workflow não aparece no pull request, ou a execução com o erro de lint fica verde.
