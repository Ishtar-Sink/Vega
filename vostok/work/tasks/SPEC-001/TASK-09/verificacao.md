### Baseline

- `pnpm vitest run src/button --reporter=verbose 2>&1 | grep -E '^\s+(✓|×)' | sed -E 's/ [0-9]+ms$//' | sort`
- `pnpm exec tsc --noEmit 2>&1 | grep -E '^(src/button/)' | sort`
- `pnpm exec eslint src/button --max-warnings 0`

### Verificação

```bash
# evidência: testes-dialogos.txt
pnpm vitest run src/dialog src/confirm-dialog src/toast --reporter=verbose
test -z "$(pnpm exec tsc --noEmit 2>&1 | grep -E '^(src/dialog/|src/confirm-dialog/|src/toast/)')"
pnpm exec eslint src/dialog src/confirm-dialog src/toast --max-warnings 0
pnpm exec prettier --check src/dialog src/confirm-dialog src/toast
test -z "$(grep -nE '#[0-9a-fA-F]{3,8}\b|rgba?\(|[0-9.]+(px|ms)\b|font-weight: *[0-9]|line-height: *[0-9]|z-index: *[0-9]' src/dialog/*.module.css src/confirm-dialog/*.module.css src/toast/*.module.css | grep -v '@media')"
```

### Evidências

- `testes-dialogos.txt` (automática, da verificação)
  - Título: Testes de diálogos e avisos passam
  - Prova: `Dialog`, `ConfirmDialog`, `Toast` e `ToastRegion` passam nos testes de papel e nome acessível, axe, teclado (Tab preso, Esc, Enter), `<dialog>` nativo com `showModal()`, props nativas, textos padrão e sobrescritos e tom marcado além da cor (RF-14, RF-19, RF-20, CT-09, CT-12, CT-13).
  - Trecho: as linhas `✓` de `opens with the native showModal`, `traps Tab inside the dialog`, `uses Confirmar and Cancelar by default`, `accepts overridden labels`, `marks the tone with an icon and a hidden name, not only the color`, `passes className, style and data attributes to the dialog` e o resumo `Tests  N passed` sem `failed`.
  - Falha: linhas com `×`, `FAIL` ou `Tests  N failed`, ou erro `showModal is not a function`.
  - Requer: `src/dialog/dialog.test.tsx`, `src/confirm-dialog/confirm-dialog.test.tsx`, `src/toast/toast.test.tsx`
- `dialogos-temas.png` (manual): print anexado pelo usuário de uma página de teste local qualquer (fora do repositório) com, nos temas claro (`data-theme="light"`) e escuro (`data-theme="dark"`): um `ConfirmDialog` aberto sobre a página (fundo escurecido e foco visível em `Cancelar`), um `Dialog` `size="wide"` e um `ToastRegion` com um `Toast` de cada tom.
  - Título: Diálogos e avisos nos temas claro e escuro
  - Prova: o diálogo modal cobre a página com o fundo do tema, o foco fica visível e os quatro tons do aviso se distinguem pelo ícone, não só pela cor (RF-14, CT-09, RN-04, RN-05).
  - Trecho: o fundo escurecido atrás do diálogo, o anel de foco em `Cancelar`, os ícones de informação, sucesso, atenção e erro e os fundos `*-soft` dos avisos.
  - Falha: diálogo sem fundo escurecido, foco invisível, avisos iguais exceto pela cor ou texto ilegível no tema escuro.
