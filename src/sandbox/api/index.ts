import Game from './Game';
import type { ExtraMath } from './math';
import type { APIVector } from './vector';

export { APIVector };
export { ExtraMath, Game };

declare global {
  interface Math extends ExtraMath {}
  const game: Game;
  const Vector: APIVector;
}
