import { defineConfig } from 'vite';
import { emitManifest } from './dev/vite-plugins/emit_manifest';

export default defineConfig({
  build: {
    rolldownOptions: {
      input: {
        global_injector: './src/inject/global_injector.ts',
      },
      output: {
        entryFileNames: `[name].js`,
      },
    },
  },
  plugins: [emitManifest()],
});
