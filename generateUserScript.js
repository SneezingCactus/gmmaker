const fs = require('fs');
const manifest = require('./dist/manifest.json');

const content = `// ==UserScript==
// @name         Game Mode Maker
// @version      ${manifest.version}
// @author       SneezingCactus
// @namespace    https://github.com/SneezingCactus
// @description  ${manifest.description}
// @homepage     ${manifest.homepage_url}
// @match        *.bonk.io/gameframe-release.html
// @run-at       document-start
// @grant        none
// ==/UserScript==
/*
  Usable with:
  https://greasyfork.org/en/scripts/433861-code-injector-bonk-io
*/


${fs.readFileSync('./dist/js/injector.js')}\n${fs.readFileSync('./dist/js/gmLoader.js')}`;

fs.writeFileSync(`./web-ext-artifacts/gmmaker-${manifest.version}.user.js`, content);
