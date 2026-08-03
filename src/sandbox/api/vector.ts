export default function defineApiVector(gmMath: GMMath): Vector {
  // declared before the main object as they're used by other functions
  // yeah it's ugly... but what can you do

  const divide: Vector['divide'] = (a, b) => {
    const result = [...a];

    if (typeof b === 'number') {
      for (let i = 0; i < result.length; i++) {
        result[i] /= b;
      }
    }
    else {
      for (let i = 0; i < result.length; i++) {
        result[i] /= b[i];
      }
    }

    return result;
  };
  const length: Vector['length'] = (v) => {
    let result = 0;

    for (let a = 0; a < v.length; a++) {
      result += gmMath.pow(gmMath.abs(v[a]), 2);
    }

    return gmMath.sqrt(result);
  };
  const normalize: Vector['normalize'] = (v) => {
    return divide(v, length(v));
  };
  const dot: Vector['dot'] = (a, b) => {
    let result = 0;

    for (let i = 0; i < a.length; i++) {
      result += a[i] * b[i];
    }

    return result;
  };

  return harden({
    add: (a, b) => {
      const result = [...a];

      if (typeof b === 'number') {
        for (let i = 0; i < result.length; i++) {
          result[i] += b;
        }
      }
      else {
        for (let i = 0; i < result.length; i++) {
          result[i] += b[i];
        }
      }

      return result;
    },
    subtract: (a, b) => {
      const result = [...a];

      if (typeof b === 'number') {
        for (let i = 0; i < result.length; i++) {
          result[i] -= b;
        }
      }
      else {
        for (let i = 0; i < result.length; i++) {
          result[i] -= b[i];
        }
      }

      return result;
    },
    multiply: (a, b) => {
      const result = [...a];

      if (typeof b === 'number') {
        for (let i = 0; i < result.length; i++) {
          result[i] *= b;
        }
      }
      else {
        for (let i = 0; i < result.length; i++) {
          result[i] *= b[i];
        }
      }

      return result;
    },
    divide,
    length,
    distance: (a, b) => {
      let result = 0;

      for (let i = 0; i < a.length; i++) {
        result += gmMath.pow(gmMath.abs(b[i] - a[i]), 2);
      }

      return gmMath.sqrt(result);
    },
    normalize,
    dot,
    reflect: (a, b) => {
      const result = [];

      const normalizedB = normalize(b);
      const dotProduct = dot(a, normalizedB);

      for (let i = 0; i < a.length; i++) {
        result[i] = a[i] - 2 * normalizedB[i] * dotProduct;
      }

      return result;
    },
    lerp: (a, b, t) => {
      const result = [];

      for (let i = 0; i < a.length; i++) {
        result[i] = a[i] + (b[i] - a[i]) * t;
      }

      return result;
    },
    rotate2d: (v, a) => [
      v[0] * gmMath.cos(a) - v[1] * gmMath.sin(a),
      v[0] * gmMath.sin(a) + v[1] * gmMath.cos(a),
    ],
    getAngle2d: v => -gmMath.atan2(v[0], v[1]) + 90,
  });
}
