import type { BonkGameState } from '../../../../simulation/declarations/BonkGameState';
import type Game from '../../Game';

interface WorldRound {
  /**
   * Indicates how many rounds have passed since the game started (when the host presses START).
   */
  count: number;
  /**
   * Amount of steps that have happened since the last round started.
   */
  stepsSoFar: number;
  /**
   * Timer number that indicates how many steps are left until the world unfreezes and the players
   * can start moving.
   *
   * On the first round, the name and author of the map will appear in a splash screen during this period.
   *
   * On every other round, a "Game starts in" countdown will appear, showing the amount of seconds left until
   * the timer is over.
   *
   * When the timer reaches -1, it stops and the world unfreezes.
   */
  startTimer: number;
  /**
   * Timer number that indicates how many steps are left until the round ends and the world gets reset.
   *
   * When `endTimer` is greater than -1, a win screen appears and it starts counting down until it reaches 0,
   * then the round ends.
   *
   * When `endTimer` equals -1, the timer is inactive: nothing happens.
   */
  endTimer: number;
  /**
   * Indicates the player (or team) that scored this round.
   *
   * - On a Free For All game, it contains the ID of the player who just won the round.
   * - On a Teams game, it indicates the team that just won the round: 0 = red, 1 = blue, 2 = green, 3 = yellow.
   * - When set to `null` (both in FFA and Teams), it indicates a draw.
   */
  scoredThisRound: number | null;
  /**
   * Array containing the amount of wins for each player (or team).
   *
   * - On a Free For All game, these scores are ordered by player ID and each one of them corresponds
   *   to a player. For example: scores[10] would be player ID 10's amount of wins.
   * - On a Teams game, there are up to 4 items, each one corresponding to a specific team,
   *   in the following order: 0 = red, 1 = blue, 2 = green, 3 = yellow.
   *   For example: scores[2] would be Team Green's amount of wins.
   */
  scores: number[];
}

namespace WorldRound {
  /**
   * @internal
   */
  export function getDefault(): WorldRound {
    return {
      count: 0,
      stepsSoFar: 0,

      startTimer: -1,
      endTimer: -1,

      scoredThisRound: null,
      scores: [],
    };
  };

  /**
   * Serialize Game round info into the bonk state.
   *
   * @internal
   */
  export function serialize(game: Game, bonkState: BonkGameState) {
    const gmRound = game.world.round;

    bonkState.rc = gmRound.count;
    bonkState.rl = gmRound.stepsSoFar;
    bonkState.ftu = gmRound.startTimer;
    bonkState.fte = gmRound.endTimer;
    bonkState.lscr = gmRound.scoredThisRound ?? -1;
    bonkState.scores = gmRound.scores;
  }

  /**
   * Deserialize all bonk state discs into the Game object.
   *
   * @internal
   */
  export function deserialize(bonkState: BonkGameState, game: Game) {
    const gmRound = game.world.round;

    gmRound.count = bonkState.rc;
    gmRound.stepsSoFar = bonkState.rl;
    gmRound.startTimer = bonkState.ftu;
    gmRound.endTimer = bonkState.fte;
    gmRound.scoredThisRound = bonkState.lscr !== -1 ? bonkState.lscr : null;
    gmRound.scores = bonkState.scores;
  }
}

export default WorldRound;
