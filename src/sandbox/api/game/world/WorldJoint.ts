import type { BonkGameState, BonkStateJoint } from '../../../../simulation/declarations/BonkGameState';
import type Game from '../../Game';
import type { Vector2d } from '../../vector';

enum WorldJointType {
  Rotating = 'rotating',
  SoftRod = 'softRod',
  FollowPath = 'followPath',
  Springy = 'springy',
  Gear = 'gear',
}

declare interface WorldJointRotating extends WorldJointBase {
  type: WorldJointType.Rotating;

  /**
   * First attachment offset, as a 2d vector. Relative to the first attachment's body.
   */
  offsetA: Vector2d;
  /**
   * Second attachment offset, as a 2d vector. Relative to the second attachment's body.
   * If there's no specified second body (bb == -1), it's absolute (relative to world) instead.
   */
  offsetB: Vector2d;

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

declare interface WorldJointSoftRod extends WorldJointBase {
  type: WorldJointType.SoftRod;

  /**
   * First attachment offset, as a 2d vector. Relative to the first attachment's body.
   */
  offsetA: Vector2d;
  /**
   * Second attachment offset, as a 2d vector. Relative to the second attachment's body.
   * If there's no specified second body (bb == -1), it's absolute (relative to world) instead.
   */
  offsetB: Vector2d;

  maxLength: number;

  softness: number;
  damping: number;
}

declare interface WorldJointFollowPath extends WorldJointBase {
  type: WorldJointType.FollowPath;

  pathPosition: Vector2d;
  pathAngle: number;
  pathLength: number;

  moveForce: number;
  moveSpeed: number;
}

declare interface WorldJointSpringy extends WorldJointBase {
  type: WorldJointType.Springy;

  springPosition: Vector2d;
  springForce: number;
  springLength: number;
}

declare interface WorldJointGear extends WorldJointBase {
  type: WorldJointType.Gear;

  gearRatio: number;
}

/**
 * Definition of a joint.
 */
declare interface WorldJointBase {
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
  type: WorldJointType;

  /**
   * ID of the first body attached.
   */
  bodyA: number;
  /**
   * ID of the second body attached.
   *
   * To make the joint have no second attachment, set this value to `null`.
   * Path and springy joints should also have it set to `null` for vanilla behaviour.
   */
  bodyB: number | null;

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

export type WorldJoint = WorldJointRotating | WorldJointSoftRod
  | WorldJointFollowPath | WorldJointSpringy | WorldJointGear;

export namespace WorldJoint {
  /**
   * @internal
   */
  export function getDefault(): WorldJoint {
    return {
      type: WorldJointType.SoftRod,

      bodyA: 0,
      bodyB: null,

      offsetA: [0, 0],
      offsetB: [0, 0],
      maxLength: 1.0,

      breakForce: 0,
      collideAttached: false,
      drawLine: true,

      softness: 0.1,
      damping: 0.0,
    };
  };

  /**
   * Serialize all Game joints into the bonk state.
   *
   * @internal
   */
  export function serialize(game: Game, bonkState: BonkGameState) {
    const maxLength = Math.max(bonkState.physics.joints.length, game.world.joints.length);

    for (let i = 0; i < maxLength; i++) {
      if (!bonkState.physics.joints[i] && !game.world.joints[i])
        continue;

      let bonkJoint: Partial<BonkStateJoint> | undefined = bonkState.physics.joints[i];
      const gmJoint = game.world.joints[i];

      if (!gmJoint) {
        delete bonkState.physics.joints[i];
        continue;
      }

      if (!bonkJoint) {
        bonkJoint = {};
        bonkState.physics.joints[i] = bonkJoint as BonkStateJoint;
      }

      bonkJoint.ba = gmJoint.bodyA;
      bonkJoint.bb = gmJoint.bodyB ?? -1;

      bonkJoint.d = {
        bf: gmJoint.breakForce,
        cc: gmJoint.collideAttached,
        dl: gmJoint.drawLine,

        dr: 0,
        fh: 0.1,

        el: false,
        la: 0,
        ua: 0,

        em: false,
        mmt: 0,
        ms: 0,
      };

      switch (gmJoint.type) {
        case WorldJointType.SoftRod:
          bonkJoint.type = 'd';

          bonkJoint.aa = [gmJoint.offsetA[0], gmJoint.offsetA[1]];
          bonkJoint.ab = [gmJoint.offsetB[0], gmJoint.offsetB[1]];
          bonkJoint.d.dr = gmJoint.damping;
          bonkJoint.d.fh = gmJoint.softness;
          bonkJoint.len = gmJoint.maxLength;
          break;
        case WorldJointType.Rotating:
          bonkJoint.type = 'rv';

          bonkJoint.aa = [gmJoint.offsetA[0], gmJoint.offsetA[1]];
          bonkJoint.ab = [gmJoint.offsetB[0], gmJoint.offsetB[1]];

          bonkJoint.d.em = gmJoint.motor.enabled;
          bonkJoint.d.mmt = gmJoint.motor.turnForce;
          bonkJoint.d.ms = gmJoint.motor.maxSpeed;

          bonkJoint.d.el = gmJoint.limit.enabled;
          bonkJoint.d.la = gmJoint.limit.fromAngle;
          bonkJoint.d.ua = gmJoint.limit.toAngle;
          break;
        case WorldJointType.FollowPath:
          bonkJoint.type = 'lpj';

          bonkJoint.pax = gmJoint.pathPosition[0];
          bonkJoint.pay = gmJoint.pathPosition[1];
          bonkJoint.pa = gmJoint.pathAngle;
          bonkJoint.plen = gmJoint.pathLength;
          bonkJoint.pf = gmJoint.moveForce;
          bonkJoint.pms = gmJoint.moveSpeed;
          break;
        case WorldJointType.Springy:
          bonkJoint.type = 'lsj';

          bonkJoint.sax = gmJoint.springPosition[0];
          bonkJoint.say = gmJoint.springPosition[1];
          bonkJoint.sf = gmJoint.springForce;
          bonkJoint.slen = gmJoint.springLength;
          break;
        case WorldJointType.Gear:
          bonkJoint.type = 'g';

          bonkJoint.r = gmJoint.gearRatio;
          break;
      }
    }
  }

  /**
   * Deserialize all bonk state joints into the Game object.
   *
   * @internal
   */
  export function deserialize(bonkState: BonkGameState, game: Game) {
    const maxLength = Math.max(bonkState.physics.joints.length, game.world.joints.length);

    for (let i = 0; i < maxLength; i++) {
      if (!bonkState.physics.joints[i] && !game.world.joints[i])
        continue;

      let gmJoint: Partial<WorldJoint> | undefined = game.world.joints[i];
      const bonkJoint = bonkState.physics.joints[i];

      // bonk -> gmm
      // if there's no joint in bonk, there shouldn't be a joint in gmm
      if (!bonkJoint) {
        delete game.world.joints[i];
        continue;
      }

      // if this joint doesn't exist in gmm, create it
      if (!gmJoint) {
        gmJoint = {};
        game.world.joints[i] = gmJoint as WorldJoint; // cast to remove Partial (we fill all props later)
      }

      gmJoint.bodyA = bonkJoint.ba;
      gmJoint.bodyB = bonkJoint.bb === -1 ? null : bonkJoint.bb;
      gmJoint.breakForce = bonkJoint.d.bf;
      gmJoint.collideAttached = bonkJoint.d.cc;
      gmJoint.drawLine = bonkJoint.d.dl;

      switch (bonkJoint.type) {
        case 'd': {
          gmJoint.type = WorldJointType.SoftRod;
          const jointAsRod = gmJoint as Partial<WorldJointSoftRod>;

          jointAsRod.offsetA = [bonkJoint.aa[0], bonkJoint.aa[1]];
          jointAsRod.offsetB = [bonkJoint.ab[0], bonkJoint.ab[1]];
          jointAsRod.damping = bonkJoint.d.dr;
          jointAsRod.softness = bonkJoint.d.fh;
          jointAsRod.maxLength = bonkJoint.len;
          break;
        }
        case 'rv': {
          gmJoint.type = WorldJointType.Rotating;
          const jointAsRotating = gmJoint as Partial<WorldJointRotating>;

          jointAsRotating.offsetA = [bonkJoint.aa[0], bonkJoint.aa[1]];
          jointAsRotating.offsetB = [bonkJoint.ab[0], bonkJoint.ab[1]];
          jointAsRotating.motor = {
            enabled: bonkJoint.d.em,
            turnForce: bonkJoint.d.mmt,
            maxSpeed: bonkJoint.d.ms,
          };
          jointAsRotating.limit = {
            enabled: bonkJoint.d.el,
            fromAngle: bonkJoint.d.la,
            toAngle: bonkJoint.d.ua,
          };
          break;
        }
        case 'lpj': {
          gmJoint.type = WorldJointType.FollowPath;
          const jointAsFollowPath = gmJoint as Partial<WorldJointFollowPath>;

          jointAsFollowPath.pathPosition = [bonkJoint.pax, bonkJoint.pay];
          jointAsFollowPath.pathAngle = bonkJoint.pa;
          jointAsFollowPath.pathLength = bonkJoint.plen;
          jointAsFollowPath.moveForce = bonkJoint.pf;
          jointAsFollowPath.moveSpeed = bonkJoint.pms;
          break;
        }
        case 'lsj': {
          gmJoint.type = WorldJointType.Springy;
          const jointAsSpringy = gmJoint as Partial<WorldJointSpringy>;

          jointAsSpringy.springPosition = [bonkJoint.sax, bonkJoint.say];
          jointAsSpringy.springForce = bonkJoint.sf;
          jointAsSpringy.springLength = bonkJoint.slen;
          break;
        }
        case 'g': {
          gmJoint.type = WorldJointType.Gear;
          const jointAsGear = gmJoint as Partial<WorldJointGear>;

          jointAsGear.gearRatio = bonkJoint.r;
          break;
        }
      }
    }
  }
}

export default WorldJoint;
