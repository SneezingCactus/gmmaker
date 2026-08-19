import type { BonkGameState } from '../../../../simulation/declarations/BonkGameState';
import type Game from '../../Game';
import type { Vector2d } from '../../vector';
import { DEG_TO_RAD, RAD_TO_DEG } from '../../math';

interface WorldSettings {
  /**
   * When set to `true`, the barrier that kills players when they go offscreen is disabled.
   */
  disableDeathBarrier: boolean;
  /**
   * The maximum linear velocity that all objects can reach. It's set to 2 by default.
   */
  linearSpeedCap: number;
  /**
   * The maximum angular velocity that all objects can reach. It's set to 90 by default.
   */
  angularSpeedCap: number;
  /**
   * The world's gravity, as a 2d vector. It's set to [0, 20] by default.
   */
  gravity: Vector2d;

  /**
   * Specifies whether discs can respawn on death or not.
   */
  respawnOnDeath: boolean;
  /**
   * Specifies whether discs can collide with each other (false) or not (true).
   */
  noPlayerCollision: boolean;
  /**
   * Specifies whether discs can "fly" (like in fly maps) or not.
   */
  playersCanFly: boolean;
  /**
   * Specifies if complex physics are enabled.
   */
  complexPhysics: boolean;
  /**
   * Map editor grid size. This property has no effect whatsoever on the game.
   */
  editorGridSize: number;

  /**
   * Determines the ratio between the game's base resolution of 730x500 and the actual size of the map in meters.
   *
   * For example, a `mapSize` of 1 means the map is 730m wide and 500m high (1 base pixel per meter), while a
   * `mapSize` of 2 means it's 365m wide and 250m high (2 base pixels per meter). As a reference, discs have a default
   * radius of 1 meter.
   *
   * This is linked to the "Map size" setting in the map editor, however note that the numeric values shown there
   * are completely arbitrary and hold no particular meaning.
   *
   * Also note that changing this value will make **the whole world** look bigger or smaller as opposed to just changing
   * the size of discs, and it's generally an expensive operation, so only modify this value if truly necessary.
   */
  mapSize: number;
}

namespace WorldSettings {
  /**
   * @internal
   */
  export function getDefault(): WorldSettings {
    return {
      disableDeathBarrier: false,
      linearSpeedCap: 2,
      angularSpeedCap: 90,
      gravity: [0, 20],

      respawnOnDeath: false,
      noPlayerCollision: false,
      playersCanFly: false,
      complexPhysics: false,

      editorGridSize: 25,
      mapSize: 10,
    };
  };

  /**
   * Serialize Game round info into the bonk state.
   *
   * @internal
   */
  export function serialize(game: Game, bonkState: BonkGameState) {
    const gmSettings = game.world.settings;
    const gmExtra = bonkState.gmExtra!;

    gmExtra.settings.linearSpeedCap = gmSettings.linearSpeedCap;
    gmExtra.settings.angularSpeedCap = gmSettings.angularSpeedCap * DEG_TO_RAD;
    gmExtra.settings.disableDeathBarrier = gmSettings.disableDeathBarrier;
    gmExtra.settings.gravity = [gmSettings.gravity[0], gmSettings.gravity[1]];

    bonkState.ms.re = gmSettings.respawnOnDeath;
    bonkState.ms.nc = gmSettings.noPlayerCollision;
    bonkState.ms.fl = gmSettings.playersCanFly;
    bonkState.ms.pq = gmSettings.complexPhysics ? 2 : 1;

    bonkState.ms.gd = gmSettings.editorGridSize;
    bonkState.physics.ppm = gmSettings.mapSize;
  }

  /**
   * Deserialize all bonk state discs into the Game object.
   *
   * @internal
   */
  export function deserialize(bonkState: BonkGameState, game: Game) {
    const gmSettings = game.world.settings;
    const gmExtra = bonkState.gmExtra!;

    gmSettings.linearSpeedCap = gmExtra.settings.linearSpeedCap;
    gmSettings.angularSpeedCap = gmExtra.settings.angularSpeedCap * RAD_TO_DEG;
    gmSettings.disableDeathBarrier = gmExtra.settings.disableDeathBarrier;
    gmSettings.gravity = [gmExtra.settings.gravity[0], gmExtra.settings.gravity[1]];

    gmSettings.respawnOnDeath = bonkState.ms.re;
    gmSettings.noPlayerCollision = bonkState.ms.nc;
    gmSettings.playersCanFly = bonkState.ms.fl;
    gmSettings.complexPhysics = bonkState.ms.pq === 2;

    gmSettings.editorGridSize = bonkState.ms.gd;
    gmSettings.mapSize = bonkState.physics.ppm;
  }
}

export default WorldSettings;
