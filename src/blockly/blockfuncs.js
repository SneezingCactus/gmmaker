/* eslint-disable no-var */
/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable new-cap */
import {Names, utils} from 'blockly';
import {javascriptGenerator as JavaScript} from 'blockly/javascript';

/**
* Sets up the blocks' functionality
*/
export default function() {
  const NameType = Names.NameType;

  JavaScript['event_roundstart'] = function(block) {
    var perplayer = block.getFieldValue('perplayer') === 'TRUE';
    var insideCode = JavaScript.statementToCode(block, 'code');

    if (perplayer) {
      var player_id = JavaScript.nameDB_.getName(block.getFieldValue('player_id'), NameType.VARIABLE);

      return `game.events.addEventListener('roundStart', {perPlayer: true}, function(id) {\n  game.vars.${player_id} = id;
${insideCode}});\n`;
    } else {
      return `game.events.addEventListener('roundStart', {perPlayer: false}, function() {
${insideCode}});\n`;
    }
  };

  JavaScript['event_step'] = function(block) {
    var perplayer = block.getFieldValue('perplayer') === 'TRUE';
    var insideCode = JavaScript.statementToCode(block, 'code');

    if (perplayer) {
      var player_id = JavaScript.nameDB_.getName(block.getFieldValue('player_id'), NameType.VARIABLE);

      return `game.events.addEventListener('step', {perPlayer: true}, function(id) {\n  game.vars.${player_id} = id;
${insideCode}});\n`;
    } else {
      return `game.events.addEventListener('step', {perPlayer: false}, function() {
${insideCode}});\n`;
    }
  };

  JavaScript['event_collision'] = function(block) {
    var col_a = block.getFieldValue('col_a');
    var col_b = block.getFieldValue('col_b');
    var perplayer = block.getFieldValue('perplayer') === 'TRUE';
    var a_discid = JavaScript.nameDB_.getName(block.getFieldValue('a_discid'), NameType.VARIABLE);
    var a_arrowid = JavaScript.nameDB_.getName(block.getFieldValue('a_arrowid'), NameType.VARIABLE);
    var a_bodyid = JavaScript.nameDB_.getName(block.getFieldValue('a_bodyid'), NameType.VARIABLE);
    var a_fixtureid = JavaScript.nameDB_.getName(block.getFieldValue('a_fixtureid'), NameType.VARIABLE);
    var a_normal = JavaScript.nameDB_.getName(block.getFieldValue('a_normal'), NameType.VARIABLE);
    var a_capzone = JavaScript.nameDB_.getName(block.getFieldValue('a_capzone'), NameType.VARIABLE);
    var b_discid = JavaScript.nameDB_.getName(block.getFieldValue('b_discid'), NameType.VARIABLE);
    var b_arrowid = JavaScript.nameDB_.getName(block.getFieldValue('b_arrowid'), NameType.VARIABLE);
    var b_bodyid = JavaScript.nameDB_.getName(block.getFieldValue('b_bodyid'), NameType.VARIABLE);
    var b_fixtureid = JavaScript.nameDB_.getName(block.getFieldValue('b_fixtureid'), NameType.VARIABLE);
    var b_normal = JavaScript.nameDB_.getName(block.getFieldValue('b_normal'), NameType.VARIABLE);
    var b_capzone = JavaScript.nameDB_.getName(block.getFieldValue('b_capzone'), NameType.VARIABLE);
    var insideCode = JavaScript.statementToCode(block, 'code');

    var code = '...;\n';
    return code;
  };

  JavaScript['event_playerdie'] = function(block) {
    var player_id = JavaScript.nameDB_.getName(block.getFieldValue('player_id'), NameType.VARIABLE);
    var insideCode = JavaScript.statementToCode(block, 'code');

    var code = '...;\n';
    return code;
  };

  JavaScript['if_return_event'] = function(block) {
    const bool = JavaScript.valueToCode(block, 'bool', JavaScript.ORDER_ATOMIC);

    return `if (${bool}) return;\n`;
  };

  JavaScript['return_event'] = function(block) {
    return 'return;\n';
  };

  JavaScript['disc_prop_set'] = function(block) {
    var set_option = block.getFieldValue('set_option');
    var id = JavaScript.valueToCode(block, 'id', JavaScript.ORDER_ATOMIC);
    var property = block.getFieldValue('property');
    var to = JavaScript.valueToCode(block, 'to', JavaScript.ORDER_ATOMIC);

    const vectorProps = ['p', 'lv', 'sp', 'slv', 'swing.p'];

    var code = `game.state.discs[${id}].${property} `;

    if (vectorProps.includes(property)) {
      switch (set_option) {
        case 'set':
          code += `= ${to};`;
          break;
        case 'change':
          code += `= Vector.add(game.state.discs[${id}].${property}, ${to});`;
          break;
        case 'multiply':
          code += `= Vector.multiply(game.state.discs[${id}].${property}, ${to});`;
          break;
        case 'divide':
          code += `= Vector.divide(game.state.discs[${id}].${property}, ${to});`;
          break;
      }
    } else {
      switch (set_option) {
        case 'set':
          code += `= ${to};`;
          break;
        case 'change':
          code += `+= ${to};`;
          break;
        case 'multiply':
          code += `*= ${to};`;
          break;
        case 'divide':
          code += `/= ${to};`;
          break;
      }
    }

    code += '\n';

    return code;
  };

  JavaScript['disc_prop_get'] = function(block) {
    var id = JavaScript.valueToCode(block, 'id', JavaScript.ORDER_ATOMIC);
    var property = block.getFieldValue('property');

    var code = `game.state.discs[${id}].${property}`;

    return [code, JavaScript.ORDER_ATOMIC];
  };

  JavaScript['arrow_prop_set'] = function(block) {
    var set_option = block.getFieldValue('set_option');
    var id = JavaScript.valueToCode(block, 'id', JavaScript.ORDER_ATOMIC);
    var property = block.getFieldValue('property');
    var to = JavaScript.valueToCode(block, 'to', JavaScript.ORDER_ATOMIC);

    const vectorProps = ['p', 'lv'];

    var code = `game.state.projectiles[${id}].${property} `;

    if (vectorProps.includes(property)) {
      switch (set_option) {
        case 'set':
          code += `= ${to};`;
          break;
        case 'change':
          code += `= Vector.add(game.state.projectiles[${id}].${property}, ${to});`;
          break;
        case 'multiply':
          code += `= Vector.multiply(game.state.projectiles[${id}].${property}, ${to});`;
          break;
        case 'divide':
          code += `= Vector.divide(game.state.projectiles[${id}].${property}, ${to});`;
          break;
      }
    } else {
      switch (set_option) {
        case 'set':
          code += `= ${to};`;
          break;
        case 'change':
          code += `+= ${to};`;
          break;
        case 'multiply':
          code += `*= ${to};`;
          break;
        case 'divide':
          code += `/= ${to};`;
          break;
      }
    }

    code += '\n';

    return code;
  };

  JavaScript['arrow_prop_get'] = function(block) {
    var id = JavaScript.valueToCode(block, 'id', JavaScript.ORDER_ATOMIC);
    var property = block.getFieldValue('property');

    var code = `game.state.projectiles[${id}].${property}`;

    return [code, JavaScript.ORDER_ATOMIC];
  };

  JavaScript['state_obj_exists'] = function(block) {
    var name = block.getFieldValue('obj_type');
    var obj_id = JavaScript.valueToCode(block, 'obj_id', JavaScript.ORDER_ATOMIC);

    var code = `${name}[${obj_id}]`;

    return [code, JavaScript.ORDER_ATOMIC];
  };

  JavaScript['player_kill'] = function(block) {
    var player_id = JavaScript.valueToCode(block, 'player_id', JavaScript.ORDER_ATOMIC);
    var allow_respawn = block.getFieldValue('allow_respawn');

    var code = `game.world.killDisc(${player_id}, ${allow_respawn});\n`;
    return code;
  };

  JavaScript['arrow_create'] = function(block) {
    var return_id = block.getFieldValue('return_id') === 'TRUE';
    var did = JavaScript.valueToCode(block, 'did', JavaScript.ORDER_ATOMIC);
    var pos = JavaScript.valueToCode(block, 'pos', JavaScript.ORDER_ATOMIC);
    var lvel = JavaScript.valueToCode(block, 'lvel', JavaScript.ORDER_ATOMIC);
    var ang = JavaScript.valueToCode(block, 'ang', JavaScript.ORDER_ATOMIC);
    var avel = JavaScript.valueToCode(block, 'avel', JavaScript.ORDER_ATOMIC);
    var fte = JavaScript.valueToCode(block, 'fte', JavaScript.ORDER_ATOMIC);

    var code = '...;\n';
    return code;
  };

  JavaScript['arrow_delete'] = function(block) {
    var arrow_id = JavaScript.valueToCode(block, 'arrow_id', JavaScript.ORDER_ATOMIC);

    var code = `game.state.projectiles[${arrow_id}] = null;\n`;
    return code;
  };

  JavaScript['arrow_player_delete'] = function(block) {
    var player_id = JavaScript.valueToCode(block, 'player_id', JavaScript.ORDER_ATOMIC);

    const funcName = JavaScript.provideFunction_('deleteAllPlayerArrows', [
      'function ' + JavaScript.FUNCTION_NAME_PLACEHOLDER_ + '(playerId) {',
      '  for (let i = 0; i < game.state.projectiles.length; i++) {',
      '    const arrow = game.state.projectiles[i];',
      '',
      '    if (!arrow) continue;',
      '    if (arrow.did !== playerId) continue;',
      '',
      '    game.state.projectiles[i] = null;',
      '  }',
      '}\n\n',
    ]);

    var code = `${funcName}(${player_id});\n`;
    return code;
  };

  JavaScript['arrow_get_player'] = function(block) {
    var player_id = JavaScript.valueToCode(block, 'player_id', JavaScript.ORDER_ATOMIC);

    const funcName = JavaScript.provideFunction_('getPlayerArrows', [
      'function ' + JavaScript.FUNCTION_NAME_PLACEHOLDER_ + '(playerId) {',
      '  const result = [];',
      '',
      '  for (let i = 0; i < game.state.projectiles.length; i++) {',
      '    const arrow = game.state.projectiles[i];',
      '',
      '    if (!arrow) continue;',
      '    if (arrow.did !== playerId) continue;',
      '',
      '    result.push(i);',
      '  }',
      '',
      '  return result;',
      '}\n\n',
    ]);

    var code = `${funcName}(${player_id})`;

    return [code];
  };

  JavaScript['arrow_get_player_last'] = function(block) {
    var player_id = JavaScript.valueToCode(block, 'player_id', JavaScript.ORDER_ATOMIC);

    const funcName = JavaScript.provideFunction_('getPlayerLastArrow', [
      'function ' + JavaScript.FUNCTION_NAME_PLACEHOLDER_ + '(playerId) {',
      '  let result = null;',
      '',
      '  for (let i = game.state.projectiles.length - 1; i >= 0; i--) {',
      '    const arrow = game.state.projectiles[i];',
      '',
      '    if (!arrow) continue;',
      '    if (arrow.did !== playerId) continue;',
      '',
      '    result = i;',
      '    break;',
      '  }',
      '',
      '  return result;',
      '}\n\n',
    ]);

    var code = `${funcName}(${player_id})`;

    return [code, JavaScript.ORDER_ATOMIC];
  };

  JavaScript['input_pressing'] = function(block) {
    var player_id = JavaScript.valueToCode(block, 'player_id', JavaScript.ORDER_ATOMIC);
    var key = block.getFieldValue('key');

    var code = `game.inputs[${player_id}].${key}`;

    return [code, JavaScript.ORDER_ATOMIC];
  };

  JavaScript['input_override'] = function(block) {
    var player_id = JavaScript.valueToCode(block, 'player_id', JavaScript.ORDER_ATOMIC);
    var key = block.getFieldValue('key');
    var override = JavaScript.valueToCode(block, 'override', JavaScript.ORDER_ATOMIC);

    var code = `game.inputs.overrides[${player_id}].${key} = ${override};\n`;
    return code;
  };

  JavaScript['input_override_stop'] = function(block) {
    var player_id = JavaScript.valueToCode(block, 'player_id', JavaScript.ORDER_ATOMIC);
    var key = block.getFieldValue('key');

    var code = `game.inputs.overrides[${player_id}].${key} = null;\n`;
    return code;
  };

  JavaScript['input_mouse_pos'] = function(block) {
    var player_id = JavaScript.valueToCode(block, 'player_id', JavaScript.ORDER_ATOMIC);

    var code = `game.inputs[${player_id}].mouse.pos`;

    return [code, JavaScript.ORDER_ATOMIC];
  };

  JavaScript['drawing_create'] = function(block) {
    var return_id = block.getFieldValue('return_id') === 'TRUE';
    var alpha = JavaScript.valueToCode(block, 'alpha', JavaScript.ORDER_ATOMIC);
    var pos = JavaScript.valueToCode(block, 'pos', JavaScript.ORDER_ATOMIC);
    var scale = JavaScript.valueToCode(block, 'scale', JavaScript.ORDER_ATOMIC);
    var angle = JavaScript.valueToCode(block, 'angle', JavaScript.ORDER_ATOMIC);
    var attach_to = block.getFieldValue('attach_to');
    var attach_id = JavaScript.valueToCode(block, 'attach_id', JavaScript.ORDER_ATOMIC);
    var is_behind = JavaScript.valueToCode(block, 'is_behind', JavaScript.ORDER_ATOMIC);
    var shapes = JavaScript.valueToCode(block, 'shapes', JavaScript.ORDER_ATOMIC);
    // TODO: Assemble JavaScript into code variable.
    var code = '...;\n';
    return code;
  };

  JavaScript['drawing_shape_rect'] = function(block) {
    var colour = JavaScript.valueToCode(block, 'colour', JavaScript.ORDER_ATOMIC);
    var alpha = JavaScript.valueToCode(block, 'alpha', JavaScript.ORDER_ATOMIC);
    var pos = JavaScript.valueToCode(block, 'pos', JavaScript.ORDER_ATOMIC);
    var size = JavaScript.valueToCode(block, 'size', JavaScript.ORDER_ATOMIC);
    var angle = JavaScript.valueToCode(block, 'angle', JavaScript.ORDER_ATOMIC);
    // TODO: Assemble JavaScript into code variable.
    var code = '...';
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, JavaScript.ORDER_NONE];
  };

  JavaScript['drawing_shape_ellipse'] = function(block) {
    var colour = JavaScript.valueToCode(block, 'colour', JavaScript.ORDER_ATOMIC);
    var alpha = JavaScript.valueToCode(block, 'alpha', JavaScript.ORDER_ATOMIC);
    var pos = JavaScript.valueToCode(block, 'pos', JavaScript.ORDER_ATOMIC);
    var size = JavaScript.valueToCode(block, 'size', JavaScript.ORDER_ATOMIC);
    var angle = JavaScript.valueToCode(block, 'angle', JavaScript.ORDER_ATOMIC);
    // TODO: Assemble JavaScript into code variable.
    var code = '...';
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, JavaScript.ORDER_NONE];
  };

  JavaScript['drawing_shape_polygon'] = function(block) {
    var colour = JavaScript.valueToCode(block, 'colour', JavaScript.ORDER_ATOMIC);
    var alpha = JavaScript.valueToCode(block, 'alpha', JavaScript.ORDER_ATOMIC);
    var pos = JavaScript.valueToCode(block, 'pos', JavaScript.ORDER_ATOMIC);
    var scale = JavaScript.valueToCode(block, 'scale', JavaScript.ORDER_ATOMIC);
    var angle = JavaScript.valueToCode(block, 'angle', JavaScript.ORDER_ATOMIC);
    var vertices = JavaScript.valueToCode(block, 'vertices', JavaScript.ORDER_ATOMIC);
    // TODO: Assemble JavaScript into code variable.
    var code = '...';
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, JavaScript.ORDER_NONE];
  };

  JavaScript['drawing_shape_line'] = function(block) {
    var colour = JavaScript.valueToCode(block, 'colour', JavaScript.ORDER_ATOMIC);
    var alpha = JavaScript.valueToCode(block, 'alpha', JavaScript.ORDER_ATOMIC);
    var pos = JavaScript.valueToCode(block, 'pos', JavaScript.ORDER_ATOMIC);
    var end = JavaScript.valueToCode(block, 'end', JavaScript.ORDER_ATOMIC);
    var width = JavaScript.valueToCode(block, 'width', JavaScript.ORDER_ATOMIC);
    // TODO: Assemble JavaScript into code variable.
    var code = '...';
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, JavaScript.ORDER_NONE];
  };

  JavaScript['drawing_shape_text'] = function(block) {
    var colour = JavaScript.valueToCode(block, 'colour', JavaScript.ORDER_ATOMIC);
    var alpha = JavaScript.valueToCode(block, 'alpha', JavaScript.ORDER_ATOMIC);
    var pos = JavaScript.valueToCode(block, 'pos', JavaScript.ORDER_ATOMIC);
    var angle = JavaScript.valueToCode(block, 'angle', JavaScript.ORDER_ATOMIC);
    var text = JavaScript.valueToCode(block, 'text', JavaScript.ORDER_ATOMIC);
    var size = JavaScript.valueToCode(block, 'size', JavaScript.ORDER_ATOMIC);
    var align = block.getFieldValue('align');
    var bold = block.getFieldValue('bold') === 'TRUE';
    var italic = block.getFieldValue('italic') === 'TRUE';
    var shadow = block.getFieldValue('shadow') === 'TRUE';
    // TODO: Assemble JavaScript into code variable.
    var code = '...';
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, JavaScript.ORDER_NONE];
  };

  JavaScript['drawing_shape_image'] = function(block) {
    var id = JavaScript.valueToCode(block, 'id', JavaScript.ORDER_ATOMIC);
    var region = JavaScript.valueToCode(block, 'region', JavaScript.ORDER_ATOMIC);
    var colour = JavaScript.valueToCode(block, 'colour', JavaScript.ORDER_ATOMIC);
    var alpha = JavaScript.valueToCode(block, 'alpha', JavaScript.ORDER_ATOMIC);
    var pos = JavaScript.valueToCode(block, 'pos', JavaScript.ORDER_ATOMIC);
    var size = JavaScript.valueToCode(block, 'size', JavaScript.ORDER_ATOMIC);
    var angle = JavaScript.valueToCode(block, 'angle', JavaScript.ORDER_ATOMIC);
    // TODO: Assemble JavaScript into code variable.
    var code = '...';
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, JavaScript.ORDER_NONE];
  };

  JavaScript['drawing_shape_image_region'] = function(block) {
    var pos = JavaScript.valueToCode(block, 'pos', JavaScript.ORDER_ATOMIC);
    var size = JavaScript.valueToCode(block, 'size', JavaScript.ORDER_ATOMIC);
    // TODO: Assemble JavaScript into code variable.
    var code = '...';
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, JavaScript.ORDER_NONE];
  };

  JavaScript['drawing_prop_set'] = function(block) {
    var set_option = block.getFieldValue('set_option');
    var id = JavaScript.valueToCode(block, 'id', JavaScript.ORDER_ATOMIC);
    var property = block.getFieldValue('property');
    var to = JavaScript.valueToCode(block, 'to', JavaScript.ORDER_ATOMIC);
    // TODO: Assemble JavaScript into code variable.
    var code = '...;\n';
    return code;
  };

  JavaScript['drawing_prop_get'] = function(block) {
    var id = JavaScript.valueToCode(block, 'id', JavaScript.ORDER_ATOMIC);
    var property = block.getFieldValue('property');
    // TODO: Assemble JavaScript into code variable.
    var code = '...';
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, JavaScript.ORDER_NONE];
  };

  JavaScript['drawing_shape_prop_set'] = function(block) {
    var set_option = block.getFieldValue('set_option');
    var id = JavaScript.valueToCode(block, 'id', JavaScript.ORDER_ATOMIC);
    var shape_id = JavaScript.valueToCode(block, 'shape_id', JavaScript.ORDER_ATOMIC);
    var property = block.getFieldValue('property');
    var to = JavaScript.valueToCode(block, 'to', JavaScript.ORDER_ATOMIC);
    // TODO: Assemble JavaScript into code variable.
    var code = '...;\n';
    return code;
  };

  JavaScript['drawing_shape_prop_get'] = function(block) {
    var id = JavaScript.valueToCode(block, 'id', JavaScript.ORDER_ATOMIC);
    var shape_id = JavaScript.valueToCode(block, 'shape_id', JavaScript.ORDER_ATOMIC);
    var property = block.getFieldValue('property');
    // TODO: Assemble JavaScript into code variable.
    var code = '...';
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, JavaScript.ORDER_NONE];
  };

  JavaScript['drawing_exists'] = function(block) {
    var id = JavaScript.valueToCode(block, 'id', JavaScript.ORDER_ATOMIC);
    // TODO: Assemble JavaScript into code variable.
    var code = '...';
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, JavaScript.ORDER_NONE];
  };

  JavaScript['drawing_shape_exists'] = function(block) {
    var id = JavaScript.valueToCode(block, 'id', JavaScript.ORDER_ATOMIC);
    var shape_id = JavaScript.valueToCode(block, 'shape_id', JavaScript.ORDER_ATOMIC);
    // TODO: Assemble JavaScript into code variable.
    var code = '...';
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, JavaScript.ORDER_NONE];
  };

  JavaScript['drawing_add_shape'] = function(block) {
    var shape = JavaScript.valueToCode(block, 'shape', JavaScript.ORDER_ATOMIC);
    var id = JavaScript.valueToCode(block, 'id', JavaScript.ORDER_ATOMIC);
    // TODO: Assemble JavaScript into code variable.
    var code = '...;\n';
    return code;
  };

  JavaScript['drawing_shape_amount'] = function(block) {
    var id = JavaScript.valueToCode(block, 'id', JavaScript.ORDER_ATOMIC);
    // TODO: Assemble JavaScript into code variable.
    var code = '...';
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, JavaScript.ORDER_NONE];
  };

  JavaScript['obj_no_lerp'] = function(block) {
    var obj_type = block.getFieldValue('obj_type');
    var obj_id = JavaScript.valueToCode(block, 'obj_id', JavaScript.ORDER_ATOMIC);
    // TODO: Assemble JavaScript into code variable.
    var code = '...;\n';
    return code;
  };

  JavaScript['drawing_shape_no_lerp'] = function(block) {
    var id = JavaScript.valueToCode(block, 'id', JavaScript.ORDER_ATOMIC);
    var shape_id = JavaScript.valueToCode(block, 'shape_id', JavaScript.ORDER_ATOMIC);
    // TODO: Assemble JavaScript into code variable.
    var code = '...;\n';
    return code;
  };

  JavaScript['vector_create'] = function(block) {
    var x = JavaScript.valueToCode(block, 'x', JavaScript.ORDER_ATOMIC);
    var y = JavaScript.valueToCode(block, 'y', JavaScript.ORDER_ATOMIC);

    var code = `[${x}, ${y}]`;

    return [code, JavaScript.ORDER_ATOMIC];
  };

  JavaScript['vector_arithmetic'] = function(block) {
    var a = JavaScript.valueToCode(block, 'a', JavaScript.ORDER_ATOMIC);
    var name = block.getFieldValue('NAME');
    var b = JavaScript.valueToCode(block, 'b', JavaScript.ORDER_ATOMIC);

    var code = `Vector.${name}(${a}, ${b})`;

    return [code, JavaScript.ORDER_ATOMIC];
  };

  JavaScript['vector_length'] = function(block) {
    var v = JavaScript.valueToCode(block, 'v', JavaScript.ORDER_ATOMIC);

    var code = `Vector.length(${v})`;

    return [code, JavaScript.ORDER_ATOMIC];
  };

  JavaScript['vector_normalized'] = function(block) {
    var v = JavaScript.valueToCode(block, 'v', JavaScript.ORDER_ATOMIC);

    var code = `Vector.normalized(${v})`;

    return [code, JavaScript.ORDER_ATOMIC];
  };

  JavaScript['vector_distance'] = function(block) {
    var a = JavaScript.valueToCode(block, 'a', JavaScript.ORDER_ATOMIC);
    var b = JavaScript.valueToCode(block, 'b', JavaScript.ORDER_ATOMIC);

    var code = `Vector.distance(${a}, ${b})`;

    return [code, JavaScript.ORDER_ATOMIC];
  };

  JavaScript['vector_dot'] = function(block) {
    var a = JavaScript.valueToCode(block, 'a', JavaScript.ORDER_ATOMIC);
    var b = JavaScript.valueToCode(block, 'b', JavaScript.ORDER_ATOMIC);

    var code = `Vector.dot(${a}, ${b})`;

    return [code, JavaScript.ORDER_ATOMIC];
  };

  JavaScript['vector_reflect'] = function(block) {
    var a = JavaScript.valueToCode(block, 'a', JavaScript.ORDER_ATOMIC);
    var b = JavaScript.valueToCode(block, 'b', JavaScript.ORDER_ATOMIC);

    var code = `Vector.reflect(${a}, ${b})`;

    return [code, JavaScript.ORDER_ATOMIC];
  };

  JavaScript['vector_rotate'] = function(block) {
    var a = JavaScript.valueToCode(block, 'a', JavaScript.ORDER_ATOMIC);
    var b = JavaScript.valueToCode(block, 'b', JavaScript.ORDER_ATOMIC);

    var code = `Vector.rotate2d(${a}, ${b})`;

    return [code, JavaScript.ORDER_ATOMIC];
  };

  JavaScript['vector_angle'] = function(block) {
    var v = JavaScript.valueToCode(block, 'v', JavaScript.ORDER_ATOMIC);

    var code = `Vector.getAngle2d(${v})`;

    return [code, JavaScript.ORDER_ATOMIC];
  };

  JavaScript['vector_get_axis'] = function(block) {
    var axis = block.getFieldValue('axis');
    var v = JavaScript.valueToCode(block, 'v', JavaScript.ORDER_ATOMIC);

    var code = `${v}${axis}`;

    return [code, JavaScript.ORDER_ATOMIC];
  };

  JavaScript['vector_lerp'] = function(block) {
    var a = JavaScript.valueToCode(block, 'a', JavaScript.ORDER_ATOMIC);
    var b = JavaScript.valueToCode(block, 'b', JavaScript.ORDER_ATOMIC);
    var t = JavaScript.valueToCode(block, 't', JavaScript.ORDER_ATOMIC);

    var code = `Vector.lerp(${a}, ${b}, ${t})`;

    return [code, JavaScript.ORDER_ATOMIC];
  };

  /* #region BLOCKLY MONKEYPATCHES */
  JavaScript['math_change'] = function(block) {
    // Add to a variable in place.
    const argument0 = JavaScript.valueToCode(block, 'DELTA',
        JavaScript.ORDER_ADDITION) || '0';
    const varName = JavaScript.nameDB_.getName(
        block.getFieldValue('VAR'), NameType.VARIABLE);
    return 'game.vars.' + varName + ' = (typeof ' + varName + ' === \'number\' ? ' + varName +
        ' : 0) + ' + argument0 + ';\n';
  };

  JavaScript['variables_get'] = function(block) {
    // Variable getter.
    const code = JavaScript.nameDB_.getName(block.getFieldValue('VAR'),
        NameType.VARIABLE);
    return ['game.vars.' + code, JavaScript.ORDER_ATOMIC];
  };

  JavaScript['variables_set'] = function(block) {
    // Variable setter.
    const argument0 = JavaScript.valueToCode(
        block, 'VALUE', JavaScript.ORDER_ASSIGNMENT) || '0';
    const varName = JavaScript.nameDB_.getName(
        block.getFieldValue('VAR'), NameType.VARIABLE);
    return 'game.vars.' + varName + ' = ' + argument0 + ';\n';
  };

  JavaScript['logic_compare'] = function(block) {
    // Comparison operator.
    const OPERATORS =
        {'EQ': '===', 'NEQ': '!==', 'LT': '<', 'LTE': '<=', 'GT': '>', 'GTE': '>='};
    const operator = OPERATORS[block.getFieldValue('OP')];
    const order = (operator === '===' || operator === '!==') ?
    JavaScript.ORDER_EQUALITY :
    JavaScript.ORDER_RELATIONAL;
    const argument0 = JavaScript.valueToCode(block, 'A', order) || '0';
    const argument1 = JavaScript.valueToCode(block, 'B', order) || '0';
    const code = argument0 + ' ' + operator + ' ' + argument1;
    return [code, order];
  };

  const forceString = function(value) {
    if (strRegExp.test(value)) {
      return [value, JavaScript.ORDER_ATOMIC];
    }
    return ['String(' + value + ')', JavaScript.ORDER_FUNCTION_CALL];
  };

  JavaScript['text_print'] = function(block) {
    // Print statement.
    const msg = JavaScript.valueToCode(block, 'TEXT',
        JavaScript.ORDER_NONE) || '\'\'';
    return 'game.graphics.debugLog(' + msg + ');\n';
  };


  JavaScript['text_append'] = function(block) {
    // Append to a variable in place.
    const varName = JavaScript.nameDB_.getName(
        block.getFieldValue('VAR'), NameType.VARIABLE);
    const value = JavaScript.valueToCode(block, 'TEXT',
        JavaScript.ORDER_NONE) || '\'\'';
    const code = 'game.vars.' + varName + ' += ' +
        forceString(value)[0] + ';\n';
    return code;
  };

  JavaScript['controls_for'] = function(block) {
    // For loop.
    const variable0 =
        'game.vars.' + JavaScript.nameDB_.getName(block.getFieldValue('VAR'), NameType.VARIABLE);
    const variable0Name =
        JavaScript.nameDB_.getName(block.getFieldValue('VAR'), NameType.VARIABLE);
    const argument0 =
        JavaScript.valueToCode(block, 'FROM', JavaScript.ORDER_ASSIGNMENT) || '0';
    const argument1 =
        JavaScript.valueToCode(block, 'TO', JavaScript.ORDER_ASSIGNMENT) || '0';
    const increment =
        JavaScript.valueToCode(block, 'BY', JavaScript.ORDER_ASSIGNMENT) || '1';
    let branch = JavaScript.statementToCode(block, 'DO');
    branch = JavaScript.addLoopTrap(branch, block);
    let code;
    if (utils.string.isNumber(argument0) && utils.string.isNumber(argument1) &&
        utils.string.isNumber(increment)) {
      // All arguments are simple numbers.
      const up = Number(argument0) <= Number(argument1);
      code = 'for (' + variable0 + ' = ' + argument0 + '; ' + variable0 +
          (up ? ' <= ' : ' >= ') + argument1 + '; ' + variable0;
      const step = Math.abs(Number(increment));
      if (step === 1) {
        code += up ? '++' : '--';
      } else {
        code += (up ? ' += ' : ' -= ') + step;
      }
      code += ') {\n' + branch + '}\n';
    } else {
      code = '';
      // Cache non-trivial values to variables to prevent repeated look-ups.
      let startVar = argument0;
      if (!argument0.match(/^\w+$/) && !utils.string.isNumber(argument0)) {
        startVar = JavaScript.nameDB_.getDistinctName(
            variable0Name + '_start', NameType.VARIABLE);
        code += 'var ' + startVar + ' = ' + argument0 + ';\n';
      }
      let endVar = argument1;
      if (!argument1.match(/^\w+$/) && !utils.string.isNumber(argument1)) {
        endVar = JavaScript.nameDB_.getDistinctName(
            variable0Name + '_end', NameType.VARIABLE);
        code += 'var ' + endVar + ' = ' + argument1 + ';\n';
      }
      // Determine loop direction at start, in case one of the bounds
      // changes during loop execution.
      const incVar = JavaScript.nameDB_.getDistinctName(
          variable0Name + '_inc', NameType.VARIABLE);
      code += 'var ' + incVar + ' = ';
      if (utils.string.isNumber(increment)) {
        code += Math.abs(increment) + ';\n';
      } else {
        code += 'Math.abs(' + increment + ');\n';
      }
      code += 'if (' + startVar + ' > ' + endVar + ') {\n';
      code += JavaScript.INDENT + incVar + ' = -' + incVar + ';\n';
      code += '}\n';
      code += 'for (' + variable0 + ' = ' + startVar + '; ' + incVar +
          ' >= 0 ? ' + variable0 + ' <= ' + endVar + ' : ' + variable0 +
          ' >= ' + endVar + '; ' + variable0 + ' += ' + incVar + ') {\n' +
          branch + '}\n';
    }
    return code;
  };

  JavaScript['controls_forEach'] = function(block) {
    // For each loop.
    const variable0 =
        'game.vars.' + JavaScript.nameDB_.getName(block.getFieldValue('VAR'), NameType.VARIABLE);
    const variable0Name =
        JavaScript.nameDB_.getName(block.getFieldValue('VAR'), NameType.VARIABLE);
    const argument0 =
        JavaScript.valueToCode(block, 'LIST', JavaScript.ORDER_ASSIGNMENT) ||
        '[]';
    let branch = JavaScript.statementToCode(block, 'DO');
    branch = JavaScript.addLoopTrap(branch, block);
    let code = '';
    // Cache non-trivial values to variables to prevent repeated look-ups.
    let listVar = argument0;
    if (!argument0.match(/^\w+$/)) {
      listVar = JavaScript.nameDB_.getDistinctName(
          variable0Name + '_list', NameType.VARIABLE);
      code += 'var ' + listVar + ' = ' + argument0 + ';\n';
    }
    const indexVar = JavaScript.nameDB_.getDistinctName(
        variable0Name + '_index', NameType.VARIABLE);
    branch = JavaScript.INDENT + variable0 + ' = ' + listVar + '[' + indexVar +
        '];\n' + branch;
    code += 'for (var ' + indexVar + ' in ' + listVar + ') {\n' + branch + '}\n';
    return code;
  };
  /* #endregion BLOCKLY MONKEYPATCHES */
}
