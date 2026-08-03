/**
 * Disc swing (grapple rod) information.
 */
declare interface ExternalStateDiscSwing {
  /**
   * Attached body's ID.
   */
  b: number;
  /**
   * Grappling point relative to the attached body's position.
   */
  p: vector2d;
  /**
   * Grapple rod length.
   */
  l: number;
}

/**
 * Definition of a disc.
 */
declare interface ExternalStateDisc {
  /**
   * Position of the disc, as a 2d vector.
   */
  p: vector2d;
  /**
   * Linear velocity of the disc, as a 2d vector.
   */
  lv: vector2d;
  /**
   * Angle in degrees of the disc.
   */
  a: number;
  /**
   * Angular velocity of the disc.
   */
  av: number;
  /**
   * Special ability cooldown (Heavy on Classic, shooting arrows on Arrows, grappling on Grapple)
   * in physics steps (30fps)
   */
  a1a: number;
  /**
   * Team (1 = FFA, 2 = red, 3 = blue, 4 = green, 5 = yellow).
   */
  team: number;
  /**
   * Stands for "no interpolation", and works just like the noLerp variables in the camera and in drawings.
   *
   * Setting this value to true will make the game not interpolate the player's movement until the next step.
   * Useful for teleporting players without visible middle frames.
   */
  ni: boolean;
  /**
   * Spawn position of the disc, as a 2d vector.
   */
  sp: vector2d;
  /**
   * Spawn linear velocity of the disc, as a 2d vector.
   */
  slv: vector2d;
  /**
   * Arrow aim speed (controls how fast an arrow will launch).
   */
  ds: number;
  /**
   * Arrow aim angle, in degrees.
   */
  da: number;
  /**
   * Grapple joint information. Becomes null when the player isn't grappling anything.
   */
  swing: ExternalStateDiscSwing;
  /**
   * Determines whether the disc is visible or not.
   */
  visible: boolean;
}

/**
 * Information about the death of a disc.
 */
declare interface ExternalStateDiscDeath {
  /**
   * ID of the disc that died.
   */
  i: number;
  /**
   * The amount of steps that happened since the disc died.
   */
  f: number;
  /**
   * This number indicates the reason why the disc died.
   *
   * - If it's 1: the disc touched a death platform shape or a death arrow.
   * - It it's 3: an opponent claimed a capture zone.
   * - If it's 4: the disc went out of bounds.
   */
  m: number;
  /**
   * Position that the disc had when it died, as a 2d vector.
   */
  p: vector2d;
  /**
   * Linear velocity that the disc had when it died, as a 2d vector.
   */
  lv: vector2d;
}

/**
 * Definition of a projectile (arrow).
 */
declare interface ExternalStateProjectile {
  /**
   * Position of the arrow, as a 2d vector.
   */
  p: vector2d;
  /**
   * Linear velocity of the arrow, as a 2d vector.
   */
  lv: vector2d;
  /**
   * Angle in degrees of the arrow.
   */
  a: number;
  /**
   * Angular velocity of the arrow.
   */
  av: number;
  /**
   * Likely stands for "frames 'till end".
   *
   * It's a timer number that indicates how many steps are left until the arrow despawns.
   */
  fte: number;
  /**
   * Player ID of the arrow's owner.
   */
  did: number;
  /**
   * Stands for "no interpolation", and works just like the noLerp variables in the camera and in drawings.
   *
   * Setting this value to true will make the game not interpolate the arrow's movement until the next step.
   * Useful for teleporting arrows without visible middle frames.
   */
  ni: boolean;
  /**
   * Determines whether the arrow is visible or not.
   */
  visible: boolean;
}

/**
 * Definition of a capture zone.
 */
declare interface ExternalStateCapZone {
  /**
   * Capture zone type.
   *
   * - Type 1 is a normal capzone,
   * - Type 2 is Instant Red Win,
   * - Type 3 is Instant Blue Win,
   * - Type 4 is Instant Green Win,
   * - Type 5 is Instant Yellow Win.
   */
  ty: number;
  /**
   * Capture completion/process.
   *
   * It increases when only the owner/s are inside the capture zone,
   * decreases when an opponent is inside, and stays still if none or both
   * of them are inside.
   */
  p: number;
  /**
   * Capture zone length, the value that `p` must reach to completely capture the zone.
   */
  l: number;
  /**
   * ID of the capzone's fixture.
   */
  i: number;
  /**
   * ID of the owner of the capture zone. If no one has entered it yet, this will be -1. When on teams,
   * `ot` is used instead.
   */
  o: number;
  /**
   * Owner team of the capture zone.
   *
   * - When `ot == -1`, no team is owner yet.
   * - When `ot == 2`, Red Team is owner.
   * - When `ot == 3`, Blue Team is owner.
   * - When `ot == 4`, Green Team is owner.
   * - When `ot == 5`, Yellow Team is owner.
   */
  ot: number;
}

/**
 * Body apply force parameters.
 */
declare interface ExternalStateBodyForces {
  /**
   * Amount of force applied in the X axis.
   */
  x: number;
  /**
   * Amount of force applied in the Y axis.
   */
  y: number;
  /**
   * Indicates whether the force's direction is absolute (`true`) or relative (`false`).
   */
  w: boolean;
  /**
   * Amount of torque applied.
   */
  ct: number;
}

/**
 * Definition of a body.
 */
declare interface ExternalStateBody {
  /**
   * Body type.
   *
   * Can be:
   * - "s": Stationary,
   * - "k": Kinematic,
   * - "d": Dynamic (Free Moving).
   */
  type: 's' | 'k' | 'd';
  /**
   * Position of the body, as a 2d vector.
   */
  p: vector2d;
  /**
   * Linear velocity of the body, as a 2d vector.
   */
  lv: vector2d;
  /**
   * Angle in degrees of the body.
   */
  a: number;
  /**
   * Angular velocity of the body.
   */
  av: number;
  /**
   * `true` if this body can apply friction on players (Fric players), `false` otherwise.
   */
  fricp: boolean;
  /**
   * Friction of the body surface.
   */
  fric: number;
  /**
   * Density of the body.
   */
  de: number;
  /**
   * Restitution (bounciness) of the body.
   */
  re: number;
  /**
   * The amount of linear drag on the body.
   */
  ld: number;
  /**
   * The amount of angular drag on the body.
   */
  ad: number;
  /**
   * `true` if this body has a fixed rotation, `false` otherwise.
   */
  fr: boolean;
  /**
   * `true` if this body has bullet physics (Anti Tunnel), `false` otherwise.
   */
  bu: boolean;
  /**
   * Object that contains the values of the three forces that get constantly applied to the body:
   * Apply Force X (`cf.x`), Apply Force Y (`cf.y`) and Apply Torque (`cf.ct`).
   */
  cf: ExternalStateBodyForces;
  /**
   * Array that contains the IDs of each fixture that makes up this body.
   */
  fx: vector2d;
  /**
   * The collision group of the body.
   *
   * Instead of being represented by a letter, here it's represented by a number.
   * That way, collision groups A-D are represented by numbers 1-4.
   */
  f_c: 1 | 2 | 3 | 4;
  /**
   * `true` if this body can collide with players, `false` otherwise.
   */
  f_p: boolean;
  /**
   * `true` if this body can collide with group A, `false` otherwise.
   */
  f_1: boolean;
  /**
   * `true` if this body can collide with group B, `false` otherwise.
   */
  f_2: boolean;
  /**
   * `true` if this body can collide with group C, `false` otherwise.
   */
  f_3: boolean;
  /**
   * `true` if this body can collide with group D, `false` otherwise.
   */
  f_4: boolean;
  /**
   * Determines whether the body is visible or not.
   */
  visible: boolean;
}

/**
 * Definition of a fixture.
 */
declare interface ExternalStateFixture {
  /**
   * ID of the shape that corresponds to this fixture.
   */
  sh: number;
  /**
   * Name of the fixture.
   */
  n: string;
  /**
   * Colour of the fixture.
   */
  f: number;
  /**
   * `true` if this fixture can apply friction on players (Fric players), `false` otherwise.
   *
   * If set to `null`, the body's fricp will be used here.
   */
  fp: boolean | null;
  /**
   * Friction of the fixture's surface. If set to `null`, the body's friction will be used here.
   */
  fr: number | null;
  /**
   * Restitution (bounciness) of the fixture. If set to `null`, the body's restitution will be used here.
   */
  re: number | null;
  /**
   * Density of the fixture. If set to `null`, the body's density will be used here.
   */
  de: number | null;
  /**
   * `true` if this fixture can kill players, `false` otherwise.
   */
  d: boolean;
  /**
   * `true` if this fixture is no physics, `false` otherwise.
   */
  np: boolean;
  /**
   * `true` if this fixture can't be grappled, `false` otherwise.
   */
  ng: boolean;
  /**
   * `true` if this fixture can be grappled from the inside, `false` otherwise.
   */
  ig: boolean;
}

/**
 * Definition of a (fixture) shape.
 */
declare interface ExternalStateShape {
  /**
   * Shape type.
   *
   * Can be:
   * - "bx": A box (rectangle)
   * - "ci": A circle
   * - "po": A polygon.
   */
  type: 'bx' | 'ci' | 'po';
  /**
   * Shape offset. Changing this coordinate will have no effect on polygons, only on circles and boxes.
   */
  c: number[];
  /**
   * [Box only] Width of the box.
   */
  w: number;
  /**
   * [Box only] Height of the box.
   */
  h: number;
  /**
   * [Box and polygon only] Angle in degrees. Changing it does not affect polygons,
   * as their vertices have already been affected by it beforehand.
   */
  a: number;
  /**
   * [Polygon only] The vertices that make up the polygon.
   */
  v: vector2d[];
  /**
   * [Polygon only] The scale of the polygon defined in the map editor.
   * Changing this value will have no effect on the polygon.
   */
  s: number;
  /**
   * [Circle only] Radius of the circle.
   */
  r: number;
  /**
   * [Box and circle only] Whether the shape will shrink or not.
   */
  sk: boolean;
}

/**
 * A collection of diverse joint parameters.
 *
 * It is unknown why Chaz decided to make a separate collection just for these properties.
 */
declare interface ExternalStateJointSubD {
  /**
   * [Rotating joint only] Limit from angle in degrees.
   */
  la: number;
  /**
   * [Rotating joint only] Limit to angle in degrees.
   */
  ua: number;
  /**
   * [Rotating joint only] Motor turn force.
   */
  mmt: number;
  /**
   * [Rotating joint only] Motor max speed.
   */
  ms: number;
  /**
   * [Rotating joint only] `true` to enable angle limit, `false` otherwise.
   */
  el: boolean;
  /**
   * [Rotating joint only] `true` to enable motor, `false` otherwise.
   */
  em: boolean;

  /**
   * [Soft rod only] Softness of the joint.
   */
  fh: number;
  /**
   * [Soft rod only] Damping of the joint.
   */
  dr: number;

  /**
   * `true` if the attached bodies can collide, `false` otherwise.
   */
  cc: boolean;
  /**
   * Break force of the joint.
   */
  bf: number;
  /**
   * `true` if joint line should be drawn, `false` otherwise.
   */
  dl: boolean;
}

/**
 * Definition of a joint.
 */
declare interface ExternalStateJoint {
  /**
   * Joint type.
   *
   * Can be:
   * - "rv": A rotating joint,
   * - "d": A soft rod joint,
   * - "lpj": A follow path joint,
   * - "lsj": A springy joint.
   */
  type: 'rv' | 'd' | 'lpj' | 'lsj';
  /**
   * A collection of diverse joint parameters.
   *
   * It is unknown why Chaz decided to make a separate collection just for these properties.
   */
  d: ExternalStateJointSubD;
  /**
   * ID of the first body attached.
   */
  ba: number;
  /**
   * ID of the second body attached.
   *
   * To make the joint have no second attachment, set this value to -1.
   * Path and springy joints should also have it set to -1.
   */
  bb: number;
  /**
   * [Rotating and soft rod only] First attachment offset, as a 2d vector. Relative to the first attachment's body.
   */
  aa: vector2d;
  /**
   * [Rotating and soft rod only] Second attachment offset, as a 2d vector. Relative to the second attachment's body.
   * If there's no specified second body (bb == -1), it's absolute (relative to world) instead.
   */
  ab: vector2d;
  /**
   * [Rotating and soft rod only] Max length of the joint.
   */
  len: number;

  /**
   * [Follow path joint only] X offset of the joint.
   */
  pax: number;
  /**
   * [Follow path joint only] Y offset of the joint.
   */
  pay: number;
  /**
   * [Follow path joint only] Path angle in degrees.
   */
  pa: number;
  /**
   * [Follow path joint only] Move force.
   */
  pf: number;
  /**
   * [Follow path joint only] Path length.
   */
  plen: number;
  /**
   * [Follow path joint only] Move speed.
   */
  pms: number;

  /**
   * [Springy joint only] X offset of the joint.
   */
  sax: number;
  /**
   * [Springy joint only] Y offset of the joint.
   */
  say: number;
  /**
   * [Springy joint only] Spring force.
   */
  sf: number;
  /**
   * [Springy joint only] Spring length.
   */
  slen: number;
}

/**
 * Contains several map-specific settings.
 */
declare interface ExternalStateMapSettings {
  /**
   * Corresponds to the "Respawn on death" option in the map editor.
   *
   * It specifies whether discs can respawn on death or not.
   */
  re: boolean;
  /**
   * Corresponds to the "Players don't collide" option in the map editor.
   *
   * It specifies whether discs can collide with each other (false) or not (true).
   */
  nc: boolean;
  /**
   * Corresponds to the "Players can fly" option in the map editor.
   *
   * It specifies whether discs can "fly" (like in fly maps) or not.
   */
  fl: boolean;
  /**
   * Corresponds to the "Complex physics" option in the map editor.
   *
   * For some reason, it's not a boolean, but a number:
   * - When pq == 2, complex physics are used.
   * - When pq != 2, normal physics are used.
   */
  pq: number;
  /** Map editor grid size. This property has no effect whatsoever on the game. */
  gd: number;
}

/**
 * Contains a bunch of info about a map, such as the username of the person who created it, the name of the map, etc.
 */
declare interface ExternalStateMapMetadata {
  /** Map author's username. */
  a: string;
  /** The name of the map. */
  n: string;
  /**
   * Lilely stands for "database version". Maps published in flash bonk.io will have dbv 1, while maps published in
   * current bonk.io will have dbv 2.
   */
  dbv: number;
  /**
   * Recommended mode for this map.
   *
   * Modes are internally represented by an ID:
   *
   * - "b" is Classic
   * - "bs" is Simple
   * - "ar" is Arrows
   * - "ard" is Death Arrows
   * - "sp" is Grapple
   * - "v" is VTOL
   */
  mo: string;
  /** The amount of upvotes the map received. */
  vu: number;
  /** The amount of downvotes the map received. */
  vd: number;
  /**
   * Original map author's username. This is only present in edited maps.
   * In completely original maps, it gets set to "" (an empty string).
   */
  rxa: string | null;
  /**
   * Original map name. This is only present in edited maps.
   * In completely original maps, it gets set to "" (an empty string).
   */
  rxn: string | null;
  /**
   * Original database version (refer to `dbv`'s description). This is only present in edited maps.
   * In completely original maps, it gets set to 1.
   */
  rxdb: number | null;
}

/**
 * This is where map objects (called bodies), as well as their fixtures, shapes and joints, are stored.
 */
declare interface ExternalStatePhysics {
  /**
   * Array that contains the definitions of every body in the world.
   *
   * Ordered by ID (bodies[0] is body with ID 0, bodies[2] is body with ID 2, etc.)
   */
  bodies: ExternalStateBody[];
  /**
   * Array that contains the definitions of every fixture in the world. Bodies are made of fixtures.
   *
   * Ordered by ID (fixtures[0] is fixture with ID 0, fixtures[2] is fixture with ID 2, etc.)
   */
  fixtures: ExternalStateFixture[];
  /**
   * Array that contains the definitions of every shape in the world. Shapes define the geometry of each fixture.
   *
   * Ordered by ID (shapes[0] is shape with ID 0, shapes[2] is shape with ID 2, etc.)
   */
  shapes: ExternalStateShape[];
  /**
   * Array that contains the definitions of every joint in the world.
   *
   * Ordered by ID (joints[0] is joint with ID 0, joints[2] is joint with ID 2, etc.)
   */
  joints: ExternalStateJoint[];
  /**
   * Likely stands for "body render order".
   *
   * As the name suggests, this is an array that determines the order at which bodies are rendered.
   *
   * Each item contains a body ID: the first body in the list is the one that gets rendered first
   * (and as such is the farthest body from the camera) and the last body in the list is the one
   * that renders last (and as such is the nearest body).
   */
  bro: number[];
  /**
   * Likely stands for "pixels per meter". It determines the size of the map: bigger ppm, smaller map.
   *
   * Despite the name, a ppm of 1 will not make every meter a screen pixel wide,
   * instead it will make them around 1.5 pixels wide due to an internal parameter called
   * "scale ratio" that assures an optimal resolution according to the client's display size.
   */
  ppm: number;
}

/**
 * Information about a game step.
 */
declare interface ExternalGameState {
  /**
   * Likely stands for "map settings".
   *
   * It contains several map-specific settings.
   */
  ms: ExternalStateMapSettings;
  /**
   * Likely stands for "map metadata".
   *
   * It contains a bunch of info about the map, such as the author's username, the map's name, etc.
   */
  mm: ExternalStateMapMetadata;
  /**
   * Array that contains varied attributes for every disc currently alive.
   *
   * In GMMaker, the term "disc" refers to the physical manifestation of a player,
   * in other words, the ball you control during the game.
   *
   * Ordered by disc/player ID (discs[0] is disc with ID 0, discs[2] is disc with ID 2, etc.)
   */
  discs: ExternalStateDisc[];
  /**
   * Array that contains varied info about every recent death of a disc.
   *
   * In GMMaker, the term "disc" refers to the physical manifestation of a player,
   * in other words, the ball you control during the game.
   */
  discDeaths: ExternalStateDiscDeath[];
  /**
   * Array that contains varied attributes for every arrow, such as their owner and position.
   *
   * Ordered by arrow ID (arrows[0] is arrow with ID 0, arrows[2] is arrow with ID 2, etc.)
   *
   * It's unknown why Chaz named this array `projectiles`. Perhaps he wanted to add different kinds
   * of projectiles at some point.
   */
  projectiles: ExternalStateProjectile[];
  /**
   * Array that contains varied attributes for every capture zone, such as the type of capzone
   * and the fixture they possess.
   *
   * Ordered by capture zone ID (capZones[0] is capzone with ID 0, capZones[2] is capzone with ID 2, etc.)
   */
  capZones: ExternalStateCapZone[];
  /**
   * This is where map objects (called bodies), as well as their fixtures, shapes and joints, are stored.
   */
  physics: ExternalStatePhysics;
  /**
   * Likely stands for "round count". It indicates how many rounds have passed since the game started
   * (when the host presses START).
   */
  rc: number;
  /**
   * Likely stands for "round length". It's the amount of steps that have happened since last round start.
   */
  rl: number;
  /**
   * Likely stands for "frames 'till unfreeze".
   *
   * It's a timer number that indicates how many steps are left until the world unfreezes and the players
   * can start moving.
   *
   * On the first round, the name and author of the map will appear in a splash screen during this period.
   *
   * On every other round, a "Game starts in" countdown will appear, showing the amount of seconds left until
   * the timer is over.
   *
   * When the timer reaches -1, it stops and the world unfreezes.
   */
  ftu: number;
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
  fte: number;
  /**
   * Probably stands for something along the lines of "last scored".
   *
   * - On a Free For All game, it contains the ID of the player who just won the round.
   * - On a Teams game, it indicates the team that just won the round: 0 = red, 1 = blue, 2 = green, 3 = yellow.
   * - When set to -1 (both in FFA and Teams), it indicates a draw.
   */
  lscr: number;
  /**
   * Array containing the amount of wins for each player/team.
   *
   * - On a Free For All game, these scores are ordered by player ID and each one of them corresponds
   *   to a player. For example: scores[10] would be player ID 10's amount of wins.
   * - On a Teams game, there are up to 4 items, each one corresponding to a specific team,
   *   in the following order: 0 = red, 1 = blue, 2 = green, 3 = yellow.
   *   For example: scores[2] would be Team Green's amount of wins.
   */
  scores: number[];
}
