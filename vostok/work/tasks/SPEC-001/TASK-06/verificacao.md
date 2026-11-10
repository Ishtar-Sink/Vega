### Baseline

- `pnpm vitest run src/button src/icon-button --reporter=verbose 2>&1 | grep -E '^\s+(✓|×)' | sed -E 's/ [0-9]+ms$//' | sort`
- `pnpm exec tsc --noEmit 2>&1 | grep -E '^(src/button/|src/icon-button/)' | sort`
- `pnpm exec eslint src/button src/icon-button --max-warnings 0`

### Verificação

```bash
# evidência: testes-data-hora.txt
pnpm vitest run src/calendar src/date-field src/time-field src/date-time-field src/period-field --reporter=verbose
test -z "$(pnpm exec tsc --noEmit 2>&1 | grep -E '^(src/calendar/|src/date-field/|src/time-field/|src/date-time-field/|src/period-field/)')"
pnpm exec eslint src/calendar src/date-field src/time-field src/date-time-field src/period-field --max-warnings 0
pnpm exec prettier --check src/calendar src/date-field src/time-field src/date-time-field src/period-field
test -z "$(grep -nE '#[0-9a-fA-F]{3,8}\b|rgba?\(|[0-9.]+(px|ms)\b|font-weight: *[0-9]|line-height: *[0-9]|z-index: *[0-9]' src/calendar/*.module.css src/date-field/*.module.css src/time-field/*.module.css src/date-time-field/*.module.css src/period-field/*.module.css | grep -v '@media')"
```

### Evidências

- `testes-data-hora.txt` (automática, da verificação)
  - Título: Testes dos campos de data e hora passam
  - Prova: os cinco componentes e as funções `parseTime`, `maskTime` e `resolvePeriod` passam nos testes de papel e nome acessível, axe, teclado, props nativas, textos sobrescritos, locale `en-US` e relógio do sistema falso (RF-11, RF-19, RF-20, CT-09, CT-12, CT-13, CT-16, CB-03).
  - Trecho: as linhas `✓` de `formats in the received locale and keeps the pt-BR texts`, `marks today from the injected date, not the system clock`, `passes className, style and data attributes to the control` (e `... to the root` no `Calendar`), `forwards the ref to ...`, `has no axe violations` e o resumo `Tests  N passed` sem `failed`.
  - Falha: linhas com `×`, `FAIL` ou `Tests  N failed`.
  - Requer: `src/calendar/calendar.test.tsx`, `src/date-field/date-field.test.tsx`, `src/time-field/time-field.test.tsx`, `src/date-time-field/date-time-field.test.tsx`, `src/period-field/period-field.test.tsx`
- `datas-outro-fuso.txt` (automática): `TZ=Pacific/Kiritimati pnpm vitest run src/calendar src/date-field src/date-time-field src/period-field --reporter=verbose`
  - Título: Datas iguais em outro fuso horário
  - Prova: com o processo num fuso de UTC+14, os mesmos testes de data passam, mostrando que o resultado não depende do relógio nem do fuso da máquina (CT-16, RF-11).
  - Trecho: as mesmas linhas `✓` de `testes-data-hora.txt` para as quatro pastas e o resumo sem `failed`.
  - Falha: algum `×` em teste de dia atual, grade do mês ou campos ocultos do período.
  - Requer: `src/calendar/calendar.test.tsx`, `src/date-field/date-field.test.tsx`, `src/date-time-field/date-time-field.test.tsx`, `src/period-field/period-field.test.tsx`
- `data-hora-temas.png` (print): `( set -e; R="$PWD"; D=$(mktemp -d node_modules/.vega-print-XXXX); trap 'rm -rf "$R/$D"' EXIT; printf '%s\n' "import react from '@vitejs/plugin-react';" "export default { root: '$R/$D', base: './', logLevel: 'error', plugins: [react()], build: { outDir: 'out', emptyOutDir: true } };" > "$D/vite.config.mjs"; printf '%s\n' '<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0"><div id="root"></div><script type="module" src="./main.tsx"></script></body></html>' > "$D/index.html"; printf '%s\n' "import '$R/src/theme/fonts.css';" "import '$R/src/theme/tokens.css';" "import { createRoot } from 'react-dom/client';" "import { useState } from 'react';" "import { TimeField } from '$R/src/time-field/time-field';" "import { DateField } from '$R/src/date-field/date-field';" "import { DateTimeField } from '$R/src/date-time-field/date-time-field';" "import { PeriodField } from '$R/src/period-field/period-field';" "import type { PeriodPreset, PeriodValue } from '$R/src/period-field/period';" "const TODAY = '2026-11-10';" "const presets: PeriodPreset[] = [{ id: 'this_month', label: 'Este mês', range: (today) => ({ from: today.slice(0, 8) + '01', to: today }) }, { id: 'last_30_days', label: 'Últimos 30 dias', range: -30 }, { id: 'next_30_days', label: 'Próximos 30 dias', range: 30 }, { id: 'all', label: 'Qualquer período', range: () => null }];" "function Panel({ theme }: { theme: string }) { const [hora, setHora] = useState('09:30'); const [inicio, setInicio] = useState('2026-11-10T14:15'); const [entrega, setEntrega] = useState('2026-11-18'); const [periodo, setPeriodo] = useState<PeriodValue>({ preset: 'custom', from: '2026-11-03', to: '2026-11-13' }); return (<section data-theme={theme} style={{ flex: 1, padding: 24, background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--font-body)', display: 'flex', flexDirection: 'column', gap: 12, minHeight: 360 }}><strong>{theme}</strong><div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}><TimeField label=\"Horário\" value={hora} onChange={setHora} /><DateTimeField label=\"Início\" value={inicio} onChange={setInicio} today={TODAY} /><DateField label=\"Vencimento\" value=\"\" onChange={() => undefined} today={TODAY} error=\"Informe o vencimento.\" /></div><div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}><DateField label=\"Entrega\" value={entrega} onChange={setEntrega} today={TODAY} data-open=\"date\" /><PeriodField label=\"Período\" value={periodo} onChange={setPeriodo} presets={presets} placement=\"form\" today={TODAY} data-open=\"period\" /></div></section>); }" "createRoot(document.getElementById('root')!).render(<div style={{ display: 'flex' }}><Panel theme=\"light\" /><Panel theme=\"dark\" /></div>);" "setTimeout(() => { for (const s of document.querySelectorAll('section')) { s.querySelector<HTMLButtonElement>('[data-open=\"period\"]')?.click(); s.querySelector<HTMLButtonElement>('[data-open=\"date\"]')?.click(); } }, 300);" > "$D/main.tsx"; pnpm exec vite build --config "$D/vite.config.mjs"; CHROME=$(ls -d "$HOME"/.cache/ms-playwright/chromium-*/chrome-linux64/chrome | sort -V | tail -1); "$CHROME" --headless --disable-gpu --no-sandbox --hide-scrollbars --allow-file-access-from-files --virtual-time-budget=3000 --window-size=1800,780 --screenshot="$VOSTOK_EVIDENCE/data-hora-temas.png" "file://$R/$D/out/index.html" )`
  - Título: Campos de data e hora nos temas claro e escuro
  - Prova: os componentes usam as cores do tema nos dois modos, com foco visível, dia atual, intervalo e erro distinguíveis sem depender só da cor (RF-11, CT-09).
  - Trecho: o anel de foco no dia focado do `DateField` aberto no painel escuro (o foco só fica num elemento por vez), a borda do dia atual, o fundo `primary-soft` do intervalo e a mensagem de erro com texto.
  - Falha: cores fixas que não mudam entre os temas, texto ilegível no tema escuro ou foco invisível.
