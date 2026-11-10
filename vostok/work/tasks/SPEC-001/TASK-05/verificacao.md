### Baseline

- `pnpm vitest run src/button src/icon-button src/menu-button 2>&1 | grep -E '^\s*(Test Files|Tests)\s'`
- `pnpm exec tsc --noEmit --pretty false 2>&1 | grep -E '^(src/theme/|src/button/|src/icon-button/|src/menu-button/)' | sort`
- `pnpm exec eslint src/button --max-warnings 0`

### Verificação

```bash
# evidência: cor-testes.txt
pnpm vitest run src/color-field --reporter=verbose
pnpm vitest run src/button
! (pnpm exec tsc --noEmit --pretty false 2>&1 | grep -E '^(src/color-field/|src/button/)')
pnpm exec eslint src/color-field --max-warnings 0
pnpm exec prettier --check src/color-field
! grep -nE '#[0-9a-fA-F]{3,8}\b|[0-9]px\b|[0-9]ms\b|rgba?\(|hsla?\(|font-weight: *[0-9]|line-height: *[0-9]|z-index: *[0-9]' src/color-field/color-field.module.css
! grep -rnE '\bhex_invalid\b|graus' src/color-field/color-field.tsx src/color-field/color.ts
node -e "const p = require('./package.json'); process.exit(Object.keys(p.dependencies ?? {}).length)"
```

Resultado esperado: os três arquivos de teste de `src/color-field` com `✓` em todos os casos e `Test Files  3 passed (3)`; os testes do `Button` continuam passando; nenhum erro de tipo nas duas pastas; ESLint sem aviso; Prettier sem diferença; nenhum literal (inclusive `font-weight`, `line-height` e `z-index` numéricos) no `.module.css` (RNF-02); nenhum `hex_invalid` nem "graus" fixo fora do padrão de textos; `dependencies` vazio (RNF-06).

### Evidências

- `cor-testes.txt` (automática, da verificação)
  - Título: Testes do campo e do seletor de cor passam
  - Prova: as funções de cor convertem HEX, RGB e HSL; o `ColorField` e o `ColorPicker` passam no axe, funcionam pelo teclado, usam os textos padrão em pt-br ou os recebidos, mostram o erro ligado ao gatilho e repassam `className`, `style`, `data-*` e `ref` (RF-10, RF-19, RF-20, CT-09, CT-12, CT-13, RNF-01).
  - Trecho: `✓` em `converts between HEX, RGB and HSL`, nos dois `has no axe violations`, em `changes hue with left and right arrows and saturation with up and down`, `opens with the keyboard and applies with Enter on Aplicar`, nos dois `uses the pt-br default labels...`, nos dois `ct12 shows the overridden labels`, nos dois `ct13 forwards className, style, data attributes and ref ...` e `Test Files  3 passed (3)`.
  - Falha: `×`, `FAIL`, `failed` na linha `Tests`, `No test files found` ou uma violação do axe listada.
  - Espera: `3 passed (3)`
  - Requer: `src/color-field/color.test.ts`, `src/color-field/color-picker.test.tsx`, `src/color-field/color-field.test.tsx`
- `cor-temas.png` (manual): print do `ColorField` nos temas claro e escuro: o campo fechado com a amostra e o HEX, outro com erro, e o diálogo aberto com a roda de cores, o marcador, a prévia, a luminosidade, os campos HEX, RGB e HSL e os botões `Cancelar` e `Aplicar`, com o foco visível na roda.
  - Título: Campo de cor nos temas claro e escuro
  - Prova: o diálogo nativo abre sobre a página com os tokens do tema, a roda e os campos ficam legíveis nos dois temas e o foco é visível (RF-10, CT-09).
  - Trecho: a roda circular com o marcador na cor atual; o anel de foco ao redor da roda; os botões com as cores do `Button`; a mensagem de erro sob o campo.
  - Falha: diálogo sem fundo ou fora do centro, roda vazia, campos ilegíveis no tema escuro ou foco invisível.
