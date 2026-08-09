import type { APIWorldDisc } from './APIWorldDisc';
import type { APIWorldJoint } from './APIWorldJoint';
import type { APIWorldPlatform } from './APIWorldPlatform';
import type { APIWorldRound } from './APIWorldRound';
import type { APIWorldSettings } from './APIWorldSettings';
import type { APIWorldCapZone } from './APIWorldCapZone';
import type { APIWorldProjectile } from './APIWorldProjectile';
import type { APIWorldShape } from './APIWorldShape';
import type { vector2d } from '../../APIVector';

declare interface APIWorldRayCastResultPlatform {
  type: 'platform';

  /**
   * [Platform type hits only] ID of the platform shape hit by the raycast.
   */
  shapeId: number;
  /**
   * [Platform type hits only] `true` if the shape hit is a capture zone, `false` otherwise.
   */
  isCapzone: boolean;
}

declare interface APIWorldRayCastResultBase {
  /**
   * Type of object hit by the raycast. Can be "disc", "arrow" or "platform".
   */
  type: 'disc' | 'arrow' | 'platform';
  /**
   * ID of the object.
   */
  id: number;
  /**
   * Point in space where the raycast hit the object.
   */
  point: vector2d;
  /**
   * A 2d vector with a length of 1 that represents the direction of the face hit by the raycast.
   */
  normal: vector2d;
}

type APIWorldRaycastResult = APIWorldRayCastResultBase | APIWorldRayCastResultPlatform;

export interface APIWorld {
  aliveDiscIds: number[];
  discs: APIWorldDisc[];
  projectiles: APIWorldProjectile[];

  platformRenderOrder: number[];
  platforms: APIWorldPlatform[];
  shapes: APIWorldShape[];
  joints: APIWorldJoint[];
  capZones: APIWorldCapZone[];

  settings: APIWorldSettings;
  round: APIWorldRound;

  /**
   * Get the radius of a disc (affected by balance).
   *
   * If given the ID of a disc that doesn't exist, it will return 1, as that's the
   * radius of a disc with 0% balance.
   *
   * It's recommended to only call this function once and store the value somewhere
   * if you use it a lot in your code.
   *
   * @param id - The ID of the disc.
   */
  getDiscRadius(id: number): number;
  /**
   * Kill a disc.
   *
   * The disc gets killed in the next step, so it will still exist until you move on to the next step.
   *
   * It's not possible to kill a disc while the game is frozen (at the start of a round).
   *
   * @param id - The ID of the disc to kill.
   * @param allowRespawn - When set to true, the disc can respawn (on maps that have "respawn on death" activated).
   *                       When set to false, the disc can't respawn even if "respawn on death" is activated, like
   *                       when someone claims a capzone. True by default.
   */
  killDisc(id: number, allowRespawn: boolean): any;
  /**
   * Create a platform.
   *
   * @param renderOrder - Indicates where in `game.world.platformRenderOrder` the platform ID should be placed. In
   *                      other words, it indicates the layer at which the platform will be drawn, where the layer with
   *                      the biggest number is the farthest layer, and the layer with the smallest number (down to 0)
   *                      is the nearest layer. If you set this to null, the platform will be placed at the nearest
   *                      layer (0).
   * @param platformDef - The platform to be created. It's not necessary to specify every property of the platform here,
   *                      as any missing properties will be replaced with default values, so you can remove property
   *                      definitions for stuff you don't need. For example: velocity, drag, fixed rotation, applied
   *                      forces, and some others aren't used on static platforms, so you can remove those when
   *                      creating one.
   * @returns {number} The ID of the newly created platform
   */
  createPlatform(renderOrder: number, platformDef: Partial<APIWorldPlatform>): number;
  /**
   * Clone a platform.
   *
   * @param id - The ID of the platform to clone.
   * @param cloneJoints - `true` if joints attached to this platform should be cloned as well, `false` otherwise.
   * @returns {number} The ID of the newly created platform clone
   */
  clonePlatform(id: number, cloneJoints: boolean): number;
  /**
   * Add a shape to a platform.
   *
   * @param platId - The ID of the platform
   * @param shapeDef - The shape to be added. It's not necessary to specify every property of the shape here, as any
   *                   missing properties will be replaced with default values, so you can remove property definitions
   *                   for stuff you don't need. For example: physical properties, as well as death, no grapple and
   *                   inner grapple are not used in a no-physics shape, so you can remove those when defining one.
   * @returns {number} The index at which the shape is located in the platform's `shapes` array.
   */
  // addShapeToPlat(platId: number, shapeDef: Partial<APIWorldShape>): number;
  /**
   * Move a platform shape from an index to another.
   *
   * @param platId - The ID of the platform
   * @param fromIndex - The index of the shape to be moved
   * @param toIndex - The shape's new index
   */
  // movePlatShape(platId: number, fromIndex: number, toIndex: number): void;
  /**
   * Remove a shape from a platform.
   *
   * @param platId - The ID of the platform
   * @param shapeId - The ID of the shape to be removed
   */
  // removeShapeFromPlat(platId: number, shapeId: number): void;
  /**
   * Delete the specified platform, and everything related to it, such as shapes, joints and capzone definitions.
   * Drawings attached to the platform aren't deleted.
   *
   * @param id - The ID of the platform to delete.
   */
  deletePlatform(id: number): void;
  /**
   * Find the ID of a platform by its name. Note that if there are multiple platforms with the same name,
   * the one with the lowest ID will be chosen.
   * @param name - Name of the platform to search for
   * @returns {number} The ID of the platform
   */
  getPlatIdByName(name: string): number;
  /**
   * Create an arrow with the definition given. In your definition, you can exclude properties that you don't need to
   * define at the moment as they will be filled in with default values.
   *
   * @returns {number} The ID of the newly created arrow
   */
  createArrow(def: Partial<APIWorldProjectile>): number;
  /**
   * End the round.
   *
   * @param winner - Optional winner of the round.
   *
   * If teams are off, `winner` will be taken as a player ID. If teams are on,
   * the win will be attributed to:
   *
   * - `winner = 1` Red Team
   * - `winner = 2` Blue Team
   * - `winner = 3` Green Team
   * - `winner = 4` Yellow Team
   *
   * If not specified, the round will end with a draw.
   */
  triggerWin(winner?: number): void;
  /**
   * End the round immediately, without showing the win screen.
   */
  endRound(): any;
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
   * Note: the shapeId and isCapzone properties in the hit results are only relevant for `'platform'` type hits,
   * and therefore are `undefined` in `'disc'` and `'arrow'` type hits.
   *
   * @param origin - The start point of the ray, as a 2d vector, represented by a number array `[x,y]`
   * @param end -  The end point of the ray, as a 2d vector, represented by a number array `[x,y]`
   * @param filter - Filter function that dictates at which point the ray should stop.
   */
  rayCast(origin: vector2d, end: vector2d, filter: (hit: APIWorldRaycastResult) => boolean):
  APIWorldRaycastResult | null;
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
  rayCastAll(origin: vector2d, end: vector2d, filter: (hit: APIWorldRaycastResult) => boolean):
  APIWorldRaycastResult[];
}
