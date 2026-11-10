### Ler

- `vostok/work/specs/refined/SPEC-001-extrair-os-componentes-do-atria-para-a-vega.md` (RF-22, RF-23, RN-06, CT-15, FA-01, FA-02, "Premissas e dependências", "Riscos")
- `vostok/rules/project/development-methodology.md` ([project/development-methodology-05] e [project/development-methodology-06])
- `vostok/rules/project/security.md` ([project/security-04])
- `vostok/rules/project/theme.md` ([project/theme-08])
- `README.md`
- `package.json` (campos `version`, `repository`, `exports`, `files`)
- `.github/workflows/ci.yml`
- `src/index.ts`
- `vostok/work/tasks/SPEC-001/TASK-01/tecnico.md` a `vostok/work/tasks/SPEC-001/TASK-13/tecnico.md` (mudanças de props, nomes e tokens em relação ao `@atria/ui` e ao `@atria/theme`, componentes deixados de fora, bugs corrigidos)
- `../atria/packages/ui/src/index.ts`

### Mudar

- `.github/workflows/release.yml` (criar): publicação no npm com provenance a partir de uma tag `v*`, só pela CI (RF-22, RN-06).
- `CHANGELOG.md` (criar): entrada da 0.1.0 no formato de [project/development-methodology-06], com as diferenças em relação ao `@atria/ui` (RF-23).
- `README.md` (alterar): tira o aviso "Em desenvolvimento" e descreve a instalação, os estilos e o tema reais.

### Passos

1. Teste antes: rode o bloco da "Verificação" e confirme que ele falha no primeiro comando, porque `.github/workflows/release.yml` ainda não existe. Confira: o `prettier --check` termina com erro.
2. `.github/workflows/release.yml` (criar): grave exatamente este conteúdo (decisões no `tecnico.md`: token `NPM_TOKEN` na 0.1.0, provenance por OIDC, tag conferida contra o `package.json`, verificação repetida antes de publicar). Confira: `pnpm exec prettier --check .github` e `docker run --rm -v "$PWD:/repo" --workdir /repo rhysd/actionlint:1.7.7 -color=false .github/workflows/release.yml` sem saída.

   ```yaml
   name: Release

   on:
     push:
       tags:
         - 'v*'

   permissions:
     contents: read
     id-token: write

   concurrency:
     group: release-${{ github.ref }}
     cancel-in-progress: false

   jobs:
     publish:
       runs-on: ubuntu-latest
       environment: npm
       steps:
         - uses: actions/checkout@v4
         - uses: pnpm/action-setup@v4
         - uses: actions/setup-node@v4
           with:
             node-version: 22
             cache: pnpm
             registry-url: https://registry.npmjs.org
         - run: pnpm install --frozen-lockfile
         - run: test "v$(node -p "require('./package.json').version")" = "$GITHUB_REF_NAME"
         - run: pnpm lint
         - run: pnpm typecheck
         - run: pnpm test
         - run: pnpm audit --audit-level high
         - run: pnpm build
         - run: npm publish --provenance --access public
           env:
             NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
   ```
3. `CHANGELOG.md` (criar): monte a lista de diferenças lendo a seção de decisões e de mudanças de API de cada `vostok/work/tasks/SPEC-001/TASK-NN/tecnico.md` (TASK-01 a TASK-13) e comparando os nomes de `src/index.ts` com `../atria/packages/ui/src/index.ts`. Escreva em pt-br, nesta estrutura:
   - Título `# Changelog`, uma frase dizendo que o arquivo segue o versionamento semântico ([project/development-methodology-05]) e que cada versão agrupa as mudanças em Adicionado, Alterado, Corrigido e Removido.
   - `## [0.1.0] - AAAA-MM-DD`, com a data do dia da execução, e um parágrafo: primeira versão, extraída do `@atria/ui` e do `@atria/theme` (commit `139d036` do Atria).
   - `### Adicionado`: um item por grupo do `README.md` (Ações, Campos, Data e hora, Dinheiro, Estrutura, Diálogos e avisos, Estados, Marca e itens), com os componentes e as funções auxiliares do grupo; um item para o tema Ishtar Sink (tokens `light`/`dark`, `tokens.css`, `defineTheme`, `ishtarSinkTheme`, `checkThemeContrast`, `contrastRatio`, `CONTRAST_REQUIREMENTS`, camada de marca sobrescrevível, `itemPalette`, `fontWeights`, `lineHeights`, `zIndices`, `--deep-gradient`, fontes Outfit e Inter com OFL); um para CI e publicação com provenance. Cada item diz o motivo.
   - `### Alterado (em relação ao @atria/ui)`: um item por mudança de API registrada nos `tecnico.md`, com o componente ou token afetado e o motivo. Inclua no mínimo: props em snake_case viram camelCase (`empty_text` → `emptyText`, `list_label` → `listLabel`, `remove_label` → `removeLabel`, opcionais com padrão em pt-br; `value_cents` → `valueCents`); `labels` do `ColorField`/`ColorPicker` vira `Partial<ColorFieldLabels>` com `wheelValue(hue, saturation)`; `onBlur` do `MoneyField` passa a ser o nativo; `className`, `style`, `...rest` e `ref` dos campos vão para o controle, não para o invólucro; componentes passam a estender as props nativas (RF-20); textos visíveis viram props (RF-19); `BrandLogo` recebe `name` e `mark` (RF-16); `ItemSwatch` recebe `palette`, com padrão do tema (RF-17); arquivos de fonte renomeados para kebab-case.
   - `### Removido`: `paletteFor` e `artPalettes` (substituídos pelo token `itemPalette`); componentes deixados de fora pelo FA-01, se algum `tecnico.md` registrar.
   - `### Corrigido`: os bugs do Atria corrigidos na extração, se algum `tecnico.md` registrar; senão, a linha "Nenhuma correção nesta versão."
   - `### Migração do @atria/ui`: passo a passo numerado para a spec de troca no Atria (trocar a dependência, importar `@ishtar-sink/vega/tokens.css` e `@ishtar-sink/vega/styles.css`, renomear as props), com um bloco `tsx` antes/depois para o `BrandLogo` e outro para uma prop renomeada (ex.: `TagField` com `emptyText`).
   Confira: o arquivo tem os quatro grupos, a seção de migração e nenhum componente do `src/index.ts` sem menção.
4. `README.md` (alterar):
   - Remova o bloco de citação que começa por `> **Em desenvolvimento.**`. No lugar, uma frase: a Vega nasce da extração do `@atria/ui` e do `@atria/theme` e é publicada como `@ishtar-sink/vega`, com link para o `CHANGELOG.md`.
   - Renomeie `## O que vem do Atria` para `## Componentes`, mantenha a tabela por grupo (acrescente as funções auxiliares e os ícones como estão no `src/index.ts`) e troque o parágrafo "O que parte dessa lista entra na primeira versão..." por uma frase dizendo que todos os componentes da tabela estão na 0.1.0 (ou citando os deixados de fora pelo FA-01, se houver).
   - Troque `## Uso previsto` por `## Instalação` (`pnpm add @ishtar-sink/vega react react-dom`, com `react`/`react-dom` `^19.3.1` como peer dependencies), `## Estilos` (bloco `ts` com `import '@ishtar-sink/vega/tokens.css';` e depois `import '@ishtar-sink/vega/styles.css';`, explicando que o `tokens.css` traz as variáveis dos dois temas e as fontes, e o `styles.css`, o CSS dos componentes; tema escuro com `data-theme="dark"` num elemento ancestral; marca sobrescrita por variáveis como `--primary` num contêiner, sem rebuild) e `## Uso` (o exemplo `tsx` atual com `Button` e `Card`).
   - Acrescente `## Tema próprio`: bloco `ts` com `defineTheme({ light: {...}, dark: {...} })` e um teste da aplicação com `expect(checkThemeContrast(meuTema)).toEqual([])`.
   - Remova a frase "O pacote e a forma de importar os estilos podem mudar até a primeira versão." Mantenha "Temas", "Princípios", "Sobre o nome" e "Licença".
   Confira: `grep -c 'Em desenvolvimento' README.md` imprime `0`.
5. Rode o bloco da "Verificação" até antes da linha `# evidência: npm-view.txt` (comandos locais). Confira: todos com código 0.
6. **PARE** e peça ao usuário, com o template `question`, os passos manuais (o agente não faz nenhum deles, RN-06, [project/security-04]):
   1. Conferir que a organização `ishtar-sink` existe no npm e criar um token granular com permissão de escrita no escopo `@ishtar-sink` (com "Bypass 2FA" para automação), gravado como segredo `NPM_TOKEN` do ambiente `npm` (ou do repositório) em `Ishtar-Sink/Vega`.
   2. Fazer o commit do trabalho pela skill `approve-commit` e levar a `main` ao GitHub, com a CI verde.
   3. Criar e enviar a tag: `git tag v0.1.0 && git push origin v0.1.0`.
   4. Acompanhar o workflow "Release" até `success`. Se falhar (FA-02), corrigir pela CI, apagar e recriar a tag (`git push origin :refs/tags/v0.1.0`); nunca `npm publish` local.
   5. Refletir em `Ishtar-Sink/.github` `docs/identidade-ecossistema.md` o comentário de origem novo do `tokens.ts`, os tokens `itemPalette`, `fontWeights`, `lineHeights` e `zIndices` e o `--deep-gradient` ([project/theme-08]), e anexar o link do pull request como evidência `identidade-ecossistema.png`.
   Confira: o usuário confirma que o workflow "Release" terminou.
7. Rode o bloco da "Verificação" inteiro. Confira: código 0, com `npm-view.txt` mostrando a versão 0.1.0 e a provenance.
