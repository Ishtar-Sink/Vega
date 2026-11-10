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
