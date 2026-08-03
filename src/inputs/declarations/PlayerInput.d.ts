export interface PlayerInput {
  /**
   * `true` if the player is pressing up, `false` otherwise.
   */
  up: boolean;
  /**
   * `true` if the player is pressing down, `false` otherwise.
   */
  down: boolean;
  /**
   * `true` if the player is pressing left, `false` otherwise.
   */
  left: boolean;
  /**
   * `true` if the player is pressing right, `false` otherwise.
   */
  right: boolean;
  /**
   * `true` if the player is pressing heavy, `false` otherwise.
   */
  action: boolean;
  /**
   * `true` if the player is pressing special, `false` otherwise.
   */
  action2: boolean;
}
