### Concluída quando

- [ ] A CI roda lint, typecheck, testes e `pnpm audit --audit-level high` a cada push e pull request (RF-21).

  > Como comprovar: abrir `ci-local-passa.txt` e ver os cinco passos rodados na ordem, terminando em "CI passou"; `actionlint.txt` com a linha "OK"; no diff da tarefa, o `ci.yml` com `push` e `pull_request` em `on:`.

- [ ] Uma falha de lint faz a CI falhar; sem ela, a CI passa (CT-14).

  > Como comprovar: abrir `ci-local-falha-lint.txt` e ver "CI falhou em: pnpm lint" e "OK: a CI falhou com a falha de lint"; no print `ci-github.png`, ver a execução vermelha no `pnpm lint` e a seguinte verde.

- [ ] O `pnpm audit` da CI não aceita vulnerabilidade alta ou crítica (RF-21).

  > Como comprovar: em `ci-local-passa.txt`, ver o passo `$ pnpm audit --audit-level high` executado sem falha.
