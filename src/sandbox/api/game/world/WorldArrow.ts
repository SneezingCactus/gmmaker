import type { BonkGameState, BonkStateProjectile } from '../../../../simulation/declarations/BonkGameState';
import type Game from '../../Game';
import type { Vector2d } from '../../vector';

interface WorldArrow {
  /**
   * Position of the arrow.
   */
  position: Vector2d;
  /**
   * Angle in degrees of the arrow.
   */
  angle: number;

  /**
   * Linear velocity of the arrow.
   */
  linearVel: Vector2d;
  /**
   * Angular velocity of the arrow.
   */
  angularVel: number;

  /**
   * Player ID of the arrow's owner.
   */
  ownerPlayerId: number;
  /**
   * Timer number that indicates how many ticks are left until the arrow despawns.
   */
  despawnTimer: number;

  /**
   * Setting this value to true will make the game not interpolate the arrow's movement until the next step.
   * Useful for teleporting arrows without visible middle frames.
   */
  noLerp: boolean;
  /**
   * Determines whether the arrow is visible or not.
   */
  visible: boolean;
}

namespace WorldArrow {
  /**
   * @internal
   */
  export function getDefault(): WorldArrow {
    return {
      position: [0, 0],
      angle: 0,

      linearVel: [0, 0],
      angularVel: 0,

      ownerPlayerId: 0,
      despawnTimer: 500,

      noLerp: false,
      visible: true,
    };
  };

  /**
   * Serialize all Game arrows into the bonk state.
   *
   * @internal
   */
  export function serialize(game: Game, bonkState: BonkGameState) {
    const maxLength = Math.max(bonkState.projectiles.length, game.world.arrows.length);

    for (let i = 0; i < maxLength; i++) {
      if (!bonkState.projectiles[i] && !game.world.arrows[i])
        continue;

      let bonkArrow: Partial<BonkStateProjectile> | undefined = bonkState.projectiles[i];
      const gmArrow = game.world.arrows[i];

      if (!gmArrow) {
        delete bonkState.projectiles[i];
        continue;
      }

      if (!bonkArrow) {
        bonkArrow = {};
        bonkState.projectiles[i] = bonkArrow as BonkStateProjectile;
      }

      bonkArrow.x = gmArrow.position[0];
      bonkArrow.y = gmArrow.position[1];
      bonkArrow.a = gmArrow.angle;

      bonkArrow.xv = gmArrow.linearVel[0];
      bonkArrow.yv = gmArrow.linearVel[1];
      bonkArrow.av = gmArrow.angularVel;

      bonkArrow.did = gmArrow.ownerPlayerId;
      bonkArrow.team = 0;
      bonkArrow.fte = gmArrow.despawnTimer;

      bonkArrow.ni = gmArrow.noLerp;
    }
  }

  /**
   * Deserialize all bonk state arrows (named projectiles) into the Game object.
   *
   * @internal
   */
  export function deserialize(bonkState: BonkGameState, game: Game) {
    const maxLength = Math.max(bonkState.projectiles.length, game.world.arrows.length);

    for (let i = 0; i < maxLength; i++) {
      if (!bonkState.projectiles[i] && !game.world.arrows[i])
        continue;

      let gmArrow: Partial<WorldArrow> | undefined = game.world.arrows[i];
      const bonkArrow = bonkState.projectiles[i];

      if (!bonkArrow) {
        delete game.world.arrows[i];
        continue;
      }

      if (!gmArrow) {
        gmArrow = {};
        game.world.arrows[i] = gmArrow as WorldArrow;
      }

      gmArrow.position = [bonkArrow.x, bonkArrow.y];
      gmArrow.angle = bonkArrow.a;

      gmArrow.linearVel = [bonkArrow.xv, bonkArrow.yv];
      gmArrow.angularVel = bonkArrow.av;

      gmArrow.ownerPlayerId = bonkArrow.did;
      gmArrow.despawnTimer = bonkArrow.fte;

      gmArrow.noLerp = bonkArrow.ni;
      gmArrow.visible = true;
    }
  }
}

export default WorldArrow;
