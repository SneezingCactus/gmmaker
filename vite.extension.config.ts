import { defineConfig } from 'vite';
import { emitExtensionManifest } from './dev/vite-plugins/emit_extension_manifest';

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
  plugins: [emitExtensionManifest()],
});
