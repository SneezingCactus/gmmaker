/* eslint-disable no-invalid-this */
/* eslint-disable camelcase */
/* eslint-disable new-cap */

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

export default {
  init: function() {
    this.initGMEditor();
    this.resetModeSettings();
  },
  configApply: function(config) {
    this.monacoWs._themeService.setTheme(
      config.editor.darkWorkspace ? 'vs-dark' : 'vs');
    this.monacoWs.updateOptions({
      wordWrap: config.editor.wordWrap ? 'on' : 'off',
      fontSize: config.editor.fontSize,
      minimap: {
        enabled: config.editor.showMinimap,
      },
    });
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
      'gmeditor_newbutton', 'gmeditor_importbutton', 'gmeditor_exportbutton', 'gmeditor_savebutton', 'gmeditor_closebutton', 'gmeditor_settingsbutton', 'gmeditor_backupsbutton',
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

    // init code editor
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

    gm.editor.monacoWs.getModel().onDidChangeContent(function(event) {
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
      const bounds = document.getElementById('gmworkspacearea').getBoundingClientRect();

      monacoDiv.style.top = bounds.top;
      monacoDiv.style.left = bounds.left;
      monacoDiv.style.width = bounds.width - 20;
      monacoDiv.style.height = bounds.height - 20;

      gm.editor.monacoWs.layout();
    }, false);
  },
  modeSettingsDefaults: [
    {name: 'modeName', type: 'string', default: 'Custom'},
    {name: 'modeDescription', type: 'string', default: 'Change your mode\'s description on the Game Mode Editor\'s Settings menu (gear icon).'},
    {name: 'baseMode', type: 'string', default: 'any'},
    {name: 'isTextMode', type: 'bool', default: true},
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

    const monacoDiv = document.getElementById('gmmonacodiv');
    const bounds = document.getElementById('gmworkspacearea').getBoundingClientRect();

    monacoDiv.style.display = 'block';
    monacoDiv.style.top = bounds.top;
    monacoDiv.style.left = bounds.left;
    monacoDiv.style.width = bounds.width - 20;
    monacoDiv.style.height = bounds.height - 20;

    gm.editor.monacoWs.layout();

    gm.editor.disableLobbyChatbox = true;
  },
  hideGMEWindow: function() {
    gm.editor.disableLobbyChatbox = false;

    document.getElementById('gmmonacodiv').style.display = 'none';
    document.getElementById('gmeditor').style.transform = 'scale(0)';
    document.getElementById('newbonklobby').style.transform = 'scale(1)';
  },
  genericDialog: function(message = '', callback = ()=>{}, options) {
    document.getElementById('gm_genericdialogcontainer').style.visibility = 'visible';

    document.getElementById('gmgeneric_message').innerHTML = message;
    document.getElementById('gmgeneric_promptcontainer').style.display = options.showInput ? 'block' : 'none';
    if (options.showInput) document.getElementById('gmgeneric_prompt').focus();
    document.getElementById('gmgeneric_prompt').value = options.inputValue;
    document.getElementById('gmgeneric_cancel').style.display = options.showCancel ? 'block' : 'none';

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

    gm.editor.monacoWs.setValue(gm.editor.modeToImport.content);

    document.getElementById('gm_importdialogwindowcontainer').style.visibility = 'hidden';
  },
  GMEImportMapYes: function() {
    const gameSettings = gm.lobby.mpSession.getGameSettings();

    gameSettings.map = MapEncoder.decodeFromDatabase(gm.editor.modeToImport.map);

    gm.lobby.bonkLobby.updateGameSettings(gameSettings);
    gm.lobby.networkEngine.sendMapAdd(gameSettings.map);

    gm.editor.modeAssets = gm.editor.modeToImport.assets;
    gm.editor.modeSettings = gm.editor.modeToImport.settings;

    gm.editor.monacoWs.setValue(gm.editor.modeToImport.content);

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

    exported.content = gm.editor.monacoWs.getValue();

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
          soundPlayerHowl?.unload();
          soundPlayerHowl = null;
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
            soundPlayerHowl?.unload();
            soundPlayerHowl = null;
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

            document.getElementById('gmsettings_assetlist').appendChild(imageItem);
          };
        }
      };
    };

    input.click();
  },
  GMESave: function() {
    if (gm.lobby.networkEngine.getLSID() !== gm.lobby.networkEngine.hostID) return;

    gm.state.resetSES();

    const saved = {};

    // generate events in host and save content and isEmpty into the mode
    try {
      gm.state.generateEvents(gm.editor.monacoWs.getValue());
    } catch (e) {
      let report = e.stack;

      if (report.includes('SyntaxError:')) {
        try {
          acorn.parse(gm.editor.monacoWs.getValue(), {ecmaVersion: 'latest'});
        } catch (syntaxError) {
          const location = /\(([0-9:]+)\)/.exec(syntaxError.stack)[1];
          report = report.replace(/at([^\n]+)(.|\n)*/gm, 'at <anonymous>:' + location);
        }
      } else {
        report = report.replace(/(at [^\(\n]+) \(eval at .{0,150}init[^\)]+[\)]+, <anonymous>(:[0-9]+:[0-9]+)\)/gm, '$1$2');
        report = report.replace(/Object\.eval([^\n]+)(.|\n)*/gm, '<anonymous>$1');
      }

      gm.editor.genericDialog('Whoops! Seems like something went wrong with your code. Below is the crash report, which may help you find out what happened.', ()=>{}, {
        showCode: true,
        code: report,
      });

      e.stack = '[GMMaker Error] ' + e.stack;

      throw (e);
    }

    const content = gm.editor.monacoWs.getValue();

    saved.content = content;
    saved.isEmpty = content == '';

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
};
