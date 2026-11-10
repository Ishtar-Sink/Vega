### Baseline

- `pnpm vitest run src/index.test.ts --reporter=verbose 2>&1 | grep -E '^\s+(✓|×)' | grep -vE 'exporta (Timer|Countdown|ConnectionStatus|formatDuration|daysBetween)$' | sed -E 's/ [0-9]+ms$//' | sort`
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
( set -e; pnpm vitest run 2>&1 | grep -E '^ +(Test Files|Tests) '; pnpm lint >/dev/null; echo 'OK: suíte inteira e lint verdes com os componentes da 0.3.0' )
# evidência: build-0-3.txt
( set -e; rm -rf dist; pnpm build; find dist -maxdepth 2 -type f \( -name '*.js' -o -name 'index.d.ts' \) | sort; if grep -qE "from ['\"](react-markdown|remark-gfm|rehype-sanitize)" dist/index.js; then echo 'ERRO: parser de Markdown no dist/index.js'; exit 1; fi; node --input-type=module -e "const vega = await import('@ishtar-sink/vega'); console.log('exportações no dist/index.js:', Object.keys(vega).length); const novos = ['Timer', 'Countdown', 'ConnectionStatus', 'formatDuration', 'daysBetween']; const faltam = novos.filter((n) => !(n in vega)); console.log('novos no dist/index.js:', novos.filter((n) => n in vega).join(', ')); if (faltam.length > 0) { console.log('ERRO: faltam no índice', faltam.join(', ')); process.exit(1); } console.log('formatDuration(65000):', vega.formatDuration(65000)); console.log('daysBetween:', vega.daysBetween('2026-11-10', '2026-11-17')); if ('Prose' in vega) { console.log('ERRO: Prose no índice'); process.exit(1); } const prose = await import('@ishtar-sink/vega/prose'); console.log('Prose na entrada própria:', typeof prose.Prose);"; echo 'OK: índice com Timer, Countdown, ConnectionStatus e os dois utilitários, e o Prose só em @ishtar-sink/vega/prose' )
# evidência: sem-rede.txt
( if grep -rnE '\bfetch\(|XMLHttpRequest|sendBeacon|new WebSocket|EventSource|navigator\.connection' dist --include='*.js'; then echo 'ERRO: chamada de rede no dist'; exit 1; fi; if grep -rnoE 'https?://[A-Za-z0-9./_-]+' dist --include='*.js' --include='*.css' | grep -v 'http://www.w3.org/'; then echo 'ERRO: URL externa no dist'; exit 1; fi; echo 'OK: nenhuma requisição de rede nem URL externa no dist (JS e CSS)' )
```

Resultado esperado: código 0. `exportacoes.txt` com uma linha `✓ exporta <Nome>` por nome (127 com os nomes registrados no passo 1, se houver mais), `exporta só a superfície pública`, `não reexporta a paleta do Atria`, `não exporta o Prose, que tem entrada própria`, `exporta os tipos públicos` e o resumo sem `failed`; `build-0-3.txt` com `dist/index.js`, `dist/prose.js`, `exportações no dist/index.js: 127` (ou a contagem do passo 1), `novos no dist/index.js: Timer, Countdown, ConnectionStatus, formatDuration, daysBetween`, `formatDuration(65000): 01:05`, `daysBetween: 7`, `Prose na entrada própria: function` e a linha `OK: ...`; `sem-rede.txt` com `OK: ...`.

### Evidências

- `exportacoes.txt` (automática, da verificação)
  - Título: Índice com os componentes da 0.3.0
  - Prova: `Timer`, `Countdown`, `ConnectionStatus`, `formatDuration` e `daysBetween` são importáveis do índice, os tipos públicos compilam e a superfície é exatamente a lista (RF-19, CT-14).
  - Trecho: as linhas `✓ exporta Timer`, `✓ exporta Countdown`, `✓ exporta ConnectionStatus`, `✓ exporta formatDuration`, `✓ exporta daysBetween`, `✓ exporta só a superfície pública` e o resumo `Tests  N passed` sem `failed`.
  - Falha: `× exporta <Nome>`, diferença na lista de chaves ou `Tests ... failed`.
- `suite-completa.txt` (automática, da verificação)
  - Título: Suíte inteira e lint verdes
  - Prova: com os três componentes juntos aos da 0.2.0, a suíte inteira passa e o lint do projeto não tem aviso (RF-19, CT-14).
  - Trecho: `Test Files  N passed (N)`, `Tests  N passed (N)` e `OK: suíte inteira e lint verdes com os componentes da 0.3.0`.
  - Falha: `failed` numa das contagens ou o lint terminando com erro.
- `build-0-3.txt` (automática, da verificação)
  - Título: Build com os componentes novos no índice
  - Prova: o pacote gerado traz os cinco valores novos no `dist/index.js`, os dois utilitários funcionam (`01:05` e `7` dias), o parser de Markdown e o `Prose` continuam fora do índice (RF-19, CT-14).
  - Trecho: `exportações no dist/index.js: 127`, `novos no dist/index.js: Timer, Countdown, ConnectionStatus, formatDuration, daysBetween`, `formatDuration(65000): 01:05`, `daysBetween: 7`, `Prose na entrada própria: function` e `OK: índice com Timer, Countdown, ConnectionStatus e os dois utilitários, ...`.
  - Falha: erro do `vite build`, `ERRO: faltam no índice ...`, `ERRO: parser de Markdown no dist/index.js` ou `ERRO: Prose no índice`.
- `sem-rede.txt` (automática, da verificação)
  - Título: Pacote gerado sem requisições de rede
  - Prova: o JS e o CSS do `dist/` não têm API de rede nem URL externa, mesmo com o `ConnectionStatus` no pacote (RNF-08, [project/security-01]).
  - Trecho: a linha `OK: nenhuma requisição de rede nem URL externa no dist (JS e CSS)`.
  - Falha: uma linha `dist/...:<linha>:` com a ocorrência e `ERRO: chamada de rede no dist` ou `ERRO: URL externa no dist`.
