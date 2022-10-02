/* eslint-disable no-invalid-this */
/* eslint-disable require-jsdoc */
/* eslint-disable camelcase */
/* eslint-disable new-cap */
// import * as PIXI from 'pixi.js-legacy';

export default {
  init: function() {
    this.initBonkGraphics();
  },
  initBonkGraphics: function() {
    BonkGraphics.prototype.render = (function() {
      BonkGraphics.prototype.renderOLD = BonkGraphics.prototype.render;
      const renderFunction = function(stateA, stateB, weight) {
        // don't do anything if crashed
        if (gm.state.crashed) return;

        // if no mode loaded, no gmm stuff (except for camera pivot changing)
        if (!stateA.gmExtra || gm.lobby.data.quick) {
          this.renderOLD(...arguments);
          return this.renderer.render(this.stage);
        };

        // graphics is used a lot
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

        this.renderOLD(...arguments);

        /* #region UPDATE CAMERA */
        // this.blurContainer.pivot.x = -365 * this.scaleRatio;
        // this.blurContainer.pivot.y = -250 * this.scaleRatio;

        const cameraObjA = stateA.gmExtra.camera;
        const cameraObjB = stateB.gmExtra.camera;
        const camera = gm.graphics.camera;
        const scaleMultiplier = stateB.physics.ppm * this.scaleRatio;

        camera.x = 365 * this.scaleRatio;
        camera.y = 250 * this.scaleRatio;

        if (cameraObjB.noLerp) {
          camera.pivot.x = cameraObjB.xPos * scaleMultiplier;
          camera.pivot.y = cameraObjB.yPos * scaleMultiplier;
          camera.angle = cameraObjB.angle;
          camera.scale.x = cameraObjB.xScale;
          camera.scale.y = cameraObjB.yScale;
        } else {
          const anglePointA = [Math.sin(cameraObjA.angle), Math.cos(cameraObjA.angle)];
          const anglePointB = [Math.sin(cameraObjB.angle), Math.cos(cameraObjB.angle)];
          const lerpedAnglePoint = [
            (1 - arguments[2]) * anglePointA[0] + arguments[2] * anglePointB[0],
            (1 - arguments[2]) * anglePointA[1] + arguments[2] * anglePointB[1],
          ];

          camera.pivot.x = (1 - arguments[2]) * cameraObjA.xPos * scaleMultiplier + arguments[2] * cameraObjB.xPos * scaleMultiplier;
          camera.pivot.y = (1 - arguments[2]) * cameraObjA.yPos * scaleMultiplier + arguments[2] * cameraObjB.yPos * scaleMultiplier;
          camera.rotation = Math.atan2(lerpedAnglePoint[0], lerpedAnglePoint[1]);
          camera.scale.x = (1 - arguments[2]) * cameraObjA.xScale + arguments[2] * cameraObjB.xScale;
          camera.scale.y = (1 - arguments[2]) * cameraObjA.yScale + arguments[2] * cameraObjB.yScale;
        }
        /* #endregion UPDATE CAMERA */

        /* #region UPDATE DRAWINGS */
        const maxDrawingsLength = Math.max(stateB.gmExtra.drawings.length, gm.graphics.drawings.length);
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
                this.blurContainer.sortableChildren = true;
                this.blurContainer.addChildOLD(drawingList[i].displayObject);
                break;
              case 'world':
                gm.graphics.camera.sortableChildren = true;
                gm.graphics.camera.addChild(drawingList[i].displayObject);
                break;
              case 'disc':
                const disc = this.discGraphics[drawingB.attachId];
                if (!disc) break;
                disc.container.sortableChildren = true;
                disc.container.addChild(drawingList[i].displayObject);
                break;
              case 'body':
                const body = this.roundGraphics.bodyGraphics[drawingB.attachId];
                if (!body) break;
                body.displayObject.sortableChildren = true;
                body.displayObject.addChild(drawingList[i].displayObject);
                break;
            }
            drawingList[i].update(drawingB, drawingB, 1, stateB.physics.ppm * this.scaleRatio, true);
          }

          // drawing updating
          if (drawingA && drawingB && drawingList[i]) {
            if (drawingList[i].attachTo != drawingB.attachTo ||
                drawingList[i].attachId != drawingB.attachId ||
               !drawingList[i].displayObject.parent) {
              drawingList[i].displayObject.parent?.removeChild(drawingList[i]);
              drawingList[i].attachTo = drawingB.attachTo;
              drawingList[i].attachId = drawingB.attachId;

              switch (drawingB.attachTo) {
                case 'screen':
                  // if it wasn't sortable, now it is
                  this.blurContainer.sortableChildren = true;
                  this.blurContainer.addChildOLD(drawingList[i].displayObject);
                  break;
                case 'world':
                  gm.graphics.camera.sortableChildren = true;
                  gm.graphics.camera.addChild(drawingList[i].displayObject);
                  break;
                case 'disc':
                  const disc = this.discGraphics[drawingB.attachId];
                  if (!disc) break;
                  disc.container.sortableChildren = true;
                  disc.container.addChild(drawingList[i].displayObject);
                  break;
                case 'body':
                  const body = this.roundGraphics.bodyGraphics[drawingB.attachId];
                  if (!body) break;
                  body.displayObject.sortableChildren = true;
                  body.displayObject.addChild(drawingList[i].displayObject);
                  break;
              }
            }

            drawingList[i].update(drawingA, drawingB, weight, stateB.physics.ppm * this.scaleRatio);
          }
        }
        /* #endregion UPDATE DRAWINGS */

        // save graphics state for later use
        gm.graphics.lastRenderedState = stateB;

        // render
        this.renderer.render(this.stage);
      };
      return function() {
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

        const emptyState = {ms: {re: false, nc: true, pq: 0, gd: 0, fl: false}, mm: {a: '', n: '', dbv: 1, dbid: 0, authid: -1, date: '', rxid: 0, rxn: '', rxa: '', rxdb: 1, cr: [], pub: false, mo: ''}, shk: {x: 0, y: 0}, discs: [{x: 0, y: 0, xv: 0, yv: 0, a: 0, av: 0, a1a: 0, team: 1, a1: false, a2: false, ni: false, sx: 0, sy: 0, sxv: 0, syv: 0, ds: 0, da: 0, lhid: -1, lht: 0, swing: false}], capZones: [], seed: 0, ftu: -1, rc: 0, rl: 1, sts: null, physics: {shapes: [{type: 'bx', w: 1, h: 1, c: [0, 0], a: 0, sk: false}], fixtures: [{sh: 0, n: '', fr: null, fp: null, re: null, de: null, f: 0, d: false, np: false, ng: false}], bodies: [{type: 's', p: [0, 0], a: 0, av: 0, lv: [0, 0], ld: 0, ad: 0, fr: false, bu: false, fx: [0], fric: 0, fricp: false, de: 0, re: 0, f_c: 1, f_p: true, f_1: true, f_2: true, f_3: true, f_4: true, cf: {x: 0, y: 0, w: true, ct: 0}, ni: false}], joints: [], bro: [0], ppm: 12}, scores: [0], lscr: -1, fte: -1, discDeaths: [], players: [{id: 0, team: 1}], projectiles: []};
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
            gm.graphics.bodyGraphicsClass.prototype.moveOLD.apply(this, arguments);
          };
        }
        this.destroyChildren();

        const result = this.buildOLD.apply(this, arguments);

        /* #region CAMERA CONTAINER HANDLING */
        if (this.blurContainer.gmModified) {
          const childAmount = this.blurContainer.children.length;

          for (let i = 0; i < childAmount; i++) {
            const child = this.blurContainer.children[this.blurContainer.children.length-1];

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
        this.blurContainer.addChild = gm.graphics.camera.addChild;
        this.blurContainer.removeChildOLD = this.blurContainer.removeChild;
        this.blurContainer.removeChild = gm.graphics.camera.removeChild;

        while (this.blurContainer.children.length > 0) {
          const child = this.blurContainer.children[0];

          this.blurContainer.removeChildOLD(child);
          gm.graphics.camera.addChild(child);
        }
        this.blurContainer.addChild(gm.graphics.camera);

        this.blurContainer.gmModified = true;
        /* #endregion CAMERA CONTAINER HANDLING */

        return result;
      };
      return function() {
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

    BonkGraphics.prototype.destroy = (function() {
      BonkGraphics.prototype.destroyOLD = BonkGraphics.prototype.destroy;
      return function() {
        document.getElementById('gm_logbox').innerHTML = '';
        document.getElementById('gm_logbox').style.visibility = 'hidden';

        gm.audio.stopAllSounds();

        gm.state.crashed = false;

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
  preloadImages: function(imageList) {
    // new texture creation and image ids collection
    const imageIds = [];

    for (let i = 0; i < imageList.length; i++) {
      const image = imageList[i];
      if (!image) continue;

      if (this.imageTextures[image.id]?.hash !== image.dataHash) {
        this.imageTextures[image.id]?.destroy();
        this.imageTextures[image.id] = new PIXI.BaseTexture.from('data:image/' + image.extension + ';base64,' + image.data);
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
  bakeDrawing: function(id, resolution, ppm) {
    const drawing = this.drawings[id].displayObject;
    const bounds = drawing.getLocalBounds();
    const width = (bounds.x + bounds.width) * 2 * drawing.scale.x;
    const height = (bounds.y + bounds.height) * 2 * drawing.scale.y;
    const bakedTex = PIXI.RenderTexture.create({
      width: width,
      height: height,
      resolution: resolution * this.rendererClass.scaleRatio,
    });

    drawing.x += width / 2;
    drawing.y += height / 2;
    this.rendererClass.renderer.render(drawing, bakedTex);
    drawing.x -= width / 2;
    drawing.y -= height / 2;

    let bakedId = 'BAKED_';
    for (let i = 0; true; i++) {
      if (!this.imageTextures['BAKED_' + i]) {
        bakedId = 'BAKED_' + i;
        break;
      }
    }

    this.imageTextures[bakedId] = bakedTex.baseTexture;
    return {
      id: bakedId,
      width: width / drawing.scale.x / (ppm * this.rendererClass.scaleRatio),
      height: height / drawing.scale.y / (ppm * this.rendererClass.scaleRatio),
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
    this.displayObject.sortableChildren = true;
    this.shapes = [];
    this.transing = false;
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
        this.shapes[i].update(drawDefA.shapes[i], drawDefB.shapes[i], weight, scaleRatio);
      }
    }

    // property check
    const propsNoChange = this.lastDrawDef.alpha == drawDefB.alpha &&
      this.lastDrawDef.xPos == drawDefB.xPos &&
      this.lastDrawDef.yPos == drawDefB.yPos &&
      this.lastDrawDef.angle == drawDefB.angle &&
      this.lastDrawDef.xScale == drawDefB.xScale &&
      this.lastDrawDef.yScale == drawDefB.yScale;

    if (propsNoChange && !forceUpdate && !this.transing) return;

    this.lastDrawDef = drawDefB;

    this.transing = !propsNoChange || forceUpdate;

    if (drawDefB.noLerp) drawDefA = drawDefB;

    this.displayObject.alpha = lerpNumber(drawDefA.alpha, drawDefB.alpha, weight);
    this.displayObject.x = lerpNumber(drawDefA.xPos, drawDefB.xPos, weight) * scaleRatio;
    this.displayObject.y = lerpNumber(drawDefA.yPos, drawDefB.yPos, weight) * scaleRatio;
    this.displayObject.angle = lerpAngle(drawDefA.angle, drawDefB.angle, weight);
    this.displayObject.scale.x = lerpNumber(drawDefA.xScale, drawDefB.xScale, weight);
    this.displayObject.scale.y = lerpNumber(drawDefA.yScale, drawDefB.yScale, weight);
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
    this.transing = false;
    this.lastDrawDef = {};
  }
  update(shapeDefA, shapeDefB, weight, scaleRatio, forceUpdate) {
    // property check
    const propsNoChange = this.lastDrawDef.colour == shapeDefB.colour &&
    this.lastDrawDef.alpha == shapeDefB.alpha &&
    this.lastDrawDef.xPos == shapeDefB.xPos &&
    this.lastDrawDef.yPos == shapeDefB.yPos &&
    this.lastDrawDef.angle == shapeDefB.angle &&
    this.lastDrawDef.width == shapeDefB.width &&
    this.lastDrawDef.height == shapeDefB.height;

    if (propsNoChange && !forceUpdate && !this.transing) return;

    this.lastDrawDef = shapeDefB;

    this.transing = !propsNoChange || forceUpdate;

    if (shapeDefB.noLerp) shapeDefA = shapeDefB;

    this.displayObject.clear();
    this.displayObject.beginFill(lerpColor(shapeDefA.colour, shapeDefB.colour, weight));

    const width = lerpNumber(shapeDefA.width, shapeDefB.width, weight) * scaleRatio;
    const height = lerpNumber(shapeDefA.height, shapeDefB.height, weight) * scaleRatio;
    this.displayObject.drawRect(width / -2, height / -2, width, height);

    this.displayObject.endFill();

    this.displayObject.alpha = lerpNumber(shapeDefA.alpha, shapeDefB.alpha, weight);
    this.displayObject.x = lerpNumber(shapeDefA.xPos, shapeDefB.xPos, weight) * scaleRatio;
    this.displayObject.y = lerpNumber(shapeDefA.yPos, shapeDefB.yPos, weight) * scaleRatio;
    this.displayObject.angle = lerpAngle(shapeDefA.angle, shapeDefB.angle, weight);
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
    this.transing = false;
    this.lastDrawDef = {};
  }
  update(shapeDefA, shapeDefB, weight, scaleRatio, forceUpdate) {
    // property check
    const propsNoChange = this.lastDrawDef.colour == shapeDefB.colour &&
        this.lastDrawDef.alpha == shapeDefB.alpha &&
        this.lastDrawDef.xPos == shapeDefB.xPos &&
        this.lastDrawDef.yPos == shapeDefB.yPos &&
        this.lastDrawDef.angle == shapeDefB.angle &&
        this.lastDrawDef.width == shapeDefB.width &&
        this.lastDrawDef.height == shapeDefB.height;

    if (propsNoChange && !forceUpdate && !this.transing) return;

    this.lastDrawDef = shapeDefB;

    this.transing = !propsNoChange || forceUpdate;

    if (shapeDefB.noLerp) shapeDefA = shapeDefB;

    this.displayObject.clear();
    this.displayObject.beginFill(lerpColor(shapeDefA.colour, shapeDefB.colour, weight));

    const width = lerpNumber(shapeDefA.width, shapeDefB.width, weight) * scaleRatio / 2;
    const height = lerpNumber(shapeDefA.height, shapeDefB.height, weight) * scaleRatio / 2;
    this.displayObject.drawEllipse(0, 0, width, height);

    this.displayObject.endFill();

    this.displayObject.alpha = lerpNumber(shapeDefA.alpha, shapeDefB.alpha, weight);
    this.displayObject.x = lerpNumber(shapeDefA.xPos, shapeDefB.xPos, weight) * scaleRatio;
    this.displayObject.y = lerpNumber(shapeDefA.yPos, shapeDefB.yPos, weight) * scaleRatio;
    this.displayObject.angle = lerpAngle(shapeDefA.angle, shapeDefB.angle, weight);
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
    this.transing = false;
    this.lastDrawDef = {};
  }
  update(shapeDefA, shapeDefB, weight, scaleRatio, forceUpdate) {
    // property check
    const propsNoChange = this.lastDrawDef.colour == shapeDefB.colour &&
        this.lastDrawDef.alpha == shapeDefB.alpha &&
        this.lastDrawDef.xPos == shapeDefB.xPos &&
        this.lastDrawDef.yPos == shapeDefB.yPos &&
        this.lastDrawDef.angle == shapeDefB.angle &&
        this.lastDrawDef.xScale == shapeDefB.xScale &&
        this.lastDrawDef.yScale == shapeDefB.yScale;

    let vertsNoChange = true;
    for (let i = 0; i < shapeDefB.vertices.length; i++) {
      if (this.lastDrawDef.vertices[i] != shapeDefB.vertices[i]) {
        vertsNoChange = false;
        break;
      };
    }

    if (propsNoChange && vertsNoChange && !forceUpdate && !this.transing) return;

    this.lastDrawDef = shapeDefB;

    this.transing = !propsNoChange || !vertsNoChange || forceUpdate;

    if (shapeDefB.noLerp) shapeDefA = shapeDefB;

    this.displayObject.clear();
    this.displayObject.beginFill(lerpColor(shapeDefA.colour, shapeDefB.colour, weight));

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

    this.displayObject.drawPolygon(vertices);
    this.displayObject.endFill();

    this.displayObject.alpha = lerpNumber(shapeDefA.alpha, shapeDefB.alpha, weight);
    this.displayObject.x = lerpNumber(shapeDefA.xPos, shapeDefB.xPos, weight) * scaleRatio;
    this.displayObject.y = lerpNumber(shapeDefA.yPos, shapeDefB.yPos, weight) * scaleRatio;
    this.displayObject.angle = lerpAngle(shapeDefA.angle, shapeDefB.angle, weight);
    this.displayObject.scale.x = lerpNumber(shapeDefA.xScale, shapeDefB.xScale, weight);
    this.displayObject.scale.y = lerpNumber(shapeDefA.yScale, shapeDefB.yScale, weight);
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
    this.transing = false;
    this.lastDrawDef = {};
  }
  update(shapeDefA, shapeDefB, weight, scaleRatio, forceUpdate) {
    // property check
    const propsNoChange = this.lastDrawDef.colour == shapeDefB.colour &&
        this.lastDrawDef.alpha == shapeDefB.alpha &&
        this.lastDrawDef.xPos == shapeDefB.xPos &&
        this.lastDrawDef.yPos == shapeDefB.yPos &&
        this.lastDrawDef.xEnd == shapeDefB.xEnd &&
        this.lastDrawDef.yEnd == shapeDefB.yEnd &&
        this.lastDrawDef.width == shapeDefB.width;

    if (propsNoChange && !forceUpdate && !this.transing) return;

    this.lastDrawDef = shapeDefB;

    this.transing = !propsNoChange || forceUpdate;

    if (shapeDefB.noLerp) shapeDefA = shapeDefB;

    this.displayObject.clear();
    this.displayObject.lineStyle(
        lerpNumber(shapeDefA.width, shapeDefB.width, weight) * scaleRatio,
        lerpColor(shapeDefA.colour, shapeDefB.colour, weight), 1);
    this.displayObject.moveTo(
        lerpNumber(shapeDefA.xPos, shapeDefB.xPos, weight) * scaleRatio,
        lerpNumber(shapeDefA.yPos, shapeDefB.yPos, weight) * scaleRatio);
    this.displayObject.lineTo(
        lerpNumber(shapeDefA.xEnd, shapeDefB.xEnd, weight) * scaleRatio,
        lerpNumber(shapeDefA.yEnd, shapeDefB.yEnd, weight) * scaleRatio);

    this.displayObject.alpha = lerpNumber(shapeDefA.alpha, shapeDefB.alpha, weight);
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
    this.transing = false;
    this.lastDrawDef = {};
  }
  update(shapeDefA, shapeDefB, weight, scaleRatio, forceUpdate) {
    // property check
    const propsNoChange = this.lastDrawDef.colour == shapeDefB.colour &&
        this.lastDrawDef.alpha == shapeDefB.alpha &&
        this.lastDrawDef.xPos == shapeDefB.xPos &&
        this.lastDrawDef.yPos == shapeDefB.yPos &&
        this.lastDrawDef.angle == shapeDefB.angle &&
        this.lastDrawDef.text == shapeDefB.text &&
        this.lastDrawDef.size == shapeDefB.size &&
        this.lastDrawDef.align == shapeDefB.align &&
        this.lastDrawDef.bold == shapeDefB.bold &&
        this.lastDrawDef.italic == shapeDefB.italic &&
        this.lastDrawDef.shadow == shapeDefB.shadow;

    if (propsNoChange && !forceUpdate && !this.transing) return;

    this.lastDrawDef = shapeDefB;

    this.transing = !propsNoChange || forceUpdate;

    if (shapeDefB.noLerp) shapeDefA = shapeDefB;

    this.displayObject.text = shapeDefB.text;
    this.displayObject.style = {
      fontFamily: 'futurept_medium',
      fontSize: lerpNumber(shapeDefA.size, shapeDefB.size, weight) * scaleRatio,
      align: shapeDefB.align,
      fill: lerpColor(shapeDefA.colour, shapeDefB.colour, weight),
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

    this.displayObject.x = lerpNumber(shapeDefA.xPos, shapeDefB.xPos, weight) * scaleRatio;
    this.displayObject.y = lerpNumber(shapeDefA.yPos, shapeDefB.yPos, weight) * scaleRatio;
    this.displayObject.angle = lerpAngle(shapeDefA.angle, shapeDefB.angle, weight);
    this.displayObject.alpha = lerpNumber(shapeDefA.alpha, shapeDefB.alpha, weight);
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
    this.transing = false;
    this.lastDrawDef = {};
  }
  update(shapeDefA, shapeDefB, weight, scaleRatio, forceUpdate) {
    const stringifiedRegionA = JSON.stringify(this.lastDrawDef.region);
    const stringifiedRegionB = JSON.stringify(shapeDefB.region);

    // property check
    const propsNoChange = this.lastDrawDef.colour == shapeDefB.colour &&
    this.lastDrawDef.id == shapeDefB.id &&
    this.lastDrawDef.alpha == shapeDefB.alpha &&
    this.lastDrawDef.xPos == shapeDefB.xPos &&
    this.lastDrawDef.yPos == shapeDefB.yPos &&
    this.lastDrawDef.angle == shapeDefB.angle &&
    this.lastDrawDef.width == shapeDefB.width &&
    this.lastDrawDef.height == shapeDefB.height &&
    stringifiedRegionA == stringifiedRegionB;

    if (propsNoChange && !forceUpdate && !this.transing) return;

    this.lastDrawDef = shapeDefB;

    this.transing = !propsNoChange || forceUpdate;

    if (shapeDefA.id != shapeDefB.id || this.displayObject.texture.baseTexture.cacheId === null) {
      this.displayObject.texture = new PIXI.Texture(gm.graphics.imageTextures[shapeDefB.id]);
    }

    if (stringifiedRegionA != stringifiedRegionB || forceUpdate) {
      const frame = this.displayObject.texture.frame;

      if (shapeDefB.region) {
        frame.x = shapeDefB.region.xPos;
        frame.y = shapeDefB.region.yPos;
        frame.width = shapeDefB.region.width;
        frame.height = shapeDefB.region.height;
      } else {
        frame.x = 0;
        frame.y = 0;
        frame.width = gm.graphics.imageTextures[shapeDefB.id].width;
        frame.height = gm.graphics.imageTextures[shapeDefB.id].height;
      }

      this.displayObject.texture.updateUvs();
    }

    if (shapeDefB.noLerp) shapeDefA = shapeDefB;

    this.displayObject.tint = lerpNumber(shapeDefA.colour, shapeDefB.colour, weight);
    this.displayObject.alpha = lerpNumber(shapeDefA.alpha, shapeDefB.alpha, weight);
    this.displayObject.x = lerpNumber(shapeDefA.xPos, shapeDefB.xPos, weight) * scaleRatio;
    this.displayObject.y = lerpNumber(shapeDefA.yPos, shapeDefB.yPos, weight) * scaleRatio;
    this.displayObject.angle = lerpAngle(shapeDefA.angle, shapeDefB.angle, weight);
    this.displayObject.scale.x = lerpNumber(shapeDefA.width, shapeDefB.width, weight) / this.displayObject.texture.frame.width * scaleRatio;
    this.displayObject.scale.y = lerpNumber(shapeDefA.height, shapeDefB.height, weight) / this.displayObject.texture.frame.height * scaleRatio;
  }
  destroy() {
    this.displayObject.destroy();
  }
}
