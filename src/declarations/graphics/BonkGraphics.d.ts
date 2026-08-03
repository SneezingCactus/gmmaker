import type * as PIXI from 'pixi.js';

export declare class BonkGraphics {
  public renderer: PIXI.Renderer;
  public stage: PIXI.Container;

  constructor(domContainer: HTMLElement, isReplay: boolean);
  render(stateA: BonkGameState, stateB: BonkGameState, weight: number, idk1: any, idk2: any, idk3: any);
}
