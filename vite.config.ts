import { defineConfig } from 'vite';
import { emitManifest } from './dev/vite-plugins/emit_manifest';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rolldownOptions: {
      input: {
        content_script: './src/content_script.ts',
        global_injector: './src/inject/global_injector.ts',
      },
      output: {
        entryFileNames: `[name].js`,
      },
    },
  },
  plugins: [emitManifest()],
});
