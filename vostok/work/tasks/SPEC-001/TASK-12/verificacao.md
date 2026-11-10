### Baseline

- `pnpm vitest run src/theme src/button src/icon-button src/menu-button src/text-field src/select-field src/checkbox src/segmented-field src/autocomplete src/tag-field src/color-field src/calendar src/date-field src/time-field src/date-time-field src/period-field src/money-field src/card src/page-header src/toolbar src/tabs src/view-switcher src/form-layout src/icons src/dialog src/confirm-dialog src/toast src/empty-state src/loading-state src/error-state src/progress-bar src/brand-logo src/badge src/item-swatch 2>&1 | grep -E '^ +(Test Files|Tests) '`
- `pnpm typecheck`
- `pnpm exec eslint src/theme src/button src/icon-button src/menu-button src/text-field src/select-field src/checkbox src/segmented-field src/autocomplete src/tag-field src/color-field src/calendar src/date-field src/time-field src/date-time-field src/period-field src/money-field src/card src/page-header src/toolbar src/tabs src/view-switcher src/form-layout src/icons src/dialog src/confirm-dialog src/toast src/empty-state src/loading-state src/error-state src/progress-bar src/brand-logo src/badge src/item-swatch --max-warnings 0`
- `pnpm exec prettier --check src/theme src/button src/icon-button src/menu-button src/text-field src/select-field src/checkbox src/segmented-field src/autocomplete src/tag-field src/color-field src/calendar src/date-field src/time-field src/date-time-field src/period-field src/money-field src/card src/page-header src/toolbar src/tabs src/view-switcher src/form-layout src/icons src/dialog src/confirm-dialog src/toast src/empty-state src/loading-state src/error-state src/progress-bar src/brand-logo src/badge src/item-swatch`

### Verificação

```bash
# evidência: exportacoes.txt
pnpm vitest run src/index.test.ts
pnpm exec eslint src/index.ts src/index.test.ts --max-warnings 0
pnpm exec prettier --check src/index.ts src/index.test.ts
pnpm typecheck
# evidência: build.txt
( set -e; rm -rf dist; pnpm build; find dist -maxdepth 1 -type f | sort; test -s dist/index.js && test -s dist/index.d.ts && test -s dist/style.css && test -s dist/tokens.css; grep -c "url('../fonts/" dist/tokens.css; node --input-type=module -e "import { statSync } from 'node:fs'; const vega = await import('@ishtar-sink/vega'); console.log('exportações no dist/index.js:', Object.keys(vega).length); for (const p of ['@ishtar-sink/vega/styles.css', '@ishtar-sink/vega/tokens.css']) { const url = new URL(import.meta.resolve(p)); console.log(p, '->', url.pathname.split('/').slice(-2).join('/'), statSync(url).size > 0 ? 'ok' : 'vazio'); }"; npm pack --dry-run --json 2>/dev/null | node -e "let s = ''; process.stdin.on('data', (d) => (s += d)).on('end', () => { const files = JSON.parse(s)[0].files.map((f) => f.path).sort(); for (const f of files.filter((f) => !f.startsWith('dist/') || !f.includes('/', 5))) console.log(f); const need = ['dist/index.js', 'dist/index.d.ts', 'dist/style.css', 'dist/tokens.css', 'fonts/OFL-Inter.txt', 'fonts/OFL-Outfit.txt']; const miss = need.filter((n) => !files.includes(n)); if (miss.length > 0) { console.log('ERRO: faltam no pacote', miss.join(', ')); process.exit(1); } console.log('OK: pacote com build, tipos, CSS, fontes e licenças'); });" )
# evidência: sem-rede.txt
( if grep -rnE '\bfetch\(|XMLHttpRequest|sendBeacon|new WebSocket|EventSource|navigator\.connection' dist --include='*.js'; then echo 'ERRO: chamada de rede no dist'; exit 1; fi; if grep -rnoE 'https?://[A-Za-z0-9./_-]+' dist --include='*.js' --include='*.css' | grep -v 'http://www.w3.org/'; then echo 'ERRO: URL externa no dist'; exit 1; fi; echo 'OK: nenhuma requisição de rede nem URL externa no dist (JS e CSS)' )
```

Resultado esperado: todos com código 0; `exportacoes.txt` com `Tests  75 passed (75)` (72 nomes, mais superfície exata, paleta do Atria e tipos); `build.txt` com os arquivos do `dist/`, os dois CSS resolvidos pelo `exports` e a linha `OK: pacote ...`; `sem-rede.txt` com a linha `OK: ...`. O namespace SVG `http://www.w3.org/` não é requisição e fica fora da busca.

### Evidências

- `exportacoes.txt` (automática, da verificação)
  - Título: Todos os componentes, funções e tipos exportados
  - Prova: cada componente, função auxiliar e item do tema é importável do índice, a superfície é exatamente a lista e `paletteFor`/`artPalettes` não aparecem; os tipos das props compilam (RF-02, RF-09 a RF-18, CT-02).
  - Trecho: as linhas `✓ ... exporta Button` (uma por nome), `exporta só a superfície pública`, `não reexporta a paleta do Atria` e `Tests  75 passed (75)`.
  - Falha: `× exporta <Nome>`, diferença na lista de chaves ou `Tests ... failed`.
- `build.txt` (automática, da verificação)
  - Título: Build gera ESM, tipos, CSS e pacote completo
  - Prova: `pnpm build` gera `dist/index.js` ESM importável pelo nome do pacote, `dist/index.d.ts`, `dist/style.css` e `dist/tokens.css` com as fontes; o `exports` resolve `styles.css` e `tokens.css`; o tarball tem as fontes e as licenças OFL (RF-01, CT-01, CT-08).
  - Trecho: `dist/index.js`, `dist/index.d.ts`, `dist/style.css`, `dist/tokens.css`, `exportações no dist/index.js: 72`, `styles.css -> dist/style.css ok`, `fonts/OFL-Inter.txt` e `OK: pacote com build, tipos, CSS, fontes e licenças`.
  - Falha: erro do `vite build`, `ERR_MODULE_NOT_FOUND` no `import`, `vazio` num CSS ou `ERRO: faltam no pacote`.
- `sem-rede.txt` (automática, da verificação)
  - Título: Pacote gerado sem requisições de rede
  - Prova: o JS e o CSS do `dist/` não têm `fetch`, `XMLHttpRequest`, `sendBeacon`, `WebSocket`, `EventSource` nem URL externa (RNF-04, [project/security-01]).
  - Trecho: a linha `OK: nenhuma requisição de rede nem URL externa no dist (JS e CSS)`.
  - Falha: uma linha `dist/...:<linha>:` com a ocorrência e `ERRO: chamada de rede no dist` ou `ERRO: URL externa no dist`.
