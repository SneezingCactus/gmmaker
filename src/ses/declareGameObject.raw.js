/* eslint-disable no-invalid-this */
this.defaults = {
  drawing: {
    alpha: 1,
    xPos: 0,
    yPos: 0,
    angle: 0,
    xScale: 1,
    yScale: 1,
    attachTo: 'world',
    isBehind: false,
    noLerp: false,
    shapes: [],
  },
  boxShape: {
    colour: 0xffffff,
    alpha: 1,
    xPos: 0,
    yPos: 0,
    angle: 0,
    width: 1,
    height: 1,
    noLerp: false,
  },
  circleShape: {
    type: 'ci',
    colour: 0xffffff,
    alpha: 1,
    xPos: 0,
    yPos: 0,
    angle: 0,
    width: 1,
    height: 1,
    noLerp: false,
  },
  polyShape: {
    type: 'po',
    colour: 0xffffff,
    alpha: 1,
    xPos: 0,
    yPos: 0,
    angle: 0,
    xScale: 1,
    yScale: 1,
    vertices: [
      [0, 0],
      [1, 0],
      [0, 1],
    ],
    noLerp: false,
  },
  lineShape: {
    type: 'li',
    colour: 0xffffff,
    alpha: 1,
    xPos: 0,
    yPos: 0,
    xEnd: 1,
    yEnd: 1,
    width: 1,
    noLerp: false,
  },
  textShape: {
    type: 'tx',
    colour: 0xffffff,
    alpha: 1,
    xPos: 0,
    yPos: 0,
    angle: 0,
    text: '',
    size: 1,
    align: 'left',
    bold: false,
    italic: false,
    shadow: true,
    noLerp: false,
  },
  imageShape: {
    id: '',
    region: null,
    colour: 0xffffff,
    alpha: 1,
    xPos: 0,
    yPos: 0,
    angle: 0,
    width: 1,
    height: 1,
    noLerp: false,
  },
};

this.game = {
  vars: {},
  events: {
    addEventListener: function(eventName, options, listener) {
      this.eventListeners[eventName]?.push({options: options, listener: listener});
    },
    fireEvent: function(eventName, options, args) {
      const listeners = this.eventListeners[eventName];
      for (let i = 0; i < listeners.length; i++) {
        if (listeners[i].options.runOnce != options.runOnce ||
            listeners[i].options.collideWith != options.collideWith) continue;

        listeners[i].listener(...args);
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
  state: {},
  inputs: {},
  lobby: {},
  graphics: {
    createDrawing: function(drawing) {
      const finalDrawing = Object.assign(JSON.parse(JSON.stringify(defaults.drawing)), drawing);

      game.graphics.drawings.push(finalDrawing);

      if (!drawing.shapes) return game.graphics.drawings.length - 1;

      for (let i = 0; i < drawing.shapes.length; i++) {
        const shape = drawing.shapes[i];
        switch (shape.type) {
          case 'bx':
            drawing.shapes[i] = Object.assign(JSON.parse(JSON.stringify(defaults.boxShape)), shape);
            break;
          case 'ci':
            drawing.shapes[i] = Object.assign(JSON.parse(JSON.stringify(defaults.circleShape)), shape);
            break;
          case 'po':
            drawing.shapes[i] = Object.assign(JSON.parse(JSON.stringify(defaults.polyShape)), shape);
            break;
          case 'li':
            drawing.shapes[i] = Object.assign(JSON.parse(JSON.stringify(defaults.lineShape)), shape);
            break;
          case 'tx':
            drawing.shapes[i] = Object.assign(JSON.parse(JSON.stringify(defaults.textShape)), shape);
            break;
          case 'im':
            drawing.shapes[i] = Object.assign(JSON.parse(JSON.stringify(defaults.imageShape)), shape);
            break;
        }
      }

      return game.graphics.drawings.length - 1;
    },
    bakeDrawing: function(id, resolution = 1) {
      if (!game.graphics.drawings[id]) return;
      const baked = bakeDrawing(id, resolution, game.state.physics.ppm);

      game.graphics.drawings[id].shapes = [{
        type: 'im',
        id: baked.id,
        region: null,
        colour: 0xffffff,
        alpha: 1,
        xPos: 0,
        yPos: 0,
        angle: 0,
        width: baked.width,
        height: baked.height,
        noLerp: false,
      }];
    },
    debugLog: debugLog,
  },
  audio: {
    playSound: playSound,
    playSoundAtWorldPos: function(id, volume, xPos) {
      const ppm = game.state.physics.ppm;

      let panning = xPos / (365 / ppm) - 1;
      panning += ((-game.graphics.camera.xPos + 730 / ppm) * game.graphics.camera.xScale) / (365 / ppm) - 1;

      this.playSound(id, volume, panning);
    },
    stopAllSounds: stopAllSounds,
  },
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
this.setDynamicInfo = function() {
  getDynamicInfo(this.game);
};
this.prepareDynamicInfo = function() {
  game.state.gmExtra.camera = game.graphics.camera;
  game.state.gmExtra.drawings = game.graphics.drawings;
  game.state.gmExtra.overrides = game.inputs.overrides;

  return game.state;
};
