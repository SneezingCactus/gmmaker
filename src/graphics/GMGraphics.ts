import { mod } from '../init';
import type { BonkGameState } from '../simulation/declarations/BonkGameState';

export function initGraphics() {
  class GMGraphics extends mod.objectHooks.BonkGraphics {
    constructor(domContainer: HTMLElement, isReplay: boolean) {
      super(domContainer, isReplay);
    }

    render(stateA: BonkGameState, stateB: BonkGameState, weight: number, idk1: any, idk2: any, idk3: any) {
      super.render(stateA, stateB, weight, idk1, idk2, idk3);

      this.renderer.render(this.stage);
    }
  }

  mod.objectHooks.hookBonkGraphics(GMGraphics);
}
