/* eslint-disable camelcase */
/* eslint-disable new-cap */
import * as PIXI from 'pixi.js-legacy';

export default {
  init: function() {
    this.initBonkGraphics();

    // putting it here cause why not
    const mainMenuElements = document.getElementById('mainmenuelements');
    this.inReplay = () => mainMenuElements.style.display !== 'none';
  },
  initBonkGraphics: function() {
    BonkGraphics.prototype.render = (function() {
      BonkGraphics.prototype.renderOLD = BonkGraphics.prototype.render;
      return function(stateA, stateB, weight) {
        const gmExtraA = stateA.gmExtra;
        const gmExtraB = stateB.gmExtra;

        // if no mode loaded, no gmm stuff (except for camera pivot changing)
        if (!gmExtraA || gm.lobby.data?.quick) {
          this.renderOLD(...arguments);
          return this.renderer.render(this.stage);
        };

        // modify offscreen function of discs
        if (!this.discGraphics?.[this.discGraphics?.length - 1]?.__proto__.doOffScreenOLD && this.discGraphics?.[this.discGraphics?.length - 1]?.__proto__.doOffScreen) {
          const discGraphic = this.discGraphics?.[this.discGraphics?.length - 1];
          discGraphic.__proto__.doOffScreenOLD = discGraphic.__proto__.doOffScreen;
          discGraphic.__proto__.doOffScreen = function() {
            this.offScreenContainer.visible = false;
            if (!gm.physics.gameState?.gmExtra.cameraChanged && gm.physics.gameState?.rl > 1) {
              return this.doOffScreenOLD.apply(this, arguments);
            }
            return;
          };
        }

        const settings = gm.lobby.mpSession.getGameSettings();

        /* #region UPDATE BODIES */
        if (this.roundGraphics) {
          const bodyGraphics = this.roundGraphics.bodyGraphics;
          const bodies = stateB.physics.bodies;
          const maxBodiesLength = Math.max(bodyGraphics.length, bodies.length);
          for (let i = 0; i < maxBodiesLength; i++) {
            const myBro = stateA.physics.bro.indexOf(i);

            // body creation
            if (bodies[i] && (!bodyGraphics[i] || bodyGraphics[i].notActuallyBuilt) && myBro !== -1) {
              const newBodyGraphics = new gm.graphics.bodyGraphicsClass(stateB, i, this.scaleRatio, this.renderer, settings, this.playerArray);
              this.roundGraphics.bodyGraphics[i] = newBodyGraphics;

              newBodyGraphics.move(stateA, stateA, 0);

              // the id of the body with my bro minus 1
              const bodyBehind = stateA.physics.bro[myBro + 1];

              if (bodyBehind) {
                const index = this.roundGraphics.displayObject.children.indexOf(bodyGraphics[bodyBehind].displayObject) + 1;

                if (newBodyGraphics.jointContainer.children.length > 0) {
                  this.roundGraphics.displayObject.addChildAt(newBodyGraphics.jointContainer, index);
                }

                this.roundGraphics.displayObject.addChildAt(newBodyGraphics.displayObject, index);
              } else {
                if (newBodyGraphics.jointContainer.children.length > 0) {
                  this.roundGraphics.displayObject.addChild(newBodyGraphics.jointContainer);
                }

                this.roundGraphics.displayObject.addChild(newBodyGraphics.displayObject);
              }
            }

            // body deletion
            if (!bodies[i] && bodyGraphics[i] && !bodyGraphics[i].notActuallyBuilt) {
              const graphic = bodyGraphics[i];
              this.roundGraphics.displayObject.removeChild(graphic.displayObject);
              this.roundGraphics.displayObject.removeChild(graphic.jointContainer);
              graphic.destroy();
              delete bodyGraphics[i];
            }

            // fixture appearance modification & body fixture list changing
            if (!gm.graphics.lastRenderedState?.physics.bodies[i]) continue;
            if (!stateB.physics.bodies[i]) continue;
            if (!bodyGraphics[i]) continue;

            let mustReorder = false;

            const lastBodyFx = gm.graphics.lastRenderedState.physics.bodies[i].fx;
            const bodyFx = bodies[i].fx;
            const shapeGraphics = bodyGraphics[i].shapes;
            const newShapeGraphics = [];

            // fixture appearance modification
            for (let f = 0; f < bodyFx.length; f++) {
              const fixtureA = gm.graphics.lastRenderedState.physics.fixtures[bodyFx[f]];
              const fixtureB = stateB.physics.fixtures[bodyFx[f]];

              if (!fixtureA) continue;

              const shapeIdA = fixtureA.sh;
              const shapeIdB = fixtureB.sh;
              const shapeA = gm.graphics.lastRenderedState.physics.shapes[shapeIdB];
              const shapeB = stateB.physics.shapes[shapeIdB];

              let mustRedraw = false;

              if (shapeIdA !== shapeIdB) mustRedraw = true;

              if (shapeA.type === shapeB.type) {
                switch (shapeB.type) {
                  case 'bx':
                    if (shapeA.w !== shapeB.w ||
                        shapeA.h !== shapeB.h ||
                        shapeA.a !== shapeB.a ||
                        shapeA.c[0] !== shapeB.c[0] ||
                        shapeA.c[1] !== shapeB.c[1] ||
                        fixtureA.f !== fixtureB.f ||
                        fixtureA.sk !== fixtureB.sk) mustRedraw = true;
                    break;
                  case 'ci':
                    if (shapeA.r !== shapeB.r ||
                        shapeA.c[0] !== shapeB.c[0] ||
                        shapeA.c[1] !== shapeB.c[1] ||
                        fixtureA.f !== fixtureB.f ||
                        fixtureA.sk !== fixtureB.sk) mustRedraw = true;
                    break;
                  case 'po':
                    if (shapeA.c[0] !== shapeB.c[0] ||
                      shapeA.c[1] !== shapeB.c[1] ||
                      fixtureA.f !== fixtureB.f) mustRedraw = true;

                    const maxVertLength = Math.max(shapeA.v.length, shapeB.v.length);
                    for (let v = 0; v < maxVertLength; v++) {
                      if (shapeA.v[v][0] !== shapeB.v[v][0] ||
                          shapeA.v[v][1] !== shapeB.v[v][1]) {
                        mustRedraw = true;
                        break;
                      };
                    }
                    break;
                }
              } else {
                mustRedraw = true;
              }

              let isCapzoneA = false;
              let isCapzoneB = false;
              const tea = settings.tea;
              for (let c = 0; c < gm.graphics.lastRenderedState.capZones.length; c++) {
                if (gm.graphics.lastRenderedState.capZones[c] && gm.graphics.lastRenderedState.capZones[c].i == bodyFx[f]) {
                  isCapzoneA = true;
                  break;
                }
              }
              for (let c = 0; c < stateB.capZones.length; c++) {
                if (stateB.capZones[c] && stateB.capZones[c].i == bodyFx[f]) {
                  isCapzoneB = true;
                  break;
                }
              }

              if (isCapzoneA !== isCapzoneB) mustRedraw = true;

              if (!mustRedraw) continue;

              mustReorder = true;

              shapeGraphics[shapeIdA]?.destroy();
              shapeGraphics[shapeIdA] = null;
              shapeGraphics[shapeIdB] = new gm.graphics.shapeGraphicsClass(stateB, shapeIdB, isCapzoneB, this.scaleRatio, this.renderer, tea, this.playerArray, this.isReplay);
            }

            // body fixture list changing
            if (JSON.stringify(lastBodyFx) !== JSON.stringify(bodyFx)) {
              mustReorder = true;

              for (let f = 0; f < bodyFx.length; f++) {
                const shapeId = stateB.physics.fixtures[bodyFx[f]].sh;

                if (shapeGraphics[shapeId]) {
                  newShapeGraphics[shapeId] = shapeGraphics[shapeId];
                  shapeGraphics[shapeId] = null;
                } else {
                  let isCapzone = false;
                  const tea = settings.tea;
                  for (let c = 0; c < stateB.capZones.length; c++) {
                    if (stateB.capZones[c] && stateB.capZones[c].i == bodyFx[f]) {
                      isCapzone = true;
                      break;
                    }
                  }
                  newShapeGraphics[shapeId] = new gm.graphics.shapeGraphicsClass(stateB, shapeId, isCapzone, this.scaleRatio, this.renderer, tea, this.playerArray, this.isReplay);
                }
              }

              bodyGraphics[i].shapes = newShapeGraphics;
            }

            if (!mustReorder) continue;

            // remove all children
            while (bodyGraphics[i].displayObject.children.length > 0) {
              bodyGraphics[i].displayObject.removeChild(bodyGraphics[i].displayObject.children[bodyGraphics[i].displayObject.children.length-1]);
            }
            while (bodyGraphics[i].shadowContainer.children.length > 0) {
              bodyGraphics[i].shadowContainer.removeChild(bodyGraphics[i].shadowContainer.children[bodyGraphics[i].shadowContainer.children.length-1]);
            }

            // re-add the children
            bodyGraphics[i].displayObject.addChild(bodyGraphics[i].shadowContainer);
            for (let f = 0; f < bodyFx.length; f++) {
              const shapeId = stateB.physics.fixtures[bodyFx[f]].sh;

              if (bodyGraphics[i].shapes[shapeId].shadowTexture) {
                bodyGraphics[i].shadowContainer.addChild(bodyGraphics[i].shapes[shapeId].shadowTexture);
              } else if (bodyGraphics[i].shapes[shapeId].shadow) {
                bodyGraphics[i].shadowContainer.addChild(bodyGraphics[i].shapes[shapeId].shadow);
              };

              bodyGraphics[i].displayObject.addChild(bodyGraphics[i].shapes[shapeId].graphic);
            }
          }
        }
        /* #endregion UPDATE BODIES */

        let camera = gm.graphics.cameraContainer;

        // camera movement
        if (camera && !camera._destroyed && gm.lobby.networkEngine && gmExtraA?.cameras?.[gm.lobby.networkEngine.getLSID()] && gmExtraB?.cameras?.[gm.lobby.networkEngine.getLSID()]) {
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

            camera.pivot.x = (1 - arguments[2]) * cameraObjA.xpos * scaleMultiplier + arguments[2] * cameraObjB.xpos * scaleMultiplier;
            camera.pivot.y = (1 - arguments[2]) * cameraObjA.ypos * scaleMultiplier + arguments[2] * cameraObjB.ypos * scaleMultiplier;
            camera.rotation = Math.atan2(lerpedAnglePoint[0], lerpedAnglePoint[1]);
            camera.scale.x = (1 - arguments[2]) * cameraObjA.xscal + arguments[2] * cameraObjB.xscal;
            camera.scale.y = (1 - arguments[2]) * cameraObjA.yscal + arguments[2] * cameraObjB.yscal;
            camera.skew.x = (1 - arguments[2]) * cameraObjA.xskew + arguments[2] * cameraObjB.xskew;
            camera.skew.y = (1 - arguments[2]) * cameraObjA.yskew + arguments[2] * cameraObjB.yskew;
          } else {
            camera.pivot.x = cameraObjB.xpos * scaleMultiplier;
            camera.pivot.y = cameraObjB.ypos * scaleMultiplier;
            camera.angle = cameraObjB.angle;
            camera.scale.x = cameraObjB.xscal;
            camera.scale.y = cameraObjB.yscal;
            camera.skew.x = cameraObjB.xskew;
            camera.skew.y = cameraObjB.yskew;
          }

          window.gmReplaceAccessors.addToStereo = (-camera.pivot.x + 730 * this.scaleRatio) / (365 * this.scaleRatio) - 1;
          window.gmReplaceAccessors.multToStereo = camera.scale.x;
        }

        // remove arrows from camera container
        for (let i = 0; i < this.arrowGraphics.length; i++) {
          if (this.arrowGraphics[i] && camera.children.includes(this.arrowGraphics[i].graphic) &&
            ((!arguments[0].projectiles[i] || !arguments[1].projectiles[i] || arguments[1].projectiles[i].did != this.arrowGraphics[i].ownerID))) {
            camera.removeChild(this.arrowGraphics[i].graphic);
          }
        }

        const result = this.renderOLD.apply(this, arguments);

        if (!gm.graphics.bodyGraphicsClass) gm.graphics.bodyGraphicsClass = this.roundGraphics.bodyGraphics[0]?.constructor;

        gm.graphics.rendererClass = this;

        gm.graphics.rendering = true;

        // camera container creation
        if (!camera || camera._destroyed || !this.blurContainer.children.includes(camera)) {
          gm.graphics.cameraContainer = new PIXI.Container();
          camera = gm.graphics.cameraContainer;

          this.blurContainer.addChild(camera);

          camera.addChild(this.environmentContainer);
          camera.addChild(this.discContainer);

          camera.pivot.x = 365 * this.scaleRatio;
          camera.pivot.y = 250 * this.scaleRatio;
          camera.sortableChildren = true;
        }

        if (!camera.children.includes(this.particleManager.container)) camera.addChild(this.particleManager.container);

        if (this.blurContainer && (this.blurContainer.pivot.x != this.domLastWidth / 2 || this.blurContainer.pivot.y != this.domLastHeight / 2)) {
          this.blurContainer.pivot.x = -365 * this.scaleRatio;
          this.blurContainer.pivot.y = -250 * this.scaleRatio;
        }

        // move arrows to camera container
        for (let i = 0; i < this.arrowGraphics.length; i++) {
          if (this.arrowGraphics[i] && !camera.children.includes(this.arrowGraphics[i].graphic)) {
            camera.addChild(this.arrowGraphics[i].graphic);
          }
        }

        // world and disc drawing objects add to stages
        for (let i = 0; i < this.discGraphics.length; i++) {
          if (arguments[0].discs[i] && this.discGraphics[i] && gm.graphics.additionalDiscGraphics[i] && !this.discGraphics[i].container.children.includes(gm.graphics.additionalDiscGraphics[i])) {
            gm.graphics.additionalDiscGraphics[i].scale.x = this.scaleRatio;
            gm.graphics.additionalDiscGraphics[i].scale.y = this.scaleRatio;
            this.discGraphics[i].container.addChild(gm.graphics.additionalDiscGraphics[i]);
          }
          if (arguments[0].discs[i] && this.blurContainer && gm.graphics.additionalWorldGraphics[i] && !camera.children.includes(gm.graphics.additionalWorldGraphics[i])) {
            gm.graphics.additionalWorldGraphics[i].scale.x = this.scaleRatio;
            gm.graphics.additionalWorldGraphics[i].scale.y = this.scaleRatio;
            camera.addChild(gm.graphics.additionalWorldGraphics[i]);
          }
          if (arguments[0].discs[i] && this.blurContainer && gm.graphics.additionalScreenGraphics[i] && !this.blurContainer.children.includes(gm.graphics.additionalScreenGraphics[i])) {
            gm.graphics.additionalScreenGraphics[i].scale.x = this.scaleRatio;
            gm.graphics.additionalScreenGraphics[i].scale.y = this.scaleRatio;
            gm.graphics.additionalScreenGraphics[i].pivot.x = 365;
            gm.graphics.additionalScreenGraphics[i].pivot.y = 250;
            this.blurContainer.addChild(gm.graphics.additionalScreenGraphics[i]);
          }
        }

        gm.graphics.rendering = false;

        // save graphics state for later use
        gm.graphics.lastRenderedState = stateB;

        // render
        this.renderer.render(this.stage);

        return result;
      };
    })();
    BonkGraphics.prototype.build = (function() {
      BonkGraphics.prototype.buildOLD = BonkGraphics.prototype.build;
      return function() {
        gm.graphics.rendererClass = this;

        const emptyState = {ms: {re: false, nc: true, pq: 0, gd: 0, fl: false}, mm: {a: '', n: '', dbv: 1, dbid: 0, authid: -1, date: '', rxid: 0, rxn: '', rxa: '', rxdb: 1, cr: [], pub: false, mo: ''}, shk: {x: 0, y: 0}, discs: [{x: 0, y: 0, xv: 0, yv: 0, a: 0, av: 0, a1a: 0, team: 1, a1: false, a2: false, ni: false, sx: 0, sy: 0, sxv: 0, syv: 0, ds: 0, da: 0, lhid: -1, lht: 0, swing: false}], capZones: [], seed: 0, ftu: -1, rc: 0, rl: 1, sts: null, physics: {shapes: [{type: 'bx', w: 1, h: 1, c: [0, 0], a: 0, sk: false}], fixtures: [{sh: 0, n: '', fr: null, fp: null, re: null, de: null, f: 0, d: false, np: false, ng: false}], bodies: [{type: 's', p: [0, 0], a: 0, av: 0, lv: [0, 0], ld: 0, ad: 0, fr: false, bu: false, fz: {on: false}, fx: [0], fric: 0, fricp: false, de: 0, re: 0, f_c: 1, f_p: true, f_1: true, f_2: true, f_3: true, f_4: true, cf: {x: 0, y: 0, w: true, ct: 0}, ni: false}], joints: [], bro: [0], ppm: 12}, scores: [0], lscr: -1, fte: -1, discDeaths: [], players: [{id: 0, team: 1}], projectiles: [{x: 0, y: 0, xv: 0, yv: 0, a: 0, av: 0, did: 0, fte: 10}]};
        const emptySettings = {map: {v: 0, s: {re: false, nc: false, pq: 0, gd: 0, fl: false}, physics: {shapes: [{type: 'bx', w: 1, h: 1, c: [0, 0], a: 0, sk: false}], fixtures: [{sh: 0, n: '', fr: null, fp: null, re: null, de: null, f: 0, d: false, np: false, ng: false}], bodies: [{type: 's', p: [0, 0], a: 0, av: 0, lv: [0, 0], ld: 0, ad: 0, fr: false, bu: false, fz: {on: false}, fx: [0], fric: 0, fricp: false, de: 0, re: 0, f_c: 1, f_p: true, f_1: true, f_2: true, f_3: true, f_4: true, cf: {x: 0, y: 0, w: true, ct: 0}, ni: false}], joints: [], bro: [0], ppm: 12}, spawns: [], capZones: [], m: {a: '', n: '', dbv: 1, dbid: 0, authid: -1, date: '', rxid: 0, rxn: '', rxa: '', rxdb: 1, cr: [], pub: false, mo: '', vu: 0, vd: 0}}, gt: 2, wl: 3, q: false, tl: false, tea: false, ga: 'b', mo: 'b', bal: []};
        this.buildOLD.apply(this, [
          emptyState,
          emptySettings,
        ]);
        this.render.apply(this, [emptyState, emptyState, 0, emptySettings, [], 0]);
        if (!this.discGraphics?.[0]?.__proto__.doOffScreenOLD && this.discGraphics?.[0]?.__proto__.doOffScreen) {
          const discGraphic = this.discGraphics[0];
          discGraphic.__proto__.doOffScreenOLD = discGraphic.__proto__.doOffScreen;
          discGraphic.__proto__.doOffScreen = function() {
            this.offScreenContainer.visible = false;
            if (gm.physics.gameState?.gmExtra?.cameraChanged || gm.physics.gameState?.rl <= 1) return;
            return this.doOffScreenOLD.apply(this, arguments);
          };
          discGraphic.__proto__.moveOLD = discGraphic.__proto__.move;
          discGraphic.__proto__.move = function(a, b) {
            if (!a.discs[this.playerID]) arguments[0] = b;

            this.moveOLD(...arguments);
          };

          gm.graphics.bodyGraphicsClass = this.roundGraphics.bodyGraphics[0].constructor;
          gm.graphics.shapeGraphicsClass = this.roundGraphics.bodyGraphics[0].shapes[0].constructor;
          gm.graphics.bodyGraphicsClass.prototype.buildOLD = gm.graphics.bodyGraphicsClass.prototype.build;
          gm.graphics.bodyGraphicsClass.prototype.build = function(state) {
            if (!state.physics.bodies[this.bodyID]) {
              this.notActuallyBuilt = true;
              return;
            }
            gm.graphics.bodyGraphicsClass.prototype.buildOLD.apply(this, arguments);
          };
          gm.graphics.bodyGraphicsClass.prototype.moveOLD = gm.graphics.bodyGraphicsClass.prototype.move;
          gm.graphics.bodyGraphicsClass.prototype.move = function(stateA, stateB) {
            if (this.notActuallyBuilt) return;
            if (!stateA.physics.bodies[this.bodyID]) return;
            if (!stateB.physics.bodies[this.bodyID]) return;

            gm.graphics.bodyGraphicsClass.prototype.moveOLD.apply(this, arguments);
          };
          gm.graphics.shapeGraphicsClass.prototype.doShrinkOLD = gm.graphics.shapeGraphicsClass.prototype.doShrink;
          gm.graphics.shapeGraphicsClass.prototype.doShrink = function(stateA, stateB) {
            if (!stateA.physics.shapes[this.shapeID]) return;
            if (!stateB.physics.shapes[this.shapeID]) return;

            gm.graphics.shapeGraphicsClass.prototype.doShrinkOLD.apply(this, arguments);
          };
        }
        this.destroyChildren();

        const result = this.buildOLD.apply(this, arguments);
        gm.blockly.varInspector.innerHTML = '';
        return result;
      };
    })();
    BonkGraphics.prototype.destroy = (function() {
      BonkGraphics.prototype.destroyOLD = BonkGraphics.prototype.destroy;
      return function() {
        gm.blockly.varInspector.innerHTML = '';

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
    if (gameState.fte == 0) gm.blockly.varInspector.innerHTML = '';
    if (!gm.graphics.rendererClass) return;

    const shouldShowVarInsp = gm.blockly.savedSettings?.getAttribute('show_var_insp') === 'true' &&// mode has var inspector enabled
      gm.graphics.rendererClass.domContainer.style.visibility !== 'hidden';// we're in-game (to prevent it from popping up in the editor)

    if (shouldShowVarInsp && gm.blockly.varInspectorContainer.style.display !== 'block') {
      gm.blockly.varInspectorContainer.style.display = 'block';
    } else if (!shouldShowVarInsp && gm.blockly.varInspectorContainer.style.display !== 'none') {
      gm.blockly.varInspectorContainer.style.display = 'none';
    }

    if (gm.graphics.rendererClass?.playerArray && shouldShowVarInsp) gm.blockly.updateVarInspector(gameState);

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

    if (gameState.rl === 1) gm.blockly.funcs.clearGraphics();
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
