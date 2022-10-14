export default {
  init: function() {
    this.initInputHandler();
    this.initBonkUtils();

    const forceInputFunction = function() {
      window.gmReplaceAccessors.forceInputRegister = true;
    };

    window.addEventListener('mousedown', forceInputFunction);
    window.addEventListener('mouseup', forceInputFunction);
    window.addEventListener('mousemove', forceInputFunction);
  },
  initInputHandler: function() {
    InputHandler = function() {
      const handler = new InputHandlerOLD(...arguments);
      gm.input.inputHandler = handler;

      handler.getInputsOLD = handler.getInputs;
      handler.getInputs = function() {
        const inputs = handler.getInputsOLD(...arguments);

        const mouse = gm.graphics.rendererClass.renderer.plugins.interaction.mouse;
        const scaleRatio = gm.state.gameState.physics.ppm * gm.graphics.rendererClass.scaleRatio;

        inputs.mouse = {
          pos: [
            mouse.global.x / scaleRatio,
            mouse.global.y / scaleRatio,
          ],
          left: (mouse.buttons & 0b001) == 0b001,
          right: (mouse.buttons & 0b010) == 0b010,
          middle: (mouse.buttons & 0b100) == 0b100,
        };

        if (inputs.mouse.pos[0] == Infinity) {
          inputs.mouse.pos = [0, 0];
        }

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
          decoded.mouse.pos[0],
          decoded.mouse.pos[1],
          decoded.mouse.left << 0 |
          decoded.mouse.right << 1 |
          decoded.mouse.middle << 2,
        ];
      } else {
        encoded = BonkUtils.decodeInputsOLD(decoded);
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
          pos: [encoded[1], encoded[2]],
          left: (encoded[3] & 0b001) == 0b001,
          right: (encoded[4] & 0b010) == 0b010,
          middle: (encoded[5] & 0b100) == 0b100,
        };
      } else {
        decoded = BonkUtils.decodeInputsOLD(encoded);
      }

      return decoded;
    };
  },
  inputHandler: null,
};
