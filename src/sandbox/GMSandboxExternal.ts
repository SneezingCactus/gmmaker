import initSandboxString from '../../dist/init_sandbox.js?raw';
import type Game from './api/Game';
import type GMSandboxInternal from './GMSandboxInternal';

export default class GMSandboxExternal {
  protected frame: HTMLIFrameElement;
  protected internal: GMSandboxInternal;

  constructor() {
    this.frame = document.createElement('iframe');
    this.frame.id = 'gm-sandbox-frame';
    document.head.appendChild(this.frame);

    (this.frame.contentWindow as any).eval(initSandboxString);
    this.internal = (this.frame.contentWindow as any).initSandbox();
  }

  getGame(): Game {
    return this.internal.getGame();
  }
}
