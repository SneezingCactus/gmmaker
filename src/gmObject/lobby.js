/* eslint-disable camelcase */
/* eslint-disable new-cap */
import Blockly from 'blockly';

export default {
  init: function() {
    this.initSocketio();
    this.initBonkLobby();
    this.initNetworkEngine();
    this.initJoinHandlers();

    // not really lobby related, but necessary
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
      socket.on('disconnect', function() {
        gm.editor.savedXml = null;
        gm.editor.savedSettings = null;
        gm.editor.resetAll();
        gm.editor.hideGMEWindow();
      });
      socket.on(29, function(data) {
        if (data.startsWith('!!!GMMODE!!!')) {
          const xml = document.createElement('xml');
          xml.innerHTML = gm.editor.decompressXml(data.replace('!!!GMMODE!!!', ''));

          gm.editor.headlessWorkspace.clear();
          Blockly.Xml.domToWorkspace(xml, gm.editor.headlessWorkspace);

          gm.editor.savedXml = xml;
          gm.editor.savedSettings = xml?.getElementsByTagName('gmsettings')[0];
          gm.editor.resetAll();
          eval(gm.editor.generateCode());

          gm.lobby.mpSession.getGameSettings().GMMode = data.replace('!!!GMMODE!!!', '');

          gm.lobby.bonkLobby.showStatusMessage('* [GMMaker] Host has changed the mode', '#cc3333');
        }
      });
      return socket;
    };
  },
  initBonkLobby: function() {
    const smObj = this;

    NewBonkLobby = (function() {
      const cached_bonklobby = NewBonkLobby;

      return function() {
        const result = cached_bonklobby.apply(this, arguments); // use .apply() to call it
        smObj.bonkLobby = this;

        this.handleHostLeft_OLD = this.handleHostLeft;
        this.handleHostLeft = function(_oldHostName, newHostId) {
          if (gm.lobby.networkEngine.getLSID() == newHostId) {
            document.getElementById('gmeditor_openbutton').classList.remove('brownButtonDisabled');

            gm.editor.workspace.clear();
            Blockly.Xml.domToWorkspace(gm.editor.savedXml, gm.editor.workspace);
          } else {
            document.getElementById('gmeditor_openbutton').classList.add('brownButtonDisabled');
          }

          return this.handleHostLeft_OLD(...arguments);
        };

        this.handleHostChange_OLD = this.handleHostChange;
        this.handleHostChange = function(_oldHostName, newHostId) {
          if (gm.lobby.networkEngine.getLSID() == newHostId) {
            document.getElementById('gmeditor_openbutton').classList.remove('brownButtonDisabled');

            gm.editor.workspace.clear();
            Blockly.Xml.domToWorkspace(gm.editor.savedXml, gm.editor.workspace);
          } else {
            document.getElementById('gmeditor_openbutton').classList.add('brownButtonDisabled');
          }

          return this.handleHostChange_OLD(...arguments);
        };

        this.setGameSettings_OLD = this.setGameSettings;
        this.setGameSettings = function(gameSettings) {
          if (gm.lobby.networkEngine.getLSID() == gm.lobby.networkEngine.hostID) {
            document.getElementById('gmeditor_openbutton').classList.remove('brownButtonDisabled');
          } else {
            document.getElementById('gmeditor_openbutton').classList.add('brownButtonDisabled');
          }

          if (gameSettings.GMMode && gameSettings.GMMode !== '' && gm.lobby.networkEngine.getLSID() != gm.lobby.networkEngine.hostID) {
            const xml = document.createElement('xml');
            xml.innerHTML = gm.editor.decompressXml(gameSettings.GMMode);

            if (gm.editor.savedXml?.innerHTML !== xml.innerHTML) {
              gm.editor.headlessWorkspace.clear();
              Blockly.Xml.domToWorkspace(xml, gm.editor.headlessWorkspace);

              gm.editor.savedXml = xml;
              gm.editor.savedSettings = xml?.getElementsByTagName('gmsettings')[0];
              gm.editor.resetAll();
              try {
                eval(gm.editor.generateCode());
              } catch (e) {
                console.log(e);
              }
            }
          }
          return this.setGameSettings_OLD(gameSettings);
        };

        this.updateGameSettings_OLD = this.updateGameSettings;
        this.updateGameSettings = function() {
          const result = this.updateGameSettings_OLD(...arguments);

          const modeName = gm.editor.savedSettings?.getAttribute('mode_name');

          if (modeName && gm.editor.savedXml?.getElementsByTagName('block').length > 0) {
            const modeText = document.getElementById('newbonklobby_modetext');
            const baseModeText = document.createElement('div');
            baseModeText.id = 'gm_basemodetext';
            baseModeText.innerText = `(${modeText.innerText})`;
            modeText.innerText = modeName;
            modeText.appendChild(baseModeText);
          }

          return result;
        };

        this.show_OLD = this.show;
        this.show = function() {
          gm.lobby.gameCrashed = false;
          gm.lobby.haltCausedByLoop = false;
          gm.editor.varInspectorContainer.style.display = 'none';
          return this.show_OLD();
        };

        return result;
      };
    })();

    document.getElementById('newbonklobby_modetext').addEventListener('mousemove', function() {
      const modeDesc = gm.editor.savedXml?.getElementsByTagName('gmsettings')[0]?.getAttribute('mode_description');

      if (modeDesc && gm.editor.savedXml?.getElementsByTagName('block').length > 0) {
        document.getElementById('newbonklobby_tooltip').innerText = modeDesc;
      }
    });
  },
  initNetworkEngine: function() {
    const networkengine_OLD = NetworkEngine;
    NetworkEngine = function(mpSession, data) {
      const networkEngine = new networkengine_OLD(...arguments);

      networkEngine.createRoom_OLD = networkEngine.createRoom;
      networkEngine.createRoom = function() {
        document.getElementById('gmeditor_openbutton').classList.remove('brownButtonDisabled');
        return networkEngine.createRoom_OLD(...arguments);
      };

      networkEngine.joinRoom_OLD = networkEngine.joinRoom;
      networkEngine.joinRoom = function() {
        document.getElementById('gmeditor_openbutton').classList.add('brownButtonDisabled');
        return networkEngine.joinRoom_OLD(...arguments);
      };

      networkEngine.informInLobby_OLD = networkEngine.informInLobby;

      networkEngine.informInLobby = function(a, b) {
        const gameSettings = b;

        gameSettings.GMMode = gm.editor.compressXml(gm.editor.savedXml?.innerHTML || '');

        return networkEngine.informInLobby_OLD(a, gameSettings);
      };

      networkEngine.informInGame_OLD = networkEngine.informInGame;

      networkEngine.informInGame = function(a, b) {
        const gameSettings = b.gs;

        gameSettings.GMMode = gm.editor.compressXml(gm.editor.savedXml?.innerHTML || '');

        b.gs = gameSettings;

        return networkEngine.informInGame_OLD(a, b);
      };

      return gm.lobby.data = data, gm.lobby.mpSession = mpSession, gm.lobby.networkEngine = networkEngine, networkEngine;
    };
  },
  initJoinHandlers: function() {
    const smObj = this;

    GenericGameSessionHandler = (function() {
      const cached_GenericGameSessionHandler = GenericGameSessionHandler;

      return function() {
        const result = cached_GenericGameSessionHandler.apply(this, arguments);

        this.goInProgress_OLD = this.goInProgress;
        this.goInProgress = function() {
          const gameSettings = arguments[7];

          if (gameSettings.GMMode && gm.lobby.networkEngine.getLSID() != gm.lobby.networkEngine.hostID) {
            const xml = document.createElement('xml');
            xml.innerHTML = gm.editor.decompressXml(gameSettings.GMMode);

            gm.editor.headlessWorkspace.clear();
            Blockly.Xml.domToWorkspace(xml, gm.editor.headlessWorkspace);

            gm.editor.savedXml = xml;
            gm.editor.savedSettings = xml?.getElementsByTagName('gmsettings')[0];
            gm.editor.resetAll();

            try {
              eval(gm.editor.generateCode());
            } catch (e) {
              console.log(e);
            }
          }

          return this.goInProgress_OLD(...arguments);
        };

        smObj.GenericGameSessionHandler = this;
        return result;
      };
    })();
  },
  socket: null,
  mpSession: null,
  networkEngine: null,
  gameCrashed: false,
  haltCausedByLoop: false,
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
