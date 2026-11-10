import { existsSync, readFileSync } from 'node:fs';
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

// A entrada `prose` só existe quando o componente existe: o parser de Markdown fica fora do índice principal.
const entries: Record<string, string> = existsSync('src/prose/index.ts')
  ? { index: 'src/index.ts', prose: 'src/prose/index.ts' }
  : { index: 'src/index.ts' };

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
      entry: entries,
      formats: ['es'],
      fileName: (_format, name) => `${name}.js`,
      cssFileName: 'style',
    },
    rolldownOptions: {
      external: [
        /^react($|\/)/,
        /^react-dom($|\/)/,
        /^(lucide-react|react-markdown|remark-gfm|rehype-sanitize)($|\/)/,
      ],
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: { include: /.+/, modules: { classNameStrategy: 'non-scoped' } },
  },
});
