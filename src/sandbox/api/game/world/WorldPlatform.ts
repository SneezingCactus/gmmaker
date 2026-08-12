import type { BonkGameState, BonkStateBody } from '../../../../simulation/declarations/BonkGameState';
import type Game from '../../Game';
import type { Vector2d } from '../../vector';

export enum WorldPlatformType {
  Stationary = 'stationary',
  FreeMoving = 'freeMoving',
  Kinematic = 'kinematic',
}

export enum PlatformForceZoneType {
  Absolute = 'absolute',
  Relative = 'relative',
  CenterPush = 'centerPush',
  CenterPull = 'centerPull',
}

export enum PlatformCollisionGroup {
  A = 'a',
  B = 'b',
  C = 'c',
  D = 'd',
}

const FORCE_ZONE_BONK_TYPES: PlatformForceZoneType[] = [
  PlatformForceZoneType.Absolute,
  PlatformForceZoneType.Relative,
  PlatformForceZoneType.CenterPush,
  PlatformForceZoneType.CenterPull,
];

const COLLISION_GROUP_BONK_TYPES: PlatformCollisionGroup[] = [
  PlatformCollisionGroup.A,
  PlatformCollisionGroup.B,
  PlatformCollisionGroup.C,
  PlatformCollisionGroup.D,
];

interface WorldPlatform {
  type: WorldPlatformType;
  name: string;

  position: Vector2d;
  angle: number;

  linearVel: Vector2d;
  angularVel: number;

  bounciness: number;
  density: number;
  friction: number;

  fricPlayers: boolean;

  linearDrag: number;
  angularDrag: number;

  fixedRotation: boolean;
  antiTunnel: boolean;

  appliedForce: Vector2d;
  appliedForceIsAbsolute: boolean;
  appliedTorque: number;

  forceZone: {
    enabled: boolean;

    type: PlatformForceZoneType;
    linearForce: Vector2d;
    centerForce: number;

    pushPlayers: boolean;
    pushPlatforms: boolean;
    pushArrows: boolean;
  };

  collision: {
    group: PlatformCollisionGroup;

    withPlayers: boolean;
    withGroupA: boolean;
    withGroupB: boolean;
    withGroupC: boolean;
    withGroupD: boolean;
  };

  shapeIds: number[];

  visible: boolean;
}

namespace WorldPlatform {
  /**
   * @internal
   */
  export function getDefault(): WorldPlatform {
    return {
      type: WorldPlatformType.Stationary,
      name: 'GMMaker Platform',

      position: [0, 0],
      angle: 0,

      linearVel: [0, 0],
      angularVel: 0,

      bounciness: 0,
      density: 0.5,
      friction: 0,

      fricPlayers: false,

      linearDrag: 0,
      angularDrag: 0,

      fixedRotation: false,
      antiTunnel: false,

      appliedForce: [0, 0],
      appliedForceIsAbsolute: false,
      appliedTorque: 0,

      forceZone: {
        enabled: false,

        type: PlatformForceZoneType.Absolute,
        linearForce: [0, 0],
        centerForce: 0,

        pushPlayers: true,
        pushArrows: true,
        pushPlatforms: true,
      },

      collision: {
        group: PlatformCollisionGroup.A,

        withPlayers: true,
        withGroupA: true,
        withGroupB: true,
        withGroupC: true,
        withGroupD: true,
      },

      visible: true,

      shapeIds: [],
    };
  }

  /**
   * Serialize all Game platforms into the bonk state as bodies.
   *
   * @internal
   */
  export function serialize(game: Game, bonkState: BonkGameState) {
    const maxLength = Math.max(bonkState.physics.bodies.length, game.world.platforms.length);

    for (let i = 0; i < maxLength; i++) {
      if (!bonkState.physics.bodies[i] && !game.world.platforms[i])
        continue;

      let bonkBody: Partial<BonkStateBody> | undefined = bonkState.physics.bodies[i];
      const gmPlatform = game.world.platforms[i];

      if (!gmPlatform) {
        delete bonkState.physics.bodies[i];
        continue;
      }

      if (!bonkBody) {
        bonkBody = {};
        bonkState.physics.bodies[i] = bonkBody as BonkStateBody;
      }

      switch (gmPlatform.type) {
        case WorldPlatformType.Stationary:
          bonkBody.type = 's';
          break;
        case WorldPlatformType.FreeMoving:
          bonkBody.type = 'k';
          break;
        case WorldPlatformType.Kinematic:
          bonkBody.type = 'd';
          break;
      }

      bonkBody.p = [gmPlatform.position[0], gmPlatform.position[1]];
      bonkBody.a = gmPlatform.angle;

      bonkBody.lv = [gmPlatform.linearVel[0], gmPlatform.linearVel[1]];
      bonkBody.av = gmPlatform.angularVel;

      bonkBody.re = gmPlatform.bounciness;
      bonkBody.de = gmPlatform.density;
      bonkBody.fric = gmPlatform.friction;

      bonkBody.fricp = gmPlatform.fricPlayers;

      bonkBody.ld = gmPlatform.linearDrag;
      bonkBody.ad = gmPlatform.angularDrag;

      bonkBody.fr = gmPlatform.fixedRotation;
      bonkBody.bu = gmPlatform.antiTunnel;

      bonkBody.cf = {
        x: gmPlatform.appliedForce[0],
        y: gmPlatform.appliedForce[1],
        ct: gmPlatform.appliedTorque,
        w: gmPlatform.appliedForceIsAbsolute,
      };

      const forceZone = gmPlatform.forceZone;
      bonkBody.fz = {
        on: forceZone.enabled,
        t: FORCE_ZONE_BONK_TYPES.indexOf(forceZone.type),

        x: forceZone.linearForce[0],
        y: forceZone.linearForce[1],
        cf: forceZone.centerForce,

        d: forceZone.pushPlayers,
        a: forceZone.pushArrows,
        p: forceZone.pushPlatforms,
      };

      const collision = gmPlatform.collision;
      bonkBody.f_c = COLLISION_GROUP_BONK_TYPES.indexOf(collision.group);
      bonkBody.f_p = collision.withPlayers;
      bonkBody.f_1 = collision.withGroupA;
      bonkBody.f_2 = collision.withGroupB;
      bonkBody.f_3 = collision.withGroupC;
      bonkBody.f_4 = collision.withGroupD;

      bonkBody.fx = [...gmPlatform.shapeIds];
    }
  }

  /**
   * Deserialize all bonk state bodies into the Game object as platforms.
   *
   * @internal
   */
  export function deserialize(bonkState: BonkGameState, game: Game) {
    const maxLength = Math.max(bonkState.physics.bodies.length, game.world.platforms.length);

    for (let i = 0; i < maxLength; i++) {
      if (!bonkState.physics.bodies[i] && !game.world.platforms[i])
        continue;

      let gmPlatform: Partial<WorldPlatform> | undefined = game.world.platforms[i];
      const bonkBody = bonkState.physics.bodies[i];

      if (!bonkBody) {
        delete game.world.platforms[i];
        continue;
      }

      if (!gmPlatform) {
        gmPlatform = {};
        game.world.platforms[i] = gmPlatform as WorldPlatform;
      }

      switch (bonkBody.type) {
        case 's':
          gmPlatform.type = WorldPlatformType.Stationary;
          break;
        case 'k':
          gmPlatform.type = WorldPlatformType.FreeMoving;
          break;
        case 'd':
          gmPlatform.type = WorldPlatformType.Kinematic;
          break;
      }

      gmPlatform.position = [bonkBody.p[0], bonkBody.p[1]];
      gmPlatform.angle = bonkBody.a;

      gmPlatform.linearVel = [bonkBody.lv[0], bonkBody.lv[1]];
      gmPlatform.angularVel = bonkBody.av;

      gmPlatform.bounciness = bonkBody.re;
      gmPlatform.density = bonkBody.de;
      gmPlatform.friction = bonkBody.fric;

      gmPlatform.fricPlayers = bonkBody.fricp;

      gmPlatform.linearDrag = bonkBody.ld;
      gmPlatform.angularDrag = bonkBody.ad;

      gmPlatform.fixedRotation = bonkBody.fr;
      gmPlatform.antiTunnel = bonkBody.bu;

      gmPlatform.appliedForce = [bonkBody.cf.x, bonkBody.cf.y];
      gmPlatform.appliedForceIsAbsolute = bonkBody.cf.w;
      gmPlatform.appliedTorque = bonkBody.cf.ct;

      gmPlatform.forceZone = {
        enabled: bonkBody.fz.on,
        type: FORCE_ZONE_BONK_TYPES[bonkBody.fz.t],

        linearForce: [bonkBody.fz.x, bonkBody.fz.y],
        centerForce: bonkBody.fz.cf,

        pushPlayers: bonkBody.fz.d,
        pushArrows: bonkBody.fz.a,
        pushPlatforms: bonkBody.fz.p,
      };

      gmPlatform.collision = {
        group: COLLISION_GROUP_BONK_TYPES[bonkBody.f_c],

        withPlayers: bonkBody.f_p,
        withGroupA: bonkBody.f_1,
        withGroupB: bonkBody.f_2,
        withGroupC: bonkBody.f_3,
        withGroupD: bonkBody.f_4,
      };

      gmPlatform.visible = true;

      gmPlatform.shapeIds = [...bonkBody.fx];
    }
  }
}

export default WorldPlatform;
