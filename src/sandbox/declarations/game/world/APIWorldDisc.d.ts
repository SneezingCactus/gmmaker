import type { vector2d } from '../../APIVector';

export interface APIWorldDisc {
  position: vector2d;
  angle: number;

  linearVel: vector2d;
  angularVel: number;

  team: 'ffa' | 'red' | 'blue' | 'green' | 'yellow';

  actionCooldown: number;
  actionAimCharge: number;
  actionAimAngle: number;

  spawnPosition: vector2d;
  spawnLinearVel: vector2d;
}
