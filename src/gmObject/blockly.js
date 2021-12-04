/* eslint-disable camelcase */
/* eslint-disable new-cap */
import Blockly from 'blockly';
import toolbox from '../blockly/toolbox.xml';
import windowHtml from '../gmWindow/window.html';
import blockDefs from '../blockly/blockdefs.js';
import defineBlockCode from '../blockly/blockfuncs.js';
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

    document.getElementById('newbonklobby_modetext').addEventListener('click', gm.blockly.showGMEWindow);
    document.getElementById('newbonklobby_modetext').style.cursor = 'pointer';

    // add block defs into blockly
    for (let i = 0; i != this.blockDefs.length; i++) {
      Blockly.Blocks[this.blockDefs[i].type] = {
        init: function() {
          this.jsonInit(gm.blockly.blockDefs[i]);
        },
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
      const varNameArray = code.match(/var (.+);/)[1].split(', ').map((v) => {
        return '"' + v + '"';
      });
      code = code.replace(/var (.+);/, 'gm.blockly.funcs.initVars([' + varNameArray.join(', ') + ']);');
    }
    return code;
  },
  vars: [],
  funcs: {
    createCircle: function(discID, xpos, ypos, radius, color, anchored) {
      let graphics;

      if (anchored) {
        graphics = gm.graphics.additionalDiscGraphics[discID];
      } else {
        graphics = gm.graphics.additionalWorldGraphics[discID];
      }

      color = '0x' + color.slice(1);

      graphics.beginFill(color);
      graphics.drawCircle(xpos, ypos, radius);
      graphics.endFill();
    },
    createRect: function(discID, xpos1, ypos1, xpos2, ypos2, color, anchored) {
      let graphics;

      if (anchored) {
        graphics = gm.graphics.additionalDiscGraphics[discID];
      } else {
        graphics = gm.graphics.additionalWorldGraphics[discID];
      }

      color = '0x' + color.slice(1);

      graphics.beginFill(color);
      graphics.drawRect(xpos1, ypos1, xpos2, ypos2);
      graphics.endFill();
    },
    createLine: function(discID, xpos1, ypos1, xpos2, ypos2, color, width, anchored) {
      let graphics;

      if (anchored) {
        graphics = gm.graphics.additionalDiscGraphics[discID];
      } else {
        graphics = gm.graphics.additionalWorldGraphics[discID];
      }

      color = '0x' + color.slice(1);

      graphics.lineStyle(width, color, 1);
      graphics.moveTo(xpos1, ypos1);
      graphics.lineTo(xpos2, ypos2);
    },
    createPoly: function(discID, vertexes, color, anchored) {
      let graphics;

      if (anchored) {
        graphics = gm.graphics.additionalDiscGraphics[discID];
      } else {
        graphics = gm.graphics.additionalWorldGraphics[discID];
      }

      color = '0x' + color.slice(1);

      const vertexList = [];

      for (let i = 0; i < vertexes.length; i += 2) {
        const vertex = [];

        vertex.push(typeof vertexes[i] === 'number' ? vertexes[i] : 0);
        vertex.push(typeof vertexes[i + 1] === 'number' ? vertexes[i + 1] : 0);

        vertexList.push(vertex);
      }
      graphics.beginFill(color);
      graphics.drawPolygon(vertexes);
      graphics.endFill();
    },
    clearGraphics: function(discID) {
      if (discID) {
        gm.graphics.additionalDiscGraphics[discID].clear();
        gm.graphics.additionalWorldGraphics[discID].clear();
      } else {
        for (let i = 0; i != gm.graphics.additionalDiscGraphics.length; i++) {
          if (gm.graphics.additionalDiscGraphics[i] && !gm.graphics.additionalDiscGraphics[i]._destroyed) {
            gm.graphics.additionalDiscGraphics[i].clear();
            gm.graphics.additionalWorldGraphics[i].clear();
          }
        }
      }
    },
    setPlayerProperty: function(gameState, discID, property, value) {
      if (gameState.discs[discID]) {
        gameState.discs[discID][property] = value;
      }
      return gameState;
    },
    changePlayerProperty: function(gameState, discID, property, value) {
      if (gameState.discs[discID]) {
        gameState.discs[discID][property] += value;
      }
      return gameState;
    },
    getPlayerProperty: function(gameState, discID, property) {
      if (gameState.discs[discID] && gameState.discs[discID][property]) {
        return gameState.discs[discID][property];
      } else {
        return 0;
      }
    },

    setLastArrowProperty: function(gameState, discID, property, value) {
      const projs = gameState.projectiles;
      for (let i = projs.length; i != -1; i -= 1) {
        if (projs[i] && projs[i].did == discID) {
          gameState.projectiles[i][property] = value;
          break;
        }
      }
      return gameState;
    },
    changeLastArrowProperty: function(gameState, discID, property, value) {
      const projs = gameState.projectiles;
      for (let i = projs.length; i != -1; i -= 1) {
        if (projs[i] && projs[i].did == discID) {
          gameState.projectiles[i][property] = value;
          break;
        }
      }
      return gameState;
    },
    getLastArrowProperty: function(gameState, discID, property) {
      const projs = gameState.projectiles;
      for (let i = projs.length; i != -1; i -= 1) {
        if (projs[i] && projs[i].did == discID) {
          return gameState.projectiles[i][property];
        }
      }
      return 0;
    },
    deleteAllPlayerArrows: function(gameState, discID) {
      for (let i = 0; i != gameState.projectiles.length; i++) {
        if (gameState.projectiles[i].did == discID) {
          gameState.projectiles[i] = null;
        }
      }
    },
    killPlayer: function(gameState, discID) {
      if (!gm.physics.killsThisStep.includes(discID)) {
        gm.physics.killsThisStep.push(discID);
      }
    },
    initVars: function(vars) {
      gm.blockly.vars = [{}];
      vars.map((v) => {
        gm.blockly.vars[0][v] = null;
      });
    },
    setVar: function(varName, discID, value) {
      if (typeof gm.blockly.vars[discID] == 'object') {
        gm.blockly.vars[discID][varName] = value;
      } else {
        gm.blockly.vars[discID] = {};
        gm.blockly.vars[discID][varName] = value;
      }
    },
    getVar: function(varName, discID) {
      if (gm.blockly.vars[discID] && gm.blockly.vars[discID][varName]) {
        return gm.blockly.vars[discID][varName];
      } else {
        return 0;
      }
    },
  },
  resetVars: function() {
    gm.blockly.vars = [];
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
    gm.blockly.resetVars();
    gm.blockly.resetMode();
    gm.blockly.funcs.clearGraphics();
  },
};
