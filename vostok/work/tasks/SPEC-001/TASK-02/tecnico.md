<!-- Escrito no planejamento com o que a tarefa vai fazer e enriquecido na conclusão com o que foi feito. -->

## Abordagem

Migração do `@atria/theme` (commit `139d036`) para `src/theme/`, com TDD: os testes do Atria são trazidos e completados primeiro (espelho, contraste, tipo, fontes, marca) e o código vem depois. Os valores não mudam (RN-03); o que muda é o comentário de origem (a Vega é a fonte, DEC-001, [project/theme-03], [project/theme-08]) e a API nova de tema e contraste da seção "Contratos e interfaces" da spec.

## O que `src/theme/index.ts` exporta (a TASK-12 reexporta)

- Valores de `./tokens`: `light`, `dark`, `radii`, `space`, `spacing`, `fontSizes`, `fontWeights`, `lineHeights`, `zIndices`, `motion`, `gradients`, `fonts`, `breakpoints`, `itemPalette`.
- Valores de `./theme`: `defineTheme`, `ishtarSinkTheme`. Tipos: `Theme`, `ThemeName`, `ThemeTokens`.
- Valores de `./contrast`: `contrastRatio`, `checkThemeContrast`, `CONTRAST_REQUIREMENTS`. Tipos: `ContrastRequirement`, `ContrastViolation`.
- CSS (não importado pelo índice): `src/theme/tokens.css` e `src/theme/fonts.css`; fontes em `fonts/`.

## Decisões

| Decisão | Alternativa descartada | Motivo |
|---|---|---|
| `ThemeTokens = { [K in keyof typeof light]: string }`, `Theme { light; dark }` e `defineTheme` como identidade tipada; o tipo recusa tema incompleto (RF-04, CB-01). | Validar o tema em tempo de execução. | A spec pede erro de tipo na compilação (CT-04); validação em runtime só acusaria o erro no navegador. |
| CT-04 com `@ts-expect-error` (com descrição) em `theme.test.ts`, conferido pelo `tsc --noEmit`. | `expectTypeOf` do Vitest. | É o que a spec pede; o `tsc` acusa a diretiva sem uso se o tipo deixar de recusar. `@ts-ignore` continua proibido ([project/code-style-01]). |
| `checkThemeContrast` aplica `CONTRAST_REQUIREMENTS` (18 pares de texto em 4,5:1 e `textFaint` sobre `bg` e `surface` em 3:1) aos dois modos e devolve só as violações. A lista é a mesma nos dois temas e é exportada. | Pares diferentes por tema, como no teste do Atria (`accent` sobre `bg` só no claro, sobre `surface` só no escuro). | Um tema próprio passa pelas mesmas regras nos dois modos ([project/theme-05], [project/testing-04]); todos os 20 pares passam hoje nos dois temas (conferido no planejamento, menor folga 4,55:1 em `accent`/`accentSoft` no claro). |
| `contrastRatio` aceita `#RGB` e `#RRGGBB` e lança `TypeError` para outro formato. | Aceitar qualquer string, como o Atria (`parseInt` devolveria `NaN` em silêncio). | Num tema próprio com `rgb()` ou `var()`, o erro explícito evita um teste que passa sem medir nada. |
| `palette.ts` (`artPalettes`, `paletteFor`) sai do tema; os 10 pares viram o token `itemPalette` em `tokens.ts`, espelhado em `--item-palette-1-from` a `--item-palette-10-to` no `tokens.css`. A TASK-11 monta a paleta padrão do `ItemSwatch` com `var(--item-palette-N-from/to)` e o mesmo hash. | (a) Manter `artPalettes` com hex literal: viola o CB-05 ("sem cor literal"). (b) Compor a paleta padrão com tokens existentes (`primary`, `accentFill`...): muda as cores dos itens, que são parte da identidade (`docs/identidade-ecossistema.md`, "cor determinística por item"), fora do escopo da spec. | Mantém os mesmos valores e o mesmo par por id que o Atria (RN-03), deriva a paleta dos tokens (CB-05) e a deixa sobrescrevível por CSS. `itemPalette` fica fora de `ThemeTokens`, como `gradients`: é igual nos dois modos e não entra na obrigação de um tema próprio. |
| Criar `fontWeights = { semibold: 600, bold: 700, extrabold: 800 }`, `lineHeights = { tight: 1.1, relaxed: 1.6 }` e `zIndices = { dropdown: 40, popover: 45, toast: 200 }` em `tokens.ts`, espelhados em `--font-weight-semibold/bold/extrabold`, `--line-height-tight/relaxed` e `--z-dropdown/popover/toast`, com os nomes fixados pelo usuário. Ficam fora de `ThemeTokens`, como as outras escalas (iguais nos dois modos). | Deixar peso, altura de linha e camada como literais nos `*.module.css`, ou cada componente usar o valor mais próximo. | Decisão do usuário no detalhamento: os valores já usados no Atria viram tokens, sem mudar nenhum valor (RN-03), e os componentes deixam de ter literal de fonte e de camada ([project/code-style-02]). |
| Acrescentar `--deep-gradient` ao `tokens.css`. | Deixar `gradients.deep` sem variável. | O teste de espelho cobre todas as escalas ([project/testing-05]); é um valor existente, sem mudança (RN-03). `breakpoints` fica fora do espelho porque media query não lê variável CSS. |
| Camada de marca: as variáveis `--primary*` ficam nos blocos `:root,[data-theme='light']` e `[data-theme='dark']` e `--brand-gradient` no `:root`, sem `!important`, como no Atria; sobrescrever num contêiner (ou num seletor carregado depois) troca a marca sem rebuild. O teste roda o `tokens.css` no jsdom e lê o valor computado. | Criar variáveis intermediárias (`--brand-primary`) para a marca. | O Atria já permite a troca por cascata e o jsdom calcula variáveis herdadas (conferido no planejamento); variável intermediária mudaria os nomes de token. |
| `prototype-fidelity.test.ts` não entra. | Trazer o protótipo `atria-prototype.html` para a Vega. | O teste compara com um artefato do Atria; na Vega o `tokens.ts` é a fonte (DEC-001). A fidelidade com o Atria é comprovada uma vez pela evidência `tokens-iguais-atria.txt`. |
| Fontes renomeadas para `inter-variable.woff2` e `outfit-variable.ttf`; licenças mantêm `OFL-Inter.txt` e `OFL-Outfit.txt`. | Manter `InterVariable.woff2` e `Outfit-Variable.ttf`. | [project/naming-convention-01] pede `kebab-case`; o nome das licenças é fixado por [project/stack-05]. |

## Riscos e pendências para outras tarefas

- CT-08 pede conferir o pacote gerado por `pnpm pack`. A TASK-02 não altera `package.json`: ela comprova as fontes e licenças em `fonts/` e o `fonts.css`. Que `fonts/` entre no tarball (campo `files` com `fonts` e `dist`) depende da TASK-01 e deve ser conferido com `pnpm pack --dry-run` na TASK-12 ou na TASK-14.
- `fonts.css` usa `url('../../fonts/...')`, relativo a `src/theme/`. O build da TASK-12 precisa publicar `tokens.css` (o contrato da spec exporta `./tokens.css`) e decidir como o `fonts.css` sai em `dist/` com URLs válidas; a spec não lista `./fonts.css` em `exports`.
- A TASK-11 depende de `itemPalette` e das variáveis `--item-palette-*`; mudar esses nomes quebra a paleta padrão do `ItemSwatch`.
- O app do Atria usa `paletteFor` direto (`apps/web/src/app/layout/sidebar.tsx`); a spec de troca no Atria precisa substituí-lo (fora do escopo).
- O print usa o Chromium do Playwright em `~/.cache/ms-playwright`; sem ele, a evidência visual vira manual.
- O texto em `--primary-on` sobre o gradiente de itens não é coberto pelo contraste (o `ItemSwatch` é decorativo, `aria-hidden`), como no Atria.
- As tarefas de componente (TASK-03 a TASK-11) passam a usar `var(--font-weight-*)`, `var(--line-height-*)` e `var(--z-*)` no lugar dos literais; um peso, altura de linha ou camada fora desses valores continua sem token e é registrado na tarefa do componente.
- A mudança do comentário de origem e a criação de `itemPalette`, `--deep-gradient`, `fontWeights`, `lineHeights` e `zIndices` são registradas no `docs/identidade-ecossistema.md` pela regra [project/theme-08] na publicação (TASK-14).

## Referências da spec

RF-03, RF-04, RF-05, RF-06, RF-07, RF-08; CT-03, CT-04, CT-05, CT-07, CT-08; CB-01, CB-02, CB-04, CB-05 (decisão da paleta); RN-03; RNF-07; DEC-001; [project/theme-01] a [project/theme-08], [project/testing-04], [project/testing-05], [project/stack-05].

## Arquivos em comum com a onda

Onda 2: TASK-02 e TASK-13. Nenhum arquivo em comum (a TASK-13 cria só `.github/workflows/ci.yml`).

## O que foi feito

Os valores de `tokens.ts` e `tokens.css` foram copiados do Atria sem mudança; a igualdade é comprovada por `tokens-iguais-atria.txt`. As fontes e as licenças OFL foram copiadas sem alteração de conteúdo, com nomes em `kebab-case`, e a igualdade está em `fontes-iguais-atria.txt`.

### Arquivos criados

- `src/theme/tokens.ts`: fonte única dos valores. Recebeu `itemPalette` (os 10 pares de `artPalettes`, na mesma ordem) e as escalas `fontWeights`, `lineHeights` e `zIndices` (nomes e valores fixados pelo usuário, já usados nos `*.module.css` do Atria).
- `src/theme/tokens.css`: espelho de `tokens.ts` em variáveis CSS. Além dos tokens do Atria, traz `--deep-gradient`, `--font-weight-*`, `--line-height-*`, `--z-*` e `--item-palette-1-from` a `--item-palette-10-to`. Não usa `!important`.
- `src/theme/theme.ts`: `ThemeTokens`, `Theme`, `ThemeName`, `defineTheme` (identidade tipada) e `ishtarSinkTheme`.
- `src/theme/contrast.ts`: `contrastRatio`, `checkThemeContrast` e `CONTRAST_REQUIREMENTS` (20 pares: 18 em 4,5:1 e `textFaint` sobre `bg` e `surface` em 3:1).
- `src/theme/fonts.css`: `@font-face` de Inter e Outfit apontando para `fonts/` por URL relativa, sem rede.
- `src/theme/index.ts`: índice do tema; não importa os CSS.
- `fonts/`: `inter-variable.woff2`, `outfit-variable.ttf`, `OFL-Inter.txt` e `OFL-Outfit.txt`.
- Testes: `tokens.test.ts`, `contrast.test.ts`, `theme.test.ts` e `fonts.test.ts` (4 arquivos, 65 testes passando).

### Decisões

- Tipo e não validação em execução para tema incompleto: a recusa acontece na compilação, e o `theme.test.ts` confere com `@ts-expect-error` (CT-04, CB-01).
- `contrastRatio` aceita só `#RGB` e `#RRGGBB` e lança `TypeError` para outros formatos, para que um tema com `rgb()` ou `var()` não passe num teste sem medir nada.
- `checkThemeContrast` aplica a mesma lista de pares (`CONTRAST_REQUIREMENTS`) aos dois modos; no Atria, cada par era um teste escrito à mão para cada tema.
- `palette.ts` saiu do tema; a paleta de itens virou o token `itemPalette`, espelhado em `--item-palette-*`, para o `ItemSwatch` (TASK-11) usá-la sem cor literal. `itemPalette`, `gradients` e as escalas ficam fora de `ThemeTokens`, porque são iguais nos dois modos.
- Camada de marca: as variáveis `--primary*` e `--brand-gradient` continuam como no Atria, sem `!important`. Um contêiner (ou seletor carregado depois) troca a marca sem rebuild. O teste roda o `tokens.css` no jsdom e lê o valor computado nos dois modos.
- `prototype-fidelity.test.ts` e o protótipo do Atria não vieram para a Vega; a fidelidade com o Atria é comprovada uma vez pela evidência `tokens-iguais-atria.txt`.
- Fora do texto dos passos, dois ajustes para o ESLint passar: `String()` nas interpolações numéricas do `tokens.test.ts` e `digits.replace(/./g, ...)` no lugar do spread de string em `contrast.ts`.

### Verificação

- Testes da Verificação passaram sem falhas (saída em `validation/tests.out`); regressão igual ao baseline.
- `checkThemeContrast(ishtarSinkTheme)` não devolve violações.
- Evidências `tema-testes.txt`, `tokens-iguais-atria.txt`, `fontes-iguais-atria.txt` e `tema-claro-escuro.png` foram conferidas pelo usuário.
- `package.json` e os arquivos da TASK-01 não foram alterados.

### Pontos de atenção

- O reflexo dos tokens novos (`itemPalette`, `--deep-gradient`, `fontWeights`, `lineHeights`, `zIndices`) e da mudança do comentário de origem em `docs/identidade-ecossistema.md` da organização fica para a TASK-14.
- `fonts/` já está no campo `files` do `package.json` (TASK-01); a conferência do tarball com `npm pack --dry-run` é da TASK-12.
