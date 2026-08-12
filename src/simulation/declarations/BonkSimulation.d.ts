import type { PlayerInput } from '../../network/declarations/PlayerInput';
import type { GameSettings } from '../../network/declarations/GameSettings';
import type { BonkGameState } from './BonkGameState';

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
