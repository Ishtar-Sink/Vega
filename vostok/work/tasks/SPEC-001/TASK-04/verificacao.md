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
- `campos-temas.png` (manual): print com os seis campos nos temas claro e escuro, lado a lado: `TextField` com ajuda e outro com erro; `SelectField` com a lista aberta e uma opção ativa; `Checkbox` marcado e com foco visível; `SegmentedField` com uma opção escolhida; `Autocomplete` múltiplo com duas pílulas e a lista aberta; `TagField` com duas etiquetas e o texto de ajuda.
  - Título: Campos nos temas claro e escuro
  - Prova: os campos usam os tokens nos dois temas, o erro aparece em vermelho com o campo marcado e o foco é visível (RF-10, CT-09).
  - Trecho: a mensagem de erro sob o `TextField` com a borda do campo destacada; o anel de foco no `Checkbox`; a opção ativa do `SelectField` com o fundo suave da cor primária.
  - Falha: campo sem estilo, texto ilegível no tema escuro, foco invisível ou erro sem destaque.
