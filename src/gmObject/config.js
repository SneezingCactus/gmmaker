/* eslint-disable require-jsdoc */
export default {
  init: function() {
    let saved = window.localStorage.gmlConfig;
    saved = saved ? JSON.parse(saved) : {};

    this.saved = saved;

    this.menu = document.getElementById('gm_prefswindowcontainer');
    this.menuList = this.menu.getElementsByClassName('gm_dialoglist')[0];

    for (const category of this.rules) {
      const categoryHeader = document.createElement('div');
      categoryHeader.classList.add('gm_listheader');
      categoryHeader.innerText = category.name;
      this.menuList.appendChild(categoryHeader);

      saved[category.key] ??= {};

      this.createCategory(category, saved);
    }

    document.getElementById('gmprefs_cancel').addEventListener('click', this.hideMenu);
    document.getElementById('gmprefs_save').addEventListener('click', this.save);

    const openButton = document.createElement('div');
    openButton.id = 'pretty_top_gmmaker';
    openButton.classList.add('pretty_top_button', 'niceborderbottom', 'niceborderleft', 'niceborderright');
    openButton.addEventListener('click', this.showMenu);
    openButton.style.visibility = 'hidden';
    document.getElementById('pretty_top_bar').appendChild(openButton);

    const bonkSettingsButton = document.getElementById('pretty_top_settings');

    // it can't get chazzier than this... can it?
    let mouseOverGm = false;
    let mouseOverBonk = false;

    function updateOpenButtonVisibility() {
      openButton.style.visibility = mouseOverGm || mouseOverBonk ? 'visible' : 'hidden';
    }

    openButton.addEventListener('mouseover', function() {
      mouseOverGm = true;
      updateOpenButtonVisibility();
    });
    openButton.addEventListener('mouseout', function() {
      mouseOverGm = false;
      updateOpenButtonVisibility();
    });

    bonkSettingsButton.addEventListener('mouseover', function() {
      mouseOverBonk = true;
      updateOpenButtonVisibility();
    });
    bonkSettingsButton.addEventListener('mouseout', function() {
      mouseOverBonk = false;
      updateOpenButtonVisibility();
    });

    window.BonkUtils.setButtonSounds([
      openButton,
      document.getElementById('gmprefs_cancel'),
      document.getElementById('gmprefs_save'),
    ]);

    gm.config.apply();
  },
  // aaa so much nesting
  createCategory: function(category, config) {
    for (const option of category.content) {
      config[category.key][option.key] ??= option.default;

      switch (option.type) {
        case 'boolean':
          new BooleanOption(
              option.text,
              config[category.key][option.key],
              this.menuList,
              option.key,
              category.key,
          );
          break;
        case 'number':
          new NumberOption(
              option.text,
              config[category.key][option.key],
              this.menuList,
              option.key,
              category.key,
          );
          break;
      }
    }
  },
  showMenu: function() {
    gm.config.menu.style.visibility = 'visible';
    gm.config.unsaved = JSON.parse(JSON.stringify(gm.config.saved));
  },
  hideMenu: function() {
    gm.config.menu.style.visibility = 'hidden';
  },
  save: function() {
    gm.config.saved = gm.config.unsaved;
    gm.config.unsaved = null;
    window.localStorage.gmlConfig = JSON.stringify(gm.config.saved);
    gm.config.hideMenu();
    gm.config.apply();
  },
  apply: function() {
    // eslint-disable-next-line guard-for-in
    for (const key in gm) {
      if (gm[key].configApply) gm[key].configApply(this.saved);
    }
  },
  saved: null,
  unsaved: null,
  rules: [
    {key: 'editor', name: 'Editor', content: [
      {type: 'boolean', key: 'darkWorkspace', text: 'Dark workspace (meant for use alongside Bonk Themes)', default: false},
      {type: 'boolean', key: 'showGrid', text: 'Show grid', default: false},
    ]},
    {key: 'misc', name: 'Misc', content: [
      {type: 'boolean', key: 'showSplash', text: 'Show splash screen', default: true},
    ]},
  ],
};

class BooleanOption {
  constructor(name, value, addTo, valueToModify, valueLocation) {
    this.element = document.createElement('div');
    this.element.classList.add('gm_listitem', 'small');
    addTo.appendChild(this.element);

    const nameEl = document.createElement('span');
    nameEl.classList.add('gm_listitemlabel');
    nameEl.innerText = name;
    this.element.appendChild(nameEl);

    this.inputEl = document.createElement('input');
    this.inputEl.type = 'checkbox';
    this.inputEl.classList.add('gm_listiteminput');
    this.inputEl.checked = value;
    this.element.appendChild(this.inputEl);

    const theThis = this;
    this.inputEl.addEventListener('change', function() {
      gm.config.unsaved[valueLocation][valueToModify] = theThis.inputEl.checked;
    });
  }
}

class NumberOption {
  constructor(name, value, addTo, valueToModify, valueLocation) {
    this.element = document.createElement('div');
    this.element.classList.add('gm_listitem', 'small');
    addTo.appendChild(this.element);

    const nameEl = document.createElement('span');
    nameEl.classList.add('gm_listitemlabel');
    nameEl.innerText = name;
    this.element.appendChild(nameEl);

    this.inputEl = document.createElement('input');
    this.inputEl.type = 'number';
    this.inputEl.classList.add('gm_listiteminput');
    this.inputEl.value = value;
    this.element.appendChild(this.inputEl);

    const theThis = this;
    this.inputEl.addEventListener('change', function() {
      gm.config.unsaved[valueLocation][valueToModify] = Number.parseFloat(theThis.inputEl.value);
    });
  }
}
