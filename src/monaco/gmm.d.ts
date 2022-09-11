declare interface stepEventOptions {
  /**
   * Indicates whether the listener will be called once, or if it will be called once for every player in the game.
   * The goal of this option is to facilitate self-interaction within a player, when needed (for example, to add new abilities, or to draw player-specific HUD).
   * 
   * This option only affects "roundStart" and "step".
   * 
   * If set to false, the listener will be called multiple times, and it will be given the id of a different player every time.
   * It will do so in the order the ids are in. Example: if there are two players, one with id 2 and another with id 5,
   * the function will be called twice; the first time it will be given the id 2, then the other time, the id 5.  
   * 
   * If set to true, the listener will be called once, and no variables will be given.
   */
  runOnce: boolean
}

declare interface collisionEventOptions {
  /**
   * Indicates what collision needs to happen for the event to fire: collision with a player, an arrow or a body.
   * 
   * todo add descriptions of extra args
   */
  collideWith: 'disc' | 'arrow' | 'body'
}

declare interface collisionEvent_disc extends collisionEventOptions {
  collideWith: 'disc'
}
declare interface collisionEvent_arrow extends collisionEventOptions {
  collideWith: 'arrow'
}
declare interface collisionEvent_body extends collisionEventOptions {
  collideWith: 'body'
}

declare interface bodyCollisionData {
  id: number
  fixtureId: number
  normal: number[2]
}

declare interface gameEvents {
  /**
   * Attach a function (listener) to an event. This function will be called when the event happens. An event can have multiple listeners attached to it.
   * 
   * Read more about events in @link https://todoaddthing.
   * 
   * @param eventName The name of the event to attach the listener to.
   * @param options Unique options to change when and how the listener will be called.
   * @param listener The function to attach.
   */
  addEventListener(eventName: 'roundStart', options: stepEventOptions, listener: () => void)
  addEventListener(eventName: 'step', options: stepEventOptions, listener: () => void)
  addEventListener(eventName: 'playerDie', options: null, listener: () => void)

  addEventListener(eventName: 'discCollision', options: collisionEvent_disc, listener: (discId: number, collisionId: number) => void)
  addEventListener(eventName: 'discCollision', options: collisionEvent_arrow, listener: (discId: number, collisionId: number) => void)
  addEventListener(eventName: 'discCollision', options: collisionEvent_body, listener: (discId: number, collisionData: bodyCollisionData) => void)

  addEventListener(eventName: 'arrowCollision', options: collisionEvent_disc, listener: (arrowId: number, collisionId: number) => void)
  addEventListener(eventName: 'arrowCollision', options: collisionEvent_arrow, listener: (arrowId: number, collisionId: number) => void)
  addEventListener(eventName: 'arrowCollision', options: collisionEvent_body, listener: (arrowId: number, collisionData: bodyCollisionData) => void)

  addEventListener(eventName: 'bodyCollision', options: collisionEvent_disc, listener: (bodyData: bodyCollisionData, collisionId: number) => void)
  addEventListener(eventName: 'bodyCollision', options: collisionEvent_arrow, listener: (bodyData: bodyCollisionData, collisionId: number) => void)
  addEventListener(eventName: 'bodyCollision', options: collisionEvent_body, listener: (bodyData: bodyCollisionData, collisionData: bodyCollisionData) => void)
}

declare interface swingInfo {
  /**
   * Attached body's id.
   */
  b:number
  /**
   * Grappling point relative to the attached body's position.
   */
  p:number[]
  /**
   * Grapple rod length.
   */
  l:number
}

declare interface disc {
  /**
   * X position of the disc.
   */
  x:number
  /**
   * Y position of the disc.
   */
  y:number
  /**
   * X velocity of the disc.
   */
  xv:number
  /**
   * Y velocity of the disc.
   */
  yv:number
  /**
   * Angle in degrees of the disc.
   */
  a:number
  /**
   * Angular velocity of the disc.
   */
  av:number
  /**
   * Special ability cooldown (Heavy on Classic, shooting arrows on Arrows, grappling on Grapple) in physics steps (30fps)
   */
  a1a:number
  /**
   * Team (1 = FFA, 2 = red, 3 = blue, 4 = green, 5 = yellow).
   */
  team:number
  /**
   * Stands for "no interpolation", and works just like the noLerp variables in the camera and in drawings.
   * Setting this value to true will make the game not interpolate the player's movement until the next step. Useful for teleporting players without visible middle frames.
   */
  ni:boolean
  /**
   * Spawn X position of the disc.
   */
  sx:number
  /**
   * Spawn Y position of the disc.
   */
  sy:number
  /**
   * Spawn X velocity of the disc.
   */
  sxv:number
  /**
   * Spawn Y velocity of the disc.
   */
  syv:number
  /**
   * Arrow aim speed (controls how fast an arrow will launch).
   */
  ds:number
  /**
   * Arrow aim angle, in degrees.
   */
  da:number
  /**
   * Grapple joint information. Becomes null when the player isn't grappling anything.
   */
  swing:swingInfo
}

declare interface capZone {
  ty: number
  p: number
  l: number
  i: number
  o: number
  ot: number
}

declare interface bodyForces {
  x: number
  y: number
  w: boolean
  ct: number
}

declare interface body {
  // todo deeper definitions
  /**
   * type
   */
  type: 's' | 'k' | 'd'
  /**
   * position
   */
  p: vec2
  /**
   * linear velocity
   */
  lv: vec2
  /**
   * angle
   */
  a: number
  /**
   * angular velocity
   */
  av: number
  /**
   * fric players
   */
  fricp: boolean
  /**
   * friction
   */
  fric: number
  /**
   * density
   */
  de: number
  /**
   * restitution
   */
  re: number
  /**
   * linear drag
   */
  ld: number
  /**
   * angular drag
   */
  ad: number
  /**
   * fixed rotation
   */
  fr: boolean
  /**
   * bullet
   */
  bu: boolean
  /**
   * body forces
   */
  cf: bodyForces
  /**
   * fixtures
   */
  fx: number[]
  /**
   * collision group
   */
  f_c: 1 | 2 | 3 | 4
  /**
   * collide with players
   */
  f_p: boolean
  /**
   * collide with A
   */
  f_1: boolean
  /**
   * collide with B
   */
  f_2: boolean
  /**
   * collide with C
   */
  f_3: boolean
  /**
   * collide with D
   */
  f_4: boolean
}

declare interface fixture {
  // todo deeper definitions
  /**
   * shape id
   */
  sh: number
  /**
   * name
   */
  n: string
  /**
   * colour
   */
  f: number
  /**
   * fric players
   */
  fp: boolean | null
  /**
   * fixed rotation
   */
  fr: number | null
  /**
   * restitution
   */
  re: number | null
  /**
   * density
   */
  de: number | null
  /**
   * death
   */
  d: boolean
  /**
   * no phys
   */
  np: boolean
  /**
   * no grap
   */
  ng: boolean
  /**
   * inner grap
   */
  ig: boolean
}

declare interface shape {
  /**
   * Shape type. Can be:\n
   * "bx": A box, a rectangle;\n
   * "ci": A circle;\n
   * "po": A polygon.
   */
  type : 'bx' | 'ci' | 'po'
  /**
   * Shape offset. Changing this coordinate will have no effect on polygons, only on circles and boxes.
   */
  c : number[]
  /**
   * [Box only] Width of the box.
   */
  w: number
  /**
   * [Box only] Height of the box.
   */
  h: number
  /**
   * [Box and polygon only] Angle in degrees. Changing it does not affect polygons, as their vertices have already been affected by it beforehand.
   */
  a: number
  /**
   * [Polygon only] The vertices that make up the polygon.
   */
  v: (number[])[]
  /**
   * [Polygon only] The scale of the polygon defined in the map editor. Changing this value will have no effect on the polygon.
   */
  s: number
  /**
   * [Circle only] Radius of the circle.
   */
  r: number
  /**
   * [Box and circle only] Whether the shape will shrink or not.
   */
  sk: boolean
}

declare interface physics {
  bodies: body[]
  fixtures: fixture[]
  shapes: shape[]
  ppm: number
}


declare interface gameState {
  /**
   * Array that contains varied attributes for every player currently alive.
   * Ordered by player ID (discs[0] is player with id 0, discs[2] is player with id 2, etc.)
   */
  discs: disc[]
  /**
   *
   */
  capZones: capZone[]
  /**
   *
   */
  physics: physics
}

declare interface lobbyPlayerInfo {
  /**
   * The player's username.
   */
  userName: string
  /**
   * Indicates whether the player is a guest account or not.
   */
  guest: boolean
  /**
   * The player's level.
   */
  level: number
  /**
   * Indicates in what team the player is in.
   * 
   * 0 means the player is in Spectate,
   * 1 means the player is in FFA,
   * 2 means Red Team,
   * 3 means Blue Team,
   * 4 means Green Team,
   * and 5 means Yellow Team. 
   */
  team: number
  /**
   * Background colour of the player's skin.
   */
  skinBg: number
  /**
   * All colours used in the player's skin.
   */
  skinColours: number
}

declare type mapBody = body & mapBodyAdd

declare interface mapBodyAdd {
  /**
   * Name of the body.
   */
  n: string
}

declare interface settingsMap {
  v: number

}

declare interface gameSettings {
  map: settingsMap
  gt: number
  wl: number
  q: boolean
  tl: boolean
  tea: boolean
  /**
   * 
   */
  ga: string
  mo: string
  bal: number
}

declare interface lobbyInfo {
  /**
   * The player id corresponding to *you*, the one running the code. 
   * 
   * VERY IMPORTANT, PLEASE READ: Because it's *your* id, the value of clientId is going to be different for every single person in the room,
   * because for them, it's *their* id. This means you can potentially desync the game if you use it incorrectly.
   * 
   * In order to not desync the game, you should only use it for graphical or audio purposes (like, for example, to create a drawing only if your id is 2, which will
   * make the drawing only visible to a player with the id 2), and it must not modify the game state at all.
   */
  clientId: number
  /**
   * The player id corresponding to the room host.
   */
  hostId: number
  allPlayerIds: number[]
  /**
   * Array that contains lobby-specific attributes for every player currently alive, such as usernames, levels and skin colours.
   * Ordered by player ID (discs[0] is player with id 0, discs[2] is player with id 2, etc.)
   */
  playerInfo: lobbyPlayerInfo[]
  settings: gameSettings
}

declare type vec2 = [number, number]

declare type drawingShape = drawingShapeBase & (drawingShapeBox | drawingShapeCircle | drawingShapeLine | drawingShapePolygon | drawingShapeText | drawingShapeImage)

declare interface drawingShapeBase {
  /**
   * Indicates what type of shape this is.
   */
  type: string, 
  /**
   * Colour of the shape, in 0xRRGGBB format.
   */
  colour: number
  /**
   * Alpha (opacity) of the shape, from 0 to 1.
   */
  alpha: number
  /**
   * X position of the shape, relative to the drawing.
   */
  xPos: number
  /**
   * Y position of the shape, relative to the drawing.
   */
  yPos: number
  /**
   * Determines whether any changes made to the drawing (excluding any shape changes) will go through 
   * a smooth transition (as smooth as your screen's refresh rate) or if they will be applied instantly 
   * (at 30fps). Resets to false every step.
   */
  noLerp: boolean
}

declare interface drawingShapeBox {
  type: 'bx'
  /**
   * Angle of the box, in degrees.
   */
  angle: number
  /**
   * Width of the box.
   */
  width: number
  /**
   * Height of the box.
   */
  height: number
}

declare interface drawingShapeCircle {
  type: 'ci'
  /**
   * Angle of the circle, in degrees.
   */
  angle: number
  /**
   * Width of the circle.
   */
  width: number
  /**
   * Height of the circle.
   */
  height: number
}

declare interface drawingShapePolygon {
  type: 'po'
  /**
   * Angle of the polygon, in degrees.
   */
  angle: number
  /**
   * X scale of the polygon.
   */
  xScale: number
  /**
   * Y scale of the polygon.
   */
  yScale: number
  /**
   * The vertices that make up the polygon.
   */
  vertices: vec2[]
}

declare interface drawingShapeLine {
  type: 'li'
  /**
   * X position at where the line ends.
   */
  xEnd: number
  /**
   * Y position at where the line ends.
   */
  yEnd: number
  /**
   * Width of the line.
   */
  width: number
}

declare interface drawingShapeText {
  type: 'tx'
  /**
   * Angle of the text, in degrees.
   */
  angle: number
  /**
   * Content of the text shape.
   */
  text: string
  /**
   * Size of the text.game.events
   * Determines whether the text is bold or not.
   */
  bold: boolean
  /**
   * Determines whether the text is italic or not.
   */
  italic: boolean
  /**
   * Determines the position of the text anchor. Can be "left", "center" or "right". 
   */
  align: 'left' | 'center' | 'right'
  /**
   * Determines whether the text has a drop shadow or not. The shadow looks like the in-game player names' shadow.
   */
  shadow: boolean
}

declare interface drawingShapeImage {
  type: 'im'
  /**
   * ID of the image.
   */
  id: string
  /**
   * Angle of the image, in degrees.
   */
  angle: number
  /**
   * The visible region of the image. It allows you to only show a portion of the image, instead of showing it fully. Setting this to null will show the full image.
   * 
   * The main purpose of region is to select a specific sprite for a spritesheet, so no interpolation is done on the region's properties, regardless of noLerp.
   */
  region: {
    /**
     * X position of the image region, in pixels.
     */
    xPos: number
    /**
     * Y position of the image region, in pixels.
     */
    yPos: number
    /**
     * Width of the image region, in pixels.
     */
    width: number
    /**
     * Height of the image region, in pixels.
     */
    height: number
  } | null
  /**
   * Width of the image, in meters.
   */
  width: number
  /**
   * Height of the image, in meters.
   */
  height: number
}

declare interface drawing {
  /**
   * Alpha (opacity) of the whole drawing, from 0 to 1.
   */
  alpha: number
  /**
   * X position of the drawing.
   */
  xPos: number
  /**
   * Y position of the drawing.
   */
  yPos: number
  /**
   * Angle of the drawing, in degrees.
   */
  angle: number
  /**
   * X scale of the drawing.
   */
  xScale: number
  /**
   * Y scale of the drawing.
   */
  yScale: number
  /**
   * Indicates what type of object this drawing is attached to. Whether it appears in front or behind the attached object is determined by isBehind.
   * It can be either of these five types:
   * 
   * "screen" will attach the drawing to screen space, meaning camera movement and shaking will NOT affect it. It appears in front of world space (regardless of isBehind), and does not require an id.
   * 
   * "world" will attach the drawing to world space, meaning camera movement and shaking will affect it. It appears in front of all world objects (regardless of isBehind), and doesn't require an id.
   * 
   * "disc" attaches the drawing to a disc. Position, angle and scale of the disc affects it. The drawing can appear in front of/behind the specified disc. This option requires you to put the disc's id in attachId. 
   * 
   * "body" attaches the drawing to a body. Position and angle of the body affects it. The drawing can appear in front of/behind the specified body. This option requires you to put the body's id in attachId. 
   */
  attachTo: 'screen' | 'world' | 'disc' | 'body'
  /**
   * An id, used by the "disc" and "body" attachment types.
   */
  attachId: number
  /**
   * Determines whether the drawing will appear in front or behind the attached object. If true, it will appear behind, otherwise, it will appear in front.
   */
  isBehind: boolean
  /**
   * Determines whether any changes made to the drawing (excluding any shape changes) will go through 
   * a smooth transition (as smooth as your screen's refresh rate) or if they will be applied instantly 
   * (at 30fps). Resets to false every step.
   */
  noLerp: boolean
  /**
   * An array containing all of the shapes that make up the drawing.
   */
  shapes: drawingShape[]
}

declare interface camera {
  /**
   * X position of the camera.
   */
  xPos: number
  /**
   * Y position of the camera.
   */
  yPos: number
  /**
   * Angle of the camera, in degrees.
   */
  angle: number
  /**
   * X scale (zoom) of the camera.
   */
  xScale: number
  /**
   * Y scale (zoom) of the camera.
   */
  yScale: number
  /**
   * Determines whether any changes made to this drawing will be applied through a smooth transition (as smooth as your screen's refresh rate) or if they will be applied instantly (at 30fps). Resets to false every step.
   */
  noLerp: boolean
}

declare interface gameGraphics {
  camera: camera
  drawings: drawing[]
  /**
   * Creates a drawing with the data given. Any missing properties will be replaced by defaults.
   */
  createDrawing(options: drawing): number
  bakeDrawing(drawingId: number, resolution: number): void
  debugLog(message: any): void
}

declare interface gameAudio {
  /**
   * Play a sound with a specified volume and panning.
   * 
   * The ID corresponding to a custom sound can be changed in the Mode Settings menu.
   * You can find a list with all of the vanilla sounds and their respective IDs in @link https://todoaddthing
   * @param id The ID of the sound to play.
   * @param volume Volume of the sound (0 to 1). You can play sounds with volumes higher than 1.
   * @param panning Panning (balance) of the sound (-1 to 1).
   */
  playSound(id: string, volume: number, panning: number)
  /**
   * Play a sound with a specified volume at a specified X position in the world.
   * 
   * The ID corresponding to a custom sound can be changed in the Mode Settings menu.
   * You can find a list with all of the vanilla sounds and their respective IDs in @link https://todoaddthing
   * @param id The ID of the sound to play.
   * @param volume Volume of the sound (0 to 1). You can play sounds with volumes higher than 1.
   * @param xPos World X position of the sound.
   */
  playSoundAtWorldPos(id: string, volume: number, xPos: number)
  /**
   * Stop ALL sounds that are currently playing, including sounds made by bonk.io itself.
   */
  stopAllSounds()
}

declare interface rayCastResults {
  objectType: 'disc' | 'arrow' | 'body'
  objectId: number
}

declare interface rayCastAdditionalData {
  fixtureId: number
  isCapzone: boolean
  normal: number[]
}

declare interface gamePhysics {
  rayCast(origin: number[], end: number[], filter: (objectType: 'disc'|'arrow'|'body', objectId: number, additionalData: rayCastAdditionalData) => number) 
}

declare interface playerInput {
  up: boolean
  down: boolean
  left: boolean
  right: boolean
  action: boolean
  action2: boolean
}

declare interface inputMethods {
  overrides: playerInput[]
}

declare type gameInputs = playerInput[] & inputMethods 

// eslint-disable-next-line no-unused-vars
interface game {
  /**
   * 
   */
  static events: gameEvents
  /**
   * A collection of info about the current state of a game, such as scores, player and map object attributes, etc.
   */
  static state: gameState
  /**
   * 
   */
  static inputs: gameInputs
  /**
   * A collection of info about the room, including players and game settings. 
   * This does not change at any point in the game. This means that people leaving/joining during a game will not affect the content of this object.
   */
  static lobby: lobbyInfo
  static graphics: gameGraphics
  static audio: gameAudio
}

declare var game: game;

interface Vector {
  /**
   * Adds the components of vector B to the respective components of vector A.
   * 
   * B can also be a number, in which case B is added to every single component of A.
   */
  static add(a: number[], b: number | number[]): number[]
  /**
   * Subtracts the components of vector B from the respective components of vector A.
   * 
   * B can also be a number, in which case B is subtracted from every single component of A.
   */
  static subtract(a: number[], b: number | number[]): number[]
  /**
   * Multiplies the components of vector A by the respective components of vector B.
   * 
   * B can also be a number, in which case, every single component of A is multiplied by B.
   */
  static multiply(a: number[], b: number | number[]): number[]
  /**
   * Divides the components of vector A by the respective components of vector B.
   * 
   * B can also be a number, in which case, every single component of A is divided by B.
   */
  static divide(a: number[], b: number | number[]): number[]
  /**
   * Returns the length (also called magnitude) of the vector.
   */
  static length(vector: number[]): number
  /**
   * Returns the distance between vector A and vector B.
   */
  static distance(a: number[], b: number[]): number
  /**
   * Returns the vector scaled to have a length of 1.
   */
  static normalize(vector: number[]): number[]
  /**
   * Returns the dot product of vector A and vector B.
   * 
   * If normalized vectors are given, the function returns 1 if they point in exactly the same direction,
   * -1 if they point in completely opposite directions and zero if the vectors are perpendicular.
   */
  static dot(a: number[], b: number[]): number
  /**
   * Reflects a vector (dir) off the plane defined by a normal.
   *
   * The `normal` vector defines a plane (a plane's normal is the vector that is perpendicular to its surface).
   * The `dir` vector is treated as a directional arrow coming in to the plane. 
   * The returned value is a vector of equal magnitude to `dir` but with its direction reflected.
   */
  static reflect(dir: number[], normal: number[]): number[]
  /**
   * Returns a point linearly interpolated between points A and B by the interpolant `t`.
   * 
   * When `t` = 0, point A is returned.
   * 
   * When `t` = 1, point B is returned.
   * 
   * When `t` = 0.5, the point midway between A and B is returned.
   */
  static lerp(a: number[], b: number[], t: number): number[]
}

/** 
 * An intrinsic object that provides vector mathematics functionality.
 * 
 * Vectors are represented by arrays of numbers. Example: [5, 2] is a 2d vector pointing at x: 5, y: 2.
 */
declare var Vector: Vector;

interface Math {
  /** The mathematical constant e. This is Euler's number, the base of natural logarithms. */
  readonly E: number;
  /** The natural logarithm of 10. */
  readonly LN10: number;
  /** The natural logarithm of 2. */
  readonly LN2: number;
  /** The base-2 logarithm of e. */
  readonly LOG2E: number;
  /** The base-10 logarithm of e. */
  readonly LOG10E: number;
  /** Pi. This is the ratio of the circumference of a circle to its diameter. */
  readonly PI: number;
  /** The square root of 0.5, or, equivalently, one divided by the square root of 2. */
  readonly SQRT1_2: number;
  /** The square root of 2. */
  readonly SQRT2: number;
  /**
   * Returns the absolute value of a number (the value without regard to whether it is positive or negative).
   * For example, the absolute value of -5 is the same as the absolute value of 5.
   * @param x A numeric expression for which the absolute value is needed.
   */
  abs(x: number): number;
  /**
   * Returns the arc cosine (or inverse cosine) of a number.
   * @param x A numeric expression.
   */
  acos(x: number): number;
  /**
   * Returns the arcsine of a number.
   * @param x A numeric expression.
   */
  asin(x: number): number;
  /**
   * Returns the arctangent of a number.
   * @param x A numeric expression for which the arctangent is needed.
   */
  atan(x: number): number;
  /**
   * Returns the angle (in degrees) from the X axis to a point.
   * @param y A numeric expression representing the cartesian y-coordinate.
   * @param x A numeric expression representing the cartesian x-coordinate.
   */
  atan2(y: number, x: number): number;
  /**
   * Returns the smallest integer greater than or equal to its numeric argument.
   * @param x A numeric expression.
   */
  ceil(x: number): number;
  /**
   * Returns the cosine of a number.
   * @param x A numeric expression that contains an angle measured in degrees.
   */
  cos(x: number): number;
  /**
   * Returns e (the base of natural logarithms) raised to a power.
   * @param x A numeric expression representing the power of e.
   */
  exp(x: number): number;
  /**
   * Returns the greatest integer less than or equal to its numeric argument.
   * @param x A numeric expression.
   */
  floor(x: number): number;
  /**
   * Returns the natural logarithm (base e) of a number.
   * @param x A numeric expression.
   */
  log(x: number): number;
  /**
   * Returns the larger of a set of supplied numeric expressions.
   * @param values Numeric expressions to be evaluated.
   */
  max(...values: number[]): number;
  /**
   * Returns the smaller of a set of supplied numeric expressions.
   * @param values Numeric expressions to be evaluated.
   */
  min(...values: number[]): number;
  /**
   * Returns the value of a base expression taken to a specified power.
   * @param x The base value of the expression.
   * @param y The exponent value of the expression.
   */
  pow(x: number, y: number): number;
  /** Returns a pseudorandom number between 0 and 1. */
  random(): number;
  /**
   * Returns a supplied numeric expression rounded to the nearest integer.
   * @param x The value to be rounded to the nearest integer.
   */
  round(x: number): number;
  /**
   * Returns the sine of a number.
   * @param x A numeric expression that contains an angle measured in degrees.
   */
  sin(x: number): number;
  /**
   * Returns the square root of a number.
   * @param x A numeric expression.
   */
  sqrt(x: number): number;
  /**
   * Returns the tangent of a number.
   * @param x A numeric expression that contains an angle measured in degrees.
   */
  tan(x: number): number;
}

/** 
 * An intrinsic object that provides basic mathematics functionality and constants. 
 * 
 * This Math object is slightly different than the Math object you would see in a normal JavaScript environment.
 * The two main differences are that the numbers given by the functions are capped to 9 decimals,
 * and that trigonometry functions use degrees instead of radians.
 */
declare var Math: Math;