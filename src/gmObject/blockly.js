/* eslint-disable no-invalid-this */
/* eslint-disable camelcase */
/* eslint-disable new-cap */
import Blockly from 'blockly';
import toolbox from '../blockly/toolbox.xml';
import windowHtml from '../gmWindow/window.html';
import blockDefs from '../blockly/blockdefs.js';
import defineBlockCode from '../blockly/blockfuncs.js';
import defineBlockValidators from '../blockly/blockvalidators.js';
import {saveAs} from 'file-saver';

export default {
  init: function() {
    this.blockDefs = blockDefs;
    this.initGMEditor();
  },
  initGMEditor: function() {
    // create the gm editor div
    const GMEditorWindow = document.createElement('div');
    document.getElementById('newbonkgamecontainer').appendChild(GMEditorWindow);
    GMEditorWindow.outerHTML = windowHtml;

    // set button functions
    document.getElementById('gmeditor_newbutton').addEventListener('click', gm.blockly.GMENew);
    document.getElementById('gmeditor_importbutton').addEventListener('click', gm.blockly.GMEImport);
    document.getElementById('gmeditor_exportbutton').addEventListener('click', gm.blockly.GMEExportShow);
    document.getElementById('gmeditor_backupsbutton').addEventListener('click', gm.blockly.GMEBackupsShow);
    document.getElementById('gmeditor_settingsbutton').addEventListener('click', gm.blockly.GMESettingsShow);
    document.getElementById('gmeditor_savebutton').addEventListener('click', gm.blockly.GMESave);
    document.getElementById('gmeditor_closebutton').addEventListener('click', gm.blockly.hideGMEWindow);

    document.getElementById('gmsettings_cancel').addEventListener('click', gm.blockly.GMESettingsCancel);
    document.getElementById('gmsettings_save').addEventListener('click', gm.blockly.GMESettingsSave);

    document.getElementById('gmexport_cancel').addEventListener('click', gm.blockly.GMEExportCancel);
    document.getElementById('gmexport_ok').addEventListener('click', gm.blockly.GMEExportSave);

    document.getElementById('gmbackups_cancel').addEventListener('click', gm.blockly.GMEBackupsCancel);
    document.getElementById('gmbackups_load').addEventListener('click', gm.blockly.GMEBackupsLoad);

    document.getElementById('gmimportdialog_cancel').addEventListener('click', gm.blockly.GMEImportMapCancel);
    document.getElementById('gmimportdialog_no').addEventListener('click', gm.blockly.GMEImportMapNo);
    document.getElementById('gmimportdialog_yes').addEventListener('click', gm.blockly.GMEImportMapYes);

    // create the button that opens the game mode editor
    const GMOpenButton = document.createElement('div');
    GMOpenButton.id = 'gmeditor_openbutton';
    GMOpenButton.className = 'newbonklobby_settings_button brownButton brownButton_classic buttonShadow';
    GMOpenButton.addEventListener('click', gm.blockly.showGMEWindow);

    // ensure compatibility with bonk-host
    if (window.createModeDropdown) {
      window.createModeDropdown_OLD = window.createModeDropdown;
      window.createModeDropdown = function() {
        window.createModeDropdown_OLD();
        GMOpenButton.className += ' gm_withbonkhost';
        document.getElementById('newbonklobby_settingsbox').appendChild(GMOpenButton);
        window.BonkUtils.setButtonSounds([GMOpenButton]);
      };
    } else {
      document.getElementById('newbonklobby_settingsbox').appendChild(GMOpenButton);
      window.BonkUtils.setButtonSounds([GMOpenButton]);
    }

    // adding button sounds
    const buttons = [
      'gmeditor_newbutton', 'gmeditor_importbutton', 'gmeditor_exportbutton', 'gmeditor_savebutton', 'gmeditor_closebutton', 'gmeditor_settingsbutton', 'gmeditor_backupsbutton',
      'gmexport_cancel', 'gmexport_ok',
      'gmimportdialog_cancel', 'gmimportdialog_no', 'gmimportdialog_yes',
      'gmsettings_cancel', 'gmsettings_save',
      'gmbackups_cancel', 'gmbackups_load',
    ];

    for (let i = 0; i < buttons.length; i++) {
      window.BonkUtils.setButtonSounds([document.getElementById(buttons[i])]);
    }

    // add modes to base mode setting
    const baseModeSelect = document.getElementById('gmsettings_basemode');
    for (const mode of window.ModeList.lobbyModes) {
      if (mode === 'f' || mode === 'p') continue;

      const option = document.createElement('option');
      option.value = mode;
      option.innerText = window.ModeList.modes[mode].lobbyName;

      baseModeSelect.appendChild(option);
    }

    // create var inspector
    this.varInspectorContainer = document.createElement('div');
    this.varInspectorContainer.id = 'gm_varinspector';

    const varInspTopBar = document.createElement('div');
    varInspTopBar.className = 'windowTopBar windowTopBar_classic';
    varInspTopBar.innerText = 'Variable Inspector';
    this.varInspectorContainer.appendChild(varInspTopBar);

    this.varInspector = document.createElement('div');
    this.varInspector.id = 'gmvi_content';
    this.varInspectorContainer.appendChild(this.varInspector);

    document.getElementById('pagecontainer').appendChild(this.varInspectorContainer);

    this.makeDraggable(this.varInspectorContainer, varInspTopBar);

    // add block defs into blockly
    for (let i = 0; i !== this.blockDefs.length; i++) {
      Blockly.Blocks[this.blockDefs[i].type] = {};
    }

    defineBlockValidators();

    for (let i = 0; i !== this.blockDefs.length; i++) {
      Blockly.Blocks[this.blockDefs[i].type].init = function() {
        this.jsonInit(gm.blockly.blockDefs[i]);

        if (this.validatorInit) {
          this.validatorInit();
        }
      };
    }

    defineBlockCode();

    // eslint-disable-next-line guard-for-in
    for (const block in Blockly.Blocks) {
      Blockly.Blocks[block].init = (function() {
        const init_OLD = Blockly.Blocks[block].init;

        return function() {
          init_OLD.apply(this, arguments);

          if (!this.type.startsWith('on_') && !this.type.startsWith('procedures_def')) {
            const onChange_OLD = this.onchange;

            this.setOnChange(function() {
              if (onChange_OLD) onChange_OLD.apply(this, arguments);

              if (this.parentBlock_ || this.isInMutator || this.isInFlyout) {
                this.setWarningText(null);
              } else {
                this.setWarningText('The block must be inside an event block (one of the\nblocks in the Bonk Events category), or inside a function definition.');
              }
            });
          }
        };
      })();
    }

    const blocklyToolbox = document.createElement('xml');
    document.head.appendChild(blocklyToolbox);
    blocklyToolbox.outerHTML = toolbox;

    // create gmmaker theme
    gm.blockly.theme = Blockly.Theme.defineTheme('gmmaker', {
      'base': Blockly.Themes.Classic,
      'fontStyle': {
        'family': 'futurept_b1',
        'size': 12,
      },
    }),

    // create blockly workspace
    gm.blockly.workspace = Blockly.inject('gmblocklydiv', {
      toolbox: document.getElementById('toolbox'),
      zoom: {
        controls: true,
        wheel: true,
        startScale: 1.0,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.2,
        pinch: true,
      },
      theme: gm.blockly.theme,
    });

    // add loop trap
    Blockly.JavaScript.INFINITE_LOOP_TRAP = 'if (++loopIterations > 10000000) throw \'gmInfiniteLoop\';';

    window.addEventListener('resize', () => {
      setTimeout(() => Blockly.svgResize(gm.blockly.workspace), 500);
    }, false);

    this.hideGMEWindow();

    gm.blockly.savedXml = document.createElement('xml');

    // sets up DB for mode backups
    //  "hey can i copy your code"
    //  "sure but change some stuff so nobody notices"
    //  (yes kklkkj totally said that)
    const dbOpenRequest = window.indexedDB.open('gmmakerStorage', 1);
    let db;

    dbOpenRequest.onsuccess = () => {
      db = dbOpenRequest.result;
      db.transaction('backups');
      const transaction = db.transaction('backups');
      const getRequest = transaction.objectStore('backups').get(1);
      getRequest.onsuccess = () => {
        gm.blockly.modeBackups = getRequest.result;
      };
      getRequest.onerror = (event) => {
        console.error(event);
        alert('[Game Mode Maker] Unable to get mode backups from database.');
      };
    };
    dbOpenRequest.onerror = (event) => {
      console.error(event);
      alert('[Game Mode Maker] Unable to open database. No mode backups will show up, and no new backups will be created.');
    };
    dbOpenRequest.onupgradeneeded = (event) => {
      const db = event.target.result;
      const b = db.createObjectStore('backups');
      b.put([], 1);
    };

    gm.blockly.workspace.addChangeListener(function() {
      if (!gm.blockly.canBackup) return;
      if (!db) return;

      gm.blockly.canBackup = false;
      setTimeout(function() {
        gm.blockly.canBackup = true;
      }, 30000);

      if (gm.blockly.modeBackups.length > 5) {
        gm.blockly.modeBackups.pop();
      }

      const xml = Blockly.Xml.workspaceToDom(gm.blockly.workspace, true);

      const settingsObj = Blockly.utils.xml.createElement('gmsettings');
      settingsObj.setAttribute('mode_name', gm.blockly.modeName || 'Custom');
      settingsObj.setAttribute('mode_description', gm.blockly.modeDescription || 'Change your mode\'s description on the Game Mode Editor\'s Settings menu (gear icon).');
      settingsObj.setAttribute('show_var_insp', gm.blockly.showVarInspector) || false;
      settingsObj.setAttribute('base_mode', gm.blockly.baseMode || 'any');

      xml.appendChild(settingsObj);

      gm.blockly.modeBackups.unshift({
        xml: xml.innerHTML,
        timeStamp: Date.now(),
      });

      const transaction = db.transaction('backups', 'readwrite');
      transaction.objectStore('backups').put(gm.blockly.modeBackups, 1);
      db.onerror = console.error;
    });

    window.Blockly = Blockly;
  },
  makeDraggable: function(elmnt, dragBar) {
    // code from https://www.w3schools.com/howto/howto_js_draggable.asp
    // with some modifications

    let pos1 = 0; let pos2 = 0; let pos3 = 0; let pos4 = 0;
    if (dragBar) {
      // if present, the header is where you move the DIV from:
      dragBar.onmousedown = dragMouseDown;
    } else {
      // otherwise, move the DIV from anywhere inside the DIV:
      elmnt.onmousedown = dragMouseDown;
    }

    // eslint-disable-next-line require-jsdoc
    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }

    // eslint-disable-next-line require-jsdoc
    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      elmnt.style.top = (elmnt.offsetTop - pos2) + 'px';
      elmnt.style.left = (elmnt.offsetLeft - pos1) + 'px';
    }

    // eslint-disable-next-line require-jsdoc
    function closeDragElement() {
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
    }
  },
  blockDefs: null,
  workspace: null,
  xmlToImport: null,
  xmlDict: ['block', 'mutation', 'field', 'variable', 'variables', 'bonkmap', 'statement', 'shadow', 'value', 'name', 'type', 'next', 'playerid_input', 'show_dropdown'],
  savedXml: null,
  modeBackups: [],
  canBackup: true,
  compressXml: function(xml) {
    for (let i = 0; i < this.xmlDict.length; i++) {
      xml = xml.replace(new RegExp(`<(\/|)${this.xmlDict[i]}([ >])`, 'g'), `<$1${i}$2`);
      xml = xml.replace(new RegExp(` ${this.xmlDict[i]}="`, 'g'), ` ${i}="`);
    }
    return xml;
  },
  decompressXml: function(xml) {
    for (let i = 0; i < this.xmlDict.length; i++) {
      xml = xml.replace(new RegExp(`<(\/|)${i}([ >])`, 'g'), `<$1${this.xmlDict[i]}$2`);
      xml = xml.replace(new RegExp(` ${i}="`, 'g'), ` ${this.xmlDict[i]}="`);
    }
    return xml;
  },
  modeName: null,
  modeDescription: null,
  showVarInspector: false,
  varInspector: null,
  createVarInspTab: function(id, name) {
    if (!this.varInspector) return;

    const tabHeaderElement = document.createElement('div');
    tabHeaderElement.id = `gmvi_tab_header_${id}`;
    tabHeaderElement.className = 'mapeditor_table_heading_div';

    const tabNameElement = document.createElement('div');
    tabNameElement.id = `gmvi_tab_name_${id}`;
    tabNameElement.className = 'mapeditor_rightbox_heading';
    tabNameElement.innerText = name;
    tabHeaderElement.appendChild(tabNameElement);

    const tabSignElement = document.createElement('div');
    tabSignElement.id = `gmvi_tab_sign_${id}`;
    tabSignElement.className = 'mapeditor_rightbox_heading_pm';
    tabSignElement.innerText = '+';
    tabHeaderElement.appendChild(tabSignElement);

    const tabContentElement = document.createElement('div');
    tabContentElement.id = `gmvi_tab_content_${id}`;
    tabContentElement.className = 'gmvi_tab_content';
    tabContentElement.style.display = 'none';

    tabHeaderElement.addEventListener('click', function() {
      if (tabContentElement.style.display == 'none') {
        tabContentElement.style.display = 'flex';
        tabSignElement.textContent = '-';
      } else {
        tabContentElement.style.display = 'none';
        tabSignElement.textContent = '+';
      }
    });

    this.varInspector.appendChild(tabHeaderElement);
    this.varInspector.appendChild(tabContentElement);
  },
  updateVarInspector: function(gameState) {
    const vars = gameState.physics.bodies[0]?.cf.variables;

    // create global tab and players' tabs if they don't exist already
    if (!document.getElementById('gmvi_tab_header_global')) {
      this.createVarInspTab('global', 'Global');
    }

    for (let i = 0; i < gameState.discs.length; i++) {
      if (!gameState.discs[i]) continue;
      if (!gm.graphics.rendererClass.playerArray[i]) continue;
      if (document.getElementById(`gmvi_tab_header_${i}`)) continue;

      this.createVarInspTab(i, `${gm.graphics.rendererClass.playerArray[i].userName || 'Unknown'} (id ${i})`);
    }

    if (!vars) return;

    // eslint-disable-next-line guard-for-in
    for (const key in vars) {
      if (!document.getElementById(`gmvi_tab_header_${key}`)) continue;

      // eslint-disable-next-line guard-for-in
      for (const varName in vars[key]) {
        let varElement = document.getElementById(`gmvi_vars_${key}_${varName}`);

        if (!varElement) {
          const varContainer = document.createElement('div');
          varContainer.className = 'gmvi_var';

          const varNameElement = document.createElement('div');
          varNameElement.innerText = varName;
          varContainer.appendChild(varNameElement);

          varElement = document.createElement('div');
          varElement.id = `gmvi_vars_${key}_${varName}`;
          varContainer.appendChild(varElement);

          document.getElementById(`gmvi_tab_content_${key}`).appendChild(varContainer);
        }

        const varJSON = JSON.stringify(vars[key][varName]);

        // replace all shape elements with {Shape} to not clutter the var inspector
        varElement.innerText = varJSON.includes('{') ? varJSON.replace(/{([^{]+{[^}]+}){2}}/g, '{Shape}') : varJSON;
      }
    }
  },
  GMENew: function() {
    const confirmed = confirm('Are you sure you want to delete all blocks and reset mode settings?');

    if (confirmed) {
      gm.blockly.workspace.clear();

      gm.blockly.modeName = 'Custom';
      gm.blockly.modeDescription = 'Change your mode\'s description on the Game Mode Editor\'s Settings menu (gear icon).';
      gm.blockly.showVarInspector = false;
      gm.blockly.baseMode = 'any';
    }
  },
  GMEImport: function() {
    const input = document.createElement('input');
    input.type = 'file';

    input.onchange = (e) => {
      const file = e.target.files[0];

      const reader = new FileReader();
      reader.readAsText(file, 'UTF-8');

      reader.onload = (readerEvent) => {
        let content = readerEvent.target.result;

        if (content.startsWith('!!!COMPRESSED!!!')) {
          content = content.replace('!!!COMPRESSED!!!', '');
          content = gm.blockly.decompressXml(content);
        }

        const xml = document.createElement('xml');
        xml.innerHTML = content;

        const gmSettings = xml?.getElementsByTagName('gmsettings')[0];

        gm.blockly.modeName = gmSettings?.getAttribute('mode_name') || 'Custom';
        gm.blockly.modeDescription = gmSettings?.getAttribute('mode_description') || 'Change your mode\'s description on the Game Mode Editor\'s Settings menu (gear icon).';
        gm.blockly.showVarInspector = gmSettings?.getAttribute('show_var_insp') === 'true' || false;
        gm.blockly.baseMode = gmSettings?.getAttribute('base_mode') || 'any';

        document.getElementById('gmexport_name').value = file.name.slice(0, -4);

        if (gm.lobby.networkEngine.getLSID() == gm.lobby.networkEngine.hostID && xml.getElementsByTagName('bonkmap')[0]) {
          gm.blockly.xmlToImport = xml;
          document.getElementById('gm_importdialogwindowcontainer').style.visibility = 'visible';
        } else {
          gm.blockly.workspace.clear();
          Blockly.Xml.domToWorkspace(xml, gm.blockly.workspace);
        }
      };
    };

    input.click();
  },
  GMEImportMapCancel: function() {
    document.getElementById('gm_importdialogwindowcontainer').style.visibility = 'hidden';
  },
  GMEImportMapNo: function() {
    gm.blockly.workspace.clear();
    Blockly.Xml.domToWorkspace(gm.blockly.xmlToImport, gm.blockly.workspace);

    document.getElementById('gm_importdialogwindowcontainer').style.visibility = 'hidden';
  },
  GMEImportMapYes: function() {
    const gameSettings = gm.lobby.mpSession.getGameSettings();

    gameSettings.map = MapEncoder.decodeFromDatabase(gm.blockly.xmlToImport.getElementsByTagName('bonkmap')[0].innerHTML);

    gm.lobby.bonkLobby.updateGameSettings(gameSettings);
    gm.lobby.networkEngine.sendMapAdd(gameSettings.map);

    gm.blockly.workspace.clear();
    Blockly.Xml.domToWorkspace(gm.blockly.xmlToImport, gm.blockly.workspace);

    document.getElementById('gm_importdialogwindowcontainer').style.visibility = 'hidden';
  },
  GMEExportShow: function() {
    document.getElementById('gm_exportwindowcontainer').style.visibility = 'visible';
    document.getElementById('gmexport_name').focus();
  },
  GMEExportCancel: function() {
    document.getElementById('gm_exportwindowcontainer').style.visibility = 'hidden';
  },
  GMEExportSave: function() {
    const filename = document.getElementById('gmexport_name').value;
    const attachMap = document.getElementById('gmexport_attachmap').checked;

    const xml = Blockly.Xml.workspaceToDom(gm.blockly.workspace, true);

    const settingsObj = Blockly.utils.xml.createElement('gmsettings');
    settingsObj.setAttribute('mode_name', gm.blockly.modeName || 'Custom');
    settingsObj.setAttribute('mode_description', gm.blockly.modeDescription || 'Change your mode\'s description on the Game Mode Editor\'s Settings menu (gear icon).');
    settingsObj.setAttribute('show_var_insp', gm.blockly.showVarInspector) || false;
    settingsObj.setAttribute('base_mode', gm.blockly.baseMode || 'any');

    xml.appendChild(settingsObj);

    if (attachMap) {
      xml.appendChild(Blockly.Xml.textToDom('<bonkmap>' + MapEncoder.encodeToDatabase(gm.lobby.mpSession.getGameSettings().map) + '</bonkmap>'));
    }

    const blob = new Blob(['!!!COMPRESSED!!!' + gm.blockly.compressXml(xml.innerHTML)], {type: 'text/plain;charset=utf-8'});
    saveAs(blob, `${filename}.xml`);
    document.getElementById('gm_exportwindowcontainer').style.visibility = 'hidden';
  },
  GMEBackupsShow: function() {
    document.getElementById('gm_backupswindowcontainer').style.visibility = 'visible';

    const backupSelect = document.getElementById('gmbackups_backupselect');
    backupSelect.innerHTML = '';
    backupSelect.value = '';

    for (let i = 0; i < gm.blockly.modeBackups.length; i++) {
      const option = document.createElement('option');
      option.value = i;
      option.innerText = new Date(gm.blockly.modeBackups[i].timeStamp).toLocaleString();

      backupSelect.appendChild(option);
    }
  },
  GMEBackupsCancel: function() {
    document.getElementById('gm_backupswindowcontainer').style.visibility = 'hidden';
  },
  GMEBackupsLoad: function() {
    document.getElementById('gm_backupswindowcontainer').style.visibility = 'hidden';

    const backup = gm.blockly.modeBackups[document.getElementById('gmbackups_backupselect').value].xml;
    if (!backup) return;

    const xml = document.createElement('xml');
    xml.innerHTML = backup;

    const gmSettings = xml?.getElementsByTagName('gmsettings')[0];

    gm.blockly.modeName = gmSettings?.getAttribute('mode_name') || 'Custom';
    gm.blockly.modeDescription = gmSettings?.getAttribute('mode_description') || 'Change your mode\'s description on the Game Mode Editor\'s Settings menu (gear icon).';
    gm.blockly.showVarInspector = gmSettings?.getAttribute('show_var_insp') === 'true' || false;
    gm.blockly.baseMode = gmSettings?.getAttribute('base_mode') || 'any';

    gm.blockly.workspace.clear();
    Blockly.Xml.domToWorkspace(xml, gm.blockly.workspace);
  },
  GMESettingsShow: function() {
    document.getElementById('gm_settingswindowcontainer').style.visibility = 'visible';

    document.getElementById('gmsettings_modename').value = gm.blockly.modeName;
    document.getElementById('gmsettings_modedescription').value = gm.blockly.modeDescription;
    document.getElementById('gmsettings_showvarinsp').checked = gm.blockly.showVarInspector;
    document.getElementById('gmsettings_basemode').value = gm.blockly.baseMode;
  },
  GMESettingsCancel: function() {
    document.getElementById('gm_settingswindowcontainer').style.visibility = 'hidden';
  },
  GMESettingsSave: function() {
    gm.blockly.modeName = document.getElementById('gmsettings_modename').value.substring(0, 12);
    gm.blockly.modeDescription = document.getElementById('gmsettings_modedescription').value.substring(0, 500);
    gm.blockly.showVarInspector = document.getElementById('gmsettings_showvarinsp').checked;
    gm.blockly.baseMode = document.getElementById('gmsettings_basemode').value;

    document.getElementById('gm_settingswindowcontainer').style.visibility = 'hidden';
  },
  GMESave: function() {
    if (gm.lobby.networkEngine.getLSID() == gm.lobby.networkEngine.hostID) {
      gm.blockly.resetAll();

      try {
        eval(gm.blockly.generateCode());
      } catch (e) {
        alert(`An error ocurred while trying to save. Please send SneezingCactus a full screenshot of the console (Ctrl+Shift+I, go to the Console tab) so this error can be diagnosed.`);
        throw (e);
      }
      const xml = Blockly.Xml.workspaceToDom(gm.blockly.workspace, true);

      const settingsObj = Blockly.utils.xml.createElement('gmsettings');
      settingsObj.setAttribute('mode_name', gm.blockly.modeName);
      settingsObj.setAttribute('mode_description', gm.blockly.modeDescription);
      settingsObj.setAttribute('show_var_insp', gm.blockly.showVarInspector);
      settingsObj.setAttribute('base_mode', gm.blockly.baseMode);

      xml.appendChild(settingsObj);

      gm.blockly.savedXml = xml;
      gm.blockly.savedSettings = xml?.getElementsByTagName('gmsettings')[0];
      const compressedXml = gm.blockly.compressXml(xml.innerHTML);
      gm.lobby.socket.emit(23, {'m': `!!!GMMODE!!!${compressedXml}`});
      gm.lobby.mpSession.getGameSettings().GMMode = compressedXml;

      if (gm.blockly.baseMode && gm.blockly.baseMode !== 'any') {
        gm.lobby.networkEngine.sendGAMO('b', gm.blockly.baseMode);
        gm.lobby.mpSession.getGameSettings().ga = 'b';
        gm.lobby.mpSession.getGameSettings().mo = gm.blockly.baseMode;
      }

      gm.lobby.bonkLobby.updateGameSettings();
      gm.blockly.hideGMEWindow();
    }
  },
  showGMEWindow: function() {
    document.getElementById('gmeditor').style.transform = 'scale(1)';
    gm.blockly.workspace.setVisible(true);
    Blockly.svgResize(gm.blockly.workspace);

    const gmSettings = gm.blockly.savedXml?.getElementsByTagName('gmsettings')[0];

    gm.blockly.modeName = gmSettings?.getAttribute('mode_name') || 'Custom';
    gm.blockly.modeDescription = gmSettings?.getAttribute('mode_description') || 'Change your mode\'s description on the Game Mode Editor\'s Settings menu (gear icon).';
    gm.blockly.showVarInspector = gmSettings?.getAttribute('show_var_insp') === 'true' || false;
    gm.blockly.baseMode = gmSettings?.getAttribute('base_mode') || 'any';
  },
  hideGMEWindow: function() {
    gm.blockly.workspace.setVisible(false);
    document.getElementById('gmeditor').style.transform = 'scale(0)';
  },
  generateCode: function() {
    const topBlocks = gm.blockly.workspace.getTopBlocks();
    let code = '';

    Blockly.JavaScript.init(gm.blockly.workspace);

    for (let i = 0; i != topBlocks.length; i++) {
      if (!topBlocks[i].type.startsWith('on_') && !topBlocks[i].type.startsWith('procedures_def')) continue;

      code += Blockly.JavaScript.blockToCode(topBlocks[i]) + '\n';
    }

    code = Blockly.JavaScript.finish(code);

    if (code.startsWith('var ')) {
      code = code.replace(/var (.+);/, '');
    }

    return code;
  },
  vars: [],
  funcs: {
    createCircle: function(discID, xpos, ypos, radius, color, alpha, anchored, onlyPlayer, noCameraMove) {
      if (onlyPlayer && gm.lobby.networkEngine.getLSID() !== discID) return;

      let graphics;

      if (anchored) {
        graphics = gm.graphics.additionalDiscGraphics[discID];
      } else if (noCameraMove) {
        graphics = gm.graphics.additionalScreenGraphics[discID];
      } else {
        graphics = gm.graphics.additionalWorldGraphics[discID];
      }

      if (!graphics || graphics._destroyed) return;

      xpos = gm.blockly.funcs.getScreenPos(xpos);
      ypos = gm.blockly.funcs.getScreenPos(ypos);
      radius = gm.blockly.funcs.getScreenPos(radius);

      if (xpos > 99999 || ypos > 99999 || radius > 99999) return;

      if (typeof color === 'string') color = '0x' + color.slice(1);

      graphics.lineStyle(0, 0, 0);
      graphics.beginFill(color, alpha / 100);
      graphics.drawCircle(xpos, ypos, radius);
      graphics.endFill();
    },
    createRect: function(discID, xpos, ypos, width, height, angle, color, alpha, anchored, onlyPlayer, noCameraMove) {
      if (onlyPlayer && gm.lobby.networkEngine.getLSID() !== discID) return;

      let graphics;

      if (anchored) {
        graphics = gm.graphics.additionalDiscGraphics[discID];
      } else if (noCameraMove) {
        graphics = gm.graphics.additionalScreenGraphics[discID];
      } else {
        graphics = gm.graphics.additionalWorldGraphics[discID];
      }

      if (!graphics || graphics._destroyed) return;

      xpos = gm.blockly.funcs.getScreenPos(xpos);
      ypos = gm.blockly.funcs.getScreenPos(ypos);
      width = gm.blockly.funcs.getScreenPos(width) / 2;
      height = gm.blockly.funcs.getScreenPos(height) / 2;

      if (xpos > 99999 || ypos > 99999 || width > 99999 || height > 99999) return;

      if (typeof color === 'string') color = '0x' + color.slice(1);

      graphics.lineStyle(0, 0, 0);
      graphics.beginFill(color, alpha / 100);

      const pointArray = [];
      pointArray.push(new PIXI.Point(width, -height));
      pointArray.push(new PIXI.Point(width, height));
      pointArray.push(new PIXI.Point(-width, height));
      pointArray.push(new PIXI.Point(-width, -height));
      for (let i = 0; i < pointArray.length; i++) {
        const oldVec = [pointArray[i].x, pointArray[i].y];
        pointArray[i].x = oldVec[0] * SafeTrig.safeCos(angle * (Math.PI/180)) - oldVec[1] * SafeTrig.safeSin(angle * (Math.PI/180));
        pointArray[i].y = oldVec[0] * SafeTrig.safeSin(angle * (Math.PI/180)) + oldVec[1] * SafeTrig.safeCos(angle * (Math.PI/180));
        pointArray[i].x += xpos;
        pointArray[i].y += ypos;
      }

      graphics.drawPolygon(pointArray);
      graphics.endFill();
    },
    createLine: function(discID, xpos1, ypos1, xpos2, ypos2, color, alpha, width, anchored, onlyPlayer, noCameraMove) {
      if (onlyPlayer && gm.lobby.networkEngine.getLSID() !== discID) return;

      let graphics;

      if (anchored) {
        graphics = gm.graphics.additionalDiscGraphics[discID];
      } else if (noCameraMove) {
        graphics = gm.graphics.additionalScreenGraphics[discID];
      } else {
        graphics = gm.graphics.additionalWorldGraphics[discID];
      }

      if (!graphics || graphics._destroyed) return;

      xpos1 = gm.blockly.funcs.getScreenPos(xpos1);
      ypos1 = gm.blockly.funcs.getScreenPos(ypos1);
      xpos2 = gm.blockly.funcs.getScreenPos(xpos2);
      ypos2 = gm.blockly.funcs.getScreenPos(ypos2);
      width = gm.blockly.funcs.getScreenPos(width);

      if (xpos1 > 99999 || ypos1 > 99999 || xpos2 > 99999 || ypos2 > 99999 || width > 99999) return;

      if (typeof color === 'string') color = '0x' + color.slice(1);

      graphics.lineStyle(width, color, alpha / 100);
      graphics.moveTo(xpos1, ypos1);
      graphics.lineTo(xpos2, ypos2);
    },
    createPoly: function(discID, vertexes, color, alpha = 100, anchored, onlyPlayer, noCameraMove) {
      if (onlyPlayer && gm.lobby.networkEngine.getLSID() !== discID) return;

      let graphics;

      if (anchored) {
        graphics = gm.graphics.additionalDiscGraphics[discID];
      } else if (noCameraMove) {
        graphics = gm.graphics.additionalScreenGraphics[discID];
      } else {
        graphics = gm.graphics.additionalWorldGraphics[discID];
      }

      if (!graphics || graphics._destroyed) return;

      if (typeof color === 'string') color = '0x' + color.slice(1);

      for (let i = 0; i < vertexes.length; i ++) {
        vertexes[i] = gm.blockly.funcs.getScreenPos(typeof vertexes[i] === 'number' ? vertexes[i] : 0);

        if (vertexes[i] > 99999) return;
      }

      graphics.lineStyle(0, 0, 0);
      graphics.beginFill(color, alpha / 100);
      graphics.drawPolygon(vertexes);
      graphics.endFill();
    },
    createText: function(discID, xpos, ypos, color, alpha, str, size, centered, anchored, onlyPlayer, noCameraMove) {
      if (onlyPlayer && gm.lobby.networkEngine.getLSID() !== discID) return;

      let graphics;

      if (anchored) {
        graphics = gm.graphics.additionalDiscGraphics[discID];
      } else if (noCameraMove) {
        graphics = gm.graphics.additionalScreenGraphics[discID];
      } else {
        graphics = gm.graphics.additionalWorldGraphics[discID];
      }

      if (!graphics || graphics._destroyed) return;

      if (xpos > 99999 || ypos > 99999 || size > 99999) return;

      if (typeof color === 'string') color = '0x' + color.slice(1);

      if (gm.graphics.availableText.length > 0) {
        const reusedText = gm.graphics.availableText.pop();

        gm.graphics.usedText.push(reusedText);
        graphics.addChild(reusedText);

        reusedText.resolution = 2;
        reusedText.x = gm.blockly.funcs.getScreenPos(xpos);
        reusedText.y = gm.blockly.funcs.getScreenPos(ypos);
        reusedText.text = str;
        reusedText.style.fill = color;
        reusedText.alpha = alpha / 100;
        reusedText.style.fontSize = gm.blockly.funcs.getScreenPos(size);
        reusedText.usedBy = discID;

        if (centered) {
          reusedText.anchor.set(0.5, 0);
        } else {
          reusedText.anchor.set(0, 0);
        }
      } else {
        const text = new PIXI.Text(str, {
          fontFamily: 'futurept_medium',
          fontSize: gm.blockly.funcs.getScreenPos(size),
          fill: color,
          align: 'center',
          dropShadow: true,
          dropShadowDistance: 3,
          dropShadowAlpha: 0.30,
        });

        graphics.addChild(text);

        text.resolution = 2;
        text.x = gm.blockly.funcs.getScreenPos(xpos);
        text.y = gm.blockly.funcs.getScreenPos(ypos);
        text.alpha = alpha / 100;
        text.usedBy = discID;

        if (centered) {
          text.anchor.set(0.5, 0);
        }

        gm.graphics.usedText.push(text);
      }
    },
    clearGraphics: function(discID) {
      if (typeof discID !== 'undefined') {
        const discGraphics = gm.graphics.additionalDiscGraphics[discID];
        const worldGraphics = gm.graphics.additionalWorldGraphics[discID];
        if (worldGraphics && !worldGraphics._destroyed) worldGraphics.clear();
        if (discGraphics && !discGraphics._destroyed) discGraphics.clear();

        if (discGraphics) gm.graphics.additionalDiscGraphics[discID].removeChildren();
        if (worldGraphics) gm.graphics.additionalWorldGraphics[discID].removeChildren();

        for (let i = 0; i < gm.graphics.usedText.length; i++) {
          if (gm.graphics.usedText[i]?.usedBy === discID) {
            gm.graphics.availableText.push(gm.graphics.usedText.splice(i, 1)[0]);
            i--;
          }
        }
      } else {
        for (let i = 0; i !== gm.graphics.additionalDiscGraphics.length; i++) {
          const discGraphics = gm.graphics.additionalDiscGraphics[i];
          const worldGraphics = gm.graphics.additionalWorldGraphics[i];
          if (worldGraphics && !worldGraphics._destroyed) worldGraphics.clear();
          if (discGraphics && !discGraphics._destroyed) discGraphics.clear();

          if (discGraphics) gm.graphics.additionalDiscGraphics[i].removeChildren();
          if (worldGraphics) gm.graphics.additionalWorldGraphics[i].removeChildren();

          while (gm.graphics.usedText.length > 0) {
            gm.graphics.availableText.push(gm.graphics.usedText.pop());
          }
        }
      }
    },
    getScreenPos: function(value) {
      return value * gm.physics.gameState.physics.ppm;
    },
    setPlayerProperty: function(gameState, discID, property, value) {
      if (gm.graphics.rendering) return gameState;
      if (value === null || value === undefined || value === Infinity || value === NaN) return gameState;
      if (gameState.discs[discID]) {
        gameState.discs[discID][property] = value;
      }
      return gameState;
    },
    changePlayerProperty: function(gameState, discID, property, value) {
      if (gm.graphics.rendering) return gameState;
      if (value === null || value === undefined || value === Infinity || value === NaN) return gameState;
      if (gameState.discs[discID]) {
        gameState.discs[discID][property] += value;
      }
      return gameState;
    },
    getPlayerProperty: function(gameState, discID, property) {
      if (gameState.discs[discID] && !(!gameState.discs[discID][property] && gameState.discs[discID][property] !== 0)) {
        return gameState.discs[discID][property];
      } else {
        return Infinity;
      }
    },
    setArrowProperty: function(gameState, discID, arrowID, property, value) {
      if (gm.graphics.rendering) return gameState;
      if (value === null || value === undefined || value === Infinity || value === NaN) return gameState;

      const projs = gameState.projectiles;
      let accum = 1;

      for (let i = 0; i !== projs.length; i++) {
        if (projs[i] && projs[i].did === discID) {
          if (accum === arrowID) {
            gameState.projectiles[i][property] = value;
            break;
          }
          accum++;
        }
      }
      return gameState;
    },
    setAllArrowsProperty: function(gameState, discID, property, value) {
      if (gm.graphics.rendering) return gameState;
      if (value === null || value === undefined || value === Infinity || value === NaN) return gameState;

      const projs = gameState.projectiles;

      for (let i = 0; i !== projs.length; i++) {
        if (projs[i] && projs[i].did === discID) {
          gameState.projectiles[i][property] = value;
        }
      }
      return gameState;
    },
    changeArrowProperty: function(gameState, discID, arrowID, property, value) {
      if (gm.graphics.rendering) return gameState;
      if (value === null || value === undefined || value === Infinity || value === NaN) return gameState;
      const projs = gameState.projectiles;
      let accum = 1;

      for (let i = 0; i !== projs.length; i++) {
        if (projs[i] && projs[i].did === discID) {
          if (accum === arrowID) {
            gameState.projectiles[i][property] += value;
            break;
          }
          accum++;
        }
      }
      return gameState;
    },
    changeAllArrowsProperty: function(gameState, discID, property, value) {
      if (gm.graphics.rendering) return gameState;
      if (value === null || value === undefined || value === Infinity || value === NaN) return gameState;

      const projs = gameState.projectiles;

      for (let i = 0; i !== projs.length; i++) {
        if (projs[i] && projs[i].did === discID) {
          gameState.projectiles[i][property] += value;
        }
      }
      return gameState;
    },
    getArrowProperty: function(gameState, discID, arrowID, property) {
      const projs = gameState.projectiles;
      let accum = 1;

      for (let i = 0; i !== projs.length; i++) {
        if (projs[i] && projs[i].did === discID) {
          if (accum === arrowID) {
            return gameState.projectiles[i][property];
            break;
          }
          accum++;
        }
      }
      return Infinity;
    },
    getArrowAmount: function(gameState, discID) {
      const projs = gameState.projectiles;
      let accum = 0;

      for (let i = 0; i !== projs.length; i++) {
        if (projs[i] && projs[i].did === discID) {
          accum++;
        }
      }

      return accum;
    },
    deletePlayerArrow: function(gameState, discID, arrowID) {
      if (gm.graphics.rendering) return gameState;
      const projs = gameState.projectiles;
      let accum = 1;

      for (let i = 0; i !== projs.length; i++) {
        if (projs[i] && projs[i].did === discID) {
          if (accum === arrowID) {
            gameState.projectiles[i] = null;
            break;
          }
          accum++;
        }
      }
    },
    deleteAllPlayerArrows: function(gameState, discID) {
      if (gm.graphics.rendering) return gameState;
      const projs = gameState.projectiles;
      for (let i = 0; i !== projs.length; i++) {
        if (projs[i] && projs[i].did === discID) {
          gameState.projectiles[i] = null;
        }
      }
    },
    getAllPlayerIds: function(gameState) {
      const array = [];
      for (let i = 0; i !== gameState.discs.length; i++) {
        if (gameState.discs[i]) array.push(i);
      }
      return array;
    },
    getPlayerSize: function(discID) {
      const bal = gm.lobby.mpSession.getGameSettings().bal[discID];

      if (bal) {
        return 1 + Math.max(Math.min(bal / 100, 1), -0.94);
      }
      return 1;
    },
    getPlayerColor: function(gameState, discID) {
      if (!gameState.discs[discID]) return '#000000';
      switch (gameState.discs[discID].team) {
        case 1:
          if (gm.graphics.rendererClass.playerArray[discID]) {
            return '#' + gm.graphics.rendererClass.playerArray[discID].avatar.bc.toString(16);
          }
          break;
        case 2:
          return '#f44336';
        case 3:
          return '#2196f3';
        case 4:
          return '#4caf50';
        case 5:
          return '#ffeb3b';
      }
      return '#000000';
    },
    setCameraProperty: function(gameState, discID, property, value) {
      if (gm.graphics.rendering) return gameState;
      if (value === null || value === undefined || value === Infinity || value === NaN) return gameState;

      const cameras = gameState.physics.bodies[0].cf.cameras;

      // convert degrees to radians
      if (property === 'angle') value *= (Math.PI / 180);
      if (property === 'xskew' || property === 'yskew') value *= (Math.PI / -180);

      if (discID !== null) {
        cameras[discID][property] = value;
      } else {
        for (let i = 0; i < cameras.length; i++) {
          if (!cameras[i]) continue;

          cameras[i][property] = value;
        }
      }

      gameState.physics.bodies[0].cf.cameras = cameras;
      gameState.physics.bodies[0].cf.cameraChanged = true;

      return gameState;
    },
    changeCameraProperty: function(gameState, discID, property, value) {
      if (gm.graphics.rendering) return gameState;
      if (value === null || value === undefined || value === Infinity || value === NaN) return gameState;

      const cameras = gameState.physics.bodies[0].cf.cameras;

      // convert degrees to radians
      if (property === 'angle') value *= (Math.PI / 180);
      if (property === 'xskew' || property === 'yskew') value *= (Math.PI / -180);

      if (discID !== null) {
        cameras[discID][property] += value;
      } else {
        for (let i = 0; i < cameras.length; i++) {
          if (!cameras[i]) continue;

          cameras[i][property] += value;
        }
      }

      gameState.physics.bodies[0].cf.cameras = cameras;
      gameState.physics.bodies[0].cf.cameraChanged = true;

      return gameState;
    },
    getCameraProperty: function(gameState, discID, property) {
      if (!gameState.physics.bodies[0].cf.cameras[discID]) return Infinity;

      // convert degrees to radians
      if (property === 'angle') return gameState.physics.bodies[0].cf.cameras[discID][property] * (Math.PI / 180);
      if (property === 'xskew' || property === 'yskew') return gameState.physics.bodies[0].cf.cameras[discID][property] * (Math.PI / -180);

      return gameState.physics.bodies[0].cf.cameras[discID][property];
    },
    enableCameraLerp: function(gameState, enable, discID) {
      if (gm.graphics.rendering) return gameState;
      if (!gameState.physics.bodies[0].cf.cameras[discID]) return gameState;

      gameState.physics.bodies[0].cf.cameras[discID].doLerp = enable;

      return gameState;
    },
    enableDeathBarrier: function(gameState, enable) {
      if (gm.graphics.rendering) return gameState;

      gameState.physics.bodies[0].cf.disableDeathBarrier = !enable;

      return gameState;
    },
    rayCast: function(gameState, discID, x1, y1, x2, y2, colA, colB, colC, colD, colP, pointXVar, pointYVar, normalXVar, normalYVar, objectTypeVar, objectIdVar) {
      let maskBits = 65535;
      if (!colP) maskBits -= 1;
      if (!colA) maskBits -= 4;
      if (!colB) maskBits -= 8;
      if (!colC) maskBits -= 16;
      if (!colD) maskBits -= 32;

      const vectorA = new Box2D.Common.Math.b2Vec2(x1, y1);
      const vectorB = new Box2D.Common.Math.b2Vec2(x2, y2);

      let objectFound = false;
      let theChosenOne = {point: vectorB};

      const mdf = Math.abs(vectorB.x - vectorA.x) > Math.abs(vectorB.y - vectorA.y) ? 'x' : 'y'; // mdf stands for Major Distance Factor

      const rayCastCallback = (fixture, point, normal) => {
        const category = fixture.GetFilterData().categoryBits;
        if ((maskBits & category) != category) return -1;

        if (Math.abs(point[mdf] - vectorA[mdf]) < Math.abs(theChosenOne.point[mdf] - vectorA[mdf])) {
          objectFound = true;
          theChosenOne = {
            fixture: fixture,
            point: point,
            normal: normal,
          };
        }
        return 1;
      };

      window.PhysicsClass.world.RayCast(rayCastCallback, vectorA, vectorB);

      if (objectFound) {
        gameState = gm.blockly.funcs.setVar(pointXVar, gameState, discID, theChosenOne.point.x);
        gameState = gm.blockly.funcs.setVar(pointYVar, gameState, discID, theChosenOne.point.y);
        gameState = gm.blockly.funcs.setVar(normalXVar, gameState, discID, theChosenOne.normal.x);
        gameState = gm.blockly.funcs.setVar(normalYVar, gameState, discID, theChosenOne.normal.y);

        const fixtureData = theChosenOne.fixture.GetBody().GetUserData();

        gameState = gm.blockly.funcs.setVar(objectTypeVar, gameState, discID, fixtureData.type == 'phys' ? 'platform' : 'player');
        gameState = gm.blockly.funcs.setVar(objectIdVar, gameState, discID, fixtureData.discID ?? fixtureData.arrayID);
      }

      return objectFound;
    },
    createArrow: function(gameState, discID, xpos, ypos, xvel, yvel, angle, time) {
      if (xpos > 99999 || ypos > 99999 || xvel > 99999 || yvel > 99999 || angle > 99999) return;
      if (gameState.discs[discID]) {
        gameState.projectiles.push({
          a: angle,
          av: 0,
          did: discID,
          fte: time,
          team: gameState.discs[discID].team,
          type: 'arrow',
          x: xpos,
          xv: xvel,
          y: ypos,
          yv: yvel,
        });
      }
    },
    overrideInput: function(gameState, discID, input, value) {
      if (gm.graphics.rendering) return;
      if (gameState.physics.bodies[0].cf.overrides && !gameState.physics.bodies[0].cf.overrides[discID]) {
        gameState.physics.bodies[0].cf.overrides[discID] = {};
      } else if (!gameState.physics.bodies[0].cf.overrides) {
        gameState.physics.bodies[0].cf.overrides = [];
        gameState.physics.bodies[0].cf.overrides[discID] = {};
      }

      gameState.physics.bodies[0].cf.overrides[discID][input] = value;
    },
    killPlayer: function(gameState, discID) {
      if (gm.graphics.rendering) return;
      if (gameState.physics.bodies[0].cf.kills && !gameState.physics.bodies[0].cf.kills.includes(discID)) {
        gameState.physics.bodies[0].cf.kills.push(discID);
      } else if (!gameState.physics.bodies[0].cf.kills) {
        gameState.physics.bodies[0].cf.kills = [];
        gameState.physics.bodies[0].cf.kills.push(discID);
      }
    },
    createRectShape: function(color, xpos, ypos, width, height, angle, noPhys, noGrap, inGrap, death) {
      color = parseInt(color.slice(1), 16);

      if (xpos > 99999 || ypos > 99999 || width > 99999 || height > 99999) return;

      return {shape: {'type': 'bx', 'w': width, 'h': height, 'c': [xpos, ypos], 'a': angle, 'sk': false}, fixture: {'sh': -1, 'n': 'gmmaker', 'fr': null, 'fp': null, 're': null, 'de': null, 'f': color, 'd': death, 'np': noPhys, 'ng': noGrap, 'ig': inGrap}};
    },
    createCircleShape: function(color, xpos, ypos, radius, noPhys, noGrap, inGrap, death) {
      color = parseInt(color.slice(1), 16);

      if (xpos > 99999 || ypos > 99999 || radius > 99999) return;

      return {shape: {'type': 'ci', 'r': radius, 'c': [xpos, ypos], 'sk': false}, fixture: {'sh': -1, 'n': 'gmmaker', 'fr': null, 'fp': null, 're': null, 'de': null, 'f': color, 'd': death, 'np': noPhys, 'ng': noGrap, 'ig': inGrap}};
    },
    createPolyShape: function(color, xpos, ypos, vertexList, angle, scale, noPhys, noGrap, inGrap, death) {
      color = parseInt(color.slice(1), 16);

      if (xpos > 99999 || ypos > 99999 || angle > 99999 || scale > 99999) return;

      const actualVertexList = [];
      for (let i = 0; i < vertexList.length; i += 2) {
        if (vertexList[i] > 99999 || vertexList[i+1] > 99999) return;
        actualVertexList.push([vertexList[i] ?? 0, vertexList[i+1] ?? 0]);
      }

      return {shape: {'type': 'po', 'v': actualVertexList, 's': scale, 'a': angle, 'c': [0, 0]}, fixture: {'sh': -1, 'n': 'gmmaker', 'fr': null, 'fp': null, 're': null, 'de': null, 'f': color, 'd': death, 'np': noPhys, 'ng': noGrap, 'ig': inGrap}};
    },
    createPlatform: function(gameState, type, xpos, ypos, angle, shapes = [], bounce, density, friction, fricPlayers, colGroup, colP, colA, colB, colC, colD) {
      if (gm.graphics.rendering) return -1;
      const body = {
        'type': type,
        'p': [xpos, ypos],
        'a': angle,
        'av': 0,
        'lv': [0, 0],
        'ld': 0,
        'ad': 0,
        'fr': false,
        'bu': false,
        'fx': [],
        'fric': friction,
        'fricp': fricPlayers,
        'de': density,
        're': bounce,
        'f_c': colGroup,
        'f_p': colP,
        'f_1': colA,
        'f_2': colB,
        'f_3': colC,
        'f_4': colD,
        'cf': {'x': 0, 'y': 0, 'w': true, 'ct': 0},
      };

      for (let i = 0; i !== shapes.length; i++) {
        if (shapes[i] === null || shapes[i] === undefined) continue;

        const shIndex = gameState.physics.shapes.length;
        gameState.physics.shapes.push(shapes[i].shape);
        const fxIndex = gameState.physics.fixtures.length;
        gameState.physics.fixtures.push(shapes[i].fixture);

        gameState.physics.fixtures[fxIndex].sh = shIndex;

        body.fx.push(fxIndex);
      }

      if (body.fx.length == 0) return Infinity;

      gameState.physics.bodies.push(body);
      gameState.physics.bro.unshift(gameState.physics.bodies.length - 1);


      if (!gm.graphics.renderUpdates[gameState.rl]) gm.graphics.renderUpdates[gameState.rl] = [];
      gm.graphics.renderUpdates[gameState.rl].push({action: 'create', id: gameState.physics.bodies.length - 1});

      return gameState.physics.bodies.length - 1;
    },
    clonePlatform: function(gameState, platID) {
      if (gameState.physics.bodies[platID]) {
        const newBody = JSON.parse(JSON.stringify(gameState.physics.bodies[platID]));

        const newFixtureIds = [];
        for (let i = 0; i < newBody.fx.length; i++) {
          newFixtureIds.push(gameState.physics.fixtures.length);

          const newFixture = JSON.parse(JSON.stringify(gameState.physics.fixtures[newBody.fx[i]]));
          const newShape = JSON.parse(JSON.stringify(gameState.physics.shapes[newFixture.sh]));

          newFixture.sh = gameState.physics.shapes.length;

          gameState.physics.shapes.push(newShape);
          gameState.physics.fixtures.push(newFixture);
        }

        newBody.fx = newFixtureIds;

        gameState.physics.bro.unshift(gameState.physics.bodies.length);
        gameState.physics.bodies.push(newBody);


        if (!gm.graphics.renderUpdates[gameState.rl]) gm.graphics.renderUpdates[gameState.rl] = [];
        gm.graphics.renderUpdates[gameState.rl].push({action: 'create', id: gameState.physics.bodies.length - 1});

        return gameState.physics.bodies.length - 1;
      }
      return Infinity;
    },
    getPlatformByName: function(name) {
      const map = gm.lobby.mpSession.getGameSettings().map;
      for (let i = 0; i < map.physics.bodies.length; i++) {
        if (map.physics.bodies[i]?.n == name) return i;
      }
      return Infinity;
    },
    getPlatformName: function(platID) {
      const map = gm.lobby.mpSession.getGameSettings().map;
      if (map.physics.bodies[platID]) return map.physics.bodies[platID].n;
      return '';
    },
    setPlatformProperty: function(gameState, platID, property, value) {
      if (gm.graphics.rendering) return gameState;
      if (value === null || value === undefined || value === Infinity || value === NaN) return gameState;

      const body = gameState.physics.bodies[platID];
      const boolProps = ['fricp', 'f_p', 'f_a', 'f_b', 'f_c', 'f_d'];
      if (gameState.physics.bodies[platID]) {
        switch (property) {
          case 'p_x':
            body.p[0] = parseFloat(value) === NaN ? body.p[0] : parseFloat(value);
            break;
          case 'p_y':
            body.p[1] = parseFloat(value) === NaN ? body.p[1] : parseFloat(value);
            break;
          case 'lv_x':
            body.lv[0] = parseFloat(value) === NaN ? body.lv[0] : parseFloat(value);
            break;
          case 'lv_y':
            body.lv[1] = parseFloat(value) === NaN ? body.lv[1] : parseFloat(value);
            break;
        }
        if (boolProps.includes(property)) {
          body[property] = value === true;
        } else if (body[property] !== undefined) {
          body[property] = parseFloat(value) === NaN ? body[property] : parseFloat(value);
        }
        gameState.physics.bodies[platID] = body;
      }
      return gameState;
    },
    changePlatformProperty: function(gameState, platID, property, value) {
      if (gm.graphics.rendering) return gameState;
      if (value === null || value === undefined || value === Infinity || value === NaN) return gameState;

      const body = gameState.physics.bodies[platID];
      if (gameState.physics.bodies[platID]) {
        switch (property) {
          case 'p_x':
            body.p[0] += parseFloat(value) === NaN ? 0 : parseFloat(value);
            break;
          case 'p_y':
            body.p[1] += parseFloat(value) === NaN ? 0 : parseFloat(value);
            break;
          case 'lv_x':
            body.lv[0] += parseFloat(value) === NaN ? 0 : parseFloat(value);
            break;
          case 'lv_y':
            body.lv[1] += parseFloat(value) === NaN ? 0 : parseFloat(value);
            break;
        }
        if (body[property] !== undefined) {
          body[property] += parseFloat(value) === NaN ? 0 : parseFloat(value);
        }
        gameState.physics.bodies[platID] = body;
      }
      return gameState;
    },
    getPlatformProperty: function(gameState, platID, property) {
      const body = gameState.physics.bodies[platID];
      if (gameState.physics.bodies[platID]) {
        switch (property) {
          case 'p_x':
            return body.p[0];
          case 'p_y':
            return body.p[1];
          case 'lv_x':
            return body.lv[0];
          case 'lv_y':
            return body.lv[1];
        }
        if (body[property] !== undefined) {
          return body[property];
        }
      }
      return Infinity;
    },
    setShapeProperty: function(gameState, platID, shapeID, property, value) {
      if (gm.graphics.rendering) return gameState;
      if (value === null || value === undefined || value === Infinity || value === NaN) return gameState;

      const fixture = gameState.physics.fixtures[gameState.physics.bodies[platID]?.fx[shapeID - 1]];
      const shape = gameState.physics.shapes[fixture?.sh];
      const boolProps = ['f_np', 'f_ng', 'f_ig', 'f_d'];
      const breakOnZero = ['s_w', 's_h'];
      if (fixture && property.startsWith('f_')) {
        if (property === 'f_f') {
          fixture.f = (typeof value !== 'string' ? parseInt(value) : parseInt(value.slice(1), 16)) || 0;
        } else if (boolProps.includes(property)) {
          fixture[property.slice(2)] = value === true;
        } else if (fixture[property.slice(2)] !== undefined) {
          fixture[property.slice(2)] = parseFloat(value) || 0;
        }

        gameState.physics.fixtures[gameState.physics.bodies[platID].fx[shapeID - 1]] = fixture;

        if (!gm.graphics.renderUpdates[gameState.rl]) gm.graphics.renderUpdates[gameState.rl] = [];
        gm.graphics.renderUpdates[gameState.rl].push({action: 'update', id: platID});
      } else if (shape && property.startsWith('s_')) {
        switch (property) {
          case 's_c_x':
            shape.c[0] = parseFloat(value) || 0;
            break;
          case 's_c_y':
            shape.c[1] = parseFloat(value) || 0;
            break;
        }

        if (shape[property.slice(2)] !== undefined) {
          shape[property.slice(2)] = parseFloat(value) || 0;
        }

        if (breakOnZero.includes(property) && shape[property.slice(2)] >= 0 && shape[property.slice(2)] < 0.001) shape[property.slice(2)] = 0.001;

        gameState.physics.shapes[fixture.sh] = shape;

        if (!gm.graphics.renderUpdates[gameState.rl]) gm.graphics.renderUpdates[gameState.rl] = [];
        gm.graphics.renderUpdates[gameState.rl].push({action: 'update', id: platID});
      }

      if (boolProps.includes(property) && property !== 'f_np') gm.graphics.needRerender = false;

      return gameState;
    },
    changeShapeProperty: function(gameState, platID, shapeID, property, value) {
      if (gm.graphics.rendering) return gameState;
      if (value === null || value === undefined || value === Infinity || value === NaN) return gameState;

      const fixture = gameState.physics.fixtures[gameState.physics.bodies[platID]?.fx[shapeID - 1]];
      const shape = gameState.physics.shapes[fixture?.sh];
      const breakOnZero = ['s_w', 's_h'];
      if (fixture && property.startsWith('f_')) {
        if (fixture[property.slice(2)] !== undefined) {
          fixture[property.slice(2)] += parseFloat(value) || 0;
        }

        gameState.physics.fixtures[gameState.physics.bodies[platID].fx[shapeID - 1]] = fixture;

        gm.graphics.renderUpdates[gameState.rl].push({action: 'update', id: platID});
      } else if (shape && property.startsWith('s_')) {
        switch (property) {
          case 's_c_x':
            shape.c[0] += parseFloat(value) || 0;
            break;
          case 's_c_y':
            shape.c[1] += parseFloat(value) || 0;
            break;
        }

        if (shape[property.slice(2)] !== undefined) {
          shape[property.slice(2)] += parseFloat(value) || 0;
        }

        if (breakOnZero.includes(property) && shape[property.slice(2)] >= 0 && shape[property.slice(2)] < 0.001) shape[property.slice(2)] = 0.001;

        gameState.physics.shapes[fixture.sh] = shape;

        if (!gm.graphics.renderUpdates[gameState.rl]) gm.graphics.renderUpdates[gameState.rl] = [];
        gm.graphics.renderUpdates[gameState.rl].push({action: 'update', id: platID});
      }

      return gameState;
    },
    getShapeProperty: function(gameState, platID, shapeID, property) {
      const fixture = gameState.physics.fixtures[gameState.physics.bodies[platID]?.fx[shapeID - 1]];
      const shape = gameState.physics.shapes[fixture?.sh];
      if (fixture && property.startsWith('f_')) {
        if (property === 'f_f') {
          return gm.blockly.funcs.parseColour(fixture.f.toString(16));
        } else if (fixture[property.slice(2)] !== undefined) {
          return fixture[property.slice(2)];
        }

        gameState.physics.fixtures[gameState.physics.bodies[platID].fx[shapeID - 1]] = fixture;
      } else if (shape && property.startsWith('s_')) {
        switch (property) {
          case 's_c_x':
            return shape.c[0];
          case 's_c_y':
            return shape.c[1];
        }

        if (shape[property.slice(2)] !== undefined) {
          return shape[property.slice(2)];
        }
      }

      return Infinity;
    },
    getShapeAmount: function(gameState, platID) {
      return gameState.physics.bodies[platID]?.fx.length ?? Infinity;
    },
    deletePlatform: function(gameState, platID) {
      if (gm.graphics.rendering) return gameState;
      if (gameState.physics.bodies[platID] && gameState.physics.bodies[platID].fx !== 0) {
        gameState.physics.bodies[platID].fx = [];
        gameState.physics.bodies[platID].type = 's';


        if (!gm.graphics.renderUpdates[gameState.rl]) gm.graphics.renderUpdates[gameState.rl] = [];
        gm.graphics.renderUpdates[gameState.rl].push({action: 'delete', id: platID});
      }
      return gameState;
    },
    deleteShape: function(gameState, platID, shapeID) {
      if (gm.graphics.rendering) return gameState;
      if (gameState.physics.bodies[platID] && gameState.physics.bodies[platID].fx[shapeID - 1] !== undefined) {
        if (!gm.graphics.renderUpdates[gameState.rl]) gm.graphics.renderUpdates[gameState.rl] = [];
        gm.graphics.renderUpdates[gameState.rl].push({action: 'update', id: platID});
        gameState.physics.bodies[platID].fx.splice(shapeID - 1, 1);
      }
      return gameState;
    },
    addShape: function(gameState, platID, shape) {
      if (gm.graphics.rendering) return gameState;
      if (gameState.physics.bodies[platID] && shape.shape.type) {
        const shIndex = gameState.physics.shapes.length;
        gameState.physics.shapes.push(shape.shape);
        const fxIndex = gameState.physics.fixtures.length;
        gameState.physics.fixtures.push(shape.fixture);

        gameState.physics.fixtures[fxIndex].sh = shIndex;

        gameState.physics.bodies[platID].fx.push(fxIndex);


        if (!gm.graphics.renderUpdates[gameState.rl]) gm.graphics.renderUpdates[gameState.rl] = [];
        gm.graphics.renderUpdates[gameState.rl].push({action: 'update', id: platID});
      }
      return gameState;
    },
    setVar: function(varName, gameState, discID, value) {
      if (value === null || value === undefined) return gameState;

      if (varName.startsWith('GLOBAL_')) {
        gameState.physics.bodies[0].cf.variables.global[varName] = value;
      } else if (gameState.physics.bodies[0].cf.variables[discID]) {
        gameState.physics.bodies[0].cf.variables[discID][varName] = value;
      }

      return gameState;
    },
    changeVar: function(varName, gameState, discID, value) {
      if (value === null || value === undefined) return gameState;

      if (varName.startsWith('GLOBAL_')) {
        gameState.physics.bodies[0].cf.variables.global[varName] += value;
      } else if (gameState.physics.bodies[0].cf.variables[discID]) {
        if (!gameState.physics.bodies[0].cf.variables[discID][varName]) gameState.physics.bodies[0].cf.variables[discID][varName] = 0;
        gameState.physics.bodies[0].cf.variables[discID][varName] += value;
      }

      return gameState;
    },
    getVar: function(varName, gameState, discID) {
      if (varName.startsWith('GLOBAL_') && gameState.physics.bodies[0].cf.variables.global?.[varName] != null) {
        return gameState.physics.bodies[0].cf.variables.global[varName];
      } else if (!varName.startsWith('GLOBAL_') && gameState.physics.bodies[0].cf.variables[discID]?.[varName] != null) {
        return gameState.physics.bodies[0].cf.variables[discID][varName];
      }

      return Infinity;
    },
    getDistance: function(pointA_X, pointA_Y, pointB_X, pointB_Y) {
      return Math.sqrt(Math.pow(pointB_X - pointA_X, 2)+Math.pow(pointB_Y - pointA_Y, 2));
    },
    parseColour: function(colourString) {
      if (parseInt(colourString, 16) == NaN) {
        return '#000000';
      }
      return '#' + '0'.repeat(6 - colourString.length) + colourString;
    },
    setInArray: function(array, index, value) {
      array[index] = value;
      return array;
    },
    insertInArray: function(array, index, value) {
      array.splice(index, 0, value);
      return array;
    },
  },
  resetVars: function() {
  },
  resetMode: function() {
    gm.physics.onFirstStep = function() {};
    gm.physics.onStep = function() {};
    gm.physics.onPlayerPlayerCollision = function() {};
    gm.physics.onPlayerArrowCollision = function() {};
    gm.physics.onPlayerPlatformCollision = function() {};
    gm.physics.onArrowPlayerCollision = function() {};
    gm.physics.onArrowArrowCollision = function() {};
    gm.physics.onArrowPlatformCollision = function() {};
    gm.physics.onPlatformPlayerCollision = function() {};
    gm.physics.onPlatformArrowCollision = function() {};
    gm.physics.onPlatformPlatformCollision = function() {};
    gm.graphics.onRender = function() {};
  },
  resetAll: function() {
    gm.blockly.resetMode();
    gm.blockly.funcs.clearGraphics();
  },
};
