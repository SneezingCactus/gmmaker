/* #region GAME STATE */
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

declare interface discDeath {
  /**
   * ID of the disc that died.
   */
  i: number
  /**
   * The amount of steps that happened since the disc died.
   */
  f: number
  /**
   * This number indicates the reason why the disc died:
   * - If it's 1: the disc touched a death platform shape or a death arrow.
   * - It it's 3: an opponent claimed a capture zone.
   * - If it's 4: the disc went out of bounds.
   */
  m: number
  /**
   * X position that the disc had when it died.
   */
  x: number
  /**
   * Y position that the disc had when it died.
   */
  y: number
  /**
   * X velocity that the disc had when it died.
   */
  xv: number
  /**
   * Y velocity that the disc had when it died.
   */
  yv: number
}

declare interface projectile {
  /**
   * X position of the arrow.
   */
  x: number
  /**
   * Y position of the arrow.
   */
  y: number
  /**
   * Angle in degrees of the arrow.
   */
  a: number
  /**
   * Angular velocity of the arrow.
   */
  av: number
  /**
   * X velocity of the arrow.
   */
  xv: number
  /**
   * Y velocity of the arrow.
   */
  yv: number
  /**
   * Likely stands for "frames 'till end".
   * 
   * It's a timer number that indicates how many steps are left until the arrow despawns.
   */
  fte: number
  /**
   * Player ID of the arrow's owner.
   */
  did: number
  /**
   * Stands for "no interpolation", and works just like the noLerp variables in the camera and in drawings.
   * Setting this value to true will make the game not interpolate the arrow's movement until the next step. Useful for teleporting arrows without visible middle frames.
   */
  ni:boolean
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
  p: number[]
  /**
   * linear velocity
   */
  lv: number[]
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
   * Shape type. Can be:
   * - "bx": A box (rectangle)
   * - "ci": A circle
   * - "po": A polygon.
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

declare interface joint {
  type: 'rv' | 'd' | 'lpj' | 'lsj'
  d: {
    la: number
    ua: number
    mmt: number
    ms: number
    el: boolean
    em: boolean

    fh: number
    dr: number

    cc: boolean
    bf: number
    dl: boolean
  }
  ba: number
  bb: number
  aa: number
  ab: number
  len: number

  pax: number
  pay: number
  pa: number
  pf: number
  pl: number
  pu: number
  plen: number
  pms: number

  sax: number
  say: number
  sf: number
  slen: number
}

declare interface gameState {
  /**
   * Likely stands for "map settings". It contains several map-specific settings.
   */
  ms: {
    /** Corresponds to the "Respawn on death" option in the map editor. 
     * It specifies whether discs can respawn on death or not. */
    re: boolean
    /** Corresponds to the "Players don't collide" option in the map editor. 
     * It specifies whether discs can collide with each other (false) or not (true). */
    nc: boolean
    /** Corresponds to the "Players can fly" option in the map editor. 
     * Stands for "flying". It specifies whether discs can "fly" (like in fly maps) or not. */
    fl: boolean
    /** Corresponds to the "Complex physics" option in the map editor. 
     * For some reason, it's not a boolean, but a number:
     * - When pq equals 2, complex physics are used.
     * - When pq not equals 2, normal physics are used. */
    pq: number
    /** Map editor grid size. This property has no effect whatsoever on the game. */
    gd: number
  }
  /**
   * Probably stands for "map metadata". It contains a bunch of info about the map,
   * such as the username of the person who created it, the name of the map, etc.
   */
  mm: {
    /** Map author's username. */
    a: string
    /** The name of the map. */
    n: string
    /** Lilely stands for "database version". Maps published in flash bonk.io will have dbv 1, while maps published in current bonk.io will have dbv 2.*/
    dbv: number
    // todo
    /** this thing */
    mo: string
    /** The amount of upvotes the map received. */
    vu: number
    /** The amount of downvotes the map received. */
    vd: number
    /** Original map author's username. This is only present in edited maps. In completely original maps, it gets set to "" (an empty string). */
    rxa: string|null
    /** Original map name. This is only present in edited maps. In completely original maps, it gets set to "" (an empty string). */
    rxn: string|null
    /** Original database version (refer to `dbv`'s description). This is only present in edited maps. In completely original maps, it gets set to 1. */
    rxdb: number|null
  }
  /**
   * Array that contains varied attributes for every player currently alive.
   * Ordered by player ID (discs[0] is player with id 0, discs[2] is player with id 2, etc.)
   */
  discs: disc[]
  /**
   * 
   */
  discDeaths: discDeath[]
  projectiles: projectile[]
  capZones: capZone[]
  /**
   *
   */
  physics: {
    bodies: body[]
    fixtures: fixture[]
    shapes: shape[]
    ppm: number
  }
  /**
   * Likely stands for "round count". It indicates how many rounds have passed since the game started (when the host presses START).
   */
  rc: number
  /**
   * Likely stands for "round length". It's the amount of steps that have happened since last round start.
   */
  rl: number
  /**
   * Likely stands for "frames 'till unfreeze".
   * 
   * It's a timer number that indicates how many steps are left until the world unfreezes and the players can start moving.
   * 
   * On the first round, the name and author of the map will appear in a splash screen during this period.
   * 
   * On every other round, a "Game starts in" countdown will appear, showing the amount of seconds left until the timer is over.
   * 
   * When the timer reaches -1, it stops and the world unfreezes.
   */
  ftu: number
  /**
   * Likely stands for "frames 'till end".
   * 
   * It's a timer number that indicates how many steps are left until the round ends and the world gets reset.
   * 
   * When fte is greater than -1, a win screen appears and it starts counting down until it reaches 0,
   * and the round ends.
   * 
   * When fte equals -1, the timer is inactive: nothing happens.
   */
  fte: number
  /**
   * Probably stands for something along the lines of "last scored".
   * 
   * - On a Free For All game, it contains the id of the player who just won the round.
   * - On a Teams game, it indicates the team that just won the round: 0 = red, 1 = blue, 2 = green, 3 = yellow.
   * - When set to -1 (both in FFA and Teams), it indicates a draw.
   */
  lscr: number
  /**
   * Array containing the amount of wins for each player/team.
   * 
   * - On a Free For All game, these scores are ordered by player ID and each one of them corresponds
   *   to a player. For example: scores[10] would be player ID 10's amount of wins.
   * - On a Teams game, there are up to 4 items, each one corresponding to a specific team,
   *   in the following order: 0 = red, 1 = blue, 2 = green, 3 = yellow.
   *   For example: scores[2] would be Team Green's amount of wins.
   */
  scores: []
}
/* #endregion GAME STATE */

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
  normal: number[]
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
   * Position (offset) of the shape, as a 2d vector.
   * 
   * Read more about vectors in @link https://todoaddthing.
   */
  pos: number[]
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
   * Size of the box, as a 2d vector. X axis is width, Y axis is height.
   * 
   * Read more about vectors in @link https://todoaddthing.
   */
  size: number[]
}

declare interface drawingShapeCircle {
  type: 'ci'
  /**
   * Angle of the circle, in degrees.
   */
  angle: number
  /**
   * Size of the circle, as a 2d vector. X axis is width, Y axis is height.
   * 
   * Read more about vectors in @link https://todoaddthing.
   */
  size: number[]
}

declare interface drawingShapePolygon {
  type: 'po'
  /**
   * Angle of the polygon, in degrees.
   */
  angle: number
  /**
   * Scale of the polygon, as a 2d vector.
   * 
   * Read more about vectors in @link https://todoaddthing.
   */
  scale: number[]
  /**
   * The vertices that make up the polygon, represented as 2d vectors.
   * 
   * Read more about vectors in @link https://todoaddthing.
   */
  vertices: number[][]
}

declare interface drawingShapeLine {
  type: 'li'
  /**
   * Position at which the line ends, as a 2d vector.
   * 
   * Read more about vectors in @link https://todoaddthing.
   */
  end: number[]
  /**
   * Width (thickness) of the line.
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
     * Position of the image region, in pixels, as a 2d vector.
     * 
     * Read more about vectors in @link https://todoaddthing.
     */
    pos: number[]
    /**
     * Size of the image region, in pixels, as a 2d vector. X axis is width, Y axis is height.
     * 
     * Read more about vectors in @link https://todoaddthing.
     */
    size: number[]
  } | null
  /**
   * Size of the image, as a 2d vector. X axis is width, Y axis is height.
   * 
   * Read more about vectors in @link https://todoaddthing.
   */
  size: number[]
}

declare interface drawing {
  /**
   * Alpha (opacity) of the whole drawing, from 0 to 1.
   */
  alpha: number
  /**
   * Position of the drawing, as a 2d vector.
   * 
   * Read more about vectors in @link https://todoaddthing.
   */
  pos: number[]
  /**
   * Angle of the drawing, in degrees.
   */
  angle: number
  /**
   * Scale of the drawing, as a 2d vector.
   * 
   * Read more about vectors in @link https://todoaddthing.
   */
  scale: number[]
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
   * Position of the camera, as a 2d vector.
   * 
   * Read more about vectors in @link https://todoaddthing.
   */
  pos: number[]
  /**
   * Angle of the camera, in degrees.
   */
  angle: number
  /**
   * Scale (zoom) of the camera, as a 2d vector.
   * 
   * Read more about vectors in @link https://todoaddthing.
   */
  scale: number
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

declare interface createBodyOptions {
  /**
   * Indicates where in game.state.physics.bro the body id should be placed,
   * in other words, it indicates the layer at which the body will be drawn,
   * where the layer with the biggest number is the farthest layer, and the
   * layer with the smallest number (down to 0) is the nearest layer.
   * 
   * If you don't specify this, the body will be placed at the nearest layer (0).
   */
  viewOrder: number
  /**
   * The body to be created.
   * 
   * It's not necessary to specify every property of the body here, any
   * missing properties will be replaced by default values, so you can
   * remove property definitions for stuff you don't need. For example:
   * velocity, drag, fixed rotation, apply forces, and some others are not
   * used on static bodies, so you can remove those when creating one.
   */
  bodyDef: body
  /**
   * The fixtures that will be making up the body, from farthest to nearest.
   * 
   * It's not necessary to specify every property of every fixture here, any
   * missing properties will be replaced by default values, so you can
   * remove property definitions for stuff you don't need. For example:
   * physical properties, as well as death, no grapple and inner grapple are
   * not used in a no-physics fixture, so you can remove those when defining one.
   */
  fixtureDefs: fixture[]
  /**
   * The shapes that make up each fixture. Each shape corresponds to their respective item;
   * the first shape defined here corresponds to the first fixture, the second to the second, and so on.
   * 
   * It's not necessary to specify every property of every shape here, any
   * missing properties will be replaced by default values, so you can
   * remove property definitions for stuff you don't need to specify right now.
   */
  shapeDefs: shape[]
}

declare interface rayCastResult {
  type: 'disc' | 'arrow' | 'body'
  id: number
  point: number[]
  normal: number[]
  fixtureId: number
  isCapzone: boolean
}

declare interface gameWorld {
  /**
   * When set to true, the barrier that kills players when they go offscreen is disabled.
   */
  disableDeathBarrier: boolean
  /**
   * Kill a specified disc. The disc gets killed in the next step, 
   * so it will still exist until you move on to the next step.
   * 
   * It's also not possible to kill a disc while the game is frozen (at the start of a round).
   * 
   * @param id The id of the disc to kill.
   * @param allowRespawn When set to true, the disc can respawn (on maps that have "respawn on death" activated). 
   * When set to false, the disc can't respawn even if "respawn on death" is activated, like when someone claims a capzone.
   * True by default.
   */
  killDisc(id: number, allowRespawn: boolean)
  /**
   * Create a body with the specified body, fixture and shape definitions.
   * 
   * @returns {number} The id of the newly created body
   */
  createBody(options: createBodyOptions): number
  /**
   * Cast a ray from an `origin` point in the world to an `end` point.
   * 
   * The `filter` function's job is to indicate where the ray should stop and return the results.
   * When the ray hits something, the filter function is given details about the hit, and it must
   * judge these details and return `true` if the hit is valid and the raycast should stop, or
   * `false` if the hit is invalid and the raycast should keep going.
   * 
   * When the filter returns `true`, the raycast stops and returns the same info that was given to the filter.
   * If the ray reaches the end position without the filter ever returning `true`, meaning that there's nothing
   * left to hit, the raycast stops anyways and returns `null`.
   * 
   * Note: the fixtureId and isCapzone properties in the hit results are only for type body hits,
   * and therefore are `undefined` in type disc and type arrow hits.
   * 
   * @param origin The start point of the ray, as a 2d vector, represented by a number array `[x,y]` 
   * @param end  The end point of the ray, as a 2d vector, represented by a number array `[x,y]` 
   * @param filter Filter function that dictates at which point the ray should stop.
   */
  rayCast(origin: number[], end: number[], filter: (hit: rayCastResult) => boolean): rayCastResult|null
  /**
   * It's like a raycast, but it allows you to find multiple objects in the line.
   * 
   * When the filter returns `true`, the raycast doesn't stop, instead, it adds the hit info to an
   * array that gets returned once the raycast gets to the `end` point.
   * 
   * @param origin The start point of the ray, as a 2d vector, represented by a number array `[x,y]` 
   * @param end  The end point of the ray, as a 2d vector, represented by a number array `[x,y]` 
   * @param filter Filter function that dictates what hits should be ignored and which shouldn't.
   */
  rayCastAll(origin: number[], end: number[], filter: (hit: rayCastResult) => boolean): rayCastResult[]
}

// eslint-disable-next-line no-unused-vars
declare interface game {
  /**
   * 
   */
  events: gameEvents
  /**
   * A collection of info about the current state of a game, such as scores, player and map object attributes, etc.
   */
  state: gameState
  /**
   * 
   */
  inputs: gameInputs
  /**
   * A collection of info about the room, including players and game settings. 
   * This does not change at any point in the game. This means that people leaving/joining during a game will not affect the content of this object.
   */
  lobby: lobbyInfo
  world: gameWorld
  /**
   * 
   */
  graphics: gameGraphics
  audio: gameAudio
  /**
   * Empty object where you can store anything, as long as what you're trying to store can be represented using only JSON types (number, string, etc).
   * 
   * Whatever you store in here will stay here until the game ends.
   */
  vars: object
}

declare var game: game;

declare interface Vector {
  /**
   * Adds the components of vector B to the respective components of vector A.
   * 
   * B can also be a number, in which case B is added to every single component of A.
   */
  add(a: number[], b: number | number[]): number[]
  /**
   * Subtracts the components of vector B from the respective components of vector A.
   * 
   * B can also be a number, in which case B is subtracted from every single component of A.
   */
  subtract(a: number[], b: number | number[]): number[]
  /**
   * Multiplies the components of vector A by the respective components of vector B.
   * 
   * B can also be a number, in which case, every single component of A is multiplied by B.
   */
  multiply(a: number[], b: number | number[]): number[]
  /**
   * Divides the components of vector A by the respective components of vector B.
   * 
   * B can also be a number, in which case, every single component of A is divided by B.
   */
  divide(a: number[], b: number | number[]): number[]
  /**
   * Returns the length (also called magnitude) of the vector.
   */
  length(vector: number[]): number
  /**
   * Returns the distance between vector A and vector B.
   */
  distance(a: number[], b: number[]): number
  /**
   * Returns the vector scaled to have a length of 1.
   */
  normalize(vector: number[]): number[]
  /**
   * Returns the dot product of vector A and vector B.
   * 
   * If normalized vectors are given, the function returns 1 if they point in exactly the same direction,
   * -1 if they point in completely opposite directions and zero if the vectors are perpendicular.
   */
  dot(a: number[], b: number[]): number
  /**
   * Reflects a vector (dir) off the plane defined by a normal.
   *
   * The `normal` vector defines a plane (a plane's normal is the vector that is perpendicular to its surface).
   * The `dir` vector is treated as a directional arrow coming in to the plane. 
   * The returned value is a vector of equal magnitude to `dir` but with its direction reflected.
   */
  reflect(dir: number[], normal: number[]): number[]
  /**
   * Returns a vector linearly interpolated between vectors A and B by the interpolant t.
   * 
   * When t = 0, vector A is returned.
   * 
   * When t = 1, vector B is returned.
   * 
   * When t = 0.5, the vector midway between A and B is returned.
   */
  lerp(a: number[], b: number[], t: number): number[]
  /**
   * Rotate a 2d vector by a given angle, taking the point zero (0, 0) as the rotation center.
   */
  rotate2d(v: number[], a: number): number[]
}

/** 
 * An intrinsic object that provides vector mathematics functionality.
 * 
 * Vectors are represented by arrays of numbers. Example: [5, 2] is a 2d vector pointing at x: 5, y: 2.
 */
declare var Vector: Vector;

declare interface Math {
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