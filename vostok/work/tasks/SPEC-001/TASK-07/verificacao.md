### Baseline

- `pnpm vitest run src/text-field 2>&1 | grep -E '^\s*(Test Files|Tests)\s'`
- `pnpm exec tsc --noEmit --pretty false 2>&1 | grep -E '^(src/theme/|src/text-field/)' | sort`
- `pnpm exec eslint src/text-field --max-warnings 0`

### Verificação

```bash
# evidência: dinheiro-testes.txt
pnpm vitest run src/money-field --reporter=verbose
pnpm vitest run src/text-field
! (pnpm exec tsc --noEmit --pretty false 2>&1 | grep -E '^(src/money-field/|src/text-field/)')
pnpm exec eslint src/money-field --max-warnings 0
pnpm exec prettier --check src/money-field
! grep -nE '#[0-9a-fA-F]{3,8}\b|[0-9]px\b|[0-9]ms\b|rgba?\(|hsla?\(|font-weight: *[0-9]|line-height: *[0-9]|z-index: *[0-9]' src/money-field/money-field.module.css
! grep -rnE '\bvalue_cents\b|RN-09' src/money-field
node -e "const p = require('./package.json'); process.exit(Object.keys(p.dependencies ?? {}).length)"
```

Resultado esperado: os dois arquivos de teste de `src/money-field` com `✓` em todos os casos e `Test Files  2 passed (2)`; os testes do `TextField` continuam passando; nenhum erro de tipo nas duas pastas; ESLint sem aviso; Prettier sem diferença; nenhum literal (inclusive `font-weight`, `line-height` e `z-index` numéricos) no `.module.css` (RNF-02); nenhum `value_cents` nem referência à regra do Atria; `dependencies` vazio (RNF-06).

### Evidências

- `dinheiro-testes.txt` (automática, da verificação)
  - Título: Testes do campo de dinheiro e da máscara passam
  - Prova: a máscara e o campo formatam ao digitar e entregam sempre centavos inteiros, seguem o locale e a moeda recebidos, mantêm os textos recebidos, passam no axe, funcionam pelo teclado e repassam `className`, `style`, `data-*` e `ref` ao `<input>` (RF-12, RF-19, RF-20, CB-03, CT-09, CT-12, CT-13, RNF-01).
  - Trecho: `✓` em `converts to integer cents`, `cb03 masks and parses in en-US with USD`, `cb03 masks and parses a currency with suffix in de-DE`, `formats while typing and stores the same value in cents`, `cb03 formats and stores cents in en-US with USD`, `ct12 keeps the label and error texts it receives in another locale`, `reaches the field with Tab and types with the keyboard`, `has no axe violations`, `ct13 forwards className, style, data attributes and ref to the input` e `Test Files  2 passed (2)`.
  - Falha: `×`, `FAIL`, `failed` na linha `Tests`, `No test files found`, uma violação do axe ou um valor esperado diferente do obtido (por exemplo `expected '$14,500.5'`).
  - Espera: `2 passed (2)`
  - Requer: `src/money-field/money-mask.test.ts`, `src/money-field/money-field.test.tsx`
- `dinheiro-locale.txt` (automática): `pnpm vitest run src/money-field -t cb03 --reporter=verbose`
  - Título: Dinheiro formatado no locale e na moeda recebidos
  - Prova: com `en-US`/`USD` e `de-DE`/`EUR`, os separadores, o símbolo e a posição dele seguem o `Intl` desse locale, e o valor guardado continua em centavos inteiros (CB-03, RF-12, RF-19).
  - Trecho: `✓` nos três casos `cb03 ...` e `Tests  3 passed`.
  - Falha: `×` num caso `cb03`, `No test files found` ou menos de `3 passed`.
  - Espera: `3 passed`
  - Requer: `src/money-field/money-mask.test.ts`, `src/money-field/money-field.test.tsx`, `src/money-field/money-mask.ts`, `src/money-field/money-field.tsx`
- `dinheiro-temas.png` (print): `( set -e; R="$PWD"; D=$(mktemp -d node_modules/.vega-print-XXXX); trap 'rm -rf "$R/$D"' EXIT; printf '%s\n' "import react from '@vitejs/plugin-react';" "export default { root: '$R/$D', base: './', logLevel: 'error', plugins: [react()], build: { outDir: 'out', emptyOutDir: true } };" > "$D/vite.config.mjs"; printf '%s\n' '<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0"><div id="root"></div><script type="module" src="./main.tsx"></script></body></html>' > "$D/index.html"; printf '%s\n' "import '$R/src/theme/fonts.css';" "import '$R/src/theme/tokens.css';" "import { createRoot } from 'react-dom/client';" "import { useState } from 'react';" "import { MoneyField } from '$R/src/money-field/money-field';" "function Panel({ theme }: { theme: string }) { const [brl, setBrl] = useState<number | null>(1450050); const [usd, setUsd] = useState<number | null>(1450050); const [vazio, setVazio] = useState<number | null>(null); const [digitando, setDigitando] = useState<number | null>(1250); return (<section data-theme={theme} style={{ flex: 1, padding: 24, background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--font-body)', display: 'flex', flexDirection: 'column', gap: 12, minHeight: 360 }}><strong>{theme}</strong><MoneyField label=\"Valor (pt-BR)\" valueCents={brl} onChange={setBrl} /><MoneyField label=\"Amount (en-US)\" locale=\"en-US\" currency=\"USD\" valueCents={usd} onChange={setUsd} /><MoneyField label=\"Valor obrigatório\" valueCents={vazio} onChange={setVazio} error=\"Informe o valor.\" /><MoneyField label=\"Em digitação\" valueCents={digitando} onChange={setDigitando} data-focus=\"\" /></section>); }" "createRoot(document.getElementById('root')!).render(<div style={{ display: 'flex' }}><Panel theme=\"light\" /><Panel theme=\"dark\" /></div>);" "setTimeout(() => { const alvo = document.querySelectorAll<HTMLInputElement>('[data-focus]')[1]; alvo?.focus(); alvo?.setSelectionRange(alvo.value.length, alvo.value.length); }, 300);" > "$D/main.tsx"; pnpm exec vite build --config "$D/vite.config.mjs"; CHROME=$(ls -d "$HOME"/.cache/ms-playwright/chromium-*/chrome-linux64/chrome | sort -V | tail -1); "$CHROME" --headless --disable-gpu --no-sandbox --hide-scrollbars --allow-file-access-from-files --virtual-time-budget=3000 --window-size=1400,560 --screenshot="$VOSTOK_EVIDENCE/dinheiro-temas.png" "file://$R/$D/out/index.html" )`
  - Título: Campo de dinheiro nos temas claro e escuro
  - Prova: o campo usa o estilo do `TextField` com os tokens nos dois temas, os algarismos ficam alinhados e o erro aparece destacado (RF-12, CT-09).
  - Trecho: os valores formatados em cada locale; o anel de foco no campo em digitação do painel escuro; a mensagem de erro sob o campo vazio.
  - Falha: campo sem estilo, valor sem formatação do locale, texto ilegível no tema escuro ou foco invisível.
