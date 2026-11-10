### Baseline

- `pnpm build >/dev/null 2>&1 && find dist -maxdepth 1 -type f | sort`
- `pnpm exec eslint vite.config.ts --max-warnings 0`
- `pnpm exec tsc --noEmit 2>&1 | grep -E '^vite\.config\.ts' | sort`
- `node -p "Object.keys(require('./package.json').dependencies ?? {}).sort().join(',')"` (muda): passa de vazio para `lucide-react,react-markdown,rehype-sanitize,remark-gfm`
- `node -p "Object.keys(require('./package.json').exports).join(',')"` (muda): ganha a entrada `./prose`

### Verificação

```bash
# evidência: dependencias.txt
node --input-type=module -e "import { readFileSync } from 'node:fs'; const pkg = JSON.parse(readFileSync('package.json', 'utf8')); const want = { 'lucide-react': '^1.71.0', 'react-markdown': '^10.1.0', 'remark-gfm': '^4.0.1', 'rehype-sanitize': '^6.0.0' }; let ok = true; for (const [name, range] of Object.entries(want)) { const got = pkg.dependencies?.[name]; if (!got) { console.log('ERRO: dependência ausente:', name); ok = false; continue; } console.log(name, got, got === range ? 'ok' : 'ERRO: faixa diferente de ' + range); if (got !== range) ok = false; if (pkg.devDependencies?.[name] || pkg.peerDependencies?.[name]) { console.log('ERRO: também em dev ou peer:', name); ok = false; } } for (const p of ['react', 'react-dom']) if (pkg.dependencies?.[p]) { console.log('ERRO: react em dependencies'); ok = false; } const prose = pkg.exports?.['./prose']; console.log('exports:', Object.keys(pkg.exports).join(', ')); console.log('./prose ->', JSON.stringify(prose)); if (prose?.import !== './dist/prose.js' || prose?.types !== './dist/prose/index.d.ts') { console.log('ERRO: entrada ./prose'); ok = false; } if (!ok) process.exit(1); console.log('OK: quatro dependências de runtime e a entrada ./prose no exports');"
pnpm install --frozen-lockfile
# evidência: audit.txt
pnpm audit --audit-level high
# evidência: build-entradas.txt
( set -e; rm -rf dist; pnpm build; find dist -maxdepth 1 -type f | sort; grep -c "existsSync('src/prose/index.ts')" vite.config.ts; grep -E 'lucide-react|react-markdown|remark-gfm|rehype-sanitize' vite.config.ts; if grep -qE "from ['\"](react-markdown|remark-gfm|rehype-sanitize)" dist/index.js; then echo 'ERRO: parser de Markdown no dist/index.js'; exit 1; fi; node --input-type=module -e "const vega = await import('@ishtar-sink/vega'); console.log('exportações no dist/index.js:', Object.keys(vega).length);"; echo 'OK: build verde com a entrada index e as dependências novas externas' )
pnpm exec eslint vite.config.ts --max-warnings 0
pnpm exec prettier --check package.json vite.config.ts
pnpm typecheck
git ls-files --error-unmatch docs/KT-001-vega-lote-1.md
```

Resultado esperado: código 0. `dependencias.txt` termina em `OK: quatro dependências ...`; `audit.txt` sem vulnerabilidade alta ou crítica; `build-entradas.txt` lista os quatro arquivos do `dist/` (a entrada `prose` só aparece depois da TASK-13), `exportações no dist/index.js: 72` e a linha `OK: build verde ...`.

### Evidências

- `dependencias.txt` (automática, da verificação)
  - Título: Dependências novas e entrada do Prose no pacote
  - Prova: `lucide-react`, `react-markdown`, `remark-gfm` e `rehype-sanitize` estão em `dependencies` com as faixas decididas, o React continua só como peer e o `exports` tem `./prose` com o JS e os tipos (RF-27, RN-04, [project/architecture-07]).
  - Trecho: as quatro linhas `<nome> <faixa> ok`, `./prose -> {"types":"./dist/prose/index.d.ts","import":"./dist/prose.js"}` e `OK: quatro dependências de runtime e a entrada ./prose no exports`.
  - Falha: `ERRO: dependência ausente`, `ERRO: faixa diferente`, `ERRO: também em dev ou peer` ou `ERRO: entrada ./prose`.
- `audit.txt` (automática, da verificação)
  - Título: Dependências novas sem vulnerabilidade alta
  - Prova: as dependências acrescentadas não trazem vulnerabilidade alta ou crítica ([project/security-02]).
  - Trecho: a saída do `pnpm audit` sem `high` nem `critical` (por exemplo, `No known vulnerabilities found`).
  - Falha: uma linha `high` ou `critical` e código de saída diferente de 0.
- `build-entradas.txt` (automática, da verificação)
  - Título: Build verde com as dependências externas
  - Prova: o build continua gerando o pacote com a entrada `index`, a entrada `prose` fica condicionada ao arquivo do `Prose`, as quatro dependências ficam fora do `dist/` e o `dist/index.js` não importa o parser de Markdown (RF-27, RNF-06).
  - Trecho: `dist/index.d.ts`, `dist/index.js`, `dist/style.css`, `dist/tokens.css`, a contagem `1` do `existsSync`, a linha do `external` com as quatro dependências, `exportações no dist/index.js: 72` e `OK: build verde com a entrada index e as dependências novas externas`.
  - Falha: erro do `vite build`, `ERRO: parser de Markdown no dist/index.js` ou um dos quatro arquivos ausente.
