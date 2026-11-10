### Baseline

- `pnpm vitest run src/button src/text-field --reporter=verbose 2>&1 | grep -E '^\s+(✓|×)' | sed -E 's/ [0-9]+ms$//' | sort`
- `pnpm exec tsc --noEmit 2>&1 | grep -E '^(src/button/|src/text-field/)' | sort`
- `pnpm exec eslint src/button src/text-field --max-warnings 0`

### Verificação

```bash
# evidência: testes-estrutura.txt
pnpm vitest run src/icons src/card src/page-header src/view-switcher src/toolbar src/tabs src/form-layout --reporter=verbose
test -z "$(pnpm exec tsc --noEmit 2>&1 | grep -E '^(src/icons/|src/card/|src/page-header/|src/view-switcher/|src/toolbar/|src/tabs/|src/form-layout/)')"
pnpm exec eslint src/icons src/card src/page-header src/view-switcher src/toolbar src/tabs src/form-layout --max-warnings 0
pnpm exec prettier --check src/icons src/card src/page-header src/view-switcher src/toolbar src/tabs src/form-layout
test -z "$(grep -nE '#[0-9a-fA-F]{3,8}\b|rgba?\(|[0-9.]+(px|ms)\b|font-weight: *[0-9]|line-height: *[0-9]|z-index: *[0-9]' src/card/*.module.css src/page-header/*.module.css src/view-switcher/*.module.css src/toolbar/*.module.css src/tabs/*.module.css src/form-layout/*.module.css | grep -v '@media')"
```

### Evidências

- `testes-estrutura.txt` (automática, da verificação)
  - Título: Testes dos componentes de estrutura passam
  - Prova: `Card`, `PageHeader`, `Toolbar`, `Tabs`, `ViewSwitcher`, `FormGrid`, `FormActions` e os seis ícones passam nos testes de papel e nome acessível, axe, teclado, props nativas e textos padrão sobrescrevíveis (RF-13, RF-18, RF-19, RF-20, CT-09, CT-13).
  - Trecho: as linhas `✓` de `passes className, style and data attributes to the root`, `chooses a view with the keyboard`, `moves focus with arrow keys`, `uses Cancelar and Salvar by default`, `renders ListIcon as a decorative 18 px svg` e o resumo `Tests  N passed` sem `failed`.
  - Falha: linhas com `×`, `FAIL` ou `Tests  N failed`.
  - Requer: `src/icons/view-icons.test.tsx`, `src/card/card.test.tsx`, `src/page-header/page-header.test.tsx`, `src/view-switcher/view-switcher.test.tsx`, `src/toolbar/toolbar.test.tsx`, `src/tabs/tabs.test.tsx`, `src/form-layout/form-layout.test.tsx`
- `estrutura-temas.png` (manual): print anexado pelo usuário de uma página de teste local qualquer (fora do repositório) com, nos temas claro (`data-theme="light"`) e escuro (`data-theme="dark"`): um `PageHeader` normal e outro `compact`, um `Toolbar` com busca, um filtro e o `ViewSwitcher` com os seis ícones (um ativo e um com foco), `Tabs` com uma aba focada, um `Card` em cada tom e um `FormGrid` com um campo de linha inteira e o `FormActions`; também uma captura com a janela em 480 px de largura.
  - Título: Componentes de estrutura nos temas claro e escuro
  - Prova: os componentes seguem o tema nos dois modos, com foco visível, aba e visualização ativas distinguíveis sem depender só da cor, e o formulário em uma coluna em tela estreita (RF-13, RF-18, CT-09).
  - Trecho: o sublinhado da aba ativa, o fundo do botão ativo do `ViewSwitcher`, o anel de foco, os fundos `*-soft` dos tons do `Card` e o `FormGrid` em uma coluna a 480 px.
  - Falha: cores que não mudam entre os temas, foco invisível, ícone sem traço ou formulário com duas colunas na tela estreita.
