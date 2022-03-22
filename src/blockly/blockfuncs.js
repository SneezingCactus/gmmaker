/* eslint-disable no-var */
/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable new-cap */
import Blockly from 'blockly';

/**
* Sets up the blocks' functionality
*/
export default function() {
  Blockly.JavaScript['draw_line'] = function(block) {
    const x1 = Blockly.JavaScript.valueToCode(block, 'line_x1', Blockly.JavaScript.ORDER_ATOMIC);
    const y1 = Blockly.JavaScript.valueToCode(block, 'line_y1', Blockly.JavaScript.ORDER_ATOMIC);
    const x2 = Blockly.JavaScript.valueToCode(block, 'line_x2', Blockly.JavaScript.ORDER_ATOMIC);
    const y2 = Blockly.JavaScript.valueToCode(block, 'line_y2', Blockly.JavaScript.ORDER_ATOMIC);
    const width = Blockly.JavaScript.valueToCode(block, 'line_width', Blockly.JavaScript.ORDER_ATOMIC);
    const color = Blockly.JavaScript.valueToCode(block, 'line_color', Blockly.JavaScript.ORDER_ATOMIC);
    let alpha = Blockly.JavaScript.valueToCode(block, 'line_alpha', Blockly.JavaScript.ORDER_ATOMIC);
    if (alpha === '') alpha = '100';
    const anchored = block.getFieldValue('line_anchored') === 'TRUE';
    const onlyplayer = block.getFieldValue('line_onlyplayer') === 'TRUE';
    const nocameramove = block.getFieldValue('line_nocameramove') === 'TRUE';
    const code = `gm.blockly.funcs.createLine(playerid,${x1},${y1},${x2},${y2},${color},${alpha},${width},${anchored},${onlyplayer},${nocameramove});`;
    return code;
  };

  Blockly.JavaScript['draw_rect'] = function(block) {
    const x1 = Blockly.JavaScript.valueToCode(block, 'rect_x1', Blockly.JavaScript.ORDER_ATOMIC);
    const y1 = Blockly.JavaScript.valueToCode(block, 'rect_y1', Blockly.JavaScript.ORDER_ATOMIC);
    const x2 = Blockly.JavaScript.valueToCode(block, 'rect_x2', Blockly.JavaScript.ORDER_ATOMIC);
    const y2 = Blockly.JavaScript.valueToCode(block, 'rect_y2', Blockly.JavaScript.ORDER_ATOMIC);
    const angle = Blockly.JavaScript.valueToCode(block, 'rect_angle', Blockly.JavaScript.ORDER_ATOMIC) || '0';
    const color = Blockly.JavaScript.valueToCode(block, 'rect_color', Blockly.JavaScript.ORDER_ATOMIC);
    let alpha = Blockly.JavaScript.valueToCode(block, 'rect_alpha', Blockly.JavaScript.ORDER_ATOMIC);
    if (alpha === '') alpha = '100';
    const anchored = block.getFieldValue('rect_anchored') === 'TRUE';
    const onlyplayer = block.getFieldValue('rect_onlyplayer') === 'TRUE';
    const nocameramove = block.getFieldValue('rect_nocameramove') === 'TRUE';
    const code = `gm.blockly.funcs.createRect(playerid,${x1},${y1},${x2},${y2},${angle},${color},${alpha},${anchored},${onlyplayer},${nocameramove});`;
    return code;
  };

  Blockly.JavaScript['draw_circle'] = function(block) {
    const x = Blockly.JavaScript.valueToCode(block, 'circ_x', Blockly.JavaScript.ORDER_ATOMIC);
    const y = Blockly.JavaScript.valueToCode(block, 'circ_y', Blockly.JavaScript.ORDER_ATOMIC);
    const radius = Blockly.JavaScript.valueToCode(block, 'circ_radius', Blockly.JavaScript.ORDER_ATOMIC);
    const color = Blockly.JavaScript.valueToCode(block, 'circ_color', Blockly.JavaScript.ORDER_ATOMIC);
    let alpha = Blockly.JavaScript.valueToCode(block, 'circ_alpha', Blockly.JavaScript.ORDER_ATOMIC);
    if (alpha === '') alpha = '100';
    const anchored = block.getFieldValue('circ_anchored') === 'TRUE';
    const onlyplayer = block.getFieldValue('circ_onlyplayer') === 'TRUE';
    const nocameramove = block.getFieldValue('circ_nocameramove') === 'TRUE';
    const code = `gm.blockly.funcs.createCircle(playerid,${x},${y},${radius},${color},${alpha},${anchored},${onlyplayer},${nocameramove});`;
    return code;
  };

  Blockly.JavaScript['draw_poly'] = function(block) {
    const vertex = Blockly.JavaScript.valueToCode(block, 'poly_vertex', Blockly.JavaScript.ORDER_ATOMIC);
    const color = Blockly.JavaScript.valueToCode(block, 'poly_color', Blockly.JavaScript.ORDER_ATOMIC);
    let alpha = Blockly.JavaScript.valueToCode(block, 'poly_alpha', Blockly.JavaScript.ORDER_ATOMIC);
    if (alpha === '') alpha = '100';
    const anchored = block.getFieldValue('poly_anchored') === 'TRUE';
    const onlyplayer = block.getFieldValue('poly_onlyplayer') === 'TRUE';
    const nocameramove = block.getFieldValue('poly_nocameramove') === 'TRUE';

    const code = `gm.blockly.funcs.createPoly(playerid,${vertex},${color},${alpha},${anchored},${onlyplayer},${nocameramove});`;
    return code;
  };

  Blockly.JavaScript['draw_text'] = function(block) {
    var string = Blockly.JavaScript.valueToCode(block, 'text_string', Blockly.JavaScript.ORDER_ATOMIC);
    var x = Blockly.JavaScript.valueToCode(block, 'text_x', Blockly.JavaScript.ORDER_ATOMIC);
    var y = Blockly.JavaScript.valueToCode(block, 'text_y', Blockly.JavaScript.ORDER_ATOMIC);
    var size = Blockly.JavaScript.valueToCode(block, 'text_size', Blockly.JavaScript.ORDER_ATOMIC);
    var color = Blockly.JavaScript.valueToCode(block, 'text_color', Blockly.JavaScript.ORDER_ATOMIC);
    var alpha = Blockly.JavaScript.valueToCode(block, 'text_alpha', Blockly.JavaScript.ORDER_ATOMIC);
    if (alpha === '') alpha = '100';
    var centered = block.getFieldValue('text_centered') === 'TRUE';
    var anchored = block.getFieldValue('text_anchored') === 'TRUE';
    const onlyplayer = block.getFieldValue('text_onlyplayer') === 'TRUE';
    const nocameramove = block.getFieldValue('text_nocameramove') === 'TRUE';

    const code = `gm.blockly.funcs.createText(playerid,${x},${y},${color},${alpha},${string},${size},${centered},${anchored},${onlyplayer},${nocameramove});`;
    return code;
  };

  Blockly.JavaScript['draw_clear'] = function(block) {
    const code = `gm.blockly.funcs.clearGraphics(playerid);`;
    return code;
  };

  Blockly.JavaScript['get_player_color'] = function(block) {
    const player = block.getFieldValue('player');
    const player_id = Blockly.JavaScript.valueToCode(block, 'player_id', Blockly.JavaScript.ORDER_ATOMIC) || null;
    const code = `gm.blockly.funcs.getPlayerColor(gst, ${player === 'self' ? 'playerid' : player_id})`;

    return [code, Blockly.JavaScript.ORDER_NONE];
  };

  Blockly.JavaScript['set_player_prop'] = function(block) {
    const player = block.getFieldValue('player');
    const player_id = Blockly.JavaScript.valueToCode(block, 'player_id', Blockly.JavaScript.ORDER_ATOMIC) || null;
    const player_prop = block.getFieldValue('player_prop');
    const set_number = Blockly.JavaScript.valueToCode(block, 'set_number', Blockly.JavaScript.ORDER_ATOMIC);
    const code = `gst = gm.blockly.funcs.setPlayerProperty(gst, ${player === 'self' ? 'playerid' : player_id}, "${player_prop}", ${set_number}${player_prop == 'a' ? '*(Math.PI/180)' : ''});`;
    return code;
  };

  Blockly.JavaScript['change_player_prop'] = function(block) {
    const player = block.getFieldValue('player');
    const player_id = Blockly.JavaScript.valueToCode(block, 'player_id', Blockly.JavaScript.ORDER_ATOMIC) || null;
    const player_prop = block.getFieldValue('player_prop');
    const change_number = Blockly.JavaScript.valueToCode(block, 'change_number', Blockly.JavaScript.ORDER_ATOMIC);
    const code = `gst = gm.blockly.funcs.changePlayerProperty(gst, ${player === 'self' ? 'playerid' : player_id}, "${player_prop}", ${change_number}${player_prop == 'a' ? '*(Math.PI/180)' : ''});`;
    return code;
  };

  Blockly.JavaScript['set_last_arrow_prop'] = function(block) {
    const player = block.getFieldValue('player');
    const player_id = Blockly.JavaScript.valueToCode(block, 'player_id', Blockly.JavaScript.ORDER_ATOMIC) || null;
    const arrow = block.getFieldValue('arrow');
    const arrow_id = Blockly.JavaScript.valueToCode(block, 'arrow_id', Blockly.JavaScript.ORDER_ATOMIC) || null;
    const arrow_prop = block.getFieldValue('arrow_prop');
    const set_number = Blockly.JavaScript.valueToCode(block, 'set_number', Blockly.JavaScript.ORDER_ATOMIC);

    let code = '';
    if (arrow === 'all') {
      code = `gst = gm.blockly.funcs.setAllArrowsProperty(gst, ${player === 'self' ? 'playerid' : player_id}, "${arrow_prop}", ${set_number}${arrow_prop == 'a' ? '*(Math.PI/180)' : ''});`;
    } else {
      code = `gst = gm.blockly.funcs.setArrowProperty(gst, ${player === 'self' ? 'playerid' : player_id}, ${arrow === 'last' ? 'gm.blockly.funcs.getArrowAmount(gst, playerid)' : arrow_id}, "${arrow_prop}", ${set_number}${arrow_prop == 'a' ? '*(Math.PI/180)' : ''});`;
    }
    return code;
  };

  Blockly.JavaScript['change_last_arrow_prop'] = function(block) {
    const player = block.getFieldValue('player');
    const player_id = Blockly.JavaScript.valueToCode(block, 'player_id', Blockly.JavaScript.ORDER_ATOMIC) || null;
    const arrow = block.getFieldValue('arrow');
    const arrow_id = Blockly.JavaScript.valueToCode(block, 'arrow_id', Blockly.JavaScript.ORDER_ATOMIC) || null;
    const arrow_prop = block.getFieldValue('arrow_prop');
    const change_number = Blockly.JavaScript.valueToCode(block, 'change_number', Blockly.JavaScript.ORDER_ATOMIC);

    let code = '';
    if (arrow === 'all') {
      code = `gst = gm.blockly.funcs.changeAllArrowsProperty(gst, ${player === 'self' ? 'playerid' : player_id}, "${arrow_prop}", ${change_number}${arrow_prop == 'a' ? '*(Math.PI/180)' : ''});`;
    } else {
      code = `gst = gm.blockly.funcs.changeArrowProperty(gst, ${player === 'self' ? 'playerid' : player_id}, ${arrow === 'last' ? 'gm.blockly.funcs.getArrowAmount(gst, playerid)' : arrow_id}, "${arrow_prop}", ${change_number}${arrow_prop == 'a' ? '*(Math.PI/180)' : ''});`;
    }
    return code;
  };

  Blockly.JavaScript['get_player_prop'] = function(block) {
    const player = block.getFieldValue('player');
    const player_id = Blockly.JavaScript.valueToCode(block, 'player_id', Blockly.JavaScript.ORDER_ATOMIC) || null;
    const player_prop = block.getFieldValue('property');
    const code = player_prop === 'size' ? `gm.blockly.funcs.getPlayerSize(playerid)` : `gm.blockly.funcs.getPlayerProperty(gst, ${player === 'self' ? 'playerid' : player_id}, "${player_prop}")${player_prop == 'a' ? '*(180/Math.PI)' : ''}`;

    return [code, Blockly.JavaScript.ORDER_NONE];
  };

  Blockly.JavaScript['get_last_arrow_prop'] = function(block) {
    const player = block.getFieldValue('player');
    const player_id = Blockly.JavaScript.valueToCode(block, 'player_id', Blockly.JavaScript.ORDER_ATOMIC) || null;
    const arrow = block.getFieldValue('arrow');
    const arrow_id = Blockly.JavaScript.valueToCode(block, 'arrow_id', Blockly.JavaScript.ORDER_ATOMIC) || null;
    const arrow_prop = block.getFieldValue('property');
    const code = `gm.blockly.funcs.getArrowProperty(gst, ${player === 'self' ? 'playerid' : player_id}, ${arrow === 'last' ? 'gm.blockly.funcs.getArrowAmount(gst, playerid)' : arrow_id}, "${arrow_prop}")${arrow_prop == 'a' ? '*(180/Math.PI)' : ''}`;

    return [code, Blockly.JavaScript.ORDER_NONE];
  };

  Blockly.JavaScript['get_arrow_amount'] = function(block) {
    const player = block.getFieldValue('player');
    const player_id = Blockly.JavaScript.valueToCode(block, 'player_id', Blockly.JavaScript.ORDER_ATOMIC) || null;
    const code = `gm.blockly.funcs.getArrowAmount(gst, ${player === 'self' ? 'playerid' : player_id})`;

    return [code, Blockly.JavaScript.ORDER_NONE];
  };

  Blockly.JavaScript['create_arrow'] = function(block) {
    const arrow_xpos = Blockly.JavaScript.valueToCode(block, 'arrow_xpos', Blockly.JavaScript.ORDER_ATOMIC);
    const arrow_ypos = Blockly.JavaScript.valueToCode(block, 'arrow_ypos', Blockly.JavaScript.ORDER_ATOMIC);
    const arrow_xvel = Blockly.JavaScript.valueToCode(block, 'arrow_xvel', Blockly.JavaScript.ORDER_ATOMIC);
    const arrow_yvel = Blockly.JavaScript.valueToCode(block, 'arrow_yvel', Blockly.JavaScript.ORDER_ATOMIC);
    const arrow_angle = Blockly.JavaScript.valueToCode(block, 'arrow_angle', Blockly.JavaScript.ORDER_ATOMIC);
    const arrow_time = Blockly.JavaScript.valueToCode(block, 'arrow_time', Blockly.JavaScript.ORDER_ATOMIC);
    const code = `gm.blockly.funcs.createArrow(gst, playerid, ${arrow_xpos}, ${arrow_ypos}, ${arrow_xvel}, ${arrow_yvel}, ${arrow_angle}*(Math.PI/180), ${arrow_time !== '' ? arrow_time : 150});`;
    return code;
  };

  Blockly.JavaScript['delete_arrows'] = function(block) {
    const player = block.getFieldValue('player');
    const player_id = Blockly.JavaScript.valueToCode(block, 'player_id', Blockly.JavaScript.ORDER_ATOMIC) || null;
    const arrow = block.getFieldValue('arrow');
    const arrow_id = Blockly.JavaScript.valueToCode(block, 'arrow_id', Blockly.JavaScript.ORDER_ATOMIC) || null;

    let code = '';
    if (arrow === 'all') {
      code = `gm.blockly.funcs.deleteAllPlayerArrows(gst, ${player === 'self' ? 'playerid' : player_id});`;
    } else {
      code = `gm.blockly.funcs.deletePlayerArrow(gst, ${player === 'self' ? 'playerid' : player_id}, ${arrow === 'last' ? 'gm.blockly.funcs.getArrowAmount(gst, playerid)' : arrow_id});`;
    }
    return code;
  };

  Blockly.JavaScript['get_own_id'] = function(block) {
    const player = block.getFieldValue('player');

    const code = player === 'self' ? 'playerid' : 'gm.lobby.networkEngine?.hostID ?? Infinity';

    return [code, Blockly.JavaScript.ORDER_NONE];
  };

  Blockly.JavaScript['get_player_id_list'] = function(block) {
    const code = `gm.blockly.funcs.getAllPlayerIds(gst)`;
    return [code, Blockly.JavaScript.ORDER_NONE];
  };

  Blockly.JavaScript['get_player_name'] = function(block) {
    const player = block.getFieldValue('player');
    const player_id = Blockly.JavaScript.valueToCode(block, 'player_id', Blockly.JavaScript.ORDER_ATOMIC) || null;

    const code = `gm.graphics.rendererClass.playerArray[${player === 'self' ? 'playerid' : player_id}]?.userName ?? ""`;

    return [code, Blockly.JavaScript.ORDER_NONE];
  };

  Blockly.JavaScript['change_death_barrier'] = function(block) {
    const enable = block.getFieldValue('enable');

    var code = `gm.blockly.funcs.enableDeathBarrier(gst, ${enable});`;
    return code;
  };

  Blockly.JavaScript['set_camera_prop'] = function(block) {
    const camera_prop = block.getFieldValue('camera_prop');
    const set_number = Blockly.JavaScript.valueToCode(block, 'set_number', Blockly.JavaScript.ORDER_ATOMIC);
    const player = block.getFieldValue('player');
    const player_id = Blockly.JavaScript.valueToCode(block, 'player_id', Blockly.JavaScript.ORDER_ATOMIC) || null;

    const code = `gst = gm.blockly.funcs.setCameraProperty(gst, ${player !== 'all' ? (player === 'self' ? 'playerid' : player_id) : 'null'}, "${camera_prop}", ${set_number});`;
    return code;
  };

  Blockly.JavaScript['change_camera_prop'] = function(block) {
    const camera_prop = block.getFieldValue('camera_prop');
    const change_number = Blockly.JavaScript.valueToCode(block, 'change_number', Blockly.JavaScript.ORDER_ATOMIC);
    const player = block.getFieldValue('player');
    const player_id = Blockly.JavaScript.valueToCode(block, 'player_id', Blockly.JavaScript.ORDER_ATOMIC) || null;

    const code = `gst = gm.blockly.funcs.changeCameraProperty(gst, ${player !== 'all' ? (player === 'self' ? 'playerid' : player_id) : 'null'}, "${camera_prop}", ${change_number});`;
    return code;
  };

  Blockly.JavaScript['get_camera_prop'] = function(block) {
    const player = block.getFieldValue('player');
    const player_id = Blockly.JavaScript.valueToCode(block, 'player_id', Blockly.JavaScript.ORDER_ATOMIC) || null;
    const camera_prop = block.getFieldValue('camera_prop');

    const code = `gm.blockly.funcs.getCameraProperty(gst, ${player === 'self' ? 'playerid' : player_id}, "${camera_prop}")`;
    return [code, Blockly.JavaScript.ORDER_NONE];
  };

  Blockly.JavaScript['change_camera_lerp'] = function(block) {
    const enable = block.getFieldValue('enable');
    const player = block.getFieldValue('player');
    const player_id = Blockly.JavaScript.valueToCode(block, 'player_id', Blockly.JavaScript.ORDER_ATOMIC);

    var code = `gst = gm.blockly.funcs.enableCameraLerp(gst, ${enable}, ${player !== 'all' ? (player === 'self' ? 'playerid' : player_id) : 'null'});`;
    return code;
  };

  Blockly.JavaScript['raycast'] = function(block) {
    var a_x = Blockly.JavaScript.valueToCode(block, 'a_x', Blockly.JavaScript.ORDER_ATOMIC);
    var a_y = Blockly.JavaScript.valueToCode(block, 'a_y', Blockly.JavaScript.ORDER_ATOMIC);
    var b_x = Blockly.JavaScript.valueToCode(block, 'b_x', Blockly.JavaScript.ORDER_ATOMIC);
    var b_y = Blockly.JavaScript.valueToCode(block, 'b_y', Blockly.JavaScript.ORDER_ATOMIC);
    var collide_a = block.getFieldValue('collide_a') == 'TRUE';
    var collide_b = block.getFieldValue('collide_b') == 'TRUE';
    var collide_c = block.getFieldValue('collide_c') == 'TRUE';
    var collide_d = block.getFieldValue('collide_d') == 'TRUE';
    var collide_player = block.getFieldValue('collide_player') == 'TRUE';
    var point_x = Blockly.JavaScript.nameDB_.getName(block.getFieldValue('point_x'), Blockly.VARIABLE_CATEGORY_NAME);
    var point_y = Blockly.JavaScript.nameDB_.getName(block.getFieldValue('point_y'), Blockly.VARIABLE_CATEGORY_NAME);
    var normal_x = Blockly.JavaScript.nameDB_.getName(block.getFieldValue('normal_x'), Blockly.VARIABLE_CATEGORY_NAME);
    var normal_y = Blockly.JavaScript.nameDB_.getName(block.getFieldValue('normal_y'), Blockly.VARIABLE_CATEGORY_NAME);
    var object_type = Blockly.JavaScript.nameDB_.getName(block.getFieldValue('object_type'), Blockly.VARIABLE_CATEGORY_NAME);
    var object_id = Blockly.JavaScript.nameDB_.getName(block.getFieldValue('object_id'), Blockly.VARIABLE_CATEGORY_NAME);

    var code = `gm.blockly.funcs.rayCast(gst, playerid, ${a_x}, ${a_y}, ${b_x}, ${b_y}, ${collide_a}, ${collide_b}, ${collide_c}, ${collide_d}, ${collide_player}, "${point_x}", "${point_y}", "${normal_x}", "${normal_y}", "${object_type}", "${object_id}")`;

    return [code, Blockly.JavaScript.ORDER_NONE];
  };

  Blockly.JavaScript['get_map_size'] = function(block) {
    const code = 'gm.physics.gameState.physics.ppm';
    return [code, Blockly.JavaScript.ORDER_NONE];
  };

  Blockly.JavaScript['player_die'] = function(block) {
    const player = block.getFieldValue('player');
    const player_id = Blockly.JavaScript.valueToCode(block, 'player_id', Blockly.JavaScript.ORDER_ATOMIC) || null;
    const allow_respawn = block.getFieldValue('allow_respawn') === 'true';

    const code = `gm.blockly.funcs.killPlayer(gst, ${player === 'self' ? 'playerid' : player_id}, ${allow_respawn});`;
    return code;
  };

  Blockly.JavaScript['player_on_team'] = function(block) {
    var player = block.getFieldValue('player');
    var player_id = Blockly.JavaScript.valueToCode(block, 'player_id', Blockly.JavaScript.ORDER_ATOMIC);
    var team = block.getFieldValue('team');

    var code = `gst.discs[${player === 'self' ? 'playerid' : player_id}]?.team == ${team}`;

    return [code, Blockly.JavaScript.ORDER_NONE];
  };

  Blockly.JavaScript['input_override'] = function(block) {
    var player = block.getFieldValue('player');
    var player_id = Blockly.JavaScript.valueToCode(block, 'player_id', Blockly.JavaScript.ORDER_ATOMIC) || null;
    var key = block.getFieldValue('key');
    var override_value = Blockly.JavaScript.valueToCode(block, 'override_value', Blockly.JavaScript.ORDER_ATOMIC);

    var code = `gm.blockly.funcs.overrideInput(gst, ${player === 'self' ? 'playerid' : player_id}, '${key}', ${override_value});`;
    return code;
  };

  Blockly.JavaScript['stop_input_override'] = function(block) {
    var player = block.getFieldValue('player');
    var player_id = Blockly.JavaScript.valueToCode(block, 'player_id', Blockly.JavaScript.ORDER_ATOMIC) || null;
    var key = block.getFieldValue('key');

    var code = `gm.blockly.funcs.overrideInput(gst, ${player === 'self' ? 'playerid' : player_id}, '${key}', null);`;
    return code;
  };

  Blockly.JavaScript['on_round_start'] = function(block) {
    const inside_code = Blockly.JavaScript.statementToCode(block, 'code');
    const code = `gm.physics.onFirstStep = function(playerid){let gst = gm.physics.gameState;let loopIterations = 0;${inside_code}gm.physics.setGameState(gst);}`;
    return code;
  };

  Blockly.JavaScript['on_player_die'] = function(block) {
    const inside_code = Blockly.JavaScript.statementToCode(block, 'code');
    const code = `gm.physics.onPlayerDie = function(playerid){let gst = gm.physics.gameState;let loopIterations = 0;${inside_code}gm.physics.setGameState(gst);}`;
    return code;
  };

  Blockly.JavaScript['on_each_phys_frame'] = function(block) {
    const inside_code = Blockly.JavaScript.statementToCode(block, 'code');
    const code = `gm.physics.onStep = function(playerid){let gst = gm.physics.gameState;let loopIterations = 0;${inside_code}gm.physics.setGameState(gst);}`;
    return code;
  };

  Blockly.JavaScript['on_each_render_frame'] = function(block) {
    const inside_code = Blockly.JavaScript.statementToCode(block, 'code');
    const code = `gm.graphics.onRender = function(playerid){let gst = gm.physics.gameState;let loopIterations = 0;${inside_code}gm.physics.setGameState(gst);}`;
    return code;
  };

  Blockly.JavaScript['on_player_collide'] = function(block) {
    const collide_type = block.getFieldValue('collide_type');
    const return_info = block.getFieldValue('return_info') === 'TRUE';
    const hit_player_id = Blockly.JavaScript.nameDB_.getName(block.getFieldValue('player_id'), Blockly.VARIABLE_CATEGORY_NAME);
    const hit_arrow_id = Blockly.JavaScript.nameDB_.getName(block.getFieldValue('arrow_id'), Blockly.VARIABLE_CATEGORY_NAME);
    const hit_platform_id = Blockly.JavaScript.nameDB_.getName(block.getFieldValue('platform_id'), Blockly.VARIABLE_CATEGORY_NAME);
    const hit_shape_id = Blockly.JavaScript.nameDB_.getName(block.getFieldValue('shape_id'), Blockly.VARIABLE_CATEGORY_NAME);
    const hit_normal_x = Blockly.JavaScript.nameDB_.getName(block.getFieldValue('normal_x'), Blockly.VARIABLE_CATEGORY_NAME);
    const hit_normal_y = Blockly.JavaScript.nameDB_.getName(block.getFieldValue('normal_y'), Blockly.VARIABLE_CATEGORY_NAME);
    const inside_code = Blockly.JavaScript.statementToCode(block, 'code');
    let code = '';
    let setCode = '';
    switch (collide_type) {
      case 'collide_player':
        setCode = `gm.blockly.funcs.setVar("${hit_player_id}", gst, playerid, colid);`;
        code = `gm.physics.onPlayerPlayerCollision = function(playerid, colid){let gst = gm.physics.gameState;let loopIterations = 0;${return_info ? setCode : ''}${inside_code}gm.physics.setGameState(gst);}`;
        break;
      case 'collide_arrow':
        setCode = `gm.blockly.funcs.setVar("${hit_player_id}", gst, playerid, colid);gm.blockly.funcs.setVar("${hit_arrow_id}", gst, playerid, colarrowid);`;
        code = `gm.physics.onPlayerArrowCollision = function(playerid, colid, colarrowid){let gst = gm.physics.gameState;let loopIterations = 0;${return_info ? setCode : ''}${inside_code}gm.physics.setGameState(gst);}`;
        break;
      case 'collide_platform':
        setCode = `gm.blockly.funcs.setVar("${hit_platform_id}", gst, playerid, colid);gm.blockly.funcs.setVar("${hit_shape_id}", gst, playerid, colshapeid);gm.blockly.funcs.setVar("${hit_normal_x}", gst, playerid, normal.x);gm.blockly.funcs.setVar("${hit_normal_y}", gst, playerid, normal.y);`;
        code = `gm.physics.onPlayerPlatformCollision = function(playerid, colid, colshapeid, normal){let gst = gm.physics.gameState;let loopIterations = 0;${return_info ? setCode : ''}${inside_code}gm.physics.setGameState(gst);}`;
        break;
    }
    return code;
  };

  Blockly.JavaScript['pressing_key'] = function(block) {
    const player = block.getFieldValue('player');
    const player_id = Blockly.JavaScript.valueToCode(block, 'player_id', Blockly.JavaScript.ORDER_ATOMIC) || null;
    const key = block.getFieldValue('key');
    const code = `(gm.inputs.allPlayerInputs[${player === 'self' ? 'playerid' : player_id}] && gm.inputs.allPlayerInputs[${player === 'self' ? 'playerid' : player_id}]["${key}"])`;

    return [code, Blockly.JavaScript.ORDER_NONE];
  };

  Blockly.JavaScript['on_arrow_collide'] = function(block) {
    const collide_type = block.getFieldValue('collide_type');
    const return_info = block.getFieldValue('return_info') === 'TRUE';
    const self_arrow_id = Blockly.JavaScript.nameDB_.getName(block.getFieldValue('self_arrow_id'), Blockly.VARIABLE_CATEGORY_NAME);
    const hit_player_id = Blockly.JavaScript.nameDB_.getName(block.getFieldValue('player_id'), Blockly.VARIABLE_CATEGORY_NAME);
    const hit_arrow_id = Blockly.JavaScript.nameDB_.getName(block.getFieldValue('arrow_id'), Blockly.VARIABLE_CATEGORY_NAME);
    const hit_platform_id = Blockly.JavaScript.nameDB_.getName(block.getFieldValue('platform_id'), Blockly.VARIABLE_CATEGORY_NAME);
    const hit_shape_id = Blockly.JavaScript.nameDB_.getName(block.getFieldValue('shape_id'), Blockly.VARIABLE_CATEGORY_NAME);
    const hit_normal_x = Blockly.JavaScript.nameDB_.getName(block.getFieldValue('normal_x'), Blockly.VARIABLE_CATEGORY_NAME);
    const hit_normal_y = Blockly.JavaScript.nameDB_.getName(block.getFieldValue('normal_y'), Blockly.VARIABLE_CATEGORY_NAME);
    const inside_code = Blockly.JavaScript.statementToCode(block, 'code');
    let code = '';
    let setCode = `gm.blockly.funcs.setVar("${self_arrow_id}", gst, playerid, arrowid);`;
    switch (collide_type) {
      case 'collide_player':
        setCode = `gm.blockly.funcs.setVar("${hit_player_id}", gst, playerid, colid);`;
        code = `gm.physics.onArrowPlayerCollision = function(playerid, arrowid, colid){let gst = gm.physics.gameState;let loopIterations = 0;${return_info ? setCode : ''}${inside_code}gm.physics.setGameState(gst);}`;
        break;
      case 'collide_arrow':
        setCode = `gm.blockly.funcs.setVar("${hit_player_id}", gst, playerid, colid);gm.blockly.funcs.setVar("${hit_arrow_id}", gst, playerid, colarrowid);`;
        code = `gm.physics.onArrowArrowCollision = function(playerid, arrowid, colid, colarrowid){let gst = gm.physics.gameState;let loopIterations = 0;${return_info ? setCode : ''}${inside_code}gm.physics.setGameState(gst);}`;
        break;
      case 'collide_platform':
        setCode = `gm.blockly.funcs.setVar("${hit_platform_id}", gst, playerid, colid);gm.blockly.funcs.setVar("${hit_shape_id}", gst, playerid, colshapeid);gm.blockly.funcs.setVar("${hit_normal_x}", gst, playerid, normal.x);gm.blockly.funcs.setVar("${hit_normal_y}", gst, playerid, normal.y);`;
        code = `gm.physics.onArrowPlatformCollision = function(playerid, arrowid, colid, colshapeid, normal){let gst = gm.physics.gameState;let loopIterations = 0;${return_info ? setCode : ''}${inside_code}gm.physics.setGameState(gst);}`;
        break;
    }
    return code;
  };

  Blockly.JavaScript['on_platform_collide'] = function(block) {
    const collide_type = block.getFieldValue('collide_type');
    const return_info = block.getFieldValue('return_info') === 'TRUE';
    const self_platform_id = Blockly.JavaScript.nameDB_.getName(block.getFieldValue('self_platform_id'), Blockly.VARIABLE_CATEGORY_NAME);
    const self_shape_id = Blockly.JavaScript.nameDB_.getName(block.getFieldValue('self_shape_id'), Blockly.VARIABLE_CATEGORY_NAME);
    const hit_player_id = Blockly.JavaScript.nameDB_.getName(block.getFieldValue('player_id'), Blockly.VARIABLE_CATEGORY_NAME);
    const hit_arrow_id = Blockly.JavaScript.nameDB_.getName(block.getFieldValue('arrow_id'), Blockly.VARIABLE_CATEGORY_NAME);
    const hit_platform_id = Blockly.JavaScript.nameDB_.getName(block.getFieldValue('platform_id'), Blockly.VARIABLE_CATEGORY_NAME);
    const hit_shape_id = Blockly.JavaScript.nameDB_.getName(block.getFieldValue('shape_id'), Blockly.VARIABLE_CATEGORY_NAME);
    const hit_normal_x = Blockly.JavaScript.nameDB_.getName(block.getFieldValue('normal_x'), Blockly.VARIABLE_CATEGORY_NAME);
    const hit_normal_y = Blockly.JavaScript.nameDB_.getName(block.getFieldValue('normal_y'), Blockly.VARIABLE_CATEGORY_NAME);
    const inside_code = Blockly.JavaScript.statementToCode(block, 'code');
    let code = '';
    let setCode = `gm.blockly.funcs.setVar("${self_platform_id}", gst, playerid, platid);gm.blockly.funcs.setVar("${self_shape_id}", gst, playerid, shapeid);`;
    switch (collide_type) {
      case 'collide_player':
        setCode += `gm.blockly.funcs.setVar("${hit_player_id}", gst, playerid, colid);`;
        code = `gm.physics.onPlatformPlayerCollision = function(playerid, platid, shapeid, colid){let gst = gm.physics.gameState;let loopIterations = 0;${return_info ? setCode : ''}${inside_code}gm.physics.setGameState(gst);}`;
        break;
      case 'collide_arrow':
        setCode += `gm.blockly.funcs.setVar("${hit_player_id}", gst, playerid, colid);gm.blockly.funcs.setVar("${hit_arrow_id}", gst, playerid, colarrowid);`;
        code = `gm.physics.onPlatformArrowCollision = function(playerid, platid, shapeid, colid, colarrowid){let gst = gm.physics.gameState;let loopIterations = 0;${return_info ? setCode : ''}${inside_code}gm.physics.setGameState(gst);}`;
        break;
      case 'collide_platform':
        setCode += `gm.blockly.funcs.setVar("${hit_platform_id}", gst, playerid, colid);gm.blockly.funcs.setVar("${hit_shape_id}", gst, playerid, colshapeid);gm.blockly.funcs.setVar("${hit_normal_x}", gst, playerid, normal.x);gm.blockly.funcs.setVar("${hit_normal_y}", gst, playerid, normal.y);`;
        code = `gm.physics.onPlatformPlatformCollision = function(playerid, platid, shapeid, colid, colshapeid, normal){let gst = gm.physics.gameState;let loopIterations = 0;${return_info ? setCode : ''}${inside_code}gm.physics.setGameState(gst);}`;
        break;
    }
    return code;
  };

  Blockly.JavaScript['rectangle_shape'] = function(block) {
    var color = Blockly.JavaScript.valueToCode(block, 'color', Blockly.JavaScript.ORDER_ATOMIC);
    var xpos = Blockly.JavaScript.valueToCode(block, 'xpos', Blockly.JavaScript.ORDER_ATOMIC);
    var ypos = Blockly.JavaScript.valueToCode(block, 'ypos', Blockly.JavaScript.ORDER_ATOMIC);
    var width = Blockly.JavaScript.valueToCode(block, 'width', Blockly.JavaScript.ORDER_ATOMIC);
    var height = Blockly.JavaScript.valueToCode(block, 'height', Blockly.JavaScript.ORDER_ATOMIC);
    var angle = Blockly.JavaScript.valueToCode(block, 'angle', Blockly.JavaScript.ORDER_ATOMIC);
    var nophys = block.getFieldValue('nophys') === 'TRUE';
    var nograp = block.getFieldValue('nograp') === 'TRUE';
    var ingrap = block.getFieldValue('ingrap') === 'TRUE';
    var death = block.getFieldValue('death') === 'TRUE';

    var code = `gm.blockly.funcs.createRectShape(${color}, ${xpos}, ${ypos}, ${width}, ${height}, ${angle}*(Math.PI/180), ${nophys}, ${nograp}, ${ingrap}, ${death})`;

    return [code, Blockly.JavaScript.ORDER_NONE];
  };

  Blockly.JavaScript['circle_shape'] = function(block) {
    var color = Blockly.JavaScript.valueToCode(block, 'color', Blockly.JavaScript.ORDER_ATOMIC);
    var xpos = Blockly.JavaScript.valueToCode(block, 'xpos', Blockly.JavaScript.ORDER_ATOMIC);
    var ypos = Blockly.JavaScript.valueToCode(block, 'ypos', Blockly.JavaScript.ORDER_ATOMIC);
    var radius = Blockly.JavaScript.valueToCode(block, 'radius', Blockly.JavaScript.ORDER_ATOMIC);
    var nophys = block.getFieldValue('nophys') === 'TRUE';
    var nograp = block.getFieldValue('nograp') === 'TRUE';
    var ingrap = block.getFieldValue('ingrap') === 'TRUE';
    var death = block.getFieldValue('death') === 'TRUE';

    var code = `gm.blockly.funcs.createCircleShape(${color}, ${xpos}, ${ypos}, ${radius}, ${nophys}, ${nograp}, ${ingrap}, ${death})`;
    return [code, Blockly.JavaScript.ORDER_NONE];
  };

  Blockly.JavaScript['polygon_shape'] = function(block) {
    var color = Blockly.JavaScript.valueToCode(block, 'color', Blockly.JavaScript.ORDER_ATOMIC);
    var xpos = Blockly.JavaScript.valueToCode(block, 'xpos', Blockly.JavaScript.ORDER_ATOMIC);
    var ypos = Blockly.JavaScript.valueToCode(block, 'ypos', Blockly.JavaScript.ORDER_ATOMIC);
    var vertex = Blockly.JavaScript.valueToCode(block, 'vertex', Blockly.JavaScript.ORDER_ATOMIC);
    var angle = Blockly.JavaScript.valueToCode(block, 'angle', Blockly.JavaScript.ORDER_ATOMIC);
    var scale = Blockly.JavaScript.valueToCode(block, 'scale', Blockly.JavaScript.ORDER_ATOMIC);
    var nophys = block.getFieldValue('nophys') === 'TRUE';
    var nograp = block.getFieldValue('nograp') === 'TRUE';
    var ingrap = block.getFieldValue('ingrap') === 'TRUE';
    var death = block.getFieldValue('death') === 'TRUE';

    var code = `gm.blockly.funcs.createPolyShape(${color}, ${xpos}, ${ypos}, ${vertex}, ${angle}*(Math.PI/180), ${scale}, ${nophys}, ${nograp}, ${ingrap}, ${death})`;

    return [code, Blockly.JavaScript.ORDER_NONE];
  };

  Blockly.JavaScript['create_platform'] = function(block) {
    var type = block.getFieldValue('type');
    var shape_list = Blockly.JavaScript.valueToCode(block, 'shape_list', Blockly.JavaScript.ORDER_ATOMIC) || '[]';
    var xpos = Blockly.JavaScript.valueToCode(block, 'xpos', Blockly.JavaScript.ORDER_ATOMIC);
    var ypos = Blockly.JavaScript.valueToCode(block, 'ypos', Blockly.JavaScript.ORDER_ATOMIC);
    var angle = Blockly.JavaScript.valueToCode(block, 'angle', Blockly.JavaScript.ORDER_ATOMIC);
    var bounciness = Blockly.JavaScript.valueToCode(block, 'bounciness', Blockly.JavaScript.ORDER_ATOMIC);
    var density = Blockly.JavaScript.valueToCode(block, 'density', Blockly.JavaScript.ORDER_ATOMIC);
    var friction = Blockly.JavaScript.valueToCode(block, 'friction', Blockly.JavaScript.ORDER_ATOMIC);
    var fricp = Blockly.JavaScript.valueToCode(block, 'fricp', Blockly.JavaScript.ORDER_ATOMIC);
    var colgroup = block.getFieldValue('colgroup');
    var colplayers = block.getFieldValue('colplayers') === 'TRUE';
    var cola = block.getFieldValue('cola') === 'TRUE';
    var colb = block.getFieldValue('colb') === 'TRUE';
    var colc = block.getFieldValue('colc') === 'TRUE';
    var cold = block.getFieldValue('cold') === 'TRUE';
    var return_id = block.getFieldValue('return_id') === 'TRUE';

    if (return_id) {
      var code = `gm.blockly.funcs.createPlatform(gst, '${type}', ${xpos}, ${ypos}, ${angle}*(Math.PI/180), ${shape_list}, ${bounciness}, ${density}, ${friction}, ${fricp}, ${colgroup}, ${colplayers}, ${cola}, ${colb}, ${colc}, ${cold})`;
      return [code, Blockly.JavaScript.ORDER_NONE];
    } else {
      var code = `gm.blockly.funcs.createPlatform(gst, '${type}', ${xpos}, ${ypos}, ${angle}*(Math.PI/180), ${shape_list}, ${bounciness}, ${density}, ${friction}, ${fricp}, ${colgroup}, ${colplayers}, ${cola}, ${colb}, ${colc}, ${cold});`;
      return code;
    }
  };

  Blockly.JavaScript['clone_platform'] = function(block) {
    var platform_id = Blockly.JavaScript.valueToCode(block, 'platform_id', Blockly.JavaScript.ORDER_ATOMIC);
    var return_id = block.getFieldValue('return_id') === 'TRUE';

    if (return_id) {
      var code = `gm.blockly.funcs.clonePlatform(gst, ${platform_id})`;
      return [code, Blockly.JavaScript.ORDER_NONE];
    } else {
      var code = `gm.blockly.funcs.clonePlatform(gst, ${platform_id});`;
      return code;
    }
  };

  Blockly.JavaScript['set_platform_prop'] = function(block) {
    var platform_id = Blockly.JavaScript.valueToCode(block, 'platform_id', Blockly.JavaScript.ORDER_ATOMIC);
    var platform_prop = block.getFieldValue('platform_prop');
    var set_value = Blockly.JavaScript.valueToCode(block, 'set_value', Blockly.JavaScript.ORDER_ATOMIC);

    var code = `gst = gm.blockly.funcs.setPlatformProperty(gst, ${platform_id}, '${platform_prop}', ${set_value}${platform_prop == 'a' ? '*(Math.PI/180)' : ''});`;
    return code;
  };

  Blockly.JavaScript['change_platform_prop'] = function(block) {
    var platform_id = Blockly.JavaScript.valueToCode(block, 'platform_id', Blockly.JavaScript.ORDER_ATOMIC);
    var platform_prop = block.getFieldValue('platform_prop');
    var change_value = Blockly.JavaScript.valueToCode(block, 'change_value', Blockly.JavaScript.ORDER_ATOMIC);

    var code = `gst = gm.blockly.funcs.changePlatformProperty(gst, ${platform_id}, '${platform_prop}', ${change_value}${platform_prop == 'a' ? '*(Math.PI/180)' : ''});`;
    return code;
  };

  Blockly.JavaScript['get_platform_prop'] = function(block) {
    var platform_id = Blockly.JavaScript.valueToCode(block, 'platform_id', Blockly.JavaScript.ORDER_ATOMIC);
    var platform_prop = block.getFieldValue('platform_prop');

    var code = `gm.blockly.funcs.getPlatformProperty(gst, ${platform_id}, '${platform_prop}')${platform_prop == 'a' ? '*(180/Math.PI)' : ''}`;
    return [code, Blockly.JavaScript.ORDER_NONE];
  };

  Blockly.JavaScript['set_shape_prop'] = function(block) {
    var platform_id = Blockly.JavaScript.valueToCode(block, 'platform_id', Blockly.JavaScript.ORDER_ATOMIC);
    var shape_id = Blockly.JavaScript.valueToCode(block, 'shape_id', Blockly.JavaScript.ORDER_ATOMIC);
    var shape_prop = block.getFieldValue('shape_prop');
    var set_value = Blockly.JavaScript.valueToCode(block, 'set_value', Blockly.JavaScript.ORDER_ATOMIC);

    var code = `gst = gm.blockly.funcs.setShapeProperty(gst, ${platform_id}, ${shape_id}, '${shape_prop}', ${set_value}${shape_prop == 's_a' ? '*(Math.PI/180)' : ''});`;
    return code;
  };

  Blockly.JavaScript['change_shape_prop'] = function(block) {
    var platform_id = Blockly.JavaScript.valueToCode(block, 'platform_id', Blockly.JavaScript.ORDER_ATOMIC);
    var shape_id = Blockly.JavaScript.valueToCode(block, 'shape_id', Blockly.JavaScript.ORDER_ATOMIC);
    var shape_prop = block.getFieldValue('shape_prop');
    var change_value = Blockly.JavaScript.valueToCode(block, 'change_value', Blockly.JavaScript.ORDER_ATOMIC);

    var code = `gst = gm.blockly.funcs.changeShapeProperty(gst, ${platform_id}, ${shape_id}, '${shape_prop}', ${change_value}${shape_prop == 's_a' ? '*(Math.PI/180)' : ''});`;
    return code;
  };

  Blockly.JavaScript['get_shape_prop'] = function(block) {
    var platform_id = Blockly.JavaScript.valueToCode(block, 'platform_id', Blockly.JavaScript.ORDER_ATOMIC);
    var shape_id = Blockly.JavaScript.valueToCode(block, 'shape_id', Blockly.JavaScript.ORDER_ATOMIC);
    var shape_prop = block.getFieldValue('shape_prop');

    var code = `gm.blockly.funcs.getShapeProperty(gst, ${platform_id}, ${shape_id}, '${shape_prop}')${shape_prop == 's_a' ? '*(180/Math.PI)' : ''}`;
    return [code, Blockly.JavaScript.ORDER_NONE];
  };

  Blockly.JavaScript['get_shape_amount'] = function(block) {
    var platform_id = Blockly.JavaScript.valueToCode(block, 'platform_id', Blockly.JavaScript.ORDER_ATOMIC);

    var code = `gm.blockly.funcs.getShapeAmount(gst, ${platform_id})`;

    return [code, Blockly.JavaScript.ORDER_NONE];
  };

  Blockly.JavaScript['get_platform_order'] = function(block) {
    var code = `gst.physics.bro`;

    return [code, Blockly.JavaScript.ORDER_NONE];
  };

  Blockly.JavaScript['get_platform_by_name'] = function(block) {
    var platform_name = Blockly.JavaScript.valueToCode(block, 'platform_name', Blockly.JavaScript.ORDER_ATOMIC);
    var code = `gm.blockly.funcs.getPlatformByName(${platform_name})`;

    return [code, Blockly.JavaScript.ORDER_NONE];
  };

  Blockly.JavaScript['get_platform_name'] = function(block) {
    var platform_id = Blockly.JavaScript.valueToCode(block, 'platform_id', Blockly.JavaScript.ORDER_ATOMIC);
    var code = `gm.blockly.funcs.getPlatformName(${platform_id})`;

    return [code, Blockly.JavaScript.ORDER_NONE];
  };

  Blockly.JavaScript['delete_platform'] = function(block) {
    var platform_id = Blockly.JavaScript.valueToCode(block, 'platform_id', Blockly.JavaScript.ORDER_ATOMIC);

    var code = `gst = gm.blockly.funcs.deletePlatform(gst, ${platform_id});`;
    return code;
  };

  Blockly.JavaScript['delete_shape'] = function(block) {
    var platform_id = Blockly.JavaScript.valueToCode(block, 'platform_id', Blockly.JavaScript.ORDER_ATOMIC);
    var shape_id = Blockly.JavaScript.valueToCode(block, 'shape_id', Blockly.JavaScript.ORDER_ATOMIC);

    var code = `gst = gm.blockly.funcs.deleteShape(gst, ${platform_id}, ${shape_id});`;
    return code;
  };

  Blockly.JavaScript['add_shape'] = function(block) {
    var platform_id = Blockly.JavaScript.valueToCode(block, 'platform_id', Blockly.JavaScript.ORDER_ATOMIC);
    var shape = Blockly.JavaScript.valueToCode(block, 'shape', Blockly.JavaScript.ORDER_ATOMIC);

    var code = `gst = gm.blockly.funcs.addShape(gst, ${platform_id}, ${shape});`;
    return code;
  };

  Blockly.JavaScript['unit_to_pixel'] = function(block) {
    const value = Blockly.JavaScript.valueToCode(block, 'unit_value', Blockly.JavaScript.ORDER_ATOMIC);

    const code = `${value}`;

    return [code, Blockly.JavaScript.ORDER_NONE];
  };

  Blockly.JavaScript['pixel_to_unit'] = function(block) {
    const value = Blockly.JavaScript.valueToCode(block, 'unit_value', Blockly.JavaScript.ORDER_ATOMIC);

    const code = `${value}`;

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

  Blockly.JavaScript['math_atan2'] = function(block) {
    const value_x = Blockly.JavaScript.valueToCode(block, 'x', Blockly.JavaScript.ORDER_ATOMIC);
    const value_y = Blockly.JavaScript.valueToCode(block, 'y', Blockly.JavaScript.ORDER_ATOMIC);

    const code = `SafeTrig.safeATan2(${value_x}, ${value_y})*(180/Math.PI)`;

    return [code, Blockly.JavaScript.ORDER_NONE];
  };

  Blockly.JavaScript['math_distance'] = function(block) {
    const point_a_x = Blockly.JavaScript.valueToCode(block, 'a_x', Blockly.JavaScript.ORDER_ATOMIC);
    const point_a_y = Blockly.JavaScript.valueToCode(block, 'a_y', Blockly.JavaScript.ORDER_ATOMIC);
    const point_b_x = Blockly.JavaScript.valueToCode(block, 'b_x', Blockly.JavaScript.ORDER_ATOMIC);
    const point_b_y = Blockly.JavaScript.valueToCode(block, 'b_y', Blockly.JavaScript.ORDER_ATOMIC);

    const code = `gm.blockly.funcs.getDistance(${point_a_x}, ${point_a_y}, ${point_b_x}, ${point_b_y})`;

    return [code, Blockly.JavaScript.ORDER_NONE];
  };

  Blockly.JavaScript['play_sound'] = function(block) {
    var sound_name = block.getFieldValue('sound_name');
    var sound_volume = Blockly.JavaScript.valueToCode(block, 'sound_volume', Blockly.JavaScript.ORDER_ATOMIC);
    var sound_pan = Blockly.JavaScript.valueToCode(block, 'sound_pan', Blockly.JavaScript.ORDER_ATOMIC);
    var pan_type = block.getFieldValue('pan_type');

    var code = `gm.blockly.funcs.playSound(gst, "${pan_type}", "${sound_name}", ${sound_volume}, ${sound_pan});`;
    return code;
  };

  Blockly.JavaScript['colour_hex'] = function(block) {
    var hex_code = Blockly.JavaScript.valueToCode(block, 'hex_code', Blockly.JavaScript.ORDER_ATOMIC);

    var code = `gm.blockly.funcs.parseColour(${hex_code})`;

    return [code, Blockly.JavaScript.ORDER_NONE];
  };

  Blockly.JavaScript['variables_retain_value'] = function(block) {
    const variable = Blockly.JavaScript.nameDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);

    var code = `gm.blockly.funcs.keepVar("${variable}", gst);`;

    return code;
  };

  Blockly.JavaScript['get_screen_prop'] = function(block) {
    var screen_prop = block.getFieldValue('screen_prop');

    var code = `${screen_prop == 'width' ? '730' : '500'} / gst.physics.ppm`;

    return [code, Blockly.JavaScript.ORDER_NONE];
  };

  // blockly built-in

  // temporary fix to the disappearing blocks problem
  Blockly.WorkspaceSvg.prototype.setCachedParentSvgSize = function(width, height) {
    const svg = this.getParentSvg();
    if (width != null) {
      this.cachedParentSvgSize_.width = width;
      // This is set to support the public (but deprecated) Blockly.svgSize
      // method.
      svg.cachedWidth_ = width;
    }
    if (height != null) {
      this.cachedParentSvgSize_.height = height;
      // This is set to support the public (but deprecated) Blockly.svgSize
      // method.
      svg.cachedHeight_ = height;
    }
  };

  // fix variable context menu thing
  const CUSTOM_CONTEXT_MENU_VARIABLE_GETTER_SETTER_MIXIN = {
    /**
     * Add menu option to create getter/setter block for this setter/getter.
     * @param {!Array} options List of menu options to add to.
     * @this {Block}
     */
    customContextMenu: function(options) {
      if (!this.isInFlyout) {
        let oppositeType;
        let contextMenuMsg;
        // Getter blocks have the option to create a setter block, and vice versa.
        if (this.type === 'variables_get') {
          oppositeType = 'variables_set';
          contextMenuMsg = Blockly.Msg['VARIABLES_GET_CREATE_SET'];
        } else {
          oppositeType = 'variables_get';
          contextMenuMsg = Blockly.Msg['VARIABLES_SET_CREATE_GET'];
        }

        const option = {enabled: this.workspace.remainingCapacity() > 0};
        const name = this.getField('VAR').getText();
        option.text = contextMenuMsg.replace('%1', name);
        const xmlField = Blockly.utils.xml.createElement('field');
        xmlField.setAttribute('name', 'VAR');
        xmlField.appendChild(Blockly.utils.xml.createTextNode(name));
        const xmlBlock = Blockly.utils.xml.createElement('block');
        xmlBlock.setAttribute('type', oppositeType);
        xmlBlock.appendChild(Blockly.Xml.textToDom('<mutation playerid_input="false" show_dropdown="' +
        !name.startsWith('GLOBAL_') + '"></mutation>'));
        xmlBlock.appendChild(xmlField);
        option.callback = Blockly.ContextMenu.callbackFactory(this, xmlBlock);
        options.push(option);
        // Getter blocks have the option to rename or delete that variable.
      } else {
        if (this.type === 'variables_get' ||
            this.type === 'variables_get_reporter') {
          const renameOption = {
            text: Blockly.Msg['RENAME_VARIABLE'],
            enabled: true,
            callback: renameOptionCallbackFactory(this),
          };
          const name = this.getField('VAR').getText();
          const deleteOption = {
            text: Blockly.Msg['DELETE_VARIABLE'].replace('%1', name),
            enabled: true,
            callback: deleteOptionCallbackFactory(this),
          };
          options.unshift(renameOption);
          options.unshift(deleteOption);
        }
      }
    },
  };

  /**
   * Factory for callbacks for rename variable dropdown menu option
   * associated with a variable getter block.
   * @param {!Block} block The block with the variable to rename.
   * @return {!function()} A function that renames the variable.
   */
  const renameOptionCallbackFactory = function(block) {
    return function() {
      const workspace = block.workspace;
      const variable = block.getField('VAR').getVariable();
      Blockly.Variables.renameVariable(workspace, variable);
    };
  };

  /**
   * Factory for callbacks for delete variable dropdown menu option
   * associated with a variable getter block.
   * @param {!Block} block The block with the variable to delete.
   * @return {!function()} A function that deletes the variable.
   */
  const deleteOptionCallbackFactory = function(block) {
    return function() {
      const workspace = block.workspace;
      const variable = block.getField('VAR').getVariable();
      workspace.deleteVariableById(variable.getId());
      workspace.refreshToolboxSelection();
    };
  };

  Blockly.Extensions.unregister('contextMenu_variableSetterGetter');

  Blockly.Extensions.registerMixin(
      'contextMenu_variableSetterGetter',
      CUSTOM_CONTEXT_MENU_VARIABLE_GETTER_SETTER_MIXIN);

  // add note to variables category
  Blockly.Variables.flyoutCategory = function(workspace) {
    let xmlList = [];
    const button = document.createElement('button');
    button.setAttribute('text', '%{BKY_NEW_VARIABLE}');
    button.setAttribute('callbackKey', 'CREATE_VARIABLE');

    workspace.registerButtonCallback('CREATE_VARIABLE', function(button) {
      Blockly.Variables.createVariableButtonHandler(button.getTargetWorkspace());
    });

    xmlList.push(button);

    const helpLabel1 = document.createElement('label');
    helpLabel1.setAttribute('text', 'You can make a variable global');

    const labelGap = document.createElement('sep');
    labelGap.setAttribute('gap', '4');

    const helpLabel2 = document.createElement('label');
    helpLabel2.setAttribute('text', 'by adding "GLOBAL_" before its name.');

    xmlList.push(helpLabel1);
    xmlList.push(labelGap);
    xmlList.push(helpLabel2);

    const blockList = Blockly.Variables.flyoutCategoryBlocks(workspace);
    xmlList = xmlList.concat(blockList);
    return xmlList;
  };

  // make variables use own db
  Blockly.JavaScript['math_change'] = function(block) {
    // Add to a variable in place.
    const argument0 = Blockly.JavaScript.valueToCode(block, 'DELTA',
        Blockly.JavaScript.ORDER_ADDITION) || '0';
    const varName = Blockly.JavaScript.nameDB_.getName(
        block.getFieldValue('VAR'), Blockly.VARIABLE_CATEGORY_NAME);
    const player = block.getFieldValue('player');
    const player_id = Blockly.JavaScript.valueToCode(block, 'player_id', Blockly.JavaScript.ORDER_ATOMIC) || null;

    return 'gst = gm.blockly.funcs.changeVar("' + varName + '", gst, ' + (player === 'self' ? 'playerid' : player_id) + ', ' + argument0 + ');';
  };

  Blockly.JavaScript['variables_set'] = function(block) {
    // Variable setter.
    const argument0 = Blockly.JavaScript.valueToCode(block, 'VALUE',
        Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
    const varName = Blockly.JavaScript.nameDB_.getName(
        block.getFieldValue('VAR'), Blockly.VARIABLE_CATEGORY_NAME);
    const player = block.getFieldValue('player');
    const player_id = Blockly.JavaScript.valueToCode(block, 'player_id', Blockly.JavaScript.ORDER_ATOMIC) || null;

    return 'gst = gm.blockly.funcs.setVar("' + varName + '", gst, ' + (player === 'self' ? 'playerid' : player_id) + ', ' + argument0 + ');';
  };

  Blockly.JavaScript['variables_get'] = function(block) {
    // Variable getter.
    const varName = Blockly.JavaScript.nameDB_.getName(block.getFieldValue('VAR'),
        Blockly.VARIABLE_CATEGORY_NAME);
    const player = block.getFieldValue('player');
    const player_id = Blockly.JavaScript.valueToCode(block, 'player_id', Blockly.JavaScript.ORDER_ATOMIC) || null;

    return ['gm.blockly.funcs.getVar("' + varName + '", gst, ' + (player === 'self' ? 'playerid' : player_id) + ')', Blockly.JavaScript.ORDER_ATOMIC];
  };

  Blockly.Variables.flyoutCategoryBlocks = function(workspace) {
    const variableModelList = workspace.getVariablesOfType('');
    const eventVariableList = [];
    const eventBlockNames = ['on_player_collide', 'on_arrow_collide', 'on_platform_collide', 'raycast'];

    for (const blockName of eventBlockNames) {
      for (const block of workspace.getBlocksByType(blockName)) {
        for (const varModel of block.getVarModels()) {
          if (!eventVariableList.includes(varModel)) eventVariableList.push(varModel);
        }
      }
    }

    const xmlList = [];
    if (variableModelList.length > 0) {
      let mostRecentVariable = null;

      for (let i = variableModelList.length - 1; i >= 0; i--) {
        if (eventVariableList.includes(variableModelList[i])) continue;
        mostRecentVariable = variableModelList[i];
        break;
      }

      if (mostRecentVariable) {
        const setBlock = Blockly.utils.xml.createElement('block');
        setBlock.setAttribute('type', 'variables_set');
        setBlock.setAttribute('gap', Blockly.Blocks['math_change'] ? 8 : 24);
        setBlock.appendChild(Blockly.Variables.generateVariableFieldDom(mostRecentVariable));
        setBlock.appendChild(Blockly.Xml.textToDom('<mutation playerid_input="false" show_dropdown="' +
                          !Blockly.Variables.generateVariableFieldDom(mostRecentVariable).innerHTML.startsWith('GLOBAL_') + '"></mutation>'));
        xmlList.push(setBlock);

        const changeBlock = Blockly.utils.xml.createElement('block');
        changeBlock.setAttribute('type', 'math_change');
        changeBlock.setAttribute('gap', Blockly.Blocks['variables_get'] ? 20 : 8);
        changeBlock.appendChild(Blockly.Variables.generateVariableFieldDom(mostRecentVariable));
        changeBlock.appendChild(Blockly.Xml.textToDom('<mutation playerid_input="false" show_dropdown="' +
                          !Blockly.Variables.generateVariableFieldDom(mostRecentVariable).innerHTML.startsWith('GLOBAL_') + '"></mutation>'));
        changeBlock.appendChild(Blockly.Xml.textToDom(
            '<value name="DELTA">' +
            '<shadow type="math_number">' +
            '<field name="NUM">1</field>' +
            '</shadow>' +
            '</value>'));
        xmlList.push(changeBlock);

        const retainBlock = Blockly.utils.xml.createElement('block');
        retainBlock.setAttribute('type', 'variables_retain_value');
        retainBlock.appendChild(Blockly.Variables.generateVariableFieldDom(mostRecentVariable));

        xmlList.push(retainBlock);
      }

      if (Blockly.Blocks['variables_get']) {
        variableModelList.sort(Blockly.VariableModel.compareByName);
        eventVariableList.sort(Blockly.VariableModel.compareByName);
        for (let i = 0, variable; (variable = variableModelList[i]); i++) {
          if (eventVariableList.includes(variable)) continue;
          const block = Blockly.utils.xml.createElement('block');
          block.setAttribute('type', 'variables_get');
          block.setAttribute('gap', 8);
          block.appendChild(Blockly.Variables.generateVariableFieldDom(variable));
          block.appendChild(Blockly.Xml.textToDom('<mutation playerid_input="false" show_dropdown="' +
                            !Blockly.Variables.generateVariableFieldDom(variable).innerHTML.startsWith('GLOBAL_') + '"></mutation>'));
          xmlList.push(block);
        }

        if (eventVariableList.length > 0) {
          const eventsSep = Blockly.utils.xml.createElement('label');
          eventsSep.setAttribute('gap', 8);
          xmlList.push(eventsSep);

          const eventsLabel = Blockly.utils.xml.createElement('label');
          eventsLabel.setAttribute('text', 'Variables used by events:');
          xmlList.push(eventsLabel);
        }

        for (let i = 0, variable; (variable = eventVariableList[i]); i++) {
          const block = Blockly.utils.xml.createElement('block');
          block.setAttribute('type', 'variables_get');
          block.setAttribute('gap', 8);
          block.appendChild(Blockly.Variables.generateVariableFieldDom(variable));
          block.appendChild(Blockly.Xml.textToDom('<mutation playerid_input="false" show_dropdown="' +
                            !Blockly.Variables.generateVariableFieldDom(variable).innerHTML.startsWith('GLOBAL_') + '"></mutation>'));
          xmlList.push(block);
        }
      }
    }
    return xmlList;
  };

  Blockly.FieldVariable.dropdownCreate = function() {
    if (!this.variable_) {
      throw Error(
          'Tried to call dropdownCreate on a variable field with no' +
          ' variable selected.');
    }
    const name = this.getText();
    let variableModelList = [];
    if (this.sourceBlock_ && this.sourceBlock_.workspace) {
      const variableTypes = this.getVariableTypes_();
      // Get a copy of the list, so that adding rename and new variable options
      // doesn't modify the workspace's list.
      for (let i = 0; i < variableTypes.length; i++) {
        const variableType = variableTypes[i];
        const variables =
            this.sourceBlock_.workspace.getVariablesOfType(variableType);
        variableModelList = variableModelList.concat(variables);
      }
    }
    variableModelList.sort(Blockly.VariableModel.compareByName);

    const eventVariableList = [];
    const eventBlockNames = ['on_player_collide', 'on_arrow_collide', 'on_platform_collide', 'raycast'];

    for (const blockName of eventBlockNames) {
      for (const block of this.sourceBlock_.workspace.getBlocksByType(blockName)) {
        for (const varModel of block.getVarModels()) {
          if (!eventVariableList.includes(varModel)) eventVariableList.push(varModel);
        }
      }
    }

    const options = [];
    for (let i = 0; i < variableModelList.length; i++) {
      if (eventVariableList.includes(variableModelList[i]) && !eventBlockNames.includes(this.sourceBlock_.type)) continue;

      // Set the UUID as the internal representation of the variable.
      options.push([variableModelList[i].name, variableModelList[i].getId()]);
    }
    options.push([Blockly.Msg['RENAME_VARIABLE'], 'RENAME_VARIABLE_ID']);
    if (Blockly.Msg['DELETE_VARIABLE']) {
      options.push([
        Blockly.Msg['DELETE_VARIABLE'].replace('%1', name),
        'DELETE_VARIABLE_ID',
      ]);
    }

    return options;
  };

  // fix create repeated list
  Blockly.JavaScript['lists_repeat'] = function(block) {
    // Create a list with one element repeated.
    const functionName = Blockly.JavaScript.provideFunction_('listsRepeat', [
      'function ' + Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_ + '(value, n) {',
      '  var array = [];', '  for (var i = 0; i < n; i++) {',
      '    array[i] = JSON.parse(JSON.stringify(value));', '  }', '  return array;', '}',
    ]);
    const element =
        Blockly.JavaScript.valueToCode(block, 'ITEM', Blockly.JavaScript.ORDER_NONE) || 'null';
    const repeatCount =
        Blockly.JavaScript.valueToCode(block, 'NUM', Blockly.JavaScript.ORDER_NONE) || '0';
    const code = functionName + '(' + element + ', ' + repeatCount + ')';
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
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
    let setCode = '';
    const variables = block.getVars();
    for (let i = 0; i < variables.length; i++) {
      args[i] = Blockly.JavaScript.nameDB_.getName(variables[i],
          Blockly.VARIABLE_CATEGORY_NAME);
      setCode += `gm.blockly.funcs.setVar('${args[i]}', gst, playerid, ${args[i]});`;
    }
    let code = 'function ' + funcName + '(gst, playerid, ' + args.join(', ') + ') {let loopIterations = 0;' +
        setCode + xfix1 + branch + xfix2 + returnValue + '}';
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

  Blockly.JavaScript['math_random_int'] = function(block) {
    // Random integer between [X] and [Y].
    const argument0 = Blockly.JavaScript.valueToCode(block, 'FROM',
        Blockly.JavaScript.ORDER_NONE) || '0';
    const argument1 = Blockly.JavaScript.valueToCode(block, 'TO',
        Blockly.JavaScript.ORDER_NONE) || '0';
    const functionName = Blockly.JavaScript.provideFunction_(
        'mathRandomInt',
        ['function ' + Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_ +
            '(a, b) {',
        '  if (a > b) {',
        '    // Swap a and b to ensure a is smaller.',
        '    var c = a;',
        '    a = b;',
        '    b = c;',
        '  }',
        '  return Math.floor(gm.physics.pseudoRandom() * (b - a + 1) + a);',
        '}']);
    const code = functionName + '(' + argument0 + ', ' + argument1 + ')';
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
  };

  Blockly.JavaScript['math_random_float'] = function(block) {
    // Random fraction between 0 and 1.
    return ['gm.physics.pseudoRandom()', Blockly.JavaScript.ORDER_FUNCTION_CALL];
  };

  Blockly.JavaScript['colour_random'] = function(block) {
    // Generate a random colour.
    const functionName = Blockly.JavaScript.provideFunction_('colourRandom', [
      'function ' + Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_ + '() {',
      '  var num = Math.floor(gm.physics.pseudoRandom() * Math.pow(2, 24));',
      '  return \'#\' + (\'00000\' + num.toString(16)).substr(-6);', '}',
    ]);
    const code = functionName + '()';
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
  };

  const forceString = function(value) {
    if (/^\s*'([^']|\\')*'\s*$/.test(value)) {
      return [value, Blockly.JavaScript.ORDER_ATOMIC];
    }
    return ['String(' + value + ')', Blockly.JavaScript.ORDER_FUNCTION_CALL];
  };

  Blockly.JavaScript['text_append'] = function(block) {
    // Append to a variable in place.
    const varName = Blockly.JavaScript.nameDB_.getName(
        block.getFieldValue('VAR'), Blockly.VARIABLE_CATEGORY_NAME);
    const value = Blockly.JavaScript.valueToCode(block, 'TEXT',
        Blockly.JavaScript.ORDER_NONE) || '\'\'';
    const code = 'gm.blockly.funcs.changeVar("' + varName + '", gst, playerid, ' +
        forceString(value)[0] + ');\n';
    return code;
  };

  Blockly.JavaScript['text_charAt'] = function(block) {
    // Get letter at index.
    // Note: Until January 2013 this block did not have the WHERE input.
    const where = block.getFieldValue('WHERE') || 'FROM_START';
    const textOrder = (where === 'RANDOM') ? Blockly.JavaScript.ORDER_NONE :
       Blockly.JavaScript.ORDER_MEMBER;
    const text = Blockly.JavaScript.valueToCode(block, 'VALUE',
        textOrder) || '\'\'';
    switch (where) {
      case 'FIRST': {
        const code = text + '.charAt(0)';
        return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
      }
      case 'LAST': {
        const code = text + '.slice(-1)';
        return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
      }
      case 'FROM_START': {
        const at = Blockly.JavaScript.getAdjusted(block, 'AT');
        // Adjust index if using one-based indices.
        const code = text + '.charAt(' + at + ')';
        return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
      }
      case 'FROM_END': {
        const at = Blockly.JavaScript.getAdjusted(block, 'AT', 1, true);
        const code = text + '.slice(' + at + ').charAt(0)';
        return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
      }
      case 'RANDOM': {
        const functionName = Blockly.JavaScript.provideFunction_(
            'textRandomLetter',
            ['function ' + Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_ +
                '(text) {',
            '  var x = Math.floor(gm.physics.pseudoRandom() * text.length);',
            '  return text[x];',
            '}']);
        const code = functionName + '(' + text + ')';
        return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
      }
    }
    throw Error('Unhandled option (text_charAt).');
  };

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
          [Blockly.Msg['LISTS_GET_INDEX_RANDOM'], 'RANDOM'],
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
    this.setOutput(true);
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
        case 'SET RANDOM':
          tooltip = Blockly.Msg['LISTS_SET_INDEX_TOOLTIP_SET_RANDOM'];
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
        case 'INSERT RANDOM':
          tooltip = Blockly.Msg['LISTS_SET_INDEX_TOOLTIP_INSERT_RANDOM'];
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
          [Blockly.Msg['LISTS_GET_INDEX_REMOVE'], 'REMOVE'],
        ];
    this.WHERE_OPTIONS =
        [
          [Blockly.Msg['LISTS_GET_INDEX_FROM_START'], 'FROM_START'],
          [Blockly.Msg['LISTS_GET_INDEX_FROM_END'], 'FROM_END'],
          [Blockly.Msg['LISTS_GET_INDEX_FIRST'], 'FIRST'],
          [Blockly.Msg['LISTS_GET_INDEX_LAST'], 'LAST'],
          [Blockly.Msg['LISTS_GET_INDEX_RANDOM'], 'RANDOM'],
        ];
    this.setHelpUrl(Blockly.Msg['LISTS_GET_INDEX_HELPURL']);
    this.setStyle('list_blocks');
    const modeMenu = new Blockly.FieldDropdown(MODE, function(value) {
      const isStatement = false;
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
        case 'GET RANDOM':
          tooltip = Blockly.Msg['LISTS_GET_INDEX_TOOLTIP_GET_RANDOM'];
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
        case 'GET_REMOVE RANDOM':
          tooltip = Blockly.Msg['LISTS_GET_INDEX_TOOLTIP_GET_REMOVE_RANDOM'];
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
        case 'REMOVE RANDOM':
          tooltip = Blockly.Msg['LISTS_GET_INDEX_TOOLTIP_REMOVE_RANDOM'];
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

  // Loops using vars fix
  Blockly.JavaScript['controls_for'] = function(block) {
    // For loop.
    const variable0 = Blockly.JavaScript.nameDB_.getName(
        block.getFieldValue('VAR'), Blockly.VARIABLE_CATEGORY_NAME);
    const argument0 = Blockly.JavaScript.valueToCode(block, 'FROM',
        Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
    const argument1 = Blockly.JavaScript.valueToCode(block, 'TO',
        Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
    const increment = Blockly.JavaScript.valueToCode(block, 'BY',
        Blockly.JavaScript.ORDER_ASSIGNMENT) || '1';
    let branch = Blockly.JavaScript.statementToCode(block, 'DO');
    branch = Blockly.JavaScript.addLoopTrap(branch, block);
    let code;
    if (Blockly.isNumber(argument0) && Blockly.isNumber(argument1) &&
        Blockly.isNumber(increment)) {
      // All arguments are simple numbers.
      const up = Number(argument0) <= Number(argument1);
      code = 'for (let ' + variable0 + ' = ' + argument0 + '; ' +
          variable0 + (up ? ' <= ' : ' >= ') + argument1 + '; ' +
          variable0;
      const step = Math.abs(Number(increment));
      if (step === 1) {
        code += up ? '++' : '--';
      } else {
        code += (up ? ' += ' : ' -= ') + step;
      }
      code += ') {' + `gm.blockly.funcs.setVar("${variable0}", gst, playerid, ${variable0});` + branch + '}\n';
    } else {
      code = '';
      // Cache non-trivial values to variables to prevent repeated look-ups.
      let startVar = argument0;
      if (!argument0.match(/^\w+$/) && !Blockly.isNumber(argument0)) {
        startVar = Blockly.JavaScript.nameDB_.getDistinctName(
            variable0 + '_start', Blockly.VARIABLE_CATEGORY_NAME);
        code += 'let ' + startVar + ' = ' + argument0 + ';\n';
      }
      let endVar = argument1;
      if (!argument1.match(/^\w+$/) && !Blockly.isNumber(argument1)) {
        endVar = Blockly.JavaScript.nameDB_.getDistinctName(
            variable0 + '_end', Blockly.VARIABLE_CATEGORY_NAME);
        code += 'let ' + endVar + ' = ' + argument1 + ';\n';
      }
      // Determine loop direction at start, in case one of the bounds
      // changes during loop execution.
      const incVar = Blockly.JavaScript.nameDB_.getDistinctName(
          variable0 + '_inc', Blockly.VARIABLE_CATEGORY_NAME);
      code += 'let ' + incVar + ' = ';
      if (Blockly.isNumber(increment)) {
        code += Math.abs(increment) + ';\n';
      } else {
        code += 'Math.abs(' + increment + ');\n';
      }
      code += 'if (' + startVar + ' > ' + endVar + ') {\n';
      code += Blockly.JavaScript.INDENT + incVar + ' = -' + incVar + ';\n';
      code += '}\n';
      code += 'for (let ' + variable0 + ' = ' + startVar + '; ' +
          incVar + ' >= 0 ? ' +
          variable0 + ' <= ' + endVar + ' : ' +
          variable0 + ' >= ' + endVar + '; ' +
          variable0 + ' += ' + incVar + ') {' +
          `gm.blockly.funcs.setVar("${variable0}", gst, playerid, ${variable0});` +
          branch + '}';
    }
    return code;
  };

  Blockly.JavaScript['controls_forEach'] = function(block) {
    // For each loop.
    const variable0 = Blockly.JavaScript.nameDB_.getName(
        block.getFieldValue('VAR'), Blockly.VARIABLE_CATEGORY_NAME);
    const argument0 = Blockly.JavaScript.valueToCode(block, 'LIST',
        Blockly.JavaScript.ORDER_ASSIGNMENT) || '[]';
    let branch = Blockly.JavaScript.statementToCode(block, 'DO');
    branch = Blockly.JavaScript.addLoopTrap(branch, block);
    let code = '';
    // Cache non-trivial values to variables to prevent repeated look-ups.
    let listVar = argument0;
    if (!argument0.match(/^\w+$/)) {
      listVar = Blockly.JavaScript.nameDB_.getDistinctName(
          variable0 + '_list', Blockly.VARIABLE_CATEGORY_NAME);
      code += 'let ' + listVar + ' = ' + argument0 + ';\n';
    }
    const indexVar = Blockly.JavaScript.nameDB_.getDistinctName(
        variable0 + '_index', Blockly.VARIABLE_CATEGORY_NAME);
    branch = `gm.blockly.funcs.setVar("${variable0}", gst, playerid, ${listVar}[${indexVar}]);${branch}`;
    code += 'for (let ' + indexVar + ' in ' + listVar + ') {' + branch + '}\n';
    return code;
  };

  // use safetrig
  Blockly.JavaScript['math_single'] = function(block) {
    // Math operators with single operand.
    const operator = block.getFieldValue('OP');
    let code;
    let arg;
    if (operator === 'NEG') {
      // Negation is a special case given its different operator precedence.
      arg = Blockly.JavaScript.valueToCode(block, 'NUM',
          Blockly.JavaScript.ORDER_UNARY_NEGATION) || '0';
      if (arg[0] === '-') {
        // --3 is not legal in JS.
        arg = ' ' + arg;
      }
      code = '-' + arg;
      return [code, Blockly.JavaScript.ORDER_UNARY_NEGATION];
    }
    if (operator === 'SIN' || operator === 'COS' || operator === 'TAN') {
      arg = Blockly.JavaScript.valueToCode(block, 'NUM',
          Blockly.JavaScript.ORDER_DIVISION) || '0';
    } else {
      arg = Blockly.JavaScript.valueToCode(block, 'NUM',
          Blockly.JavaScript.ORDER_NONE) || '0';
    }
    // First, handle cases which generate values that don't need parentheses
    // wrapping the code.
    switch (operator) {
      case 'ABS':
        code = 'Math.abs(' + arg + ')';
        break;
      case 'ROOT':
        code = 'Math.sqrt(' + arg + ')';
        break;
      case 'LN':
        code = 'Math.log(' + arg + ')';
        break;
      case 'EXP':
        code = 'Math.exp(' + arg + ')';
        break;
      case 'POW10':
        code = 'Math.pow(10,' + arg + ')';
        break;
      case 'ROUND':
        code = 'Math.round(' + arg + ')';
        break;
      case 'ROUNDUP':
        code = 'Math.ceil(' + arg + ')';
        break;
      case 'ROUNDDOWN':
        code = 'Math.floor(' + arg + ')';
        break;
      case 'SIN':
        code = 'SafeTrig.safeSin(' + arg + ' / 180 * Math.PI)';
        break;
      case 'COS':
        code = 'SafeTrig.safeCos(' + arg + ' / 180 * Math.PI)';
        break;
      case 'TAN':
        code = 'SafeTrig.safeTan(' + arg + ' / 180 * Math.PI)';
        break;
    }
    if (code) {
      return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
    }
    // Second, handle cases which generate values that may need parentheses
    // wrapping the code.
    switch (operator) {
      case 'LOG10':
        code = 'Math.log(' + arg + ') / Math.log(10)';
        break;
      case 'ASIN':
        code = 'Math.sin(' + arg + ') / Math.PI * 180';
        break;
      case 'ACOS':
        code = 'Math.acos(' + arg + ') / Math.PI * 180';
        break;
      case 'ATAN':
        code = 'Math.atan(' + arg + ') / Math.PI * 180';
        break;
      default:
        throw Error('Unknown math operator: ' + operator);
    }
    return [code, Blockly.JavaScript.ORDER_DIVISION];
  };

  // fix lists

  Blockly.JavaScript['lists_length'] = function(block) {
    // String or array length.
    let list = Blockly.JavaScript.valueToCode(block, 'VALUE',
        Blockly.JavaScript.ORDER_MEMBER) || '[]';
    list = `(typeof ${list} === 'object' ? ${list} : [])`;
    return [list + '.length', Blockly.JavaScript.ORDER_MEMBER];
  };

  Blockly.JavaScript['lists_isEmpty'] = function(block) {
    // Is the string null or array empty?
    var list = Blockly.JavaScript.valueToCode(block, 'VALUE',
        Blockly.JavaScript.ORDER_MEMBER) || '[]';
    list = `(typeof ${list} === 'object' ? ${list} : [])`;
    return ['!' + list + '.length', Blockly.JavaScript.ORDER_LOGICAL_NOT];
  };

  Blockly.JavaScript['lists_indexOf'] = function(block) {
    // Find an item in the list.
    const operator =
        block.getFieldValue('END') === 'FIRST' ? 'indexOf' : 'lastIndexOf';
    const item =
       Blockly.JavaScript.valueToCode(block, 'FIND', Blockly.JavaScript.ORDER_NONE) || '\'\'';
    let list =
       Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_MEMBER) || '[]';
    list = `(typeof ${list} === 'object' ? ${list} : [])`;
    const code = list + '.' + operator + '(' + item + ')';
    if (block.workspace.options.oneBasedIndex) {
      return [code + ' + 1', Blockly.JavaScript.ORDER_ADDITION];
    }
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
  };

  Blockly.JavaScript['lists_getIndex'] = function(block) {
    // Get element at index.
    // Note: Until January 2013 this block did not have MODE or WHERE inputs.
    const mode = block.getFieldValue('MODE') || 'GET';
    const where = block.getFieldValue('WHERE') || 'FROM_START';
    const listOrder =
        (where === 'RANDOM') ?Blockly.JavaScript.ORDER_NONE :Blockly.JavaScript.ORDER_MEMBER;
    let list =Blockly.JavaScript.valueToCode(block, 'VALUE', listOrder) || '[]';
    list = `(typeof ${list} === 'object' ? ${list} : [])`;

    switch (where) {
      case ('FIRST'):
        if (mode === 'GET') {
          const code = list + '[0]';
          return [code, Blockly.JavaScript.ORDER_MEMBER];
        } else if (mode === 'GET_REMOVE') {
          const code = list + '.shift()';
          return [code, Blockly.JavaScript.ORDER_MEMBER];
        } else if (mode === 'REMOVE') {
          const code = list + '.slice(1)';
          return [code, Blockly.JavaScript.ORDER_MEMBER];
        }
        break;
      case ('LAST'):
        if (mode === 'GET') {
          const code = list + '.slice(-1)[0]';
          return [code, Blockly.JavaScript.ORDER_MEMBER];
        } else if (mode === 'GET_REMOVE') {
          const code = list + '.pop()';
          return [code, Blockly.JavaScript.ORDER_MEMBER];
        } else if (mode === 'REMOVE') {
          const code = list + '.splice(-1)';
          return [code, Blockly.JavaScript.ORDER_MEMBER];
        }
        break;
      case ('FROM_START'): {
        const at =Blockly.JavaScript.getAdjusted(block, 'AT');
        if (mode === 'GET') {
          const code = list + '[' + at + ']';
          return [code, Blockly.JavaScript.ORDER_MEMBER];
        } else if (mode === 'GET_REMOVE') {
          const code = list + '.splice(' + at + ', 1)[0]';
          return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
        } else if (mode === 'REMOVE') {
          const code = list + '.splice(' + at + ', 1)';
          return [code, Blockly.JavaScript.ORDER_MEMBER];
        }
        break;
      }
      case ('FROM_END'): {
        const at = Blockly.JavaScript.getAdjusted(block, 'AT', 1, true);
        if (mode === 'GET') {
          const code = list + '.slice(' + at + ')[0]';
          return [code, Blockly.JavaScript.ORDER_MEMBER];
        } else if (mode === 'GET_REMOVE') {
          const code = list + '.splice(' + at + ', 1)[0]';
          return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
        } else if (mode === 'REMOVE') {
          const code = list + '.splice(' + at + ', 1)';
          return [code, Blockly.JavaScript.ORDER_MEMBER];
        }
        break;
      }
      case ('RANDOM'): {
        const functionName =Blockly.JavaScript.provideFunction_('listsGetRandomItem', [
          'function ' +Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_ +
              '(list, remove) {',
          '  var x = Math.floor(gm.physics.pseudoRandom() * list.length);', '  if (remove) {',
          '    list.splice(x, 1)[0]; return list;', '  } else {', '    return list[x];',
          '  }', '}',
        ]);
        const code = functionName + '(' + list + ', ' + (mode !== 'GET') + ')';
        return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
        break;
      }
    }
    throw Error('Unhandled combination (lists_getIndex).');
  };

  Blockly.JavaScript['lists_setIndex'] = function(block) {
    // Set element at index.
    // Note: Until February 2013 this block did not have MODE or WHERE inputs.
    let list =
       Blockly.JavaScript.valueToCode(block, 'LIST', Blockly.JavaScript.ORDER_MEMBER) || '[]';
    list = `(typeof ${list} === 'object' ? ${list} : [])`;
    const mode = block.getFieldValue('MODE') || 'GET';
    const where = block.getFieldValue('WHERE') || 'FROM_START';
    const value =
       Blockly.JavaScript.valueToCode(block, 'TO', Blockly.JavaScript.ORDER_ASSIGNMENT) ||
        'null';
    // Cache non-trivial values to variables to prevent repeated look-ups.
    // Closure, which accesses and modifies 'list'.

    switch (where) {
      case ('FIRST'):
        if (mode === 'SET') {
          const code = 'gm.blockly.funcs.setInArray(' + list + ', 0, ' + value + ')';
          return [code, Blockly.JavaScript.ORDER_MEMBER];
        } else if (mode === 'INSERT') {
          const code = '[' + value + ', ...' + list + ']';
          return [code, Blockly.JavaScript.ORDER_MEMBER];
        }
        break;
      case ('LAST'):
        if (mode === 'SET') {
          const code = 'gm.blockly.funcs.setInArray(' + list + ', ' + list + '.length - 1, ' + value + ')';
          return [code, Blockly.JavaScript.ORDER_MEMBER];
        } else if (mode === 'INSERT') {
          const code = '[...' + list + ', ' + value + ']';
          return [code, Blockly.JavaScript.ORDER_MEMBER];
        }
        break;
      case ('FROM_START'): {
        const at =Blockly.JavaScript.getAdjusted(block, 'AT');
        if (mode === 'SET') {
          const code = 'gm.blockly.funcs.setInArray(' + list + ', ' + at + ', ' + value + ')';
          return [code, Blockly.JavaScript.ORDER_MEMBER];
        } else if (mode === 'INSERT') {
          const code = 'gm.blockly.funcs.insertInArray(' + list + ', ' + at + ', ' + value + ')';
          return [code, Blockly.JavaScript.ORDER_MEMBER];
        }
        break;
      }
      case ('FROM_END'): {
        const at =Blockly.JavaScript.getAdjusted(
            block, 'AT', 1, false, Blockly.JavaScript.ORDER_SUBTRACTION);
        if (mode === 'SET') {
          const code = 'gm.blockly.funcs.setInArray(' + list + ', ' + list + '.length - ' + at + ', ' + value + ')';
          return [code, Blockly.JavaScript.ORDER_MEMBER];
        } else if (mode === 'INSERT') {
          const code = 'gm.blockly.funcs.insertInArray(' + list + ', ' + list + '.length - ' + at + ', ' + value + ')';
          return [code, Blockly.JavaScript.ORDER_MEMBER];
        }
        break;
      }
      case ('RANDOM'): {
        let code = '';
        if (mode === 'SET') {
          code += 'gm.blockly.funcs.setInArray(' + list + ', ' + 'Math.floor(gm.physics.pseudoRandom() * ' + list +
          '.length)' + ', ' + value + ')';
          return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
        } else if (mode === 'INSERT') {
          code += 'gm.blockly.funcs.insertInArray(' + list + ', ' + 'Math.floor(gm.physics.pseudoRandom() * ' + list +
          '.length)' + ', ' + value + ')';
          return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
        }
        break;
      }
    }
    throw Error('Unhandled combination (lists_setIndex).');
  };

  /**
   * Returns an expression calculating the index into a list.
   * @param {string} listName Name of the list, used to calculate length.
   * @param {string} where The method of indexing, selected by dropdown in Blockly
   * @param {string=} opt_at The optional offset when indexing from start/end.
   * @return {string|undefined} Index expression.
   */
  const getSubstringIndex = function(listName, where, opt_at) {
    if (where === 'FIRST') {
      return '0';
    } else if (where === 'FROM_END') {
      return listName + '.length - 1 - ' + opt_at;
    } else if (where === 'LAST') {
      return listName + '.length - 1';
    } else {
      return opt_at;
    }
  };

  Blockly.JavaScript['lists_getSublist'] = function(block) {
    // Get sublist.
    let list =
       Blockly.JavaScript.valueToCode(block, 'LIST', Blockly.JavaScript.ORDER_MEMBER) || '[]';
    list = `(typeof ${list} === 'object' ? ${list} : [])`;
    const where1 = block.getFieldValue('WHERE1');
    const where2 = block.getFieldValue('WHERE2');
    let code;
    if (where1 === 'FIRST' && where2 === 'LAST') {
      code = list + '.slice(0)';
    } else if (
      list.match(/^\w+$/) ||
        (where1 !== 'FROM_END' && where2 === 'FROM_START')) {
      // If the list is a variable or doesn't require a call for length, don't
      // generate a helper function.
      let at1;
      switch (where1) {
        case 'FROM_START':
          at1 =Blockly.JavaScript.getAdjusted(block, 'AT1');
          break;
        case 'FROM_END':
          at1 =Blockly.JavaScript.getAdjusted(
              block, 'AT1', 1, false, Blockly.JavaScript.ORDER_SUBTRACTION);
          at1 = list + '.length - ' + at1;
          break;
        case 'FIRST':
          at1 = '0';
          break;
        default:
          throw Error('Unhandled option (lists_getSublist).');
      }
      let at2;
      switch (where2) {
        case 'FROM_START':
          at2 =Blockly.JavaScript.getAdjusted(block, 'AT2', 1);
          break;
        case 'FROM_END':
          at2 =Blockly.JavaScript.getAdjusted(
              block, 'AT2', 0, false, Blockly.JavaScript.ORDER_SUBTRACTION);
          at2 = list + '.length - ' + at2;
          break;
        case 'LAST':
          at2 = list + '.length';
          break;
        default:
          throw Error('Unhandled option (lists_getSublist).');
      }
      code = list + '.slice(' + at1 + ', ' + at2 + ')';
    } else {
      const at1 =Blockly.JavaScript.getAdjusted(block, 'AT1');
      const at2 =Blockly.JavaScript.getAdjusted(block, 'AT2');
      const wherePascalCase = {
        'FIRST': 'First',
        'LAST': 'Last',
        'FROM_START': 'FromStart',
        'FROM_END': 'FromEnd',
      };
      const functionName =Blockly.JavaScript.provideFunction_(
          'subsequence' + wherePascalCase[where1] + wherePascalCase[where2], [
            'function ' +Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_ + '(sequence' +
                // The value for 'FROM_END' and'FROM_START' depends on `at` so
                // we add it as a parameter.
                ((where1 === 'FROM_END' || where1 === 'FROM_START') ? ', at1' :
                                                                      '') +
                ((where2 === 'FROM_END' || where2 === 'FROM_START') ? ', at2' :
                                                                      '') +
                ') {',
            getSubstringIndex('sequence', where1, 'at1') + ';',
            '  var end = ' + getSubstringIndex('sequence', where2, 'at2') +
                ' + 1;',
            '  return sequence.slice(start, end);', '}',
          ]);
      code = functionName + '(' + list +
          // The value for 'FROM_END' and 'FROM_START' depends on `at` so we
          // pass it.
          ((where1 === 'FROM_END' || where1 === 'FROM_START') ? ', ' + at1 : '') +
          ((where2 === 'FROM_END' || where2 === 'FROM_START') ? ', ' + at2 : '') +
          ')';
    }
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
  };

  Blockly.JavaScript['lists_sort'] = function(block) {
    // Block for sorting a list.
    let list =
       Blockly.JavaScript.valueToCode(block, 'LIST', Blockly.JavaScript.ORDER_FUNCTION_CALL) ||
        '[]';
    list = `(typeof ${list} === 'object' ? ${list} : [])`;
    const direction = block.getFieldValue('DIRECTION') === '1' ? 1 : -1;
    const type = block.getFieldValue('TYPE');
    const getCompareFunctionName =
       Blockly.JavaScript.provideFunction_('listsGetSortCompare', [
         'function ' +Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_ +
              '(type, direction) {',
         '  var compareFuncs = {', '    "NUMERIC": function(a, b) {',
         '        return Number(a) - Number(b); },',
         '    "TEXT": function(a, b) {',
         '        return a.toString() > b.toString() ? 1 : -1; },',
         '    "IGNORE_CASE": function(a, b) {',
         '        return a.toString().toLowerCase() > ' +
              'b.toString().toLowerCase() ? 1 : -1; },',
         '  };', '  var compare = compareFuncs[type];',
         '  return function(a, b) { return compare(a, b) * direction; }', '}',
       ]);
    return [
      list + '.slice().sort(' + getCompareFunctionName + '("' + type + '", ' +
          direction + '))',
      Blockly.JavaScript.ORDER_FUNCTION_CALL,
    ];
  };

  Blockly.JavaScript['lists_split'] = function(block) {
    // Block for splitting text into a list, or joining a list into text.
    let input = Blockly.JavaScript.valueToCode(block, 'INPUT', Blockly.JavaScript.ORDER_MEMBER);
    const delimiter =
        Blockly.JavaScript.valueToCode(block, 'DELIM', Blockly.JavaScript.ORDER_NONE) || '\'\'';
    const mode = block.getFieldValue('MODE');
    let functionName;
    if (mode === 'SPLIT') {
      if (!input) {
        input = '\'\'';
      }
      functionName = 'split';
    } else if (mode === 'JOIN') {
      if (!input) {
        input = '[]';
      }
      functionName = 'join';
    } else {
      throw Error('Unknown mode: ' + mode);
    }
    const code = input + '?.' + functionName + '(' + delimiter + ') || ' + (mode === 'SPLIT' ? '[]' : '\'\'');
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
  };

  Blockly.JavaScript['lists_reverse'] = function(block) {
    // Block for reversing a list.
    let list =
       Blockly.JavaScript.valueToCode(block, 'LIST', Blockly.JavaScript.ORDER_FUNCTION_CALL) ||
        '[]';
    list = `(typeof ${list} === 'object' ? ${list} : [])`;
    const code = list + '.slice().reverse()';
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
  };
}
