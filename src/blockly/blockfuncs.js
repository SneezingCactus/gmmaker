/* eslint-disable camelcase */
/* eslint-disable new-cap */
import Blockly from 'blockly';

/**
* Sets up the blocks' functionality
*/
export default function() {
  Blockly.JavaScript['draw_line'] = function(block) {
    const line_x1 = Blockly.JavaScript.valueToCode(block, 'line_x1', Blockly.JavaScript.ORDER_ATOMIC);
    const line_y1 = Blockly.JavaScript.valueToCode(block, 'line_y1', Blockly.JavaScript.ORDER_ATOMIC);
    const line_x2 = Blockly.JavaScript.valueToCode(block, 'line_x2', Blockly.JavaScript.ORDER_ATOMIC);
    const line_y2 = Blockly.JavaScript.valueToCode(block, 'line_y2', Blockly.JavaScript.ORDER_ATOMIC);
    const line_width = Blockly.JavaScript.valueToCode(block, 'line_width', Blockly.JavaScript.ORDER_ATOMIC);
    const line_color = Blockly.JavaScript.valueToCode(block, 'line_color', Blockly.JavaScript.ORDER_ATOMIC);
    const line_anchored = block.getFieldValue('line_anchored') == 'TRUE';
    const code = `gm.blockly.funcs.createLine(playerid,${line_x1},${line_y1},${line_x2},${line_y2},${line_color},${line_width},${line_anchored});`;
    return code;
  };

  Blockly.JavaScript['draw_rect'] = function(block) {
    const rect_x1 = Blockly.JavaScript.valueToCode(block, 'rect_x1', Blockly.JavaScript.ORDER_ATOMIC);
    const rect_y1 = Blockly.JavaScript.valueToCode(block, 'rect_y1', Blockly.JavaScript.ORDER_ATOMIC);
    const rect_x2 = Blockly.JavaScript.valueToCode(block, 'rect_x2', Blockly.JavaScript.ORDER_ATOMIC);
    const rect_y2 = Blockly.JavaScript.valueToCode(block, 'rect_y2', Blockly.JavaScript.ORDER_ATOMIC);
    const rect_color = Blockly.JavaScript.valueToCode(block, 'rect_color', Blockly.JavaScript.ORDER_ATOMIC);
    const rect_anchored = block.getFieldValue('rect_anchored') == 'TRUE';
    const code = `gm.blockly.funcs.createRect(playerid,${rect_x1},${rect_y1},${rect_x2},${rect_y2},${rect_color},${rect_anchored});`;
    return code;
  };

  Blockly.JavaScript['draw_circle'] = function(block) {
    const circ_x = Blockly.JavaScript.valueToCode(block, 'circ_x', Blockly.JavaScript.ORDER_ATOMIC);
    const circ_y = Blockly.JavaScript.valueToCode(block, 'circ_y', Blockly.JavaScript.ORDER_ATOMIC);
    const circ_radius = Blockly.JavaScript.valueToCode(block, 'circ_radius', Blockly.JavaScript.ORDER_ATOMIC);
    const circ_color = Blockly.JavaScript.valueToCode(block, 'circ_color', Blockly.JavaScript.ORDER_ATOMIC);
    const circ_anchored = block.getFieldValue('circ_anchored') == 'TRUE';
    const code = `gm.blockly.funcs.createCircle(playerid,${circ_x},${circ_y},${circ_radius},${circ_color},${circ_anchored});`;
    return code;
  };

  Blockly.JavaScript['draw_poly'] = function(block) {
    const poly_vertex = Blockly.JavaScript.valueToCode(block, 'poly_vertex', Blockly.JavaScript.ORDER_ATOMIC);
    const poly_color = Blockly.JavaScript.valueToCode(block, 'poly_color', Blockly.JavaScript.ORDER_ATOMIC);
    const poly_anchored = block.getFieldValue('poly_anchored') == 'TRUE';

    const code = `gm.blockly.funcs.createPoly(playerid,${poly_vertex}, ${poly_color}, ${poly_anchored});`;
    return code;
  };

  Blockly.JavaScript['draw_clear'] = function(block) {
    const code = `gm.blockly.funcs.clearGraphics(playerid);`;
    return code;
  };

  Blockly.JavaScript['set_player_prop'] = function(block) {
    const player_prop = block.getFieldValue('player_prop');
    const set_number = Blockly.JavaScript.valueToCode(block, 'set_number', Blockly.JavaScript.ORDER_ATOMIC);
    const code = `gst = gm.blockly.funcs.setPlayerProperty(gst, playerid, "${player_prop}", ${set_number});`;
    return code;
  };

  Blockly.JavaScript['change_player_prop'] = function(block) {
    const player_prop = block.getFieldValue('player_prop');
    const change_number = Blockly.JavaScript.valueToCode(block, 'change_number', Blockly.JavaScript.ORDER_ATOMIC);
    const code = `gst = gm.blockly.funcs.changePlayerProperty(gst, playerid, "${player_prop}", ${change_number});`;
    return code;
  };

  Blockly.JavaScript['set_last_arrow_prop'] = function(block) {
    const arrow_prop = block.getFieldValue('arrow_prop');
    const set_number = Blockly.JavaScript.valueToCode(block, 'set_number', Blockly.JavaScript.ORDER_ATOMIC);
    const code = `gst = gm.blockly.funcs.setLastArrowProperty(gst, playerid, "${arrow_prop}", ${set_number});`;
    return code;
  };

  Blockly.JavaScript['change_last_arrow_prop'] = function(block) {
    const arrow_prop = block.getFieldValue('arrow_prop');
    const change_number = Blockly.JavaScript.valueToCode(block, 'change_number', Blockly.JavaScript.ORDER_ATOMIC);
    const code = `gst = gm.blockly.funcs.changeLastArrowProperty(gst, playerid, "${arrow_prop}", ${change_number});`;
    return code;
  };

  Blockly.JavaScript['get_player_prop'] = function(block) {
    const property = block.getFieldValue('property');
    const code = `gm.blockly.funcs.getPlayerProperty(gst, playerid, "${property}")`;

    return [code, Blockly.JavaScript.ORDER_NONE];
  };

  Blockly.JavaScript['get_last_arrow_prop'] = function(block) {
    const property = block.getFieldValue('property');
    const code = `gm.blockly.funcs.getLastArrowProperty(gst, playerid, "${property}")`;

    return [code, Blockly.JavaScript.ORDER_NONE];
  };

  Blockly.JavaScript['create_arrow'] = function(block) {
    const arrow_xpos = Blockly.JavaScript.valueToCode(block, 'arrow_xpos', Blockly.JavaScript.ORDER_ATOMIC);
    const arrow_ypos = Blockly.JavaScript.valueToCode(block, 'arrow_ypos', Blockly.JavaScript.ORDER_ATOMIC);
    const arrow_xvel = Blockly.JavaScript.valueToCode(block, 'arrow_xvel', Blockly.JavaScript.ORDER_ATOMIC);
    const arrow_yvel = Blockly.JavaScript.valueToCode(block, 'arrow_yvel', Blockly.JavaScript.ORDER_ATOMIC);
    const code = `if(gst.discs[playerid]){gst.projectiles.push({a: 0, av: 0, did: playerid, fte: 150, team: gst.discs[playerid].team, type: "arrow", x: ${arrow_xpos}, xv: ${arrow_xvel}, y: ${arrow_ypos}, yv: ${arrow_yvel}});}`;
    return code;
  };

  Blockly.JavaScript['delete_arrows'] = function(block) {
    const code = 'gm.blockly.funcs.deleteAllPlayerArrows(gst, playerid);';
    return code;
  };

  Blockly.JavaScript['player_die'] = function(block) {
    const code = 'gm.blockly.funcs.killPlayer(gst, playerid);';
    return code;
  };

  Blockly.JavaScript['on_round_start'] = function(block) {
    const inside_code = Blockly.JavaScript.statementToCode(block, 'code');
    const code = `gm.physics.onFirstStep = function(playerid){let gst = gm.physics.gameState;${inside_code}gm.physics.setGameState(gst);}`;
    return code;
  };

  Blockly.JavaScript['on_each_phys_frame'] = function(block) {
    const inside_code = Blockly.JavaScript.statementToCode(block, 'code');
    const code = `gm.physics.onStep = function(playerid){let gst = gm.physics.gameState;${inside_code}gm.physics.setGameState(gst);}`;
    return code;
  };

  Blockly.JavaScript['on_each_render_frame'] = function(block) {
    const inside_code = Blockly.JavaScript.statementToCode(block, 'code');
    const code = `gm.graphics.onRender = function(playerid){let gst = gm.physics.gameState;${inside_code}gm.physics.setGameState(gst);}`;
    return code;
  };

  Blockly.JavaScript['on_player_collide'] = function(block) {
    const collide_type = block.getFieldValue('collide_type');
    const inside_code = Blockly.JavaScript.statementToCode(block, 'code');
    let code = '';
    switch (collide_type) {
      case 'collide_player':
        code = `gm.physics.onPlayerPlayerCollision = function(playerid){let gst = gm.physics.gameState;${inside_code}gm.physics.setGameState(gst);}`;
        break;
      case 'collide_arrow':
        code = `gm.physics.onPlayerArrowCollision = function(playerid){let gst = gm.physics.gameState;${inside_code}gm.physics.setGameState(gst);}`;
        break;
      case 'collide_platform':
        code = `gm.physics.onPlayerPlatformCollision = function(playerid){let gst = gm.physics.gameState;${inside_code}gm.physics.setGameState(gst);}`;
        break;
    }
    return code;
  };

  Blockly.JavaScript['pressing_key'] = function(block) {
    const key = block.getFieldValue('key');
    const code = `(gm.inputs.allPlayerInputs[playerid] && gm.inputs.allPlayerInputs[playerid]["${key}"])`;

    return [code, Blockly.JavaScript.ORDER_NONE];
  };

  Blockly.JavaScript['on_arrow_collide'] = function(block) {
    const collide_type = block.getFieldValue('collide_type');
    const inside_code = Blockly.JavaScript.statementToCode(block, 'code');
    let code = '';

    switch (collide_type) {
      case 'collide_player':
        code = `gm.physics.onArrowPlayerCollision = function(playerid){let gst = gm.physics.gameState;${inside_code}gm.physics.setGameState(gst);}`;
        break;
      case 'collide_arrow':
        code = `gm.physics.onArrowArrowCollision = function(playerid){let gst = gm.physics.gameState;${inside_code}gm.physics.setGameState(gst);}`;
        break;
      case 'collide_platform':
        code = `gm.physics.onArrowPlatformCollision = function(playerid){let gst = gm.physics.gameState;${inside_code}gm.physics.setGameState(gst);}`;
        break;
    }
    return code;
  };

  Blockly.JavaScript['unit_to_pixel'] = function(block) {
    const value = Blockly.JavaScript.valueToCode(block, 'unit_value', Blockly.JavaScript.ORDER_ATOMIC);

    const code = `${value}*gm.physics.gameState.physics.ppm*gm.graphics.rendererClass.scaleRatio`;

    return [code, Blockly.JavaScript.ORDER_NONE];
  };

  Blockly.JavaScript['pixel_to_unit'] = function(block) {
    const value = Blockly.JavaScript.valueToCode(block, 'unit_value', Blockly.JavaScript.ORDER_ATOMIC);

    const code = `${value}/(gm.physics.gameState.physics.ppm*gm.graphics.rendererClass.scaleRatio)`;

    return [code, Blockly.JavaScript.ORDER_NONE];
  };

  Blockly.JavaScript['deg_to_rad'] = function(block) {
    const degree_value = Blockly.JavaScript.valueToCode(block, 'degree_value', Blockly.JavaScript.ORDER_ATOMIC);

    const code = `${degree_value}*(Math.PI/180)`;

    return [code, Blockly.JavaScript.ORDER_NONE];
  };

  Blockly.JavaScript['rad_to_deg'] = function(block) {
    const radian_value = Blockly.JavaScript.valueToCode(block, 'radian_value', Blockly.JavaScript.ORDER_ATOMIC);

    const code = `${radian_value}*(180/Math.PI)`;

    return [code, Blockly.JavaScript.ORDER_NONE];
  };

  // blockly built-in
  // make variables use own db
  Blockly.JavaScript['math_change'] = function(block) {
    // Add to a variable in place.
    const argument0 = Blockly.JavaScript.valueToCode(block, 'DELTA',
        Blockly.JavaScript.ORDER_ADDITION) || '0';
    const varName = Blockly.JavaScript.nameDB_.getName(
        block.getFieldValue('VAR'), Blockly.VARIABLE_CATEGORY_NAME);
    return 'gm.blockly.funcs.setVar("' + varName + '", playerid, (typeof gm.blockly.funcs.getVar("' + varName + '", playerid) == \'number\' ?  gm.blockly.funcs.getVar("' + varName +
                '", playerid) : 0) + ' + argument0 + ');\n';
  };

  Blockly.JavaScript['variables_set'] = function(block) {
    // Variable setter.
    const argument0 = Blockly.JavaScript.valueToCode(block, 'VALUE',
        Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
    const varName = Blockly.JavaScript.nameDB_.getName(
        block.getFieldValue('VAR'), Blockly.VARIABLE_CATEGORY_NAME);
    return 'gm.blockly.funcs.setVar("' + varName + '", playerid, ' + argument0 + ');\n';
  };

  Blockly.JavaScript['variables_get'] = function(block) {
    // Variable getter.
    const varName = Blockly.JavaScript.nameDB_.getName(block.getFieldValue('VAR'),
        Blockly.VARIABLE_CATEGORY_NAME);
    return ['gm.blockly.funcs.getVar("' + varName + '", playerid)', Blockly.JavaScript.ORDER_ATOMIC];
  };

  // fix functions
  Blockly.JavaScript['procedures_defreturn'] = function(block) {
    // Define a procedure with a return value.
    const funcName = Blockly.JavaScript.nameDB_.getName(
        block.getFieldValue('NAME'), Blockly.PROCEDURE_CATEGORY_NAME);
    let xfix1 = '';
    if (Blockly.JavaScript.STATEMENT_PREFIX) {
      xfix1 += Blockly.JavaScript.injectId(Blockly.JavaScript.STATEMENT_PREFIX,
          block);
    }
    if (Blockly.JavaScript.STATEMENT_SUFFIX) {
      xfix1 += Blockly.JavaScript.injectId(Blockly.JavaScript.STATEMENT_SUFFIX,
          block);
    }
    if (xfix1) {
      xfix1 = Blockly.JavaScript.prefixLines(xfix1, Blockly.JavaScript.INDENT);
    }
    let loopTrap = '';
    if (Blockly.JavaScript.INFINITE_LOOP_TRAP) {
      loopTrap = Blockly.JavaScript.prefixLines(
          Blockly.JavaScript.injectId(Blockly.JavaScript.INFINITE_LOOP_TRAP,
              block), Blockly.JavaScript.INDENT);
    }
    const branch = Blockly.JavaScript.statementToCode(block, 'STACK');
    let returnValue = Blockly.JavaScript.valueToCode(block, 'RETURN',
        Blockly.JavaScript.ORDER_NONE) || '';
    let xfix2 = '';
    if (branch && returnValue) {
      // After executing the function body, revisit this block for the return.
      xfix2 = xfix1;
    }
    if (returnValue) {
      returnValue = Blockly.JavaScript.INDENT + 'return ' + returnValue + ';';
    }
    const args = [];
    const variables = block.getVars();
    for (let i = 0; i < variables.length; i++) {
      args[i] = Blockly.JavaScript.nameDB_.getName(variables[i],
          Blockly.VARIABLE_CATEGORY_NAME);
    }
    let code = 'function ' + funcName + '(gst, playerid, ' + args.join(', ') + ') {' +
        xfix1 + loopTrap + branch + xfix2 + returnValue + '}';
    code = Blockly.JavaScript.scrub_(block, code);
    // Add % so as not to collide with helper functions in definitions list.
    Blockly.JavaScript.definitions_['%' + funcName] = code;
    return null;
  };

  Blockly.JavaScript['procedures_defnoreturn'] = Blockly.JavaScript['procedures_defreturn'];

  Blockly.JavaScript['procedures_callreturn'] = function(block) {
    // Call a procedure with a return value.
    const funcName = Blockly.JavaScript.nameDB_.getName(
        block.getFieldValue('NAME'), Blockly.PROCEDURE_CATEGORY_NAME);
    const args = [];
    const variables = block.getVars();
    for (let i = 0; i < variables.length; i++) {
      args[i] = Blockly.JavaScript.valueToCode(block, 'ARG' + i,
          Blockly.JavaScript.ORDER_NONE) || 'null';
    }
    const code = funcName + '(gst, playerid, ' + args.join(', ') + ')';
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
  };

  // remove 'random' to prevent desyncs
  Blockly.Blocks['lists_setIndex'].init = function() {
    const MODE =
        [
          [Blockly.Msg['LISTS_SET_INDEX_SET'], 'SET'],
          [Blockly.Msg['LISTS_SET_INDEX_INSERT'], 'INSERT'],
        ];
    this.WHERE_OPTIONS =
        [
          [Blockly.Msg['LISTS_GET_INDEX_FROM_START'], 'FROM_START'],
          [Blockly.Msg['LISTS_GET_INDEX_FROM_END'], 'FROM_END'],
          [Blockly.Msg['LISTS_GET_INDEX_FIRST'], 'FIRST'],
          [Blockly.Msg['LISTS_GET_INDEX_LAST'], 'LAST'],
        ];
    this.setHelpUrl(Blockly.Msg['LISTS_SET_INDEX_HELPURL']);
    this.setStyle('list_blocks');
    this.appendValueInput('LIST')
        .setCheck('Array')
        .appendField(Blockly.Msg['LISTS_SET_INDEX_INPUT_IN_LIST']);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown(MODE), 'MODE')
        .appendField('', 'SPACE');
    this.appendDummyInput('AT');
    this.appendValueInput('TO')
        .appendField(Blockly.Msg['LISTS_SET_INDEX_INPUT_TO']);
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg['LISTS_SET_INDEX_TOOLTIP']);
    this.updateAt_(true);
    // Assign 'this' to a variable for use in the tooltip closure below.
    const thisBlock = this;
    this.setTooltip(function() {
      const mode = thisBlock.getFieldValue('MODE');
      const where = thisBlock.getFieldValue('WHERE');
      let tooltip = '';
      switch (mode + ' ' + where) {
        case 'SET FROM_START':
        case 'SET FROM_END':
          tooltip = Blockly.Msg['LISTS_SET_INDEX_TOOLTIP_SET_FROM'];
          break;
        case 'SET FIRST':
          tooltip = Blockly.Msg['LISTS_SET_INDEX_TOOLTIP_SET_FIRST'];
          break;
        case 'SET LAST':
          tooltip = Blockly.Msg['LISTS_SET_INDEX_TOOLTIP_SET_LAST'];
          break;
        case 'INSERT FROM_START':
        case 'INSERT FROM_END':
          tooltip = Blockly.Msg['LISTS_SET_INDEX_TOOLTIP_INSERT_FROM'];
          break;
        case 'INSERT FIRST':
          tooltip = Blockly.Msg['LISTS_SET_INDEX_TOOLTIP_INSERT_FIRST'];
          break;
        case 'INSERT LAST':
          tooltip = Blockly.Msg['LISTS_SET_INDEX_TOOLTIP_INSERT_LAST'];
          break;
      }
      if (where == 'FROM_START' || where == 'FROM_END') {
        tooltip += '  ' + Blockly.Msg['LISTS_INDEX_FROM_START_TOOLTIP']
            .replace('%1',
                thisBlock.workspace.options.oneBasedIndex ? '#1' : '#0');
      }
      return tooltip;
    });
  };

  Blockly.Blocks['lists_getIndex'].init = function() {
    const MODE =
        [
          [Blockly.Msg['LISTS_GET_INDEX_GET'], 'GET'],
          [Blockly.Msg['LISTS_GET_INDEX_GET_REMOVE'], 'GET_REMOVE'],
          [Blockly.Msg['LISTS_GET_INDEX_REMOVE'], 'REMOVE'],
        ];
    this.WHERE_OPTIONS =
        [
          [Blockly.Msg['LISTS_GET_INDEX_FROM_START'], 'FROM_START'],
          [Blockly.Msg['LISTS_GET_INDEX_FROM_END'], 'FROM_END'],
          [Blockly.Msg['LISTS_GET_INDEX_FIRST'], 'FIRST'],
          [Blockly.Msg['LISTS_GET_INDEX_LAST'], 'LAST'],
        ];
    this.setHelpUrl(Blockly.Msg['LISTS_GET_INDEX_HELPURL']);
    this.setStyle('list_blocks');
    const modeMenu = new Blockly.FieldDropdown(MODE, function(value) {
      const isStatement = (value == 'REMOVE');
      // eslint-disable-next-line no-invalid-this
      this.getSourceBlock().updateStatement_(isStatement);
    });
    this.appendValueInput('VALUE')
        .setCheck('Array')
        .appendField(Blockly.Msg['LISTS_GET_INDEX_INPUT_IN_LIST']);
    this.appendDummyInput()
        .appendField(modeMenu, 'MODE')
        .appendField('', 'SPACE');
    this.appendDummyInput('AT');
    if (Blockly.Msg['LISTS_GET_INDEX_TAIL']) {
      this.appendDummyInput('TAIL')
          .appendField(Blockly.Msg['LISTS_GET_INDEX_TAIL']);
    }
    this.setInputsInline(true);
    this.setOutput(true);
    this.updateAt_(true);
    // Assign 'this' to a variable for use in the tooltip closure below.
    const thisBlock = this;
    this.setTooltip(function() {
      const mode = thisBlock.getFieldValue('MODE');
      const where = thisBlock.getFieldValue('WHERE');
      let tooltip = '';
      switch (mode + ' ' + where) {
        case 'GET FROM_START':
        case 'GET FROM_END':
          tooltip = Blockly.Msg['LISTS_GET_INDEX_TOOLTIP_GET_FROM'];
          break;
        case 'GET FIRST':
          tooltip = Blockly.Msg['LISTS_GET_INDEX_TOOLTIP_GET_FIRST'];
          break;
        case 'GET LAST':
          tooltip = Blockly.Msg['LISTS_GET_INDEX_TOOLTIP_GET_LAST'];
          break;
        case 'GET_REMOVE FROM_START':
        case 'GET_REMOVE FROM_END':
          tooltip = Blockly.Msg['LISTS_GET_INDEX_TOOLTIP_GET_REMOVE_FROM'];
          break;
        case 'GET_REMOVE FIRST':
          tooltip = Blockly.Msg['LISTS_GET_INDEX_TOOLTIP_GET_REMOVE_FIRST'];
          break;
        case 'GET_REMOVE LAST':
          tooltip = Blockly.Msg['LISTS_GET_INDEX_TOOLTIP_GET_REMOVE_LAST'];
          break;
        case 'REMOVE FROM_START':
        case 'REMOVE FROM_END':
          tooltip = Blockly.Msg['LISTS_GET_INDEX_TOOLTIP_REMOVE_FROM'];
          break;
        case 'REMOVE FIRST':
          tooltip = Blockly.Msg['LISTS_GET_INDEX_TOOLTIP_REMOVE_FIRST'];
          break;
        case 'REMOVE LAST':
          tooltip = Blockly.Msg['LISTS_GET_INDEX_TOOLTIP_REMOVE_LAST'];
          break;
      }
      if (where == 'FROM_START' || where == 'FROM_END') {
        const msg = (where == 'FROM_START') ?
            Blockly.Msg['LISTS_INDEX_FROM_START_TOOLTIP'] :
            Blockly.Msg['LISTS_INDEX_FROM_END_TOOLTIP'];
        tooltip += '  ' + msg.replace('%1',
                thisBlock.workspace.options.oneBasedIndex ? '#1' : '#0');
      }
      return tooltip;
    });
  };
}
