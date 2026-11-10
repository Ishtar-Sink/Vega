### Baseline

- `pnpm vitest run src/theme 2>&1 | grep -E '^\s*(Test Files|Tests)\s'`
- `pnpm exec tsc --noEmit --pretty false 2>&1 | grep -E '^src/theme/' | sort`
- `pnpm exec eslint src/theme --max-warnings 0`

### Verificação

```bash
# evidência: campos-testes.txt
pnpm vitest run src/text-field src/select-field src/checkbox src/segmented-field src/autocomplete src/tag-field --reporter=verbose
! (pnpm exec tsc --noEmit --pretty false 2>&1 | grep -E '^(src/text-field/|src/select-field/|src/checkbox/|src/segmented-field/|src/autocomplete/|src/tag-field/)')
pnpm exec eslint src/text-field src/select-field src/checkbox src/segmented-field src/autocomplete src/tag-field --max-warnings 0
pnpm exec prettier --check src/text-field src/select-field src/checkbox src/segmented-field src/autocomplete src/tag-field
! grep -nE '#[0-9a-fA-F]{3,8}\b|[0-9]px\b|[0-9]ms\b|rgba?\(|hsla?\(|font-weight: *[0-9]|line-height: *[0-9]|z-index: *[0-9]' src/text-field/text-field.module.css src/select-field/select-field.module.css src/checkbox/checkbox.module.css src/segmented-field/segmented-field.module.css src/autocomplete/autocomplete.module.css src/tag-field/tag-field.module.css
! grep -rnE '\b(empty_text|list_label|remove_label)\b' src/autocomplete src/tag-field
node -e "const p = require('./package.json'); process.exit(Object.keys(p.dependencies ?? {}).length)"
```

Resultado esperado: os seis arquivos de teste com `✓` em todos os casos e `Test Files  6 passed (6)`; nenhum erro de tipo nas seis pastas; ESLint sem aviso; Prettier sem diferença; nenhum literal (inclusive `font-weight`, `line-height` e `z-index` numéricos) de cor, `px` ou `ms` nos seis `.module.css` (RNF-02); nenhuma prop em `snake_case` restante; `dependencies` vazio (RNF-06).

### Evidências

- `campos-testes.txt` (automática, da verificação)
  - Título: Testes dos campos de texto e seleção passam
  - Prova: os seis campos passam no axe, funcionam pelo teclado, mostram o erro com `role="alert"` ligado ao campo, usam os textos padrão em pt-br ou os sobrescritos e repassam `className`, `style`, `data-*` e `ref` (RF-10, RF-19, RF-20, CT-09, CT-12, CT-13, RNF-01).
  - Trecho: `✓` em `has no axe violations` nos seis, nos casos de teclado (`types with the keyboard after tabbing in`, `toggles with the keyboard`, `moves the choice with the arrow keys`, `opens the listbox with ArrowDown and picks with Enter`, `picks the active option with the arrow keys and Enter`, `adds a pill on Enter and on comma`), em `uses the pt-br default texts` e `ct12 shows the overridden texts` do `Autocomplete` e do `TagField`, nas seis linhas `ct13 forwards className, style, data attributes and ref ...` e `Test Files  6 passed (6)`.
  - Falha: `×`, `FAIL`, `failed` na linha `Tests`, `No test files found` ou uma violação do axe listada.
  - Espera: `6 passed (6)`
  - Requer: `src/text-field/text-field.test.tsx`, `src/select-field/select-field.test.tsx`, `src/checkbox/checkbox.test.tsx`, `src/segmented-field/segmented-field.test.tsx`, `src/autocomplete/autocomplete.test.tsx`, `src/tag-field/tag-field.test.tsx`
- `campos-textos-padrao.txt` (automática): `pnpm vitest run src/autocomplete src/tag-field -t "texts" --reporter=verbose`
  - Título: Textos dos campos em pt-br e sobrescrevíveis
  - Prova: sem textos passados, o `Autocomplete` e o `TagField` mostram os padrões em pt-br; com textos passados, mostram os recebidos (RF-19, CT-12).
  - Trecho: `✓` em `uses the pt-br default texts` e `ct12 shows the overridden texts` nos dois arquivos e `Tests  4 passed`.
  - Falha: `×` num desses casos, `No test files found` ou menos de `4 passed`.
  - Espera: `4 passed`
  - Requer: `src/autocomplete/autocomplete.test.tsx`, `src/tag-field/tag-field.test.tsx`, `src/autocomplete/autocomplete.tsx`, `src/tag-field/tag-field.tsx`
- `campos-temas.png` (print): `( set -e; R="$PWD"; D=$(mktemp -d node_modules/.vega-print-XXXX); trap 'rm -rf "$R/$D"' EXIT; printf '%s\n' "import react from '@vitejs/plugin-react';" "export default { root: '$R/$D', base: './', logLevel: 'error', plugins: [react()], build: { outDir: 'out', emptyOutDir: true } };" > "$D/vite.config.mjs"; printf '%s\n' '<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0"><div id="root"></div><script type="module" src="./main.tsx"></script></body></html>' > "$D/index.html"; printf '%s\n' "import '$R/src/theme/fonts.css';" "import '$R/src/theme/tokens.css';" "import { createRoot } from 'react-dom/client';" "import { useState } from 'react';" "import { TextField } from '$R/src/text-field/text-field';" "import { SelectField } from '$R/src/select-field/select-field';" "import { Checkbox } from '$R/src/checkbox/checkbox';" "import { SegmentedField } from '$R/src/segmented-field/segmented-field';" "import { Autocomplete } from '$R/src/autocomplete/autocomplete';" "import { TagField } from '$R/src/tag-field/tag-field';" "const fruits = [{ value: 'maca', label: 'Maçã' }, { value: 'pera', label: 'Pera' }, { value: 'uva', label: 'Uva' }];" "function Panel({ theme }: { theme: string }) { const [sel, setSel] = useState('pera'); const [seg, setSeg] = useState('mes'); const [ac, setAc] = useState<string[]>(['maca', 'uva']); const [tags, setTags] = useState(['vega', 'tema']); return (<section data-theme={theme} style={{ flex: 1, padding: 24, background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--font-body)', display: 'flex', flexDirection: 'column', gap: 12, minHeight: 360 }}><strong>{theme}</strong><TextField label=\"Nome\" help=\"Como aparece no perfil\" defaultValue=\"Ana\" /><TextField label=\"E-mail\" error=\"E-mail inválido\" defaultValue=\"ana@\" /><SelectField label=\"Fruta\" options={fruits} value={sel} onChange={setSel} /><Checkbox label=\"Aceito os termos\" defaultChecked /><SegmentedField label=\"Período\" options={[{ value: 'dia', label: 'Dia' }, { value: 'mes', label: 'Mês' }, { value: 'ano', label: 'Ano' }]} value={seg} onChange={setSeg} /><Autocomplete multiple label=\"Favoritas\" options={fruits} value={ac} onChange={setAc} /><TagField label=\"Etiquetas\" value={tags} onChange={setTags} help=\"Enter adiciona\" /></section>); }" "createRoot(document.getElementById('root')!).render(<div style={{ display: 'flex' }}><Panel theme=\"light\" /><Panel theme=\"dark\" /></div>);" "setTimeout(() => { const [light, dark] = document.querySelectorAll('section'); light?.querySelector<HTMLElement>('[aria-haspopup=\"listbox\"]')?.click(); dark?.querySelector<HTMLInputElement>('[role=\"combobox\"]')?.click(); dark?.querySelector<HTMLInputElement>('[role=\"combobox\"]')?.focus(); }, 300);" > "$D/main.tsx"; pnpm exec vite build --config "$D/vite.config.mjs"; CHROME=$(ls -d "$HOME"/.cache/ms-playwright/chromium-*/chrome-linux64/chrome | sort -V | tail -1); "$CHROME" --headless --disable-gpu --no-sandbox --hide-scrollbars --allow-file-access-from-files --virtual-time-budget=3000 --window-size=1400,720 --screenshot="$VOSTOK_EVIDENCE/campos-temas.png" "file://$R/$D/out/index.html" )`
  - Título: Campos nos temas claro e escuro
  - Prova: os campos usam os tokens nos dois temas, o erro aparece em vermelho com o campo marcado e o foco é visível (RF-10, CT-09).
  - Trecho: o `SelectField` aberto com a opção ativa no painel claro; o `Autocomplete` múltiplo aberto com as duas pílulas no painel escuro; o erro do `TextField` sobre o fundo `dangerSoft`; o `Checkbox` marcado e a opção escolhida do `SegmentedField`.
