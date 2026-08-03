import type { PlayerInput } from '../../inputs/declarations/PlayerInput';
import type { GameSettings } from '../../lobby/declarations/GameSettings';

export declare class BonkSimulation {
  static createNewState: () => ExternalGameState;
  step: (
    lastState: ExternalGameState,
    inputs: PlayerInput[],
    adminInputs: unknown,
    physicsTimeStep: number,
    gameSettings: GameSettings,
    numPhysicsSteps: number,
    isTutorial: boolean,
    quickPlayLobby: unknown,
  ) => ExternalGameState;
}
