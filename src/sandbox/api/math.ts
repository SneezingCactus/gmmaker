const trigFunctionNames = ['sin', 'cos', 'tan', 'asin', 'acos', 'atan'] as const;

const safetyTruncFactor = 1000000;

export default function defineApiMath(): GMMath {
  const degToRad = Math.PI / 180;
  const radToDeg = 180 / Math.PI;

  const safeTrigFunctions = Object.fromEntries(trigFunctionNames.map(functionName => [
    functionName,
    (x: number) => Math.round(Math[functionName](x) * safetyTruncFactor) / safetyTruncFactor,
  ]));

  const safeAtan2 = (y: number, x: number) =>
    Math.round(Math.atan2(y, x) * (180 / Math.PI) * safetyTruncFactor) / safetyTruncFactor;

  return {
    ...Math,
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
  };
}
