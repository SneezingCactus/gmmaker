interface APIWorldShapePolygon {
  type: 'polygon';

  vertices: vector2d[];

  appliedPosition: vector2d;
  appliedScale: number;
}

interface APIWorldShapeCircle {
  type: 'circle';

  position: vector2d;
  radius: number;

  shrink: boolean;
}

interface APIWorldShapeBox {
  type: 'box';

  position: vector2d;
  angle: number;
  size: vector2d;

  shrink: boolean;
}

interface GMWorldShapeBase {
  type: string;

  name: string;
  colour: number;

  bounciness: number | null;
  density: number | null;
  friction: number | null;

  fricPlayers: boolean | null;

  deadly: boolean;
  noPhysics: boolean;
  noGrapple: boolean;
  innerGrapple: boolean;
}

export type APIWorldShape = APIWorldShapeBox | APIWorldShapeCircle | APIWorldShapePolygon;
