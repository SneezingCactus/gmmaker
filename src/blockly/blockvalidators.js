/* eslint-disable require-jsdoc */
/* eslint-disable no-caller */
/* eslint-disable no-invalid-this */
/* eslint-disable camelcase */
/* eslint-disable new-cap */
import Blockly from 'blockly';

/**
* Sets up the blocks' validators
*/
export default function() {
  // why does this not exist???
  Blockly.Block.prototype.removeInputAt = function(index, opt_quiet) {
    const input = this.inputList[index];
    if (input) {
      if (input.type === Blockly.inputTypes.STATEMENT) {
        this.statementInputCount--;
      }
      input.dispose();
      this.inputList.splice(index, 1);

      if (this.rendered) {
        this.render();
        this.bumpNeighbours();
      }

      return true;
    } else if (opt_quiet) {
      return false;
    }

    throw Error('Input not found at: ' + index);
  };

  const eventStepMixin = {
    mutationToDom: function() {
      const container = Blockly.utils.xml.createElement('mutation');
      const perPlayer = (this.getFieldValue('perplayer') === 'TRUE');
      container.setAttribute('perplayer', perPlayer);
      this.updateShape_(perPlayer);
      return container;
    },
    domToMutation: function(xmlElement) {
      const perPlayer = (xmlElement.getAttribute('perplayer') !== 'false');
      this.updateShape_(perPlayer);
    },
    updateShape_: function(perPlayer) {
      const inputExists = this.inputList.length > 3;
      if (perPlayer && !inputExists) {
        this.appendDummyInput('')
            .appendField('store player id in var')
            .appendField(new Blockly.FieldVariable('id'), 'player_id');

        this.moveNumberedInputBefore(3, 2);
      } else if (!perPlayer && inputExists) {
        this.removeInputAt(2);
      }
    },
  };

  const eventStepValidator = function() {
    this.mixin(eventStepMixin);

    const perPlayerCheck = this.getField('perplayer');

    perPlayerCheck.setValidator(function(newValue) {
      const perPlayer = (newValue === 'TRUE');
      this.getSourceBlock().updateShape_(perPlayer);
    });
  };
  Blockly.Blocks['event_step'].validatorInit = eventStepValidator;
  Blockly.Blocks['event_roundstart'].validatorInit = eventStepValidator;

  const eventCollisionMixin = {
    mutationToDom: function() {
      const container = Blockly.utils.xml.createElement('mutation');
      const colA = this.getFieldValue('col_a');
      const colB = this.getFieldValue('col_b');
      const storeInfo = this.getFieldValue('store_info') === 'TRUE';
      container.setAttribute('col_a', colA);
      container.setAttribute('col_b', colB);
      container.setAttribute('store_info', storeInfo);
      this.updateShape_(colA, colB, storeInfo);
      return container;
    },
    domToMutation: function(xmlElement) {
      const colA = xmlElement.getAttribute('col_a');
      const colB = xmlElement.getAttribute('col_b');
      const storeInfo = xmlElement.getAttribute('store_info');
      this.updateShape_(colA, colB, storeInfo);
    },
    updateShape_: function(colA, colB, storeInfo) {
      function appendFieldIfNotExist(input, field, fieldId) {
        if (input.fieldRow.find((field) => field.name === fieldId)) return;
        input.appendField(field, fieldId);
      }

      const varInputsExist = this.inputList.length > 4;

      if (storeInfo && !varInputsExist) {
        this.appendDummyInput('');
        this.appendDummyInput('');
        this.moveNumberedInputBefore(3, 2);
        this.moveNumberedInputBefore(4, 3);
      }
      if (!storeInfo) {
        if (varInputsExist) {
          this.removeInputAt(2);
          this.removeInputAt(2);
        }

        return;
      }

      switch (colA) {
        case 'disc':
          appendFieldIfNotExist(this.inputList[2], new Blockly.FieldVariable('hit A disc id'), 'a_discid');
          this.inputList[2].removeField('a_arrowid', true);
          this.inputList[2].removeField('a_bodyid', true);
          this.inputList[2].removeField('a_fixtureid', true);
          this.inputList[2].removeField('a_normal', true);
          this.inputList[2].removeField('a_capzone', true);
          break;
        case 'arrow':
          appendFieldIfNotExist(this.inputList[2], new Blockly.FieldVariable('hit A arrow id'), 'a_arrowid');
          this.inputList[2].removeField('a_discid', true);
          this.inputList[2].removeField('a_bodyid', true);
          this.inputList[2].removeField('a_fixtureid', true);
          this.inputList[2].removeField('a_normal', true);
          this.inputList[2].removeField('a_capzone', true);
          break;
        case 'body':
          appendFieldIfNotExist(this.inputList[2], new Blockly.FieldVariable('hit A body id'), 'a_bodyid');
          appendFieldIfNotExist(this.inputList[2], new Blockly.FieldVariable('hit A fixture id'), 'a_fixtureid');
          appendFieldIfNotExist(this.inputList[2], new Blockly.FieldVariable('hit A normal'), 'a_normal');
          appendFieldIfNotExist(this.inputList[2], new Blockly.FieldVariable('hit A is capzone'), 'a_capzone');
          this.inputList[2].removeField('a_discid', true);
          this.inputList[2].removeField('a_arrowid', true);
          break;
      }

      switch (colB) {
        case 'disc':
          appendFieldIfNotExist(this.inputList[3], new Blockly.FieldVariable('hit B disc id'), 'b_discid');
          this.inputList[3].removeField('b_arrowid', true);
          this.inputList[3].removeField('b_bodyid', true);
          this.inputList[3].removeField('b_fixtureid', true);
          this.inputList[3].removeField('b_normal', true);
          this.inputList[3].removeField('b_capzone', true);
          break;
        case 'arrow':
          appendFieldIfNotExist(this.inputList[3], new Blockly.FieldVariable('hit B arrow id'), 'b_arrowid');
          this.inputList[3].removeField('b_discid', true);
          this.inputList[3].removeField('b_bodyid', true);
          this.inputList[3].removeField('b_fixtureid', true);
          this.inputList[3].removeField('b_normal', true);
          this.inputList[3].removeField('b_capzone', true);
          break;
        case 'body':
          appendFieldIfNotExist(this.inputList[3], new Blockly.FieldVariable('hit B body id'), 'b_bodyid');
          appendFieldIfNotExist(this.inputList[3], new Blockly.FieldVariable('hit B fixture id'), 'b_fixtureid');
          appendFieldIfNotExist(this.inputList[3], new Blockly.FieldVariable('hit B normal'), 'b_normal');
          appendFieldIfNotExist(this.inputList[3], new Blockly.FieldVariable('hit B is capzone'), 'b_capzone');
          this.inputList[3].removeField('b_discid', true);
          this.inputList[3].removeField('b_arrowid', true);
          break;
      }
    },
  };

  Blockly.Blocks['event_collision'].validatorInit = function() {
    this.mixin(eventCollisionMixin);

    const colADropdown = this.getField('col_a');
    const colBDropdown = this.getField('col_b');
    const storeInfoCheck = this.getField('store_info');

    colADropdown.setValidator(function(newValue) {
      this.getSourceBlock().updateShape_(newValue, colBDropdown.getValue(), storeInfoCheck.getValue() === 'TRUE');
    });
    colBDropdown.setValidator(function(newValue) {
      this.getSourceBlock().updateShape_(colADropdown.getValue(), newValue, storeInfoCheck.getValue() === 'TRUE');
    });
    storeInfoCheck.setValidator(function(newValue) {
      this.getSourceBlock().updateShape_(colADropdown.getValue(), colBDropdown.getValue(), newValue === 'TRUE');
    });
  };
  return;
  const playerIdMixin = {
    mutationToDom: function() {
      const container = Blockly.utils.xml.createElement('mutation');
      const showPlayerId = (this.getFieldValue('player') === 'id');
      container.setAttribute('playerid_input', showPlayerId);
      this.updateShape_(showPlayerId);
      return container;
    },
    domToMutation: function(xmlElement) {
      const showPlayerId = (xmlElement.getAttribute('playerid_input') !== 'false');
      this.updateShape_(showPlayerId);
    },
    updateShape_: function(showPlayerId) {
      const inputExists = this.getInput('player_id');
      if (showPlayerId) {
        if (!inputExists) {
          this.appendValueInput('player_id').setCheck('Number');
        }
      } else if (inputExists) {
        this.removeInput('player_id');
      }

      this.moveIdInputs(showPlayerId && !inputExists);
    },
  };

  const playerArrowIdMixin = {
    mutationToDom: function() {
      const container = Blockly.utils.xml.createElement('mutation');
      const showPlayerId = (this.getFieldValue('player') === 'id');
      const showArrowId = (this.getFieldValue('arrow') === 'id');
      container.setAttribute('playerid_input', showPlayerId);
      container.setAttribute('arrowid_input', showArrowId);
      this.updateShape_(showPlayerId, showArrowId);
      return container;
    },
    domToMutation: function(xmlElement) {
      const showPlayerId = (xmlElement.getAttribute('playerid_input') !== 'false');
      const showArrowId = (xmlElement.getAttribute('arrowid_input') !== 'false');
      this.updateShape_(showPlayerId, showArrowId);
    },
    updateShape_: function(showPlayerId, showArrowId) {
      const playerInputExists = this.getInput('player_id');
      if (showPlayerId) {
        if (!playerInputExists) {
          this.appendValueInput('player_id').setCheck('Number');
        }
      } else if (playerInputExists) {
        this.removeInput('player_id');
      }

      const arrowInputExists = this.getInput('arrow_id');
      if (showArrowId) {
        if (!arrowInputExists) {
          this.appendValueInput('arrow_id').setCheck('Number');
        }
      } else if (arrowInputExists) {
        this.removeInput('arrow_id');
      }

      this.moveIdInputs(showPlayerId && !playerInputExists, showArrowId && !arrowInputExists);
    },
  };

  Blockly.Blocks['set_player_prop'].validatorInit = function() {
    this.mixin(playerIdMixin);

    this.moveIdInputs = function(movePlayerId) {
      if (movePlayerId) this.moveInputBefore('player_id', 'set_number');
    };

    const playerDropdown = this.getField('player');

    playerDropdown.setValidator(function(newValue) {
      const showPlayerId = (newValue === 'id');
      this.getSourceBlock().updateShape_(showPlayerId);
    });
  };

  Blockly.Blocks['change_player_prop'].validatorInit = function() {
    this.mixin(playerIdMixin);

    this.moveIdInputs = function(movePlayerId) {
      if (movePlayerId) this.moveInputBefore('player_id', 'change_number');
    };

    const playerDropdown = this.getField('player');

    playerDropdown.setValidator(function(newValue) {
      const showPlayerId = (newValue === 'id');
      this.getSourceBlock().updateShape_(showPlayerId);
    });
  };

  Blockly.Blocks['set_arrow_prop'].validatorInit = function() {
    this.mixin(playerArrowIdMixin);

    this.moveIdInputs = function(movePlayerId, moveArrowId) {
      if (moveArrowId) this.moveInputBefore('arrow_id', 'set_number');
      if (movePlayerId) this.moveNumberedInputBefore(this.inputList.length - 1, 1);
    };

    const playerDropdown = this.getField('player');

    playerDropdown.setValidator(function(newValue) {
      const showPlayerId = (newValue === 'id');
      const showArrowId = (arrowDropdown.getValue() === 'id');
      this.getSourceBlock().updateShape_(showPlayerId, showArrowId);
    });

    const arrowDropdown = this.getField('arrow');

    arrowDropdown.setValidator(function(newValue) {
      const showPlayerId = (playerDropdown.getValue() === 'id');
      const showArrowId = (newValue === 'id');
      this.getSourceBlock().updateShape_(showPlayerId, showArrowId);
    });
  };

  Blockly.Blocks['change_arrow_prop'].validatorInit = function() {
    this.mixin(playerArrowIdMixin);

    this.moveIdInputs = function(movePlayerId, moveArrowId) {
      if (moveArrowId) this.moveInputBefore('arrow_id', 'change_number');
      if (movePlayerId) this.moveNumberedInputBefore(this.inputList.length - 1, 1);
    };

    const playerDropdown = this.getField('player');

    playerDropdown.setValidator(function(newValue) {
      const showPlayerId = (newValue === 'id');
      const showArrowId = (arrowDropdown.getValue() === 'id');
      this.getSourceBlock().updateShape_(showPlayerId, showArrowId);
    });

    const arrowDropdown = this.getField('arrow');

    arrowDropdown.setValidator(function(newValue) {
      const showPlayerId = (playerDropdown.getValue() === 'id');
      const showArrowId = (newValue === 'id');
      this.getSourceBlock().updateShape_(showPlayerId, showArrowId);
    });
  };

  Blockly.Blocks['get_player_prop'].validatorInit = function() {
    this.mixin(playerIdMixin);

    this.moveIdInputs = function(movePlayerId) {
      if (movePlayerId) this.moveNumberedInputBefore(this.inputList.length - 1, 1);
    };

    const playerDropdown = this.getField('player');

    playerDropdown.setValidator(function(newValue) {
      const showPlayerId = (newValue === 'id');
      this.getSourceBlock().updateShape_(showPlayerId);
    });
  };

  Blockly.Blocks['get_arrow_prop'].validatorInit = function() {
    this.mixin(playerArrowIdMixin);

    this.moveIdInputs = function(movePlayerId, moveArrowId) {
      if (moveArrowId) this.moveNumberedInputBefore(this.inputList.length - 1, this.inputList.length - 2);
      if (movePlayerId) this.moveNumberedInputBefore(this.inputList.length - 1, 1);
    };

    const playerDropdown = this.getField('player');

    playerDropdown.setValidator(function(newValue) {
      const showPlayerId = (newValue === 'id');
      const showArrowId = (arrowDropdown.getValue() === 'id');
      this.getSourceBlock().updateShape_(showPlayerId, showArrowId);
    });

    const arrowDropdown = this.getField('arrow');

    arrowDropdown.setValidator(function(newValue) {
      const showPlayerId = (playerDropdown.getValue() === 'id');
      const showArrowId = (newValue === 'id');
      this.getSourceBlock().updateShape_(showPlayerId, showArrowId);
    });
  };

  Blockly.Blocks['get_arrow_amount'].validatorInit = function() {
    this.mixin(playerIdMixin);

    this.moveIdInputs = function(movePlayerId) {
      if (movePlayerId) this.moveNumberedInputBefore(this.inputList.length - 1, 1);
    };

    const playerDropdown = this.getField('player');

    playerDropdown.setValidator(function(newValue) {
      const showPlayerId = (newValue === 'id');
      this.getSourceBlock().updateShape_(showPlayerId);
    });
  };

  Blockly.Blocks['delete_arrows'].validatorInit = function() {
    this.mixin(playerArrowIdMixin);

    this.moveIdInputs = function(movePlayerId, moveArrowId) {
      if (movePlayerId) {
        this.moveNumberedInputBefore(this.inputList.length - 1, 1);
      }
    };

    const playerDropdown = this.getField('player');

    playerDropdown.setValidator(function(newValue) {
      const showPlayerId = (newValue === 'id');
      const showArrowId = (arrowDropdown.getValue() === 'id');
      this.getSourceBlock().updateShape_(showPlayerId, showArrowId);
    });

    const arrowDropdown = this.getField('arrow');

    arrowDropdown.setValidator(function(newValue) {
      const showPlayerId = (playerDropdown.getValue() === 'id');
      const showArrowId = (newValue === 'id');
      this.getSourceBlock().updateShape_(showPlayerId, showArrowId);
    });
  };

  Blockly.Blocks['player_die'].validatorInit = function() {
    this.mixin(playerIdMixin);

    this.moveIdInputs = function(movePlayerId) {
      if (movePlayerId) this.moveNumberedInputBefore(this.inputList.length - 1, 1);
    };

    const playerDropdown = this.getField('player');

    playerDropdown.setValidator(function(newValue) {
      const showPlayerId = (newValue === 'id');
      this.getSourceBlock().updateShape_(showPlayerId);
    });
  };

  Blockly.Blocks['pressing_key'].validatorInit = function() {
    this.mixin(playerIdMixin);

    this.moveIdInputs = function(movePlayerId) {
      if (movePlayerId) this.moveNumberedInputBefore(this.inputList.length - 1, 1);
    };

    const playerDropdown = this.getField('player');

    playerDropdown.setValidator(function(newValue) {
      const showPlayerId = (newValue === 'id');
      this.getSourceBlock().updateShape_(showPlayerId);
    });
  };

  Blockly.Blocks['player_on_team'].validatorInit = function() {
    this.mixin(playerIdMixin);

    this.moveIdInputs = function(movePlayerId) {
      if (movePlayerId) this.moveNumberedInputBefore(this.inputList.length - 1, 1);
    };

    const playerDropdown = this.getField('player');

    playerDropdown.setValidator(function(newValue) {
      const showPlayerId = (newValue === 'id');
      this.getSourceBlock().updateShape_(showPlayerId);
    });
  };

  Blockly.Blocks['get_player_color'].validatorInit = function() {
    this.mixin(playerIdMixin);

    this.moveIdInputs = function(movePlayerId) {
      if (movePlayerId) this.moveNumberedInputBefore(this.inputList.length - 1, 1);
    };

    const playerDropdown = this.getField('player');

    playerDropdown.setValidator(function(newValue) {
      const showPlayerId = (newValue === 'id');
      this.getSourceBlock().updateShape_(showPlayerId);
    });
  };

  Blockly.Blocks['get_player_name'].validatorInit = function() {
    this.mixin(playerIdMixin);

    this.moveIdInputs = function(movePlayerId) {
      if (movePlayerId) this.moveNumberedInputBefore(this.inputList.length - 1, 1);
    };

    const playerDropdown = this.getField('player');

    playerDropdown.setValidator(function(newValue) {
      const showPlayerId = (newValue === 'id');
      this.getSourceBlock().updateShape_(showPlayerId);
    });
  };

  Blockly.Blocks['on_player_collide'].validatorInit = function() {
    const returnInfo = this.getField('return_info');
    const collideType = this.getField('collide_type');

    const block = this;

    /**
     * Shows the appropiate vars for the collision type.
     * @param {bool} showVars
     * @param {string} colType
     */
    function showHideVars(showVars, colType) {
      block.getField('player_id').setVisible(false);
      block.getField('arrow_id').setVisible(false);
      block.getField('platform_id').setVisible(false);
      block.getField('shape_id').setVisible(false);
      block.getField('normal_x').setVisible(false);
      block.getField('normal_y').setVisible(false);

      if (showVars == 'TRUE') {
        switch (colType) {
          case 'collide_player':
            block.getField('player_id').setVisible(true);
            break;
          case 'collide_arrow':
            block.getField('player_id').setVisible(true);
            block.getField('arrow_id').setVisible(true);
            break;
          case 'collide_platform':
            block.getField('platform_id').setVisible(true);
            block.getField('shape_id').setVisible(true);
            block.getField('normal_x').setVisible(true);
            block.getField('normal_y').setVisible(true);
            break;
        }
      }
    }

    returnInfo.setValidator(function(newValue) {
      showHideVars(newValue, collideType.getValue());
      returnInfo.forceRerender();
    });

    collideType.setValidator(function(newValue) {
      showHideVars(returnInfo.getValue(), newValue);
      collideType.forceRerender();
    });
  };

  Blockly.Blocks['on_arrow_collide'].validatorInit = function() {
    const returnInfo = this.getField('return_info');
    const collideType = this.getField('collide_type');

    const block = this;

    /**
     * Shows the appropiate vars for the collision type.
     * @param {bool} showVars
     * @param {string} colType
     */
    function showHideVars(showVars, colType) {
      block.getField('self_arrow_id').setVisible(false);
      block.getField('player_id').setVisible(false);
      block.getField('arrow_id').setVisible(false);
      block.getField('platform_id').setVisible(false);
      block.getField('shape_id').setVisible(false);
      block.getField('normal_x').setVisible(false);
      block.getField('normal_y').setVisible(false);

      if (showVars == 'TRUE') {
        switch (colType) {
          case 'collide_player':
            block.getField('self_arrow_id').setVisible(true);
            block.getField('player_id').setVisible(true);
            break;
          case 'collide_arrow':
            block.getField('self_arrow_id').setVisible(true);
            block.getField('player_id').setVisible(true);
            block.getField('arrow_id').setVisible(true);
            break;
          case 'collide_platform':
            block.getField('self_arrow_id').setVisible(true);
            block.getField('platform_id').setVisible(true);
            block.getField('shape_id').setVisible(true);
            block.getField('normal_x').setVisible(true);
            block.getField('normal_y').setVisible(true);
            break;
        }
      }
    }

    returnInfo.setValidator(function(newValue) {
      showHideVars(newValue, collideType.getValue());
      returnInfo.forceRerender();
    });

    collideType.setValidator(function(newValue) {
      showHideVars(returnInfo.getValue(), newValue);
      collideType.forceRerender();
    });
  };

  Blockly.Blocks['on_platform_collide'].validatorInit = function() {
    const returnInfo = this.getField('return_info');
    const collideType = this.getField('collide_type');

    const block = this;

    /**
     * Shows the appropiate vars for the collision type.
     * @param {bool} showVars
     * @param {string} colType
     */
    function showHideVars(showVars, colType) {
      block.getField('self_platform_id').setVisible(false);
      block.getField('self_shape_id').setVisible(false);
      block.getField('player_id').setVisible(false);
      block.getField('arrow_id').setVisible(false);
      block.getField('platform_id').setVisible(false);
      block.getField('shape_id').setVisible(false);
      block.getField('normal_x').setVisible(false);
      block.getField('normal_y').setVisible(false);

      if (showVars == 'TRUE') {
        switch (colType) {
          case 'collide_player':
            block.getField('self_platform_id').setVisible(true);
            block.getField('self_shape_id').setVisible(true);
            block.getField('player_id').setVisible(true);
            break;
          case 'collide_arrow':
            block.getField('self_platform_id').setVisible(true);
            block.getField('self_shape_id').setVisible(true);
            block.getField('player_id').setVisible(true);
            block.getField('arrow_id').setVisible(true);
            break;
          case 'collide_platform':
            block.getField('self_platform_id').setVisible(true);
            block.getField('self_shape_id').setVisible(true);
            block.getField('platform_id').setVisible(true);
            block.getField('shape_id').setVisible(true);
            block.getField('normal_x').setVisible(true);
            block.getField('normal_y').setVisible(true);
            break;
        }
      }
    }

    returnInfo.setValidator(function(newValue) {
      showHideVars(newValue, collideType.getValue());
      returnInfo.forceRerender();
    });

    collideType.setValidator(function(newValue) {
      showHideVars(returnInfo.getValue(), newValue);
      collideType.forceRerender();
    });
  };

  Blockly.Blocks['input_override'].validatorInit = function() {
    this.mixin(playerIdMixin);

    this.moveIdInputs = function(movePlayerId) {
      if (movePlayerId) this.moveNumberedInputBefore(this.inputList.length - 1, 1);
    };

    const playerDropdown = this.getField('player');

    playerDropdown.setValidator(function(newValue) {
      const showPlayerId = (newValue === 'id');
      this.getSourceBlock().updateShape_(showPlayerId);
    });
  };

  Blockly.Blocks['stop_input_override'].validatorInit = function() {
    this.mixin(playerIdMixin);

    this.moveIdInputs = function(movePlayerId) {
      if (movePlayerId) this.moveNumberedInputBefore(this.inputList.length - 1, 1);
    };

    const playerDropdown = this.getField('player');

    playerDropdown.setValidator(function(newValue) {
      const showPlayerId = (newValue === 'id');
      this.getSourceBlock().updateShape_(showPlayerId);
    });
  };

  Blockly.Blocks['set_camera_prop'].validatorInit = function() {
    this.mixin(playerIdMixin);

    this.moveIdInputs = function(movePlayerId) {
      if (movePlayerId) this.moveInputBefore('player_id', 'set_number');
    };

    const playerDropdown = this.getField('player');

    playerDropdown.setValidator(function(newValue) {
      const showPlayerId = (newValue === 'id');
      this.getSourceBlock().updateShape_(showPlayerId);
    });
  };

  Blockly.Blocks['change_camera_prop'].validatorInit = function() {
    this.mixin(playerIdMixin);

    this.moveIdInputs = function(movePlayerId) {
      if (movePlayerId) this.moveInputBefore('player_id', 'change_number');
    };

    const playerDropdown = this.getField('player');

    playerDropdown.setValidator(function(newValue) {
      const showPlayerId = (newValue === 'id');
      this.getSourceBlock().updateShape_(showPlayerId);
    });
  };

  Blockly.Blocks['get_camera_prop'].validatorInit = function() {
    this.mixin(playerIdMixin);

    this.moveIdInputs = function(movePlayerId) {
      if (movePlayerId) this.moveNumberedInputBefore(this.inputList.length - 1, 1);
    };

    const playerDropdown = this.getField('player');

    playerDropdown.setValidator(function(newValue) {
      const showPlayerId = (newValue === 'id');
      this.getSourceBlock().updateShape_(showPlayerId);
    });
  };

  Blockly.Blocks['change_camera_lerp'].validatorInit = function() {
    this.mixin(playerIdMixin);

    this.moveIdInputs = function(movePlayerId) {
      if (movePlayerId) this.moveNumberedInputBefore(this.inputList.length - 1, 1);
    };

    const playerDropdown = this.getField('player');

    playerDropdown.setValidator(function(newValue) {
      const showPlayerId = (newValue === 'id');
      this.getSourceBlock().updateShape_(showPlayerId);
    });
  };

  Blockly.Blocks['play_sound'].validatorInit = function() {
    const panTypeDropdown = this.getField('pan_type');

    panTypeDropdown.setValidator(function(newValue) {
      if (newValue === 'world') {
        this.getSourceBlock().getField('sound_pan_name').setValue('x sound position');
      } else {
        this.getSourceBlock().getField('sound_pan_name').setValue('panning (-1.0 to 1.0)');
      }
    });
  };

  const variableMixin = {
    mutationToDom: function() {
      const container = Blockly.utils.xml.createElement('mutation');
      const showPlayerId = (this.getFieldValue('player') === 'id');
      const showDropdown = !(this.getField('VAR').variable_.name).startsWith('GLOBAL_');
      container.setAttribute('playerid_input', showPlayerId);
      container.setAttribute('show_dropdown', showDropdown);
      this.updateShape_(showPlayerId, showDropdown);
      return container;
    },
    domToMutation: function(xmlElement) {
      const showPlayerId = (xmlElement.getAttribute('playerid_input') !== 'false');
      const showDropdown = (xmlElement.getAttribute('show_dropdown') !== 'false');
      this.updateShape_(showPlayerId, showDropdown);
    },
    updateShape_: function(showPlayerId, showDropdown) {
      const inputExists = this.getInput('player_id');
      if (showPlayerId && showDropdown) {
        if (!inputExists) {
          this.appendValueInput('player_id').setCheck('Number');
        }
      } else if (inputExists) {
        this.removeInput('player_id');
      }

      const dropExists = this.getField('player');
      if (showDropdown) {
        if (!dropExists) {
          this.getInput('drop_container')
              .appendField(new Blockly.FieldDropdown([['your', 'self'], ['player with id', 'id']]), 'player');

          const playerDropdown = this.getField('player');

          playerDropdown.setValidator(function(newValue) {
            const showPlayerId = (newValue === 'id');
            this.getSourceBlock().updateShape_(showPlayerId, !this.getSourceBlock().getField('VAR').selectedOption_[0].startsWith('GLOBAL_'));
          });
        }
      } else if (dropExists) {
        this.getInput('drop_container')
            .removeField('player');
      }

      this.moveIdInputs(showPlayerId && showDropdown && !inputExists);
    },
  };

  Blockly.Blocks['variables_get'].validatorInit = function() {
    this.mixin(variableMixin);

    this.moveIdInputs = function(movePlayerId) {
      if (movePlayerId) this.moveNumberedInputBefore(this.inputList.length - 1, 1);
    };

    const varDropdown = this.getField('VAR');

    varDropdown.setValidator(function(newValue) {
      const startsWithGlobal = Blockly.Variables.getVariable(gm.editor.blocklyWs, newValue).name.startsWith('GLOBAL_');
      const showPlayerId = !startsWithGlobal && this.getSourceBlock().getFieldValue('player') === 'id';
      this.getSourceBlock().updateShape_(showPlayerId, !startsWithGlobal);
    });

    const playerDropdown = this.getField('player');

    playerDropdown.setValidator(function(newValue) {
      if (!this.getSourceBlock().getField('VAR').variable_) return;
      const showPlayerId = (newValue === 'id');
      this.getSourceBlock().updateShape_(showPlayerId, !this.getSourceBlock().getField('VAR').variable_.name.startsWith('GLOBAL_'));
    });
  };

  Blockly.Blocks['variables_set'].validatorInit = function() {
    this.mixin(variableMixin);

    this.moveIdInputs = function(movePlayerId) {
      if (movePlayerId) this.moveNumberedInputBefore(this.inputList.length - 1, 2);
    };

    const varDropdown = this.getField('VAR');

    varDropdown.setValidator(function(newValue) {
      const startsWithGlobal = Blockly.Variables.getVariable(gm.editor.blocklyWs, newValue).name.startsWith('GLOBAL_');
      const showPlayerId = !startsWithGlobal && this.getSourceBlock().getFieldValue('player') === 'id';
      this.getSourceBlock().updateShape_(showPlayerId, !startsWithGlobal);
    });

    const playerDropdown = this.getField('player');

    playerDropdown.setValidator(function(newValue) {
      if (!this.getSourceBlock().getField('VAR').variable_) return;
      const showPlayerId = (newValue === 'id');
      this.getSourceBlock().updateShape_(showPlayerId, !this.getSourceBlock().getField('VAR').variable_.name.startsWith('GLOBAL_'));
    });
  };

  Blockly.Blocks['math_change'].validatorInit = function() {
    this.mixin(variableMixin);

    this.moveIdInputs = function(movePlayerId) {
      if (movePlayerId) this.moveNumberedInputBefore(this.inputList.length - 1, 2);
    };

    const varDropdown = this.getField('VAR');

    varDropdown.setValidator(function(newValue) {
      const startsWithGlobal = Blockly.Variables.getVariable(gm.editor.blocklyWs, newValue).name.startsWith('GLOBAL_');
      const showPlayerId = !startsWithGlobal && this.getSourceBlock().getFieldValue('player') === 'id';
      this.getSourceBlock().updateShape_(showPlayerId, !startsWithGlobal);
    });

    const playerDropdown = this.getField('player');

    playerDropdown.setValidator(function(newValue) {
      if (!this.getSourceBlock().getField('VAR').variable_) return;
      const showPlayerId = (newValue === 'id');
      this.getSourceBlock().updateShape_(showPlayerId, !this.getSourceBlock().getField('VAR').variable_.name.startsWith('GLOBAL_'));
    });
  };

  const createPlatformMixin = {
    mutationToDom: function() {
      const container = Blockly.utils.xml.createElement('mutation');
      // const returnId = (this.getFieldValue('return_id') !== 'false');
      // container.setAttribute('return_id', returnId);
      const isStatement = !!this.outputConnection;
      container.setAttribute('statement', isStatement);
      return container;
    },
    domToMutation: function(xmlElement) {
      const returnId = (xmlElement.getAttribute('statement') === 'true');
      this.updateShape_(returnId);
    },
    updateShape_: function(returnId) {
      const oldReturnId = !!this.outputConnection;
      if (returnId !== oldReturnId) {
        this.unplug(true, true);
        if (returnId) {
          this.setPreviousStatement(false);
          this.setNextStatement(false);
          this.setOutput(true);
        } else {
          this.setOutput(false);
          this.setPreviousStatement(true);
          this.setNextStatement(true);
        }
      }
    },
  };

  Blockly.Blocks['create_platform'].validatorInit = function() {
    this.mixin(createPlatformMixin);

    const returnIdCheck = this.getField('return_id');

    returnIdCheck.setValidator(function(newValue) {
      this.getSourceBlock().updateShape_(newValue === 'TRUE');
    });
  };

  Blockly.Blocks['clone_platform'].validatorInit = function() {
    this.mixin(createPlatformMixin);

    const returnIdCheck = this.getField('return_id');

    returnIdCheck.setValidator(function(newValue) {
      this.getSourceBlock().updateShape_(newValue === 'TRUE');
    });
  };
}

// blockly built-in

Blockly.ToolboxCategory.prototype.addColourBorder_ = function() {};

Blockly.ToolboxCategory.prototype.initOLD = Blockly.ToolboxCategory.prototype.init;
Blockly.ToolboxCategory.prototype.init = function() {
  this.initOLD(...arguments);

  window.BonkUtils.setButtonSounds([this.rowDiv_]);

  this.gm_bgElement = document.createElement('div');
  this.gm_bgElement.classList.add('gm_blockly_toolbox_button_bg');
  this.htmlDiv_.prepend(this.gm_bgElement);

  const defaultColour =
  this.parseColour_(Blockly.ToolboxCategory.defaultBackgroundColour);
  this.gm_bgElement.style.backgroundColor = this.colour_ || defaultColour;
};

Blockly.ToolboxCategory.prototype.setSelectedOLD = Blockly.ToolboxCategory.prototype.setSelected;
Blockly.ToolboxCategory.prototype.setSelected = function(isSelected) {
  this.setSelectedOLD(isSelected);

  this.rowDiv_.style.backgroundColor = '';

  if (isSelected) {
    this.gm_bgElement.style.filter = 'brightness(0.5)';
  } else {
    this.gm_bgElement.style.filter = '';
  }
};

Blockly.Xml.applyInputTagNodes_ = function(xmlChildren, workspace, block, prototypeName) {
  for (let i = 0; i < xmlChildren.length; i++) {
    const xmlChild = xmlChildren[i];
    const nodeName = xmlChild.getAttribute('name');
    const input = block.getInput(nodeName);
    if (!input) {
      console.warn(
          'Ignoring non-existent input ' + nodeName + ' in block ' +
        prototypeName);
      // this was break and that made it so that no other input values would load which is bad
      continue;
    }
    const childBlockInfo = Blockly.Xml.findChildBlocks_(xmlChild);
    if (childBlockInfo.childBlockElement) {
      if (!input.connection) {
        throw TypeError('Input connection does not exist.');
      }
      Blockly.Xml.domToBlockHeadless_(
          childBlockInfo.childBlockElement, workspace, input.connection, false);
    }
    // Set shadow after so we don't create a shadow we delete immediately.
    if (childBlockInfo.childShadowElement) {
      input.connection.setShadowDom(childBlockInfo.childShadowElement);
    }
  }
};

// little hack to fix the immense lag when dragging around the workspace

Blockly.WorkspaceSvg.prototype.translate = function(x, y) {
  if (this.useWorkspaceDragSurface_ && this.isDragSurfaceActive_) {
    this.workspaceDragSurface_.translateSurface(x, y);
  } else {
    const translation = 'translate(' + x + ',' + y + ') ' +
        'scale(' + this.scale + ')';
    this.svgBlockCanvas_.setAttribute('transform', translation);
    this.svgBubbleCanvas_.setAttribute('transform', translation);
  }
  // Now update the block drag surface if we're using one.
  if (this.blockDragSurface_) {
    this.blockDragSurface_.translateAndScaleGroup(x, y, this.scale);
  }
  // And update the grid if we're using one.
  if (this.grid_) {
    this.grid_.moveTo(x, y);
  }

  // this.maybeFireViewportChangeEvent();
};

// (not) temporary fix to the disappearing blocks problem
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


Blockly.Variables.flyoutCategory = function(workspace) {
  let xmlList = [];
  const button = document.createElement('button');
  button.setAttribute('text', '%{BKY_NEW_VARIABLE}');
  button.setAttribute('callbackKey', 'CREATE_VARIABLE');

  workspace.registerButtonCallback('CREATE_VARIABLE', function(button) {
    Blockly.Variables.createVariableButtonHandler(button.getTargetWorkspace());
  });

  xmlList.push(button);

  const removeUnusedButton = document.createElement('button');
  removeUnusedButton.setAttribute('text', 'Delete unused variables');
  removeUnusedButton.setAttribute('callbackKey', 'DELETE_UNUSED_VARIABLES');

  workspace.registerButtonCallback('DELETE_UNUSED_VARIABLES', function(button) {
    const workspace = button.getTargetWorkspace();
    const allVars = workspace.getAllVariables();
    const usedVars = Blockly.Variables.allUsedVarModels(workspace);

    for (let i = 0; i < allVars.length; i++) {
      if (usedVars.includes(allVars[i])) continue;
      gm.editor.blocklyWs.deleteVariableById(allVars[i].id_);
    }
  });

  xmlList.push(removeUnusedButton);

  const blockList = Blockly.Variables.flyoutCategoryBlocks(workspace);
  xmlList = xmlList.concat(blockList);
  return xmlList;
};
