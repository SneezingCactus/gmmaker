/**
 * Contains several world-specific settings, some of which can be changed in the Map Editor.
 */
export interface APIWorldSettings {
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
