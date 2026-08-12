import { mod } from '../init';
import type { PlayerInput } from '../network/declarations/PlayerInput';
import type { GameSettings } from '../network/declarations/GameSettings';
import { hookMethod } from '../utils/hooking';
import type { BonkSimulation } from './declarations/BonkSimulation';
import type { BonkGameState } from './declarations/BonkGameState';

export default class GMSimulation {
  public state?: BonkGameState;

  constructor() {
    mod.objectHooks.BonkSimulation.createNewState = hookMethod(
      mod.objectHooks.BonkSimulation.createNewState,
      (original, ...rest) => {
        return original(...rest);
      },
    );

    mod.objectHooks.BonkSimulation.prototype.step = hookMethod(
      mod.objectHooks.BonkSimulation.prototype.step,
      this.step.bind(this),
    );
  }

  protected step(
    original: BonkSimulation['step'],
    lastState: BonkGameState,
    inputs: PlayerInput[],
    adminInputs: unknown,
    physicsTimeStep: number,
    gameSettings: GameSettings,
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

    this.state = newState;

    mod.sandbox.getGame().world.deserialize(this.state);
    mod.sandbox.getGame().world.serialize(this.state);

    mod.replaceHooks.endStep();

    return newState;
  }
}
