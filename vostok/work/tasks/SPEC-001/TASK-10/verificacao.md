### Baseline

- `pnpm vitest run src/button --reporter=verbose 2>&1 | grep -E '^\s+(✓|×)' | sed -E 's/ [0-9]+ms$//' | sort`
- `pnpm exec tsc --noEmit 2>&1 | grep -E '^(src/button/)' | sort`
- `pnpm exec eslint src/button --max-warnings 0`

### Verificação

```bash
# evidência: testes-estados.txt
pnpm vitest run src/empty-state src/loading-state src/error-state src/progress-bar --reporter=verbose
test -z "$(pnpm exec tsc --noEmit 2>&1 | grep -E '^(src/empty-state/|src/loading-state/|src/error-state/|src/progress-bar/)')"
pnpm exec eslint src/empty-state src/loading-state src/error-state src/progress-bar --max-warnings 0
pnpm exec prettier --check src/empty-state src/loading-state src/error-state src/progress-bar
test -z "$(grep -nE '#[0-9a-fA-F]{3,8}\b|rgba?\(|[0-9.]+(px|ms)\b|font-weight: *[0-9]|line-height: *[0-9]|z-index: *[0-9]' src/empty-state/*.module.css src/loading-state/*.module.css src/error-state/*.module.css src/progress-bar/*.module.css | grep -v '@media')"
```

### Evidências

- `testes-estados.txt` (automática, da verificação)
  - Título: Testes dos componentes de estado passam
  - Prova: `EmptyState`, `LoadingState`, `Skeleton`, `ErrorState` e `ProgressBar` passam nos testes de papel e nome acessível, axe, teclado na nova tentativa, `aria-busy` no carregamento, props nativas e textos padrão sobrescrevíveis (RF-15, RF-19, RF-20, CT-09, CT-13).
  - Trecho: as linhas `✓` de `marks the region as busy`, `announces Carregando by default`, `uses the pt-BR texts by default`, `accepts overridden texts`, `retries with the keyboard`, `passes className, style and data attributes to the root` e o resumo `Tests  N passed` sem `failed`.
  - Falha: linhas com `×`, `FAIL` ou `Tests  N failed`.
  - Requer: `src/empty-state/empty-state.test.tsx`, `src/loading-state/loading-state.test.tsx`, `src/error-state/error-state.test.tsx`, `src/progress-bar/progress-bar.test.tsx`
- `estados-temas.png` (manual): print anexado pelo usuário de uma página de teste local qualquer (fora do repositório) com, nos temas claro (`data-theme="light"`) e escuro (`data-theme="dark"`): um `EmptyState` com ação, um `LoadingState` com 3 linhas, um `ErrorState` com descrição e o botão `Tentar de novo` focado, e dois `ProgressBar` (40% e 100%).
  - Título: Componentes de estado nos temas claro e escuro
  - Prova: os estados de vazio, carregando, erro e progresso seguem o tema nos dois modos, com o erro no fundo `danger-soft` e texto, foco visível e a barra preenchida com a cor primária (RF-15, CT-09).
  - Trecho: a borda tracejada do vazio, as linhas do esqueleto, o fundo do erro com o título legível, o anel de foco no botão e o preenchimento das barras.
  - Falha: cores que não mudam entre os temas, texto do erro ilegível, foco invisível ou barra sem preenchimento.
