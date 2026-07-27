import type { Plugin } from 'vite';
import pkg from '../../package.json';

export function emitManifest(): Plugin {
  return {
    name: 'emit_manifest',
    async buildStart() {
      const manifest = JSON.parse(String(await this.fs.readFile('src/manifest.json')));
      const rules = String(await this.fs.readFile('src/rules.json'));

      manifest.name = pkg.displayName;
      manifest.author = pkg.author;
      manifest.description = pkg.description;
      manifest.homepage_url = pkg.homepage;
      manifest.version = pkg.version;

      this.emitFile({
        type: 'asset',
        fileName: 'manifest.json',
        source: JSON.stringify(manifest),
      });

      this.emitFile({
        type: 'asset',
        fileName: 'rules.json',
        source: rules,
      });
    },
  };
}
