import type { APIEvents } from './game/events/APIEvents';
import type { APIWorld } from './game/world/APIWorld';

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
 * @gmDeclareVar game: Game
 */
export interface Game {
  events: APIEvents;
  world: APIWorld;
}
