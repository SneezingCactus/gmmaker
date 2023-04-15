/* eslint-disable require-jsdoc */
/* eslint-disable no-caller */
/* eslint-disable no-invalid-this */
/* eslint-disable camelcase */
/* eslint-disable new-cap */
import Blockly from 'blockly';
import * as LexicalVariables from '@mit-app-inventor/blockly-block-lexical-variables';

/**
* Sets up the blocks' validators
*/
export default function() {
  // msg replacing for lexical var blocks
  Blockly.Msg.LANG_VARIABLES_SET_TITLE_SET = 'set local';
  Blockly.Msg.LANG_VARIABLES_GET_TITLE_GET = 'local';

  // msg replacing for other things
  Blockly.Msg.COLOUR_RGB_TOOLTIP = 'Create a colour with the specified amount of red, green, and blue. All values must be between 0 and 255.';

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

  function createLexiVar(name) {
    return new LexicalVariables.FieldParameterFlydown(name, true, LexicalVariables.FieldFlydown.DISPLAY_BELOW);
  }

  const shadowBlocks = {
    'Boolean': {
      'type': 'logic_boolean',
      'fields': {'BOOL': 'TRUE'},
    },
    'Number': {
      'type': 'math_number',
      'fields': {'NUM': 0},
    },
    'String': {
      'type': 'text',
      'fields': {'TEXT': 'Hello World!'},
    },
    'Colour': {
      'type': 'colour_picker',
      'fields': {'COLOUR': '#ff0000'},
    },
    'Array': {
      'type': 'lists_create_with',
      'extraState': {'itemCount': 0},
    },
    'Vector': {
      'type': 'vector_create',
      'inputs': {
        'x': {
          'shadow': {
            'type': 'math_number',
            'fields': {'NUM': 0},
          },
        },
        'y': {
          'shadow': {
            'type': 'math_number',
            'fields': {'NUM': 0},
          },
        },
      },
    },
    'DrawingImageRegion': {
      'type': 'drawing_shape_image_region',
      'inputs': {
        'pos': {
          'shadow': {
            'type': 'vector_create',
            'inputs': {
              'x': {
                'shadow': {
                  'type': 'math_number',
                  'fields': {'NUM': 0},
                },
              },
              'y': {
                'shadow': {
                  'type': 'math_number',
                  'fields': {'NUM': 0},
                },
              },
            },
          },
        },
        'size': {
          'shadow': {
            'type': 'vector_create',
            'inputs': {
              'x': {
                'shadow': {
                  'type': 'math_number',
                  'fields': {'NUM': 32},
                },
              },
              'y': {
                'shadow': {
                  'type': 'math_number',
                  'fields': {'NUM': 32},
                },
              },
            },
          },
        },
      },
    },
  };

  function createShadow(target, type) {
    if (!shadowBlocks[type]) return;

    const shadowBlock = Blockly.serialization.blocks.append(shadowBlocks[type], target.getSourceBlock().workspace);
    shadowBlock.setShadow(true);

    shadowBlock.initSvg();
    shadowBlock.render();

    target.connection.connect(shadowBlock.outputConnection);
  }

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
            .appendField(createLexiVar('id'), 'player_id');

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
          appendFieldIfNotExist(this.inputList[2], createLexiVar('hitA_discId'), 'a_discid');
          this.inputList[2].removeField('a_arrowid', true);
          this.inputList[2].removeField('a_platformid', true);
          this.inputList[2].removeField('a_fixtureid', true);
          this.inputList[2].removeField('a_normal', true);
          this.inputList[2].removeField('a_capzone', true);
          break;
        case 'arrow':
          appendFieldIfNotExist(this.inputList[2], createLexiVar('hitA_arrowId'), 'a_arrowid');
          this.inputList[2].removeField('a_discid', true);
          this.inputList[2].removeField('a_platformid', true);
          this.inputList[2].removeField('a_fixtureid', true);
          this.inputList[2].removeField('a_normal', true);
          this.inputList[2].removeField('a_capzone', true);
          break;
        case 'platform':
          appendFieldIfNotExist(this.inputList[2], createLexiVar('hitA_platformId'), 'a_platformid');
          appendFieldIfNotExist(this.inputList[2], createLexiVar('hitA_shapeIndex'), 'a_fixtureid');
          appendFieldIfNotExist(this.inputList[2], createLexiVar('hitA_normal'), 'a_normal');
          appendFieldIfNotExist(this.inputList[2], createLexiVar('hitA_isCapzone'), 'a_capzone');
          this.inputList[2].removeField('a_discid', true);
          this.inputList[2].removeField('a_arrowid', true);
          break;
      }

      switch (colB) {
        case 'disc':
          appendFieldIfNotExist(this.inputList[3], createLexiVar('hitB_discId'), 'b_discid');
          this.inputList[3].removeField('b_arrowid', true);
          this.inputList[3].removeField('b_platformid', true);
          this.inputList[3].removeField('b_fixtureid', true);
          this.inputList[3].removeField('b_normal', true);
          this.inputList[3].removeField('b_capzone', true);
          break;
        case 'arrow':
          appendFieldIfNotExist(this.inputList[3], createLexiVar('hitB_arrowId'), 'b_arrowid');
          this.inputList[3].removeField('b_discid', true);
          this.inputList[3].removeField('b_platformid', true);
          this.inputList[3].removeField('b_fixtureid', true);
          this.inputList[3].removeField('b_normal', true);
          this.inputList[3].removeField('b_capzone', true);
          break;
        case 'platform':
          appendFieldIfNotExist(this.inputList[3], createLexiVar('hitB_platformId'), 'b_platformid');
          appendFieldIfNotExist(this.inputList[3], createLexiVar('hitB_shapeIndex'), 'b_fixtureid');
          appendFieldIfNotExist(this.inputList[3], createLexiVar('hitB_normal'), 'b_normal');
          appendFieldIfNotExist(this.inputList[3], createLexiVar('hitB_isCapzone'), 'b_capzone');
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

  const setterMixin = {
    mutationToDom: function() {
      const container = Blockly.utils.xml.createElement('mutation');

      const setOption = this.getFieldValue('set_option');
      const setProperty = this.getFieldValue('property');

      container.setAttribute('set_option', setOption);
      container.setAttribute('set_property', setProperty);

      this.updateShape_(setOption, setProperty);
      return container;
    },
    domToMutation: function(xmlElement) {
      this.updateShape_(xmlElement.getAttribute('set_option'), xmlElement.getAttribute('set_property'));
    },
    updateShape_: function(setOption, setProperty) {
      const toInput = this.getInput('to');

      if (setOption) {
        toInput.fieldRow[toInput.fieldRow.length - 1].setValue(setOption === 'set' ? 'to' : 'by');
      }

      if (!setProperty) return;

      if (this.propTypes[setProperty] != 'Number' && this.propTypes[setProperty] != 'Vector') {
        this.getField('set_option').doValueUpdate_('set');
        this.getField('set_option').forceRerender();
        this.getField('set_option').setEnabled(false);
      } else {
        this.getField('set_option').setEnabled(true);
      }

      if (this.propTypes[setProperty] !== toInput.connection.check_?.[0]) {
        toInput.connection.setShadowStateInternal_();
      }

      toInput.setCheck(this.propTypes[setProperty]);

      if (!toInput.connection.shadowState_) createShadow(toInput, this.propTypes[setProperty]);
    },
  };

  const getterMixin = {
    mutationToDom: function() {
      const container = Blockly.utils.xml.createElement('mutation');

      const setProperty = this.getFieldValue('property');

      container.setAttribute('set_property', setProperty);

      this.updateShape_(setProperty);
      return container;
    },
    domToMutation: function(xmlElement) {
      this.updateShape_(xmlElement.getAttribute('set_property'));
    },
    updateShape_: function(setProperty) {
      this.setOutput(true, this.propTypes[setProperty]);
    },
  };

  /**
   * Create a validator for a setter block, and the getter block.
   * @param {String} setterBlockId id of the setter block
   * @param {String} getterBlockId id of the getter block
   * @param {Object} propTypes type for each property
   */
  function setterBlockValidator(setterBlockId, getterBlockId, propTypes) {
    if (setterBlockId) {
      Blockly.Blocks[setterBlockId].validatorInit = function() {
        this.mixin(setterMixin);

        this.propTypes = propTypes;

        const setOptionDropdown = this.getField('set_option');
        const propertyDropdown = this.getField('property');

        setOptionDropdown.setValidator(function(newValue) {
          this.getSourceBlock().updateShape_(newValue);
        });
        propertyDropdown.setValidator(function(newValue) {
          this.getSourceBlock().updateShape_(null, newValue);
        });
      };
    }

    if (getterBlockId) {
      Blockly.Blocks[getterBlockId].validatorInit = function() {
        this.mixin(getterMixin);

        this.propTypes = propTypes;

        const propertyDropdown = this.getField('property');

        propertyDropdown.setValidator(function(newValue) {
          this.getSourceBlock().updateShape_(newValue);
        });
      };
    }
  }

  setterBlockValidator('disc_prop_set', 'disc_prop_get', {
    'p': 'Vector', 'lv': 'Vector', 'swing.p': 'Vector',
    'a': 'Number', 'av': 'Number', 'a1a': 'Number', 'da': 'Number', 'ds': 'Number', 'swing.b': 'Number', 'swing.l': 'Number', 'radius': 'Number',
  });
  setterBlockValidator('arrow_prop_set', 'arrow_prop_get', {
    'p': 'Vector', 'lv': 'Vector',
    'a': 'Number', 'av': 'Number', 'did': 'Number', 'fte': 'Number',
  });
  setterBlockValidator('plat_prop_set', 'plat_prop_get', {
    'p': 'Vector', 'lv': 'Vector',
    'a': 'Number', 'de': 'Number', 're': 'Number', 'fric': 'Number', 'ld': 'Number', 'ad': 'Number', 'cf.x': 'Number', 'cf.y': 'Number', 'cf.ct': 'Number',
    'fricp': 'Boolean', 'visible': 'Boolean', 'fr': 'Boolean', 'bu': 'Boolean', 'f_p': 'Boolean', 'f_1': 'Boolean', 'f_2': 'Boolean', 'f_3': 'Boolean', 'f_4': 'Boolean',
  });
  setterBlockValidator('plat_shape_prop_set', 'plat_shape_prop_get', {
    'geo.c': 'Vector', 'geo.s': 'Vector',
    'geo.a': 'Number', 'geo.r': 'Number', 're': 'Number', 'de': 'Number', 'fr': 'Number',
    'fp': 'Boolean', 'np': 'Boolean', 'ng': 'Boolean', 'ig': 'Boolean', 'd': 'Boolean',
    'f': 'Colour',
    'geo.v': 'Array',
  });
  setterBlockValidator('camera_prop_set', 'camera_prop_get', {
    'pos': 'Vector', 'scale': 'Vector',
    'angle': 'Number',
  });
  setterBlockValidator('drawing_prop_set', 'drawing_prop_get', {
    'pos': 'Vector', 'scale': 'Vector',
    'alpha': 'Number', 'angle': 'Number',
  });
  setterBlockValidator(null, 'lobby_playerinfo_get', {
    'userName': 'String',
    'level': 'Number',
    'skinBg': 'Colour',
    'skinColours': 'Array',
    'guest': 'Boolean', 'team == 0': 'Boolean', 'team == 1': 'Boolean', 'team == 2': 'Boolean', 'team == 3': 'Boolean', 'team == 4': 'Boolean', 'team == 5': 'Boolean',
  });
  setterBlockValidator(null, 'state_map_prop_get', {
    'n': 'String', 'a': 'String',
    'vu': 'Number', 'vd': 'Number',
  });
  setterBlockValidator(null, 'state_misc_get', {
    'rl': 'Number', 'rc': 'Number',
    'ms.fl': 'Boolean', 'ms.nc': 'Boolean', 'ms.re': 'Boolean',
  });

  const drawingShapeSetterProps = {
    bxci: [
      ['colour', 'colour'],
      ['alpha', 'alpha'],
      ['position', 'pos'],
      ['size', 'size'],
      ['angle', 'angle'],
    ],
    po: [
      ['colour', 'colour'],
      ['alpha', 'alpha'],
      ['position', 'pos'], ['scale', 'scale'],
      ['angle', 'angle'],
      ['vertices', 'vertices'],
    ],
    li: [
      ['colour', 'colour'],
      ['alpha', 'alpha'],
      ['"from" point', 'pos'],
      ['"to" point', 'end'],
      ['width', 'width'],
    ],
    tx: [
      ['colour', 'colour'],
      ['alpha', 'alpha'],
      ['position', 'pos'],
      ['angle', 'angle'],
      ['text', 'text'],
      ['size', 'size'],
      ['bold', 'bold'],
      ['italic', 'italic'],
      ['shadow', 'shadow'],
    ],
    im: [
      ['image name', 'id'],
      ['image region', 'region'],
      ['image region pos', 'region.pos'],
      ['image region size', 'region.size'],
      ['colour', 'colour'],
      ['alpha', 'alpha'],
      ['position', 'pos'],
      ['size', 'size'],
      ['angle', 'angle'],
    ],
  };

  const drawingShapeSetterPropTypes = {
    bxci: {
      'colour': 'Colour',
      'pos': 'Vector', 'size': 'Vector',
      'alpha': 'Number', 'angle': 'Number',
    },
    po: {
      'colour': 'Colour',
      'pos': 'Vector', 'scale': 'Vector',
      'alpha': 'Number', 'angle': 'Number',
      'vertices': 'Array',
    },
    li: {
      'colour': 'Colour',
      'pos': 'Vector', 'end': 'Vector',
      'alpha': 'Number', 'width': 'Number',
    },
    tx: {
      'colour': 'Colour',
      'pos': 'Vector',
      'alpha': 'Number', 'angle': 'Number', 'size': 'Number',
      'bold': 'Boolean', 'italic': 'Boolean', 'shadow': 'Boolean',
      'text': 'String',
    },
    im: {
      'colour': 'Colour',
      'pos': 'Vector', 'size': 'Vector', 'region.pos': 'Vector', 'region.size': 'Vector',
      'alpha': 'Number', 'angle': 'Number',
      'id': 'String',
      'region': 'DrawingImageRegion',
    },
  };

  const drawingShapeSetterMixin = {
    mutationToDom: function() {
      const container = Blockly.utils.xml.createElement('mutation');

      const setOption = this.getFieldValue('set_option');
      const shapeType = this.getFieldValue('shape_type');
      const setProperty = this.getFieldValue('property');

      container.setAttribute('set_option', setOption);
      container.setAttribute('shape_type', shapeType);
      container.setAttribute('set_property', setProperty);

      this.updateShape_(setOption, shapeType, setProperty);
      return container;
    },
    domToMutation: function(xmlElement) {
      this.updateShape_(xmlElement.getAttribute('set_option'), xmlElement.getAttribute('shape_type'), xmlElement.getAttribute('set_property'));
    },
    updateShape_: function(setOption, shapeType, setProperty) {
      const toInput = this.getInput('to');

      if (setOption) {
        toInput.fieldRow[toInput.fieldRow.length - 1].setValue(setOption === 'set' ? 'to' : 'by');
      }

      const props = drawingShapeSetterProps[shapeType];
      const propTypes = drawingShapeSetterPropTypes[shapeType];

      this.getField('property').menuGenerator_ = props;
      if (!propTypes[setProperty]) {
        setProperty = props[0][1];
        this.getField('property').doValueUpdate_(props[0][1]);
        this.getField('property').selectedOption_ = props[0];
        this.getField('property').forceRerender();
      }

      if (!setProperty) return;

      if (propTypes[setProperty] != 'Number' && propTypes[setProperty] != 'Vector') {
        this.getField('set_option').doValueUpdate_('set');
        this.getField('set_option').forceRerender();
        this.getField('set_option').setEnabled(false);
      } else {
        this.getField('set_option').setEnabled(true);
      }

      if (propTypes[setProperty] !== toInput.connection.check_?.[0]) {
        toInput.connection.setShadowStateInternal_();
      }

      toInput.setCheck(propTypes[setProperty]);

      if (!toInput.connection.shadowState_) createShadow(toInput, propTypes[setProperty]);
    },
  };

  const drawingShapeGetterMixin = {
    mutationToDom: function() {
      const container = Blockly.utils.xml.createElement('mutation');

      const shapeType = this.getFieldValue('shape_type');
      const setProperty = this.getFieldValue('property');

      container.setAttribute('shape_type', shapeType);
      container.setAttribute('set_property', setProperty);

      this.updateShape_(shapeType, setProperty);
      return container;
    },
    domToMutation: function(xmlElement) {
      this.updateShape_(xmlElement.getAttribute('shape_type'), xmlElement.getAttribute('set_property'));
    },
    updateShape_: function(shapeType, setProperty) {
      const props = drawingShapeSetterProps[shapeType];
      const propTypes = drawingShapeSetterPropTypes[shapeType];

      this.getField('property').menuGenerator_ = props;
      if (!propTypes[this.getFieldValue('property')]) {
        this.getField('property').doValueUpdate_(props[0][0]);
        this.getField('property').forceRerender();
      }

      this.setOutput(true, propTypes[setProperty]);
    },
  };

  Blockly.Blocks['drawing_shape_prop_set'].validatorInit = function() {
    this.mixin(drawingShapeSetterMixin);

    const setOptionDropdown = this.getField('set_option');
    const shapeTypeDropdown = this.getField('shape_type');
    const propertyDropdown = this.getField('property');

    setOptionDropdown.setValidator(function(newValue) {
      this.getSourceBlock().updateShape_(newValue, shapeTypeDropdown.getValue(), propertyDropdown.getValue());
    });
    shapeTypeDropdown.setValidator(function(newValue) {
      this.getSourceBlock().updateShape_(setOptionDropdown.getValue(), newValue, propertyDropdown.getValue());
    });
    propertyDropdown.setValidator(function(newValue) {
      this.getSourceBlock().updateShape_(setOptionDropdown.getValue(), shapeTypeDropdown.getValue(), newValue);
    });
  };

  Blockly.Blocks['drawing_shape_prop_get'].validatorInit = function() {
    this.mixin(drawingShapeGetterMixin);

    const shapeTypeDropdown = this.getField('shape_type');
    const propertyDropdown = this.getField('property');

    shapeTypeDropdown.setValidator(function(newValue) {
      this.getSourceBlock().updateShape_(newValue, propertyDropdown.getValue());
    });
    propertyDropdown.setValidator(function(newValue) {
      this.getSourceBlock().updateShape_(shapeTypeDropdown.getValue(), newValue);
    });
  };

  const createDrawingMixin = {
    mutationToDom: function() {
      const container = Blockly.utils.xml.createElement('mutation');

      const returnId = this.getFieldValue('return_id') !== 'FALSE';
      const attachTo = this.getFieldValue('attach_to');

      container.setAttribute('return_id', returnId);
      container.setAttribute('attach_to', attachTo);

      this.updateShape_(returnId, attachTo);
      return container;
    },
    domToMutation: function(xmlElement) {
      this.updateShape_(xmlElement.getAttribute('return_id') !== 'false', xmlElement.getAttribute('attach_to'));
    },
    updateShape_: function(returnId, attachTo) {
      if (returnId !== null) {
        const oldReturnId = !!this.outputConnection;
        if (returnId !== oldReturnId) {
          this.unplug(true, true);
          if (returnId) {
            this.setPreviousStatement(false);
            this.setNextStatement(false);
            this.setOutput('Number');
          } else {
            this.setOutput(false);
            this.setPreviousStatement(true);
            this.setNextStatement(true);
          }
        }
      }

      if (!attachTo) return;

      const attachIdExists = this.getInput('attach_id');
      const isBehindExists = this.getInput('is_behind');

      if (attachTo == 'disc' || attachTo == 'platform') {
        if (!attachIdExists) {
          this.appendValueInput('attach_id')
              .setCheck('Number')
              .setAlign(1)
              .appendField(new Blockly.FieldLabel('attach id'));

          const shadowBlock = this.workspace.newBlock('math_number');
          shadowBlock.setShadow(true);

          shadowBlock.initSvg();
          shadowBlock.render();

          this.getInput('attach_id').connection.connect(shadowBlock.outputConnection);
        }
        if (isBehindExists) {
          this.moveInputBefore('attach_id', 'is_behind');
        } else {
          this.moveInputBefore('attach_id', 'pre_shape_dum');
        }
      } else if (attachIdExists) {
        this.getInput('attach_id').connection.setShadowStateInternal_();
        this.removeInput('attach_id');
      }

      if (attachTo != 'screen') {
        if (!isBehindExists) {
          this.appendValueInput('is_behind')
              .setCheck('Boolean')
              .setAlign(1)
              .appendField(new Blockly.FieldLabel('is behind'));

          const shadowBlock = this.workspace.newBlock('logic_boolean');
          shadowBlock.setShadow(true);
          shadowBlock.getField('BOOL').setValue('FALSE');

          shadowBlock.initSvg();
          shadowBlock.render();

          this.getInput('is_behind').connection.connect(shadowBlock.outputConnection);
        }
        this.moveInputBefore('is_behind', 'pre_shape_dum');
      } else if (isBehindExists) {
        this.getInput('is_behind').connection.setShadowStateInternal_();
        this.removeInput('is_behind');
      }
    },
  };

  Blockly.Blocks['drawing_create'].validatorInit = function() {
    this.mixin(createDrawingMixin);

    const returnIdCheck = this.getField('return_id');
    const attachToDropdown = this.getField('attach_to');

    returnIdCheck.setValidator(function(newValue) {
      this.getSourceBlock().updateShape_(newValue === 'TRUE');
    });
    attachToDropdown.setValidator(function(newValue) {
      this.getSourceBlock().updateShape_(null, newValue);
    });
  };

  const attachDrawingMixin = {
    mutationToDom: function() {
      const container = Blockly.utils.xml.createElement('mutation');
      const attachTo = this.getFieldValue('attach_to');

      container.setAttribute('attach_to', attachTo);

      this.updateShape_(attachTo);
      return container;
    },
    domToMutation: function(xmlElement) {
      this.updateShape_(xmlElement.getAttribute('attach_to'));
    },
    updateShape_: function(attachTo) {
      const attachIdExists = this.getInput('attach_id');
      const isBehindExists = this.getInput('is_behind');

      if (attachTo == 'disc' || attachTo == 'platform') {
        if (!attachIdExists) {
          this.appendValueInput('attach_id')
              .setCheck('Number')
              .setAlign(1)
              .appendField(new Blockly.FieldLabel('attach id'));

          const shadowBlock = this.workspace.newBlock('math_number');
          shadowBlock.setShadow(true);

          shadowBlock.initSvg();
          shadowBlock.render();

          this.getInput('attach_id').connection.connect(shadowBlock.outputConnection);
        }
        if (isBehindExists) {
          this.moveInputBefore('attach_id', 'is_behind');
        }
      } else if (attachIdExists) {
        this.getInput('attach_id').connection.setShadowStateInternal_();
        this.removeInput('attach_id');
      }

      if (attachTo != 'screen') {
        if (!isBehindExists) {
          this.appendValueInput('is_behind')
              .setCheck('Boolean')
              .setAlign(1)
              .appendField(new Blockly.FieldLabel('is behind'));

          const shadowBlock = this.workspace.newBlock('logic_boolean');
          shadowBlock.setShadow(true);
          shadowBlock.getField('BOOL').setValue('FALSE');

          shadowBlock.initSvg();
          shadowBlock.render();

          this.getInput('is_behind').connection.connect(shadowBlock.outputConnection);
        }
      } else if (isBehindExists) {
        this.getInput('is_behind').connection.setShadowStateInternal_();
        this.removeInput('is_behind');
      }
    },
  };

  Blockly.Blocks['drawing_attach'].validatorInit = function() {
    this.mixin(attachDrawingMixin);

    const attachToDropdown = this.getField('attach_to');

    attachToDropdown.setValidator(function(newValue) {
      this.getSourceBlock().updateShape_(newValue);
    });
  };

  const returnIdMixin = {
    mutationToDom: function() {
      const container = Blockly.utils.xml.createElement('mutation');

      const returnId = this.getFieldValue('return_id') !== 'FALSE';

      container.setAttribute('return_id', returnId);

      this.updateShape_(returnId);
      return container;
    },
    domToMutation: function(xmlElement) {
      this.updateShape_(xmlElement.getAttribute('return_id') !== 'false');
    },
    updateShape_: function(returnId) {
      const oldReturnId = !!this.outputConnection;
      if (returnId !== oldReturnId) {
        this.unplug(true, true);
        if (returnId) {
          this.setPreviousStatement(false);
          this.setNextStatement(false);
          this.setOutput('Number');
        } else {
          this.setOutput(false);
          this.setPreviousStatement(true);
          this.setNextStatement(true);
        }
      }
    },
  };

  Blockly.Blocks['arrow_create'].validatorInit = function() {
    this.mixin(returnIdMixin);

    const returnIdCheck = this.getField('return_id');

    returnIdCheck.setValidator(function(newValue) {
      this.getSourceBlock().updateShape_(newValue === 'TRUE');
    });
  };
  Blockly.Blocks['platform_create'].validatorInit = function() {
    this.mixin(returnIdMixin);

    const returnIdCheck = this.getField('return_id');

    returnIdCheck.setValidator(function(newValue) {
      this.getSourceBlock().updateShape_(newValue === 'TRUE');
    });
  };

  const playSoundMixin = {
    mutationToDom: function() {
      const container = Blockly.utils.xml.createElement('mutation');

      const audioName = this.getFieldValue('name');

      container.setAttribute('audio_name', audioName);

      this.updateShape_(audioName);
      return container;
    },
    domToMutation: function(xmlElement) {
      this.updateShape_(xmlElement.getAttribute('audio_name'));
    },
    updateShape_: function(audioName) {
      const inputExists = this.getInput('id');

      if (audioName === 'custom') {
        if (!inputExists) {
          this.appendValueInput('id')
              .setCheck('String')
              .setAlign(1)
              .appendField(new Blockly.FieldLabel('name'));

          const shadowBlock = this.workspace.newBlock('text');
          shadowBlock.setShadow(true);
          shadowBlock.getField('TEXT').setValue('audio');

          shadowBlock.initSvg();
          shadowBlock.render();

          this.getInput('id').connection.connect(shadowBlock.outputConnection);
        }
        this.moveInputBefore('id', 'volume');
      } else if (inputExists) {
        this.getInput('id').connection.setShadowStateInternal_();
        this.removeInput('id');
      }
    },
  };

  Blockly.Blocks['audio_play_sound'].validatorInit = function() {
    this.mixin(playSoundMixin);

    const audioNameDropdown = this.getField('name');

    audioNameDropdown.setValidator(function(newValue) {
      this.getSourceBlock().updateShape_(newValue);
    });
  };

  const noLerpMixin = {
    mutationToDom: function() {
      const container = Blockly.utils.xml.createElement('mutation');

      const audioName = this.getFieldValue('obj_type');

      container.setAttribute('obj_type', audioName);

      this.updateShape_(audioName);
      return container;
    },
    domToMutation: function(xmlElement) {
      this.updateShape_(xmlElement.getAttribute('obj_type'));
    },
    updateShape_: function(objType) {
      const inputExists = this.getInput('id');

      if (objType !== 'game.graphics.camera') {
        if (!inputExists) {
          this.appendValueInput('id')
              .setCheck('Number')
              .setAlign(1);

          createShadow(this.getInput('id'), 'Number');
        }
        this.moveInputBefore('id', 'post_id_dum');
      } else if (inputExists) {
        this.getInput('id').connection.setShadowStateInternal_();
        this.removeInput('id');
      }
    },
  };

  Blockly.Blocks['obj_no_lerp'].validatorInit = function() {
    this.mixin(noLerpMixin);

    const objTypeDropdown = this.getField('obj_type');

    objTypeDropdown.setValidator(function(newValue) {
      this.getSourceBlock().updateShape_(newValue);
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

  this.htmlDiv_.setAttribute('aria-expanded', 'false');

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

Blockly.WorkspaceSvg.prototype.centerOnBlock = function(id) {
  if (!this.isMovable()) {
    console.warn(
        'Tried to move a non-movable workspace. This could result' +
        ' in blocks becoming inaccessible.');
    return;
  }

  const block = id ? this.getBlockById(id) : null;
  if (!block) {
    return;
  }

  // XY is in workspace coordinates.
  const xy = block.getRelativeToSurfaceXY();
  // Height/width is in workspace units.
  const heightWidth = {width: block.width, height: block.height};

  // Find the enter of the block in workspace units.
  const blockCenterY = xy.y + heightWidth.height / 2;

  // In RTL the block's position is the top right of the block, not top left.
  const multiplier = this.RTL ? -1 : 1;
  const blockCenterX = xy.x + multiplier * heightWidth.width / 2;

  // Workspace scale, used to convert from workspace coordinates to pixels.
  const scale = this.scale;

  // Center of block in pixels, relative to workspace origin (center 0,0).
  // Scrolling to here would put the block in the top-left corner of the
  // visible workspace.
  const pixelX = blockCenterX * scale;
  const pixelY = blockCenterY * scale;

  const metrics = this.getMetrics();

  // viewHeight and viewWidth are in pixels.
  const halfViewWidth = metrics.viewWidth / 2;
  const halfViewHeight = metrics.viewHeight / 2;

  // Put the block in the center of the visible workspace instead.
  const scrollToCenterX = pixelX - halfViewWidth;
  const scrollToCenterY = pixelY - halfViewHeight;

  // Convert from workspace directions to canvas directions.
  const x = -scrollToCenterX;
  const y = -scrollToCenterY;

  this.scroll(x, y);
};

// little hack to fix the immense lag when dragging around the workspace

Blockly.WorkspaceSvg.prototype.translate = function(x, y) {
  if (this.useWorkspaceDragSurface && this.isDragSurfaceActive) {
    this.workspaceDragSurface?.translateSurface(x, y);
  } else {
    const translation = 'translate(' + x + ',' + y + ') ' +
          'scale(' + this.scale + ')';
    this.svgBlockCanvas_.setAttribute('transform', translation);
    this.svgBubbleCanvas_.setAttribute('transform', translation);
  }
  // Now update the block drag surface if we're using one.
  if (this.blockDragSurface) {
    this.blockDragSurface.translateAndScaleGroup(x, y, this.scale);
  }
  // And update the grid if we're using one.
  if (this.grid) {
    this.grid.moveTo(x, y);
  }

  // this.maybeFireViewportChangeEvent();
};

// fix to the disappearing blocks problem
Blockly.WorkspaceSvg.prototype.setCachedParentSvgSize = function(width, height) {
  const svg = this.getParentSvg();
  if (width != null) {
    this.cachedParentSvgSize.width = width;
    // This is set to support the public (but deprecated) Blockly.svgSize
    // method.
    svg.cachedWidth_ = width;
    svg.setAttribute('data-cached-width', width.toString());
  }
  if (height != null) {
    this.cachedParentSvgSize.height = height;
    // This is set to support the public (but deprecated) Blockly.svgSize
    // method.
    svg.cachedHeight_ = height;
    svg.setAttribute('data-cached-height', height.toString());
  }
};
