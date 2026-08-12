import type { Plugin } from 'vite';

/**
 *
 */
export function addMissingMonacoTriggers(): Plugin {
  return {
    name: 'add_missing_monaco_triggers',
    enforce: 'pre',
    transform: {
      filter: {
        id: /languageFeatures/,
      },
      handler(code, _id, _options) {
        return code.replaceAll(`["."]`, `['.', '\"', '\\'', '\`', '/', '@', '<', '#']`);
      },
    },
  };
}
