/* #region GAME STATE */
/**
 * Disc swing (grapple rod) information.
 */
declare interface swingInfo {
  /**
   * Attached body's ID.
   */
  public b: number;
  /**
   * Grappling point relative to the attached body's position.
   */
  public p: vector2d;
  /**
   * Grapple rod length.
   */
  public l: number;
}

/**
 * Definition of a disc.
 */
declare interface disc {
  /**
   * Position of the disc, as a 2d vector.
   * 
   * Read more about vectors [here](https://sneezingcactus.github.io/gmmaker/docs/tutorials/Fundaments-3.html).
   */
  public p: vector2d;
  /**
  * Linear velocity of the disc, as a 2d vector.
  * 
  * Read more about vectors [here](https://sneezingcactus.github.io/gmmaker/docs/tutorials/Fundaments-3.html).
  */
  public lv: vector2d;
  /**
   * Angle in degrees of the disc.
   */
  public a: number;
  /**
   * Angular velocity of the disc.
   */
  public av: number;
  /**
   * Special ability cooldown (Heavy on Classic, shooting arrows on Arrows, grappling on Grapple) in physics steps (30fps)
   */
  public a1a: number;
  /**
   * Team (1 = FFA, 2 = red, 3 = blue, 4 = green, 5 = yellow).
   */
  public team: number;
  /**
   * Stands for "no interpolation", and works just like the noLerp variables in the camera and in drawings.
   * 
   * Setting this value to true will make the game not interpolate the player's movement until the next step. Useful for teleporting players without visible middle frames.
   */
  public ni: boolean;
  /**
   * Spawn position of the disc, as a 2d vector.
   * 
   * Read more about vectors [here](https://sneezingcactus.github.io/gmmaker/docs/tutorials/Fundaments-3.html).
   */
  public sp: vector2d;
  /**
   * Spawn linear velocity of the disc, as a 2d vector.
   * 
   * Read more about vectors [here](https://sneezingcactus.github.io/gmmaker/docs/tutorials/Fundaments-3.html).
   */
  public slv: vector2d;
  /**
   * Arrow aim speed (controls how fast an arrow will launch).
   */
  public ds: number;
  /**
   * Arrow aim angle, in degrees.
   */
  public da: number;
  /**
   * Grapple joint information. Becomes null when the player isn't grappling anything.
   */
  public swing: swingInfo;
  /**
   * Determines whether the disc is visible or not.
   */
  public visible: boolean;
}

/**
 * Information about the death of a disc.
 */
declare interface discDeath {
  /**
   * ID of the disc that died.
   */
  public i: number;
  /**
   * The amount of steps that happened since the disc died.
   */
  public f: number;
  /**
   * This number indicates the reason why the disc died.
   * 
   * - If it's 1: the disc touched a death platform shape or a death arrow.
   * - It it's 3: an opponent claimed a capture zone.
   * - If it's 4: the disc went out of bounds.
   */
  public m: number;
  /**
   * Position that the disc had when it died, as a 2d vector.
   *  
   * Read more about vectors [here](https://sneezingcactus.github.io/gmmaker/docs/tutorials/Fundaments-3.html).
   */
  public p: vector2d;
  /**
   * Linear velocity that the disc had when it died, as a 2d vector.
   * 
   * Read more about vectors [here](https://sneezingcactus.github.io/gmmaker/docs/tutorials/Fundaments-3.html).
   */
  public lv: vector2d;
}

/**
 * Definition of a projectile (arrow).
 */
declare interface projectile {
  /**
   * Position of the arrow, as a 2d vector.
   * 
   * Read more about vectors [here](https://sneezingcactus.github.io/gmmaker/docs/tutorials/Fundaments-3.html).
   */
  public p: vector2d;
  /**
   * Linear velocity of the arrow, as a 2d vector.
   * 
   * Read more about vectors [here](https://sneezingcactus.github.io/gmmaker/docs/tutorials/Fundaments-3.html).
   */
  public lv: vector2d;
  /**
   * Angle in degrees of the arrow.
   */
  public a: number;
  /**
   * Angular velocity of the arrow.
   */
  public av: number;
  /**
   * Likely stands for "frames 'till end".
   * 
   * It's a timer number that indicates how many steps are left until the arrow despawns.
   */
  public fte: number;
  /**
   * Player ID of the arrow's owner.
   */
  public did: number;
  /**
   * Stands for "no interpolation", and works just like the noLerp variables in the camera and in drawings.
   * 
   * Setting this value to true will make the game not interpolate the arrow's movement until the next step. Useful for teleporting arrows without visible middle frames.
   */
  public ni: boolean;
  /**
   * Determines whether the arrow is visible or not.
   */
  public visible: boolean;
}

/**
 * Definition of a capture zone.
 */
declare interface capZone {
  /**
   * Capture zone type.
   * 
   * - Type 1 is a normal capzone,
   * - Type 2 is Instant Red Win,
   * - Type 3 is Instant Blue Win,
   * - Type 4 is Instant Green Win,
   * - Type 5 is Instant Yellow Win.
   */
  public ty: number;
  /**
   * Capture completion/process. 
   * 
   * It increases when only the owner/s are inside the capture zone,
   * decreases when an opponent is inside, and stays still if none or both
   * of them are inside.
   */
  public p: number;
  /**
   * Capture zone length, the value that `p` must reach to completely capture the zone.
   */
  public l: number;
  /**
   * ID of the capzone's fixture.
   */
  public i: number;
  /**
   * ID of the owner of the capture zone. If no one has entered it yet, this will be -1. When on teams, `ot` is used instead.
   */
  public o: number;
  /**
   * Owner team of the capture zone.
   * 
   * - When `ot == -1`, no team is owner yet.
   * - When `ot == 2`, Red Team is owner.
   * - When `ot == 3`, Blue Team is owner.
   * - When `ot == 4`, Green Team is owner.
   * - When `ot == 5`, Yellow Team is owner.
   */
  public ot: number;
}

/**
 * Body apply force parameters.
 */
declare interface bodyForces {
  /**
   * Amount of force applied in the X axis.
   */
  public x: number;
  /**
   * Amount of force applied in the Y axis.
   */
  public y: number;
  /**
   * Indicates whether the force's direction is absolute (`true`) or relative (`false`).
   */
  public w: boolean;
  /**
   * Amount of torque applied.
   */
  public ct: number;
}

/**
 * Definition of a body.
 */
declare interface body {
  /**
   * Body type.
   * 
   * Can be:
   * - "s": Stationary,
   * - "k": Kinematic,
   * - "d": Dynamic (Free Moving).
   */
  public type: 's' | 'k' | 'd';
  /**
   * Position of the body, as a 2d vector.
   * 
   * Read more about vectors [here](https://sneezingcactus.github.io/gmmaker/docs/tutorials/Fundaments-3.html).
   */
  public p: vector2d;
  /**
   * Linear velocity of the body, as a 2d vector.
   * 
   * Read more about vectors [here](https://sneezingcactus.github.io/gmmaker/docs/tutorials/Fundaments-3.html).
   */
  public lv: vector2d;
  /**
   * Angle in degrees of the body.
   */
  public a: number;
  /**
   * Angular velocity of the body.
   */
  public av: number;
  /**
   * `true` if this body can apply friction on players (Fric players), `false` otherwise.
   */
  public fricp: boolean;
  /**
   * Friction of the body surface.
   */
  public fric: number;
  /**
   * Density of the body.
   */
  public de: number;
  /**
   * Restitution (bounciness) of the body.
   */
  public re: number;
  /**
   * The amount of linear drag on the body.
   */
  public ld: number;
  /**
   * The amount of angular drag on the body.
   */
  public ad: number;
  /**
   * `true` if this body has a fixed rotation, `false` otherwise.
   */
  public fr: boolean;
  /**
   * `true` if this body has bullet physics (Anti Tunnel), `false` otherwise.
   */
  public bu: boolean;
  /**
   * Object that contains the values of the three forces that get constantly applied to the body: Apply Force X (`cf.x`), Apply Force Y (`cf.y`) and Apply Torque (`cf.ct`).
   */
  public cf: bodyForces;
  /**
   * Array that contains the IDs of each fixture that makes up this body.
   */
  public fx: vector2d;
  /**
   * The collision group of the body.
   * 
   * Instead of being represented by a letter, here it's represented by a number.
   * That way, collision groups A-D are represented by numbers 1-4.
   */
  public f_c: 1 | 2 | 3 | 4;
  /**
   * `true` if this body can collide with players, `false` otherwise.
   */
  public f_p: boolean;
  /**
   * `true` if this body can collide with group A, `false` otherwise.
   */
  public f_1: boolean;
  /**
   * `true` if this body can collide with group B, `false` otherwise.
   */
  public f_2: boolean;
  /**
   * `true` if this body can collide with group C, `false` otherwise.
   */
  public f_3: boolean;
  /**
   * `true` if this body can collide with group D, `false` otherwise.
   */
  public f_4: boolean;
  /**
   * Determines whether the body is visible or not.
   */
  public visible: boolean;
}

/**
 * Definition of a fixture.
 */
declare interface fixture {
  /**
   * ID of the shape that corresponds to this fixture.
   */
  public sh: number;
  /**
   * Name of the fixture.
   */
  public n: string;
  /**
   * Colour of the fixture.
   */
  public f: number;
  /**
   * `true` if this fixture can apply friction on players (Fric players), `false` otherwise.
   * 
   * If set to `null`, the body's fricp will be used here.
   */
  public fp: boolean | null;
  /**
   * Friction of the fixture's surface. If set to `null`, the body's friction will be used here.
   */
  public fr: number | null;
  /**
   * Restitution (bounciness) of the fixture. If set to `null`, the body's restitution will be used here.
   */
  public re: number | null;
  /**
   * Density of the fixture. If set to `null`, the body's density will be used here.
   */
  public de: number | null;
  /**
   * `true` if this fixture can kill players, `false` otherwise.
   */
  public d: boolean;
  /**
   * `true` if this fixture is no physics, `false` otherwise.
   */
  public np: boolean;
  /**
   * `true` if this fixture can't be grappled, `false` otherwise.
   */
  public ng: boolean;
  /**
   * `true` if this fixture can be grappled from the inside, `false` otherwise.
   */
  public ig: boolean;
}

/**
 * Definition of a (fixture) shape.
 */
declare interface shape {
  /**
   * Shape type. 
   * 
   * Can be:
   * - "bx": A box (rectangle)
   * - "ci": A circle
   * - "po": A polygon.
   */
  public type: 'bx' | 'ci' | 'po';
  /**
   * Shape offset. Changing this coordinate will have no effect on polygons, only on circles and boxes.
   */
  public c: number[];
  /**
   * [Box only] Width of the box.
   */
  public w: number;
  /**
   * [Box only] Height of the box.
   */
  public h: number;
  /**
   * [Box and polygon only] Angle in degrees. Changing it does not affect polygons, as their vertices have already been affected by it beforehand.
   */
  public a: number;
  /**
   * [Polygon only] The vertices that make up the polygon.
   */
  public v: vector2d[];
  /**
   * [Polygon only] The scale of the polygon defined in the map editor. Changing this value will have no effect on the polygon.
   */
  public s: number;
  /**
   * [Circle only] Radius of the circle.
   */
  public r: number;
  /**
   * [Box and circle only] Whether the shape will shrink or not.
   */
  public sk: boolean;
}

/**
 * A collection of diverse joint parameters.
 * 
 * It is unknown why Chaz decided to make a separate collection just for these properties.
 */
declare interface jointD {
  /**
   * [Rotating joint only] Limit from angle in degrees.
   */
  public la: number;
  /**
   * [Rotating joint only] Limit to angle in degrees.
   */
  public ua: number;
  /**
   * [Rotating joint only] Motor turn force.
   */
  public mmt: number;
  /**
   * [Rotating joint only] Motor max speed.
   */
  public ms: number;
  /**
   * [Rotating joint only] `true` to enable angle limit, `false` otherwise.
   */
  public el: boolean;
  /**
   * [Rotating joint only] `true` to enable motor, `false` otherwise.
   */
  public em: boolean;

  /**
   * [Soft rod only] Softness of the joint.
   */
  public fh: number;
  /**
   * [Soft rod only] Damping of the joint.
   */
  public dr: number;

  /**
   * `true` if the attached bodies can collide, `false` otherwise.
   */
  public cc: boolean;
  /**
   * Break force of the joint.
   */
  public bf: number;
  /**
   * `true` if joint line should be drawn, `false` otherwise.
   */
  public dl: boolean;
}

/**
 * Definition of a joint.
 */
declare interface joint {
  /**
   * Joint type.
   * 
   * Can be:
   * - "rv": A rotating joint,
   * - "d": A soft rod joint,
   * - "lpj": A follow path joint,
   * - "lsj": A springy joint.
   */
  public type: 'rv' | 'd' | 'lpj' | 'lsj';
  /**
   * A collection of diverse joint parameters.
   * 
   * It is unknown why Chaz decided to make a separate collection just for these properties.
   */
  public d: jointD;
  /**
   * ID of the first body attached.
   */
  public ba: number;
  /**
   * ID of the second body attached.
   * 
   * To make the joint have no second attachment, set this value to -1.
   * Path and springy joints should also have it set to -1.
   */
  public bb: number;
  /**
   * [Rotating and soft rod only] First attachment offset, as a 2d vector. Relative to the first attachment's body.
   * 
   * Read more about vectors [here](https://sneezingcactus.github.io/gmmaker/docs/tutorials/Fundaments-3.html).
   */
  public aa: vector2d;
  /**
   * [Rotating and soft rod only] Second attachment offset, as a 2d vector. Relative to the second attachment's body.
   * If there's no specified second body (bb == -1), it's absolute (relative to world) instead.
   * 
   * Read more about vectors [here](https://sneezingcactus.github.io/gmmaker/docs/tutorials/Fundaments-3.html).
   */
  public ab: vector2d;
  /**
   * [Rotating and soft rod only] Max length of the joint.
   */
  public len: number;

  /**
   * [Follow path joint only] X offset of the joint.
   */
  public pax: number;
  /**
   * [Follow path joint only] Y offset of the joint.
   */
  public pay: number;
  /**
   * [Follow path joint only] Path angle in degrees.
   */
  public pa: number;
  /**
   * [Follow path joint only] Move force.
   */
  public pf: number;
  /**
   * [Follow path joint only] Path length.
   */
  public plen: number;
  /**
   * [Follow path joint only] Move speed.
   */
  public pms: number;

  /**
   * [Springy joint only] X offset of the joint.
   */
  public sax: number;
  /**
   * [Springy joint only] Y offset of the joint.
   */
  public say: number;
  /**
   * [Springy joint only] Spring force.
   */
  public sf: number;
  /**
   * [Springy joint only] Spring length.
   */
  public slen: number;
}

/**
 * Contains several map-specific settings.
 */
declare interface mapSettings {
  /** Corresponds to the "Respawn on death" option in the map editor.
   * 
   * It specifies whether discs can respawn on death or not. */
  public re: boolean;
  /** Corresponds to the "Players don't collide" option in the map editor.
   * 
   * It specifies whether discs can collide with each other (false) or not (true). */
  public nc: boolean;
  /** Corresponds to the "Players can fly" option in the map editor.
   * 
   * It specifies whether discs can "fly" (like in fly maps) or not. */
  public fl: boolean;
  /** Corresponds to the "Complex physics" option in the map editor.
   * 
   * For some reason, it's not a boolean, but a number:
   * - When pq == 2, complex physics are used.
   * - When pq != 2, normal physics are used. */
  public pq: number;
  /** Map editor grid size. This property has no effect whatsoever on the game. */
  public gd: number;
}

/**
 * Contains a bunch of info about a map, such as the username of the person who created it, the name of the map, etc.
 */
declare interface mapMetadata {
  /** Map author's username. */
  public a: string;
  /** The name of the map. */
  public n: string;
  /** Lilely stands for "database version". Maps published in flash bonk.io will have dbv 1, while maps published in current bonk.io will have dbv 2.*/
  public dbv: number;
  /** Recommended mode for this map.
   * 
   * Modes are internally represented by an ID:
   * 
   * - "b" is Classic
   * - "bs" is Simple
   * - "ar" is Arrows
   * - "ard" is Death Arrows
   * - "sp" is Grapple
   * - "v" is VTOL */
  public mo: string;
  /** The amount of upvotes the map received. */
  public vu: number;
  /** The amount of downvotes the map received. */
  public vd: number;
  /** Original map author's username. This is only present in edited maps. In completely original maps, it gets set to "" (an empty string). */
  public rxa: string | null
  /** Original map name. This is only present in edited maps. In completely original maps, it gets set to "" (an empty string). */
  public rxn: string | null
  /** Original database version (refer to `dbv`'s description). This is only present in edited maps. In completely original maps, it gets set to 1. */
  public rxdb: number | null
}

/**
 * This is where map objects (called bodies), as well as their fixtures, shapes and joints, are stored.
 */
declare interface statePhysics {
  /**
   * Array that contains the definitions of every body in the world.
   * 
   * Ordered by ID (bodies[0] is body with ID 0, bodies[2] is body with ID 2, etc.)
   */
  public bodies: body[];
  /**
   * Array that contains the definitions of every fixture in the world. Bodies are made of fixtures.
   * 
   * Ordered by ID (fixtures[0] is fixture with ID 0, fixtures[2] is fixture with ID 2, etc.)
   */
  public fixtures: fixture[];
  /**
   * Array that contains the definitions of every shape in the world. Shapes define the geometry of each fixture. 
   * 
   * Ordered by ID (shapes[0] is shape with ID 0, shapes[2] is shape with ID 2, etc.)
   */
  public shapes: shape[];
  /**
   * Array that contains the definitions of every joint in the world.
   * 
   * Ordered by ID (joints[0] is joint with ID 0, joints[2] is joint with ID 2, etc.)
   */
  public joints: joint[];
  /**
   * Likely stands for "body render order".
   * 
   * As the name suggests, this is an array that determines the order at which bodies are rendered.
   * 
   * Each item contains a body ID: the first body in the list is the one that gets rendered first
   * (and as such is the farthest body from the camera) and the last body in the list is the one
   * that renders last (and as such is the nearest body).
   */
  public bro: number[];
  /**
   * Likely stands for "pixels per meter". It determines the size of the map: bigger ppm, smaller map.
   * 
   * Despite the name, a ppm of 1 will not make every meter a screen pixel wide,
   * instead it will make them around 1.5 pixels wide due to an internal parameter called
   * "scale ratio" that assures an optimal resolution according to the client's display size. 
   */
  public ppm: number;
}

/**
 * Information about a game step.
 */
declare interface gameState {
  /**
   * Likely stands for "map settings". 
   * 
   * It contains several map-specific settings.
   */
  public ms: mapSettings;
  /**
   * Probably stands for "map metadata". 
   * 
   * It contains a bunch of info about the map, such as the username of the person who created it, the name of the map, etc.
   */
  public mm: mapMetadata;
  /**
   * Array that contains varied attributes for every disc currently alive.
   * 
   * In GMMaker, the term "disc" refers to the physical manifestation of a player,
   * in other words, the ball you control during the game.
   * 
   * Ordered by disc/player ID (discs[0] is disc with ID 0, discs[2] is disc with ID 2, etc.)
   */
  public discs: disc[];
  /**
   * Array that contains varied info about every recent death of a disc.
   * 
   * In GMMaker, the term "disc" refers to the physical manifestation of a player,
   * in other words, the ball you control during the game.
   */
  public discDeaths: discDeath[];
  /**
   * Array that contains varied attributes for every arrow, such as their owner and position.
   * 
   * Ordered by arrow ID (arrows[0] is arrow with ID 0, arrows[2] is arrow with ID 2, etc.)
   * 
   * It's unknown why Chaz named this array `projectiles`. Perhaps he wanted to add different kinds
   * of projectiles at some point.
   */
  public projectiles: projectile[];
  /**
   * Array that contains varied attributes for every capture zone, such as the type of capzone and the fixture they possess.
   * 
   * Ordered by capture zone ID (capZones[0] is capzone with ID 0, capZones[2] is capzone with ID 2, etc.)
   */
  public capZones: capZone[];
  /**
   * This is where map objects (called bodies), as well as their fixtures, shapes and joints, are stored.
   */
  public physics: statePhysics;
  /**
   * Likely stands for "round count". It indicates how many rounds have passed since the game started (when the host presses START).
   */
  public rc: number;
  /**
   * Likely stands for "round length". It's the amount of steps that have happened since last round start.
   */
  public rl: number;
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
  public ftu: number;
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
  public fte: number;
  /**
   * Probably stands for something along the lines of "last scored".
   * 
   * - On a Free For All game, it contains the ID of the player who just won the round.
   * - On a Teams game, it indicates the team that just won the round: 0 = red, 1 = blue, 2 = green, 3 = yellow.
   * - When set to -1 (both in FFA and Teams), it indicates a draw.
   */
  public lscr: number;
  /**
   * Array containing the amount of wins for each player/team.
   * 
   * - On a Free For All game, these scores are ordered by player ID and each one of them corresponds
   *  public  to a player. For example: scores[10] would be player ID 10's amount of wins.
   * - On a Teams game, there are up to 4 items, each one corresponding to a specific team,
   *  public  in the following order: 0 = red, 1 = blue, 2 = green, 3 = yellow.
   *  public  For example: scores[2] would be Team Green's amount of wins.
   */
  public scores: number[];
}
/* #endregion GAME STATE */

/**
 * 
 */
declare interface stepEventOptions {
  /**
   * Indicates whether the listener will be called once, or if it will be called once for every player in the game.
   * 
   * The goal of this option is to facilitate self-interaction within a player, when needed (for example, to add new abilities, or to draw player-specific HUD).
   * 
   * This option only affects "roundStart" and "step".
   * 
   * If set to true, the listener will be called multiple times, and it will be given the ID of a different player every time.
   * It will do so in the order the ids are in. Example: if there are two players, one with ID 2 and another with ID 5,
   * the function will be called twice; the first time it will be given the ID 2, then the other time, the ID 5.  
   * 
   * If set to false, the listener will be called once, and no variables will be given.
   */
  public perPlayer: boolean;
}

/**
 * 
 */
declare interface collisionEventOptions {
  /**
   * Indicates what collision needs to happen for the event to fire: collision with a player, an arrow or a body.
   */
  public collideWith: 'disc' | 'arrow' | 'body';
}

/**
 * 
 */
declare interface collisionEvent_disc extends collisionEventOptions {
  public collideWith: 'disc';
}
/**
 * 
 */
declare interface collisionEvent_arrow extends collisionEventOptions {
  public collideWith: 'arrow';
}
/**
 * 
 */
declare interface collisionEvent_body extends collisionEventOptions {
  public collideWith: 'body';
}

/**
 * Additional collision data that only body collisions possess.
 */
declare interface bodyCollisionData {
  /**
   * ID of the body hit.
   */
  public id: number;
  /**
   * ID of the fixture hit.
   */
  public fixtureId: number;
  /**
   * A 2d vector with a length of 1 that represents the direction of the face hit by the other object.
   * 
   * Read more about vectors [here](https://sneezingcactus.github.io/gmmaker/docs/tutorials/Fundaments-3.html).
   */
  public normal: vector2d;
}

/**
 * 
 */
declare interface gameEvents {
  /**
   * Attach a function (listener) to an event. This function will be called when the event happens. An event can have multiple listeners attached to it.
   * 
   * Read more about events [here](https://sneezingcactus.github.io/gmmaker/docs/tutorials/Fundaments-1.html).
   * 
   * @param eventName - The name of the event to attach the listener to.
   * @param options - Unique options to change when and how the listener will be called.
   * @param listener - The function to attach.
   */
  public addEventListener(eventName: 'roundStart', options: stepEventOptions, listener: () => void)
  public addEventListener(eventName: 'step', options: stepEventOptions, listener: () => void)
  public addEventListener(eventName: 'playerDie', options: null, listener: () => void)

  public addEventListener(eventName: 'discCollision', options: collisionEvent_disc, listener: (discId: number, collisionId: number) => void)
  public addEventListener(eventName: 'discCollision', options: collisionEvent_arrow, listener: (discId: number, collisionId: number) => void)
  public addEventListener(eventName: 'discCollision', options: collisionEvent_body, listener: (discId: number, collisionData: bodyCollisionData) => void)

  public addEventListener(eventName: 'arrowCollision', options: collisionEvent_disc, listener: (arrowId: number, collisionId: number) => void)
  public addEventListener(eventName: 'arrowCollision', options: collisionEvent_arrow, listener: (arrowId: number, collisionId: number) => void)
  public addEventListener(eventName: 'arrowCollision', options: collisionEvent_body, listener: (arrowId: number, collisionData: bodyCollisionData) => void)

  public addEventListener(eventName: 'bodyCollision', options: collisionEvent_disc, listener: (bodyData: bodyCollisionData, collisionId: number) => void)
  public addEventListener(eventName: 'bodyCollision', options: collisionEvent_arrow, listener: (bodyData: bodyCollisionData, collisionId: number) => void)
  public addEventListener(eventName: 'bodyCollision', options: collisionEvent_body, listener: (bodyData: bodyCollisionData, collisionData: bodyCollisionData) => void)
}

/**
 * 
 */
declare interface lobbyPlayerInfo {
  /**
   * The player's username.
   */
  public userName: string;
  /**
   * Indicates whether the player is a guest account or not.
   */
  public guest: boolean;
  /**
   * The player's level.
   */
  public level: number;
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
  public team: number;
  /**
   * Background colour of the player's skin.
   */
  public skinBg: number;
  /**
   * All colours used in the player's skin.
   */
  public skinColours: number;
}

/**
 * Game settings set by the host of the game, such as the non-GMM mode and the amount of rounds needed to win.
 */
declare interface gameSettings {
  /**
   * Amount of rounds to win.
   */
  public wl: number;
  /**
   * `true` if teams are locked, otherwise `false`.
   */
  public tl: boolean;
  /**
   * `true` if teams are on, otherwise `false`.
   */
  public tea: boolean;
  /**
   * The non-GMM mode currently selected.
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
  public mo: string;
  /**
   * Array that contains the balance (nerf/buff) of each player. Ordered by player ID.
   * 
   * Players with 0% balance are not present here.
   */
  public bal: number[];
}

/**
 * Information about the current lobby (players, settings, etc).
 */
declare interface gameLobby {
  /**
   * The player ID corresponding to *you*, the one running the code. 
   * 
   * VERY IMPORTANT, PLEASE READ: Because it's *your* ID, the value of clientId is going to be different for every single person in the room,
   * because for them, it's *their* ID. This means you can potentially desync the game if you use it incorrectly.
   * 
   * In order to not desync the game, you should only use it for graphical or audio purposes (like, for example, to create a drawing only if your ID is 2, which will
   * make the drawing only visible to a player with the ID 2), and it must not modify the game state at all.
   */
  public clientId: number;
  /**
   * The player ID corresponding to the room host.
   */
  public hostId: number;
  /**
   * Array that contains all player IDs in use. 
   * 
   * This list is static, so if a player leaves or another one joins, this will not change until next game.
   */
  public allPlayerIds: number[];
  /**
   * Array that contains lobby-specific attributes for every player currently alive, such as usernames, levels and skin colours.
   * 
   * Ordered by player ID (discs[0] is player with ID 0, discs[2] is player with ID 2, etc.)
   */
  public playerInfo: lobbyPlayerInfo[];
  /**
   * Game settings set by the host of the game, such as the non-GMM mode and the amount of rounds needed to win.
   */
  public settings: gameSettings;
}

/**
 * Definition of a (drawing) shape.
 */
declare type drawingShape = drawingShapeBase & (drawingShapeBox | drawingShapeCircle | drawingShapeLine | drawingShapePolygon | drawingShapeText | drawingShapeImage)

/**
 * Properties that any (drawing) shape has.
 */
declare interface drawingShapeBase {
  /**
   * Indicates what type of shape this is.
   */
  public type: string,
  /**
   * Colour of the shape, in 0xRRGGBB format.
   */
  public colour: number;
  /**
   * Alpha (opacity) of the shape, from 0 to 1.
   */
  public alpha: number;
  /**
   * Position (offset) of the shape, as a 2d vector.
   * 
   * Read more about vectors [here](https://sneezingcactus.github.io/gmmaker/docs/tutorials/Fundaments-3.html).
   */
  public pos: vector2d;
  /**
   * Determines whether any changes made to the drawing (excluding any shape changes) will go through a smooth transition (as smooth as your screen's refresh rate) or if they will be applied instantly (at 30fps). Resets to false every step.
   */
  public noLerp: boolean;
}

/**
 * Box (drawing) shape specific properties.
 */
declare interface drawingShapeBox {
  public type: 'bx';
  /**
   * Angle of the box, in degrees.
   */
  public angle: number;
  /**
   * Size of the box, as a 2d vector. X axis is width, Y axis is height.
   * 
   * Read more about vectors [here](https://sneezingcactus.github.io/gmmaker/docs/tutorials/Fundaments-3.html).
   */
  public size: vector2d;
}

/**
 * Circle (drawing) shape specific properties.
 */
declare interface drawingShapeCircle {
  public type: 'ci';
  /**
   * Angle of the circle, in degrees.
   */
  public angle: number;
  /**
   * Size of the circle, as a 2d vector. X axis is width, Y axis is height.
   * 
   * Read more about vectors [here](https://sneezingcactus.github.io/gmmaker/docs/tutorials/Fundaments-3.html).
   */
  public size: vector2d;
}

/**
 * Polygon (drawing) shape specific properties.
 */
declare interface drawingShapePolygon {
  public type: 'po';
  /**
   * Angle of the polygon, in degrees.
   */
  public angle: number;
  /**
   * Scale of the polygon, as a 2d vector.
   * 
   * Read more about vectors [here](https://sneezingcactus.github.io/gmmaker/docs/tutorials/Fundaments-3.html).
   */
  public scale: vector2d;
  /**
   * The vertices that make up the polygon, represented as 2d vectors.
   * 
   * Read more about vectors [here](https://sneezingcactus.github.io/gmmaker/docs/tutorials/Fundaments-3.html).
   */
  public vertices: vector2d[];
}

/**
 * Line (drawing) shape specific properties.
 */
declare interface drawingShapeLine {
  public type: 'li';
  /**
   * Position at which the line ends, as a 2d vector.
   * 
   * Read more about vectors [here](https://sneezingcactus.github.io/gmmaker/docs/tutorials/Fundaments-3.html).
   */
  public end: vector2d;
  /**
   * Width (thickness) of the line.
   */
  public width: number;
}

/**
 * Text (drawing) shape specific properties.
 */
declare interface drawingShapeText {
  public type: 'tx';
  /**
   * Angle of the text, in degrees.
   */
  public angle: number;
  /**
   * Content of the text shape.
   */
  public text: string;
  /**
   * Size of the text.
   */
  public size: number;
  /**
   * Determines whether the text is bold or not.
   */
  public bold: boolean;
  /**
   * Determines whether the text is italic or not.
   */
  public italic: boolean;
  /**
   * Determines the position of the text anchor. Can be "left", "center" or "right". 
   */
  public align: 'left' | 'center' | 'right';
  /**
   * Determines whether the text has a drop shadow or not. The shadow looks like the in-game player names' shadow.
   */
  public shadow: boolean;
}

/**
 * The visible region of an image. It allows you to only show a portion of the image, instead of showing it fully.
 */
declare interface drawingImageRegion {
  /**
   * Position of the image region, in pixels, as a 2d vector.
   * 
   * Read more about vectors [here](https://sneezingcactus.github.io/gmmaker/docs/tutorials/Fundaments-3.html).
   */
  public pos: vector2d;
  /**
   * Size of the image region, in pixels, as a 2d vector. X axis is width, Y axis is height.
   * 
   * Read more about vectors [here](https://sneezingcactus.github.io/gmmaker/docs/tutorials/Fundaments-3.html).
   */
  public size: vector2d;
}

/**
 * Image (drawing) shape specific properties.
 */
declare interface drawingShapeImage {
  public type: 'im';
  /**
   * ID of the image.
   */
  public id: string;
  /**
   * Angle of the image, in degrees.
   */
  public angle: number;
  /**
   * The visible region of the image. It allows you to only show a portion of the image, instead of showing it fully. Setting this to null will show the full image.
   * 
   * The main purpose of region is to select a specific sprite for a spritesheet, so no interpolation is done on the region's properties, regardless of noLerp.
   */
  public region: drawingImageRegion | null
  /**
   * Size of the image, as a 2d vector. X axis is width, Y axis is height.
   * 
   * Read more about vectors [here](https://sneezingcactus.github.io/gmmaker/docs/tutorials/Fundaments-3.html).
   */
  public size: vector2d;
}

/**
 * Definition of a drawing.
 */
declare interface drawing {
  /**
   * Alpha (opacity) of the whole drawing, from 0 to 1.
   */
  public alpha: number;
  /**
   * Position of the drawing, as a 2d vector.
   * 
   * Read more about vectors [here](https://sneezingcactus.github.io/gmmaker/docs/tutorials/Fundaments-3.html).
   */
  public pos: vector2d;
  /**
   * Angle of the drawing, in degrees.
   */
  public angle: number;
  /**
   * Scale of the drawing, as a 2d vector.
   * 
   * Read more about vectors [here](https://sneezingcactus.github.io/gmmaker/docs/tutorials/Fundaments-3.html).
   */
  public scale: vector2d;
  /**
   * Indicates what type of object this drawing is attached to. Whether it appears in front or behind the attached object is determined by isBehind.
   * 
   * It can be either of these five types:
   * 
   * "screen" will attach the drawing to screen space, meaning camera movement and shaking will NOT affect it. It appears in front of world space (regardless of isBehind), and does not require an ID.
   * 
   * "world" will attach the drawing to world space, meaning camera movement and shaking will affect it. It appears in front of all world objects (regardless of isBehind), and doesn't require an ID.
   * 
   * "disc" attaches the drawing to a disc. Position, angle and scale of the disc affects it. The drawing can appear in front of/behind the specified disc. This option requires you to put the disc's ID in attachId. 
   * 
   * "body" attaches the drawing to a body. Position and angle of the body affects it. The drawing can appear in front of/behind the specified body. This option requires you to put the body's ID in attachId. 
   */
  public attachTo: 'screen' | 'world' | 'disc' | 'body';
  /**
   * An ID, used by the "disc" and "body" attachment types.
   */
  public attachId: number;
  /**
   * Determines whether the drawing will appear in front or behind the attached object. If true, it will appear behind, otherwise, it will appear in front.
   */
  public isBehind: boolean;
  /**
   * Determines whether any changes made to the drawing (excluding any shape changes) will go through a smooth transition (as smooth as your screen's refresh rate) or if they will be applied instantly (at 30fps). Resets to false every step.
   */
  public noLerp: boolean;
  /**
   * An array containing all of the shapes that make up the drawing.
   */
  public shapes: drawingShape[];
}

declare interface camera {
  /**
   * Position of the camera, as a 2d vector.
   * 
   * Read more about vectors [here](https://sneezingcactus.github.io/gmmaker/docs/tutorials/Fundaments-3.html).
   */
  public pos: number[];
  /**
   * Angle of the camera, in degrees.
   */
  public angle: number;
  /**
   * Scale (zoom) of the camera, as a 2d vector.
   * 
   * Read more about vectors [here](https://sneezingcactus.github.io/gmmaker/docs/tutorials/Fundaments-3.html).
   */
  public scale: number;
  /**
   * Determines whether any changes made to this drawing will be applied through a smooth transition (as smooth as your screen's refresh rate) or if they will be applied instantly (at 30fps). Resets to false every step.
   */
  public noLerp: boolean;
}

/**
 * Information, parameters and methods related to graphics.
 */
declare interface gameGraphics {
  /**
   * Camera parameters, such as position, angle, scale (zoom), etc.
   * 
   * If any of these parameters is altered, arrows that indicate the location of offscreen players will stop being shown.
   */
  public camera: camera;
  /**
   * Array containing every drawing, ordered by ID. You can modify or delete drawings from here, and they will update accordingly.
   */
  public drawings: drawing[];
  /**
   * The quality option chosen by *you*, the one running the code, in the bonk.io settings menu.
   * 
   * Quality is stored as a number: 1 is Low, 2 is Medium and 3 is High.
   * 
   * VERY IMPORTANT, PLEASE READ: Because it's *your* chosen quality, this value may be different for other people in the room,
   * because for them, it's *their* chosen quality. This means you can potentially desync the game if you use it incorrectly.
   * 
   * In order to not desync the game, you should only use it for graphical or audio purposes (like, for example, 
   * to create certain drawings only if you have your quality set to High), and it must not modify the game state at all.
   */
  public quality: 1 | 2 | 3;
  /**
   * Creates a drawing with the data given. Any missing properties will be replaced with defaults.
   * 
   * @returns The newly created drawing's id
   */
  public createDrawing(options: drawing): number;
  /**
   * Adds the given shape to a drawing. Any missing properties in the shape will be replaced with defaults.
   * 
   * @param drawingId - ID of the drawing
   * @param shape - Shape to add
   * @returns The newly added shape's index
   */
  public addShapeToDrawing(drawingId: number, shape: drawingShape): number;
  /**
   * Bake a drawing into a single image shape. 
   * 
   * This helps reduce lag by a lot, but the downside is that their shapes will no longer be modifiable.
   * @param drawingId - ID of the drawing
   * @param resolution - Quality of the newly rendered image
   */
  public bakeDrawing(drawingId: number, resolution: number): void;
  /**
   * Get the current screen size (in GMMaker units), as a 2d vector. X axis is width, Y axis is height.
   * 
   * Read more about vectors [here](https://sneezingcactus.github.io/gmmaker/docs/tutorials/Fundaments-3.html).
   * 
   * PD: The formula to calculate screen size is very simple.
   * 
   * - width: `730 / game.state.physics.ppm`
   * - height: `500 / game.state.physics.ppm`
   */
  public getScreenSize(): number[];
}

/**
 * Methods that allow the mode to play and stop sounds.
 */
declare interface gameAudio {
  /**
   * Play a sound with a specified volume and panning.
   * 
   * The ID corresponding to a custom sound can be changed in the Mode Settings menu.
   * You can find a list with all of the vanilla sounds and their respective IDs [here](https://sneezingcactus.github.io/gmmaker/docs/tutorials/Other-2.html).
   * @param id - The ID of the sound to play.
   * @param volume - Volume of the sound (0 to 1). You can play sounds with volumes higher than 1.
   * @param panning - Panning (balance) of the sound (-1 to 1).
   */
  public playSound(id: string, volume: number, panning: number): void;
  /**
   * Play a sound with a specified volume at a specified X position in the world.
   * 
   * The ID corresponding to a custom sound can be changed in the Mode Settings menu.
   * You can find a list with all of the vanilla sounds and their respective IDs [here](https://sneezingcactus.github.io/gmmaker/docs/tutorials/Other-2.html).
   * @param id - The ID of the sound to play.
   * @param volume - Volume of the sound (0 to 1). You can play sounds with volumes higher than 1.
   * @param xPos - World X position of the sound.
   */
  public playSoundAtWorldPos(id: string, volume: number, xPos: number): void;
  /**
   * Stop ALL sounds that are currently playing, including sounds made by bonk.io itself.
   */
  public stopAllSounds(): void;
}

declare interface playerInputMouse {
  /**
   * Player's mouse position, in GMMaker units.
   */
  public pos: number[];
  /**
   * This variable controls whether this player can send their mouse position to the others in the room or not.
   * 
   * Input sending can cause lots of lag, specially for something like mouse position
   * which has to be sent every time it changes. That's why this is very useful: by denying the player to
   * send their mouse position, you're reducing lag.
   * 
   * If set to `false`, this player will stop sending their mouse pos and the `pos` property will be set to `[0, 0]`.
   * 
   * If set to `true`, this player will be able to send their mouse pos again.
   * 
   * Important notes: 
   * - This doesn't affect mouse button inputs, they will get sent normally.
   * - You must wait a step after modifying this for the changes to happen.
   * - This is the only value you can edit from inputs.
   */
  public allowPosSending: boolean;
  /**
   * `true` if the player is pressing the left mouse button, `false` otherwise.
   */
  public left: boolean;
  /**
   * `true` if the player is pressing the right mouse button, `false` otherwise.
   */
  public right: boolean;
  /**
   * `true` if the player is pressing the middle mouse button (the scroll wheel), `false` otherwise.
   */
  public middle: boolean;
}

/**
 * Inputs (key/button press states and mouse position) of a player.
 */
declare interface playerInput {
  /**
   * `true` if the player is pressing up, `false` otherwise.
   */
  public up: boolean;
  /**
   * `true` if the player is pressing down, `false` otherwise.
   */
  public down: boolean;
  /**
   * `true` if the player is pressing left, `false` otherwise.
   */
  public left: boolean;
  /**
   * `true` if the player is pressing right, `false` otherwise.
   */
  public right: boolean;
  /**
   * `true` if the player is pressing heavy, `false` otherwise.
   */
  public action: boolean;
  /**
   * `true` if the player is pressing special, `false` otherwise.
   */
  public action2: boolean;
  /**
   * Mouse info, such as position and key states for the three mouse buttons (left, right and middle).
   */
  public mouse: playerInputMouse;
}

/**
 * Override keys for a player.
 */
declare interface playerOverride {
  /**
   * Override for the player's up key.
   */
  public up: boolean;
  /**
   * Override for the player's down key.
   */
  public down: boolean;
  /**
   * Override for the player's left key.
   */
  public left: boolean;
  /**
   * Override for the player's right key.
   */
  public right: boolean;
  /**
   * Override for the player's action key.
   */
  public action: boolean;
  /**
   * Override for the player's action2 key.
   */
  public action2: boolean;
}

/**
 * Extra properties in game.inputs that aren't part of the array.
 */
declare interface inputExtra {
  /**
   * An array containing input overrides for every player, ordered by player ID.
   * 
   * Each index (except those who don't belong to any player) contains
   * six override keys: `up`, `down`, `left`, `right`, `action`, and `action2`.
   * These override keys are set to null by default.
   * 
   * When you set one of the override keys, such as `up`, to true or false,
   * the player will lose control of that key and the game will be forced
   * to think that key is being pressed or not, depending on the value you set
   * it at (true = pressed, false = not pressed).
   * 
   * If you set the override key back to null, the player will be able to
   * control the key again.
   */
  public overrides: playerOverride[];
}

/**
 * 
 */
declare type gameInputs = playerInput[] & inputExtra;

/**
 * 
 */
declare interface createBodyOptions {
  /**
   * Indicates where in game.state.physics.bro the body ID should be placed.
   * 
   * In other words, it indicates the layer at which the body will be drawn,
   * where the layer with the biggest number is the farthest layer, and the
   * layer with the smallest number (down to 0) is the nearest layer.
   * 
   * If you don't specify this, the body will be placed at the nearest layer (0).
   */
  public viewOrder: number;
  /**
   * The body to be created.
   * 
   * It's not necessary to specify every property of the body here, any
   * missing properties will be replaced with default values, so you can
   * remove property definitions for stuff you don't need. For example:
   * velocity, drag, fixed rotation, apply forces, and some others are not
   * used on static bodies, so you can remove those when creating one.
   */
  public bodyDef: body;
  /**
   * The fixtures that will be making up the body, from farthest to nearest.
   * 
   * It's not necessary to specify every property of every fixture here, any
   * missing properties will be replaced with default values, so you can
   * remove property definitions for stuff you don't need. For example:
   * physical properties, as well as death, no grapple and inner grapple are
   * not used in a no-physics fixture, so you can remove those when defining one.
   */
  public fixtureDefs: fixture[];
  /**
   * The shapes that make up each fixture. Each shape corresponds to their respective item; the first shape defined here corresponds to the first fixture, the second to the second, and so on.
   * 
   * It's not necessary to specify every property of every shape here, any
   * missing properties will be replaced with default values, so you can
   * remove property definitions for stuff you don't need to specify right now.
   */
  public shapeDefs: shape[];
}

/**
 * 
 */
declare interface addFixtureShapeOptions {
  /**
   * The ID of the body to attach the fixture to.
   */
  public bodyId: body;
  /**
   * The fixture to be created.
   * 
   * It's not necessary to specify every property of the fixture here, any
   * missing properties will be replaced with default values, so you can
   * remove property definitions for stuff you don't need. For example:
   * physical properties, as well as death, no grapple and inner grapple are
   * not used in a no-physics fixture, so you can remove those when defining one.
   */
  public fixtureDefs: fixture[];
  /**
   * The shape that makes up the fixture.
   * 
   * It's not necessary to specify every property of the shape here, any
   * missing properties will be replaced with default values, so you can
   * remove property definitions for stuff you don't need to specify right now.
   */
  public shapeDefs: shape[];
}

/**
 * 
 */
declare interface rayCastResult {
  /**
   * Type of object hit by the raycast. Can be "disc", "arrow" or "body".
   */
  public type: 'disc' | 'arrow' | 'body';
  /**
   * ID of the object.
   */
  public id: number;
  /**
   * Point in space where the raycast hit the object. This is a 2d vector.
   * 
   * Read more about vectors [here](https://sneezingcactus.github.io/gmmaker/docs/tutorials/Fundaments-3.html).
   */
  public point: vector2d;
  /**
   * A 2d vector with a length of 1 that represents the direction of the face hit by the raycast.
   * 
   * Read more about vectors [here](https://sneezingcactus.github.io/gmmaker/docs/tutorials/Fundaments-3.html).
   */
  public normal: vector2d;
  /**
   * [Body type hits only] ID of the fixture hit by the raycast.
   */
  public fixtureId: number;
  /**
   * [Body type hits only] `true` if the fixture hit is a capture zone, `false` otherwise.
   */
  public isCapzone: boolean;
}

/**
 * 
 */
declare interface gameWorld {
  /**
   * When set to `true`, the barrier that kills players when they go offscreen is disabled.
   */
  public disableDeathBarrier: boolean;
  /**
   * Get the radius of a disc (affected by balance).
   * 
   * If given the ID of a disc that doesn't exist, it will return 1, as that's the
   * size value of a disc with 0% balance.
   * 
   * It's recommended to only call this function once and store the value somewhere
   * if you use it a lot in your code.
   * 
   * @param id - The ID of the disc.
   */
  public getDiscRadius(id: number): number;
  /**
   * Kill a specified disc.
   * 
   * The disc gets killed in the next step, so it will still exist until you move on to the next step.
   * 
   * It's also not possible to kill a disc while the game is frozen (at the start of a round).
   * 
   * @param id - The ID of the disc to kill.
   * @param allowRespawn - When set to true, the disc can respawn (on maps that have "respawn on death" activated). When set to false, the disc can't respawn even if "respawn on death" is activated, like when someone claims a capzone. True by default.
   */
  public killDisc(id: number, allowRespawn: boolean);
  /**
   * Create a body with the specified body, fixture and shape definitions.
   * 
   * @returns {number} The ID of the newly created body
   */
  public createBody(options: createBodyOptions): number;
  /**
   * Create a fixture-shape combo with the specified definitions, and add it to a specified body.
   * 
   * @returns {number} The ID of the newly created fixture
   */
  public addFixtureShapeToBody(options: addFixtureShapeOptions): number;
  /**
   * Create an arrow with the definition given. In your definition, you can exclude properties that you don't need to define at the moment and GMMaker will fill them in with default values.
   * 
   * @returns {number} The ID of the newly created arrow
   */
  public createArrow(def: projectile): number;
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
   * @param origin - The start point of the ray, as a 2d vector, represented by a number array `[x,y]` 
   * @param end -  The end point of the ray, as a 2d vector, represented by a number array `[x,y]` 
   * @param filter - Filter function that dictates at which point the ray should stop.
   */
  public rayCast(origin: vector2d, end: vector2d, filter: (hit: rayCastResult) => boolean): rayCastResult | null;
  /**
   * It's like a raycast, but it allows you to find multiple objects in the line.
   * 
   * When the filter returns `true`, the raycast doesn't stop, instead, it adds the hit info to an
   * array that gets returned once the raycast gets to the `end` point.
   * 
   * @param origin - The start point of the ray, as a 2d vector, represented by a number array `[x,y]` 
   * @param end -  The end point of the ray, as a 2d vector, represented by a number array `[x,y]` 
   * @param filter - Filter function that dictates what hits should be ignored and which shouldn't.
   */
  public rayCastAll(origin: vector2d, end: vector2d, filter: (hit: rayCastResult) => boolean): rayCastResult[];
}

/**
 * An object that provides information about the game, both modifiable and unmodifiable,
 * and methods that allow manipulating the game further, such as playing sounds.
 * 
 * @namespace game
 */
 namespace game {
  /**
   * This object contains the only event-related method, addEventListener.
   * 
   * Read more about events [here](https://sneezingcactus.github.io/gmmaker/docs/tutorials/Fundaments-1.html).
   * 
   * @type {gameEvents}
   * @memberof game
   */
  const events: gameEvents;
  /**
    * The game state corresponding to the previous step. Doesn't exist in the first step, so look out for that.
    * 
    * @type {gameState}
    * @memberof game
    */
  const prevState: gameState;
  /**
    * A collection of info about the current state of a game, such as scores, player and map object attributes, etc.
    * 
    * @type {gameState}
    * @memberof game
    */
  const state: gameState;
  /**
    * An array containing the inputs (keys and mouse info) of every player, ordered by player ID.
    * 
    * This also contains input overrides, under `game.inputs.overrides`.
    *
    * @type {gameInputs}
    * @memberof game
    */
  const inputs: gameInputs;
  /**
    * A collection of info about the room, including players and game settings.
    * 
    * This does not change at any point in the game. This means that people leaving/joining during a game will not affect the content of this object.
    * 
    * @type {gameLobby}
    * @memberof game
    */
  const lobby: gameLobby;
  /**
    * A collection of methods and parameters related to the game world.
    * 
    * Such as raycasts, death barrier enabling/disabling, helper functions for creating bodies, etc.
    * 
    * @type {gameWorld}
    * @memberof game
    */
  const world: gameWorld;
  /**
    * A collection of graphics-related methods and parameters, such as drawings and camera manipulation.
    * 
    * @type {gameGraphics}
    * @memberof game
    */
  const graphics: gameGraphics;
  /**
    * A small collection of methods related to sounds.
    * 
    * @type {gameAudio}
    * @memberof game
    */
  const audio: gameAudio;
  /**
    * Empty object where you can store anything, as long as what you're trying to store can be represented using only JSON types (number, string, etc).
    * 
    * Whatever you store in here will stay here until the game ends.
    * 
    * @type {object}
    * @memberof game
    */
  const vars: object;
  /**
    * Log a message into an in-game logbox for debugging.
    * 
    * @memberof game
    * 
    * @param message - The message to log. Can be a string, a number, an array, etc.
    */
  function debugLog(message: any): void;
}

/** 
 * An intrinsic object that provides colour manipulation functionality.
 * 
 * Colours are represented by a hex code in the form of a number.
 * 
 * @namespace Colour
 */
namespace Colour {
  /**
   * Get red, green and blue values from a hex colour.
   * 
   * The RGB values will be returned in the form of an array ordered by `[red, green, blue]`.
   * 
   * @memberof Colour
   */
  export function toRGBValues(colour: number): number[];
  /**
   * Get hue, saturation and value from a hex colour.
   * 
   * The HSV values will be returned in the form of an array ordered by `[hue, saturation, value]`.
   * 
   * @memberof Colour
   */
  export function toHSVValues(colour: number): number[];
  /**
   * Turn red, green and blue into a hex colour to use in drawings, fixtures, etc.
   * 
   * The RGB values must be given in the form of an array ordered by `[red, green, blue]`.
   * 
   * @memberof Colour
   */
  export function fromRGBValues(rgb: number[]): number[];
  /**
   * Turn hue, saturation and value into a hex colour to use in drawings, fixtures, etc.
   * 
   * The HSV values must be given in the form of an array ordered by `[hue, saturation, value]`.
   * 
   * @memberof Colour
   */
  export function fromHSVValues(hsv: number[]): number[];
  /**
   * Blend the RGB values of colour A and colour B by interpolant t.
   * 
   * When t = 0, colour A is returned.
   * 
   * When t = 1, colour B is returned.
   * 
   * When t = 0.5, the colour "between" A and B is returned.
   * 
   * @memberof Colour
   */
  export function blend(a: number, b: number, t: number): number;
}

/** 
 * An intrinsic object that provides vector mathematics functionality.
 * 
 * Vectors are represented by arrays of numbers. Example: [5, 2] is a 2d vector pointing at x: 5, y: 2.
 * 
 * @namespace Vector
 */
namespace Vector {
  /**
   * Adds the components of vector B to the respective components of vector A.
   * 
   * B can also be a number, in which case B is added to every single component of A.
   * 
   * @memberof Vector
   */
  function add(a: number[], b: number | number[]): number[];
  /**
   * Subtracts the components of vector B from the respective components of vector A.
   * 
   * B can also be a number, in which case B is subtracted from every single component of A.
   * 
   * @memberof Vector
   */
  function subtract(a: number[], b: number | number[]): number[];
  /**
   * Multiplies the components of vector A by the respective components of vector B.
   * 
   * B can also be a number, in which case, every single component of A is multiplied by B.
   * 
   * @memberof Vector
   */
  function multiply(a: number[], b: number | number[]): number[];
  /**
   * Divides the components of vector A by the respective components of vector B.
   * 
   * B can also be a number, in which case, every single component of A is divided by B.
   * 
   * @memberof Vector
   */
  function divide(a: number[], b: number | number[]): number[];
  /**
   * Returns the length (also called magnitude) of the vector.
   * 
   * @memberof Vector
   */
  function length(vector: number[]): number;
  /**
   * Returns the distance between vector A and vector B.
   * 
   * @memberof Vector
   */
  function distance(a: number[], b: number[]): number;
  /**
   * Returns the vector scaled to have a length of 1.
   * 
   * @memberof Vector
   */
  function normalize(vector: number[]): number[];
  /**
   * Returns the dot product of vector A and vector B.
   * 
   * If normalized vectors are given, the function returns 1 if they point in exactly the same direction,
   * -1 if they point in completely opposite directions and zero if the vectors are perpendicular.
   * 
   * @memberof Vector
   */
  function dot(a: number[], b: number[]): number;
  /**
   * Reflects a vector (dir) off the plane defined by a normal.
   *
   * The `normal` vector defines a plane (a plane's normal is the vector that is perpendicular to its surface).
   * The `dir` vector is treated as a directional arrow coming in to the plane. 
   * The returned value is a vector of equal magnitude to `dir` but with its direction reflected.
   * 
   * @memberof Vector
   */
  function reflect(dir: number[], normal: number[]): number[];
  /**
   * Returns a vector linearly interpolated between vectors A and B by the interpolant t.
   * 
   * When t = 0, vector A is returned.
   * 
   * When t = 1, vector B is returned.
   * 
   * When t = 0.5, the vector midway between A and B is returned.
   * 
   * @memberof Vector
   */
  function lerp(a: number[], b: number[], t: number): number[];
  /**
   * Rotate a 2d vector by a given angle, taking the point zero (0, 0) as the rotation center.
   * 
   * @memberof Vector
   */
  function rotate2d(v: vector2d, a: number): vector2d;
  /**
   * Get the angle between the 2d vector and (1, 0), taking the point zero (0, 0) as the rotation center.
   * 
   * This is the inverse of `Vector.rotate2d([1, 0], angle)`.
   * 
   * @memberof Vector
   */
  function getAngle2d(v: vector2d): number;
}

declare interface Math {
  /** The mathematical constant e. This is Euler's number, the base of natural logarithms. */
  public readonly E: number;
  /** The natural logarithm of 10. */
  public readonly LN10: number;
  /** The natural logarithm of 2. */
  public readonly LN2: number;
  /** The base-2 logarithm of e. */
  public readonly LOG2E: number;
  /** The base-10 logarithm of e. */
  public readonly LOG10E: number;
  /** Pi. This is the ratio of the circumference of a circle to its diameter. */
  public readonly PI: number;
  /** The square root of 0.5, or, equivalently, one divided by the square root of 2. */
  public readonly SQRT1_2: number;
  /** The square root of 2. */
  public readonly SQRT2: number;
  /**
   * Returns the absolute value of a number (the value without regard to whether it is positive or negative).
   * For example, the absolute value of -5 is the same as the absolute value of 5.
   * @param x - A numeric expression for which the absolute value is needed.
   */
  public abs(x: number): number;
  /**
   * Returns the arc cosine (or inverse cosine) of a number.
   * @param x - A numeric expression.
   */
  public acos(x: number): number;
  /**
   * Returns the arcsine of a number.
   * @param x - A numeric expression.
   */
  public asin(x: number): number;
  /**
   * Returns the arctangent of a number.
   * @param x - A numeric expression for which the arctangent is needed.
   */
  public atan(x: number): number;
  /**
   * Returns the angle (in degrees) from the X axis to a point.
   * @param y - A numeric expression representing the cartesian y-coordinate.
   * @param x - A numeric expression representing the cartesian x-coordinate.
   */
  public atan2(y: number, x: number): number;
  /**
   * Returns the smallest integer greater than or equal to its numeric argument.
   * @param x - A numeric expression.
   */
  public ceil(x: number): number;
  /**
   * Returns the cosine of a number.
   * @param x - A numeric expression that contains an angle measured in degrees.
   */
  public cos(x: number): number;
  /**
   * Returns e (the base of natural logarithms) raised to a power.
   * @param x - A numeric expression representing the power of e.
   */
  public exp(x: number): number;
  /**
   * Returns the greatest integer less than or equal to its numeric argument.
   * @param x - A numeric expression.
   */
  public floor(x: number): number;
  /**
   * Returns the natural logarithm (base e) of a number.
   * @param x - A numeric expression.
   */
  public log(x: number): number;
  /**
   * Returns the larger of a set of supplied numeric expressions.
   * @param values - Numeric expressions to be evaluated.
   */
  public max(...values: number[]): number;
  /**
   * Returns the smaller of a set of supplied numeric expressions.
   * @param values - Numeric expressions to be evaluated.
   */
  public min(...values: number[]): number;
  /**
   * Returns the value of a base expression taken to a specified power.
   * @param x - The base value of the expression.
   * @param y - The exponent value of the expression.
   */
  public pow(x: number, y: number): number;
  /** Returns a pseudorandom number between 0 and 1. */
  public random(): number;
  /**
   * Returns a supplied numeric expression rounded to the nearest integer.
   * @param x - The value to be rounded to the nearest integer.
   */
  public round(x: number): number;
  /**
   * Returns the sine of a number.
   * @param x - A numeric expression that contains an angle measured in degrees.
   */
  public sin(x: number): number;
  /**
   * Returns the square root of a number.
   * @param x - A numeric expression.
   */
  public sqrt(x: number): number;
  /**
   * Returns the tangent of a number.
   * @param x - A numeric expression that contains an angle measured in degrees.
   */
  public tan(x: number): number;
}

/** 
 * An intrinsic object that provides basic mathematics functionality and constants. 
 * 
 * This Math object is slightly different than the Math object you would see in a normal JavaScript environment.
 * The two main differences are that the numbers given by the functions are capped to 9 decimals,
 * and that trigonometry functions use degrees instead of radians.
 */
declare var Math: Math;

declare type vector2d = [number, number];