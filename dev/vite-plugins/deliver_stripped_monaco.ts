import path from 'node:path';
import type { Plugin } from 'vite';

/**
 * Intercepts Monaco's typescript declaration import and redirects it to a stripped variant, generated with
 * setup_monaco_ts_defs.js
 */
export function deliverStrippedMonacoTsLib(): Plugin {
  return {
    name: 'deliver_stripped_monaco_ts_lib',
    enforce: 'pre',
    resolveId: {
      filter: { id: /lib\/lib.js/ },
      handler(_importer) {
        return path.resolve(import.meta.dirname, '../dist/ts_lib_stripped.js');
      },
    },
  };
}
