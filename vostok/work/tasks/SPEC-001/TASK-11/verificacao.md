### Baseline

- `pnpm vitest run src/theme 2>&1 | grep -E 'Test Files|Tests '`
- `pnpm exec tsc --noEmit`
- `pnpm exec eslint src/theme --max-warnings 0`
- `sha256sum src/theme/tokens.ts src/theme/tokens.css src/theme/index.ts`

### Verificação

```bash
# evidência: marca-itens-testes.txt
pnpm vitest run src/badge src/brand-logo src/item-swatch
pnpm exec tsc --noEmit
pnpm exec eslint src/badge src/brand-logo src/item-swatch --max-warnings 0
pnpm exec prettier --check src/badge src/brand-logo src/item-swatch
! grep -nEi '#[0-9a-f]{3,8}\b|[0-9]+(\.[0-9]+)?px|[0-9]+ms|font-weight: *[0-9]|line-height: *[0-9]|z-index: *[0-9]' src/badge/badge.module.css src/brand-logo/brand-logo.module.css src/item-swatch/item-swatch.module.css
```

Resultado esperado: os quatro arquivos de teste (`badge`, `brand-logo`, `palette` e `item-swatch`) passam (`Test Files  4 passed`), `tsc` sem erros, ESLint sem avisos, Prettier com `All matched files use Prettier code style!` e o `grep` sem nenhuma linha (RNF-02).

### Evidências

- `marca-itens-testes.txt` (automática, da verificação)
  - Título: Testes de Badge, BrandLogo e ItemSwatch passam
  - Prova: `BrandLogo` mostra a marca recebida sem o "A" do Atria, `ItemSwatch` usa a paleta recebida e, sem ela, a paleta padrão das variáveis do tema, `Badge` mapeia cada tom ao fundo `*Soft`, os três repassam `className`, `style`, `data-*` e `ref` e passam no axe (RF-16, RF-17, RF-20, CT-10, CT-11, CT-13, CB-05).
  - Trecho: `Test Files  4 passed (4)` e os testes `renders the mark it receives and the name`, `has no Atria mark fixed in the component`, `uses the palette it receives`, `uses the default theme palette without a palette` e `forwards className, style, data attributes and ref to the root span`.
  - Falha: `FAIL`, `AssertionError`, violação do axe (`Expected the HTML found at`) ou `error TS`.
- `marca-e-itens.png` (manual): print dos três componentes renderizados numa página de teste do usuário que importe `src/theme/tokens.css` e `src/theme/fonts.css`, em dois painéis lado a lado (`data-theme="light"` e `data-theme="dark"`), cada um com: um `Badge` de cada tom (`neutral`, `primary`, `accent`, `success`, `warning`, `danger`, `info`, com o nome do tom como texto); um `BrandLogo` com `name="Vega"` e um `mark` próprio (por exemplo, um SVG de estrela), sem o "A" do Atria; três `ItemSwatch` sem `palette` com ids diferentes e a inicial do item; e um `ItemSwatch` com `palette={[['#0F766E', '#F59E0B']]}`.
  - Título: Selos, marca e quadrados de item nos temas claro e escuro
  - Prova: o visual entregue segue a identidade: selos com fundo suave e texto na cor do estado, marca recebida no quadrado em gradiente com o nome em gradiente, quadrados de item com os pares roxo e ciano do tema e o par da paleta recebida (RF-16, RF-17, CT-10, CT-11, [project/theme-06]).
  - Trecho: os 7 selos legíveis nos dois temas; o desenho recebido no quadrado do logo; três gradientes de item diferentes entre si e um em verde-azulado e âmbar.
  - Falha: selo com fundo cheio ou texto ilegível, o "A" do Atria no logo, quadrado de item sem gradiente (variáveis `--item-palette-*` não resolvidas) ou o item com `palette` igual aos outros.
