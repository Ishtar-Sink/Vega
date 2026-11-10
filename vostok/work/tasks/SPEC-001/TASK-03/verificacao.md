### Baseline

- `pnpm vitest run src/theme 2>&1 | grep -E '^\s*(Test Files|Tests)\s'`
- `pnpm exec tsc --noEmit --pretty false 2>&1 | grep -E '^src/theme/' | sort`
- `pnpm exec eslint src/theme --max-warnings 0`

### Verificação

```bash
# evidência: acoes-testes.txt
pnpm vitest run src/button src/icon-button src/menu-button --reporter=verbose
! (pnpm exec tsc --noEmit --pretty false 2>&1 | grep -E '^(src/button/|src/icon-button/|src/menu-button/)')
pnpm exec eslint src/button src/icon-button src/menu-button --max-warnings 0
pnpm exec prettier --check src/button src/icon-button src/menu-button
! grep -nE '#[0-9a-fA-F]{3,8}\b|[0-9]px\b|[0-9]ms\b|rgba?\(|hsla?\(|font-weight: *[0-9]|line-height: *[0-9]|z-index: *[0-9]' src/button/button.module.css src/icon-button/icon-button.module.css src/menu-button/menu-button.module.css
node -e "const p = require('./package.json'); process.exit(Object.keys(p.dependencies ?? {}).length)"
```

Resultado esperado: os três arquivos de teste com `✓` em todos os casos e `Test Files  3 passed (3)`; nenhum erro de tipo nas três pastas (o `@ts-expect-error` do `IconButton` é consumido); ESLint sem aviso; Prettier sem diferença; nenhum literal (inclusive `font-weight`, `line-height` e `z-index` numéricos) de cor, `px` ou `ms` nos três `.module.css` (RNF-02); `dependencies` do `package.json` vazio (RNF-06).

### Evidências

- `acoes-testes.txt` (automática, da verificação)
  - Título: Testes dos botões e do menu passam
  - Prova: `Button`, `IconButton` e `MenuButton` passam no axe, respondem ao teclado e repassam `className`, `style`, `data-*` e `ref` (RF-09, RF-20, CT-09, CT-13, RNF-01).
  - Trecho: as linhas `✓` de `has no axe violations` nos três componentes, `activates with Enter and Space from the keyboard`, `activates with the keyboard`, `moves with the arrow keys and closes on Escape returning focus`, `selects an item with Enter, calls onSelect and returns focus to the trigger`, as três `ct13 forwards className, style, data attributes and ref ...` e `Test Files  3 passed (3)`.
  - Falha: `×`, `FAIL`, `failed` na linha `Tests`, `No test files found` ou uma violação do axe listada.
  - Espera: `3 passed (3)`
  - Requer: `src/button/button.test.tsx`, `src/icon-button/icon-button.test.tsx`, `src/menu-button/menu-button.test.tsx`
- `acoes-marca-primary.txt` (automática): `pnpm vitest run src/button -t ct06 --reporter=verbose`
  - Título: Botão usa a cor de marca sobrescrita no contêiner
  - Prova: com `--primary` sobrescrito num contêiner, o `Button` primário recebe a classe que pinta fundo e borda com `var(--primary)`, sem redefinir a variável nem ter valor de reserva, então herda a cor do contêiner (CT-06, RF-06).
  - Trecho: a linha `✓ ... ct06 uses the --primary overridden by an ancestor container` e `Tests  1 passed`.
  - Falha: `×` no caso `ct06`, `No test files found` ou `0 passed`.
  - Espera: `1 passed`
  - Requer: `src/button/button.test.tsx`, `src/button/button.module.css`, `src/button/button.tsx`
- `acoes-temas.png` (manual): print com os componentes renderizados nos temas claro e escuro, lado a lado: `Button` nas variações `primary`, `secondary`, `ghost`, `muted`, `success` (normal e `aria-pressed`) e `loading`; um `Button` `primary` dentro de um contêiner com `style="--primary: #ff5500"`; `IconButton` `ghost` e `secondary` com um ícone; `MenuButton` aberto com um item normal e um `danger`, com o foco visível no primeiro item.
  - Título: Botões e menu nos temas claro e escuro
  - Prova: as cores vêm dos tokens nos dois temas, o foco é visível e o botão do contêiner sobrescrito aparece laranja enquanto os demais `primary` seguem a cor do tema (CT-06, CT-09, RF-09).
  - Trecho: o `primary` do contêiner em laranja; os demais `primary` em roxo; o anel de foco no item do menu; o item `danger` em vermelho nos dois temas.
  - Falha: o botão do contêiner na cor padrão do tema, algum componente sem estilo, texto ilegível no tema escuro ou foco invisível.
