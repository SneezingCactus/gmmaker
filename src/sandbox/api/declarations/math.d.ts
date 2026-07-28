interface GMMath extends Math {
  readonly radToDeg: number;
  readonly degToRad: number;

  sinDeg: (number) => number;
  cosDeg: (number) => number;
  tanDeg: (number) => number;
  asinDeg: (number) => number;
  acosDeg: (number) => number;
  atanDeg: (number) => number;

  lerpAngle: (number) => number;
}
