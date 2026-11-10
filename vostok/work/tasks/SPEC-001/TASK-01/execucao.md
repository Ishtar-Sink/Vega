### Ler

- `vostok/work/specs/refined/SPEC-001-extrair-os-componentes-do-atria-para-a-vega.md` (seções "Requisitos funcionais", "Requisitos não funcionais", "Contratos e interfaces")
- `vostok/rules/project/stack.md`
- `vostok/rules/project/code-style.md`
- `vostok/rules/project/architecture.md`
- `README.md`
- `../atria/package.json` (campos `packageManager` e `engines`)
- `../atria/pnpm-workspace.yaml`
- `../atria/.gitignore`
- `../atria/packages/ui/package.json`
- `../atria/packages/theme/package.json`
- `../atria/packages/ui/tsconfig.json`
- `../atria/packages/ui/eslint.config.js`
- `../atria/packages/ui/vitest.config.ts`
- `../atria/packages/ui/src/test/setup.ts`
- `../atria/packages/ui/src/test/vitest-axe.d.ts`

### Mudar

- `package.json` (criar): manifesto de `@ishtar-sink/vega` 0.1.0, scripts, `exports`, `files`, peer dependencies e devDependencies alinhadas ao Atria (RF-01, RNF-05, RNF-06).
- `pnpm-workspace.yaml` (criar): workspace pnpm com o pacote na raiz ([project/architecture-01]).
- `pnpm-lock.yaml` (criar): lockfile gerado pelo `pnpm install`, exigido pelo `--frozen-lockfile` da CI.
- `.gitignore` (criar): tira `node_modules/`, `dist/` e `coverage/` do Git e, por padrão, do Prettier.
- `.prettierignore` (criar): tira do `prettier --check .` o harness (`vostok/`, `.claude/`), o lockfile e a documentação em Markdown.
- `tsconfig.json` (criar): TypeScript `strict` com `noUncheckedIndexedAccess`, JSX, tipos do Vitest, do Node e do `vite/client` (RNF-03).
- `eslint.config.js` (criar): ESLint `strictTypeChecked`, `react-hooks` e `jsx-a11y` ([project/code-style-01]).
- `vite.config.ts` (criar): build em modo biblioteca (ESM, `.d.ts`, `dist/style.css` e `dist/tokens.css`) e configuração do Vitest (RF-01).
- `src/test/setup.ts` (criar): setup do Testing Library, do jest-dom, do `vitest-axe` e dos substitutos do jsdom (`<dialog>`, canvas, `scrollIntoView`).
- `src/test/vitest-axe.d.ts` (criar): tipos do matcher `toHaveNoViolations` no `expect` do Vitest.

### Passos

1. Teste antes da configuração: rode o bloco da "Verificação" e confirme que ele falha já no primeiro comando, porque ainda não há `package.json`. Confira: `pnpm install --frozen-lockfile` termina com erro.
2. `package.json` (criar): grave exatamente este conteúdo (versão 0.1.0 do contrato da spec; `dependencies` não existe, RNF-06; `vite`, `vite-plugin-dts` e `@vitejs/plugin-react` são só do build e ficam em devDependencies; `repository` é exigido pela provenance da TASK-14). Confira: `node -e "require('./package.json')"`.

   ```json
   {
     "name": "@ishtar-sink/vega",
     "version": "0.1.0",
     "description": "Biblioteca de componentes React e temas do ecossistema Ishtar Sink.",
     "type": "module",
     "license": "AGPL-3.0-only",
     "packageManager": "pnpm@11.21.0",
     "engines": {
       "node": ">=22"
     },
     "repository": {
       "type": "git",
       "url": "git+https://github.com/Ishtar-Sink/Vega.git"
     },
     "homepage": "https://github.com/Ishtar-Sink/Vega#readme",
     "types": "./dist/index.d.ts",
     "exports": {
       ".": "./dist/index.js",
       "./styles.css": "./dist/style.css",
       "./tokens.css": "./dist/tokens.css"
     },
     "files": [
       "dist",
       "fonts"
     ],
     "sideEffects": [
       "**/*.css"
     ],
     "scripts": {
       "build": "vite build",
       "lint": "eslint . --max-warnings 0 && prettier --check .",
       "typecheck": "tsc --noEmit",
       "test": "vitest run"
     },
     "prettier": {
       "singleQuote": true,
       "printWidth": 100
     },
     "peerDependencies": {
       "react": "^19.3.1",
       "react-dom": "^19.3.1"
     },
     "devDependencies": {
       "@eslint/js": "^10.0.1",
       "@testing-library/jest-dom": "^7.0.1",
       "@testing-library/react": "^16.3.3",
       "@testing-library/user-event": "^14.6.8",
       "@types/node": "^22.0.0",
       "@types/react": "^19.3.0",
       "@types/react-dom": "^19.3.0",
       "@vitejs/plugin-react": "^6.1.2",
       "axe-core": "^4.14.0",
       "eslint": "^10.14.0",
       "eslint-plugin-jsx-a11y": "^6.10.2",
       "eslint-plugin-react-hooks": "^7.1.1",
       "jsdom": "^30.1.3",
       "prettier": "^3.9.10",
       "react": "^19.3.1",
       "react-dom": "^19.3.1",
       "typescript": "^6.0.3",
       "typescript-eslint": "^8.72.1",
       "vite": "^8.3.5",
       "vite-plugin-dts": "^5.1.2",
       "vitest": "^5.0.5",
       "vitest-axe": "^0.1.0"
     }
   }
   ```
3. `pnpm-workspace.yaml` (criar): grave as duas linhas abaixo. Confira: o arquivo tem `packages:` e `- '.'`.

   ```yaml
   packages:
     - '.'
   ```
4. `.gitignore` (criar): grave uma entrada por linha: `node_modules/`, `dist/`, `coverage/`, `*.tsbuildinfo`. Confira: `git check-ignore dist/index.js` imprime o caminho.
5. `.prettierignore` (criar): grave uma entrada por linha: `vostok/`, `.claude/`, `pnpm-lock.yaml`, `*.md`. O Prettier 3 já lê o `.gitignore`, então `dist/` e `node_modules/` não se repetem aqui. Confira: `pnpm exec prettier --check .` (depois do passo 6) não lista nada de `vostok/` nem `README.md`.
6. `pnpm-lock.yaml` (criar): rode `pnpm install`. Se o pnpm recusar alguma versão por `minimumReleaseAge`, acrescente ao `pnpm-workspace.yaml` a chave `minimumReleaseAgeExclude` com a versão exata recusada, como em `../atria/pnpm-workspace.yaml`, e rode de novo. Confira: `pnpm install --frozen-lockfile` termina sem erro.
7. `tsconfig.json` (criar): grave exatamente este conteúdo (inclui os testes de `src`, para o `tsc` avaliar os `@ts-expect-error` da TASK-02; `vite/client` dá o tipo dos `*.module.css`, sem um `.d.ts` próprio). Confira no passo 11.

   ```json
   {
     "compilerOptions": {
       "strict": true,
       "noUncheckedIndexedAccess": true,
       "module": "ESNext",
       "moduleResolution": "bundler",
       "target": "ES2022",
       "lib": ["ES2022", "DOM", "DOM.Iterable"],
       "jsx": "react-jsx",
       "types": ["vitest/globals", "node", "vite/client"],
       "noEmit": true,
       "skipLibCheck": true
     },
     "include": ["src", "eslint.config.js", "vite.config.ts"]
   }
   ```
8. `eslint.config.js` (criar): grave exatamente este conteúdo. Confira no passo 11.

   ```js
   import reactHooks from 'eslint-plugin-react-hooks';
   import jsxA11y from 'eslint-plugin-jsx-a11y';
   import tseslint from 'typescript-eslint';

   export default tseslint.config(
     { ignores: ['node_modules', 'dist', 'coverage', 'fonts', 'vostok', '.claude'] },
     ...tseslint.configs.strictTypeChecked,
     reactHooks.configs.flat.recommended,
     jsxA11y.flatConfigs.recommended,
     {
       languageOptions: {
         parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
       },
     },
     { files: ['eslint.config.js'], ...tseslint.configs.disableTypeChecked },
   );
   ```
9. `src/test/setup.ts` e `src/test/vitest-axe.d.ts` (criar): copie sem alteração `../atria/packages/ui/src/test/setup.ts` e `../atria/packages/ui/src/test/vitest-axe.d.ts`. O setup já traz os substitutos do jsdom de que as TASK-05 (canvas) e TASK-09 (`<dialog>`) precisam, para nenhuma tarefa de componente mexer neste arquivo. Confira: `diff ../atria/packages/ui/src/test/setup.ts src/test/setup.ts` sem diferença.
10. `vite.config.ts` (criar): grave exatamente este conteúdo. O plugin `vega-theme-css` gera `dist/tokens.css` com `src/theme/fonts.css` (URLs `../../fonts/` reescritas para `../fonts/`, válidas a partir de `dist/`) seguido de `src/theme/tokens.css`; os dois arquivos são da TASK-02 e só são lidos no build. Confira no passo 11.

    ```ts
    import { readFileSync } from 'node:fs';
    import { fileURLToPath } from 'node:url';
    import react from '@vitejs/plugin-react';
    import type { Plugin } from 'vite';
    import { defineConfig } from 'vitest/config';
    import dts from 'vite-plugin-dts';

    const themeDir = fileURLToPath(new URL('./src/theme/', import.meta.url));

    // Publica o tema como dist/tokens.css: as fontes (com o caminho visto de dist/) e os tokens.
    function themeCss(): Plugin {
      return {
        name: 'vega-theme-css',
        apply: 'build',
        generateBundle() {
          const fonts = readFileSync(`${themeDir}fonts.css`, 'utf8').replaceAll(
            '../../fonts/',
            '../fonts/',
          );
          const tokens = readFileSync(`${themeDir}tokens.css`, 'utf8');
          this.emitFile({ type: 'asset', fileName: 'tokens.css', source: `${fonts}\n${tokens}` });
        },
      };
    }

    export default defineConfig({
      plugins: [
        react(),
        dts({
          include: ['src'],
          exclude: ['src/**/*.test.ts', 'src/**/*.test.tsx', 'src/test'],
          entryRoot: 'src',
        }),
        themeCss(),
      ],
      css: { modules: { localsConvention: 'camelCaseOnly' } },
      build: {
        lib: {
          entry: 'src/index.ts',
          formats: ['es'],
          fileName: 'index',
          cssFileName: 'style',
        },
        rolldownOptions: {
          external: [/^react($|\/)/, /^react-dom($|\/)/],
        },
      },
      test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./src/test/setup.ts'],
        css: { include: /.+/, modules: { classNameStrategy: 'non-scoped' } },
      },
    });
    ```
11. Formatação e checagens: rode `pnpm exec prettier --write package.json pnpm-workspace.yaml tsconfig.json eslint.config.js vite.config.ts src/test`, depois `pnpm lint` e `pnpm typecheck`. Confira: os dois terminam com código 0 e o `prettier --check` termina com `All matched files use Prettier code style!`.
12. Não crie `src/index.ts`, `src/theme/` nem nenhum teste no projeto (são das TASK-12 e TASK-02). Rode o bloco da "Verificação" inteiro. Confira: termina com código 0; a sonda do build roda numa cópia temporária, fora do projeto, e é apagada no fim.
