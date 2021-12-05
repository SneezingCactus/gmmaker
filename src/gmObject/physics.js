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
      for (let i = 0; i != gm.physics.killsThisStep.length; i++) {
        const discID = gm.physics.killsThisStep[i];

        if (PhysicsClass.globalStepVars.discs[discID]) {
          PhysicsClass.globalStepVars.discs[discID].diedThisStep = 3;
        }
      }
      gm.physics.killsThisStep = [];
      return this.Step_OLD(...arguments);
    };
  },
  initGameState: function() {
    const step_OLD = PhysicsClass.prototype.step;
    PhysicsClass.prototype.step = function() {
      let gst = step_OLD(...arguments);
      if (!PhysicsClass.contactListener.EndContact_OLD) gm.physics.initContactListener();
      gm.inputs.allPlayerInputs = arguments[1];

      gm.physics.gameState = gst;

      // collision handling
      for (let i = 0; i != gm.physics.collisionsThisStep.length; i++) {
        const fixtureA = gm.physics.collisionsThisStep[i].GetFixtureA().GetBody();
        const fixtureB = gm.physics.collisionsThisStep[i].GetFixtureB().GetBody();

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
                gm.physics.onPlayerPlayerCollision(discFixture.arrayID);
                gm.physics.onPlayerPlayerCollision(collisionFixture.arrayID);
              }
              break;
            case 'arrow':
              if (discFixture.arrayID != collisionFixture.discID && (discFixture.team == 1 || discFixture.team != collisionFixture.team)) {
                gm.physics.onPlayerArrowCollision(discFixture.arrayID);
              }
              break;
            case 'phys':
              gm.physics.onPlayerPlatformCollision(discFixture.arrayID);
              break;
          }
        }

        // arrow collision
        let arrowFixture;

        if (fixtureA.GetUserData().type == 'arrow') {
          arrowFixture = fixtureA.GetUserData();
          collisionFixture = fixtureB.GetUserData();
        } else if (fixtureB.GetUserData().type == 'arrow') {
          arrowFixture = fixtureB.GetUserData();
          collisionFixture = fixtureA.GetUserData();
        }

        if (arrowFixture) {
          switch (collisionFixture.type) {
            case 'disc':
              if (arrowFixture.discID != collisionFixture.arrayID && (collisionFixture.team == 1 || arrowFixture.team != collisionFixture.team)) {
                gm.physics.onArrowPlayerCollision(arrowFixture.discID);
              }
              break;
            case 'arrow':
              gm.physics.onArrowArrowCollision(arrowFixture.discID);
              gm.physics.onArrowArrowCollision(collisionFixture.discID);
              break;
            case 'phys':
              gm.physics.onArrowPlatformCollision(arrowFixture.discID);
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
        for (let i = 0; i != gm.physics.gameState.discs.length; i++) {
          if (gm.physics.gameState.physics.bodies[0].cf[i]) {
            gm.physics.gameState.physics.bodies[0].cf[i] = [];
          }
          if (gm.physics.gameState.discs[i]) {
            if (!gm.inputs.allPlayerInputs[i]) {
              gm.inputs.allPlayerInputs[i] = {left: false, right: false, up: false, down: false, action: false, action2: false};
            }
            if (gm.blockly.vars[0]) {
              gm.blockly.vars[i] = gm.blockly.vars[0];
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
      gm.physics.collisionsThisStep.push(contact);
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
  killsThisStep: [],
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
