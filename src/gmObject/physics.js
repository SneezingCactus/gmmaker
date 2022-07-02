/* eslint-disable camelcase */
/* eslint-disable new-cap */

import seedrandom from 'seedrandom';

export default {
  init: function() {
    this.initb2Step();
    this.initGameState();
  },
  initb2Step: function() {
    Box2D.Dynamics.b2World.prototype.Step_OLD = Box2D.Dynamics.b2World.prototype.Step;
    Box2D.Dynamics.b2World.prototype.Step = function() {
      if (!PhysicsClass.contactListener.PostSolve_OLD) gm.physics.initContactListener();

      // management of the die
      if (PhysicsClass.globalStepVars?.inputState) {
        const kills = PhysicsClass.globalStepVars.inputState.physics.bodies[0].cf.kills;

        if (kills) {
          for (let i = 0; i !== kills.length; i++) {
            if (PhysicsClass.globalStepVars.discs[kills[i].id]) {
              PhysicsClass.globalStepVars.discs[kills[i].id].diedThisStep = kills[i].allowRespawn ? 1 : 3;
            }
          }
        }
      }
      return this.Step_OLD(...arguments);
    };
  },
  initGameState: function() {
    const step_OLD = PhysicsClass.prototype.step;
    PhysicsClass.prototype.step = function() {
      // I know, it's kinda dumb to put everything into a try catch,
      // but it works well here
      try {
        // eslint-disable-next-line no-throw-literal
        if (gm.lobby.gameCrashed) throw 'gmAlreadyCrashed';

        gm.inputs.allPlayerInputs = JSON.parse(JSON.stringify(arguments[1]));

        // override inputs
        if (arguments[0]?.physics.bodies[0]?.cf.overrides) {
          const overrides = arguments[0].physics.bodies[0].cf.overrides;

          for (let i = 0; i !== arguments[0].discs.length; i++) {
            if (!overrides[i] || !arguments[0].discs[i]) continue;

            arguments[1][i] = {
              up: overrides[i].up ?? arguments[1][i]?.up ?? false,
              down: overrides[i].down ?? arguments[1][i]?.down ?? false,
              left: overrides[i].left ?? arguments[1][i]?.left ?? false,
              right: overrides[i].right ?? arguments[1][i]?.right ?? false,
              action: overrides[i].action ?? arguments[1][i]?.action ?? false,
              action2: overrides[i].action2 ?? arguments[1][i]?.action2 ?? false,
            };
          }
        }

        gm.physics.collisionsThisStep = [];

        gmReplaceAccessors.disableDeathBarrier = !!arguments[0].physics.bodies[0]?.cf.disableDeathBarrier;

        if (arguments[0].rl === 0 && arguments[4].GMMode) {
          gmReplaceAccessors.disableDeathBarrier = true;
        }

        let gst = step_OLD(...arguments);

        if (gst.ftu == 0) {
          gm.graphics.renderUpdates = [];
        }

        // make seed based on scene element positions and game state seed
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
        gm.physics.pseudoRandom = new seedrandom(randomSeed);

        if (!gst.physics.bodies[0]) {
          gst.physics.bodies[0] = {
            'type': 's',
            'p': [0, 0],
            'a': 0,
            'av': 0,
            'lv': [0, 0],
            'ld': 0,
            'ad': 0,
            'fr': false,
            'bu': false,
            'fx': [],
            'fric': 0,
            'fricp': false,
            'de': 0,
            're': 0,
            'f_c': 0,
            'f_p': false,
            'f_1': false,
            'f_2': false,
            'f_3': false,
            'f_4': false,
            'cf': {'x': 0, 'y': 0, 'w': false, 'ct': 0},
          };
        }

        if (!gst.physics.bodies[0].cf.initialPlayers) gst.physics.bodies[0].cf.initialPlayers = gm.blockly.funcs.getAllPlayerIds(gst);

        if (!gst.physics.bodies[0].cf.variables) {
          gst.physics.bodies[0].cf.variables = {global: {}};
          gst.physics.bodies[0].cf.keepVariables = [];

          const keepVariables = arguments[0].physics.bodies[0]?.cf.keepVariables;

          if (keepVariables) {
            for (let v = 0; v < keepVariables.length; v++) {
              const varName = keepVariables[v];
              if (!arguments[0].physics.bodies[0]?.cf.variables?.global[varName]) continue;

              gst.physics.bodies[0].cf.variables.global[varName] = arguments[0].physics.bodies[0].cf.variables.global[varName];
            }
          }

          for (let i = 0; i < gst.discs.length; i++) {
            if (!gst.discs[i]) continue;

            gst.physics.bodies[0].cf.variables[i] = {};

            if (!keepVariables) continue;

            for (let v = 0; v < keepVariables.length; v++) {
              const varName = keepVariables[v];
              if (!arguments[0].physics.bodies[0].cf.variables[i][varName]) continue;

              gst.physics.bodies[0].cf.variables[i][varName] = arguments[0].physics.bodies[0].cf.variables[i][varName];
            }
          }

          gst.physics.bodies[0].cf.cameras = [];
          for (let i = 0; i < gst.discs.length; i++) {
            if (!gst.discs[i]) continue;

            gst.physics.bodies[0].cf.cameras[i] = {
              xpos: 365 / gst.physics.ppm,
              ypos: 250 / gst.physics.ppm,
              angle: 0,
              xscal: 1,
              yscal: 1,
              xskew: 0,
              yskew: 0,
              doLerp: true,
            };
          }

          gst.physics.bodies[0].cf.disableDeathBarrier = false;
        }

        // graphics phys step update
        gm.graphics.onPhysStep(gst);

        // clean kills list
        gst.physics.bodies[0].cf.kills = [];

        gm.physics.gameState = gst;

        // collision handling
        for (let i = 0; i !== gm.physics.collisionsThisStep.length; i++) {
          const bodyA = gm.physics.collisionsThisStep[i].fixtureABodyData;
          const bodyB = gm.physics.collisionsThisStep[i].fixtureBBodyData;
          const fixtureA = gm.physics.collisionsThisStep[i].fixtureAData;
          const fixtureB = gm.physics.collisionsThisStep[i].fixtureBData;
          const normal = gm.physics.collisionsThisStep[i].normal;
          const projs = gm.physics.gameState.projectiles;

          // disc collision
          let discBody;
          let collisionBody;
          let collisionFixture;
          let isFixtureA = false;

          if (bodyA.type === 'disc') {
            isFixtureA = true;
            discBody = bodyA;
            collisionBody = bodyB;
            collisionFixture = fixtureB;
          } else if (bodyB.type === 'disc') {
            isFixtureA = false;
            discBody = bodyB;
            collisionBody = bodyA;
            collisionFixture = fixtureA;
          }

          if (discBody && gst.discs[discBody.arrayID]) { // check if self element exists
            switch (collisionBody.type) {
              case 'disc':
                if (discBody.team === 1 || discBody.team !== collisionBody.team && // check for self and team collisions
                    gst.discs[collisionBody.arrayID]) { // check if collided element exists
                  gm.physics.onPlayerPlayerCollision(discBody.arrayID, collisionBody.arrayID);
                  gm.physics.onPlayerPlayerCollision(collisionBody.arrayID, discBody.arrayID);
                }
                break;
              case 'arrow':
                let arrowNumber = 0;
                let accum = 1;
                for (let a = 0; a !== projs.length; a++) {
                  if (collisionBody && collisionBody.arrayID === a) {
                    arrowNumber = accum;
                  } else if (collisionBody && projs[a] && collisionBody.discID === projs[a].did) {
                    accum++;
                  }
                }

                if (arrowNumber === 0) break;

                if (discBody.arrayID !== collisionBody.discID && (discBody.team === 1 || discBody.team !== collisionBody.team) && // check for self and team collisions
                    gst.projectiles[collisionBody.arrayID]) { // check if collided element exists
                  gm.physics.onPlayerArrowCollision(discBody.arrayID, collisionBody.discID, arrowNumber);
                }
                break;
              case 'phys':
                if (gst.physics.bodies[collisionBody.arrayID]?.fx.length > 0) { // check if collided element exists
                  gm.physics.onPlayerPlatformCollision(discBody.arrayID, collisionBody.arrayID, gst.physics.bodies[collisionBody.arrayID].fx.indexOf(collisionFixture.arrayID) + 1, isFixtureA ? {x: -normal.x, y: -normal.y} : normal);
                }
                break;
            }
          }

          // arrow collision
          let arrowBody;
          let arrowNumberA = 0;
          let arrowNumberB = 0;

          if (bodyA.type === 'arrow') {
            isFixtureA = true;
            arrowBody = bodyA;
            collisionBody = bodyB;
            collisionFixture = fixtureB;
          } else if (bodyB.type === 'arrow') {
            isFixtureA = false;
            arrowBody = bodyB;
            collisionBody = bodyA;
            collisionFixture = fixtureA;
          }

          let accumA = 1;
          let accumB = 1;
          for (let a = 0; a !== projs.length; a++) {
            if (arrowBody && arrowBody.arrayID === a) {
              arrowNumberA = accumA;
            } else if (arrowBody && projs[a] && arrowBody.discID === projs[a].did) {
              accumA++;
            }

            if (collisionBody && collisionBody.arrayID && collisionBody.arrayID === a) {
              arrowNumberB = accumB;
            } else if (collisionBody && collisionBody.discID && projs[a] && collisionBody.discID === projs[a].did) {
              accumB++;
            }
          }

          if (arrowBody && gst.projectiles[arrowBody.arrayID] && gst.discs[arrowBody.discID]) { // check if self element exists
            switch (collisionBody.type) {
              case 'disc':
                if (arrowBody.discID !== collisionBody.arrayID && (collisionBody.team === 1 || arrowBody.team !== collisionBody.team) && // check for self and team collisions
                  gst.discs[collisionBody.arrayID]) { // check if collided element exists
                  gm.physics.onArrowPlayerCollision(arrowBody.discID, arrowNumberA, collisionBody.arrayID);
                }
                break;
              case 'arrow':
                if (gst.projectiles[collisionBody.arrayID] && gst.discs[collisionBody.discID]) { // check if collided element exists
                  gm.physics.onArrowArrowCollision(arrowBody.discID, arrowNumberA, collisionBody.discID, arrowNumberB);
                  gm.physics.onArrowArrowCollision(collisionBody.discID, arrowNumberB, arrowBody.discID, arrowNumberA);
                }
                break;
              case 'phys':
                if (gst.physics.bodies[collisionBody.arrayID]?.fx.length > 0) { // check if collided element exists
                  gm.physics.onArrowPlatformCollision(arrowBody.discID, arrowNumberA, collisionBody.arrayID, gst.physics.bodies[collisionBody.arrayID].fx.indexOf(collisionFixture.arrayID) + 1, isFixtureA ? {x: -normal.x, y: -normal.y} : normal);
                }
                break;
            }
          }

          // platform collision
          let platBody;
          let platFixture;

          if (bodyA.type === 'phys') {
            isFixtureA = true;
            platBody = bodyA;
            collisionBody = bodyB;
            platFixture = fixtureA;
            collisionFixture = fixtureB;
          } else if (bodyB.type === 'phys') {
            isFixtureA = false;
            platBody = bodyB;
            collisionBody = bodyA;
            platFixture = fixtureB;
            collisionFixture = fixtureA;
          }

          if (platBody && gst.physics.bodies[platBody.arrayID]?.fx.length > 0) { // check if self element exists
            const ownShapeId = gst.physics.bodies[platBody.arrayID].fx.indexOf(platFixture.arrayID) + 1;

            for (let i = 0; i < gst.discs.length; i++) {
              if (!gst.discs[i]) continue;
              switch (collisionBody.type) {
                case 'disc':
                  if (!gst.discs[collisionBody.arrayID]) break; // check if collided element exists

                  gm.physics.onPlatformPlayerCollision(i, platBody.arrayID, ownShapeId, collisionBody.arrayID);
                  break;
                case 'arrow':
                  let arrowNumber = 0;
                  let accum = 1;
                  for (let a = 0; a !== projs.length; a++) {
                    if (collisionBody && collisionBody.arrayID === a) {
                      arrowNumber = accum;
                    } else if (collisionBody && projs[a] && collisionBody.discID === projs[a].did) {
                      accum++;
                    }
                  }

                  if (arrowNumber === 0) break;

                  if (!gst.discs[collisionBody.discID] || !gst.projectiles[collisionBody.arrayID]) break; // check if collided element exists

                  gm.physics.onPlatformArrowCollision(i, platBody.arrayID, ownShapeId, collisionBody.discID, arrowNumber);
                  break;
                case 'phys':
                  if (gst.physics.bodies[collisionBody.arrayID]?.fx.length == 0) break; // check if collided element exists

                  const colShapeId = gst.physics.bodies[collisionBody.arrayID].fx.indexOf(collisionFixture.arrayID) + 1;

                  gm.physics.onPlatformPlatformCollision(i, platBody.arrayID, ownShapeId, collisionBody.arrayID, colShapeId, isFixtureA ? {x: -normal.x, y: -normal.y} : normal);
                  gm.physics.onPlatformPlatformCollision(i, collisionBody.arrayID, colShapeId, platBody.arrayID, ownShapeId, isFixtureA ? normal : {x: -normal.x, y: -normal.y});
                  break;
              }
            }
          }
        }

        // step handling
        if (gm.physics.forceGameState) {
          gm.physics.forceGameState = false;
          gst = gm.physics.gameState;
        }

        gm.physics.gameState = gst;

        for (let i = 0; i < arguments[0].discs.length; i++) {
          if (arguments[0].discs[i] && !gst.discs[i]) {
            const currentDisc = gm.physics.gameState.discs[i];
            gm.physics.gameState.discs[i] = arguments[0].discs[i];
            gm.physics.onPlayerDie(i);
            gm.physics.gameState.discs[i] = currentDisc;
          } else if (gst.discDeaths[gst.discDeaths.length - 1]?.i == i && gst.discDeaths[gst.discDeaths.length - 1]?.f == 0) {
            gm.physics.onPlayerDie(i);
          }
        }

        if (gm.physics.gameState.rl === 1) {
          gm.lobby.roundStarting = false;

          gm.blockly.funcs.clearGraphics();

          for (let i = 0; i !== gst.physics.bodies[0].cf.initialPlayers.length; i++) {
            const id = gst.physics.bodies[0].cf.initialPlayers[i];

            if (!gm.inputs.allPlayerInputs[id]) {
              gm.inputs.allPlayerInputs[id] = {left: false, right: false, up: false, down: false, action: false, action2: false};
            }

            gm.physics.onFirstStep(id);
          }
        } else if (!gm.physics.forceGameState && gm.physics.gameState.ftu === -1) {
          for (let i = 0; i !== gst.physics.bodies[0].cf.initialPlayers.length; i++) {
            const id = gst.physics.bodies[0].cf.initialPlayers[i];

            if (!gm.inputs.allPlayerInputs[id]) {
              gm.inputs.allPlayerInputs[id] = {left: false, right: false, up: false, down: false, action: false, action2: false};
            }

            gm.physics.onStep(id);
          }
        }

        if (gst.ftu > 0) gm.lobby.roundStarting = true;

        if (gm.physics.forceGameState) {
          gm.physics.forceGameState = false;
          gst = gm.physics.gameState;
        }

        gm.physics.gameState = gst;

        // The renderer class isn't built at the same time as the first game step gets executed,
        // so this checks if the renderer has been built, and executes all the previous render updates
        gst.physics.bodies[0].cf.rendererExists = !!gm.graphics.rendererClass;
        if (!!gm.graphics.rendererClass && !arguments[0].physics.bodies[0]?.cf.rendererExists) {
          for (let i = 0; i < gst.rl; i++) {
            if (!window.gmReplaceAccessors.gameStateList || !window.gmReplaceAccessors.gameStateList[i]) continue;
            gm.graphics.doRenderUpdates(window.gmReplaceAccessors.gameStateList[i]);
          }
        } else if (!!gm.graphics.rendererClass) {
          gm.graphics.doRenderUpdates(gst);
        }

        gm.physics.collisionsThisStep = [];

        if (window.gmReplaceAccessors.endStep) window.gmReplaceAccessors.endStep();

        return gst;
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
        return arguments[0];
      }
    };
  },
  initContactListener: function() {
    PhysicsClass.contactListener.PostSolve_OLD = PhysicsClass.contactListener.PostSolve;
    PhysicsClass.contactListener.PostSolve = function(contact, impulses) {
      if (impulses.normalImpulses[0] > 0.1) {
        const worldManifold = new Box2D.Collision.b2WorldManifold();
        contact.GetWorldManifold(worldManifold);

        gm.physics.collisionsThisStep.push({
          fixtureAData: contact.GetFixtureA().GetUserData(),
          fixtureABodyData: contact.GetFixtureA().GetBody().GetUserData(),
          fixtureBData: contact.GetFixtureB().GetUserData(),
          fixtureBBodyData: contact.GetFixtureB().GetBody().GetUserData(),
          normal: {x: worldManifold.m_normal.x, y: worldManifold.m_normal.y},
        });
      }

      return PhysicsClass.contactListener.PostSolve_OLD(...arguments);
    };
  },
  gameState: null,
  setGameState: function(newgst) {
    this.forceGameState = true;
    this.gameState = newgst;
  },
  forceGameState: false,
  collisionsThisStep: [],
  pseudoRandom: null,
  lastStepCount: 0,
  onStep: function() { },
  onFirstStep: function() { },
  onPlayerDie: function() { },
  onPlayerPlayerCollision: function() { },
  onPlayerArrowCollision: function() { },
  onPlayerPlatformCollision: function() { },
  onArrowPlayerCollision: function() { },
  onArrowArrowCollision: function() { },
  onArrowPlatformCollision: function() { },
  onPlatformPlayerCollision: function() { },
  onPlatformArrowCollision: function() { },
  onPlatformPlatformCollision: function() { },
  getPlayerLastArrow: function(playerid) {
    const projs = this.gameState.projectiles;
    for (let i = projs.length; i !== -1; i -= 1) {
      if (projs[i] && projs[i].did === playerid) {
        return projs[i];
      }
    }
    return null;
  },
};
