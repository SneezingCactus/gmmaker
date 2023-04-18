/* eslint-disable require-jsdoc */
/* eslint-disable no-caller */
/* eslint-disable no-invalid-this */
/* eslint-disable camelcase */
/* eslint-disable new-cap */
import Blockly from 'blockly';
import * as LexicalVariables from '@mit-app-inventor/blockly-block-lexical-variables';

export default function() {
  function createEventBlock(id, varIds, init) {
    Blockly.Blocks[id] = {
      init: init,
      withLexicalVarsAndPrefix: function(_, proc) {
        for (let i = 0; i < varIds.length; i++) {
          const varField = this.getFieldValue(varIds[i]);
          if (varField) proc(varField, this.lexicalVarPrefix);
        }
      },
      getVars: function() {
        const finalList = [];

        for (let i = 0; i < varIds.length; i++) {
          const varField = this.getFieldValue(varIds[i]);
          if (varField) finalList.push(varField);
        }
        return finalList;
      },
      blocksInScope: function() {
        const doBlock = this.getInputTargetBlock('code');
        if (doBlock) {
          return [doBlock];
        } else {
          return [];
        }
      },
      declaredNames: function() {
        const finalList = [];

        for (let i = 0; i < varIds.length; i++) {
          const varField = this.getFieldValue(varIds[i]);
          if (varField) finalList.push(varField);
        }
        return finalList;
      },
      renameVar: function(oldName, newName) {
        for (let i = 0; i < varIds.length; i++) {
          const varField = this.getFieldValue(varIds[i]);
          if (Blockly.Names.equals(oldName, varField)) {
            this.setFieldValue(newName, varIds[i]);
          }
        }
      },
      renameBound: function(boundSubstitution, freeSubstitution) {
      },
      renameFree: function(freeSubstitution) {
      },
      freeVariables: function() { // return the free variables of this block
        const result = LexicalVariable.freeVariables(
            this.getInputTargetBlock('code'));
        // Remove bound index variable from body free vars
        for (let i = 0; i < varIds.length; i++) {
          const varField = this.getFieldValue(varIds[i]);
          if (varField) result.deleteName(varField);
        }
        if (this.nextConnection) {
          const nextBlock = this.nextConnection.targetBlock();
          result.unite(LexicalVariable.freeVariables(nextBlock));
        }
        return result;
      },
    };
  };

  createEventBlock('event_roundstart', ['player_id'], function() {
    this.setStyle('gm_events');
    this.appendDummyInput()
        .appendField('on round start');
    this.appendDummyInput()
        .appendField('run per player?')
        .appendField(new Blockly.FieldCheckbox('TRUE'), 'perplayer');
    this.appendStatementInput('code');

    this.lexicalVarPrefix = 'gm_roundstart';

    if (this.validatorInit) {
      this.validatorInit();
    }
  });

  createEventBlock('event_step', ['player_id'], function() {
    this.setStyle('gm_events');
    this.appendDummyInput()
        .appendField('on game step (30fps)');
    this.appendDummyInput()
        .appendField('run per player?')
        .appendField(new Blockly.FieldCheckbox('TRUE'), 'perplayer');
    this.appendStatementInput('code');

    this.lexicalVarPrefix = 'gm_step';

    if (this.validatorInit) {
      this.validatorInit();
    }
  });

  createEventBlock('event_collision', [
    'a_discid', 'a_arrowid', 'a_platformid', 'a_fixtureid', 'a_normal', 'a_capzone',
    'b_discid', 'b_arrowid', 'b_platformid', 'b_fixtureid', 'b_normal', 'a_capzone',
  ], function() {
    this.setStyle('gm_events');
    this.appendDummyInput()
        .appendField('on collision between')
        .appendField(new Blockly.FieldDropdown([['disc', 'disc'], ['arrow', 'arrow'], ['platform', 'platform']]), 'col_a')
        .appendField('and')
        .appendField(new Blockly.FieldDropdown([['disc', 'disc'], ['arrow', 'arrow'], ['platform', 'platform']]), 'col_b');
    this.appendDummyInput()
        .appendField('store info in variables?')
        .appendField(new Blockly.FieldCheckbox('TRUE'), 'store_info');
    this.appendStatementInput('code');

    this.lexicalVarPrefix = 'gm_collision';

    if (this.validatorInit) {
      this.validatorInit();
    }
  });

  createEventBlock('event_playerdie', ['player_id'], function() {
    this.setStyle('gm_events');
    this.appendDummyInput()
        .appendField('on player die');
    this.appendDummyInput()
        .appendField('store player id in var')
        .appendField(new LexicalVariables.FieldParameterFlydown('id', true,
            LexicalVariables.FieldFlydown.DISPLAY_BELOW), 'player_id');
    this.appendStatementInput('code');

    this.lexicalVarPrefix = 'gm_playerdie';
  });

  // blockly & plugins

  // add back proc allow statement
  // this code is a modification of the code in
  // https://github.com/mit-cml/blockly-plugins/blob/main/block-lexical-variables/src/blocks/procedures.js

  const getChildren = function(element) {
    'use strict';
    // We check if the children attribute is supported for child elements
    // since IE8 misuses the attribute by also including comments.
    if (element.children !== undefined) {
      return element.children;
    }
    // Fall back to manually filtering the element's child nodes.
    return Array.prototype.filter.call(element.childNodes, function(node) {
      return node.nodeType == Blockly.utils.dom.NodeType.ELEMENT_NODE;
    });
  };

  const COMMON_PROC_FUNCTIONS = {
    mutationToDom: function() {
      const container = document.createElement('mutation');
      if (!this.horizontalParameters) {
        container.setAttribute('vertical_parameters', 'true'); // Only store an
        // element for
        // vertical
        // The absence of this attribute means horizontal.
      }
      for (let x = 0; x < this.arguments_.length; x++) {
        const parameter = document.createElement('arg');
        parameter.setAttribute('name', this.arguments_[x]);
        container.appendChild(parameter);
      }

      // Save whether the statement input is visible.
      if (!this.hasStatements_) {
        container.setAttribute('statements', 'false');
      }

      return container;
    },
    domToMutation: function(xmlElement) {
      const params = [];
      const children = getChildren(xmlElement);
      for (let x = 0, childNode; childNode = children[x]; x++) {
        if (childNode.nodeName.toLowerCase() == 'arg') {
          params.push(childNode.getAttribute('name'));
        }
      }
      this.horizontalParameters =
          xmlElement.getAttribute('vertical_parameters') !== 'true';
      this.updateParams_(params);

      // Show or hide the statement input.
      this.setStatements_(xmlElement.getAttribute('statements') !== 'false');
    },
    decompose: function(workspace) {
      const containerBlock = workspace.newBlock('procedures_mutatorcontainer');
      containerBlock.initSvg();
      containerBlock.setProcBlock(this);
      this.paramIds_ = []; // [lyn, 10/26/13] Added
      let connection = containerBlock.getInput('STACK').connection;
      for (let x = 0; x < this.arguments_.length; x++) {
        const paramBlock = workspace.newBlock('procedures_mutatorarg');
        this.paramIds_.push(paramBlock.id); // [lyn, 10/26/13] Added
        paramBlock.initSvg();
        paramBlock.setFieldValue(this.arguments_[x], 'NAME');
        // Store the old location.
        paramBlock.oldLocation = x;
        connection.connect(paramBlock.previousConnection);
        connection = paramBlock.nextConnection;
      }
      Blockly.Procedures.mutateCallers(this);

      if (this.type === 'procedures_defreturn') {
        containerBlock.setFieldValue(this.hasStatements_, 'STATEMENTS');
      } else {
        containerBlock.removeInput('STATEMENT_INPUT');
      }

      return containerBlock;
    },
    compose: function(containerBlock) {
      const params = [];
      this.paramIds_ = [];
      let paramBlock = containerBlock.getInputTargetBlock('STACK');
      while (paramBlock) {
        params.push(paramBlock.getFieldValue('NAME'));
        this.paramIds_.push(paramBlock.id);
        paramBlock = paramBlock.nextConnection &&
            paramBlock.nextConnection.targetBlock();
      }
      if (!LexicalVariables.LexicalVariable.stringListsEqual(params, this.arguments_)) {
        // Only need updates if param list has changed
        this.updateParams_(params);
        Blockly.Procedures.mutateCallers(this);
      }

      // Show/hide the statement input.
      let hasStatements = containerBlock.getFieldValue('STATEMENTS');
      if (hasStatements !== null) {
        hasStatements = hasStatements === 'TRUE';
        if (this.hasStatements_ !== hasStatements) {
          if (hasStatements) {
            this.setStatements_(true);
            // Restore the stack, if one was saved.
            Blockly.Mutator.reconnect(this.statementConnection_, this, 'STACK');
            this.statementConnection_ = null;
          } else {
            // Save the stack, then disconnect it.
            const stackConnection = this.getInput('STACK').connection;
            this.statementConnection_ = stackConnection.targetConnection;
            if (this.statementConnection_) {
              const stackBlock = stackConnection.targetBlock();
              stackBlock.unplug();
              stackBlock.bumpNeighbours();
            }
            this.setStatements_(false);
          }
        }
      }
    },
    setStatements_: function(hasStatements) {
      if (this.hasStatements_ === hasStatements) {
        return;
      }
      if (hasStatements) {
        this.appendStatementInput('STACK').appendField(
            Blockly.Msg['PROCEDURES_DEFNORETURN_DO']);
        if (this.getInput('RETURN')) {
          this.moveInputBefore('STACK', 'RETURN');
        }
      } else {
        this.removeInput('STACK', true);
      }
      this.hasStatements_ = hasStatements;
    },
    updateParams_: function(opt_params) {
      // make rendered block reflect the parameter names currently in
      // this.arguments_
      if (opt_params) {
        this.arguments_ = opt_params;
      }
      // Check for duplicated arguments.
      let badArg = false;
      const hash = {};
      for (let x = 0; x < this.arguments_.length; x++) {
        if (hash['arg_' + this.arguments_[x].toLowerCase()]) {
          badArg = true;
          break;
        }
        hash['arg_' + this.arguments_[x].toLowerCase()] = true;
      }
      if (badArg) {
        this.setWarningText(Blockly.Msg.LANG_PROCEDURES_DEF_DUPLICATE_WARNING);
      } else {
        this.setWarningText(null);
      }

      const procName = this.getFieldValue('NAME');
      // save the first two input lines and the last input line
      // to be re added to the block later

      // Body of procedure
      const stackInput = this.getInput('STACK');
      const returnInput = this.getInput('RETURN');

      // stop rendering until block is recreated
      const savedRendered = this.rendered;
      this.rendered = false;

      // remove first input
      const thisBlock = this; // Grab correct object for use in thunk below
      LexicalVariables.FieldParameterFlydown.withChangeHanderDisabled(
          function() {
            thisBlock.removeInput('HEADER');
          },
      );

      // Remove all existing vertical inputs (we will create new ones if
      // necessary)

      // Only args and body are left
      const oldArgCount = this.inputList.length - 1;
      if (oldArgCount > 0) {
        const paramInput0 = this.getInput('VAR0');
        if (paramInput0) { // Yes, they were vertical
          for (let i = 0; i < oldArgCount; i++) {
            try {
              LexicalVariables.FieldParameterFlydown.withChangeHanderDisabled(
                  function() {
                    thisBlock.removeInput('VAR' + i);
                  },
              );
            } catch (err) {
              console.log(err);
            }
          }
        }
      }

      // empty the inputList then recreate it
      this.inputList = [];

      const headerInput = this.createHeader(procName);
      if (this.horizontalParameters) { // horizontal case
        for (let i = 0; i < this.arguments_.length; i++) {
          headerInput.appendField(' ')
              .appendField(this.parameterFlydown(i), 'VAR' + i);
        }
      } else { // vertical case
        for (let i = 0; i < this.arguments_.length; i++) {
          this.appendDummyInput('VAR' + i)
              .appendField(this.parameterFlydown(i), 'VAR' + i)
              .setAlign(Blockly.ALIGN_RIGHT);
        }
      }

      // put the last two arguments back
      if (stackInput) {
        this.inputList.push(stackInput);
      }
      if (returnInput) this.inputList = this.inputList.concat(returnInput);

      this.rendered = savedRendered;
      for (let i = 0; i < this.inputList.length; i++) {
        this.inputList[i].init();
      }
      if (this.rendered) {
        this.render();
      }
      if (this.workspace.loadCompleted) {
        Blockly.Procedures.mutateCallers(this);
      }
    },
  };

  Blockly.Blocks['procedures_defnoreturn'].init = function() {
    // Let the theme determine the color.
    // this.setColour(Blockly.PROCEDURE_CATEGORY_HUE);
    this.setStyle('procedure_blocks');
    const legalName = Blockly.Procedures.findLegalName(
        Blockly.Msg.LANG_PROCEDURES_DEFNORETURN_PROCEDURE, this);
    this.createHeader(legalName);
    this.horizontalParameters = true; // horizontal by default
    this.appendStatementInput('STACK')
        .appendField(Blockly.Msg.LANG_PROCEDURES_DEFNORETURN_DO);
    this.setMutator(new Blockly.Mutator(['procedures_mutatorarg']));
    this.setTooltip(Blockly.Msg.LANG_PROCEDURES_DEFNORETURN_TOOLTIP);
    // List of declared local variable names; has one
    // ("name") initially
    this.arguments_ = [];
    // Other methods guarantee the invariant that this variable contains
    // the list of names declared in the local declaration block.
    this.warnings = [{name: 'checkEmptySockets', sockets: ['STACK']}];
    this.lexicalVarPrefix = 'input';

    this.hasStatements_ = true;
  },

  Blockly.Blocks['procedures_defnoreturn'] = {
    ...Blockly.Blocks['procedures_defnoreturn'],
    ...COMMON_PROC_FUNCTIONS,
  };

  Blockly.Blocks['procedures_defreturn'] = {
    ...Blockly.Blocks['procedures_defreturn'],
    ...COMMON_PROC_FUNCTIONS,
  };

  Blockly.Blocks['procedures_mutatorcontainer'] = {
    // Procedure container (for mutator dialog).
    init: function() {
      // Let the theme determine the color.
      // this.setColour(Blockly.PROCEDURE_CATEGORY_HUE);
      this.setStyle('procedure_blocks');
      this.appendDummyInput()
          .appendField(Blockly.Msg.LANG_PROCEDURES_MUTATORCONTAINER_TITLE);
      this.appendStatementInput('STACK');
      this.appendDummyInput('STATEMENT_INPUT')
          .appendField(Blockly.Msg['PROCEDURES_ALLOW_STATEMENTS'])
          .appendField(
              Blockly.fieldRegistry.fromJson({
                type: 'field_checkbox',
                checked: true,
              }),
              'STATEMENTS');
      this.setTooltip(Blockly.Msg.LANG_PROCEDURES_MUTATORCONTAINER_TOOLTIP);
      this.contextMenu = false;
      this.mustNotRenameCapturables = true;
    },
    // [lyn. 11/24/12] Set procBlock associated with this container.
    setProcBlock: function(procBlock) {
      this.procBlock_ = procBlock;
    },
    // [lyn. 11/24/12] Set procBlock associated with this container.
    // Invariant: should not be null, since only created as mutator for a
    // particular proc block.
    getProcBlock: function() {
      return this.procBlock_;
    },
    // [lyn. 11/24/12] Return list of param names in this container
    // Invariant: there should be no duplicates!
    declaredNames: function() {
      const paramNames = [];
      let paramBlock = this.getInputTargetBlock('STACK');
      while (paramBlock) {
        paramNames.push(paramBlock.getFieldValue('NAME'));
        paramBlock = paramBlock.nextConnection &&
            paramBlock.nextConnection.targetBlock();
      }
      return paramNames;
    },
  };

  Blockly.Blocks['local_declaration_statement'].updateDeclarationInputs_OLD = Blockly.Blocks['local_declaration_statement'].updateDeclarationInputs_;
  Blockly.Blocks['local_declaration_statement'].updateDeclarationInputs_ = function() {
    this.updateDeclarationInputs_OLD(...arguments);
    if (this.rendered) this.renderEfficiently();
  };

  Blockly.Blocks['procedures_callnoreturn'].setProcedureParametersOLD = Blockly.Blocks['procedures_callnoreturn'].setProcedureParameters;
  Blockly.Blocks['procedures_callnoreturn'].setProcedureParameters = function() {
    this.setProcedureParametersOLD(...arguments);
    if (this.rendered) this.renderEfficiently();
  };
  Blockly.Blocks['procedures_callreturn'].setProcedureParameters = Blockly.Blocks['procedures_callnoreturn'].setProcedureParameters;
}
