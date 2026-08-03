export interface GMStatePlatform {
  type: 'stationary' | 'freeMoving' | 'kinematic';

  position: vector2d;
  angle: number;

  linearVel: vector2d;
  angularVel: number;

  bounciness: number;
  density: number;
  friction: number;

  fricPlayers: boolean;

  linearDrag: number;
  angularDrag: number;

  fixedRotation: boolean;
  antiTunnel: boolean;

  appliedForce: vector2d;
  appliedForceAbsolute: boolean;
  appliedTorque: number;

  collision: {
    group: number;

    withPlayers: boolean;
    withGroupA: boolean;
    withGroupB: boolean;
    withGroupC: boolean;
    withGroupD: boolean;
  };

  visible: boolean;
}
