/* eslint-disable no-invalid-this */
/* eslint-disable require-jsdoc */
/* eslint-disable camelcase */
/* eslint-disable new-cap */
// import * as PIXI from 'pixi.js-legacy';

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
      const renderFunction = function(stateA, stateB, weight) {
        // don't do anything if crashed
        if (gm.state.crashed) return;

        // if no mode loaded, no gmm stuff
        if (!stateA.gmExtra || gm.lobby.data.quick) {
          // reset camera
          const camera = gm.graphics.camera;
          if (camera) {
            camera.x = 0;
            camera.y = 0;
            camera.pivot.x = 0;
            camera.pivot.y = 0;
            camera.angle = 0;
            camera.scale.x = 1;
            camera.scale.y = 1;
          }

          this.renderOLD(...arguments);
          return this.renderer.render(this.stage);
        };

        // graphics is used a lot
        const settings = gm.lobby.mpSession.getGameSettings();

        /* #region UPDATE BODIES */
        if (!this.gmCurrentPPM) this.gmCurrentPPM = stateB.physics.ppm;
        if (this.roundGraphics && stateB.physics.ppm === this.gmCurrentPPM) {
          const bodyGraphics = this.roundGraphics.bodyGraphics;
          const bodies = stateB.physics.bodies;
          const maxBodiesLength = Math.max(bodyGraphics.length, bodies.length);
          const roundGraphicsContainer = this.roundGraphics.displayObject;
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
                const index = roundGraphicsContainer.children.indexOf(bodyGraphics[bodyBehind].displayObject) + 1;

                roundGraphicsContainer.addChildAt(newBodyGraphics.jointContainer, index);
                roundGraphicsContainer.addChildAt(newBodyGraphics.displayObject, index);
              } else {
                roundGraphicsContainer.addChild(newBodyGraphics.jointContainer);
                roundGraphicsContainer.addChild(newBodyGraphics.displayObject);
              }
            }

            // body deletion
            if (!bodies[i] && bodyGraphics[i] && !bodyGraphics[i].notActuallyBuilt) {
              const graphic = bodyGraphics[i];
              roundGraphicsContainer.removeChild(graphic.displayObject);
              roundGraphicsContainer.removeChild(graphic.jointContainer);
              graphic.destroy();
              delete bodyGraphics[i];
            }

            // add joint container to round graphics
            if (bodyGraphics[i] && !roundGraphicsContainer.children.includes(bodyGraphics[i].jointContainer)) {
              const bodyBehind = stateA.physics.bro[myBro + 1];

              if (bodyBehind) {
                const index = roundGraphicsContainer.children.indexOf(bodyGraphics[bodyBehind].displayObject);

                roundGraphicsContainer.addChildAt(bodyGraphics[i].jointContainer, index);
              } else {
                roundGraphicsContainer.addChild(bodyGraphics[i].jointContainer);
              }
            }

            if (!gm.graphics.lastRenderedState?.physics.bodies[i]) continue;
            if (!stateB.physics.bodies[i]) continue;
            if (!bodyGraphics[i]) continue;

            // joint line modification
            const maxJointsLength = Math.max(stateA.physics.joints.length, stateB.physics.joints.length);
            for (let j = 0; j < maxJointsLength; j++) {
              const joint = stateB.physics.joints[j];
              let line = bodyGraphics[i].otherLines[j];

              if ((line && (joint?.ba !== i || !joint?.d.dl)) ||
                  (line && line.stateObj?.type !== joint.type)) {
                bodyGraphics[i].jointContainer.removeChild(line);
                line.destroy();
                line = null;
                delete bodyGraphics[i].otherLines[j];
              }

              if (!line && joint && joint.ba === i && joint.d.dl && (joint.type == 'd' || joint.type == 'lpj')) {
                line = new PIXI.Graphics();
                bodyGraphics[i].jointContainer.addChild(line);
                bodyGraphics[i].otherLines[j] = line;
              }

              if (line && joint && joint.type == 'lpj' && (
                line.stateObj?.pax !== joint.pax ||
                line.stateObj?.pay !== joint.pay ||
                line.stateObj?.pa !== joint.pa ||
                line.stateObj?.plen !== joint.plen
              )) {
                const scaleRatio = stateB.physics.ppm * this.scaleRatio;

                line.clear();
                line.lineStyle(1, 0xcccccc, 0.5);
                line.moveTo(joint.plen * scaleRatio, 0);
                line.lineTo(-joint.plen * scaleRatio, 0);
                line.rotation = joint.pa;
                line.x = joint.pax * scaleRatio;
                line.y = joint.pay * scaleRatio;
              }

              if (line) line.stateObj = joint;
            }

            // fixture appearance modification & body fixture list changing
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
        } else if (stateB.physics.ppm !== this.gmCurrentPPM) {
          // and this is why you shouldn't change ppm often
          window.BonkUtils.resetRenderer = true;
          this.gmCurrentPPM = stateB.physics.ppm;
        }
        /* #endregion UPDATE BODIES */

        this.renderOLD(...arguments);

        /* #region UPDATE CAMERA */
        const cameraObjA = stateA.gmExtra.camera;
        const cameraObjB = stateB.gmExtra.camera;
        const camera = gm.graphics.camera;
        const scaleMultiplier = stateB.physics.ppm * this.scaleRatio;

        if (cameraObjB.noLerp) {
          camera.pivot.x = cameraObjB.pos[0] * scaleMultiplier;
          camera.pivot.y = cameraObjB.pos[1] * scaleMultiplier;
          camera.angle = cameraObjB.angle;
          camera.scale.x = cameraObjB.scale[0];
          camera.scale.y = cameraObjB.scale[1];
        } else {
          const anglePointA = [Math.sin(cameraObjA.angle * (Math.PI / 180)), Math.cos(cameraObjA.angle * (Math.PI / 180))];
          const anglePointB = [Math.sin(cameraObjB.angle * (Math.PI / 180)), Math.cos(cameraObjB.angle * (Math.PI / 180))];
          const lerpedAnglePoint = [
            (1 - arguments[2]) * anglePointA[0] + arguments[2] * anglePointB[0],
            (1 - arguments[2]) * anglePointA[1] + arguments[2] * anglePointB[1],
          ];

          camera.pivot.x = (1 - arguments[2]) * cameraObjA.pos[0] * scaleMultiplier + arguments[2] * cameraObjB.pos[0] * scaleMultiplier;
          camera.pivot.y = (1 - arguments[2]) * cameraObjA.pos[1] * scaleMultiplier + arguments[2] * cameraObjB.pos[1] * scaleMultiplier;
          camera.rotation = Math.atan2(lerpedAnglePoint[0], lerpedAnglePoint[1]);
          camera.scale.x = (1 - arguments[2]) * cameraObjA.scale[0] + arguments[2] * cameraObjB.scale[0];
          camera.scale.y = (1 - arguments[2]) * cameraObjA.scale[1] + arguments[2] * cameraObjB.scale[1];
        }

        camera.x = 365 * this.scaleRatio;
        camera.y = 250 * this.scaleRatio;

        camera.pivot.x += this.blurContainer.x;
        camera.pivot.y += this.blurContainer.y;

        this.blurContainer.x = 0;
        this.blurContainer.y = 0;

        window.gmReplaceAccessors.addToStereo = ((-camera.pivot.x + 730 * this.scaleRatio) * camera.scale.x) / (365 * this.scaleRatio) - 1;
        /* #endregion UPDATE CAMERA */

        /* #region UPDATE DRAWINGS */
        gm.graphics.updateDrawings(stateA, stateB, weight);
        /* #endregion UPDATE DRAWINGS */

        // save graphics state for later use
        gm.graphics.lastRenderedState = stateB;

        // render
        this.renderer.render(this.stage);
      };
      return function() {
        if (gm.graphics.inReplay()) {
          return renderFunction.apply(this, arguments);
        }

        try {
          return renderFunction.apply(this, arguments);
        } catch (e) {
          if (gm.state.crashed) return;
          gm.state.crashed = true;
          setTimeout(() => gm.state.crashAbort(e), 500); // gotta make sure we're out of the step function!?
          return;
        }
      };
    })();
    BonkGraphics.prototype.build = (function() {
      BonkGraphics.prototype.buildOLD = BonkGraphics.prototype.build;
      const buildFunction = function() {
        if (!gm.graphics.camera) gm.graphics.camera = new PIXI.Container();

        gm.graphics.rendererClass = this;

        /* #region CLASS MODIFIERS */
        const emptyState = {ms: {re: false, nc: true, pq: 0, gd: 0, fl: false}, mm: {a: '', n: '', dbv: 1, dbid: 0, authid: -1, date: '', rxid: 0, rxn: '', rxa: '', rxdb: 1, cr: [], pub: false, mo: ''}, shk: {x: 0, y: 0}, discs: [{x: 0, y: 0, xv: 0, yv: 0, a: 0, av: 0, a1a: 0, team: 1, a1: false, a2: false, ni: false, sx: 0, sy: 0, sxv: 0, syv: 0, ds: 0, da: 0, lhid: -1, lht: 0, swing: false}], capZones: [], seed: 0, ftu: -1, rc: 0, rl: 1, sts: null, physics: {shapes: [{type: 'bx', w: 1, h: 1, c: [0, 0], a: 0, sk: false}], fixtures: [{sh: 0, n: '', fr: null, fp: null, re: null, de: null, f: 0, d: false, np: false, ng: false}], bodies: [{type: 's', p: [0, 0], a: 0, av: 0, lv: [0, 0], ld: 0, ad: 0, fr: false, bu: false, fx: [0], fric: 0, fricp: false, de: 0, re: 0, f_c: 1, f_p: true, f_1: true, f_2: true, f_3: true, f_4: true, cf: {x: 0, y: 0, w: true, ct: 0}, ni: false}], joints: [], bro: [0], ppm: 12}, scores: [0], lscr: -1, fte: -1, discDeaths: [], players: [{id: 0, team: 1}], projectiles: [{x: 0, y: 0, xv: 0, yv: 0, a: 0, av: 0, did: 0, fte: 10}]};
        const emptySettings = {map: {v: 0, s: {re: false, nc: false, pq: 0, gd: 0, fl: false}, physics: {shapes: [{type: 'bx', w: 1, h: 1, c: [0, 0], a: 0, sk: false}], fixtures: [{sh: 0, n: '', fr: null, fp: null, re: null, de: null, f: 0, d: false, np: false, ng: false}], bodies: [{type: 's', p: [0, 0], a: 0, av: 0, lv: [0, 0], ld: 0, ad: 0, fr: false, bu: false, fx: [0], fric: 0, fricp: false, de: 0, re: 0, f_c: 1, f_p: true, f_1: true, f_2: true, f_3: true, f_4: true, cf: {x: 0, y: 0, w: true, ct: 0}, ni: false}], joints: [], bro: [0], ppm: 12}, spawns: [], capZones: [], m: {a: '', n: '', dbv: 1, dbid: 0, authid: -1, date: '', rxid: 0, rxn: '', rxa: '', rxdb: 1, cr: [], pub: false, mo: '', vu: 0, vd: 0}}, gt: 2, wl: 3, q: false, tl: false, tea: false, ga: 'b', mo: 'b', bal: []};
        this.buildOLD.apply(this, [
          emptyState,
          emptySettings,
        ]);
        this.render.apply(this, [emptyState, emptyState, 0, emptySettings, [], 0]);
        if (!this.discGraphics?.[this.discGraphics?.length - 1]?.__proto__.doOffScreenOLD && this.discGraphics?.[this.discGraphics?.length - 1]?.__proto__.doOffScreen) {
          const discGraphic = this.discGraphics[0];
          discGraphic.__proto__.doOffScreenOLD = discGraphic.__proto__.doOffScreen;
          discGraphic.__proto__.doOffScreen = function() {
            this.offScreenContainer.visible = false;
            if (gm.state.gameState.gmExtra?.cameraChanged || gm.state.gameState?.rl <= 1) return;
            return this.doOffScreenOLD.apply(this, arguments);
          };
          discGraphic.__proto__.moveOLD = discGraphic.__proto__.move;
          discGraphic.__proto__.move = function(a, b) {
            if (!a.discs[this.playerID]) arguments[0] = b;

            this.moveOLD(...arguments);

            const invis = b.discs[this.playerID].visible ?? true;
            this.playerGraphic.visible = invis;
            this.nameText.visible = invis;
            this.outline.visible = invis;
            if (this.shadow) this.shadow.visible = invis;
            if (this.arrowAimContainer) this.arrowAimContainer.visible = this.arrowAimContainer.visible && invis;
            if (this.specialGraphic) this.specialGraphic.visible = invis;
            if (this.specialRing) this.specialRing.visible = invis;
            if (this.teamOutline) this.teamOutline.visible = invis;
          };

          const arrowGraphic = this.arrowGraphics[0];
          arrowGraphic.__proto__.moveOLD = arrowGraphic.__proto__.move;
          arrowGraphic.__proto__.move = function(a, b) {
            if (b.projectiles[this.arrowID].ni) arguments[0] = b;

            this.graphic.alpha = b.projectiles[this.arrowID].visible ?? true ? 1 : 0;

            this.moveOLD(...arguments);
          };

          gm.graphics.bodyGraphicsClass = gm.graphics.rendererClass.roundGraphics.bodyGraphics[0].constructor;
          gm.graphics.shapeGraphicsClass = gm.graphics.rendererClass.roundGraphics.bodyGraphics[0].shapes[0].constructor;
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

            if (stateB.physics.bodies[this.bodyID].ni) arguments[0] = stateB;

            const invis = stateB.physics.bodies[this.bodyID].visible ?? true;
            if (this.gmInvisCheck !== invis) {
              if (this.shadowContainer) this.shadowContainer.visible = invis;
              for (let i = 0; i < this.shapes.length; i++) {
                if (!this.shapes[i]?.graphicTexture) continue;
                this.shapes[i].graphicTexture.visible = invis;
              }

              this.gmInvisCheck = invis;
            }

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

        /* #endregion CLASS MODIFIERS */

        const result = this.buildOLD.apply(this, arguments);

        /* #region CAMERA CONTAINER HANDLING */
        if (this.blurContainer.gmModified) {
          const childAmount = this.blurContainer.children.length;

          for (let i = 0; i < childAmount; i++) {
            const child = this.blurContainer.children[this.blurContainer.children.length-1];

            if (child.isGMMDrawing) continue;
            if (child == gm.graphics.camera) continue;

            this.blurContainer.removeChildOLD(child);
            gm.graphics.camera.addChild(child);
          }

          return result;
        }

        while (gm.graphics.camera?.children.length > 0) {
          const child = gm.graphics.camera?.children[0];

          gm.graphics.camera.removeChild(child);
        }

        this.blurContainer.addChildOLD = this.blurContainer.addChild;
        this.blurContainer.addChild = function() {
          gm.graphics.camera.addChild(...arguments);
        };
        this.blurContainer.removeChildOLD = this.blurContainer.removeChild;
        this.blurContainer.removeChild = function() {
          gm.graphics.camera.removeChild(...arguments);
        };

        while (this.blurContainer.children.length > 0) {
          const child = this.blurContainer.children[0];

          this.blurContainer.removeChildOLD(child);
          gm.graphics.camera.addChild(child);
        }
        this.blurContainer.addChildOLD(gm.graphics.camera);

        this.blurContainer.gmModified = true;
        /* #endregion CAMERA CONTAINER HANDLING */

        return result;
      };
      return function() {
        if (gm.graphics.inReplay()) {
          return buildFunction.apply(this, arguments);
        }

        try {
          return buildFunction.apply(this, arguments);
        } catch (e) {
          if (gm.state.crashed) return;
          gm.state.crashed = true;
          setTimeout(() => gm.state.crashAbort(e), 500); // gotta make sure we're out of the step function!?
          return;
        }
      };
    })();
    BonkGraphics.prototype.resizeRenderer = (function() {
      BonkGraphics.prototype.resizeRendererOLD = BonkGraphics.prototype.resizeRenderer;
      return function() {
        gm.graphics.forceDrawingUpdate = true;
        return this.resizeRendererOLD(...arguments);
      };
    })();
    BonkGraphics.prototype.destroy = (function() {
      BonkGraphics.prototype.destroyOLD = BonkGraphics.prototype.destroy;
      return function() {
        document.getElementById('gm_logbox').innerHTML = '';
        document.getElementById('gm_logbox').style.visibility = 'hidden';

        gm.audio.stopAllSounds();

        gm.state.crashed = false;

        for (let i = 0; true; i++) {
          const id = 'BAKED_' + i;

          if (!gm.graphics.imageTextures[id]) break;

          gm.graphics.imageTextures[id].destroy();
          delete gm.graphics.imageTextures[id];
        }

        for (let i = 0; i < gm.graphics.drawings.length; i++) {
          gm.graphics.drawings[i]?.destroy();
        }
        gm.graphics.drawings = [];

        while (gm.graphics.camera?.children.length > 0) {
          const child = gm.graphics.camera?.children[0];

          gm.graphics.camera.removeChild(child);
        }

        return this.destroyOLD(...arguments);
      };
    })();
  },
  updateDrawings: function(stateA, stateB, weight) {
    const maxDrawingsLength = Math.max(stateB.gmExtra.drawings.length, gm.graphics.drawings.length);

    const renderer = gm.graphics.rendererClass;

    for (let i = 0; i < maxDrawingsLength; i++) {
      const drawingA = stateA.gmExtra.drawings[i];
      const drawingB = stateB.gmExtra.drawings[i];
      const drawingList = gm.graphics.drawings;

      // deletion of drawings that suddenly disappear
      if (!drawingB && drawingList[i]) {
        drawingList[i].destroy();
        drawingList[i] = null;
      }

      // deletion of drawings that suddenly get destroyed
      if (drawingB && drawingList[i]?._destroyed) {
        drawingList[i] = null;
      }

      // new shape creation
      if (drawingB && !drawingList[i]) {
        drawingList[i] = new Drawing();

        if (drawingB.isBehind) {
          // come on, who's going to make that much drawings
          drawingList[i].displayObject.zIndex = -10000000 + i;
        } else {
          drawingList[i].displayObject.zIndex = 10000000 + i;
        }

        drawingList[i].attachTo = drawingB.attachTo;
        drawingList[i].attachId = drawingB.attachId;

        switch (drawingB.attachTo) {
          case 'screen':
            // if it wasn't sortable, now it is
            renderer.blurContainer.sortableChildren = true;
            renderer.blurContainer.addChildOLD(drawingList[i].displayObject);
            break;
          case 'world':
            gm.graphics.camera.sortableChildren = true;
            gm.graphics.camera.addChild(drawingList[i].displayObject);
            break;
          case 'disc':
            const disc = renderer.discGraphics[drawingB.attachId];
            if (!disc) break;
            disc.container.sortableChildren = true;
            disc.container.addChild(drawingList[i].displayObject);
            break;
          case 'body':
            const body = renderer.roundGraphics.bodyGraphics[drawingB.attachId];
            if (!body) break;
            body.displayObject.sortableChildren = true;
            body.displayObject.addChild(drawingList[i].displayObject);
            break;
        }
        drawingList[i].update(drawingB, drawingB, 1, stateB.physics.ppm * renderer.scaleRatio, true);
      }

      // drawing updating
      if (drawingA && drawingB && drawingList[i]) {
        if (drawingList[i].attachTo != drawingB.attachTo ||
            drawingList[i].attachId != drawingB.attachId ||
           (!drawingList[i].displayObject.parent?.parent?.parent && drawingList[i].attachTo !== 'screen') ||
           (!drawingList[i].displayObject.parent?.parent && drawingList[i].attachTo === 'screen')) {
          drawingList[i].displayObject.parent?.removeChild(drawingList[i]);
          drawingList[i].attachTo = drawingB.attachTo;
          drawingList[i].attachId = drawingB.attachId;

          switch (drawingB.attachTo) {
            case 'screen':
              // if it wasn't sortable, now it is
              renderer.blurContainer.sortableChildren = true;
              renderer.blurContainer.addChildOLD(drawingList[i].displayObject);
              break;
            case 'world':
              gm.graphics.camera.sortableChildren = true;
              gm.graphics.camera.addChild(drawingList[i].displayObject);
              break;
            case 'disc':
              const disc = renderer.discGraphics[drawingB.attachId];
              if (!disc) break;
              disc.container.sortableChildren = true;
              disc.container.addChild(drawingList[i].displayObject);
              break;
            case 'body':
              const body = renderer.roundGraphics.bodyGraphics[drawingB.attachId];
              if (!body) break;
              body.displayObject.sortableChildren = true;
              body.displayObject.addChild(drawingList[i].displayObject);
              break;
          }
        }

        drawingList[i].update(drawingA, drawingB, weight, stateB.physics.ppm * renderer.scaleRatio, gm.graphics.forceDrawingUpdate);
      }
    }

    gm.graphics.forceDrawingUpdate = false;
  },
  preloadImages: function(imageList) {
    // new texture creation and image ids collection
    const imageIds = [];

    for (let i = 0; i < imageList.length; i++) {
      const image = imageList[i];
      if (!image) continue;

      if (this.imageTextures[image.id]?.hash !== image.dataHash || this.imageTextures[image.id].gmUseNearest !== image.useNearest) {
        this.imageTextures[image.id]?.destroy();
        this.imageTextures[image.id] = new PIXI.BaseTexture.from('data:image/' + image.extension + ';base64,' + image.data);
        this.imageTextures[image.id].scaleMode = image.useNearest ? 0 : 1;
        this.imageTextures[image.id].gmUseNearest = image.useNearest;
        this.imageTextures[image.id].hash = image.dataHash;
      }

      imageIds.push(image.id);
    }

    // unused textures deletion
    for (const textureName in this.imageTextures) {
      if (!imageIds.includes(textureName)) {
        this.imageTextures[textureName]?.destroy();
        delete this.imageTextures[textureName];
      }
    }
  },
  bakeDrawing: function(id, resolution, state) {
    if (state.gmExtra.drawings[id] && !this.drawings[id]) {
      this.updateDrawings(state, state, 0);
    } else if (!state.gmExtra.drawings[id]) {
      return;
    }

    const drawing = this.drawings[id].displayObject;
    const bounds = drawing.getLocalBounds();
    const width = Math.ceil((bounds.x + bounds.width) * 2 * drawing.scale.x / 10) * 10 + 100;
    const height = Math.ceil((bounds.y + bounds.height) * 2 * drawing.scale.y / 10) * 10 + 100;
    const bakedTex = PIXI.RenderTexture.create({
      width: width,
      height: height,
      resolution: resolution * this.rendererClass.scaleRatio,
    });

    const oldX = drawing.x;
    const oldY = drawing.y;
    const oldAngle = drawing.angle;
    drawing.x = width / 2;
    drawing.y = height / 2;
    drawing.angle = 0;
    this.rendererClass.renderer.render(drawing, bakedTex);
    drawing.x = oldX;
    drawing.y = oldY;
    drawing.angle = oldAngle;

    let bakedId = 'BAKED_';
    for (let i = 0; true; i++) {
      if (!this.imageTextures['BAKED_' + i]) {
        bakedId = 'BAKED_' + i;
        break;
      }
    }

    const ppm = state.physics.ppm;

    this.imageTextures[bakedId] = bakedTex.baseTexture;
    bakedTex.destroy();
    return {
      id: bakedId,
      width: (width + 1) / drawing.scale.x / (ppm * this.rendererClass.scaleRatio),
      height: (height + 1) / drawing.scale.y / (ppm * this.rendererClass.scaleRatio),
    };
  },
  debugLog: function(message) {
    const messageDiv = document.createElement('div');

    if (typeof message === 'string') {
      messageDiv.innerText = message;
    } else {
      messageDiv.innerText = JSON.stringify(message);
    }

    const logBox = document.getElementById('gm_logbox');

    logBox.appendChild(messageDiv);
    logBox.style.visibility = 'visible';
    if (logBox.childElementCount > 30) logBox.removeChild(logBox.children[0]);
    logBox.scrollTop = logBox.scrollHeight;
  },
  lastRenderedState: null,
  rendererClass: null,
  camera: null,
  drawings: [],
  imageTextures: {},
};

/**
 * A linear interpolator for hex colors.
 *
 * Taken from:
 * https://gist.github.com/nikolas/b0cce2261f1382159b507dd492e1ceef
 *
 * @param {Number} a  (hex color start val)
 * @param {Number} b  (hex color end val)
 * @param {Number} amount  (the amount to fade from a to b)
 *
 * @example
 * // returns 0x7f7f7f
 * lerpColor(0x000000, 0xffffff, 0.5)
 *
 * @return {Number}
 */
const lerpColor = function(a, b, amount) {
  const ar = a >> 16;
  const ag = a >> 8 & 0xff;
  const ab = a & 0xff;

  const br = b >> 16;
  const bg = b >> 8 & 0xff;
  const bb = b & 0xff;

  const rr = ar + amount * (br - ar);
  const rg = ag + amount * (bg - ag);
  const rb = ab + amount * (bb - ab);

  return (rr << 16) + (rg << 8) + (rb | 0);
};

const lerpAngle = function(a, b, weight) {
  const anglePointA = [Math.sin(a * (Math.PI/180)), Math.cos(a * (Math.PI/180))];
  const anglePointB = [Math.sin(b * (Math.PI/180)), Math.cos(b * (Math.PI/180))];
  const lerpedAnglePoint = [
    (1 - weight) * anglePointA[0] + weight * anglePointB[0],
    (1 - weight) * anglePointA[1] + weight * anglePointB[1],
  ];

  return Math.atan2(lerpedAnglePoint[0], lerpedAnglePoint[1]) * (180/Math.PI);
};

const lerpNumber = function(a, b, weight) {
  return ((1 - weight) * a + weight * b);
};

/**
 * Creates and manages a container for a drawing.
 */
class Drawing {
  constructor() {
    this.displayObject = new PIXI.Container();
    this.displayObject.isGMMDrawing = true;
    this.displayObject.sortableChildren = true;
    this.shapes = [];
    this.lastDrawDef = {};
  }
  update(drawDefA, drawDefB, weight, scaleRatio, forceUpdate) {
    const forLength = Math.max(drawDefA.shapes.length, drawDefB.shapes.length);
    for (let i = 0; i < forLength; i++) {
      // deletion of shapes that suddenly change type
      // these are later recreated in the new shape creation phase
      if (drawDefB.shapes[i]?.type != this.lastDrawDef.shapes?.[i]?.type && this.shapes[i]) {
        this.shapes[i].destroy();
        this.shapes[i] = null;
      }

      // deletion of shapes that suddenly disappear
      if (!drawDefB.shapes[i] && this.shapes[i]) {
        this.shapes[i].destroy();
        this.shapes[i] = null;
      }

      // new shape creation
      if (drawDefB.shapes[i] && !this.shapes[i]) {
        switch (drawDefB.shapes[i].type) {
          case 'bx':
            this.shapes[i] = new BoxShape();
            break;
          case 'ci':
            this.shapes[i] = new CircleShape();
            break;
          case 'po':
            this.shapes[i] = new PolyShape();
            break;
          case 'li':
            this.shapes[i] = new LineShape();
            break;
          case 'tx':
            this.shapes[i] = new TextShape();
            break;
          case 'im':
            this.shapes[i] = new ImageShape();
            break;
        }

        this.displayObject.addChild(this.shapes[i].displayObject);
        this.shapes[i].displayObject.zIndex = 1000 + i;
        this.shapes[i].update(drawDefB.shapes[i], drawDefB.shapes[i], 1, scaleRatio, true);
      }

      // shape updating
      if (drawDefA.shapes[i] && drawDefB.shapes[i] && this.shapes[i]) {
        this.shapes[i].update(drawDefA.shapes[i], drawDefB.shapes[i], weight, scaleRatio, gm.graphics.forceDrawingUpdate);
      }
    }

    // property check
    const propsNoChange = this.lastDrawDef.alpha == drawDefB.alpha &&
      this.lastDrawDef.pos[0] == drawDefB.pos[0] &&
      this.lastDrawDef.pos[1] == drawDefB.pos[1] &&
      this.lastDrawDef.angle == drawDefB.angle &&
      this.lastDrawDef.scale[0] == drawDefB.scale[0] &&
      this.lastDrawDef.scale[1] == drawDefB.scale[1];

    if (propsNoChange && !forceUpdate) return;

    if (drawDefB.noLerp) drawDefA = drawDefB;

    this.lastDrawDef = {
      alpha: lerpNumber(drawDefA.alpha, drawDefB.alpha, weight),
      pos: [lerpNumber(drawDefA.pos[0], drawDefB.pos[0], weight),
        lerpNumber(drawDefA.pos[1], drawDefB.pos[1], weight)],
      angle: lerpAngle(drawDefA.angle, drawDefB.angle, weight),
      scale: [lerpNumber(drawDefA.scale[0], drawDefB.scale[0], weight),
        lerpNumber(drawDefA.scale[1], drawDefB.scale[1], weight)],
      shapes: drawDefB.shapes,
    };

    this.displayObject.alpha = this.lastDrawDef.alpha;
    this.displayObject.x = this.lastDrawDef.pos[0] * scaleRatio;
    this.displayObject.y = this.lastDrawDef.pos[1] * scaleRatio;
    this.displayObject.angle = this.lastDrawDef.angle;
    this.displayObject.scale.x = this.lastDrawDef.scale[0];
    this.displayObject.scale.y = this.lastDrawDef.scale[1];
  }
  destroy() {
    for (let i = 0; i < this.shapes.length; i++) {
      this.shapes[i]?.destroy();
    }
    this.displayObject.destroy();
  }
}

/**
 * Creates and manages a Graphics object for a box shape.
 */
class BoxShape {
  constructor() {
    this.displayObject = new PIXI.Graphics();
    this.lastDrawDef = {};
  }
  hasChanged(newShapeDef) {
    return this.lastDrawDef.colour != newShapeDef.colour ||
    this.lastDrawDef.alpha != newShapeDef.alpha ||
    this.lastDrawDef.pos[0] != newShapeDef.pos[0] ||
    this.lastDrawDef.pos[1] != newShapeDef.pos[1] ||
    this.lastDrawDef.angle != newShapeDef.angle ||
    this.lastDrawDef.size[0] != newShapeDef.size[0] ||
    this.lastDrawDef.size[1] != newShapeDef.size[1];
  }
  update(shapeDefA, shapeDefB, weight, scaleRatio, forceUpdate) {
    // property check
    if (!forceUpdate && !this.hasChanged(shapeDefB)) return;

    if (shapeDefB.noLerp) shapeDefA = shapeDefB;

    this.lastDrawDef = {
      colour: lerpColor(shapeDefA.colour, shapeDefB.colour, weight),
      alpha: lerpNumber(shapeDefA.alpha, shapeDefB.alpha, weight),
      pos: [lerpNumber(shapeDefA.pos[0], shapeDefB.pos[0], weight),
        lerpNumber(shapeDefA.pos[1], shapeDefB.pos[1], weight)],
      angle: lerpAngle(shapeDefA.angle, shapeDefB.angle, weight),
      size: [lerpNumber(shapeDefA.size[0], shapeDefB.size[0], weight),
        lerpNumber(shapeDefA.size[1], shapeDefB.size[1], weight)],
    };

    this.displayObject.clear();
    this.displayObject.beginFill(this.lastDrawDef.colour);

    const width = this.lastDrawDef.size[0] * scaleRatio;
    const height = this.lastDrawDef.size[1] * scaleRatio;
    this.displayObject.drawRect(width / -2, height / -2, width, height);

    this.displayObject.endFill();

    this.displayObject.alpha = this.lastDrawDef.alpha;
    this.displayObject.x = this.lastDrawDef.pos[0] * scaleRatio;
    this.displayObject.y = this.lastDrawDef.pos[1] * scaleRatio;
    this.displayObject.angle = this.lastDrawDef.angle;
  }
  destroy() {
    this.displayObject.destroy();
  }
}

/**
 * Creates and manages a Graphics object for a circle shape.
 */
class CircleShape {
  constructor() {
    this.displayObject = new PIXI.Graphics();
    this.lastDrawDef = {};
  }
  update(shapeDefA, shapeDefB, weight, scaleRatio, forceUpdate) {
    // property check
    const propsNoChange = this.lastDrawDef.colour == shapeDefB.colour &&
        this.lastDrawDef.alpha == shapeDefB.alpha &&
        this.lastDrawDef.pos[0] == shapeDefB.pos[0] &&
        this.lastDrawDef.pos[1] == shapeDefB.pos[1] &&
        this.lastDrawDef.angle == shapeDefB.angle &&
        this.lastDrawDef.size[0] == shapeDefB.size[0] &&
        this.lastDrawDef.size[1] == shapeDefB.size[1];

    if (propsNoChange && !forceUpdate) return;

    if (shapeDefB.noLerp) shapeDefA = shapeDefB;

    this.lastDrawDef = {
      colour: lerpColor(shapeDefA.colour, shapeDefB.colour, weight),
      alpha: lerpNumber(shapeDefA.alpha, shapeDefB.alpha, weight),
      pos: [lerpNumber(shapeDefA.pos[0], shapeDefB.pos[0], weight),
        lerpNumber(shapeDefA.pos[1], shapeDefB.pos[1], weight)],
      angle: lerpAngle(shapeDefA.angle, shapeDefB.angle, weight),
      size: [lerpNumber(shapeDefA.size[0], shapeDefB.size[0], weight),
        lerpNumber(shapeDefA.size[1], shapeDefB.size[1], weight)],
    };

    this.displayObject.clear();
    this.displayObject.beginFill(this.lastDrawDef.colour);

    const width = this.lastDrawDef.size[0] * scaleRatio / 2;
    const height = this.lastDrawDef.size[1] * scaleRatio / 2;
    this.displayObject.drawEllipse(0, 0, width, height);

    this.displayObject.endFill();

    this.displayObject.alpha = this.lastDrawDef.alpha;
    this.displayObject.x = this.lastDrawDef.pos[0] * scaleRatio;
    this.displayObject.y = this.lastDrawDef.pos[1] * scaleRatio;
    this.displayObject.angle = this.lastDrawDef.angle;
  }
  destroy() {
    this.displayObject.destroy();
  }
}

/**
 * Creates and manages a Graphics object for a polygon shape.
 */
class PolyShape {
  constructor() {
    this.displayObject = new PIXI.Graphics();
    this.lastDrawDef = {};
  }
  update(shapeDefA, shapeDefB, weight, scaleRatio, forceUpdate) {
    // property check
    const propsNoChange = this.lastDrawDef.colour == shapeDefB.colour &&
        this.lastDrawDef.alpha == shapeDefB.alpha &&
        this.lastDrawDef.pos[0] == shapeDefB.pos[0] &&
        this.lastDrawDef.pos[1] == shapeDefB.pos[1] &&
        this.lastDrawDef.angle == shapeDefB.angle &&
        this.lastDrawDef.scale[0] == shapeDefB.scale[0] &&
        this.lastDrawDef.scale[1] == shapeDefB.scale[1];

    let vertsNoChange = true;
    const maxVertexLength = Math.max(this.lastDrawDef.vertices?.length ?? 0, shapeDefB.vertices.length);
    for (let i = 0; i < maxVertexLength; i++) {
      if (this.lastDrawDef.vertices?.[i][0] != shapeDefB.vertices[i][0] ||
          this.lastDrawDef.vertices?.[i][1] != shapeDefB.vertices[i][1]) {
        vertsNoChange = false;
        break;
      };
    }

    if (propsNoChange && vertsNoChange && !forceUpdate) return;

    if (shapeDefB.noLerp) shapeDefA = shapeDefB;

    this.lastDrawDef = {
      colour: lerpColor(shapeDefA.colour, shapeDefB.colour, weight),
      alpha: lerpNumber(shapeDefA.alpha, shapeDefB.alpha, weight),
      pos: [lerpNumber(shapeDefA.pos[0], shapeDefB.pos[0], weight),
        lerpNumber(shapeDefA.pos[1], shapeDefB.pos[1], weight)],
      angle: lerpAngle(shapeDefA.angle, shapeDefB.angle, weight),
      scale: [lerpNumber(shapeDefA.scale[0], shapeDefB.scale[0], weight),
        lerpNumber(shapeDefA.scale[1], shapeDefB.scale[1], weight)],
    };

    const vertices = [];
    for (let i = 0; i < shapeDefB.vertices.length; i++) {
      vertices.push(lerpNumber(
          shapeDefA.vertices[i]?.[0] ?? shapeDefB.vertices[i][0],
          shapeDefB.vertices[i][0],
          weight,
      ) * scaleRatio);
      vertices.push(lerpNumber(
          shapeDefA.vertices[i]?.[1] ?? shapeDefB.vertices[i][1],
          shapeDefB.vertices[i][1],
          weight,
      ) * scaleRatio);
    }

    this.lastDrawDef.vertices = vertices;

    this.displayObject.clear();
    this.displayObject.beginFill(this.lastDrawDef.colour);

    this.displayObject.drawPolygon(this.lastDrawDef.vertices);
    this.displayObject.endFill();

    this.displayObject.alpha = this.lastDrawDef.alpha;
    this.displayObject.x = this.lastDrawDef.pos[0] * scaleRatio;
    this.displayObject.y = this.lastDrawDef.pos[1] * scaleRatio;
    this.displayObject.angle = this.lastDrawDef.angle;
    this.displayObject.scale.x = this.lastDrawDef.scale[0];
    this.displayObject.scale.y = this.lastDrawDef.scale[1];
  }
  destroy() {
    this.displayObject.destroy();
  }
}

/**
 * Creates and manages a Graphics object for a line shape.
 */
class LineShape {
  constructor() {
    this.displayObject = new PIXI.Graphics();
    this.lastDrawDef = {};
  }
  hasChanged(newShapeDef) {
    return this.lastDrawDef.colour != newShapeDef.colour ||
    this.lastDrawDef.alpha != newShapeDef.alpha ||
    this.lastDrawDef.pos[0] != newShapeDef.pos[0] ||
    this.lastDrawDef.pos[1] != newShapeDef.pos[1] ||
    this.lastDrawDef.end[0] != newShapeDef.end[0] ||
    this.lastDrawDef.end[1] != newShapeDef.end[1] ||
    this.lastDrawDef.width != newShapeDef.width;
  }
  update(shapeDefA, shapeDefB, weight, scaleRatio, forceUpdate) {
    // property check
    if (!forceUpdate && !this.hasChanged(shapeDefB)) return;

    if (shapeDefB.noLerp) shapeDefA = shapeDefB;

    this.lastDrawDef = {
      colour: lerpColor(shapeDefA.colour, shapeDefB.colour, weight),
      alpha: lerpNumber(shapeDefA.alpha, shapeDefB.alpha, weight),
      pos: [lerpNumber(shapeDefA.pos[0], shapeDefB.pos[0], weight),
        lerpNumber(shapeDefA.pos[1], shapeDefB.pos[1], weight)],
      end: [lerpNumber(shapeDefA.end[0], shapeDefB.end[0], weight),
        lerpNumber(shapeDefA.end[1], shapeDefB.end[1], weight)],
      width: lerpNumber(shapeDefA.width, shapeDefB.width, weight),
    };

    this.displayObject.clear();
    this.displayObject.lineStyle(
        this.lastDrawDef.width * scaleRatio,
        this.lastDrawDef.colour, this.lastDrawDef.alpha);
    this.displayObject.moveTo(
        this.lastDrawDef.pos[0] * scaleRatio,
        this.lastDrawDef.pos[1] * scaleRatio);
    this.displayObject.lineTo(
        this.lastDrawDef.end[0] * scaleRatio,
        this.lastDrawDef.end[1] * scaleRatio);
  }
  destroy() {
    this.displayObject.destroy();
  }
}

/**
 * Creates and manages a Text object for a text shape.
 */
class TextShape {
  constructor() {
    this.displayObject = new PIXI.Text();
    this.displayObject.resolution = 2;
    this.lastDrawDef = {};
  }
  update(shapeDefA, shapeDefB, weight, scaleRatio, forceUpdate) {
    // property check
    const propsNoChange = this.lastDrawDef.colour == shapeDefB.colour &&
        this.lastDrawDef.alpha == shapeDefB.alpha &&
        this.lastDrawDef.pos[0] == shapeDefB.pos[0] &&
        this.lastDrawDef.pos[1] == shapeDefB.pos[1] &&
        this.lastDrawDef.angle == shapeDefB.angle &&
        this.lastDrawDef.text == shapeDefB.text &&
        this.lastDrawDef.size == shapeDefB.size &&
        this.lastDrawDef.align == shapeDefB.align &&
        this.lastDrawDef.bold == shapeDefB.bold &&
        this.lastDrawDef.italic == shapeDefB.italic &&
        this.lastDrawDef.shadow == shapeDefB.shadow;

    if (propsNoChange && !forceUpdate) return;

    if (shapeDefB.noLerp) shapeDefA = shapeDefB;

    this.lastDrawDef = {
      colour: lerpColor(shapeDefA.colour, shapeDefB.colour, weight),
      alpha: lerpNumber(shapeDefA.alpha, shapeDefB.alpha, weight),
      pos: [lerpNumber(shapeDefA.pos[0], shapeDefB.pos[0], weight),
        lerpNumber(shapeDefA.pos[1], shapeDefB.pos[1], weight)],
      angle: lerpAngle(shapeDefA.angle, shapeDefB.angle, weight),
      text: shapeDefB.text,
      size: lerpNumber(shapeDefA.size, shapeDefB.size, weight),
      align: shapeDefB.align,
      bold: shapeDefB.bold,
      italic: shapeDefB.italic,
      shadow: shapeDefB.shadow,
    };

    this.displayObject.text = shapeDefB.text;
    this.displayObject.style = {
      fontFamily: 'futurept_medium',
      fontSize: this.lastDrawDef.size * scaleRatio,
      align: shapeDefB.align,
      fill: this.lastDrawDef.colour,
      fontStyle: shapeDefB.italic ? 'italic' : 'normal',
      fontWeight: shapeDefB.bold ? 'bold' : 'normal',
      dropShadow: shapeDefB.shadow,
      dropShadowDistance: 3,
      dropShadowAlpha: 0.30,
      padding: 10,
    };

    switch (shapeDefB.align) {
      case 'left':
        this.displayObject.anchor.set(0, 0);
        break;
      case 'center':
        this.displayObject.anchor.set(0.5, 0);
        break;
      case 'right':
        this.displayObject.anchor.set(1, 0);
        break;
    }

    this.displayObject.x = this.lastDrawDef.pos[0] * scaleRatio;
    this.displayObject.y = this.lastDrawDef.pos[1] * scaleRatio;
    this.displayObject.angle = this.lastDrawDef.angle;
    this.displayObject.alpha = this.lastDrawDef.alpha;
  }
  destroy() {
    this.displayObject.destroy();
  }
}

/**
 * Creates and manages a Graphics object for an image shape.
 */
class ImageShape {
  constructor() {
    this.displayObject = new PIXI.Sprite();// new PIXI.Texture(gm.graphics.imageTextures[]));
    this.displayObject.anchor.set(0.5, 0.5);
    this.lastDrawDef = {};
  }
  update(shapeDefA, shapeDefB, weight, scaleRatio, forceUpdate) {
    this.displayObject.visible = gm.config.saved.ingame.allowImages;

    const stringifiedRegionA = JSON.stringify(this.lastDrawDef.region);
    const stringifiedRegionB = JSON.stringify(shapeDefB.region);

    // property check
    const propsNoChange = this.lastDrawDef.colour == shapeDefB.colour &&
    this.lastDrawDef.id == shapeDefB.id &&
    this.lastDrawDef.alpha == shapeDefB.alpha &&
    this.lastDrawDef.pos[0] == shapeDefB.pos[0] &&
    this.lastDrawDef.pos[1] == shapeDefB.pos[1] &&
    this.lastDrawDef.angle == shapeDefB.angle &&
    this.lastDrawDef.size[0] == shapeDefB.size[0] &&
    this.lastDrawDef.size[1] == shapeDefB.size[1] &&
    stringifiedRegionA == stringifiedRegionB;

    if (propsNoChange && !forceUpdate) return;

    if (shapeDefB.noLerp) shapeDefA = shapeDefB;

    if (this.lastDrawDef.id != shapeDefB.id || this.displayObject.texture.baseTexture.cacheId === null) {
      this.displayObject.texture = new PIXI.Texture(gm.graphics.imageTextures[shapeDefB.id]);
    }

    this.lastDrawDef = {
      colour: lerpColor(shapeDefA.colour, shapeDefB.colour, weight),
      alpha: lerpNumber(shapeDefA.alpha, shapeDefB.alpha, weight),
      pos: [lerpNumber(shapeDefA.pos[0], shapeDefB.pos[0], weight),
        lerpNumber(shapeDefA.pos[1], shapeDefB.pos[1], weight)],
      angle: lerpAngle(shapeDefA.angle, shapeDefB.angle, weight),
      size: [lerpNumber(shapeDefA.size[0], shapeDefB.size[0], weight),
        lerpNumber(shapeDefA.size[1], shapeDefB.size[1], weight)],
      region: shapeDefB.region,
      id: shapeDefB.id,
    };

    if (stringifiedRegionA != stringifiedRegionB || forceUpdate) {
      const frame = this.displayObject.texture.frame;

      if (shapeDefB.region) {
        frame.x = shapeDefB.region.pos[0];
        frame.y = shapeDefB.region.pos[1];
        frame.width = shapeDefB.region.size[0];
        frame.height = shapeDefB.region.size[1];
      } else {
        frame.x = 0;
        frame.y = 0;
        frame.width = gm.graphics.imageTextures[shapeDefB.id].width;
        frame.height = gm.graphics.imageTextures[shapeDefB.id].height;
      }

      this.displayObject.texture.updateUvs();
    }

    this.displayObject.tint = this.lastDrawDef.colour;
    this.displayObject.alpha = this.lastDrawDef.alpha;
    this.displayObject.x = this.lastDrawDef.pos[0] * scaleRatio;
    this.displayObject.y = this.lastDrawDef.pos[1] * scaleRatio;
    this.displayObject.angle = this.lastDrawDef.angle;
    this.displayObject.scale.x = this.lastDrawDef.size[0] / this.displayObject.texture.frame.width * scaleRatio;
    this.displayObject.scale.y = this.lastDrawDef.size[1] / this.displayObject.texture.frame.height * scaleRatio;
  }
  destroy() {
    this.displayObject.destroy();
  }
}
