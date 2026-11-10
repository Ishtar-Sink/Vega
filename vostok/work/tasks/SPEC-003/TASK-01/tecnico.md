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

- A entrada condicional esconde um erro de digitação no caminho do `Prose`: a TASK-13 confere `dist/prose.js` no build dela (CT-24).
- `pnpm audit` pode acusar vulnerabilidade transitiva do parser: o passo 6 para antes da verificação, e a troca de versão vira pergunta ao usuário.

## Referências da spec

RF-27, CT-24, RNF-06, RN-04; decisões 1, 2 e 6; [project/stack-07], [project/stack-08], [project/architecture-06], [project/architecture-07], [project/security-02].

## Arquivos em comum na onda

Onda 1 (com TASK-03, TASK-04, TASK-05, TASK-07 e TASK-10): nenhum arquivo em comum. O `package.json` também é mudado pela TASK-16, na onda 5.
