/* eslint-disable camelcase */
/* eslint-disable prefer-spread */
/* eslint-disable new-cap */
/* eslint-disable no-tabs */

import '../gmWindow/style.css';

import gmState from '../gmObject/state.js';
import gmGraphics from '../gmObject/graphics.js';
import gmLobby from '../gmObject/lobby.js';
import gmEditor from '../gmObject/editor.js';
import gmEncoding from '../gmObject/encoding';

window.initGM = function() {
  if (window.gm) return;

  if (window.gmStyles) {
    document.querySelector('head').appendChild(window.gmStyles);
  }

  // make the gm object
  window.gm = {
    state: gmState,
    graphics: gmGraphics,
    lobby: gmLobby,
    editor: gmEditor,
    encoding: gmEncoding,
  };

  // init the things inside gm
  // eslint-disable-next-line guard-for-in
  for (const key in gm) {
    gm[key].init();
  }

  console.log('[Game Mode Maker] The extension has been successfully loaded!');
};
