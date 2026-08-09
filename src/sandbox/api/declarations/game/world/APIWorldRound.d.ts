export interface APIWorldRound {
  /**
   * Indicates how many rounds have passed since the game started (when the host presses START).
   */
  count: number;
  /**
   * Amount of steps that have happened since the last round started.
   */
  ticksSoFar: number;
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
   * When fte is greater than -1, a win screen appears and it starts counting down until it reaches 0,
   * and the round ends.
   *
   * When fte equals -1, the timer is inactive: nothing happens.
   */
  endTimer: number;
  /**
   * Indicates the player (or team) that scored this round.
   *
   * - On a Free For All game, it contains the ID of the player who just won the round.
   * - On a Teams game, it indicates the team that just won the round: 0 = red, 1 = blue, 2 = green, 3 = yellow.
   * - When set to -1 (both in FFA and Teams), it indicates a draw.
   */
  scoredThisRound: number;
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
