<!-- Escrito no planejamento com o que a tarefa vai fazer e enriquecido na conclusão com o que foi feito. -->

## Abordagem

Três entregas: o fluxo `release.yml`, o `CHANGELOG.md` da 0.1.0 e o `README.md` atualizado. A publicação em si é um passo manual do usuário (tag), executado pela CI (RN-06, [project/security-04]); o agente nunca roda `npm publish` nem `git push`. A versão `0.1.0` já está no `package.json` desde a TASK-01, e o `repository` aponta para `Ishtar-Sink/Vega`, que o npm confere na provenance: esta tarefa não altera o manifesto.

## Decisões e alternativas

### Autenticação no npm

| Opção | Prós | Contras |
|---|---|---|
| **Escolhida:** token granular `NPM_TOKEN` como segredo, com `--provenance` (OIDC só para o atestado). | Funciona na primeira publicação do pacote; é a premissa da spec ("token de publicação configurado como segredo da CI"); roda com o npm 10 do Node 22. | Segredo de longa duração; tokens granulares de escrita expiram (até 90 dias) e exigem "Bypass 2FA" para automação. |
| Trusted publishing (OIDC, sem token). | Sem segredo; credencial de curta duração por execução. | O publicador confiável é configurado nas configurações de um pacote que já existe no npm; exige npm ≥ 11.5.1 no runner. |

Critérios: funcionar já na 0.1.0 (pacote ainda não existe), seguir a premissa da spec e manter a provenance. Recomendação para depois da 0.1.0 (fora do escopo): configurar o trusted publishing em `@ishtar-sink/vega`, trocar o passo para npm ≥ 11.5.1 sem `NODE_AUTH_TOKEN` e revogar o token.

### Quem cria a tag

| Opção | Escolha |
|---|---|
| **Usuário** cria e envia `v0.1.0` depois do commit liberado pela `approve-commit` e da CI verde na `main`. | Escolhida: a publicação é irreversível (o npm não aceita republicar a mesma versão) e o harness só faz commit e push a pedido. |
| Agente cria e envia a tag. | Descartada: ação remota e irreversível sem aval explícito; contraria [agent/boundaries]. |
| Release pela interface do GitHub (cria a tag junto). | Equivalente à escolhida; o usuário pode preferi-la, o gatilho `push` de tag dispara igual. |
| Ferramenta de release (changesets, release-please). | Descartada: dependência e fluxo novos para uma única versão. |

### Outras decisões

| Decisão | Alternativa descartada | Motivo |
|---|---|---|
| O `release.yml` repete lint, typecheck, testes e audit antes do build. | Depender da CI com `workflow_run`. | O commit da tag é verificado no mesmo job que publica; fluxo autocontido. |
| Passo que confere a tag contra a versão do `package.json`. | Confiar na tag. | Evita publicar `0.1.0` a partir de uma tag `v0.1.1` (ou o inverso). |
| `environment: npm`. | Segredo só no repositório. | Permite restringir o segredo e exigir aprovação manual no GitHub; o ambiente é criado na primeira execução. |
| `CHANGELOG.md` fora do tarball. | Acrescentar ao `files` do `package.json`. | O manifesto não está em "Mudar"; o histórico fica no GitHub. |
| Ensaio local dos passos do `release.yml` com a publicação pulada. | `npm publish --dry-run` na máquina local. | Nem ensaio de publicação sai da máquina local ([project/security-04]); o ensaio prova o resto do fluxo. |

## CHANGELOG

Formato de [project/development-methodology-06]. A seção "Alterado (em relação ao @atria/ui)" é a entrada da spec de troca no Atria (risco 1 da spec) e é montada na execução a partir dos `tecnico.md` das TASK-01 a TASK-13; o passo 3 lista o mínimo já conhecido no planejamento (camelCase de `empty_text`/`list_label`/`remove_label`/`value_cents`, `labels` do `ColorField` como `Partial<ColorFieldLabels>` com `wheelValue(hue, saturation)`, `onBlur` nativo no `MoneyField`, `className`/`style`/`...rest`/`ref` no controle dos campos, `paletteFor`/`artPalettes` substituídos por `itemPalette`, fontes em kebab-case).

## Riscos

- **Alto:** sem a organização `ishtar-sink` no npm ou sem o segredo `NPM_TOKEN`, o passo `npm publish` falha (E404/E403). Mitigação: o passo 6 pede ao usuário conferir os dois antes da tag; a falha segue o FA-02 (corrigir e refazer pela CI).
- `npm publish` falha com E422 se o `repository.url` do `package.json` não bater com o repositório do workflow.
- Uma versão publicada não pode ser republicada: um erro descoberto depois vira 0.1.1.
- [project/theme-08]: o comentário de origem do `tokens.ts`, os tokens `itemPalette`, `fontWeights`, `lineHeights` e `zIndices` e o `--deep-gradient` (TASK-02) precisam ir para `Ishtar-Sink/.github` `docs/identidade-ecossistema.md`. É outro repositório: passo manual do usuário (passo 6.5) e evidência `identidade-ecossistema.png`.
- `npm view` e `gh run list` dependem de rede e de o `gh` estar autenticado.

## Referências

RF-22, RF-23, CT-15, RN-06, FA-01, FA-02; premissas e risco "Publicação bloqueada" da spec; DEC-001; [project/security-04], [project/development-methodology-05], [project/development-methodology-06], [project/theme-08].

## Arquivos em comum na onda

Onda 6 só tem esta tarefa: nenhum arquivo em comum.
