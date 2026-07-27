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
  const missingFontsStyle = document.createElement('style');
  missingFontsStyle.innerHTML = `@font-face {
      font-family: futurept_demi;
      src: url(fonts/futurapt_demi.otf);
  }

  @font-face {
      font-family: futurept_demi_oblique;
      src: url(fonts/fptdo.otf);
  }`;

  document.head.appendChild(missingFontsStyle);

  if (window.gmStyles) {
    document.head.appendChild(window.gmStyles);
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

  gm.version = require('../../package.json').version;

  // show epic splash screen
  if (gm.config.saved.misc.showSplash) {
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
  }

  // show initial boot pop up
  if (!gm.config.saved.showedInitialBootPopup) {
    gm.config.saved.showedInitialBootPopup = true;
    window.localStorage.gmConfig = JSON.stringify(gm.config.saved);
    gm.editor.genericDialog([
      'Hey there! Thank you for installing Game Mode Maker!',
      '<br>',
      'Here\'s some things you might want to know before continuing:',
      '<br><br>',
      'GMMaker is a very big mod, and as such, it can generate some lag in low-end computers, even when not using any custom game modes. ',
      'If you suffer from significant lag, disabling GMMaker might help.',
      '<br><br>',
      'You can enter the Game Mode Editor by clicking the button with a two gear icon in the lobby. ',
      'You can enter GMMaker\'s settings menu by clicking the button that appears when hovering over Bonk.io\'s settings button in the top bar.',
      '<br><br>',
      'If you have any further questions, feel free to ask in the <a href="https://discord.gg/dnBM3N6H8a">SneezingCactus\' mods discord server</a> or the <a href="https://discord.gg/zKdHZ3e24r">Bonk Modding Community discord server</a>.',
      '<br><br>',
      'That\'s about it! I hope you enjoy this mod!',
    ].join(''), ()=>{}, {});
  }

  console.log('[Game Mode Maker] The extension has been successfully loaded!');
};
