/* eslint-disable camelcase */
/* eslint-disable new-cap */

import seedrandom from 'seedrandom';
import declareMeths from '!raw-loader!../ses/declareMeths.js';
import declareGameObject from '!raw-loader!../ses/declareGameObject.js';
import sesCode from '!raw-loader!../ses/ses.umd.js';

export default {
  init: function() {
    // we must first init the SES part then the rest
    const compContainer = document.createElement('iframe');
    document.head.appendChild(compContainer);

    compContainer.contentWindow.eval(sesCode);
    compContainer.contentWindow.lockdown({errorTaming: 'unsafe'});

    // mr whiter whee is my 50002 km/h of methé
    // (meth is short for method here)

    gm.state.sesMethNames = compContainer.contentWindow.eval(declareMeths);
    gm.state.safeEvalWindow = compContainer.contentWindow;

    gm.state.resetSES();
    gm.state.initb2Step();
    gm.state.initGameState();
    gm.state.initCreateState();
  },
  resetSES: function() {
    const meths = {};

    for (const methName of this.sesMethNames) {
      meths[methName] = this.safeEvalWindow[methName];
    }

    this.safeEval = new this.safeEvalWindow.Compartment(meths);
    this.safeEval.evaluate(declareGameObject);
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
    PhysicsClass.prototype.step = function(oldState, inputs) {
      // don't do gmm business when no mode is loaded
      if (!oldState.gmExtra) {
        const state = step_OLD(...arguments);
        gm.state.gameState = state;
        return state;
      }

      /* #region OVERRIDE APPLY */
      const overrides = oldState.gmExtra.overrides;

      for (let i = 0; i !== oldState.discs.length; i++) {
        if (!oldState.discs[i]) continue;

        inputs[i] = {
          up: overrides[i]?.up ?? inputs[i]?.up ?? false,
          down: overrides[i]?.down ?? inputs[i]?.down ?? false,
          left: overrides[i]?.left ?? inputs[i]?.left ?? false,
          right: overrides[i]?.right ?? inputs[i]?.right ?? false,
          action: overrides[i]?.action ?? inputs[i]?.action ?? false,
          action2: overrides[i]?.action2 ?? inputs[i]?.action2 ?? false,
        };
      }
      /* #endregion OVERRIDE APPLY */

      let state = step_OLD(...arguments);

      /* #region SEND STATIC INFO */
      if (!gm.state.safeEval.globalThis.staticSetted) {
        gm.state.staticInfo = oldState.gmInitial;
        gm.state.staticInfo.lobby.clientId = gm.lobby.networkEngine.getLSID();
        gm.state.safeEval.evaluate('this.setStaticInfo();');
      }
      /* #endregion SEND STATIC INFO */

      /* #region SEND DYNAMIC INFO */
      state.gmExtra = oldState.gmExtra;
      gm.state.gameState = state;
      gm.state.inputs = inputs;

      gm.state.safeEval.evaluate('setDynamicInfo()');
      state = gm.state.safeEval.globalThis.game.state;
      /* #endregion SEND DYNAMIC INFO */

      /* #region DISC NORMALIZING */
      for (let i = 0; i !== state.discs.length; i++) {
        if (!state.discs[i]) continue;

        if (!inputs[i]) {
          inputs[i] = inputs[i] || {left: false, right: false, up: false, down: false, action: false, action2: false};
        }

        if (!state.discs[i].swing) state.discs[i].swing = false;
      }
      /* #endregion DISC NORMALIZING */

      /* #region NO LERP PROPERTY MANAGE */
      for (let i = 0; i < state.physics.bodies.length; i++) {
        if (!state.physics.bodies[i]) continue;
        state.physics.bodies[i].ni = false;
      }
      for (let i = 0; i < state.projectiles.length; i++) {
        if (!state.projectiles[i]) continue;
        state.projectiles[i].ni = false;
      }
      for (let i = 0; i < state.gmExtra.drawings.length; i++) {
        if (!state.gmExtra.drawings[i]) continue;
        state.gmExtra.drawings[i].noLerp = false;
      }
      state.gmExtra.camera.noLerp = false;

      // cameraChanged, used to determine if offscreen arrows should be rendered or not
      if (oldState.gmExtra.camera.xPos != 0 ||
          oldState.gmExtra.camera.yPos != 0 ||
          oldState.gmExtra.camera.angle != 0 ||
          oldState.gmExtra.camera.xScale != 0 ||
          oldState.gmExtra.camera.yScale != 0) state.gmExtra.cameraChanged = true;
      /* #endregion NO LERP PROPERTY MANAGE */

      /* #region UPDATE RANDOM */
      let randomSeed = 0;

      // bring some more randomness to the mix!
      for (let i = 0; i < state.discs.length; i++) {
        if (!state.discs[i]) continue;
        randomSeed = randomSeed + state.discs[i].x + state.discs[i].y + state.discs[i].xv + state.discs[i].yv;
      }

      randomSeed += state.rl;
      randomSeed *= gm.state.staticInfo.lobby.seed;

      gm.state.pseudoRandom = new seedrandom(randomSeed);
      /* #endregion UPDATE RANDOM */

      /* #region EVENT FIRING */

      // fire collision events

      // fire roundStart events
      const playerIds = gm.state.staticInfo.lobby.allPlayerIds;

      if (oldState.rl == 0) {
        gm.state.fireEvent('roundStart', {runOnce: true}, []);
        for (let i = 0; i < playerIds.length; i++) {
          gm.state.fireEvent('roundStart', {runOnce: false}, [playerIds[i]]);
        }
      }

      // fire step events
      gm.state.fireEvent('step', {runOnce: true}, []);
      for (let i = 0; i < playerIds.length; i++) {
        gm.state.fireEvent('step', {runOnce: false}, [playerIds[i]]);
      }
      /* #endregion EVENT FIRING */

      state = gm.state.safeEval.globalThis.game.state;
      state.gmInitial = oldState.gmInitial;

      gm.state.gameState = state;

      return state;
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
  initCreateState: function() {
    PhysicsClass.createNewState_OLD = PhysicsClass.createNewState;

    PhysicsClass.createNewState = function() {
      const state = PhysicsClass.createNewState_OLD(...arguments);

      if (!gm.lobby.networkEngine) return state;

      /* #region gmInitial CREATION */
      const gmInitial = {};

      const playerInfo = [];
      for (let i = 0; i < gm.lobby.playerArray.length; i++) {
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
      for (let i = 0; i < gm.lobby.playerArray.length; i++) {
        if (!gm.lobby.playerArray[i]) continue;
        gmInitial.lobby.allPlayerIds.push(i);
      }

      state.gmInitial = JSON.parse(JSON.stringify(gmInitial));
      /* #endregion gmInitial CREATION */

      /* #region gmExtra CREATION */
      const gmExtra = {
        vars: {},
        camera: {
          xPos: 365 / state.physics.ppm,
          yPos: 250 / state.physics.ppm,
          angle: 0,
          xScale: 1,
          yScale: 1,
          noLerp: false,
        },
        drawings: [],
        overrides: [],
      };

      for (let i = 0; i < gmInitial.lobby.allPlayerIds.length; i++) {
        gmExtra.overrides[gmInitial.lobby.allPlayerIds[i]] = {
          up: null,
          down: null,
          left: null,
          right: null,
          action: null,
          action2: null,
        };
      }
      state.gmExtra = JSON.parse(JSON.stringify(gmExtra));
      /* #endregion gmExtra CREATION */

      return state;
    };
  },
  gameState: null,
  staticInfo: null,
  collisionsThisStep: [],
  pseudoRandom: null,
  generateEvents: function(code) {
    this.resetSES();
    this.safeEval.evaluate(code);
  },
  fireEvent: function() {
    gm.state.currentEventArgs = [...arguments];
    gm.state.safeEval.evaluate('game.events.fireEvent(...getEventArgs())');
  },
  resetStaticInfo: function() {
    gm.state.safeEval.evaluate('this.resetStaticInfo();');
  },
};
