import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    copyPublicDir: false,
    outDir: 'dist-sandbox',
    rolldownOptions: {
      input: {
        init_sandbox: './src/sandbox/init_sandbox.ts',
      },
      output: {
        format: 'iife',
        strict: true,
        entryFileNames: `[name].js`,
      },
    },
  },
});
