import fs from 'node:fs';

const WHITELISTED_PATTERNS = ['lib.d.ts', 'lib.decorators', 'lib.es2015', 'lib.es5', 'lib.es6', 'lib.esnext'];

const tsDefs
  = fs.readFileSync('./node_modules/monaco-editor/esm/vs/languages/features/typescript/lib/lib.js').toString();
const tsDefsSplit = tsDefs.split('\n');

let finalTsDefs = '';
let selectionStartIdx = null;

finalTsDefs += 'const libFileMap = [];\n';

for (let i = 0; i < tsDefsSplit.length; i++) {
  const line = tsDefsSplit[i];

  // end of definition file
  if (selectionStartIdx !== null && line.includes('libFileMap')) {
    finalTsDefs += tsDefsSplit.slice(selectionStartIdx, i).join('\\n');
    finalTsDefs += '\n';
    selectionStartIdx = null;
  }

  // start of (whitelisted) definition file
  if (WHITELISTED_PATTERNS.some(x => line.includes(x)))
    selectionStartIdx = i;
}

finalTsDefs += 'export { libFileMap };';

fs.writeFileSync('./dev/dist/ts_lib_stripped.js', finalTsDefs);
