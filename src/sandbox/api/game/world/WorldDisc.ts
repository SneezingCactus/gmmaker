import type { BonkGameState, BonkStateDisc } from '../../../../simulation/declarations/BonkGameState';
import type Game from '../../Game';
import type { Vector2d } from '../../vector';
import { BONK_TEAM_IDS, PlayerTeam } from '../PlayerTeam';

interface WorldDisc {
  position: Vector2d;
  angle: number;

  linearVel: Vector2d;
  angularVel: number;

  team: PlayerTeam;

  actionCooldown: number;
  actionAimCharge: number;
  actionAimAngle: number;

  spawnPosition: Vector2d;
  spawnLinearVel: Vector2d;
}

namespace WorldDisc {
  /**
   * @internal
   */
  export function getDefault(): WorldDisc {
    return {
      position: [0, 0],
      angle: 0,

      linearVel: [0, 0],
      angularVel: 0,

      team: PlayerTeam.FFA,

      actionCooldown: 0,
      actionAimCharge: 0,
      actionAimAngle: 0,

      spawnPosition: [0, 0],
      spawnLinearVel: [0, 0],
    };
  };

  /**
   * Serialize all Game discs into the bonk state.
   *
   * @internal
   */
  export function serialize(game: Game, bonkState: BonkGameState) {
    const maxLength = Math.max(bonkState.discs.length, game.world.discs.length);

    for (let i = 0; i < maxLength; i++) {
      if (!bonkState.discs[i] && !game.world.discs[i])
        continue;

      let bonkDisc: Partial<BonkStateDisc> | undefined = bonkState.discs[i];
      const gmDisc = game.world.discs[i];

      if (!gmDisc) {
        delete bonkState.discs[i];
        continue;
      }

      if (!bonkDisc) {
        bonkDisc = {};
        bonkState.discs[i] = bonkDisc as BonkStateDisc;
      }

      bonkDisc.x = gmDisc.position[0];
      bonkDisc.y = gmDisc.position[1];
      bonkDisc.a = gmDisc.angle;

      bonkDisc.xv = gmDisc.linearVel[0];
      bonkDisc.yv = gmDisc.linearVel[1];
      bonkDisc.av = gmDisc.angularVel;

      bonkDisc.team = BONK_TEAM_IDS.indexOf(gmDisc.team);

      bonkDisc.a1a = gmDisc.actionCooldown;
      bonkDisc.ds = gmDisc.actionAimCharge;
      bonkDisc.da = gmDisc.actionAimAngle;

      bonkDisc.sx = gmDisc.spawnPosition[0];
      bonkDisc.sy = gmDisc.spawnPosition[1];
      bonkDisc.sxv = gmDisc.spawnLinearVel[0];
      bonkDisc.syv = gmDisc.spawnLinearVel[1];

      bonkDisc.ni = false;
      bonkDisc.swing = null;
      bonkDisc.visible = true;
    }
  }

  /**
   * Deserialize all bonk state discs into the Game object.
   *
   * @internal
   */
  export function deserialize(bonkState: BonkGameState, game: Game) {
    const maxLength = Math.max(bonkState.discs.length, game.world.discs.length);

    for (let i = 0; i < maxLength; i++) {
      if (!bonkState.discs[i] && !game.world.discs[i])
        continue;

      let gmDisc: Partial<WorldDisc> | undefined = game.world.discs[i];
      const bonkDisc = bonkState.discs[i];

      // bonk -> gmm
      // if there's no disc in bonk, there shouldn't be a disc in gmm
      if (!bonkDisc) {
        delete game.world.discs[i];
        continue;
      }

      // if this disc doesn't exist in gmm, create it
      if (!gmDisc) {
        gmDisc = {};
        game.world.discs[i] = gmDisc as WorldDisc; // cast to remove Partial (we fill all props later)
      }

      gmDisc.position = [bonkDisc.x, bonkDisc.y];
      gmDisc.angle = bonkDisc.a;

      gmDisc.linearVel = [bonkDisc.xv, bonkDisc.yv];
      gmDisc.angularVel = bonkDisc.av;

      gmDisc.team = BONK_TEAM_IDS[bonkDisc.team];

      gmDisc.actionCooldown = bonkDisc.a1a;
      gmDisc.actionAimAngle = bonkDisc.da;
      gmDisc.actionAimCharge = bonkDisc.ds;

      gmDisc.spawnPosition = [bonkDisc.sx, bonkDisc.sy];
      gmDisc.spawnLinearVel = [bonkDisc.sxv, bonkDisc.syv];
    }
  }
}

export default WorldDisc;
