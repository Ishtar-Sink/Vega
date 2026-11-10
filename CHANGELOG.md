# Changelog

Este arquivo segue o [versionamento semântico](https://semver.org/lang/pt-BR/): cada versão agrupa as mudanças em Adicionado, Alterado, Corrigido e Removido, com o motivo de cada uma.

## [0.1.0] - 2026-11-10

Primeira versão da Vega, extraída do `@atria/ui` e do `@atria/theme` do Atria (commit `139d036`) e adequada às regras da biblioteca: props nativas, textos sobrescrevíveis com padrão em pt-br, estilos só com tokens e componentes sem nada fixo de um produto.

### Adicionado

- **Ações:** `Button`, `IconButton` e `MenuButton`, para que todo produto use os mesmos botões e menus, com o `aria-label` obrigatório no tipo do `IconButton`.
- **Campos:** `TextField`, `SelectField`, `Checkbox`, `SegmentedField`, `Autocomplete`, `TagField`, `ColorField` e `ColorPicker`, com `DEFAULT_COLOR_FIELD_LABELS` e as conversões `hexToRgb`, `rgbToHex`, `hslToRgb` e `rgbToHsl`, para formulários com o mesmo comportamento de erro, ajuda e teclado.
- **Data e hora:** `Calendar`, `DateField`, `TimeField`, `DateTimeField` e `PeriodField`, com `parseTime`, `maskTime` e `resolvePeriod`, com datas formatadas pelo `Intl` no locale recebido e o relógio injetável pela prop `today`, para testes determinísticos.
- **Dinheiro:** `MoneyField`, com `maskMoneyInput`, `parseMoneyInput` e `formatCents`, que guarda o valor exato em centavos e segue o locale e a moeda recebidos.
- **Estrutura:** `Card`, `PageHeader`, `Toolbar`, `Tabs`, `ViewSwitcher`, `FormGrid` e `FormActions`, para montar telas com a mesma estrutura.
- **Diálogos e avisos:** `Dialog`, `ConfirmDialog`, `Toast` e `ToastRegion`. O diálogo usa o `<dialog>` nativo com `showModal()`, e o aviso indica o tom também por ícone, não só pela cor.
- **Estados:** `EmptyState`, `LoadingState`, `Skeleton`, `ErrorState` e `ProgressBar`, com o carregamento anunciado por `aria-busy`.
- **Marca e itens:** `BrandLogo`, `Badge`, `ItemSwatch` e os ícones de visualização `ListIcon`, `GridIcon`, `ShelfIcon`, `TableIcon`, `DayIcon` e `TimelineIcon`, para que cada produto mostre a própria marca com as mesmas peças.
- **Tema Ishtar Sink:**
  - Tokens `light` e `dark`, mais `radii`, `space`, `spacing`, `fontSizes`, `motion`, `gradients`, `fonts` e `breakpoints`, espelhados em `tokens.css`, para uma única fonte da identidade.
  - Tokens novos `fontWeights`, `lineHeights` e `zIndices`, para que os componentes não tenham peso, entrelinha nem camada literais.
  - `itemPalette`, a paleta dos itens como token, no lugar da paleta fixa do Atria.
  - `--deep-gradient`.
  - `defineTheme` e `ishtarSinkTheme`, para criar um tema próprio com os mesmos tokens.
  - `checkThemeContrast`, `contrastRatio` e `CONTRAST_REQUIREMENTS`, para que um tema próprio passe pelas mesmas regras de contraste AA nos testes da aplicação.
  - Camada de marca sobrescrevível por variáveis CSS num contêiner, sem rebuild.
  - Fontes Outfit e Inter no pacote, com as licenças OFL, sem CDN em tempo de execução.
- **Tipos públicos:** os tipos das props de cada componente (como `ButtonProps` e os `AutocompleteProps`, `AutocompleteOption`, `AutocompleteSingleProps` e `AutocompleteMultipleProps` do `Autocomplete`), `PeriodRule` e os tipos do tema `Theme`, `ThemeName`, `ThemeTokens`, `ContrastRequirement` e `ContrastViolation`, para tipar wrappers e temas próprios.
- **CI e publicação:**
  - Workflow `CI` com lint, typecheck, testes e `pnpm audit --audit-level high` a cada push e pull request.
  - Workflow `Release`, que publica no npm com provenance a partir de uma tag `v*`, só pela CI, para que cada versão publicada seja rastreável até o commit que a gerou.

### Alterado (em relação ao @atria/ui)

- **Props nativas:** os componentes passam a estender as props nativas do elemento (`ComponentPropsWithRef`) e a repassar `className`, `style`, `...rest` e `ref`. Antes, a maioria aceitava só `className`. O motivo é permitir atributos `data-*`, `aria-*` e `ref` de formulário.
- **Props nativas nos campos:** `className`, `style`, `...rest` e `ref` vão para o controle, não para o invólucro.
  - O controle é o `input` em `TextField`, `TimeField`, `MoneyField`, `Autocomplete` e `TagField`; o botão gatilho em `SelectField`, `DateField`, `PeriodField` e `ColorField`; e o `fieldset` no `DateTimeField`.
  - O motivo é que o `ref` do `register` de formulário e os atributos de teste chegam ao elemento que guarda o valor.
  - Quem posicionava o campo pelo `className` precisa envolvê-lo num elemento próprio.
- **Textos visíveis viram props com padrão em pt-br:** antes, alguns eram obrigatórios e outros, fixos. Exemplos: `searchLabel` do `Toolbar` (`Buscar`), `label` do `LoadingState` (`Carregando`), e `title` (`Não foi possível carregar.`) e `retryLabel` (`Tentar de novo`) do `ErrorState`. O motivo é permitir traduzir sem mudar o componente.
- **`Autocomplete` e `TagField`:** `empty_text`, `list_label` e `remove_label` viram `emptyText`, `listLabel` e `removeLabel`, opcionais e com padrão em pt-br, porque as props seguem `camelCase`.
- **`MoneyField`:** `value_cents` vira `valueCents`, e o `onBlur` passa a ser o nativo do campo, chamado com o evento. Moedas sem duas casas decimais (como `JPY`) continuam sem suporte, como no Atria.
- **`FormActions`:** `cancel_label`, `submit_label` e `submit_disabled` viram `cancelLabel` (padrão `Cancelar`), `submitLabel` (padrão `Salvar`) e `submitDisabled`.
- **`Dialog`:** `close_on_backdrop` vira `closeOnBackdrop`, e `described_by` sai em favor do `aria-describedby` nativo, que evita duas props para a mesma coisa.
- **`ColorField` e `ColorPicker`:** `labels` vira `Partial<ColorFieldLabels>`, com padrão em pt-br. O texto da roda vem de `labels.wheelValue(hue, saturation)`, porque antes "graus" era fixo em português. A chave `hex_invalid` vira `hexInvalid`.
- **`PeriodField` e `resolvePeriod`:** os períodos rápidos deixam de ser uma lista fixa do componente.
  - `presets` é obrigatório e cada `PeriodPreset` é `{ id, label, range }`, com `range` do tipo `PeriodRule`: um inteiro de dias ou uma função que recebe `today` e devolve o intervalo.
  - `resolvePeriod(value, today, presets)` ganha o terceiro parâmetro.
  - O motivo é que o componente não fixa formatos de um produto.
- **`ErrorState`:** o botão de nova tentativa aparece sempre que há `onRetry`. No Atria, ele exigia também `retryLabel`, que agora tem padrão.
- **`BrandLogo`:** recebe a marca por `name` e `mark` (o símbolo como `ReactNode`). O "A" do Atria deixa de ser fixo no componente, para que cada produto mostre a própria marca.
- **`ItemSwatch`:** aceita `palette`. Sem ela, usa a paleta padrão do tema, gerada do token `itemPalette`, com a mesma escolha de par por `id` que o Atria.
- **`IconButton`:** o tipo passa a ter `ref` e mantém o `aria-label` obrigatório.
- **Fontes:** os arquivos são renomeados para `kebab-case`: `InterVariable.woff2` vira `inter-variable.woff2` e `Outfit-Variable.ttf` vira `outfit-variable.ttf`.
- **Estilos:** cores, raios, espaços, fontes, pesos, entrelinhas, camadas e durações literais viram tokens, para que uma marca sobrescrita alcance todos os componentes.
  - O título compacto do `PageHeader` passa de 24 px para `--font-size-xl` (21 px), e o nome do `BrandLogo` passa de 22 px para 21 px, porque o tema não tem esses tamanhos.

### Removido

- **`paletteFor` e `artPalettes` do `@atria/theme`:** substituídos pelo token `itemPalette` e pela paleta padrão do `ItemSwatch`, porque eram cores literais fora do tema.

Nenhum componente do `@atria/ui` ficou de fora.

### Corrigido

- **`Calendar`:** o título do mês saía com todas as palavras em maiúscula ("Novembro De 2026"), por causa do `text-transform: capitalize`. Agora só a primeira letra sobe.
- **`Skeleton` e `ProgressBar`:** as linhas do esqueleto e o trilho vazio da barra quase sumiam no tema escuro, com `--surface-muted` sobre o fundo. Agora usam `--surface-hover`, com contraste maior nos dois temas.
- **`TextField`, `TagField`, `SelectField` e `SegmentedField`:** os controles de largura total com `padding` estouravam o contêiner sem um reset global. Agora têm `box-sizing: border-box`.

### Migração do @atria/ui

1. Troque a dependência: remova `@atria/ui` e `@atria/theme` e instale `@ishtar-sink/vega`.
2. Importe os estilos uma vez, na entrada da aplicação: primeiro `@ishtar-sink/vega/tokens.css` (variáveis dos dois temas e fontes) e depois `@ishtar-sink/vega/styles.css` (CSS dos componentes).
3. Troque os imports de `@atria/ui` e `@atria/theme` por `@ishtar-sink/vega`.
4. Renomeie as props listadas em "Alterado": `emptyText`, `listLabel`, `removeLabel`, `valueCents`, `cancelLabel`, `submitLabel`, `submitDisabled`, `closeOnBackdrop` e `aria-describedby` no lugar de `described_by`.
5. Passe `name` e `mark` ao `BrandLogo`, e os `presets` ao `PeriodField`.
6. Troque `paletteFor` pelo `ItemSwatch` ou pelo token `itemPalette`.
7. Onde um campo era posicionado pelo `className`, envolva-o num elemento próprio.

`BrandLogo`, antes e depois:

```tsx
// Antes (@atria/ui)
<BrandLogo name="Atria" />

// Depois (@ishtar-sink/vega)
<BrandLogo
  name="Atria"
  mark={
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor">
      <path d="M3 20L12 4l9 16" />
      <path d="M8 20l4-7 4 7" />
    </svg>
  }
/>
```

`TagField` com props renomeadas, antes e depois:

```tsx
// Antes (@atria/ui)
<TagField
  label="Etiquetas"
  value={tags}
  onChange={setTags}
  list_label="Etiquetas adicionadas"
  remove_label={(tag) => `Remover ${tag}`}
/>

// Depois (@ishtar-sink/vega): os dois textos são opcionais e têm esses padrões
<TagField label="Etiquetas" value={tags} onChange={setTags} />
```
