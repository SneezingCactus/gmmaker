import GameWorld from './game/world/GameWorld';

export default class Game {
  public world: GameWorld = new GameWorld(this);
}
