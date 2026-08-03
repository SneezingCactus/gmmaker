import pkg from '../package.json';
import type { BonkGraphics } from './declarations/graphics/BonkGraphics';
import { initGraphics } from './graphics/GMGraphics';
import GMSandboxExternal from './sandbox/GMSandboxExternal';
import type { BonkSimulation } from './declarations/simulation/BonkSimulation';
import GMSimulation from './simulation/GMSimulation';
import { log } from './utils/logging';

interface Mod {
  objectHooks: {
    BonkSimulation: typeof BonkSimulation;
    BonkGraphics: typeof BonkGraphics;

    derivedBonkGraphics?: typeof BonkGraphics;
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
  simulation: GMSimulation;

  init: () => void;
}

export const mod: Mod = (window as any)[pkg.name];

function init() {
  log('Hello from init!');

  initGraphics();

  mod.simulation = new GMSimulation();
  mod.sandbox = new GMSandboxExternal();
}

mod.init = init;
