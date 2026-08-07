import path from 'node:path';
import type { Plugin } from 'vite';

export function deliverStrippedMonaco(): Plugin {
  return {
    name: 'deliver_stripped_monaco',
    enforce: 'pre',
    resolveId(source, _importer) {
      if (source.includes('lib/lib.js')) {
        return path.resolve(__dirname, '../dist/ts_lib_stripped.js');
      }
    },
  };
}
