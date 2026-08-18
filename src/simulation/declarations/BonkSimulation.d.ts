import type { PlayerInput } from '../../network/declarations/PlayerInput';
import type { BonkGameSettings } from '../../network/declarations/GameSettings';
import type { BonkGameState } from './BonkGameState';

export declare class BonkSimulation {
  static globalStepVars: {
    gameSettings: BonkGameSettings;
    inputState: BonkGameState;
  };

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
  ): BonkGameState;

  step(
    lastState: BonkGameState,
    inputs: PlayerInput[],
    adminInputs: unknown,
    physicsTimeStep: number,
    gameSettings: BonkGameSettings,
    numPhysicsSteps: number,
    isTutorial: boolean,
    quickPlayLobby: unknown,
  ): BonkGameState;
}
