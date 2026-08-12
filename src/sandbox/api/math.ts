export interface ExtraMath {
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

const allPropertyNames = [
  'abs',
  'acos',
  'acosh',
  'asin',
  'asinh',
  'atan',
  'atanh',
  'atan2',
  'ceil',
  'cbrt',
  'expm1',
  'clz32',
  'cos',
  'cosh',
  'exp',
  'floor',
  'fround',
  'hypot',
  'imul',
  'log',
  'log1p',
  'log2',
  'log10',
  'max',
  'min',
  'pow',
  'random',
  'round',
  'sign',
  'sin',
  'sinh',
  'sqrt',
  'tan',
  'tanh',
  'trunc',
  'E',
  'LN10',
  'LN2',
  'LOG10E',
  'LOG2E',
  'PI',
  'SQRT1_2',
  'SQRT2',
] as const;

const safetyTruncFactor = 1000000;

export function safeSin(a: number): number {
  return Math.round(Math.sin(a) * safetyTruncFactor) / safetyTruncFactor;
}

export function safeCos(a: number): number {
  return Math.round(Math.cos(a) * safetyTruncFactor) / safetyTruncFactor;
}

export function safeTan(a: number): number {
  return Math.round(Math.tan(a) * safetyTruncFactor) / safetyTruncFactor;
}

export function safeASin(a: number): number {
  return Math.round(Math.asin(a) * safetyTruncFactor) / safetyTruncFactor;
}

export function safeACos(a: number): number {
  return Math.round(Math.acos(a) * safetyTruncFactor) / safetyTruncFactor;
}

export function safeATan(a: number): number {
  return Math.round(Math.atan(a) * safetyTruncFactor) / safetyTruncFactor;
}

export function safeAtan2(y: number, x: number) {
  return Math.round(Math.atan2(y, x) * (180 / Math.PI) * safetyTruncFactor) / safetyTruncFactor;
}

export default function defineApiMath(): Math & ExtraMath {
  const degToRad = Math.PI / 180;
  const radToDeg = 180 / Math.PI;

  const allProperties = Object.fromEntries(allPropertyNames.map(propertyName => [
    propertyName,

    // we don't care about `this` scoping for Math
    // eslint-disable-next-line ts/unbound-method
    Math[propertyName],
  ]));

  return harden({
    // spreading Math does not do anything, but typescript complains about type completion if i don't
    ...Math,
    ...allProperties,

    sin: safeSin,
    cos: safeCos,
    tan: safeTan,
    asin: safeASin,
    acos: safeACos,
    atan: safeATan,
    atan2: safeAtan2,

    degToRad,
    radToDeg,

    sinDeg: (x: number) => safeSin(x * degToRad),
    cosDeg: (x: number) => safeCos(x * degToRad),
    tanDeg: (x: number) => safeTan(x * degToRad),
    asinDeg: (x: number) => safeASin(x) * radToDeg,
    acosDeg: (x: number) => safeACos(x) * radToDeg,
    atanDeg: (x: number) => safeATan(x) * radToDeg,

    lerpNumber(a, b, t) {
      return a + (b - a) * t;
    },
    lerpAngle(a, b, t) {
      const anglePointA = [safeSin(a), safeCos(a)];
      const anglePointB = [safeSin(b), safeCos(b)];
      const lerpedAnglePoint = [
        (1 - t) * anglePointA[0] + t * anglePointB[0],
        (1 - t) * anglePointA[1] + t * anglePointB[1],
      ];

      return safeAtan2(lerpedAnglePoint[0], lerpedAnglePoint[1]);
    },
  });
}
