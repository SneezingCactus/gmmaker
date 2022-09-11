/* eslint-disable camelcase */
/* eslint-disable new-cap */
import seedrandom from 'seedrandom';
import * as PIXI from 'pixi.js-legacy';

export default {
  init: function() {
    // this.initBonkGraphics();
  },
  initBonkGraphics: function() {
    BonkGraphics.prototype.render = (function() {
      BonkGraphics.prototype.renderOLD = BonkGraphics.prototype.render;
      return function() {
        const gmExtraA = arguments[0].gmExtra;
        const gmExtraB = arguments[1].gmExtra;

        // modify offscreen function of discs
        if (!this.discGraphics?.[this.discGraphics?.length - 1]?.__proto__.doOffScreenOLD && this.discGraphics?.[this.discGraphics?.length - 1]?.__proto__.doOffScreen) {
          const discGraphic = this.discGraphics?.[this.discGraphics?.length - 1];
          discGraphic.__proto__.doOffScreenOLD = discGraphic.__proto__.doOffScreen;
          discGraphic.__proto__.doOffScreen = function() {
            this.offScreenContainer.visible = false;
            if (!gm.state.gameState?.gmExtra.cameraChanged && gm.state.gameState?.rl > 1) {
              return this.doOffScreenOLD.apply(this, arguments);
            }
            return;
          };
        }

        // camera movement
        if (gm.graphics.cameraContainer && !gm.graphics.cameraContainer._destroyed && gm.lobby.networkEngine && gmExtraA?.cameras?.[gm.lobby.networkEngine.getLSID()] && gmExtraB?.cameras?.[gm.lobby.networkEngine.getLSID()]) {
          const cameraObjA = gmExtraA.cameras[gm.lobby.networkEngine.getLSID()];
          const cameraObjB = gmExtraB.cameras[gm.lobby.networkEngine.getLSID()];
          const scaleMultiplier = arguments[0].physics.ppm * gm.graphics.rendererClass.scaleRatio;

          if (cameraObjA.doLerp || cameraObjB.doLerp) {
            const anglePointA = [Math.sin(cameraObjA.angle), Math.cos(cameraObjA.angle)];
            const anglePointB = [Math.sin(cameraObjB.angle), Math.cos(cameraObjB.angle)];
            const lerpedAnglePoint = [
              (1 - arguments[2]) * anglePointA[0] + arguments[2] * anglePointB[0],
              (1 - arguments[2]) * anglePointA[1] + arguments[2] * anglePointB[1],
            ];

            gm.graphics.cameraContainer.pivot.x = (1 - arguments[2]) * cameraObjA.xpos * scaleMultiplier + arguments[2] * cameraObjB.xpos * scaleMultiplier;
            gm.graphics.cameraContainer.pivot.y = (1 - arguments[2]) * cameraObjA.ypos * scaleMultiplier + arguments[2] * cameraObjB.ypos * scaleMultiplier;
            gm.graphics.cameraContainer.rotation = Math.atan2(lerpedAnglePoint[0], lerpedAnglePoint[1]);
            gm.graphics.cameraContainer.scale.x = (1 - arguments[2]) * cameraObjA.xscal + arguments[2] * cameraObjB.xscal;
            gm.graphics.cameraContainer.scale.y = (1 - arguments[2]) * cameraObjA.yscal + arguments[2] * cameraObjB.yscal;
            gm.graphics.cameraContainer.skew.x = (1 - arguments[2]) * cameraObjA.xskew + arguments[2] * cameraObjB.xskew;
            gm.graphics.cameraContainer.skew.y = (1 - arguments[2]) * cameraObjA.yskew + arguments[2] * cameraObjB.yskew;
          } else {
            gm.graphics.cameraContainer.pivot.x = cameraObjB.xpos * scaleMultiplier;
            gm.graphics.cameraContainer.pivot.y = cameraObjB.ypos * scaleMultiplier;
            gm.graphics.cameraContainer.angle = cameraObjB.angle;
            gm.graphics.cameraContainer.scale.x = cameraObjB.xscal;
            gm.graphics.cameraContainer.scale.y = cameraObjB.yscal;
            gm.graphics.cameraContainer.skew.x = cameraObjB.xskew;
            gm.graphics.cameraContainer.skew.y = cameraObjB.yskew;
          }

          window.gmReplaceAccessors.addToStereo = ((-gm.graphics.cameraContainer.pivot.x + 730 * this.scaleRatio) * gm.graphics.cameraContainer.scale.x) / (365 * this.scaleRatio) - 1;
        }

        // remove arrows from camera container
        for (let i = 0; i < this.arrowGraphics.length; i++) {
          if (this.arrowGraphics[i] && gm.graphics.cameraContainer.children.includes(this.arrowGraphics[i].graphic) &&
            ((!arguments[0].projectiles[i] || !arguments[1].projectiles[i] || arguments[1].projectiles[i].did != this.arrowGraphics[i].ownerID))) {
            gm.graphics.cameraContainer.removeChild(this.arrowGraphics[i].graphic);
          }
        }

        // bonk crashes if it tries to move something that doesn't exist in the previous frame
        const newBodies = [];
        const newFixtures = [];
        const newShapes = [];
        const newDiscs = [];

        if (arguments[0].physics.shapes.length != arguments[1].physics.shapes.length) {
          for (let i = 0; i < arguments[1].physics.shapes.length; i++) {
            if (!arguments[1].physics.shapes[i]) continue;
            if (arguments[0].physics.shapes[i]) continue;
            newShapes.push(i);
            arguments[0].physics.shapes[i] = arguments[1].physics.shapes[i];
          }
          for (let i = 0; i < arguments[1].physics.bodies.length; i++) {
            if (!arguments[1].physics.bodies[i]) continue;
            if (arguments[0].physics.bodies[i]) continue;
            newBodies.push(i);
            arguments[0].physics.bodies[i] = arguments[1].physics.bodies[i];
          }
          for (let i = 0; i < arguments[1].physics.fixtures.length; i++) {
            if (!arguments[1].physics.fixtures[i]) continue;
            if (arguments[0].physics.fixtures[i]) continue;
            newFixtures.push(i);
            arguments[0].physics.fixtures[i] = arguments[1].physics.fixtures[i];
          }
          for (let i = 0; i < arguments[1].discs.length; i++) {
            if (!arguments[1].discs[i]) continue;
            if (arguments[0].discs[i]) continue;
            newDiscs.push(i);
            arguments[0].discs[i] = arguments[1].discs[i];
          }
        }

        const result = this.renderOLD.apply(this, arguments);

        // revert the last game state changes
        for (let i = 0; i < newBodies.length; i++) {
          delete arguments[0].physics.bodies[newBodies[i]];
          arguments[0].physics.bodies.length--;
        }
        for (let i = 0; i < newFixtures.length; i++) {
          delete arguments[0].physics.fixtures[newFixtures[i]];
          arguments[0].physics.fixtures.length--;
        }
        for (let i = 0; i < newShapes.length; i++) {
          delete arguments[0].physics.shapes[newShapes[i]];
          arguments[0].physics.shapes.length--;
        }
        for (let i = 0; i < newDiscs.length; i++) {
          delete arguments[0].discs[newDiscs[i]];
          arguments[0].discs.length--;
        }

        if (!gm.graphics.bodyGraphicsClass) gm.graphics.bodyGraphicsClass = this.roundGraphics.bodyGraphics[0]?.constructor;

        gm.graphics.rendererClass = this;

        // camera container creation
        if (!gm.graphics.cameraContainer || gm.graphics.cameraContainer._destroyed || !this.blurContainer.children.includes(gm.graphics.cameraContainer)) {
          gm.graphics.cameraContainer = new PIXI.Container();

          this.blurContainer.addChild(gm.graphics.cameraContainer);

          gm.graphics.cameraContainer.addChild(this.environmentContainer);
          gm.graphics.cameraContainer.addChild(this.discContainer);

          gm.graphics.cameraContainer.pivot.x = 365 * gm.graphics.rendererClass.scaleRatio;
          gm.graphics.cameraContainer.pivot.y = 250 * gm.graphics.rendererClass.scaleRatio;
          gm.graphics.cameraContainer.sortableChildren = true;
        }

        if (!gm.graphics.cameraContainer.children.includes(this.particleManager.container)) gm.graphics.cameraContainer.addChild(this.particleManager.container);

        if (this.blurContainer && (this.blurContainer.pivot.x != gm.graphics.rendererClass.domLastWidth / 2 || this.blurContainer.pivot.y != gm.graphics.rendererClass.domLastHeight / 2)) {
          this.blurContainer.pivot.x = -365 * gm.graphics.rendererClass.scaleRatio;
          this.blurContainer.pivot.y = -250 * gm.graphics.rendererClass.scaleRatio;
        }

        // move arrows to camera container
        for (let i = 0; i < this.arrowGraphics.length; i++) {
          if (this.arrowGraphics[i] && !gm.graphics.cameraContainer.children.includes(this.arrowGraphics[i].graphic)) {
            gm.graphics.cameraContainer.addChild(this.arrowGraphics[i].graphic);
          }
        }

        // world and disc drawing objects add to stages
        if (gm.graphics.rendererClass) {
          for (let i = 0; i < gm.graphics.rendererClass.discGraphics.length; i++) {
            if (arguments[0].discs[i] && gm.graphics.rendererClass.discGraphics[i] && gm.graphics.additionalDiscGraphics[i] && !gm.graphics.rendererClass.discGraphics[i].container.children.includes(gm.graphics.additionalDiscGraphics[i])) {
              gm.graphics.additionalDiscGraphics[i].scale.x = gm.graphics.rendererClass.scaleRatio;
              gm.graphics.additionalDiscGraphics[i].scale.y = gm.graphics.rendererClass.scaleRatio;
              gm.graphics.rendererClass.discGraphics[i].container.addChild(gm.graphics.additionalDiscGraphics[i]);
            }
            if (arguments[0].discs[i] && gm.graphics.rendererClass.blurContainer && gm.graphics.additionalWorldGraphics[i] && !gm.graphics.cameraContainer.children.includes(gm.graphics.additionalWorldGraphics[i])) {
              gm.graphics.additionalWorldGraphics[i].scale.x = gm.graphics.rendererClass.scaleRatio;
              gm.graphics.additionalWorldGraphics[i].scale.y = gm.graphics.rendererClass.scaleRatio;
              gm.graphics.cameraContainer.addChild(gm.graphics.additionalWorldGraphics[i]);
            }
            if (arguments[0].discs[i] && gm.graphics.rendererClass.blurContainer && gm.graphics.additionalScreenGraphics[i] && !gm.graphics.rendererClass.blurContainer.children.includes(gm.graphics.additionalScreenGraphics[i])) {
              gm.graphics.additionalScreenGraphics[i].scale.x = gm.graphics.rendererClass.scaleRatio;
              gm.graphics.additionalScreenGraphics[i].scale.y = gm.graphics.rendererClass.scaleRatio;
              gm.graphics.additionalScreenGraphics[i].pivot.x = 365;
              gm.graphics.additionalScreenGraphics[i].pivot.y = 250;
              gm.graphics.rendererClass.blurContainer.addChild(gm.graphics.additionalScreenGraphics[i]);
            }
          }
        }

        // make seed based on scene element positions and game state seed
        const gst = gm.state.gameState;
        let randomSeed = 0;
        for (let i = 0; i < gst.physics.bodies.length; i++) {
          if (gst.physics.bodies[i]) {
            randomSeed = randomSeed + gst.physics.bodies[i].p[0] + gst.physics.bodies[i].p[1] + gst.physics.bodies[i].a;
          }
        }
        for (let i = 0; i < gst.discs.length; i++) {
          if (gst.discs[i]) {
            randomSeed = randomSeed + gst.discs[i].x + gst.discs[i].y + gst.discs[i].xv + gst.discs[i].yv;
          }
        }
        randomSeed += gst.rl;
        randomSeed /= gst.seed;
        gm.state.pseudoRandom = new seedrandom(randomSeed);

        if (gm.state.gameState && gm.state.gameState.discs) {
          for (let i = 0; i < gm.state.gameState.discs.length; i++) {
            if (gm.state.gameState.discs[i]) {
              if (!gm.inputs.allPlayerInputs[i]) {
                gm.inputs.allPlayerInputs[i] = {left: false, right: false, up: false, down: false, action: false, action2: false};
              }
              try {
                gm.graphics.onRender(i);
              } catch (e) {
                if (!gm.lobby.gameCrashed) {
                  if (e === 'gmInfiniteLoop') {
                    gm.lobby.haltCausedByLoop = true;
                  } else {
                    console.error(e);
                  }
                  gm.lobby.gameCrashed = true;
                  setTimeout(gm.lobby.gameHalt, 500); // gotta make sure we're out of the step function!
                }
              }
            }
          }
        }

        // render
        gm.graphics.rendererClass.renderer.render(gm.graphics.rendererClass.stage);

        return result;
      };
    })();
    BonkGraphics.prototype.build = (function() {
      BonkGraphics.prototype.buildOLD = BonkGraphics.prototype.build;
      return function() {
        const result = this.buildOLD.apply(this, arguments);
        gm.editor.varInspector.innerHTML = '';
        return result;
      };
    })();
    BonkGraphics.prototype.destroy = (function() {
      BonkGraphics.prototype.destroyOLD = BonkGraphics.prototype.destroy;
      return function() {
        gm.editor.varInspector.innerHTML = '';

        if (gm.graphics.rendererClass) {
          for (let a = 0; a != gm.graphics.rendererClass.discGraphics.length; a++) {
            if (!gm.graphics.rendererClass.discGraphics[a]) continue;

            gm.graphics.additionalDiscGraphics[a]?.removeChildren();
            gm.graphics.additionalWorldGraphics[a]?.removeChildren();
            gm.graphics.additionalScreenGraphics[a]?.removeChildren();

            const discObject = gm.graphics.rendererClass.discGraphics[a].container;
            while (discObject.children[0]) {
              discObject.removeChild(discObject.children[0]);
            }
          }

          const worldObject = gm.graphics.rendererClass.blurContainer;
          while (worldObject.children[0]) {
            worldObject.removeChild(worldObject.children[0]);
          }

          gm.graphics.cameraContainer?.destroy();

          gm.graphics.additionalDiscGraphics = [];
          gm.graphics.additionalWorldGraphics = [];
          gm.graphics.additionalScreenGraphics = [];
        }
        const result = this.destroyOLD.apply(this, arguments);
        gm.graphics.renderUpdates = [];
        return result;
      };
    })();
    BonkGraphics.prototype.resizeRenderer = (function() {
      BonkGraphics.prototype.resizeRendererOLD = BonkGraphics.prototype.resizeRenderer;
      return function() {
        if (gm.graphics.rendererClass) {
          for (let i = 0; i < gm.graphics.additionalDiscGraphics.length; i++) {
            if (!gm.graphics.additionalDiscGraphics[i]) continue;
            gm.graphics.rendererClass.discGraphics[i]?.container.removeChild(gm.graphics.additionalDiscGraphics[i]);
          }
          for (let i = 0; i < gm.graphics.additionalWorldGraphics.length; i++) {
            if (!gm.graphics.additionalWorldGraphics[i]) continue;
            gm.graphics.cameraContainer?.removeChild(gm.graphics.additionalWorldGraphics[i]);
          }
          for (let i = 0; i < gm.graphics.additionalScreenGraphics.length; i++) {
            if (!gm.graphics.additionalScreenGraphics[i]) continue;
            gm.graphics.rendererClass.blurContainer?.removeChild(gm.graphics.additionalScreenGraphics[i]);
          }
          const result = this.resizeRendererOLD.apply(this, arguments);
          for (let i = 0; i < gm.graphics.additionalDiscGraphics.length; i++) {
            if (!gm.graphics.additionalDiscGraphics[i]) continue;

            gm.graphics.additionalDiscGraphics[i].scale.x = gm.graphics.rendererClass.scaleRatio;
            gm.graphics.additionalDiscGraphics[i].scale.y = gm.graphics.rendererClass.scaleRatio;
            gm.graphics.rendererClass.discGraphics[i]?.container.addChild(gm.graphics.additionalDiscGraphics[i]);

            gm.graphics.additionalWorldGraphics[i].scale.x = gm.graphics.rendererClass.scaleRatio;
            gm.graphics.additionalWorldGraphics[i].scale.y = gm.graphics.rendererClass.scaleRatio;
            gm.graphics.cameraContainer?.addChild(gm.graphics.additionalWorldGraphics[i]);

            gm.graphics.additionalScreenGraphics[i].scale.x = gm.graphics.rendererClass.scaleRatio;
            gm.graphics.additionalScreenGraphics[i].scale.y = gm.graphics.rendererClass.scaleRatio;
            gm.graphics.additionalScreenGraphics[i].pivot.x = 365;
            gm.graphics.additionalScreenGraphics[i].pivot.y = 250;
            gm.graphics.rendererClass.blurContainer?.addChild(gm.graphics.additionalScreenGraphics[i]);
          }

          if (gm.graphics.cameraContainer && !gm.graphics.cameraContainer._destroyed) {
            gm.graphics.cameraContainer.pivot.x = 365 * gm.graphics.rendererClass.scaleRatio;
            gm.graphics.cameraContainer.pivot.y = 250 * gm.graphics.rendererClass.scaleRatio;
          }
          return result;
        } else {
          return this.resizeRendererOLD.apply(this, arguments);
        }
      };
    })();
  },
  onPhysStep: function(gameState) {
    if (gameState.fte == 0) gm.editor.varInspector.innerHTML = '';

    const shouldShowVarInsp = gm.editor.savedSettings?.getAttribute('showVarInspector') === 'true' &&// mode has var inspector enabled
      gm.graphics.rendererClass.domContainer.style.visibility !== 'hidden';// we're in-game (to prevent it from popping up in the editor)

    if (shouldShowVarInsp && gm.editor.varInspectorContainer.style.display !== 'block') {
      gm.editor.varInspectorContainer.style.display = 'block';
    } else if (!shouldShowVarInsp && gm.editor.varInspectorContainer.style.display !== 'none') {
      gm.editor.varInspectorContainer.style.display = 'none';
    }

    if (gm.graphics.rendererClass?.playerArray && shouldShowVarInsp) gm.editor.updateVarInspector(gameState);

    // world and disc drawing objects creation, as well as cleaning graphics on the end of a round
    for (let i = 0; i < gameState.gmExtra?.initialPlayers?.length; i++) {
      const id = gameState.gmExtra.initialPlayers[i];

      if (!gm.graphics.additionalDiscGraphics[id] || gm.graphics.additionalDiscGraphics[id]._destroyed) {
        gm.graphics.additionalDiscGraphics[id] = new PIXI.Graphics();
      }
      if (!gm.graphics.additionalWorldGraphics[id] || gm.graphics.additionalWorldGraphics[id]._destroyed) {
        gm.graphics.additionalWorldGraphics[id] = new PIXI.Graphics();
        gm.graphics.additionalWorldGraphics[id].zIndex = 9999;
      }
      if (!gm.graphics.additionalScreenGraphics[id] || gm.graphics.additionalScreenGraphics[id]._destroyed) {
        gm.graphics.additionalScreenGraphics[id] = new PIXI.Graphics();
        gm.graphics.additionalScreenGraphics[id].zIndex = 9999;
      }
    }

    if (gameState.rl === 1) gm.editor.funcs.clearGraphics();
  },
  doRollback: function(fromStepCount, toStepCount) {
    // if (toStepCount == 0) return;
    for (let i = fromStepCount; i > toStepCount; i--) {
      const previousGameState = window.gmReplaceAccessors.gameStateList[i - 1];
      const gameState = window.gmReplaceAccessors.gameStateList[i];
      if (gm.graphics.renderUpdates[gameState.rl] && previousGameState) {
        const alreadyDone = [];

        for (let a = 0; a != gm.graphics.renderUpdates[gameState.rl].length; a++) {
          const update = gm.graphics.renderUpdates[gameState.rl][a];

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
              const newBodyGraphics = new gm.graphics.bodyGraphicsClass(previousGameState, update.id, this.rendererClass.scaleRatio, this.rendererClass.renderer, gm.lobby.mpSession.getGameSettings(), this.rendererClass.playerArray);

              this.rendererClass.roundGraphics.bodyGraphics[update.id] = newBodyGraphics;

              const bodyBehind = this.rendererClass.roundGraphics.bodyGraphics[previousGameState.physics.bro[previousGameState.physics.bro.indexOf(update.id) + 1]]?.displayObject;

              const index = this.rendererClass.roundGraphics.displayObject.children.indexOf(bodyBehind) + 1;

              if (bodyBehind && index !== -1) {
                if (newBodyGraphics.jointContainer.children.length > 0) this.rendererClass.roundGraphics.displayObject.addChildAt(newBodyGraphics.jointContainer, index);
                this.rendererClass.roundGraphics.displayObject.addChildAt(newBodyGraphics.displayObject, index);
              } else {
                if (newBodyGraphics.jointContainer.children.length > 0) this.rendererClass.roundGraphics.displayObject.addChildAt(newBodyGraphics.jointContainer, 0);
                this.rendererClass.roundGraphics.displayObject.addChildAt(newBodyGraphics.displayObject, 0);
              }

              break;
            }
            case 'update': {
              if (this.rendererClass.roundGraphics.bodyGraphics[update.id]) {
                this.rendererClass.roundGraphics.displayObject.removeChild(this.rendererClass.roundGraphics.bodyGraphics[update.id].jointContainer);
                this.rendererClass.roundGraphics.displayObject.removeChild(this.rendererClass.roundGraphics.bodyGraphics[update.id].displayObject);
                this.rendererClass.roundGraphics.bodyGraphics[update.id]?.destroy();
              }

              const newBodyGraphics = new gm.graphics.bodyGraphicsClass(previousGameState, update.id, this.rendererClass.scaleRatio, this.rendererClass.renderer, gm.lobby.mpSession.getGameSettings(), this.rendererClass.playerArray);

              this.rendererClass.roundGraphics.bodyGraphics[update.id] = newBodyGraphics;

              const bodyBehind = this.rendererClass.roundGraphics.bodyGraphics[previousGameState.physics.bro[previousGameState.physics.bro.indexOf(update.id) + 1]]?.displayObject;

              const index = this.rendererClass.roundGraphics.displayObject.children.indexOf(bodyBehind) + 1;

              if (bodyBehind && index !== -1) {
                if (newBodyGraphics.jointContainer.children.length > 0) this.rendererClass.roundGraphics.displayObject.addChildAt(newBodyGraphics.jointContainer, index);
                this.rendererClass.roundGraphics.displayObject.addChildAt(newBodyGraphics.displayObject, index);
              } else {
                if (newBodyGraphics.jointContainer.children.length > 0) this.rendererClass.roundGraphics.displayObject.addChildAt(newBodyGraphics.jointContainer, 0);
                this.rendererClass.roundGraphics.displayObject.addChildAt(newBodyGraphics.displayObject, 0);
              }

              break;
            }
          }

          alreadyDone.push(update);
        }

        delete gm.graphics.renderUpdates[gameState.rl];
      }
    }
  },
  doRenderUpdates: function(gameState) {
    if (!gm.graphics.renderUpdates[gameState.rl]) return;
    if (!gm.graphics.rendererClass.roundGraphics) return;

    const alreadyDone = [];

    for (let i = 0; i < gm.graphics.renderUpdates[gameState.rl].length; i++) {
      const update = gm.graphics.renderUpdates[gameState.rl][i];

      if (alreadyDone.includes(update)) continue;
      if (update.done) continue;

      switch (update.action) {
        case 'create': {
          const newBodyGraphics = new gm.graphics.bodyGraphicsClass(gameState, update.id, this.rendererClass.scaleRatio, this.rendererClass.renderer, gm.lobby.mpSession.getGameSettings(), this.rendererClass.playerArray);

          this.rendererClass.roundGraphics.bodyGraphics[update.id] = newBodyGraphics;

          const bodyBehind = this.rendererClass.roundGraphics.bodyGraphics[gameState.physics.bro[gameState.physics.bro.indexOf(update.id) + 1]]?.displayObject;

          const index = this.rendererClass.roundGraphics.displayObject.children.indexOf(bodyBehind) + 1;

          if (bodyBehind && index !== -1) {
            if (newBodyGraphics.jointContainer.children.length > 0) this.rendererClass.roundGraphics.displayObject.addChildAt(newBodyGraphics.jointContainer, index);
            this.rendererClass.roundGraphics.displayObject.addChildAt(newBodyGraphics.displayObject, index);
          } else {
            if (newBodyGraphics.jointContainer.children.length > 0) this.rendererClass.roundGraphics.displayObject.addChildAt(newBodyGraphics.jointContainer, 0);
            this.rendererClass.roundGraphics.displayObject.addChildAt(newBodyGraphics.displayObject, 0);
          }

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
            this.rendererClass.roundGraphics.displayObject.removeChild(this.rendererClass.roundGraphics.bodyGraphics[update.id].jointContainer);
            this.rendererClass.roundGraphics.displayObject.removeChild(this.rendererClass.roundGraphics.bodyGraphics[update.id].displayObject);
            this.rendererClass.roundGraphics.bodyGraphics[update.id]?.destroy();
          }

          const newBodyGraphics = new gm.graphics.bodyGraphicsClass(gameState, update.id, this.rendererClass.scaleRatio, this.rendererClass.renderer, gm.lobby.mpSession.getGameSettings(), this.rendererClass.playerArray);

          this.rendererClass.roundGraphics.bodyGraphics[update.id] = newBodyGraphics;

          // the bro part is getting the id of the body behind the updated body
          const bodyBehind = this.rendererClass.roundGraphics.bodyGraphics[gameState.physics.bro[gameState.physics.bro.indexOf(update.id) + 1]]?.displayObject;

          const index = this.rendererClass.roundGraphics.displayObject.children.indexOf(bodyBehind) + 1;

          if (bodyBehind && index !== -1) {
            if (newBodyGraphics.jointContainer.children.length > 0) this.rendererClass.roundGraphics.displayObject.addChildAt(newBodyGraphics.jointContainer, index);
            this.rendererClass.roundGraphics.displayObject.addChildAt(newBodyGraphics.displayObject, index);
          } else {
            if (newBodyGraphics.jointContainer.children.length > 0) this.rendererClass.roundGraphics.displayObject.addChildAt(newBodyGraphics.jointContainer, 0);
            this.rendererClass.roundGraphics.displayObject.addChildAt(newBodyGraphics.displayObject, 0);
          }

          break;
        }
      }

      gm.graphics.renderUpdates[gameState.rl][i].done = true;
      update.done = true;
      alreadyDone.push(update);
    }
  },
  rendererClass: null,
  bodyGraphicsClass: null,
  cameraContainer: null,
  rendering: false,
  renderUpdates: [],
  additionalDiscGraphics: [],
  additionalWorldGraphics: [],
  additionalScreenGraphics: [],
  availableText: [],
  usedText: [],
  onRender: function() { },
};
