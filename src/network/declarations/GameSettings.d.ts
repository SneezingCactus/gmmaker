/**
 * Game settings set by the host of the game, such as the non-GMM mode and the amount of rounds needed to win.
 */
export interface BonkGameSettings {
  /**
   * Amount of rounds to win.
   */
  wl: number;
  /**
   * `true` if teams are locked, otherwise `false`.
   */
  tl: boolean;
  /**
   * `true` if teams are on, otherwise `false`.
   */
  tea: boolean;
  /**
   * The non-GMM mode currently selected.
   *
   * Modes are internally represented by a string:
   *
   * - "b" is Classic
   * - "bs" is Simple
   * - "ar" is Arrows
   * - "ard" is Death Arrows
   * - "sp" is Grapple
   * - "v" is VTOL
   */
  mo: string;
  /**
   * Array that contains the balance (nerf/buff) of each player. Ordered by player ID.
   *
   * Players with 0% balance are not present here.
   */
  bal: number[];
}
