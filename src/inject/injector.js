/* eslint-disable camelcase */
/* eslint-disable prefer-spread */
/* eslint-disable new-cap */
/* eslint-disable no-tabs */

import '../gmWindow/style.css';

import gmPhysics from '../gmObject/physics.js';
import gmGraphics from '../gmObject/graphics.js';
import gmInput from '../gmObject/inputs.js';
import gmLobby from '../gmObject/lobby.js';
import gmAudio from '../gmObject/audio.js';
import gmBlockly from '../gmObject/blockly.js';

window.gmInjectBonkScript = function(bonkSrc) {
  console.log('[Game Mode Maker] Injecting alpha2s.js...');

  window.gmRegexes = {
    funcs: [
      {name: 'io', regex: 'requirejs\\(\\[[^\\]]+\\],function\\(([^,]+)', isConstructor: false},
      {name: 'Box2D', regex: 'requirejs\\(\\[[^\\]]+\\],function\\([^,]+,[^,]+,([^\\)]+)', isConstructor: true},
      {name: 'BonkGraphics', regex: 'shrinkPerFrame:0\\.016.*?\\*=(.)\\[', isConstructor: true},
      {name: 'NetworkEngine', regex: 'function ([^\\)]*)\\([^\\)]{11}\\).{0,5000}reconnection:false', isConstructor: true},
      {name: 'NewBonkLobby', regex: 'function (..)\\(.{15}\\).{0,10000}newbonklobby', isConstructor: true},
      {name: 'MapEncoder', regex: '{try{.{3,6}=(.{1,2})\\[', isConstructor: true},
      {name: 'GameRendererClass', regex: 'null;[A-Za-z0-9\\[\\]]+\\(true\\);[A-Za-z0-9\\[\\]]+=null;}};([A-Za-z0-9\\[\\]]+)=class', isConstructor: true},
      {name: 'PhysicsClass', regex: ';([A-Za-z])\\[.{0,100}]={discs', isConstructor: true},
      {name: 'LocalInputs', regex: 'Date.{0,200}new (.{2}).{0,100}\\$\\(document\\)', isConstructor: true},
      {name: 'JoinLeaveHandlers', regex: 'new (..)\\(null\\)', isConstructor: true},
    ],
    replace: [
      // make step function not delete the world's bodies and instead put that code into a global function
      {regex: '(for\\(([^\\]]+\\]){4}\\]\\(.{0,400}\\}[A-Z]([^\\]]+\\]){2}\\]=undefined;)', to: 'window.gmReplaceAccessors.endStep = () => {$1};'},
      // fix fixtures and ppm being a reference to a single fixtures and ppm shared by all game states
      {regex: '(shapes:JSON[^,]{0,100},fixtures:)([^,]{0,100})(.{0,400}ppm:)([^}]{0,100})', to: '$1JSON.parse(JSON.stringify($2))$3JSON.parse(JSON.stringify($4))'},
      // make game state list globally accessible
      {regex: '( < 100\\).{0,100}\\+ 1.{0,200}\\+\\+;)([^\\]]+\\])', to: '$1window.gmReplaceAccessors.gameStateList = $2;$2'},
      // call graphics rollback function
      {regex: 'if\\(([^ ]+)( != Infinity\\){)(for[^<]+< )([^\\]]+\\])(.{0,400}=Infinity;)', to: 'if($1$2gm.graphics.doRollback($4, $1);$3$4$5'},
      // allow for toggling of the death barrier
      {regex: '(for.{0,100}if\\()(.{0,1200} == false &&.{0,100}> .{0,100}850)', to: '$1!window.gmReplaceAccessors.disableDeathBarrier && $2'},
    ],
    inject: {
      vars: 'var\\s(...)=\\[arguments\\]',
      regex: ';}\\);}}\\);',
      wrap: {
        left: ';});',
        right: '}});',
      },
    },
  };

  let newBonkSrc = bonkSrc;
  let funcHooks = '';
  const funcNames = [];
  gmRegexes.funcs.map((function(func) {
    const match = bonkSrc.match(func.regex);

    if (!match) {
      console.error(`[Game Mode Maker] Regex failed!`, func);
      // eslint-disable-next-line no-throw-literal
      throw 'Game Mode Maker injection error';
    }
    const funcInBonk = match[1];
    funcNames.push({name: func.name, regex: func.regex, func: funcInBonk});
    funcHooks += `window.${func.name} = ${funcInBonk}; window.${func.name}_OLD = ${funcInBonk}; ${funcInBonk} = ` + (func.isConstructor ? `new Proxy(${funcInBonk}, {\n	construct(target, args) { \n		return new ${func.name}(...args); \n	}\n});\n` : `function(){\n	return ${func.name}(...arguments);\n};\n`);
  }));

  console.log('[Game Mode Maker] Using hooks:', funcNames);
  newBonkSrc = newBonkSrc.replace(new RegExp(gmRegexes.inject.regex), `${gmRegexes.inject.wrap.left}${funcHooks}window.initGM();${gmRegexes.inject.wrap.right}`);
  newBonkSrc = newBonkSrc.replace(new RegExp(gmRegexes.inject.vars, 'g'), 'var $1 = [arguments]; window.gmBonkVars.$1 = () => $1;');
  window.gmBonkVars = {};
  window.gmReplaceAccessors = {};

  gmRegexes.replace.map((function(replace) {
    if (!bonkSrc.match(replace.regex)) {
      console.error(`[Game Mode Maker] Regex failed!`, replace);
      // eslint-disable-next-line no-throw-literal
      throw 'Game Mode Maker injection error';
    }

    newBonkSrc = newBonkSrc.replace(new RegExp(replace.regex), replace.to);
  }));

  return newBonkSrc;
};

if (!window.bonkCodeInjectors) {
  window.bonkCodeInjectors = [];
}

window.bonkCodeInjectors.push((bonkSrc) => {
  try {
    return gmInjectBonkScript(bonkSrc);
  } catch (error) {
    alert(
        `An error ocurred while loading Game Mode Maker.


This may have happened because you have an extension that is not \
compatible with Game Mode Maker. Try disabling \
all other bonk.io extensions, and reload.

If the problem persists, please report this error as it may be due to \
a bonk.io update.`);
    throw error;
  }
});

window.bonkCodeInjectors.push((bonkSrc) => bonkSrc);

/**
*   so ugly
*/
window.gmInjectIO = function() {
  for (let i = 0, vars = Object.keys(window.gmBonkVars); i != vars.length; i++) {
    for (let i2 = 0, varChildren = window.gmBonkVars[vars[i]](); i2 != varChildren.length; i2++) {
      if (!varChildren[i2] || !varChildren[i2].length) continue;
      for (let i3 = 0; i3 != varChildren[i2].length; i3++) {
        if (!varChildren[i2][i3] || !varChildren[i2][i3].connect) continue;
        window.io = varChildren[i2][i3];
        window.io_OLD = varChildren[i2][i3];
        varChildren[i2][i3] = function() {
          return window.io(...arguments);
        };
      }
    }
  }
};

window.initGM = function() {
  if (window.gmStyles) {
    document.querySelector('head').appendChild(window.gmStyles);
  }

  window.gmInjectIO();

  // make the gm object
  window.gm = {
    audio: gmAudio,
    physics: gmPhysics,
    graphics: gmGraphics,
    lobby: gmLobby,
    inputs: gmInput,
    blockly: gmBlockly,
  };

  // init the things inside gm
  for (let i = 0; i != Object.keys(gm).length; i++) {
    gm[Object.keys(gm)[i]].init();
  }

  console.log('[Game Mode Maker] The extension has been successfully loaded!');
};
