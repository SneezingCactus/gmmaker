export default {
  init: function() {
    this.initInputHandler();
    this.initBonkUtils();

    const forceInputFunction = function() {
      if (!gm.state.gameState?.gmExtra || gm.lobby.data?.quick) return;
      window.gmReplaceAccessors.forceInputRegister = true;
    };

    window.addEventListener('mousedown', forceInputFunction);
    window.addEventListener('mouseup', forceInputFunction);
    document.getElementById('gamerenderer').addEventListener('contextmenu', (e) => e.preventDefault());

    window.addEventListener('mousemove', function() {
      if (!gm.state.gameState?.gmExtra || gm.lobby.data?.quick) return;
      if (!gm.lobby.networkEngine) return;

      const id = gm.lobby.networkEngine.getLSID();
      const gameLength = window.gmReplaceAccessors.gameLength;

      if (gm.input.mousePosList[id]?.[gameLength + 5]) return;

      let mouse = gm.graphics.rendererClass?.renderer?.plugins.interaction.mouse;

      if (mouse) {
        gm.input.lastMouse = {buttons: mouse.buttons, global: {x: mouse.global.x, y: mouse.global.y}};
      } else {
        mouse = gm.input.lastMouse;
      }

      let scaleRatio = gm.state.gameState?.physics.ppm * gm.graphics.rendererClass?.scaleRatio;
      if (Number.isNaN(scaleRatio)) scaleRatio = 0;

      let mousePos = [
        Math.round(mouse.global.x / scaleRatio * 1000000) / 1000000,
        Math.round(mouse.global.y / scaleRatio * 1000000) / 1000000,
      ];

      if (mousePos[0] == Infinity) {
        mousePos = [0, 0];
      }

      gm.input.mousePosList[id] ??= [];
      gm.input.mousePosList[id][gameLength + 5] = mousePos;

      gm.lobby.socket.emit(4, {gmMousePos: true, f: gameLength + 5, i: mousePos});
    });
  },
  initInputHandler: function() {
    InputHandler = function() {
      const handler = new InputHandlerOLD(...arguments);
      gm.input.inputHandler = handler;

      handler.getInputsOLD = handler.getInputs;
      handler.getInputs = function() {
        const inputs = handler.getInputsOLD(...arguments);

        if (!gm.state.gameState?.gmExtra || gm.lobby.data?.quick) return inputs;

        let mouse = gm.graphics.rendererClass?.renderer?.plugins.interaction.mouse;

        if (mouse) {
          gm.input.lastMouse = {buttons: mouse.buttons, global: {x: mouse.global.x, y: mouse.global.y}};
        } else {
          mouse = gm.input.lastMouse;
        }

        let scaleRatio = gm.state.gameState?.physics.ppm * gm.graphics.rendererClass?.scaleRatio;
        if (Number.isNaN(scaleRatio)) scaleRatio = 0;

        inputs.mouse = {
          left: (mouse.buttons & 0b001) == 0b001,
          right: (mouse.buttons & 0b010) == 0b010,
          middle: (mouse.buttons & 0b100) == 0b100,
        };

        return inputs;
      };

      return handler;
    };
  },
  initBonkUtils: function() {
    BonkUtils.encodeInputsOLD = BonkUtils.encodeInputs;
    BonkUtils.encodeInputs = function(decoded) {
      let encoded;

      // if it's got mouse then it's special gmmaker input
      if (decoded.mouse) {
        encoded = [
          BonkUtils.encodeInputsOLD(decoded),
          decoded.mouse.left << 0 |
          decoded.mouse.right << 1 |
          decoded.mouse.middle << 2,
        ];
      } else {
        encoded = BonkUtils.encodeInputsOLD(decoded);
      }

      return encoded;
    };

    BonkUtils.decodeInputsOLD = BonkUtils.decodeInputs;
    BonkUtils.decodeInputs = function(encoded) {
      let decoded;

      // if it's array then it's special gmmaker input
      if (Array.isArray(encoded)) {
        decoded = BonkUtils.decodeInputsOLD(encoded[0]);

        decoded.mouse = {
          left: (encoded[1] & 0b001) == 0b001,
          right: (encoded[1] & 0b010) == 0b010,
          middle: (encoded[1] & 0b100) == 0b100,
        };
      } else {
        if (encoded.gmMousePos) return encoded.pos;
        decoded = BonkUtils.decodeInputsOLD(encoded);
      }

      return decoded;
    };
  },
  insertMousePos: function(inputArray, frame) {
    for (let i = 0; i < this.mousePosList.length; i++) {
      if (!this.mousePosList[i]) continue;

      for (let f = Math.min(frame, this.mousePosList[i].length); f >= 0; f--) {
        if (!this.mousePosList[i][f]) continue;

        inputArray[i].mouse ??= {};
        inputArray[i].mouse.pos = this.mousePosList[i][f];
        break;
      }
    }

    return inputArray;
  },
  inputHandler: null,
  mousePosList: [],
  lastMouse: {buttons: 0, global: {x: 0, y: 0}},
};
