### Ler

- `vostok/work/specs/refined/SPEC-001-extrair-os-componentes-do-atria-para-a-vega.md` (seções "Contratos e interfaces", "Casos de borda" e "Casos de teste": RF-03 a RF-08, CT-03, CT-04, CT-05, CT-07, CT-08, CB-01, CB-02, CB-04)
- `vostok/rules/project/theme.md`
- `vostok/rules/project/testing.md`
- `vostok/rules/project/naming-convention.md`
- `vostok/rules/project/stack.md`
- `../atria/packages/theme/src/tokens.ts`
- `../atria/packages/theme/src/tokens.css`
- `../atria/packages/theme/src/contrast.ts`
- `../atria/packages/theme/src/contrast.test.ts`
- `../atria/packages/theme/src/tokens.test.ts`
- `../atria/packages/theme/src/palette.ts`
- `../atria/packages/theme/src/fonts.css`
- `../atria/packages/theme/src/index.ts`
- `../atria/packages/theme/fonts/`
- `package.json`
- `tsconfig.json`
- `eslint.config.js`
- `vite.config.ts`
- `src/test/setup.ts`

### Mudar

- `src/theme/tokens.test.ts` (criar): testes de fidelidade e espelho dos tokens, motion até 320 ms, `prefers-reduced-motion` e camada de marca sobrescrevível (RF-03, RF-05, RF-06, CT-03, CT-05, CB-04).
- `src/theme/contrast.test.ts` (criar): testes de `contrastRatio` e `checkThemeContrast` nos dois temas e num tema com contraste baixo (RF-07, CT-07, CB-02).
- `src/theme/theme.test.ts` (criar): testes de `defineTheme`, do tema padrão e de tipo com `@ts-expect-error` (RF-03, RF-04, CT-04, CB-01).
- `src/theme/fonts.test.ts` (criar): testes das fontes e licenças OFL e dos caminhos do `fonts.css` (RF-08, CT-08).
- `src/theme/tokens.ts` (criar): fonte única dos valores, copiada do Atria sem mudar valores, com a paleta de itens `itemPalette` e os tokens novos `fontWeights`, `lineHeights` e `zIndices`, com os valores que o Atria já usa (decisão do usuário; RN-03, [project/theme-03]).
- `src/theme/tokens.css` (criar): espelho de `tokens.ts` em variáveis CSS, claro em `:root` (RF-05, RF-06).
- `src/theme/contrast.ts` (criar): `contrastRatio`, `checkThemeContrast` e `CONTRAST_REQUIREMENTS` (RF-07).
- `src/theme/theme.ts` (criar): `ThemeTokens`, `Theme`, `ThemeName`, `defineTheme` e `ishtarSinkTheme` (RF-03, RF-04).
- `src/theme/fonts.css` (criar): `@font-face` de Inter e Outfit apontando para `fonts/` (RF-08).
- `src/theme/index.ts` (criar): índice do tema, que a TASK-12 reexporta.
- `fonts/inter-variable.woff2` (criar): cópia binária de `../atria/packages/theme/fonts/InterVariable.woff2`, renomeada para `kebab-case` ([project/naming-convention-01]).
- `fonts/outfit-variable.ttf` (criar): cópia binária de `../atria/packages/theme/fonts/Outfit-Variable.ttf`, renomeada para `kebab-case`.
- `fonts/OFL-Inter.txt` (criar): licença OFL da Inter, nome exigido por [project/stack-05].
- `fonts/OFL-Outfit.txt` (criar): licença OFL da Outfit, nome exigido por [project/stack-05].

### Passos

Regras gerais: código e nomes de teste em inglês, comentários em `pt-br`; sem `any` e sem `@ts-ignore`; imports de `vitest` explícitos (`import { describe, expect, it } from 'vitest'`); leitura de arquivos nos testes com `readFileSync(join(import.meta.dirname, '<arquivo>'), 'utf8')`, de `node:fs` e `node:path`. Não altere `package.json` nem nenhum arquivo da TASK-01. Não traga `palette.ts`, `palette.test.ts` nem `prototype-fidelity.test.ts` do Atria (ver `tecnico.md`).

1. `src/theme/tokens.test.ts` (criar): escreva os testes abaixo, adaptando os helpers `toKebab`, `normalize` e `block` de `../atria/packages/theme/src/tokens.test.ts`. `normalize` também troca aspas duplas por simples e reduz espaços repetidos a um; `block(selector)` procura o texto exato `` `${selector} {` `` no CSS (sem trocar aspas do arquivo) e lê as declarações até o `}`. Seletores usados: `":root,\n[data-theme='light']"`, `"[data-theme='dark']"`, `':root'` (a primeira ocorrência exata de `:root {`, que é o bloco das escalas) e o bloco `:root` dentro de `@media (prefers-reduced-motion: reduce)` (localize pelo índice de `@media (prefers-reduced-motion: reduce)` e leia o primeiro `:root {` depois dele). Testes, nesta ordem:
   - `light and dark have the same keys`: `Object.keys(dark).sort()` igual a `Object.keys(light).sort()`.
   - `tokens.css starts with a comment pointing to tokens.ts as the source`: o CSS começa com `/*` e o primeiro comentário (até `*/`) contém `tokens.ts`.
   - `tokens.css mirrors tokens.ts in the light theme on :root and [data-theme='light']`: `block(":root,\n[data-theme='light']")` igual a `expected(light)`, com `expected` como no Atria (`--${toKebab(k)}` e valor normalizado).
   - `tokens.css mirrors tokens.ts in the dark theme`: `block("[data-theme='dark']")` igual a `expected(dark)`.
   - `tokens.css mirrors the shared scales of tokens.ts`: `block(':root')` igual (`toEqual`, sem variável a mais nem a menos) ao mapa montado a partir de `tokens.ts`: `--radius-<k>` = `<v>px` de `radii`; `--space` = `<spacing.unit>px`; `--s<n>` = `calc(var(--space) * <n>)` para cada `n` de `spacing.steps`; `--font-size-<toKebab(k)>` = `<v>px` de `fontSizes`; `--<k>-gradient` = `linear-gradient(135deg, <a>, <b>)` para `brand`, `deep` e `calm` de `gradients`; `--font-<k>` = valor de `fonts`; `--font-weight-<k>` = `<v>` de `fontWeights`; `--line-height-<k>` = `<v>` de `lineHeights`; `--z-<k>` = `<v>` de `zIndices`; `--motion-<k>` = `<v>ms` para `fast`, `base` e `slow`; `--motion-ease-<k>` = valor de `motion.ease`; `--item-palette-<i+1>-from` e `--item-palette-<i+1>-to` = o par `i` de `itemPalette`. Todos os valores passam por `normalize`. Comentário no teste: `breakpoints` fica fora porque media query não lê variável CSS.
   - `motion durations never exceed 320 ms`: `Math.max(motion.fast, motion.base, motion.slow)` `<= 320` e todo `--motion-(fast|base|slow)` do bloco `:root` termina em `ms` com número `<= 320`.
   - `prefers-reduced-motion zeroes every motion duration`: o bloco `:root` do `@media (prefers-reduced-motion: reduce)` é exatamente `{ '--motion-fast': '0ms', '--motion-base': '0ms', '--motion-slow': '0ms' }` (CB-04).
   - `it.each(['light', 'dark'] as const)('brand layer is overridable by CSS variables at runtime in %s', ...)`: injete o CSS num `<style>` em `document.head`, faça `document.documentElement.dataset.theme = theme`, crie um `<div>` com `style.setProperty` para `--primary`, `--primary-hover`, `--primary-bright`, `--primary-soft`, `--primary-on` (valores `#010101` a `#050505`) e `--brand-gradient` (`linear-gradient(135deg, #010101, #020202)`), com um `<span>` filho, e um `<span>` irmão fora do `<div>`. Confira com `getComputedStyle(el).getPropertyValue(nome).trim()` que o filho recebe cada valor sobrescrito e que o irmão recebe o valor do tema (`normalize` do token de `light`/`dark` correspondente e, para `--brand-gradient`, `linear-gradient(135deg, #7c3aed, #06b6d4)`). Remova o `<style>`, o `data-theme` e os elementos num `afterEach` (RF-06).
   Confira: `pnpm vitest run src/theme` falha por `tokens` e `tokens.css` inexistentes.
2. `src/theme/contrast.test.ts` (criar): importe `contrastRatio`, `checkThemeContrast` e `CONTRAST_REQUIREMENTS` de `./contrast`, `defineTheme` e `ishtarSinkTheme` de `./theme` e `light`, `dark` de `./tokens`. Testes:
   - `contrastRatio returns 21 for black on white and 1 for equal colors` (`toBeCloseTo(21, 5)` e `toBeCloseTo(1, 5)`).
   - `contrastRatio accepts #RGB and ignores case`: `contrastRatio('#FFF', '#000')` igual a `contrastRatio('#ffffff', '#000000')`.
   - `contrastRatio throws on a value that is not a hex color`: `expect(() => contrastRatio('rgb(0, 0, 0)', '#fff')).toThrow(TypeError)`.
   - `requires 4.5:1 for text and 3:1 only for textFaint`: todo item de `CONTRAST_REQUIREMENTS` com `foreground === 'textFaint'` tem `minimum` 3 e todos os outros têm 4,5; existem os dois itens `textFaint` sobre `bg` e sobre `surface` ([project/testing-04]).
   - `it.each` sobre `['light', 'dark']` × `CONTRAST_REQUIREMENTS`, com o nome `'%s: %s on %s >= %d'`: `contrastRatio(tokens[foreground], tokens[background])` `>=` `minimum`.
   - `the Ishtar Sink theme has no contrast violation`: `checkThemeContrast(ishtarSinkTheme)` igual a `[]` (CT-07).
   - `textFaint stays below 4.5:1 in the default theme, so it is decorative only`: nos dois temas, sobre `bg` e `surface`, a razão de `textFaint` é `< 4.5` ([project/theme-06]).
   - `points the violation of a low-contrast brand in a custom theme`: `checkThemeContrast(defineTheme({ light: { ...light, primary: '#A855F7' }, dark }))` contém (`expect.objectContaining`) `{ theme: 'light', foreground: 'primary', background: 'bg', minimum: 4.5 }` e o `ratio` desse item é `< 4.5` (CB-02, CT-07).
   - `points the violation in the dark theme too`: com `dark: { ...dark, textFaint: '#2F2250' }`, contém `{ theme: 'dark', foreground: 'textFaint', background: 'bg', minimum: 3 }`.
   Confira: `pnpm vitest run src/theme/contrast` falha por `./contrast` inexistente.
3. `src/theme/theme.test.ts` (criar): importe `defineTheme`, `ishtarSinkTheme` e o tipo `ThemeTokens` de `./theme` e `light`, `dark` de `./tokens`. Testes:
   - `defineTheme returns the theme it receives`: `expect(defineTheme(theme)).toBe(theme)` com `theme = { light: { ...light, primary: '#0F766E' }, dark }`.
   - `ishtarSinkTheme uses the Ishtar Sink tokens, with light as the default`: `ishtarSinkTheme.light` `toBe(light)` e `ishtarSinkTheme.dark` `toBe(dark)` (CT-03).
   - `rejects, at type level, a light theme missing a token`: `const incomplete: Omit<ThemeTokens, 'textFaint'> = light;` seguido de `// @ts-expect-error o tema claro não tem textFaint` na linha logo acima de `defineTheme({ light: incomplete, dark });` (CT-04, CB-01).
   - `rejects, at type level, a dark theme missing a token`: o mesmo com `Omit<ThemeTokens, 'primarySoft'> = dark` em `dark`.
   - `rejects, at type level, a theme without the dark theme`: `// @ts-expect-error falta o tema escuro` acima de `defineTheme({ light });`.
   Confira: `pnpm vitest run src/theme/theme` falha por `./theme` inexistente.
4. `src/theme/fonts.test.ts` (criar): com `const root = join(import.meta.dirname, '..', '..')`. Testes:
   - `ships Inter and Outfit variable fonts with their OFL licenses`: `existsSync` verdadeiro para `fonts/inter-variable.woff2`, `fonts/outfit-variable.ttf`, `fonts/OFL-Inter.txt` e `fonts/OFL-Outfit.txt`, e as duas licenças contêm `SIL Open Font License` (RF-08, [project/stack-05]).
   - `fonts.css points every @font-face to a file shipped in fonts/`: para cada `url('...')` de `src/theme/fonts.css` (regex `/url\('([^']+)'\)/g`, ao menos 2), `existsSync(join(import.meta.dirname, caminho))` é verdadeiro; as famílias `Inter` e `Outfit` aparecem em `font-family`.
   - `fonts.css never loads a font from the network`: o CSS não contém `http:`, `https:` nem `//` dentro de `url(` ([project/architecture-06]).
   Confira: `pnpm vitest run src/theme/fonts` falha pelos arquivos inexistentes.
5. `src/theme/tokens.ts` (criar): copie `../atria/packages/theme/src/tokens.ts` sem mudar nenhum valor (RN-03) e troque as duas linhas de comentário do topo por: `// Fonte de verdade da identidade visual do ecossistema Ishtar Sink (DEC-001, [project/theme-08]).` e `// tokens.css espelha estes valores; mudança aqui é levada para Ishtar-Sink/.github docs/identidade-ecossistema.md.` No fim do arquivo, acrescente, com o JSDoc `/** Pares de cor dos itens sem imagem própria (mesmos valores de artPalettes do Atria); o ItemSwatch usa o par pelo hash do id. */`, `export const itemPalette = [ ... ] as const;` com os 10 pares de `artPalettes` de `../atria/packages/theme/src/palette.ts`, na mesma ordem e com os mesmos valores. Logo depois de `fontSizes`, acrescente, cada um com JSDoc em `pt-br`, exatamente: `export const fontWeights = { semibold: 600, bold: 700, extrabold: 800 } as const;`, `export const lineHeights = { tight: 1.1, relaxed: 1.6 } as const;` e `export const zIndices = { dropdown: 40, popover: 45, toast: 200 } as const;` (valores já usados nos `*.module.css` do Atria; nomes fixados pelo usuário). Confira: `pnpm exec tsc --noEmit` sem erros em `src/theme/tokens.ts`.
6. `src/theme/tokens.css` (criar): copie `../atria/packages/theme/src/tokens.css` sem mudar valores e troque o comentário do topo por `/* Espelho de tokens.ts, a fonte única dos valores do tema Ishtar Sink (DEC-001); o teste tokens.test.ts confere que os dois têm os mesmos valores. */`. No bloco `:root` das escalas, logo depois de `--brand-gradient`, acrescente `--deep-gradient: linear-gradient(135deg, #6d28d9, #7c3aed);` logo depois de `--font-size-xxxl`, `--font-weight-semibold: 600;`, `--font-weight-bold: 700;`, `--font-weight-extrabold: 800;`, `--line-height-tight: 1.1;`, `--line-height-relaxed: 1.6;`, `--z-dropdown: 40;`, `--z-popover: 45;` e `--z-toast: 200;`, e, depois de `--motion-ease-linear`, as 20 variáveis `--item-palette-1-from` a `--item-palette-10-to` com os valores de `itemPalette` em minúsculas. Mantenha a ordem dos blocos (`:root,\n[data-theme='light']`, `[data-theme='dark']`, `:root` das escalas, `@media (prefers-reduced-motion: reduce)`), sem `!important` em nenhuma declaração. Rode `pnpm exec prettier --write src/theme/tokens.css`. Confira: `pnpm vitest run src/theme/tokens` passa.
7. `src/theme/theme.ts` (criar): `import { dark, light } from './tokens';`, com:
   - `/** Tokens de um tema: todas as chaves do tema claro do Ishtar Sink, com valor de cor ou sombra. */ export type ThemeTokens = { [K in keyof typeof light]: string };`
   - `/** Tema completo: os dois modos são obrigatórios e cada um tem todos os tokens. */ export interface Theme { light: ThemeTokens; dark: ThemeTokens }`
   - `export type ThemeName = keyof Theme;`
   - `/** Identidade em tempo de execução; o tipo recusa um tema incompleto na compilação ([project/theme-02]). */ export function defineTheme(theme: Theme): Theme { return theme; }`
   - `/** Tema padrão do ecossistema; o claro é o padrão. */ export const ishtarSinkTheme: Theme = defineTheme({ light, dark });`
   Confira: `pnpm vitest run src/theme/theme` passa e `pnpm exec tsc --noEmit` não acusa `Unused '@ts-expect-error' directive`.
8. `src/theme/contrast.ts` (criar): leve `channel`, `relativeLuminance` (não exportada) e `contrastRatio` do Atria. Antes de `parseInt`, normalize o valor: aceite só `/^#([0-9a-f]{3}|[0-9a-f]{6})$/i`, expanda `#RGB` para `#RRGGBB` e, fora disso, lance `TypeError` com a mensagem `Cor fora do formato #RGB ou #RRGGBB: <valor recebido>` (template string com o valor). Acrescente:
   - `export interface ContrastRequirement { foreground: keyof ThemeTokens; background: keyof ThemeTokens; minimum: number }`
   - `export interface ContrastViolation extends ContrastRequirement { theme: ThemeName; ratio: number }`
   - `export const CONTRAST_REQUIREMENTS: readonly ContrastRequirement[]` com, nesta ordem, mínimo 4,5: `text`/`bg`, `text`/`surface`, `text`/`surfaceMuted`, `textMuted`/`bg`, `textMuted`/`surface`, `textMuted`/`surfaceMuted`, `primary`/`bg`, `primary`/`surface`, `primary`/`primarySoft`, `primaryOn`/`primary`, `primaryOn`/`primaryHover`, `accent`/`bg`, `accent`/`surface`, `accent`/`accentSoft`, `success`/`successSoft`, `warning`/`warningSoft`, `danger`/`dangerSoft`, `info`/`infoSoft`; mínimo 3: `textFaint`/`bg`, `textFaint`/`surface`.
   - `/** Aplica CONTRAST_REQUIREMENTS aos dois modos de um tema e devolve cada par abaixo do mínimo. */ export function checkThemeContrast(theme: Theme): ContrastViolation[]`, que percorre `(['light', 'dark'] as const)` e `CONTRAST_REQUIREMENTS` e devolve `{ theme, foreground, background, minimum, ratio }` só quando `ratio < minimum`, na ordem do tema e da lista.
   Use `import type { Theme, ThemeName, ThemeTokens } from './theme';`. Confira: `pnpm vitest run src/theme/contrast` passa.
9. `fonts/` (criar): copie `../atria/packages/theme/fonts/InterVariable.woff2` para `fonts/inter-variable.woff2`, `../atria/packages/theme/fonts/Outfit-Variable.ttf` para `fonts/outfit-variable.ttf` e `OFL-Inter.txt` e `OFL-Outfit.txt` com o mesmo nome, com `cp` (sem abrir nem editar os arquivos).
10. `src/theme/fonts.css` (criar): copie `../atria/packages/theme/src/fonts.css`, troque as URLs por `url('../../fonts/inter-variable.woff2')` e `url('../../fonts/outfit-variable.ttf')` e o comentário do topo por `/* Fontes servidas pelo próprio pacote, nunca por CDN ([project/architecture-06]). Licenças OFL em ../../fonts/. */`. Confira: `pnpm vitest run src/theme/fonts` passa.
11. `src/theme/index.ts` (criar): exatamente estas exportações:
    - `export { light, dark, radii, space, spacing, fontSizes, fontWeights, lineHeights, zIndices, motion, gradients, fonts, breakpoints, itemPalette } from './tokens';`
    - `export { defineTheme, ishtarSinkTheme } from './theme';`
    - `export type { Theme, ThemeName, ThemeTokens } from './theme';`
    - `export { contrastRatio, checkThemeContrast, CONTRAST_REQUIREMENTS } from './contrast';`
    - `export type { ContrastRequirement, ContrastViolation } from './contrast';`
    Não importe `tokens.css` nem `fonts.css` no índice. Confira: `pnpm exec tsc --noEmit` sem erros.
12. Rode `pnpm exec prettier --write src/theme` e os comandos da Verificação. Confira: todos terminam com código 0.
