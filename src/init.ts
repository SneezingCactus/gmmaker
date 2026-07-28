import pkg from '../package.json';
import GMSandboxExternal from './sandbox/GMSandboxExternal';
import { log } from './utils/logging';

interface Mod {
  functionHooks: object;
  replaceHooks: {
    readonly gameLength: number;
    readonly rollbacking: boolean;

    forceInputRegister: boolean;
    disableDeathBarrier: boolean;
    multToStereo: number | null;
    addToStereo: number | null;

    endStep: () => void;
    endRound: () => void;
  };

  sandbox: GMSandboxExternal;

  init: () => void;
}

export const mod: Mod = (window as any)[pkg.name];

function init() {
  log('Hello from init!');

  mod.sandbox = new GMSandboxExternal();
}

mod.init = init;
