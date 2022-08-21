/* eslint-disable camelcase */
/* eslint-disable new-cap */
import Blockly from 'blockly';

export default {
  init: function() {
    this.initSocketio();
    this.initBonkLobby();
    this.initNetworkEngine();
    this.initJoinHandlers();

    // filters out modes coming from the host disguised as maps
    MapEncoder.decodeFromDatabase_OLD = MapEncoder.decodeFromDatabase;
    MapEncoder.decodeFromDatabase = function(map) {
      if (map.startsWith('!!!GMMODE!!!')) {
        return gm.lobby.mpSession.getGameSettings().map;
      } else {
        return MapEncoder.decodeFromDatabase_OLD(...arguments);
      }
    };
  },
  initSocketio: function() {
    io = function() {
      const socket = io_OLD(...arguments);
      gm.lobby.socket = socket;

      // reset mode when disconnecting
      socket.on('disconnect', function() {
        gm.editor.appliedMode = null;
        gm.editor.resetAll();
        gm.editor.hideGMEWindow();
      });

      // process modes coming from the host disguised as maps
      socket.on(29, function(data) {
        if (data.startsWith('!!!GMMODE!!!')) {
          gm.lobby.processNewMode(data.replace('!!!GMMODE!!!', ''));
          gm.lobby.bonkLobby.showStatusMessage('* [GMMaker] Host has changed the mode', '#cc3333');
        }
      });

      // process mode upon joining a room (while in lobby)
      socket.on(21, function(settings) {
        gm.lobby.processNewMode(settings.GMMode);
        delete settings.GMMode;
      });
      return socket;
    };
  },
  initBonkLobby: function() {
    NewBonkLobby = (function() {
      const bonkLobby_OLD = NewBonkLobby;

      return function() {
        const result = bonkLobby_OLD.apply(this, arguments);
        gm.lobby.playerArray = arguments[1];
        gm.lobby.bonkLobby = this;

        // move mode over to the editor when host leaves and you're new host
        this.handleHostLeft_OLD = this.handleHostLeft;
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

          return this.handleHostLeft_OLD(...arguments);
        };

        // move mode over to the editor when host changes and you're new host
        this.handleHostChange_OLD = this.handleHostChange;
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

          return this.handleHostChange_OLD(...arguments);
        };

        // enforce button disable state
        // for some reason, sometimes the button is not disabled when it should be, this tries to prevent that
        this.setGameSettings_OLD = this.setGameSettings;
        this.setGameSettings = function(gameSettings) {
          if (gm.lobby.networkEngine.getLSID() == gm.lobby.networkEngine.hostID) {
            document.getElementById('gmeditor_openbutton').classList.remove('brownButtonDisabled');
          } else {
            document.getElementById('gmeditor_openbutton').classList.add('brownButtonDisabled');
          }

          return this.setGameSettings_OLD(gameSettings);
        };

        // update lobby mode name when needed
        this.updateGameSettings_OLD = this.updateGameSettings;
        this.updateGameSettings = function() {
          const result = this.updateGameSettings_OLD(...arguments);

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

        // does nothing (for now?)
        this.show_OLD = this.show;
        this.show = function() {
          return this.show_OLD();
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
    const networkengine_OLD = NetworkEngine;
    NetworkEngine = function(mpSession, data) {
      const networkEngine = new networkengine_OLD(...arguments);

      // creating a room means you're going to be the host
      // therefore the editor button is enabled
      networkEngine.createRoom_OLD = networkEngine.createRoom;
      networkEngine.createRoom = function() {
        document.getElementById('gmeditor_openbutton').classList.remove('brownButtonDisabled');
        return networkEngine.createRoom_OLD(...arguments);
      };

      // joining a room means you're not going to be the host, at least not immediately
      // therefore the editor button is disabled
      networkEngine.joinRoom_OLD = networkEngine.joinRoom;
      networkEngine.joinRoom = function() {
        document.getElementById('gmeditor_openbutton').classList.add('brownButtonDisabled');
        return networkEngine.joinRoom_OLD(...arguments);
      };

      // pass mode through settings to player who just joined (when in lobby)
      networkEngine.informInLobby_OLD = networkEngine.informInLobby;
      networkEngine.informInLobby = function(a, b) {
        const gameSettings = b;

        gameSettings.GMMode = LZString.compressToUTF16(JSON.stringify(gm.editor.appliedMode));

        return networkEngine.informInLobby_OLD(a, gameSettings);
      };

      // pass mode through settings to player who just joined (when in game)
      networkEngine.informInGame_OLD = networkEngine.informInGame;

      networkEngine.informInGame = function(a, b) {
        const gameSettings = b.gs;

        gameSettings.GMMode = LZString.compressToUTF16(JSON.stringify(gm.editor.appliedMode));

        b.gs = gameSettings;

        return networkEngine.informInGame_OLD(a, b);
      };

      // does nothing (for now?)
      networkEngine.sendReturnToLobby_OLD = networkEngine.sendReturnToLobby;
      networkEngine.sendReturnToLobby = function() {
        return networkEngine.sendReturnToLobby_OLD();
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
        this.go_OLD = this.go;
        this.go = function() {
          gm.state.resetStaticInfo();

          return this.go_OLD(...arguments);
        };

        // apply mode upon joining (when in game)
        this.goInProgress_OLD = this.goInProgress;
        this.goInProgress = function() {
          gm.state.resetStaticInfo();

          const gameSettings = arguments[7];
          if (gameSettings.GMMode && gm.lobby.networkEngine.getLSID() != gm.lobby.networkEngine.hostID) {
            gm.lobby.processNewMode(gameSettings.GMMode);
            delete gameSettings.GMMode;
          }

          return this.goInProgress_OLD(...arguments);
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
  gameCrashed: false,
  haltCausedByLoop: false,
  processNewMode: function(compressedMode) {
    const mode = JSON.parse(LZString.decompressFromUTF16(compressedMode));

    if (JSON.stringify(gm.editor.appliedMode) !== JSON.stringify(mode)) {
      gm.editor.resetAll();
      gm.editor.appliedMode = mode;

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
