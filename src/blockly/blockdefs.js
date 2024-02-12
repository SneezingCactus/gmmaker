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
  'style': 'gm_players',
  'tooltip': 'Create an arrow.',
  'helpUrl': '',
},
{
  'type': 'player_die',
  'message0': 'kill %1 %2 %3 , %4 respawn',
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
  'inputsInline': true,
  'previousStatement': null,
  'style': 'gm_players',
  'tooltip': 'Kill a player. Not allowing a player to respawn makes the player stay killed until the round ends, even when respawn on death is activated.',
  'helpUrl': '',
},
{
  'type': 'draw_line',
  'lastDummyAlign0': 'RIGHT',
  'message0': 'draw line %1 from x %2 y %3 to x %4 y %5 width %6 colour %7 alpha (0 to 100) %8 anchored to player? %9 %10 only visible to player? %11 %12 doesn\'t move with camera? %13',
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
      'type': 'input_value',
      'name': 'line_alpha',
      'check': 'Number',
      'align': 'RIGHT',
    },
    {
      'type': 'field_checkbox',
      'name': 'line_anchored',
      'checked': false,
    },
    {
      'type': 'input_dummy',
      'align': 'RIGHT',
    },
    {
      'type': 'field_checkbox',
      'name': 'line_onlyplayer',
      'checked': false,
    },
    {
      'type': 'input_dummy',
      'align': 'RIGHT',
    },
    {
      'type': 'field_checkbox',
      'name': 'line_nocameramove',
      'checked': false,
    },
  ],
  'inputsInline': false,
  'previousStatement': null,
  'nextStatement': null,
  'style': 'gm_graphics',
  'tooltip': 'Draw a line to the screen. If the drawing is anchored to player, the "don\'t move with camera" option will be ignored.',
  'helpUrl': '',
},
{
  'type': 'draw_rect',
  'lastDummyAlign0': 'RIGHT',
  'message0': 'draw rectangle %1 x %2 y %3 width %4 height %5 angle %6 colour %7 alpha (0 to 100) %8 anchored to player? %9 %10 only visible to player? %11 %12 doesn\'t move with camera? %13',
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
      'name': 'rect_angle',
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
      'type': 'input_value',
      'name': 'rect_alpha',
      'check': 'Number',
      'align': 'RIGHT',
    },
    {
      'type': 'field_checkbox',
      'name': 'rect_anchored',
      'checked': false,
    },
    {
      'type': 'input_dummy',
      'align': 'RIGHT',
    },
    {
      'type': 'field_checkbox',
      'name': 'rect_onlyplayer',
      'checked': false,
    },
    {
      'type': 'input_dummy',
      'align': 'RIGHT',
    },
    {
      'type': 'field_checkbox',
      'name': 'rect_nocameramove',
      'checked': false,
    },
  ],
  'inputsInline': false,
  'previousStatement': null,
  'nextStatement': null,
  'style': 'gm_graphics',
  'tooltip': 'Draw a rectangle to the screen.  If the drawing is anchored to player, the "don\'t move with camera" option will be ignored.',
  'helpUrl': '',
},
{
  'type': 'draw_circle',
  'lastDummyAlign0': 'RIGHT',
  'message0': 'draw circle %1 at x %2 y %3 with radius %4 colour %5 alpha (0 to 100) %6 anchored to player? %7 %8 only visible to player? %9 %10 doesn\'t move with camera? %11',
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
      'type': 'input_value',
      'name': 'circ_alpha',
      'check': 'Number',
      'align': 'RIGHT',
    },
    {
      'type': 'field_checkbox',
      'name': 'circ_anchored',
      'checked': false,
    },
    {
      'type': 'input_dummy',
      'align': 'RIGHT',
    },
    {
      'type': 'field_checkbox',
      'name': 'circ_onlyplayer',
      'checked': false,
    },
    {
      'type': 'input_dummy',
      'align': 'RIGHT',
    },
    {
      'type': 'field_checkbox',
      'name': 'circ_nocameramove',
      'checked': false,
    },
  ],
  'inputsInline': false,
  'previousStatement': null,
  'nextStatement': null,
  'style': 'gm_graphics',
  'tooltip': 'Draw a circle to the screen.  If the drawing is anchored to player, the "don\'t move with camera" option will be ignored.',
  'helpUrl': '',
},
{
  'type': 'draw_text',
  'lastDummyAlign0': 'RIGHT',
  'message0': 'draw text %1 text %2 at x %3 y %4 size %5 colour %6 alpha (0 to 100) %7 centered? %8 %9 anchored to player? %10 %11 only visible to player? %12 %13 doesn\'t move with camera? %14',
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
      'type': 'input_value',
      'name': 'text_size',
      'check': 'Number',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'text_color',
      'check': 'Colour',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'text_alpha',
      'check': 'Number',
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
    {
      'type': 'input_dummy',
      'align': 'RIGHT',
    },
    {
      'type': 'field_checkbox',
      'name': 'text_onlyplayer',
      'checked': false,
    },
    {
      'type': 'input_dummy',
      'align': 'RIGHT',
    },
    {
      'type': 'field_checkbox',
      'name': 'text_nocameramove',
      'checked': false,
    },
  ],
  'inputsInline': false,
  'previousStatement': null,
  'nextStatement': null,
  'style': 'gm_graphics',
  'tooltip': 'Draw text to the screen.  If the drawing is anchored to player, the "don\'t move with camera" option will be ignored. Text is resource intensive, so it\'s a bad idea to have more than 20 of them on screen.',
  'helpUrl': '',
},
{
  'type': 'draw_clear',
  'message0': 'clear player\'s drawings',
  'inputsInline': false,
  'previousStatement': null,
  'nextStatement': null,
  'style': 'gm_graphics',
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
  'style': 'gm_events',
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
  'style': 'gm_events',
  'tooltip': 'Executes every time the game is rendered (varies depending on your FPS). Game modifying blocks such as "set player\'s x position" do not work here.',
  'helpUrl': '',
},
{
  'type': 'on_player_collide',
  'message0': 'when the player collides with  %1 %2 store info in variables %3 %4 %5 %6 %7 %8 %9 %10 %11',
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
      'name': 'platform_id',
      'variable': 'hit platform id',
    },
    {
      'type': 'field_variable',
      'name': 'shape_id',
      'variable': 'hit shape number',
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
  'style': 'gm_events',
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
  'style': 'gm_events',
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
  'style': 'gm_players',
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
  'inputsInline': true,
  'output': 'Number',
  'style': 'gm_players',
  'tooltip': 'Get a player\'s property. If the player doesn\'t exist, it will return 0.',
  'helpUrl': '',
},
{
  'type': 'set_last_arrow_prop',
  'message0': 'set %1 %2 %3 %4 %5 %6 %7 to %8',
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
        [
          'arrows',
          'all',
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
  'style': 'gm_players',
  'tooltip': 'Set a player\'s arrow\'s property to a specified value.',
  'helpUrl': '',
},
{
  'type': 'pressing_key',
  'message0': '%1 %2 %3 is pressing %4',
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
  'inputsInline': true,
  'output': 'Boolean',
  'style': 'gm_players',
  'tooltip': 'Returns true if the player is pressing the specified key.',
  'helpUrl': '',
},
{
  'type': 'on_arrow_collide',
  'message0': 'when player\'s arrow collides with  %1 %2 store info in variables %3 %4 %5 %6 %7 %8 %9 %10 %11 %12',
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
      'name': 'platform_id',
      'variable': 'hit platform id',
    },
    {
      'type': 'field_variable',
      'name': 'shape_id',
      'variable': 'hit shape number',
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
  'style': 'gm_events',
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
  'tooltip': '[NO LONGER WORKS]  Turn physics length units into pixels.',
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
  'message0': 'raycast from x: %1 y: %2 to x: %3 y: %4 collide with A: %5 %6 B: %7 %8 C: %9 %10 D: %11 %12 players (including self): %13 %14 and return %15 %16 %17 %18 %19 %20 %21 %22',
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
    {
      'type': 'input_dummy',
      'align': 'RIGHT',
    },
    {
      'type': 'field_variable',
      'name': 'object_type',
      'variable': 'hit object type',
    },
    {
      'type': 'field_variable',
      'name': 'object_id',
      'variable': 'hit object id',
    },
  ],
  'inputsInline': false,
  'output': 'Boolean',
  'style': 'gm_mapobjects',
  'tooltip': '"Throws" a ray from point A to point B. if it hits something, it returns true and sets the specified variables to hit point, normal, object type and id. The "hit object type" returned is text, and it can be either "platform" or "player".',
  'helpUrl': '',
},
{
  'type': 'draw_poly',
  'lastDummyAlign0': 'RIGHT',
  'message0': 'draw polygon %1 with vertex list %2 (2 items = 1 vertex) %3 colour %4 alpha (0 to 100) %5 anchored to player? %6 %7 only visible to player? %8 %9 doesn\'t move with camera? %10',
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
      'type': 'input_value',
      'name': 'poly_alpha',
      'check': 'Number',
      'align': 'RIGHT',
    },
    {
      'type': 'field_checkbox',
      'name': 'poly_anchored',
      'checked': false,
    },
    {
      'type': 'input_dummy',
      'align': 'RIGHT',
    },
    {
      'type': 'field_checkbox',
      'name': 'poly_onlyplayer',
      'checked': false,
    },
    {
      'type': 'input_dummy',
      'align': 'RIGHT',
    },
    {
      'type': 'field_checkbox',
      'name': 'poly_nocameramove',
      'checked': false,
    },
  ],
  'inputsInline': false,
  'previousStatement': null,
  'nextStatement': null,
  'style': 'gm_graphics',
  'tooltip': 'Draw a polygon to the screen. Every pair of items correspond to the x and y coordinates of a vertex.  If the drawing is anchored to player, the "don\'t move with camera" option will be ignored.',
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
  'style': 'gm_players',
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
  'style': 'gm_players',
  'tooltip': 'Turn radians into degrees.',
  'helpUrl': '',
},
{
  'type': 'delete_arrows',
  'message0': 'delete %1 %2 %3 %4 %5 %6',
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
          'arrows',
          'all',
        ],
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
  ],
  'inputsInline': true,
  'previousStatement': null,
  'nextStatement': null,
  'style': 'gm_players',
  'tooltip': 'Delete an arrow or all arrows that belong to a player.',
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
  'style': 'gm_players',
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
  'style': 'gm_players',
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
  'inputsInline': true,
  'output': 'Colour',
  'style': 'gm_graphics',
  'tooltip': 'Get a player\'s main (background) colour.',
  'helpUrl': '',
},
{
  'type': 'change_last_arrow_prop',
  'message0': 'change %1 %2 %3 %4 %5 %6 %7 by %8',
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
        [
          'arrows',
          'all',
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
  'style': 'gm_players',
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
  'style': 'gm_players',
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
  'style': 'gm_players',
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
  'inputsInline': true,
  'output': 'Number',
  'style': 'gm_players',
  'tooltip': 'Get the amount of arrows a player has.',
  'helpUrl': '',
},
{
  'type': 'get_map_size',
  'message0': 'get map size',
  'output': 'Number',
  'style': 'gm_mapobjects',
  'tooltip': 'Gives you the map size. This is useful when you need a physics coordinate that is constant between map sizes.',
  'helpUrl': '',
},
{
  'type': 'get_own_id',
  'message0': 'get %1 player id',
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
          'host\'s',
          'host',
        ],
      ],
    },
  ],
  'output': 'Number',
  'style': 'gm_players',
  'tooltip': 'Get your player\'s id, or the host\'s player id.',
  'helpUrl': '',
},
{
  'type': 'input_override',
  'message0': 'override %1 %2 %3 %4 key to %5 %6',
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
    {
      'type': 'input_dummy',
    },
    {
      'type': 'input_value',
      'name': 'override_value',
      'check': 'Boolean',
    },
  ],
  'inputsInline': true,
  'previousStatement': null,
  'nextStatement': null,
  'style': 'gm_players',
  'tooltip': 'Overrides a key to be on/off until a "stop overriding" block. Only built-in behaviour related to that key will be overriden, the real value is still visible to the custom mode.',
  'helpUrl': '',
},
{
  'type': 'stop_input_override',
  'message0': 'stop overriding %1 %2 %3 %4 key',
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
  'inputsInline': true,
  'previousStatement': null,
  'nextStatement': null,
  'style': 'gm_players',
  'tooltip': 'Stop overriding a key.',
  'helpUrl': '',
},
{
  'type': 'get_player_id_list',
  'message0': 'get all player ids as list',
  'output': 'Array',
  'style': 'gm_players',
  'tooltip': 'Returns a list that contains the ids of all alive players.',
  'helpUrl': '',
},
{
  'type': 'rectangle_shape',
  'message0': 'rectangle shape %1 colour %2 x %3 y %4 width %5 height %6 angle %7 no physics %8 , no grapple %9 %10 inner grap %11 , death %12',
  'args0': [
    {
      'type': 'input_dummy',
    },
    {
      'type': 'input_value',
      'name': 'color',
      'check': 'Colour',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'xpos',
      'check': 'Number',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'ypos',
      'check': 'Number',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'width',
      'check': 'Number',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'height',
      'check': 'Number',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'angle',
      'check': 'Number',
      'align': 'RIGHT',
    },
    {
      'type': 'field_checkbox',
      'name': 'nophys',
      'checked': false,
    },
    {
      'type': 'field_checkbox',
      'name': 'nograp',
      'checked': false,
    },
    {
      'type': 'input_dummy',
    },
    {
      'type': 'field_checkbox',
      'name': 'ingrap',
      'checked': false,
    },
    {
      'type': 'field_checkbox',
      'name': 'death',
      'checked': false,
    },
  ],
  'inputsInline': false,
  'output': 'Shape',
  'style': 'gm_mapobjects',
  'tooltip': 'Defines a rectangle shape to use in the "create platform" block.',
  'helpUrl': '',
},
{
  'type': 'circle_shape',
  'message0': 'circle shape %1 colour %2 x %3 y %4 radius %5 no physics %6 , no grapple %7 %8 inner grap %9 , death %10',
  'args0': [
    {
      'type': 'input_dummy',
    },
    {
      'type': 'input_value',
      'name': 'color',
      'check': 'Colour',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'xpos',
      'check': 'Number',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'ypos',
      'check': 'Number',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'radius',
      'check': 'Number',
      'align': 'RIGHT',
    },
    {
      'type': 'field_checkbox',
      'name': 'nophys',
      'checked': false,
    },
    {
      'type': 'field_checkbox',
      'name': 'nograp',
      'checked': false,
    },
    {
      'type': 'input_dummy',
    },
    {
      'type': 'field_checkbox',
      'name': 'ingrap',
      'checked': false,
    },
    {
      'type': 'field_checkbox',
      'name': 'death',
      'checked': false,
    },
  ],
  'inputsInline': false,
  'output': 'Shape',
  'style': 'gm_mapobjects',
  'tooltip': 'Defines a circle shape to use in the "create platform" block.',
  'helpUrl': '',
},
{
  'type': 'polygon_shape',
  'message0': 'polygon shape %1 colour %2 x %3 y %4 vertex list %5 (2 values = 1 vertex) %6 angle %7 scale %8 no physics %9 , no grapple %10 %11 inner grap %12 , death %13',
  'args0': [
    {
      'type': 'input_dummy',
    },
    {
      'type': 'input_value',
      'name': 'color',
      'check': 'Colour',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'xpos',
      'check': 'Number',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'ypos',
      'check': 'Number',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'vertex',
      'check': 'Array',
      'align': 'RIGHT',
    },
    {
      'type': 'input_dummy',
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
      'name': 'scale',
      'check': 'Number',
      'align': 'RIGHT',
    },
    {
      'type': 'field_checkbox',
      'name': 'nophys',
      'checked': false,
    },
    {
      'type': 'field_checkbox',
      'name': 'nograp',
      'checked': false,
    },
    {
      'type': 'input_dummy',
    },
    {
      'type': 'field_checkbox',
      'name': 'ingrap',
      'checked': false,
    },
    {
      'type': 'field_checkbox',
      'name': 'death',
      'checked': false,
    },
  ],
  'inputsInline': false,
  'output': 'Shape',
  'style': 'gm_mapobjects',
  'tooltip': 'Defines a polygon shape to use in the "create platform" block.',
  'helpUrl': '',
},
{
  'type': 'create_platform',
  'message0': 'create platform %1 return id %2 %3 type %4 %5 shape list %6 x %7 y %8 angle %9 bounciness %10 density %11 friction %12 fric players %13 collide group %14 %15 collide with.. %16 players %17 , group A %18 , group B %19 , %20 group C %21 , group D %22',
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
      'align': 'RIGHT',
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
      'name': 'shape_list',
      'check': 'Array',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'xpos',
      'check': 'Number',
      'align': 'RIGHT',
    },
    {
      'type': 'input_value',
      'name': 'ypos',
      'check': 'Number',
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
      'name': 'bounciness',
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
      'name': 'fricp',
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
      'name': 'colplayers',
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
  ],
  'inputsInline': false,
  'previousStatement': null,
  'nextStatement': null,
  'style': 'gm_mapobjects',
  'tooltip': 'Create a platform with the specified shapes and properties. Be aware that this may lag the game if done too often. ',
  'helpUrl': '',
},
{
  'type': 'set_platform_prop',
  'message0': 'set platform with id %1 \'s %2 to %3',
  'args0': [
    {
      'type': 'input_value',
      'name': 'platform_id',
      'check': 'Number',
    },
    {
      'type': 'field_dropdown',
      'name': 'platform_prop',
      'options': [
        [
          'x position',
          'p_x',
        ],
        [
          'y position',
          'p_y',
        ],
        [
          'x velocity',
          'lv_x',
        ],
        [
          'y velocity',
          'lv_y',
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
          'bounciness',
          're',
        ],
        [
          'density',
          'de',
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
          'collide with players',
          'f_p',
        ],
        [
          'collide with A',
          'f_1',
        ],
        [
          'collide with B',
          'f_2',
        ],
        [
          'collide with C',
          'f_3',
        ],
        [
          'collide with D',
          'f_4',
        ],
        [
          'linear drag',
          'ld',
        ],
        [
          'spin drag',
          'ad',
        ],
      ],
    },
    {
      'type': 'input_value',
      'name': 'set_value',
      'check': [
        'Number',
        'Boolean',
      ],
    },
  ],
  'inputsInline': true,
  'previousStatement': null,
  'nextStatement': null,
  'style': 'gm_mapobjects',
  'tooltip': 'Set a platform\'s property.',
  'helpUrl': '',
},
{
  'type': 'change_platform_prop',
  'message0': 'change platform with id %1 \'s %2 by %3',
  'args0': [
    {
      'type': 'input_value',
      'name': 'platform_id',
      'check': 'Number',
    },
    {
      'type': 'field_dropdown',
      'name': 'platform_prop',
      'options': [
        [
          'x position',
          'p_x',
        ],
        [
          'y position',
          'p_y',
        ],
        [
          'x velocity',
          'lv_x',
        ],
        [
          'y velocity',
          'lv_y',
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
          'bounciness',
          're',
        ],
        [
          'density',
          'de',
        ],
        [
          'friction',
          'fric',
        ],
        [
          'linear drag',
          'ld',
        ],
        [
          'spin drag',
          'ad',
        ],
      ],
    },
    {
      'type': 'input_value',
      'name': 'change_value',
      'check': 'Number',
    },
  ],
  'inputsInline': true,
  'previousStatement': null,
  'nextStatement': null,
  'style': 'gm_mapobjects',
  'tooltip': 'Change a platform\'s property by a specified amount.',
  'helpUrl': '',
},
{
  'type': 'get_platform_prop',
  'message0': 'get platform with id %1 \'s %2',
  'args0': [
    {
      'type': 'input_value',
      'name': 'platform_id',
      'check': 'Number',
    },
    {
      'type': 'field_dropdown',
      'name': 'platform_prop',
      'options': [
        [
          'x position',
          'p_x',
        ],
        [
          'y position',
          'p_y',
        ],
        [
          'x velocity',
          'lv_x',
        ],
        [
          'y velocity',
          'lv_y',
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
          'bounciness',
          're',
        ],
        [
          'density',
          'de',
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
          'collide with players',
          'f_p',
        ],
        [
          'collide with A',
          'f_1',
        ],
        [
          'collide with B',
          'f_2',
        ],
        [
          'collide with C',
          'f_3',
        ],
        [
          'collide with D',
          'f_4',
        ],
        [
          'linear drag',
          'ld',
        ],
        [
          'spin drag',
          'ad',
        ],
      ],
    },
  ],
  'inputsInline': true,
  'output': [
    'Number',
    'Boolean',
  ],
  'style': 'gm_mapobjects',
  'tooltip': 'Get a platform\'s property.',
  'helpUrl': '',
},
{
  'type': 'set_shape_prop',
  'message0': 'set platform with id %1 \'s shape # %2 \'s %3 to %4',
  'args0': [
    {
      'type': 'input_value',
      'name': 'platform_id',
      'check': 'Number',
    },
    {
      'type': 'input_value',
      'name': 'shape_id',
      'check': 'Number',
    },
    {
      'type': 'field_dropdown',
      'name': 'shape_prop',
      'options': [
        [
          'style',
          'f_f',
        ],
        [
          'x offset',
          's_c_x',
        ],
        [
          'y offset',
          's_c_y',
        ],
        [
          'angle (only rectangle)',
          's_a',
        ],
        [
          'width (only rectangle)',
          's_w',
        ],
        [
          'height (only rectangle)',
          's_h',
        ],
        [
          'radius (only circle)',
          's_r',
        ],
        [
          'no physics',
          'f_np',
        ],
        [
          'no grapple',
          'f_ng',
        ],
        [
          'inner grapple',
          'f_ig',
        ],
        [
          'death',
          'f_d',
        ],
      ],
    },
    {
      'type': 'input_value',
      'name': 'set_value',
      'check': [
        'Number',
        'Boolean',
        'Colour',
      ],
    },
  ],
  'inputsInline': true,
  'previousStatement': null,
  'nextStatement': null,
  'style': 'gm_mapobjects',
  'tooltip': 'Set a platform\'s shape\'s property. Be aware that this may lag the game if done too often.',
  'helpUrl': '',
},
{
  'type': 'change_shape_prop',
  'message0': 'change platform with id %1 \'s shape # %2 \'s %3 by %4',
  'args0': [
    {
      'type': 'input_value',
      'name': 'platform_id',
      'check': 'Number',
    },
    {
      'type': 'input_value',
      'name': 'shape_id',
      'check': 'Number',
    },
    {
      'type': 'field_dropdown',
      'name': 'shape_prop',
      'options': [
        [
          'x offset',
          's_c_x',
        ],
        [
          'y offset',
          's_c_y',
        ],
        [
          'angle (only rectangle)',
          's_a',
        ],
        [
          'width (only rectangle)',
          's_w',
        ],
        [
          'height (only rectangle)',
          's_h',
        ],
        [
          'radius (only circle)',
          's_r',
        ],
      ],
    },
    {
      'type': 'input_value',
      'name': 'change_value',
      'check': 'Number',
    },
  ],
  'inputsInline': true,
  'previousStatement': null,
  'nextStatement': null,
  'style': 'gm_mapobjects',
  'tooltip': 'Change a platform\'s shape\'s property by a specified amount. Be aware that this may lag the game if done too often.',
  'helpUrl': '',
},
{
  'type': 'get_shape_prop',
  'message0': 'get platform with id %1 \'s shape # %2 \'s %3',
  'args0': [
    {
      'type': 'input_value',
      'name': 'platform_id',
      'check': 'Number',
    },
    {
      'type': 'input_value',
      'name': 'shape_id',
      'check': 'Number',
    },
    {
      'type': 'field_dropdown',
      'name': 'shape_prop',
      'options': [
        [
          'style',
          'f_f',
        ],
        [
          'x offset',
          's_c_x',
        ],
        [
          'y offset',
          's_c_y',
        ],
        [
          'angle (only rectangle)',
          's_a',
        ],
        [
          'width (only rectangle)',
          's_w',
        ],
        [
          'height (only rectangle)',
          's_h',
        ],
        [
          'radius (only circle)',
          's_r',
        ],
        [
          'no physics',
          'f_np',
        ],
        [
          'no grapple',
          'f_ng',
        ],
        [
          'inner grapple',
          'f_ig',
        ],
        [
          'death',
          'f_d',
        ],
      ],
    },
  ],
  'inputsInline': true,
  'output': [
    'Number',
    'Boolean',
    'Colour',
  ],
  'style': 'gm_mapobjects',
  'tooltip': 'Get a platform\'s shape\'s property.',
  'helpUrl': '',
},
{
  'type': 'get_shape_amount',
  'message0': 'get platform with id %1 \'s shape amount',
  'args0': [
    {
      'type': 'input_value',
      'name': 'platform_id',
      'check': 'Number',
    },
  ],
  'inputsInline': true,
  'output': 'Number',
  'style': 'gm_mapobjects',
  'tooltip': 'Returns the amount of shapes in the specified platform.',
  'helpUrl': '',
},
{
  'type': 'delete_platform',
  'message0': 'delete platform with id %1',
  'args0': [
    {
      'type': 'input_value',
      'name': 'platform_id',
      'check': 'Number',
    },
  ],
  'inputsInline': true,
  'previousStatement': null,
  'nextStatement': null,
  'style': 'gm_mapobjects',
  'tooltip': 'Delete a platform. Be aware that this may lag the game if done too often.',
  'helpUrl': '',
},
{
  'type': 'delete_shape',
  'message0': 'delete platform with id %1 \'s shape # %2',
  'args0': [
    {
      'type': 'input_value',
      'name': 'platform_id',
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
  'style': 'gm_mapobjects',
  'tooltip': 'Delete a shape. Be aware that this may lag the game if done too often.',
  'helpUrl': '',
},
{
  'type': 'add_shape',
  'message0': 'add shape %1 to platform with id %2',
  'args0': [
    {
      'type': 'input_value',
      'name': 'shape',
      'check': 'Shape',
    },
    {
      'type': 'input_value',
      'name': 'platform_id',
      'check': 'Number',
      'align': 'RIGHT',
    },
  ],
  'previousStatement': null,
  'nextStatement': null,
  'style': 'gm_mapobjects',
  'tooltip': 'Add a shape to a platform. Be aware that this may lag the game if done too often.',
  'helpUrl': '',
},
{
  'type': 'on_platform_collide',
  'message0': 'when any platform collides with  %1 %2 store info in variables %3 %4 %5 %6 %7 %8 %9 %10 %11 %12 %13',
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
          'an arrow',
          'collide_arrow',
        ],
        [
          'another platform',
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
      'name': 'self_platform_id',
      'variable': 'own platform id',
    },
    {
      'type': 'field_variable',
      'name': 'self_shape_id',
      'variable': 'own shape number',
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
      'name': 'platform_id',
      'variable': 'hit platform id',
    },
    {
      'type': 'field_variable',
      'name': 'shape_id',
      'variable': 'hit shape number',
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
  'style': 'gm_events',
  'tooltip': 'Executes when any platform collides with a specified type of object.',
  'helpUrl': '',
},
{
  'type': 'get_platform_order',
  'message0': 'get list of platform ids on view order',
  'output': 'Array',
  'style': 'gm_mapobjects',
  'tooltip': 'Returns a list of all platform ids on view order, front to back (as shown in the map editor).',
  'helpUrl': '',
},
{
  'type': 'on_player_die',
  'message0': 'on player die %1 %2',
  'args0': [
    {
      'type': 'input_dummy',
    },
    {
      'type': 'input_statement',
      'name': 'code',
    },
  ],
  'style': 'gm_events',
  'tooltip': 'Executes right before the player dies.',
  'helpUrl': '',
},
{
  'type': 'get_player_name',
  'message0': 'get %1 %2 %3 username',
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
  'inputsInline': true,
  'output': 'String',
  'style': 'gm_graphics',
  'tooltip': 'Returns the player\'s name.',
  'helpUrl': '',
},
{
  'type': 'clone_platform',
  'lastDummyAlign0': 'RIGHT',
  'message0': 'clone platform with id %1 return id %2',
  'args0': [
    {
      'type': 'input_value',
      'name': 'platform_id',
      'check': 'Number',
    },
    {
      'type': 'field_checkbox',
      'name': 'return_id',
      'checked': true,
    },
  ],
  'inputsInline': false,
  'previousStatement': null,
  'nextStatement': null,
  'style': 'gm_mapobjects',
  'tooltip': 'Clone a platform. Be aware that this may lag the game if done too often.',
  'helpUrl': '',
},
{
  'type': 'get_platform_by_name',
  'message0': 'get platform with name %1 \'s id',
  'args0': [
    {
      'type': 'input_value',
      'name': 'platform_name',
      'check': 'String',
    },
  ],
  'inputsInline': true,
  'output': 'Number',
  'style': 'gm_mapobjects',
  'tooltip': 'Get a platform\\\'s id by its name. If there are multiple platforms with the same name, the oldest one will be chosen.',
  'helpUrl': '',
},
{
  'type': 'get_platform_name',
  'message0': 'get platform with id %1 \'s name',
  'args0': [
    {
      'type': 'input_value',
      'name': 'platform_id',
      'check': 'Number',
    },
  ],
  'inputsInline': true,
  'output': 'String',
  'style': 'gm_mapobjects',
  'tooltip': 'Get a platform\'s name.',
  'helpUrl': '',
},
{
  'type': 'play_sound',
  'message0': 'play sound %1 %2 with volume (0.0 to 1.0) %3 panning type %4 %5 %6 %7',
  'args0': [
    {
      'type': 'field_dropdown',
      'name': 'sound_name',
      'options': [
        [
          'player-platform collision',
          'platBounce',
        ],
        [
          'player-player collision',
          'discDisc',
        ],
        [
          'player death',
          'discDeath',
        ],
        [
          'player offscreen',
          'discOffScreen',
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
          'football bounce',
          'footBounce',
        ],
        [
          'football goal',
          'footGoal',
        ],
        [
          'football win swoosh',
          'scoreAnimation',
        ],
        [
          'countdown beep',
          'digiBeep',
        ],
        [
          'button hover',
          'classicButtonHover',
        ],
        [
          'button press',
          'classicButtonClick',
        ],
        [
          'back/cancel button press',
          'classicButtonBack',
        ],
      ],
    },
    {
      'type': 'input_dummy',
    },
    {
      'type': 'input_value',
      'name': 'sound_volume',
      'check': 'Number',
      'align': 'RIGHT',
    },
    {
      'type': 'field_dropdown',
      'name': 'pan_type',
      'options': [
        [
          'constant',
          'const',
        ],
        [
          'world position',
          'world',
        ],
      ],
    },
    {
      'type': 'input_dummy',
      'align': 'RIGHT',
    },
    {
      'type': 'field_label_serializable',
      'name': 'sound_pan_name',
      'text': 'with panning (-1.0 to 1.0)',
    },
    {
      'type': 'input_value',
      'name': 'sound_pan',
      'check': 'Number',
      'align': 'RIGHT',
    },
  ],
  'inputsInline': false,
  'previousStatement': null,
  'nextStatement': null,
  'style': 'gm_misc',
  'tooltip': 'Plays a sound with a specified amount of volume and panning. Panning type \'constant\' means the "location" of the sound is always the same, while panning type \'world position\' means the "position" of the sound is affected by where in the world the camera is.',
  'helpUrl': '',
},
{
  'type': 'colour_hex',
  'message0': 'hex color code %1',
  'args0': [
    {
      'type': 'input_value',
      'name': 'hex_code',
      'check': 'String',
    },
  ],
  'output': 'Colour',
  'style': 'gm_events',
  'tooltip': 'Creates a colour with the hex code.',
  'helpUrl': '',
},
{
  'type': 'player_on_team',
  'message0': '%1 %2 %3 is on %4 team',
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
  'output': 'Boolean',
  'style': 'gm_players',
  'tooltip': 'Returns true if the player is on the specified team, if not, returns false.',
  'helpUrl': '',
},
{
  'type': 'set_camera_prop',
  'message0': 'set %1 %2 %3 camera\'s %4 to %5',
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
          'everyone\'s',
          'all',
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
      'name': 'camera_prop',
      'options': [
        [
          'x position',
          'xpos',
        ],
        [
          'y position',
          'ypos',
        ],
        [
          'angle',
          'angle',
        ],
        [
          'x scale',
          'xscal',
        ],
        [
          'y scale',
          'yscal',
        ],
        [
          'x skew',
          'xskew',
        ],
        [
          'y skew',
          'yskew',
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
  'style': 'gm_misc',
  'tooltip': 'Set one of the camera\'s properties to a specified value. You can make it so that only one player\'s camera is modified.',
  'helpUrl': '',
},
{
  'type': 'change_camera_prop',
  'message0': 'change %1 %2 %3 camera\'s %4 by %5',
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
          'everyone\'s',
          'all',
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
      'name': 'camera_prop',
      'options': [
        [
          'x position',
          'xpos',
        ],
        [
          'y position',
          'ypos',
        ],
        [
          'angle',
          'angle',
        ],
        [
          'x scale',
          'xscal',
        ],
        [
          'y scale',
          'yscal',
        ],
        [
          'x skew',
          'xskew',
        ],
        [
          'y skew',
          'yskew',
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
  'style': 'gm_misc',
  'tooltip': 'Change one of the camera\'s properties by a specified amount. You can make it so that only one player\'s camera is modified.',
  'helpUrl': '',
},
{
  'type': 'get_camera_prop',
  'lastDummyAlign0': 'RIGHT',
  'message0': 'get %1 %2 %3 camera\'s %4',
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
      'name': 'camera_prop',
      'options': [
        [
          'x position',
          'xpos',
        ],
        [
          'y position',
          'ypos',
        ],
        [
          'angle',
          'angle',
        ],
        [
          'x scale',
          'xscal',
        ],
        [
          'y scale',
          'yscal',
        ],
        [
          'x skew',
          'xskew',
        ],
        [
          'y skew',
          'yskew',
        ],
      ],
    },
  ],
  'inputsInline': true,
  'output': 'Number',
  'style': 'gm_misc',
  'tooltip': 'Get one of the camera\'s properties of a specified player. Different players can have different camera properties.',
  'helpUrl': '',
},
{
  'type': 'change_camera_lerp',
  'message0': '%1 camera interpolation for %2 %3 %4',
  'args0': [
    {
      'type': 'field_dropdown',
      'name': 'enable',
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
      'type': 'field_dropdown',
      'name': 'player',
      'options': [
        [
          'everyone',
          'all',
        ],
        [
          'yourself',
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
  'nextStatement': null,
  'style': 'gm_misc',
  'tooltip': 'Enables or disables camera interpolation between physics steps. Enable this if you want a smoother look when moving around the camera, disable it if you want to make a hard transition from one place to another. This is enabled by default.',
  'helpUrl': '',
},
{
  'type': 'change_death_barrier',
  'message0': '%1 death barrier',
  'args0': [
    {
      'type': 'field_dropdown',
      'name': 'enable',
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
  ],
  'previousStatement': null,
  'nextStatement': null,
  'style': 'gm_misc',
  'tooltip': 'Enables or disables the vanilla death barrier that kills players when they touch the map\'s ground or go too far from the screen.',
  'helpUrl': '',
},
{
  'type': 'variables_retain_value',
  'message0': 'keep value of %1 on next round',
  'args0': [
    {
      'type': 'field_variable',
      'name': 'VAR',
      'variable': 'item',
    },
  ],
  'previousStatement': null,
  'nextStatement': null,
  'style': 'variable_blocks',
  'tooltip': 'Mantain the value of this variable to the next round. Normally, variables get wiped up when a new round starts. When you execute this block, the variable is set to keep its value when moving on to the next round.',
  'helpUrl': '',
},
{
  'type': 'get_screen_prop',
  'message0': '%1 of screen',
  'args0': [
    {
      'type': 'field_dropdown',
      'name': 'screen_prop',
      'options': [
        [
          'width',
          'width',
        ],
        [
          'height',
          'height',
        ],
      ],
    },
  ],
  'output': 'Number',
  'style': 'gm_graphics',
  'tooltip': 'Get width or height of screen (in gmmaker units, not in pixels).',
  'helpUrl': '',
},
{
  'type': 'variables_get',
  'message0': '%1 %2 %3 %4',
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
      'name': 'drop_container',
    },
    {
      'type': 'input_value',
      'name': 'player_id',
      'check': 'Number',
    },
    {
      'type': 'field_variable',
      'name': 'VAR',
      'variable': '%{BKY_VARIABLES_DEFAULT_NAME}',
    },
  ],
  'inputsInline': true,
  'output': null,
  'style': 'variable_blocks',
  'helpUrl': '%{BKY_VARIABLES_GET_HELPURL}',
  'tooltip': '%{BKY_VARIABLES_GET_TOOLTIP}',
  'extensions': ['contextMenu_variableSetterGetter'],
},
{
  'type': 'variables_set',
  'message0': 'set %1 %2 %3 %4 %5 to %6 %7',
  'args0': [
    {
      'type': 'input_dummy',
    },
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
      'name': 'drop_container',
    },
    {
      'type': 'input_value',
      'name': 'player_id',
      'check': 'Number',
    },
    {
      'type': 'field_variable',
      'name': 'VAR',
      'variable': 'item',
    },
    {
      'type': 'input_dummy',
    },
    {
      'type': 'input_value',
      'name': 'VALUE',
    },
  ],
  'inputsInline': true,
  'previousStatement': null,
  'nextStatement': null,
  'style': 'variable_blocks',
  'tooltip': '%{BKY_VARIABLES_SET_TOOLTIP}',
  'helpUrl': '%{BKY_VARIABLES_SET_HELPURL}',
  'extensions': ['contextMenu_variableSetterGetter'],
},
{
  'type': 'math_change',
  'message0': 'change %1 %2 %3 %4 %5 by %6 %7',
  'args0': [
    {
      'type': 'input_dummy',
    },
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
      'name': 'drop_container',
    },
    {
      'type': 'input_value',
      'name': 'player_id',
      'check': 'Number',
    },
    {
      'type': 'field_variable',
      'name': 'VAR',
      'variable': 'item',
    },
    {
      'type': 'input_dummy',
    },
    {
      'type': 'input_value',
      'name': 'DELTA',
      'check': 'Number',
    },
  ],
  'inputsInline': true,
  'previousStatement': null,
  'nextStatement': null,
  'style': 'variable_blocks',
  'tooltip': '',
  'helpUrl': '%{BKY_MATH_CHANGE_HELPURL}',
  'extensions': ['math_change_tooltip'],
}];
