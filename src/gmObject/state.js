/* eslint-disable camelcase */
/* eslint-disable new-cap */

import declareMeths from '../ses/declareMeths.raw.js';
import declareGameObject from '../ses/declareGameObject.raw.js';
import seedrandomCode from '../ses/seedrandom.raw.js';
import sesCode from '../ses/ses.raw.js';

export default {
  init: function() {
    // we must first init the SES part then the rest
    const compContainer = document.createElement('iframe');
    document.head.appendChild(compContainer);

    compContainer.contentWindow.eval(sesCode);
    compContainer.contentWindow.lockdown({errorTaming: 'unsafe'});

    // mr whiter whee is my 50002 km/h of methé
    // (meth is short for method here)

    compContainer.contentWindow.eval(declareMeths);
    gm.state.sesMethNames = compContainer.contentWindow.methNames;
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
    this.safeEval.evaluate(seedrandomCode);
    this.safeEval.evaluate(declareGameObject);
  },
  initb2Step: function() {
    Box2D.Dynamics.b2World.prototype.StepOLD = Box2D.Dynamics.b2World.prototype.Step;
    Box2D.Dynamics.b2World.prototype.Step = function() {
      if (!PhysicsClass.contactListener.PostSolveOLD) gm.state.initContactListener();

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
    const stepFunction = function(oldState, inputs) {
      // don't do anything if crashed
      if (gm.state.crashed) return JSON.parse(JSON.stringify(oldState));

      // don't do gmm business when no mode is loaded or if in quickplay
      if (!oldState.gmExtra || gm.lobby.data.quick) {
        const state = stepOLD(...arguments);
        window.gmReplaceAccessors.disableDeathBarrier = false;
        gm.state.gameState = state;
        gm.state.inputs = inputs;
        return state;
      }

      /* #region OVERRIDE APPLY */
      // this is where overrides are applied to player inputs

      const overrides = oldState.gmExtra.overrides;
      const fakeInputs = [];

      for (let i = 0; i !== oldState.discs.length; i++) {
        if (!oldState.discs[i]) continue;

        fakeInputs[i] = {
          up: overrides[i]?.up ?? inputs[i]?.up ?? false,
          down: overrides[i]?.down ?? inputs[i]?.down ?? false,
          left: overrides[i]?.left ?? inputs[i]?.left ?? false,
          right: overrides[i]?.right ?? inputs[i]?.right ?? false,
          action: overrides[i]?.action ?? inputs[i]?.action ?? false,
          action2: overrides[i]?.action2 ?? inputs[i]?.action2 ?? false,
          mouse: inputs[i]?.mouse ?? {pos: [0, 0], left: false, right: false, middle: false},
        };
      }

      arguments[1] = fakeInputs;
      /* #endregion OVERRIDE APPLY */

      let state;

      state = stepOLD(...arguments);

      /* #region UPDATE DEATH BARRIER DISABLE */
      window.gmReplaceAccessors.disableDeathBarrier = oldState.gmExtra.disableDeathBarrier;

      if (oldState.rl === 0) {
        window.gmReplaceAccessors.disableDeathBarrier = true;
      }
      /* #endregion UPDATE DEATH BARRIER DISABLE */

      /* #region ANGLE UNIT DEGREEING */
      // this is where angles represented in radians are turned into degrees for easier manipulation
      const radToDeg = 180 / Math.PI;

      for (let i = 0; i !== state.discs.length; i++) {
        if (!state.discs[i]) continue;

        const disc = state.discs[i];

        disc.ra = disc.a;
        disc.rav = disc.av;

        disc.a *= radToDeg;
        disc.av *= radToDeg;
      }
      for (let i = 0; i !== state.projectiles.length; i++) {
        if (!state.projectiles[i]) continue;

        const arrow = state.projectiles[i];

        arrow.ra = arrow.a;
        arrow.rav = arrow.av;

        arrow.a *= radToDeg;
        arrow.av *= radToDeg;
      }
      for (let i = 0; i !== state.physics.bodies.length; i++) {
        if (!state.physics.bodies[i]) continue;

        const body = state.physics.bodies[i];

        body.ra = body.a;
        body.rav = body.av;

        body.a *= radToDeg;
        body.av *= radToDeg;
      }
      for (let i = 0; i !== state.physics.shapes.length; i++) {
        if (!state.physics.shapes[i]) continue;

        const shape = state.physics.shapes[i];

        if (shape.type !== 'ci') {
          shape.ra = shape.a;
          shape.a *= radToDeg;
        }
      }
      for (let i = 0; i !== state.physics.joints.length; i++) {
        if (!state.physics.joints[i]) continue;

        const joint = state.physics.joints[i];

        if (joint.type == 'lpj') {
          joint.rpa = joint.pa;
          joint.pa *= 180 / Math.PI;
        } else if (joint.type == 'rv') {
          joint.d.rua = joint.ua;
          joint.d.rla = joint.la;
          joint.d.ua *= 180 / Math.PI;
          joint.d.la *= 180 / Math.PI;
        }
      }
      /* #endregion ANGLE UNIT DEGREEING */

      /* #region DISC NORMALIZING */
      // here, certain conflicting disc props, such as swing and input, are normalized
      // to prevent some undefined-related errors

      for (let i = 0; i !== state.discs.length; i++) {
        if (!state.discs[i]) continue;

        inputs[i] = inputs[i] || {
          left: false,
          right: false,
          up: false,
          down: false,
          action: false,
          action2: false,
          mouse: {
            pos: [0, 0],
            left: false,
            right: false,
            center: false,
          },
        };

        if (!state.discs[i].swing) state.discs[i].swing = false;
      }
      /* #endregion DISC NORMALIZING */

      /* #region CHANGE XY TO VECTORS */
      // this is where certain props such as positions and velocities are turned into vectors
      // to allow the mode maker to use Vector functions with them easily

      for (let i = 0; i !== state.discs.length; i++) {
        if (!state.discs[i]) continue;

        const disc = state.discs[i];

        disc.p = [disc.x, disc.y];
        disc.lv = [disc.xv, disc.yv];
        disc.sp = [disc.sx, disc.sy];
        disc.slv = [disc.sxv, disc.syv];
      }
      for (let i = 0; i !== state.discDeaths.length; i++) {
        if (!state.discDeaths[i]) continue;

        const death = state.discDeaths[i];

        death.p = [death.x, death.y];
        death.lv = [death.xv, death.yv];
      }
      for (let i = 0; i !== state.projectiles.length; i++) {
        if (!state.projectiles[i]) continue;

        const arrow = state.projectiles[i];

        arrow.p = [arrow.x, arrow.y];
        arrow.lv = [arrow.xv, arrow.yv];
      }
      /* #endregion CHANGE XY TO VECTORS */

      /* #region EXTRA PROPERTY MANAGE */
      // this is where props added by gmmaker into the state, such as
      // nolerp and visibility of objects, are managed

      state.gmExtra = oldState.gmExtra;

      // disc props
      for (let i = 0; i < state.discs.length; i++) {
        if (!state.discs[i]) continue;

        if (state.rl !== 0) {
          state.discs[i].visible = oldState.discs[i]?.visible ?? true;
        }
      }

      // body props
      for (let i = 0; i < state.physics.bodies.length; i++) {
        if (!state.physics.bodies[i]) continue;
        state.physics.bodies[i].ni = false;

        if (state.rl !== 0) {
          state.physics.bodies[i].visible = oldState.physics.bodies[i]?.visible ?? true;
        }
      }

      // arrow props
      for (let i = 0; i < state.projectiles.length; i++) {
        if (!state.projectiles[i]) continue;
        state.projectiles[i].ni = false;

        if (state.rl !== 0) {
          state.projectiles[i].visible = oldState.projectiles[i]?.visible ?? true;
        }
      }
      /* #endregion EXTRA PROPERTY MANAGE */

      /* #region SEND STATIC INFO */
      // static info is info that is only sent to the sandbox once, such as lobby info

      if (!gm.state.safeEval.globalThis.staticSetted) {
        gm.state.staticInfo = oldState.gmInitial;
        gm.state.staticInfo.lobby.clientId = gm.lobby.networkEngine.getLSID();
        gm.state.safeEval.evaluate('this.setStaticInfo();');
      }
      /* #endregion SEND STATIC INFO */

      /* #region SEND DYNAMIC INFO */
      // dynamic info is info that is sent to the sandbox every step, such as game state and inputs

      gm.state.gameState = state;
      gm.state.inputs = inputs;

      gm.state.safeEval.evaluate('setDynamicInfo()');
      state = gm.state.safeEval.globalThis.game.state;
      /* #endregion SEND DYNAMIC INFO */

      /* #region EVENT FIRING */
      // after all preparations are done, it's time to fire the events set by the mode

      // fire collision events
      for (let i = 0; i < gm.state.collisionsThisStep.length; i++) {
        const collision = gm.state.collisionsThisStep[i];
        const fixtureA = collision.fixtureAData;
        const fixtureB = collision.fixtureBData;
        const bodyA = collision.fixtureABodyData;
        const bodyB = collision.fixtureBBodyData;
        const normal = collision.normal;

        // body data used if object A or object B is a body
        const bodyAData = {
          id: bodyA.arrayID,
          fixtureId: fixtureA.arrayID,
          normal: [
            -normal.x,
            -normal.y,
          ],
        };
        const bodyBData = {
          id: bodyB.arrayID,
          fixtureId: fixtureB.arrayID,
          normal: [
            normal.x,
            normal.y,
          ],
        };

        // epic way of avoiding nesting
        switch (bodyA.type + bodyB.type) {
          case 'discdisc': {
            gm.state.fireEvent('discCollision', {collideWith: 'disc'}, [bodyA.arrayID, bodyB.arrayID]);
            gm.state.fireEvent('discCollision', {collideWith: 'disc'}, [bodyB.arrayID, bodyA.arrayID]);
            break;
          }
          case 'discarrow': {
            gm.state.fireEvent('discCollision', {collideWith: 'arrow'}, [bodyA.arrayID, bodyB.arrayID]);
            gm.state.fireEvent('arrowCollision', {collideWith: 'disc'}, [bodyB.arrayID, bodyA.arrayID]);
            break;
          }
          case 'discphys': {
            gm.state.fireEvent('discCollision', {collideWith: 'body'}, [bodyA.arrayID, bodyBData]);
            gm.state.fireEvent('bodyCollision', {collideWith: 'disc'}, [bodyBData, bodyA.arrayID]);
            break;
          }
          case 'arrowdisc': {
            gm.state.fireEvent('arrowCollision', {collideWith: 'disc'}, [bodyA.arrayID, bodyB.arrayID]);
            gm.state.fireEvent('discCollision', {collideWith: 'arrow'}, [bodyB.arrayID, bodyA.arrayID]);
            break;
          }
          case 'arrowarrow': {
            gm.state.fireEvent('arrowCollision', {collideWith: 'arrow'}, [bodyA.arrayID, bodyB.arrayID]);
            gm.state.fireEvent('arrowCollision', {collideWith: 'arrow'}, [bodyB.arrayID, bodyA.arrayID]);
            break;
          }
          case 'arrowphys': {
            gm.state.fireEvent('arrowCollision', {collideWith: 'body'}, [bodyA.arrayID, bodyBData]);
            gm.state.fireEvent('bodyCollision', {collideWith: 'arrow'}, [bodyBData, bodyA.arrayID]);
            break;
          }
          case 'physdisc': {
            gm.state.fireEvent('bodyCollision', {collideWith: 'disc'}, [bodyAData, bodyB.arrayID]);
            gm.state.fireEvent('discCollision', {collideWith: 'body'}, [bodyB.arrayID, bodyAData]);
            break;
          }
          case 'physarrow': {
            gm.state.fireEvent('bodyCollision', {collideWith: 'arrow'}, [bodyAData, bodyB.arrayID]);
            gm.state.fireEvent('arrowCollision', {collideWith: 'body'}, [bodyB.arrayID, bodyAData]);
            break;
          }
          case 'physphys': {
            gm.state.fireEvent('bodyCollision', {collideWith: 'body'}, [bodyAData, bodyBData]);
            gm.state.fireEvent('bodyCollision', {collideWith: 'body'}, [bodyBData, bodyAData]);
            break;
          }
        }
      }
      gm.state.collisionsThisStep = [];

      // fire playerDie events
      for (let i = 0; i < state.discDeaths.length; i++) {
        if (state.discDeaths[i]?.f === 0) gm.state.fireEvent('playerDie', null, [state.discDeaths[i].i, i]);
      }

      // fire roundStart events
      const playerIds = gm.state.staticInfo.lobby.allPlayerIds;

      if ((state.rc == 0 && oldState.rl == 0) || (state.rc > 0 && state.rl == 0)) {
        gm.state.fireEvent('roundStart', {perPlayer: false}, []);
        for (let i = 0; i < playerIds.length; i++) {
          gm.state.fireEvent('roundStart', {perPlayer: true}, [playerIds[i]]);
        }
      }

      // fire step events
      gm.state.fireEvent('step', {perPlayer: false}, []);
      for (let i = 0; i < playerIds.length; i++) {
        gm.state.fireEvent('step', {perPlayer: true}, [playerIds[i]]);
      }
      /* #endregion EVENT FIRING */

      // after all events are done, dynamic info is sent back from sandbox
      state = gm.state.safeEval.evaluate('this.prepareDynamicInfo()');
      state.gmInitial = oldState.gmInitial;

      /* #region CHANGE VECTORS TO XY */
      // turn vectors back to xy props

      for (let i = 0; i !== state.discs.length; i++) {
        if (!state.discs[i]) continue;

        const disc = state.discs[i];

        disc.x = disc.p[0];
        disc.y = disc.p[1];
        disc.xv = disc.lv[0];
        disc.yv = disc.lv[1];
        disc.sx = disc.sp[0];
        disc.sy = disc.sp[1];
        disc.sxv = disc.slv[0];
        disc.syv = disc.slv[1];
      }
      for (let i = 0; i !== state.discDeaths.length; i++) {
        if (!state.discDeaths[i]) continue;

        const death = state.discDeaths[i];

        death.x = death.p[0];
        death.y = death.p[1];
        death.xv = death.lv[0];
        death.yv = death.lv[1];
      }
      for (let i = 0; i !== state.projectiles.length; i++) {
        if (!state.projectiles[i]) continue;

        const arrow = state.projectiles[i];

        arrow.x = arrow.p[0];
        arrow.y = arrow.p[1];
        arrow.xv = arrow.lv[0];
        arrow.yv = arrow.lv[1];
      }
      /* #endregion VECTORS TO XY */

      /* #region ANGLE UNIT RESTORING */
      // turn angles back into radians
      // if an angle didn't change during the event firing, it's set to the pre-degreed value
      // instead of being multiplied, to prevent possible desyncs due to floating point error
      const degToRad = Math.PI / 180;

      for (let i = 0; i !== state.discs.length; i++) {
        if (!state.discs[i]) continue;
        state.discs[i].a *= degToRad;
        state.discs[i].av *= degToRad;

        if (Math.abs(state.discs[i].a - state.discs[i].ra) < 0.000000001) {
          state.discs[i].a = state.discs[i].ra;
        }
        if (Math.abs(state.discs[i].av - state.discs[i].rav) < 0.000000001) {
          state.discs[i].av = state.discs[i].rav;
        }
      }
      for (let i = 0; i !== state.projectiles.length; i++) {
        if (!state.projectiles[i]) continue;

        const arrow = state.projectiles[i];

        arrow.a *= degToRad;
        arrow.av *= degToRad;

        if (Math.abs(arrow.a - arrow.ra) < 0.000000001) {
          arrow.a = arrow.ra;
        }
        if (Math.abs(arrow.av - arrow.rav) < 0.000000001) {
          arrow.av = arrow.rav;
        }
      }
      for (let i = 0; i !== state.physics.bodies.length; i++) {
        if (!state.physics.bodies[i]) continue;

        const body = state.physics.bodies[i];

        body.a *= degToRad;
        body.av *= degToRad;

        if (Math.abs(body.a - body.ra) < 0.000000001) {
          body.a = body.ra;
        }
        if (Math.abs(body.av - body.rav) < 0.000000001) {
          body.av = body.rav;
        }
      }
      for (let i = 0; i !== state.physics.shapes.length; i++) {
        if (!state.physics.shapes[i]) continue;

        const shape = state.physics.shapes[i];

        if (shape.type !== 'ci') {
          shape.a *= degToRad;
          if (Math.abs(shape.a - shape.ra) < 0.000000001) shape.a = shape.ra;
        }
      }
      for (let i = 0; i !== state.physics.joints.length; i++) {
        if (!state.physics.joints[i]) continue;

        const joint = state.physics.joints[i];

        if (joint.type == 'lpj') {
          joint.pa *= Math.PI / 180;
          if (Math.abs(joint.pa - joint.rpa) < 0.000000001) joint.pa = joint.rpa;
        } else if (joint.type == 'rv') {
          joint.d.ua *= Math.PI / 180;
          joint.d.la *= Math.PI / 180;
          if (Math.abs(joint.ua - joint.rua) < 0.000000001) joint.ua = joint.rua;
          if (Math.abs(joint.la - joint.rla) < 0.000000001) joint.la = joint.rla;
        }
      }
      /* #endregion ANGLE UNIT RESTORING */

      // make game state publicly accessible
      gm.state.gameState = state;

      // let bonk dispose world objects to prevent memory leaks
      if (window.gmReplaceAccessors.endStep) window.gmReplaceAccessors.endStep();

      return state;
    };
    PhysicsClass.prototype.step = function(oldState) {
      if (gm.graphics.inReplay()) {
        return stepFunction(...arguments);
      }

      try {
        return stepFunction(...arguments);
      } catch (e) {
        if (gm.state.crashed) return oldState;
        if (gm.graphics.inReplay()) throw e;
        gm.state.crashed = true;
        setTimeout(() => gm.state.crashAbort(e), 500); // gotta make sure we're out of the step function!
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

        gm.state.collisionsThisStep.push({
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
      if (!gm.editor.appliedMode || gm.editor.appliedMode?.isEmpty) return state;

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
      const gmExtra = {
        vars: {},
        camera: {
          pos: [365 / state.physics.ppm,
            250 / state.physics.ppm],
          angle: 0,
          scale: [1, 1],
          noLerp: false,
        },
        drawings: [],
        overrides: [],
        disableDeathBarrier: false,
        kills: [],
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
  inputs: null,
  staticInfo: null,
  collisionsThisStep: [],
  crashed: false,
  rayCast: function(origin, end, filter, multiResult) {
    const hits = [];

    const rayCastCallback = (fixture, point, normal, fraction) => {
      const bodyData = fixture.GetBody().GetUserData();
      const fixtureData = fixture.GetUserData();

      const hit = {
        type: null,
        id: bodyData.arrayID,
        point: [point.x, point.y],
        normal: [normal.x, normal.y],
      };

      switch (bodyData.type) {
        case 'disc':
          hit.type = 'disc';
          break;
        case 'arrow':
          hit.type = 'arrow';
          break;
        case 'phys':
          hit.type = 'body';
          hit.fixtureId = fixtureData.arrayID;
          hit.isCapzone = fixtureData.capzone;
          break;
      }

      hits[fraction] = hit;

      return -1;
    };

    window.PhysicsClass.world.RayCast(
        rayCastCallback,
        new Box2D.Common.Math.b2Vec2(origin[0], origin[1]),
        new Box2D.Common.Math.b2Vec2(end[0], end[1]),
    );

    const keysInOrder = Object.keys(hits).sort();
    let theChosenOne = multiResult ? [] : null;

    for (let i = 0; i < keysInOrder.length; i++) {
      const hit = hits[keysInOrder[i]];

      if (!filter || filter(hit)) {
        if (multiResult) {
          theChosenOne.push(hit);
        } else {
          theChosenOne = hit;
          break;
        }
      }
    }

    return theChosenOne;
  },
  crashAbort: function(e) {
    if (e.isModeError && gm.editor.browser != 'Firefox') {
      let report = e.stack;

      report = report.replace(/(at [^\(\n]+) \(eval at .{0,150}init[^\)]+[\)]+, <anonymous>(:[0-9]+:[0-9]+)\)/gm, '$1$2');
      report = report.replace(/Object\.eval \[as listener\]([^\n]+)(.|\n)*/gm, '<anonymous>$1');
      report = report.replace(/Proxy./gm, 'function ');

      if (gm.lobby.networkEngine && gm.lobby.networkEngine.getLSID() == gm.lobby.networkEngine.hostID) {
        gm.editor.genericDialog('Whoops! Seems like something went wrong with your code. Below is the crash report, which may help you find out what happened.', ()=>{}, {
          showCode: true,
          code: report,
        });

        gm.editor.showGMEWindow();

        const match = /:([0-9]+):([0-9]+)/gm.exec(report);

        gm.editor.monacoWs.revealPositionInCenter({lineNumber: Number.parseInt(match[1]), column: Number.parseInt(match[2])});
        gm.editor.monacoWs.setPosition({lineNumber: Number.parseInt(match[1]), column: Number.parseInt(match[2])});
      } else {
        gm.editor.genericDialog('Whoops! Seems like something went wrong with the current mode\'s code. Below is the crash report:', ()=>{}, {
          showCode: true,
          code: report,
        });
      }

      e.stack = '[GMMaker Error] ' + e.stack;
    } else if (e.isModeError) {
      let report = e.name + ': ' + e.message;

      let stack = e.stack;

      stack = stack.replace(/([^@\n]+)@.+?line.+?eval:/gm, '  at $1:');
      stack = stack.replace(/@.+?line.+?eval:([^\n]+)(.|\n)*/gm, '  at <anonymous>:$1');

      report += '\n' + stack;

      if (gm.lobby.networkEngine && gm.lobby.networkEngine.getLSID() == gm.lobby.networkEngine.hostID) {
        gm.editor.genericDialog('Whoops! Seems like something went wrong with your code. Below is the crash report, which may help you find out what happened.', ()=>{}, {
          showCode: true,
          code: report,
        });

        gm.editor.showGMEWindow();

        const match = /:([0-9]+):([0-9]+)/gm.exec(report);

        gm.editor.monacoWs.revealPositionInCenter({lineNumber: Number.parseInt(match[1]), column: Number.parseInt(match[2])});
        gm.editor.monacoWs.setPosition({lineNumber: Number.parseInt(match[1]), column: Number.parseInt(match[2])});
      } else {
        gm.editor.genericDialog('Whoops! Seems like something went wrong with the current mode\'s code. Below is the crash report:', ()=>{}, {
          showCode: true,
          code: report,
        });
      }

      e.message = '[GMMaker Error] ' + e.message;
    } else if (e == 'Assertion Failed') {
      gm.editor.genericDialog([
        'Whoops! Seems like something went wrong with the physics engine. ',
        'This might or might not be an issue with the currently applied mode, or GMMaker itself.',
        '<br><br>',
        'Are you sure you\'re not playing a map that intentionally crashes the game using invalid polygons? ',
        'Does the custom mode manipulate physical polygon shapes (if any custom mode is currently being used)?',
        '<br><br>',
        'Physical polygons are quite unstable and can cause crashes if used incorrectly, for example, ',
        'a physical polygon should not end on the same point as the start point.',
      ].join(''), ()=>{}, {});
    } else {
      if (gm.lobby.networkEngine && gm.lobby.networkEngine.getLSID() == gm.lobby.networkEngine.hostID) {
        gm.editor.genericDialog([
          'Whoops! Seems like there was an unknown error and the game had to be stopped. ',
          'This might or might not be an issue with the currently applied mode (if any is currently being used), or GMMaker itself.',
          '<br><br>',
          'If you are using a custom mode, check <a href="https://github.com/SneezingCactus/gmmaker/wiki/How-your-mode-could-be-causing-an-unknown-error">this article</a> explaining how your mode could be causing an unknown error and how you can find a way to fix it. ',
          'It might help you find what\'s wrong and how to fix it.',
          '<br><br>',
          'If not, are you using any other mods/extensions (apart from the Code Injector)? ',
          'Try disabling them, reload, and try again.',
          '<br><br>',
          'If you think this is a GMMaker bug and not something about your custom mode, or any other mods you have installed, ',
          'don\'t hesitate to ask SneezingCactus about it in the <a href="https://discord.gg/dnBM3N6H8a">SneezingCactus\' mods discord server</a> or the <a href="https://discord.gg/zKdHZ3e24r">Bonk Modding Community discord server</a>.',
        ].join(''), ()=>{}, {});
      } else {
        gm.editor.genericDialog([
          'Whoops! Seems like there was an unknown error and the game had to be stopped. ',
          'This might or might not be an issue with the currently applied mode (if any is currently being used), or GMMaker itself.',
          '<br><br>',
          'Are you using any other mods/extensions (apart from the Code Injector)? ',
          'Try disabling them, reload, and try again.',
          '<br><br>',
          'If you think this is a GMMaker bug and not something about the current custom mode, or any other mods you have installed, ',
          'don\'t hesitate to ask SneezingCactus about it in the <a href="https://discord.gg/dnBM3N6H8a">SneezingCactus\' mods discord server</a> or the <a href="https://discord.gg/zKdHZ3e24r">Bonk Modding Community discord server</a>.',
        ].join(''), ()=>{}, {});
      }
    }

    if (gm.lobby.networkEngine && gm.lobby.networkEngine.getLSID() == gm.lobby.networkEngine.hostID) {
      document.getElementById('pretty_top_exit').click();
    }

    throw e;
  },
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
