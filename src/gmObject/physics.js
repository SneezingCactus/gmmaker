/* eslint-disable camelcase */
/* eslint-disable new-cap */

import seedrandom from 'seedrandom';

export default {
  init: function() {
    this.initb2Step();
    this.initGameState();
    this.initCreateState();
  },
  initb2Step: function() {
    Box2D.Dynamics.b2World.prototype.StepOLD = Box2D.Dynamics.b2World.prototype.Step;
    Box2D.Dynamics.b2World.prototype.Step = function() {
      if (!PhysicsClass.contactListener.PostSolveOLD) gm.physics.initContactListener();

      // management of the die
      if (PhysicsClass.globalStepVars?.inputState) {
        const kills = PhysicsClass.globalStepVars.inputState.gmExtra?.kills;

        if (kills) {
          for (let i = 0; i !== kills.length; i++) {
            if (PhysicsClass.globalStepVars.discs[kills[i].id]) {
              PhysicsClass.globalStepVars.discs[kills[i].id].diedThisStep = kills[i].allowRespawn ? 1 : 3;
            }
          }
        }
      }
      return this.StepOLD(...arguments);
    };
  },
  initGameState: function() {
    const stepOLD = PhysicsClass.prototype.step;
    PhysicsClass.prototype.step = function(oldState, inputs) {
      // I know, it's kinda dumb to put everything into a try catch,
      // but it works well here
      try {
        // eslint-disable-next-line no-throw-literal
        if (gm.lobby.gameCrashed) throw 'gmAlreadyCrashed';

        // don't do gmm business when no mode is loaded or if in quickplay
        if (!oldState.gmExtra || gm.lobby.data?.quick) {
          const state = stepOLD(...arguments);
          window.gmReplaceAccessors.disableDeathBarrier = false;
          gm.physics.gameState = state;
          gm.physics.inputs = inputs;
          return state;
        }

        gm.inputs.allPlayerInputs = JSON.parse(JSON.stringify(arguments[1]));

        // override inputs
        if (oldState?.gmExtra?.overrides) {
          const overrides = oldState.gmExtra.overrides;

          for (let i = 0; i !== oldState.discs.length; i++) {
            if (!overrides[i] || !oldState.discs[i]) continue;

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

        gmReplaceAccessors.disableDeathBarrier = !!oldState.gmExtra?.disableDeathBarrier;

        if (oldState.rl === 0 && arguments[4].GMMode) {
          gmReplaceAccessors.disableDeathBarrier = true;
        }

        let state = stepOLD(...arguments);

        if (state.ftu == 0) {
          gm.graphics.renderUpdates = [];
        }

        // make seed based on scene element positions and game state seed
        let randomSeed = 0;
        for (let i = 0; i < state.physics.bodies.length; i++) {
          if (state.physics.bodies[i]) {
            randomSeed = randomSeed + state.physics.bodies[i].p[0] + state.physics.bodies[i].p[1] + state.physics.bodies[i].a;
          }
        }
        for (let i = 0; i < state.discs.length; i++) {
          if (state.discs[i]) {
            randomSeed = randomSeed + state.discs[i].x + state.discs[i].y + state.discs[i].xv + state.discs[i].yv;
          }
        }
        randomSeed += state.rl;
        randomSeed /= state.seed;
        gm.physics.pseudoRandom = new seedrandom(randomSeed);

        /* #region EXTRA PROPERTY MANAGE */
        // this is where props added by gmmaker into the state, such as
        // nolerp and visibility of objects, are managed

        state.gmExtra = JSON.parse(JSON.stringify(oldState.gmExtra));

        if (!state.gmExtra.initialPlayers) state.gmExtra.initialPlayers = gm.blockly.funcs.getAllPlayerIds(state);

        if (!state.gmExtra.variables) {
          state.gmExtra.variables = {global: {}};
          state.gmExtra.keepVariables = [];

          const keepVariables = oldState.gmExtra?.keepVariables;

          if (keepVariables) {
            for (let v = 0; v < keepVariables.length; v++) {
              const varName = keepVariables[v];
              if (!oldState.gmExtra?.variables?.global[varName]) continue;

              state.gmExtra.variables.global[varName] = oldState.gmExtra.variables.global[varName];
            }
          }

          for (let i = 0; i < state.discs.length; i++) {
            if (!state.discs[i]) continue;

            state.gmExtra.variables[i] = {};

            if (!keepVariables) continue;

            for (let v = 0; v < keepVariables.length; v++) {
              const varName = keepVariables[v];
              if (!oldState.gmExtra.variables[i][varName]) continue;

              state.gmExtra.variables[i][varName] = oldState.gmExtra.variables[i][varName];
            }
          }

          state.gmExtra.cameras = [];
          for (let i = 0; i < state.discs.length; i++) {
            if (!state.discs[i]) continue;

            state.gmExtra.cameras[i] = {
              xpos: 365 / state.physics.ppm,
              ypos: 250 / state.physics.ppm,
              angle: 0,
              xscal: 1,
              yscal: 1,
              xskew: 0,
              yskew: 0,
              doLerp: true,
            };
          }

          state.gmExtra.disableDeathBarrier = false;
        }

        // graphics phys step update
        gm.graphics.onPhysStep(state);

        // clean kills list
        state.gmExtra.kills = [];

        gm.physics.gameState = state;

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

          if (discBody && state.discs[discBody.arrayID]) { // check if self element exists
            switch (collisionBody.type) {
              case 'disc':
                if (discBody.team === 1 || discBody.team !== collisionBody.team && // check for self and team collisions
                    state.discs[collisionBody.arrayID]) { // check if collided element exists
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
                    state.projectiles[collisionBody.arrayID]) { // check if collided element exists
                  gm.physics.onPlayerArrowCollision(discBody.arrayID, collisionBody.discID, arrowNumber);
                }
                break;
              case 'phys':
                if (state.physics.bodies[collisionBody.arrayID]?.fx.length > 0) { // check if collided element exists
                  gm.physics.onPlayerPlatformCollision(discBody.arrayID, collisionBody.arrayID, state.physics.bodies[collisionBody.arrayID].fx.indexOf(collisionFixture.arrayID) + 1, isFixtureA ? {x: -normal.x, y: -normal.y} : normal);
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

          if (arrowBody && state.projectiles[arrowBody.arrayID] && state.discs[arrowBody.discID]) { // check if self element exists
            switch (collisionBody.type) {
              case 'disc':
                if (arrowBody.discID !== collisionBody.arrayID && (collisionBody.team === 1 || arrowBody.team !== collisionBody.team) && // check for self and team collisions
                  state.discs[collisionBody.arrayID]) { // check if collided element exists
                  gm.physics.onArrowPlayerCollision(arrowBody.discID, arrowNumberA, collisionBody.arrayID);
                }
                break;
              case 'arrow':
                if (state.projectiles[collisionBody.arrayID] && state.discs[collisionBody.discID]) { // check if collided element exists
                  gm.physics.onArrowArrowCollision(arrowBody.discID, arrowNumberA, collisionBody.discID, arrowNumberB);
                  gm.physics.onArrowArrowCollision(collisionBody.discID, arrowNumberB, arrowBody.discID, arrowNumberA);
                }
                break;
              case 'phys':
                if (state.physics.bodies[collisionBody.arrayID]?.fx.length > 0) { // check if collided element exists
                  gm.physics.onArrowPlatformCollision(arrowBody.discID, arrowNumberA, collisionBody.arrayID, state.physics.bodies[collisionBody.arrayID].fx.indexOf(collisionFixture.arrayID) + 1, isFixtureA ? {x: -normal.x, y: -normal.y} : normal);
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

          if (platBody && state.physics.bodies[platBody.arrayID]?.fx.length > 0) { // check if self element exists
            const ownShapeId = state.physics.bodies[platBody.arrayID].fx.indexOf(platFixture.arrayID) + 1;

            for (let i = 0; i < state.discs.length; i++) {
              if (!state.discs[i]) continue;
              switch (collisionBody.type) {
                case 'disc':
                  if (!state.discs[collisionBody.arrayID]) break; // check if collided element exists

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

                  if (!state.discs[collisionBody.discID] || !state.projectiles[collisionBody.arrayID]) break; // check if collided element exists

                  gm.physics.onPlatformArrowCollision(i, platBody.arrayID, ownShapeId, collisionBody.discID, arrowNumber);
                  break;
                case 'phys':
                  if (state.physics.bodies[collisionBody.arrayID]?.fx.length == 0) break; // check if collided element exists

                  const colShapeId = state.physics.bodies[collisionBody.arrayID].fx.indexOf(collisionFixture.arrayID) + 1;

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
          state = gm.physics.gameState;
        }

        gm.physics.gameState = state;

        for (let i = 0; i < oldState.discs.length; i++) {
          if (oldState.discs[i] && !state.discs[i]) {
            const currentDisc = gm.physics.gameState.discs[i];
            gm.physics.gameState.discs[i] = oldState.discs[i];
            gm.physics.onPlayerDie(i);
            gm.physics.gameState.discs[i] = currentDisc;
          } else if (state.discDeaths[state.discDeaths.length - 1]?.i == i && state.discDeaths[state.discDeaths.length - 1]?.f == 0) {
            gm.physics.onPlayerDie(i);
          }
        }

        if (gm.physics.gameState.rl === 1) {
          gm.lobby.roundStarting = false;

          gm.blockly.funcs.clearGraphics();

          for (let i = 0; i !== state.gmExtra.initialPlayers.length; i++) {
            const id = state.gmExtra.initialPlayers[i];

            if (!gm.inputs.allPlayerInputs[id]) {
              gm.inputs.allPlayerInputs[id] = {left: false, right: false, up: false, down: false, action: false, action2: false};
            }

            gm.physics.onFirstStep(id);
          }
        } else if (!gm.physics.forceGameState && gm.physics.gameState.ftu === -1) {
          for (let i = 0; i !== state.gmExtra.initialPlayers.length; i++) {
            const id = state.gmExtra.initialPlayers[i];

            if (!gm.inputs.allPlayerInputs[id]) {
              gm.inputs.allPlayerInputs[id] = {left: false, right: false, up: false, down: false, action: false, action2: false};
            }

            gm.physics.onStep(id);
          }
        }

        if (state.ftu > 0) gm.lobby.roundStarting = true;

        if (gm.physics.forceGameState) {
          gm.physics.forceGameState = false;
          state = gm.physics.gameState;
        }

        gm.physics.gameState = state;

        gm.physics.collisionsThisStep = [];

        if (window.gmReplaceAccessors.endStep) window.gmReplaceAccessors.endStep();

        return state;
      } catch (e) {
        if (gm.graphics.inReplay()) throw e;
        if (!gm.lobby.gameCrashed) {
          if (e === 'gmInfiniteLoop') {
            gm.lobby.haltCausedByLoop = true;
          } else {
            console.error(e);
          }
          gm.lobby.gameCrashed = true;
          setTimeout(gm.lobby.gameHalt, 500); // gotta make sure we're out of the step function!
        }
        return oldState;
      }
    };
  },
  initContactListener: function() {
    PhysicsClass.contactListener.PostSolveOLD = PhysicsClass.contactListener.PostSolve;
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

      return PhysicsClass.contactListener.PostSolveOLD(...arguments);
    };
  },
  initCreateState: function() {
    PhysicsClass.createNewStateOLD = PhysicsClass.createNewState;

    PhysicsClass.createNewState = function() {
      const state = PhysicsClass.createNewStateOLD(...arguments);

      if (!gm.lobby.networkEngine) return state;
      if (gm.lobby.networkEngine.hostID !== gm.lobby.networkEngine.getLSID()) return state;
      if (!gm.blockly.savedXml || gm.blockly.savedXml?.getElementsByTagName('block').length == 0) return state;

      /* #region gmInitial CREATION */
      const gmInitial = {};

      const playerInfo = [];
      for (let i = 0; i < (gm.lobby.playerArray?.length ?? 0); i++) {
        const player = gm.lobby.playerArray[i];

        if (!player) continue;

        const playerInfoEntry = {
          userName: player.userName,
          guest: player.guest,
          level: player.level,
          team: player.team,
          skinBg: player.avatar.bc,
          skinColours: [],
        };

        for (let i = 0; i < player.avatar.layers.length; i++) {
          if (playerInfoEntry.skinColours.includes(player.avatar.layers[i].color)) continue;
          playerInfoEntry.skinColours.push(player.avatar.layers[i].color);
        }

        playerInfo[i] = playerInfoEntry;
      }

      gmInitial.lobby = {
        clientId: gm.lobby.networkEngine.getLSID(),
        hostId: gm.lobby.networkEngine.hostID,
        allPlayerIds: [],
        playerInfo: playerInfo,
        settings: gm.lobby.mpSession.getGameSettings(),
        seed: Math.round(Math.random() * 1000000),
      };
      for (let i = 0; i < (gm.lobby.playerArray?.length ?? 0); i++) {
        if (!gm.lobby.playerArray[i]) continue;
        gmInitial.lobby.allPlayerIds.push(i);
      }

      state.gmInitial = JSON.parse(JSON.stringify(gmInitial));
      /* #endregion gmInitial CREATION */

      /* #region gmExtra CREATION */
      state.gmExtra = {};
      /* #endregion gmExtra CREATION */

      return state;
    };
  },
  gameState: null,
  setGameState: function(newstate) {
    this.forceGameState = true;
    this.gameState = newstate;
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
