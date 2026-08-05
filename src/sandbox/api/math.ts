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
const trigFunctionNames = [
  'sin',
  'cos',
  'tan',
  'asin',
  'acos',
  'atan',
] as const;

const safetyTruncFactor = 1000000;

export default function defineApiMath(): APIMath {
  const degToRad = Math.PI / 180;
  const radToDeg = 180 / Math.PI;

  const safeTrigFunctions = Object.fromEntries(trigFunctionNames.map(functionName => [
    functionName,
    (x: number) => Math.round(Math[functionName](x) * safetyTruncFactor) / safetyTruncFactor,
  ]));

  const safeAtan2 = (y: number, x: number) =>
    Math.round(Math.atan2(y, x) * (180 / Math.PI) * safetyTruncFactor) / safetyTruncFactor;

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
    ...safeTrigFunctions,

    atan2: safeAtan2,

    degToRad,
    radToDeg,

    sinDeg: (x: number) => safeTrigFunctions.sin(x * degToRad),
    cosDeg: (x: number) => safeTrigFunctions.cos(x * degToRad),
    tanDeg: (x: number) => safeTrigFunctions.tan(x * degToRad),
    asinDeg: (x: number) => safeTrigFunctions.asin(x) * radToDeg,
    acosDeg: (x: number) => safeTrigFunctions.acos(x) * radToDeg,
    atanDeg: (x: number) => safeTrigFunctions.atan(x) * radToDeg,

    lerpAngle(a, b, t) {
      const anglePointA = [safeTrigFunctions.sin(a), safeTrigFunctions.cos(a)];
      const anglePointB = [safeTrigFunctions.sin(b), safeTrigFunctions.cos(b)];
      const lerpedAnglePoint = [
        (1 - t) * anglePointA[0] + t * anglePointB[0],
        (1 - t) * anglePointA[1] + t * anglePointB[1],
      ];

      return safeAtan2(lerpedAnglePoint[0], lerpedAnglePoint[1]);
    },
  });
}
