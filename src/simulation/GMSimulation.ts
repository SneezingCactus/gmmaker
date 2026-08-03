import { mod } from '../init';
import type { PlayerInput } from '../inputs/declarations/PlayerInput';
import type { GameSettings } from '../lobby/declarations/GameSettings';
import { hookMethod } from '../utils/hooking';
import type { BonkSimulation } from './declarations/BonkSimulation';

export default class GMSimulation {
  public state?: ExternalGameState;

  constructor() {
    mod.objectHooks.BonkSimulation.createNewState = hookMethod(
      mod.objectHooks.BonkSimulation.createNewState,
      (original, ...rest) => {
        console.log('Of Course!');
        return original(...rest);
      },
    );

    mod.objectHooks.BonkSimulation.prototype.step = hookMethod(
      mod.objectHooks.BonkSimulation.prototype.step,
      this.step.bind(this),
    );
  }

  step(
    original: BonkSimulation['step'],
    lastState: ExternalGameState,
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

    mod.replaceHooks.endStep();

    return newState;
  }
}
