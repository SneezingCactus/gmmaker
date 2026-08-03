import type { PlayerInput } from '../../declarations/network/PlayerInput';
import type { GameSettings } from '../../declarations/network/GameSettings';

export declare class BonkSimulation {
  static createNewState: () => BonkGameState;
  step: (
    lastState: BonkGameState,
    inputs: PlayerInput[],
    adminInputs: unknown,
    physicsTimeStep: number,
    gameSettings: GameSettings,
    numPhysicsSteps: number,
    isTutorial: boolean,
    quickPlayLobby: unknown,
  ) => BonkGameState;
}
