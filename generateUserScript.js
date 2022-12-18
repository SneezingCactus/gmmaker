const fs = require('fs');
const manifest = require('./dist/manifest.json');

const injector = fs.readFileSync('./dist/js/injector.js', {encoding: 'utf-8'});
let loader = fs.readFileSync('./dist/js/gmLoader.js', {encoding: 'utf-8'});

// put heavy code into initGM for faster loading
loader = loader.replace(/window.initGM[^;]+return;/, '{'); // non-minimized
loader = loader.replace(/window.initGM[^\{]+\{/, '{'); // minimized
loader = 'window.initGM = function() {' + loader + '}';

const content = `// ==UserScript==
// @name         Game Mode Maker Beta
// @version      ${manifest.version}
// @author       SneezingCactus
// @namespace    https://github.com/SneezingCactus
// @description  ${manifest.description}
// @homepage     ${manifest.homepage_url}
// @match        https://*.bonk.io/gameframe-release.html
// @run-at       document-start
// @grant        none
// ==/UserScript==
/*
  Usable with:
  https://greasyfork.org/en/scripts/433861-code-injector-bonk-io
*/

${injector}\n${loader}`;

fs.writeFileSync(`./web-ext-artifacts/gmmaker-${manifest.version}.user.js`, content);
