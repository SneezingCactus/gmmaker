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

  /**
   * Add extra indent to a piece of code
   * @param {String} code
   * @return {String}
   */
  function addIndent(code) {
    return code.replace(/\n/g, '\n  ');
  }

  /**
   * Helper function used by setter blocks (set disc prop, set arrow prop, etc.)
   * @param {String} object Object path
   * @param {String} property Property name
   * @param {String} setOption Set option
   * @param {String} to Value to set property to
   * @param {String[]} vectorProps Array of properties that are vectors
   * @return {String}
   */
  function makeSetterCode(object, property, setOption, to, vectorProps) {
    var code = `${object}${property === '' ? '' : '.'}${property}`;

    if (vectorProps.includes(property)) {
      if (to.startsWith('[0,')) {
        const slicedVec = to.slice(4, -1);
        switch (setOption) {
          case 'set':
            code += ` = ${to};`;
            break;
          case 'change':
            code += `[1] += ${slicedVec};`;
            break;
          case 'multiply':
            code += `[1] *= ${slicedVec};`;
            break;
          case 'divide':
            code += `[1] /= ${slicedVec};`;
            break;
        }
      } else if (to.endsWith(', 0]')) {
        const slicedVec = to.slice(1, -4);
        switch (setOption) {
          case 'set':
            code += ` = ${to};`;
            break;
          case 'change':
            code += `[0] += ${slicedVec};`;
            break;
          case 'multiply':
            code += `[0] *= ${slicedVec};`;
            break;
          case 'divide':
            code += `[0] /= ${slicedVec};`;
            break;
        }
      } else {
        switch (setOption) {
          case 'set':
            code += ` = ${to};`;
            break;
          case 'change':
            code += ` = Vector.add(${object}.${property}, ${to});`;
            break;
          case 'multiply':
            code += ` = Vector.multiply(${object}.${property}, ${to});`;
            break;
          case 'divide':
            code += ` = Vector.divide(${object}.${property}, ${to});`;
            break;
        }
      }
    } else {
      switch (setOption) {
        case 'set':
          code += ` = ${to};`;
          break;
        case 'change':
          code += ` += ${to};`;
          break;
        case 'multiply':
          code += ` *= ${to};`;
          break;
        case 'divide':
          code += ` /= ${to};`;
          break;
      }
    }

    code += '\n';

    return code;
  }

  const gameVarShort = '  const $ = game.vars; // just a shorthand for the vars object, to make the code a bit cleaner\n\n';

  JavaScript['event_roundstart'] = function(block) {
    var perplayer = block.getFieldValue('perplayer') === 'TRUE';
    var player_id = block.getFieldValue('player_id');
    var insideCode = JavaScript.statementToCode(block, 'code');

    var code = `game.events.addEventListener('roundStart', {perPlayer: ${perplayer}}, function(${perplayer ? player_id : ''}) {\n`;

    if (insideCode.includes('$')) {
      code += gameVarShort;
    }

    code += `${insideCode}});\n\n`;

    return code;
  };

  JavaScript['event_step'] = function(block) {
    var perplayer = block.getFieldValue('perplayer') === 'TRUE';
    var player_id = block.getFieldValue('player_id');
    var insideCode = JavaScript.statementToCode(block, 'code');

    var code = `game.events.addEventListener('step', {perPlayer: ${perplayer}}, function(${perplayer ? player_id : ''}) {\n`;

    if (insideCode.includes('$')) {
      code += gameVarShort;
    }

    code += `${insideCode}});\n\n`;

    return code;
  };

  JavaScript['event_collision'] = function(block) {
    var col_a = block.getFieldValue('col_a');
    var col_b = block.getFieldValue('col_b');
    var a_discid = block.getFieldValue('a_discid');
    var a_arrowid = block.getFieldValue('a_arrowid');
    var a_platformid = block.getFieldValue('a_platformid');
    var a_fixtureid = block.getFieldValue('a_fixtureid');
    var a_normal = block.getFieldValue('a_normal');
    var a_capzone = block.getFieldValue('a_capzone');
    var b_discid = block.getFieldValue('b_discid');
    var b_arrowid = block.getFieldValue('b_arrowid');
    var b_platformid = block.getFieldValue('b_platformid');
    var b_fixtureid = block.getFieldValue('b_fixtureid');
    var b_normal = block.getFieldValue('b_normal');
    var b_capzone = block.getFieldValue('b_capzone');
    var insideCode = JavaScript.statementToCode(block, 'code');

    var code = `game.events.addEventListener('${col_a}Collision', {collideWith: '${col_b}'}, function(`;

    switch (col_a) {
      case 'disc':
        code += a_discid + ', ';
        break;
      case 'arrow':
        code += a_arrowid + ', ';
        break;
      case 'platform':
        code += 'hitA_platData, ';
        break;
    }
    switch (col_b) {
      case 'disc':
        code += b_discid + ') {\n';
        break;
      case 'arrow':
        code += b_arrowid + ') {\n';
        break;
      case 'platform':
        code += 'hitB_platData) {\n';
        break;
    }

    if (insideCode.includes('$')) {
      code += gameVarShort;
    }

    if (col_a === 'platform') {
      code += `  var ${a_platformid} = hitA_platData.id,\n`;
      code += `      ${a_fixtureid} = hitA_platData.shapeIndex,\n`;
      code += `      ${a_normal} = hitA_platData.normal,\n`;
      code += `      ${a_capzone} = hitA_platData.isCapzone;\n\n`;
    }
    if (col_b === 'platform') {
      code += `  var ${b_platformid} = hitB_platData.id,\n`;
      code += `      ${b_fixtureid} = hitB_platData.shapeIndex,\n`;
      code += `      ${b_normal} = hitB_platData.normal,\n`;
      code += `      ${b_capzone} = hitB_platData.isCapzone;\n\n`;
    }

    code += `${insideCode}});\n\n`;

    return code;
  };

  JavaScript['event_playerdie'] = function(block) {
    var player_id = block.getFieldValue('player_id');
    var insideCode = JavaScript.statementToCode(block, 'code');

    var code = `game.events.addEventListener('playerDie', null, function(${player_id}) {\n`;

    if (insideCode.includes('$')) {
      code += gameVarShort;
    }

    code += `${insideCode}});\n\n`;

    return code;
  };

  JavaScript['if_return_event'] = function(block) {
    const bool = JavaScript.valueToCode(block, 'bool', JavaScript.ORDER_NONE);

    return `if (${bool}) return;\n`;
  };

  JavaScript['return_event'] = function() {
    return 'return;\n';
  };

  JavaScript['disc_prop_set'] = function(block) {
    var set_option = block.getFieldValue('set_option');
    var id = JavaScript.valueToCode(block, 'id', JavaScript.ORDER_ATOMIC);
    var property = block.getFieldValue('property');
    var to = JavaScript.valueToCode(block, 'to', JavaScript.ORDER_ATOMIC);

    const vectorProps = ['p', 'lv', 'sp', 'slv', 'swing.p'];

    return makeSetterCode(`game.state.discs[${id}]`, property, set_option, to, vectorProps);
  };

  JavaScript['disc_prop_get'] = function(block) {
    var id = JavaScript.valueToCode(block, 'id', JavaScript.ORDER_ATOMIC);
    var property = block.getFieldValue('property');

    var code = `game.state.discs[${id}].${property}`;

    return [code, JavaScript.ORDER_MEMBER];
  };

  JavaScript['arrow_prop_set'] = function(block) {
    var set_option = block.getFieldValue('set_option');
    var id = JavaScript.valueToCode(block, 'id', JavaScript.ORDER_ATOMIC);
    var property = block.getFieldValue('property');
    var to = JavaScript.valueToCode(block, 'to', JavaScript.ORDER_ATOMIC);

    const vectorProps = ['p', 'lv'];

    return makeSetterCode(`game.state.projectiles[${id}]`, property, set_option, to, vectorProps);
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

    return [code, JavaScript.ORDER_MEMBER];
  };

  JavaScript['disc_radius_get'] = function(block) {
    var id = JavaScript.valueToCode(block, 'id', JavaScript.ORDER_ATOMIC);

    return [`game.world.getDiscRadius(${id})`, JavaScript.ORDER_FUNCTION_CALL];
  };

  JavaScript['disc_kill'] = function(block) {
    var player_id = JavaScript.valueToCode(block, 'player_id', JavaScript.ORDER_ATOMIC);
    var allow_respawn = block.getFieldValue('allow_respawn');

    var code = `game.world.killDisc(${player_id}, ${allow_respawn});\n`;
    return code;
  };

  JavaScript['state_alive_discs'] = function(block) {
    return [`game.world.aliveDiscs`, JavaScript.ORDER_MEMBER];
  };

  JavaScript['arrow_create'] = function(block) {
    var return_id = block.getFieldValue('return_id') === 'TRUE';
    var did = JavaScript.valueToCode(block, 'did', JavaScript.ORDER_ATOMIC);
    var pos = JavaScript.valueToCode(block, 'pos', JavaScript.ORDER_ATOMIC);
    var lvel = JavaScript.valueToCode(block, 'lvel', JavaScript.ORDER_ATOMIC);
    var ang = JavaScript.valueToCode(block, 'ang', JavaScript.ORDER_ATOMIC);
    var fte = JavaScript.valueToCode(block, 'fte', JavaScript.ORDER_ATOMIC);

    var code = [
      'game.world.createArrow({',
      `  did: ${did},`,
      `  p: ${pos},`,
      `  lv: ${lvel},`,
      `  a: ${ang},`,
      `  fte: ${fte}`,
      `})`,
    ];

    if (return_id) {
      return [code.join('\n'), JavaScript.ORDER_FUNCTION_CALL];
    } else {
      return code.join('\n') + ';\n';
    }
  };

  JavaScript['arrow_delete'] = function(block) {
    var arrow_id = JavaScript.valueToCode(block, 'arrow_id', JavaScript.ORDER_ATOMIC);

    var code = `delete game.state.projectiles[${arrow_id}];\n`;
    return code;
  };

  JavaScript['arrow_player_delete'] = function(block) {
    var player_id = JavaScript.valueToCode(block, 'player_id', JavaScript.ORDER_ATOMIC);

    const funcName = JavaScript.provideFunction_('deleteAllPlayerArrows', [
      '/**',
      ' * Delete all arrows owned by a specific player.',
      ' *',
      ' * @param {number} playerId - ID of the player whose arrows will be deleted',
      ' */',
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
      '/**',
      ' * Get an array contiaining the IDs of all arrows owned by a specific player.',
      ' *',
      ' * @param {number} playerId - ID of the player',
      ' * @return {number[]} The ID list obtained',
      ' */',
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

    return [code, JavaScript.ORDER_ATOMIC];
  };

  JavaScript['arrow_get_player_last'] = function(block) {
    var player_id = JavaScript.valueToCode(block, 'player_id', JavaScript.ORDER_ATOMIC);

    const funcName = JavaScript.provideFunction_('getPlayerLastArrow', [
      '/**',
      ' * Get the ID of the last arrow shot by a specific player.',
      ' *',
      ' * @param {number} playerId - ID of the player',
      ' * @return {number} The ID of the arrow',
      ' */',
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

  JavaScript['state_misc_set'] = function(block) {
    var property = block.getFieldValue('property');
    var to = block.getFieldValue('to');

    var code = `${property} = ${to};\n`;
    return code;
  };

  JavaScript['state_trigger_player_win'] = function(block) {
    var id = JavaScript.valueToCode(block, 'id', JavaScript.ORDER_ATOMIC);
    return 'game.world.triggerWin(' + id + ');\n';
  };

  JavaScript['state_trigger_team_win'] = function(block) {
    var team = block.getFieldValue('team');
    return 'game.world.triggerWin(' + team + ');\n';
  };

  JavaScript['state_trigger_draw_win'] = function(block) {
    return 'game.world.triggerWin(-1);\n';
  };

  JavaScript['state_end_round'] = function(block) {
    return 'game.world.endRound();\n';
  };

  JavaScript['state_skip_start'] = function(block) {
    return 'game.state.ftu = -1;\n';
  };

  JavaScript['state_player_score_set'] = function(block) {
    var set_option = block.getFieldValue('set_option');
    var id = JavaScript.valueToCode(block, 'id', JavaScript.ORDER_ATOMIC);
    var to = JavaScript.valueToCode(block, 'to', JavaScript.ORDER_ATOMIC);

    return makeSetterCode(`game.state.scores[${id}]`, '', set_option, to, []);
  };

  JavaScript['state_team_score_set'] = function(block) {
    var set_option = block.getFieldValue('set_option');
    var team = block.getFieldValue('team');
    var to = JavaScript.valueToCode(block, 'to', JavaScript.ORDER_ATOMIC);

    return makeSetterCode(`game.state.scores[${team}]`, '', set_option, to, []);
  };

  JavaScript['state_player_score_get'] = function(block) {
    var id = JavaScript.valueToCode(block, 'id', JavaScript.ORDER_ATOMIC);

    return [`game.state.scores[${id}]`, JavaScript.ORDER_MEMBER];
  };

  JavaScript['state_team_score_get'] = function(block) {
    var team = block.getFieldValue('team');

    return [`game.state.scores[${team}]`, JavaScript.ORDER_MEMBER];
  };

  JavaScript['state_round_starting_ending'] = function(block) {
    var property = block.getFieldValue('property');
    return ['game.state.' + property + ' > -1', JavaScript.ORDER_RELATIONAL];
  };

  JavaScript['state_misc_get'] = function(block) {
    var property = block.getFieldValue('property');
    return [`game.state.${property}`, JavaScript.ORDER_MEMBER];
  };

  JavaScript['state_map_prop_get'] = function(block) {
    var property = block.getFieldValue('property');
    return [`game.state.mm.${property}`, JavaScript.ORDER_MEMBER];
  };

  JavaScript['state_misc_raycast'] = function(block) {
    var from = JavaScript.valueToCode(block, 'from', JavaScript.ORDER_ATOMIC);
    var to = JavaScript.valueToCode(block, 'to', JavaScript.ORDER_ATOMIC);
    var hit_detected = JavaScript.nameDB_.getName(block.getFieldValue('hit_detected'), NameType.VARIABLE);
    var hit_type = JavaScript.nameDB_.getName(block.getFieldValue('hit_type'), NameType.VARIABLE);
    var hit_id = JavaScript.nameDB_.getName(block.getFieldValue('hit_id'), NameType.VARIABLE);
    var hit_point = JavaScript.nameDB_.getName(block.getFieldValue('hit_point'), NameType.VARIABLE);
    var hit_normal = JavaScript.nameDB_.getName(block.getFieldValue('hit_normal'), NameType.VARIABLE);
    var hit_shapeindex = JavaScript.nameDB_.getName(block.getFieldValue('hit_shapeindex'), NameType.VARIABLE);
    var hit_iscapzone = JavaScript.nameDB_.getName(block.getFieldValue('hit_iscapzone'), NameType.VARIABLE);
    var filter = JavaScript.valueToCode(block, 'filter', JavaScript.ORDER_ATOMIC);

    var code = [
      `$.${hit_detected} = Boolean(game.world.rayCast(${from}, ${to}, function(hit) {`,
      `  $.${hit_type} = hit.type;`,
      `  $.${hit_id} = hit.id;`,
      `  $.${hit_point} = hit.point;`,
      `  $.${hit_normal} = hit.normal;`,
      `  if (hit.type == 'platform') {`,
      `    $.${hit_shapeindex} = hit.shapeIndex;`,
      `    $.${hit_iscapzone} = hit.isCapzone;`,
      `  }`,
      ``,
      `  return ${filter};`,
      `}));\n\n`,
    ];

    return code.join('\n');
  };

  JavaScript['platform_create'] = function(block) {
    var return_id = block.getFieldValue('return_id') === 'TRUE';
    var type = block.getFieldValue('type');
    var pos = JavaScript.valueToCode(block, 'pos', JavaScript.ORDER_ATOMIC);
    var angle = JavaScript.valueToCode(block, 'angle', JavaScript.ORDER_ATOMIC);
    var bounce = JavaScript.valueToCode(block, 'bounce', JavaScript.ORDER_ATOMIC);
    var density = JavaScript.valueToCode(block, 'density', JavaScript.ORDER_ATOMIC);
    var friction = JavaScript.valueToCode(block, 'friction', JavaScript.ORDER_ATOMIC);
    var fricplayers = JavaScript.valueToCode(block, 'fricplayers', JavaScript.ORDER_ATOMIC);
    var colgroup = block.getFieldValue('colgroup');
    var colp = block.getFieldValue('colp') === 'TRUE';
    var cola = block.getFieldValue('cola') === 'TRUE';
    var colb = block.getFieldValue('colb') === 'TRUE';
    var colc = block.getFieldValue('colc') === 'TRUE';
    var cold = block.getFieldValue('cold') === 'TRUE';
    var shapes = JavaScript.valueToCode(block, 'shapes', JavaScript.ORDER_ATOMIC);

    var code = [
      'game.world.createPlatform(null, {',
      `  type: '${type}',`,
      `  p: ${pos},`,
      `  a: ${angle},`,
      `  re: ${bounce},`,
      `  de: ${density},`,
      `  fric: ${friction},`,
      `  fricp: ${fricplayers},`,
      `  f_c: ${colgroup},`,
      `  f_p: ${colp},`,
      `  f_1: ${cola},`,
      `  f_2: ${colb},`,
      `  f_3: ${colc},`,
      `  f_4: ${cold},`,
      `  shapes: ${addIndent(shapes)}`,
      `})`,
    ];

    if (return_id) {
      return [code.join('\n'), JavaScript.ORDER_FUNCTION_CALL];
    } else {
      return code.join('\n') + ';\n\n';
    }
  };

  JavaScript['plat_shape'] = function(block) {
    var geo = JavaScript.valueToCode(block, 'geo', JavaScript.ORDER_ATOMIC);
    var colour = JavaScript.valueToCode(block, 'colour', JavaScript.ORDER_ATOMIC);
    var nophys = JavaScript.valueToCode(block, 'nophys', JavaScript.ORDER_ATOMIC);
    var nograp = JavaScript.valueToCode(block, 'nograp', JavaScript.ORDER_ATOMIC);
    var ingrap = JavaScript.valueToCode(block, 'ingrap', JavaScript.ORDER_ATOMIC);
    var death = JavaScript.valueToCode(block, 'death', JavaScript.ORDER_ATOMIC);

    var code = [
      '{',
      `  geo: ${addIndent(geo)},`,
      `  f: ${colour},`,
      `  np: ${nophys},`,
      `  ng: ${nograp},`,
      `  ig: ${ingrap},`,
      `  d: ${death}`,
      `}`,
    ];

    return [code.join('\n'), JavaScript.ORDER_ATOMIC];
  };

  JavaScript['plat_shape_geo_rect'] = function(block) {
    var pos = JavaScript.valueToCode(block, 'pos', JavaScript.ORDER_ATOMIC);
    var size = JavaScript.valueToCode(block, 'size', JavaScript.ORDER_ATOMIC);
    var angle = JavaScript.valueToCode(block, 'angle', JavaScript.ORDER_ATOMIC);

    var code = [
      '{',
      '  type: \'bx\',',
      `  c: ${pos},`,
      `  s: ${size},`,
      `  a: ${angle}`,
      '}',
    ];

    return [code.join('\n'), JavaScript.ORDER_ATOMIC];
  };

  JavaScript['plat_shape_geo_circ'] = function(block) {
    var pos = JavaScript.valueToCode(block, 'pos', JavaScript.ORDER_ATOMIC);
    var radius = JavaScript.valueToCode(block, 'radius', JavaScript.ORDER_ATOMIC);

    var code = [
      '{',
      '  type: \'ci\',',
      `  c: ${pos},`,
      `  r: ${radius}`,
      '}',
    ];

    return [code.join('\n'), JavaScript.ORDER_ATOMIC];
  };

  JavaScript['plat_shape_geo_poly'] = function(block) {
    var vertices = JavaScript.valueToCode(block, 'vertices', JavaScript.ORDER_ATOMIC);

    var code = [
      '{',
      '  type: \'po\',',
      `  v: ${addIndent(vertices)},`,
      '}',
    ];

    return [code.join('\n'), JavaScript.ORDER_ATOMIC];
  };

  JavaScript['plat_prop_set'] = function(block) {
    var set_option = block.getFieldValue('set_option');
    var id = JavaScript.valueToCode(block, 'id', JavaScript.ORDER_ATOMIC);
    var property = block.getFieldValue('property');
    var to = JavaScript.valueToCode(block, 'to', JavaScript.ORDER_ATOMIC);

    const vectorProps = ['p', 'lv'];

    return makeSetterCode(`game.state.physics.platforms[${id}]`, property, set_option, to, vectorProps);
  };

  JavaScript['plat_prop_get'] = function(block) {
    var id = JavaScript.valueToCode(block, 'id', JavaScript.ORDER_ATOMIC);
    var property = block.getFieldValue('property');

    var code = `game.state.physics.platforms[${id}].${property}`;

    return [code, JavaScript.ORDER_MEMBER];
  };

  JavaScript['plat_shape_prop_set'] = function(block) {
    var set_option = block.getFieldValue('set_option');
    var id = JavaScript.valueToCode(block, 'id', JavaScript.ORDER_ATOMIC);
    var shape_id = JavaScript.valueToCode(block, 'shape_id', JavaScript.ORDER_ATOMIC);
    var property = block.getFieldValue('property');
    var to = JavaScript.valueToCode(block, 'to', JavaScript.ORDER_ATOMIC);

    const vectorProps = ['c', 's'];

    return makeSetterCode(`game.state.physics.platforms[${id}].shapes[${shape_id}]`, property, set_option, to, vectorProps);
  };

  JavaScript['plat_shape_prop_get'] = function(block) {
    var id = JavaScript.valueToCode(block, 'id', JavaScript.ORDER_ATOMIC);
    var shape_id = JavaScript.valueToCode(block, 'shape_id', JavaScript.ORDER_ATOMIC);
    var property = block.getFieldValue('property');

    var code = `game.state.physics.platforms[${id}].shapes[${shape_id}].${property}`;

    return [code, JavaScript.ORDER_MEMBER];
  };

  JavaScript['plat_shape_amount'] = function(block) {
    var id = JavaScript.valueToCode(block, 'id', JavaScript.ORDER_ATOMIC);
    return [`game.state.physics.platforms[${id}].shapes.length`, JavaScript.ORDER_MEMBER];
  };

  JavaScript['plat_shape_add'] = function(block) {
    var shape = JavaScript.valueToCode(block, 'shape', JavaScript.ORDER_ATOMIC);
    var id = JavaScript.valueToCode(block, 'id', JavaScript.ORDER_ATOMIC);

    var code = `game.world.addShapeToPlat(${id}, ${shape});\n`;
    return code;
  };

  JavaScript['plat_shape_remove'] = function(block) {
    var id = JavaScript.valueToCode(block, 'id', JavaScript.ORDER_ATOMIC);
    var shape = JavaScript.valueToCode(block, 'shape', JavaScript.ORDER_ATOMIC);

    var code = `game.world.removeShapeFromPlat(${id}, ${shape});\n`;
    return code;
  };

  JavaScript['get_plat_by_name'] = function(block) {
    var name = JavaScript.valueToCode(block, 'name', JavaScript.ORDER_ATOMIC);

    return [`game.world.getPlatIdByName(${name})`, JavaScript.ORDER_FUNCTION_CALL];
  };

  JavaScript['get_plat_id_list'] = function() {
    return [`game.state.physics.bro`, JavaScript.ORDER_MEMBER];
  };

  JavaScript['plat_clone'] = function(block) {
    var id = JavaScript.valueToCode(block, 'id', JavaScript.ORDER_ATOMIC);
    var return_id = block.getFieldValue('return_id') === 'TRUE';
    var clone_joints = block.getFieldValue('clone_joints') === 'TRUE';

    var code = `game.world.clonePlatform(${id}, ${clone_joints})`;

    if (return_id) {
      return [code, JavaScript.ORDER_FUNCTION_CALL];
    } else {
      return code + ';\n\n';
    }
  };

  JavaScript['plat_delete'] = function(block) {
    var id = JavaScript.valueToCode(block, 'id', JavaScript.ORDER_ATOMIC);
    return `game.world.deletePlatform(${id});\n`;
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

  JavaScript['input_disable_mouse_pos'] = function(block) {
    var to = block.getFieldValue('to');
    var player_id = JavaScript.valueToCode(block, 'player_id', JavaScript.ORDER_ATOMIC);

    return `game.inputs[${player_id}].allowPosSending = ${to};\n`;
  };

  JavaScript['graphics_map_size'] = function(block) {
    return ['game.state.physics.ppm', JavaScript.ORDER_MEMBER];
  };

  JavaScript['graphics_screen_size'] = function(block) {
    return ['game.graphics.getScreenSize()', JavaScript.ORDER_FUNCTION_CALL];
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

    var code = 'game.graphics.createDrawing({\n';

    code += '  alpha: ' + alpha + ',\n';
    code += '  pos: ' + pos + ',\n';
    code += '  scale: ' + scale + ',\n';
    code += '  angle: ' + angle + ',\n';
    code += '  attachTo: \'' + attach_to + '\',\n';
    if (attach_to == 'body' || attach_to == 'disc') {
      code += '  attachId: ' + attach_id + ',\n';
    }
    if (attach_to != 'screen' && is_behind !== '') {
      code += '  isBehind: ' + is_behind + ',\n';
    }
    code += '  shapes: ' + addIndent(shapes) + '\n})';

    if (return_id) {
      return [code, JavaScript.ORDER_FUNCTION_CALL];
    } else {
      code += ';\n';
      return code;
    }
  };

  JavaScript['drawing_shape_rect'] = function(block) {
    var colour = JavaScript.valueToCode(block, 'colour', JavaScript.ORDER_ATOMIC);
    var alpha = JavaScript.valueToCode(block, 'alpha', JavaScript.ORDER_ATOMIC);
    var pos = JavaScript.valueToCode(block, 'pos', JavaScript.ORDER_ATOMIC);
    var size = JavaScript.valueToCode(block, 'size', JavaScript.ORDER_ATOMIC);
    var angle = JavaScript.valueToCode(block, 'angle', JavaScript.ORDER_ATOMIC);

    var code = '{\n';
    code += '  type: \'bx\',\n';
    code += '  colour: ' + colour + ',\n';
    code += '  alpha: ' + alpha + ',\n';
    code += '  pos: ' + pos + ',\n';
    code += '  size: ' + size + ',\n';
    code += '  angle: ' + angle + '\n}';

    return [code, JavaScript.ORDER_NONE];
  };

  JavaScript['drawing_shape_ellipse'] = function(block) {
    var colour = JavaScript.valueToCode(block, 'colour', JavaScript.ORDER_ATOMIC);
    var alpha = JavaScript.valueToCode(block, 'alpha', JavaScript.ORDER_ATOMIC);
    var pos = JavaScript.valueToCode(block, 'pos', JavaScript.ORDER_ATOMIC);
    var size = JavaScript.valueToCode(block, 'size', JavaScript.ORDER_ATOMIC);
    var angle = JavaScript.valueToCode(block, 'angle', JavaScript.ORDER_ATOMIC);

    var code = '{\n';
    code += '  type: \'ci\',\n';
    code += '  colour: ' + colour + ',\n';
    code += '  alpha: ' + alpha + ',\n';
    code += '  pos: ' + pos + ',\n';
    code += '  size: ' + size + ',\n';
    code += '  angle: ' + angle + '\n}';

    return [code, JavaScript.ORDER_NONE];
  };

  JavaScript['drawing_shape_polygon'] = function(block) {
    var colour = JavaScript.valueToCode(block, 'colour', JavaScript.ORDER_ATOMIC);
    var alpha = JavaScript.valueToCode(block, 'alpha', JavaScript.ORDER_ATOMIC);
    var pos = JavaScript.valueToCode(block, 'pos', JavaScript.ORDER_ATOMIC);
    var scale = JavaScript.valueToCode(block, 'scale', JavaScript.ORDER_ATOMIC);
    var angle = JavaScript.valueToCode(block, 'angle', JavaScript.ORDER_ATOMIC);
    var vertices = JavaScript.valueToCode(block, 'vertices', JavaScript.ORDER_ATOMIC);

    var code = '{\n';
    code += '  type: \'po\',\n';
    code += '  colour: ' + colour + ',\n';
    code += '  alpha: ' + alpha + ',\n';
    code += '  pos: ' + pos + ',\n';
    code += '  scale: ' + scale + ',\n';
    code += '  angle: ' + angle + ',\n';
    code += '  vertices: ' + vertices + '\n}';

    return [code, JavaScript.ORDER_NONE];
  };

  JavaScript['drawing_shape_line'] = function(block) {
    var colour = JavaScript.valueToCode(block, 'colour', JavaScript.ORDER_ATOMIC);
    var alpha = JavaScript.valueToCode(block, 'alpha', JavaScript.ORDER_ATOMIC);
    var pos = JavaScript.valueToCode(block, 'pos', JavaScript.ORDER_ATOMIC);
    var end = JavaScript.valueToCode(block, 'end', JavaScript.ORDER_ATOMIC);
    var width = JavaScript.valueToCode(block, 'width', JavaScript.ORDER_ATOMIC);

    var code = '{\n';
    code += '  type: \'li\',\n';
    code += '  colour: ' + colour + ',\n';
    code += '  alpha: ' + alpha + ',\n';
    code += '  pos: ' + pos + ',\n';
    code += '  end: ' + end + ',\n';
    code += '  width: ' + width + '\n}';

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

    var code = '{\n';
    code += '  type: \'tx\',\n';
    code += '  colour: ' + colour + ',\n';
    code += '  alpha: ' + alpha + ',\n';
    code += '  pos: ' + pos + ',\n';
    code += '  angle: ' + angle + ',\n';
    code += '  text: ' + text + ',\n';
    code += '  size: ' + size + ',\n';
    code += '  align: \'' + align + '\',\n';
    code += '  bold: ' + bold + ',\n';
    code += '  italic: ' + italic + ',\n';
    code += '  shadow: ' + shadow + '\n}';

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

    var code = '{\n';
    code += '  type: \'im\',\n';
    code += '  id: ' + id + ',\n';
    code += '  colour: ' + colour + ',\n';
    code += '  alpha: ' + alpha + ',\n';
    code += '  pos: ' + pos + ',\n';
    code += '  size: ' + size + ',\n';
    code += '  angle: ' + angle + ',\n';
    code += '  region: ' + addIndent(region) + '\n}';

    return [code, JavaScript.ORDER_NONE];
  };

  JavaScript['drawing_shape_image_region'] = function(block) {
    var pos = JavaScript.valueToCode(block, 'pos', JavaScript.ORDER_ATOMIC);
    var size = JavaScript.valueToCode(block, 'size', JavaScript.ORDER_ATOMIC);

    var code = '{\n';
    code += '  pos: ' + pos + ',\n';
    code += '  size: ' + size + ',\n}';

    return [code, JavaScript.ORDER_NONE];
  };

  JavaScript['drawing_prop_set'] = function(block) {
    var set_option = block.getFieldValue('set_option');
    var id = JavaScript.valueToCode(block, 'id', JavaScript.ORDER_ATOMIC);
    var property = block.getFieldValue('property');
    var to = JavaScript.valueToCode(block, 'to', JavaScript.ORDER_ATOMIC);

    const vectorProps = ['pos', 'scale'];

    return makeSetterCode(`game.graphics.drawings[${id}]`, property, set_option, to, vectorProps);
  };

  JavaScript['drawing_prop_get'] = function(block) {
    var id = JavaScript.valueToCode(block, 'id', JavaScript.ORDER_ATOMIC);
    var property = block.getFieldValue('property');
    return [`game.graphics.drawings[${id}].${property}`, JavaScript.ORDER_MEMBER];
  };

  JavaScript['drawing_shape_prop_set'] = function(block) {
    var set_option = block.getFieldValue('set_option');
    var id = JavaScript.valueToCode(block, 'id', JavaScript.ORDER_ATOMIC);
    var shape_id = JavaScript.valueToCode(block, 'shape_id', JavaScript.ORDER_ATOMIC);
    var shape_type = block.getFieldValue('shape_type');
    var property = block.getFieldValue('property');
    var to = JavaScript.valueToCode(block, 'to', JavaScript.ORDER_ATOMIC);

    let vectorProps;

    switch (shape_type) {
      case 'bxci':
        vectorProps = ['pos', 'size'];
        break;
      case 'po':
        vectorProps = ['pos', 'scale'];
        break;
      case 'li':
        vectorProps = ['pos', 'end'];
        break;
      case 'tx':
        vectorProps = ['pos'];
        break;
      case 'im':
        vectorProps = ['pos', 'size', 'region.pos', 'region.size'];
        break;
    }

    return makeSetterCode(`game.graphics.drawings[${id}].shapes[${shape_id}]`, property, set_option, to, vectorProps);
  };

  JavaScript['drawing_shape_t_align_set'] = function(block) {
    var id = JavaScript.valueToCode(block, 'id', JavaScript.ORDER_ATOMIC);
    var shape_id = JavaScript.valueToCode(block, 'shape_id', JavaScript.ORDER_ATOMIC);
    var to = block.getFieldValue('to');

    return `game.graphics.drawings[${id}].shapes[${shape_id}].align = '${to}'`;
  };

  JavaScript['camera_prop_set'] = function(block) {
    var set_option = block.getFieldValue('set_option');
    var property = block.getFieldValue('property');
    var to = JavaScript.valueToCode(block, 'to', JavaScript.ORDER_ATOMIC);

    const vectorProps = ['pos', 'scale'];

    return makeSetterCode(`game.graphics.camera`, property, set_option, to, vectorProps);
  };

  JavaScript['camera_prop_get'] = function(block) {
    var property = block.getFieldValue('property');

    return ['game.graphics.camera.' + property, JavaScript.ORDER_MEMBER];
  };

  JavaScript['drawing_shape_prop_get'] = function(block) {
    var id = JavaScript.valueToCode(block, 'id', JavaScript.ORDER_ATOMIC);
    var shape_id = JavaScript.valueToCode(block, 'shape_id', JavaScript.ORDER_ATOMIC);
    var property = block.getFieldValue('property');
    return [`game.graphics.drawings[${id}].shapes[${shape_id}].${property}`, JavaScript.ORDER_MEMBER];
  };

  JavaScript['drawing_attach'] = function(block) {
    var id = JavaScript.valueToCode(block, 'id', JavaScript.ORDER_ATOMIC);
    var attach_to = block.getFieldValue('attach_to');

    switch (attach_to) {
      case 'screen':
        return `game.graphics.drawings[${id}].attachTo = 'screen';\n`;
      case 'world':
        var is_behind = JavaScript.valueToCode(block, 'is_behind', JavaScript.ORDER_ATOMIC);
        return `game.graphics.drawings[${id}].attachTo = 'world';\ngame.graphics.drawings[${id}].isBehind = ${is_behind};\n`;
      case 'disc':
      case 'platform':
        var attach_id = JavaScript.valueToCode(block, 'attach_id', JavaScript.ORDER_ATOMIC);
        var is_behind = JavaScript.valueToCode(block, 'is_behind', JavaScript.ORDER_ATOMIC);
        return `game.graphics.drawings[${id}].attachTo = "${attach_to}";\ngame.graphics.drawings[${id}].attachId = ${attach_id};\ngame.graphics.drawings[${id}].isBehind = ${is_behind};\n`;
    }

    return `// bro wtf`;
  };

  JavaScript['drawing_delete'] = function(block) {
    var id = JavaScript.valueToCode(block, 'id', JavaScript.ORDER_ATOMIC);

    return `delete game.graphics.drawings[${id}];`;
  };

  JavaScript['drawing_exists'] = function(block) {
    var id = JavaScript.valueToCode(block, 'id', JavaScript.ORDER_ATOMIC);

    return [`game.graphics.drawings[${id}]`, JavaScript.ORDER_MEMBER];
  };

  JavaScript['drawing_shape_exists'] = function(block) {
    var id = JavaScript.valueToCode(block, 'id', JavaScript.ORDER_ATOMIC);
    var shape_id = JavaScript.valueToCode(block, 'shape_id', JavaScript.ORDER_ATOMIC);

    return [`game.graphics.drawings[${id}]?.shapes[${shape_id}]`, JavaScript.ORDER_MEMBER];
  };

  JavaScript['drawing_shape_add'] = function(block) {
    var shape = JavaScript.valueToCode(block, 'shape', JavaScript.ORDER_ATOMIC);
    var id = JavaScript.valueToCode(block, 'id', JavaScript.ORDER_ATOMIC);

    return `game.graphics.addShapeToDrawing(${id}, ${shape});\n`;
  };

  JavaScript['drawing_shape_remove'] = function(block) {
    var shape_id = JavaScript.valueToCode(block, 'shape_id', JavaScript.ORDER_ATOMIC);
    var id = JavaScript.valueToCode(block, 'id', JavaScript.ORDER_ATOMIC);

    return `game.graphics.drawings[${id}].shapes.splice(${shape_id}, 1);\n`;
  };

  JavaScript['drawing_shape_amount'] = function(block) {
    var id = JavaScript.valueToCode(block, 'id', JavaScript.ORDER_ATOMIC);

    return [`game.graphics.drawings[${id}].shapes.length`, JavaScript.ORDER_MEMBER];
  };

  JavaScript['obj_no_lerp'] = function(block) {
    var obj_type = block.getFieldValue('obj_type');
    var obj_id = JavaScript.valueToCode(block, 'id', JavaScript.ORDER_ATOMIC);

    switch (obj_type) {
      case 'game.state.discs':
      case 'game.state.physics.platforms':
        return obj_type + '[' + obj_id + '].ni = true;\n';
      case 'game.graphics.drawings':
        return obj_type + '[' + obj_id + '].noLerp = true;\n';
      case 'game.graphics.camera':
        return obj_type + '.noLerp = true;\n';
    }

    return '// bro what the hell happened here\n';
  };

  JavaScript['drawing_shape_no_lerp'] = function(block) {
    var id = JavaScript.valueToCode(block, 'id', JavaScript.ORDER_ATOMIC);
    var shape_id = JavaScript.valueToCode(block, 'shape_id', JavaScript.ORDER_ATOMIC);

    var code = `game.graphics.drawings[${id}].shapes[${shape_id}].noLerp = true;\n`;
    return code;
  };

  JavaScript['camera_no_lerp'] = function(block) {
    return 'game.graphics.camera.noLerp = true;';
  };

  JavaScript['lobby_all_player_ids'] = function(block) {
    return ['game.lobby.allPlayerIds', JavaScript.ORDER_MEMBER];
  };

  JavaScript['lobby_host_id'] = function(block) {
    return ['game.lobby.hostId', JavaScript.ORDER_MEMBER];
  };

  JavaScript['lobby_client_id'] = function(block) {
    return ['game.lobby.clientId', JavaScript.ORDER_MEMBER];
  };

  JavaScript['lobby_playerinfo_get'] = function(block) {
    var id = JavaScript.valueToCode(block, 'id', JavaScript.ORDER_ATOMIC);
    var property = block.getFieldValue('property');

    return [`game.lobby.playerInfo[${id}].${property}`, JavaScript.ORDER_MEMBER];
  };

  JavaScript['lobby_rounds_to_win'] = function(block) {
    return ['game.lobby.settings.wl', JavaScript.ORDER_MEMBER];
  };

  JavaScript['lobby_teams_on'] = function(block) {
    return ['game.lobby.settings.tea', JavaScript.ORDER_MEMBER];
  };

  JavaScript['lobby_teams_locked'] = function(block) {
    return ['game.lobby.settings.tl', JavaScript.ORDER_MEMBER];
  };

  JavaScript['lobby_base_mode_is'] = function(block) {
    var mode = block.getFieldValue('mode');

    return ['game.lobby.settings.mo == \'' + mode + '\'', JavaScript.ORDER_EQUALITY];
  };

  JavaScript['audio_play_sound'] = function(block) {
    var name = block.getFieldValue('name');
    var custom_id = JavaScript.valueToCode(block, 'id', JavaScript.ORDER_ATOMIC);
    var volume = JavaScript.valueToCode(block, 'volume', JavaScript.ORDER_ATOMIC);
    var panning_type = block.getFieldValue('panning_type');
    var panning = JavaScript.valueToCode(block, 'panning', JavaScript.ORDER_ATOMIC);
    // TODO: Assemble JavaScript into code variable.
    return `game.audio.playSound${panning_type == 'worldPos' ? 'AtWorldPos' : ''}(${name == 'custom' ? custom_id : `'${name}'`}, ${volume}, ${panning});\n `;
  };

  JavaScript['audio_stop_all'] = function() {
    return 'game.audio.stopAllSounds();\n';
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

    var code = `Vector.normalize(${v})`;

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
    return '$.' + varName + ' += ' + argument0 + ';\n';
  };

  JavaScript['variables_get'] = function(block) {
    // Variable getter.
    const code = JavaScript.nameDB_.getName(block.getFieldValue('VAR'),
        NameType.VARIABLE);
    return ['$.' + code, JavaScript.ORDER_ATOMIC];
  };

  JavaScript['variables_set'] = function(block) {
    // Variable setter.
    const argument0 = JavaScript.valueToCode(
        block, 'VALUE', JavaScript.ORDER_ASSIGNMENT) || '0';
    const varName = JavaScript.nameDB_.getName(
        block.getFieldValue('VAR'), NameType.VARIABLE);
    return '$.' + varName + ' = ' + argument0 + ';\n';
  };

  JavaScript['create_variable_group'] = function(block) {
    // Variable group maker.
    const group = JavaScript.valueToCode(
        block, 'GROUP', JavaScript.ORDER_NONE);
    return '$[' + group + '] = {};';
  };

  JavaScript['grouped_variable_change'] = function(block) {
    // Add to a grouped variable in place.
    const argument0 = JavaScript.valueToCode(
        block, 'DELTA', JavaScript.ORDER_ASSIGNMENT) || '0';
    const group = JavaScript.valueToCode(
        block, 'GROUP', JavaScript.ORDER_NONE);
    const varName = JavaScript.nameDB_.getName(
        block.getFieldValue('VAR'), NameType.VARIABLE);
    return '$[' + group + '].' + varName + ' += ' + argument0 + ';\n';
  };

  JavaScript['grouped_variable_get'] = function(block) {
    // Grouped variable getter.
    const code = JavaScript.nameDB_.getName(block.getFieldValue('VAR'),
        NameType.VARIABLE);
    const group = JavaScript.valueToCode(
        block, 'GROUP', JavaScript.ORDER_NONE);
    return ['$[' + group + '].' + code, JavaScript.ORDER_ATOMIC];
  };

  JavaScript['grouped_variable_set'] = function(block) {
    // Grouped variable setter.
    const argument0 = JavaScript.valueToCode(
        block, 'TO', JavaScript.ORDER_ASSIGNMENT) || '0';
    const group = JavaScript.valueToCode(
        block, 'GROUP', JavaScript.ORDER_NONE);
    const varName = JavaScript.nameDB_.getName(
        block.getFieldValue('VAR'), NameType.VARIABLE);
    return '$[' + group + '].' + varName + ' = ' + argument0 + ';\n';
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
    if (/^\s*'([^']|\\')*'\s*$/.test(value)) {
      return [value, JavaScript.ORDER_ATOMIC];
    }
    return ['String(' + value + ')', JavaScript.ORDER_FUNCTION_CALL];
  };

  JavaScript['text_print'] = function(block) {
    // Print statement.
    const msg = JavaScript.valueToCode(block, 'TEXT',
        JavaScript.ORDER_NONE) || '\'\'';
    return 'game.debugLog(' + msg + ');\n';
  };


  JavaScript['text_append'] = function(block) {
    // Append to a variable in place.
    const varName = JavaScript.nameDB_.getName(
        block.getFieldValue('VAR'), NameType.VARIABLE);
    const value = JavaScript.valueToCode(block, 'TEXT',
        JavaScript.ORDER_NONE) || '\'\'';
    const code = '$.' + varName + ' += ' +
        forceString(value)[0] + ';\n';
    return code;
  };

  JavaScript['colour_picker'] = function(block) {
    // Colour picker.
    const code = '0x' + block.getFieldValue('COLOUR').slice(1);
    return [code, JavaScript.ORDER_ATOMIC];
  };

  JavaScript['colour_random'] = function(block) {
    // Generate a random colour.
    const functionName = JavaScript.provideFunction_('randomColour', `
function ${JavaScript.FUNCTION_NAME_PLACEHOLDER_}() {
  return Math.round(Math.random() * 0xFFFFFF);
}
`);
    const code = functionName + '()';
    return [code, JavaScript.ORDER_FUNCTION_CALL];
  };

  JavaScript['colour_rgb'] = function(block) {
    // Compose a colour from RGB components.
    const red = JavaScript.valueToCode(block, 'RED', JavaScript.ORDER_NONE) || 0;
    const green =
        JavaScript.valueToCode(block, 'GREEN', JavaScript.ORDER_NONE) || 0;
    const blue =
        JavaScript.valueToCode(block, 'BLUE', JavaScript.ORDER_NONE) || 0;

    const code = 'Colour.fromRGBValues([' + red + ', ' + green + ', ' + blue + '])';
    return [code, JavaScript.ORDER_FUNCTION_CALL];
  };

  JavaScript['colour_hsv'] = function(block) {
    // Compose a colour from HSV components.
    const hue = JavaScript.valueToCode(block, 'HUE', JavaScript.ORDER_NONE) || 0;
    const saturation =
        JavaScript.valueToCode(block, 'SATURATION', JavaScript.ORDER_NONE) || 0;
    const value =
        JavaScript.valueToCode(block, 'VALUE', JavaScript.ORDER_NONE) || 0;

    const code = 'Colour.fromHSVValues([' + hue + ', ' + saturation + ', ' + value + '])';
    return [code, JavaScript.ORDER_FUNCTION_CALL];
  };

  JavaScript['colour_blend'] = function(block) {
    // Blend two colours together.
    const c1 = JavaScript.valueToCode(block, 'COLOUR1', JavaScript.ORDER_NONE) ||
        '0x000000';
    const c2 = JavaScript.valueToCode(block, 'COLOUR2', JavaScript.ORDER_NONE) ||
        '0x000000';
    const ratio =
        JavaScript.valueToCode(block, 'RATIO', JavaScript.ORDER_NONE) || 0.5;
    const code = 'Colour.blend(' + c1 + ', ' + c2 + ', ' + ratio + ')';
    return [code, JavaScript.ORDER_FUNCTION_CALL];
  };

  JavaScript['controls_for'] = function(block) {
    // For loop.
    const variable0 = JavaScript.nameDB_.getName(
        block.getFieldValue('VAR'), 'VARIABLE');
    const argument0 = JavaScript.valueToCode(block, 'START',
        JavaScript.ORDER_ASSIGNMENT) || '0';
    const argument1 = JavaScript.valueToCode(block, 'END',
        JavaScript.ORDER_ASSIGNMENT) || '0';
    const increment = JavaScript.valueToCode(block, 'STEP',
        JavaScript.ORDER_ASSIGNMENT) || '1';
    let branch = JavaScript.statementToCode(block, 'DO');
    branch = JavaScript.addLoopTrap(branch, block);
    let code = '\n';
    if (utils.string.isNumber(argument0) && utils.string.isNumber(argument1) &&
        utils.string.isNumber(increment)) {
      // All arguments are simple numbers.
      const up = Number(argument0) <= Number(argument1);
      code = 'for (let ' + variable0 + ' = ' + argument0 + '; ' +
          variable0 + (up ? ' <= ' : ' >= ') + argument1 + '; ' +
          variable0;
      const step = Math.abs(Number(increment));
      if (step == 1) {
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
            variable0 + '_start', 'VARIABLE');
        code += 'let ' + startVar + ' = ' + argument0 + ';\n';
      }
      let endVar = argument1;
      if (!argument1.match(/^\w+$/) && !utils.string.isNumber(argument1)) {
        endVar = JavaScript.nameDB_.getDistinctName(
            variable0 + '_end', 'VARIABLE');
        code += 'let ' + endVar + ' = ' + argument1 + ';\n';
      }
      // Determine loop direction at start, in case one of the bounds
      // changes during loop execution.
      const incVar = JavaScript.nameDB_.getDistinctName(
          variable0 + '_inc', 'VARIABLE');
      code += 'let ' + incVar + ' = ';
      if (utils.string.isNumber(increment)) {
        code += Math.abs(increment) + ';\n';
      } else {
        code += 'Math.abs(' + increment + ');\n';
      }
      code += 'if (' + startVar + ' > ' + endVar + ') {\n';
      code += JavaScript.INDENT + incVar + ' = -' + incVar + ';\n';
      code += '}\n';
      code += 'for (let ' + variable0 + ' = ' + startVar + '; ' +
          incVar + ' >= 0 ? ' +
          variable0 + ' <= ' + endVar + ' : ' +
          variable0 + ' >= ' + endVar + '; ' +
          variable0 + ' += ' + incVar + ') {\n' +
          branch + '}\n';
    }
    return code;
  };

  JavaScript['procedures_defreturn'] = function(block) {
    // Define a procedure with a return value.
    const funcName = JavaScript.nameDB_.getName(
        block.getFieldValue('NAME'), NameType.PROCEDURE);
    let xfix1 = '';
    if (JavaScript.STATEMENT_PREFIX) {
      xfix1 += JavaScript.injectId(JavaScript.STATEMENT_PREFIX, block);
    }
    if (JavaScript.STATEMENT_SUFFIX) {
      xfix1 += JavaScript.injectId(JavaScript.STATEMENT_SUFFIX, block);
    }
    if (xfix1) {
      xfix1 = JavaScript.prefixLines(xfix1, JavaScript.INDENT);
    }
    let loopTrap = '';
    if (JavaScript.INFINITE_LOOP_TRAP) {
      loopTrap = JavaScript.prefixLines(
          JavaScript.injectId(JavaScript.INFINITE_LOOP_TRAP, block),
          JavaScript.INDENT);
    }
    const branch = JavaScript.statementToCode(block, 'STACK');
    let returnValue =
        JavaScript.valueToCode(block, 'RETURN', JavaScript.ORDER_NONE) || '';
    let xfix2 = '';
    if (branch && returnValue) {
      // After executing the function body, revisit this block for the return.
      xfix2 = xfix1;
    }
    if (returnValue) {
      returnValue = JavaScript.INDENT + 'return ' + returnValue + ';\n';
    }
    const args = [];
    const variables = block.getVars();
    for (let i = 0; i < variables.length; i++) {
      args[i] = JavaScript.nameDB_.getName(variables[i], NameType.VARIABLE);
    }
    let code = 'function ' + funcName + '(' + args.join(', ') + ') {\n' + (branch.includes('$') || returnValue.includes('$') ? gameVarShort : '') +
        xfix1 + loopTrap + branch + xfix2 + returnValue + '}';
    code = JavaScript.scrub_(block, code);

    // gmm identifier
    if (!gm.editor.generatingPrettyCode) {
      code = '"""' + block.id + '"""S' + code + '"""' + block.id + '"""E';
    }

    // Add % so as not to collide with helper functions in definitions list.
    JavaScript.definitions_['%' + funcName] = code;
    return null;
  };
  JavaScript['procedures_defnoreturn'] = JavaScript['procedures_defreturn'];

  JavaScript['local_declaration_statement'] = function() {
    let code = '{\n  let ';
    for (let i = 0; this.getFieldValue('VAR' + i); i++) {
      code += this.getFieldValue('VAR' + i);
      code += ' = ' + (JavaScript.valueToCode(this, 'DECL' + i, JavaScript.ORDER_NONE) || '0');
      code += ', ';
    }
    // Get rid of the last comma
    code = code.slice(0, -2);
    code += ';\n\n';
    code += JavaScript.statementToCode(this, 'STACK', JavaScript.ORDER_NONE);
    code += '}\n';

    // remove brackets when i can
    if (this.parentBlock_.type !== 'local_declaration_statement') {
      code = code.slice(1, -2) + '\n';
    }

    return code;
  };

  const unfailableBlocks = ['math_number', 'logic_boolean', 'text', 'colour_picker', 'vector_create'];

  const blockToCodeOLD = JavaScript.blockToCode;
  JavaScript.blockToCode = function(block) {
    let result = blockToCodeOLD.apply(this, arguments);

    if (block && result !== null && !gm.editor.generatingPrettyCode && !unfailableBlocks.includes(block.type)) {
      if (Array.isArray(result)) {
        result[0] = '"""' + block.id + '"""S' + result[0] + '"""' + block.id + '"""E';
      } else {
        result = '"""' + block.id + '"""S' + result + '"""' + block.id + '"""E';
      }
    }

    return result;
  };
  /* #endregion BLOCKLY MONKEYPATCHES */
}
