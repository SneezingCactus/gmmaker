/* eslint-disable no-invalid-this */
/* eslint-disable camelcase */
/* eslint-disable new-cap */
import Blockly from 'blockly';

/**
* Sets up the blocks' validators
*/
export default function() {
  Blockly.Blocks['set_player_prop'].validatorInit = function() {
    const playerDropdown = this.getField('player');

    this.getInput('player_id').setVisible(playerDropdown.getValue() == 'id');
    playerDropdown.setValidator(function(newValue) {
      this.getSourceBlock().getInput('player_id').setVisible(newValue == 'id');
      playerDropdown.forceRerender();
    });
  };

  Blockly.Blocks['change_player_prop'].validatorInit = function() {
    const playerDropdown = this.getField('player');

    this.getInput('player_id').setVisible(playerDropdown.getValue() == 'id');
    playerDropdown.setValidator(function(newValue) {
      this.getSourceBlock().getInput('player_id').setVisible(newValue == 'id');
      playerDropdown.forceRerender();
    });
  };

  Blockly.Blocks['set_last_arrow_prop'].validatorInit = function() {
    const playerDropdown = this.getField('player');

    this.getInput('player_id').setVisible(playerDropdown.getValue() == 'id');
    playerDropdown.setValidator(function(newValue) {
      this.getSourceBlock().getInput('player_id').setVisible(newValue == 'id');
      playerDropdown.forceRerender();
    });

    const arrowDropdown = this.getField('arrow');

    this.getInput('arrow_id').setVisible(arrowDropdown.getValue() == 'id');
    arrowDropdown.setValidator(function(newValue) {
      this.getSourceBlock().getInput('arrow_id').setVisible(newValue == 'id');
      playerDropdown.forceRerender();
    });
  };

  Blockly.Blocks['change_last_arrow_prop'].validatorInit = function() {
    const playerDropdown = this.getField('player');

    this.getInput('player_id').setVisible(playerDropdown.getValue() == 'id');
    playerDropdown.setValidator(function(newValue) {
      this.getSourceBlock().getInput('player_id').setVisible(newValue == 'id');
      playerDropdown.forceRerender();
    });

    const arrowDropdown = this.getField('arrow');

    this.getInput('arrow_id').setVisible(arrowDropdown.getValue() == 'id');
    arrowDropdown.setValidator(function(newValue) {
      this.getSourceBlock().getInput('arrow_id').setVisible(newValue == 'id');
      playerDropdown.forceRerender();
    });
  };

  Blockly.Blocks['get_player_prop'].validatorInit = function() {
    const playerDropdown = this.getField('player');

    this.getInput('player_id').setVisible(playerDropdown.getValue() == 'id');
    playerDropdown.setValidator(function(newValue) {
      this.getSourceBlock().getInput('player_id').setVisible(newValue == 'id');
      playerDropdown.forceRerender();
    });
  };

  Blockly.Blocks['get_last_arrow_prop'].validatorInit = function() {
    const playerDropdown = this.getField('player');

    this.getInput('player_id').setVisible(playerDropdown.getValue() == 'id');
    playerDropdown.setValidator(function(newValue) {
      this.getSourceBlock().getInput('player_id').setVisible(newValue == 'id');
      playerDropdown.forceRerender();
    });

    const arrowDropdown = this.getField('arrow');

    this.getInput('arrow_id').setVisible(arrowDropdown.getValue() == 'id');
    arrowDropdown.setValidator(function(newValue) {
      this.getSourceBlock().getInput('arrow_id').setVisible(newValue == 'id');
      playerDropdown.forceRerender();
    });
  };

  Blockly.Blocks['get_arrow_amount'].validatorInit = function() {
    const playerDropdown = this.getField('player');

    this.getInput('player_id').setVisible(playerDropdown.getValue() == 'id');
    playerDropdown.setValidator(function(newValue) {
      this.getSourceBlock().getInput('player_id').setVisible(newValue == 'id');
      playerDropdown.forceRerender();
    });
  };

  Blockly.Blocks['delete_arrows'].validatorInit = function() {
    const playerDropdown = this.getField('player');

    this.getInput('player_id').setVisible(playerDropdown.getValue() == 'id');
    playerDropdown.setValidator(function(newValue) {
      this.getSourceBlock().getInput('player_id').setVisible(newValue == 'id');
      playerDropdown.forceRerender();
    });

    const arrowDropdown = this.getField('arrow');

    this.getInput('arrow_id').setVisible(arrowDropdown.getValue() == 'id');
    arrowDropdown.setValidator(function(newValue) {
      this.getSourceBlock().getInput('arrow_id').setVisible(newValue == 'id');
      playerDropdown.forceRerender();
    });
  };

  Blockly.Blocks['player_die'].validatorInit = function() {
    const playerDropdown = this.getField('player');

    this.getInput('player_id').setVisible(playerDropdown.getValue() == 'id');
    playerDropdown.setValidator(function(newValue) {
      this.getSourceBlock().getInput('player_id').setVisible(newValue == 'id');
      playerDropdown.forceRerender();
    });
  };

  Blockly.Blocks['get_player_color'].validatorInit = function() {
    const playerDropdown = this.getField('player');

    this.getInput('player_id').setVisible(playerDropdown.getValue() == 'id');
    playerDropdown.setValidator(function(newValue) {
      this.getSourceBlock().getInput('player_id').setVisible(newValue == 'id');
      playerDropdown.forceRerender();
    });
  };

  Blockly.Blocks['on_player_collide'].validatorInit = function() {
    const returnInfo = this.getField('return_info');
    const collideType = this.getField('collide_type');

    returnInfo.setValidator(function(newValue) {
      this.getSourceBlock().getField('player_id').setVisible(false);
      this.getSourceBlock().getField('arrow_id').setVisible(false);
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
            this.getSourceBlock().getField('normal_x').setVisible(true);
            this.getSourceBlock().getField('normal_y').setVisible(true);
            break;
        }
      }

      collideType.forceRerender();
    });
  };

  Blockly.Blocks['input_override'].validatorInit = function() {
    const playerDropdown = this.getField('player');

    this.getInput('player_id').setVisible(playerDropdown.getValue() == 'id');
    playerDropdown.setValidator(function(newValue) {
      this.getSourceBlock().getInput('player_id').setVisible(newValue == 'id');
      playerDropdown.forceRerender();
    });
  };

  Blockly.Blocks['stop_input_override'].validatorInit = function() {
    const playerDropdown = this.getField('player');

    this.getInput('player_id').setVisible(playerDropdown.getValue() == 'id');
    playerDropdown.setValidator(function(newValue) {
      this.getSourceBlock().getInput('player_id').setVisible(newValue == 'id');
      playerDropdown.forceRerender();
    });
  };

  Blockly.Blocks['variables_get'].validatorInit = function() {
    const playerDropdown = this.getField('player');

    this.getInput('player_id').setVisible(playerDropdown.getValue() == 'id');
    playerDropdown.setValidator(function(newValue) {
      this.getSourceBlock().getInput('player_id').setVisible(newValue == 'id');
      playerDropdown.forceRerender();
    });
  };

  Blockly.Blocks['variables_set'].validatorInit = function() {
    const playerDropdown = this.getField('player');

    this.getInput('player_id').setVisible(playerDropdown.getValue() == 'id');
    playerDropdown.setValidator(function(newValue) {
      this.getSourceBlock().getInput('player_id').setVisible(newValue == 'id');
      playerDropdown.forceRerender();
    });
  };

  Blockly.Blocks['math_change'].validatorInit = function() {
    const playerDropdown = this.getField('player');

    this.getInput('player_id').setVisible(playerDropdown.getValue() == 'id');
    playerDropdown.setValidator(function(newValue) {
      this.getSourceBlock().getInput('player_id').setVisible(newValue == 'id');
      playerDropdown.forceRerender();
    });
  };
}
