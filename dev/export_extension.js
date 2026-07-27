import fs from 'node:fs';
import pkg from '../package.json' with { type: 'json' };
import { ZipArchive } from 'archiver';

const userscriptHeader = `// ==UserScript==
// @name         ${pkg.displayName}
// @version      ${pkg.version}
// @author       ${pkg.author.name}
// @namespace    ${pkg.author.url}
// @description  ${pkg.description}
// @homepage     ${pkg.homepage}
// @match        https://*.bonk.io/gameframe-release.html
// @run-at       document-start
// @grant        none
// ==/UserScript==
/*
  Usable with:
  https://greasyfork.org/en/scripts/433861-code-injector-bonk-io
*/
`;

if (!fs.existsSync('./build'))
  fs.mkdirSync('./build');

// extension
const extensionFile = fs.createWriteStream(`./build/${pkg.name}-${pkg.version}-EXTENSION.zip`);
const extensionArchive = new ZipArchive({
  zlib: { level: 9 },
});

extensionArchive.pipe(extensionFile);
extensionArchive.glob('**/*', { cwd: 'dist' });
extensionArchive.finalize();

// userscript
const userscriptFile = fs.createWriteStream(`./build/${pkg.name}-${pkg.version}-USERSCRIPT.zip`);
const userscriptArchive = new ZipArchive({
  zlib: { level: 9 },
});

const contentScript = fs.readFileSync('./dist/content_script.js').toString();

userscriptArchive.pipe(userscriptFile);
userscriptArchive.append(userscriptHeader + contentScript, { name: `${pkg.name}-${pkg.version}-USERSCRIPT.user.js` });
userscriptArchive.finalize();
