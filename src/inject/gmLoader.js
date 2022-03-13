/* eslint-disable camelcase */
/* eslint-disable prefer-spread */
/* eslint-disable new-cap */
/* eslint-disable no-tabs */

import '../gmWindow/style.css';

import gmPhysics from '../gmObject/physics.js';
import gmGraphics from '../gmObject/graphics.js';
import gmInput from '../gmObject/inputs.js';
import gmLobby from '../gmObject/lobby.js';
import gmBlockly from '../gmObject/blockly.js';

window.initGM = function() {
  if (window.gm) return;

  if (window.gmStyles) {
    document.querySelector('head').appendChild(window.gmStyles);
  }

  // make the gm object
  window.gm = {
    physics: gmPhysics,
    graphics: gmGraphics,
    lobby: gmLobby,
    inputs: gmInput,
    blockly: gmBlockly,
  };

  // init the things inside gm
  // eslint-disable-next-line guard-for-in
  for (const key in gm) {
    gm[key].init();
  }

  console.log('[Game Mode Maker] The extension has been successfully loaded!');
};
