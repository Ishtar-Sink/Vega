### Ler

- `vostok/work/specs/refined/SPEC-003-lote-1-de-componentes-para-o-synestia.md` (RF-27, RNF-06, RNF-09, RN-04, "Contratos e interfaces": bloco do `exports`, "Registro de decisões" 1, 2 e 6)
- `vostok/rules/project/stack.md` ([project/stack-07], [project/stack-08]) e `vostok/rules/project/architecture.md` ([project/architecture-06], [project/architecture-07])
- `vostok/rules/project/security.md` ([project/security-02])
- `package.json` (campos `exports`, `types`, `files`, `dependencies` e `peerDependencies`)
- `vite.config.ts` (blocos `build.lib` e `build.rolldownOptions.external`, plugin `dts`)
- `vostok/work/tasks/SPEC-001/TASK-01/tecnico.md` (como o build foi montado na 0.1.0)

### Mudar

- `package.json` (alterar): `dependencies` com `lucide-react`, `react-markdown`, `remark-gfm` e `rehype-sanitize`, e a entrada `./prose` no `exports` (RF-27, RN-04).
- `pnpm-lock.yaml` (alterar): resolução das quatro dependências novas, gerada pelo `pnpm add`.
- `pnpm-workspace.yaml` (alterar): `minimumReleaseAgeExclude` com `lucide-react@1.71.0`, gravado pelo `pnpm add`, porque a versão foi publicada em 2026-11-10 e não passava na trava de idade mínima do pnpm 11 (decisão do usuário: manter a exceção).
- `vite.config.ts` (alterar): entradas `index` e `prose` (esta só quando `src/prose/index.ts` existir), nome de saída por entrada e as dependências novas como externas (RF-27, RNF-06).
- `docs/KT-001-vega-lote-1.md` (alterar): sem mudança de conteúdo; o passo só confere que o arquivo está versionado (já entrou no commit `8a59b95`).

### Passos

1. Teste antes: rode o bloco da "Verificação" e confira que ele falha no primeiro comando de dependências, porque `lucide-react` ainda não está no `package.json`. Confira: a saída mostra `ERRO: dependência ausente: lucide-react`.
2. `package.json` e `pnpm-lock.yaml` (alterar): rode `pnpm add lucide-react@^1.71.0 react-markdown@^10.1.0 remark-gfm@^4.0.1 rehype-sanitize@^6.0.0`. As quatro entram em `dependencies` (não em `devDependencies` nem em `peerDependencies`). Confira: `node -p "Object.keys(require('./package.json').dependencies).sort().join(',')"` imprime `lucide-react,react-markdown,rehype-sanitize,remark-gfm`.
3. `package.json` (alterar): troque o campo `exports` por este, mantendo o resto do arquivo:
   ```json
   "exports": {
     ".": { "types": "./dist/index.d.ts", "import": "./dist/index.js" },
     "./prose": { "types": "./dist/prose/index.d.ts", "import": "./dist/prose.js" },
     "./styles.css": "./dist/style.css",
     "./tokens.css": "./dist/tokens.css"
   },
   ```
   O campo `types` do topo continua `./dist/index.d.ts`. Confira: `node -p "Object.keys(require('./package.json').exports).join(',')"` imprime `.,./prose,./styles.css,./tokens.css`.
4. `vite.config.ts` (alterar):
   - acrescente `existsSync` ao import de `node:fs` e, antes do `export default`, a constante com o comentário do porquê:
     ```ts
     // A entrada `prose` só existe quando o componente existe: o parser de Markdown fica fora do índice principal.
     const entries: Record<string, string> = existsSync('src/prose/index.ts')
       ? { index: 'src/index.ts', prose: 'src/prose/index.ts' }
       : { index: 'src/index.ts' };
     ```
   - em `build.lib`, troque `entry: 'src/index.ts'` por `entry: entries` e `fileName: 'index'` por `fileName: (_format, name) => \`${name}.js\``, mantendo `formats: ['es']` e `cssFileName: 'style'`;
   - em `build.rolldownOptions.external`, acrescente `/^(lucide-react|react-markdown|remark-gfm|rehype-sanitize)($|\/)/` depois das duas regex do React.
   Confira: `pnpm build` termina com código 0 e `find dist -maxdepth 1 -type f | sort` lista os mesmos quatro arquivos de antes (`dist/index.d.ts`, `dist/index.js`, `dist/style.css`, `dist/tokens.css`).
5. `docs/KT-001-vega-lote-1.md` (alterar): não edite. Rode `git ls-files --error-unmatch docs/KT-001-vega-lote-1.md`. Confira: imprime o caminho e termina com código 0.
6. Rode `pnpm exec prettier --write package.json vite.config.ts`, `pnpm exec eslint vite.config.ts --max-warnings 0`, `pnpm typecheck` e `pnpm audit --audit-level high`. Confira: os quatro com código 0.
7. Rode o bloco da "Verificação" inteiro. Confira: código 0.
