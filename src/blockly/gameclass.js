/* eslint-disable require-jsdoc */
function checkValidity(value) {
  return !(value === null || value === undefined || !Number.isFinite(value) || Number.isNaN(value));
}

const degToRad = Math.PI / 180;
const radToDeg = 180 / Math.PI;

class Player {
  constructor(gameState, id) {
    this.changeState(gameState);
    this.id = id;

    // initialize set change and get functions
    const actualThis = this;
    const exposeVars = {
      'x': 'xPos',
      'y': 'yPos',
      'xv': 'xVel',
      'yv': 'yVel',
    };

    for (const key in exposeVars) {
      if (!{}.hasOwnProperty.call(exposeVars, key)) continue;

      this[exposeVars[key]] = {
        set: (value) => actualThis.setProperty(key, value),
        changeBy: (value) => actualThis.changePropertyBy(key, value),
        get: () => actualThis.getProperty(key),
      };
    }

    this[`setAngle`] = (value) => actualThis.setProperty(key, value * degToRad);
    this[`changeAngleBy`] = (value) => actualThis.changePropertyBy(key, value * degToRad);
    this[`getAngle`] = () => actualThis.getProperty(key) * radToDeg;
  }
  changeState(newGameState) {
    this.gameState = newGameState;
  }

  // generic property functions
  setProperty(property, value) {
    if (!checkValidity(value)) return;
    this.gameState.discs[this.id][property] = value;
  }
  changePropertyBy(property, value) {
    if (!checkValidity(value)) return;
    this.gameState.discs[this.id][property] += value;
  }

  getProperty(property) {
    return this.gameState.discs[this.id][property];
  }

  getSize() {
    const bal = gm.lobby.mpSession.getGameSettings().bal[this.id];
    if (bal) {
      return 1 + Math.max(Math.min(bal / 100, 1), -0.94);
    }
    return 1;
  }

  getArrow(index) {

  }

  kill(allowRespawn) {
    if (!this.gameState.gmInfo.kills.includes(this.id)) {
      this.dead = true;
      this.gameState.gmInfo.kills.push({id: discID, allowRespawn: allowRespawn});
    }
  }
}

class Arrow {
  constructor(gameState, id) {
    this.changeState(gameState);
    this.id = id;

    // initialize set change and get functions
    const actualThis = this;
    const exposeVars = {
      'x': 'xPos',
      'y': 'yPos',
      'xv': 'xVel',
      'yv': 'yVel',
      'fte': 'stepsToDespawn',
    };

    for (const key in exposeVars) {
      if (!{}.hasOwnProperty.call(exposeVars, key)) continue;

      this[exposeVars[key]] = {
        set: (value) => actualThis.setProperty(key, value),
        changeBy: (value) => actualThis.changePropertyBy(key, value),
        get: () => actualThis.getProperty(key),
      };
    }

    this[`setAngle`] = (value) => actualThis.setProperty(key, value * degToRad);
    this[`changeAngleBy`] = (value) => actualThis.changePropertyBy(key, value * degToRad);
    this[`getAngle`] = () => actualThis.getProperty(key) * radToDeg;
  }
  changeState(newGameState) {
    this.gameState = newGameState;
  }

  // generic property functions
  setProperty(property, value) {
    if (!checkValidity(value)) return;
    this.gameState.projectiles[this.id][property] = value;
  }
  changePropertyBy(property, value) {
    if (!checkValidity(value)) return;
    this.gameState.projectiles[this.id][property] += value;
  }

  getProperty(property) {
    return this.gameState.projectiles[this.id][property];
  }

  getOwnerId() {
    return this.gameState.projectiles[this.id].did;
  }

  kill(allowRespawn) {
    if (!this.gameState.gmInfo.kills.includes(this.id)) {
      this.dead = true;
      this.gameState.gmInfo.kills.push({id: discID, allowRespawn: allowRespawn});
    }
  }
}

class GameClass {
  constructor(gameState) {
    this.players = [];
    this.arrows = [];

    if (gameState) this.changeState(gameState);
  }
  reset(newGameState) {
    this.players = [];
    this.arrows = [];

    this.changeState(newGameState);
  }
  changeState(newGameState) {
    this.gameState = newGameState;
    this.#update();
  }
  #update() {
    for (let i = 0; i < this.gameState.discs.length; i++) {
      const disc = this.gameState.discs[i];

      if (disc && !this.players[i]) {
        this.players[i] = new Player(this.gameState, i);
      } else if (this.players[i]) {
        this.players[i].changeState(this.gameState);
      }
    }

    for (let i = 0; i < this.gameState.projectiles.length; i++) {
      const arrow = this.gameState.projectiles[i];

      if (arrow && !this.arrows[i]) {
        this.arrows[i] = new Arrow(this.gameState, i);
      } else if (!arrow && this.arrows[i]) {
        delete this.arrows[i];
      } else if (arrow && this.arrows[i]) {
        this.arrows[i].changeState(this.gameState);
      }
    }
  }
}

export default GameClass;
