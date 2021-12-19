/* eslint-disable camelcase */
/* eslint-disable new-cap */
import Blockly from 'blockly';
import toolbox from '../blockly/toolbox.xml';
import windowHtml from '../gmWindow/window.html';
import blockDefs from '../blockly/blockdefs.js';
import defineBlockCode from '../blockly/blockfuncs.js';
import defineBlockValidators from '../blockly/blockvalidators.js';
import {saveAs} from 'file-saver';

export default {
  init: function() {
    this.blockDefs = blockDefs;
    this.initGMEditor();
  },
  initGMEditor: function() {
    // create the gm editor div
    const GMEditorWindow = document.createElement('div');
    document.getElementById('newbonkgamecontainer').appendChild(GMEditorWindow);
    GMEditorWindow.outerHTML = windowHtml;

    document.getElementById('gmeditor_newbutton').addEventListener('click', gm.blockly.GMENew);
    document.getElementById('gmeditor_importbutton').addEventListener('click', gm.blockly.GMEImport);
    document.getElementById('gmeditor_exportbutton').addEventListener('click', gm.blockly.GMEExport);
    document.getElementById('gmeditor_savebutton').addEventListener('click', gm.blockly.GMESave);
    document.getElementById('gmeditor_closebutton').addEventListener('click', gm.blockly.hideGMEWindow);


    const GMOpenButton = document.createElement('div');
    GMOpenButton.id = 'gmeditor_openbutton';
    GMOpenButton.className = 'newbonklobby_settings_button brownButton brownButton_classic buttonShadow';
    GMOpenButton.addEventListener('click', gm.blockly.showGMEWindow);

    // ensure compatibility with bonk-host
    if (window.createModeDropdown) {
      window.createModeDropdown_OLD = window.createModeDropdown;
      window.createModeDropdown = function() {
        window.createModeDropdown_OLD();
        GMOpenButton.className += ' gm_withbonkhost';
        document.getElementById('newbonklobby_settingsbox').appendChild(GMOpenButton);
      };
    } else {
      document.getElementById('newbonklobby_settingsbox').appendChild(GMOpenButton);
    }

    // add block defs into blockly
    for (let i = 0; i != this.blockDefs.length; i++) {
      Blockly.Blocks[this.blockDefs[i].type] = {};
    }

    defineBlockValidators();

    for (let i = 0; i != this.blockDefs.length; i++) {
      Blockly.Blocks[this.blockDefs[i].type].init = function() {
        this.jsonInit(gm.blockly.blockDefs[i]);

        if (this.validatorInit) {
          this.validatorInit();
        }
      };
    }

    defineBlockCode();

    const blocklyToolbox = document.createElement('xml');
    document.head.appendChild(blocklyToolbox);
    blocklyToolbox.outerHTML = toolbox;

    // create blockly workspace
    gm.blockly.workspace = Blockly.inject('gmblocklydiv', {
      toolbox: document.getElementById('toolbox'),
      zoom: {
        controls: true,
        wheel: true,
        startScale: 1.0,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.2,
        pinch: true,
      },
      theme: Blockly.Theme.defineTheme('themeName', {
        'base': Blockly.Themes.Classic,
        'fontStyle': {
          'family': 'futurept_b1',
          'size': 12,
        },
      }),
    });

    window.addEventListener('resize', () => {
      setTimeout(() => Blockly.svgResize(gm.blockly.workspace), 500);
    }, false);

    this.hideGMEWindow();
  },
  blockDefs: null,
  workspace: null,
  GMENew: function() {
    const confirmed = confirm('Are you sure you want to delete all blocks?');

    if (confirmed) {
      gm.blockly.workspace.clear();
    }
  },
  GMEImport: function() {
    const input = document.createElement('input');
    input.type = 'file';

    input.onchange = (e) => {
      const file = e.target.files[0];

      const reader = new FileReader();
      reader.readAsText(file, 'UTF-8');

      reader.onload = (readerEvent) => {
        const content = readerEvent.target.result;
        const xml = document.createElement('xml');
        xml.innerHTML = content;

        gm.blockly.workspace.clear();
        Blockly.Xml.domToWorkspace(xml, gm.blockly.workspace);
      };
    };

    input.click();
  },
  GMEExport: function() {
    const filename = prompt('File name:', 'export');

    if (filename !== null) {
      const blob = new Blob([Blockly.Xml.workspaceToDom(gm.blockly.workspace).innerHTML], {type: 'text/plain;charset=utf-8'});
      saveAs(blob, `${filename}.xml`);
    }
  },
  GMESave: function() {
    gm.blockly.resetAll();

    try {
      eval(gm.blockly.generateCode());
    } catch (e) {
      alert(`An error ocurred while trying to save.


Remember that blocks CANNOT be outside events. Make sure \
all blocks are inside an event block, and try again.`);
      throw (e);
    }

    gm.blockly.hideGMEWindow();
  },
  showGMEWindow: function() {
    document.getElementById('gmeditor').style.transform = 'scale(1)';
    gm.blockly.workspace.setVisible(true);
    Blockly.svgResize(gm.blockly.workspace);
  },
  hideGMEWindow: function() {
    gm.blockly.workspace.setVisible(false);
    document.getElementById('gmeditor').style.transform = 'scale(0)';
  },
  generateCode: function() {
    let code = Blockly.JavaScript.workspaceToCode(gm.blockly.workspace);
    if (code.startsWith('var ')) {
      code = code.replace(/var (.+);/, '');
    }
    return code;
  },
  vars: [],
  funcs: {
    createCircle: function(discID, xpos, ypos, radius, color, alpha, anchored) {
      let graphics;

      if (anchored) {
        graphics = gm.graphics.additionalDiscGraphics[discID];
      } else {
        graphics = gm.graphics.additionalWorldGraphics[discID];
      }

      if (!graphics || graphics._destroyed) return;

      xpos = gm.blockly.funcs.getScreenPos(xpos);
      ypos = gm.blockly.funcs.getScreenPos(ypos);
      radius = gm.blockly.funcs.getScreenPos(radius);

      if (xpos > 99999 || ypos > 99999 || radius > 99999) return;

      color = '0x' + color.slice(1);

      graphics.lineStyle(0, 0, 0);
      graphics.beginFill(color, alpha / 100);
      graphics.drawCircle(xpos, ypos, radius);
      graphics.endFill();
    },
    createRect: function(discID, xpos1, ypos1, xpos2, ypos2, color, alpha, anchored) {
      let graphics;

      if (anchored) {
        graphics = gm.graphics.additionalDiscGraphics[discID];
      } else {
        graphics = gm.graphics.additionalWorldGraphics[discID];
      }

      if (!graphics || graphics._destroyed) return;

      xpos1 = gm.blockly.funcs.getScreenPos(xpos1);
      ypos1 = gm.blockly.funcs.getScreenPos(ypos1);
      xpos2 = gm.blockly.funcs.getScreenPos(xpos2);
      ypos2 = gm.blockly.funcs.getScreenPos(ypos2);

      if (xpos1 > 99999 || ypos1 > 99999 || xpos2 > 99999 || ypos2 > 99999) return;

      color = '0x' + color.slice(1);

      graphics.lineStyle(0, 0, 0);
      graphics.beginFill(color, alpha / 100);
      graphics.drawRect(xpos1, ypos1, xpos2, ypos2);
      graphics.endFill();
    },
    createLine: function(discID, xpos1, ypos1, xpos2, ypos2, color, alpha, width, anchored) {
      let graphics;

      if (anchored) {
        graphics = gm.graphics.additionalDiscGraphics[discID];
      } else {
        graphics = gm.graphics.additionalWorldGraphics[discID];
      }

      if (!graphics || graphics._destroyed) return;

      xpos1 = gm.blockly.funcs.getScreenPos(xpos1);
      ypos1 = gm.blockly.funcs.getScreenPos(ypos1);
      xpos2 = gm.blockly.funcs.getScreenPos(xpos2);
      ypos2 = gm.blockly.funcs.getScreenPos(ypos2);

      if (xpos1 > 99999 || ypos1 > 99999 || xpos2 > 99999 || ypos2 > 99999 || width > 99999) return;

      color = '0x' + color.slice(1);

      graphics.lineStyle(width, color, alpha / 100);
      graphics.moveTo(xpos1, ypos1);
      graphics.lineTo(xpos2, ypos2);
    },
    createPoly: function(discID, vertexes, color, alpha = 100, anchored) {
      let graphics;

      if (anchored) {
        graphics = gm.graphics.additionalDiscGraphics[discID];
      } else {
        graphics = gm.graphics.additionalWorldGraphics[discID];
      }

      if (!graphics || graphics._destroyed) return;

      color = '0x' + color.slice(1);

      for (let i = 0; i < vertexes.length; i ++) {
        vertexes[i] = gm.blockly.funcs.getScreenPos(typeof vertexes[i] === 'number' ? vertexes[i] : 0);

        if (vertexes[i] > 99999) return;
      }

      graphics.lineStyle(0, 0, 0);
      graphics.beginFill(color, alpha / 100);
      graphics.drawPolygon(vertexes);
      graphics.endFill();
    },
    createText: function(discID, xpos, ypos, color, alpha, str, size, centered, anchored) {
      let graphics;

      if (anchored) {
        graphics = gm.graphics.additionalDiscGraphics[discID];
      } else {
        graphics = gm.graphics.additionalWorldGraphics[discID];
      }

      if (!graphics || graphics._destroyed) return;

      if (xpos > 99999 || ypos > 99999 || size > 99999) return;

      color = '0x' + color.slice(1);

      if (gm.graphics.availableText.length > 0) {
        const reusedText = gm.graphics.availableText.pop();

        gm.graphics.usedText.push(reusedText);
        graphics.addChild(reusedText);

        reusedText.resolution = 2;
        reusedText.x = gm.blockly.funcs.getScreenPos(xpos);
        reusedText.y = gm.blockly.funcs.getScreenPos(ypos);
        reusedText.text = str;
        reusedText.style.fill = color;
        reusedText.alpha = alpha / 100;
        reusedText.style.fontSize = gm.blockly.funcs.getScreenPos(size);
        reusedText.usedBy = discID;

        if (centered) {
          reusedText.anchor.set(0.5, 0);
        } else {
          reusedText.anchor.set(0, 0);
        }
      } else {
        const text = new PIXI.Text(str, {
          fontFamily: 'futurept_medium',
          fontSize: gm.blockly.funcs.getScreenPos(size),
          fill: color,
          align: 'center',
          dropShadow: true,
          dropShadowDistance: 3,
          dropShadowAlpha: 0.30,
        });

        graphics.addChild(text);

        text.resolution = 2;
        text.x = gm.blockly.funcs.getScreenPos(xpos);
        text.y = gm.blockly.funcs.getScreenPos(ypos);
        text.alpha = alpha / 100;
        text.usedBy = discID;

        if (centered) {
          text.anchor.set(0.5, 0);
        }

        gm.graphics.usedText.push(text);
      }
    },
    clearGraphics: function(discID) {
      if (typeof discID !== 'undefined') {
        const discGraphics = gm.graphics.additionalDiscGraphics[discID];
        const worldGraphics = gm.graphics.additionalWorldGraphics[discID];
        if (worldGraphics && !worldGraphics._destroyed) worldGraphics.clear();
        if (discGraphics && !discGraphics._destroyed) discGraphics.clear();

        if (discGraphics) gm.graphics.additionalDiscGraphics[discID].removeChildren();
        if (worldGraphics) gm.graphics.additionalWorldGraphics[discID].removeChildren();

        for (let i = 0; i < gm.graphics.usedText.length; i++) {
          if (gm.graphics.usedText[i]?.usedBy === discID) {
            gm.graphics.availableText.push(gm.graphics.usedText.splice(i, 1)[0]);
            i--;
          }
        }
      } else {
        for (let i = 0; i != gm.graphics.additionalDiscGraphics.length; i++) {
          const discGraphics = gm.graphics.additionalDiscGraphics[i];
          const worldGraphics = gm.graphics.additionalWorldGraphics[i];
          if (worldGraphics && !worldGraphics._destroyed) worldGraphics.clear();
          if (discGraphics && !discGraphics._destroyed) discGraphics.clear();

          if (discGraphics) gm.graphics.additionalDiscGraphics[i].removeChildren();
          if (worldGraphics) gm.graphics.additionalWorldGraphics[i].removeChildren();

          while (gm.graphics.usedText.length > 0) {
            gm.graphics.availableText.push(gm.graphics.usedText.pop());
          }
        }
      }
    },
    getScreenPos: function(value) {
      return value * gm.physics.gameState.physics.ppm * gm.graphics.rendererClass.scaleRatio;
    },
    setPlayerProperty: function(gameState, discID, property, value) {
      if (gm.graphics.rendering) return gameState;
      if (value === null || value === undefined || value === Infinity) return gameState;
      if (gameState.discs[discID]) {
        gameState.discs[discID][property] = value;
      }
      return gameState;
    },
    changePlayerProperty: function(gameState, discID, property, value) {
      if (gm.graphics.rendering) return gameState;
      if (value === null || value === undefined || value === Infinity) return gameState;
      if (gameState.discs[discID]) {
        gameState.discs[discID][property] += value;
      }
      return gameState;
    },
    getPlayerProperty: function(gameState, discID, property) {
      if (gameState.discs[discID] && !(!gameState.discs[discID][property] && gameState.discs[discID][property] !== 0)) {
        return gameState.discs[discID][property];
      } else {
        return Infinity;
      }
    },
    setArrowProperty: function(gameState, discID, arrowID, property, value) {
      if (gm.graphics.rendering) return gameState;
      if (value === null || value === undefined || value === Infinity) return gameState;

      const projs = gameState.projectiles;
      let accum = 1;

      for (let i = 0; i != projs.length; i++) {
        if (projs[i] && projs[i].did == discID) {
          if (accum == arrowID) {
            gameState.projectiles[i][property] = value;
            break;
          }
          accum++;
        }
      }
      return gameState;
    },
    setAllArrowsProperty: function(gameState, discID, property, value) {
      if (gm.graphics.rendering) return gameState;
      if (value === null || value === undefined || value === Infinity) return gameState;

      const projs = gameState.projectiles;

      for (let i = 0; i != projs.length; i++) {
        if (projs[i] && projs[i].did == discID) {
          gameState.projectiles[i][property] = value;
        }
      }
      return gameState;
    },
    changeArrowProperty: function(gameState, discID, arrowID, property, value) {
      if (gm.graphics.rendering) return gameState;
      if (value === null || value === undefined || value === Infinity) return gameState;
      const projs = gameState.projectiles;
      let accum = 1;

      for (let i = 0; i != projs.length; i++) {
        if (projs[i] && projs[i].did == discID) {
          if (accum == arrowID) {
            gameState.projectiles[i][property] += value;
            break;
          }
          accum++;
        }
      }
      return gameState;
    },
    changeAllArrowsProperty: function(gameState, discID, property, value) {
      if (gm.graphics.rendering) return gameState;
      if (value === null || value === undefined || value === Infinity) return gameState;

      const projs = gameState.projectiles;

      for (let i = 0; i != projs.length; i++) {
        if (projs[i] && projs[i].did == discID) {
          gameState.projectiles[i][property] += value;
        }
      }
      return gameState;
    },
    getArrowProperty: function(gameState, discID, arrowID, property) {
      const projs = gameState.projectiles;
      let accum = 1;

      for (let i = 0; i != projs.length; i++) {
        if (projs[i] && projs[i].did == discID) {
          if (accum == arrowID) {
            return gameState.projectiles[i][property];
            break;
          }
          accum++;
        }
      }
      return Infinity;
    },
    getArrowAmount: function(gameState, discID) {
      const projs = gameState.projectiles;
      let accum = 0;

      for (let i = 0; i != projs.length; i++) {
        if (projs[i] && projs[i].did == discID) {
          accum++;
        }
      }

      return accum;
    },
    deletePlayerArrow: function(gameState, discID, arrowID) {
      if (gm.graphics.rendering) return gameState;
      const projs = gameState.projectiles;
      let accum = 1;

      for (let i = 0; i != projs.length; i++) {
        if (projs[i] && projs[i].did == discID) {
          if (accum == arrowID) {
            gameState.projectiles[i] = null;
            break;
          }
          accum++;
        }
      }
    },
    deleteAllPlayerArrows: function(gameState, discID) {
      if (gm.graphics.rendering) return gameState;
      const projs = gameState.projectiles;
      for (let i = 0; i != projs.length; i++) {
        if (projs[i] && projs[i].did == discID) {
          gameState.projectiles[i] = null;
        }
      }
    },
    getAllPlayerIds: function(gameState) {
      const array = [];
      for (let i = 0; i != gameState.discs.length; i++) {
        if (gameState.discs[i]) array.push(i);
      }
      return array;
    },
    getPlayerSize: function(discID) {
      const bal = gm.lobby.mpSession.getGameSettings().bal[discID];

      if (bal) {
        return 1 + Math.max(Math.min(bal / 100, 1), -0.94);
      }
      return 1;
    },
    getPlayerColor: function(gameState, discID) {
      if (!gameState.discs[discID]) return '#000000';
      switch (gameState.discs[discID].team) {
        case 1:
          if (gm.graphics.rendererClass.playerArray[discID]) {
            return '#' + gm.graphics.rendererClass.playerArray[discID].avatar.bc.toString(16);
          }
          break;
        case 2:
          return '#f44336';
        case 3:
          return '#2196f3';
        case 4:
          return '#4caf50';
        case 5:
          return '#ffeb3b';
      }
      return '#000000';
    },
    createArrow: function(gameState, discID, xpos, ypos, xvel, yvel, angle, time) {
      if (xpos > 99999 || ypos > 99999 || xvel > 99999 || yvel > 99999 || angle > 99999) return;
      if (gameState.discs[discID]) {
        gameState.projectiles.push({
          a: angle,
          av: 0,
          did: discID,
          fte: time,
          team: gameState.discs[discID].team,
          type: 'arrow',
          x: xpos,
          xv: xvel,
          y: ypos,
          yv: yvel,
        });
      }
    },
    overrideInput: function(gameState, discID, input, value) {
      if (gm.graphics.rendering) return;
      if (gameState.physics.bodies[0].cf.overrides && !gameState.physics.bodies[0].cf.overrides[discID]) {
        gameState.physics.bodies[0].cf.overrides[discID] = {};
      } else if (!gameState.physics.bodies[0].cf.overrides) {
        gameState.physics.bodies[0].cf.overrides = [];
        gameState.physics.bodies[0].cf.overrides[discID] = {};
      }

      gameState.physics.bodies[0].cf.overrides[discID][input] = value;
    },
    killPlayer: function(gameState, discID) {
      if (gm.graphics.rendering) return;
      if (gameState.physics.bodies[0].cf.kills && !gameState.physics.bodies[0].cf.kills.includes(discID)) {
        gameState.physics.bodies[0].cf.kills.push(discID);
      } else if (!gameState.physics.bodies[0].cf.kills) {
        gameState.physics.bodies[0].cf.kills = [];
        gameState.physics.bodies[0].cf.kills.push(discID);
      }
    },
    setVar: function(varName, gameState, discID, value) {
      if (value === null || value === undefined) return;

      if (!gameState.physics.bodies[0].cf.global) {
        gameState.physics.bodies[0].cf.global = {};
      }
      if (varName.startsWith('GLOBAL_')) {
        gameState.physics.bodies[0].cf.global[varName] = value;
      } else if (gameState.physics.bodies[0].cf[discID]) {
        gameState.physics.bodies[0].cf[discID][varName] = value;
      } else {
        gameState.physics.bodies[0].cf[discID] = {};
        gameState.physics.bodies[0].cf[discID][varName] = value;
      }
    },
    changeVar: function(varName, gameState, discID, value) {
      if (value === null || value === undefined) return;

      if (!gameState.physics.bodies[0].cf.global) {
        gameState.physics.bodies[0].cf.global = {};
      }
      if (varName.startsWith('GLOBAL_')) {
        gameState.physics.bodies[0].cf.global[varName] += value;
      } else if (gameState.physics.bodies[0].cf[discID]) {
        if (!gameState.physics.bodies[0].cf[discID][varName]) gameState.physics.bodies[0].cf[discID][varName] = 0;
        gameState.physics.bodies[0].cf[discID][varName] += value;
      } else {
        gameState.physics.bodies[0].cf[discID] = {};
        gameState.physics.bodies[0].cf[discID][varName] = value;
      }
    },
    getVar: function(varName, gameState, discID) {
      if (gameState.physics.bodies[0]) {
        if (varName.startsWith('GLOBAL_') && gameState.physics.bodies[0].cf.global && Object.keys(gameState.physics.bodies[0].cf.global).includes(varName)) {
          return gameState.physics.bodies[0].cf.global[varName];
        } else if (!varName.startsWith('GLOBAL_') && gameState.physics.bodies[0].cf[discID] && Object.keys(gameState.physics.bodies[0].cf[discID]).includes(varName)) {
          return gameState.physics.bodies[0].cf[discID][varName];
        }
      }
      return Infinity;
    },
    getDistance: function(pointA_X, pointA_Y, pointB_X, pointB_Y) {
      return Math.sqrt(Math.pow(pointB_X - pointA_X, 2)+Math.pow(pointB_Y - pointA_Y, 2));
    },
    setInArray: function(array, index, value) {
      array[index] = value;
      return array;
    },
    insertInArray: function(array, index, value) {
      array.splice(index, 0, value);
      return array;
    },
  },
  resetVars: function() {
  },
  resetMode: function() {
    gm.physics.onFirstStep = function() {};
    gm.physics.onStep = function() {};
    gm.physics.onPlayerPlayerCollision = function() {};
    gm.physics.onPlayerArrowCollision = function() {};
    gm.physics.onPlayerPlatformCollision = function() {};
    gm.physics.onArrowPlayerCollision = function() {};
    gm.physics.onArrowArrowCollision = function() {};
    gm.physics.onArrowPlatformCollision = function() {};
    gm.graphics.onRender = function() {};
  },
  resetAll: function() {
    gm.blockly.resetMode();
    gm.blockly.funcs.clearGraphics();
  },
};
