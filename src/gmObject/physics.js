/* eslint-disable camelcase */
/* eslint-disable new-cap */
export default {
  init: function() {
    this.initb2Step();
    this.initGameState();
  },
  initb2Step: function() {
    Box2D.Dynamics.b2World.prototype.Step_OLD = Box2D.Dynamics.b2World.prototype.Step;
    Box2D.Dynamics.b2World.prototype.Step = function() {
      // management of the die
      if (PhysicsClass.globalStepVars.inputState) {
        const kills = PhysicsClass.globalStepVars.inputState.physics.bodies[0].cf.kills;

        if (kills) {
          for (let i = 0; i != kills.length; i++) {
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

        for (let i = 0; i != arguments[0].discs.length; i++) {
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

      let gst = step_OLD(...arguments);

      if (!PhysicsClass.contactListener.EndContact_OLD) gm.physics.initContactListener();

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
      for (let i = 0; i != gm.physics.collisionsThisStep.length; i++) {
        const fixtureA = gm.physics.collisionsThisStep[i].contact.GetFixtureA().GetBody();
        const fixtureB = gm.physics.collisionsThisStep[i].contact.GetFixtureB().GetBody();
        const normal = gm.physics.collisionsThisStep[i].manifold.m_normal;
        const projs = gm.physics.gameState.projectiles;

        // disc collision
        let discFixture;
        let collisionFixture;

        if (fixtureA.GetUserData().type == 'disc') {
          discFixture = fixtureA.GetUserData();
          collisionFixture = fixtureB.GetUserData();
        } else if (fixtureB.GetUserData().type == 'disc') {
          discFixture = fixtureB.GetUserData();
          collisionFixture = fixtureA.GetUserData();
        }

        if (discFixture) {
          switch (collisionFixture.type) {
            case 'disc':
              if (discFixture.team == 1 || discFixture.team != collisionFixture.team) {
                gm.physics.onPlayerPlayerCollision(discFixture.arrayID, collisionFixture.arrayID);
                gm.physics.onPlayerPlayerCollision(collisionFixture.arrayID, discFixture.arrayID);
              }
              break;
            case 'arrow':
              let arrowNumber = 0;
              let accum = 1;
              for (let a = 0; a != projs.length; a++) {
                if (collisionFixture && collisionFixture.arrayID == a) {
                  arrowNumber = accum;
                } else if (collisionFixture && projs[a] && collisionFixture.discID == projs[a].did) {
                  accum++;
                }
              }

              if (arrowNumber == 0) break;

              if (discFixture.arrayID != collisionFixture.discID && (discFixture.team == 1 || discFixture.team != collisionFixture.team)) {
                gm.physics.onPlayerArrowCollision(discFixture.arrayID, collisionFixture.discID, arrowNumber);
              }
              break;
            case 'phys':
              gm.physics.onPlayerPlatformCollision(discFixture.arrayID, normal);
              break;
          }
        }

        // arrow collision
        let arrowFixture;
        let arrowNumberA = 0;
        let arrowNumberB = 0;

        if (fixtureA.GetUserData().type == 'arrow') {
          arrowFixture = fixtureA.GetUserData();
          collisionFixture = fixtureB.GetUserData();
        } else if (fixtureB.GetUserData().type == 'arrow') {
          arrowFixture = fixtureB.GetUserData();
          collisionFixture = fixtureA.GetUserData();
        }

        let accumA = 1;
        let accumB = 1;
        for (let a = 0; a != projs.length; a++) {
          if (arrowFixture && arrowFixture.arrayID == a) {
            arrowNumberA = accumA;
          } else if (arrowFixture && projs[a] && arrowFixture.discID == projs[a].did) {
            accumA++;
          }

          if (collisionFixture && collisionFixture.arrayID && collisionFixture.arrayID == a) {
            arrowNumberB = accumB;
          } else if (collisionFixture && collisionFixture.discID && projs[a] && collisionFixture.discID == projs[a].did) {
            accumB++;
          }
        }

        if (arrowFixture) {
          switch (collisionFixture.type) {
            case 'disc':
              if (arrowFixture.discID != collisionFixture.arrayID && (collisionFixture.team == 1 || arrowFixture.team != collisionFixture.team)) {
                gm.physics.onArrowPlayerCollision(arrowFixture.discID, arrowNumberA, collisionFixture.arrayID);
              }
              break;
            case 'arrow':
              gm.physics.onArrowArrowCollision(arrowFixture.discID, arrowNumberA, collisionFixture.discID, arrowNumberB);
              gm.physics.onArrowArrowCollision(collisionFixture.discID, arrowNumberB, arrowFixture.discID, arrowNumberA);
              break;
            case 'phys':
              gm.physics.onArrowPlatformCollision(arrowFixture.discID, arrowNumberA, normal);
              break;
          }
        }
      }

      gm.physics.collisionsThisStep = [];

      // step handling
      if (gm.physics.forceGameState) {
        gm.physics.forceGameState = false;
        gst = gm.physics.gameState;
      }
      gm.physics.gameState = gst;

      if (gm.lobby.roundStarting && gm.physics.gameState.ftu == -1) {
        gm.lobby.roundStarting = false;

        gm.blockly.funcs.clearGraphics();

        for (let i = 0; i != gm.physics.gameState.discs.length; i++) {
          if (gm.physics.gameState.discs[i]) {
            if (!gm.inputs.allPlayerInputs[i]) {
              gm.inputs.allPlayerInputs[i] = {left: false, right: false, up: false, down: false, action: false, action2: false};
            }

            gm.physics.onFirstStep(i);
          }
        }
      } else if (!gm.physics.forceGameState && gm.physics.gameState.ftu == -1) {
        for (let i = 0; i != gm.physics.gameState.discs.length; i++) {
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

      return gst;
    };
  },
  initContactListener: function() {
    PhysicsClass.contactListener.EndContact_OLD = PhysicsClass.contactListener.EndContact;
    PhysicsClass.contactListener.EndContact = function(contact) {
      const worldManifold = new Box2D.Collision.b2WorldManifold();
      contact.GetWorldManifold(worldManifold);
      gm.physics.collisionsThisStep.push({contact: contact, manifold: worldManifold});
      return PhysicsClass.contactListener.EndContact_OLD(...arguments);
    };
  },
  gameState: null,
  setGameState: function(newgst) {
    this.forceGameState = true;
    this.gameState = newgst;
  },
  forceGameState: false,
  collisionsThisStep: [],
  onStep: function() { },
  onFirstStep: function() { },
  onPlayerPlayerCollision: function() { },
  onPlayerArrowCollision: function() { },
  onPlayerPlatformCollision: function() { },
  onArrowPlayerCollision: function() { },
  onArrowArrowCollision: function() { },
  onArrowPlatformCollision: function() { },
  getPlayerLastArrow: function(playerid) {
    const projs = this.gameState.projectiles;
    for (let i = projs.length; i != -1; i -= 1) {
      if (projs[i] && projs[i].did == playerid) {
        return projs[i];
      }
    }
    return null;
  },
};
