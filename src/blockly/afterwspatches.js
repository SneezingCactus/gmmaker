import Blockly from 'blockly';

/**
 * Monkeypatches made after workspace creation.
 */
export default function() {
  const workspace = gm.editor.blocklyWs;

  workspace.toolboxCategoryCallbacks.set('VARIABLE', function(workspace) {
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
  });
}
