/* eslint-disable camelcase */
/* eslint-disable new-cap */
import seedrandom from 'seedrandom';
import * as PIXI from 'pixi.js-legacy';

export default {
  init: function() {
    this.initBonkGraphics();
  },
  initBonkGraphics: function() {
    GameRendererClass.prototype.render = (function() {
      GameRendererClass.prototype.render_OLD = GameRendererClass.prototype.render;
      return function() {
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

        const result = this.render_OLD.apply(this, arguments);

        if (!gm.graphics.bodyGraphicsClass) gm.graphics.bodyGraphicsClass = this.roundGraphics.bodyGraphics[0]?.constructor;

        gm.graphics.rendererClass = this;

        gm.graphics.rendering = true;

        if (gm.graphics.rendererClass) {
          for (let i = 0; i != gm.graphics.rendererClass.discGraphics.length; i++) {
            if (gm.graphics.additionalWorldGraphics[i] && !gm.graphics.additionalWorldGraphics[i]._destroyed && (!gm.graphics.rendererClass.discGraphics[i] || gm.lobby.roundStarting)) {
              gm.graphics.additionalWorldGraphics[i].clear();
              gm.graphics.additionalWorldGraphics[i].removeChildren();
            }
            if (arguments[0].discs[i] && gm.graphics.rendererClass.discGraphics[i] && (!gm.graphics.additionalDiscGraphics[i] || !gm.graphics.rendererClass.discGraphics[i].container.children.includes(gm.graphics.additionalDiscGraphics[i]))) {
              const discGraphics = new PIXI.Graphics();

              discGraphics.scale.x = gm.graphics.rendererClass.scaleRatio;
              discGraphics.scale.y = gm.graphics.rendererClass.scaleRatio;
              gm.graphics.rendererClass.discGraphics[i].container.addChild(discGraphics);
              gm.graphics.additionalDiscGraphics[i] = discGraphics;
            }
            if (arguments[0].discs[i] && gm.graphics.rendererClass.blurContainer && gm.lobby.roundStarting && !gm.graphics.rendererClass.blurContainer.children.includes(gm.graphics.additionalWorldGraphics[i])) {
              const worldGraphics = new PIXI.Graphics();

              worldGraphics.scale.x = gm.graphics.rendererClass.scaleRatio;
              worldGraphics.scale.y = gm.graphics.rendererClass.scaleRatio;
              gm.graphics.rendererClass.blurContainer.addChild(worldGraphics);
              gm.graphics.additionalWorldGraphics[i] = worldGraphics;
            }
          }
        }

        // make seed based on scene element positions and game state seed
        const gst = gm.physics.gameState;
        let randomSeed = 0;
        for (let i = 0; i != gst.physics.bodies.length; i++) {
          if (gst.physics.bodies[i]) {
            randomSeed = randomSeed + gst.physics.bodies[i].p[0] + gst.physics.bodies[i].p[1] + gst.physics.bodies[i].a;
          }
        }
        for (let i = 0; i != gst.discs.length; i++) {
          if (gst.discs[i]) {
            randomSeed = randomSeed + gst.discs[i].x + gst.discs[i].y + gst.discs[i].xv + gst.discs[i].yv;
          }
        }
        randomSeed += gst.rl;
        randomSeed /= gst.seed;
        gm.physics.pseudoRandom = new seedrandom(randomSeed);

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
        gm.graphics.renderUpdates = [];
        return result;
      };
    })();
    GameRendererClass.prototype.resizeRenderer = (function() {
      GameRendererClass.prototype.resizeRenderer_OLD = GameRendererClass.prototype.resizeRenderer;
      return function() {
        for (let i = 0; i != gm.graphics.additionalDiscGraphics.length; i++) {
          if (!gm.graphics.additionalDiscGraphics[i]) continue;
          gm.graphics.rendererClass?.discGraphics[i]?.container.removeChild(gm.graphics.additionalDiscGraphics[i]);
        }
        for (let i = 0; i != gm.graphics.additionalWorldGraphics.length; i++) {
          if (!gm.graphics.additionalWorldGraphics[i]) continue;
          gm.graphics.rendererClass?.blurContainer.removeChild(gm.graphics.additionalWorldGraphics[i]);
        }
        const result = this.resizeRenderer_OLD.apply(this, arguments);
        for (let i = 0; i != gm.graphics.additionalDiscGraphics.length; i++) {
          if (!gm.graphics.additionalDiscGraphics[i]) continue;

          gm.graphics.additionalDiscGraphics[i].scale.x = gm.graphics.rendererClass.scaleRatio;
          gm.graphics.additionalDiscGraphics[i].scale.y = gm.graphics.rendererClass.scaleRatio;
          gm.graphics.rendererClass?.discGraphics[i]?.container.addChild(gm.graphics.additionalDiscGraphics[i]);
        }
        for (let i = 0; i != gm.graphics.additionalWorldGraphics.length; i++) {
          if (!gm.graphics.additionalWorldGraphics[i]) continue;

          gm.graphics.additionalWorldGraphics[i].scale.x = gm.graphics.rendererClass.scaleRatio;
          gm.graphics.additionalWorldGraphics[i].scale.y = gm.graphics.rendererClass.scaleRatio;
          gm.graphics.rendererClass?.blurContainer.addChild(gm.graphics.additionalWorldGraphics[i]);
        }
        return result;
      };
    })();
  },
  doRollback: function(fromStepCount, toStepCount) {
    for (let i = fromStepCount; i > toStepCount; i--) {
      if (gm.graphics.renderUpdates[window.GMGameStateList[i].rl] && window.GMGameStateList[i - 1]) {
        const alreadyDone = [];

        for (let a = 0; a != gm.graphics.renderUpdates[window.GMGameStateList[i].rl].length; a++) {
          const update = gm.graphics.renderUpdates[window.GMGameStateList[i].rl][a];

          if (alreadyDone.includes(update)) continue;

          switch (update.action) {
            case 'create': {
              if (this.rendererClass.roundGraphics.bodyGraphics[update.id]) {
                this.rendererClass.roundGraphics.displayObject.removeChild(this.rendererClass.roundGraphics.bodyGraphics[update.id].jointContainer);
                this.rendererClass.roundGraphics.displayObject.removeChild(this.rendererClass.roundGraphics.bodyGraphics[update.id].displayObject);
                this.rendererClass.roundGraphics.bodyGraphics[update.id].destroy();
                delete this.rendererClass.roundGraphics.bodyGraphics[update.id];
              }
              break;
            }
            case 'delete': {
              const newBodyGraphics = new gm.graphics.bodyGraphicsClass(window.GMGameStateList[i - 1], update.id, this.rendererClass.scaleRatio, this.rendererClass.renderer, gm.lobby.mpSession.getGameSettings(), this.rendererClass.playerArray);

              this.rendererClass.roundGraphics.bodyGraphics[update.id] = newBodyGraphics;
              this.rendererClass.roundGraphics.displayObject.addChild(newBodyGraphics.displayObject);
              break;
            }
            case 'update': {
              if (this.rendererClass.roundGraphics.bodyGraphics[update.id]) {
                this.rendererClass.roundGraphics.bodyGraphics[update.id]?.destroy();
              }

              const newBodyGraphics = new gm.graphics.bodyGraphicsClass(window.GMGameStateList[i - 1], update.id, this.rendererClass.scaleRatio, this.rendererClass.renderer, gm.lobby.mpSession.getGameSettings(), this.rendererClass.playerArray);

              this.rendererClass.roundGraphics.bodyGraphics[update.id] = newBodyGraphics;
              this.rendererClass.roundGraphics.displayObject.addChild(newBodyGraphics.displayObject);
              break;
            }
          }

          alreadyDone.push(update);
        }

        delete gm.graphics.renderUpdates[window.GMGameStateList[i].rl];
      }
    }
  },
  doRenderUpdates: function(gameState) {
    if (gm.graphics.renderUpdates[gameState.rl]) {
      const alreadyDone = [];

      for (let i = 0; i != gm.graphics.renderUpdates[gameState.rl].length; i++) {
        const update = gm.graphics.renderUpdates[gameState.rl][i];

        if (alreadyDone.includes(update)) continue;
        if (update.done) continue;

        switch (update.action) {
          case 'create': {
            const newBodyGraphics = new gm.graphics.bodyGraphicsClass(gameState, update.id, this.rendererClass.scaleRatio, this.rendererClass.renderer, gm.lobby.mpSession.getGameSettings(), this.rendererClass.playerArray);

            this.rendererClass.roundGraphics.bodyGraphics[update.id] = newBodyGraphics;
            this.rendererClass.roundGraphics.displayObject.addChild(newBodyGraphics.displayObject);
            break;
          }
          case 'delete': {
            if (this.rendererClass.roundGraphics.bodyGraphics[update.id]) {
              this.rendererClass.roundGraphics.displayObject.removeChild(this.rendererClass.roundGraphics.bodyGraphics[update.id].jointContainer);
              this.rendererClass.roundGraphics.displayObject.removeChild(this.rendererClass.roundGraphics.bodyGraphics[update.id].displayObject);
              this.rendererClass.roundGraphics.bodyGraphics[update.id].destroy();
              delete this.rendererClass.roundGraphics.bodyGraphics[update.id];
            }
            break;
          }
          case 'update': {
            if (this.rendererClass.roundGraphics.bodyGraphics[update.id]) {
              this.rendererClass.roundGraphics.bodyGraphics[update.id]?.destroy();
            }

            const newBodyGraphics = new gm.graphics.bodyGraphicsClass(gameState, update.id, this.rendererClass.scaleRatio, this.rendererClass.renderer, gm.lobby.mpSession.getGameSettings(), this.rendererClass.playerArray);

            this.rendererClass.roundGraphics.bodyGraphics[update.id] = newBodyGraphics;
            this.rendererClass.roundGraphics.displayObject.addChild(newBodyGraphics.displayObject);
            break;
          }
        }

        gm.graphics.renderUpdates[gameState.rl][i].done = true;
        update.done = true;
        alreadyDone.push(update);
      }
    }
  },
  rendererClass: null,
  bodyGraphicsClass: null,
  rendering: false,
  needRerender: false,
  renderUpdates: [],
  additionalDiscGraphics: [],
  additionalWorldGraphics: [],
  availableText: [],
  usedText: [],
  onRender: function() { },
};
