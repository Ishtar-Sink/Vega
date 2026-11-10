### Concluída quando

- [x] Os tokens `light` e `dark` e as escalas da Vega têm os mesmos valores do Atria, e o tema padrão `ishtarSinkTheme` usa o claro como padrão (RF-03, CT-03).

  > Como comprovar: abrir `tokens-iguais-atria.txt` e ver uma linha `igual` por export e `tokens iguais ao Atria: sim`; na saída dos testes, ver passando `ishtarSinkTheme uses the Ishtar Sink tokens, with light as the default` e `tokens.css mirrors tokens.ts in the light theme on :root and [data-theme='light']`.

- [x] Um tema sem algum token, no claro ou no escuro, ou sem um dos dois temas, não compila (RF-04, CT-04, CB-01).

  > Como comprovar: rodar `pnpm exec tsc --noEmit` e ver a saída vazia, sem `Unused '@ts-expect-error' directive`; isso só acontece se as três chamadas incompletas de `defineTheme` em `theme.test.ts` derem erro de tipo.

- [x] O `tokens.css` espelha todos os valores de `tokens.ts` nos dois temas e nas escalas, com o comentário no topo apontando `tokens.ts` como origem (RF-05, CT-05).

  > Como comprovar: na saída dos testes (`tema-testes.txt`), ver passando `tokens.css starts with a comment pointing to tokens.ts as the source` e os três testes `tokens.css mirrors ...`.

- [x] A camada de marca (`--primary`, `--primary-hover`, `--primary-bright`, `--primary-soft`, `--primary-on` e `--brand-gradient`) é sobrescrita por variável CSS num contêiner, nos dois temas, sem rebuild (RF-06).

  > Como comprovar: ver passando `brand layer is overridable by CSS variables at runtime in light` e `... in dark`; no print `tema-claro-escuro.png`, o terceiro painel mostra o selo e o gradiente com as cores trocadas.

- [x] `checkThemeContrast` está exportada, não aponta violação no tema Ishtar Sink e aponta a violação de um tema próprio com marca de contraste baixo, com 4,5:1 para texto e 3:1 para `textFaint` (RF-07, CT-07, CB-02).

  > Como comprovar: ver passando `the Ishtar Sink theme has no contrast violation`, `points the violation of a low-contrast brand in a custom theme` e `requires 4.5:1 for text and 3:1 only for textFaint`; conferir que `src/theme/index.ts` exporta `checkThemeContrast`.

- [x] As fontes Inter e Outfit variáveis e as licenças `fonts/OFL-Inter.txt` e `fonts/OFL-Outfit.txt` estão no pacote, iguais às do Atria, e o `fonts.css` aponta só para esses arquivos locais (RF-08, CT-08).

  > Como comprovar: abrir `fontes-iguais-atria.txt` e ver as quatro linhas `igual ao Atria`; ver passando os três testes de `fonts.test.ts`; no print, os títulos aparecem em Outfit.

- [x] Os tokens novos `fontWeights`, `lineHeights` e `zIndices` existem em `tokens.ts` com os valores do Atria e estão espelhados em `--font-weight-*`, `--line-height-*` e `--z-*` no `tokens.css` (RF-05, CT-05).

  > Como comprovar: ver passando `tokens.css mirrors the shared scales of tokens.ts`, que exige as oito variáveis novas com os mesmos valores; conferir que `src/theme/index.ts` exporta `fontWeights`, `lineHeights` e `zIndices`.

- [x] As durações de movimento não passam de 320 ms e vão a 0 ms com `prefers-reduced-motion: reduce` (CB-04).

  > Como comprovar: ver passando `motion durations never exceed 320 ms` e `prefers-reduced-motion zeroes every motion duration`.

- [x] O código do tema passa no typecheck, no ESLint e no Prettier, sem alterar `package.json` nem os arquivos da TASK-01 (RF-03, RF-04).

  > Como comprovar: a Verificação termina com código 0; no baseline, a linha do `sha256sum` dos arquivos da TASK-01 sai igual antes e depois.
