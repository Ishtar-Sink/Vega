<!-- Escrito no planejamento com o que a tarefa vai fazer e enriquecido na conclusão com o que foi feito. -->

## Abordagem

TDD: primeiro `src/index.test.ts` com a lista fechada da superfície pública, depois `src/index.ts`. O índice segue o formato de `../atria/packages/ui/src/index.ts` (um `export` e um `export type` por módulo), acrescido do tema, que no Atria era outro pacote. O build já está configurado pela TASK-01 (`vite.config.ts`, inclusive o plugin que gera `dist/tokens.css` a partir de `src/theme/fonts.css` e `src/theme/tokens.css`, com as URLs das fontes reescritas para `../fonts/`); esta tarefa o roda pela primeira vez com o código real e confere o pacote.

`src/index.test.ts` é um arquivo novo sob a responsabilidade do `src/index.ts` (CT-02), por isso entra em "Mudar".

## Superfície pública

- Componentes e funções: os do `@atria/ui` (RF-09 a RF-18), mais `ColorPickerProps` (o Atria não exportava o tipo de props do `ColorPicker`, exigido pelo RF-02) e `DEFAULT_COLOR_FIELD_LABELS` (textos padrão do campo de cor, para quem traduz; [project/language-06]), ambos da TASK-05.
- Tema (TASK-02, via `src/theme/index.ts`): `light`, `dark`, `radii`, `space`, `spacing`, `fontSizes`, `fontWeights`, `lineHeights`, `zIndices`, `motion`, `gradients`, `fonts`, `breakpoints`, `itemPalette`, `defineTheme`, `ishtarSinkTheme`, `contrastRatio`, `checkThemeContrast`, `CONTRAST_REQUIREMENTS` e os tipos `Theme`, `ThemeName`, `ThemeTokens`, `ContrastRequirement`, `ContrastViolation` (RF-03 a RF-07).
- Fora: `paletteFor`/`artPalettes` (ficam no Atria; viram o token `itemPalette`) e o `palette.ts` interno do `ItemSwatch` (TASK-11).

## Decisões

| Decisão | Alternativa descartada | Motivo |
|---|---|---|
| Exportações explícitas, nome a nome. | `export *` de cada módulo. | O índice vira a lista revisável da API ([project/architecture-03], [project/development-methodology-05]); nada interno vaza. |
| O teste confere a lista exata das chaves do módulo. | Só conferir que cada nome existe. | Uma exportação acidental (por exemplo, a paleta do Atria) também reprova. |
| Tipos conferidos pelo `tsc` (import type + `expectTypeOf`). | Teste de tipos separado (`*.test-d.ts`). | Sem configuração nova; o `pnpm typecheck` já cobre `src`. |
| Exportação do `dist/` conferida com `import('@ishtar-sink/vega')` e `import.meta.resolve` (autorreferência do Node pelo `exports`). | Só checar a existência dos arquivos. | Prova que os caminhos do `exports` do `package.json` batem com o build. |
| RNF-04 por busca de APIs de rede e de URLs no JS e CSS do `dist/`, ignorando `http://www.w3.org/`. | Buscar só `fetch`. | O namespace SVG dos ícones não é requisição; qualquer outra URL é. |
| CT-08 (fontes no pacote) conferido aqui com `npm pack --dry-run`. | Conferir na TASK-02. | Só aqui existe o `dist/` completo; pedido do Coordenador. |

## Riscos

- Um componente que acesse `document`/`window` ao ser carregado quebra o `import` do `dist/index.js` no Node; o passo 6 manda registrar o bloqueio em vez de contornar.
- Nome divergente de uma tarefa de componente: o passo 1 manda usar o nome registrado no `tecnico.md` dela e citá-lo aqui.
- A contagem de 72 nomes e 75 testes muda se uma tarefa de componente acrescentar um tipo ou valor público registrado; o teste e o resultado esperado acompanham.

## Referências

RF-01, RF-02, RF-09 a RF-18, RNF-04, CT-01, CT-02, CT-08; RN-02; [project/architecture-03], [project/security-01].

## Arquivos em comum na onda

Onda 5 só tem esta tarefa: nenhum arquivo em comum.
