import { defineConfig } from 'vite';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { deliverStrippedMonacoTsLib } from './dev/vite-plugins/deliver_stripped_monaco';
import { visualizer } from 'rollup-plugin-visualizer';
import { deliverStringifiedDeclarations } from './dev/vite-plugins/deliver_stringified_declarations';
import { addMissingMonacoTriggers } from './dev/vite-plugins/add_missing_monaco_triggers';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    emptyOutDir: false,
    assetsInlineLimit: Infinity,
    chunkSizeWarningLimit: Infinity,
    rolldownOptions: {
      input: {
        content_script: './src/content_script.ts',
      },
      output: {
        format: 'iife',
        codeSplitting: false,
        entryFileNames: `[name].js`,
      },
      transform: {
        define: {
          'import.meta': '{}',
        },
      },
    },
  },
  worker: {
    plugins: () => [deliverStrippedMonacoTsLib()],
  },
  plugins: [
    cssInjectedByJsPlugin({
      jsAssetsFilterFunction: chunk => chunk.fileName !== 'content_script.ts',
    }),
    svelte(),
    deliverStringifiedDeclarations(),
    addMissingMonacoTriggers(),
    visualizer({ open: false, filename: 'dist/stats.html', gzipSize: true }),
  ],
});
