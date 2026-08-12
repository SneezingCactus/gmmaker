import type { BonkGameState } from '../../../../simulation/declarations/BonkGameState';
import type Game from '../../Game';
import WorldArrow from './WorldArrow';
import WorldCapZone from './WorldCapZone';
import WorldDisc from './WorldDisc';
import WorldJoint from './WorldJoint';
import WorldPlatform from './WorldPlatform';
import WorldRound from './WorldRound';
import WorldSettings from './WorldSettings';
import WorldShape from './WorldShape';

export default class GameWorld {
  public game: Game;

  public discs: Partial<WorldDisc[]> = [];
  public arrows: Partial<WorldArrow[]> = [];

  public platformRenderOrder: number[] = [];
  public platforms: Partial<WorldPlatform[]> = [];
  public shapes: Partial<WorldShape[]> = [];

  public joints: Partial<WorldJoint[]> = [];
  public capZones: Partial<WorldCapZone[]> = [];

  public round: WorldRound = WorldRound.getDefault();
  public settings: WorldSettings = WorldSettings.getDefault();

  constructor(game: Game) {
    this.game = game;
  }

  /**
   * @internal
   */
  public serialize(bonkState: BonkGameState) {
    WorldDisc.serialize(this.game, bonkState);
    WorldArrow.serialize(this.game, bonkState);

    WorldPlatform.serialize(this.game, bonkState);
    WorldShape.serialize(this.game, bonkState);
    WorldJoint.serialize(this.game, bonkState);
    WorldCapZone.serialize(this.game, bonkState);

    WorldRound.serialize(this.game, bonkState);
    WorldSettings.serialize(this.game, bonkState);

    bonkState.physics.bro = this.platformRenderOrder;
  }

  /**
   * @internal
   */
  public deserialize(bonkState: BonkGameState) {
    WorldDisc.deserialize(bonkState, this.game);
    WorldArrow.deserialize(bonkState, this.game);

    WorldPlatform.deserialize(bonkState, this.game);
    WorldShape.deserialize(bonkState, this.game);
    WorldJoint.deserialize(bonkState, this.game);
    WorldCapZone.deserialize(bonkState, this.game);

    WorldRound.deserialize(bonkState, this.game);
    WorldSettings.deserialize(bonkState, this.game);

    this.platformRenderOrder = [...bonkState.physics.bro];
  }
}
