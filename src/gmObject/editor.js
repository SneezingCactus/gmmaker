/* eslint-disable no-invalid-this */
/* eslint-disable camelcase */
/* eslint-disable new-cap */

// blockly libs
import Blockly from 'blockly';
import {WorkspaceSearch} from '@blockly/plugin-workspace-search';
import toolbox from '../blockly/toolbox.xml';
import windowHtml from '../gmWindow/window.html';
import blockDefs from '../blockly/blockdefs.js';
import defineBlockCode from '../blockly/blockfuncs.js';
import defineBlockValidators from '../blockly/blockvalidators.js';

// text libs
import * as monaco from 'monaco-editor';
import monacoWorker from '../monaco/editor.worker.raw.js';
import monacoTypescript from '../monaco/ts.worker.raw.js';
import monacoDefs from '!raw-loader!../monaco/gmm.d.ts';
import monacoDefSnippets from '../monaco/snippets.js';

// misc
import {saveAs} from 'file-saver';
import md5 from 'md5';

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
    document.getElementById('gmeditor_newbutton').addEventListener('click', gm.editor.GMENew);
    document.getElementById('gmeditor_importbutton').addEventListener('click', gm.editor.GMEImport);
    document.getElementById('gmeditor_exportbutton').addEventListener('click', gm.editor.GMEExportShow);
    document.getElementById('gmeditor_backupsbutton').addEventListener('click', gm.editor.GMEBackupsShow);
    document.getElementById('gmeditor_changebasebutton').addEventListener('click', gm.editor.GMEChangeEditor);
    document.getElementById('gmeditor_settingsbutton').addEventListener('click', gm.editor.GMESettingsShow);
    document.getElementById('gmeditor_savebutton').addEventListener('click', gm.editor.GMESave);
    document.getElementById('gmeditor_closebutton').addEventListener('click', gm.editor.hideGMEWindow);

    document.getElementById('gmsettings_cancel').addEventListener('click', gm.editor.GMESettingsCancel);
    document.getElementById('gmsettings_save').addEventListener('click', gm.editor.GMESettingsSave);
    document.getElementById('gmsettings_imagestab').addEventListener('click', () => gm.editor.GMESettingsChangeTab(false));
    document.getElementById('gmsettings_soundstab').addEventListener('click', () => gm.editor.GMESettingsChangeTab(true));
    document.getElementById('gmsettings_importasset').addEventListener('click', gm.editor.GMESettingsImportAsset);

    document.getElementById('gmexport_cancel').addEventListener('click', gm.editor.GMEExportCancel);
    document.getElementById('gmexport_ok').addEventListener('click', gm.editor.GMEExportSave);

    document.getElementById('gmbackups_cancel').addEventListener('click', gm.editor.GMEBackupsCancel);
    document.getElementById('gmbackups_load').addEventListener('click', gm.editor.GMEBackupsLoad);

    document.getElementById('gmimportdialog_cancel').addEventListener('click', gm.editor.GMEImportMapCancel);
    document.getElementById('gmimportdialog_no').addEventListener('click', gm.editor.GMEImportMapNo);
    document.getElementById('gmimportdialog_yes').addEventListener('click', gm.editor.GMEImportMapYes);

    // create the button that opens the game mode editor
    const GMOpenButton = document.createElement('div');
    GMOpenButton.id = 'gmeditor_openbutton';
    GMOpenButton.className = 'newbonklobby_settings_button brownButton brownButton_classic buttonShadow';
    GMOpenButton.addEventListener('click', gm.editor.showGMEWindow);

    // ensure compatibility with bonk-host
    if (window.createModeDropdown) {
      window.createModeDropdownOLD = window.createModeDropdown;
      window.createModeDropdown = function() {
        window.createModeDropdownOLD();
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
      'gmeditor_newbutton', 'gmeditor_importbutton', 'gmeditor_exportbutton', 'gmeditor_savebutton', 'gmeditor_closebutton', 'gmeditor_settingsbutton', 'gmeditor_backupsbutton', 'gmeditor_changebasebutton',
      'gmblockly_cancel', 'gmblockly_ok',
      'gmexport_cancel', 'gmexport_ok',
      'gmimportdialog_cancel', 'gmimportdialog_no', 'gmimportdialog_yes',
      'gmsettings_cancel', 'gmsettings_save', 'gmsettings_importasset',
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

    // hook into chatbox focus method to enable/disable chatbox input
    const chatbox = document.getElementById('newbonklobby_chat_input');
    chatbox.focusOLD = chatbox.focus;
    chatbox.focus = function() {
      if (!gm.editor.disableLobbyChatbox) {
        chatbox.focusOLD();
      }
    };

    // get settings asset list item node
    gm.editor.settingsImageItem = document.getElementById('gmsettings_assetlist')
        .getElementsByClassName('gm_listitem')[0].cloneNode(true);

    // init blockly and monaco workspaces
    this.initBlockly();
    this.initMonaco();

    this.hideGMEWindow();

    // sets up DB for mode backups
    //  "hey can i copy your code"
    //  "sure but change some stuff so nobody notices"
    //  (yes kklkkj totally said that)
    const dbOpenRequest = window.indexedDB.open('gmmakerStorage1.0.0', 1);

    dbOpenRequest.onsuccess = () => {
      gm.editor.backupDB = dbOpenRequest.result;
      gm.editor.backupDB.transaction('backups');
      const transaction = gm.editor.backupDB.transaction('backups');
      const getRequest = transaction.objectStore('backups').get(1);
      getRequest.onsuccess = () => {
        gm.editor.modeBackups = getRequest.result;
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
  },
  initMonaco: function() {
    // create monaco container div
    const monacoDiv = document.createElement('div');
    monacoDiv.id = 'gmmonacodiv';

    const bounds = document.getElementById('gmworkspacearea').getBoundingClientRect();

    monacoDiv.style.top = bounds.top;
    monacoDiv.style.left = bounds.left;
    monacoDiv.style.width = bounds.width;
    monacoDiv.style.height = bounds.height;

    monacoDiv.style.display = 'none';

    document.getElementById('pagecontainer').appendChild(monacoDiv);

    const workerBlob = new Blob([monacoWorker], {type: 'text/javascript'});
    const tsBlob = new Blob([monacoTypescript], {type: 'text/javascript'});

    self.MonacoEnvironment = {
      getWorkerUrl: function(moduleId, label) {
        switch (label) {
          case 'editorWorkerService':
            return window.URL.createObjectURL(workerBlob);
          case 'javascript':
            return window.URL.createObjectURL(tsBlob);
        }
      },
    };

    const defUri = 'ts:filename/gmm.d.ts';

    // remove dom stuff
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      allowJs: true,
      allowNonTsExtensions: true,
      lib: ['es2015'],
    });

    // add gmm defs
    monaco.languages.typescript.javascriptDefaults.addExtraLib(monacoDefs, defUri);

    // add gmm snippets
    monacoDefSnippets();

    gm.editor.monacoWs = monaco.editor.create(document.getElementById('gmmonacodiv'), {
      value: '',
      language: 'javascript',
      tabSize: 2,
    });

    gm.editor.monacoWs.getModel().onDidChangeContent(function(event) {
      // the way this is formatted is s^^^^
      if (!gm.editor.modeSettings.isTextMode && !gm.editor.changingToTextEditor) {
        if (gm.editor.blocklyWs.getTopBlocks().length == 0) {
          gm.editor.blocklyWs.clear();
          document.getElementById('gmeditor_changebasebutton').classList.add('brownButtonDisabled');

          gm.editor.modeSettings.isTextMode = true;
          return;
        }

        gm.editor.monacoWs.getModel().undo();
        document.activeElement.blur();

        gm.editor.genericDialog('Once you start typing, the conversion from blocks to text will become permanent and you will no longer be able to go back to the block editor.\n\nAre you sure you want to change to text?', function(confirmed) {
          if (!confirmed) return;

          gm.editor.blocklyWs.clear();
          document.getElementById('gmeditor_changebasebutton').classList.add('brownButtonDisabled');

          gm.editor.modeSettings.isTextMode = true;
        }, true);
      }
      gm.editor.changingToTextEditor = false;

      // backup
      if (gm.editor.monacoWs.getValue() == '') return;
      if (!gm.editor.modeSettings.isTextMode) return;
      if (!gm.editor.canBackup) return;
      if (!gm.editor.backupDB) return;

      gm.editor.canBackup = false;
      setTimeout(function() {
        gm.editor.canBackup = true;
      }, 30000);

      if (gm.editor.modeBackups.length > 5) {
        gm.editor.modeBackups.pop();
      }

      const content = gm.editor.monacoWs.getValue();

      const backup = {};
      backup.content = content;
      backup.isEmpty = content == '';
      backup.settings = gm.editor.modeSettings;
      backup.assets = gm.editor.modeAssets;

      gm.editor.modeBackups.unshift({
        mode: gm.encoding.compressMode(backup).buffer,
        timeStamp: Date.now(),
      });

      const transaction = gm.editor.backupDB.transaction('backups', 'readwrite');
      transaction.objectStore('backups').put(gm.editor.modeBackups, 1);
    });

    window.addEventListener('resize', () => {
      const bounds = document.getElementById('gmworkspacearea').getBoundingClientRect();

      monacoDiv.style.top = bounds.top;
      monacoDiv.style.left = bounds.left;
      monacoDiv.style.width = bounds.width - 20;
      monacoDiv.style.height = bounds.height - 20;

      gm.editor.monacoWs.layout();
    }, false);
  },
  initBlockly: function() {
    // add block defs into blockly
    for (let i = 0; i !== this.blockDefs.length; i++) {
      Blockly.Blocks[this.blockDefs[i].type] = {};
    }

    defineBlockValidators();

    for (let i = 0; i !== this.blockDefs.length; i++) {
      Blockly.Blocks[this.blockDefs[i].type].init = function() {
        this.jsonInit(gm.editor.blockDefs[i]);

        if (this.validatorInit) {
          this.validatorInit();
        }
      };
    }

    defineBlockCode();

    // eslint-disable-next-line guard-for-in
    for (const block in Blockly.Blocks) {
      Blockly.Blocks[block].init = (function() {
        const initOLD = Blockly.Blocks[block].init;

        return function() {
          initOLD.apply(this, arguments);

          if (!this.type.startsWith('on_') && !this.type.startsWith('procedures_def')) {
            const onChangeOLD = this.onchange;

            this.setOnChange(function() {
              if (onChangeOLD) onChangeOLD.apply(this, arguments);

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

    // create blockly div
    const blocklyDiv = document.createElement('div');
    blocklyDiv.id = 'gmblocklydiv';

    const bounds = document.getElementById('gmworkspacearea').getBoundingClientRect();

    blocklyDiv.style.top = bounds.top;
    blocklyDiv.style.left = bounds.left;
    blocklyDiv.style.width = bounds.width;
    blocklyDiv.style.height = bounds.height;

    document.getElementById('pagecontainer').appendChild(blocklyDiv);

    // create gmmaker theme
    gm.editor.theme = Blockly.Theme.defineTheme('gmmaker', {
      'base': Blockly.Themes.Classic,
      'fontStyle': {
        'family': 'futurept_b1',
        'size': 12,
      },
    }),

    // create blockly workspaces
    gm.editor.blocklyWs = Blockly.inject('gmblocklydiv', {
      toolbox: document.getElementById('toolbox'),
      zoom: {
        controls: true,
        wheel: true,
        pinch: true,
      },
      theme: gm.editor.theme,
    });
    gm.editor.headlessBlocklyWs = new Blockly.Workspace();

    // drag surface makes the workspace lag a LOT while dragging on a really big project
    gm.editor.blocklyWs.useWorkspaceDragSurface_ = false;

    // workspace plugins
    const workspaceSearch = new WorkspaceSearch(gm.editor.blocklyWs);
    workspaceSearch.init();

    // workspace dialogs
    Blockly.dialog.setAlert(function(message, callback) {
      gm.editor.genericDialog(message, callback, false);
    });
    Blockly.dialog.setConfirm(function(message, callback) {
      gm.editor.genericDialog(message, callback, true);
    });
    Blockly.dialog.setPrompt(function(message, defaultValue, callback) {
      gm.editor.genericDialog(message, callback, true, true, defaultValue);
    });

    // add loop trap
    Blockly.JavaScript.INFINITE_LOOP_TRAP = 'if (++loopIterations > 10000000) throw \'gmInfiniteLoop\';';

    window.addEventListener('resize', () => {
      const bounds = document.getElementById('gmworkspacearea').getBoundingClientRect();

      blocklyDiv.style.top = bounds.top;
      blocklyDiv.style.left = bounds.left;
      blocklyDiv.style.width = bounds.width;
      blocklyDiv.style.height = bounds.height;

      Blockly.svgResize(gm.editor.blocklyWs);
    }, false);

    gm.editor.blocklyWs.addChangeListener(function() {
      if (gm.editor.modeSettings.isTextMode) return;
      if (!gm.editor.canBackup) return;
      if (!gm.editor.backupDB) return;

      gm.editor.canBackup = false;
      setTimeout(function() {
        gm.editor.canBackup = true;
      }, 30000);

      if (gm.editor.modeBackups.length > 5) {
        gm.editor.modeBackups.pop();
      }

      const xml = Blockly.Xml.workspaceToDom(gm.editor.blocklyWs, true);

      const backup = {};
      backup.content = xml.innerHTML;
      backup.isEmpty = xml.getElementsByTagName('block').length == 0;
      backup.settings = gm.editor.modeSettings;
      backup.assets = gm.editor.modeAssets;

      gm.editor.modeBackups.unshift({
        mode: gm.encoding.compressMode(backup).buffer,
        timeStamp: Date.now(),
      });

      const transaction = gm.editor.backupDB.transaction('backups', 'readwrite');
      transaction.objectStore('backups').put(gm.editor.modeBackups, 1);
    });

    gm.editor.headlessBlocklyWs.fireChangeListenerOLD = gm.editor.headlessBlocklyWs.fireChangeListener;
    gm.editor.headlessBlocklyWs.fireChangeListener = function() {
      if (gm.lobby.networkEngine.getLSID() !== gm.lobby.networkEngine.hostID) return;
      return gm.editor.headlessBlocklyWs.fireChangeListenerOLD(...arguments);
    };

    window.blockly = Blockly;
  },
  modeSettingsDefaults: [
    {name: 'modeName', type: 'string', default: 'Custom'},
    {name: 'modeDescription', type: 'string', default: 'Change your mode\'s description on the Game Mode Editor\'s Settings menu (gear icon).'},
    {name: 'baseMode', type: 'string', default: 'any'},
    {name: 'isTextMode', type: 'bool', default: false},
  ],
  modeSettings: {},
  modeAssets: {images: [], sounds: []},
  isInSoundsTab: false,
  resetModeSettings: function() {
    this.modeSettings = {};
    for (let i = 0; i < this.modeSettingsDefaults.length; i++) {
      const setting = this.modeSettingsDefaults[i];

      this.modeSettings[setting.name] = setting.default;
    }
  },
  updateModeSettings: function(xml) {
    this.modeSettings = {};
    for (let i = 0; i < this.modeSettingsDefaults.length; i++) {
      const setting = this.modeSettingsDefaults[i];

      if (setting.type == 'bool') {
        this.modeSettings[setting.name] = xml.getAttribute(setting.name) === 'true' || setting.default;
      } else {
        this.modeSettings[setting.name] = xml.getAttribute(setting.name) || setting.default;
      }
    }
  },
  disableLobbyChatbox: false,
  blockDefs: null,
  blocklyWs: null,
  monacoWs: null,
  modeToImport: null,
  appliedMode: null,
  modeBackups: [],
  canBackup: true,
  changingToTextEditor: false,
  isInTextEditor: false,
  showGMEWindow: function() {
    document.getElementById('gmeditor').style.transform = 'scale(1)';
    document.getElementById('newbonklobby').style.transform = 'scale(0)';

    const blocklyDiv = document.getElementById('gmblocklydiv');
    const monacoDiv = document.getElementById('gmmonacodiv');
    const bounds = document.getElementById('gmworkspacearea').getBoundingClientRect();

    const changeBaseButton = document.getElementById('gmeditor_changebasebutton');
    if (gm.editor.modeSettings.isTextMode) {
      monacoDiv.style.display = 'block';
      gm.editor.blocklyWs.setVisible(false);
      document.getElementById('gmeditor_changebasebutton').classList.add('brownButtonDisabled');
      changeBaseButton.classList.remove('jsIcon');
      changeBaseButton.classList.add('blockIcon');
    } else {
      blocklyDiv.style.visibility = 'visible';
      gm.editor.blocklyWs.setVisible(true);
      document.getElementById('gmeditor_changebasebutton').classList.remove('brownButtonDisabled');
      changeBaseButton.classList.add('jsIcon');
      changeBaseButton.classList.remove('blockIcon');
    }

    blocklyDiv.style.top = bounds.top;
    blocklyDiv.style.left = bounds.left;
    blocklyDiv.style.width = bounds.width;
    blocklyDiv.style.height = bounds.height;
    monacoDiv.style.top = bounds.top;
    monacoDiv.style.left = bounds.left;
    monacoDiv.style.width = bounds.width - 20;
    monacoDiv.style.height = bounds.height - 20;

    gm.editor.monacoWs.layout();
    Blockly.svgResize(gm.editor.blocklyWs);

    gm.editor.disableLobbyChatbox = true;
  },
  hideGMEWindow: function() {
    gm.editor.disableLobbyChatbox = false;

    gm.editor.blocklyWs.setVisible(false);
    document.getElementById('gmmonacodiv').style.display = 'none';
    document.getElementById('gmblocklydiv').style.visibility = 'hidden';
    document.getElementById('gmeditor').style.transform = 'scale(0)';
    document.getElementById('newbonklobby').style.transform = 'scale(1)';
  },
  genericDialog: function(message = '', callback = ()=>{}, showCancel = false, showInput = false, inputValue = '') {
    document.getElementById('gm_blocklydialogcontainer').style.visibility = 'visible';

    document.getElementById('gmblockly_message').innerText = message;
    document.getElementById('gmblockly_promptcontainer').style.display = showInput ? 'block' : 'none';
    if (showInput) document.getElementById('gmblockly_prompt').focus();
    document.getElementById('gmblockly_prompt').value = inputValue;
    document.getElementById('gmblockly_cancel').style.display = showCancel ? 'block' : 'none';

    // it's weird but it works and it looks neat
    // eslint-disable-next-line prefer-const
    let closeDialog;

    const okListener = function() {
      callback(showInput ? document.getElementById('gmblockly_prompt').value : true);
      closeDialog();
    };
    const okInputListener = function(event) {
      if (event.key === 'Enter') {
        callback(showInput ? document.getElementById('gmblockly_prompt').value : true);
        closeDialog();
      }
    };
    const cancelListener = function() {
      callback(showInput ? null : false);
      closeDialog();
    };

    closeDialog = function() {
      document.getElementById('gm_blocklydialogcontainer').style.visibility = 'hidden';
      document.getElementById('gmblockly_ok').removeEventListener('click', okListener);
      document.getElementById('gmblockly_prompt').removeEventListener('keydown', okInputListener);
      document.getElementById('gmblockly_cancel').removeEventListener('click', cancelListener);
    };

    document.getElementById('gmblockly_ok').addEventListener('click', okListener);
    document.getElementById('gmblockly_prompt').addEventListener('keydown', okInputListener);
    document.getElementById('gmblockly_cancel').addEventListener('click', cancelListener);
  },
  GMENew: function() {
    gm.editor.genericDialog('Are you sure you want to delete all blocks, reset mode settings and remove all custom images and sounds?', function(confirmed) {
      if (!confirmed) return;

      gm.editor.blocklyWs.clear();
      gm.editor.GMEChangeEditor(false);
      document.getElementById('gmeditor_changebasebutton').classList.remove('brownButtonDisabled');
      gm.editor.modeAssets = {images: [], sounds: []};
      gm.editor.resetModeSettings();
    }, true);
  },
  GMEImport: function() {
    const input = document.createElement('input');
    input.type = 'file';

    input.onchange = (e) => {
      const file = e.target.files[0];

      const reader = new FileReader();
      reader.readAsArrayBuffer(file);

      reader.onload = (readerEvent) => {
        const content = new dcodeIO.ByteBuffer();
        content.append(readerEvent.target.result);
        const mode = gm.encoding.decompressMode(content);

        document.getElementById('gmexport_name').value = file.name.slice(0, -4);

        if (gm.lobby.networkEngine.getLSID() == gm.lobby.networkEngine.hostID && mode.map) {
          gm.editor.modeToImport = mode;
          document.getElementById('gm_importdialogwindowcontainer').style.visibility = 'visible';
        } else {
          gm.editor.modeAssets = mode.assets;
          gm.editor.modeSettings = mode.settings;

          gm.editor.GMEChangeEditor(gm.editor.modeSettings.isTextMode);
          if (gm.editor.modeSettings.isTextMode) {
            document.getElementById('gmeditor_changebasebutton').classList.add('brownButtonDisabled');
            gm.editor.monacoWs.setValue(mode.content);
          } else {
            document.getElementById('gmeditor_changebasebutton').classList.remove('brownButtonDisabled');
            gm.editor.blocklyWs.clear();

            const xml = document.createElement('xml');
            xml.innerHTML = mode.content;

            Blockly.Xml.domToWorkspace(xml, gm.editor.blocklyWs);
          }
        }
      };
    };

    input.click();
  },
  GMEImportMapCancel: function() {
    document.getElementById('gm_importdialogwindowcontainer').style.visibility = 'hidden';
  },
  GMEImportMapNo: function() {
    gm.editor.blocklyWs.clear();

    const xml = document.createElement('xml');
    xml.innerHTML = gm.editor.modeToImport.content;

    Blockly.Xml.domToWorkspace(xml, gm.editor.blocklyWs);

    document.getElementById('gm_importdialogwindowcontainer').style.visibility = 'hidden';
  },
  GMEImportMapYes: function() {
    const gameSettings = gm.lobby.mpSession.getGameSettings();

    gameSettings.map = MapEncoder.decodeFromDatabase(gm.editor.modeToImport.map);

    gm.lobby.bonkLobby.updateGameSettings(gameSettings);
    gm.lobby.networkEngine.sendMapAdd(gameSettings.map);

    gm.editor.modeAssets = mode.assets;
    gm.editor.modeSettings = mode.settings;

    gm.editor.GMEChangeEditor(gm.editor.modeSettings.isTextMode);
    if (gm.editor.modeSettings.isTextMode) {
      document.getElementById('gmeditor_changebasebutton').classList.add('brownButtonDisabled');
      gm.editor.monacoWs.setValue(gm.editor.modeToImport.content);
    } else {
      document.getElementById('gmeditor_changebasebutton').classList.remove('brownButtonDisabled');
      gm.editor.blocklyWs.clear();

      const xml = document.createElement('xml');
      xml.innerHTML = gm.editor.modeToImport.content;

      Blockly.Xml.domToWorkspace(xml, gm.editor.blocklyWs);
    }

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

    const exported = {};

    exported.assets = gm.editor.modeAssets;
    exported.settings = gm.editor.modeSettings;

    if (exported.settings.isTextMode) {
      exported.content = gm.editor.monacoWs.getValue();
    } else {
      exported.content = Blockly.Xml.workspaceToDom(gm.editor.blocklyWs, true).innerHTML;
    }

    if (attachMap) {
      exported.map = MapEncoder.encodeToDatabase(gm.lobby.mpSession.getGameSettings().map);
    }

    const blob = new Blob([gm.encoding.compressMode(exported).buffer], {type: 'application/octet-stream'});
    saveAs(blob, `${filename}.gmm`);
    document.getElementById('gm_exportwindowcontainer').style.visibility = 'hidden';
  },
  GMEBackupsShow: function() {
    document.getElementById('gm_backupswindowcontainer').style.visibility = 'visible';

    const backupSelect = document.getElementById('gmbackups_backupselect');
    backupSelect.innerHTML = '';
    backupSelect.value = '';

    for (let i = 0; i < gm.editor.modeBackups.length; i++) {
      const option = document.createElement('option');
      option.value = i;
      option.innerText = new Date(gm.editor.modeBackups[i].timeStamp).toLocaleString();

      backupSelect.appendChild(option);
    }
  },
  GMEBackupsCancel: function() {
    document.getElementById('gm_backupswindowcontainer').style.visibility = 'hidden';
  },
  GMEBackupsLoad: function() {
    document.getElementById('gm_backupswindowcontainer').style.visibility = 'hidden';

    const compressedBackup = gm.editor.modeBackups[document.getElementById('gmbackups_backupselect').value].mode;
    if (!compressedBackup) return;

    let backup = new dcodeIO.ByteBuffer();
    backup.append(compressedBackup);
    backup = gm.encoding.decompressMode(backup);

    gm.editor.modeAssets = backup.assets;
    gm.editor.modeSettings = backup.settings;

    gm.editor.GMEChangeEditor(gm.editor.modeSettings.isTextMode);
    if (gm.editor.modeSettings.isTextMode) {
      document.getElementById('gmeditor_changebasebutton').classList.add('brownButtonDisabled');
      gm.editor.monacoWs.setValue(backup.content);
    } else {
      document.getElementById('gmeditor_changebasebutton').classList.remove('brownButtonDisabled');
      gm.editor.blocklyWs.clear();

      const xml = document.createElement('xml');
      xml.innerHTML = backup.content;

      Blockly.Xml.domToWorkspace(xml, gm.editor.blocklyWs);
    }
  },
  GMESettingsShow: function() {
    document.getElementById('gm_settingswindowcontainer').style.visibility = 'visible';

    document.getElementById('gmsettings_modename').value = gm.editor.modeSettings.modeName || gm.editor.modeSettingsDefaults[0].default;
    document.getElementById('gmsettings_modedescription').value = gm.editor.modeSettings.modeDescription || gm.editor.modeSettingsDefaults[1].default;
    document.getElementById('gmsettings_basemode').value = gm.editor.modeSettings.baseMode || gm.editor.modeSettingsDefaults[3].default;

    gm.editor.unsavedModeAssets = JSON.parse(JSON.stringify(gm.editor.modeAssets));

    gm.editor.GMESettingsChangeTab(gm.editor.isInSoundsTab);
  },
  GMESettingsCancel: function() {
    gm.audio.stopAllSounds();
    document.getElementById('gm_settingswindowcontainer').style.visibility = 'hidden';
  },
  GMESettingsSave: function() {
    gm.editor.modeSettings.modeName = document.getElementById('gmsettings_modename').value.substring(0, 12);
    gm.editor.modeSettings.modeDescription = document.getElementById('gmsettings_modedescription').value.substring(0, 500);
    gm.editor.modeSettings.baseMode = document.getElementById('gmsettings_basemode').value;

    gm.editor.modeAssets = gm.editor.unsavedModeAssets;
    gm.audio.stopAllSounds();

    document.getElementById('gm_settingswindowcontainer').style.visibility = 'hidden';
  },
  GMESettingsChangeTab: function(toSounds) {
    const assetList = document.getElementById('gmsettings_assetlist');

    assetList.innerHTML = '';

    if (toSounds) {
      this.isInSoundsTab = true;
      document.getElementById('gmsettings_imagestab').classList.add('inactive');
      document.getElementById('gmsettings_soundstab').classList.remove('inactive');

      for (let i = 0; i < gm.editor.unsavedModeAssets.sounds.length; i++) {
        if (!gm.editor.unsavedModeAssets.sounds[i]) continue;

        const soundOrder = i;
        const soundDef = gm.editor.unsavedModeAssets.sounds[i];
        const soundItem = gm.editor.settingsImageItem.cloneNode(true);

        const soundPlayer = soundItem.getElementsByClassName('gm_listitemimage')[0];
        let soundPlayerHowl = null;
        soundPlayer.classList.add('play');
        soundPlayer.addEventListener('click', function() {
          if (soundPlayerHowl) {
            soundPlayer.classList.remove('stop');
            soundPlayer.classList.add('play');
            soundPlayerHowl.unload();
            soundPlayerHowl = null;
          } else {
            soundPlayer.classList.add('stop');
            soundPlayer.classList.remove('play');
            soundPlayerHowl = new Howl({
              src: 'data:audio/' + soundDef.extension + ';base64,' + soundDef.data,
              volume: 1,
            });
            soundPlayerHowl.on('end', function() {
              soundPlayer.classList.remove('stop');
              soundPlayer.classList.add('play');
              soundPlayerHowl.unload();
              soundPlayerHowl = null;
            });
            soundPlayerHowl.play();
          }
        });

        soundItem.getElementsByClassName('gm_listitemname')[0].value = soundDef.id;
        soundItem.getElementsByClassName('gm_listitemdetail')[0].innerText = soundDef.detail;
        soundItem.getElementsByClassName('gm_listitemname')[0].addEventListener('change', function() {
          gm.editor.unsavedModeAssets.sounds[soundOrder].id = soundItem.getElementsByClassName('gm_listitemname')[0].value;
        });
        soundItem.getElementsByClassName('gmeditor_delete')[0].addEventListener('click', function() {
          gm.editor.unsavedModeAssets.sounds[soundOrder] = null;
          document.getElementById('gmsettings_assetlist').removeChild(soundItem);
        });
        soundItem.getElementsByClassName('gmeditor_download')[0].addEventListener('click', function() {
          saveAs('data:audio/' + soundDef.extension + ';base64,' + soundDef.data, soundItem.getElementsByClassName('gm_listitemname')[0].value + '.' + soundDef.extension);
        });

        document.getElementById('gmsettings_assetlist').appendChild(soundItem);
      }
    } else {
      this.isInSoundsTab = false;
      document.getElementById('gmsettings_imagestab').classList.remove('inactive');
      document.getElementById('gmsettings_soundstab').classList.add('inactive');

      for (let i = 0; i < gm.editor.unsavedModeAssets.images.length; i++) {
        if (!gm.editor.unsavedModeAssets.images[i]) continue;

        const imageOrder = i;
        const imageDef = gm.editor.unsavedModeAssets.images[i];
        const imageItem = gm.editor.settingsImageItem.cloneNode(true);

        imageItem.getElementsByClassName('gm_listitemimage')[0].src = 'data:image/' + imageDef.extension + ';base64,' + imageDef.data;
        imageItem.getElementsByClassName('gm_listitemname')[0].value = imageDef.id;
        imageItem.getElementsByClassName('gm_listitemdetail')[0].innerText = imageDef.detail;
        imageItem.getElementsByClassName('gm_listitemname')[0].addEventListener('change', function() {
          gm.editor.unsavedModeAssets.images[imageOrder].id = imageItem.getElementsByClassName('gm_listitemname')[0].value;
        });
        imageItem.getElementsByClassName('gmeditor_delete')[0].addEventListener('click', function() {
          gm.editor.unsavedModeAssets.images[imageOrder] = null;
          document.getElementById('gmsettings_assetlist').removeChild(imageItem);
        });
        imageItem.getElementsByClassName('gmeditor_download')[0].addEventListener('click', function() {
          saveAs('data:image/' + imageDef.extension + ';base64,' + imageDef.data, imageItem.getElementsByClassName('gm_listitemname')[0].value + '.' + imageDef.extension);
        });

        document.getElementById('gmsettings_assetlist').appendChild(imageItem);
      }
    }
  },
  GMESettingsImportAsset: function() {
    const input = document.createElement('input');
    input.type = 'file';

    input.onchange = (e) => {
      const file = e.target.files[0];

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (readerEvent) => {
        const extension = file.type.slice(file.type.lastIndexOf('/') + 1);
        const name = file.name.slice(0, file.name.lastIndexOf('.'));
        const data = readerEvent.target.result.replace(/[^,]+,/, '');

        // get human readable file size
        let size = file.size;
        let sizeUnit = 'B';

        if (size >= 1024) {
          size /= 1024;
          sizeUnit = 'KiB';
        }
        if (size >= 1024) {
          size /= 1024;
          sizeUnit = 'MiB';
        }

        size = Math.round(size * 10) / 10 + sizeUnit;

        if (gm.editor.isInSoundsTab) {
          // create new sound asset
          const soundAsset = {};
          soundAsset.id = name;
          soundAsset.data = data;
          soundAsset.dataHash = md5(data);
          soundAsset.extension = extension;
          soundAsset.detail = size;

          const soundOrder = gm.editor.unsavedModeAssets.sounds.length;
          gm.editor.unsavedModeAssets.sounds.push(soundAsset);

          // create new sound item
          const soundItem = gm.editor.settingsImageItem.cloneNode(true);

          const soundPlayer = soundItem.getElementsByClassName('gm_listitemimage')[0];
          let soundPlayerHowl = null;
          soundPlayer.classList.add('play');
          soundPlayer.addEventListener('click', function() {
            if (soundPlayerHowl) {
              soundPlayer.classList.remove('stop');
              soundPlayer.classList.add('play');
              soundPlayerHowl.unload();
              soundPlayerHowl = null;
            } else {
              soundPlayer.classList.add('stop');
              soundPlayer.classList.remove('play');
              soundPlayerHowl = new Howl({
                src: 'data:audio/' + extension + ';base64,' + data,
                volume: 1,
              });
              soundPlayerHowl.on('end', function() {
                soundPlayer.classList.remove('stop');
                soundPlayer.classList.add('play');
                soundPlayerHowl.unload();
                soundPlayerHowl = null;
              });
              soundPlayerHowl.play();
            }
          });

          soundItem.getElementsByClassName('gm_listitemname')[0].value = name;
          soundItem.getElementsByClassName('gm_listitemdetail')[0].innerText = size;
          soundItem.getElementsByClassName('gm_listitemname')[0].addEventListener('change', function() {
            gm.editor.unsavedModeAssets.sounds[soundOrder].id = soundItem.getElementsByClassName('gm_listitemname')[0].value;
          });
          soundItem.getElementsByClassName('gmeditor_delete')[0].addEventListener('click', function() {
            gm.editor.unsavedModeAssets.sounds[soundOrder] = null;
            document.getElementById('gmsettings_assetlist').removeChild(soundItem);
          });
          soundItem.getElementsByClassName('gmeditor_download')[0].addEventListener('click', function() {
            saveAs('data:audio/' + extension + ';base64,' + data, soundItem.getElementsByClassName('gm_listitemname')[0].value + '.' + extension);
          });

          document.getElementById('gmsettings_assetlist').appendChild(soundItem);
        } else {
          // get image resolution
          const image = new Image();

          image.src = readerEvent.target.result;
          image.onload = function() {
            const resolution = image.width + 'x' + image.height;
            const detail = size + ', ' + resolution;

            // create new image asset
            const imageAsset = {};
            imageAsset.id = name;
            imageAsset.data = data;
            imageAsset.dataHash = md5(data);
            imageAsset.extension = extension;
            imageAsset.detail = detail;

            const imageOrder = gm.editor.unsavedModeAssets.images.length;
            gm.editor.unsavedModeAssets.images.push(imageAsset);

            // create new image item
            const imageItem = gm.editor.settingsImageItem.cloneNode(true);

            imageItem.getElementsByClassName('gm_listitemimage')[0].src = 'data:image/' + extension + ';base64,' + data;
            imageItem.getElementsByClassName('gm_listitemname')[0].value = name;
            imageItem.getElementsByClassName('gm_listitemdetail')[0].innerText = detail;
            imageItem.getElementsByClassName('gm_listitemname')[0].addEventListener('change', function() {
              gm.editor.unsavedModeAssets.images[imageOrder].id = imageItem.getElementsByClassName('gm_listitemname')[0].value;
            });
            imageItem.getElementsByClassName('gmeditor_delete')[0].addEventListener('click', function() {
              gm.editor.unsavedModeAssets.images[imageOrder] = null;
              document.getElementById('gmsettings_assetlist').removeChild(imageItem);
            });
            imageItem.getElementsByClassName('gmeditor_download')[0].addEventListener('click', function() {
              saveAs('data:image/' + extension + ';base64,' + data, imageItem.getElementsByClassName('gm_listitemname')[0].value + '.' + extension);
            });

            document.getElementById('gmsettings_assetlist').appendChild(imageItem);
          };
        }
      };
    };

    input.click();
  },
  GMEChangeEditor: function(toTextEditor) {
    // this function is the chazziest thing ever
    const blocklyDiv = document.getElementById('gmblocklydiv');
    const monacoDiv = document.getElementById('gmmonacodiv');
    const moveToTextEditor = typeof toTextEditor === 'boolean' ? toTextEditor : !gm.editor.isInTextEditor;
    const changeBaseButton = document.getElementById('gmeditor_changebasebutton');

    if (moveToTextEditor) {
      gm.editor.isInTextEditor = true;
      gm.editor.changingToTextEditor = true;
      monacoDiv.style.display = 'block';
      blocklyDiv.style.visibility = 'hidden';
      gm.editor.monacoWs.layout();
      gm.editor.monacoWs.setValue(gm.editor.generateCode());
      changeBaseButton.classList.remove('jsIcon');
      changeBaseButton.classList.add('blockIcon');
    } else {
      gm.editor.isInTextEditor = false;
      blocklyDiv.style.visibility = 'visible';
      monacoDiv.style.display = 'none';
      gm.editor.monacoWs.layout();
      changeBaseButton.classList.remove('blockIcon');
      changeBaseButton.classList.add('jsIcon');
    }
  },
  GMESave: function() {
    if (gm.lobby.networkEngine.getLSID() !== gm.lobby.networkEngine.hostID) return;

    gm.editor.resetAll();

    const saved = {};

    // generate events in host and save content and isEmpty into the mode
    if (gm.editor.modeSettings.isTextMode) {
      try {
        gm.state.generateEvents(gm.editor.monacoWs.getValue());
      } catch (e) {
        alert(`An error ocurred while trying to save. Please send SneezingCactus a full screenshot of the console (Ctrl+Shift+I, go to the Console tab) so this error can be diagnosed.`);
        throw (e);
      }

      const content = gm.editor.monacoWs.getValue();

      saved.content = content;
      saved.isEmpty = content == '';
    } else {
      try {
        gm.state.generateEvents(gm.editor.generateCode());
      } catch (e) {
        alert(`An error ocurred while trying to save. Please send SneezingCactus a full screenshot of the console (Ctrl+Shift+I, go to the Console tab) so this error can be diagnosed.`);
        throw (e);
      }

      const content = Blockly.Xml.workspaceToDom(gm.editor.blocklyWs, true);

      saved.content = content.innerHTML;
      saved.isEmpty = content.getElementsByTagName('block').length == 0;
    }

    saved.settings = gm.editor.modeSettings;
    saved.assets = gm.editor.modeAssets;

    gm.graphics.preloadImages(saved.assets.images);
    gm.audio.preloadSounds(saved.assets.sounds);

    gm.editor.appliedMode = saved;

    gm.lobby.sendMode(saved);

    if (saved.settings.baseMode && saved.settings.baseMode !== 'any') {
      gm.lobby.networkEngine.sendGAMO('b', saved.settings.baseMode);
      gm.lobby.mpSession.getGameSettings().ga = 'b';
      gm.lobby.mpSession.getGameSettings().mo = saved.settings.baseMode;
    }

    gm.lobby.bonkLobby.updateGameSettings();
    gm.editor.hideGMEWindow();
  },
  generateCode: function() {
    const workspace = gm.lobby.networkEngine.getLSID() === gm.lobby.networkEngine.hostID ? gm.editor.blocklyWs : gm.editor.headlessBlocklyWs;
    const topBlocks = workspace.getTopBlocks();
    let code = '';

    Blockly.JavaScript.init(workspace);

    for (let i = 0; i != topBlocks.length; i++) {
      if (!topBlocks[i].type.startsWith('on_') && !topBlocks[i].type.startsWith('procedures_def')) continue;

      code += Blockly.JavaScript.blockToCode(topBlocks[i]) + '\n';
    }

    code = Blockly.JavaScript.finish(code);
    code = code.replace('\n\n\n', '');
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

      xpos = gm.editor.funcs.getScreenPos(xpos);
      ypos = gm.editor.funcs.getScreenPos(ypos);
      radius = gm.editor.funcs.getScreenPos(radius);

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

      xpos = gm.editor.funcs.getScreenPos(xpos);
      ypos = gm.editor.funcs.getScreenPos(ypos);
      width = gm.editor.funcs.getScreenPos(width) / 2;
      height = gm.editor.funcs.getScreenPos(height) / 2;

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

      xpos1 = gm.editor.funcs.getScreenPos(xpos1);
      ypos1 = gm.editor.funcs.getScreenPos(ypos1);
      xpos2 = gm.editor.funcs.getScreenPos(xpos2);
      ypos2 = gm.editor.funcs.getScreenPos(ypos2);
      width = gm.editor.funcs.getScreenPos(width);

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
        vertexes[i] = gm.editor.funcs.getScreenPos(typeof vertexes[i] === 'number' ? vertexes[i] : 0);

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
        reusedText.x = gm.editor.funcs.getScreenPos(xpos);
        reusedText.y = gm.editor.funcs.getScreenPos(ypos);
        reusedText.text = str;
        reusedText.style.fill = color;
        reusedText.alpha = alpha / 100;
        reusedText.style.fontSize = gm.editor.funcs.getScreenPos(size);
        reusedText.usedBy = discID;

        if (centered) {
          reusedText.anchor.set(0.5, 0);
        } else {
          reusedText.anchor.set(0, 0);
        }
      } else {
        const text = new PIXI.Text(str, {
          fontFamily: 'futurept_medium',
          fontSize: gm.editor.funcs.getScreenPos(size),
          fill: color,
          align: 'center',
          dropShadow: true,
          dropShadowDistance: 3,
          dropShadowAlpha: 0.30,
        });

        graphics.addChild(text);

        text.resolution = 2;
        text.x = gm.editor.funcs.getScreenPos(xpos);
        text.y = gm.editor.funcs.getScreenPos(ypos);
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
        const screenGraphics = gm.graphics.additionalScreenGraphics[discID];

        if (discGraphics && !discGraphics._destroyed) discGraphics.clear();
        if (worldGraphics && !worldGraphics._destroyed) worldGraphics.clear();
        if (screenGraphics && !screenGraphics._destroyed) screenGraphics.clear();

        if (discGraphics) discGraphics.removeChildren();
        if (worldGraphics) worldGraphics.removeChildren();
        if (screenGraphics) screenGraphics.removeChildren();

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
          const screenGraphics = gm.graphics.additionalScreenGraphics[i];

          if (discGraphics && !discGraphics._destroyed) discGraphics.clear();
          if (worldGraphics && !worldGraphics._destroyed) worldGraphics.clear();
          if (screenGraphics && !screenGraphics._destroyed) screenGraphics.clear();

          if (discGraphics) discGraphics.removeChildren();
          if (worldGraphics) worldGraphics.removeChildren();
          if (screenGraphics) screenGraphics.removeChildren();

          while (gm.graphics.usedText.length > 0) {
            gm.graphics.availableText.push(gm.graphics.usedText.pop());
          }
        }
      }
    },
    getScreenPos: function(value) {
      return value * gm.state.gameState.physics.ppm;
    },
    setPlayerProperty: function(gameState, discID, property, value) {
      if (gm.graphics.rendering) return;
      if (value === null || value === undefined || !Number.isFinite(value) || Number.isNaN(value)) return;
      if (gameState.discs[discID]) {
        gameState.discs[discID][property] = value;
      }
    },
    changePlayerProperty: function(gameState, discID, property, value) {
      if (gm.graphics.rendering) return;
      if (value === null || value === undefined || !Number.isFinite(value) || Number.isNaN(value)) return;
      if (gameState.discs[discID]) {
        gameState.discs[discID][property] += value;
      }
    },
    getPlayerProperty: function(gameState, discID, property) {
      if (gameState.discs[discID] && !(!gameState.discs[discID][property] && gameState.discs[discID][property] !== 0)) {
        return gameState.discs[discID][property];
      } else {
        return Infinity;
      }
    },
    setArrowProperty: function(gameState, discID, arrowID, property, value) {
      if (gm.graphics.rendering) return;
      if (value === null || value === undefined || !Number.isFinite(value) || Number.isNaN(value)) return;

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
    },
    setAllArrowsProperty: function(gameState, discID, property, value) {
      if (gm.graphics.rendering) return;
      if (value === null || value === undefined || !Number.isFinite(value) || Number.isNaN(value)) return;

      const projs = gameState.projectiles;

      for (let i = 0; i !== projs.length; i++) {
        if (projs[i] && projs[i].did === discID) {
          gameState.projectiles[i][property] = value;
        }
      }
    },
    changeArrowProperty: function(gameState, discID, arrowID, property, value) {
      if (gm.graphics.rendering) return;
      if (value === null || value === undefined || !Number.isFinite(value) || Number.isNaN(value)) return;
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
    },
    changeAllArrowsProperty: function(gameState, discID, property, value) {
      if (gm.graphics.rendering) return;
      if (value === null || value === undefined || !Number.isFinite(value) || Number.isNaN(value)) return;

      const projs = gameState.projectiles;

      for (let i = 0; i !== projs.length; i++) {
        if (projs[i] && projs[i].did === discID) {
          gameState.projectiles[i][property] += value;
        }
      }
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
      if (gm.graphics.rendering) return;
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
      if (gm.graphics.rendering) return;
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
      if (gm.graphics.rendering) return;
      if (value === null || value === undefined || !Number.isFinite(value) || Number.isNaN(value)) return;

      const cameras = gameState.gmExtra.cameras;

      // convert degrees to radians
      if (property === 'angle') value *= (Math.PI / 180);
      if (property === 'xskew' || property === 'yskew') value *= (Math.PI / -180);

      if (discID !== null && cameras[discID]) {
        cameras[discID][property] = value;
      } else {
        for (let i = 0; i < cameras.length; i++) {
          if (!cameras[i]) continue;

          cameras[i][property] = value;
        }
      }

      gameState.gmExtra.cameras = cameras;
      gameState.gmExtra.cameraChanged = true;
    },
    changeCameraProperty: function(gameState, discID, property, value) {
      if (gm.graphics.rendering) return;
      if (value === null || value === undefined || !Number.isFinite(value) || Number.isNaN(value)) return;

      const cameras = gameState.gmExtra.cameras;

      // convert degrees to radians
      if (property === 'angle') value *= (Math.PI / 180);
      if (property === 'xskew' || property === 'yskew') value *= (Math.PI / -180);

      if (discID !== null && cameras[discID]) {
        cameras[discID][property] += value;
      } else {
        for (let i = 0; i < cameras.length; i++) {
          if (!cameras[i]) continue;

          cameras[i][property] += value;
        }
      }

      gameState.gmExtra.cameras = cameras;
      gameState.gmExtra.cameraChanged = true;
    },
    getCameraProperty: function(gameState, discID, property) {
      if (!gameState.gmExtra.cameras[discID]) return Infinity;

      // convert degrees to radians
      if (property === 'angle') return gameState.gmExtra.cameras[discID][property] * (Math.PI / 180);
      if (property === 'xskew' || property === 'yskew') return gameState.gmExtra.cameras[discID][property] * (Math.PI / -180);

      return gameState.gmExtra.cameras[discID][property];
    },
    enableCameraLerp: function(gameState, enable, discID) {
      if (gm.graphics.rendering) return;
      if (!gameState.gmExtra.cameras[discID]) return;

      gameState.gmExtra.cameras[discID].doLerp = enable;
    },
    enableDeathBarrier: function(gameState, enable) {
      if (gm.graphics.rendering) return;

      gameState.gmExtra.disableDeathBarrier = !enable;
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
        gm.editor.funcs.setVar(pointXVar, gameState, discID, theChosenOne.point.x);
        gm.editor.funcs.setVar(pointYVar, gameState, discID, theChosenOne.point.y);
        gm.editor.funcs.setVar(normalXVar, gameState, discID, theChosenOne.normal.x);
        gm.editor.funcs.setVar(normalYVar, gameState, discID, theChosenOne.normal.y);

        const fixtureData = theChosenOne.fixture.GetBody().GetUserData();

        gm.editor.funcs.setVar(objectTypeVar, gameState, discID, fixtureData.type == 'phys' ? 'platform' : 'player');
        gm.editor.funcs.setVar(objectIdVar, gameState, discID, fixtureData.discID ?? fixtureData.arrayID);
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
      if (gameState.gmExtra.overrides && !gameState.gmExtra.overrides[discID]) {
        gameState.gmExtra.overrides[discID] = {};
      } else if (!gameState.gmExtra.overrides) {
        gameState.gmExtra.overrides = [];
        gameState.gmExtra.overrides[discID] = {};
      }

      gameState.gmExtra.overrides[discID][input] = value;
    },
    killPlayer: function(gameState, discID, allowRespawn) {
      if (gm.graphics.rendering) return;
      if (gameState.gmExtra.kills && !gameState.gmExtra.kills.includes(discID)) {
        gameState.gmExtra.kills.push({id: discID, allowRespawn: allowRespawn});
      } else if (!gameState.gmExtra.kills) {
        gameState.gmExtra.kills = [];
        gameState.gmExtra.kills.push({id: discID, allowRespawn: allowRespawn});
      }
    },
    createRectShape: function(color, xpos, ypos, width, height, angle, noPhys, noGrap, inGrap, death) {
      color = parseInt(color.slice(1), 16);

      if (!Number.isFinite(xpos) || Number.isNaN(xpos) || xpos === undefined || xpos === null) return;
      if (!Number.isFinite(ypos) || Number.isNaN(ypos) || ypos === undefined || ypos === null) return;
      if (!Number.isFinite(width) || Number.isNaN(width) || width === undefined || width === null) return;
      if (!Number.isFinite(height) || Number.isNaN(height) || height === undefined || height === null) return;
      if (!Number.isFinite(angle) || Number.isNaN(angle) || angle === undefined || angle === null) return;

      return {shape: {'type': 'bx', 'w': width, 'h': height, 'c': [xpos, ypos], 'a': angle, 'sk': false}, fixture: {'sh': -1, 'n': 'gmmaker', 'fr': null, 'fp': null, 're': null, 'de': null, 'f': color, 'd': death, 'np': noPhys, 'ng': noGrap, 'ig': inGrap}};
    },
    createCircleShape: function(color, xpos, ypos, radius, noPhys, noGrap, inGrap, death) {
      color = parseInt(color.slice(1), 16);

      if (!Number.isFinite(xpos) || Number.isNaN(xpos) || xpos === undefined || xpos === null) return;
      if (!Number.isFinite(ypos) || Number.isNaN(ypos) || ypos === undefined || ypos === null) return;
      if (!Number.isFinite(radius) || Number.isNaN(radius) || radius === undefined || radius === null) return;

      return {shape: {'type': 'ci', 'r': radius, 'c': [xpos, ypos], 'sk': false}, fixture: {'sh': -1, 'n': 'gmmaker', 'fr': null, 'fp': null, 're': null, 'de': null, 'f': color, 'd': death, 'np': noPhys, 'ng': noGrap, 'ig': inGrap}};
    },
    createPolyShape: function(color, xpos, ypos, vertexList, angle, scale, noPhys, noGrap, inGrap, death) {
      color = parseInt(color.slice(1), 16);

      if (!Number.isFinite(xpos) || Number.isNaN(xpos) || xpos === undefined || xpos === null) return;
      if (!Number.isFinite(ypos) || Number.isNaN(ypos) || ypos === undefined || ypos === null) return;
      if (!Number.isFinite(angle) || Number.isNaN(angle) || angle === undefined || angle === null) return;
      if (!Number.isFinite(scale) || Number.isNaN(scale) || scale === undefined || scale === null) return;

      const actualVertexList = [];
      for (let i = 0; i < vertexList.length; i += 2) {
        let vertXPos = vertexList[i];
        let vertYPos = vertexList[i + 1];

        if (!Number.isFinite(vertXPos) || Number.isNaN(vertXPos) || vertXPos === undefined || vertXPos === null) return;
        if (!Number.isFinite(vertYPos) || Number.isNaN(vertYPos) || vertYPos === undefined || vertYPos === null) return;

        vertXPos = vertexList[i] * Math.cos(angle) - vertexList[i + 1] * Math.sin(angle);
        vertYPos = vertexList[i] * Math.sin(angle) + vertexList[i + 1] * Math.cos(angle);

        vertXPos = vertXPos * scale + xpos;
        vertYPos = vertYPos * scale + ypos;

        actualVertexList.push([vertXPos, vertYPos]);
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
      if (gameState.physics.bodies[platID] && !gameState.physics.bodies[platID].cf.deleted) {
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
      if (gm.graphics.rendering) return;
      if (value === null || value === undefined || (!Number.isFinite(value) && typeof value === 'number') || Number.isNaN(value)) return;

      const body = gameState.physics.bodies[platID];
      const boolProps = ['fricp', 'f_p', 'f_1', 'f_2', 'f_3', 'f_4'];
      if (body && !body.cf.deleted) {
        switch (property) {
          case 'p_x':
            body.p[0] = Number.isNaN(parseFloat(value)) ? body.p[0] : parseFloat(value);
            break;
          case 'p_y':
            body.p[1] = Number.isNaN(parseFloat(value)) ? body.p[1] : parseFloat(value);
            break;
          case 'lv_x':
            body.lv[0] = Number.isNaN(parseFloat(value)) ? body.lv[0] : parseFloat(value);
            break;
          case 'lv_y':
            body.lv[1] = Number.isNaN(parseFloat(value)) ? body.lv[1] : parseFloat(value);
            break;
        }
        if (boolProps.includes(property)) {
          body[property] = value === true;
        } else if (body[property] !== undefined) {
          body[property] = Number.isNaN(parseFloat(value)) ? body[property] : parseFloat(value);
        }
        gameState.physics.bodies[platID] = body;
      }
    },
    changePlatformProperty: function(gameState, platID, property, value) {
      if (gm.graphics.rendering) return;
      if (value === null || value === undefined || (!Number.isFinite(value) && typeof value === 'number') || Number.isNaN(value)) return;

      const body = gameState.physics.bodies[platID];
      if (body && !body.cf.deleted) {
        switch (property) {
          case 'p_x':
            body.p[0] += Number.isNaN(parseFloat(value)) ? 0 : parseFloat(value);
            break;
          case 'p_y':
            body.p[1] += Number.isNaN(parseFloat(value)) ? 0 : parseFloat(value);
            break;
          case 'lv_x':
            body.lv[0] += Number.isNaN(parseFloat(value)) ? 0 : parseFloat(value);
            break;
          case 'lv_y':
            body.lv[1] += Number.isNaN(parseFloat(value)) ? 0 : parseFloat(value);
            break;
        }
        if (body[property] !== undefined) {
          body[property] += Number.isNaN(parseFloat(value)) ? 0 : parseFloat(value);
        }
        gameState.physics.bodies[platID] = body;
      }
    },
    getPlatformProperty: function(gameState, platID, property) {
      const body = gameState.physics.bodies[platID];
      if (body && !body.cf.deleted) {
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
      if (gm.graphics.rendering) return;
      if (value === null || value === undefined || (!Number.isFinite(value) && typeof value === 'number') || Number.isNaN(value)) return;

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
    },
    changeShapeProperty: function(gameState, platID, shapeID, property, value) {
      if (gm.graphics.rendering) return;
      if (value === null || value === undefined || (!Number.isFinite(value) && typeof value === 'number') || Number.isNaN(value)) return;

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
    },
    getShapeProperty: function(gameState, platID, shapeID, property) {
      const fixture = gameState.physics.fixtures[gameState.physics.bodies[platID]?.fx[shapeID - 1]];
      const shape = gameState.physics.shapes[fixture?.sh];
      if (fixture && property.startsWith('f_')) {
        if (property === 'f_f') {
          return gm.editor.funcs.parseColour(fixture.f.toString(16));
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
      if (gm.graphics.rendering) return;
      if (gameState.physics.bodies[platID] && gameState.physics.bodies[platID].fx !== 0 && !gameState.physics.bodies[platID].cf.gmDeleted) {
        gameState.physics.bodies[platID].fx = [];
        gameState.physics.bodies[platID].type = 's';
        gameState.physics.bodies[platID].cf.deleted = true;


        if (!gm.graphics.renderUpdates[gameState.rl]) gm.graphics.renderUpdates[gameState.rl] = [];
        gm.graphics.renderUpdates[gameState.rl].push({action: 'delete', id: platID});
      }
    },
    deleteShape: function(gameState, platID, shapeID) {
      if (gm.graphics.rendering) return;
      if (gameState.physics.bodies[platID] && gameState.physics.bodies[platID].fx[shapeID - 1] !== undefined) {
        if (!gm.graphics.renderUpdates[gameState.rl]) gm.graphics.renderUpdates[gameState.rl] = [];
        gm.graphics.renderUpdates[gameState.rl].push({action: 'update', id: platID});
        gameState.physics.bodies[platID].fx.splice(shapeID - 1, 1);
      }
    },
    addShape: function(gameState, platID, shape) {
      if (gm.graphics.rendering) return;
      if (!gameState.physics.bodies[platID] || !shape || !shape.shape.type) return;

      const shIndex = gameState.physics.shapes.length;
      gameState.physics.shapes.push(shape.shape);
      const fxIndex = gameState.physics.fixtures.length;
      gameState.physics.fixtures.push(shape.fixture);

      gameState.physics.fixtures[fxIndex].sh = shIndex;

      gameState.physics.bodies[platID].fx.push(fxIndex);


      if (!gm.graphics.renderUpdates[gameState.rl]) gm.graphics.renderUpdates[gameState.rl] = [];
      gm.graphics.renderUpdates[gameState.rl].push({action: 'update', id: platID});
    },
    playSound: function(gameState, panType, soundName, volume, panning) {
      panning = Number(panning);
      volume = Number(volume);

      if (!Number.isFinite(volume) || volume === null || Number.isNaN(volume)) return;
      if (!Number.isFinite(panning) || panning === null || Number.isNaN(panning)) return;

      if (soundName == 'discDeath') soundName += Math.floor(gm.state.pseudoRandom() * 2.999);

      if (panType === 'world') {
        const cameraObj = gameState.gmExtra?.cameras[gm.lobby.networkEngine?.getLSID()];
        const ppm = gameState.physics.ppm;
        if (!cameraObj) return;

        panning = panning / (365 / ppm) - 1;
        panning += ((-cameraObj.xpos + 730 / ppm) * cameraObj.xscal) / (365 / ppm) - 1;
      }

      panning = Math.max(Math.min(panning, 1), -1);

      window.BonkUtils.soundManager.playSound(soundName, panning, volume);
    },
    setVar: function(varName, gameState, discID, value) {
      if (value === null || value === undefined) return;

      if (varName.startsWith('GLOBAL_')) {
        gameState.gmExtra.variables.global[varName] = value;
      } else if (gameState.gmExtra.variables[discID]) {
        gameState.gmExtra.variables[discID][varName] = value;
      }
    },
    changeVar: function(varName, gameState, discID, value) {
      if (value === null || value === undefined) return;

      if (varName.startsWith('GLOBAL_')) {
        if (!gameState.gmExtra.variables.global[varName]) gameState.gmExtra.variables.global[varName] = 0;
        gameState.gmExtra.variables.global[varName] += value;
      } else if (gameState.gmExtra.variables[discID]) {
        const theVar = gameState.gmExtra.variables[discID][varName];
        if (theVar === null || theVar === undefined) gameState.gmExtra.variables[discID][varName] = 0;
        gameState.gmExtra.variables[discID][varName] += value;
      }
    },
    keepVar: function(varName, gameState) {
      if (!gameState.gmExtra.keepVariables.includes(varName)) {
        gameState.gmExtra.keepVariables.push(varName);
      }
    },
    getVar: function(varName, gameState, discID) {
      if (varName.startsWith('GLOBAL_') && gameState.gmExtra.variables.global?.[varName] != null) {
        return gameState.gmExtra.variables.global[varName];
      } else if (!varName.startsWith('GLOBAL_') && gameState.gmExtra.variables[discID]?.[varName] != null) {
        return gameState.gmExtra.variables[discID][varName];
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
  resetAll: function() {
    gm.state.resetSES();
  },
};
