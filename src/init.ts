import type { Socket } from 'socket.io-client';
import pkg from '../package.json';
import { log } from './utils/logging';

interface Mod {
  functions: {
    io: () => Socket;
  };
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

  init: () => void;
}

export const mod: Mod = (window as any)[pkg.name];

function init() {
  log('Hello from init!');
}

mod.init = init;
