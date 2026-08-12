import Game from './api/Game';
import defineApiMath from './api/math';
import defineApiVector from './api/vector';
import type GMSandboxExternal from './GMSandboxExternal';

export default class GMSandboxInternal {
  protected game: Game = new Game();
  protected compartment: Compartment;

  constructor(_external: GMSandboxExternal) {
    this.compartment = new Compartment({
      Math: defineApiMath(),
      Vector: defineApiVector(),
      game: this.game,
    });
  }

  getGame(): Game {
    return this.game;
  }
}
