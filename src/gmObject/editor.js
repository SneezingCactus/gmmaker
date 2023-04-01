/* eslint-disable no-invalid-this */
/* eslint-disable camelcase */
/* eslint-disable new-cap */

// blockly libs
import Blockly from 'blockly';
import * as LexicalVariables from '@mit-app-inventor/blockly-block-lexical-variables';
import {WorkspaceSearch} from '@blockly/plugin-workspace-search';
import '@blockly/field-colour-hsv-sliders';
import {javascriptGenerator} from 'blockly/javascript';
import toolbox from '../blockly/toolbox.xml';
import blockDefs from '../blockly/blockdefs.js';
import defineComplexBlocks from '../blockly/complexblockdefs.js';
import defineBlockCode from '../blockly/blockfuncs.js';
import defineBlockValidators from '../blockly/blockvalidators.js';
import afterWsPatches from '../blockly/afterwspatches.js';
import gmBlockRenderer from '../blockly/renderer.js';

// text libs
import * as monaco from 'monaco-editor';
import monacoWorker from '../monaco/editor.worker.raw.js';
import monacoTypescript from '../monaco/ts.worker.raw.js';
import monacoDefs from '!raw-loader!../monaco/gmm.d.ts';
import monacoDefSnippets from '../monaco/snippets.js';

// misc
import windowHtml from '../gmWindow/window.html';
import {saveAs} from 'file-saver';
import md5 from 'md5';
import {Parser as acorn} from 'acorn';
import bowser from 'bowser';
import prettier from 'prettier';
import prettierBabel from 'prettier/parser-babel';

export default {
  init: function() {
    window.blockly = Blockly;
    window.blocklyJsGen = javascriptGenerator;
    this.blockDefs = blockDefs;
    this.initGMEditor();
    this.resetModeSettings();
  },
  configApply: function(config) {
    // monaco settings
    this.monacoWs._themeService.setTheme(
      config.editor.darkWorkspace ? 'vs-dark' : 'vs');
    this.monacoWs.updateOptions({
      wordWrap: config.editor.wordWrap ? 'on' : 'off',
      fontSize: config.editor.fontSize,
      minimap: {
        enabled: config.editor.showMinimap,
      },
    });

    // blockly settings
    this.blocklyWs.setTheme(
      config.editor.darkWorkspace ? this.darkTheme : this.lightTheme);

    if (config.editor.darkWorkspace) {
      this.blocklyWs.grid.line1.setAttribute('stroke', '#555');
      this.blocklyWs.grid.line2.setAttribute('stroke', '#555');
    } else {
      this.blocklyWs.grid.line1.setAttribute('stroke', '#ccc');
      this.blocklyWs.grid.line2.setAttribute('stroke', '#ccc');
    }

    if (config.editor.showGrid) {
      this.blocklyWs.grid.pattern.style.visibility = 'visible';
      this.blocklyWs.grid.snapToGrid = true;
    } else {
      this.blocklyWs.grid.pattern.style.visibility = 'hidden';
      this.blocklyWs.grid.snapToGrid = false;
    }
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
    GMOpenButton.className = 'newbonklobby_settings_button brownButton brownButton_classic buttonShadow gmeditor_iconbutton';
    GMOpenButton.addEventListener('click', gm.editor.showGMEWindow);

    // ensure compatibility with bonk-host
    if (window.bonkHost && !window.bonkHost.modeDropdownCreated) {
      window.bonkHost.createModeDropdownOLD = window.bonkHost.createModeDropdown;
      window.bonkHost.createModeDropdown = function() {
        window.bonkHost.createModeDropdownOLD();
        document.getElementById('newbonklobby_modebutton').classList.add('gm_withbonkhost');
        document.getElementById('newbonklobby_settingsbox').appendChild(GMOpenButton);
        window.BonkUtils.setButtonSounds([GMOpenButton]);

        const modeButton = document.getElementById('newbonklobby_modebutton');
        const modeDropdown = modeButton.parentElement;
        modeButton.classList.add('brownButton', 'brownButton_classic', 'buttonShadow');
        modeDropdown.classList.remove('brownButton', 'brownButton_classic', 'buttonShadow');
        modeDropdown.style.width = 'calc(50% - 22px)';
        modeDropdown.style.bottom = '85px';
        modeDropdown.style.height = '0px';
      };
    } else if (window.bonkHost) {
      document.getElementById('newbonklobby_modebutton').classList.add('gm_withbonkhost');
      document.getElementById('newbonklobby_settingsbox').appendChild(GMOpenButton);
      window.BonkUtils.setButtonSounds([GMOpenButton]);

      const modeButton = document.getElementById('newbonklobby_modebutton');
      const modeDropdown = modeButton.parentElement;
      modeButton.classList.add('brownButton', 'brownButton_classic', 'buttonShadow');
      modeDropdown.classList.remove('brownButton', 'brownButton_classic', 'buttonShadow');
      modeDropdown.style.width = 'calc(50% - 22px)';
      modeDropdown.style.bottom = '85px';
      modeDropdown.style.height = '0px';
    } else {
      document.getElementById('newbonklobby_settingsbox').appendChild(GMOpenButton);
      window.BonkUtils.setButtonSounds([GMOpenButton]);
    }

    // adding button sounds
    const buttons = [
      'gmeditor_newbutton', 'gmeditor_importbutton', 'gmeditor_exportbutton', 'gmeditor_savebutton', 'gmeditor_closebutton', 'gmeditor_settingsbutton', 'gmeditor_backupsbutton', 'gmeditor_changebasebutton',
      'gmgeneric_cancel', 'gmgeneric_ok',
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

    // make it so that gme closes when you leave the game
    document.getElementById('leaveconfirmwindow_okbutton').addEventListener('click', gm.editor.hideGMEWindow);

    // get settings asset list item node
    gm.editor.settingsImageItem = document.getElementById('gmsettings_assetlist')
        .getElementsByClassName('gm_listitem')[0].cloneNode(true);

    // keyboard shortcuts
    const gmEditorContainer = document.getElementById('gmeditor');
    window.addEventListener('keydown', function(e) {
      if (gmEditorContainer.style.transform == 'scale(0)') return;

      // apply and close
      if (e.ctrlKey && e.key.toLowerCase() == 's') {
        e.preventDefault();
        gm.editor.GMESave();
      };
      // export
      if (e.ctrlKey && e.key.toLowerCase() == 'e') {
        e.preventDefault();
        gm.editor.GMEExportShow();
      };
      // new
      if (e.ctrlKey && e.key.toLowerCase() == 'n') {
        e.preventDefault();
        gm.editor.GMENew();
      };
    });

    // current browser for proper error handling
    this.browser = bowser.parse(window.navigator.userAgent).browser.name;

    // init workspaces
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
    monacoDiv.classList.add('bl_IgnoreTheme');

    const bounds = document.getElementById('gmworkspacearea').getBoundingClientRect();

    monacoDiv.style.top = bounds.top + window.scrollY;
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
    }, {
      storageService: {
        get() {},
        remove() {},
        getBoolean(key) {
          if (key === 'expandSuggestionDocs' && gm.config.saved.editor.forceSideDocs) {
            return true;
          }

          return false;
        },
        getNumber(key) {
          return 0;
        },
        store() {},
        onWillSaveState() {},
        onDidChangeStorage() {},
        onDidChangeValue() {},
      },
    });

    gm.editor.monacoWs.getModel().onDidChangeContent(function() {
      // the way this is formatted is s^^^^

      if (!gm.editor.modeSettings.isTextMode && !gm.editor.changingToTextEditor && !gm.editor.blocklyWs.isVisible()) {
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
        }, {showCancel: true});
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
        name: gm.editor.modeSettings.modeName + ' - ' + new Date(Date.now()).toLocaleString(),
      });

      const transaction = gm.editor.backupDB.transaction('backups', 'readwrite');
      transaction.objectStore('backups').put(gm.editor.modeBackups, 1);
    });

    window.addEventListener('resize', () => {
      setTimeout(() => {
        const bounds = document.getElementById('gmworkspacearea').getBoundingClientRect();

        monacoDiv.style.top = bounds.top + window.scrollY;
        monacoDiv.style.left = bounds.left;
        monacoDiv.style.width = bounds.width - 20;
        monacoDiv.style.height = bounds.height - 20;

        gm.editor.monacoWs.layout();
      }, 1);
    }, false);
  },
  initBlockly: function() {
    // add block defs into blockly
    for (let i = 0; i !== this.blockDefs.length; i++) {
      Blockly.Blocks[this.blockDefs[i].type] = {};
    }

    defineComplexBlocks();

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
    gm.editor.lightTheme = Blockly.Theme.defineTheme('gmmaker-light', {
      'base': Blockly.Themes.Classic,
      'blockStyles': {
        'colour_blocks': {
          'colourPrimary': '#a5745b',
          'colourSecondary': '#dbc7bd',
          'colourTertiary': '#845d49',
        },
        'list_blocks': {
          'colourPrimary': '#745ba5',
          'colourSecondary': '#c7bddb',
          'colourTertiary': '#5d4984',
        },
        'logic_blocks': {
          'colourPrimary': '#5b80a5',
          'colourSecondary': '#bdccdb',
          'colourTertiary': '#496684',
        },
        'loop_blocks': {
          'colourPrimary': '#5ba55b',
          'colourSecondary': '#bddbbd',
          'colourTertiary': '#498449',
        },
        'math_blocks': {
          'colourPrimary': '#5b67a5',
          'colourSecondary': '#bdc2db',
          'colourTertiary': '#495284',
        },
        'procedure_blocks': {
          'colourPrimary': '#995ba5',
          'colourSecondary': '#d6bddb',
          'colourTertiary': '#7a4984',
        },
        'text_blocks': {
          'colourPrimary': '#5ba58c',
          'colourSecondary': '#bddbd1',
          'colourTertiary': '#498470',
        },
        'variable_blocks': {
          'colourPrimary': '#a55b99',
          'colourSecondary': '#dbbdd6',
          'colourTertiary': '#84497a',
        },
        'gm_audio': {
          'colourPrimary': '#a55b5b',
          'colourSecondary': '#dbbdbd',
          'colourTertiary': '#844949',
        },
        'gm_events': {
          'colourPrimary': '#a5805b',
          'colourSecondary': '#dbcdbd',
          'colourTertiary': '#846649',
        },
        'gm_graphics': {
          'colourPrimary': '#5ba56d',
          'colourSecondary': '#bddbc5',
          'colourTertiary': '#498457',
        },
        'gm_lobby': {
          'colourPrimary': '#5ba5a5',
          'colourSecondary': '#bddbdb',
          'colourTertiary': '#498484',
        },
        'gm_world': {
          'colourPrimary': '#5b67a5',
          'colourSecondary': '#bdc2db',
          'colourTertiary': '#495284',
        },
        'gm_vector': {
          'colourPrimary': '#805ba5',
          'colourSecondary': '#cdbddb',
          'colourTertiary': '#4d3763',
        },
      },
      'fontStyle': {
        'family': 'futurept_b1',
        'size': 12,
      },
    }),

    gm.editor.darkTheme = Blockly.Theme.defineTheme('gmmaker-dark', {
      'base': Blockly.Themes.Classic,
      'blockStyles': {
        'colour_blocks': {
          'colourPrimary': '#a5745b',
          'colourSecondary': '#845d49',
          'colourTertiary': '#845d49',
        },
        'list_blocks': {
          'colourPrimary': '#745ba5',
          'colourSecondary': '#5d4984',
          'colourTertiary': '#5d4984',
        },
        'logic_blocks': {
          'colourPrimary': '#5b80a5',
          'colourSecondary': '#496684',
          'colourTertiary': '#496684',
        },
        'loop_blocks': {
          'colourPrimary': '#5ba55b',
          'colourSecondary': '#498449',
          'colourTertiary': '#498449',
        },
        'math_blocks': {
          'colourPrimary': '#5b67a5',
          'colourSecondary': '#373e63',
          'colourTertiary': '#373e63',
        },
        'procedure_blocks': {
          'colourPrimary': '#995ba5',
          'colourSecondary': '#7a4984',
          'colourTertiary': '#7a4984',
        },
        'text_blocks': {
          'colourPrimary': '#5ba58c',
          'colourSecondary': '#498470',
          'colourTertiary': '#498470',
        },
        'variable_blocks': {
          'colourPrimary': '#a55b99',
          'colourSecondary': '#84497a',
          'colourTertiary': '#84497a',
        },
        'gm_audio': {
          'colourPrimary': '#a55b5b',
          'colourSecondary': '#844949',
          'colourTertiary': '#844949',
        },
        'gm_events': {
          'colourPrimary': '#a5805b',
          'colourSecondary': '#846649',
          'colourTertiary': '#846649',
        },
        'gm_graphics': {
          'colourPrimary': '#5ba56d',
          'colourSecondary': '#498457',
          'colourTertiary': '#498457',
        },
        'gm_lobby': {
          'colourPrimary': '#5ba5a5',
          'colourSecondary': '#498484',
          'colourTertiary': '#498484',
        },
        'gm_world': {
          'colourPrimary': '#5b67a5',
          'colourSecondary': '#495284',
          'colourTertiary': '#495284',
        },
        'gm_vector': {
          'colourPrimary': '#805ba5',
          'colourSecondary': '#4d3763',
          'colourTertiary': '#4d3763',
        },
      },
      'fontStyle': {
        'family': 'futurept_b1',
        'size': 12,
      },
      'componentStyles': {
        'workspaceBackgroundColour': '#1e1e1e',
        'toolboxForegroundColour': '#fff',
        'flyoutBackgroundColour': '#252526',
        'flyoutForegroundColour': '#ccc',
        'flyoutOpacity': 1,
        'scrollbarColour': '#797979',
        'insertionMarkerColour': '#fff',
        'insertionMarkerOpacity': 0.3,
        'scrollbarOpacity': 0.4,
        'cursorColour': '#d0d0d0',
        'blackBackground': '#333',
      },
    });

    // register renderer
    Blockly.blockRendering.register('gm_renderer', gmBlockRenderer);

    // create blockly workspaces
    gm.editor.blocklyWs = Blockly.inject('gmblocklydiv', {
      toolbox: document.getElementById('toolbox'),
      oneBasedIndex: false,
      renderer: 'gm_renderer',
      zoom: {
        controls: true,
        wheel: true,
        pinch: true,
      },
      grid: {
        spacing: 20,
        length: 3,
        colour: '#ccc',
        snap: true,
      },
      theme: gm.editor.lightTheme,
    });
    gm.editor.headlessBlocklyWs = new Blockly.Workspace();

    LexicalVariables.init(gm.editor.blocklyWs);

    afterWsPatches();

    // drag surface makes the workspace lag a LOT while dragging on a really big project
    gm.editor.blocklyWs.useWorkspaceDragSurface_ = false;

    // workspace plugins
    const workspaceSearch = new WorkspaceSearch(gm.editor.blocklyWs);
    workspaceSearch.init();

    // workspace dialogs
    Blockly.dialog.setAlert(function(message, callback) {
      gm.editor.genericDialog(message, callback);
    });
    Blockly.dialog.setConfirm(function(message, callback) {
      gm.editor.genericDialog(message, callback, {showCancel: true});
    });
    Blockly.dialog.setPrompt(function(message, defaultValue, callback) {
      gm.editor.genericDialog(message, callback, {showCancel: true, showInput: true, inputValue: defaultValue});
    });

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

      if (backup.isEmpty) return;

      gm.editor.modeBackups.unshift({
        mode: gm.encoding.compressMode(backup).buffer,
        name: gm.editor.modeSettings.modeName + ' - ' + new Date(Date.now()).toLocaleString(),
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

    monacoDiv.style.top = bounds.top + window.scrollY;
    monacoDiv.style.left = bounds.left;
    monacoDiv.style.width = bounds.width - 20;
    monacoDiv.style.height = bounds.height - 20;

    blocklyDiv.style.top = bounds.top + window.scrollY;
    blocklyDiv.style.left = bounds.left;
    blocklyDiv.style.width = bounds.width;
    blocklyDiv.style.height = bounds.height;

    Blockly.svgResize(gm.editor.blocklyWs);
    gm.editor.monacoWs.layout();

    gm.editor.disableLobbyChatbox = true;
  },
  hideGMEWindow: function() {
    gm.editor.disableLobbyChatbox = false;

    document.getElementById('gmmonacodiv').style.display = 'none';
    gm.editor.blocklyWs.setVisible(false);
    document.getElementById('gmblocklydiv').style.visibility = 'hidden';
    document.getElementById('gmeditor').style.transform = 'scale(0)';
    document.getElementById('newbonklobby').style.transform = 'scale(1)';
  },
  genericDialog: function(message = '', callback = ()=>{}, options) {
    document.getElementById('gm_genericdialogcontainer').style.visibility = 'visible';

    document.getElementById('gmgeneric_message').innerHTML = message;
    document.getElementById('gmgeneric_promptcontainer').style.display = options.showInput ? 'block' : 'none';
    document.getElementById('gmgeneric_prompt').value = options.inputValue;
    document.getElementById('gmgeneric_cancel').style.display = options.showCancel ? 'block' : 'none';
    if (options.showInput) document.getElementById('gmgeneric_prompt').focus();

    document.getElementById('gmgeneric_code').parentElement.style.display = options.showCode ? 'block' : 'none';
    if (options.showCode) document.getElementById('gmgeneric_code').innerText = options.code;

    // it's weird but it works and it looks neat
    // eslint-disable-next-line prefer-const
    let closeDialog;

    const okListener = function() {
      callback(options.showInput ? document.getElementById('gmgeneric_prompt').value : true);
      closeDialog();
    };
    const okInputListener = function(event) {
      if (event.key === 'Enter') {
        callback(options.showInput ? document.getElementById('gmgeneric_prompt').value : true);
        closeDialog();
      }
    };
    const cancelListener = function() {
      callback(options.showInput ? null : false);
      closeDialog();
    };

    closeDialog = function() {
      document.getElementById('gm_genericdialogcontainer').style.visibility = 'hidden';
      document.getElementById('gmgeneric_ok').removeEventListener('click', okListener);
      document.getElementById('gmgeneric_prompt').removeEventListener('keydown', okInputListener);
      document.getElementById('gmgeneric_cancel').removeEventListener('click', cancelListener);
    };

    document.getElementById('gmgeneric_ok').addEventListener('click', okListener);
    document.getElementById('gmgeneric_prompt').addEventListener('keydown', okInputListener);
    document.getElementById('gmgeneric_cancel').addEventListener('click', cancelListener);
  },
  GMENew: function() {
    gm.editor.genericDialog('Are you sure you want to delete all code, reset mode settings and remove all custom images and sounds?', function(confirmed) {
      if (!confirmed) return;

      gm.editor.blocklyWs.clear();
      gm.editor.GMEChangeEditor(false);

      document.getElementById('gmeditor_changebasebutton').classList.remove('brownButtonDisabled');

      gm.editor.monacoWs.setValue('');
      gm.editor.modeAssets = {images: [], sounds: []};
      gm.editor.resetModeSettings();
    }, {showCancel: true});
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

          gm.editor.monacoWs.setValue(mode.content);
        }
      };
    };

    input.click();
  },
  GMEImportMapCancel: function() {
    document.getElementById('gm_importdialogwindowcontainer').style.visibility = 'hidden';
  },
  GMEImportMapNo: function() {
    gm.editor.modeAssets = gm.editor.modeToImport.assets;
    gm.editor.modeSettings = gm.editor.modeToImport.settings;

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
  GMEImportMapYes: function() {
    const gameSettings = gm.lobby.mpSession.getGameSettings();

    gameSettings.map = MapEncoder.decodeFromDatabase(gm.editor.modeToImport.map);

    gm.lobby.bonkLobby.updateGameSettings(gameSettings);
    gm.lobby.networkEngine.sendMapAdd(gameSettings.map);

    gm.editor.modeAssets = gm.editor.modeToImport.assets;
    gm.editor.modeSettings = gm.editor.modeToImport.settings;

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
      option.innerText = gm.editor.modeBackups[i].name;

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

    gm.editor.monacoWs.setValue(backup.content);
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

    gm.audio.stopAllSounds();

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
        soundPlayer.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAQAIBRAA7'; // blank image to remove white border
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
              soundPlayerHowl?.unload();
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
          soundPlayerHowl?.unload();
          soundPlayerHowl = null;
          gm.editor.unsavedModeAssets.sounds[soundOrder] = null;
          document.getElementById('gmsettings_assetlist').removeChild(soundItem);
        });
        soundItem.getElementsByClassName('gmeditor_download')[0].addEventListener('click', function() {
          saveAs('data:audio/' + soundDef.extension + ';base64,' + soundDef.data, soundItem.getElementsByClassName('gm_listitemname')[0].value + '.' + soundDef.extension);
        });

        window.BonkUtils.setButtonSounds([
          soundItem.getElementsByClassName('gmeditor_delete')[0],
          soundItem.getElementsByClassName('gmeditor_download')[0],
        ]);

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

        const filterButton = document.createElement('div');

        if (imageDef.useNearest) {
          filterButton.className = 'brownButton brownButton_classic buttonShadow gmeditor_iconbutton gmeditor_filter nearest';
          filterButton.title = 'Using nearest neighbour';
        } else {
          filterButton.className = 'brownButton brownButton_classic buttonShadow gmeditor_iconbutton gmeditor_filter bilinear';
          filterButton.title = 'Using bilinear';
        }

        imageItem.getElementsByClassName('gm_listitemdown')[0].insertBefore(filterButton, imageItem.getElementsByClassName('gmeditor_download')[0]);

        imageItem.getElementsByClassName('gm_listitemimage')[0].src = 'data:image/' + imageDef.extension + ';base64,' + imageDef.data;
        imageItem.getElementsByClassName('gm_listitemname')[0].value = imageDef.id;
        imageItem.getElementsByClassName('gm_listitemdetail')[0].innerText = imageDef.detail;
        imageItem.getElementsByClassName('gm_listitemname')[0].addEventListener('change', function() {
          gm.editor.unsavedModeAssets.images[imageOrder].id = imageItem.getElementsByClassName('gm_listitemname')[0].value;
        });
        filterButton.addEventListener('click', function() {
          const image = gm.editor.unsavedModeAssets.images[imageOrder];

          if (image.useNearest) {
            image.useNearest = false;

            filterButton.className = 'brownButton brownButton_classic buttonShadow gmeditor_iconbutton gmeditor_filter bilinear';
            filterButton.title = 'Using bilinear';
          } else {
            image.useNearest = true;

            filterButton.className = 'brownButton brownButton_classic buttonShadow gmeditor_iconbutton gmeditor_filter nearest';
            filterButton.title = 'Using nearest neighbour';
          }
        });
        imageItem.getElementsByClassName('gmeditor_delete')[0].addEventListener('click', function() {
          gm.editor.unsavedModeAssets.images[imageOrder] = null;
          document.getElementById('gmsettings_assetlist').removeChild(imageItem);
        });
        imageItem.getElementsByClassName('gmeditor_download')[0].addEventListener('click', function() {
          saveAs('data:image/' + imageDef.extension + ';base64,' + imageDef.data, imageItem.getElementsByClassName('gm_listitemname')[0].value + '.' + imageDef.extension);
        });

        window.BonkUtils.setButtonSounds([
          filterButton,
          imageItem.getElementsByClassName('gmeditor_delete')[0],
          imageItem.getElementsByClassName('gmeditor_download')[0],
        ]);

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
          soundPlayer.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAQAIBRAA7'; // blank image to remove white border
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
                soundPlayerHowl?.unload();
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
            soundPlayerHowl?.unload();
            soundPlayerHowl = null;
            gm.editor.unsavedModeAssets.sounds[soundOrder] = null;
            document.getElementById('gmsettings_assetlist').removeChild(soundItem);
          });
          soundItem.getElementsByClassName('gmeditor_download')[0].addEventListener('click', function() {
            saveAs('data:audio/' + extension + ';base64,' + data, soundItem.getElementsByClassName('gm_listitemname')[0].value + '.' + extension);
          });

          window.BonkUtils.setButtonSounds([
            soundItem.getElementsByClassName('gmeditor_delete')[0],
            soundItem.getElementsByClassName('gmeditor_download')[0],
          ]);

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
            imageAsset.useNearest = false;

            const imageOrder = gm.editor.unsavedModeAssets.images.length;
            gm.editor.unsavedModeAssets.images.push(imageAsset);

            // create new image item
            const imageItem = gm.editor.settingsImageItem.cloneNode(true);

            const filterButton = document.createElement('div');
            filterButton.className = 'brownButton brownButton_classic buttonShadow gmeditor_iconbutton gmeditor_filter bilinear';
            filterButton.title = 'Using bilinear';

            imageItem.getElementsByClassName('gm_listitemdown')[0].insertBefore(filterButton, imageItem.getElementsByClassName('gmeditor_download')[0]);

            imageItem.getElementsByClassName('gm_listitemimage')[0].src = 'data:image/' + extension + ';base64,' + data;
            imageItem.getElementsByClassName('gm_listitemname')[0].value = name;
            imageItem.getElementsByClassName('gm_listitemdetail')[0].innerText = detail;
            imageItem.getElementsByClassName('gm_listitemname')[0].addEventListener('change', function() {
              gm.editor.unsavedModeAssets.images[imageOrder].id = imageItem.getElementsByClassName('gm_listitemname')[0].value;
            });
            filterButton.addEventListener('click', function() {
              const image = gm.editor.unsavedModeAssets.images[imageOrder];

              if (image.useNearest) {
                image.useNearest = false;

                filterButton.className = 'brownButton brownButton_classic buttonShadow gmeditor_iconbutton gmeditor_filter bilinear';
                filterButton.title = 'Using bilinear';
              } else {
                image.useNearest = true;

                filterButton.className = 'brownButton brownButton_classic buttonShadow gmeditor_iconbutton gmeditor_filter nearest';
                filterButton.title = 'Using nearest';
              }
            });
            imageItem.getElementsByClassName('gmeditor_delete')[0].addEventListener('click', function() {
              gm.editor.unsavedModeAssets.images[imageOrder] = null;
              document.getElementById('gmsettings_assetlist').removeChild(imageItem);
            });
            imageItem.getElementsByClassName('gmeditor_download')[0].addEventListener('click', function() {
              saveAs('data:image/' + extension + ';base64,' + data, imageItem.getElementsByClassName('gm_listitemname')[0].value + '.' + extension);
            });

            window.BonkUtils.setButtonSounds([
              filterButton,
              imageItem.getElementsByClassName('gmeditor_delete')[0],
              imageItem.getElementsByClassName('gmeditor_download')[0],
            ]);

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
      gm.editor.blocklyWs.setVisible(false);
      gm.editor.monacoWs.layout();
      gm.editor.monacoWs.setValue(gm.editor.generateBlocklyCode(true));
      changeBaseButton.classList.remove('jsIcon');
      changeBaseButton.classList.add('blockIcon');
    } else {
      gm.editor.isInTextEditor = false;
      blocklyDiv.style.visibility = 'visible';
      gm.editor.blocklyWs.setVisible(true);
      monacoDiv.style.display = 'none';
      gm.editor.monacoWs.layout();
      changeBaseButton.classList.remove('blockIcon');
      changeBaseButton.classList.add('jsIcon');
    }
  },
  GMESave: function() {
    if (gm.lobby.networkEngine.getLSID() !== gm.lobby.networkEngine.hostID) return;

    gm.state.resetSES();

    const saved = {};

    // un-highlight errored block
    gm.editor.blocklyWs.highlightBlock(null);

    // generate events in host and save content and isEmpty into the mode
    if (gm.editor.modeSettings.isTextMode) {
      const content = gm.editor.monacoWs.getValue();
      gm.editor.tryEventGenMonaco(content);

      saved.content = content;
      saved.isEmpty = content == '';
    } else {
      const blocklyResult = gm.editor.generateBlocklyCode();

      gm.editor.blockCodeMap = blocklyResult[1];
      gm.editor.generatedCode = blocklyResult[0];
      gm.editor.tryEventGenBlockly(blocklyResult[0]);

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
  tryEventGenMonaco: function(content) {
    try {
      gm.state.generateEvents(content);
    } catch (e) {
      let report;

      if (gm.editor.browser == 'Firefox') {
        report = e.name + ': ' + e.message;

        if (e.message.includes('delete') && e.message.includes('unqualified')) {
          report = 'SyntaxError: Delete of an unqualified identifier is not allowed. You can use the delete keyword on array items and object properties, but not on plain variables.';
        } else if (e.name == 'SyntaxError') {
          try {
            acorn.parse(content, {ecmaVersion: 'latest'});
          } catch (syntaxError) {
            const location = /\(([0-9:]+)\)/.exec(syntaxError.message)[1];
            report += '\n  at <anonymous>:' + location;
          }
        } else {
          let stack = e.stack;

          stack = stack.replace(/([^@\n]+)@.+?line.+?eval:/gm, '  at $1:');
          stack = stack.replace(/@.+?line.+?eval:([^\n]+)(.|\n)*/gm, '  at <anonymous>:$1');

          report += '\n' + stack;
        }

        e.message = '[GMMaker Error] ' + e.message;
      } else {
        report = e.stack;

        if (e.message.includes('Delete') && e.message.includes('unqualified')) {
          report = 'SyntaxError: Delete of an unqualified identifier is not allowed. You can use the delete keyword on array items and object properties, but not on plain variables.';
        } else if (report.includes('SyntaxError:')) {
          try {
            acorn.parse(content, {ecmaVersion: 'latest'});
          } catch (syntaxError) {
            const location = /\(([0-9:]+)\)/.exec(syntaxError.stack)[1];
            report = report.replace(/at ([^\n]+)(.|\n)*/gm, 'at <anonymous>:' + location);
          }
        } else {
          report = report.replace(/(at [^\(\n]+) \(eval at .{0,150}init[^\)]+[\)]+, <anonymous>(:[0-9]+:[0-9]+)\)/gm, '$1$2');
          report = report.replace(/Object\.eval([^\n]+)(.|\n)*/gm, '<anonymous>$1');
        }

        e.stack = '[GMMaker Error] ' + e.stack;
      }


      const match = /:([0-9]+):([0-9]+)/gm.exec(report);

      if (match) {
        gm.editor.monacoWs.revealPositionInCenter({lineNumber: Number.parseInt(match[1]), column: Number.parseInt(match[2])});
        gm.editor.monacoWs.setPosition({lineNumber: Number.parseInt(match[1]), column: Number.parseInt(match[2])});
      }

      gm.editor.genericDialog('Whoops! Seems like something went wrong with your code. Below is the crash report, which may help you find out what happened.', ()=>{}, {
        showCode: true,
        code: report,
      });

      throw (e);
    }
  },
  tryEventGenBlockly: function(generatedCode) {
    try {
      gm.state.generateEvents(generatedCode);
    } catch (e) {
      alert(`An error ocurred while trying to save. Please send SneezingCactus a full screenshot of the console (Ctrl+Shift+I, go to the Console tab) so this error can be diagnosed.`);
      throw (e);
    }
  },
  generateBlocklyCode: function(pretty) {
    const workspace = gm.lobby.networkEngine.getLSID() === gm.lobby.networkEngine.hostID ? gm.editor.blocklyWs : gm.editor.headlessBlocklyWs;
    const topBlocks = workspace.getTopBlocks();
    let code = '';

    // blocks use this to figure out if they should add their id to their code output
    // to be later used to generate block code range data
    gm.editor.generatingPrettyCode = pretty;

    javascriptGenerator.init(workspace);

    for (let i = 0; i != topBlocks.length; i++) {
      if (!topBlocks[i].type.startsWith('event_') && !topBlocks[i].type.startsWith('procedures_def')) continue;

      code += javascriptGenerator.blockToCode(topBlocks[i]);
    }

    code = javascriptGenerator.finish(code);

    if (code.startsWith('var ')) {
      code = code.replace(/var [^\n]+[\n]+/m, '');
    } else if (code.startsWith('\n\n\n')) {
      code = code.replace('\n\n\n', '');
    }

    gm.editor.generatingPrettyCode = false;

    if (pretty) {
      return prettier.format(code, {parser: 'babel', plugins: [prettierBabel], bracketSpacing: false});
    } else {
      const blockRanges = [];

      while (true) {
        const match = /"""([^"]+)"""S/gm.exec(code);
        if (!match) break;

        const start = match.index;

        const end = code.indexOf('"""' + match[1] + '"""E');

        for (const range of blockRanges) {
          if (range.start > start && range.start > end) {
            range.start -= match[0].length * 2;
          } else if (range.start > start || range.start > end) {
            range.start -= match[0].length;
          }
          if (range.end > start && range.end > end) {
            range.end -= match[0].length * 2;
          } else if (range.end > start || range.end > end) {
            range.end -= match[0].length;
          }
        }

        blockRanges.push({
          start: start,
          end: end - 1 - match[0].length,
          id: match[1],
        });

        code = code.slice(0, start) + code.slice(start + match[0].length, end) + code.slice(end + match[0].length);
      }

      return [code, blockRanges];
    }
  },
};
