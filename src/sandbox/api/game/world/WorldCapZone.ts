import type { BonkGameState, BonkStateCapZone } from '../../../../simulation/declarations/BonkGameState';
import type Game from '../../Game';

import { BONK_TEAM_IDS } from '../PlayerTeam';
import type { PlayerTeam } from '../PlayerTeam';

export type WorldCapZoneType = 'normal' | 'redWin' | 'blueWin' | 'greenWin' | 'yellowWin';

interface WorldCapZone {
  /**
   * Capture zone type. Can be:
   *
   * - 'normal': Normal capzone
   * - 'redWin': Instant Red Win
   * - 'blueWin': Instant Blue Win
   * - 'greenWin': Instant Green Win
   * - 'yellowWin': Instant Yellow Win
   */
  type: WorldCapZoneType;
  /**
   * ID of the capture zone's shape.
   */
  shapeId: number;

  /**
   * Capture completion, or progress.
   *
   * It increases when only the leading player/team is inside the capture zone,
   * decreases when only opponent/s are inside, and stays still if none or both
   * of them are inside.
   */
  captureProgress: number;
  /**
   * Value in steps (30 per second) that `progress` must reach to completely capture the zone.
   */
  captureTime: number;

  /**
   * ID of the leading player of the capture zone.
   * If no one has entered it yet, this will be `null`.
   *
   * This value is only relevant when playing a FFA game. When on teams, `leadingTeam` is used instead.
   */
  leadingPlayerId: number | null;
  /**
   * Leading team of the capture zone. Can be:
   *
   * - `null`: no team is owner yet.
   * - 'ffa': A player in a FFA game is owner.
   * - 'red': Red Team is owner.
   * - 'blue': Blue Team is owner.
   * - 'green': Green Team is owner.
   * - 'yellow': Yellow Team is owner.
   */
  leadingTeam: PlayerTeam | null;
}

const CAPZONE_BONK_TYPES: readonly WorldCapZoneType[] = [
  'normal',
  'redWin',
  'blueWin',
  'greenWin',
  'yellowWin',
];

namespace WorldCapZone {
  /**
   * @internal
   */
  export function getDefault(): WorldCapZone {
    return {
      type: 'normal',
      shapeId: 0,

      captureProgress: 0,
      captureTime: 30,

      leadingPlayerId: null,
      leadingTeam: null,
    };
  };

  /**
   * Serialize all Game capZones into the bonk state.
   *
   * @internal
   */
  export function serialize(game: Game, bonkState: BonkGameState) {
    const maxLength = Math.max(bonkState.capZones.length, game.world.capZones.length);

    for (let i = 0; i < maxLength; i++) {
      if (!bonkState.capZones[i] && !game.world.capZones[i])
        continue;

      let bonkCapZone: Partial<BonkStateCapZone> | undefined = bonkState.capZones[i];
      const gmCapZone = game.world.capZones[i];

      if (!gmCapZone) {
        delete bonkState.capZones[i];
        continue;
      }

      if (!bonkCapZone) {
        bonkCapZone = {};
        bonkState.capZones[i] = bonkCapZone as BonkStateCapZone;
      }

      bonkCapZone.ty = CAPZONE_BONK_TYPES.indexOf(gmCapZone.type);
      bonkCapZone.i = gmCapZone.shapeId;

      bonkCapZone.p = gmCapZone.captureProgress;
      bonkCapZone.l = gmCapZone.captureTime;

      bonkCapZone.o = gmCapZone.leadingPlayerId ?? -1;
      bonkCapZone.ot = gmCapZone.leadingTeam !== null ? BONK_TEAM_IDS.indexOf(gmCapZone.leadingTeam) : -1;
    }
  }

  /**
   * Deserialize all bonk state capZones (named capZones) into the Game object.
   *
   * @internal
   */
  export function deserialize(bonkState: BonkGameState, game: Game) {
    const maxLength = Math.max(bonkState.capZones.length, game.world.capZones.length);

    for (let i = 0; i < maxLength; i++) {
      if (!bonkState.capZones[i] && !game.world.capZones[i])
        continue;

      let gmCapZone: Partial<WorldCapZone> | undefined = game.world.capZones[i];
      const bonkCapZone = bonkState.capZones[i];

      if (!bonkCapZone) {
        delete game.world.capZones[i];
        continue;
      }

      if (!gmCapZone) {
        gmCapZone = {};
        game.world.capZones[i] = gmCapZone as WorldCapZone;
      }

      gmCapZone.type = CAPZONE_BONK_TYPES[bonkCapZone.ty];
      gmCapZone.shapeId = bonkCapZone.i;

      gmCapZone.captureProgress = bonkCapZone.p;
      gmCapZone.captureTime = bonkCapZone.l;

      gmCapZone.leadingPlayerId = bonkCapZone.o !== -1 ? bonkCapZone.o : null;
      gmCapZone.leadingTeam = bonkCapZone.ot !== -1 ? BONK_TEAM_IDS[bonkCapZone.ot] : null;
    }
  }
}

export default WorldCapZone;
