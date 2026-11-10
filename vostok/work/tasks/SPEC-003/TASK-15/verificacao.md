### Baseline

- `pnpm vitest run src/index.test.ts --reporter=verbose 2>&1 | grep -E '^\s+(✓|×)' | sed -E 's/ [0-9]+ms$//' | sort`
- `pnpm exec eslint src/index.ts src/index.test.ts --max-warnings 0`
- `pnpm exec tsc --noEmit 2>&1 | grep -E '^src/index' | sort`

### Verificação

```bash
# evidência: exportacoes.txt
pnpm vitest run src/index.test.ts --reporter=verbose
pnpm exec eslint src/index.ts src/index.test.ts --max-warnings 0
pnpm exec prettier --check src/index.ts src/index.test.ts
pnpm typecheck
# evidência: suite-completa.txt
( set -e; pnpm vitest run 2>&1 | grep -E '^ +(Test Files|Tests) '; pnpm lint >/dev/null; echo 'OK: suíte inteira e lint verdes com os componentes da 0.2.0' )
# evidência: build-0-2.txt
( set -e; rm -rf dist; pnpm build; find dist -maxdepth 2 -type f \( -name '*.js' -o -name 'index.d.ts' \) | sort; if grep -qE "from ['\"](react-markdown|remark-gfm|rehype-sanitize)" dist/index.js; then echo 'ERRO: parser de Markdown no dist/index.js'; exit 1; fi; node --input-type=module -e "const vega = await import('@ishtar-sink/vega'); console.log('exportações no dist/index.js:', Object.keys(vega).length); if ('Prose' in vega) { console.log('ERRO: Prose no índice'); process.exit(1); } const prose = await import('@ishtar-sink/vega/prose'); console.log('Prose na entrada própria:', typeof prose.Prose);"; echo 'OK: índice com os componentes da 0.2.0 e o Prose só em @ishtar-sink/vega/prose' )
# evidência: sem-rede.txt
( if grep -rnE '\bfetch\(|XMLHttpRequest|sendBeacon|new WebSocket|EventSource|navigator\.connection' dist --include='*.js'; then echo 'ERRO: chamada de rede no dist'; exit 1; fi; if grep -rnoE 'https?://[A-Za-z0-9./_-]+' dist --include='*.js' --include='*.css' | grep -v 'http://www.w3.org/'; then echo 'ERRO: URL externa no dist'; exit 1; fi; echo 'OK: nenhuma requisição de rede nem URL externa no dist (JS e CSS)' )
```

Resultado esperado: código 0. `exportacoes.txt` com uma linha `✓ exporta <Nome>` por nome (122 com os nomes registrados no passo 1, se houver mais), `exporta só a superfície pública`, `não reexporta a paleta do Atria`, `exporta os tipos públicos`, `não exporta o Prose, que tem entrada própria` e o resumo sem `failed`; `build-0-2.txt` com `dist/index.js`, `dist/prose.js`, `exportações no dist/index.js: 122` (ou a contagem do passo 1), `Prose na entrada própria: function` e a linha `OK: ...`; `sem-rede.txt` com `OK: ...`.

### Evidências

- `exportacoes.txt` (automática, da verificação)
  - Título: Índice com os componentes da 0.2.0
  - Prova: cada componente novo, ícone e tipo das props é importável do índice, a superfície é exatamente a lista e o `Prose` não aparece (RF-41, CT-38).
  - Trecho: as linhas `✓ exporta Switch`, `✓ exporta AppShell`, `✓ exporta HomeIcon`, `✓ exporta só a superfície pública`, `✓ não exporta o Prose, que tem entrada própria` e o resumo `Tests  N passed` sem `failed`.
  - Falha: `× exporta <Nome>`, diferença na lista de chaves ou `Tests ... failed`.
- `suite-completa.txt` (automática, da verificação)
  - Título: Suíte inteira e lint verdes
  - Prova: com todos os componentes da 0.2.0 juntos, a suíte inteira passa e o lint do projeto não tem aviso (RNF-03, RF-41).
  - Trecho: `Test Files  N passed (N)`, `Tests  N passed (N)` e `OK: suíte inteira e lint verdes com os componentes da 0.2.0`.
  - Falha: `failed` numa das contagens ou o lint terminando com erro.
- `build-0-2.txt` (automática, da verificação)
  - Título: Build com o índice e a entrada do Prose
  - Prova: o build gera o índice e a entrada `prose`; o `dist/index.js` não importa o parser de Markdown e não tem o `Prose`, que fica em `@ishtar-sink/vega/prose` (RF-41, RNF-06, CT-24).
  - Trecho: `dist/index.js`, `dist/prose.js`, `exportações no dist/index.js: 122`, `Prose na entrada própria: function` e `OK: índice com os componentes da 0.2.0 e o Prose só em @ishtar-sink/vega/prose`.
  - Falha: erro do `vite build`, `ERRO: parser de Markdown no dist/index.js`, `ERRO: Prose no índice` ou `ERR_PACKAGE_PATH_NOT_EXPORTED`.
- `sem-rede.txt` (automática, da verificação)
  - Título: Pacote gerado sem requisições de rede
  - Prova: o JS e o CSS do `dist/` não têm API de rede nem URL externa (RNF-09, [project/security-01]).
  - Trecho: a linha `OK: nenhuma requisição de rede nem URL externa no dist (JS e CSS)`.
  - Falha: uma linha `dist/...:<linha>:` com a ocorrência e `ERRO: chamada de rede no dist` ou `ERRO: URL externa no dist`.
