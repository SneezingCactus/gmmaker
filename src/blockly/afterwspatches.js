import Blockly from 'blockly';
import {javascriptGenerator} from 'blockly/javascript';
import {FieldLexicalVariable} from '@mit-app-inventor/blockly-block-lexical-variables';

/**
 * Monkeypatches made after workspace creation.
 */
export default function() {
  const workspace = gm.editor.blocklyWs;

  Blockly.Variables.flyoutCategoryBlocks = function(workspace) {
    const variableModelList = workspace.getVariablesOfType('');

    let block;
    let label;

    const xmlList = [];
    if (variableModelList.length > 0) {
      const mostRecentVariable = variableModelList[variableModelList.length - 1];

      label = document.createElement('label');
      label.setAttribute('text', 'WARNING: Groups and variables should not');
      xmlList.push(label);

      label = document.createElement('label');
      label.setAttribute('text', 'share names! If a group and a variable');
      label.setAttribute('web-class', 'gm_blockly_label_2');
      xmlList.push(label);

      label = document.createElement('label');
      label.setAttribute('text', 'have the same name, they will misbehave.');
      label.setAttribute('web-class', 'gm_blockly_label_3');
      xmlList.push(label);

      label = document.createElement('label');
      label.setAttribute('text', 'Global variables');
      label.setAttribute('web-class', 'gm_blockly_label_header');
      xmlList.push(label);

      if (Blockly.Blocks['variables_set']) {
        block = Blockly.utils.xml.createElement('block');
        block.setAttribute('type', 'variables_set');
        block.setAttribute('gap', Blockly.Blocks['math_change'] ? '8' : '24');
        block.appendChild(Blockly.Variables.generateVariableFieldDom(mostRecentVariable));
        xmlList.push(block);
      }
      if (Blockly.Blocks['math_change']) {
        block = Blockly.utils.xml.createElement('block');
        block.setAttribute('type', 'math_change');
        block.setAttribute('gap', Blockly.Blocks['variables_get'] ? '8' : '24');
        block.appendChild(Blockly.Variables.generateVariableFieldDom(mostRecentVariable));
        const value = Blockly.Xml.textToDom(
            '<value name="DELTA">' +
            '<shadow type="math_number">' +
            '<field name="NUM">1</field>' +
            '</shadow>' +
            '</value>');
        block.appendChild(value);
        xmlList.push(block);
      }
      if (Blockly.Blocks['variables_get']) {
        block = Blockly.utils.xml.createElement('block');
        block.setAttribute('type', 'variables_get');
        block.setAttribute('gap', '20');
        block.appendChild(Blockly.Variables.generateVariableFieldDom(mostRecentVariable));
        xmlList.push(block);
      }

      label = document.createElement('label');
      label.setAttribute('text', 'Global grouped variables');
      label.setAttribute('web-class', 'gm_blockly_label_header');
      xmlList.push(label);

      if (Blockly.Blocks['create_variable_group']) {
        block = Blockly.utils.xml.createElement('block');
        block.setAttribute('type', 'create_variable_group');
        block.setAttribute('gap', '8');
        let value = Blockly.Xml.textToDom(
            '<value name="GROUP">' +
            '<shadow type="text">' +
            '<field name="TEXT">foo</field>' +
            '</shadow>' +
            '</value>');
        block.appendChild(value);
        xmlList.push(block);

        block = Blockly.utils.xml.createElement('block');
        block.setAttribute('type', 'create_variable_group');
        block.setAttribute('gap', '8');
        value = Blockly.Xml.textToDom(
            '<value name="GROUP">' +
            '<shadow type="math_number">' +
            '<field name="NUM">0</field>' +
            '</shadow>' +
            '</value>');
        block.appendChild(value);
        xmlList.push(block);
      }
      if (Blockly.Blocks['grouped_variable_set']) {
        block = Blockly.utils.xml.createElement('block');
        block.setAttribute('type', 'grouped_variable_set');
        block.setAttribute('gap', '8');
        const value = Blockly.Xml.textToDom(
            '<value name="GROUP">' +
            '<shadow type="text">' +
            '<field name="TEXT">foo</field>' +
            '</shadow>' +
            '</value>');
        block.appendChild(value);
        block.appendChild(Blockly.Variables.generateVariableFieldDom(mostRecentVariable));
        xmlList.push(block);
      }
      if (Blockly.Blocks['grouped_variable_change']) {
        block = Blockly.utils.xml.createElement('block');
        block.setAttribute('type', 'grouped_variable_change');
        block.setAttribute('gap', '8');
        let value = Blockly.Xml.textToDom(
            '<value name="GROUP">' +
            '<shadow type="text">' +
            '<field name="TEXT">foo</field>' +
            '</shadow>' +
            '</value>');
        block.appendChild(value);
        value = Blockly.Xml.textToDom(
            '<value name="DELTA">' +
            '<shadow type="math_number">' +
            '<field name="NUM">1</field>' +
            '</shadow>' +
            '</value>');
        block.appendChild(value);
        block.appendChild(Blockly.Variables.generateVariableFieldDom(mostRecentVariable));
        xmlList.push(block);
      }
      if (Blockly.Blocks['grouped_variable_get']) {
        block = Blockly.utils.xml.createElement('block');
        block.setAttribute('type', 'grouped_variable_get');
        block.setAttribute('gap', '20');
        const value = Blockly.Xml.textToDom(
            '<value name="GROUP">' +
            '<shadow type="text">' +
            '<field name="TEXT">foo</field>' +
            '</shadow>' +
            '</value>');
        block.appendChild(value);
        block.appendChild(Blockly.Variables.generateVariableFieldDom(mostRecentVariable));
        xmlList.push(block);
      }
    }

    label = document.createElement('label');
    label.setAttribute('text', 'Local variables');
    label.setAttribute('web-class', 'gm_blockly_label_header');
    xmlList.push(label);

    if (Blockly.Blocks['local_declaration_statement']) {
      block = Blockly.utils.xml.createElement('block');
      block.setAttribute('type', 'local_declaration_statement');
      block.setAttribute('gap', '8');
      block.appendChild(Blockly.Xml.textToDom('<field name="VAR0">foo</field>'));
      xmlList.push(block);
    }
    return xmlList;
  };

  workspace.toolboxCategoryCallbacks.set('VARIABLE', function(workspace) {
    let xmlList = [];
    const button = document.createElement('button');
    button.setAttribute('text', 'Create global variable');
    button.setAttribute('callbackKey', 'CREATE_VARIABLE');

    workspace.registerButtonCallback('CREATE_VARIABLE', function(button) {
      Blockly.Variables.createVariableButtonHandler(button.getTargetWorkspace());
    });

    xmlList.push(button);

    const removeUnusedButton = document.createElement('button');
    removeUnusedButton.setAttribute('text', 'Delete unused global variables');
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
  });

  FieldLexicalVariable.nameNotInOLD = FieldLexicalVariable.nameNotIn;
  FieldLexicalVariable.nameNotIn = function(name, list) {
    const reservedWords = javascriptGenerator.nameDB_?.reservedWords;

    if (reservedWords) {
      return FieldLexicalVariable.nameNotInOLD(name, [...list, ...reservedWords]);
    } else {
      return FieldLexicalVariable.nameNotInOLD(name, list);
    }
  };
}
