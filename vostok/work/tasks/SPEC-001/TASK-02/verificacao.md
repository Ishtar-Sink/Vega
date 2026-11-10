### Baseline

- `pnpm exec tsc --noEmit`
- `pnpm exec eslint . --max-warnings 0`
- `sha256sum package.json pnpm-workspace.yaml tsconfig.json eslint.config.js vite.config.ts src/test/setup.ts`

### Verificação

```bash
# evidência: tema-testes.txt
pnpm vitest run src/theme
pnpm exec tsc --noEmit
pnpm exec eslint src/theme --max-warnings 0
pnpm exec prettier --check src/theme
```

Resultado esperado: os quatro arquivos de teste de `src/theme` passam (`Test Files  4 passed`), `tsc` sem erros (inclusive sem `Unused '@ts-expect-error' directive`), ESLint sem avisos e Prettier com `All matched files use Prettier code style!`.

### Evidências

- `tema-testes.txt` (automática, da verificação)
  - Título: Testes do tema passam nos temas claro e escuro
  - Prova: espelho `tokens.css` x `tokens.ts`, contraste 4,5:1 e 3:1 nos dois temas, violação num tema próprio, tema incompleto recusado no tipo, marca sobrescrita por variável CSS, motion até 320 ms e fontes presentes (RF-03 a RF-08, CT-03, CT-04, CT-05, CT-07, CT-08, CB-01, CB-02, CB-04).
  - Trecho: `Test Files  4 passed (4)`, os testes `tokens.css mirrors tokens.ts in the dark theme`, `brand layer is overridable by CSS variables at runtime in dark`, `points the violation of a low-contrast brand in a custom theme` e `rejects, at type level, a light theme missing a token`, e a saída vazia do `tsc`.
  - Falha: `FAIL`, `AssertionError`, `error TS` ou `Unused '@ts-expect-error' directive`.
- `tokens-iguais-atria.txt` (automática): `node --input-type=module -e "const { isDeepStrictEqual: eq } = await import('node:util'); const a = await import(process.cwd() + '/../atria/packages/theme/src/tokens.ts'); const p = await import(process.cwd() + '/../atria/packages/theme/src/palette.ts'); const v = await import(process.cwd() + '/src/theme/tokens.ts'); let ok = true; for (const k of Object.keys(a)) { const same = typeof a[k] === 'function' ? [0, 1, 7].every((n) => a[k](n) === v[k](n)) : eq(a[k], v[k]); ok &&= same; console.log(k + ': ' + (same ? 'igual' : 'DIFERENTE')); } const pal = eq(p.artPalettes, v.itemPalette); ok &&= pal; console.log('itemPalette x artPalettes: ' + (pal ? 'igual' : 'DIFERENTE')); console.log('tokens iguais ao Atria: ' + (ok ? 'sim' : 'não')); if (!ok) process.exitCode = 1;"`
  - Título: Valores dos tokens iguais aos do Atria
  - Prova: o módulo `tokens.ts` da Vega, carregado pelo Node, tem os mesmos valores de cada export do `@atria/theme` (`light`, `dark`, escalas, motion, gradientes, fontes, breakpoints) e a paleta de itens igual a `artPalettes` (CT-03, RN-03).
  - Trecho: uma linha `igual` por export, `itemPalette x artPalettes: igual` e `tokens iguais ao Atria: sim`. Os tokens novos (`fontWeights`, `lineHeights`, `zIndices`) não existem no Atria e não entram nesta comparação; o espelho deles com o CSS é provado em `tema-testes.txt`.
  - Falha: alguma linha `DIFERENTE`, `tokens iguais ao Atria: não`, código de saída 1 ou erro de import.
  - Espera: tokens iguais ao Atria: sim
  - Requer: `src/theme/tokens.ts`
- `fontes-iguais-atria.txt` (automática): `for pair in InterVariable.woff2:inter-variable.woff2 Outfit-Variable.ttf:outfit-variable.ttf OFL-Inter.txt:OFL-Inter.txt OFL-Outfit.txt:OFL-Outfit.txt; do cmp "../atria/packages/theme/fonts/${pair%%:*}" "fonts/${pair##*:}" && echo "igual ao Atria: fonts/${pair##*:}" || exit 1; done`
  - Título: Fontes e licenças OFL copiadas sem alteração
  - Prova: as fontes Inter e Outfit variáveis e as duas licenças OFL estão em `fonts/`, byte a byte iguais às do Atria (RF-08, CT-08 na parte que a tarefa controla).
  - Trecho: as quatro linhas `igual ao Atria: fonts/...`.
  - Falha: `differ`, `No such file or directory` ou menos de quatro linhas.
  - Espera: igual ao Atria: fonts/OFL-Outfit.txt
  - Requer: `fonts/inter-variable.woff2`, `fonts/outfit-variable.ttf`, `fonts/OFL-Inter.txt`, `fonts/OFL-Outfit.txt`
- `tema-claro-escuro.png` (print): `CHROME=$(ls -d "$HOME"/.cache/ms-playwright/chromium-*/chrome-linux64/chrome | sort -V | tail -1) && H=$(mktemp --suffix=.html) && R="$PWD" && { printf '<!doctype html><meta charset="utf-8"><link rel="stylesheet" href="file://%s/src/theme/fonts.css"><link rel="stylesheet" href="file://%s/src/theme/tokens.css"><style>body{margin:0;display:flex;min-height:100vh}section{flex:1;padding:24px;background:var(--bg);color:var(--text);font-family:var(--font-body);font-size:var(--font-size-base)}h1{font-family:var(--font-display);font-size:var(--font-size-xxl)}span{display:inline-block;padding:var(--s2) var(--s3);margin:var(--s1);border-radius:var(--radius-pill)}.g{height:48px;border-radius:var(--radius-md);background:var(--brand-gradient)}</style>' "$R" "$R"; for t in light dark; do printf '<section data-theme="%s"><h1>Ishtar Sink: %s</h1><p>text</p><p style="color:var(--text-muted)">textMuted</p><p style="color:var(--text-faint)">textFaint (decorativo)</p>' $t $t; for s in primary accent success warning danger info; do printf '<span style="background:var(--%s-soft);color:var(--%s)">%s</span>' $s $s $s; done; printf '<div class="g"></div></section>'; done; printf '<section data-theme="light" style="--primary:#0f766e;--primary-soft:#ccfbf1;--brand-gradient:linear-gradient(135deg,#0f766e,#f59e0b)"><h1>Marca sobrescrita</h1><p>--primary e --brand-gradient trocados no contêiner, sem rebuild</p><span style="background:var(--primary-soft);color:var(--primary)">primary</span><div class="g"></div></section>'; } > "$H" && "$CHROME" --headless --disable-gpu --no-sandbox --hide-scrollbars --allow-file-access-from-files --window-size=1500,380 --screenshot="$VOSTOK_EVIDENCE/tema-claro-escuro.png" "file://$H"`
  - Título: Tema claro, escuro e marca sobrescrita lado a lado
  - Prova: o `tokens.css` e o `fonts.css` da Vega aplicados num navegador: claro e escuro com texto, selos de estado no fundo `*Soft`, `textFaint` só decorativo e o gradiente de marca, mais um contêiner com `--primary` e `--brand-gradient` sobrescritos em tempo de execução (RF-03, RF-06, RF-08, [project/theme-06]).
  - Trecho: três painéis; títulos em Outfit e corpo em Inter; no terceiro, o selo e o gradiente em verde-azulado e âmbar no lugar do roxo e ciano.
  - Falha: painéis sem cor de fundo (variáveis não carregadas), títulos na fonte do sistema (fontes não encontradas) ou o terceiro painel igual ao primeiro.
  - Requer: `src/theme/tokens.css`, `src/theme/fonts.css`, `fonts/inter-variable.woff2`, `fonts/outfit-variable.ttf`
