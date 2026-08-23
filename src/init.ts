import pkg from '../package.json';
import type { BonkGraphics } from './graphics/declarations/BonkGraphics';
import { initGraphics } from './graphics/GMGraphics';
import GMSandboxExternal from './sandbox/GMSandboxExternal';
import type { BonkSimulation } from './simulation/declarations/BonkSimulation';
import { initSimulation } from './simulation/GMSimulation';
import { log } from './utils/logging';
import GMEditor from './editor/GMEditor';
import type { Box2D } from './simulation/declarations/Box2D';
import type { BonkNetworkEngine } from './network/declarations/BonkNetworkEngine';
import type io from 'socket.io-client';
import GMNetwork from './network/GMNetwork';

interface Mod {
  objectHooks: {
    Box2D: Box2D;

    SocketIO: typeof io;
    BonkNetworkEngine: typeof BonkNetworkEngine;
    BonkSimulation: typeof BonkSimulation;
    BonkGraphics: typeof BonkGraphics;

    hookSocketIO: (derived: typeof io) => void;
    hookBonkNetworkEngine: (derived: typeof BonkNetworkEngine) => void;
    hookBonkSimulation: (derived: typeof BonkSimulation) => void;
    hookBonkGraphics: (derived: typeof BonkGraphics) => void;
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

  sandbox: GMSandboxExternal;
  network: GMNetwork;
  editor: GMEditor;

  init: () => void;
}

export const mod: Mod = (window as any)[pkg.name];

function init() {
  log('Hello from init!');

  initGraphics();
  initSimulation();

  // mod.simulation = new GMSimulation();
  mod.sandbox = new GMSandboxExternal();
  mod.network = new GMNetwork();
  mod.editor = new GMEditor();
}

mod.init = init;
