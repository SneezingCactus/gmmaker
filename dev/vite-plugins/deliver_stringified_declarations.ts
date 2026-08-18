import { Extractor, ExtractorConfig } from '@microsoft/api-extractor';
import path from 'node:path';
import type { Plugin } from 'vite';

/**
 * Compiles TS declaration files (*.d.ts) suffixed with "?string" into bundles and imports them as strings.
 *
 * Used to pass sandbox API declarations to Monaco.
 */
export function deliverStringifiedDeclarations(): Plugin {
  return {
    name: 'deliver_stringified_declarations',
    enforce: 'pre',
    load: {
      filter: { id: /\?string/ },
      async handler(id, _options) {
        const filePath = id.replace('?string', '');

        const extractorConfig = ExtractorConfig.prepare({
          configObject: {
            mainEntryPointFilePath: filePath,
            apiReport: { enabled: false },
            docModel: { enabled: false },
            compiler: {
              tsconfigFilePath: '<projectFolder>/tsconfig.app.json',
            },
            dtsRollup: {
              enabled: true,
              untrimmedFilePath: path.resolve(import.meta.dirname, '../dist/api-extractor-out.d.ts'),
            },
            projectFolder: path.resolve(import.meta.dirname, '../../'),
          },
          configObjectFullPath: '',
          packageJsonFullPath: path.resolve(import.meta.dirname, '../../package.json'),
        });

        Extractor.invoke(extractorConfig);

        let result = (await this.fs.readFile(path.resolve(import.meta.dirname, '../dist/api-extractor-out.d.ts')))
          .toString();

        // remove all export keywords so that everything is globally declared
        result = result.replaceAll('export ', '');

        // look for any @gmDeclareVar flags on JSDoc blocks and replace them with actual var declarations
        //
        // this is done this way as to only have these declared within the monaco workspace, and to circumvent
        // api-extractor seeing the Math declaration as a re-declaration and renaming it
        for (const match of result.match(/@gmDeclareVar [^\n]+/g) ?? []) {
          result += `\ndeclare var ${match.replace('@gmDeclareVar ', '')};`;
        }
        result = result.replaceAll(/@gmDeclareVar.+$/gm, '');

        return `export default ${JSON.stringify(result)}`;
      },
    },
  };
}
