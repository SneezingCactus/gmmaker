import { defineConfig } from 'vite';
import dts from 'unplugin-dts/vite';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    emptyOutDir: false,
    copyPublicDir: false,
    outDir: 'dist',
    lib: {
      entry: './src/sandbox/api/index.ts',
      name: 'gm-api',
    },
  },
  plugins: [dts({
    tsconfigPath: './tsconfig.app.json',
    entryRoot: './src/sandbox/api',
    include: ['src/sandbox/api/**/*'],
    exclude: ['node_modules/**'],
    outDirs: ['dist'],

    declarationOnly: true,
    bundleTypes: true,

    compilerOptions: {
      noCheck: true,
      stripInternal: true,
    },
  })],
});
