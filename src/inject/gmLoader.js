/* eslint-disable camelcase */
/* eslint-disable prefer-spread */
/* eslint-disable new-cap */
/* eslint-disable no-tabs */

import '../gmWindow/style.css';
import splashHtml from '../gmWindow/splash.html';

import gmAudio from '../gmObject/audio.js';
import gmPhysics from '../gmObject/physics.js';
import gmGraphics from '../gmObject/graphics.js';
import gmInput from '../gmObject/inputs.js';
import gmLobby from '../gmObject/lobby.js';
import gmBlockly from '../gmObject/blockly.js';
import gmConfig from '../gmObject/config.js';

window.initGM = function() {
  if (window.gm) return;

  if (window.gmStyles) {
    document.querySelector('head').appendChild(window.gmStyles);
  }

  // make the gm object
  window.gm = {
    audio: gmAudio,
    physics: gmPhysics,
    graphics: gmGraphics,
    lobby: gmLobby,
    inputs: gmInput,
    blockly: gmBlockly,
    config: gmConfig,
  };

  // init the things inside gm
  // eslint-disable-next-line guard-for-in
  for (const key in gm) {
    gm[key].init();
  }

  gm.version = require('../../package.json').version;

  // show epic splash screen
  if (!gm.config.saved.misc.showSplash) return;

  let splashElement = document.createElement('div');
  document.getElementById('newbonkgamecontainer').prepend(splashElement);
  splashElement.outerHTML = splashHtml;

  document.getElementById('gm_splashversion').innerText = 'v' + gm.version;

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
