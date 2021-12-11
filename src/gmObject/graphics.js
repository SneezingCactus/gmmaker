/* eslint-disable camelcase */
/* eslint-disable new-cap */
export default {
  init: function() {
    this.initBonkGraphics();
  },
  initBonkGraphics: function() {
    GameRendererClass.prototype.render = (function() {
      GameRendererClass.prototype.render_OLD = GameRendererClass.prototype.render;
      return function() {
        const result = this.render_OLD.apply(this, arguments);
        gm.graphics.rendererClass = this;

        gm.graphics.rendering = true;
        if (gm.graphics.rendererClass) {
          for (let i = 0; i != gm.graphics.rendererClass.discGraphics.length; i++) {
            if (gm.graphics.additionalWorldGraphics[i] && !gm.graphics.additionalWorldGraphics[i]._destroyed && (!gm.graphics.rendererClass.discGraphics[i] || gm.lobby.roundStarting)) {
              gm.graphics.additionalWorldGraphics[i].clear();
            }

            if (gm.graphics.rendererClass.discGraphics[i] && gm.graphics.rendererClass.discGraphics[i].playerGraphic.children == 0) {
              const discGraphics = new PIXI.Graphics();

              gm.graphics.rendererClass.discGraphics[i].playerGraphic.addChild(discGraphics);
              gm.graphics.additionalDiscGraphics[i] = discGraphics;
            }
            if (gm.graphics.rendererClass.stage.children[1] && gm.lobby.roundStarting) {
              const worldGraphics = new PIXI.Graphics();

              gm.graphics.rendererClass.stage.children[1].addChild(worldGraphics);
              gm.graphics.additionalWorldGraphics[i] = worldGraphics;
            }
          }
        }

        if (gm.physics.gameState && gm.physics.gameState.discs) {
          for (let i = 0; i != gm.physics.gameState.discs.length; i++) {
            if (gm.physics.gameState.discs[i]) {
              if (!gm.inputs.allPlayerInputs[i]) {
                gm.inputs.allPlayerInputs[i] = {left: false, right: false, up: false, down: false, action: false, action2: false};
              }
              gm.graphics.onRender(i);
            }
          }
        }
        gm.graphics.rendering = false;

        return result;
      };
    })();
    GameRendererClass.prototype.destroy = (function() {
      GameRendererClass.prototype.destroy_OLD = GameRendererClass.prototype.destroy;
      return function() {
        if (gm.graphics.rendererClass) {
          for (let a = 0; a != gm.graphics.rendererClass.discGraphics.length; a++) {
            if (!gm.graphics.rendererClass.discGraphics[a]) continue;
            const discObject = gm.graphics.rendererClass.discGraphics[a].playerGraphic;
            while (discObject.children[0]) {
              discObject.removeChild(discObject.children[0]);
            }
          }

          const worldObject = gm.graphics.rendererClass.discContainer;
          while (worldObject.children[0]) {
            worldObject.removeChild(worldObject.children[0]);
          }

          gm.graphics.additionalDiscGraphics = [];
          gm.graphics.additionalWorldGraphics = [];
        }
        const result = this.destroy_OLD.apply(this, arguments);
        return result;
      };
    })();
  },
  rendererClass: null,
  rendering: false,
  additionalDiscGraphics: [],
  additionalWorldGraphics: [],
  onRender: function() { },
};
