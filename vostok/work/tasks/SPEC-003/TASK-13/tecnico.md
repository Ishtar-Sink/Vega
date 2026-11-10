<!-- Escrito no planejamento com o que a tarefa vai fazer e enriquecido na conclusão com o que foi feito. -->

## Abordagem

TDD ([project/development-methodology-01]): primeiro os testes das funções de segurança (`prose.utils.test.ts`) e do componente (`prose.test.tsx`), vistos falhando, depois o código. O Markdown passa por `react-markdown` 10, que monta uma árvore e a converte em elementos React, sem `innerHTML`. O `remark-gfm` traz as tabelas e o tachado. O `rehype-sanitize` 6 limpa a árvore hast por uma lista do que é permitido, e um plugin próprio acrescenta `rel` e `loading` depois da limpeza. A entrada `@ishtar-sink/vega/prose` é o `src/prose/index.ts`, que a TASK-01 já registrou no `vite.config.ts` e no `exports`. O `src/index.ts` não exporta o `Prose`, e a TASK-15 confere essa ausência.

Arquivos, um contexto por arquivo ([project/code-style-09]):

| Arquivo | Conteúdo |
|---|---|
| `prose.tsx` | componente e o invólucro interno da tabela |
| `prose.types.ts` | `ProseProps`, `ProseComponents`, `ProsePlugin` |
| `prose.constants.ts` | `PROSE_SCHEMA` |
| `prose.utils.ts` | `proseUrlTransform`, `rehypeProseLinks` |
| `prose.module.css` | tipografia e tabela |
| `index.ts` | entrada pública |

## Decisões

| # | Decisão | Alternativas descartadas | Critério de escolha |
|---|---|---|---|
| D-01 | Três camadas de segurança: `skipHtml` (o HTML cru do Markdown nem entra na árvore), `rehype-sanitize` com `PROSE_SCHEMA` e `urlTransform` próprio. | (a) Só o `rehype-sanitize`. (b) `rehype-raw` com sanitização depois. | Defesa em profundidade a custo zero: cada camada cobre um vetor do CB-08, e o `rehype-raw` traria o HTML de volta, o que a spec proíbe ([project/security-03], RNF-07). |
| D-02 | `PROSE_SCHEMA` montado à mão a partir da lista da spec (títulos, parágrafos, listas, ênfase, código, citações, tabelas, links e imagens), reaproveitando do `defaultSchema` só o `clobber`/`clobberPrefix`. | Espalhar o `defaultSchema` do GitHub, que permite `details`, `summary`, `sup`, `input` e outros. | A spec pede lista do que é permitido (RF-23); ampliar é papel dos produtos, por `components`. |
| D-03 | `rel` nos links externos e `loading="lazy"` nas imagens por um plugin rehype próprio (`rehypeProseLinks`), aplicado depois da limpeza. | (a) `components.a` e `components.img` padrão. (b) Dependência `rehype-external-links`. | Com `components`, o produto que troca o `a` perderia o `rel`; o plugin roda antes dos componentes e vale para qualquer troca. Uma função recursiva pequena evita dependência nova ([project/stack-07]). |
| D-04 | `proseUrlTransform` bloqueia `javascript:`, `data:` e `vbscript:` (com espaços e maiúsculas) e delega o resto ao `defaultUrlTransform`. | Só o `defaultUrlTransform`. | O padrão já bloqueia esquemas fora de uma lista, mas a regra explícita deixa o teste de segurança independente da versão do pacote. |
| D-05 | A tabela vai dentro de um `<div>` com `overflow-x: auto`, por `components.table` interno, mesclado antes dos `components` do produto. | `display: block` com `overflow` no próprio `<table>`. | O `display: block` tira a semântica de tabela em alguns leitores de tela; o invólucro mantém o papel `table` (CB-09). |
| D-06 | Tamanho por classe (`base` 16 px = `--font-size-base`, `reading` 18 px = `--font-size-lg`), medida `max-width: 68ch` e `line-height: var(--line-height-relaxed)` na raiz. | `clamp()` fluido. | A spec fixa os dois tamanhos (RF-26), e os tokens já existem. |
| D-07 | `ProsePlugin` e `ProseComponents` derivados dos tipos do `react-markdown` (`NonNullable<Options['remarkPlugins']>[number]` e `Components`). | Importar `PluggableList` do `unified`. | O `unified` é dependência transitiva; derivar do pacote direto não exige dependência nova nos tipos públicos. |

## Riscos

- **Um plugin do produto (ex.: matemática) gera nós que a lista permitida remove.** O `remark-math` produz `code` com `className` `language-math`, que passa pela regra `/^language-./`. O produto mapeia esse `code` pelo próprio componente de KaTeX, em `components`. Outro tipo de nó exige ampliar o `PROSE_SCHEMA`, o que é uma mudança da Vega, não do produto.
- **Os tipos do `react-markdown` mudam numa versão maior:** os tipos públicos derivados deles mudam junto. O `^10` fixado pela TASK-01 evita a troca automática.
- **O jsdom não mede o layout:** a rolagem da tabela a 360 px é comprovada pelo CSS no teste e pelo print, não pelo jsdom.

## Referências da spec

RF-22 a RF-27; CT-20 a CT-24; CB-08, CB-09; RNF-01, RNF-06, RNF-07, RNF-08; RN-04 (as dependências e a justificativa ficam na TASK-01); decisão 2 do registro da spec; [project/security-03], [project/stack-07], [project/language-06].

## Arquivos em comum com a onda

Nenhum. A onda 2 (TASK-02 e TASK-13) cria pastas diferentes. A TASK-13 só lê o `vite.config.ts` e o `package.json` da TASK-01. O `pnpm build` da Verificação apaga e recria o `dist/`, então o Coordenador não deve rodar a Verificação desta tarefa ao mesmo tempo que outro comando que dependa do `dist/`.
