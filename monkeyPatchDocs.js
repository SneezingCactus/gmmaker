// I DO NOT WANT TO CREATE A WHOLE NEW WEBDOC TEMPLATE FOR THIS. COPE
const manifest = require('./dist/manifest.json');
const fs = require('fs');
const path = require('path');
const walk = function(dir, done) {
  let results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    let pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

walk('./docs', function(err, results) {
  if (err) throw err;

  for (const url of results) {
    if (!url.endsWith('.html')) continue;

    let file = fs.readFileSync(url, {encoding: 'utf-8'});

    // ! comment when developing
    file = file.replace(/=\"\/([^\/][^m][^m][^a])/gm, '="/gmmaker/$1');

    if (file.includes('"current":"tutorials"')) {
      file = file.replace('applicationName: `Game Mode Maker`', 'applicationName: `Game Mode Maker <h6 style="display: inline;">v' + manifest.version + ' wiki</h6>`');
    } else {
      file = file.replace('applicationName: `Game Mode Maker`', 'applicationName: `Game Mode Maker <h6 style="display: inline;">v' + manifest.version + ' docs</h6>`');
    }

    file = file.replace(':"Tutorials"', ':"Wiki"');

    file = file.replace('<body class="root">', `<body class="root"><script defer>monkeyStyle = document.createElement('style');monkeyStyle.innerHTML = \`
.jss12 {
  color: var(--color-primary) !important;
}

.jss3, .jss7, .jss8, .jss11, .jss13 {
  color: #fff !important;
}
\`;document.body.prepend(monkeyStyle);</script>`);

    fs.writeFileSync(url, file);
  }
});

let style = fs.readFileSync('./docs/styles/index.css', {encoding: 'utf-8'});

style += `
:root {
  --color-primary        : #1cb2a4;
  --color-primary-light  : #009688;
  --color-primary-dark   : #c2c2c2;

  --color-primary-text   : #fff;
  --color-text           : #fff;
  --color-secondary-text : #fff;

  --color-secondary      : #ffb74d;
  --color-secondary-light: #ffe97d;
  --color-secondary-dark : #c88719;

  --color-borders        : #383838;

  --color-code-background: #040404;

  --color-sheet-primary: #272727;
  --color-sheet-secondary: #222222;

  color-scheme: dark;
}

::selection {
  background-color: var(--color-primary-light);
}

.page {
  background-color: var(--color-sheet-primary);
}

.docs .page-content {
  overflow-y: auto;
}

.header {
  background-color: var(--color-primary-light);
}

.header-content-container__content {
  background-color: var(--color-sheet-primary);
}

.signature__container {
  background-color: var(--color-sheet-secondary) !important;
}

.page-r-divider, .page-members-explorer {
  margin-left: 20px !important;
}

.explorer > div:last-child {
  display: none !important;
}

.explorer input {
  background-color: var(--color-sheet-secondary);
  color: var(--color-text);
}

.tag--source {
  display: none;
}

table.summary, .members__subcategory {
  color: #aaa;
}

table.summary td section:last-child {
  color: #aaa;
}

table tr:nth-child(2n) {
  background-color: var(--color-sheet-secondary);
}

table {
  border: 1px solid var(--color-borders);
  border-collapse: separate;
}

a {
  color: var(--color-primary);
}

a:hover {
  color: var(--color-primary-light);
}

img {
  filter: invert(1);
}

svg {
  color: #fff !important;
}

.header__link {
  text-decoration: none;
  color: #fff;
  background-color: #795548;
  box-shadow: 1px 1px 5px -2px rgba(0, 0, 0, 0.63);
  padding: 10px 20px;
  border-radius: 2px;
  cursor: pointer;
}

.header__link:hover {
  color: #fff;
  background-color: #7f5d51;
  text-decoration: none;
}

.header__gap {
  max-width: 20px;
}

hr {
  border-color: #777 !important;
}

h1 {
  line-height: initial;
}

.hljs {
  display: block;
  overflow-x: auto;
  padding: .5em;
  background: #fff;
  color: #fff !important;
}

.hljs-comment,.hljs-quote {
  color: #8b949e !important
}

.hljs-keyword,.hljs-name,.hljs-section,.hljs-selector-tag,.hljs-title {
  color: #ff7b72 !important
}

.hljs-template-variable,.hljs-variable {
  color: #660 !important
}

.hljs-regexp,.hljs-selector-attr,.hljs-selector-pseudo,.hljs-string {
  color: #a5d6ff !important
}

.hljs-bullet,.hljs-link,.hljs-literal,.hljs-meta,.hljs-number,.hljs-symbol {
  color: #79c0ff !important
}

.hljs-attr,.hljs-built_in,.hljs-builtin-name,.hljs-doctag,.hljs-params,.hljs-title,.hljs-type {
  color: #79c0ff !important
}

.hljs-attribute,.hljs-subst {
  color: #000 !important
}
`;

fs.writeFileSync('./docs/styles/index.css', style);
