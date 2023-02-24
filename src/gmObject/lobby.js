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
    MapEncoder.decodeFromDatabaseOLD = MapEncoder.decodeFromDatabase;
    MapEncoder.decodeFromDatabase = function(map) {
      if (map.startsWith('!!!GMMODE!!!')) {
        return gm.lobby.mpSession.getGameSettings().map;
      } else {
        return MapEncoder.decodeFromDatabaseOLD(...arguments);
      }
    };
  },
  initSocketio: function() {
    io = function() {
      const socket = ioOLD(...arguments);
      gm.lobby.socket = socket;
      socket.on('disconnect', function() {
        gm.blockly.savedXml = document.createElement('xml');
        gm.blockly.savedSettings = null;
        gm.blockly.resetAll();
        gm.blockly.hideGMEWindow();
      });
      socket.on(29, function(data) {
        if (data.startsWith('!!!GMMODE!!!')) {
          const xml = document.createElement('xml');
          xml.innerHTML = gm.blockly.decompressXml(data.replace('!!!GMMODE!!!', ''));

          gm.blockly.headlessWorkspace.clear();
          Blockly.Xml.domToWorkspace(xml, gm.blockly.headlessWorkspace);

          gm.blockly.savedXml = xml;
          gm.blockly.savedSettings = xml?.getElementsByTagName('gmsettings')[0];
          gm.blockly.resetAll();
          eval(gm.blockly.generateCode());

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

        this.handleHostLeftOLD = this.handleHostLeft;
        this.handleHostLeft = function(OLDHostName, newHostId) {
          if (gm.lobby.networkEngine.getLSID() == newHostId) {
            document.getElementById('gmeditor_openbutton').classList.remove('brownButtonDisabled');

            gm.blockly.workspace.clear();
            Blockly.Xml.domToWorkspace(gm.blockly.savedXml, gm.blockly.workspace);
          } else {
            document.getElementById('gmeditor_openbutton').classList.add('brownButtonDisabled');
          }

          return this.handleHostLeftOLD(...arguments);
        };

        this.handleHostChangeOLD = this.handleHostChange;
        this.handleHostChange = function(OLDHostName, newHostId) {
          if (gm.lobby.networkEngine.getLSID() == newHostId) {
            document.getElementById('gmeditor_openbutton').classList.remove('brownButtonDisabled');

            gm.blockly.workspace.clear();
            Blockly.Xml.domToWorkspace(gm.blockly.savedXml, gm.blockly.workspace);
          } else {
            document.getElementById('gmeditor_openbutton').classList.add('brownButtonDisabled');
          }

          return this.handleHostChangeOLD(...arguments);
        };

        this.setGameSettingsOLD = this.setGameSettings;
        this.setGameSettings = function(gameSettings) {
          if (gm.lobby.networkEngine.getLSID() == gm.lobby.networkEngine.hostID) {
            document.getElementById('gmeditor_openbutton').classList.remove('brownButtonDisabled');
          } else {
            document.getElementById('gmeditor_openbutton').classList.add('brownButtonDisabled');
          }

          if (gameSettings.GMMode && gameSettings.GMMode !== '' && gm.lobby.networkEngine.getLSID() != gm.lobby.networkEngine.hostID) {
            const xml = document.createElement('xml');
            xml.innerHTML = gm.blockly.decompressXml(gameSettings.GMMode);

            if (gm.blockly.savedXml?.innerHTML !== xml.innerHTML) {
              gm.blockly.headlessWorkspace.clear();
              Blockly.Xml.domToWorkspace(xml, gm.blockly.headlessWorkspace);

              gm.blockly.savedXml = xml;
              gm.blockly.savedSettings = xml?.getElementsByTagName('gmsettings')[0];
              gm.blockly.resetAll();
              try {
                eval(gm.blockly.generateCode());
              } catch (e) {
                console.log(e);
              }
            }
          }
          return this.setGameSettingsOLD(gameSettings);
        };

        this.updateGameSettingsOLD = this.updateGameSettings;
        this.updateGameSettings = function() {
          const result = this.updateGameSettingsOLD(...arguments);

          const modeName = gm.blockly.savedSettings?.getAttribute('mode_name');

          if (modeName && gm.blockly.savedXml?.getElementsByTagName('block').length > 0) {
            const modeText = document.getElementById('newbonklobby_modetext');
            const baseModeText = document.createElement('div');
            baseModeText.id = 'gm_basemodetext';
            baseModeText.innerText = `(${modeText.innerText})`;
            modeText.innerText = modeName;
            modeText.appendChild(baseModeText);
          }

          return result;
        };

        this.showOLD = this.show;
        this.show = function() {
          gm.lobby.gameCrashed = false;
          gm.lobby.haltCausedByLoop = false;
          gm.blockly.varInspectorContainer.style.display = 'none';
          return this.showOLD();
        };

        return result;
      };
    })();

    document.getElementById('newbonklobby_modetext').addEventListener('mousemove', function() {
      const modeDesc = gm.blockly.savedXml?.getElementsByTagName('gmsettings')[0]?.getAttribute('mode_description');

      if (modeDesc && gm.blockly.savedXml?.getElementsByTagName('block').length > 0) {
        document.getElementById('newbonklobby_tooltip').innerText = modeDesc;
      }
    });
  },
  initNetworkEngine: function() {
    const networkengineOLD = NetworkEngine;
    NetworkEngine = function(mpSession, data) {
      const networkEngine = new networkengineOLD(...arguments);

      networkEngine.createRoomOLD = networkEngine.createRoom;
      networkEngine.createRoom = function() {
        document.getElementById('gmeditor_openbutton').classList.remove('brownButtonDisabled');
        return networkEngine.createRoomOLD(...arguments);
      };

      networkEngine.joinRoomOLD = networkEngine.joinRoom;
      networkEngine.joinRoom = function() {
        document.getElementById('gmeditor_openbutton').classList.add('brownButtonDisabled');
        return networkEngine.joinRoomOLD(...arguments);
      };

      networkEngine.informInLobbyOLD = networkEngine.informInLobby;

      networkEngine.informInLobby = function(a, b) {
        const gameSettings = b;

        gameSettings.GMMode = gm.blockly.compressXml(gm.blockly.savedXml?.innerHTML || '');

        return networkEngine.informInLobbyOLD(a, gameSettings);
      };

      networkEngine.informInGameOLD = networkEngine.informInGame;

      networkEngine.informInGame = function(a, b) {
        const gameSettings = b.gs;

        gameSettings.GMMode = gm.blockly.compressXml(gm.blockly.savedXml?.innerHTML || '');

        b.gs = gameSettings;

        return networkEngine.informInGameOLD(a, b);
      };

      networkEngine.sendReturnToLobbyOLD = networkEngine.sendReturnToLobby;

      networkEngine.sendReturnToLobby = function() {
        gm.lobby.gameCrashed = false;
        gm.lobby.haltCausedByLoop = false;
        gm.blockly.varInspectorContainer.style.display = 'none';
        return networkEngine.sendReturnToLobbyOLD();
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

        this.goInProgressOLD = this.goInProgress;
        this.goInProgress = function() {
          const gameSettings = arguments[7];

          if (gameSettings.GMMode && gm.lobby.networkEngine.getLSID() != gm.lobby.networkEngine.hostID) {
            const xml = document.createElement('xml');
            xml.innerHTML = gm.blockly.decompressXml(gameSettings.GMMode);

            gm.blockly.headlessWorkspace.clear();
            Blockly.Xml.domToWorkspace(xml, gm.blockly.headlessWorkspace);

            gm.blockly.savedXml = xml;
            gm.blockly.savedSettings = xml?.getElementsByTagName('gmsettings')[0];
            gm.blockly.resetAll();

            try {
              eval(gm.blockly.generateCode());
            } catch (e) {
              console.log(e);
            }
          }

          return this.goInProgressOLD(...arguments);
        };

        smObj.GenericGameSessionHandler = this;
        return result;
      };
    })();
  },
  socket: null,
  mpSession: null,
  networkEngine: null,
  roundStarting: false,
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
