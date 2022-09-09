/* eslint-disable prefer-const */
/**
 * to avoid clutter
 * @param {*} object
 * @return {*}
 */
function copy(object) {
  return JSON.parse(JSON.stringify(object));
}

// pretty self-explanatory
window.getStaticInfo = (game) => {
  Object.assign(game, copy(window.parent.gm.state.staticInfo));
};
harden(getStaticInfo);

window.getDynamicInfo = (game) => {
  const copied = copy({
    state: window.parent.gm.state.gameState,
    inputs: window.parent.gm.state.inputs,
  });

  game.state = copied.state;
  game.inputs = copied.inputs;

  const gmExtra = copied.state.gmExtra;

  // reset stuff on new round
  if (game.state.rl == 1) {
    gmExtra.camera = {
      xPos: 365 / game.state.physics.ppm,
      yPos: 250 / game.state.physics.ppm,
      angle: 0,
      xScale: 1,
      yScale: 1,
      noLerp: false,
    };
    gmExtra.drawings = [];
    gmExtra.overrides = [];
  }

  game.vars = gmExtra.vars;
  game.inputs.overrides = gmExtra.overrides;
  game.graphics.camera = gmExtra.camera;
  game.graphics.drawings = gmExtra.drawings;
};
harden(getDynamicInfo);

// get list of arguments coming from event fire
window.getEventArgs = () => copy(window.parent.gm.state.currentEventArgs);
harden(getEventArgs);

// graphics functions
window.bakeDrawing = (id, resolution, ppm) => copy(window.parent.gm.graphics.bakeDrawing(id, resolution, ppm));
harden(bakeDrawing);

window.debugLog = (mess) => window.parent.gm.graphics.debugLog(mess);
harden(debugLog);

// safe math
const newMath = {};
const oldMath = Math;
const mathMeths = ['abs', 'acos', 'acosh', 'asin', 'asinh', 'atan', 'atanh', 'atan2', 'ceil', 'cbrt', 'expm1', 'clz32', 'cos', 'cosh', 'exp', 'floor', 'fround', 'hypot', 'imul', 'log', 'log1p', 'log2', 'log10', 'max', 'min', 'pow', 'random', 'round', 'sign', 'sin', 'sinh', 'sqrt', 'tan', 'tanh', 'trunc', 'E', 'LN10', 'LN2', 'LOG10E', 'LOG2E', 'PI', 'SQRT1_2', 'SQRT2'];

for (const method of mathMeths) {
  if (typeof oldMath[method] === 'number') {
    newMath[method] = oldMath.round(oldMath[method] * 1000000000) / 1000000000;
  } else {
    newMath[method] = function() {
      return oldMath.round(oldMath[method](...arguments) * 1000000000) / 1000000000;
    };
  }
}
newMath.sin = (a) => oldMath.round(oldMath.sin(a * (oldMath.PI / 180)) * 1000000000) / 1000000000;
newMath.cos = (a) => oldMath.round(oldMath.cos(a * (oldMath.PI / 180)) * 1000000000) / 1000000000;
newMath.tan = (a) => oldMath.round(oldMath.tan(a * (oldMath.PI / 180)) * 1000000000) / 1000000000;
newMath.asin = (a) => oldMath.round(oldMath.asin(a) * (180 / oldMath.PI) * 1000000000) / 1000000000;
newMath.acos = (a) => oldMath.round(oldMath.acos(a) * (180 / oldMath.PI) * 1000000000) / 1000000000;
newMath.atan = (a) => oldMath.round(oldMath.atan(a) * (180 / oldMath.PI) * 1000000000) / 1000000000;
newMath.atan2 = (a, b) => oldMath.round(oldMath.atan2(a, b) * (180 / oldMath.PI) * 1000000000) / 1000000000;
newMath.random = () => oldMath.round(0 + window.parent.gm.state.pseudoRandom() * 1000000000) / 1000000000;

Math = newMath;

// vector functions
window.Vector = {
  add: (a, b) => {
    let result = [...a];

    if (typeof b === 'number') {
      for (let i = 0; i < result.length; i++) {
        result[i] += b;
      }
    } else {
      for (let i = 0; i < result.length; i++) {
        result[i] += b[i];
      }
    }

    return result;
  },
  subtract: (a, b) => {
    let result = [...a];

    if (typeof b === 'number') {
      for (let i = 0; i < result.length; i++) {
        result[i] -= b;
      }
    } else {
      for (let i = 0; i < result.length; i++) {
        result[i] -= b[i];
      }
    }

    return result;
  },
  multiply: (a, b) => {
    let result = [...a];

    if (typeof b === 'number') {
      for (let i = 0; i < result.length; i++) {
        result[i] *= b;
      }
    } else {
      for (let i = 0; i < result.length; i++) {
        result[i] *= b[i];
      }
    }

    return result;
  },
  divide: (a, b) => {
    let result = [...a];

    if (typeof b === 'number') {
      for (let i = 0; i < result.length; i++) {
        result[i] /= b;
      }
    } else {
      for (let i = 0; i < result.length; i++) {
        result[i] /= b[i];
      }
    }

    return result;
  },
  length: (v) => {
    let result = 0;

    for (let a = 0; a < v.length; a++) {
      result += newMath.pow(newMath.abs(v[a]), 2);
    }

    return newMath.sqrt(result);
  },
  distance: (a, b) => {
    let result = 0;

    for (let i = 0; i < a.length; i++) {
      result += newMath.pow(newMath.abs(b[i] - a[i]), 2);
    }

    return newMath.sqrt(result);
  },
  normalize: (v) => {
    let result = [...v];

    return Vector.divide(result, Vector.length(result));
  },
  dot: (a, b) => {
    let result = 0;

    for (let i = 0; i < a.length; i++) {
      result += a[i] * b[i];
    }

    return result;
  },
  reflect: (a, b) => {
    let result = [];
    const normalizedB = Vector.normalize(b);
    const dot = Vector.dot(a, normalizedB);

    for (let i = 0; i < a.length; i++) {
      result[i] = a[i]-2*normalizedB[i]*dot;
    }

    return result;
  },
  lerp: (a, b, t) => {
    let result = [];

    for (let i = 0; i < a.length; i++) {
      result[i] = a[i] + (b[i] - a[i]) * t;
    }

    return result;
  },
};

// return list of methods
['getStaticInfo', 'getDynamicInfo', 'getEventArgs', 'bakeDrawing', 'debugLog', 'Math', 'Vector'];
