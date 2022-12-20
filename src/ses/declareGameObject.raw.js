/* eslint-disable no-invalid-this */
this.defaults = {
  drawing: {
    alpha: 1,
    pos: [0, 0],
    angle: 0,
    scale: [1, 1],
    attachTo: 'world',
    isBehind: false,
    noLerp: false,
    shapes: [],
  },
  drawingBoxShape: {
    colour: 0xffffff,
    alpha: 1,
    pos: [0, 0],
    angle: 0,
    size: [1, 1],
    noLerp: false,
  },
  drawingCircleShape: {
    type: 'ci',
    colour: 0xffffff,
    alpha: 1,
    pos: [0, 0],
    angle: 0,
    size: [1, 1],
    noLerp: false,
  },
  drawingPolyShape: {
    type: 'po',
    colour: 0xffffff,
    alpha: 1,
    pos: [0, 0],
    angle: 0,
    scale: [1, 1],
    vertices: [
      [0, 0],
      [1, 0],
      [0, 1],
    ],
    noLerp: false,
  },
  drawingLineShape: {
    type: 'li',
    colour: 0xffffff,
    alpha: 1,
    pos: [0, 0],
    end: [1, 1],
    width: 1,
    noLerp: false,
  },
  drawingTextShape: {
    type: 'tx',
    colour: 0xffffff,
    alpha: 1,
    pos: [0, 0],
    angle: 0,
    text: '',
    size: 1,
    align: 'left',
    bold: false,
    italic: false,
    shadow: true,
    noLerp: false,
  },
  drawingImageShape: {
    id: '',
    region: null,
    colour: 0xffffff,
    alpha: 1,
    pos: [0, 0],
    angle: 0,
    size: [1, 1],
    noLerp: false,
  },
  body: {
    type: 's',
    p: [0, 0],
    lv: [0, 0],
    a: 0,
    av: 0,
    fricp: false,
    fric: 1,
    de: 0.3,
    re: 0.8,
    ld: 0,
    ad: 0,
    fr: false,
    bu: false,
    cf: {
      x: 0,
      y: 0,
      w: false,
      ct: 0,
    },
    f_c: 1,
    f_p: true,
    f_1: true,
    f_2: true,
    f_3: true,
    f_4: true,
  },
  bodyFixture: {
    n: 'fixture',
    f: 0xffffff,
    fp: null,
    fr: null,
    re: null,
    de: null,
    d: false,
    np: false,
    ng: false,
    ig: false,
  },
  bodyBoxShape: {
    type: 'bx',
    c: [0, 0],
    a: 0,
    w: 1,
    h: 1,
    sk: false,
  },
  bodyCircleShape: {
    type: 'ci',
    c: [0, 0],
    r: 1,
    sk: false,
  },
  bodyPolyShape: {
    type: 'po',
    c: [0, 0],
    a: 0,
    s: 1,
    v: [
      [0, 0],
      [1, 0],
      [0, 1],
    ],
  },
  arrow: {
    type: 'arrow',
    p: [0, 0],
    lv: [0, 0],
    a: 0,
    av: 0,
    fte: 150,
    did: -1,
    ni: false,
    visible: true,
  },
};

this.game = {
  vars: {},
  events: {
    addEventListener: function(eventName, options, listener) {
      this.eventListeners[eventName]?.push({options: options, listener: listener});
    },
    fireEvent: function(eventName, options, args) {
      try {
        const listeners = this.eventListeners[eventName];
        for (let i = 0; i < listeners.length; i++) {
          if (listeners[i]?.options && (listeners[i]?.options.perPlayer != options?.perPlayer ||
              listeners[i]?.options.collideWith != options?.collideWith)) continue;

          listeners[i].listener(...args);
        }
      } catch (e) {
        e.isModeError = true;
        throw e;
      }
    },
    eventListeners: {
      roundStart: [],
      step: [],
      playerDie: [],
      discCollision: [],
      arrowCollision: [],
      bodyCollision: [],
    },
  },
  state: null,
  inputs: {},
  lobby: {},
  world: {
    createBody: function(options) {
      const finalBody = Object.assign(JSON.parse(JSON.stringify(defaults.body)), options.bodyDef);
      finalBody.cf = Object.assign(JSON.parse(JSON.stringify(defaults.body.cf)), finalBody.cf);

      finalBody.fx = [];

      for (let i = 0; i < options.fixtureDefs.length; i++) {
        const fixture = Object.assign(JSON.parse(JSON.stringify(defaults.bodyFixture)), options.fixtureDefs[i]);

        let shape = options.shapeDefs[i] ?? {type: 'bx'};

        switch (shape.type) {
          case 'bx':
            shape = Object.assign(JSON.parse(JSON.stringify(defaults.bodyBoxShape)), shape);
            break;
          case 'ci':
            shape = Object.assign(JSON.parse(JSON.stringify(defaults.bodyCircleShape)), shape);
            break;
          case 'po':
            shape = Object.assign(JSON.parse(JSON.stringify(defaults.bodyPolyShape)), shape);
            break;
        }

        game.state.physics.shapes.push(shape);

        fixture.sh = game.state.physics.shapes.length - 1;
        game.state.physics.fixtures.push(fixture);
        finalBody.fx.push(game.state.physics.fixtures.length - 1);
      }

      game.state.physics.bodies.push(finalBody);
      game.state.physics.bro.splice(Math.min(options.viewOrder ?? Infinity, game.state.physics.bro.length), 0, game.state.physics.bodies.length - 1);

      return game.state.physics.bodies.length - 1;
    },
    addFixtureShapeToBody: function(options) {
      const fixture = Object.assign(JSON.parse(JSON.stringify(defaults.bodyFixture)), options.fixtureDef);

      let shape = options.shapeDef ?? {type: 'bx'};

      switch (shape.type) {
        case 'bx':
          shape = Object.assign(JSON.parse(JSON.stringify(defaults.bodyBoxShape)), shape);
          break;
        case 'ci':
          shape = Object.assign(JSON.parse(JSON.stringify(defaults.bodyCircleShape)), shape);
          break;
        case 'po':
          shape = Object.assign(JSON.parse(JSON.stringify(defaults.bodyPolyShape)), shape);
          break;
      }

      game.state.physics.shapes.push(shape);

      fixture.sh = game.state.physics.shapes.length - 1;
      game.state.physics.fixtures.push(fixture);
      game.state.physics.bodies[options.bodyId]?.fx.push(game.state.physics.fixtures.length - 1);

      return game.state.physics.fixtures.length - 1;
    },
    createArrow: function(arrow) {
      const finalArrow = Object.assign(JSON.parse(JSON.stringify(defaults.arrow)), arrow);

      game.state.projectiles.push(finalArrow);

      return game.state.projectiles.length - 1;
    },
    killDisc: function(id, allowRespawn = true) {
      game.state.gmExtra.kills.push({id: id, allowRespawn: allowRespawn});
    },
    getDiscRadius: (id) => game.lobby.settings.bal[id] ? 1 + Math.max(Math.min(game.lobby.settings.bal[id] / 100, 1), -0.94) : 1,
    rayCast: rayCast,
    rayCastAll: rayCastAll,
    disableDeathBarrier: false,
  },
  graphics: {
    addShapeToDrawing: function(drawingId, shape) {
      const drawing = game.graphics.drawings[drawingId];

      if (!drawing) return;

      switch (shape.type) {
        case 'bx':
          drawing.shapes.push(Object.assign(JSON.parse(JSON.stringify(defaults.drawingBoxShape)), shape));
          break;
        case 'ci':
          drawing.shapes.push(Object.assign(JSON.parse(JSON.stringify(defaults.drawingCircleShape)), shape));
          break;
        case 'po':
          drawing.shapes.push(Object.assign(JSON.parse(JSON.stringify(defaults.drawingPolyShape)), shape));
          break;
        case 'li':
          drawing.shapes.push(Object.assign(JSON.parse(JSON.stringify(defaults.drawingLineShape)), shape));
          break;
        case 'tx':
          drawing.shapes.push(Object.assign(JSON.parse(JSON.stringify(defaults.drawingTextShape)), shape));
          break;
        case 'im':
          drawing.shapes.push(Object.assign(JSON.parse(JSON.stringify(defaults.drawingImageShape)), shape));
          break;
      }

      return drawing.shapes.length - 1;
    },
    createDrawing: function(drawing) {
      const finalDrawing = Object.assign(JSON.parse(JSON.stringify(defaults.drawing)), drawing);

      game.graphics.drawings.push(finalDrawing);

      if (!drawing.shapes) return game.graphics.drawings.length - 1;

      for (let i = 0; i < drawing.shapes.length; i++) {
        const shape = drawing.shapes[i];
        switch (shape.type) {
          case 'bx':
            drawing.shapes[i] = Object.assign(JSON.parse(JSON.stringify(defaults.drawingBoxShape)), shape);
            break;
          case 'ci':
            drawing.shapes[i] = Object.assign(JSON.parse(JSON.stringify(defaults.drawingCircleShape)), shape);
            break;
          case 'po':
            drawing.shapes[i] = Object.assign(JSON.parse(JSON.stringify(defaults.drawingPolyShape)), shape);
            break;
          case 'li':
            drawing.shapes[i] = Object.assign(JSON.parse(JSON.stringify(defaults.drawingLineShape)), shape);
            break;
          case 'tx':
            drawing.shapes[i] = Object.assign(JSON.parse(JSON.stringify(defaults.drawingTextShape)), shape);
            break;
          case 'im':
            drawing.shapes[i] = Object.assign(JSON.parse(JSON.stringify(defaults.drawingImageShape)), shape);
            break;
        }
      }

      return game.graphics.drawings.length - 1;
    },
    bakeDrawing: function(id, resolution = 1) {
      if (!game.graphics.drawings[id]) return;
      const baked = bakeDrawing(id, resolution, game.state);

      game.graphics.drawings[id].shapes = [{
        type: 'im',
        id: baked.id,
        region: null,
        colour: 0xffffff,
        alpha: 1,
        pos: [0.01, 0.01],
        angle: 0,
        size: [baked.width,
          baked.height],
        noLerp: true,
      }];
    },
    getScreenSize: () => [730 / game.state.physics.ppm, 500 / game.state.physics.ppm],
  },
  audio: {
    playSound: playSound,
    playSoundAtWorldPos: function(id, volume, xPos) {
      const ppm = game.state.physics.ppm;

      let panning = xPos / (365 / ppm) - 1;
      panning += ((-game.graphics.camera.pos[0] + 730 / ppm) * game.graphics.camera.scale[0]) / (365 / ppm) - 1;

      this.playSound(id, volume, panning);
    },
    stopAllSounds: stopAllSounds,
  },
  debugLog: debugLog,
};

this.staticSetted = false;
this.resetStaticInfo = function() {
  this.staticSetted = false;

  game.lobby = {};
};
this.setStaticInfo = function() {
  getStaticInfo(this.game);
  this.staticSetted = true;
};
this.gameStateList = [];
this.setDynamicInfo = function() {
  getDynamicInfo(this.game);

  const gameLength = game.state.gmExtra.gameLength;

  gameStateList[gameLength] = game.state;
  game.prevState = gameStateList[gameLength - 1];
  delete gameStateList[gameLength - 500];

  // random seed manage
  let randomSeed = 0;

  for (let i = 0; i < game.state.discs.length; i++) {
    if (!game.state.discs[i]) continue;
    randomSeed = randomSeed + game.state.discs[i].x + game.state.discs[i].y + game.state.discs[i].xv + game.state.discs[i].yv;
  }

  randomSeed += game.state.rl;
  randomSeed += randomSeed * game.state.rc;
  randomSeed *= game.lobby.seed + 1;

  // eslint-disable-next-line new-cap
  const random = new Math.seedrandom(randomSeed);
  Math.random = (a) => Math.round(random() * 1000000000) / 1000000000;
};
this.prepareDynamicInfo = function() {
  game.state.gmExtra.camera = game.graphics.camera;
  game.state.gmExtra.drawings = game.graphics.drawings;
  game.state.gmExtra.overrides = game.inputs.overrides;
  game.state.gmExtra.disableDeathBarrier = game.world.disableDeathBarrier;

  return game.state;
};
