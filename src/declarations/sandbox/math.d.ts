interface APIMath extends Math {
  readonly radToDeg: number;
  readonly degToRad: number;

  sinDeg: (x: number) => number;
  cosDeg: (x: number) => number;
  tanDeg: (x: number) => number;
  asinDeg: (x: number) => number;
  acosDeg: (x: number) => number;
  atanDeg: (x: number) => number;

  lerpNumber: (a: number, b: number, t: number) => number;
  lerpAngle: (a: number, b: number, t: number) => number;
}
