import type { BonkGameState } from '../../../../simulation/declarations/BonkGameState';
import type Game from '../../Game';
import type { Vector2d } from '../../vector';

enum WorldShapeType {
  Rectangle = 'rectangle',
  Circle = 'circle',
  Polygon = 'polygon',
}

interface WorldShapeRectangle extends WorldShapeBase {
  type: WorldShapeType.Rectangle;

  position: Vector2d;
  angle: number;
  size: Vector2d;

  shrink: boolean;
  /**
   * If this shape can shrink (`shrink == true`), this number overrides the rectangle width and
   * decreases every frame accordingly.
   *
   * If the shape cannot shrink (`shrink == false`), this value is `null`.
   */
  activeShrinkScale: number | null;
}

interface WorldShapeCircle extends WorldShapeBase {
  type: WorldShapeType.Circle;

  position: Vector2d;
  radius: number;

  shrink: boolean;
  /**
   * If this shape can shrink (`shrink == true`), this number overrides the circle radius and
   * decreases every frame accordingly.
   *
   * If the shape cannot shrink (`shrink == false`), this value is `null`.
   */
  activeShrinkScale: number | null;
}

interface WorldShapePolygon extends WorldShapeBase {
  type: WorldShapeType.Polygon;

  vertices: Vector2d[];

  appliedPosition: Vector2d;
  appliedScale: number;
}

interface WorldShapeBase {
  type: WorldShapeType;

  name: string;
  colour: number;

  bounciness: number | null;
  density: number | null;
  friction: number | null;

  fricPlayers: boolean | null;

  death: boolean;
  noPhysics: boolean;
  noGrapple: boolean;
  innerGrapple: boolean;
}

export type WorldShape = WorldShapeRectangle | WorldShapeCircle | WorldShapePolygon;

export namespace WorldShape {
  /**
   * @internal
   */
  export function getDefault(): WorldShape {
    return {
      type: WorldShapeType.Circle,

      position: [0, 0],
      radius: 1.0,

      shrink: false,
      activeShrinkScale: null,

      name: 'GMMaker Shape',
      colour: 0xFF0000,

      bounciness: null,
      density: null,
      friction: null,

      fricPlayers: false,

      death: false,
      noPhysics: false,
      noGrapple: false,
      innerGrapple: false,
    };
  }

  /**
   * Serialize all Game shapes into the bonk state, as fixtures and shapes.
   *
   * @internal
   */
  export function serialize(game: Game, bonkState: BonkGameState) {
    // fixtures and shapes are completely recreated every time as they are not cloned by bonk itself
    bonkState.physics.fixtures = [];
    bonkState.physics.shapes = [];

    for (let i = 0; i < game.world.shapes.length; i++) {
      const gmShape = game.world.shapes[i];

      if (!gmShape)
        continue;

      bonkState.physics.fixtures[i] = {
        sh: i,
        n: gmShape.name,
        f: gmShape.colour,

        re: gmShape.bounciness,
        de: gmShape.density,
        fr: gmShape.friction,
        fp: gmShape.fricPlayers,

        d: gmShape.death,
        np: gmShape.noPhysics,
        ng: gmShape.noGrapple,
        ig: gmShape.innerGrapple,
      };

      switch (gmShape.type) {
        case WorldShapeType.Rectangle:
          bonkState.physics.shapes[i] = {
            type: 'bx',

            c: [gmShape.position[0], gmShape.position[1]],
            a: gmShape.angle,
            w: gmShape.size[0],
            h: gmShape.size[1],
            sk: gmShape.shrink,
          };
          break;
        case WorldShapeType.Circle:
          bonkState.physics.shapes[i] = {
            type: 'ci',

            c: [gmShape.position[0], gmShape.position[1]],
            r: gmShape.radius,
            sk: gmShape.shrink,
          };
          break;
        case WorldShapeType.Polygon:
          bonkState.physics.shapes[i] = {
            type: 'po',

            v: gmShape.vertices,
          };
          break;
      }
    }
  }

  /**
   * Deserialize all bonk state fixtures and shapes into the Game object, as shapes.
   *
   * @internal
   */
  export function deserialize(bonkState: BonkGameState, game: Game) {
    const maxLength = Math.max(bonkState.physics.fixtures.length, game.world.shapes.length);

    for (let i = 0; i < maxLength; i++) {
      let gmShape: Partial<WorldShape> | undefined = game.world.shapes[i];
      const bonkFixture = bonkState.physics.fixtures[i];
      const bonkShape = bonkState.physics.shapes[i]!;

      if (!bonkFixture && !gmShape)
        continue;

      // this is here for consistency's sake, but it's extremely unlikely for this to happen
      // as bonk does not remove fixtures nor shapes as of the time of writing
      if (!bonkFixture) {
        delete game.world.shapes[i];
        continue;
      }

      if (!gmShape) {
        gmShape = {};
        game.world.shapes[i] = gmShape as WorldShape;
      }

      gmShape.name = bonkFixture.n;
      gmShape.colour = bonkFixture.f;

      gmShape.bounciness = bonkFixture.re;
      gmShape.density = bonkFixture.de;
      gmShape.friction = bonkFixture.fr;
      gmShape.fricPlayers = bonkFixture.fp;

      gmShape.death = bonkFixture.d;
      gmShape.noPhysics = bonkFixture.np;
      gmShape.noGrapple = bonkFixture.ng;
      gmShape.innerGrapple = bonkFixture.ig;

      // shapes are completely recreated every time as they are not cloned by bonk itself
      switch (bonkShape.type) {
        case 'bx': {
          gmShape.type = WorldShapeType.Rectangle;
          const shapeAsRect = gmShape as WorldShapeRectangle;

          shapeAsRect.position = [bonkShape.c[0], bonkShape.c[1]];
          shapeAsRect.angle = bonkShape.a;
          shapeAsRect.size = [bonkShape.w, bonkShape.h];
          shapeAsRect.shrink = bonkShape.sk;
          break;
        }
        case 'ci': {
          gmShape.type = WorldShapeType.Circle;
          const shapeAsCircle = gmShape as WorldShapeCircle;

          shapeAsCircle.position = [bonkShape.c[0], bonkShape.c[1]];
          shapeAsCircle.radius = bonkShape.r;
          shapeAsCircle.shrink = bonkShape.sk;
          break;
        }
        case 'po': {
          gmShape.type = WorldShapeType.Polygon;
          const shapeAsPolygon = gmShape as WorldShapePolygon;

          shapeAsPolygon.vertices = [...(bonkShape.v.map(vertex => [vertex[0], vertex[1]]) as Vector2d[])];
          break;
        }
      }
    }
  }
}

export default WorldShape;
