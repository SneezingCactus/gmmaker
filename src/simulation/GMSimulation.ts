import { mod } from '../init';
import type { PlayerInput } from '../network/declarations/PlayerInput';
import type { BonkGameSettings } from '../network/declarations/GameSettings';
import type { BonkGameState } from './declarations/BonkGameState';
import { BonkStateGMExtra } from './state_gm_extra/BonkStateGMExtra';
import { hookFunction } from '../utils/hooking';
import type { b2World } from './declarations/Box2D';

export function initSimulation() {
  const Box2D = mod.objectHooks.Box2D;

  Box2D.Dynamics.b2World.prototype.Step = hookFunction(Box2D.Dynamics.b2World.prototype.Step, function (
    this: b2World,
    original: b2World['Step'],
    dt: number,
    velocityIterations: number,
    positionIterations: number,
  ) {
    const state = GMSimulation.globalStepVars.inputState;

    if (!state.gmExtra) {
      original(dt, velocityIterations, positionIterations);
      return;
    }

    this.m_gravity.x = state.gmExtra.settings.gravity[0];
    this.m_gravity.y = state.gmExtra.settings.gravity[1];

    Box2D.Common.b2Settings.b2_maxTranslation = state.gmExtra.settings.linearSpeedCap;
    Box2D.Common.b2Settings.b2_maxTranslationSquared = state.gmExtra.settings.linearSpeedCap ** 2;
    Box2D.Common.b2Settings.b2_maxRotation = state.gmExtra.settings.angularSpeedCap;
    Box2D.Common.b2Settings.b2_maxRotationSquared = state.gmExtra.settings.angularSpeedCap ** 2;

    original(dt, velocityIterations, positionIterations);
  });

  class GMSimulation extends mod.objectHooks.BonkSimulation {
    public state?: BonkGameState;

    constructor() {
      super();

      (window as any).simulation = this;
    }

    static createNewState(
      players: {
        id: number;
        team: number;
      }[],
      map: any,
      seed: number,
      makeFteMuchSmaller: boolean,
      ignorePlayers: boolean[],
      gameSettings: BonkGameSettings,
      makeFteSlightlySmaller: boolean,
    ): BonkGameState {
      const newState = super.createNewState(
        players,
        map,
        seed,
        makeFteMuchSmaller,
        ignorePlayers,
        gameSettings,
        makeFteSlightlySmaller,
      );

      newState.gmExtra = BonkStateGMExtra.getDefault();

      return newState;
    }

    step(
      lastState: BonkGameState,
      inputs: PlayerInput[],
      adminInputs: unknown,
      physicsTimeStep: number,
      gameSettings: BonkGameSettings,
      numPhysicsSteps: number,
      isTutorial: boolean,
      quickPlayLobby: unknown,
    ) {
      if (!lastState.gmExtra) {
        return super.step(
          lastState,
          inputs,
          adminInputs,
          physicsTimeStep,
          gameSettings,
          numPhysicsSteps,
          isTutorial,
          quickPlayLobby,
        );
      }

      const newState = super.step(
        lastState,
        inputs,
        adminInputs,
        physicsTimeStep,
        gameSettings,
        numPhysicsSteps,
        isTutorial,
        quickPlayLobby,
      );

      newState.gmExtra = BonkStateGMExtra.clone(lastState.gmExtra);

      this.state = newState;

      mod.sandbox.getGame().world.deserialize(this.state);
      mod.sandbox.getGame().world.serialize(this.state);

      mod.replaceHooks.endStep();

      return newState;
    }
  }

  mod.objectHooks.hookBonkSimulation(GMSimulation);
}

/*
export default class GMSimulation {
  public bonkSimulation?: BonkSimulation;
  public state?: BonkGameState;

  constructor() {
    mod.objectHooks.Box2D.Dynamics.b2World.prototype.Step = hookFunction(
      mod.objectHooks.Box2D.Dynamics.b2World.prototype.Step,
      this._b2WorldStep.bind(this),
    );

    mod.objectHooks.BonkSimulation.createNewState = hookFunction(
      mod.objectHooks.BonkSimulation.createNewState,
      this._createNewState.bind(this),
    );

    mod.objectHooks.BonkSimulation.prototype.step = hookFunction(
      mod.objectHooks.BonkSimulation.prototype.step,
      this._step.bind(this),
    );
  }

  protected _b2WorldStep(
    original: b2World['Step'],
    dt: number,
    positionIterations: number,
    velocityIterations: number,
  ) {
    original(dt, positionIterations, velocityIterations);
  }

  protected _createNewState(
    original: (typeof BonkSimulation)['createNewState'],
    players: {
      id: number;
      team: number;
    }[],
    map: any,
    seed: number,
    makeFteMuchSmaller: boolean,
    ignorePlayers: boolean[],
    gameSettings: BonkGameSettings,
    makeFteSlightlySmaller: boolean,
  ): BonkGameState {
    const newState = original(
      players,
      map,
      seed,
      makeFteMuchSmaller,
      ignorePlayers,
      gameSettings,
      makeFteSlightlySmaller,
    );

    newState.gmExtra = BonkStateGMExtra.getDefault();

    return newState;
  }

  protected _step(
    original: BonkSimulation['step'],
    lastState: BonkGameState,
    inputs: PlayerInput[],
    adminInputs: unknown,
    physicsTimeStep: number,
    gameSettings: BonkGameSettings,
    numPhysicsSteps: number,
    isTutorial: boolean,
    quickPlayLobby: unknown,
  ) {
    const newState = original(
      lastState,
      inputs,
      adminInputs,
      physicsTimeStep,
      gameSettings,
      numPhysicsSteps,
      isTutorial,
      quickPlayLobby,
    );

    newState.gmExtra = BonkStateGMExtra.clone(lastState.gmExtra);

    this.state = newState;

    mod.sandbox.getGame().world.deserialize(this.state);
    mod.sandbox.getGame().world.serialize(this.state);

    mod.replaceHooks.endStep();

    return newState;
  }
}
*/
