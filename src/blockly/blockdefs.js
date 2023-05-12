module.exports = [
  // Block for colour picker.
  {
    'type': 'colour_picker',
    'message0': '%1',
    'args0': [
      {
        'type': 'field_colour_hsv_sliders',
        'name': 'COLOUR',
        'colour': '#ff0000',
      },
    ],
    'output': 'Colour',
    'helpUrl': '%{BKY_COLOUR_PICKER_HELPURL}',
    'style': 'colour_blocks',
    'tooltip': '%{BKY_COLOUR_PICKER_TOOLTIP}',
    'extensions': ['parent_tooltip_when_inline'],
  },
  {
    'type': 'colour_hsv',
    'message0': 'colour with hue %1 saturation %2 value %3',
    'args0': [
      {
        'type': 'input_value',
        'name': 'HUE',
        'check': 'Number',
        'align': 'RIGHT',
      },
      {
        'type': 'input_value',
        'name': 'SATURATION',
        'check': 'Number',
        'align': 'RIGHT',
      },
      {
        'type': 'input_value',
        'name': 'VALUE',
        'check': 'Number',
        'align': 'RIGHT',
      },
    ],
    'output': 'Colour',
    'helpUrl': '',
    'style': 'colour_blocks',
    'tooltip': 'Create a colour with the specified hue, saturation and value (brightness). Hue is an angle in degrees, saturation and value must be in the range of 0 to 1.',
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
            'x position',
            'p[0]',
          ],
          [
            'y position',
            'p[1]',
          ],
          [
            'velocity',
            'lv',
          ],
          [
            'x velocity',
            'lv[0]',
          ],
          [
            'y velocity',
            'lv[1]',
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
            'grapple attached platform id',
            'swing.b',
          ],
          [
            'grapple point offset',
            'swing.p',
          ],
          [
            'grapple point x offset',
            'swing.p[0]',
          ],
          [
            'grapple point y offset',
            'swing.p[1]',
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
    'style': 'gm_world',
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
            'x position',
            'p[0]',
          ],
          [
            'y position',
            'p[1]',
          ],
          [
            'velocity',
            'lv',
          ],
          [
            'x velocity',
            'lv[0]',
          ],
          [
            'y velocity',
            'lv[1]',
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
            'grapple attached platform id',
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
    'style': 'gm_world',
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
            'x position',
            'p[0]',
          ],
          [
            'y position',
            'p[1]',
          ],
          [
            'velocity',
            'lv',
          ],
          [
            'x velocity',
            'lv[0]',
          ],
          [
            'y velocity',
            'lv[1]',
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
            'fte',
          ],
          [
            'owner player id',
            'did',
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
    'style': 'gm_world',
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
            'x position',
            'p[0]',
          ],
          [
            'y position',
            'p[1]',
          ],
          [
            'velocity',
            'lv',
          ],
          [
            'x velocity',
            'lv[0]',
          ],
          [
            'y velocity',
            'lv[1]',
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
            'fte',
          ],
          [
            'owner player id',
            'did',
          ],
        ],
      },
    ],
    'inputsInline': true,
    'output': null,
    'style': 'gm_world',
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
            'platform',
            'game.state.physics.platforms',
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
    'style': 'gm_world',
    'tooltip': '',
    'helpUrl': '',
  },
  {
    'type': 'disc_kill',
    'message0': 'kill disc %1 , %2 respawn',
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
    'style': 'gm_world',
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
    'style': 'gm_world',
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
    'style': 'gm_world',
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
    'style': 'gm_world',
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
    'style': 'gm_world',
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
    'style': 'gm_world',
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
    'style': 'gm_world',
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
    'style': 'gm_world',
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
    'style': 'gm_world',
    'tooltip': '',
    'helpUrl': '',
  },
  {
    'type': 'input_disable_mouse_pos',
    'message0': '%1 mouse position for player %2',
    'args0': [
      {
        'type': 'field_dropdown',
        'name': 'to',
        'options': [
          [
            'enable',
            'true',
          ],
          [
            'disable',
            'false',
          ],
        ],
      },
      {
        'type': 'input_value',
        'name': 'player_id',
        'check': 'Number',
      },
    ],
    'inputsInline': true,
    'previousStatement': null,
    'nextStatement': null,
    'style': 'gm_world',
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
    'style': 'gm_vector',
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
            '×',
            'multiply',
          ],
          [
            '÷',
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
    'style': 'gm_vector',
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
    'style': 'gm_vector',
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
    'style': 'gm_vector',
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
    'style': 'gm_vector',
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
    'style': 'gm_vector',
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
    'style': 'gm_vector',
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
    'style': 'gm_vector',
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
    'style': 'gm_vector',
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
    'style': 'gm_vector',
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
    'style': 'gm_vector',
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
    'style': 'gm_events',
    'tooltip': '',
    'helpUrl': '',
  },
  {
    'type': 'return_event',
    'message0': 'stop event',
    'previousStatement': null,
    'nextStatement': null,
    'style': 'gm_events',
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
    'style': 'gm_world',
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
            'platform',
            'platform',
          ],
        ],
      },
      {
        'type': 'input_dummy',
        'align': 'RIGHT',
      },
      {
        'type': 'input_dummy',
        'name': 'pre_shape_dum',
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
    'style': 'gm_graphics',
    'tooltip': '',
    'helpUrl': '',
  },
  {
    'type': 'drawing_shape_rect',
    'message0': 'box drawing shape %1 colour %2 alpha %3 position %4 size %5 angle %6',
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
    'style': 'gm_graphics',
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
    'style': 'gm_graphics',
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
    'style': 'gm_graphics',
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
    'style': 'gm_graphics',
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
    'style': 'gm_graphics',
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
    'style': 'gm_graphics',
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
    'style': 'gm_graphics',
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
            'x position',
            'pos[0',
          ],
          [
            'y position',
            'pos[1]',
          ],
          [
            'scale',
            'scale',
          ],
          [
            'x scale',
            'scale[0]',
          ],
          [
            'y scale',
            'scale[1]',
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
    'style': 'gm_graphics',
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
            'x position',
            'pos[0]',
          ],
          [
            'y position',
            'pos[1]',
          ],
          [
            'scale',
            'scale',
          ],
          [
            'x scale',
            'scale[0]',
          ],
          [
            'y scale',
            'scale[1]',
          ],
          [
            'angle',
            'angle',
          ],
        ],
      },
    ],
    'inputsInline': true,
    'output': null,
    'style': 'gm_graphics',
    'tooltip': '',
    'helpUrl': '',
  },
  {
    'type': 'drawing_shape_prop_get',
    'message0': 'drawing %1 \'s %2 shape # %3 \'s %4',
    'args0': [
      {
        'type': 'input_value',
        'name': 'id',
        'check': 'Number',
      },
      {
        'type': 'field_dropdown',
        'name': 'shape_type',
        'options': [
          [
            'box/ellipse',
            'bxci',
          ],
          [
            'polygon',
            'po',
          ],
          [
            'line',
            'li',
          ],
          [
            'text',
            'tx',
          ],
          [
            'image',
            'im',
          ],
        ],
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
            'position',
            'default',
          ],
        ],
      },
    ],
    'inputsInline': true,
    'output': null,
    'style': 'gm_graphics',
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
    'style': 'gm_graphics',
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
    'style': 'gm_graphics',
    'tooltip': '',
    'helpUrl': '',
  },
  {
    'type': 'drawing_shape_add',
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
    'style': 'gm_graphics',
    'tooltip': '',
    'helpUrl': '',
  },
  {
    'type': 'drawing_shape_remove',
    'message0': 'remove drawing %1\'s shape #%2',
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
    'style': 'gm_graphics',
    'tooltip': '',
    'helpUrl': '',
  },
  {
    'type': 'drawing_delete',
    'message0': 'delete drawing %1',
    'args0': [
      {
        'type': 'input_value',
        'name': 'id',
        'check': 'Number',
      },
    ],
    'inputsInline': false,
    'previousStatement': null,
    'nextStatement': null,
    'style': 'gm_graphics',
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
    'style': 'gm_graphics',
    'tooltip': '',
    'helpUrl': '',
  },
  {
    'type': 'obj_no_lerp',
    'message0': 'don\'t interpolate %1 %2 until next step %3',
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
            'platform',
            'game.state.physics.platforms',
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
        'type': 'input_dummy',
        'name': 'pre_id_dum',
      },
      {
        'type': 'input_dummy',
        'name': 'post_id_dum',
      },
    ],
    'inputsInline': true,
    'previousStatement': null,
    'nextStatement': null,
    'style': 'gm_graphics',
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
    'style': 'gm_graphics',
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
            'platform',
            'platform',
          ],
        ],
      },
    ],
    'inputsInline': false,
    'previousStatement': null,
    'nextStatement': null,
    'style': 'gm_graphics',
    'tooltip': '',
    'helpUrl': '',
  },
  {
    'type': 'lobby_all_player_ids',
    'message0': 'all player ids as list',
    'output': 'Array',
    'style': 'gm_lobby',
    'tooltip': '',
    'helpUrl': '',
  },
  {
    'type': 'lobby_host_id',
    'message0': 'host player id',
    'output': 'Number',
    'style': 'gm_lobby',
    'tooltip': '',
    'helpUrl': '',
  },
  {
    'type': 'lobby_client_id',
    'message0': 'client player id',
    'output': 'Number',
    'style': 'gm_lobby',
    'tooltip': '',
    'helpUrl': '',
  },
  {
    'type': 'lobby_playerinfo_get',
    'message0': 'player %1 %2',
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
            '\'s username',
            'userName',
          ],
          [
            '\'s level',
            'level',
          ],
          [
            '\'s skin bg colour',
            'skinBg',
          ],
          [
            '\'s skin colours as list',
            'skinColours',
          ],
          [
            'is a guest',
            'guest',
          ],
          [
            'is spectating',
            'team == 0',
          ],
          [
            'is in ffa',
            'team == 1',
          ],
          [
            'is in red team',
            'team == 2',
          ],
          [
            'is in blue team',
            'team == 3',
          ],
          [
            'is in green team',
            'team == 4',
          ],
          [
            'is in yellow team',
            'team == 5',
          ],
        ],
      },
    ],
    'output': null,
    'style': 'gm_lobby',
    'tooltip': '',
    'helpUrl': '',
  },
  {
    'type': 'lobby_rounds_to_win',
    'message0': 'rounds to win',
    'output': 'Number',
    'style': 'gm_lobby',
    'tooltip': '',
    'helpUrl': '',
  },
  {
    'type': 'lobby_teams_on',
    'message0': 'teams are on',
    'output': 'Boolean',
    'style': 'gm_lobby',
    'tooltip': '',
    'helpUrl': '',
  },
  {
    'type': 'lobby_teams_locked',
    'message0': 'teams are locked',
    'output': 'Boolean',
    'style': 'gm_lobby',
    'tooltip': '',
    'helpUrl': '',
  },
  {
    'type': 'lobby_base_mode_is',
    'message0': 'current base mode is %1',
    'args0': [
      {
        'type': 'field_dropdown',
        'name': 'mode',
        'options': [
          [
            'Classic',
            'b',
          ],
          [
            'Arrows',
            'ar',
          ],
          [
            'Death Arrows',
            'ard',
          ],
          [
            'Grapple',
            'sp',
          ],
          [
            'Simple',
            'bs',
          ],
          [
            'VTOL',
            'v',
          ],
        ],
      },
    ],
    'output': 'Boolean',
    'style': 'gm_lobby',
    'tooltip': '',
    'helpUrl': '',
  },
  {
    'type': 'audio_play_sound',
    'message0': 'play sound %1 %2 volume %3 %4 %5',
    'args0': [
      {
        'type': 'field_dropdown',
        'name': 'name',
        'options': [
          [
            'custom',
            'custom',
          ],
          [
            'disc-disc collision',
            'discDisc',
          ],
          [
            'disc-platform collision',
            'platBounce',
          ],
          [
            'disc offscreen beep',
            'discOffscreen',
          ],
          [
            'disc death',
            'discDeath',
          ],
          [
            'capzone increase',
            'capIncrease',
          ],
          [
            'capzone decrease',
            'capDecrease',
          ],
          [
            'capzone full',
            'capComplete',
          ],
          [
            'football kick',
            'footKick',
          ],
          [
            'football collision',
            'footBounce',
          ],
          [
            'football entering goal',
            'footGoal',
          ],
          [
            'football score swoosh',
            'scoreAnimation',
          ],
          [
            'button hover',
            'classicButtonHover',
          ],
          [
            'normal button click',
            'classicButtonClick',
          ],
          [
            'back/cancel button click',
            'classicButtonBack',
          ],
          [
            'room list row hover',
            'listRowHover',
          ],
          [
            'room list row click',
            'listRowClick',
          ],
          [
            'start countdown beep',
            'digiBeep',
          ],
          [
            'chat message beep',
            'popNote',
          ],
        ],
      },
      {
        'type': 'input_dummy',
      },
      {
        'type': 'input_value',
        'name': 'volume',
        'check': 'Number',
        'align': 'RIGHT',
      },
      {
        'type': 'field_dropdown',
        'name': 'panning_type',
        'options': [
          [
            'panning (-1 to 1)',
            'normal',
          ],
          [
            'x position in world',
            'worldPos',
          ],
        ],
      },
      {
        'type': 'input_value',
        'name': 'panning',
        'check': 'Number',
        'align': 'RIGHT',
      },
    ],
    'previousStatement': null,
    'nextStatement': null,
    'style': 'gm_audio',
    'tooltip': '',
    'helpUrl': '',
  },
  {
    'type': 'audio_stop_all',
    'message0': 'stop all sounds',
    'previousStatement': null,
    'nextStatement': null,
    'style': 'gm_audio',
    'tooltip': '',
    'helpUrl': '',
  },
  {
    'type': 'drawing_shape_prop_set',
    'message0': '%1 drawing %2 \'s %3 shape # %4 \'s %5 to %6',
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
        'name': 'shape_type',
        'options': [
          [
            'box/ellipse',
            'bxci',
          ],
          [
            'polygon',
            'po',
          ],
          [
            'line',
            'li',
          ],
          [
            'text',
            'tx',
          ],
          [
            'image',
            'im',
          ],
        ],
      },
      {
        'type': 'input_value',
        'name': 'shape_id',
        'check': 'Number',
      },
      {
        'type': 'field_dropdown',
        'name': 'property',
        'options': [[
          'position',
          'default',
        ]],
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
    'style': 'gm_graphics',
    'tooltip': '',
    'helpUrl': '',
  },
  {
    'type': 'camera_prop_set',
    'message0': '%1 camera\'s %2 to %3',
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
        'type': 'field_dropdown',
        'name': 'property',
        'options': [
          [
            'position',
            'pos',
          ],
          [
            'x position',
            'pos[0]',
          ],
          [
            'y position',
            'pos[1]',
          ],
          [
            'scale',
            'scale',
          ],
          [
            'x scale',
            'scale[0]',
          ],
          [
            'y scale',
            'scale[1]',
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
      },
    ],
    'inputsInline': true,
    'previousStatement': null,
    'nextStatement': null,
    'style': 'gm_graphics',
    'tooltip': '',
    'helpUrl': '',
  },
  {
    'type': 'camera_prop_get',
    'message0': 'camera\'s %1',
    'args0': [
      {
        'type': 'field_dropdown',
        'name': 'property',
        'options': [
          [
            'position',
            'pos',
          ],
          [
            'x position',
            'pos[0]',
          ],
          [
            'y position',
            'pos[1]',
          ],
          [
            'scale',
            'scale',
          ],
          [
            'x scale',
            'scale[0]',
          ],
          [
            'y scale',
            'scale[1]',
          ],
          [
            'angle',
            'angle',
          ],
        ],
      },
    ],
    'inputsInline': true,
    'output': null,
    'style': 'gm_graphics',
    'tooltip': '',
    'helpUrl': '',
  },
  {
    'type': 'state_misc_set',
    'message0': 'set %1 to %2',
    'args0': [
      {
        'type': 'field_dropdown',
        'name': 'property',
        'options': [
          [
            'disable death barrier',
            'game.world.disableDeathBarrier',
          ],
          [
            'players can fly',
            'game.state.ms.fl',
          ],
          [
            'players can\'t collide',
            'game.state.ms.nc',
          ],
          [
            'respawn on death',
            'game.state.ms.re',
          ],
        ],
      },
      {
        'type': 'field_dropdown',
        'name': 'to',
        'options': [
          [
            'true',
            'true',
          ],
          [
            'false',
            'false',
          ],
        ],
      },
    ],
    'previousStatement': null,
    'nextStatement': null,
    'style': 'gm_world',
    'tooltip': '',
    'helpUrl': '',
  },
  {
    'type': 'state_trigger_player_win',
    'message0': '(FFA only) make player %1 win',
    'args0': [
      {
        'type': 'input_value',
        'name': 'id',
        'check': 'Number',
      },
    ],
    'previousStatement': null,
    'nextStatement': null,
    'style': 'gm_world',
    'tooltip': '',
    'helpUrl': '',
  },
  {
    'type': 'state_trigger_team_win',
    'message0': '(teams only) make %1 team win',
    'args0': [
      {
        'type': 'field_dropdown',
        'name': 'team',
        'options': [
          [
            'red',
            '2',
          ],
          [
            'blue',
            '3',
          ],
          [
            'green',
            '4',
          ],
          [
            'yellow',
            '5',
          ],
        ],
      },
    ],
    'previousStatement': null,
    'nextStatement': null,
    'style': 'gm_world',
    'tooltip': '',
    'helpUrl': '',
  },
  {
    'type': 'state_trigger_draw_win',
    'message0': 'end round with a draw',
    'previousStatement': null,
    'nextStatement': null,
    'style': 'gm_world',
    'tooltip': '',
    'helpUrl': '',
  },
  {
    'type': 'state_end_round',
    'message0': 'end round without win screen',
    'previousStatement': null,
    'nextStatement': null,
    'style': 'gm_world',
    'tooltip': '',
    'helpUrl': '',
  },
  {
    'type': 'state_skip_start',
    'message0': 'skip round start countdown',
    'previousStatement': null,
    'nextStatement': null,
    'style': 'gm_world',
    'tooltip': '',
    'helpUrl': '',
  },
  {
    'type': 'state_player_score_set',
    'message0': '(FFA only) %1 player %2 \'s score to %3',
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
        'name': 'to',
        'check': 'Number',
        'align': 'RIGHT',
      },
    ],
    'inputsInline': true,
    'previousStatement': null,
    'nextStatement': null,
    'style': 'gm_world',
    'tooltip': '',
    'helpUrl': '',
  },
  {
    'type': 'state_team_score_set',
    'message0': '(teams only) %1 %2 team\'s score to %3',
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
        'type': 'field_dropdown',
        'name': 'team',
        'options': [
          [
            'red',
            '2',
          ],
          [
            'blue',
            '3',
          ],
          [
            'green',
            '4',
          ],
          [
            'yellow',
            '5',
          ],
        ],
      },
      {
        'type': 'input_value',
        'name': 'to',
        'check': 'Number',
        'align': 'RIGHT',
      },
    ],
    'inputsInline': true,
    'previousStatement': null,
    'nextStatement': null,
    'style': 'gm_world',
    'tooltip': '',
    'helpUrl': '',
  },
  {
    'type': 'state_player_score_get',
    'message0': '(FFA only) player %1 \'s score',
    'args0': [
      {
        'type': 'input_value',
        'name': 'id',
        'check': 'Number',
      },
    ],
    'inputsInline': true,
    'output': 'Number',
    'style': 'gm_world',
    'tooltip': '',
    'helpUrl': '',
  },
  {
    'type': 'state_team_score_get',
    'message0': '(teams only) %1 team \'s score',
    'args0': [
      {
        'type': 'field_dropdown',
        'name': 'team',
        'options': [
          [
            'red',
            '2',
          ],
          [
            'blue',
            '3',
          ],
          [
            'green',
            '4',
          ],
          [
            'yellow',
            '5',
          ],
        ],
      },
    ],
    'inputsInline': true,
    'output': 'Number',
    'style': 'gm_world',
    'tooltip': '',
    'helpUrl': '',
  },
  {
    'type': 'state_misc_get',
    'message0': '%1',
    'args0': [
      {
        'type': 'field_dropdown',
        'name': 'property',
        'options': [
          [
            'steps since round started',
            'rl',
          ],
          [
            'amount of rounds played',
            'rc',
          ],
          [
            'players can fly',
            'ms.fl',
          ],
          [
            'players can\'t collide',
            'ms.nc',
          ],
          [
            'respawn on death',
            'ms.re',
          ],
        ],
      },
    ],
    'output': null,
    'style': 'gm_world',
    'tooltip': '',
    'helpUrl': '',
  },
  {
    'type': 'state_misc_raycast',
    'message0': 'raycast %1 from point %2 to point %3 store results in global vars:%4 %5 %6 %7 %8 %9 %10 %11 %12 %13 %14 filter %15',
    'args0': [
      {
        'type': 'input_dummy',
      },
      {
        'type': 'input_value',
        'name': 'from',
        'check': 'Vector',
        'align': 'RIGHT',
      },
      {
        'type': 'input_value',
        'name': 'to',
        'check': 'Vector',
        'align': 'RIGHT',
      },
      {
        'type': 'input_dummy',
      },
      {
        'type': 'field_variable',
        'name': 'hit_detected',
        'variable': 'ray hit detected',
      },
      {
        'type': 'input_dummy',
      },
      {
        'type': 'field_variable',
        'name': 'hit_type',
        'variable': 'ray hit type',
      },
      {
        'type': 'field_variable',
        'name': 'hit_id',
        'variable': 'ray hit object id',
      },
      {
        'type': 'field_variable',
        'name': 'hit_point',
        'variable': 'ray hit point',
      },
      {
        'type': 'field_variable',
        'name': 'hit_normal',
        'variable': 'ray hit normal',
      },
      {
        'type': 'input_dummy',
      },
      {
        'type': 'field_variable',
        'name': 'hit_shapeindex',
        'variable': 'ray hit plat shape index',
      },
      {
        'type': 'field_variable',
        'name': 'hit_iscapzone',
        'variable': 'ray hit plat is capzone',
      },
      {
        'type': 'input_dummy',
      },
      {
        'type': 'input_value',
        'name': 'filter',
        'check': 'Boolean',
        'align': 'RIGHT',
      },
    ],
    'inputsInline': false,
    'previousStatement': null,
    'nextStatement': null,
    'style': 'gm_world',
    'tooltip': '',
    'helpUrl': '',
  },
  {
    'type': 'disc_radius_get',
    'message0': 'disc %1 \'s radius',
    'args0': [
      {
        'type': 'input_value',
        'name': 'id',
        'check': 'Number',
      },
    ],
    'inputsInline': true,
    'output': 'Number',
    'style': 'gm_world',
    'tooltip': '',
    'helpUrl': '',
  },
  {
    'type': 'graphics_map_size',
    'message0': 'map size',
    'inputsInline': true,
    'output': 'Number',
    'style': 'gm_graphics',
    'tooltip': '',
    'helpUrl': '',
  },
  {
    'type': 'graphics_screen_size',
    'message0': 'screen width/height as vector',
    'inputsInline': true,
    'output': 'Vector',
    'style': 'gm_graphics',
    'tooltip': '',
    'helpUrl': '',
  },
  {
    'type': 'state_round_starting_ending',
    'message0': 'round is %1',
    'args0': [
      {
        'type': 'field_dropdown',
        'name': 'property',
        'options': [
          [
            'starting',
            'ftu',
          ],
          [
            'ending',
            'fte',
          ],
        ],
      },
    ],
    'output': 'Boolean',
    'style': 'gm_world',
    'tooltip': '',
    'helpUrl': '',
  },
  {
    'type': 'state_map_prop_get',
    'message0': 'current map\'s %1',
    'args0': [
      {
        'type': 'field_dropdown',
        'name': 'property',
        'options': [
          [
            'name',
            'n',
          ],
          [
            'author',
            'a',
          ],
          [
            'upvotes',
            'vu',
          ],
          [
            'downvotes',
            'vd',
          ],
        ],
      },
    ],
    'output': 'Boolean',
    'style': 'gm_world',
    'tooltip': '',
    'helpUrl': '',
  },
  {
    'type': 'plat_prop_set',
    'message0': '%1 platform %2 \'s %3 to %4',
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
            'x position',
            'p[0]',
          ],
          [
            'y position',
            'p[1]',
          ],
          [
            'velocity',
            'lv',
          ],
          [
            'x velocity',
            'lv[0]',
          ],
          [
            'y velocity',
            'lv[1]',
          ],
          [
            'angle',
            'a',
          ],
          [
            'density',
            'de',
          ],
          [
            'restitution (bounciness)',
            're',
          ],
          [
            'friction',
            'fric',
          ],
          [
            'fric players',
            'fricp',
          ],
          [
            'linear drag',
            'ld',
          ],
          [
            'angular drag',
            'ad',
          ],
          [
            'is visible',
            'visible',
          ],
          [
            'is fixed rotation',
            'fr',
          ],
          [
            'is anti-tunnel',
            'bu',
          ],
          [
            'apply force',
            'cf.lf',
          ],
          [
            'apply force x',
            'cf.lf[0]',
          ],
          [
            'apply force y',
            'cf.lf[1]',
          ],
          [
            'apply torque',
            'cf.ct',
          ],
          [
            'apply force is absolute',
            'cf.w',
          ],
          [
            'is force zone',
            'fz.on',
          ],
          [
            'force zone x',
            'fz.x',
          ],
          [
            'force zone y',
            'fz.y',
          ],
          [
            'force zone affects discs',
            'fz.d',
          ],
          [
            'force zone affects platforms',
            'fz.p',
          ],
          [
            'force zone affects arrows',
            'fz.a',
          ],
          [
            'collides with players',
            'f_p',
          ],
          [
            'collides with A',
            'f_1',
          ],
          [
            'collides with B',
            'f_2',
          ],
          [
            'collides with C',
            'f_3',
          ],
          [
            'collides with D',
            'f_4',
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
    'style': 'gm_world',
    'tooltip': '',
    'helpUrl': '',
  },
  {
    'type': 'plat_prop_get',
    'message0': 'platform %1 \'s %2',
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
            'name',
            'n',
          ],
          [
            'position',
            'p',
          ],
          [
            'x position',
            'p[0]',
          ],
          [
            'y position',
            'p[1]',
          ],
          [
            'velocity',
            'lv',
          ],
          [
            'x velocity',
            'lv[0]',
          ],
          [
            'y velocity',
            'lv[1]',
          ],
          [
            'angle',
            'a',
          ],
          [
            'density',
            'de',
          ],
          [
            'restitution (bounciness)',
            're',
          ],
          [
            'friction',
            'fric',
          ],
          [
            'fric players',
            'fricp',
          ],
          [
            'linear drag',
            'ld',
          ],
          [
            'angular drag',
            'ad',
          ],
          [
            'is visible',
            'visible',
          ],
          [
            'is fixed rotation',
            'fr',
          ],
          [
            'is anti-tunnel',
            'bu',
          ],
          [
            'apply force',
            'cf.lf',
          ],
          [
            'apply force x',
            'cf.lf[0]',
          ],
          [
            'apply force y',
            'cf.lf[1]',
          ],
          [
            'apply torque',
            'cf.ct',
          ],
          [
            'apply force is absolute',
            'cf.w',
          ],
          [
            'is force zone',
            'fz.on',
          ],
          [
            'force zone x',
            'fz.x',
          ],
          [
            'force zone y',
            'fz.y',
          ],
          [
            'force zone affects discs',
            'fz.d',
          ],
          [
            'force zone affects platforms',
            'fz.p',
          ],
          [
            'force zone affects arrows',
            'fz.a',
          ],
          [
            'collides with players',
            'f_p',
          ],
          [
            'collides with A',
            'f_1',
          ],
          [
            'collides with B',
            'f_2',
          ],
          [
            'collides with C',
            'f_3',
          ],
          [
            'collides with D',
            'f_4',
          ],
        ],
      },
    ],
    'inputsInline': true,
    'output': null,
    'style': 'gm_world',
    'tooltip': '',
    'helpUrl': '',
  },
  {
    'type': 'platform_create',
    'message0': 'create platform %1 return id %2 %3 type %4 %5 position %6 angle %7 bounciness %8 density %9 friction %10 fric players %11 collide group %12 %13 collide with... %14 players %15 , group A %16 , group B %17 , %18 group C %19 , group D %20 %21 %22 shapes %23',
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
        'type': 'field_dropdown',
        'name': 'type',
        'options': [
          [
            'stationary',
            's',
          ],
          [
            'free moving',
            'd',
          ],
          [
            'kinematic',
            'k',
          ],
        ],
      },
      {
        'type': 'input_dummy',
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
        'name': 'bounce',
        'check': 'Number',
        'align': 'RIGHT',
      },
      {
        'type': 'input_value',
        'name': 'density',
        'check': 'Number',
        'align': 'RIGHT',
      },
      {
        'type': 'input_value',
        'name': 'friction',
        'check': 'Number',
        'align': 'RIGHT',
      },
      {
        'type': 'input_value',
        'name': 'fricplayers',
        'check': 'Boolean',
        'align': 'RIGHT',
      },
      {
        'type': 'field_dropdown',
        'name': 'colgroup',
        'options': [
          [
            'A',
            '1',
          ],
          [
            'B',
            '2',
          ],
          [
            'C',
            '3',
          ],
          [
            'D',
            '4',
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
        'type': 'field_checkbox',
        'name': 'colp',
        'checked': true,
      },
      {
        'type': 'field_checkbox',
        'name': 'cola',
        'checked': true,
      },
      {
        'type': 'field_checkbox',
        'name': 'colb',
        'checked': true,
      },
      {
        'type': 'input_dummy',
      },
      {
        'type': 'field_checkbox',
        'name': 'colc',
        'checked': true,
      },
      {
        'type': 'field_checkbox',
        'name': 'cold',
        'checked': true,
      },
      {
        'type': 'input_dummy',
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
    'style': 'gm_world',
    'tooltip': '',
    'helpUrl': '',
  },
  {
    'type': 'plat_shape',
    'message0': 'platform shape %1 geometry %2 colour %3 no physics %4 no grapple %5 inner grap %6 death %7',
    'args0': [
      {
        'type': 'input_dummy',
      },
      {
        'type': 'input_value',
        'name': 'geo',
        'check': 'PlatShapeGeometry',
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
        'name': 'nophys',
        'check': 'Boolean',
        'align': 'RIGHT',
      },
      {
        'type': 'input_value',
        'name': 'nograp',
        'check': 'Boolean',
        'align': 'RIGHT',
      },
      {
        'type': 'input_value',
        'name': 'ingrap',
        'check': 'Boolean',
        'align': 'RIGHT',
      },
      {
        'type': 'input_value',
        'name': 'death',
        'check': 'Boolean',
        'align': 'RIGHT',
      },
    ],
    'inputsInline': false,
    'output': 'PlatShape',
    'style': 'gm_world',
    'tooltip': '',
    'helpUrl': '',
  },
  {
    'type': 'plat_shape_geo_rect',
    'message0': 'box (rectangle) geometry %1 position %2 size %3 angle %4',
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
      {
        'type': 'input_value',
        'name': 'angle',
        'check': 'Number',
        'align': 'RIGHT',
      },
    ],
    'inputsInline': false,
    'output': 'PlatShapeGeometry',
    'style': 'gm_world',
    'tooltip': '',
    'helpUrl': '',
  },
  {
    'type': 'plat_shape_geo_circ',
    'message0': 'circle geometry %1 position %2 radius %3',
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
        'name': 'radius',
        'check': 'Number',
        'align': 'RIGHT',
      },
    ],
    'inputsInline': false,
    'output': 'PlatShapeGeometry',
    'style': 'gm_world',
    'tooltip': '',
    'helpUrl': '',
  },
  {
    'type': 'plat_shape_geo_poly',
    'message0': 'polygon geometry %1 vertices %2',
    'args0': [
      {
        'type': 'input_dummy',
      },
      {
        'type': 'input_value',
        'name': 'vertices',
        'check': 'Array',
        'align': 'RIGHT',
      },
    ],
    'inputsInline': false,
    'output': 'PlatShapeGeometry',
    'style': 'gm_world',
    'tooltip': '',
    'helpUrl': '',
  },
  {
    'type': 'plat_shape_prop_set',
    'message0': '%1 platform %2 \'s shape # %3 \'s %4 to %5',
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
            '(box/circle only) geo position',
            'geo.c',
          ],
          [
            '(box/circle only) geo x position',
            'geo.c[0]',
          ],
          [
            '(box/circle only) geo y position',
            'geo.c[1]',
          ],
          [
            '(box only) geo angle',
            'geo.a',
          ],
          [
            '(box only) geo size',
            'geo.s',
          ],
          [
            '(box only) geo x size',
            'geo.s[0]',
          ],
          [
            '(box only) geo y size',
            'geo.s[1]',
          ],
          [
            '(circle only) geo radius',
            'geo.r',
          ],
          [
            '(polygon only) geo vertex list',
            'geo.v',
          ],
          [
            'colour',
            'f',
          ],
          [
            'restitution (bounciness)',
            're',
          ],
          [
            'density',
            'de',
          ],
          [
            'friction',
            'fr',
          ],
          [
            'fric players',
            'fp',
          ],
          [
            'no physics',
            'np',
          ],
          [
            'no grapple',
            'ng',
          ],
          [
            'inner grap',
            'ig',
          ],
          [
            'death',
            'd',
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
    'style': 'gm_world',
    'tooltip': '',
    'helpUrl': '',
  },
  {
    'type': 'plat_shape_prop_get',
    'message0': 'platform %1 \'s shape # %2 \'s %3',
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
            '(box/circle only) geo position',
            'geo.c',
          ],
          [
            '(box only) geo angle',
            'geo.a',
          ],
          [
            '(box only) geo width',
            'geo.w',
          ],
          [
            '(box only) geo height',
            'geo.h',
          ],
          [
            '(circle only) geo radius',
            'geo.r',
          ],
          [
            '(polygon only) geo vertices',
            'geo.v',
          ],
          [
            'colour',
            'f',
          ],
          [
            'restitution (bounciness)',
            're',
          ],
          [
            'density',
            'de',
          ],
          [
            'friction',
            'fr',
          ],
          [
            'fric players',
            'fp',
          ],
          [
            'no physics',
            'np',
          ],
          [
            'no grapple',
            'ng',
          ],
          [
            'inner grap',
            'ig',
          ],
          [
            'death',
            'd',
          ],
        ],
      },
    ],
    'inputsInline': true,
    'output': null,
    'style': 'gm_world',
    'tooltip': '',
    'helpUrl': '',
  },
  {
    'type': 'plat_shape_amount',
    'message0': 'platform %1 \'s shape amount',
    'args0': [
      {
        'type': 'input_value',
        'name': 'id',
        'check': 'Number',
      },
    ],
    'output': 'Number',
    'style': 'gm_world',
    'tooltip': '',
    'helpUrl': '',
  },
  {
    'type': 'plat_shape_add',
    'message0': 'add shape %1 to platform %2',
    'args0': [
      {
        'type': 'input_value',
        'name': 'shape',
        'check': 'PlatShape',
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
    'style': 'gm_world',
    'tooltip': '',
    'helpUrl': '',
  },
  {
    'type': 'plat_shape_remove',
    'message0': 'remove platform %1 \'s shape # %2',
    'args0': [
      {
        'type': 'input_value',
        'name': 'id',
        'check': 'Number',
      },
      {
        'type': 'input_value',
        'name': 'shape',
        'check': 'Number',
      },
    ],
    'inputsInline': true,
    'previousStatement': null,
    'nextStatement': null,
    'style': 'gm_world',
    'tooltip': '',
    'helpUrl': '',
  },
  {
    'type': 'plat_clone',
    'lastDummyAlign0': 'RIGHT',
    'message0': 'clone platform %1 return id %2 %3 clone joints %4',
    'args0': [
      {
        'type': 'input_value',
        'name': 'id',
        'check': 'Number',
        'align': 'RIGHT',
      },
      {
        'type': 'field_checkbox',
        'name': 'return_id',
        'checked': true,
      },
      {
        'type': 'input_dummy',
        'align': 'RIGHT',
      },
      {
        'type': 'field_checkbox',
        'name': 'clone_joints',
        'checked': false,
      },
    ],
    'inputsInline': false,
    'previousStatement': null,
    'nextStatement': null,
    'style': 'gm_world',
    'tooltip': '',
    'helpUrl': '',
  },
  {
    'type': 'get_plat_by_name',
    'message0': 'id of platform with name %1',
    'args0': [
      {
        'type': 'input_value',
        'name': 'name',
        'check': 'String',
      },
    ],
    'inputsInline': true,
    'output': 'Number',
    'style': 'gm_world',
    'tooltip': '',
    'helpUrl': '',
  },
  {
    'type': 'get_plat_id_list',
    'message0': 'list of platform ids on view order',
    'args0': [],
    'inputsInline': true,
    'output': 'Array',
    'style': 'gm_world',
    'tooltip': '',
    'helpUrl': '',
  },
  {
    'type': 'plat_delete',
    'lastDummyAlign0': 'RIGHT',
    'message0': 'delete platform %1',
    'args0': [
      {
        'type': 'input_value',
        'name': 'id',
        'check': 'Number',
      },
    ],
    'inputsInline': false,
    'previousStatement': null,
    'nextStatement': null,
    'style': 'gm_world',
    'tooltip': '',
    'helpUrl': '',
  },
  {
    'type': 'grouped_variable_set',
    'message0': 'set group %1 \'s %2 to %3',
    'args0': [
      {
        'type': 'input_value',
        'name': 'GROUP',
      },
      {
        'type': 'field_variable',
        'name': 'VAR',
      },
      {
        'type': 'input_value',
        'name': 'TO',
      },
    ],
    'inputsInline': true,
    'previousStatement': null,
    'nextStatement': null,
    'style': 'variable_blocks',
    'tooltip': '',
    'helpUrl': '',
  },
  {
    'type': 'grouped_variable_change',
    'message0': 'change group %1 \'s %2 by %3',
    'args0': [
      {
        'type': 'input_value',
        'name': 'GROUP',
      },
      {
        'type': 'field_variable',
        'name': 'VAR',
      },
      {
        'type': 'input_value',
        'name': 'DELTA',
      },
    ],
    'inputsInline': true,
    'previousStatement': null,
    'nextStatement': null,
    'style': 'variable_blocks',
    'tooltip': '',
    'helpUrl': '',
  },
  {
    'type': 'grouped_variable_get',
    'message0': 'group %1 \'s %2',
    'args0': [
      {
        'type': 'input_value',
        'name': 'GROUP',
      },
      {
        'type': 'field_variable',
        'name': 'VAR',
      },
    ],
    'inputsInline': true,
    'output': null,
    'style': 'variable_blocks',
    'tooltip': '',
    'helpUrl': '',
  },
  {
    'type': 'create_variable_group',
    'message0': 'create variable group %1',
    'args0': [
      {
        'type': 'input_value',
        'name': 'GROUP',
      },
    ],
    'inputsInline': false,
    'previousStatement': null,
    'nextStatement': null,
    'style': 'variable_blocks',
    'tooltip': '',
    'helpUrl': '',
  },
];
