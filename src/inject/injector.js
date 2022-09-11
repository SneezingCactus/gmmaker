/* eslint-disable no-tabs */
/* eslint-disable no-throw-literal */
window.gmInjectBonkScript = function(bonkSrc) {
  console.log('[Game Mode Maker] Injecting alpha2s.js...');

  // All the regex used by gmmaker
  window.gmRegexes = {
    funcs: [
      // SocketIO library, used by Bonk to communicate with the room server.
      // in gmmaker, it's used to detect when the host has sent a new mode and when you have left the room so that the mode can be reset.
      {name: 'io', regex: '=\\(1,(...[^\\)]+)\\).{0,100}reconnection', isConstructor: false},
      // Box2D library, used by Bonk to simulate physics.
      // in gmmaker, it's used to create a world manifold to get the normal of a collision, and modifying killsThisStep (since that can't be done after the full step is over).
      {name: 'Box2D', regex: 'requirejs\\(\\[[^\\]]+\\],function\\([^,]+,[^,]+,([^\\)]+)', isConstructor: true},
      // This class takes care of all in-game graphics.
      // In gmmaker, it's used to add player's drawings into the scene, manipulate the camera, and rerender the scene when a platform gets added/deleted or a shape gets modified.
      {name: 'BonkGraphics', regex: 'null;[A-Za-z0-9\\[\\]]+\\(true\\);[A-Za-z0-9\\[\\]]+=null;}};([A-Za-z0-9\\[\\]]+)=class', isConstructor: true},
      // This class contains some useful functions (XP to level, hueify, etc) and data (your avatars, the server to use when hosting a room, your country, etc) used within Bonk.
      // It's used by gmmaker to give sounds to the editor buttons using the 'setButtonSounds' function.
      {name: 'BonkUtils', regex: '(...\\[[^\\]]+\\]).{10,20}=function\\((...,){4}...\\).{0,1400}0\\.62', isConstructor: true},
      // This class takes care of communicating with the room's server.
      // It's used by gmmaker to give new players the game mode data.
      {name: 'NetworkEngine', regex: 'function ([^\\)]*)\\([^\\)]{11}\\).{0,5000}reconnection:false', isConstructor: true},
      // This class takes care of updating the lobby and reacting to the player's interactions with the lobby.
      // It's used by gmmaker to update the custom mode when a change is sent by the host and to enable/disable the gmeditor button when a new player gets host.
      {name: 'NewBonkLobby', regex: 'function (..)\\(.{15}\\).{0,10000}newbonklobby', isConstructor: true},
      // There's no single way to describe this class since it's used many different purposes which have nothing to do with each other, except for handling something in the game session.
      // gmmaker uses its 'goInProgress' function (which takes care of calculating all the steps when you join mid-game) to load the custom mode before any steps get calculated.
      {name: 'GenericGameSessionHandler', regex: 'new (..)\\(null\\)', isConstructor: true},
      // This class contains the functions used by Bonk to compress/decompress maps.
      // It's used by gmmaker to compress and decompress maps attached to custom modes.
      {name: 'MapEncoder', regex: '{try{.{3,6}=(.{1,2})\\[', isConstructor: true},
      // This class' task is to calculate the game step every 1/30 seconds.
      // It's used by gmmaker to manipulate the game state, detect collisions, do raycasts, etc.
      {name: 'PhysicsClass', regex: ';([A-Za-z])\\[.{0,100}]={discs', isConstructor: true},
      // This class contains a list of all the available modes, their descriptions, and their ids.
      // It's used by gmmaker to add the modes to the base mode dropdown in Mode Settings.
      {name: 'ModeList', regex: ';([A-Za-z0-9]{3}\\[[0-9]{0,10}\\]).{0,50}={lobbyName', isConstructor: true},
    ],
    replace: [
      // make step function not delete the world's bodies and instead put that code into a global function
      {regex: '(for\\(([^\\]]+\\]){4}\\]\\(.{0,400}\\}[A-Z]([^\\]]+\\]){2}\\]=undefined;)', to: 'window.gmReplaceAccessors.endStep = () => {$1};'},
      // make game state list globally accessible
      {regex: '( < 100\\).{0,100}\\+ 1.{0,200}\\+\\+;)([^\\]]+\\])', to: '$1window.gmReplaceAccessors.gameStateList = $2;$2'},
      // call graphics rollback function
      // {regex: 'if\\(([^ ]+)( != Infinity\\){)(for[^<]+< )([^\\]]+\\])(.{0,400}=Infinity;)', to: 'if($1$2gm.graphics.doRollback($4, $1);$3$4$5'},
      // allow toggling of the death barrier
      {regex: '(for.{0,100}if\\()(.{0,1200} == false &&.{0,100}> .{0,100}850)', to: '$1!window.gmReplaceAccessors.disableDeathBarrier && $2'},
      // modify position of sound with camera position
      {regex: '(=Math.{0,30}Math.{0,30}\\(1[^,]{0,10},)([^,]{0,10},-1)', flags: 'gm', to: '$1(window.gmReplaceAccessors.addToStereo ?? 0) + $2'},
      // remove pixi render function at the end of BonkGraphics render function to allow for gmm to do stuff before rendering
      {regex: '(this.renderer.render\\(this.stage\\);)', to: '/*$1*/'},
    ],
    inject: {
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
      throw 'Game Mode Maker injection error';
    }
    const funcInBonk = match[1];
    funcNames.push({name: func.name, regex: func.regex, func: funcInBonk});
    funcHooks += `window.${func.name} = ${funcInBonk}; window.${func.name}OLD = ${funcInBonk}; ${funcInBonk} = ` + (func.isConstructor ? `new Proxy(${funcInBonk}, {\n	construct(target, args) { \n		return new ${func.name}(...args); \n	}\n});\n` : `function(){\n	return ${func.name}(...arguments);\n};\n`);
  }));

  console.log('[Game Mode Maker] Using hooks:', funcNames);

  // Finish initializing gmmaker. If initGM doesn't exist yet, wait for it to exist, and then execute it.
  newBonkSrc = newBonkSrc.replace(
      new RegExp(gmRegexes.inject.regex),
      `${gmRegexes.inject.wrap.left}${funcHooks}\n
if(window.initGM) {
  window.initGM(); 
} else {
  window.waitForGM = setInterval(()=>{
    if(window.initGM){
      window.initGM();
      clearInterval(window.waitForGM);
    }
  }, 500);
}
${gmRegexes.inject.wrap.right}`,
  );

  window.gmReplaceAccessors = {};

  gmRegexes.replace.map((function(replace) {
    if (!bonkSrc.match(replace.regex)) {
      console.error(`[Game Mode Maker] Regex failed!`, replace);
      throw 'Game Mode Maker injection error';
    }

    newBonkSrc = newBonkSrc.replace(new RegExp(replace.regex, replace.flags), ' /* GMMAKER REPLACE */ ' + replace.to);
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

console.log('[Game Mode Maker] Injector loaded');
