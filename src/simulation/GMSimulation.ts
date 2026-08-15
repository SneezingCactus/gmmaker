import { mod } from '../init';
import type { PlayerInput } from '../network/declarations/PlayerInput';
import type { BonkGameSettings } from '../network/declarations/GameSettings';
import { hookFunction } from '../utils/hooking';
import type { BonkSimulation } from './declarations/BonkSimulation';
import type { BonkGameState } from './declarations/BonkGameState';
import { BonkStateGMExtra } from './state_gm_extra/BonkStateGMExtra';
import type { b2World } from './declarations/Box2D';

export function initSimulation() {
  class GMSimulation extends mod.objectHooks.BonkSimulation {
    public state?: BonkGameState;

    constructor() {
      super();
      console.log('Hi');
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
