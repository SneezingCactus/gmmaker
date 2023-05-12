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

// firebase
import {initializeApp} from 'firebase/app';
import * as storage from 'firebase/storage';
import * as firestore from 'firebase/firestore';

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
    document.getElementById('gmeditor_dbbutton').addEventListener('click', gm.editor.GMEDatabaseShow);
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

    document.getElementById('gmdb_close').addEventListener('click', gm.editor.GMEDatabaseHide);
    document.getElementById('gmdb_newesttab').addEventListener('click', () => gm.editor.GMEDatabaseChangeTab(false));
    document.getElementById('gmdb_oldesttab').addEventListener('click', () => gm.editor.GMEDatabaseChangeTab(true));
    document.getElementById('gmdb_searchbutton').addEventListener('click', gm.editor.GMEDatabaseSearch);
    document.getElementById('gmdb_searchinput').addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        gm.editor.GMEDatabaseSearch();
      }
    });

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
      'gmeditor_dbbutton', 'gmeditor_newbutton', 'gmeditor_importbutton', 'gmeditor_exportbutton', 'gmeditor_savebutton', 'gmeditor_closebutton', 'gmeditor_settingsbutton', 'gmeditor_backupsbutton', 'gmeditor_changebasebutton',
      'gmgeneric_cancel', 'gmgeneric_ok',
      'gmexport_cancel', 'gmexport_ok',
      'gmimportdialog_cancel', 'gmimportdialog_no', 'gmimportdialog_yes',
      'gmsettings_cancel', 'gmsettings_save', 'gmsettings_importasset',
      'gmbackups_cancel', 'gmbackups_load',
      'gmdb_close', 'gmdb_searchbutton',
      'gm_logboxclose',
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

    // get db mode item node
    gm.editor.dbModeItem = document.getElementById('gmdb_modelist')
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

    // log box stuff
    const logBoxContent = document.getElementById('gm_logboxcontent');

    new ResizeObserver(function() {
      logBoxContent.scrollTop = logBoxContent.scrollHeight;
    }).observe(document.getElementById('gm_logbox'));

    document.getElementById('gm_logboxclose').addEventListener('click', function() {
      document.getElementById('gm_logbox').style.visibility = 'hidden';
    });

    // current browser for proper error handling
    this.browser = bowser.parse(window.navigator.userAgent).browser.name;

    // init workspaces
    this.initBlockly();
    this.initMonaco();

    // init firebase
    this.initFirebase();

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
    gm.editor.headlessBlocklyWs.options.oneBasedIndex = false;

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
  initFirebase: function() {
    // these won't grant you write access or anything which is why
    // i didn't bother to hide them
    const firebaseConfig = {
      apiKey: 'AIzaSyC0Z88AFPJmjts90VXxFdZoxfYhEYcdE7E',
      authDomain: 'scactus-gmmaker.firebaseapp.com',
      projectId: 'scactus-gmmaker',
      storageBucket: 'scactus-gmmaker.appspot.com',
      messagingSenderId: '2162735473',
      appId: '1:2162735473:web:90889ffcb2fa8a29439ed0',
    };

    // Initialize Firebase
    gm.editor.fireApp = initializeApp(firebaseConfig);
    gm.editor.fireStorage = storage.getStorage(gm.editor.fireApp);
    gm.editor.fireDatabase = firestore.getFirestore(gm.editor.fireApp);
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
  dbImageCache: {},
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
  showDialogWindow: function(id) {
    const el = document.getElementById(id);
    el.style.opacity = 1;
    el.style.visibility = 'visible';
  },
  hideDialogWindow: function(id) {
    const el = document.getElementById(id);
    el.style.opacity = 0;
    setTimeout(function() {
      el.style.visibility = 'hidden';
    }, 150);
  },
  genericDialog: function(message = '', callback = ()=>{}, options) {
    gm.editor.showDialogWindow('gm_genericdialogcontainer');

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
      gm.editor.hideDialogWindow('gm_genericdialogcontainer');
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
    input.accept = '.gmm';

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
          gm.editor.showDialogWindow('gm_importdialogwindowcontainer');
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
    gm.editor.hideDialogWindow('gm_importdialogwindowcontainer');
  },
  GMEImportMapNo: function() {
    gm.editor.modeAssets = gm.editor.modeToImport.assets;
    gm.editor.modeSettings = gm.editor.modeToImport.settings;

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

    gm.editor.hideDialogWindow('gm_importdialogwindowcontainer');
  },
  GMEImportMapYes: function() {
    const gameSettings = gm.lobby.mpSession.getGameSettings();

    gameSettings.map = MapEncoder.decodeFromDatabase(gm.editor.modeToImport.map);

    gm.lobby.bonkLobby.updateGameSettings(gameSettings);
    gm.lobby.networkEngine.sendMapAdd(gameSettings.map);

    gm.editor.modeAssets = gm.editor.modeToImport.assets;
    gm.editor.modeSettings = gm.editor.modeToImport.settings;

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

    gm.editor.hideDialogWindow('gm_importdialogwindowcontainer');
  },
  GMEExportShow: function() {
    gm.editor.showDialogWindow('gm_exportwindowcontainer');
    document.getElementById('gmexport_name').focus();
  },
  GMEExportCancel: function() {
    gm.editor.hideDialogWindow('gm_exportwindowcontainer');
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
    gm.editor.hideDialogWindow('gm_exportwindowcontainer');
  },
  GMEBackupsShow: function() {
    gm.editor.showDialogWindow('gm_backupswindowcontainer');

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
    gm.editor.hideDialogWindow('gm_backupswindowcontainer');
  },
  GMEBackupsLoad: function() {
    gm.editor.hideDialogWindow('gm_backupswindowcontainer');

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
  GMEDatabaseShow: function() {
    gm.editor.showDialogWindow('gm_dbwindowcontainer');
    gm.editor.GMEDatabaseChangeTab(false);
  },
  GMEDatabaseHide: function() {
    gm.editor.hideDialogWindow('gm_dbwindowcontainer');
  },
  GMEDatabaseSearch: async function() {
    document.getElementById('gmdb_newesttab').classList.add('inactive');
    document.getElementById('gmdb_oldesttab').classList.add('inactive');
    document.getElementById('gmdb_searchtab').style.visibility = 'visible';

    const modeList = document.getElementById('gmdb_modelist');
    modeList.innerHTML = 'Looking for modes...';
    modeList.classList.add('empty');

    const modes = firestore.collection(gm.editor.fireDatabase, 'modes');

    let prompt = document.getElementById('gmdb_searchinput').value;
    prompt = prompt.replace(/[.,:;$!?'"\-/#_]/gm, ' '); // get rid of punctuation
    prompt = prompt.replace(/([a-z])([A-Z])/gm, '$1 $2'); // separate pascal case words
    prompt = prompt.replace(/ {2,}/gm, ' '); // get rid of excess spaces
    let terms = prompt.toLowerCase().split(' '); // lowercase the whole thing and split by spaces
    terms = [...new Set(terms)]; // get rid of duplicates

    const query = firestore.query(
        modes,
        firestore.where('searchTerms', 'array-contains-any', terms),
        firestore.limit(10),
    );

    const results = await firestore.getDocs(query);

    if (!results.empty) {
      modeList.classList.remove('empty');
      modeList.innerHTML = '';
    } else {
      modeList.innerHTML = 'No modes found :(';
      return;
    }

    gm.editor.GMEDatabasePopulate(results);
  },
  GMEDatabaseChangeTab: async function(toOldest) {
    document.getElementById('gmdb_newesttab').classList.add('inactive');
    document.getElementById('gmdb_oldesttab').classList.add('inactive');
    document.getElementById('gmdb_searchtab').style.visibility = 'hidden';

    const modeList = document.getElementById('gmdb_modelist');
    modeList.innerHTML = 'Looking for modes...';
    modeList.classList.add('empty');

    let query;
    const modes = firestore.collection(gm.editor.fireDatabase, 'modes');

    if (toOldest) {
      document.getElementById('gmdb_oldesttab').classList.remove('inactive');

      query = firestore.query(
          modes,
          firestore.orderBy('time', 'asc'),
          firestore.limit(10),
      );
    } else {
      document.getElementById('gmdb_newesttab').classList.remove('inactive');

      query = firestore.query(
          modes,
          firestore.orderBy('time', 'desc'),
          firestore.limit(10),
      );
    }

    const results = await firestore.getDocs(query);

    if (!results.empty) {
      modeList.classList.remove('empty');
      modeList.innerHTML = '';
    } else {
      modeList.innerHTML = 'No modes found :(';
      return;
    }

    gm.editor.GMEDatabasePopulate(results);
  },
  GMEDatabasePopulate: function(queryResults) {
    const modeList = document.getElementById('gmdb_modelist');

    queryResults.forEach((doc) => {
      const docData = doc.data();

      const item = gm.editor.dbModeItem.cloneNode(true);

      item.getElementsByClassName('mode_id')[0].innerText = 'ID: ' + doc.id;
      item.getElementsByClassName('mode_name')[0].innerText = docData.name;
      item.getElementsByClassName('mode_author')[0].innerText = 'Posted by ' + docData.posterTag;
      item.getElementsByClassName('mode_desc')[0].innerText = docData.desc;
      item.getElementsByClassName('mode_time')[0].innerText = moment(docData.time).fromNow();

      if (docData.hasImage) {
        const cachedImageUrl = gm.editor.dbImageCache[doc.id];

        const img = document.createElement('img');
        const imgContainer = item.getElementsByClassName('mode_image')[0];

        if (cachedImageUrl) {
          img.setAttribute('src', cachedImageUrl);
          imgContainer.innerHTML = '';
          imgContainer.classList.add('has_image');
          imgContainer.appendChild(img);
        } else {
          const imgRef = storage.ref(gm.editor.fireStorage, 'images/' + String(doc.id) + '.png');

          storage.getBlob(imgRef).then((blob) => {
            const url = URL.createObjectURL(blob);
            gm.editor.dbImageCache[doc.id] = url;

            img.setAttribute('src', url);
            imgContainer.innerHTML = '';
            imgContainer.classList.add('has_image');
            imgContainer.appendChild(img);
          });
        }
      }

      window.BonkUtils.setButtonSounds([item]);

      item.addEventListener('click', () => {
        modeList.innerHTML = 'Loading mode...';
        modeList.classList.add('empty');

        const modeRef = storage.ref(gm.editor.fireStorage, 'modes/' + String(doc.id) + '.gmm');

        storage.getBytes(modeRef).then((buffer) => {
          const content = new dcodeIO.ByteBuffer();
          content.append(buffer);

          const mode = gm.encoding.decompressMode(content);

          if (gm.lobby.networkEngine.getLSID() == gm.lobby.networkEngine.hostID && mode.map) {
            gm.editor.modeToImport = mode;
            gm.editor.showDialogWindow('gm_importdialogwindowcontainer');
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

          gm.editor.GMEDatabaseHide();
        });
      });
      modeList.appendChild(item);
    });
  },
  GMESettingsShow: function() {
    gm.editor.showDialogWindow('gm_settingswindowcontainer');

    document.getElementById('gmsettings_modename').value = gm.editor.modeSettings.modeName || gm.editor.modeSettingsDefaults[0].default;
    document.getElementById('gmsettings_modedescription').value = gm.editor.modeSettings.modeDescription || gm.editor.modeSettingsDefaults[1].default;
    document.getElementById('gmsettings_basemode').value = gm.editor.modeSettings.baseMode || gm.editor.modeSettingsDefaults[3].default;

    gm.editor.unsavedModeAssets = JSON.parse(JSON.stringify(gm.editor.modeAssets));

    gm.editor.GMESettingsChangeTab(gm.editor.isInSoundsTab);
  },
  GMESettingsCancel: function() {
    gm.audio.stopAllSounds();
    gm.editor.hideDialogWindow('gm_settingswindowcontainer');
  },
  GMESettingsSave: function() {
    gm.editor.modeSettings.modeName = document.getElementById('gmsettings_modename').value.substring(0, 12);
    gm.editor.modeSettings.modeDescription = document.getElementById('gmsettings_modedescription').value.substring(0, 500);
    gm.editor.modeSettings.baseMode = document.getElementById('gmsettings_basemode').value;

    gm.editor.modeAssets = gm.editor.unsavedModeAssets;
    gm.audio.stopAllSounds();

    gm.editor.hideDialogWindow('gm_settingswindowcontainer');
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

        gm.editor.GMECreateSoundAsset(i);
      }
    } else {
      this.isInSoundsTab = false;
      document.getElementById('gmsettings_imagestab').classList.remove('inactive');
      document.getElementById('gmsettings_soundstab').classList.add('inactive');

      for (let i = 0; i < gm.editor.unsavedModeAssets.images.length; i++) {
        if (!gm.editor.unsavedModeAssets.images[i]) continue;

        gm.editor.GMECreateImageAsset(i);
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

          gm.editor.GMECreateSoundAsset(soundOrder);
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
            imageAsset.useRepeat = false;

            const imageOrder = gm.editor.unsavedModeAssets.images.length;
            gm.editor.unsavedModeAssets.images.push(imageAsset);

            gm.editor.GMECreateImageAsset(imageOrder);
          };
        }
      };
    };

    input.click();
  },
  GMECreateSoundAsset: function(soundOrder) {
    const soundDef = gm.editor.unsavedModeAssets.sounds[soundOrder];
    const soundItem = gm.editor.settingsImageItem.cloneNode(true);

    const soundPlayer = soundItem.getElementsByClassName('gm_assetitemimage')[0];
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

    soundItem.getElementsByClassName('gm_assetitemname')[0].value = soundDef.id;
    soundItem.getElementsByClassName('gm_assetitemdetail')[0].innerText = soundDef.detail;
    soundItem.getElementsByClassName('gm_assetitemname')[0].addEventListener('change', function() {
      gm.editor.unsavedModeAssets.sounds[soundOrder].id = soundItem.getElementsByClassName('gm_assetitemname')[0].value;
    });
    soundItem.getElementsByClassName('gmeditor_delete')[0].addEventListener('click', function() {
      soundPlayerHowl?.unload();
      soundPlayerHowl = null;
      gm.editor.unsavedModeAssets.sounds[soundOrder] = null;
      document.getElementById('gmsettings_assetlist').removeChild(soundItem);
    });
    soundItem.getElementsByClassName('gmeditor_download')[0].addEventListener('click', function() {
      saveAs('data:audio/' + soundDef.extension + ';base64,' + soundDef.data, soundItem.getElementsByClassName('gm_assetitemname')[0].value + '.' + soundDef.extension);
    });

    window.BonkUtils.setButtonSounds([
      soundItem.getElementsByClassName('gmeditor_delete')[0],
      soundItem.getElementsByClassName('gmeditor_download')[0],
    ]);

    document.getElementById('gmsettings_assetlist').appendChild(soundItem);
  },
  GMECreateImageAsset: function(imageOrder) {
    const imageDef = gm.editor.unsavedModeAssets.images[imageOrder];
    const imageItem = gm.editor.settingsImageItem.cloneNode(true);

    const filterButton = document.createElement('div');
    const wrapButton = document.createElement('div');

    filterButton.className = 'brownButton brownButton_classic buttonShadow gmeditor_iconbutton gmeditor_filter';
    wrapButton.className = 'brownButton brownButton_classic buttonShadow gmeditor_iconbutton gmeditor_wrap';

    if (imageDef.useNearest) {
      filterButton.classList.add('nearest');
      filterButton.title = 'Using nearest neighbour';
    } else {
      filterButton.classList.add('bilinear');
      filterButton.title = 'Using bilinear';
    }

    if (imageDef.useRepeat) {
      wrapButton.classList.add('repeat');
      wrapButton.title = 'Repeated outside region';
    } else {
      wrapButton.classList.add('clamp');
      wrapButton.title = 'Clamped outside region';
    }

    imageItem.getElementsByClassName('gm_assetitemdown')[0].insertBefore(filterButton, imageItem.getElementsByClassName('gmeditor_download')[0]);
    imageItem.getElementsByClassName('gm_assetitemdown')[0].insertBefore(wrapButton, filterButton);

    imageItem.getElementsByClassName('gm_assetitemimage')[0].src = 'data:image/' + imageDef.extension + ';base64,' + imageDef.data;
    imageItem.getElementsByClassName('gm_assetitemname')[0].value = imageDef.id;
    imageItem.getElementsByClassName('gm_assetitemdetail')[0].innerText = imageDef.detail;
    imageItem.getElementsByClassName('gm_assetitemname')[0].addEventListener('change', function() {
      gm.editor.unsavedModeAssets.images[imageOrder].id = imageItem.getElementsByClassName('gm_assetitemname')[0].value;
    });
    filterButton.addEventListener('click', function() {
      const image = gm.editor.unsavedModeAssets.images[imageOrder];

      if (image.useNearest) {
        image.useNearest = false;

        filterButton.classList.add('bilinear');
        filterButton.classList.remove('nearest');
        filterButton.title = 'Using bilinear';
      } else {
        image.useNearest = true;

        filterButton.classList.remove('bilinear');
        filterButton.classList.add('nearest');
        filterButton.title = 'Using nearest neighbour';
      }
    });
    wrapButton.addEventListener('click', function() {
      const image = gm.editor.unsavedModeAssets.images[imageOrder];

      if (image.useRepeat) {
        image.useRepeat = false;

        wrapButton.classList.add('clamp');
        wrapButton.classList.remove('repeat');
        wrapButton.title = 'Clamped outside region';
      } else {
        image.useRepeat = true;

        wrapButton.classList.remove('clamp');
        wrapButton.classList.add('repeat');
        wrapButton.title = 'Repeated outside region';
      }
    });
    imageItem.getElementsByClassName('gmeditor_delete')[0].addEventListener('click', function() {
      gm.editor.unsavedModeAssets.images[imageOrder] = null;
      document.getElementById('gmsettings_assetlist').removeChild(imageItem);
    });
    imageItem.getElementsByClassName('gmeditor_download')[0].addEventListener('click', function() {
      saveAs('data:image/' + imageDef.extension + ';base64,' + imageDef.data, imageItem.getElementsByClassName('gm_assetitemname')[0].value + '.' + imageDef.extension);
    });

    window.BonkUtils.setButtonSounds([
      filterButton,
      imageItem.getElementsByClassName('gmeditor_delete')[0],
      imageItem.getElementsByClassName('gmeditor_download')[0],
    ]);

    document.getElementById('gmsettings_assetlist').appendChild(imageItem);
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
      return prettier.format(code, {parser: 'babel', plugins: [prettierBabel], bracketSpacing: false, printWidth: 100});
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
