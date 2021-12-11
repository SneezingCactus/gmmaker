module.exports = [{
  'type': 'create_arrow',
  'message0': 'create arrow %1 x position %2 y position %3 x velocity %4 y velocity %5 angle %6 steps until despawn %7',
  'args0': [
    {
      'type': 'input_dummy',
    },
    {
      'type': 'input_value',
      'name': 'arrow_xpos',
      'check': 'Number',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'arrow_ypos',
      'check': 'Number',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'arrow_xvel',
      'check': 'Number',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'arrow_yvel',
      'check': 'Number',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'arrow_angle',
      'check': 'Number',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'arrow_time',
      'check': 'Number',
      'align': 'RIGHT',
    },
  ],
  'inputsInline': false,
  'previousStatement': null,
  'nextStatement': null,
  'colour': 230,
  'tooltip': 'Create an arrow.',
  'helpUrl': '',
},
{
  'type': 'player_die',
  'message0': 'kill %1 %2 %3',
  'args0': [
    {
      'type': 'field_dropdown',
      'name': 'player',
      'options': [
        [
          'your player',
          'self',
        ],
        [
          'player with id',
          'id',
        ],
      ],
    },
    {
      'type': 'input_dummy',
    },
    {
      'type': 'input_value',
      'name': 'player_id',
      'check': 'Number',
    },
  ],
  'inputsInline': true,
  'previousStatement': null,
  'colour': 230,
  'tooltip': 'Kill a player.',
  'helpUrl': '',
},
{
  'type': 'draw_line',
  'lastDummyAlign0': 'RIGHT',
  'message0': 'draw line %1 from x %2 y %3 to x %4 y %5 width %6 colour %7 anchored to player? %8',
  'args0': [
    {
      'type': 'input_dummy',
    },
    {
      'type': 'input_value',
      'name': 'line_x1',
      'check': 'Number',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'line_y1',
      'check': 'Number',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'line_x2',
      'check': 'Number',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'line_y2',
      'check': 'Number',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'line_width',
      'check': 'Number',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'line_color',
      'check': 'Colour',
      'align': 'RIGHT',
    },
    {
      'type': 'field_checkbox',
      'name': 'line_anchored',
      'checked': false,
    },
  ],
  'inputsInline': false,
  'previousStatement': null,
  'nextStatement': null,
  'colour': 160,
  'tooltip': 'Draw a line to the screen.',
  'helpUrl': '',
},
{
  'type': 'draw_rect',
  'lastDummyAlign0': 'RIGHT',
  'message0': 'draw rectangle %1 x %2 y %3 width %4 height %5 colour %6 anchored to player? %7',
  'args0': [
    {
      'type': 'input_dummy',
    },
    {
      'type': 'input_value',
      'name': 'rect_x1',
      'check': 'Number',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'rect_y1',
      'check': 'Number',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'rect_x2',
      'check': 'Number',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'rect_y2',
      'check': 'Number',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'rect_color',
      'check': 'Colour',
      'align': 'RIGHT',
    },
    {
      'type': 'field_checkbox',
      'name': 'rect_anchored',
      'checked': false,
    },
  ],
  'inputsInline': false,
  'previousStatement': null,
  'nextStatement': null,
  'colour': 160,
  'tooltip': 'Draw a rectangle to the screen.',
  'helpUrl': '',
},
{
  'type': 'draw_circle',
  'lastDummyAlign0': 'RIGHT',
  'message0': 'draw circle %1 at x %2 y %3 with radius %4 color %5 anchored to player? %6',
  'args0': [
    {
      'type': 'input_dummy',
    },
    {
      'type': 'input_value',
      'name': 'circ_x',
      'check': 'Number',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'circ_y',
      'check': 'Number',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'circ_radius',
      'check': 'Number',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'circ_color',
      'check': 'Colour',
      'align': 'RIGHT',
    },
    {
      'type': 'field_checkbox',
      'name': 'circ_anchored',
      'checked': false,
    },
  ],
  'inputsInline': false,
  'previousStatement': null,
  'nextStatement': null,
  'colour': 160,
  'tooltip': 'Draw a circle to the screen.',
  'helpUrl': '',
},
{
  'type': 'draw_text',
  'lastDummyAlign0': 'RIGHT',
  'message0': 'draw text %1 text %2 at x %3 y %4 color %5 %6 size %7 %8 bold? %9 %10 centered? %11 %12 anchored to player? %13',
  'args0': [
    {
      'type': 'input_dummy',
    },
    {
      'type': 'input_value',
      'name': 'text_string',
      'check': 'String',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'text_x',
      'check': 'Number',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'text_y',
      'check': 'Number',
      'align': 'RIGHT',
    },
    {
      'type': 'field_colour',
      'name': 'text_color',
      'colour': '#ff0000',
    },
    {
      'type': 'input_dummy',
      'align': 'RIGHT',
    },
    {
      'type': 'field_number',
      'name': 'text_size',
      'value': 11,
    },
    {
      'type': 'input_dummy',
      'align': 'RIGHT',
    },
    {
      'type': 'field_checkbox',
      'name': 'text_bold',
      'checked': false,
    },
    {
      'type': 'input_dummy',
      'align': 'RIGHT',
    },
    {
      'type': 'field_checkbox',
      'name': 'text_centered',
      'checked': false,
    },
    {
      'type': 'input_dummy',
      'align': 'RIGHT',
    },
    {
      'type': 'field_checkbox',
      'name': 'text_anchored',
      'checked': false,
    },
  ],
  'inputsInline': false,
  'previousStatement': null,
  'nextStatement': null,
  'colour': 160,
  'tooltip': 'Draw text to the screen.',
  'helpUrl': '',
},
{
  'type': 'draw_clear',
  'message0': 'clear player\'s drawings',
  'inputsInline': false,
  'previousStatement': null,
  'nextStatement': null,
  'colour': 160,
  'tooltip': 'Clear all previous drawings from the player.',
  'helpUrl': '',
},
{
  'type': 'on_each_phys_frame',
  'message0': 'on physics step %1 %2',
  'args0': [
    {
      'type': 'input_dummy',
    },
    {
      'type': 'input_statement',
      'name': 'code',
    },
  ],
  'colour': 20,
  'tooltip': 'Executes every time the physics get calculated (30 times a second).',
  'helpUrl': '',
},
{
  'type': 'on_each_render_frame',
  'message0': 'on render %1 %2',
  'args0': [
    {
      'type': 'input_dummy',
    },
    {
      'type': 'input_statement',
      'name': 'code',
    },
  ],
  'colour': 20,
  'tooltip': 'Executes every time the game is rendered (varies depending on your FPS). Game modifying blocks such as "set player\'s x position" do not work here.',
  'helpUrl': '',
},
{
  'type': 'on_player_collide',
  'message0': 'when the player collides with  %1 %2 store info in variables %3 %4 %5 %6 %7 %8 %9',
  'args0': [
    {
      'type': 'field_dropdown',
      'name': 'collide_type',
      'options': [
        [
          'another player',
          'collide_player',
        ],
        [
          'an arrow',
          'collide_arrow',
        ],
        [
          'a platform',
          'collide_platform',
        ],
      ],
    },
    {
      'type': 'input_dummy',
    },
    {
      'type': 'field_checkbox',
      'name': 'return_info',
      'checked': false,
    },
    {
      'type': 'field_variable',
      'name': 'player_id',
      'variable': 'hit player id',
    },
    {
      'type': 'field_variable',
      'name': 'arrow_id',
      'variable': 'hit arrow number',
    },
    {
      'type': 'field_variable',
      'name': 'normal_x',
      'variable': 'hit normal x',
    },
    {
      'type': 'field_variable',
      'name': 'normal_y',
      'variable': 'hit normal y',
    },
    {
      'type': 'input_dummy',
    },
    {
      'type': 'input_statement',
      'name': 'code',
    },
  ],
  'colour': 20,
  'tooltip': 'Executes when the player collides with a specified type of object.',
  'helpUrl': '',
},
{
  'type': 'on_round_start',
  'message0': 'on round start %1 %2',
  'args0': [
    {
      'type': 'input_dummy',
    },
    {
      'type': 'input_statement',
      'name': 'code',
    },
  ],
  'colour': 20,
  'tooltip': 'Executes when a round starts.',
  'helpUrl': '',
},
{
  'type': 'set_player_prop',
  'message0': 'set %1 %2 %3 %4 to %5',
  'args0': [
    {
      'type': 'field_dropdown',
      'name': 'player',
      'options': [
        [
          'your',
          'self',
        ],
        [
          'player with id',
          'id',
        ],
      ],
    },
    {
      'type': 'input_dummy',
    },
    {
      'type': 'input_value',
      'name': 'player_id',
      'check': 'Number',
    },
    {
      'type': 'field_dropdown',
      'name': 'player_prop',
      'options': [
        [
          'x position',
          'x',
        ],
        [
          'y position',
          'y',
        ],
        [
          'x velocity',
          'xv',
        ],
        [
          'y velocity',
          'yv',
        ],
        [
          'angle',
          'a',
        ],
      ],
    },
    {
      'type': 'input_value',
      'name': 'set_number',
      'check': 'Number',
    },
  ],
  'inputsInline': true,
  'previousStatement': null,
  'nextStatement': null,
  'colour': 230,
  'tooltip': 'Set a player\'s property to a specified value.',
  'helpUrl': '',
},
{
  'type': 'get_player_prop',
  'message0': 'get %1 %2 %3 %4',
  'args0': [
    {
      'type': 'field_dropdown',
      'name': 'player',
      'options': [
        [
          'your',
          'self',
        ],
        [
          'player with id',
          'id',
        ],
      ],
    },
    {
      'type': 'input_dummy',
    },
    {
      'type': 'input_value',
      'name': 'player_id',
      'check': 'Number',
    },
    {
      'type': 'field_dropdown',
      'name': 'property',
      'options': [
        [
          'x position',
          'x',
        ],
        [
          'y position',
          'y',
        ],
        [
          'x velocity',
          'xv',
        ],
        [
          'y velocity',
          'yv',
        ],
        [
          'angle',
          'a',
        ],
        [
          'size',
          'size',
        ],
      ],
    },
  ],
  'output': 'Number',
  'colour': 230,
  'tooltip': 'Get a player\'s property. If the player doesn\'t exist, it will return 0.',
  'helpUrl': '',
},
{
  'type': 'set_last_arrow_prop',
  'message0': 'set %1 %2 %3 %4 %5 %6 \'s %7 to %8',
  'args0': [
    {
      'type': 'field_dropdown',
      'name': 'player',
      'options': [
        [
          'your',
          'self',
        ],
        [
          'player with id',
          'id',
        ],
      ],
    },
    {
      'type': 'input_dummy',
    },
    {
      'type': 'input_value',
      'name': 'player_id',
      'check': 'Number',
    },
    {
      'type': 'field_dropdown',
      'name': 'arrow',
      'options': [
        [
          'last arrow',
          'last',
        ],
        [
          'arrow number',
          'id',
        ],
      ],
    },
    {
      'type': 'input_dummy',
    },
    {
      'type': 'input_value',
      'name': 'arrow_id',
      'check': 'Number',
    },
    {
      'type': 'field_dropdown',
      'name': 'arrow_prop',
      'options': [
        [
          'x position',
          'x',
        ],
        [
          'y position',
          'y',
        ],
        [
          'x velocity',
          'xv',
        ],
        [
          'y velocity',
          'yv',
        ],
        [
          'angle',
          'a',
        ],
        [
          'amount of steps until despawn',
          'fte',
        ],
      ],
    },
    {
      'type': 'input_value',
      'name': 'set_number',
      'check': 'Number',
    },
  ],
  'inputsInline': true,
  'previousStatement': null,
  'nextStatement': null,
  'colour': 230,
  'tooltip': 'Set a player\'s arrow\'s property to a specified value.',
  'helpUrl': '',
},
{
  'type': 'pressing_key',
  'message0': 'the player is pressing %1',
  'args0': [
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
          'heavy',
          'action',
        ],
        [
          'special',
          'action2',
        ],
      ],
    },
  ],
  'output': 'Boolean',
  'colour': 20,
  'tooltip': 'Returns true if the player is pressing the specified key.',
  'helpUrl': '',
},
{
  'type': 'on_arrow_collide',
  'message0': 'when player\'s arrow collides with  %1 %2 store info in variables %3 %4 %5 %6 %7 %8 %9 %10',
  'args0': [
    {
      'type': 'field_dropdown',
      'name': 'collide_type',
      'options': [
        [
          'a player',
          'collide_player',
        ],
        [
          'another arrow',
          'collide_arrow',
        ],
        [
          'a platform',
          'collide_platform',
        ],
      ],
    },
    {
      'type': 'input_dummy',
    },
    {
      'type': 'field_checkbox',
      'name': 'return_info',
      'checked': false,
    },
    {
      'type': 'field_variable',
      'name': 'self_arrow_id',
      'variable': 'own arrow number',
    },
    {
      'type': 'field_variable',
      'name': 'player_id',
      'variable': 'hit player id',
    },
    {
      'type': 'field_variable',
      'name': 'arrow_id',
      'variable': 'hit arrow number',
    },
    {
      'type': 'field_variable',
      'name': 'normal_x',
      'variable': 'hit normal x',
    },
    {
      'type': 'field_variable',
      'name': 'normal_y',
      'variable': 'hit normal y',
    },
    {
      'type': 'input_dummy',
    },
    {
      'type': 'input_statement',
      'name': 'code',
    },
  ],
  'colour': 20,
  'tooltip': 'Executes when any of the player\'s arrows collides with a specified type of object.',
  'helpUrl': '',
},
{
  'type': 'unit_to_pixel',
  'message0': 'get screen pos of %1',
  'args0': [
    {
      'type': 'input_value',
      'name': 'unit_value',
      'check': 'Number',
    },
  ],
  'output': 'Number',
  'colour': 160,
  'tooltip': 'Turn physics length units into pixels.',
  'helpUrl': '',
},
{
  'type': 'pixel_to_unit',
  'message0': 'get physics pos of %1',
  'args0': [
    {
      'type': 'input_value',
      'name': 'unit_value',
      'check': 'Number',
    },
  ],
  'output': 'Number',
  'tooltip': '[NO LONGER WORKS] Turn pixels into physics length units.',
  'helpUrl': '',
},
{
  'type': 'raycast',
  'lastDummyAlign0': 'RIGHT',
  'message0': 'raycast from x: %1 y: %2 to x: %3 y: %4 collide with A: %5 %6 B: %7 %8 C: %9 %10 D: %11 %12 players (including self): %13 %14 and return %15 %16 %17 %18 %19',
  'args0': [
    {
      'type': 'input_value',
      'name': 'a_x',
      'check': 'Number',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'a_y',
      'check': 'Number',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'b_x',
      'check': 'Number',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'b_y',
      'check': 'Number',
      'align': 'RIGHT',
    },
    {
      'type': 'field_checkbox',
      'name': 'collide_a',
      'checked': false,
    },
    {
      'type': 'input_dummy',
      'align': 'RIGHT',
    },
    {
      'type': 'field_checkbox',
      'name': 'collide_b',
      'checked': false,
    },
    {
      'type': 'input_dummy',
      'align': 'RIGHT',
    },
    {
      'type': 'field_checkbox',
      'name': 'collide_c',
      'checked': false,
    },
    {
      'type': 'input_dummy',
      'align': 'RIGHT',
    },
    {
      'type': 'field_checkbox',
      'name': 'collide_d',
      'checked': false,
    },
    {
      'type': 'input_dummy',
      'align': 'RIGHT',
    },
    {
      'type': 'field_checkbox',
      'name': 'collide_player',
      'checked': false,
    },
    {
      'type': 'input_dummy',
      'align': 'RIGHT',
    },
    {
      'type': 'field_variable',
      'name': 'point_x',
      'variable': 'hit point x',
    },
    {
      'type': 'field_variable',
      'name': 'point_y',
      'variable': 'hit point y',
    },
    {
      'type': 'input_dummy',
      'align': 'RIGHT',
    },
    {
      'type': 'field_variable',
      'name': 'normal_x',
      'variable': 'hit normal x',
    },
    {
      'type': 'field_variable',
      'name': 'normal_y',
      'variable': 'hit normal y',
    },
  ],
  'inputsInline': false,
  'output': null,
  'colour': 230,
  'tooltip': '"Throws" a ray from point A to point B and if it hits, returns hit point and normal.',
  'helpUrl': '',
},
{
  'type': 'draw_poly',
  'lastDummyAlign0': 'RIGHT',
  'message0': 'draw polygon %1 with vertex list %2 (2 values = 1 vertex) %3 color %4 anchored to player? %5',
  'args0': [
    {
      'type': 'input_dummy',
    },
    {
      'type': 'input_value',
      'name': 'poly_vertex',
      'check': 'Array',
      'align': 'RIGHT',
    },
    {
      'type': 'input_dummy',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'poly_color',
      'check': 'Colour',
      'align': 'RIGHT',
    },
    {
      'type': 'field_checkbox',
      'name': 'poly_anchored',
      'checked': false,
    },
  ],
  'inputsInline': false,
  'previousStatement': null,
  'nextStatement': null,
  'colour': 160,
  'tooltip': 'Draw a polygon to the screen.',
  'helpUrl': '',
},
{
  'type': 'deg_to_rad',
  'message0': 'degrees to radians %1',
  'args0': [
    {
      'type': 'input_value',
      'name': 'degree_value',
      'check': 'Number',
    },
  ],
  'output': 'Number',
  'colour': 230,
  'tooltip': 'Turn degrees into radians.',
  'helpUrl': '',
},
{
  'type': 'rad_to_deg',
  'message0': 'radians to degrees %1',
  'args0': [
    {
      'type': 'input_value',
      'name': 'radian_value',
      'check': 'Number',
    },
  ],
  'output': 'Number',
  'colour': 230,
  'tooltip': 'Turn radians into degrees.',
  'helpUrl': '',
},
{
  'type': 'delete_arrows',
  'message0': 'delete %1 %2 %3 arrows',
  'args0': [
    {
      'type': 'field_dropdown',
      'name': 'player',
      'options': [
        [
          'your',
          'self',
        ],
        [
          'player with id',
          'id',
        ],
      ],
    },
    {
      'type': 'input_dummy',
    },
    {
      'type': 'input_value',
      'name': 'player_id',
      'check': 'Number',
    },
  ],
  'previousStatement': null,
  'nextStatement': null,
  'colour': 230,
  'tooltip': 'Delete all arrows that belong to a player.',
  'helpUrl': '',
},
{
  'type': 'math_atan2',
  'message0': 'atan2 of x: %1 y: %2',
  'args0': [
    {
      'type': 'input_value',
      'name': 'x',
      'check': 'Number',
    },
    {
      'type': 'input_value',
      'name': 'y',
      'check': 'Number',
    },
  ],
  'inputsInline': true,
  'output': 'Number',
  'colour': 230,
  'tooltip': 'Returns the atan2 of the specified coordinate, in degrees.',
  'helpUrl': '',
},
{
  'type': 'math_distance',
  'message0': 'distance between x: %1 y: %2 and x: %3 y: %4',
  'args0': [
    {
      'type': 'input_value',
      'name': 'a_x',
      'check': 'Number',
    },
    {
      'type': 'input_value',
      'name': 'a_y',
      'check': 'Number',
    },
    {
      'type': 'input_value',
      'name': 'b_x',
      'check': 'Number',
    },
    {
      'type': 'input_value',
      'name': 'b_y',
      'check': 'Number',
    },
  ],
  'inputsInline': true,
  'output': 'Number',
  'colour': 230,
  'tooltip': 'Returns the distance between two points.',
  'helpUrl': '',
},
{
  'type': 'get_player_color',
  'message0': 'get %1 %2 %3 main colour',
  'args0': [
    {
      'type': 'field_dropdown',
      'name': 'player',
      'options': [
        [
          'your player\'s',
          'self',
        ],
        [
          'player with id',
          'id',
        ],
      ],
    },
    {
      'type': 'input_dummy',
    },
    {
      'type': 'input_value',
      'name': 'player_id',
      'check': 'Number',
    },
  ],
  'output': 'Colour',
  'colour': 160,
  'tooltip': 'Get a player\'s main (background) colour.',
  'helpUrl': '',
},
{
  'type': 'change_last_arrow_prop',
  'message0': 'change %1 %2 %3 %4 %5 %6 \'s %7 by %8',
  'args0': [
    {
      'type': 'field_dropdown',
      'name': 'player',
      'options': [
        [
          'your',
          'self',
        ],
        [
          'player with id',
          'id',
        ],
      ],
    },
    {
      'type': 'input_dummy',
    },
    {
      'type': 'input_value',
      'name': 'player_id',
      'check': 'Number',
    },
    {
      'type': 'field_dropdown',
      'name': 'arrow',
      'options': [
        [
          'last arrow',
          'last',
        ],
        [
          'arrow number',
          'id',
        ],
      ],
    },
    {
      'type': 'input_dummy',
    },
    {
      'type': 'input_value',
      'name': 'arrow_id',
      'check': 'Number',
    },
    {
      'type': 'field_dropdown',
      'name': 'arrow_prop',
      'options': [
        [
          'x position',
          'x',
        ],
        [
          'y position',
          'y',
        ],
        [
          'x velocity',
          'xv',
        ],
        [
          'y velocity',
          'yv',
        ],
        [
          'angle',
          'a',
        ],
        [
          'steps until despawn',
          'fte',
        ],
      ],
    },
    {
      'type': 'input_value',
      'name': 'change_number',
      'check': 'Number',
    },
  ],
  'inputsInline': true,
  'previousStatement': null,
  'nextStatement': null,
  'colour': 230,
  'tooltip': 'Change a player\'s arrow\'s property by a specified value.',
  'helpUrl': '',
},
{
  'type': 'get_last_arrow_prop',
  'message0': 'get %1 %2 %3 %4 %5 %6 \'s %7',
  'args0': [
    {
      'type': 'field_dropdown',
      'name': 'player',
      'options': [
        [
          'your',
          'self',
        ],
        [
          'player with id',
          'id',
        ],
      ],
    },
    {
      'type': 'input_dummy',
    },
    {
      'type': 'input_value',
      'name': 'player_id',
      'check': 'Number',
    },
    {
      'type': 'field_dropdown',
      'name': 'arrow',
      'options': [
        [
          'last arrow',
          'last',
        ],
        [
          'arrow number',
          'id',
        ],
      ],
    },
    {
      'type': 'input_dummy',
    },
    {
      'type': 'input_value',
      'name': 'arrow_id',
      'check': 'Number',
    },
    {
      'type': 'field_dropdown',
      'name': 'property',
      'options': [
        [
          'x position',
          'x',
        ],
        [
          'y position',
          'y',
        ],
        [
          'x velocity',
          'xv',
        ],
        [
          'y velocity',
          'yv',
        ],
        [
          'angle',
          'a',
        ],
        [
          'steps until despawn',
          'fte',
        ],
      ],
    },
  ],
  'inputsInline': true,
  'output': 'Number',
  'colour': 230,
  'tooltip': 'Get a player\'s arrow\'s property.',
  'helpUrl': '',
},
{
  'type': 'change_player_prop',
  'message0': 'change %1 %2 %3 %4 by %5',
  'args0': [
    {
      'type': 'field_dropdown',
      'name': 'player',
      'options': [
        [
          'your',
          'self',
        ],
        [
          'player with id',
          'id',
        ],
      ],
    },
    {
      'type': 'input_dummy',
    },
    {
      'type': 'input_value',
      'name': 'player_id',
      'check': 'Number',
    },
    {
      'type': 'field_dropdown',
      'name': 'player_prop',
      'options': [
        [
          'x position',
          'x',
        ],
        [
          'y position',
          'y',
        ],
        [
          'x velocity',
          'xv',
        ],
        [
          'y velocity',
          'yv',
        ],
        [
          'angle',
          'a',
        ],
      ],
    },
    {
      'type': 'input_value',
      'name': 'change_number',
      'check': 'Number',
    },
  ],
  'inputsInline': true,
  'previousStatement': null,
  'nextStatement': null,
  'colour': 230,
  'tooltip': 'Set a player\'s property to a specified value.',
  'helpUrl': '',
},
{
  'type': 'get_arrow_amount',
  'message0': 'get %1 %2 %3 arrow amount',
  'args0': [
    {
      'type': 'field_dropdown',
      'name': 'player',
      'options': [
        [
          'your',
          'self',
        ],
        [
          'player with id',
          'id',
        ],
      ],
    },
    {
      'type': 'input_dummy',
    },
    {
      'type': 'input_value',
      'name': 'player_id',
      'check': 'Number',
    },
  ],
  'output': 'Number',
  'colour': 230,
  'tooltip': 'Get the amount of arrows a player has.',
  'helpUrl': '',
},
{
  'type': 'get_map_size',
  'message0': 'get map size',
  'output': 'Number',
  'colour': 230,
  'tooltip': 'Gives you the map size. This is useful when you need a physics coordinate that is constant between map sizes.',
  'helpUrl': '',
},
{
  'type': 'get_own_id',
  'message0': 'get own player id',
  'output': 'Number',
  'colour': 230,
  'tooltip': 'Get your player\'s id.',
  'helpUrl': '',
}];
