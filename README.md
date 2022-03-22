# Game Mode Maker

A [bonk.io](https://bonk.io/) mod that lets you create your own game modes using blocks.

This mod uses the [Google Blockly](https://developers.google.com/blockly) library.

[Wiki (Unfinished)](https://github.com/SneezingCactus/gmmaker/wiki)

[Game Mode Maker's Discord server](https://discord.gg/dnBM3N6H8a)
[Bonk.io Modding Discord server](https://discord.gg/PHtG6qN3qj)

## Installing as a userscript

Userscripts require a userscript manager such as Violentmonkey or Tampermonkey,
and [Excigma's code injector userscript](https://greasyfork.org/en/scripts/433861-code-injector-bonk-io).

The userscript is available in [Releases](https://github.com/SneezingCactus/gmmaker/releases)
as gmmaker-(version)**_.user.js_**.

## Installing as an extension
**The extension version of gmmaker on Chrome will stop working on June 2023. It is recommended you use the userscript version instead.**

Download the latest game-mode-maker-(version)**_.zip_** file from
[Releases](https://github.com/SneezingCactus/gmmaker/releases).

<details>
<summary>In Firefox</summary>

**Note:** You will have to do this after every time you restart the browser.

1. Go to `about:debugging#/runtime/this-firefox`
2. Click `Load temporary addon` and open the zip file.

</details>

<details>
<summary>In Chrome (and other Chromium-based browsers, hopefully)</summary>

1. Go to `chrome://extensions/`
2. Enable `Developer mode` in the top-right corner of the page.
3. Drag and drop the zip file into the page.

</details>

### "It doesn't work!"

Did you:

- Disable any extensions that are incompatible with Game Mode Maker, such as
  Bonk Leagues Client,
- Refresh Bonk.io after installing,
- and download the correct file from Releases?

It is also possible that a recent bonk.io update broke the extension and it
needs to be fixed.

---

## Building

**Ignore this if you just want to download the extension.**


1. Install [Node.js](https://nodejs.org/) (v16.3.0)
2. Run `npm ci` to install npm dependecies.
4. Run `npm run build`.
5. Either:
   - Run `npm run test` to open a temporary browser session with the extension.
   - Run `npm run build-extension` to build the zip file.
     The file will be in `web-ext-artifacts`.
