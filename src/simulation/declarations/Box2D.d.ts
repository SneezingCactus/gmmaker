export class b2World {
  Step(dt: number, velocityIterations: number, positionIterations: number): void;
}

export interface b2Settings {
  b2_maxTranslation: number;
  b2_maxTranslationSquared: number;
  b2_maxRotation: number;
  b2_maxRotationSquared: number;
}

export interface Box2D {
  Common: {
    b2Settings: b2Settings;
  };
  Dynamics: {
    b2World: typeof b2World;
  };
}
