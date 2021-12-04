# Game Mode Maker

A [bonk.io](https://bonk.io/) mod that lets you create your own game modes using blocks.

This mod uses the [Google Blockly](https://developers.google.com/blockly) library.

## Installing

Download the latest game\_mode\_maker-(version).zip file from Releases, and then:

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

### It doesn't work!

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
