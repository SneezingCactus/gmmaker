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
    const io_OLD = io;
    io = function() {
      const socket = io_OLD(...arguments);
      gm.lobby.socket = socket;
      socket.on('disconnect', function() {
        gm.blockly.resetAll();
      });
      socket.on(29, function(data) {
        if (data.startsWith('!!!GMMODE!!!')) {
          const xml = document.createElement('xml');
          xml.innerHTML = gm.blockly.decompressXml(data.replace('!!!GMMODE!!!', ''));

          gm.blockly.workspace.clear();
          Blockly.Xml.domToWorkspace(xml, gm.blockly.workspace);

          gm.blockly.savedXml = xml;
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


        this.handleHostLeft_OLD = this.handleHostLeft;
        this.handleHostLeft = function(_oldHostName, newHostId) {
          if (gm.lobby.networkEngine.getLSID() == newHostId) {
            document.getElementById('gmeditor_openbutton').classList.remove('brownButtonDisabled');
          } else {
            document.getElementById('gmeditor_openbutton').classList.add('brownButtonDisabled');
          }

          return this.handleHostLeft_OLD(...arguments);
        };

        this.handleHostChange_OLD = this.handleHostChange;
        this.handleHostChange = function(_oldHostName, newHostId) {
          if (gm.lobby.networkEngine.getLSID() == newHostId) {
            document.getElementById('gmeditor_openbutton').classList.remove('brownButtonDisabled');
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

          if (gameSettings.GMMode && gm.lobby.networkEngine.getLSID() != gm.lobby.networkEngine.hostID) {
            if (gameSettings.GMMode !== '') {
              const xml = document.createElement('xml');
              xml.innerHTML = gm.blockly.decompressXml(gameSettings.GMMode);

              gm.blockly.workspace.clear();
              Blockly.Xml.domToWorkspace(xml, gm.blockly.workspace);

              gm.blockly.savedXml = xml;
              gm.blockly.resetAll();
              try {
                eval(gm.blockly.generateCode());
              } catch (e) {
                console.log(e);
              }
            }
          }
          return this.setGameSettings_OLD(gameSettings);
        };

        return result;
      };
    })();
  },
  initNetworkEngine: function() {
    const networkengine_OLD = NetworkEngine;
    NetworkEngine = function(mpSession, data) {
      const networkEngine = new networkengine_OLD(...arguments);
      networkEngine.on('scheduleGameStart', () => {
        gm.blockly.resetVars(); gm.lobby.roundStarting = true;
      });

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

        gameSettings.GMMode = gm.blockly.compressXml(gm.blockly.savedXml?.innerHTML || '');

        return networkEngine.informInLobby_OLD(a, gameSettings);
      };

      networkEngine.informInGame_OLD = networkEngine.informInGame;

      networkEngine.informInGame = function(a, b) {
        const gameSettings = b.gs;

        gameSettings.GMMode = gm.blockly.compressXml(gm.blockly.savedXml?.innerHTML || '');

        b.gs = gameSettings;

        return networkEngine.informInGame_OLD(a, b);
      };

      return gm.lobby.data = data, gm.lobby.mpSession = mpSession, gm.lobby.networkEngine = networkEngine, networkEngine;
    };
  },
  initJoinHandlers: function() {
    const smObj = this;

    JoinLeaveHandlers = (function() {
      const cached_JoinLeaveHandlers = JoinLeaveHandlers;

      return function() {
        const result = cached_JoinLeaveHandlers.apply(this, arguments);

        this.goInProgress_OLD = this.goInProgress;
        this.goInProgress = function() {
          const gameSettings = arguments[7];

          if (gameSettings.GMMode && gm.lobby.networkEngine.getLSID() != gm.lobby.networkEngine.hostID) {
            const xml = document.createElement('xml');
            xml.innerHTML = gm.blockly.decompressXml(gameSettings.GMMode);

            gm.blockly.workspace.clear();
            Blockly.Xml.domToWorkspace(xml, gm.blockly.workspace);

            gm.blockly.savedXml = xml;
            gm.blockly.resetAll();

            try {
              eval(gm.blockly.generateCode());
            } catch (e) {
              console.log(e);
            }
          }

          return this.goInProgress_OLD(...arguments);
        };

        smObj.JoinLeaveHandlers = this;
        return result;
      };
    })();
  },
  socket: null,
  mpSession: null,
  networkEngine: null,
  roundStarting: false,
};
