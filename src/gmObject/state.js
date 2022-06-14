/* eslint-disable camelcase */
/* eslint-disable new-cap */

import seedrandom from 'seedrandom';
import declareMeths from '!raw-loader!../ses/declareMeths';

export default {
  init: function() {
    // we must first init the SES part then the rest
    const compContainer = document.createElement('iframe');
    document.head.appendChild(compContainer);

    const sesScript = document.createElement('script');
    sesScript.src = 'https://unpkg.com/ses@0.15.15/dist/ses.umd.min.js';
    compContainer.contentDocument.head.appendChild(sesScript);

    sesScript.addEventListener('load', function() {
      compContainer.contentWindow.lockdown({errorTaming: 'unsafe'});

      // mr whiter whee is my 50002 km/h of methé
      // (meth is short for method here)

      gm.state.sesMethNames = compContainer.contentWindow.eval(declareMeths);
      gm.state.safeEvalWindow = compContainer.contentWindow;

      gm.state.resetSES();
      gm.state.initb2Step();
      gm.state.initGameState();
    });
  },
  resetSES: function() {
    const meths = {};

    for (const methName of this.sesMethNames) {
      meths[methName] = this.safeEvalWindow[methName];
    }

    this.safeEval = new this.safeEvalWindow.Compartment(meths);
    this.safeEval.evaluate('this.game = {state: null, inputs: null, playerInfo: null, gameSettings: null, misc: null}');
  },
  initb2Step: function() {
    Box2D.Dynamics.b2World.prototype.Step_OLD = Box2D.Dynamics.b2World.prototype.Step;
    Box2D.Dynamics.b2World.prototype.Step = function() {
      if (!PhysicsClass.contactListener.PostSolve_OLD) gm.state.initContactListener();

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

        // override inputs
        if (arguments[0]?.gmExtra?.overrides) {
          const overrides = arguments[0].gmExtra.overrides;

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

        gm.state.collisionsThisStep = [];

        gmReplaceAccessors.disableDeathBarrier = !!arguments[0].gmExtra?.disableDeathBarrier;

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
        gm.state.pseudoRandom = new seedrandom(randomSeed);

        // get or create gm state
        if (!arguments[0].gmExtra || gst.rl === 0) {
          gst.gmExtra = {};

          gst.gmExtra.initialPlayers = gm.editor.funcs.getAllPlayerIds(gst);

          gst.gmExtra.variables = {global: {}};
          gst.gmExtra.keepVariables = [];

          const keepVariables = arguments[0].gmExtra?.keepVariables;

          if (keepVariables) {
            for (let v = 0; v < keepVariables.length; v++) {
              const varName = keepVariables[v];
              if (!arguments[0].gmExtra?.variables?.global[varName]) continue;

              gst.gmExtra.variables.global[varName] = arguments[0].gmExtra.variables.global[varName];
            }
          }

          for (let i = 0; i < gst.discs.length; i++) {
            if (!gst.discs[i]) continue;

            gst.gmExtra.variables[i] = {};

            if (!keepVariables) continue;

            for (let v = 0; v < keepVariables.length; v++) {
              const varName = keepVariables[v];
              if (!arguments[0].gmExtra.variables[i][varName]) continue;

              gst.gmExtra.variables[i][varName] = arguments[0].gmExtra.variables[i][varName];
            }
          }

          gst.gmExtra.cameras = [];
          for (let i = 0; i < gst.discs.length; i++) {
            if (!gst.discs[i]) continue;

            gst.gmExtra.cameras[i] = {
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

          gst.gmExtra.disableDeathBarrier = false;
        } else {
          gst.gmExtra = JSON.parse(JSON.stringify(arguments[0].gmExtra));
        }

        // clean kills list
        gst.gmExtra.kills = [];

        // graphics phys step update
        gm.graphics.onPhysStep(gst);

        // send info to SES
        gm.state.gameState = gst;

        for (let i = 0; i !== gst.discs.length; i++) {
          if (!gst.discs[i]) continue;

          if (!arguments[1][i]) {
            arguments[1][i] = {left: false, right: false, up: false, down: false, action: false, action2: false};
          }

          if (!gst.discs[i].swing) gst.discs[i].swing = false;
        }

        gm.state.currentInputs = arguments[1];

        gm.state.safeEval.evaluate('const info = getDynamicInfo(); game.state = info.state; game.inputs = info.inputs;');

        // collision handling
        for (let i = 0; i !== gm.state.collisionsThisStep.length; i++) {
          const bodyA = gm.state.collisionsThisStep[i].fixtureABodyData;
          const bodyB = gm.state.collisionsThisStep[i].fixtureBBodyData;
          const fixtureA = gm.state.collisionsThisStep[i].fixtureAData;
          const fixtureB = gm.state.collisionsThisStep[i].fixtureBData;
          const normal = gm.state.collisionsThisStep[i].normal;

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
                  gm.state.events.onPlayerPlayerCollision(discBody.arrayID, collisionBody.arrayID);
                  gm.state.events.onPlayerPlayerCollision(collisionBody.arrayID, discBody.arrayID);
                }
                break;
              case 'arrow':
                if (discBody.arrayID !== collisionBody.discID && (discBody.team === 1 || discBody.team !== collisionBody.team) && // check for self and team collisions
                    gst.projectiles[collisionBody.arrayID]) { // check if collided element exists
                  gm.state.events.onPlayerArrowCollision(discBody.arrayID, collisionBody.arrayID);
                }
                break;
              case 'phys':
                if (gst.physics.bodies[collisionBody.arrayID]?.fx.length > 0) { // check if collided element exists
                  gm.state.events.onPlayerPlatformCollision(discBody.arrayID, collisionBody.arrayID, gst.physics.bodies[collisionBody.arrayID].fx.indexOf(collisionFixture.arrayID) + 1, isFixtureA ? {x: -normal.x, y: -normal.y} : normal);
                }
                break;
            }
          }

          // arrow collision
          let arrowBody;

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

          if (arrowBody && gst.projectiles[arrowBody.arrayID] && gst.discs[arrowBody.discID]) { // check if self element exists
            switch (collisionBody.type) {
              case 'disc':
                if (arrowBody.discID !== collisionBody.arrayID && (collisionBody.team === 1 || arrowBody.team !== collisionBody.team) && // check for self and team collisions
                  gst.discs[collisionBody.arrayID]) { // check if collided element exists
                  gm.state.events.onArrowPlayerCollision(arrowBody.arrayID, collisionBody.arrayID);
                }
                break;
              case 'arrow':
                if (gst.projectiles[collisionBody.arrayID] && gst.discs[collisionBody.discID]) { // check if collided element exists
                  gm.state.events.onArrowArrowCollision(arrowBody.arrayID, collisionBody.arrayID);
                  gm.state.events.onArrowArrowCollision(collisionBody.arrayID, arrowBody.arrayID);
                }
                break;
              case 'phys':
                if (gst.physics.bodies[collisionBody.arrayID]?.fx.length > 0) { // check if collided element exists
                  gm.state.events.onArrowPlatformCollision(arrowBody.arrayID, collisionBody.arrayID, gst.physics.bodies[collisionBody.arrayID].fx.indexOf(collisionFixture.arrayID) + 1, isFixtureA ? {x: -normal.x, y: -normal.y} : normal);
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
            for (let i = 0; i < gst.discs.length; i++) {
              if (gst.discs[i]) {
                switch (collisionBody.type) {
                  case 'disc':
                    if (gst.discs[collisionBody.arrayID]) { // check if collided element exists
                      gm.state.events.onPlatformPlayerCollision(i, platBody.arrayID, platFixture.arrayID, collisionBody.arrayID);
                    }
                    break;
                  case 'arrow':
                    if (gst.discs[collisionBody.discID] && gst.projectiles[collisionBody.arrayID]) { // check if collided element exists
                      gm.state.events.onPlatformArrowCollision(i, platBody.arrayID, platFixture.arrayID, collisionBody.arrayID);
                    }
                    break;
                  case 'phys':
                    if (gst.physics.bodies[collisionBody.arrayID]?.fx.length > 0) { // check if collided element exists
                      gm.state.events.onPlatformPlatformCollision(i, platBody.arrayID, platFixture.arrayID, collisionBody.arrayID, gst.physics.bodies[collisionBody.arrayID].fx.indexOf(collisionFixture.arrayID) + 1, isFixtureA ? {x: -normal.x, y: -normal.y} : normal);
                      gm.state.events.onPlatformPlatformCollision(i, collisionBody.arrayID, collisionFixture.arrayID, platBody.arrayID, gst.physics.bodies[platBody.arrayID].fx.indexOf(platFixture.arrayID) + 1, isFixtureA ? normal : {x: -normal.x, y: -normal.y});
                    }
                    break;
                }
              }
            }
          }
        }

        /*
        for (let i = 0; i < arguments[0].discs.length; i++) {
          if (arguments[0].discs[i] && !gst.discs[i]) {
            const currentDisc = gm.state.gameState.discs[i];
            gm.state.gameState.discs[i] = arguments[0].discs[i];
            gm.state.events.onPlayerDie(i);
            gm.state.gameState.discs[i] = currentDisc;
          } else if (gst.discDeaths[gst.discDeaths.length - 1]?.i == i && gst.discDeaths[gst.discDeaths.length - 1]?.f == 0) {
            gm.state.events.onPlayerDie(i);
          }
        }*/

        for (let i = 0; i !== gst.discs.length; i++) {
          if (!gst.discs[i]) continue;

          if (!arguments[1][i]) {
            arguments[1][i] = {left: false, right: false, up: false, down: false, action: false, action2: false};
          }

          if (!gst.discs[i].swing) gst.discs[i].swing = false;
        }

        if (gm.state.gameState.rl === 1) {
          gm.editor.funcs.clearGraphics();
          gm.state.events.onFirstStep();
        } else if (!gm.state.forceGameState) {
          gm.state.events.onStep();
        }

        gst = gm.state.safeEval.globalThis.game.state;
        gm.state.gameState = gst;

        // The renderer class isn't built at the same time as the first game step gets executed,
        // so this checks if the renderer has been built, and executes all the previous render updates
        gst.gmExtra.rendererExists = !!gm.graphics.rendererClass;
        if (!!gm.graphics.rendererClass && !arguments[0].gmExtra?.rendererExists) {
          for (let i = 0; i < gst.rl; i++) {
            if (!window.gmReplaceAccessors.gameStateList || !window.gmReplaceAccessors.gameStateList[i]) continue;
            gm.graphics.doRenderUpdates(window.gmReplaceAccessors.gameStateList[i]);
          }
        } else if (!!gm.graphics.rendererClass) {
          gm.graphics.doRenderUpdates(gst);
        }

        gm.state.collisionsThisStep = [];

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

        gm.state.collisionsThisStep.push({
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
  generateEvents: function(code) {
    this.resetSES();
    this.safeEval.evaluate(code);
    for (const name of this.eventNames) {
      if (!this.safeEval.globalThis[name]) {
        this.events[name] = function() {};
      } else {
        this.events[name] = function() {
          gm.state.currentEventArgs = [...arguments];
          return gm.state.safeEval.evaluate('this.' + name + '(...getEventArgs())');
        };
      }
    }
  },
  modeRunners: {},
  eventNames: [
    'onStep', 'onFirstStep', 'onPlayerDie',
    'onPlayerPlayerCollision', 'onPlayerArrowCollision', 'onPlayerPlatformCollision',
    'onArrowPlayerCollision', 'onArrowArrowCollision', 'onArrowPlatformCollision',
    'onPlatformPlayerCollision', 'onPlatformArrowCollision', 'onPlatformPlatformCollision',
  ],
  eventArgs: {
    'onStep': '',
    'onFirstStep': '',
    'onPlayerDie': 'playerId',
    'onPlayerPlayerCollision': 'playerId, hitPlayerId',
    'onPlayerArrowCollision': 'playerId, hitArrowId',
    'onPlayerPlatformCollision': 'playerId, hitPlatformId, hitShapeId',
    'onArrowPlayerCollision': 'arrowId, hitPlayerId',
    'onArrowArrowCollision': 'arrowId, hitArrowId',
    'onArrowPlatformCollision': 'arrowId, hitPlatformId, hitShapeId',
    'onPlatformPlayerCollision': 'platformId, shapeId, hitPlayerId',
    'onPlatformArrowCollision': 'platformId, shapeId, hitArrowId',
    'onPlatformPlatformCollision': 'platformId, shapeId, hitPlatformId, hitShapeId',
  },
  events: {
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
  },
};
