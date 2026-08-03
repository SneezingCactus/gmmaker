/**
 * Contains several map-specific settings.
 */
declare interface GMStateMapSettings {
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
}

/**
 * Contains a bunch of info about a map, such as the username of the person who created it, the name of the map, etc.
 */
declare interface GMStateMapMetadata {
  /** Map author's username. */
  author: string;
  /** The name of the map. */
  name: string;
  /**
   * Bonk version this map was published on. Can be:
   *
   * - `1`: Map published in flash bonk.io.
   * - `2`: Map published in current HTML5 bonk.io.
   */
  bonkVersion: number;
  /**
   * Recommended vanilla mode for this map.
   *
   * Vanilla (non-GMM) modes are internally represented by an ID:
   *
   * - "b" is Classic
   * - "bs" is Simple
   * - "ar" is Arrows
   * - "ard" is Death Arrows
   * - "sp" is Grapple
   * - "v" is VTOL
   */
  forVanillaMode: string;
  /**
   * The amount of upvotes the map received.
   */
  upvotes: number;
  /**
   * The amount of downvotes the map received.
   */
  downvotes: number;
  /**
   * Original map author's username.
   *
   * This is only relevant in edited maps. In completely original maps, it will always be equal to "" (an empty string).
   */
  originalAuthor: string | null;
  /**
   * Original map name.
   *
   * This is only relevant in edited maps. In completely original maps, it will always be equal to "" (an empty string).
   */
  originalName: string | null;
  /**
   * Bonk version the original map was published on. Can be:
   *
   * - `1`: Map published in flash bonk.io.
   * - `2`: Map published in current HTML5 bonk.io.
   *
   * This is only relevant in edited maps. In completely original maps, it will always be equal to 1.
   */
  originalDbVersion: number | null;
}

/**
 * This is where map objects (called bodies), as well as their fixtures, shapes and joints, are stored.
 */
declare interface GMStatePhysics {
  /**
   * Array that contains the definitions of every body in the world.
   *
   * Ordered by ID (bodies[0] is body with ID 0, bodies[2] is body with ID 2, etc.)
   */
  bodies: GMStateBody[];
  /**
   * Array that contains the definitions of every fixture in the world. Bodies are made of fixtures.
   *
   * Ordered by ID (fixtures[0] is fixture with ID 0, fixtures[2] is fixture with ID 2, etc.)
   */
  fixtures: GMStateFixture[];
  /**
   * Array that contains the definitions of every shape in the world. Shapes define the geometry of each fixture.
   *
   * Ordered by ID (shapes[0] is shape with ID 0, shapes[2] is shape with ID 2, etc.)
   */
  shapes: GMStateShape[];
  /**
   * Array that contains the definitions of every joint in the world.
   *
   * Ordered by ID (joints[0] is joint with ID 0, joints[2] is joint with ID 2, etc.)
   */
  joints: GMStateJointBase[];
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
declare interface GMGameState {
  mapSettings: GMStateMapSettings;
  mapMetadata: GMStateMapMetadata;

  /**
   * Array that contains varied attributes for every disc currently alive.
   *
   * In GMMaker, the term "disc" refers to the physical manifestation of a player,
   * in other words, the ball you control during the game.
   *
   * Ordered by disc/player ID (discs[0] is disc with ID 0, discs[2] is disc with ID 2, etc.)
   */
  discs: GMStateDisc[];
  /**
   * Array that contains varied info about every recent death of a disc.
   *
   * In GMMaker, the term "disc" refers to the character object, the "ball" of a player.
   */
  discDeaths: GMStateDiscDeath[];
  /**
   * Array that contains varied attributes for every arrow, such as their owner and position.
   *
   * Ordered by arrow ID (arrows[0] is arrow with ID 0, arrows[2] is arrow with ID 2, etc.)
   *
   * It's unknown why Chaz named this array `projectiles`. Perhaps he wanted to add different kinds
   * of projectiles at some point.
   */
  projectiles: GMStateProjectile[];
  /**
   * Array that contains varied attributes for every capture zone, such as the type of capzone
   * and the fixture they possess.
   *
   * Ordered by capture zone ID (capZones[0] is capzone with ID 0, capZones[2] is capzone with ID 2, etc.)
   */
  capZones: GMStateCapZone[];
  /**
   * This is where map objects (called bodies), as well as their fixtures, shapes and joints, are stored.
   */
  physics: GMStatePhysics;
  /**
   * Likely stands for "round count". It indicates how many rounds have passed since the game started
   * (when the host presses START).
   */
  roundCount: number;
  /**
   * Likely stands for "round length". It's the amount of steps that have happened since last round start.
   */
  ticksThisRound: number;
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
  roundStartTimer: number;
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
  roundEndTimer: number;
  /**
   * Probably stands for something along the lines of "last scored".
   *
   * - On a Free For All game, it contains the ID of the player who just won the round.
   * - On a Teams game, it indicates the team that just won the round: 0 = red, 1 = blue, 2 = green, 3 = yellow.
   * - When set to -1 (both in FFA and Teams), it indicates a draw.
   */
  scoredThisRound: number;
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
