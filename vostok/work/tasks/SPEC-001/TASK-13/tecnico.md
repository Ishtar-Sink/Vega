<!-- Escrito no planejamento com o que a tarefa vai fazer e enriquecido na conclusão com o que foi feito. -->

## Abordagem

`ci.yml` é o job `web` de `../atria/.github/workflows/ci.yml` reduzido a um repositório de um pacote: checkout, pnpm (versão do `packageManager`), Node 22 com cache do pnpm, `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm typecheck`, `pnpm test` e `pnpm audit --audit-level high` ([project/development-methodology-03], [project/security-02]). Permissão mínima (`contents: read`) e `concurrency` cancelando execuções antigas da mesma ref. Cada passo é um `run:` próprio: o GitHub marca qual falhou.

## Verificação local de CT-14

CT-14 pede um pull request com falha de lint. Para comprovar sem depender do GitHub, a Verificação extrai os `run:` do próprio `ci.yml` e os executa na ordem, numa cópia temporária com só a configuração da TASK-01, o `ci.yml` e um teste de sonda: primeiro passa, depois, com um `any` num arquivo novo da cópia, falha no `pnpm lint`. A cópia isola a prova da TASK-02, que roda na mesma onda e pode estar com testes em vermelho (TDD), e evita o "No test files found" do Vitest quando ainda não há testes no projeto. O pull request real é a evidência manual `ci-github.png`.

## Decisões

| Decisão | Alternativa descartada | Motivo |
|---|---|---|
| actionlint pela imagem oficial `rhysd/actionlint:1.7.7` no Docker. | `pnpm dlx actionlint` (build em wasm de terceiro, sem repositório publicado); instalar o binário com Go (não há Go na máquina). | Ferramenta oficial com versão fixa; testado no planejamento. |
| Executar os `run:` do `ci.yml` numa cópia temporária. | Rodar `pnpm lint`/`test` direto no projeto; criar o arquivo com erro no projeto. | Prova os comandos do workflow, não uma cópia deles, sem criar arquivos fora de "Mudar" nem depender do estado da TASK-02. |
| Um job só, sem `if: hashFiles(...)`. | Copiar a estrutura multi-job do Atria. | O actionlint recusa `hashFiles` no `if` do job; a Vega não tem servidor nem e2e. |
| CI sem `pnpm build`. | Acrescentar o build. | RF-21 lista só lint, typecheck, testes e audit; o build roda no fluxo de publicação da TASK-14. |

## Riscos

- `pnpm audit` depende da rede e do banco de vulnerabilidades: uma vulnerabilidade alta nova numa devDependency faz a CI falhar sem mudança de código (comportamento desejado, RNF-08).
- A evidência manual depende de o repositório estar no GitHub com Actions habilitado (premissa da spec).

## Referências

RF-21, RNF-08, CT-14; [project/development-methodology-03], [project/security-02].

## Arquivos em comum na onda

Onda 2 tem também a TASK-02 (`src/theme/`, `fonts/`): nenhum arquivo em comum. A Verificação lê, sem alterar, os arquivos da TASK-01.
