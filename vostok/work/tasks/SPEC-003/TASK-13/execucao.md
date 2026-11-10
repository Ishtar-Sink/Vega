### Ler

- `vostok/work/specs/refined/SPEC-003-lote-1-de-componentes-para-o-synestia.md` (RF-22 a RF-27, CT-20 a CT-24, CB-08, CB-09, RNF-06, RNF-07, "Contratos e interfaces": `ProseProps` e o `exports`)
- `vostok/work/tasks/SPEC-003/TASK-13/tecnico.md` (decisões D-01 a D-07)
- `docs/KT-001-vega-lote-1.md` (seção "8. `Prose`")
- `vite.config.ts` e `package.json` (entrada `prose` e `./prose` configuradas pela TASK-01)
- `node_modules/react-markdown/lib/index.d.ts` (tipos `Options`, `Components`, `UrlTransform`, `defaultUrlTransform`)
- `node_modules/rehype-sanitize/lib/index.d.ts` e `node_modules/hast-util-sanitize/lib/schema.js` (`defaultSchema`)
- `src/page-header/page-header.module.css` (exemplo de `letter-spacing` negativo em `calc(var(--space) * N)` nos títulos)
- `src/theme/tokens.css` (`--font-body`, `--font-display`, `--font-size-base`, `--font-size-lg`, `--line-height-relaxed`, cores e `--motion-*`)
- `src/card/card.tsx` e `src/card/card.test.tsx` (padrão de props nativas e de teste de `className`, `style` e `data-*`)

### Mudar

- `src/prose/prose.tsx` (criar): componente `Prose`, que renderiza o `markdown` com `react-markdown` ou estiliza os `children` (RF-22, RF-25, RF-26).
- `src/prose/prose.types.ts` (criar): `ProseProps`, `ProseComponents` e `ProsePlugin` (contrato da spec).
- `src/prose/prose.constants.ts` (criar): `PROSE_SCHEMA`, a lista do que é permitido no `rehype-sanitize` (RF-23).
- `src/prose/prose.utils.ts` (criar): `proseUrlTransform` (bloqueia `javascript:`, `data:` e `vbscript:`) e o plugin `rehypeProseLinks` (`rel` nos links externos e `loading="lazy"` nas imagens) (RF-23, RF-24).
- `src/prose/prose.module.css` (criar): tipografia de leitura, tamanhos `base` e `reading`, tabela com rolagem horizontal e imagens com largura máxima de 100% (RF-26, CB-09).
- `src/prose/index.ts` (criar): entrada `@ishtar-sink/vega/prose`, que exporta `Prose` e os tipos (RF-27).
- `src/prose/prose.test.tsx` (criar): testes de renderização, sanitização, extensão, tamanhos e props nativas (CT-20 a CT-23, CB-08, CB-09).
- `src/prose/prose.utils.test.ts` (criar): testes de `proseUrlTransform` e de `rehypeProseLinks` (RF-23, RF-24).

### Passos

Regras comuns a todos os passos (decididas em `tecnico.md`):

- Nenhum arquivo de produção passa de 200 linhas, e cada um tem um único contexto ([project/code-style-08], [project/code-style-09]).
- `ProseProps extends Omit<ComponentPropsWithRef<'div'>, 'children'>`: `className` (somado à classe do módulo), `style`, `ref` e `...rest` vão ao `<div>` raiz. JSDoc em pt-br em cada prop pública.
- CSS só com tokens. Medidas sem token viram `calc(var(--space) * N)`, e `68ch` e `100%` ficam como estão. Nenhum `font-weight`, `line-height` ou `z-index` numérico.
- Nenhum `dangerouslySetInnerHTML` e nenhum `rehype-raw` (RNF-07).

1. `src/prose/prose.utils.test.ts` (criar), antes do código:
   - `describe('proseUrlTransform')`: devolve a URL para `https://exemplo.com`, `/caminho`, `#ancora` e `mailto:a@b.c`, e devolve `''` para `javascript:alert(1)`, ` JavaScript:alert(1)` (com espaço e maiúscula), `data:text/html,x` e `vbscript:x`.
   - `describe('rehypeProseLinks')`: numa árvore hast de teste com um `a` de `href` `https://exemplo.com`, um `a` de `href` `/interno` e um `img`, aplica o transformador e confere `rel: ['noopener', 'noreferrer']` só no externo e `loading: 'lazy'` no `img`.

   Rode `pnpm vitest run src/prose`. Confira: falha porque `./prose.utils` não existe.
2. `src/prose/prose.test.tsx` (criar), antes do componente, importando `Prose` de `./prose`:
   - `it('renders markdown as React elements')`: Markdown com `# Título`, uma lista, uma tabela GFM, um link externo e uma imagem. Confira os papéis `heading`, `list`, `table`, `link` e `img`, `rel="noopener noreferrer"` no link e `loading="lazy"` na imagem (CT-20).
   - `it('styles children when there is no markdown')`: `<Prose><p>Texto</p></Prose>` mostra o parágrafo dentro da raiz (RF-22).
   - `it('drops raw HTML and dangerous URLs')`: o Markdown do CB-08 (`<script>alert(1)</script>`, `<img src=x onerror="alert(1)">` e `[clique](javascript:alert(1))`). Confira que o container não tem `script`, que nenhum elemento tem atributo começando por `on` e que nenhum `href` começa por `javascript:` (CT-21, CB-08).
   - `it('replaces an element through components')`: `components={{ h2: ({ children }) => <h2 data-testid="titulo">{children}</h2> }}` com `## Seção` (CT-22).
   - `it('applies remark plugins')`: um plugin de teste que troca o valor de todo nó `text` por letras maiúsculas; o texto aparece em maiúsculas (CT-22).
   - `it('uses the reading size')`: `size="reading"` põe a classe `reading` na raiz, e sem `size` a classe é `base` (CT-23).
   - `it('keeps the reading measure and scrolls wide tables')`: lê `prose.module.css` com `readFileSync(join(import.meta.dirname, 'prose.module.css'), 'utf8')`. Confira `max-width: 68ch` na raiz, `overflow-x: auto` no invólucro da tabela, `max-width: 100%` em `img`, `line-height: var(--line-height-relaxed)` e o tamanho `var(--font-size-lg)` em `.reading` (CT-23, CB-09).
   - `it('has no axe violations')` com o Markdown do primeiro teste.
   - `it('passes className, style and data attributes to the root')` e `it('forwards the ref to the root')`.

   Rode `pnpm vitest run src/prose`. Confira: falha porque `./prose` não existe.
3. `src/prose/prose.types.ts` (criar):
   - `import type { Components, Options } from 'react-markdown';`
   - `export type ProseComponents = Components;`
   - `export type ProsePlugin = NonNullable<Options['remarkPlugins']>[number];`
   - `ProseProps` exatamente como o contrato da spec, com JSDoc.

   `src/prose/prose.constants.ts` (criar): `PROSE_SCHEMA: Schema` (`import { defaultSchema, type Options as Schema } from 'rehype-sanitize'`), sem espalhar o `defaultSchema` inteiro:
   - `tagNames`: `h1` a `h6`, `p`, `br`, `hr`, `ul`, `ol`, `li`, `em`, `strong`, `del`, `code`, `pre`, `blockquote`, `table`, `thead`, `tbody`, `tr`, `th`, `td`, `a`, `img`.
   - `attributes`: `a: ['href', 'title']`, `img: ['src', 'alt', 'title']`, `th` e `td: ['align']`, `code: [['className', /^language-./]]`, `ol: ['start']`.
   - `protocols`: `href: ['http', 'https', 'mailto']`, `src: ['http', 'https']`.
   - `clobberPrefix` e `clobber`: os do `defaultSchema`.
   - `strip: ['script', 'style']`.

   `src/prose/prose.utils.ts` (criar):
   - `proseUrlTransform(url: string): string`: tira os espaços das pontas e devolve `''` quando o esquema, em minúsculas, é `javascript:`, `data:` ou `vbscript:`; senão devolve `defaultUrlTransform(url)` de `react-markdown`.
   - `rehypeProseLinks()`: um plugin unified que percorre a árvore hast com uma função recursiva própria (sem dependência nova). Põe `rel: ['noopener', 'noreferrer']` nos `a` cujo `href` começa por `http://` ou `https://`, e `loading: 'lazy'` nos `img`.

   Confira: `pnpm vitest run src/prose/prose.utils.test.ts` passa.
4. `src/prose/prose.module.css` (criar):
   - `.root`: `font-family: var(--font-body)`, `color: var(--text)`, `line-height: var(--line-height-relaxed)`, `max-width: 68ch` e `overflow-wrap: anywhere`.
   - `.base`: `font-size: var(--font-size-base)`; `.reading`: `font-size: var(--font-size-lg)`.
   - Títulos `.root :where(h1, h2, h3, h4)`: `font-family: var(--font-display)`, `line-height: var(--line-height-tight)`, `letter-spacing: calc(var(--space) * -0.15)`, `font-weight: var(--font-weight-bold)` e margens em `--s*`.
   - `code`, `pre`, `blockquote`, `a` e `hr` com cores de token; `a` com `text-decoration: underline`, para não depender só da cor; o foco do link com `outline` em `--primary`.
   - `.tableWrap`: `overflow-x: auto` e `max-width: 100%`; `table`: `border-collapse: collapse`, com bordas `calc(var(--space) / 4) solid var(--border)`.
   - `img`: `max-width: 100%` e `height: auto`.

   `src/prose/prose.tsx` (criar):
   - Com `markdown`, renderiza `<ReactMarkdown>` com `skipHtml`, `remarkPlugins={[remarkGfm, ...(remarkPlugins ?? [])]}`, `rehypePlugins={[[rehypeSanitize, PROSE_SCHEMA], rehypeProseLinks]}` e `urlTransform={proseUrlTransform}`.
   - `components` recebe `{ table: TableWrap, ...components }`, em que `TableWrap` é um componente interno que envolve o `<table>` num `<div className={styles.tableWrap}>`. Ele fica no próprio arquivo, por ser parte do JSX do `Prose`.
   - Sem `markdown`, renderiza os `children` dentro da raiz.
   - Raiz: `<div ref={ref} className={[styles.root, styles[size], className]...} {...rest}>`.

   Confira: `pnpm vitest run src/prose` passa.
5. `src/prose/index.ts` (criar): `export { Prose } from './prose';` e `export type { ProseProps, ProseComponents, ProsePlugin } from './prose.types';`. Confira: `pnpm build` gera `dist/prose.js`, e `grep -c react-markdown dist/index.js` imprime `0`.
6. Pasta da tarefa: rode `pnpm exec prettier --write src/prose` e depois a Verificação inteira. Confira: todos os comandos terminam com código 0, e o print `prose-temas.png` mostra o texto nos dois temas e a tabela rolando a 360 px.
