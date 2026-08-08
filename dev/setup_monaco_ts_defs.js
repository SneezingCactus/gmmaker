import fs from 'node:fs';

// definition lib files to keep
const WHITELISTED_DEFS = ['lib.d.ts', 'lib.decorators', 'lib.es2015', 'lib.es5', 'lib.es6', 'lib.esnext'];

// remove Math to be declared later
const REMOVE_PATTERNS = ['declare var Math: Math;'];

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
  if (WHITELISTED_DEFS.some(x => line.includes(x)))
    selectionStartIdx = i;
}

finalTsDefs += 'export { libFileMap };';

for (const patternToRemove of REMOVE_PATTERNS) {
  finalTsDefs = finalTsDefs.replace(patternToRemove, '');
}

fs.writeFileSync('./dev/dist/ts_lib_stripped.js', finalTsDefs);
