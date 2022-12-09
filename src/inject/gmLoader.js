/* eslint-disable camelcase */
/* eslint-disable prefer-spread */
/* eslint-disable new-cap */
/* eslint-disable no-tabs */

import '../gmWindow/style.css';
import splashHtml from '../gmWindow/splash.html';

import gmConfig from '../gmObject/config.js';
import gmState from '../gmObject/state.js';
import gmInput from '../gmObject/input.js';
import gmGraphics from '../gmObject/graphics.js';
import gmAudio from '../gmObject/audio.js';
import gmLobby from '../gmObject/lobby.js';
import gmEditor from '../gmObject/editor.js';
import gmEncoding from '../gmObject/encoding.js';

// inline part to be removed in userscript version
// eslint-disable-next-line brace-style
window.initGM = function() {if (window.gm) return;
  if (window.gmStyles) {
    document.querySelector('head').appendChild(window.gmStyles);
  }

  // make the gm object
  window.gm = {
    state: gmState,
    input: gmInput,
    graphics: gmGraphics,
    audio: gmAudio,
    lobby: gmLobby,
    editor: gmEditor,
    encoding: gmEncoding,
    config: gmConfig,
  };

  // init the things inside gm
  // eslint-disable-next-line guard-for-in
  for (const key in gm) {
    gm[key].init();
  }

  // show epic splash screen
  if (!gm.config.saved.misc.showSplash) return;

  let splashElement = document.createElement('div');
  document.getElementById('newbonkgamecontainer').prepend(splashElement);
  splashElement.outerHTML = splashHtml;

  // yes this is needed
  splashElement = document.getElementsByClassName('gm_splashcontainer')[0];

  setTimeout(function() {
    splashElement.style.top = '0px';
  }, 1000);
  setTimeout(function() {
    splashElement.style.top = '-1000px';
  }, 5000);

  console.log('[Game Mode Maker] The extension has been successfully loaded!');
};
