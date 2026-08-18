export class b2Vec2 {
  public x: number;
  public y: number;
}

export class b2World {
  protected m_gravity: b2Vec2;

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
    Math: {
      b2Vec2: typeof b2Vec2;
    };
  };
  Dynamics: {
    b2World: typeof b2World;
  };
}
