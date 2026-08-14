import { mod } from '../init';
import type { PlayerInput } from '../network/declarations/PlayerInput';
import type { BonkGameSettings } from '../network/declarations/GameSettings';
import { hookMethod } from '../utils/hooking';
import type { BonkSimulation } from './declarations/BonkSimulation';
import type { BonkGameState } from './declarations/BonkGameState';
import { BonkStateGMExtra } from './state_gm_extra/BonkStateGMExtra';

export default class GMSimulation {
  public state?: BonkGameState;

  constructor() {
    mod.objectHooks.BonkSimulation.createNewState = hookMethod(
      mod.objectHooks.BonkSimulation.createNewState,
      this._createNewState.bind(this),
    );

    mod.objectHooks.BonkSimulation.prototype.step = hookMethod(
      mod.objectHooks.BonkSimulation.prototype.step,
      this._step.bind(this),
    );
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
