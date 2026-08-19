import type { Vector2d } from '../../sandbox/api/vector';
import { SIMULATION_TPS } from '../GMSimulation';

export interface StateGMExtraSettings {
  /**
   * When set to `true`, the barrier that kills players when they go offscreen is disabled.
   */
  disableDeathBarrier: boolean;
  /**
   * The maximum linear speed that all objects can reach. It's set to 60 by default.
   */
  linearSpeedCap: number;
  /**
   * The maximum angular speed that all objects can reach. It's set to 2700 by default.
   */
  angularSpeedCap: number;
  /**
   * The world's gravity, as a 2d vector. It's set to [0, 20] by default.
   */
  gravity: Vector2d;
}

export interface BonkStateGMExtra {
  settings: StateGMExtraSettings;
}

export namespace BonkStateGMExtra {
  export function getDefault(): BonkStateGMExtra {
    return {
      settings: {
        disableDeathBarrier: false,
        linearSpeedCap: 60 / SIMULATION_TPS,
        angularSpeedCap: 2700 * Math.PI / 180 / SIMULATION_TPS,
        gravity: [0, 20],
      },
    };
  }

  export function clone(gmExtra: BonkStateGMExtra): BonkStateGMExtra {
    return {
      settings: {
        ...gmExtra.settings,
        gravity: [gmExtra.settings.gravity[0], gmExtra.settings.gravity[1]],
      },
    };
  }
}
