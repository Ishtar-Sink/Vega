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
- `dinheiro-temas.png` (manual): print do `MoneyField` nos temas claro e escuro, lado a lado: um campo com `R$ 14.500,50` em `pt-BR`, um com `$14,500.50` em `en-US`/`USD`, um vazio com a mensagem de erro e um com o foco visível durante a digitação.
  - Título: Campo de dinheiro nos temas claro e escuro
  - Prova: o campo usa o estilo do `TextField` com os tokens nos dois temas, os algarismos ficam alinhados e o erro aparece destacado (RF-12, CT-09).
  - Trecho: os valores formatados em cada locale; o anel de foco no campo em digitação; a mensagem de erro sob o campo vazio.
  - Falha: campo sem estilo, valor sem formatação do locale, texto ilegível no tema escuro ou foco invisível.
