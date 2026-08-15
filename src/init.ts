import pkg from '../package.json';
import type { BonkGraphics } from './graphics/declarations/BonkGraphics';
import { initGraphics } from './graphics/GMGraphics';
import GMSandboxExternal from './sandbox/GMSandboxExternal';
import type { BonkSimulation } from './simulation/declarations/BonkSimulation';
import { initSimulation } from './simulation/GMSimulation';
import { log } from './utils/logging';
import GMEditor from './editor/GMEditor';
import type { Box2D } from './simulation/declarations/Box2D';

interface Mod {
  objectHooks: {
    Box2D: Box2D;

    BonkSimulation: typeof BonkSimulation;
    BonkGraphics: typeof BonkGraphics;

    hookBonkGraphics: (derived: typeof BonkGraphics) => void;
    hookBonkSimulation: (derived: typeof BonkSimulation) => void;
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
  // simulation: GMSimulation;
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
  mod.editor = new GMEditor();
}

mod.init = init;
