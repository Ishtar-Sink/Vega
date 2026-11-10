<!-- Escrito no planejamento com o que a tarefa vai fazer e enriquecido na conclusão com o que foi feito. -->

## Abordagem

Migração de `badge`, `brand-logo` e `item-swatch` do `@atria/ui` (commit `139d036`) com TDD: os testes do Atria são trazidos, adaptados à generalização e completados até as regras de teste (axe, props nativas e `ref`, estilos sem literal), e o código vem depois. Os três componentes não são interativos: não há teste de teclado ([project/testing-03] não se aplica) e são consultados por texto ou `data-testid`, porque não têm papel ARIA (o `ItemSwatch` e o quadrado do logo são decorativos, `aria-hidden`).

## Exportações para a TASK-12

- `src/badge/badge.tsx`: `Badge`; tipos `BadgeProps`, `BadgeTone`.
- `src/brand-logo/brand-logo.tsx`: `BrandLogo`; tipo `BrandLogoProps`.
- `src/item-swatch/item-swatch.tsx`: `ItemSwatch`; tipo `ItemSwatchProps`.
- `src/item-swatch/palette.ts` (`DEFAULT_ITEM_PALETTE`, `pairFor`, `ItemPalette`) é interno: o Atria não exportava a escolha do par pelo `@atria/ui`, e a spec não a lista entre as funções auxiliares (RF-02).

## Decisões

| Decisão | Alternativa descartada | Motivo |
|---|---|---|
| `BrandLogoProps extends ComponentPropsWithRef<'div'> { name: string; mark: ReactNode }`, exatamente como o contrato da spec; `children` não é renderizado. | `Omit<..., 'children'>`. | Segue o contrato literal da spec; `children` explícito no JSX sobrepõe o que vier no `...rest`. |
| O quadrado da marca mantém o gradiente, a sombra e `color: var(--primary-on)`; o bloco `.mark svg` (traço, `fill: none`) sai. | Manter o estilo de traço para qualquer SVG recebido. | O estilo era do "A" do Atria; forçar `fill: none` quebraria uma marca preenchida. Quem passa um ícone de traço usa `currentColor`. |
| Paleta padrão do `ItemSwatch` = `DEFAULT_ITEM_PALETTE`, os pares `var(--item-palette-N-from/to)` gerados a partir do token `itemPalette` da TASK-02, com o hash de `paletteFor` do Atria em `pairFor`. Paleta vazia cai na padrão. | (a) `artPalettes` com hex literal (viola CB-05). (b) Pares de tokens existentes (`primary`, `accentFill`...): mudam as cores dos itens, parte da identidade. | Sem cor literal (CB-05), segue o tema e pode ser sobrescrita por CSS; o mesmo id dá o mesmo par que no Atria (decisão registrada na TASK-02). |
| O `id` do `ItemSwatch` continua sendo o id do item e não vai para o DOM, como no Atria; `palette` tipada como `ReadonlyArray<readonly [string, string]>`. | Renomear para `itemId` e liberar o `id` nativo. | O contrato da spec fixa `id: string` e os nomes públicos se mantêm (RN-02). Documentado no JSDoc. |
| Medidas fora da escala com `calc(var(--space) * n)`, exatas: quadrado da marca 34 px (`* 8.5`), `letter-spacing` -0,8 px (`* -0.2`) e `padding` vertical do selo 1 px (`* 0.25`). | Arredondar para o passo `--sN` mais próximo. | Mantém o visual do Atria sem literal ([project/code-style-02], RNF-02). |
| `font-weight` com os tokens criados na TASK-02 por decisão do usuário: `Badge` em `var(--font-weight-semibold)`, `ItemSwatch` em `var(--font-weight-bold)` e nome do `BrandLogo` em `var(--font-weight-extrabold)`. Os três componentes não usam `line-height` nem `z-index`. | Manter `600`, `700` e `800` literais. | Mesmos valores do Atria, sem literal de fonte ([project/code-style-02]). |
| `font-size` do nome do logo: `var(--font-size-xl)` (21 px) no lugar de `22px`. | Criar um token de 22 px. | A tarefa de componente não cria token; é o token mais próximo, com 1 px de diferença. |
| `Badge` mantém os 7 tons e o padrão `primary`; o comentário que citava `[project/frontend-14]` do Atria sai. | Mudar o padrão para `neutral`. | Nomes e comportamento públicos se mantêm (RN-02); a regra citada é do Atria. |

## Riscos

- Diferença visual de 1 px no nome do `BrandLogo` (22 px para 21 px). Se o tema ganhar um token de 22 px numa versão futura, o componente passa a usá-lo.
- O texto em `--primary-on` sobre o gradiente do `ItemSwatch` não tem contraste verificado (ex.: branco sobre ciano claro), como no Atria; o componente é decorativo e o texto dele não substitui o nome do item.
- Depende dos nomes `itemPalette` e `--item-palette-1-from` a `--item-palette-10-to` da TASK-02; o teste `points only to variables declared in tokens.css` acusa qualquer divergência.
- A evidência visual é manual: a Vega não tem app de demonstração e a spec não prevê um.

## Referências da spec

RF-16, RF-17, RF-20; CT-10, CT-11, CT-13; CB-05; RN-02, RN-04; RNF-01, RNF-02; [project/code-style-02], [project/code-style-03], [project/theme-06], [project/accessibility-03].

## Arquivos em comum com a onda

Onda 3: TASK-03, TASK-04 e TASK-11. Nenhum arquivo em comum; a TASK-11 só lê `src/theme/tokens.ts` e `src/theme/tokens.css`, também lidos pelas outras.
