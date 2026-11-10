<!-- Escrito no planejamento com o que a tarefa vai fazer e enriquecido na conclusão com o que foi feito. -->

## Abordagem

O pacote fica na raiz do repositório (decisão 9 da spec), com `pnpm-workspace.yaml` apontando para `.` ([project/architecture-01]). As versões das devDependencies são as do `@atria/ui` e do `@atria/theme`; `vite` (`^8.3.5`) e `@vitejs/plugin-react` (`^6.1.2`) seguem o `apps/web` do Atria e `vite-plugin-dts` entra em `^5.1.2`. Os três só rodam no build: o `dist/index.js` importa apenas `react`/`react/jsx-runtime`, então ficam em devDependencies e `dependencies` não existe ([project/stack-07], RNF-06). `react` e `react-dom` `^19.3.1` estão em peer e em dev (RNF-05, [project/architecture-07]). A versão nasce em `0.1.0`, como no contrato da spec, para a TASK-14 publicar sem mexer no manifesto; `repository` aponta para `Ishtar-Sink/Vega`, que a provenance do npm confere.

A configuração foi montada e executada num protótipo fora do projeto durante o planejamento: `pnpm install`, `pnpm lint`, `pnpm typecheck`, a sonda de build e a de testes passaram com vite 8.3.7, vitest 5.1.0, vite-plugin-dts 5.1.2 e TypeScript 6.0.3. Na execução, a mesma configuração foi aplicada no projeto e verificada (ver "O que foi feito").

## Decisões

| Decisão | Alternativa descartada | Motivo |
|---|---|---|
| Comprovar RF-01 com uma sonda numa cópia temporária (`mktemp -d`): só a configuração, mais um componente, um teste e um tema mínimos, apagados no fim. | Rodar `vite build` no projeto (falha sem `src/index.ts`); criar um `src/index.ts` provisório (é da TASK-12 e ficaria fora de "Mudar"). | Prova o build e o Vitest de verdade sem criar nada fora de "Mudar". |
| `dist/tokens.css` gerado por um plugin inline no `vite.config.ts`, que junta `src/theme/fonts.css` (URLs `../../fonts/` → `../fonts/`) e `src/theme/tokens.css`. | Exportar `./fonts.css` separado; `vite-plugin-static-copy`. | O contrato da spec só tem `./styles.css` e `./tokens.css`; sem dependência nova. Importar o tema já traz as fontes, servidas do `fonts/` do pacote ([project/architecture-06]). |
| `lib.cssFileName: 'style'`, gerando `dist/style.css`. | Nome padrão do Vite (derivado do nome do pacote). | Contrato `"./styles.css": "./dist/style.css"`. |
| `exports["."]` como string `./dist/index.js`, com `types` no topo. | Exports condicionais `{ types, import }`. | Segue o contrato da spec ao pé da letra; o TypeScript acha o `index.d.ts` ao lado do `.js`. |
| Tipos dos `*.module.css` pelo `vite/client` no `tsconfig.json`. | `src/css-modules.d.ts` como no Atria. | Um arquivo a menos, com o mesmo tipo (`Record<string, string>`). |
| `src/test/vitest-axe.d.ts` separado, copiado do Atria. | Declarar a extensão do `expect` dentro do `setup.ts`. | No protótipo, a declaração dentro de um `.ts` dá TS2428 (parâmetros de tipo diferentes de `Assertion`); no `.d.ts` funciona como no Atria. |
| `setup.ts` copiado inteiro do Atria, com os substitutos de `<dialog>`, canvas e `scrollIntoView`. | Cada tarefa de componente acrescentar o seu. | Evita arquivo em comum entre tarefas de ondas diferentes. |
| `.prettierignore` com `vostok/`, `.claude/`, `pnpm-lock.yaml` e `*.md`. | Formatar o Markdown com o Prettier. | Na raiz, o `prettier --check .` alcança o harness e o `README.md`, que hoje reprovaria (tabelas não alinhadas) e não está em "Mudar". |
| Vitest configurado no `vite.config.ts` (`defineConfig` de `vitest/config`). | `vitest.config.ts` separado como no Atria. | Convenção do briefing; um arquivo só para build e testes. |

## Arquivos além da lista do plano

O plano lista seis arquivos; "Mudar" acrescenta `pnpm-lock.yaml` (exigido pelo `--frozen-lockfile` da CI), `.gitignore` (o repositório não tem um, e `dist/`/`node_modules/` não podem ir para o Git nem para o Prettier), `.prettierignore` e `src/test/vitest-axe.d.ts`. São partes da mesma estrutura, sem escopo novo.

## Contratos para as outras tarefas

- `src/theme/fonts.css` (TASK-02) usa `url('../../fonts/<arquivo>')`; `src/theme/tokens.css` existe no build. Sem os dois, o `vite build` falha.
- Com o pacote sem testes, `pnpm test` termina com "No test files found" (código 1): as tarefas seguintes medem só as pastas que já existem.

## Riscos

- `pnpm audit` acusa hoje uma vulnerabilidade moderada numa devDependency; não bloqueia o `--audit-level high` da TASK-13.
- `minimumReleaseAge` do pnpm 11 pode recusar uma versão recém-publicada; o passo 6 diz como liberar, como no Atria.

## Referências

RF-01, RNF-03, RNF-05, RNF-06; decisões 9 e 10 da spec; [project/stack-01], [project/stack-03], [project/stack-04], [project/stack-07], [project/stack-08], [project/code-style-01], [project/architecture-01], [project/architecture-07].

## Arquivos em comum na onda

Onda 1 só tem esta tarefa: nenhum arquivo em comum.

## O que foi feito

Os dez arquivos de "Mudar" foram criados conforme os passos: o manifesto, o workspace, o lockfile, `.gitignore`, `.prettierignore`, `tsconfig.json`, `eslint.config.js`, `vite.config.ts`, `src/test/setup.ts` e `src/test/vitest-axe.d.ts`. O `pnpm install` gerou o `pnpm-lock.yaml` sem exclusão no `minimumReleaseAge`, então nenhuma versão precisou ser liberada no workspace.

Versões instaladas: vite 8.3.7, vitest 5.1.0, vite-plugin-dts 5.1.2, @vitejs/plugin-react 6.3.0 e TypeScript 6.0.3.

Verificação:

- Lint, Prettier e `tsc` passaram.
- A sonda de build (numa cópia temporária, apagada no fim) gerou `dist/index.js`, `dist/index.d.ts`, `dist/probe/probe.d.ts`, `dist/style.css` e `dist/tokens.css`. Em `dist/tokens.css`, a URL das fontes foi reescrita para `../fonts/`, e o React ficou externo.
- O `dist/probe/probe.d.ts` mostra um `.d.ts` por arquivo de `src`: é o comportamento esperado, aceito pelo usuário.
- O teste de sonda com axe passou.
- As evidências `lint-e-tipos.txt`, `manifesto.txt` e `build-sonda.txt` foram conferidas pelo usuário.

Ajuste na execução: a evidência `build-sonda.txt` virou uma linha autocontida. O `vostok task evidence` roda sozinho a linha que segue o rótulo `# evidência:`, e a função `build_probe`, definida antes, não existia nesse contexto.

Pontos de atenção:

- Sem nenhum teste no projeto, `vitest run` termina com "No test files found" e código 1 até a TASK-02 criar os primeiros testes.
- O build completo só é conferido na TASK-12, quando houver componentes; aqui a geração foi conferida com a sonda.
