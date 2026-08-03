interface GMWorldShapePolygon {
  type: 'polygon';

  vertices: vector2d[];

  appliedPosition: vector2d;
  appliedScale: number;
}

interface GMWorldShapeCircle {
  type: 'circle';

  position: vector2d;
  radius: number;

  shrink: boolean;
}

interface GMWorldShapeBox {
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

export type GMWorldShape = GMWorldShapeBox | GMWorldShapeCircle | GMWorldShapePolygon;
