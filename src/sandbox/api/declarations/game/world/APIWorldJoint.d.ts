import type { vector2d } from '../../APIVector';

declare interface APIWorldJointRotating extends APIWorldJointBase {
  type: 'rotating';

  /**
   * First attachment offset, as a 2d vector. Relative to the first attachment's body.
   */
  offsetA: vector2d;
  /**
   * Second attachment offset, as a 2d vector. Relative to the second attachment's body.
   * If there's no specified second body (bb == -1), it's absolute (relative to world) instead.
   */
  offsetB: vector2d;

  limit: {
    enabled: boolean;
    fromAngle: number;
    toAngle: number;
  };

  motor: {
    enabled: boolean;
    turnForce: number;
    maxSpeed: number;
  };
}

declare interface APIWorldJointSoftRod extends APIWorldJointBase {
  type: 'softRod';

  /**
   * First attachment offset, as a 2d vector. Relative to the first attachment's body.
   */
  offsetA: vector2d;
  /**
   * Second attachment offset, as a 2d vector. Relative to the second attachment's body.
   * If there's no specified second body (bb == -1), it's absolute (relative to world) instead.
   */
  offsetB: vector2d;

  maxLength: number;

  softness: number;
  damping: number;
}

declare interface APIWorldJointFollowPath extends APIWorldJointBase {
  type: 'followPath';

  pathOffset: vector2d;
  pathAngle: number;
  pathLength: number;

  moveForce: number;
  moveSpeed: number;
}

declare interface APIWorldJointSpringy extends APIWorldJointBase {
  type: 'springy';

  springForce: number;
  springLength: number;
}

declare interface APIWorldJointGear extends APIWorldJointBase {
  type: 'gear';

  gearRatio: number;
}

/**
 * Definition of a joint.
 */
declare interface APIWorldJointBase {
  /**
   * Joint type.
   *
   * Can be:
   * - "rotating": A rotating joint,
   * - "softRod": A soft rod joint,
   * - "followPath": A follow path joint,
   * - "springy": A springy joint.
   * - "gear": A gear joint.
   */
  type: string;

  /**
   * ID of the first body attached.
   */
  bodyA: number;
  /**
   * ID of the second body attached.
   *
   * To make the joint have no second attachment, set this value to -1.
   * Path and springy joints should also have it set to -1.
   */
  bodyB: number;

  /**
   * Break force of the joint.
   */
  breakForce: number;
  /**
   * Specifies if the bodies attached to the joint can collide with each other.
   */
  collideAttached: boolean;
  /**
   * Specifies if the joint line should be drawn in-game.
   */
  drawLine: boolean;
}

export type APIWorldJoint = APIWorldJointRotating | APIWorldJointSoftRod
  | APIWorldJointFollowPath | APIWorldJointSpringy | APIWorldJointGear;
