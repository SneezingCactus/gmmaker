/* eslint-disable camelcase */
/* eslint-disable new-cap */
export default {
  init: function() {
    this.initSocketio();
    this.initBonkLobby();
    this.initNetworkEngine();
  },
  initSocketio: function() {
    const io_OLD = io;
    io = function() {
      const socket = io_OLD(...arguments);
      gm.lobby.socket = socket;
      socket.on('disconnect', function() {
        gm.blockly.resetAll();
        // gm.blockly.workspace.clear();
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
        return result;
      };
    })();
  },
  initNetworkEngine: function() {
    const networkengine_OLD = window.NetworkEngine;
    window.NetworkEngine = function(mpSession, data) {
      const networkEngine = new networkengine_OLD(...arguments);
      networkEngine.on('scheduleGameStart', () => {
        gm.blockly.resetVars(); gm.lobby.roundStarting = true;
      });
      return gm.lobby.data = data, gm.lobby.mpSession = mpSession, gm.lobby.networkEngine = networkEngine, networkEngine;
    };
  },
  socket: null,
  mpSession: null,
  networkEngine: null,
  roundStarting: false,
};
