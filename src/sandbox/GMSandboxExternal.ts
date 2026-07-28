import initSandboxString from '../../dist-sandbox/init_sandbox.js?raw';
import type GMSandboxInternal from './GMSandboxInternal';

export default class GMSandboxExternal {
  frame: HTMLIFrameElement;
  internal: GMSandboxInternal;

  constructor() {
    this.frame = document.createElement('iframe');
    this.frame.id = 'gm-sandbox-frame';
    document.head.appendChild(this.frame);

    (this.frame.contentWindow as any).eval(initSandboxString);
    this.internal = (this.frame.contentWindow as any).sandboxInternal;
  }
}
