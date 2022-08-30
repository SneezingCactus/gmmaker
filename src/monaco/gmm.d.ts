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
  addEventListener(eventName: 'discCollision', options: collisionEventOptions, listener: () => void)
  addEventListener(eventName: 'arrowCollision', options: collisionEventOptions, listener: () => void)
  addEventListener(eventName: 'bodyCollision', options: collisionEventOptions, listener: () => void)
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
   * Angle in radians of the disc.
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
   * Indicates what type of shape what the fuck ?
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
   * Angle of the drawing, in radians.
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
  bake(drawingId: number, resolution: number): void
}

declare interface rayCastResults {
  objectType: 'disc' | 'arrow' | 'body'
  objectId: number
}

declare interface gamePhysics {
  rayCast(originX, originY, endX, endY, bitMask):rayCastResults
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
declare class game {
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

  // removes annoying methods from object proto
  protected static apply:void
  protected static call:void
  protected static caller:void
  protected static name:void
  protected static prototype:void
  protected static arguments:void
  protected static toString:void
  protected static bind:void
}