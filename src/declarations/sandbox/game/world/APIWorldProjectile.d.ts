export interface APIWorldProjectile {
  /**
   * Position of the arrow.
   */
  position: vector2d;
  /**
   * Angle in degrees of the arrow.
   */
  angle: number;

  /**
   * Linear velocity of the arrow.
   */
  linearVel: vector2d;
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
   * Stands for "no interpolation", and works just like the noLerp variables in the camera and in drawings.
   *
   * Setting this value to true will make the game not interpolate the arrow's movement until the next step.
   * Useful for teleporting arrows without visible middle frames.
   */
  noLerp: boolean;
  /**
   * Determines whether the arrow is visible or not.
   */
  visible: boolean;
}
