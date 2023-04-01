/* eslint-disable no-invalid-this */
/* eslint-disable camelcase */
/* eslint-disable new-cap */

import windowHtml from '../gmWindow/window.html';
import {Parser as acorn} from 'acorn';
import bowser from 'bowser';

import rickroll from '../modes/rickroll.gmm';
import heavyDeath from '../modes/heavydeath.gmm';
import demotivation from '../modes/demotivation.gmm';
import spin from '../modes/spin.gmm';
import tutoguy from '../modes/tutoguy.gmm';

export default {
  init: function() {
    this.initGMEditor();
    this.resetModeSettings();
  },
  initGMEditor: function() {
    // create the gm editor div
    const GMEditorWindow = document.createElement('div');
    document.getElementById('newbonkgamecontainer').appendChild(GMEditorWindow);
    GMEditorWindow.outerHTML = windowHtml;

    // create the button that opens the game mode editor
    const GMOpenButton = document.createElement('div');
    GMOpenButton.id = 'gmeditor_openbutton';
    GMOpenButton.className = 'newbonklobby_settings_button brownButton brownButton_classic buttonShadow gmeditor_iconbutton';
    GMOpenButton.addEventListener('click', gm.editor.applyRandomMode);

    // ensure compatibility with bonk-host
    if (window.bonkHost && !window.bonkHost.modeDropdownCreated) {
      window.bonkHost.createModeDropdownOLD = window.bonkHost.createModeDropdown;
      window.bonkHost.createModeDropdown = function() {
        window.bonkHost.createModeDropdownOLD();
        document.getElementById('newbonklobby_modebutton').classList.add('gm_withbonkhost');
        document.getElementById('newbonklobby_settingsbox').appendChild(GMOpenButton);
        window.BonkUtils.setButtonSounds([GMOpenButton]);

        const modeButton = document.getElementById('newbonklobby_modebutton');
        const modeDropdown = modeButton.parentElement;
        modeButton.classList.add('brownButton', 'brownButton_classic', 'buttonShadow');
        modeDropdown.classList.remove('brownButton', 'brownButton_classic', 'buttonShadow');
        modeDropdown.style.width = 'calc(50% - 22px)';
        modeDropdown.style.bottom = '85px';
        modeDropdown.style.height = '0px';
      };
    } else if (window.bonkHost) {
      document.getElementById('newbonklobby_modebutton').classList.add('gm_withbonkhost');
      document.getElementById('newbonklobby_settingsbox').appendChild(GMOpenButton);
      window.BonkUtils.setButtonSounds([GMOpenButton]);

      const modeButton = document.getElementById('newbonklobby_modebutton');
      const modeDropdown = modeButton.parentElement;
      modeButton.classList.add('brownButton', 'brownButton_classic', 'buttonShadow');
      modeDropdown.classList.remove('brownButton', 'brownButton_classic', 'buttonShadow');
      modeDropdown.style.width = 'calc(50% - 22px)';
      modeDropdown.style.bottom = '85px';
      modeDropdown.style.height = '0px';
    } else {
      document.getElementById('newbonklobby_settingsbox').appendChild(GMOpenButton);
      window.BonkUtils.setButtonSounds([GMOpenButton]);
    }

    // hook into chatbox focus method to enable/disable chatbox input
    const chatbox = document.getElementById('newbonklobby_chat_input');
    chatbox.focusOLD = chatbox.focus;
    chatbox.focus = function() {
      if (!gm.editor.disableLobbyChatbox) {
        chatbox.focusOLD();
      }
    };

    // current browser for proper error handling
    this.browser = bowser.parse(window.navigator.userAgent).browser.name;

    // hide gme window
    gm.editor.disableLobbyChatbox = false;

    document.getElementById('gmeditor').style.transform = 'scale(0)';
    document.getElementById('newbonklobby').style.transform = 'scale(1)';
  },
  modeSettingsDefaults: [
    {name: 'modeName', type: 'string', default: 'Custom'},
    {name: 'modeDescription', type: 'string', default: 'Change your mode\'s description on the Game Mode Editor\'s Settings menu (gear icon).'},
    {name: 'baseMode', type: 'string', default: 'any'},
    {name: 'isTextMode', type: 'bool', default: true},
  ],
  modeSettings: {},
  modeAssets: {images: [], sounds: []},
  isInSoundsTab: false,
  resetModeSettings: function() {
    this.modeSettings = {};
    for (let i = 0; i < this.modeSettingsDefaults.length; i++) {
      const setting = this.modeSettingsDefaults[i];

      this.modeSettings[setting.name] = setting.default;
    }
  },
  disableLobbyChatbox: false,
  monacoWs: null,
  modeToImport: null,
  appliedMode: null,
  modeBackups: [],
  canBackup: true,
  changingToTextEditor: false,
  isInTextEditor: false,
  modes: [rickroll, heavyDeath, demotivation, spin, tutoguy],
  currentModeId: null,
  applyRandomMode: function() {
    if (gm.lobby.networkEngine.getLSID() !== gm.lobby.networkEngine.hostID) return;

    let modeToChoose = 0;

    for (let i = 0; i < 100; i++) {
      modeToChoose = Math.floor(Math.random() * 4.999);
      if (gm.editor.currentModeId !== modeToChoose) break;
    }

    const compressedMode = gm.editor.modes[modeToChoose];
    if (!compressedMode) return;

    let mode = new dcodeIO.ByteBuffer();
    mode.append(compressedMode);
    mode = gm.encoding.decompressMode(mode);

    gm.editor.modeAssets = mode.assets;
    gm.editor.modeSettings = mode.settings;

    gm.state.resetSES();

    const saved = {};

    // generate events in host and save content and isEmpty into the mode
    try {
      gm.state.generateEvents(mode.content);
    } catch (e) {
      let report;

      if (gm.editor.browser == 'Firefox') {
        report = e.name + ': ' + e.message;

        if (e.message.includes('delete') && e.message.includes('unqualified')) {
          report = 'SyntaxError: Delete of an unqualified identifier is not allowed. You can use the delete keyword on array items and object properties, but not on plain variables.';
        } else if (e.name == 'SyntaxError') {
          try {
            acorn.parse(mode.content, {ecmaVersion: 'latest'});
          } catch (syntaxError) {
            const location = /\(([0-9:]+)\)/.exec(syntaxError.message)[1];
            report += '\n  at <anonymous>:' + location;
          }
        } else {
          let stack = e.stack;

          stack = stack.replace(/([^@\n]+)@.+?line.+?eval:/gm, '  at $1:');
          stack = stack.replace(/@.+?line.+?eval:([^\n]+)(.|\n)*/gm, '  at <anonymous>:$1');

          report += '\n' + stack;
        }

        e.message = '[GMMaker Error] ' + e.message;
      } else {
        report = e.stack;

        if (e.message.includes('Delete') && e.message.includes('unqualified')) {
          report = 'SyntaxError: Delete of an unqualified identifier is not allowed. You can use the delete keyword on array items and object properties, but not on plain variables.';
        } else if (report.includes('SyntaxError:')) {
          try {
            acorn.parse(mode.content, {ecmaVersion: 'latest'});
          } catch (syntaxError) {
            const location = /\(([0-9:]+)\)/.exec(syntaxError.stack)[1];
            report = report.replace(/at([^\n]+)(.|\n)*/gm, 'at <anonymous>:' + location);
          }
        } else {
          report = report.replace(/(at [^\(\n]+) \(eval at .{0,150}init[^\)]+[\)]+, <anonymous>(:[0-9]+:[0-9]+)\)/gm, '$1$2');
          report = report.replace(/Object\.eval([^\n]+)(.|\n)*/gm, '<anonymous>$1');
        }

        e.stack = '[GMMaker Error] ' + e.stack;
      }

      gm.editor.genericDialog('Whoops! Seems like something went wrong with your code. Below is the crash report, which may help you find out what happened.', ()=>{}, {
        showCode: true,
        code: report,
      });

      throw (e);
    }

    const content = mode.content;

    saved.content = content;
    saved.isEmpty = content == '';

    saved.settings = gm.editor.modeSettings;
    saved.assets = gm.editor.modeAssets;

    gm.graphics.preloadImages(saved.assets.images);
    gm.audio.preloadSounds(saved.assets.sounds);

    gm.editor.appliedMode = saved;

    gm.lobby.sendMode(saved);

    if (saved.settings.baseMode && saved.settings.baseMode !== 'any') {
      gm.lobby.networkEngine.sendGAMO('b', saved.settings.baseMode);
      gm.lobby.mpSession.getGameSettings().ga = 'b';
      gm.lobby.mpSession.getGameSettings().mo = saved.settings.baseMode;
    }

    gm.lobby.bonkLobby.updateGameSettings();
  },
  hideGMEWindow: function() {},
  genericDialog: function(message = '', callback = ()=>{}, options) {
    document.getElementById('gm_genericdialogcontainer').style.visibility = 'visible';

    document.getElementById('gmgeneric_message').innerHTML = message;
    document.getElementById('gmgeneric_promptcontainer').style.display = options.showInput ? 'block' : 'none';
    document.getElementById('gmgeneric_prompt').value = options.inputValue;
    document.getElementById('gmgeneric_cancel').style.display = options.showCancel ? 'block' : 'none';
    if (options.showInput) document.getElementById('gmgeneric_prompt').focus();

    document.getElementById('gmgeneric_code').parentElement.style.display = options.showCode ? 'block' : 'none';
    if (options.showCode) document.getElementById('gmgeneric_code').innerText = options.code;

    // it's weird but it works and it looks neat
    // eslint-disable-next-line prefer-const
    let closeDialog;

    const okListener = function() {
      callback(options.showInput ? document.getElementById('gmgeneric_prompt').value : true);
      closeDialog();
    };
    const okInputListener = function(event) {
      if (event.key === 'Enter') {
        callback(options.showInput ? document.getElementById('gmgeneric_prompt').value : true);
        closeDialog();
      }
    };
    const cancelListener = function() {
      callback(options.showInput ? null : false);
      closeDialog();
    };

    closeDialog = function() {
      document.getElementById('gm_genericdialogcontainer').style.visibility = 'hidden';
      document.getElementById('gmgeneric_ok').removeEventListener('click', okListener);
      document.getElementById('gmgeneric_prompt').removeEventListener('keydown', okInputListener);
      document.getElementById('gmgeneric_cancel').removeEventListener('click', cancelListener);
    };

    document.getElementById('gmgeneric_ok').addEventListener('click', okListener);
    document.getElementById('gmgeneric_prompt').addEventListener('keydown', okInputListener);
    document.getElementById('gmgeneric_cancel').addEventListener('click', cancelListener);
  },
};
