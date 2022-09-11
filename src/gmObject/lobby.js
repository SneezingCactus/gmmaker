/* eslint-disable camelcase */
/* eslint-disable new-cap */
import Blockly from 'blockly';

export default {
  init: function() {
    this.initSocketio();
    this.initBonkLobby();
    this.initNetworkEngine();
    this.initJoinHandlers();
  },
  initSocketio: function() {
    io = function() {
      const socket = ioOLD(...arguments);
      gm.lobby.socket = socket;

      // reset mode when disconnecting
      socket.on('disconnect', function() {
        BonkUtils.resetRenderer = true;
        gm.editor.appliedMode = null;
        gm.editor.resetAll();
        gm.editor.hideGMEWindow();
      });

      // process new mode coming from host
      socket.on(7, function(id, packet) {
        if (id !== gm.lobby.networkEngine.hostID) return;
        if (packet.initial && document.getElementById('sm_connectingContainer').style.visibility == 'hidden') return;
        if (!packet.gmMode) return;

        if (!gm.lobby.newModeBuffer) {
          gm.lobby.newModeBuffer = new dcodeIO.ByteBuffer();
        }

        gm.lobby.newModeBuffer.append(packet.data);

        if (packet.finish) {
          gm.editor.compressedMode = gm.lobby.newModeBuffer;
          const mode = gm.encoding.decompressMode(gm.lobby.newModeBuffer);
          gm.lobby.processNewMode(mode);
          gm.lobby.newModeBuffer = null;

          if (!packet.initial) gm.lobby.bonkLobby.showStatusMessage('* [GMMaker] Host has changed the mode', '#cc3333');
        }
      });
      return socket;
    };
  },
  initBonkLobby: function() {
    NewBonkLobby = (function() {
      const bonkLobbyOLD = NewBonkLobby;

      return function() {
        const result = bonkLobbyOLD.apply(this, arguments);
        gm.lobby.playerArray = arguments[1];
        gm.lobby.bonkLobby = this;

        // move mode over to the editor when host leaves and you're new host
        this.handleHostLeftOLD = this.handleHostLeft;
        this.handleHostLeft = function(_oldHostName, newHostId) {
          if (gm.lobby.networkEngine.getLSID() == newHostId) {
            document.getElementById('gmeditor_openbutton').classList.remove('brownButtonDisabled');

            const modeContent = gm.editor.appliedMode.content;

            if (gm.editor.appliedMode.settings?.isTextMode) {
              gm.editor.changingToTextEditor = true;
              gm.editor.monacoWs.setValue(modeContent);
            } else {
              gm.editor.GMEChangeEditor(false);
              gm.editor.blocklyWs.clear();

              const xml = document.createElement('xml');
              xml.innerHTML = modeContent;

              Blockly.Xml.domToWorkspace(xml, gm.editor.blocklyWs);
            }
          } else {
            document.getElementById('gmeditor_openbutton').classList.add('brownButtonDisabled');
          }

          return this.handleHostLeftOLD(...arguments);
        };

        // move mode over to the editor when host changes and you're new host
        this.handleHostChangeOLD = this.handleHostChange;
        this.handleHostChange = function(_oldHostName, newHostId) {
          if (gm.lobby.networkEngine.getLSID() == newHostId) {
            document.getElementById('gmeditor_openbutton').classList.remove('brownButtonDisabled');

            const modeContent = gm.editor.appliedMode.content;

            if (gm.editor.appliedMode.settings?.isTextMode) {
              gm.editor.changingToTextEditor = true;
              gm.editor.monacoWs.setValue(modeContent);
            } else {
              gm.editor.GMEChangeEditor(false);
              gm.editor.blocklyWs.clear();

              const xml = document.createElement('xml');
              xml.innerHTML = modeContent;

              Blockly.Xml.domToWorkspace(xml, gm.editor.blocklyWs);
            }
          } else {
            document.getElementById('gmeditor_openbutton').classList.add('brownButtonDisabled');
          }

          return this.handleHostChangeOLD(...arguments);
        };

        // enforce button disable state
        // for some reason, sometimes the button is not disabled when it should be, this tries to prevent that
        this.setGameSettingsOLD = this.setGameSettings;
        this.setGameSettings = function(gameSettings) {
          if (gm.lobby.networkEngine.getLSID() == gm.lobby.networkEngine.hostID) {
            document.getElementById('gmeditor_openbutton').classList.remove('brownButtonDisabled');
          } else {
            document.getElementById('gmeditor_openbutton').classList.add('brownButtonDisabled');
          }

          return this.setGameSettingsOLD(gameSettings);
        };

        // update lobby mode name when needed
        this.updateGameSettingsOLD = this.updateGameSettings;
        this.updateGameSettings = function() {
          const result = this.updateGameSettingsOLD(...arguments);

          const modeName = gm.editor.appliedMode?.settings.modeName || gm.editor.modeSettingsDefaults[0].default;

          if (gm.editor.appliedMode && !gm.editor.appliedMode.isEmpty) {
            const modeText = document.getElementById('newbonklobby_modetext');
            const baseModeText = document.createElement('div');
            baseModeText.id = 'gm_basemodetext';
            baseModeText.innerText = `(${modeText.innerText})`;
            modeText.innerText = modeName;
            modeText.appendChild(baseModeText);
          }

          return result;
        };

        return result;
      };
    })();

    // change mode description box
    document.getElementById('newbonklobby_modetext').addEventListener('mousemove', function() {
      const modeDesc = gm.editor.appliedMode?.settings.modeDescription || gm.editor.modeSettingsDefaults[1].default;

      if (gm.editor.appliedMode && !gm.editor.appliedMode.isEmpty) {
        document.getElementById('newbonklobby_tooltip').innerText = modeDesc;
      }
    });
  },
  initNetworkEngine: function() {
    const networkengineOLD = NetworkEngine;
    NetworkEngine = function(mpSession, data) {
      const networkEngine = new networkengineOLD(...arguments);

      // creating a room means you're going to be the host
      // therefore the editor button is enabled
      networkEngine.createRoomOLD = networkEngine.createRoom;
      networkEngine.createRoom = function() {
        document.getElementById('gmeditor_openbutton').classList.remove('brownButtonDisabled');
        return networkEngine.createRoomOLD(...arguments);
      };

      // joining a room means you're not going to be the host, at least not immediately
      // therefore the editor button is disabled
      networkEngine.joinRoomOLD = networkEngine.joinRoom;
      networkEngine.joinRoom = function() {
        document.getElementById('gmeditor_openbutton').classList.add('brownButtonDisabled');
        return networkEngine.joinRoomOLD(...arguments);
      };

      // pass mode to player who just joined (when in lobby)
      networkEngine.informInLobbyOLD = networkEngine.informInLobby;
      networkEngine.informInLobby = function(a, b) {
        gm.lobby.sendMode(null, true);

        return networkEngine.informInLobbyOLD(a, b);
      };

      // pass mode to player who just joined (when in game)
      networkEngine.informInGameOLD = networkEngine.informInGame;

      networkEngine.informInGame = function(a, b) {
        gm.lobby.sendMode(null, true);

        return networkEngine.informInGameOLD(a, b);
      };

      return gm.lobby.data = data, gm.lobby.mpSession = mpSession, gm.lobby.networkEngine = networkEngine, networkEngine;
    };
  },
  initJoinHandlers: function() {
    GenericGameSessionHandler = (function() {
      const cached_GenericGameSessionHandler = GenericGameSessionHandler;

      return function() {
        const result = cached_GenericGameSessionHandler.apply(this, arguments);

        // reset static info when game start
        this.goOLD = this.go;
        this.go = function() {
          document.getElementById('gm_logbox').innerHTML = '';
          document.getElementById('gm_logbox').style.visibility = 'hidden';
          gm.state.resetStaticInfo();

          return this.goOLD(...arguments);
        };

        this.goInProgressOLD = this.goInProgress;
        this.goInProgress = function() {
          document.getElementById('gm_logbox').innerHTML = '';
          document.getElementById('gm_logbox').style.visibility = 'hidden';
          gm.state.resetStaticInfo();

          return this.goInProgressOLD(...arguments);
        };

        gm.lobby.GenericGameSessionHandler = this;
        return result;
      };
    })();
  },
  socket: null,
  playerArray: null,
  mpSession: null,
  networkEngine: null,
  newModeBuffer: null,
  gameCrashed: false,
  haltCausedByLoop: false,
  sendMode: function(mode, initial = false) {
    let compressedMode;

    if (mode) {
      compressedMode = gm.encoding.compressMode(mode);
      gm.editor.compressedMode = compressedMode;
    } else {
      compressedMode = gm.editor.compressedMode;
    }

    if (!compressedMode) return;

    const modeLength = compressedMode.offset + 1;

    for (let i = 0; i < modeLength; i += 256000) {
      gm.lobby.socket.emit(4, {
        gmMode: true,
        initial: initial,
        finish: i + 256000 > modeLength,
        data: compressedMode.copy(i, Math.min(i + 256000, compressedMode.buffer.byteLength)).buffer,
      });
    }
  },
  processNewMode: function(mode) {
    if (JSON.stringify(gm.editor.appliedMode) !== JSON.stringify(mode)) {
      gm.editor.resetAll();
      gm.editor.appliedMode = mode;
      gm.graphics.preloadImages(mode.assets.images);
      gm.audio.preloadSounds(mode.assets.sounds);
      gm.lobby.bonkLobby.updateGameSettings();

      if (mode.settings.isTextMode) {
        try {
          gm.state.generateEvents(mode.content);
        } catch (e) {
          console.log(e);
        }
      } else {
        gm.editor.headlessBlocklyWs.clear();

        const xml = document.createElement('xml');
        xml.innerHTML = mode.content;

        Blockly.Xml.domToWorkspace(xml, gm.editor.headlessBlocklyWs);

        try {
          gm.state.generateEvents(gm.editor.generateCode());
        } catch (e) {
          console.log(e);
        }
      }
    }
  },
  gameHalt: function() {
    if (gm.lobby.haltCausedByLoop) {
      gm.lobby.bonkLobby?.showStatusMessage('* [GMMaker] Game was halted due to a very large loop (likely an infinite loop). Loop iteration limit (total loop iterations inside an event) is 10000000. Check your code.', '#cc3333');
    } else {
      gm.lobby.bonkLobby?.showStatusMessage('* [GMMaker] Game was halted because an unexpected error ocurred. This may or may not have been caused by GMMaker. If you think GMMaker caused this, please open the browser\'s dev tools (Ctrl+Shift+I), go to the Console tab, and send SneezingCactus a full screenshot of the console so that the error can be diagnosed.', '#cc3333');
    }

    // kinda lazy, i know
    if (gm.lobby.networkEngine && gm.lobby.networkEngine.getLSID() == gm.lobby.networkEngine.hostID) {
      document.getElementById('pretty_top_exit').click();
    }
  },
};
