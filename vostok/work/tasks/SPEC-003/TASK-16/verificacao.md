### Baseline

- `pnpm exec prettier --check CHANGELOG.md README.md package.json`
- `node -p "require('./package.json').version"` (muda): passa de `0.1.0` para `0.2.0`
- `grep -E '^## ' CHANGELOG.md README.md` (muda): ganha `## [0.2.0]` no CHANGELOG e as seções Ícones e Texto formatado no README

### Verificação

```bash
# evidência: changelog.txt
node --input-type=module -e "import { readFileSync } from 'node:fs'; const version = JSON.parse(readFileSync('package.json', 'utf8')).version; if (version !== '0.2.0') { console.log('ERRO: versão ' + version + ' no package.json'); process.exit(1); } console.log('versão do package.json:', version); const log = readFileSync('CHANGELOG.md', 'utf8'); const start = log.indexOf('## [0.2.0]'); if (start < 0) { console.log('ERRO: entrada [0.2.0] ausente'); process.exit(1); } const end = log.indexOf('## [0.1.0]'); const entry = log.slice(start, end < 0 ? undefined : end); console.log(entry.split('\n')[0]); const groups = ['### Adicionado', '### Alterado', '### Corrigido', '### Removido']; const need = ['Switch', 'RadioGroup', 'TextAreaField', 'Disclosure', 'Accordion', 'Callout', 'BottomSheet', 'Prose', 'CardLink', 'CardButton', 'FocusHeader', 'Topbar', 'Sidebar', 'BottomNav', 'AppShell', 'HomeIcon', 'BookOpenIcon', 'LayersIcon', 'TimerIcon', 'UsersIcon', 'MenuIcon', 'ChevronLeftIcon', 'ChevronRightIcon', 'ChevronDownIcon', 'ArrowLeftIcon', 'CloseIcon', 'PlusIcon', 'MinusIcon', 'DownloadIcon', 'UploadIcon', 'FlagIcon', 'RefreshIcon', 'EyeIcon', 'CheckIcon', 'CircleCheckIcon', 'InfoIcon', 'AlertTriangleIcon', 'CircleAlertIcon', 'WifiOffIcon', 'CloudCheckIcon', 'UserIcon', 'SettingsIcon', 'LogOutIcon', 'SunIcon', 'MoonIcon', 'LightbulbIcon', 'ClockIcon', 'CalendarIcon', 'PencilIcon', 'size', 'block', 'valueText', 'indeterminate', '@ishtar-sink/vega/prose', 'lucide-react']; const missingGroups = groups.filter((g) => !entry.includes(g)); const missing = need.filter((n) => !entry.includes(String.fromCharCode(96) + n + String.fromCharCode(96))); console.log('grupos:', groups.filter((g) => entry.includes(g)).join(', ')); console.log('itens conferidos:', need.length - missing.length, 'de', need.length); if (missingGroups.length > 0 || missing.length > 0) { console.log('ERRO: faltam no CHANGELOG', [...missingGroups, ...missing].join(', ')); process.exit(1); } console.log('OK: CHANGELOG da 0.2.0 com os quatro grupos e todos os componentes, ícones e props novos');"
pnpm exec prettier --check CHANGELOG.md README.md package.json
# evidência: release-ensaio.txt
( set -e; RELEASE_STEPS=$(mktemp); trap 'rm -f "$RELEASE_STEPS"' EXIT; sed -n -E 's/^ +- run: (.*)$/\1/p' .github/workflows/release.yml > "$RELEASE_STEPS"; if ! grep -qx 'npm publish --provenance --access public' "$RELEASE_STEPS"; then echo 'ERRO: passo de publicação ausente'; exit 1; fi; while IFS= read -r step; do case "$step" in npm\ publish*) echo "(pulado localmente) \$ $step"; continue ;; esac; echo "\$ $step"; GITHUB_REF_NAME=v0.2.0 bash -c "$step" || { echo "Release falhou em: $step"; exit 1; }; done < "$RELEASE_STEPS"; echo 'OK: todos os passos do release.yml antes da publicação passam com a tag v0.2.0' )
# evidência: readme-pacote.txt
node --input-type=module -e "import { readFileSync, statSync } from 'node:fs'; const readme = readFileSync('README.md', 'utf8'); const check = async (spec) => { const mod = await import(spec); const re = new RegExp('import \\{([^}]+)\\} from \'' + spec.replace('/', '\\/') + '\'', 'g'); const names = [...readme.matchAll(re)].flatMap((m) => m[1].split(',').map((n) => n.trim()).filter((n) => n && !n.startsWith('type '))); console.log('imports de', spec + ':', [...new Set(names)].sort().join(', ')); return names.filter((n) => !(n in mod)); }; const missing = [...(await check('@ishtar-sink/vega')), ...(await check('@ishtar-sink/vega/prose'))]; const styles = [...new Set([...readme.matchAll(/'(@ishtar-sink\/vega\/[a-z-]+\.css)'/g)].map((m) => m[1]))]; for (const s of styles) console.log(s, '->', statSync(new URL(import.meta.resolve(s))).size > 0 ? 'ok' : 'vazio'); const lucide = readme.includes('lucide-react') && readme.includes('ISC'); console.log('licença do Lucide citada:', lucide ? 'sim' : 'não'); if (missing.length > 0 || !lucide || !readme.includes(\"from '@ishtar-sink/vega/prose'\") || !styles.includes('@ishtar-sink/vega/styles.css') || !styles.includes('@ishtar-sink/vega/tokens.css')) { console.log('ERRO: README fora do pacote', missing.join(', ')); process.exit(1); } console.log('OK: imports, estilos e a entrada do Prose do README existem no pacote');"
# evidência: npm-view.txt
npm view @ishtar-sink/vega@0.2.0 name version license dist.attestations.provenance.predicateType dist-tags dist.tarball --json
# evidência: release-ci.txt
gh run list --repo Ishtar-Sink/Vega --workflow release.yml --json headBranch,event,status,conclusion,url --jq '.[] | select(.headBranch == "v0.2.0") | [.headBranch, .event, .status, .conclusion, .url] | @tsv' | grep -P '^v0\.2\.0\tpush\tcompleted\tsuccess\t'
```

Resultado esperado: código 0. `changelog.txt`, `release-ensaio.txt` e `readme-pacote.txt` são locais e passam logo depois dos passos 2 a 4 (o ensaio roda o `pnpm build`, que o `readme-pacote.txt` usa); `npm view` e `gh run list` só passam depois dos passos manuais do passo 6 (antes, `npm view` responde `E404` e o `grep` não acha a execução). `npm-view.txt` com `"version": "0.2.0"`, `"license": "AGPL-3.0-only"`, `"dist.attestations.provenance.predicateType": "https://slsa.dev/provenance/v1"` e `"latest": "0.2.0"`; `release-ci.txt` com a linha `v0.2.0	push	completed	success	https://github.com/Ishtar-Sink/Vega/actions/runs/...`.

### Evidências

- `changelog.txt` (automática, da verificação)
  - Título: CHANGELOG e versão da 0.2.0
  - Prova: o `package.json` está na 0.2.0 e a entrada `[0.2.0]` tem os quatro grupos e cita cada componente, ícone e prop nova do lote (RF-42, [project/development-methodology-05], [project/development-methodology-06]).
  - Trecho: `versão do package.json: 0.2.0`, `## [0.2.0] - ...`, `grupos: ### Adicionado, ### Alterado, ### Corrigido, ### Removido`, `itens conferidos: N de N` e `OK: CHANGELOG da 0.2.0 ...`.
  - Falha: `ERRO: versão 0.1.0 no package.json`, `ERRO: entrada [0.2.0] ausente` ou `ERRO: faltam no CHANGELOG ...`.
- `release-ensaio.txt` (automática, da verificação)
  - Título: Ensaio local da publicação da 0.2.0
  - Prova: os passos do `release.yml` antes da publicação (instalação, tag igual à versão, lint, typecheck, testes, audit e build) passam com a tag `v0.2.0` (RF-42, RN-06).
  - Trecho: `(pulado localmente) $ npm publish --provenance --access public` e `OK: todos os passos do release.yml antes da publicação passam com a tag v0.2.0`.
  - Falha: `Release falhou em: <passo>` ou `ERRO: passo de publicação ausente`.
- `readme-pacote.txt` (automática, da verificação)
  - Título: README descreve imports reais da 0.2.0
  - Prova: os componentes, ícones, estilos e o `Prose` que o README manda importar existem no pacote gerado, e a licença do Lucide é citada (RF-42).
  - Trecho: `imports de @ishtar-sink/vega: ...HomeIcon...`, `imports de @ishtar-sink/vega/prose: Prose`, os dois CSS com `ok`, `licença do Lucide citada: sim` e `OK: imports, estilos e a entrada do Prose do README existem no pacote`.
  - Falha: `ERRO: README fora do pacote` ou `ERR_PACKAGE_PATH_NOT_EXPORTED`.
- `npm-view.txt` (automática, da verificação)
  - Título: Versão 0.2.0 publicada no npm com provenance
  - Prova: `@ishtar-sink/vega@0.2.0` está no registro do npm como `latest`, com a licença e o atestado de provenance SLSA, que só sai numa publicação pela CI (RF-42, CT-39, RN-06).
  - Trecho: `"version": "0.2.0"`, `"license": "AGPL-3.0-only"`, `"dist.attestations.provenance.predicateType": "https://slsa.dev/provenance/v1"` e `"latest": "0.2.0"`.
  - Falha: `npm error 404` (`E404`), a chave de provenance ausente ou `latest` em outra versão.
- `release-ci.txt` (automática, da verificação)
  - Título: Publicação feita pelo workflow da tag v0.2.0
  - Prova: a publicação veio do workflow "Release" disparado pelo push da tag `v0.2.0` e terminou com sucesso (RF-42, CT-39, [project/security-04]).
  - Trecho: a linha `v0.2.0	push	completed	success	https://github.com/Ishtar-Sink/Vega/actions/runs/...`.
  - Falha: saída vazia (nenhuma execução da tag) ou `failure` na quarta coluna.
