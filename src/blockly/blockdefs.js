module.exports = [{
  'type': 'event_roundstart',
  'message0': 'on round start %1 run per player? %2 %3 store player id in var %4 %5 %6',
  'args0': [
    {
      'type': 'input_dummy',
    },
    {
      'type': 'field_checkbox',
      'name': 'perplayer',
      'checked': true,
    },
    {
      'type': 'input_dummy',
    },
    {
      'type': 'field_variable',
      'name': 'player_id',
      'variable': 'id',
    },
    {
      'type': 'input_dummy',
      'align': 'RIGHT',
    },
    {
      'type': 'input_statement',
      'name': 'code',
    },
  ],
  'colour': 30,
  'tooltip': '',
  'helpUrl': '',
},
{
  'type': 'event_step',
  'message0': 'on game step (30fps) %1 run per player? %2 %3 store player id in var %4 %5 %6',
  'args0': [
    {
      'type': 'input_dummy',
    },
    {
      'type': 'field_checkbox',
      'name': 'perplayer',
      'checked': true,
    },
    {
      'type': 'input_dummy',
    },
    {
      'type': 'field_variable',
      'name': 'player_id',
      'variable': 'id',
    },
    {
      'type': 'input_dummy',
      'align': 'RIGHT',
    },
    {
      'type': 'input_statement',
      'name': 'code',
    },
  ],
  'colour': 30,
  'tooltip': '',
  'helpUrl': '',
},
{
  'type': 'event_collision',
  'message0': 'on collision between %1 and %2 %3 store info in variables? %4 %5 %6',
  'args0': [
    {
      'type': 'field_dropdown',
      'name': 'col_a',
      'options': [
        [
          'disc',
          'disc',
        ],
        [
          'arrow',
          'arrow',
        ],
        [
          'body',
          'body',
        ],
      ],
    },
    {
      'type': 'field_dropdown',
      'name': 'col_b',
      'options': [
        [
          'disc',
          'disc',
        ],
        [
          'arrow',
          'arrow',
        ],
        [
          'body',
          'body',
        ],
      ],
    },
    {
      'type': 'input_dummy',
    },
    {
      'type': 'field_checkbox',
      'name': 'store_info',
      'checked': true,
    },
    {
      'type': 'input_dummy',
    },
    {
      'type': 'input_statement',
      'name': 'code',
    },
  ],
  'colour': 30,
  'tooltip': '',
  'helpUrl': '',
},
{
  'type': 'event_playerdie',
  'message0': 'on player die %1 store player id in var %2 %3 %4',
  'args0': [
    {
      'type': 'input_dummy',
    },
    {
      'type': 'field_variable',
      'name': 'player_id',
      'variable': 'id',
    },
    {
      'type': 'input_dummy',
      'align': 'RIGHT',
    },
    {
      'type': 'input_statement',
      'name': 'code',
    },
  ],
  'colour': 30,
  'tooltip': '',
  'helpUrl': '',
},
{
  'type': 'disc_prop_set',
  'message0': '%1 disc %2 \'s %3 to %4',
  'args0': [
    {
      'type': 'field_dropdown',
      'name': 'set_option',
      'options': [
        [
          'set',
          'set',
        ],
        [
          'change',
          'change',
        ],
        [
          'multiply',
          'multiply',
        ],
        [
          'divide',
          'divide',
        ],
      ],
    },
    {
      'type': 'input_value',
      'name': 'id',
      'check': 'Number',
    },
    {
      'type': 'field_dropdown',
      'name': 'property',
      'options': [
        [
          'position',
          'p',
        ],
        [
          'velocity',
          'lv',
        ],
        [
          'angle',
          'a',
        ],
        [
          'angular velocity',
          'av',
        ],
        [
          'special/heavy cooldown',
          'a1a',
        ],
        [
          'arrow aim angle',
          'da',
        ],
        [
          'arrow launch speed',
          'ds',
        ],
        [
          'grapple attached body id',
          'swing.b',
        ],
        [
          'grapple point offset',
          'swing.p',
        ],
        [
          'grapple rod length',
          'swing.l',
        ],
      ],
    },
    {
      'type': 'input_value',
      'name': 'to',
      'align': 'RIGHT',
    },
  ],
  'inputsInline': true,
  'previousStatement': null,
  'nextStatement': null,
  'colour': 230,
  'tooltip': '',
  'helpUrl': '',
},
{
  'type': 'disc_prop_get',
  'message0': 'disc %1 \'s %2',
  'args0': [
    {
      'type': 'input_value',
      'name': 'id',
      'check': 'Number',
    },
    {
      'type': 'field_dropdown',
      'name': 'property',
      'options': [
        [
          'position',
          'p',
        ],
        [
          'velocity',
          'lv',
        ],
        [
          'angle',
          'a',
        ],
        [
          'angular velocity',
          'av',
        ],
        [
          'special/heavy cooldown',
          'a1a',
        ],
        [
          'arrow aim angle',
          'da',
        ],
        [
          'arrow launch speed',
          'ds',
        ],
        [
          'grapple attached body id',
          'swing.b',
        ],
        [
          'grapple point offset',
          'swing.p',
        ],
        [
          'grapple rod length',
          'swing.l',
        ],
      ],
    },
  ],
  'inputsInline': true,
  'output': null,
  'colour': 230,
  'tooltip': '',
  'helpUrl': '',
},
{
  'type': 'arrow_prop_set',
  'message0': '%1 arrow %2 \'s %3 to %4',
  'args0': [
    {
      'type': 'field_dropdown',
      'name': 'set_option',
      'options': [
        [
          'set',
          'set',
        ],
        [
          'change',
          'change',
        ],
        [
          'multiply',
          'multiply',
        ],
        [
          'divide',
          'divide',
        ],
      ],
    },
    {
      'type': 'input_value',
      'name': 'id',
      'check': 'Number',
    },
    {
      'type': 'field_dropdown',
      'name': 'property',
      'options': [
        [
          'position',
          'p',
        ],
        [
          'velocity',
          'lv',
        ],
        [
          'angle',
          'a',
        ],
        [
          'angular velocity',
          'av',
        ],
        [
          'steps until despawn',
          'a1a',
        ],
        [
          'owner player id',
          'da',
        ],
      ],
    },
    {
      'type': 'input_value',
      'name': 'to',
      'align': 'RIGHT',
    },
  ],
  'inputsInline': true,
  'previousStatement': null,
  'nextStatement': null,
  'colour': 230,
  'tooltip': '',
  'helpUrl': '',
},
{
  'type': 'arrow_prop_get',
  'message0': 'arrow %1 \'s %2',
  'args0': [
    {
      'type': 'input_value',
      'name': 'id',
      'check': 'Number',
    },
    {
      'type': 'field_dropdown',
      'name': 'property',
      'options': [
        [
          'position',
          'p',
        ],
        [
          'velocity',
          'lv',
        ],
        [
          'angle',
          'a',
        ],
        [
          'angular velocity',
          'av',
        ],
        [
          'steps until despawn',
          'a1a',
        ],
        [
          'owner player id',
          'da',
        ],
      ],
    },
  ],
  'inputsInline': true,
  'output': null,
  'colour': 230,
  'tooltip': '',
  'helpUrl': '',
},
{
  'type': 'state_obj_exists',
  'message0': '%1 %2 exists',
  'args0': [
    {
      'type': 'field_dropdown',
      'name': 'obj_type',
      'options': [
        [
          'disc',
          'game.state.discs',
        ],
        [
          'arrow',
          'game.state.projectiles',
        ],
        [
          'body',
          'game.state.physics.bodies',
        ],
        [
          'fixture',
          'game.state.physics.fixtures',
        ],
        [
          'shape',
          'game.state.physics.shapes',
        ],
      ],
    },
    {
      'type': 'input_value',
      'name': 'obj_id',
      'check': 'Number',
    },
  ],
  'inputsInline': true,
  'output': 'Boolean',
  'colour': 230,
  'tooltip': '',
  'helpUrl': '',
},
{
  'type': 'player_kill',
  'message0': 'kill player %1 , %2 respawn',
  'args0': [
    {
      'type': 'input_value',
      'name': 'player_id',
      'check': 'Number',
    },
    {
      'type': 'field_dropdown',
      'name': 'allow_respawn',
      'options': [
        [
          'allow',
          'true',
        ],
        [
          'don\'t allow',
          'false',
        ],
      ],
    },
  ],
  'previousStatement': null,
  'nextStatement': null,
  'colour': 230,
  'tooltip': '',
  'helpUrl': '',
},
{
  'type': 'arrow_create',
  'message0': 'create arrow %1 return id %2 %3 owner player id %4 position %5 linear velocity %6 angle %7 steps until despawn %8',
  'args0': [
    {
      'type': 'input_dummy',
    },
    {
      'type': 'field_checkbox',
      'name': 'return_id',
      'checked': false,
    },
    {
      'type': 'input_dummy',
    },
    {
      'type': 'input_value',
      'name': 'did',
      'check': 'Number',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'pos',
      'check': 'Vector',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'lvel',
      'check': 'Vector',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'ang',
      'check': 'Number',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'fte',
      'check': 'Number',
      'align': 'RIGHT',
    },
  ],
  'previousStatement': null,
  'nextStatement': null,
  'colour': 230,
  'tooltip': '',
  'helpUrl': '',
},
{
  'type': 'arrow_delete',
  'message0': 'delete arrow %1',
  'args0': [
    {
      'type': 'input_value',
      'name': 'arrow_id',
      'check': 'Number',
    },
  ],
  'previousStatement': null,
  'nextStatement': null,
  'colour': 230,
  'tooltip': '',
  'helpUrl': '',
},
{
  'type': 'arrow_player_delete',
  'message0': 'delete all arrows of player %1',
  'args0': [
    {
      'type': 'input_value',
      'name': 'player_id',
      'check': 'Number',
    },
  ],
  'previousStatement': null,
  'nextStatement': null,
  'colour': 230,
  'tooltip': '',
  'helpUrl': '',
},
{
  'type': 'arrow_get_player',
  'message0': 'ids of all arrows owned by player %1 as list',
  'args0': [
    {
      'type': 'input_value',
      'name': 'player_id',
      'check': 'Number',
    },
  ],
  'inputsInline': true,
  'output': 'Array',
  'colour': 230,
  'tooltip': '',
  'helpUrl': '',
},
{
  'type': 'input_pressing',
  'message0': 'player %1 is pressing %2',
  'args0': [
    {
      'type': 'input_value',
      'name': 'player_id',
      'check': 'Number',
    },
    {
      'type': 'field_dropdown',
      'name': 'key',
      'options': [
        [
          'up',
          'up',
        ],
        [
          'down',
          'down',
        ],
        [
          'left',
          'left',
        ],
        [
          'right',
          'right',
        ],
        [
          'action (heavy)',
          'action',
        ],
        [
          'action2 (special)',
          'action2',
        ],
        [
          'mouse left button',
          'mouse.left',
        ],
        [
          'mouse middle button',
          'mouse.center',
        ],
        [
          'mouse right button',
          'mouse.right',
        ],
      ],
    },
  ],
  'output': 'Boolean',
  'colour': 230,
  'tooltip': '',
  'helpUrl': '',
},
{
  'type': 'input_override',
  'message0': 'override player %1 \'s %2 key to be %3',
  'args0': [
    {
      'type': 'input_value',
      'name': 'player_id',
      'check': 'Number',
    },
    {
      'type': 'field_dropdown',
      'name': 'key',
      'options': [
        [
          'up',
          'up',
        ],
        [
          'down',
          'down',
        ],
        [
          'left',
          'left',
        ],
        [
          'right',
          'right',
        ],
        [
          'action (heavy)',
          'action',
        ],
        [
          'action2 (special)',
          'action2',
        ],
      ],
    },
    {
      'type': 'input_value',
      'name': 'override',
      'check': 'Boolean',
    },
  ],
  'inputsInline': true,
  'previousStatement': null,
  'nextStatement': null,
  'colour': 230,
  'tooltip': '',
  'helpUrl': '',
},
{
  'type': 'input_override_stop',
  'message0': 'stop overriding player  %1 \'s %2 key',
  'args0': [
    {
      'type': 'input_value',
      'name': 'player_id',
      'check': 'Number',
    },
    {
      'type': 'field_dropdown',
      'name': 'key',
      'options': [
        [
          'up',
          'up',
        ],
        [
          'down',
          'down',
        ],
        [
          'left',
          'left',
        ],
        [
          'right',
          'right',
        ],
        [
          'action (heavy)',
          'action',
        ],
        [
          'action2 (special)',
          'action2',
        ],
      ],
    },
  ],
  'inputsInline': true,
  'previousStatement': null,
  'nextStatement': null,
  'colour': 230,
  'tooltip': '',
  'helpUrl': '',
},
{
  'type': 'input_mouse_pos',
  'message0': 'player %1 \'s mouse position',
  'args0': [
    {
      'type': 'input_value',
      'name': 'player_id',
      'check': 'Number',
    },
  ],
  'output': 'Vector',
  'colour': 230,
  'tooltip': '',
  'helpUrl': '',
},
{
  'type': 'vector_create',
  'message0': 'vector with x: %1 y: %2',
  'args0': [
    {
      'type': 'input_value',
      'name': 'x',
      'check': 'Number',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'y',
      'check': 'Number',
      'align': 'RIGHT',
    },
  ],
  'output': 'Vector',
  'colour': 270,
  'tooltip': '',
  'helpUrl': '',
},
{
  'type': 'vector_arithmetic',
  'message0': 'vec %1 %2 %3',
  'args0': [
    {
      'type': 'input_value',
      'name': 'a',
      'check': 'Vector',
    },
    {
      'type': 'field_dropdown',
      'name': 'NAME',
      'options': [
        [
          '+',
          'add',
        ],
        [
          '-',
          'subtract',
        ],
        [
          '*',
          'multiply',
        ],
        [
          '/',
          'divide',
        ],
      ],
    },
    {
      'type': 'input_value',
      'name': 'b',
      'check': [
        'Vector',
        'Number',
      ],
    },
  ],
  'inputsInline': true,
  'output': 'Vector',
  'colour': 270,
  'tooltip': '',
  'helpUrl': '',
},
{
  'type': 'vector_length',
  'message0': 'magnitude of %1',
  'args0': [
    {
      'type': 'input_value',
      'name': 'v',
      'check': 'Vector',
    },
  ],
  'output': 'Number',
  'colour': 270,
  'tooltip': '',
  'helpUrl': '',
},
{
  'type': 'vector_normalized',
  'message0': 'normalize %1',
  'args0': [
    {
      'type': 'input_value',
      'name': 'v',
      'check': 'Vector',
    },
  ],
  'output': 'Vector',
  'colour': 270,
  'tooltip': '',
  'helpUrl': '',
},
{
  'type': 'vector_distance',
  'message0': 'distance between %1 and %2',
  'args0': [
    {
      'type': 'input_value',
      'name': 'a',
      'check': 'Vector',
    },
    {
      'type': 'input_value',
      'name': 'b',
      'check': 'Vector',
    },
  ],
  'inputsInline': true,
  'output': 'Number',
  'colour': 270,
  'tooltip': '',
  'helpUrl': '',
},
{
  'type': 'vector_dot',
  'message0': 'dot product of %1 and %2',
  'args0': [
    {
      'type': 'input_value',
      'name': 'a',
      'check': 'Vector',
    },
    {
      'type': 'input_value',
      'name': 'b',
      'check': 'Vector',
    },
  ],
  'inputsInline': true,
  'output': 'Number',
  'colour': 270,
  'tooltip': '',
  'helpUrl': '',
},
{
  'type': 'vector_reflect',
  'message0': 'reflect %1 with %2',
  'args0': [
    {
      'type': 'input_value',
      'name': 'a',
      'check': 'Vector',
    },
    {
      'type': 'input_value',
      'name': 'b',
      'check': 'Vector',
    },
  ],
  'inputsInline': true,
  'output': 'Vector',
  'colour': 270,
  'tooltip': '',
  'helpUrl': '',
},
{
  'type': 'vector_rotate',
  'message0': 'rotate %1 by %2 °',
  'args0': [
    {
      'type': 'input_value',
      'name': 'a',
      'check': 'Vector',
    },
    {
      'type': 'input_value',
      'name': 'b',
      'check': 'Number',
    },
  ],
  'inputsInline': true,
  'output': 'Vector',
  'colour': 270,
  'tooltip': '',
  'helpUrl': '',
},
{
  'type': 'vector_angle',
  'message0': 'get angle of %1',
  'args0': [
    {
      'type': 'input_value',
      'name': 'v',
      'check': 'Vector',
    },
  ],
  'inputsInline': true,
  'output': 'Number',
  'colour': 270,
  'tooltip': '',
  'helpUrl': '',
},
{
  'type': 'vector_get_axis',
  'message0': '%1 value of %2',
  'args0': [
    {
      'type': 'field_dropdown',
      'name': 'axis',
      'options': [
        [
          'x',
          '[0]',
        ],
        [
          'y',
          '[1]',
        ],
      ],
    },
    {
      'type': 'input_value',
      'name': 'v',
      'check': 'Vector',
    },
  ],
  'inputsInline': true,
  'output': 'Number',
  'colour': 270,
  'tooltip': '',
  'helpUrl': '',
},
{
  'type': 'vector_lerp',
  'message0': 'lerp %1 from a: %2 to b: %3 with interpolant (0-1) %4',
  'args0': [
    {
      'type': 'input_dummy',
    },
    {
      'type': 'input_value',
      'name': 'a',
      'check': 'Vector',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'b',
      'check': 'Vector',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 't',
      'check': 'Number',
      'align': 'RIGHT',
    },
  ],
  'inputsInline': false,
  'output': 'Vector',
  'colour': 270,
  'tooltip': '',
  'helpUrl': '',
},
{
  'type': 'if_return_event',
  'message0': 'if %1 stop event',
  'args0': [
    {
      'type': 'input_value',
      'name': 'bool',
      'check': 'Boolean',
    },
  ],
  'inputsInline': true,
  'previousStatement': null,
  'nextStatement': null,
  'colour': 30,
  'tooltip': '',
  'helpUrl': '',
},
{
  'type': 'return_event',
  'message0': 'stop event',
  'previousStatement': null,
  'nextStatement': null,
  'colour': 30,
  'tooltip': '',
  'helpUrl': '',
},
{
  'type': 'arrow_get_player_last',
  'message0': 'id of player %1 \'s last arrow',
  'args0': [
    {
      'type': 'input_value',
      'name': 'player_id',
      'check': 'Number',
    },
  ],
  'inputsInline': true,
  'output': 'Number',
  'colour': 230,
  'tooltip': '',
  'helpUrl': '',
},
{
  'type': 'drawing_create',
  'message0': 'create drawing %1 return id %2 %3 alpha (0 to 1) %4 position %5 scale %6 angle %7 attach to %8 %9 %10 shapes %11',
  'args0': [
    {
      'type': 'input_dummy',
    },
    {
      'type': 'field_checkbox',
      'name': 'return_id',
      'checked': true,
    },
    {
      'type': 'input_dummy',
    },
    {
      'type': 'input_value',
      'name': 'alpha',
      'check': 'Number',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'pos',
      'check': 'Vector',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'scale',
      'check': 'Vector',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'angle',
      'check': 'Number',
      'align': 'RIGHT',
    },
    {
      'type': 'field_dropdown',
      'name': 'attach_to',
      'options': [
        [
          'screen',
          'screen',
        ],
        [
          'world',
          'world',
        ],
        [
          'disc',
          'disc',
        ],
        [
          'body',
          'body',
        ],
      ],
    },
    {
      'type': 'input_dummy',
      'align': 'RIGHT',
    },
    {
      'type': 'input_dummy',
    },
    {
      'type': 'input_value',
      'name': 'shapes',
      'check': 'Array',
      'align': 'RIGHT',
    },
  ],
  'previousStatement': null,
  'nextStatement': null,
  'colour': 135,
  'tooltip': '',
  'helpUrl': '',
},
{
  'type': 'drawing_shape_rect',
  'message0': 'rectangle drawing shape %1 colour %2 alpha %3 position %4 size %5 angle %6',
  'args0': [
    {
      'type': 'input_dummy',
    },
    {
      'type': 'input_value',
      'name': 'colour',
      'check': 'Colour',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'alpha',
      'check': 'Number',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'pos',
      'check': 'Vector',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'size',
      'check': 'Vector',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'angle',
      'check': 'Number',
      'align': 'RIGHT',
    },
  ],
  'inputsInline': false,
  'output': 'DrawingShape',
  'colour': 135,
  'tooltip': '',
  'helpUrl': '',
},
{
  'type': 'drawing_shape_ellipse',
  'message0': 'ellipse drawing shape %1 colour %2 alpha %3 position %4 size %5 angle %6',
  'args0': [
    {
      'type': 'input_dummy',
    },
    {
      'type': 'input_value',
      'name': 'colour',
      'check': 'Colour',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'alpha',
      'check': 'Number',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'pos',
      'check': 'Vector',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'size',
      'check': 'Vector',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'angle',
      'check': 'Number',
      'align': 'RIGHT',
    },
  ],
  'inputsInline': false,
  'output': 'DrawingShape',
  'colour': 135,
  'tooltip': '',
  'helpUrl': '',
},
{
  'type': 'drawing_shape_polygon',
  'message0': 'polygon drawing shape %1 colour %2 alpha %3 position %4 scale %5 angle %6 vertices %7',
  'args0': [
    {
      'type': 'input_dummy',
    },
    {
      'type': 'input_value',
      'name': 'colour',
      'check': 'Colour',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'alpha',
      'check': 'Number',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'pos',
      'check': 'Vector',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'scale',
      'check': 'Vector',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'angle',
      'check': 'Number',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'vertices',
      'check': 'Array',
      'align': 'RIGHT',
    },
  ],
  'inputsInline': false,
  'output': 'DrawingShape',
  'colour': 135,
  'tooltip': '',
  'helpUrl': '',
},
{
  'type': 'drawing_shape_line',
  'message0': 'line drawing shape %1 colour %2 alpha %3 from point %4 to point %5 width %6',
  'args0': [
    {
      'type': 'input_dummy',
    },
    {
      'type': 'input_value',
      'name': 'colour',
      'check': 'Colour',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'alpha',
      'check': 'Number',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'pos',
      'check': 'Vector',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'end',
      'check': 'Vector',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'width',
      'check': 'Number',
      'align': 'RIGHT',
    },
  ],
  'inputsInline': false,
  'output': 'DrawingShape',
  'colour': 135,
  'tooltip': '',
  'helpUrl': '',
},
{
  'type': 'drawing_shape_text',
  'lastDummyAlign0': 'RIGHT',
  'message0': 'text drawing shape %1 colour %2 alpha %3 position %4 angle %5 text %6 size %7 align %8 %9 bold %10 %11 italic %12 %13 shadow %14',
  'args0': [
    {
      'type': 'input_dummy',
    },
    {
      'type': 'input_value',
      'name': 'colour',
      'check': 'Colour',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'alpha',
      'check': 'Number',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'pos',
      'check': 'Vector',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'angle',
      'check': 'Number',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'text',
      'check': 'String',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'size',
      'check': 'Number',
      'align': 'RIGHT',
    },
    {
      'type': 'field_dropdown',
      'name': 'align',
      'options': [
        [
          'left',
          'left',
        ],
        [
          'center',
          'center',
        ],
        [
          'right',
          'right',
        ],
      ],
    },
    {
      'type': 'input_dummy',
      'align': 'RIGHT',
    },
    {
      'type': 'field_checkbox',
      'name': 'bold',
      'checked': true,
    },
    {
      'type': 'input_dummy',
      'align': 'RIGHT',
    },
    {
      'type': 'field_checkbox',
      'name': 'italic',
      'checked': true,
    },
    {
      'type': 'input_dummy',
      'align': 'RIGHT',
    },
    {
      'type': 'field_checkbox',
      'name': 'shadow',
      'checked': true,
    },
  ],
  'inputsInline': false,
  'output': 'DrawingShape',
  'colour': 135,
  'tooltip': '',
  'helpUrl': '',
},
{
  'type': 'drawing_shape_image',
  'message0': 'image drawing shape %1 image name %2 region (null for full image) %3 colour %4 alpha %5 position %6 size %7 angle %8',
  'args0': [
    {
      'type': 'input_dummy',
    },
    {
      'type': 'input_value',
      'name': 'id',
      'check': 'String',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'region',
      'check': 'DrawingImageRegion',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'colour',
      'check': 'Colour',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'alpha',
      'check': 'Number',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'pos',
      'check': 'Vector',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'size',
      'check': 'Vector',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'angle',
      'check': 'Number',
      'align': 'RIGHT',
    },
  ],
  'inputsInline': false,
  'output': 'DrawingShape',
  'colour': 135,
  'tooltip': '',
  'helpUrl': '',
},
{
  'type': 'drawing_shape_image_region',
  'message0': 'image region %1 offset (in pixels) %2 size (in pixels) %3',
  'args0': [
    {
      'type': 'input_dummy',
    },
    {
      'type': 'input_value',
      'name': 'pos',
      'check': 'Vector',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'size',
      'check': 'Vector',
      'align': 'RIGHT',
    },
  ],
  'inputsInline': false,
  'output': 'DrawingImageRegion',
  'colour': 135,
  'tooltip': '',
  'helpUrl': '',
},
{
  'type': 'drawing_prop_set',
  'message0': '%1 drawing %2 \'s %3 to %4',
  'args0': [
    {
      'type': 'field_dropdown',
      'name': 'set_option',
      'options': [
        [
          'set',
          'set',
        ],
        [
          'change',
          'change',
        ],
        [
          'multiply',
          'multiply',
        ],
        [
          'divide',
          'divide',
        ],
      ],
    },
    {
      'type': 'input_value',
      'name': 'id',
      'check': 'Number',
    },
    {
      'type': 'field_dropdown',
      'name': 'property',
      'options': [
        [
          'alpha',
          'alpha',
        ],
        [
          'position',
          'pos',
        ],
        [
          'scale',
          'scale',
        ],
        [
          'angle',
          'angle',
        ],
      ],
    },
    {
      'type': 'input_value',
      'name': 'to',
      'align': 'RIGHT',
    },
  ],
  'inputsInline': true,
  'previousStatement': null,
  'nextStatement': null,
  'colour': 135,
  'tooltip': '',
  'helpUrl': '',
},
{
  'type': 'drawing_prop_get',
  'message0': 'drawing %1 \'s %2',
  'args0': [
    {
      'type': 'input_value',
      'name': 'id',
      'check': 'Number',
    },
    {
      'type': 'field_dropdown',
      'name': 'property',
      'options': [
        [
          'alpha',
          'alpha',
        ],
        [
          'position',
          'pos',
        ],
        [
          'scale',
          'scale',
        ],
        [
          'angle',
          'angle',
        ],
        [
          'attachment type',
          'attachTo',
        ],
        [
          'attachment id (attached to body/disc)',
          'attachId',
        ],
        [
          'is behind attachment (attached to body/disc)',
          'isBehind',
        ],
      ],
    },
  ],
  'inputsInline': true,
  'output': null,
  'colour': 135,
  'tooltip': '',
  'helpUrl': '',
},
{
  'type': 'drawing_shape_prop_set',
  'message0': '%1 drawing %2 \'s shape # %3 \'s %4 to %5',
  'args0': [
    {
      'type': 'field_dropdown',
      'name': 'set_option',
      'options': [
        [
          'set',
          'set',
        ],
        [
          'change',
          'change',
        ],
        [
          'multiply',
          'multiply',
        ],
        [
          'divide',
          'divide',
        ],
      ],
    },
    {
      'type': 'input_value',
      'name': 'id',
      'check': 'Number',
    },
    {
      'type': 'input_value',
      'name': 'shape_id',
      'check': 'Number',
    },
    {
      'type': 'field_dropdown',
      'name': 'property',
      'options': [
        [
          'colour',
          'colour',
        ],
        [
          'alpha',
          'alpha',
        ],
        [
          'angle',
          'angle',
        ],
        [
          'position ("from point" in lines)',
          'pos',
        ],
        [
          'size (not in lines)',
          'size',
        ],
        [
          'scale (only polygons)',
          'scale',
        ],
        [
          'vertices (only polygons)',
          'vertices',
        ],
        [
          'to point (only lines)',
          'end',
        ],
        [
          'width (only lines)',
          'width',
        ],
        [
          'text (only text)',
          'text',
        ],
        [
          'align (only text)',
          'align',
        ],
        [
          'bold (only text)',
          'bold',
        ],
        [
          'italic (only text)',
          'italic',
        ],
        [
          'shadow (only text)',
          'shadow',
        ],
      ],
    },
    {
      'type': 'input_value',
      'name': 'to',
      'align': 'RIGHT',
    },
  ],
  'inputsInline': true,
  'previousStatement': null,
  'nextStatement': null,
  'colour': 135,
  'tooltip': '',
  'helpUrl': '',
},
{
  'type': 'drawing_shape_prop_get',
  'message0': 'drawing %1 \'s shape # %2 \'s %3',
  'args0': [
    {
      'type': 'input_value',
      'name': 'id',
      'check': 'Number',
    },
    {
      'type': 'input_value',
      'name': 'shape_id',
      'check': 'Number',
    },
    {
      'type': 'field_dropdown',
      'name': 'property',
      'options': [
        [
          'colour',
          'colour',
        ],
        [
          'alpha',
          'alpha',
        ],
        [
          'angle',
          'angle',
        ],
        [
          'position ("from point" in lines)',
          'pos',
        ],
        [
          'size (not in lines)',
          'size',
        ],
        [
          'scale (only polygons)',
          'scale',
        ],
        [
          'vertices (only polygons)',
          'vertices',
        ],
        [
          'to point (only lines)',
          'end',
        ],
        [
          'width (only lines)',
          'width',
        ],
        [
          'text (only text)',
          'text',
        ],
        [
          'align (only text)',
          'align',
        ],
        [
          'bold (only text)',
          'bold',
        ],
        [
          'italic (only text)',
          'italic',
        ],
        [
          'shadow (only text)',
          'shadow',
        ],
      ],
    },
  ],
  'inputsInline': true,
  'output': null,
  'colour': 135,
  'tooltip': '',
  'helpUrl': '',
},
{
  'type': 'drawing_exists',
  'message0': 'drawing %1 exists',
  'args0': [
    {
      'type': 'input_value',
      'name': 'id',
      'check': 'Number',
    },
  ],
  'inputsInline': true,
  'output': 'Boolean',
  'colour': 135,
  'tooltip': '',
  'helpUrl': '',
},
{
  'type': 'drawing_shape_exists',
  'message0': 'drawing %1 \'s shape # %2 exists',
  'args0': [
    {
      'type': 'input_value',
      'name': 'id',
      'check': 'Number',
    },
    {
      'type': 'input_value',
      'name': 'shape_id',
      'check': 'Number',
    },
  ],
  'inputsInline': true,
  'output': 'Boolean',
  'colour': 135,
  'tooltip': '',
  'helpUrl': '',
},
{
  'type': 'drawing_add_shape',
  'message0': 'add shape %1 to drawing %2',
  'args0': [
    {
      'type': 'input_value',
      'name': 'shape',
      'check': 'DrawingShape',
    },
    {
      'type': 'input_value',
      'name': 'id',
      'check': 'Number',
    },
  ],
  'inputsInline': false,
  'previousStatement': null,
  'nextStatement': null,
  'colour': 135,
  'tooltip': '',
  'helpUrl': '',
},
{
  'type': 'drawing_shape_amount',
  'message0': 'drawing %1 \'s shape amount',
  'args0': [
    {
      'type': 'input_value',
      'name': 'id',
      'check': 'Number',
    },
  ],
  'inputsInline': true,
  'output': 'Number',
  'colour': 135,
  'tooltip': '',
  'helpUrl': '',
},
{
  'type': 'obj_no_lerp',
  'message0': 'don\'t interpolate %1 %2 until next step',
  'args0': [
    {
      'type': 'field_dropdown',
      'name': 'obj_type',
      'options': [
        [
          'disc',
          'game.state.discs',
        ],
        [
          'arrow',
          'game.state.projectiles',
        ],
        [
          'body',
          'game.state.physics.bodies',
        ],
        [
          'drawing',
          'game.graphics.drawings',
        ],
        [
          'camera',
          'game.graphics.camera',
        ],
      ],
    },
    {
      'type': 'input_value',
      'name': 'obj_id',
      'check': 'Number',
    },
  ],
  'inputsInline': true,
  'previousStatement': null,
  'nextStatement': null,
  'colour': 135,
  'tooltip': '',
  'helpUrl': '',
},
{
  'type': 'drawing_shape_no_lerp',
  'message0': 'don\'t interpolate drawing %1 \'s shape # %2 until next step',
  'args0': [
    {
      'type': 'input_value',
      'name': 'id',
      'check': 'Number',
    },
    {
      'type': 'input_value',
      'name': 'shape_id',
      'check': 'Number',
    },
  ],
  'inputsInline': true,
  'previousStatement': null,
  'nextStatement': null,
  'colour': 135,
  'tooltip': '',
  'helpUrl': '',
},
{
  'type': 'drawing_attach',
  'lastDummyAlign0': 'RIGHT',
  'message0': 'change attachment for drawing %1 attach to %2',
  'args0': [
    {
      'type': 'input_value',
      'name': 'id',
      'check': 'Number',
    },
    {
      'type': 'field_dropdown',
      'name': 'attach_to',
      'options': [
        [
          'screen',
          'screen',
        ],
        [
          'world',
          'world',
        ],
        [
          'disc',
          'disc',
        ],
        [
          'body',
          'body',
        ],
      ],
    },
  ],
  'inputsInline': false,
  'previousStatement': null,
  'nextStatement': null,
  'colour': 135,
  'tooltip': '',
  'helpUrl': '',
}];
