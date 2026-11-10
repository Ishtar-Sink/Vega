### Baseline

- `vostok rules validate`
- `git ls-files README.md LICENSE`

### Verificação

```bash
pnpm install --frozen-lockfile
# evidência: lint-e-tipos.txt
pnpm lint && pnpm typecheck
# evidência: manifesto.txt
node -e "const p = require('./package.json'); const deps = Object.keys(p.dependencies ?? {}); console.log(JSON.stringify({ name: p.name, version: p.version, type: p.type, dependencies: deps, peerDependencies: p.peerDependencies, devReact: [p.devDependencies?.react, p.devDependencies?.['react-dom']], exports: p.exports, files: p.files }, null, 2)); const ok = deps.length === 0 && p.peerDependencies?.react === '^19.3.1' && p.peerDependencies?.['react-dom'] === '^19.3.1' && p.devDependencies?.react === '^19.3.1' && p.devDependencies?.['react-dom'] === '^19.3.1'; console.log(ok ? 'OK: sem dependências de runtime; react e react-dom como peer' : 'ERRO: manifesto fora do contrato'); process.exit(ok ? 0 : 1)"
# evidência: build-sonda.txt
( set -e; PROBE=$(mktemp -d); trap 'rm -rf "$PROBE"' EXIT; tar -cf - package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json eslint.config.js vite.config.ts .gitignore .prettierignore src/test | tar -xf - -C "$PROBE"; cd "$PROBE"; mkdir -p src/probe src/theme; printf '.root {\n  color: var(--text);\n}\n' > src/probe/probe.module.css; printf "import styles from './probe.module.css';\n\nexport function Probe() {\n  return <p className={styles.root}>Vega</p>;\n}\n" > src/probe/probe.tsx; printf "import { render, screen } from '@testing-library/react';\nimport { axe } from 'vitest-axe';\nimport { Probe } from './probe';\n\nit('renderiza com jest-dom e axe', async () => {\n  const { container } = render(<Probe />);\n  expect(screen.getByText('Vega')).toBeInTheDocument();\n  expect(await axe(container)).toHaveNoViolations();\n});\n" > src/probe/probe.test.tsx; printf "export { Probe } from './probe/probe';\n" > src/index.ts; printf ':root {\n  --text: #000;\n}\n' > src/theme/tokens.css; printf "@font-face {\n  font-family: 'Inter';\n  src: url('../../fonts/InterVariable.woff2') format('woff2');\n}\n" > src/theme/fonts.css; pnpm install --frozen-lockfile --offline; pnpm typecheck; pnpm build; find dist -type f | sort; grep -c 'var(--text)' dist/style.css; grep "url('../fonts/InterVariable.woff2')" dist/tokens.css; grep -c -- '--text: #000' dist/tokens.css; grep 'from "react/jsx-runtime"' dist/index.js; pnpm test )
```

Resultado esperado: todos os comandos com código 0. A sonda (a linha entre parênteses, autocontida para a evidência poder rodá-la sozinha) copia só a configuração para uma pasta temporária, acrescenta lá um componente de sonda com CSS Module, um teste e um tema mínimo, e mostra `dist/index.js`, `dist/index.d.ts`, `dist/probe/probe.d.ts`, `dist/style.css` e `dist/tokens.css`, a URL `../fonts/` reescrita, o `react/jsx-runtime` externo e `Tests  1 passed (1)`.

### Evidências

- `lint-e-tipos.txt` (automática, da verificação)
  - Título: Lint, Prettier e TypeScript estrito passam
  - Prova: ESLint (`strictTypeChecked`, `react-hooks`, `jsx-a11y`) com `--max-warnings 0`, Prettier e `tsc` em `strict` com `noUncheckedIndexedAccess` passam sobre a configuração criada (RNF-03, [project/code-style-01]).
  - Trecho: `All matched files use Prettier code style!` e o `$ tsc --noEmit` sem erro em seguida.
  - Falha: erros do ESLint, `[warn]` do Prettier ou `error TS` do `tsc`.
- `manifesto.txt` (automática, da verificação)
  - Título: Pacote sem dependências de runtime
  - Prova: o manifesto não tem dependências de runtime e `react`/`react-dom` `^19.3.1` são peer dependencies e devDependencies (RNF-05, RNF-06, RF-01).
  - Trecho: `"dependencies": []` e a linha `OK: sem dependências de runtime; react e react-dom como peer`.
  - Falha: a linha `ERRO: manifesto fora do contrato` ou uma lista de `dependencies` não vazia.
- `build-sonda.txt` (automática, da verificação)
  - Título: Build da biblioteca gera ESM, tipos e CSS
  - Prova: a configuração do Vite gera, numa cópia temporária com um componente de sonda, o `index.js` ESM com o React externo, os `.d.ts`, o `style.css` dos CSS Modules e o `tokens.css` com as fontes; o Vitest roda com jsdom, jest-dom e `vitest-axe` (RF-01).
  - Trecho: as linhas `dist/index.d.ts`, `dist/index.js`, `dist/style.css`, `dist/tokens.css`, `src: url('../fonts/InterVariable.woff2')`, `import { jsx as e } from "react/jsx-runtime";` (ou outro alias) e `Tests  1 passed (1)`.
  - Falha: erro do `vite build`, um arquivo ausente na lista do `dist`, a URL ainda com `../../fonts/` ou `Tests  1 failed`.
