

declare interface swingInfo {
  /**
   * Attached body's id
   */
  b:number,
  /**
   * Grappling point relative to the attached body's position
   */
  p:number[],
  /**
   * Grapple rod length
   */
  l:number,
}

declare interface disc {
  /**
   * X position in meters.
   */
  x:number,
  /**
   * Y position in meters.
   */
  y:number,
  /**
   * X velocity in meters divided by 1 / 30 (bonk's time scale).
   */
  xv:number,
  /**
   * Y velocity in meters divided by 1 / 30 (bonk's time scale).
   */
  yv:number,
  /**
   * Angle in degrees.
   */
  a:number,
  /**
   * Angular velocity in degrees divided by 1 / 30 (bonk's time scale).
   */
  av:number,
  /**
   * Special ability cooldown (Heavy on Classic, shooting arrows on Arrows, grappling on Grapple) in physics steps (30fps)
   */
  a1a:number,
  /**
   * Team (1 = FFA, 2 = red, 3 = blue, 4 = green, 5 = yellow).
   */
  team:number,
  /**
   * Stands for "no interpolation". Setting this value to true will make the game not interpolate the player's movement until the next step. Useful for teleporting players without visible middle frames.
   */
  ni:boolean,
  /**
   * Spawn X position in meters.
   */
  sx:number,
  /**
   * Spawn Y position in meters.
   */
  sy:number,
  /**
   * Spawn X velocity in meters divided by 1 / 30 (bonk's time scale).
   */
  sxv:number,
  /**
   * Spawn Y velocity in meters divided by 1 / 30 (bonk's time scale).
   */
  syv:number,
  /**
   * Arrow aim speed (controls how fast an arrow will launch).
   */
  ds:number,
  /**
   * Arrow aim angle, in degrees.
   */
  da:number,
  /**
   * Grapple joint information. Becomes null when the player isn't grappling anything.
   */
  swing:swingInfo,
}

declare interface capZone {
  ty: number,
  p: number,
  l: number,
  i: number,
  o: number,
  ot: number,
}

declare type shape = shapeBase & (shapeBox | shapeCircle | shapePolygon);

declare interface shapeBase {
  /**
   * Shape type. Can be:\n
   * "bx": A box, a rectangle;\n
   * "ci": A circle;\n
   * "po": A polygon.
   */
  type : string;
  /**
   * Shape offset. Changing this coordinate will have no effect on polygons, only on circles and boxes.
   */
  c : number[];
  /**
   * [Box-only property] Width in meters.
   */
  w: number;
  /**
   * [Box-only property] Height in meters.
   */
  h: number;
  /**
   * [Polygon-only property] Angle in degrees.
   */
  a: number;
  /**
   * Whether the box will shrink or not.
   */
  sk: boolean;
  /**
   * Radius of circle in meters.
   */
  r: number;
  /**
   * Whether the circle will shrink or not.
   */
  sk: boolean;
}

declare interface shapeBox {
  type: "bx";

}

declare interface shapeCircle {
  type: "ci";

}

declare interface shapePolygon {
  type: "po";
  /**
   * The vertices that make up the polygon.
   */
  v: (number[])[];
  /**
   * The scale of the polygon defined in the map editor. Changing this value will have no effect on the polygon.
   */
  s: number;
  /**
   * The angle of the polygon in degrees defined in the map editor. Changing this value will have no effect on the polygon.
   */
  a: number;
}

declare interface physics {
  shapes: shape[];
}


declare interface gameState {
  /**
   * Array that contains varied attributes for every player currently alive.
   * Ordered by player ID (discs[0] is player with id 0, discs[2] is player with id 2, etc.)
   */
  discs: disc[],
  /**
   *
   */
  capZones: capZone[],
  /**
   *
   */
  physics: physics
}

// eslint-disable-next-line no-unused-vars
declare class game {
    /**
     * A collection of info about the current state of a game, such as scores, player and map object attributes, etc.
     */
    static state: gameState
}
