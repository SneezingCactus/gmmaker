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
            const discID = kills[i];

            if (PhysicsClass.globalStepVars.discs[discID]) {
              PhysicsClass.globalStepVars.discs[discID].diedThisStep = 3;
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

      let gst = step_OLD(...arguments);

      if (gst.ftu == 0) {
        gm.graphics.renderUpdates = [];
      }

      // make seed based on scene element positions and game state seed
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

      gm.physics.gameState = gst;

      if (!gm.physics.gameState.physics.bodies[0]) {
        gm.physics.gameState.physics.bodies[0] = {
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

      // collision handling
      for (let i = 0; i !== gm.physics.collisionsThisStep.length; i++) {
        const fixtureA = gm.physics.collisionsThisStep[i].fixtureABodyData;
        const fixtureB = gm.physics.collisionsThisStep[i].fixtureBBodyData;
        const normal = gm.physics.collisionsThisStep[i].normal;
        const projs = gm.physics.gameState.projectiles;

        // disc collision
        let discFixture;
        let collisionFixture;
        let isFixtureA = false;

        if (fixtureA.type === 'disc') {
          isFixtureA = true;
          discFixture = fixtureA;
          collisionFixture = fixtureB;
        } else if (fixtureB.type === 'disc') {
          isFixtureA = false;
          discFixture = fixtureB;
          collisionFixture = fixtureA;
        }

        if (discFixture && gst.discs[discFixture.arrayID]) { // check if self element exists
          switch (collisionFixture.type) {
            case 'disc':
              if (discFixture.team === 1 || discFixture.team !== collisionFixture.team && // check for self and team collisions
                  gst.discs[collisionFixture.arrayID]) { // check if collided element exists
                gm.physics.onPlayerPlayerCollision(discFixture.arrayID, collisionFixture.arrayID);
                gm.physics.onPlayerPlayerCollision(collisionFixture.arrayID, discFixture.arrayID);
              }
              break;
            case 'arrow':
              let arrowNumber = 0;
              let accum = 1;
              for (let a = 0; a !== projs.length; a++) {
                if (collisionFixture && collisionFixture.arrayID === a) {
                  arrowNumber = accum;
                } else if (collisionFixture && projs[a] && collisionFixture.discID === projs[a].did) {
                  accum++;
                }
              }

              if (arrowNumber === 0) break;

              if (discFixture.arrayID !== collisionFixture.discID && (discFixture.team === 1 || discFixture.team !== collisionFixture.team) && // check for self and team collisions
                  gst.projectiles[collisionFixture.arrayID]) { // check if collided element exists
                gm.physics.onPlayerArrowCollision(discFixture.arrayID, collisionFixture.discID, arrowNumber);
              }
              break;
            case 'phys':
              if (gst.physics.bodies[collisionFixture.arrayID]?.fx.length > 0) { // check if collided element exists
                gm.physics.onPlayerPlatformCollision(discFixture.arrayID, collisionFixture.arrayID, isFixtureA ? {x: -normal.x, y: -normal.y} : normal);
              }
              break;
          }
        }

        // arrow collision
        let arrowFixture;
        let arrowNumberA = 0;
        let arrowNumberB = 0;

        if (fixtureA.type === 'arrow') {
          isFixtureA = true;
          arrowFixture = fixtureA;
          collisionFixture = fixtureB;
        } else if (fixtureB.type === 'arrow') {
          isFixtureA = false;
          arrowFixture = fixtureB;
          collisionFixture = fixtureA;
        }

        let accumA = 1;
        let accumB = 1;
        for (let a = 0; a !== projs.length; a++) {
          if (arrowFixture && arrowFixture.arrayID === a) {
            arrowNumberA = accumA;
          } else if (arrowFixture && projs[a] && arrowFixture.discID === projs[a].did) {
            accumA++;
          }

          if (collisionFixture && collisionFixture.arrayID && collisionFixture.arrayID === a) {
            arrowNumberB = accumB;
          } else if (collisionFixture && collisionFixture.discID && projs[a] && collisionFixture.discID === projs[a].did) {
            accumB++;
          }
        }

        if (arrowFixture && gst.projectiles[arrowFixture.arrayID] && gst.discs[arrowFixture.discID]) { // check if self element exists
          switch (collisionFixture.type) {
            case 'disc':
              if (arrowFixture.discID !== collisionFixture.arrayID && (collisionFixture.team === 1 || arrowFixture.team !== collisionFixture.team) && // check for self and team collisions
                gst.discs[collisionFixture.arrayID]) { // check if collided element exists
                gm.physics.onArrowPlayerCollision(arrowFixture.discID, arrowNumberA, collisionFixture.arrayID);
              }
              break;
            case 'arrow':
              if (gst.projectiles[collisionFixture.arrayID] && gst.discs[collisionFixture.discID]) { // check if collided element exists
                gm.physics.onArrowArrowCollision(arrowFixture.discID, arrowNumberA, collisionFixture.discID, arrowNumberB);
                gm.physics.onArrowArrowCollision(collisionFixture.discID, arrowNumberB, arrowFixture.discID, arrowNumberA);
              }
              break;
            case 'phys':
              if (gst.physics.bodies[collisionFixture.arrayID]?.fx.length > 0) { // check if collided element exists
                gm.physics.onArrowPlatformCollision(arrowFixture.discID, arrowNumberA, collisionFixture.arrayID, isFixtureA ? {x: -normal.x, y: -normal.y} : normal);
              }
              break;
          }
        }

        // platform collision
        let platFixture;

        if (fixtureA.type === 'phys') {
          isFixtureA = true;
          platFixture = fixtureA;
          collisionFixture = fixtureB;
        } else if (fixtureB.type === 'phys') {
          isFixtureA = false;
          platFixture = fixtureB;
          collisionFixture = fixtureA;
        }

        if (platFixture && gst.physics.bodies[platFixture.arrayID]?.fx.length > 0) { // check if self element exists
          for (let i = 0; i != gst.discs.length; i++) {
            if (gst.discs[i]) {
              switch (collisionFixture.type) {
                case 'disc':
                  if (gst.discs[collisionFixture.arrayID]) { // check if collided element exists
                    gm.physics.onPlatformPlayerCollision(i, platFixture.arrayID, collisionFixture.arrayID);
                  }
                  break;
                case 'arrow':
                  let arrowNumber = 0;
                  let accum = 1;
                  for (let a = 0; a !== projs.length; a++) {
                    if (collisionFixture && collisionFixture.arrayID === a) {
                      arrowNumber = accum;
                    } else if (collisionFixture && projs[a] && collisionFixture.discID === projs[a].did) {
                      accum++;
                    }
                  }

                  if (arrowNumber === 0) break;

                  if (gst.discs[collisionFixture.discID] && gst.projectiles[collisionFixture.arrayID]) { // check if collided element exists
                    gm.physics.onPlatformArrowCollision(i, platFixture.arrayID, collisionFixture.discID, arrowNumber);
                  }
                  break;
                case 'phys':
                  if (gst.physics.bodies[collisionFixture.arrayID]?.fx.length > 0) { // check if collided element exists
                    gm.physics.onPlatformPlatformCollision(i, platFixture.arrayID, collisionFixture.arrayID, isFixtureA ? {x: -normal.x, y: -normal.y} : normal);
                    gm.physics.onPlatformPlatformCollision(i, collisionFixture.arrayID, platFixture.arrayID, isFixtureA ? normal : {x: -normal.x, y: -normal.y});
                  }
                  break;
              }
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

      for (let i = 0; i != arguments[0].discs.length; i++) {
        if ((arguments[0].discs[i] && !gst.discs[i]) || // no-respawn player deaths and disconnects
            (gst.discDeaths[gst.discDeaths.length - 1]?.i == i && gst.discDeaths[gst.discDeaths.length - 1]?.f == 0)) { // respawn player deaths
          const currentDisc = gm.physics.gameState.discs[i];
          gm.physics.gameState.discs[i] = arguments[0].discs[i];
          gm.physics.onPlayerDie(i);
          gm.physics.gameState.discs[i] = currentDisc;
        }
      }

      if (gm.physics.gameState.ftu === 0) {
        gm.lobby.roundStarting = false;

        gm.blockly.funcs.clearGraphics();

        for (let i = 0; i !== gm.physics.gameState.discs.length; i++) {
          if (gm.physics.gameState.discs[i]) {
            if (!gm.inputs.allPlayerInputs[i]) {
              gm.inputs.allPlayerInputs[i] = {left: false, right: false, up: false, down: false, action: false, action2: false};
            }

            gm.physics.onFirstStep(i);
          }
        }
      } else if (!gm.physics.forceGameState && gm.physics.gameState.ftu === -1) {
        for (let i = 0; i !== gm.physics.gameState.discs.length; i++) {
          if (gm.physics.gameState.discs[i]) {
            if (!gm.inputs.allPlayerInputs[i]) {
              gm.inputs.allPlayerInputs[i] = {left: false, right: false, up: false, down: false, action: false, action2: false};
            }
            gm.physics.onStep(i);
          }
        }
      }

      if (gst.ftu > 0) gm.lobby.roundStarting = true;

      if (gm.physics.forceGameState) {
        gm.physics.forceGameState = false;
        gst = gm.physics.gameState;
      }

      gm.physics.gameState = gst;

      gm.graphics.doRenderUpdates(gst);

      gm.physics.collisionsThisStep = [];

      if (window.GMEndStep) window.GMEndStep();

      return gst;
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
