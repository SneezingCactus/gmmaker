/* eslint-disable no-caller */
/* eslint-disable no-invalid-this */
/* eslint-disable camelcase */
/* eslint-disable new-cap */
import Blockly from 'blockly';

/**
* Sets up the blocks' validators
*/
export default function() {
  const playerIdMixin = {
    mutationToDom: function() {
      const container = Blockly.utils.xml.createElement('mutation');
      const showPlayerId = (this.getFieldValue('player') === 'id');
      container.setAttribute('playerid_input', showPlayerId);
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

  Blockly.Blocks['set_last_arrow_prop'].validatorInit = function() {
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

  Blockly.Blocks['change_last_arrow_prop'].validatorInit = function() {
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

  Blockly.Blocks['get_last_arrow_prop'].validatorInit = function() {
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

    this.moveIdInputs = function(movePlayerId) { };

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

    returnInfo.setValidator(function(newValue) {
      this.getSourceBlock().getField('player_id').setVisible(false);
      this.getSourceBlock().getField('arrow_id').setVisible(false);
      this.getSourceBlock().getField('platform_id').setVisible(false);
      this.getSourceBlock().getField('normal_x').setVisible(false);
      this.getSourceBlock().getField('normal_y').setVisible(false);

      if (newValue == 'TRUE') {
        switch (collideType.getValue()) {
          case 'collide_player':
            this.getSourceBlock().getField('player_id').setVisible(true);
            break;
          case 'collide_arrow':
            this.getSourceBlock().getField('player_id').setVisible(true);
            this.getSourceBlock().getField('arrow_id').setVisible(true);
            break;
          case 'collide_platform':
            this.getSourceBlock().getField('platform_id').setVisible(true);
            this.getSourceBlock().getField('normal_x').setVisible(true);
            this.getSourceBlock().getField('normal_y').setVisible(true);
            break;
        }
      }

      returnInfo.forceRerender();
    });

    collideType.setValidator(function(newValue) {
      this.getSourceBlock().getField('player_id').setVisible(false);
      this.getSourceBlock().getField('arrow_id').setVisible(false);
      this.getSourceBlock().getField('platform_id').setVisible(false);
      this.getSourceBlock().getField('normal_x').setVisible(false);
      this.getSourceBlock().getField('normal_y').setVisible(false);

      if (returnInfo.getValue() == 'TRUE') {
        switch (newValue) {
          case 'collide_player':
            this.getSourceBlock().getField('player_id').setVisible(true);
            break;
          case 'collide_arrow':
            this.getSourceBlock().getField('player_id').setVisible(true);
            this.getSourceBlock().getField('arrow_id').setVisible(true);
            break;
          case 'collide_platform':
            this.getSourceBlock().getField('platform_id').setVisible(true);
            this.getSourceBlock().getField('normal_x').setVisible(true);
            this.getSourceBlock().getField('normal_y').setVisible(true);
            break;
        }
      }

      collideType.forceRerender();
    });
  };

  Blockly.Blocks['on_arrow_collide'].validatorInit = function() {
    const returnInfo = this.getField('return_info');
    const collideType = this.getField('collide_type');

    returnInfo.setValidator(function(newValue) {
      this.getSourceBlock().getField('self_arrow_id').setVisible(false);
      this.getSourceBlock().getField('player_id').setVisible(false);
      this.getSourceBlock().getField('arrow_id').setVisible(false);
      this.getSourceBlock().getField('platform_id').setVisible(false);
      this.getSourceBlock().getField('normal_x').setVisible(false);
      this.getSourceBlock().getField('normal_y').setVisible(false);

      if (newValue == 'TRUE') {
        switch (collideType.getValue()) {
          case 'collide_player':
            this.getSourceBlock().getField('self_arrow_id').setVisible(true);
            this.getSourceBlock().getField('player_id').setVisible(true);
            break;
          case 'collide_arrow':
            this.getSourceBlock().getField('self_arrow_id').setVisible(true);
            this.getSourceBlock().getField('player_id').setVisible(true);
            this.getSourceBlock().getField('arrow_id').setVisible(true);
            break;
          case 'collide_platform':
            this.getSourceBlock().getField('self_arrow_id').setVisible(true);
            this.getSourceBlock().getField('platform_id').setVisible(true);
            this.getSourceBlock().getField('normal_x').setVisible(true);
            this.getSourceBlock().getField('normal_y').setVisible(true);
            break;
        }
      }

      returnInfo.forceRerender();
    });

    collideType.setValidator(function(newValue) {
      this.getSourceBlock().getField('self_arrow_id').setVisible(false);
      this.getSourceBlock().getField('player_id').setVisible(false);
      this.getSourceBlock().getField('arrow_id').setVisible(false);
      this.getSourceBlock().getField('platform_id').setVisible(false);
      this.getSourceBlock().getField('normal_x').setVisible(false);
      this.getSourceBlock().getField('normal_y').setVisible(false);

      if (returnInfo.getValue() == 'TRUE') {
        switch (newValue) {
          case 'collide_player':
            this.getSourceBlock().getField('self_arrow_id').setVisible(true);
            this.getSourceBlock().getField('player_id').setVisible(true);
            break;
          case 'collide_arrow':
            this.getSourceBlock().getField('self_arrow_id').setVisible(true);
            this.getSourceBlock().getField('player_id').setVisible(true);
            this.getSourceBlock().getField('arrow_id').setVisible(true);
            break;
          case 'collide_platform':
            this.getSourceBlock().getField('self_arrow_id').setVisible(true);
            this.getSourceBlock().getField('platform_id').setVisible(true);
            this.getSourceBlock().getField('normal_x').setVisible(true);
            this.getSourceBlock().getField('normal_y').setVisible(true);
            break;
        }
      }

      collideType.forceRerender();
    });
  };

  Blockly.Blocks['on_platform_collide'].validatorInit = function() {
    const returnInfo = this.getField('return_info');
    const collideType = this.getField('collide_type');

    returnInfo.setValidator(function(newValue) {
      this.getSourceBlock().getField('self_platform_id').setVisible(false);
      this.getSourceBlock().getField('player_id').setVisible(false);
      this.getSourceBlock().getField('arrow_id').setVisible(false);
      this.getSourceBlock().getField('platform_id').setVisible(false);
      this.getSourceBlock().getField('normal_x').setVisible(false);
      this.getSourceBlock().getField('normal_y').setVisible(false);

      if (newValue == 'TRUE') {
        switch (collideType.getValue()) {
          case 'collide_player':
            this.getSourceBlock().getField('self_platform_id').setVisible(true);
            this.getSourceBlock().getField('player_id').setVisible(true);
            break;
          case 'collide_arrow':
            this.getSourceBlock().getField('self_platform_id').setVisible(true);
            this.getSourceBlock().getField('player_id').setVisible(true);
            this.getSourceBlock().getField('arrow_id').setVisible(true);
            break;
          case 'collide_platform':
            this.getSourceBlock().getField('self_platform_id').setVisible(true);
            this.getSourceBlock().getField('platform_id').setVisible(true);
            this.getSourceBlock().getField('normal_x').setVisible(true);
            this.getSourceBlock().getField('normal_y').setVisible(true);
            break;
        }
      }

      returnInfo.forceRerender();
    });

    collideType.setValidator(function(newValue) {
      this.getSourceBlock().getField('self_platform_id').setVisible(false);
      this.getSourceBlock().getField('player_id').setVisible(false);
      this.getSourceBlock().getField('arrow_id').setVisible(false);
      this.getSourceBlock().getField('platform_id').setVisible(false);
      this.getSourceBlock().getField('normal_x').setVisible(false);
      this.getSourceBlock().getField('normal_y').setVisible(false);

      if (returnInfo.getValue() == 'TRUE') {
        switch (newValue) {
          case 'collide_player':
            this.getSourceBlock().getField('self_platform_id').setVisible(true);
            this.getSourceBlock().getField('player_id').setVisible(true);
            break;
          case 'collide_arrow':
            this.getSourceBlock().getField('self_platform_id').setVisible(true);
            this.getSourceBlock().getField('player_id').setVisible(true);
            this.getSourceBlock().getField('arrow_id').setVisible(true);
            break;
          case 'collide_platform':
            this.getSourceBlock().getField('self_platform_id').setVisible(true);
            this.getSourceBlock().getField('platform_id').setVisible(true);
            this.getSourceBlock().getField('normal_x').setVisible(true);
            this.getSourceBlock().getField('normal_y').setVisible(true);
            break;
        }
      }

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

  const variableMixin = {
    mutationToDom: function() {
      const container = Blockly.utils.xml.createElement('mutation');
      const showPlayerId = (this.getFieldValue('player') === 'id');
      const showDropdown = !(this.getField('VAR').variable_.name).startsWith('GLOBAL_');
      container.setAttribute('playerid_input', showPlayerId);
      container.setAttribute('show_dropdown', showDropdown);
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
      const startsWithGlobal = Blockly.Variables.getVariable(gm.blockly.workspace, newValue).name.startsWith('GLOBAL_');
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
      const startsWithGlobal = Blockly.Variables.getVariable(gm.blockly.workspace, newValue).name.startsWith('GLOBAL_');
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
      const startsWithGlobal = Blockly.Variables.getVariable(gm.blockly.workspace, newValue).name.startsWith('GLOBAL_');
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
