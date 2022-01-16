/* eslint-disable camelcase */
/* eslint-disable new-cap */
import seedrandom from 'seedrandom';

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

        if (arguments[0].physics.shapes.length != arguments[1].physics.shapes.length) {
          for (let i = 0; i != arguments[1].physics.shapes.length; i++) {
            if (!arguments[0].physics.shapes[i]) arguments[0].physics.shapes[i] = arguments[1].physics.shapes[i];
          }
          for (let i = 0; i != arguments[1].physics.bodies.length; i++) {
            if (!arguments[0].physics.bodies[i]) arguments[0].physics.bodies[i] = arguments[1].physics.bodies[i];
          }
          for (let i = 0; i != arguments[1].physics.fixtures.length; i++) {
            if (!arguments[0].physics.fixtures[i]) arguments[0].physics.fixtures[i] = arguments[1].physics.fixtures[i];
          }
        }

        gm.graphics.rendering = true;
        if (gm.graphics.rendererClass) {
          for (let i = 0; i != gm.graphics.rendererClass.discGraphics.length; i++) {
            if (gm.graphics.additionalWorldGraphics[i] && !gm.graphics.additionalWorldGraphics[i]._destroyed && (!gm.graphics.rendererClass.discGraphics[i] || gm.lobby.roundStarting)) {
              gm.graphics.additionalWorldGraphics[i].clear();
              gm.graphics.additionalWorldGraphics[i].removeChildren();
            }
            if (gm.graphics.rendererClass.discGraphics[i] && (!gm.graphics.additionalDiscGraphics[i] || !gm.graphics.rendererClass.discGraphics[i].container.children.includes(gm.graphics.additionalDiscGraphics[i]))) {
              const discGraphics = new PIXI.Graphics();

              gm.graphics.rendererClass.discGraphics[i].container.addChild(discGraphics);
              gm.graphics.additionalDiscGraphics[i] = discGraphics;
            }
            if (gm.graphics.rendererClass.stage.children[1] && gm.lobby.roundStarting) {
              const worldGraphics = new PIXI.Graphics();

              gm.graphics.rendererClass.stage.children[1].addChild(worldGraphics);
              gm.graphics.additionalWorldGraphics[i] = worldGraphics;
            }
          }
        }

        // rerender management
        if (gm.graphics.needRerender) {
          gm.graphics.needRerender = false;

          const newRoundGraphics = new gm.graphics.rendererClass.roundGraphics.constructor(gm.physics.gameState, gm.graphics.rendererClass.scaleRatio, gm.graphics.rendererClass.renderer, gm.lobby.mpSession.getGameSettings(), gm.graphics.rendererClass.playerArray);

          if (gm.graphics.rendererClass.roundGraphics) {
            gm.graphics.rendererClass.environmentContainer.removeChild(gm.graphics.rendererClass.roundGraphics);
            gm.graphics.rendererClass.roundGraphics.destroy();
            gm.graphics.rendererClass.roundGraphics = null;
          }

          gm.graphics.rendererClass.roundGraphics = newRoundGraphics;
          gm.graphics.rendererClass.environmentContainer.addChild(gm.graphics.rendererClass.roundGraphics.displayObject);
        }

        // make seed based on scene element positions and game state seed\
        const gst = gm.physics.gameState;
        let randomSeed = gst.seed;
        for (let i = 0; i != gst.physics.bodies.length; i++) {
          if (gst.physics.bodies[i]) {
            randomSeed += gst.physics.bodies[i].p + gst.physics.bodies[i].a;
          }
        }
        for (let i = 0; i != gst.discs.length; i++) {
          if (gst.discs[i]) {
            randomSeed += gst.discs[i].x + gst.discs[i].y + gst.discs[i].xv + gst.discs[i].yv;
          }
        }
        gm.physics.pseudoRandom = new seedrandom.alea(randomSeed);

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

            gm.graphics.additionalDiscGraphics[a]?.removeChildren();
            gm.graphics.additionalWorldGraphics[a]?.removeChildren();

            const discObject = gm.graphics.rendererClass.discGraphics[a].container;
            while (discObject.children[0]) {
              discObject.removeChild(discObject.children[0]);
            }
          }

          const worldObject = gm.graphics.rendererClass.stage;
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
  rerender: function() {
    gm.graphics.rendererClass.roundGraphics.build(gm.physics.gameState, gm.graphics.rendererClass.scaleRatio, gm.graphics.rendererClass.renderer, 0, gm.graphics.rendererClass.playerArray);
  },
  rendererClass: null,
  rendering: false,
  needRerender: false,
  additionalDiscGraphics: [],
  additionalWorldGraphics: [],
  availableText: [],
  usedText: [],
  onRender: function() { },
};
