<!-- Escrito no planejamento com o que a tarefa vai fazer e enriquecido na conclusão com o que foi feito. -->

## Abordagem

Teste antes pelo próprio bloco da "Verificação" (falha por dependência ausente), depois `pnpm add` das quatro dependências, o `exports` com `./prose` e o `vite.config.ts` com várias entradas. O build da 0.1.0 (TASK-01 e TASK-12 da SPEC-001) já gera ESM, `.d.ts` e o CSS; aqui só muda a lista de entradas e as dependências externas.

## Decisões

| Decisão | Alternativa descartada | Motivo |
|---|---|---|
| Entradas do Vite calculadas por `existsSync('src/prose/index.ts')`: só `index` até a TASK-13 criar o `Prose`; depois, `index` e `prose`. | (a) Declarar a entrada `prose` fixa agora: o `vite build` falha sem o arquivo e quebra o build de todas as tarefas das ondas 1 e 2. (b) Criar um `src/prose/index.ts` provisório: o caminho é `criar` da TASK-13. (c) Deixar a entrada para a TASK-13: o plano dá o `vite.config.ts` só a esta tarefa. | Mantém `pnpm build` verde em toda a spec sem mudar o plano; o comentário no código explica o porquê. |
| `fileName: (_format, name) => \`${name}.js\`` | `fileName: 'index'` | Com várias entradas, cada uma precisa do próprio arquivo: `dist/index.js` e `dist/prose.js`. |
| `exports` em forma de objeto, com `types` e `import`, em `.` e em `./prose`. | Só `./prose` como objeto. | Os tipos do `Prose` ficam em `dist/prose/index.d.ts` (o `dts` espelha `src/`), e o campo `types` do topo só cobre `.`. |
| As quatro dependências em `dependencies` e externas no build (regex no `external`). | Embutir no `dist/` ou declarar como peer. | Decisão 6 da spec (inferência A): o produto instala e deduplica; o `dist/` não carrega cópia do `lucide-react` nem do parser. |
| Faixas `^1.71.0`, `^10.1.0`, `^4.0.1` e `^6.0.0`. | Versões fixas sem `^`. | Versões atuais na consulta da spec, com peers compatíveis com React 19; o `pnpm-lock.yaml` fixa a resolução. |
| `docs/KT-001-vega-lote-1.md` sem mudança. | Reescrever ou mover o KT. | O arquivo já está versionado desde o commit `8a59b95`; a ação `alterar` vem do plano, e o passo só confere `git ls-files`. |

Justificativa das dependências de runtime ([project/stack-07], RN-04):

- `lucide-react`: decisão 1 da spec; ícones mantidos pela comunidade, MIT/ISC, tree-shaking por ícone importado.
- `react-markdown`, `remark-gfm` e `rehype-sanitize`: decisão 2 da spec; convertem Markdown em elementos React sem `innerHTML` ([project/security-03]), com tabelas (GFM) e sanitização por lista do que é permitido.

## Riscos

- Exceção de idade mínima: o `lucide-react` 1.71.0 saiu no mesmo dia da execução, e o `pnpm add` gravou `minimumReleaseAgeExclude: [lucide-react@1.71.0]` no `pnpm-workspace.yaml`. O usuário decidiu manter a exceção em vez de fixar a 1.70.0. Ao subir o `lucide-react`, a entrada pode ser removida quando a versão nova tiver passado da idade mínima.

- A entrada condicional esconde um erro de digitação no caminho do `Prose`: a TASK-13 confere `dist/prose.js` no build dela (CT-24).
- `pnpm audit` pode acusar vulnerabilidade transitiva do parser: o passo 6 para antes da verificação, e a troca de versão vira pergunta ao usuário.

## Referências da spec

RF-27, CT-24, RNF-06, RN-04; decisões 1, 2 e 6; [project/stack-07], [project/stack-08], [project/architecture-06], [project/architecture-07], [project/security-02].

## Arquivos em comum na onda

Onda 1 (com TASK-03, TASK-04, TASK-05, TASK-07 e TASK-10): nenhum arquivo em comum. O `package.json` também é mudado pela TASK-16, na onda 5.

## O que foi feito

- `package.json`: as quatro dependências entraram no campo `dependencies`, instaladas com `pnpm add`: `lucide-react` `^1.71.0`, `react-markdown` `^10.1.0`, `remark-gfm` `^4.0.1` e `rehype-sanitize` `^6.0.0`. Em `exports`, `.` e `./prose` usam o formato com `types` e `import`; `./prose` aponta para `dist/prose/index.d.ts` (tipos) e `dist/prose.js` (código). `./styles.css` e `./tokens.css` foram mantidos. O campo `types` do topo continua `./dist/index.d.ts`.
- `pnpm-workspace.yaml`: o `pnpm add` gravou `minimumReleaseAgeExclude` com `lucide-react@1.71.0`, porque a versão saiu no mesmo dia da execução e não passava na trava de idade mínima do pnpm 11. O usuário decidiu manter a exceção.
- `pnpm-lock.yaml`: resolução das quatro dependências novas, gerada pelo `pnpm add`.
- `vite.config.ts`: `existsSync` foi importado de `node:fs`. A constante `entries` recebe `index` (`src/index.ts`) e, só quando `src/prose/index.ts` existir, também `prose`. Em `build.lib`, `entry` passou a receber `entries` e `fileName` passou a usar o nome de cada entrada (`index.js` e `prose.js`). Em `build.rolldownOptions.external`, uma regex nova marca as quatro dependências como externas, incluindo subcaminhos.
- `docs/KT-001-vega-lote-1.md`: sem alteração. `git ls-files` confirma que o arquivo está versionado desde o commit `8a59b95`.

Verificação:

- Baseline coletado antes da mudança: 5 comandos, todos com código de saída 0.
- Dependências: `dependencies` contém exatamente `lucide-react`, `react-markdown`, `rehype-sanitize` e `remark-gfm`; `exports` contém `.`, `./prose`, `./styles.css` e `./tokens.css`.
- `pnpm build` termina com código 0 e gera os mesmos quatro arquivos em `dist/` (`index.d.ts`, `index.js`, `style.css`, `tokens.css`). O build segue verde com 72 exportações.
- Prettier, ESLint com `--max-warnings 0`, `pnpm typecheck` e `pnpm audit --audit-level high` terminaram com código 0.
- Evidências `dependencias.txt`, `audit.txt` e `build-entradas.txt` foram conferidas pelo usuário. A Verificação passou sem falhas; a regressão contra o baseline teve 2 mudanças esperadas (`dependencies` e `exports`).

## Pontos de atenção

- Exceção de idade mínima: `lucide-react@1.71.0` está em `minimumReleaseAgeExclude`. Quando a versão passar da idade mínima, a entrada pode ser removida.
- Entrada `prose` condicional: enquanto `src/prose/index.ts` não existir, `exports` aponta para `./dist/prose.js` e esse arquivo não é gerado. A TASK-13 precisa conferir `dist/prose.js` no próprio build (CT-24).
- Auditoria: `pnpm audit` mostra 1 vulnerabilidade moderada, no `minimatch`, transitiva do ESLint. É dependência de desenvolvimento e não aparece no nível `high` usado na verificação.
- As quatro dependências são externas: quem instala a biblioteca recebe essas bibliotecas do próprio projeto, e o `dist/` não embute cópias delas.
- O registro não guarda a saída do passo 1 (teste antes, com a falha esperada `ERRO: dependência ausente: lucide-react`).
