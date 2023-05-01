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

      if (this.rendered && this.render) {
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

    if (shadowBlock.initSvg) {
      shadowBlock.initSvg();
      shadowBlock.render();
    }

    target.connection.connect(shadowBlock.outputConnection);
    target.connection.setShadowState(shadowBlocks[type]);
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
      if (setProperty) container.setAttribute('set_property', setProperty);

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
        toInput.connection.setShadowState(null);
      }

      if (this.propTypes[setProperty] == 'Vector') {
        toInput.setCheck(['Vector', 'Number']);
      } else {
        toInput.setCheck(this.propTypes[setProperty]);
      }

      if (!toInput.connection.shadowState_) {
        createShadow(toInput, this.propTypes[setProperty]);
      }
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
        propertyDropdown?.setValidator(function(newValue) {
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
    'p[0]': 'Number', 'p[1]': 'Number', 'lv[0]': 'Number', 'lv[1]': 'Number', 'swing.p[0]': 'Number', 'swing.p[1]': 'Number',
    'a': 'Number', 'av': 'Number', 'a1a': 'Number', 'da': 'Number', 'ds': 'Number', 'swing.b': 'Number', 'swing.l': 'Number', 'radius': 'Number',
  });
  setterBlockValidator('arrow_prop_set', 'arrow_prop_get', {
    'p': 'Vector', 'lv': 'Vector',
    'p[0]': 'Number', 'p[1]': 'Number', 'lv[0]': 'Number', 'lv[1]': 'Number',
    'a': 'Number', 'av': 'Number', 'did': 'Number', 'fte': 'Number',
  });
  setterBlockValidator('plat_prop_set', 'plat_prop_get', {
    'p': 'Vector', 'lv': 'Vector', 'cf.lf': 'Vector',
    'p[0]': 'Number', 'p[1]': 'Number', 'lv[0]': 'Number', 'lv[1]': 'Number', 'cf.lf[0]': 'Number', 'cf.lf[1]': 'Number',
    'a': 'Number', 'de': 'Number', 're': 'Number', 'fric': 'Number', 'ld': 'Number', 'ad': 'Number', 'cf.ct': 'Number',
    'fricp': 'Boolean', 'visible': 'Boolean', 'fr': 'Boolean', 'bu': 'Boolean', 'f_p': 'Boolean', 'f_1': 'Boolean', 'f_2': 'Boolean', 'f_3': 'Boolean', 'f_4': 'Boolean',
  });
  setterBlockValidator('plat_shape_prop_set', 'plat_shape_prop_get', {
    'geo.c': 'Vector', 'geo.s': 'Vector',
    'geo.c[0]': 'Number', 'geo.c[1]': 'Number', 'geo.s[0]': 'Number', 'geo.s[1]': 'Number',
    'geo.a': 'Number', 'geo.r': 'Number', 're': 'Number', 'de': 'Number', 'fr': 'Number',
    'fp': 'Boolean', 'np': 'Boolean', 'ng': 'Boolean', 'ig': 'Boolean', 'd': 'Boolean',
    'f': 'Colour',
    'geo.v': 'Array',
  });
  setterBlockValidator('camera_prop_set', 'camera_prop_get', {
    'pos': 'Vector', 'scale': 'Vector',
    'pos[0]': 'Number', 'pos[1]': 'Number', 'scale[0]': 'Number', 'scale[1]': 'Number',
    'angle': 'Number',
  });
  setterBlockValidator('drawing_prop_set', 'drawing_prop_get', {
    'pos': 'Vector', 'scale': 'Vector',
    'pos[0]': 'Number', 'pos[1]': 'Number', 'scale[0]': 'Number', 'scale[1]': 'Number',
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
      ['x position', 'pos[0]'],
      ['y position', 'pos[1]'],
      ['size', 'size'],
      ['x size', 'size[0]'],
      ['y size', 'size[1]'],
      ['angle', 'angle'],
    ],
    po: [
      ['colour', 'colour'],
      ['alpha', 'alpha'],
      ['position', 'pos'],
      ['x position', 'pos[0]'],
      ['y position', 'pos[1]'],
      ['scale', 'scale'],
      ['x scale', 'scale[0]'],
      ['y scale', 'scale[1]'],
      ['angle', 'angle'],
      ['vertices', 'vertices'],
    ],
    li: [
      ['colour', 'colour'],
      ['alpha', 'alpha'],
      ['"from" point', 'pos'],
      ['"from" x', 'pos[0]'],
      ['"from" y', 'pos[1]'],
      ['"to" point', 'end'],
      ['"to" x', 'end[0]'],
      ['"to" y', 'end[1]'],
      ['width', 'width'],
    ],
    tx: [
      ['colour', 'colour'],
      ['alpha', 'alpha'],
      ['position', 'pos'],
      ['x position', 'pos[0]'],
      ['y position', 'pos[1]'],
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
      ['image region x pos', 'region.pos[0]'],
      ['image region y pos', 'region.pos[1]'],
      ['image region size', 'region.size'],
      ['image region x size', 'region.size[0]'],
      ['image region y size', 'region.size[1]'],
      ['colour', 'colour'],
      ['alpha', 'alpha'],
      ['position', 'pos'],
      ['x position', 'pos[0]'],
      ['y position', 'pos[1]'],
      ['size', 'size'],
      ['x size', 'size[0]'],
      ['y size', 'size[1]'],
      ['angle', 'angle'],
    ],
  };

  const drawingShapeSetterPropTypes = {
    bxci: {
      'colour': 'Colour',
      'pos': 'Vector', 'size': 'Vector',
      'pos[0]': 'Number', 'pos[1]': 'Number', 'size[0]': 'Number', 'size[1]': 'Number',
      'alpha': 'Number', 'angle': 'Number',
    },
    po: {
      'colour': 'Colour',
      'pos': 'Vector', 'scale': 'Vector',
      'pos[0]': 'Number', 'pos[1]': 'Number', 'scale[0]': 'Number', 'scale[1]': 'Number',
      'alpha': 'Number', 'angle': 'Number',
      'vertices': 'Array',
    },
    li: {
      'colour': 'Colour',
      'pos': 'Vector', 'end': 'Vector',
      'pos[0]': 'Number', 'pos[1]': 'Number', 'end[0]': 'Number', 'end[1]': 'Number',
      'alpha': 'Number', 'width': 'Number',
    },
    tx: {
      'colour': 'Colour',
      'pos': 'Vector',
      'pos[0]': 'Number', 'pos[1]': 'Number',
      'alpha': 'Number', 'angle': 'Number', 'size': 'Number',
      'bold': 'Boolean', 'italic': 'Boolean', 'shadow': 'Boolean',
      'text': 'String',
    },
    im: {
      'colour': 'Colour',
      'pos': 'Vector', 'size': 'Vector', 'region.pos': 'Vector', 'region.size': 'Vector',
      'pos[0]': 'Number', 'pos[1]': 'Number', 'size[0]': 'Number', 'size[1]': 'Number', 'region.pos[0]': 'Number', 'region.pos[1]': 'Number', 'region.size[0]': 'Number', 'region.size[1]': 'Number',
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
        toInput.connection.setShadowState(null);
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

          if (shadowBlock.initSvg) {
            shadowBlock.initSvg();
            shadowBlock.render();
          }

          this.getInput('attach_id').connection.connect(shadowBlock.outputConnection);
        }
        if (isBehindExists) {
          this.moveInputBefore('attach_id', 'is_behind');
        } else {
          this.moveInputBefore('attach_id', 'pre_shape_dum');
        }
      } else if (attachIdExists) {
        this.getInput('attach_id').connection.setShadowState(null);
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

          if (shadowBlock.initSvg) {
            shadowBlock.initSvg();
            shadowBlock.render();
          }

          this.getInput('is_behind').connection.connect(shadowBlock.outputConnection);
        }
        this.moveInputBefore('is_behind', 'pre_shape_dum');
      } else if (isBehindExists) {
        this.getInput('is_behind').connection.setShadowState(null);
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

          if (shadowBlock.initSvg) {
            shadowBlock.initSvg();
            shadowBlock.render();
          }

          this.getInput('attach_id').connection.connect(shadowBlock.outputConnection);
        }
        if (isBehindExists) {
          this.moveInputBefore('attach_id', 'is_behind');
        }
      } else if (attachIdExists) {
        this.getInput('attach_id').connection.setShadowState(null);
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

          if (shadowBlock.initSvg) {
            shadowBlock.initSvg();
            shadowBlock.render();
          }

          this.getInput('is_behind').connection.connect(shadowBlock.outputConnection);
        }
      } else if (isBehindExists) {
        this.getInput('is_behind').connection.setShadowState(null);
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
  Blockly.Blocks['plat_clone'].validatorInit = function() {
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

          if (shadowBlock.initSvg) {
            shadowBlock.initSvg();
            shadowBlock.render();
          }

          this.getInput('id').connection.connect(shadowBlock.outputConnection);
        }
        this.moveInputBefore('id', 'volume');
      } else if (inputExists) {
        this.getInput('id').connection.setShadowState(null);
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
        this.getInput('id').connection.setShadowState(null);
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
