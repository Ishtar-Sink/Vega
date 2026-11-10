### Baseline

- `pnpm lint`
- `pnpm typecheck`
- `pnpm vitest run 2>&1 | grep -E '^ +(Test Files|Tests) '`
- `pnpm build >/dev/null 2>&1 && find dist -maxdepth 1 -type f | sort`
- `npm pack --dry-run --json 2>/dev/null | node -e "let s = ''; process.stdin.on('data', (d) => (s += d)).on('end', () => { for (const f of JSON.parse(s)[0].files.map((f) => f.path).filter((p) => !p.startsWith('dist/') || !p.includes('/', 5)).sort()) console.log(f); });"`

### Verificação

```bash
pnpm exec prettier --check .github
# evidência: actionlint.txt
docker run --rm -v "$PWD:/repo" --workdir /repo rhysd/actionlint:1.7.7 -color=false .github/workflows/release.yml .github/workflows/ci.yml && echo 'OK: actionlint sem problemas nos workflows'
# evidência: release-ensaio.txt
( set -e; RELEASE_STEPS=$(mktemp); trap 'rm -f "$RELEASE_STEPS"' EXIT; sed -n -E 's/^ +- run: (.*)$/\1/p' .github/workflows/release.yml > "$RELEASE_STEPS"; if ! grep -qx 'npm publish --provenance --access public' "$RELEASE_STEPS"; then echo 'ERRO: passo de publicação ausente'; exit 1; fi; while IFS= read -r step; do case "$step" in npm\ publish*) echo "(pulado localmente) \$ $step"; continue ;; esac; echo "\$ $step"; GITHUB_REF_NAME=v0.1.0 bash -c "$step" || { echo "Release falhou em: $step"; exit 1; }; done < "$RELEASE_STEPS"; echo 'OK: todos os passos do release.yml antes da publicação passam com a tag v0.1.0' )
# evidência: readme-pacote.txt
node --input-type=module -e "import { readFileSync, statSync } from 'node:fs'; const readme = readFileSync('README.md', 'utf8'); if (readme.includes('Em desenvolvimento')) { console.log('ERRO: aviso Em desenvolvimento no README'); process.exit(1); } const vega = await import('@ishtar-sink/vega'); const names = [...readme.matchAll(/import \{([^}]+)\} from '@ishtar-sink\/vega'/g)].flatMap((m) => m[1].split(',').map((n) => n.trim()).filter((n) => n && !n.startsWith('type '))); const styles = [...new Set([...readme.matchAll(/'(@ishtar-sink\/vega\/[a-z-]+\.css)'/g)].map((m) => m[1]))]; const missing = names.filter((n) => !(n in vega)); for (const s of styles) console.log(s, '->', statSync(new URL(import.meta.resolve(s))).size > 0 ? 'ok' : 'vazio'); console.log('imports do README:', [...new Set(names)].sort().join(', ')); if (missing.length > 0 || !styles.includes('@ishtar-sink/vega/styles.css') || !styles.includes('@ishtar-sink/vega/tokens.css')) { console.log('ERRO: README fora do pacote', missing.join(', ')); process.exit(1); } console.log('OK: imports e estilos do README existem no pacote');"
# evidência: npm-view.txt
npm view @ishtar-sink/vega@0.1.0 name version dist.attestations.provenance.predicateType dist.tarball --json
# evidência: release-ci.txt
gh run list --repo Ishtar-Sink/Vega --workflow release.yml --json headBranch,event,status,conclusion,url --jq '.[] | select(.headBranch == "v0.1.0") | [.headBranch, .event, .status, .conclusion, .url] | @tsv' | grep -P '^v0\.1\.0\tpush\tcompleted\tsuccess\t'
# evidência: changelog.diff
git diff 30a65f3 08cb228 -- CHANGELOG.md | grep -q '^+## \[0.1.0\]' && git diff 30a65f3 08cb228 -- CHANGELOG.md
# evidência: readme.diff
git diff 30a65f3 08cb228 -- README.md | grep -q '^-> \*\*Em desenvolvimento' && git diff 30a65f3 08cb228 -- README.md
# evidência: release-workflow.diff
git diff 30a65f3 08cb228 -- .github/workflows/release.yml | grep -q '^+.*npm publish --provenance --access public' && git diff 30a65f3 08cb228 -- .github/workflows/release.yml
```

Resultado esperado: código 0. Os três diffs comparam `30a65f3`, o último commit antes da tarefa, com `08cb228`, o último commit dela, porque os arquivos foram commitados antes das evidências; cada um falha se o trecho principal (`## [0.1.0]`, a remoção do aviso ou o `npm publish --provenance`) não estiver no diff. Os comandos até a conferência do README (`readme-pacote.txt`) são locais e passam logo depois dos passos 2 a 4; `npm view` e `gh run list` só passam depois dos passos manuais do passo 6 (antes, `npm view` responde `E404` e o `grep` não acha a execução). `npm-view.txt` com `"version": "0.1.0"` e `"dist.attestations.provenance.predicateType": "https://slsa.dev/provenance/v1"`; `release-ci.txt` com a linha `v0.1.0	push	completed	success	https://github.com/Ishtar-Sink/Vega/actions/runs/...`.

### Evidências

- `actionlint.txt` (automática, da verificação)
  - Título: Workflows de publicação e CI válidos
  - Prova: o `release.yml` (e o `ci.yml` junto) é um workflow válido do GitHub Actions (RF-22).
  - Trecho: a linha `OK: actionlint sem problemas nos workflows`.
  - Falha: linhas `.github/workflows/release.yml:<linha>:<coluna>: ...` do actionlint.
- `release-ensaio.txt` (automática, da verificação)
  - Título: Ensaio local da publicação passa até o npm publish
  - Prova: os passos do `release.yml` antes da publicação (instalação, tag igual à versão, lint, typecheck, testes, audit e build) passam com a tag `v0.1.0`, e o passo de publicação é `npm publish --provenance --access public` (RF-22).
  - Trecho: `(pulado localmente) $ npm publish --provenance --access public` e `OK: todos os passos do release.yml antes da publicação passam com a tag v0.1.0`.
  - Falha: `Release falhou em: <passo>` ou `ERRO: passo de publicação ausente`.
- `readme-pacote.txt` (automática, da verificação)
  - Título: README descreve imports e estilos reais
  - Prova: o README não tem o aviso "Em desenvolvimento" e os componentes e CSS que ele manda importar existem no pacote gerado (RF-23).
  - Trecho: `@ishtar-sink/vega/tokens.css -> ok`, `@ishtar-sink/vega/styles.css -> ok` e `OK: imports e estilos do README existem no pacote`.
  - Falha: `ERRO: aviso Em desenvolvimento no README`, `ERRO: README fora do pacote` ou `ERR_PACKAGE_PATH_NOT_EXPORTED`.
- `npm-view.txt` (automática, da verificação)
  - Título: Versão 0.1.0 publicada no npm com provenance
  - Prova: `@ishtar-sink/vega@0.1.0` está no registro do npm com atestado de provenance SLSA, que só é emitido numa publicação feita pela CI (RF-22, RF-23, CT-15, RN-06).
  - Trecho: `"version": "0.1.0"` e `"dist.attestations.provenance.predicateType": "https://slsa.dev/provenance/v1"`.
  - Falha: `npm error 404` (`E404`) ou a chave de provenance ausente.
- `release-ci.txt` (automática, da verificação)
  - Título: Publicação feita pelo workflow da tag v0.1.0
  - Prova: a publicação veio do workflow "Release" disparado pelo push da tag `v0.1.0` e terminou com sucesso (RF-22, CT-15, [project/security-04]).
  - Trecho: a linha `v0.1.0	push	completed	success	https://github.com/Ishtar-Sink/Vega/actions/runs/...`.
  - Falha: saída vazia (nenhuma execução da tag) ou `failure` na quarta coluna.
- `changelog.diff` (automática, da verificação)
  - Título: Entrada da 0.1.0 no CHANGELOG
  - Prova: a entrada da 0.1.0 tem Adicionado, Alterado, Corrigido, Removido, os motivos, os componentes e tokens afetados e a migração do `@atria/ui` com exemplos (RF-23, [project/development-methodology-06]).
  - Trecho: `## [0.1.0]`, `### Adicionado`, `### Alterado (em relação ao @atria/ui)`, `### Removido`, `### Corrigido` e `### Migração do @atria/ui` com blocos `tsx`.
  - Falha: um grupo ausente, um componente do índice sem menção ou migração sem exemplo.
- `readme.diff` (automática, da verificação)
  - Título: README sem aviso e com instalação real
  - Prova: o README perde o aviso "Em desenvolvimento" e ganha instalação, estilos, uso e tema próprio (RF-23).
  - Trecho: a remoção de `> **Em desenvolvimento.**` e as seções `## Instalação`, `## Estilos`, `## Uso` e `## Tema próprio`.
  - Falha: o aviso continua ou os estilos citam caminhos fora do `exports`.
- `release-workflow.diff` (automática, da verificação)
  - Título: Fluxo de publicação por tag com provenance
  - Prova: o fluxo dispara em tag `v*`, tem `id-token: write` e publica com `npm publish --provenance --access public` (RF-22).
  - Trecho: `tags: - 'v*'`, `id-token: write` e `npm publish --provenance --access public`.
  - Falha: gatilho em outro evento, sem `id-token: write` ou sem `--provenance`.
- `identidade-ecossistema.png` (manual): print ou link do pull request em `Ishtar-Sink/.github` que atualiza `docs/identidade-ecossistema.md` com o comentário de origem do `tokens.ts` da Vega, os tokens `itemPalette`, `fontWeights`, `lineHeights` e `zIndices` e o `--deep-gradient`, feito pelo usuário.
  - Título: Identidade do ecossistema atualizada
  - Prova: a mudança de identidade da Vega foi levada ao documento da organização ([project/theme-08], DEC-001).
  - Trecho: o diff do documento com `itemPalette`, `fontWeights`, `lineHeights`, `zIndices`, `--deep-gradient` e a citação da Vega como fonte.
  - Falha: o documento continua sem esses itens.
